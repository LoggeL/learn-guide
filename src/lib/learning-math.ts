/** Small deterministic learning examples, deliberately separate from presentation. */

/* ---------- Optimizer comparison (gradient-descent article) ---------- */
export type Vec2 = [number, number]
export type LandscapeId = 'valley' | 'rotatedValley' | 'saddle'
export type OptimizerId = 'gd' | 'momentum' | 'adam'
export interface Landscape {
  loss: (p: Vec2) => number
  grad: (p: Vec2) => Vec2
  start: Vec2
}
/** Curvature of the steep direction in both valleys: L = ½(u² + 25·v²). */
export const VALLEY_CURVATURE = 25
const SQRT_HALF = Math.SQRT1_2
const toValleyFrame = ([x, y]: Vec2): Vec2 => [
  SQRT_HALF * (x + y),
  SQRT_HALF * (y - x),
]
const valleyLoss = ([u, v]: Vec2) => 0.5 * (u * u + VALLEY_CURVATURE * v * v)
export const landscapes: Record<LandscapeId, Landscape> = {
  valley: {
    loss: valleyLoss,
    grad: ([x, y]) => [x, VALLEY_CURVATURE * y],
    start: [-2.6, 1.1],
  },
  rotatedValley: {
    loss: (p) => valleyLoss(toValleyFrame(p)),
    grad: (p) => {
      const [u, v] = toValleyFrame(p)
      const gu = u,
        gv = VALLEY_CURVATURE * v
      return [SQRT_HALF * (gu - gv), SQRT_HALF * (gu + gv)]
    },
    // Same start as `valley`, expressed in rotated coordinates, so GD paths are rotated copies.
    start: [SQRT_HALF * (-2.6 - 1.1), SQRT_HALF * (-2.6 + 1.1)],
  },
  /** Saddle at (0, 0), minima at (0, ±1) with loss −0.25. */
  saddle: {
    loss: ([x, y]) => 0.5 * x * x + 0.25 * y ** 4 - 0.5 * y * y,
    grad: ([x, y]) => [x, y ** 3 - y],
    start: [-2.5, 0.02],
  },
}
export const MOMENTUM_BETA = 0.9
export const ADAM = { beta1: 0.9, beta2: 0.999, eps: 1e-8 }
export interface OptimizerState {
  p: Vec2
  m: Vec2
  v: Vec2
  t: number
}
export const initialState = (start: Vec2): OptimizerState => ({
  p: [start[0], start[1]],
  m: [0, 0],
  v: [0, 0],
  t: 0,
})
/** One update. Formulas match the article: plain GD, heavy-ball momentum, Adam with bias correction. */
export function optimizerStep(
  id: OptimizerId,
  landscape: Landscape,
  s: OptimizerState,
  eta: number,
): OptimizerState {
  const g = landscape.grad(s.p),
    t = s.t + 1
  if (id === 'gd')
    return { ...s, t, p: [s.p[0] - eta * g[0], s.p[1] - eta * g[1]] }
  if (id === 'momentum') {
    const m: Vec2 = [
      MOMENTUM_BETA * s.m[0] + g[0],
      MOMENTUM_BETA * s.m[1] + g[1],
    ]
    return { ...s, t, m, p: [s.p[0] - eta * m[0], s.p[1] - eta * m[1]] }
  }
  const { beta1, beta2, eps } = ADAM
  const m: Vec2 = [
    beta1 * s.m[0] + (1 - beta1) * g[0],
    beta1 * s.m[1] + (1 - beta1) * g[1],
  ]
  const v: Vec2 = [
    beta2 * s.v[0] + (1 - beta2) * g[0] ** 2,
    beta2 * s.v[1] + (1 - beta2) * g[1] ** 2,
  ]
  const c1 = 1 - beta1 ** t,
    c2 = 1 - beta2 ** t
  const p: Vec2 = [
    s.p[0] - (eta * (m[0] / c1)) / (Math.sqrt(v[0] / c2) + eps),
    s.p[1] - (eta * (m[1] / c1)) / (Math.sqrt(v[1] / c2) + eps),
  ]
  return { p, m, v, t }
}
/** Positions p₀ … pₙ; stops early once the iterate has left every sensible range. */
export function optimizerPath(
  id: OptimizerId,
  landscape: Landscape,
  eta: number,
  steps: number,
): Vec2[] {
  let s = initialState(landscape.start)
  const path: Vec2[] = [s.p]
  for (let i = 0; i < steps; i++) {
    s = optimizerStep(id, landscape, s, eta)
    path.push(s.p)
    if (!s.p.every(Number.isFinite) || Math.hypot(...s.p) > 1e6) break
  }
  return path
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

/* ---------- Polynomial fit (training / generalization article) ---------- */
export interface Point {
  x: number
  y: number
}
/** Ground truth of the toy problem. In practice it is unknown. */
export const trueFunction = (x: number) => Math.sin(2.4 * x) + 0.3 * x
const fixedNoise = [0.18, -0.22, 0.09, 0.25, -0.15, -0.05, 0.21, -0.26, 0.12, -0.1]
export const polyTrainSet: Point[] = [
  -0.95, -0.78, -0.6, -0.41, -0.2, 0.02, 0.23, 0.44, 0.67, 0.9,
].map((x, i) => ({ x, y: trueFunction(x) + fixedNoise[i] }))
/** 41 held-out points with Gaussian noise (σ = 0.2, fixed seed, Box–Muller). */
export const polyValidationSet: Point[] = (() => {
  let seed = 7
  const uniform = () => {
    seed = (16807 * seed) % 2147483647 // Park–Miller, exact in doubles
    return seed / 2147483647
  }
  const noise = () =>
    Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform())
  return Array.from({ length: 41 }, (_, i) => {
    const x = -1 + i * 0.05
    return { x, y: trueFunction(x) + 0.2 * noise() }
  })
})()
export const POLY_NOISE_SIGMA = 0.2
export const predictPoly = (weights: number[], x: number) =>
  weights.reduceRight((acc, w) => acc * x + w, 0)
