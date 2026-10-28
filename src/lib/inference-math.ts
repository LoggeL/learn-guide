/** Pure, unit-explicit teaching calculations. No hardware benchmark is implied. */
import type { ModelEntry } from './models'

export interface MemoryInput {
  paramsB: number
  bits: number
  quantOverhead: number
  layers: number | null
  kvHeads: number | null
  headDim: number | null
  tokens: number
  batch: number
  kvBytes: number
  reserveGiB: number
}
export function memoryPreset(model: ModelEntry) {
  const supported = model.attentionLayout !== 'unsupported'
  return {
    paramsB: model.totalParamsB ?? 0,
    layers: supported ? (model.nLayers ?? null) : null,
    kvHeads: supported ? (model.nKVHeads ?? null) : null,
    headDim: supported ? (model.headDim ?? null) : null,
  }
}
export function memoryEstimate(input: MemoryInput) {
  const weights = ((input.paramsB * 1e9 * input.bits) / 8) * input.quantOverhead
  const known =
    input.layers !== null && input.kvHeads !== null && input.headDim !== null
  const kv = known
    ? 2 *
      input.layers! *
      input.kvHeads! *
      input.headDim! *
      input.tokens *
      input.batch *
      input.kvBytes
    : null
  const reserve = input.reserveGiB * 2 ** 30
  return {
    weights,
    kv,
    reserve,
    total: kv === null ? null : weights + kv + reserve,
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
