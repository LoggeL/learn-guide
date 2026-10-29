import assert from 'node:assert/strict'
import {
  memoryPreset,
  memoryEstimate,
  batchRoofline,
  cacheCosts,
  type MemoryInput,
} from '../src/lib/inference-math'
import { models, tierListModels } from '../src/lib/models'
import {
  gradient,
  descentStep,
  stationaryPoint,
  rotatePair,
  quantizeVector,
  normalNoise,
  noisySample,
  trainingSet,
  validationSet,
  mseLine,
  trainLine,
  worldRollout,
} from '../src/lib/learning-math'
import {
  diffusionAlphaBars,
  diffusionBetas,
  diffusionIdealX0,
  diffusionSampleTrajectories,
  diffusionBuildToyLm,
  diffusionTokenDistribution,
  diffusionRunTextSampler,
  diffusionClassifySentence,
  diffusionUniform,
  DIFFUSION_EOS,
  type DiffusionVec2,
} from '../src/lib/diffusion-math'

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

// Diffusion schedules: DDPM linear β and Improved-DDPM cosine ᾱ
const linearAB = diffusionAlphaBars('linear'),
  cosineAB = diffusionAlphaBars('cosine')
assert.equal(linearAB.length, 1001)
assert.equal(linearAB[0], 1)
close(diffusionBetas(linearAB)[1], 1e-4, 1e-12)
close(diffusionBetas(linearAB)[1000], 0.02, 1e-12)
assert.ok(linearAB[500] > 0.07 && linearAB[500] < 0.09, 'linear β leaves ~8 % signal at t=500')
assert.ok(cosineAB[500] > 0.45 && cosineAB[500] < 0.55, 'cosine leaves ~half the signal at t=500')
for (let t = 1; t <= 1000; t++) {
  assert.ok(linearAB[t] < linearAB[t - 1] && cosineAB[t] <= cosineAB[t - 1], 'ᾱ is monotone')
}
assert.ok(cosineAB[1000] < 1e-6 && linearAB[1000] < 1e-4, 'both end near pure noise')

// Exact denoiser of a finite dataset
const ring: DiffusionVec2[] = Array.from({ length: 12 }, (_, i) => [
  0.9 * Math.cos((2 * Math.PI * i) / 12),
  0.9 * Math.sin((2 * Math.PI * i) / 12),
])
const nearlyClean = diffusionIdealX0([0.9, 0.01], 0.999, ring)
close(nearlyClean[0], 0.9, 1e-6)
const pureNoise = diffusionIdealX0([0.5, -0.3], 1e-8, ring)
close(pureNoise[0], 0, 1e-3)
close(pureNoise[1], 0, 1e-3)
const g = normalNoise(2024)
const starts: DiffusionVec2[] = Array.from({ length: 20 }, () => [g(), g()])
const nearest = (p: DiffusionVec2) => Math.min(...ring.map((d) => Math.hypot(p[0] - d[0], p[1] - d[1])))
const oneStep = diffusionSampleTrajectories(ring, starts, 1, 0, 'cosine', normalNoise(1))
oneStep.forEach((path) => assert.ok(Math.hypot(...path[1]) < 1e-3, 'one step collapses onto the data mean'))
const manySteps = diffusionSampleTrajectories(ring, starts, 50, 0, 'cosine', normalNoise(1))
manySteps.forEach((path) => assert.ok(nearest(path[50]) < 1e-3, 'DDIM with 50 steps lands on data'))
const ddimAgain = diffusionSampleTrajectories(ring, starts, 50, 0, 'cosine', normalNoise(99))
assert.deepEqual(ddimAgain, manySteps, 'η = 0 is deterministic')

// Toy masked diffusion LM
const corpus = [
  'the cat sits on the mat',
  'the cat sleeps on the warm mat',
  'the cat sits in the sun',
  'a dog barks at the cat',
  'a dog barks at the bird',
  'the dog barks at the door',
  'a bird sings on the roof',
  'the cat sleeps in the sun',
]
const lm = diffusionBuildToyLm(corpus, 8)
assert.ok(lm.vocab.includes(DIFFUSION_EOS), '[EOS] padding is part of the vocabulary')
const dist = diffusionTokenDistribution(lm, Array(8).fill(null), 3)
close(
  dist.reduce((sum, p) => sum + p, 0),
  1,
)
const sequential = diffusionRunTextSampler(lm, 1, 'confidence', diffusionUniform(7))
assert.equal(sequential.length - 1, 8, 'one kept prediction per step needs 8 passes')
assert.ok(
  sequential.slice(1).every((step) => step.proposals.filter((p) => p.kept).length === 1),
)
assert.equal(sequential[1].proposals.length, 8, 'first step predicts every masked position')
const firstKept = sequential.slice(1).map((step) => step.proposals.find((p) => p.kept)!.index)
assert.ok(firstKept.indexOf(7) < firstKept.indexOf(5), '[EOS] tail is committed before content')
const wrongGuess = sequential
  .slice(1)
  .some((step) => step.proposals.some((p) => !p.kept && p.token !== sequential[8].canvas[p.index]))
assert.ok(wrongGuess, 'some remasked predictions were wrong')
assert.notEqual(
  diffusionClassifySentence(lm, sequential[8].canvas as string[]),
  'broken',
)
const parallel = diffusionRunTextSampler(lm, 8, 'confidence', diffusionUniform(7))
assert.equal(parallel.length - 1, 1)
assert.equal(
  diffusionClassifySentence(lm, parallel[1].canvas as string[]),
  'broken',
  'committing all positions at once produces an unseen word pair',
)
assert.equal(diffusionClassifySentence(lm, [...corpus[0].split(' '), DIFFUSION_EOS, DIFFUSION_EOS]), 'corpus')

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
  'PASS: memory, preset history, GQA, MoE storage, batching, caching, rotation, quantization, gradient descent, fitted training, Gaussian noise, diffusion schedules/DDIM/masked-diffusion sampler, world rollout and 15 subjective ranks.',
)
