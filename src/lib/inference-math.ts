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
