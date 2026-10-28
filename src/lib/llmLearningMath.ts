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

export type QuantScheme = 'symmetric' | 'asymmetric'

export interface QuantGroup {
  start: number
  end: number
  scale: number
  zeroPoint: number
  /** Dequantized values this group can represent, ascending. */
  grid: number[]
}

/**
 * Integer quantization with one scale (and, if asymmetric, one zero-point) per group of
 * `groupSize` consecutive weights. Indices in `keepFull` are stored unquantized
 * (mixed-precision decomposition in the spirit of LLM.int8()) and excluded from the scale.
 *
 * symmetric:  s = max|w| / (2^(b-1) − 1),  q = clamp(round(w / s), −(2^(b-1) − 1), 2^(b-1) − 1),  ŵ = s·q
 * asymmetric: s = (max − min) / (2^b − 1), z = round(−min / s),  q = clamp(round(w / s) + z, 0, 2^b − 1),  ŵ = s·(q − z)
 * The asymmetric range is widened to include 0 so that zero stays exactly representable.
 */
export function groupQuantize(weights: number[], bits: number, groupSize: number, scheme: QuantScheme, keepFull: number[] = []) {
  if (!Number.isInteger(bits) || bits < 2 || bits > 16) throw new Error('Invalid bit width')
  if (!Number.isInteger(groupSize) || groupSize < 1) throw new Error('Invalid group size')
  const kept = new Set(keepFull)
  const codes: (number | null)[] = new Array(weights.length).fill(null)
  const reconstructed = [...weights]
  const groups: QuantGroup[] = []
  for (let start = 0; start < weights.length; start += groupSize) {
    const end = Math.min(weights.length, start + groupSize)
    const members: number[] = []
    for (let i = start; i < end; i++) if (!kept.has(i)) members.push(i)
    const values = members.map(i => weights[i])
    let scale = 1
    let zeroPoint = 0
    let qMin: number
    let qMax: number
    if (scheme === 'symmetric') {
      qMax = 2 ** (bits - 1) - 1
      qMin = -qMax
      const absMax = values.length ? Math.max(...values.map(Math.abs)) : 0
      if (absMax > 0) scale = absMax / qMax
    } else {
      qMin = 0
      qMax = 2 ** bits - 1
      const lo = Math.min(0, ...values)
      const hi = Math.max(0, ...values)
      if (hi > lo) scale = (hi - lo) / qMax
      zeroPoint = Math.max(qMin, Math.min(qMax, Math.round(-lo / scale)))
    }
    for (const i of members) {
      const code = Math.max(qMin, Math.min(qMax, Math.round(weights[i] / scale) + zeroPoint))
      codes[i] = code
      reconstructed[i] = scale * (code - zeroPoint)
    }
    const grid = Array.from({ length: qMax - qMin + 1 }, (_, k) => scale * (qMin + k - zeroPoint))
    groups.push({ start, end, scale, zeroPoint, grid })
  }
  const errors = reconstructed.map((value, i) => value - weights[i])
  const mse = vectorMean(errors.map(value => value ** 2))
  return { codes, reconstructed, errors, groups, mse }
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
