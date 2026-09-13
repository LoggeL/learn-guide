/** Small deterministic learning examples, deliberately separate from presentation. */
export const loss = (x: number) => x ** 4 - 2 * x ** 2 + 0.5 * x + 2
export const gradient = (x: number) => 4 * x ** 3 - 4 * x + 0.5
export const descentStep = (x: number, rate: number) => x - rate * gradient(x)
export function stationaryPoint(start: number) {
  let x = start
  for (let i = 0; i < 20; i++) x -= gradient(x) / (12 * x * x - 4)
  return x
}
export function rotatePair(values: number[], theta: number) {
  const c = Math.cos(theta),
    s = Math.sin(theta)
  return [
    c * values[0] - s * values[1],
    s * values[0] + c * values[1],
    c * values[2] - s * values[3],
    s * values[2] + c * values[3],
  ]
}
export function quantizeVector(values: number[], bits: number) {
  const levels = 2 ** bits - 1
  const scale = Math.max(...values.map(Math.abs)) || 1
  const codes = values.map((v) => Math.round(((v / scale + 1) / 2) * levels))
  const restored = codes.map((code) => ((2 * code) / levels - 1) * scale)
  return {
    codes,
    restored,
    scale,
    storageBits: values.length * bits + 32,
    mse:
      restored.reduce((s, v, i) => s + (v - values[i]) ** 2, 0) / values.length,
  }
}
export function normalNoise(seed: number) {
  let s = seed >>> 0
  const uniform = () => {
    s = (1664525 * s + 1013904223) >>> 0
    return (s + 1) / (2 ** 32 + 1)
  }
  return () =>
    Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform())
}
export const noisySample = (signal: number, noise: number, alphaBar: number) =>
  Math.sqrt(alphaBar) * signal + Math.sqrt(1 - alphaBar) * noise

/** Supplied toy candidate model. Visible neighbors increase confidence. */
export function maskCandidates(visible: boolean[], length: number) {
  const priors = [0.92, 0.59, 0.62, 0.88, 0.91, 0.56, 0.53, 0.6]
  return Array.from({ length }, (_, index) => ({
    index,
    probability: Math.min(
      0.99,
      priors[index % priors.length] +
        (visible[index - 1] ? 0.12 : 0) +
        (visible[index + 1] ? 0.12 : 0),
    ),
  }))
    .filter((item) => !visible[item.index])
    .sort((a, b) => b.probability - a.probability || a.index - b.index)
}
export function unmaskStep(visible: boolean[], length: number) {
  const next = [...visible]
  maskCandidates(visible, length)
    .slice(0, 2)
    .forEach((item) => {
      next[item.index] = true
    })
  return next
}

export const trainingSet = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1].map(
  (x, i) => ({ x, y: 0.4 + 0.6 * x + 0.12 * Math.sin(i * 2.7) }),
)
export const validationSet = [-0.9, -0.6, -0.3, 0.1, 0.4, 0.7, 0.9].map(
  (x) => ({ x, y: 0.4 + 0.6 * x }),
)
export const predictLine = (x: number, weights: [number, number]) =>
  weights[0] * x + weights[1]
export function mseLine(
  points: { x: number; y: number }[],
  weights: [number, number],
) {
  return (
    points.reduce((s, p) => s + (predictLine(p.x, weights) - p.y) ** 2, 0) /
    points.length
  )
}
export function trainLine(
  weights: [number, number],
  rate: number,
  decay: number,
): [number, number] {
  let dw = 0,
    db = 0
  for (const p of trainingSet) {
    const error = predictLine(p.x, weights) - p.y
    dw += (2 * error * p.x) / trainingSet.length
    db += (2 * error) / trainingSet.length
  }
  return [
    weights[0] - rate * (dw + 2 * decay * weights[0]),
    weights[1] - rate * db,
  ]
}
export function worldRollout(
  velocity: number,
  acceleration: number,
  learnedAcceleration: number,
  horizon: number,
) {
  return Array.from({ length: horizon + 1 }, (_, time) => ({
    time,
    actual: velocity * time + 0.5 * acceleration * time ** 2,
    predicted: velocity * time + 0.5 * learnedAcceleration * time ** 2,
  }))
}
