/**
 * Toy timeline model for the mega-kernels lesson. Pure and deterministic.
 * Time is in illustrative units; nothing here is a hardware measurement.
 *
 * Each operation is split across a few SMs. Every SM first streams its slice
 * of the weights (load) and then does a small amount of math (compute), as in
 * batch-1 decoding where weight reads dominate.
 */

export type MegaKernelMode = 'kernels' | 'graph' | 'megakernel'

export interface MegaKernelOp {
  /** Load time per SM (weights / KV slice). */
  load: number[]
  /** Compute time per SM. */
  compute: number[]
}

export interface MegaKernelSegment {
  sm: number
  op: number
  kind: 'load' | 'compute'
  start: number
  end: number
}

export interface MegaKernelTimeline {
  segments: MegaKernelSegment[]
  /** Launch gaps during which no SM works on the model. */
  gaps: { start: number; end: number }[]
  makespan: number
  /** Fraction of SM-time during which a weight/KV load is in flight. */
  loadBusy: number
}

export interface MegaKernelCosts {
  /** Gap before each kernel when every op is its own launch. */
  launchGap: number
  /** Remaining gap per kernel when the sequence is replayed as a CUDA Graph. */
  graphGap: number
}

/**
 * One decoder layer at batch size 1, split into the fused instructions used by
 * Hazy Research's Llama-1B megakernel (RMSNorm+QKV+RoPE, attention,
 * O-proj+residual, RMSNorm+up/gate+SiLU, down-proj+residual). The per-SM load
 * times are deliberately uneven to create stragglers.
 */
export const MEGA_KERNEL_LAYER: MegaKernelOp[] = [
  { load: [5, 6, 4, 5], compute: [1, 1, 1, 1] },
  { load: [3, 2, 4, 2], compute: [1, 1, 1, 1] },
  { load: [4, 4, 3, 5], compute: [1, 1, 1, 1] },
  { load: [9, 8, 10, 8], compute: [1, 1, 1, 1] },
  { load: [5, 6, 5, 4], compute: [1, 1, 1, 1] },
]

/**
 * Gap ratio follows Hazy Research's dummy-kernel measurement on H100
 * (~2.1 µs per stream launch vs. ~1.3 µs inside a CUDA Graph).
 */
export const MEGA_KERNEL_COSTS: MegaKernelCosts = { launchGap: 2.1, graphGap: 1.3 }

export function simulateMegaKernel(
  ops: MegaKernelOp[],
  mode: MegaKernelMode,
  costs: MegaKernelCosts = MEGA_KERNEL_COSTS,
): MegaKernelTimeline {
  const smCount = ops[0]?.load.length ?? 0
  const segments: MegaKernelSegment[] = []
  const gaps: { start: number; end: number }[] = []

  if (mode !== 'megakernel') {
    // One kernel per op: a launch gap, then all SMs start together and the
    // next kernel may only begin when the slowest SM has finished.
    const gap = mode === 'kernels' ? costs.launchGap : costs.graphGap
    let t = 0
    ops.forEach((op, k) => {
      gaps.push({ start: t, end: t + gap })
      const start = t + gap
      let end = start
      for (let sm = 0; sm < smCount; sm++) {
        const loadEnd = start + op.load[sm]
        const computeEnd = loadEnd + op.compute[sm]
        segments.push({ sm, op: k, kind: 'load', start, end: loadEnd })
        segments.push({ sm, op: k, kind: 'compute', start: loadEnd, end: computeEnd })
        end = Math.max(end, computeEnd)
      }
      t = end
    })
    return finish(segments, gaps, t, smCount)
  }

  // Megakernel: a single launch. Each SM streams the weights of its next
  // instruction as soon as a shared-memory buffer is free (double buffering),
  // while the math still waits for the previous op to finish on all SMs
  // (modelled as a global-memory counter reaching its target).
  const gap = costs.launchGap
  gaps.push({ start: 0, end: gap })
  const loadEnd: number[][] = []
  const computeEnd: number[][] = []
  ops.forEach((op, k) => {
    loadEnd[k] = []
    computeEnd[k] = []
    const depReady = k === 0 ? gap : Math.max(...computeEnd[k - 1])
    for (let sm = 0; sm < smCount; sm++) {
      const prevLoad = k === 0 ? gap : loadEnd[k - 1][sm]
      const bufferFree = k < 2 ? gap : computeEnd[k - 2][sm]
      const ls = Math.max(prevLoad, bufferFree)
      const le = ls + op.load[sm]
      const cs = Math.max(le, depReady)
      const ce = cs + op.compute[sm]
      loadEnd[k][sm] = le
      computeEnd[k][sm] = ce
      segments.push({ sm, op: k, kind: 'load', start: ls, end: le })
      segments.push({ sm, op: k, kind: 'compute', start: cs, end: ce })
    }
  })
  const makespan = Math.max(...computeEnd[ops.length - 1])
  return finish(segments, gaps, makespan, smCount)
}

function finish(
  segments: MegaKernelSegment[],
  gaps: { start: number; end: number }[],
  makespan: number,
  smCount: number,
): MegaKernelTimeline {
  const loadTime = segments
    .filter((s) => s.kind === 'load')
    .reduce((sum, s) => sum + (s.end - s.start), 0)
  return { segments, gaps, makespan, loadBusy: loadTime / (smCount * makespan) }
}