export const msePoly = (points: Point[], weights: number[]) =>
  points.reduce((s, p) => s + (predictPoly(weights, p.x) - p.y) ** 2, 0) /
  points.length
function solveLinear(matrix: number[][], rhs: number[]) {
  const n = rhs.length
  const m = matrix.map((row, i) => [...row, rhs[i]])
  for (let c = 0; c < n; c++) {
    let pivot = c
    for (let r = c + 1; r < n; r++)
      if (Math.abs(m[r][c]) > Math.abs(m[pivot][c])) pivot = r
    ;[m[c], m[pivot]] = [m[pivot], m[c]]
    for (let r = c + 1; r < n; r++) {
      const f = m[r][c] / m[c][c]
      for (let k = c; k <= n; k++) m[r][k] -= f * m[c][k]
    }
  }
  const x = new Array<number>(n).fill(0)
  for (let r = n - 1; r >= 0; r--) {
    let acc = m[r][n]
    for (let k = r + 1; k < n; k++) acc -= m[r][k] * x[k]
    x[r] = acc / m[r][r]
  }
  return x
}
/**
 * Exact minimiser of (1/n)·Σ(ŷᵢ − yᵢ)² + λ·Σ_{k≥1} w_k² for ŷ = Σ w_k·x^k
 * (ridge regression; the intercept w₀ is not penalised).
 */
export function fitPolynomial(
  points: Point[],
  degree: number,
  lambda: number,
) {
  const n = degree + 1
  const a = Array.from({ length: n }, () => new Array<number>(n).fill(0))
  const b = new Array<number>(n).fill(0)
  for (const p of points) {
    const f = Array.from({ length: n }, (_, k) => p.x ** k)
    for (let i = 0; i < n; i++) {
      b[i] += f[i] * p.y
      for (let j = 0; j < n; j++) a[i][j] += f[i] * f[j]
    }
  }
  for (let i = 1; i < n; i++) a[i][i] += lambda * points.length
  return solveLinear(a, b)
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
