/** Pure, unit-explicit teaching calculations. No hardware benchmark is implied. */
import type { ModelEntry } from './models'

export type KvFormat = 'heads' | 'latent'
export interface MemoryInput {
  paramsB: number
  /** Parameters read per generated token (MoE: active). Defaults to paramsB. */
  activeParamsB?: number | null
  bits: number
  quantOverhead: number
  /** Layers whose KV cache grows with the full context. */
  layers: number | null
  kvHeads: number | null
  headDim: number | null
  tokens: number
  batch: number
  kvBytes: number
  reserveGiB: number
  /** 'heads' = MHA/GQA/MQA (K and V per KV head); 'latent' = MLA. Default 'heads'. */
  kvFormat?: KvFormat
  /** MLA: cached values per token and layer (e.g. 512 latent + 64 RoPE key = 576). */
  latentDim?: number | null
  /** Layers that keep only a sliding/chunked window of tokens. Default 0. */
  windowLayers?: number
  /** Tokens kept by each windowed layer. */
  window?: number
}
export function memoryPreset(model: ModelEntry) {
  const supported = model.attentionLayout !== 'unsupported'
  const latent = model.kvFormat === 'latent'
  // Every architecture field is returned so that switching presets never
  // keeps a value from the previously selected model.
  return {
    paramsB: model.totalParamsB ?? 0,
    activeParamsB: model.activeParamsB ?? model.totalParamsB ?? null,
    kvFormat: (latent ? 'latent' : 'heads') as KvFormat,
    layers: supported ? (model.kvLayers ?? model.nLayers ?? null) : null,
    kvHeads: supported && !latent ? (model.nKVHeads ?? null) : null,
    headDim: supported && !latent ? (model.headDim ?? null) : null,
    latentDim: supported && latent ? (model.kvLatentDim ?? null) : null,
    windowLayers: supported ? (model.windowLayers ?? 0) : 0,
    window: supported ? (model.attentionWindow ?? 0) : 0,
  }
}
/** Cached values per token for one full-context layer, or null if unknown. */
export function kvValuesPerTokenLayer(input: MemoryInput) {
  if (input.kvFormat === 'latent') return input.latentDim ?? null
  if (input.kvHeads === null || input.headDim === null) return null
  return 2 * input.kvHeads * input.headDim
}
export function memoryEstimate(input: MemoryInput) {
  const bytesPerParam = (input.bits / 8) * input.quantOverhead
  const weights = input.paramsB * 1e9 * bytesPerParam
  const activeWeights =
    (input.activeParamsB ?? input.paramsB) * 1e9 * bytesPerParam
  const perLayer = kvValuesPerTokenLayer(input)
  const windowLayers = input.windowLayers ?? 0
  const known = input.layers !== null && perLayer !== null
  // Token slots: full layers keep every token, windowed layers at most `window`.
  const slots = known
    ? input.layers! * input.tokens +
      windowLayers * Math.min(input.tokens, input.window ?? 0)
    : null
  const kv =
    slots === null ? null : slots * perLayer! * input.batch * input.kvBytes
  const kvPerToken =
    known && input.layers! > 0 ? input.layers! * perLayer! * input.kvBytes : 0
  const reserve = input.reserveGiB * 2 ** 30
  return {
    weights,
    activeWeights,
    kv,
    kvPerToken: known ? kvPerToken : null,
    reserve,
    total: kv === null ? null : weights + kv + reserve,
  }
}

/**
 * Bandwidth ceiling for one decode step (batch 1): every byte read per token
 * passes through its memory once, and the GPU part and the system-RAM part run
 * one after the other, so their times add. Ignores compute and transfer overhead.
 */
export function decodeCeiling(input: {
  gpuBytes: number
  cpuBytes: number
  gpuGBs: number
  cpuGBs: number
}) {
  const gpuMs = (input.gpuBytes / (input.gpuGBs * 1e9)) * 1000
  const cpuMs = input.cpuBytes > 0 ? (input.cpuBytes / (input.cpuGBs * 1e9)) * 1000 : 0
  const stepMs = gpuMs + cpuMs
  return {
    gpuMs,
    cpuMs,
    stepMs,
    tokensPerSecond: stepMs > 0 ? 1000 / stepMs : Infinity,
  }
}

