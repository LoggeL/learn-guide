/** Small deterministic teaching models. No measured model performance is inferred. */
export function vectorMean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function normalizeVector(values: number[], mode: 'layer' | 'rms' = 'layer', epsilon = 1e-5) {
  const center = mode === 'layer' ? vectorMean(values) : 0
  const secondMoment = vectorMean(values.map(value => (value - center) ** 2))
  return values.map(value => (value - center) / Math.sqrt(secondMoment + epsilon))
}

export function uniformQuantize(weights: number[], bits: number, min: number, max: number) {
  if (!Number.isInteger(bits) || bits < 1 || bits > 16 || !(max > min)) throw new Error('Invalid quantizer')
  const levels = 2 ** bits
  const step = (max - min) / (levels - 1)
  const codes = weights.map(value => Math.max(0, Math.min(levels - 1, Math.round((value - min) / step))))
  const reconstructed = codes.map(code => min + code * step)
  const errors = reconstructed.map((value, i) => value - weights[i])
  return { levels, step, codes, reconstructed, errors, mse: vectorMean(errors.map(value => value ** 2)) }
}

export function learningSoftmax(logits: number[], temperature = 1) {
  const max = Math.max(...logits)
  const exp = logits.map(value => Math.exp((value - max) / temperature))
  const sum = exp.reduce((total, value) => total + value, 0)
  return exp.map(value => value / sum)
}

export function distributionKL(target: number[], student: number[]) {
  return target.reduce((sum, value, i) => sum + (value === 0 ? 0 : value * Math.log(value / student[i])), 0)
}

/** Gradient of T² KL(teacher_T || student_T) with respect to student logits. */
export function distillationStep(student: number[], teacher: number[], temperature: number, learningRate: number) {
  const p = learningSoftmax(teacher, temperature)
  const q = learningSoftmax(student, temperature)
  return student.map((value, i) => value - learningRate * temperature * (q[i] - p[i]))
}

export function exactIntegerSum(text: string): string | null {
  const match = text.match(/^\s*([+-]?\d+)\s*\+\s*([+-]?\d+)\s*$/)
  return match ? (BigInt(match[1]) + BigInt(match[2])).toString() : null
}

export function scaledAttention(query: number[], keys: number[][], values: number[][], queryIndex: number, causal: boolean) {
  const dots = keys.map(key => query.reduce((sum, value, i) => sum + value * key[i], 0))
  const scores = dots.map((dot, i) => causal && i > queryIndex ? -Infinity : dot / Math.sqrt(query.length))
  const weights = learningSoftmax(scores)
  const output = values[0].map((_, dimension) => values.reduce((sum, value, i) => sum + weights[i] * value[dimension], 0))
  return { dots, scores, weights, output }
}
