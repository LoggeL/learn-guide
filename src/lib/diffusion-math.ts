/**
 * Deterministic diffusion teaching models, kept separate from presentation.
 *
 * - Noise schedules: DDPM linear β (Ho et al. 2020) and cosine ᾱ (Nichol & Dhariwal 2021).
 * - Ideal denoiser: the exact E[x₀ | xₜ] for a finite 2D dataset, used with the DDIM / DDPM update.
 * - Toy masked diffusion LM: a bidirectional bigram model with confidence-based remasking (LLaDA-style).
 */

export type DiffusionSchedule = 'linear' | 'cosine'

export const DIFFUSION_STEPS = 1000

/** ᾱₜ for t = 0…T (index 0 is clean data, ᾱ₀ = 1). */
export function diffusionAlphaBars(kind: DiffusionSchedule, T = DIFFUSION_STEPS): number[] {
  const alphaBars = [1]
  if (kind === 'linear') {
    // Ho et al. 2020: β linear from 1e-4 to 0.02, ᾱₜ = Π (1 − βₛ)
    for (let t = 1; t <= T; t++) {
      const beta = 1e-4 + ((0.02 - 1e-4) * (t - 1)) / Math.max(1, T - 1)
      alphaBars.push(alphaBars[t - 1] * (1 - beta))
    }
    return alphaBars
  }
  // Nichol & Dhariwal 2021: ᾱₜ = f(t)/f(0), f(t) = cos²(((t/T)+s)/(1+s)·π/2), βₜ clipped at 0.999
  const s = 0.008
  const f = (t: number) => Math.cos(((t / T + s) / (1 + s)) * (Math.PI / 2)) ** 2
  for (let t = 1; t <= T; t++) {
    const beta = Math.min(0.999, 1 - f(t) / f(t - 1))
    alphaBars.push(alphaBars[t - 1] * (1 - beta))
  }
  return alphaBars
}

/** βₜ = 1 − ᾱₜ/ᾱₜ₋₁ for t = 1…T (index 0 is unused and set to 0). */
export function diffusionBetas(alphaBars: number[]): number[] {
  return alphaBars.map((a, t) => (t === 0 ? 0 : 1 - a / alphaBars[t - 1]))
}

export type DiffusionVec2 = [number, number]

/**
 * Exact posterior mean E[x₀ | xₜ] when the data distribution is a finite set of points.
 * q(xₜ | x₀) = N(√ᾱ x₀, (1−ᾱ) I), so the posterior weights are a softmax over squared distances.
 */
export function diffusionIdealX0(x: DiffusionVec2, alphaBar: number, data: DiffusionVec2[]): DiffusionVec2 {
  const sa = Math.sqrt(alphaBar)
  const variance = Math.max(1 - alphaBar, 1e-12)
  const logits = data.map(([px, py]) => -((x[0] - sa * px) ** 2 + (x[1] - sa * py) ** 2) / (2 * variance))
  const max = Math.max(...logits)
  const weights = logits.map((l) => Math.exp(l - max))
  const z = weights.reduce((sum, w) => sum + w, 0)
  return [
    weights.reduce((sum, w, i) => sum + w * data[i][0], 0) / z,
    weights.reduce((sum, w, i) => sum + w * data[i][1], 0) / z,
  ]
}

/** ε̂ = (xₜ − √ᾱ·x̂₀) / √(1−ᾱ) — the noise implied by a clean-data estimate. */
export function diffusionEpsFromX0(x: DiffusionVec2, x0: DiffusionVec2, alphaBar: number): DiffusionVec2 {
  const sa = Math.sqrt(alphaBar)
  const sn = Math.sqrt(Math.max(1 - alphaBar, 1e-12))
  return [(x[0] - sa * x0[0]) / sn, (x[1] - sa * x0[1]) / sn]
}

/**
 * Generalized DDIM update from ᾱₜ to ᾱₛ (s < t), Song et al. 2020, Eq. 12/16.
 * η = 0: deterministic DDIM. η = 1: stochastic, matches the DDPM posterior variance.
 */
