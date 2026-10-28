// Pure teaching model for agent evaluation: a tiny deterministic environment,
// recorded agent actions per trial, graders that inspect transcript or final state,
// and the unbiased pass@k / pass^k estimators. No model calls, no random numbers.

export type ToolName = 'search_orders' | 'get_order' | 'cancel_order' | 'issue_refund'

export interface ToolCall {
  tool: ToolName
  args: Record<string, string | number>
  /** Injected infrastructure fault for this call (simulates a flaky payment gateway). */
  fault?: 'gateway_timeout'
}

export interface Environment {
  order: { id: number; status: 'processing' | 'cancelled'; total: number }
  refunds: { orderId: number; amount: number }[]
}

export interface TranscriptStep {
  call: ToolCall
  ok: boolean
  result: Record<string, unknown>
}

export interface TrialScript {
  id: string
  calls: ToolCall[]
  /** Does the agent's final message tell the user that everything worked? */
  claimsSuccess: boolean
  /** Verdict of a human reviewer who read the full transcript. */
  reviewerPass: boolean
}

export interface TrialRun extends TrialScript {
  transcript: TranscriptStep[]
  finalState: Environment
}

export const ORDER_ID = 4471
export const ORDER_TOTAL = 59.9
export const REFERENCE_PATH: ToolName[] = ['get_order', 'cancel_order', 'issue_refund']

/** Every trial starts from a fresh copy of the same seed state (environment reset). */
export function initialEnvironment(): Environment {
  return { order: { id: ORDER_ID, status: 'processing', total: ORDER_TOTAL }, refunds: [] }
}

function execute(env: Environment, call: ToolCall): TranscriptStep {
  const orderId = Number(call.args.order_id)
  switch (call.tool) {
    case 'search_orders':
      return { call, ok: true, result: { orders: [{ id: env.order.id, status: env.order.status }] } }
    case 'get_order':
      if (orderId !== env.order.id) return { call, ok: false, result: { error: 'not_found' } }
      return { call, ok: true, result: { ...env.order } }
    case 'cancel_order':
      if (orderId !== env.order.id) return { call, ok: false, result: { error: 'not_found' } }
      if (env.order.status === 'cancelled') return { call, ok: false, result: { error: 'already_cancelled' } }
      env.order.status = 'cancelled'
      return { call, ok: true, result: { status: 'cancelled' } }
    case 'issue_refund': {
      if (call.fault) return { call, ok: false, result: { error: call.fault } }
      if (orderId !== env.order.id) return { call, ok: false, result: { error: 'not_found' } }
      const amount = Number(call.args.amount)
      env.refunds.push({ orderId, amount })
      return { call, ok: true, result: { refund_id: `r-${env.refunds.length}`, amount } }
    }
  }
}

export function runTrial(script: TrialScript): TrialRun {
  const env = initialEnvironment()
  const transcript = script.calls.map(call => execute(env, call))
  return { ...script, transcript, finalState: env }
}

export const trialScripts: TrialScript[] = [
  {
    id: 'clean',
    calls: [
      { tool: 'get_order', args: { order_id: ORDER_ID } },
      { tool: 'cancel_order', args: { order_id: ORDER_ID } },
      { tool: 'issue_refund', args: { order_id: ORDER_ID, amount: ORDER_TOTAL } },
    ],
    claimsSuccess: true,
    reviewerPass: true,
  },
  {
    id: 'skippedCheck',
    calls: [
      { tool: 'cancel_order', args: { order_id: ORDER_ID } },
      { tool: 'issue_refund', args: { order_id: ORDER_ID, amount: ORDER_TOTAL } },
    ],
    claimsSuccess: true,
    reviewerPass: false,
  },
  {
    id: 'falseClaim',
    calls: [
      { tool: 'get_order', args: { order_id: ORDER_ID } },
      { tool: 'cancel_order', args: { order_id: ORDER_ID } },
      { tool: 'issue_refund', args: { order_id: ORDER_ID, amount: ORDER_TOTAL }, fault: 'gateway_timeout' },
    ],
    claimsSuccess: true,
    reviewerPass: false,
  },
  {
    id: 'detour',
    calls: [
      { tool: 'search_orders', args: { customer_id: 'c-208' } },
      { tool: 'get_order', args: { order_id: ORDER_ID } },
      { tool: 'cancel_order', args: { order_id: ORDER_ID } },
      { tool: 'issue_refund', args: { order_id: ORDER_ID, amount: ORDER_TOTAL } },
    ],
    claimsSuccess: true,
    reviewerPass: true,
  },
  {
    id: 'wrongAmount',
    calls: [
      { tool: 'get_order', args: { order_id: ORDER_ID } },
      { tool: 'cancel_order', args: { order_id: ORDER_ID } },
      { tool: 'issue_refund', args: { order_id: ORDER_ID, amount: 5.99 } },
    ],
    claimsSuccess: true,
    reviewerPass: false,
  },
]

export type GraderId = 'claim' | 'outcome' | 'policy' | 'exactPath'
export const graderIds: GraderId[] = ['claim', 'outcome', 'policy', 'exactPath']

const refundedFor = (state: Environment, orderId: number) =>
  Math.round(state.refunds.filter(r => r.orderId === orderId).reduce((sum, r) => sum + r.amount, 0) * 100) / 100

export function grade(run: TrialRun, grader: GraderId): boolean {
  switch (grader) {
    // Trusts the agent's own final message.
    case 'claim':
      return run.claimsSuccess
    // Inspects the environment after the trial, not what the agent said.
    case 'outcome':
      return run.finalState.order.status === 'cancelled' && refundedFor(run.finalState, ORDER_ID) === ORDER_TOTAL
    // Trajectory constraint: the order status must be read before any refund attempt.
    case 'policy': {
      const firstRefund = run.transcript.findIndex(step => step.call.tool === 'issue_refund')
      const firstCheck = run.transcript.findIndex(step => step.call.tool === 'get_order' && step.ok)
      return firstRefund === -1 || (firstCheck !== -1 && firstCheck < firstRefund)
    }
    // Brittle trajectory match: exact tool sequence of the reference solution.
    case 'exactPath':
      return run.transcript.length === REFERENCE_PATH.length &&
        run.transcript.every((step, i) => step.call.tool === REFERENCE_PATH[i])
  }
}

/** A trial passes when every enabled grader passes (binary all-must-pass scoring). */
export function combinedVerdict(run: TrialRun, enabled: readonly GraderId[]): boolean {
  return enabled.every(grader => grade(run, grader))
}

export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  let result = 1
  for (let i = 1; i <= k; i++) result = (result * (n - k + i)) / i
  return result
}

/** Unbiased estimator (Chen et al. 2021): chance that at least one of k draws from n trials succeeds. */
export function passAtK(n: number, c: number, k: number): number {
  if (k > n || k < 1) return NaN
  if (n - c < k) return 1
  return 1 - binomial(n - c, k) / binomial(n, k)
}

/** Estimator for pass^k (Yao et al. 2024): chance that all k draws from n trials succeed. */
export function passHatK(n: number, c: number, k: number): number {
  if (k > n || k < 1) return NaN
  return binomial(c, k) / binomial(n, k)
}

export function summarize(runs: readonly TrialRun[], enabled: readonly GraderId[]) {
  const verdicts = runs.map(run => combinedVerdict(run, enabled))
  const passed = verdicts.filter(Boolean).length
  const falsePasses = runs.filter((run, i) => verdicts[i] && !run.reviewerPass).length
  const falseFails = runs.filter((run, i) => !verdicts[i] && run.reviewerPass).length
  return { verdicts, passed, falsePasses, falseFails }
}