/** Dense decoder lower-bound model: max(compute time, bytes-read time). */
export function batchRoofline(
  batch: number,
  context: number,
  capacityGiB: number,
) {
  const weightsGB = 14 // hypothetical 7B model, FP16
  const kvPerRequestGB = (2 * 32 * 8 * 128 * context * 2) / 1e9
  const memoryGB = weightsGB + batch * kvPerRequestGB + 2
  const memoryMs = ((weightsGB + batch * kvPerRequestGB) / 1000) * 1000
  const computeMs = ((2 * 7e9 * batch) / 100e12) * 1000
  const stepMs = Math.max(memoryMs, computeMs)
  const fits = memoryGB <= (capacityGiB * 2 ** 30) / 1e9
  return {
    memoryGB,
    kvPerRequestGB,
    memoryMs,
    computeMs,
    stepMs,
    fits,
    perUser: 1000 / stepMs,
    total: (batch * 1000) / stepMs,
  }
}

export function cacheCosts(input: {
  tokens: number
  prefixFraction: number
  requests: number
  reuse: number
  price: number
  write: number
  read: number
}) {
  const writes = Math.ceil(input.requests / input.reuse)
  const reads = input.requests - writes
  const prefix = input.tokens * input.prefixFraction
  const suffix = input.tokens - prefix
  const baseline = (input.tokens * input.requests * input.price) / 1e6
  const cached =
    ((prefix * (writes * input.write + reads * input.read) +
      suffix * input.requests) *
      input.price) /
    1e6
  return { writes, reads, baseline, cached, savings: baseline - cached }
}

export interface ChipRooflineInput {
  /** Total parameters in billions (dense model: every weight is read each step). */
  paramsB: number
  layers: number
  heads: number
  kvHeads: number
  headDim: number
  /** Bytes per weight and per KV-cache element (1 = FP8, 2 = BF16). */
  bytesPerValue: number
  batch: number
  /** Tokens already in context (decode) or prompt length (prefill). */
  context: number
  phase: 'decode' | 'prefill'
  bandwidthTBs: number
  peakTFLOPS: number
  capacityGB: number
}

/**
 * Roofline lower bound for one forward step of a dense decoder on one chip type.
 * Bytes: all weights once + KV cache read (decode) or written (prefill).
 * FLOPs: 2·N per token for the matmuls + 4·L·H·d per (query, key) pair for attention.
 * If weights + KV exceed one chip, the step is split ideally over the minimum
 * number of chips (no interconnect cost): times shrink, intensity does not change.
 * Activations, framework reserve and kernel efficiency are ignored.
 */
export function chipRoofline(input: ChipRooflineInput) {
  const weightBytes = input.paramsB * 1e9 * input.bytesPerValue
  const kvBytesPerToken =
    2 * input.layers * input.kvHeads * input.headDim * input.bytesPerValue
  const kvBytes = kvBytesPerToken * input.context * input.batch
  const bytes = weightBytes + kvBytes
  const tokens =
    input.phase === 'decode' ? input.batch : input.batch * input.context
  // (query, key) pairs: decode = 1 query × context keys; causal prefill ≈ context² / 2
  const pairs =
    input.phase === 'decode'
      ? input.batch * input.context
      : (input.batch * input.context * (input.context + 1)) / 2
  const matmulFlops = 2 * input.paramsB * 1e9 * tokens
  const attentionFlops = 4 * input.layers * input.heads * input.headDim * pairs
  const flops = matmulFlops + attentionFlops
  const intensity = flops / bytes
  const ridge = input.peakTFLOPS / input.bandwidthTBs
  const chips = Math.max(1, Math.ceil(bytes / (input.capacityGB * 1e9)))
  const memoryMs = (bytes / (chips * input.bandwidthTBs * 1e12)) * 1000
  const computeMs = (flops / (chips * input.peakTFLOPS * 1e12)) * 1000
  const stepMs = Math.max(memoryMs, computeMs)
  const attainableTFLOPS = Math.min(
    input.peakTFLOPS,
    input.bandwidthTBs * intensity,
  )
  return {
    weightBytes,
    kvBytes,
    bytes,
    flops,
    intensity,
    ridge,
    chips,
    memoryMs,
    computeMs,
    stepMs,
    bound: memoryMs >= computeMs ? ('memory' as const) : ('compute' as const),
    attainableTFLOPS,
    utilization: attainableTFLOPS / input.peakTFLOPS,
    /** Decode: tokens/s per sequence. Prefill: 1000 / time-to-first-token. */
    perSequence: 1000 / stepMs,
    /** Decode: generated tokens per second over the whole batch. */
    total: (input.batch * 1000) / stepMs,
    /** Batch at which the weight matmuls alone reach the ridge (KV ignored). */
    weightOnlyCriticalBatch: (ridge * input.bytesPerValue) / 2,
  }
}
