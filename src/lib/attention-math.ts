/**
 * Exact helper math for the positional-encoding and multi-head-attention pages.
 * Every number shown in those demos is computed here from published formulas.
 */

/** RoPE frequencies θ_i = base^(−2i/d) for the d/2 dimension pairs (Su et al., 2021). */
export function ropeThetas(dim: number, base: number): number[] {
  return Array.from({ length: dim / 2 }, (_, i) => Math.pow(base, (-2 * i) / dim))
}

/** Wavelength in tokens of one RoPE pair: one full turn every 2π/θ positions. */
export function ropeWavelength(theta: number): number {
  return (2 * Math.PI) / theta
}

/**
 * q·k score for identical unit content vectors in every pair, averaged over the
 * given pairs. With q = k the rotated dot product is Σ cos((m−n)·θ_i).
 */
export function ropeAlignedScore(distance: number, thetas: number[]): number {
  if (thetas.length === 0) return 0
  return thetas.reduce((sum, theta) => sum + Math.cos(distance * theta), 0) / thetas.length
}

/** NTK-aware base change b' = b · s^(d/(d−2)) (bloc97, 2023; YaRN appendix A.2). */
export function ntkAwareBase(base: number, scale: number, dim: number): number {
  return base * Math.pow(scale, dim / (dim - 2))
}

/**
 * YaRN "NTK-by-parts" frequency for one pair (Peng et al., 2023, Sec. 3.2).
 * r = L / λ counts how many full turns the pair made inside the training window.
 * r < α → interpolate like PI (θ/s); r > β → keep θ; linear ramp in between.
 */
export function yarnTheta(theta: number, trainLength: number, scale: number, alpha = 1, beta = 32): number {
  const r = trainLength / ropeWavelength(theta)
  const gamma = Math.min(1, Math.max(0, (r - alpha) / (beta - alpha)))
  return (1 - gamma) * (theta / scale) + gamma * theta
}

/** YaRN attention temperature: √(1/t) = 0.1·ln(s) + 1, i.e. logits are multiplied by this value squared. */
export function yarnLogitScale(scale: number): number {
  const sqrtInvT = 0.1 * Math.log(scale) + 1
  return sqrtInvT * sqrtInvT
}

export type RopeScalingMethod = 'none' | 'pi' | 'ntk' | 'yarn'

/** Effective per-pair frequencies after a context-extension method with factor s. */
export function scaledThetas(method: RopeScalingMethod, dim: number, base: number, trainLength: number, scale: number): number[] {
  const thetas = ropeThetas(dim, base)
  switch (method) {
    case 'pi':
      return thetas.map((theta) => theta / scale)
    case 'ntk':
      return ropeThetas(dim, ntkAwareBase(base, scale, dim))
    case 'yarn':
      return thetas.map((theta) => yarnTheta(theta, trainLength, scale))
    default:
      return thetas
  }
}

export type PairStatus = 'fullTurn' | 'inRange' | 'outOfRange'

/**
 * Did training ever show this pair the angles it needs at the new context length?
 * fullTurn: the pair already completed ≥ 1 full turn in training, so every angle was seen.
 * inRange: the largest angle needed after scaling stays inside the trained range.
 * outOfRange: the pair has to produce angles it never saw during training.
 */
export function pairStatus(originalTheta: number, effectiveTheta: number, trainLength: number, targetLength: number): PairStatus {
  const trainedMax = trainLength * originalTheta
  if (trainedMax >= 2 * Math.PI) return 'fullTurn'
  const needed = targetLength * effectiveTheta
  return needed <= trainedMax * (1 + 1e-9) ? 'inRange' : 'outOfRange'
}

/* ------------------------------------------------------------------ */
/* KV cache                                                            */
/* ------------------------------------------------------------------ */

export type KvArchitecture =
  | { kind: 'gqa'; layers: number; kvHeads: number; headDim: number }
  | { kind: 'mla'; layers: number; latentDim: number; ropeDim: number }
  | { kind: 'swa'; globalLayers: number; localLayers: number; window: number; kvHeads: number; headDim: number }
  | { kind: 'hybrid'; attentionLayers: number; kvHeads: number; headDim: number }

/**
 * KV-cache bytes for one sequence of `tokens` tokens.
 * GQA/MHA/MQA: 2 · L · n_kv · d_head · bytes per token (K and V).
 * MLA: L · (d_c + d_R) · bytes per token (one shared latent plus the decoupled RoPE key).
 * Sliding window: local layers store at most `window` tokens.
 * Hybrid: only the full-attention layers grow with context; recurrent state is fixed-size and not counted.
 */
export function kvCacheBytes(arch: KvArchitecture, tokens: number, bytesPerValue: number): number {
  switch (arch.kind) {
    case 'gqa':
      return 2 * arch.layers * arch.kvHeads * arch.headDim * bytesPerValue * tokens
    case 'mla':
      return arch.layers * (arch.latentDim + arch.ropeDim) * bytesPerValue * tokens
    case 'swa': {
      const perLayerToken = 2 * arch.kvHeads * arch.headDim * bytesPerValue
      return perLayerToken * (arch.globalLayers * tokens + arch.localLayers * Math.min(tokens, arch.window))
    }
    case 'hybrid':
      return 2 * arch.attentionLayers * arch.kvHeads * arch.headDim * bytesPerValue * tokens
  }
}

export const GIB = 1024 ** 3
export const KIB = 1024