export function diffusionSamplerStep(
  x: DiffusionVec2,
  alphaBarT: number,
  alphaBarS: number,
  data: DiffusionVec2[],
  eta: number,
  z: DiffusionVec2,
): DiffusionVec2 {
  const x0 = diffusionIdealX0(x, alphaBarT, data)
  const eps = diffusionEpsFromX0(x, x0, alphaBarT)
  const sigma =
    eta * Math.sqrt(Math.max(0, ((1 - alphaBarS) / (1 - alphaBarT)) * (1 - alphaBarT / alphaBarS)))
  const dir = Math.sqrt(Math.max(0, 1 - alphaBarS - sigma ** 2))
  const sa = Math.sqrt(alphaBarS)
  return [sa * x0[0] + dir * eps[0] + sigma * z[0], sa * x0[1] + dir * eps[1] + sigma * z[1]]
}

/** Evenly spaced timesteps T = t₀ > t₁ > … > t_N = 0. */
export function diffusionTimesteps(steps: number, T = DIFFUSION_STEPS): number[] {
  return Array.from({ length: steps + 1 }, (_, i) => Math.round(T * (1 - i / steps)))
}

/** Runs the sampler for every start point and returns full trajectories (start included). */
export function diffusionSampleTrajectories(
  data: DiffusionVec2[],
  starts: DiffusionVec2[],
  steps: number,
  eta: number,
  kind: DiffusionSchedule,
  gaussian: () => number,
): DiffusionVec2[][] {
  const alphaBars = diffusionAlphaBars(kind)
  const ts = diffusionTimesteps(steps)
  return starts.map((start) => {
    const path: DiffusionVec2[] = [start]
    let x = start
    for (let i = 0; i < steps; i++) {
      const z: DiffusionVec2 = eta > 0 ? [gaussian(), gaussian()] : [0, 0]
      x = diffusionSamplerStep(x, alphaBars[ts[i]], alphaBars[ts[i + 1]], data, eta, z)
      path.push(x)
    }
    return path
  })
}

/* ------------------------------------------------------------------ */
/* Toy masked diffusion language model                                  */
/* ------------------------------------------------------------------ */

export const DIFFUSION_EOS = '[EOS]'
const BOS = '<s>'

export interface DiffusionToyLm {
  vocab: string[]
  length: number
  /** P(next | prev) with add-α smoothing */
  bigram: (prev: string, next: string) => number
  /** P(token at position i) – positional unigram used when the left neighbour is still masked */
  positional: (index: number, token: string) => number
  /** true if the pair occurs in the (padded) training corpus */
  seenPair: (prev: string, next: string) => boolean
  /** the padded training sequences */
  sequences: string[][]
}

/**
 * Builds a bidirectional bigram "denoiser" from a tiny corpus.
 * Like LLaDA's SFT data, every sentence is padded with [EOS] up to the canvas length,
 * so [EOS] is an ordinary token the model learns to predict.
 */
export function diffusionBuildToyLm(corpus: string[], length: number, smoothing = 0.1): DiffusionToyLm {
  const sequences = corpus.map((sentence) => {
    const words = sentence.split(' ').filter(Boolean).slice(0, length)
    while (words.length < length) words.push(DIFFUSION_EOS)
    return words
  })
  const vocab = Array.from(new Set(sequences.flat()))
  const pairCounts = new Map<string, number>()
  const prevCounts = new Map<string, number>()
  const positionCounts = new Map<string, number>()
  for (const seq of sequences) {
    let prev = BOS
    seq.forEach((word, i) => {
      pairCounts.set(`${prev}\u0000${word}`, (pairCounts.get(`${prev}\u0000${word}`) ?? 0) + 1)
      prevCounts.set(prev, (prevCounts.get(prev) ?? 0) + 1)
      positionCounts.set(`${i}\u0000${word}`, (positionCounts.get(`${i}\u0000${word}`) ?? 0) + 1)
      prev = word
    })
  }
  const V = vocab.length
  return {
    vocab,
    length,
    bigram: (prev, next) =>
      ((pairCounts.get(`${prev}\u0000${next}`) ?? 0) + smoothing) / ((prevCounts.get(prev) ?? 0) + smoothing * V),
    positional: (index, token) =>
      ((positionCounts.get(`${index}\u0000${token}`) ?? 0) + 0.5) / (sequences.length + 0.5 * V),
    seenPair: (prev, next) => pairCounts.has(`${prev}\u0000${next}`),
    sequences,
  }
}

