/**
 * Deterministic scheduling models for the batching lesson.
 * They illustrate scheduling policies; they are not benchmarks.
 */

/** Small seedable PRNG (mulberry32) so demos are reproducible. */
export function batchingRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Output lengths (in decode steps) of a queue of waiting requests. */
export function batchingQueue(seed: number, count: number, min = 3, max = 14): number[] {
  const rng = batchingRng(seed)
  return Array.from({ length: count }, () => min + Math.floor(rng() * (max - min + 1)))
}

export interface BatchingRun {
  id: number
  slot: number
  start: number
  length: number
}

/**
 * Static batching: take `slots` requests from the queue, run them together and
 * start the next batch only after the longest one has finished.
 */
export function batchingStatic(lengths: number[], slots: number, horizon: number): BatchingRun[] {
  const runs: BatchingRun[] = []
  let next = 0
  let t = 0
  while (t < horizon && next < lengths.length) {
    let longest = 0
    for (let slot = 0; slot < slots && next < lengths.length; slot++) {
      runs.push({ id: next, slot, start: t, length: lengths[next] })
      longest = Math.max(longest, lengths[next])
      next++
    }
    t += longest
  }
  return runs
}

/**
 * Continuous (iteration-level) batching: whenever a slot frees up after a
 * decode step, the next request from the same queue joins immediately.
 */
export function batchingContinuous(lengths: number[], slots: number, horizon: number): BatchingRun[] {
  const runs: BatchingRun[] = []
  const freeAt = Array.from({ length: slots }, () => 0)
  let next = 0
  while (next < lengths.length) {
    let slot = 0
    for (let s = 1; s < slots; s++) if (freeAt[s] < freeAt[slot]) slot = s
    if (freeAt[slot] >= horizon) break
    runs.push({ id: next, slot, start: freeAt[slot], length: lengths[next] })
    freeAt[slot] += lengths[next]
    next++
  }
  return runs
}

/** Occupied slot-steps and finished requests within [0, upTo). */
export function batchingOccupancy(runs: BatchingRun[], slots: number, upTo: number) {
  let occupied = 0
  let completed = 0
  for (const r of runs) {
    const end = r.start + r.length
    occupied += Math.max(0, Math.min(end, upTo) - Math.min(r.start, upTo))
    if (end <= upTo) completed++
  }
  return { occupied, completed, share: upTo > 0 ? occupied / (slots * upTo) : 0 }
}

export interface ChunkedPrefillInput {
  promptTokens: number
  runningDecodes: number
  /** Token budget per engine step; null = whole prompt in one prefill step. */
  chunkBudget: number | null
  /** Time to stream the weights once per step (ms). */
  weightReadMs: number
  /** Matrix-compute time per processed token (ms). */
  msPerToken: number
  /** Decode-only steps to show after the new request's first token. */
  tailSteps: number
}

export interface ServingStep {
  start: number
  duration: number
  prefillTokens: number
  decodeTokens: number
}

/**
 * A new prompt arrives while `runningDecodes` requests are decoding.
 * Step time = max(weight read, tokens × compute), the same lower-bound model
 * as the roofline demo; attention and KV reads are ignored.
 *
 * Without a budget the whole prompt is prefilled in one step and running
 * decodes pause for it (prefill-first scheduling). With a budget, decodes are
 * scheduled first and the prompt fills the remaining budget chunk by chunk.
 */
export function chunkedPrefillTimeline(input: ChunkedPrefillInput) {
  const { promptTokens, runningDecodes, chunkBudget, weightReadMs, msPerToken, tailSteps } = input
  const stepTime = (tokens: number) => Math.max(weightReadMs, tokens * msPerToken)
  const steps: ServingStep[] = []
  let t = 0
  const push = (prefillTokens: number, decodeTokens: number) => {
    const duration = stepTime(prefillTokens + decodeTokens)
    steps.push({ start: t, duration, prefillTokens, decodeTokens })
    t += duration
  }

  if (chunkBudget === null) {
    push(promptTokens, 0)
  } else {
    const share = chunkBudget - runningDecodes
    if (share <= 0) throw new Error('chunk budget must exceed running decodes')
    let remaining = promptTokens
    while (remaining > 0) {
      const chunk = Math.min(share, remaining)
      push(chunk, runningDecodes)
      remaining -= chunk
    }
  }
  const ttft = t
  for (let i = 0; i < tailSteps; i++) push(0, runningDecodes + 1)

  // Gap between two consecutive tokens of an already running request.
  let worstGap = 0
  let lastToken = 0
  for (const s of steps) {
    if (s.decodeTokens > 0) {
      worstGap = Math.max(worstGap, s.start + s.duration - lastToken)
      lastToken = s.start + s.duration
    }
  }
  return { steps, ttft, worstGap, total: t, decodeStep: stepTime(runningDecodes + 1) }
}
