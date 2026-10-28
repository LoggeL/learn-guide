/**
 * Teaching model for the orchestration page: one agent working through K subtasks
 * in a single context vs. an orchestrator that delegates each subtask to a fresh subagent.
 *
 * All sizes are assumptions chosen for teaching (documented on the page). Cost uses
 * Anthropic's standard price ratios relative to base input tokens:
 * cache write 1.25×, cache read 0.1×, output 5×
 * (https://platform.claude.com/docs/en/about-claude/pricing).
 */

export const ORCH_ASSUMPTIONS = {
  mainPrompt: 3000, // system prompt + task of the main agent / orchestrator
  subSystem: 2000, // subagent system prompt
  brief: 500, // brief the orchestrator writes per subagent (output tokens)
  callsPerSubtask: 3, // tool calls per subtask
  stepOutput: 200, // model output per tool-calling step
  answer: 1000, // final answer
  secondsPerSubtask: 30,
  secondsPerModelCall: 10, // planning / synthesis / final answer call
  contextScale: 200_000, // reference window for the bars
} as const

export const PRICE = { cacheWrite: 1.25, cacheRead: 0.1, output: 5 } as const

export interface OrchestrationParams {
  subtasks: number
  toolOutput: number // raw tool output per subtask (tokens)
  summary: number // summary each subagent returns (tokens)
  overhead: number // context each subagent must rediscover (tokens)
  dependent: boolean
}

/** Composition of a context window at its largest point (tokens). */
export interface WindowBreakdown {
  base: number
  overhead: number
  previous: number
  tool: number
  summaries: number
  output: number
}

export interface RunResult {
  peak: number
  cost: number
}

/**
 * Simulates an agent loop with prompt caching. Each call reads the previous prompt
 * as a cached prefix and the newest tokens (last output + tool result) as fresh cache writes.
 */
export function simulateLoop(initial: number, outputs: number[], toolResults: number[]): RunResult {
  let prompt = 0
  let fresh = initial
  let cost = 0
  let peak = 0
  outputs.forEach((out, i) => {
    cost += PRICE.cacheRead * prompt + PRICE.cacheWrite * fresh
    prompt += fresh
    cost += PRICE.output * out
    peak = Math.max(peak, prompt + out)
    fresh = out + (toolResults[i] ?? 0)
  })
  return { peak, cost }
}

function sum(values: WindowBreakdown) {
  return values.base + values.overhead + values.previous + values.tool + values.summaries + values.output
}

export function compareOrchestration(p: OrchestrationParams) {
  const a = ORCH_ASSUMPTIONS
  const k = p.subtasks
  const perCall = p.toolOutput / a.callsPerSubtask
  const toolSteps = k * a.callsPerSubtask

  // Single agent: one context, every tool result stays in it.
  const singleOutputs = [...Array(toolSteps).fill(a.stepOutput), a.answer]
  const singleTools = Array(toolSteps).fill(perCall)
  const single = simulateLoop(a.mainPrompt, singleOutputs, singleTools)
  const singleWindow: WindowBreakdown = {
    base: a.mainPrompt,
    overhead: 0,
    previous: 0,
    tool: k * p.toolOutput,
    summaries: 0,
    output: toolSteps * a.stepOutput + a.answer,
  }

  // Subagents: fresh context each, return only a summary.
  const subOutputs = [...Array(a.callsPerSubtask).fill(a.stepOutput), p.summary]
  const subTools = Array(a.callsPerSubtask).fill(perCall)
  const subWindows: WindowBreakdown[] = []
  let subCost = 0
  for (let i = 0; i < k; i++) {
    const previous = p.dependent ? i * p.summary : 0
    const run = simulateLoop(a.subSystem + a.brief + p.overhead + previous, subOutputs, subTools)
    subCost += run.cost
    subWindows.push({
      base: a.subSystem + a.brief,
      overhead: p.overhead,
      previous,
      tool: p.toolOutput,
      summaries: 0,
      output: a.callsPerSubtask * a.stepOutput + p.summary,
    })
  }

  // Orchestrator: plan call writes K briefs, synthesis call reads K summaries.
  const orch = simulateLoop(a.mainPrompt, [k * a.brief, a.answer], [k * p.summary])
  const orchWindow: WindowBreakdown = {
    base: a.mainPrompt,
    overhead: 0,
    previous: 0,
    tool: 0,
    summaries: k * p.summary,
    output: k * a.brief + a.answer,
  }

  const singleTime = k * a.secondsPerSubtask + a.secondsPerModelCall
  const multiTime = 2 * a.secondsPerModelCall + (p.dependent ? k : 1) * a.secondsPerSubtask

  return {
    single: {
      window: singleWindow,
      peak: sum(singleWindow),
      cost: single.cost,
      time: singleTime,
      hidden: 0,
    },
    multi: {
      orchestrator: orchWindow,
      subagents: subWindows,
      peak: sum(orchWindow),
      largestSubagent: Math.max(...subWindows.map(sum)),
      cost: orch.cost + subCost,
      time: multiTime,
      hidden: k * p.toolOutput,
    },
  }
}

export function windowTotal(w: WindowBreakdown) {
  return sum(w)
}