export type DiffusionSentenceKind = 'corpus' | 'novel' | 'broken'

/** Is a finished canvas a training sentence, a new sentence made of seen word pairs, or does it contain an unseen pair? */
export function diffusionClassifySentence(lm: DiffusionToyLm, canvas: string[]): DiffusionSentenceKind {
  if (lm.sequences.some((seq) => seq.every((token, i) => token === canvas[i]))) return 'corpus'
  let prev = BOS
  for (const token of canvas) {
    if (!lm.seenPair(prev, token)) return 'broken'
    prev = token
  }
  return 'novel'
}

/** p(xᵢ | visible context) ∝ P(xᵢ | left) · P(right | xᵢ); masked neighbours contribute no evidence. */
export function diffusionTokenDistribution(lm: DiffusionToyLm, canvas: (string | null)[], index: number): number[] {
  const left = index === 0 ? BOS : canvas[index - 1]
  const right = index < lm.length - 1 ? canvas[index + 1] : null
  const scores = lm.vocab.map(
    (token) => (left ? lm.bigram(left, token) : lm.positional(index, token)) * (right ? lm.bigram(token, right) : 1),
  )
  const z = scores.reduce((sum, s) => sum + s, 0)
  return scores.map((s) => s / z)
}

export interface DiffusionProposal {
  index: number
  token: string
  confidence: number
  kept: boolean
}

export type DiffusionRemaskOrder = 'confidence' | 'random'

/**
 * One reverse step: predict every masked position in parallel, keep `k` predictions and remask the rest.
 * 'confidence' keeps the most confident predictions (LLaDA low-confidence remasking),
 * 'random' keeps a random subset (LLaDA random remasking).
 */
export function diffusionDenoiseStep(
  lm: DiffusionToyLm,
  canvas: (string | null)[],
  k: number,
  order: DiffusionRemaskOrder,
  uniform: () => number,
): { canvas: (string | null)[]; proposals: DiffusionProposal[] } {
  const proposals: DiffusionProposal[] = []
  canvas.forEach((token, index) => {
    if (token !== null) return
    const dist = diffusionTokenDistribution(lm, canvas, index)
    let best = 0
    dist.forEach((p, j) => {
      if (p > dist[best]) best = j
    })
    proposals.push({ index, token: lm.vocab[best], confidence: dist[best], kept: false })
  })
  const ranked =
    order === 'confidence'
      ? [...proposals].sort((a, b) => b.confidence - a.confidence || a.index - b.index)
      : proposals.map((p) => ({ p, r: uniform() })).sort((a, b) => a.r - b.r).map(({ p }) => p)
  const keep = new Set(ranked.slice(0, k).map((p) => p.index))
  const next = [...canvas]
  for (const p of proposals) {
    if (keep.has(p.index)) {
      p.kept = true
      next[p.index] = p.token
    }
  }
  return { canvas: next, proposals }
}

export interface DiffusionSamplerTrace {
  canvas: (string | null)[]
  proposals: DiffusionProposal[]
}

/** Full sampling run from an all-masked canvas. trace[0] is the initial state (no proposals). */
export function diffusionRunTextSampler(
  lm: DiffusionToyLm,
  k: number,
  order: DiffusionRemaskOrder,
  uniform: () => number,
): DiffusionSamplerTrace[] {
  let canvas: (string | null)[] = Array(lm.length).fill(null)
  const trace: DiffusionSamplerTrace[] = [{ canvas, proposals: [] }]
  while (canvas.some((token) => token === null)) {
    const step = diffusionDenoiseStep(lm, canvas, k, order, uniform)
    canvas = step.canvas
    trace.push(step)
  }
  return trace
}

/** Seeded uniform PRNG in (0, 1) — same LCG as normalNoise in learning-math. */
export function diffusionUniform(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return (s + 1) / (2 ** 32 + 1)
  }
}
