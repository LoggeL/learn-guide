import assert from 'node:assert/strict'
import {
  memoryPreset,
  memoryEstimate,
  batchRoofline,
  cacheCosts,
  type MemoryInput,
} from '../src/lib/inference-math'
import {
  batchingQueue,
  batchingStatic,
  batchingContinuous,
  batchingOccupancy,
  chunkedPrefillTimeline,
} from '../src/lib/batching-math'
import { MEGA_KERNEL_LAYER, simulateMegaKernel } from '../src/lib/mega-kernel-math'
import { models, tierListModels } from '../src/lib/models'
import {
  gradient,
  descentStep,
  stationaryPoint,
  rotatePair,
  quantizeVector,
  normalNoise,
  noisySample,
  maskCandidates,
  unmaskStep,
  trainingSet,
  validationSet,
  mseLine,
  trainLine,
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

// Batching scheduler demos (batching-math.ts)
assert.deepEqual(batchingQueue(7, 12), batchingQueue(7, 12), 'request queue is seedable')
const queue = batchingQueue(1, 64)
const staticRuns = batchingStatic(queue, 4, 24)
const firstBatchEnd = Math.max(...staticRuns.slice(0, 4).map((r) => r.start + r.length))
assert.ok(
  staticRuns.some((r) => r.start === firstBatchEnd && r.id === 4),
  'static batching starts the next batch right after the longest request',
)
const staticOcc = batchingOccupancy(staticRuns, 4, 24)
const contOcc = batchingOccupancy(batchingContinuous(queue, 4, 24), 4, 24)
assert.equal(contOcc.share, 1, 'continuous batching keeps a saturated queue fully occupied')
assert.ok(staticOcc.share < 1 && contOcc.completed >= staticOcc.completed)
const prefillBase = { promptTokens: 2048, runningDecodes: 8, weightReadMs: 14, msPerToken: 0.14, tailSteps: 3 }
const unchunked = chunkedPrefillTimeline({ ...prefillBase, chunkBudget: null })
const chunked = chunkedPrefillTimeline({ ...prefillBase, chunkBudget: 256 })
close(unchunked.ttft, 2048 * 0.14, 1e-9)
assert.ok(chunked.worstGap < unchunked.worstGap / 5, 'chunking bounds the decode stall')
assert.ok(chunked.ttft > unchunked.ttft, 'chunking delays the first token of the new prompt')
assert.equal(
  chunked.steps.reduce((sum, s) => sum + s.prefillTokens, 0),
  2048,
  'every prompt token is prefilled exactly once',
)

// Megakernel timeline demo (mega-kernel-math.ts)
const mkKernels = simulateMegaKernel(MEGA_KERNEL_LAYER, 'kernels')
const mkGraph = simulateMegaKernel(MEGA_KERNEL_LAYER, 'graph')
const mkMega = simulateMegaKernel(MEGA_KERNEL_LAYER, 'megakernel')
assert.ok(mkMega.makespan < mkGraph.makespan && mkGraph.makespan < mkKernels.makespan)
assert.ok(mkMega.loadBusy > mkKernels.loadBusy && mkMega.loadBusy <= 1)
for (const tl of [mkKernels, mkGraph, mkMega]) {
  for (let op = 1; op < MEGA_KERNEL_LAYER.length; op++) {
    const prevDone = Math.max(...tl.segments.filter((s) => s.op === op - 1 && s.kind === 'compute').map((s) => s.end))
    assert.ok(
      tl.segments.filter((s) => s.op === op && s.kind === 'compute').every((s) => s.start >= prevDone),
      'math of an op never starts before the previous op has finished',
    )
  }
}

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
close(descentStep(1.8, 0.3), -3.1884)
assert.ok(
  descentStep(1.8, 0.3) < -2,
  'descent must not silently clamp to the chart',
)
close(gradient(stationaryPoint(-1.1)), 0)
close(gradient(stationaryPoint(0.9)), 0)

const initial: [number, number] = [-0.5, -0.3]
let fitted = initial,
  penalized = initial
for (let i = 0; i < 100; i++) {
  fitted = trainLine(fitted, 0.1, 0)
  penalized = trainLine(penalized, 0.1, 2)
}
assert.ok(mseLine(trainingSet, fitted) < mseLine(trainingSet, initial) / 20)
assert.ok(mseLine(validationSet, fitted) < mseLine(validationSet, initial) / 20)
assert.ok(
  Math.abs(penalized[0]) < Math.abs(fitted[0]),
  'L2 changes the learned slope',
)

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

console.log(
  'PASS: memory, preset history, GQA, MoE storage, batching, caching, rotation, quantization, gradient descent, fitted training, Gaussian noise, mask selection/PAD, world rollout and 15 subjective ranks.',
)
