import assert from 'node:assert/strict'
import { vectorMean, normalizeVector, uniformQuantize, learningSoftmax, distributionKL, distillationStep, exactIntegerSum, scaledAttention } from '../src/lib/llmLearningMath'

function near(actual: number, expected: number, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`)
}

// Analytic LayerNorm case, including translation invariance and a constant vector.
const x = [1, -1, 2, 0]
const norm = normalizeVector(x)
const expected = [0.5, -1.5, 1.5, -0.5].map(v => v / Math.sqrt(1.25001))
norm.forEach((v, i) => near(v, expected[i]))
near(vectorMean(norm), 0)
normalizeVector(x.map(v => v + 19)).forEach((v, i) => near(v, norm[i]))
assert.deepEqual(normalizeVector([7, 7, 7]), [0, 0, 0])
const rms = normalizeVector([3, 4], 'rms', 0)
near(vectorMean(rms.map(v => v * v)), 1)
assert.ok(vectorMean(rms) > 0, 'RMSNorm must not silently center its input')

// Exactly four codes for two bits, including endpoints, clipping and representable values.
const dense = Array.from({ length: 1001 }, (_, i) => -1 + i / 500)
const q = uniformQuantize(dense, 2, -1, 1)
assert.deepEqual([...new Set(q.codes)], [0, 1, 2, 3])
assert.equal(new Set(q.reconstructed).size, 4)
const clipped = uniformQuantize([-9, 9], 2, -1, 1)
assert.deepEqual(clipped.reconstructed, [-1, 1])
near(uniformQuantize([-1, -1 / 3, 1 / 3, 1], 2, -1, 1).mse, 0)
assert.throws(() => uniformQuantize([0], 2, 1, 1))
for (const bits of [2, 3, 4, 8]) {
  const quantized = uniformQuantize(dense, bits, -1, 1)
  assert.ok(quantized.codes.every(code => Number.isInteger(code) && code >= 0 && code < 2 ** bits))
  assert.ok(Math.max(...quantized.errors.map(Math.abs)) <= quantized.step / 2 + 1e-12)
}

// Softmax must stay normalized for large scores and invariant to a shared shift.
const p = learningSoftmax([1001, 1000, 999], 2)
near(p.reduce((a, b) => a + b, 0), 1)
learningSoftmax([1, 0, -1], 2).forEach((v, i) => near(v, p[i]))
near(distributionKL(p, p), 0)

// The taught gradient is checked by a finite difference, then a meaningful loss decrease.
const teacher = [3, 1.5, 0.5, -0.5]
const initial = [0, 0.5, 1, -0.5]
const temperature = 2
const objective = (logits: number[]) => temperature ** 2 * distributionKL(learningSoftmax(teacher, temperature), learningSoftmax(logits, temperature))
const updated = distillationStep(initial, teacher, temperature, 0.1)
for (let i = 0; i < initial.length; i++) {
  const plus = [...initial], minus = [...initial]
  plus[i] += 1e-5; minus[i] -= 1e-5
  const numericGradient = (objective(plus) - objective(minus)) / 2e-5
  near((initial[i] - updated[i]) / 0.1, numericGradient, 1e-8)
}
let student = initial
for (let i = 0; i < 100; i++) student = distillationStep(student, teacher, temperature, 1)
assert.ok(objective(student) < objective(initial) / 1000)

// Causal attention cannot see later values, and the unmasked reference is analytic.
const causal = scaledAttention([1, 0], [[1, 0], [0, 1]], [[1, 2], [-1, 0]], 0, true)
assert.deepEqual(causal.weights, [1, 0])
assert.deepEqual(causal.output, [1, 2])
const changedFuture = scaledAttention([1, 0], [[1, 0], [900, -900]], [[1, 2], [999, 999]], 0, true)
assert.deepEqual(changedFuture.output, causal.output)
const open = scaledAttention([1, 0], [[1, 0], [0, 1]], [[1, 2], [-1, 0]], 0, false)
const a = Math.exp(1 / Math.sqrt(2)) / (Math.exp(1 / Math.sqrt(2)) + 1)
near(open.weights[0], a)
near(open.output[0], 2 * a - 1)
near(open.output[1], 2 * a)

// Editable arithmetic reference: changed input, invalid input and values beyond Number precision.
assert.equal(exactIntegerSum('847293 + 618759'), '1466052')
assert.equal(exactIntegerSum(' 2 + -3 '), '-1')
assert.equal(exactIntegerSum('9007199254740993 + 2'), '9007199254740995')
assert.equal(exactIntegerSum('cat'), null)
assert.equal(exactIntegerSum('2 + 3 + 4'), null)
console.log('LLM learning math: normalization, quantization, distillation gradient, causal attention and exact arithmetic passed.')
