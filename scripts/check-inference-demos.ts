import assert from 'node:assert/strict'
import {
  memoryPreset,
  memoryEstimate,
  batchRoofline,
  cacheCosts,
  chipRoofline,
  type MemoryInput,
} from '../src/lib/inference-math'
import { chipSpecs, rooflineModels } from '../src/lib/chip-specs'
import { models, tierListModels } from '../src/lib/models'
import {
  landscapes,
  optimizerPath,
  optimizerStep,
  initialState,
  VALLEY_CURVATURE,
  rotatePair,
  quantizeVector,
  normalNoise,
  noisySample,
  maskCandidates,
  unmaskStep,
  polyTrainSet,
  polyValidationSet,
  fitPolynomial,
  msePoly,
  predictPoly,
  worldRollout,
} from '../src/lib/learning-math'

const close = (actual: number, expected: number, tolerance = 1e-10) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`)
const input: MemoryInput = {
  paramsB: 7,
  bits: 4,
  quantOverhead: 1.15,
  layers: 32,
  kvHeads: 8,
  headDim: 128,
  tokens: 8192,
  batch: 1,
  kvBytes: 2,
  reserveGiB: 1,
}
const estimate = memoryEstimate(input)
close(estimate.weights, 4_025_000_000, 1e-5)
assert.equal(estimate.kv, 1_073_741_824)
close(estimate.total!, 6_172_483_648, 1e-5)
assert.equal(memoryEstimate({ ...input, kvHeads: 32 }).kv, estimate.kv! * 4)
assert.equal(memoryEstimate({ ...input, batch: 3 }).kv, estimate.kv! * 3)
assert.equal(memoryEstimate({ ...input, headDim: null }).total, null)

const miniMax = models.find((model) => model.id === 'minimax-m27')!
const kimi = models.find((model) => model.id === 'kimi-k26')!
const maverick = models.find((model) => model.id === 'llama-maverick')!
const freshMiniMax = { ...input, ...memoryPreset(miniMax) }
const revisitedMiniMax = {
  ...input,
  ...memoryPreset(maverick),
  ...memoryPreset(kimi),
  ...memoryPreset(miniMax),
}
assert.deepEqual(
  revisitedMiniMax,
  freshMiniMax,
  'preset selection must not leak previous architecture fields',
)
assert.equal(memoryEstimate(freshMiniMax).kv, null)
assert.equal(memoryEstimate(freshMiniMax).total, null)
assert.equal(
  memoryPreset(kimi).layers,
  null,
  'unsupported attention must not use the dense KV formula',
)
assert.equal(
  memoryEstimate({ ...input, ...memoryPreset(maverick), quantOverhead: 1 })
    .weights,
  200_000_000_000,
  'all MoE experts require stored weights',
)

const batch256 = batchRoofline(256, 512, 80)
assert.ok(
  batch256.computeMs > batch256.memoryMs,
  'batching can cross into a compute bottleneck',
)
assert.ok(
  batchRoofline(512, 512, 80).fits,
  '512 is not a universal collapse threshold',
)
assert.ok(batchRoofline(1024, 512, 80).fits)
assert.ok(
  !batchRoofline(1024, 1024, 80).fits,
  'context, capacity and batch jointly determine the memory limit',
)
assert.ok(batchRoofline(1, 8192, 80).total < batchRoofline(1, 512, 80).total)
close(batch256.total, batch256.perUser * 256)

const tariff = {
  tokens: 10000,
  prefixFraction: 0.8,
  requests: 100,
  reuse: 10,
  price: 3,
  write: 1.25,
  read: 0.1,
}
const cached = cacheCosts(tariff)
assert.deepEqual([cached.writes, cached.reads], [10, 90])
close(cached.baseline, 3)
close(cached.cached, 1.116)
assert.ok(
  cacheCosts({ ...tariff, reuse: 1 }).savings < 0,
  'cold writes can cost more than uncached input',
)
assert.deepEqual(
  [
    cacheCosts({ ...tariff, requests: 101 }).writes,
    cacheCosts({ ...tariff, requests: 101 }).reads,
  ],
  [11, 90],
)
close(cacheCosts({ ...tariff, prefixFraction: 0 }).savings, 0)

const vector = [0.8, -0.3, 0.5, -0.7]
const norm = (values: number[]) => Math.hypot(...values)
const rotated = rotatePair(vector, Math.PI / 6)
close(norm(rotated), norm(vector))
rotatePair(rotated, -Math.PI / 6).forEach((value, i) => close(value, vector[i]))
assert.equal(
  quantizeVector(rotated, 4).storageBits,
  48,
  'four 4-bit codes plus one FP32 scale',
)
assert.ok(quantizeVector(rotated, 4).mse > 0, 'quantization is not lossless')
assert.ok(quantizeVector(rotated, 8).mse < quantizeVector(rotated, 2).mse)
// Optimizer comparison: plain GD on L = ½(x² + 25y²) is stable only for η < 2/25.
const valley = landscapes.valley
const finalLoss = (id: 'gd' | 'momentum' | 'adam', eta: number, steps = 150) => {
  const path = optimizerPath(id, valley, eta, steps)
  return valley.loss(path[path.length - 1])
}
assert.ok(2 / VALLEY_CURVATURE === 0.08)
assert.ok(finalLoss('gd', 0.07) < 1e-6, 'GD converges below 2/curvature')
assert.ok(
  !Number.isFinite(finalLoss('gd', 0.09)) || finalLoss('gd', 0.09) > 1e6,
  'GD diverges above 2/curvature',
)
assert.ok(finalLoss('momentum', 0.09) < 1e-3, 'momentum is stable up to 2(1+β)/curvature')
// Rotation invariance: GD and momentum produce the same losses on the rotated valley.
for (const id of ['gd', 'momentum'] as const) {
  const a = optimizerPath(id, valley, 0.07, 40),
    b = optimizerPath(id, landscapes.rotatedValley, 0.07, 40)
  a.forEach((p, i) => close(valley.loss(p), landscapes.rotatedValley.loss(b[i]), 1e-9))
}
// Gradient check for every landscape (central differences).
for (const land of Object.values(landscapes)) {
  const p: [number, number] = [0.37, -0.81],
    h = 1e-6
  const g = land.grad(p)
  close(g[0], (land.loss([p[0] + h, p[1]]) - land.loss([p[0] - h, p[1]])) / (2 * h), 1e-6)
  close(g[1], (land.loss([p[0], p[1] + h]) - land.loss([p[0], p[1] - h])) / (2 * h), 1e-6)
}
// Adam's bias-corrected first step has size η per coordinate, independent of gradient scale.
const adamFirst = optimizerStep('adam', valley, initialState(valley.start), 0.05)
close(Math.abs(adamFirst.p[0] - valley.start[0]), 0.05, 1e-6)
close(Math.abs(adamFirst.p[1] - valley.start[1]), 0.05, 1e-6)
// Saddle: plain GD lingers near the saddle value 0 before reaching a minimum at −0.25.
const saddlePath = optimizerPath('gd', landscapes.saddle, 0.02, 150)
assert.ok(Math.abs(landscapes.saddle.loss(saddlePath[60])) < 0.5)
assert.ok(landscapes.saddle.loss(saddlePath[60]) > -0.2, 'GD still near the saddle')
const momentumSaddle = optimizerPath('momentum', landscapes.saddle, 0.02, 150)
assert.ok(landscapes.saddle.loss(momentumSaddle[60]) < -0.24, 'momentum leaves the saddle faster')

// Polynomial fit: capacity vs. generalization.
close(predictPoly([1, 2, 3], 2), 17)
const interpolating = fitPolynomial(polyTrainSet, 9, 0)
assert.ok(msePoly(polyTrainSet, interpolating) < 1e-12, 'degree 9 interpolates 10 points')
const valByDegree = Array.from({ length: 10 }, (_, d) =>
  msePoly(polyValidationSet, fitPolynomial(polyTrainSet, d, 0)),
)
const bestDegree = valByDegree.indexOf(Math.min(...valByDegree))
assert.ok(bestDegree >= 3 && bestDegree <= 6, `best degree ${bestDegree}`)
assert.ok(valByDegree[9] > 10 * valByDegree[bestDegree], 'degree 9 overfits')
assert.ok(valByDegree[1] > 2 * valByDegree[bestDegree], 'degree 1 underfits')
const ridge = fitPolynomial(polyTrainSet, 9, 1e-3)
assert.ok(msePoly(polyValidationSet, ridge) < valByDegree[9] / 10, 'L2 tames degree 9')
assert.ok(msePoly(polyTrainSet, ridge) > msePoly(polyTrainSet, interpolating))
const norm2 = (w: number[]) => w.slice(1).reduce((s, v) => s + v * v, 0)
assert.ok(norm2(ridge) < norm2(interpolating) / 100, 'L2 shrinks the weights')
// Ridge solution satisfies its normal equation: gradient of the penalised loss is zero.
for (let k = 1; k <= 9; k++) {
  const dk =
    polyTrainSet.reduce((s, p) => s + 2 * (predictPoly(ridge, p.x) - p.y) * p.x ** k, 0) /
      polyTrainSet.length +
    2 * 1e-3 * ridge[k]
  close(dk, 0, 1e-8)
}

assert.equal(noisySample(2, -0.7, 1), 2)
assert.equal(noisySample(2, -0.7, 0), -0.7)
close(noisySample(2, -0.7, 0.5), Math.sqrt(0.5) * (2 - 0.7))
const noiseA = normalNoise(42),
  noiseB = normalNoise(42)
for (let i = 0; i < 50; i++) assert.equal(noiseA(), noiseB())
const noise = normalNoise(7),
  samples = Array.from({ length: 20000 }, noise)
assert.ok(
  Math.abs(samples.reduce((sum, value) => sum + value, 0) / samples.length) <
    0.03,
)
assert.ok(
  Math.abs(
    samples.reduce((sum, value) => sum + value * value, 0) / samples.length - 1,
  ) < 0.04,
)

let visible = Array<boolean>(10).fill(false)
assert.deepEqual(
  maskCandidates(visible, 8)
    .slice(0, 2)
    .map((item) => item.index),
  [0, 4],
)
visible = unmaskStep(visible, 8)
assert.deepEqual(
  visible.flatMap((value, index) => (value ? [index] : [])),
  [0, 4],
)
assert.equal(
  maskCandidates(visible, 8)[0].index,
  3,
  'visible neighbors affect the next supplied confidence',
)
for (let i = 0; i < 3; i++) visible = unmaskStep(visible, 8)
assert.deepEqual(
  visible,
  [true, true, true, true, true, true, true, true, false, false],
  'PAD never becomes a candidate',
)

const exactWorld = worldRollout(2, 0.5, 0.5, 10)
exactWorld.forEach((point) => assert.equal(point.actual, point.predicted))
const end10 = worldRollout(2, 0.5, 0.4, 10).at(-1)!
const end20 = worldRollout(2, 0.5, 0.4, 20).at(-1)!
close(Math.abs(end10.actual - end10.predicted), 5)
close(Math.abs(end20.actual - end20.predicted), 20)

assert.deepEqual(
  tierListModels.map((model) => [model.id, model.tier]),
  [
    ['fable-5', 'S+'],
    ['gpt-56-sol', 'A'],
    ['kimi-k3', 'B'],
    ['gpt-56-luna', 'B'],
    ['deepseek-v4-flash', 'B'],
    ['grok-46', 'C'],
    ['muse-spark-12', 'C'],
    ['opus-5', 'D'],
    ['composer-25', 'D'],
    ['glm-53', 'D'],
    ['gpt-56-terra', 'D'],
    ['sonnet-5', 'D'],
    ['deepseek-v4-pro', 'F'],
    ['gemini-37-flash', 'Google'],
    ['gemini-31-pro', 'Google'],
  ],
  'the owner’s subjective ranks and Google category must remain intact',
)

// Chip roofline (custom-chips page)
const h100 = chipSpecs.find((chip) => chip.id === 'h100')!
const llama70 = rooflineModels.find((model) => model.id === '70b')!
const rooflineBase = {
  ...llama70,
  bytesPerValue: 1,
  batch: 1,
  context: 4096,
  phase: 'decode' as const,
  bandwidthTBs: h100.bandwidthTBs,
  peakTFLOPS: h100.fp8DenseTF!,
  capacityGB: h100.memoryGB,
}
const single = chipRoofline(rooflineBase)
assert.equal(single.bound, 'memory', 'batch-1 decode is memory-bound')
assert.equal(single.chips, 1)
assert.ok(single.intensity > 1.9 && single.intensity < 2.5, 'FP8 decode ≈ 2 FLOP/byte')
close(single.memoryMs, (single.bytes / 3.35e12) * 1000)
close(single.ridge, 1979 / 3.35)
close(single.weightOnlyCriticalBatch, single.ridge / 2)
close(
  chipRoofline({ ...rooflineBase, bandwidthTBs: 6.7 }).memoryMs,
  single.memoryMs / 2,
  1e-9,
)
const prefill = chipRoofline({ ...rooflineBase, phase: 'prefill' })
assert.equal(prefill.bound, 'compute', 'a 4k-token prefill is compute-bound')
assert.ok(prefill.intensity > single.ridge)
const bigBatch = chipRoofline({ ...rooflineBase, batch: 512, context: 512 })
assert.ok(bigBatch.chips > 1, 'KV cache of 512 sequences exceeds one H100')
assert.ok(bigBatch.intensity > single.intensity * 50)
const longContext = chipRoofline({ ...rooflineBase, batch: 64, context: 32768 })
assert.ok(
  longContext.intensity < bigBatch.intensity,
  'long contexts add KV bytes that batching does not amortize',
)
const bf16 = chipRoofline({ ...rooflineBase, bytesPerValue: 2 })
close(bf16.bytes, single.bytes * 2, 1e-3)
assert.equal(bf16.chips, 2, '70B in BF16 (141 GB) needs two 80 GB chips')
close(bf16.memoryMs, single.memoryMs, 1e-9)
chipSpecs.forEach((chip) => {
  assert.ok(chip.sources.length > 0, `${chip.id} needs a vendor source`)
  if (chip.calculator) assert.ok(chip.fp8DenseTF && chip.bf16DenseTF)
})

console.log(
  'PASS: memory, preset history, GQA, MoE storage, batching, caching, rotation, quantization, gradient descent, fitted training, Gaussian noise, mask selection/PAD, world rollout and 15 subjective ranks.',
)
