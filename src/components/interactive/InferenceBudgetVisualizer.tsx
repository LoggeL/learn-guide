'use client'

import { useMemo, useState } from 'react'
import { Boxes, CheckCheck, Clock3, Coins, GitBranch, Gauge, TimerReset } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type Strategy = 'serial' | 'parallel' | 'verifier'
type TaskId = 'factual' | 'math' | 'code'
type Allocation = Record<Strategy, number>

interface TaskProfile {
  id: TaskId
  baseAccuracy: number
  serialGain: number
  parallelGain: number
  verifierGain: number
  serialScale: number
  parallelScale: number
  verifierScale: number
  optimalBudget: number
  baseLatency: number
  inputTokens: number
  outputTokens: number
  defaultWeights: [number, number, number]
}

const TASKS: TaskProfile[] = [
  {
    id: 'factual',
    baseAccuracy: 88,
    serialGain: 3,
    parallelGain: 2,
    verifierGain: 2,
    serialScale: 3,
    parallelScale: 3,
    verifierScale: 2,
    optimalBudget: 7,
    baseLatency: 0.7,
    inputTokens: 240,
    outputTokens: 80,
    defaultWeights: [0.5, 0.25, 0.25],
  },
  {
    id: 'math',
    baseAccuracy: 41,
    serialGain: 31,
    parallelGain: 13,
    verifierGain: 12,
    serialScale: 8,
    parallelScale: 6,
    verifierScale: 4,
    optimalBudget: 25,
    baseLatency: 1.1,
    inputTokens: 520,
    outputTokens: 240,
    defaultWeights: [0.55, 0.2, 0.25],
  },
  {
    id: 'code',
    baseAccuracy: 47,
    serialGain: 20,
    parallelGain: 12,
    verifierGain: 20,
    serialScale: 7,
    parallelScale: 7,
    verifierScale: 6,
    optimalBudget: 29,
    baseLatency: 1.4,
    inputTokens: 780,
    outputTokens: 360,
    defaultWeights: [0.38, 0.24, 0.38],
  },
]

const BUDGETS = [8, 16, 24, 36]
const STRATEGIES: Strategy[] = ['serial', 'parallel', 'verifier']

function allocateByWeights(budget: number, weights: [number, number, number]): Allocation {
  const serial = Math.round(budget * weights[0])
  const parallel = Math.round(budget * weights[1])
  return { serial, parallel, verifier: budget - serial - parallel }
}

function saturatingGain(units: number, maximum: number, scale: number) {
  return maximum * (1 - Math.exp(-units / scale))
}

export function InferenceBudgetVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.reasoningModels
  const [taskId, setTaskId] = useState<TaskId>('math')
  const [budget, setBudget] = useState(24)
  const [allocation, setAllocation] = useState<Allocation>(() => allocateByWeights(24, TASKS[1].defaultWeights))
  const task = TASKS.find((item) => item.id === taskId) ?? TASKS[1]

  const presetCopy: Record<TaskId, { title: string; description: string }> = {
    factual: { title: c.presetFactual, description: c.presetFactualDesc },
    math: { title: c.presetMath, description: c.presetMathDesc },
    code: { title: c.presetCode, description: c.presetCodeDesc },
  }

  const strategyCopy: Record<Strategy, { label: string; help: string; color: string; icon: typeof GitBranch }> = {
    serial: { label: c.serialLabel, help: c.serialHelp, color: 'bg-purple-400', icon: GitBranch },
    parallel: { label: c.parallelLabel, help: c.parallelHelp, color: 'bg-cyan-400', icon: Boxes },
    verifier: { label: c.verifierLabel, help: c.verifierHelp, color: 'bg-emerald-400', icon: CheckCheck },
  }

  const metrics = useMemo(() => {
    const serial = saturatingGain(allocation.serial, task.serialGain, task.serialScale)
    const parallel = saturatingGain(allocation.parallel, task.parallelGain, task.parallelScale)
    const verifier = saturatingGain(allocation.verifier, task.verifierGain, task.verifierScale)
    const unverifiedBreadthPenalty = Math.max(0, allocation.parallel - allocation.verifier * 2.2) * 0.16
    const accuracy = Math.min(98, task.baseAccuracy + serial + parallel + verifier - unverifiedBreadthPenalty)
    const latency = task.baseLatency + allocation.serial * 0.31 + Math.sqrt(allocation.parallel + 1) * 0.22 + allocation.verifier * 0.43
    const directTokens = task.inputTokens + task.outputTokens
    const totalTokens = Math.round(
      directTokens
      + allocation.serial * 155
      + allocation.parallel * (task.outputTokens + allocation.serial * 34)
      + allocation.verifier * 125
    )
    const cost = totalTokens * 0.00001
    const multiplier = totalTokens / directTokens
    const returnRatio = budget / task.optimalBudget
    const returns = returnRatio > 1.12 || accuracy > 94 ? 'high' : returnRatio > 0.62 ? 'medium' : 'low'

    return { accuracy, latency, totalTokens, cost, multiplier, returns }
  }, [allocation, budget, task])

  const explanations = useMemo(() => {
    const reasons: string[] = []
    if (task.id === 'factual' && budget > task.optimalBudget) reasons.push(c.reasonFactualWaste)
    if (allocation.serial >= budget * 0.35 && task.id !== 'factual') reasons.push(c.reasonSerial)
    if (allocation.parallel >= budget * 0.2) reasons.push(c.reasonParallel)
    if (allocation.verifier >= budget * 0.2 && task.id !== 'factual') reasons.push(c.reasonVerifier)
    if (allocation.parallel > allocation.verifier * 2.2) reasons.push(c.reasonNoVerifier)
    if (Math.max(...Object.values(allocation)) <= budget * 0.6) reasons.push(c.reasonBalanced)
    if (metrics.returns === 'high') reasons.push(c.reasonOverBudget)
    return reasons.slice(0, 3)
  }, [allocation, budget, c, metrics.returns, task])

  const selectTask = (nextTask: TaskProfile) => {
    setTaskId(nextTask.id)
    setAllocation(allocateByWeights(budget, nextTask.defaultWeights))
  }

  const selectBudget = (nextBudget: number) => {
    const weights: [number, number, number] = [
      allocation.serial / budget,
      allocation.parallel / budget,
      allocation.verifier / budget,
    ]
    setBudget(nextBudget)
    setAllocation(allocateByWeights(nextBudget, weights))
  }

  const transferBudget = (target: Strategy, requested: number) => {
    const nextValue = Math.max(0, Math.min(budget, requested))
    const delta = nextValue - allocation[target]
    if (delta === 0) return

    const next = { ...allocation, [target]: nextValue }
    const others = STRATEGIES.filter((strategy) => strategy !== target)

    if (delta > 0) {
      let remaining = delta
      for (const strategy of [...others].sort((a, b) => next[b] - next[a])) {
        const moved = Math.min(next[strategy], remaining)
        next[strategy] -= moved
        remaining -= moved
      }
    } else {
      next[others[0]] += Math.abs(delta)
    }

    setAllocation(next)
  }

  const returnsCopy = metrics.returns === 'high'
    ? c.returnsHigh
    : metrics.returns === 'medium'
      ? c.returnsMedium
      : c.returnsLow

  return (
    <section className="interactive-surface overflow-hidden p-4 sm:p-5 md:p-7">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <Gauge size={21} className="shrink-0 text-primary-light" />
            <h2 className="font-heading text-2xl font-bold text-gradient">{c.vizTitle}</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">{c.vizIntro}</p>
        </div>
        <span className="inline-flex max-w-full items-center gap-2 self-start rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs leading-snug text-amber-200">
          <TimerReset size={15} className="shrink-0" />
          {c.vizIllustrative}
        </span>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="min-w-0 space-y-5">
          <fieldset>
            <legend className="mb-3 text-sm font-bold text-text">{c.presetLabel}</legend>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {TASKS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={taskId === item.id}
                  onClick={() => selectTask(item)}
                  className={`min-h-[64px] rounded-xl border px-4 py-3 text-left transition-colors motion-reduce:transition-none ${
                    taskId === item.id
                      ? 'border-primary/60 bg-primary/10 shadow-[inset_3px_0_0_rgba(168,85,247,0.85)]'
                      : 'border-border bg-background/50 hover:border-primary/35'
                  }`}
                >
                  <span className="block font-heading text-sm font-bold text-text">{presetCopy[item.id].title}</span>
                  <span className="mt-1 block text-xs leading-snug text-muted">{presetCopy[item.id].description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-bold text-text">{c.budgetLabel}</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {BUDGETS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={budget === value}
                  onClick={() => selectBudget(value)}
                  className={`min-h-11 rounded-lg border px-2 text-sm font-bold tabular-nums transition-colors motion-reduce:transition-none ${
                    budget === value
                      ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200'
                      : 'border-border bg-background/50 text-muted hover:border-cyan-400/35 hover:text-text'
                  }`}
                >
                  {value} {c.unitsShort}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-border bg-background/45 p-4">
            <legend className="px-2 font-heading text-base font-bold text-text">{c.allocationTitle}</legend>
            <p className="mb-4 text-xs leading-relaxed text-muted">{c.allocationHelp}</p>
            <div className="space-y-4">
              {STRATEGIES.map((strategy) => {
                const data = strategyCopy[strategy]
                const Icon = data.icon
                return (
                  <label key={strategy} htmlFor={`budget-${strategy}`} className="block">
                    <span className="mb-1 flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 font-semibold text-text">
                        <Icon size={16} className="shrink-0 text-muted" />
                        <span className="truncate">{data.label}</span>
                      </span>
                      <span className="shrink-0 font-mono font-bold tabular-nums text-primary-light">
                        {allocation[strategy]} / {budget}
                      </span>
                    </span>
                    <span className="mb-1 block text-xs text-muted">{data.help}</span>
                    <input
                      id={`budget-${strategy}`}
                      type="range"
                      min={0}
                      max={budget}
                      step={1}
                      value={allocation[strategy]}
                      onChange={(event) => transferBudget(strategy, Number(event.target.value))}
                      className="h-11 w-full cursor-pointer accent-purple-500"
                    />
                  </label>
                )
              })}
            </div>
            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-surface" aria-hidden="true">
              {STRATEGIES.map((strategy) => (
                <div
                  key={strategy}
                  className={`${strategyCopy[strategy].color} transition-[width] duration-300 motion-reduce:transition-none`}
                  style={{ width: `${(allocation[strategy] / budget) * 100}%` }}
                />
              ))}
            </div>
          </fieldset>
        </div>

        <div className="min-w-0 rounded-2xl border border-border bg-gradient-to-br from-surface/90 via-background/70 to-cyan-950/20 p-4 sm:p-5">
          <div aria-live="polite" aria-atomic="true">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{c.resultsTitle}</p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-4xl font-bold tabular-nums text-text sm:text-5xl">{Math.round(metrics.accuracy)}%</div>
                <div className="mt-1 text-sm text-muted">{c.qualityLabel}</div>
              </div>
              <div className="rounded-xl border border-border bg-background/55 px-4 py-3 text-left sm:text-right">
                <div className="text-xs text-muted">{c.returnsLabel}</div>
                <div className={`mt-1 font-bold ${metrics.returns === 'high' ? 'text-amber-300' : metrics.returns === 'medium' ? 'text-cyan-300' : 'text-emerald-300'}`}>
                  {returnsCopy}
                </div>
              </div>
            </div>

            <div className="mt-5 h-4 overflow-hidden rounded-full border border-border bg-background">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${metrics.accuracy}%` }}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="min-w-0 rounded-xl border border-border bg-background/50 p-3 sm:p-4">
                <Clock3 size={18} className="mb-2 text-cyan-300" />
                <div className="truncate text-xs text-muted">{c.latencyLabel}</div>
                <div className="mt-1 text-lg font-bold tabular-nums text-text">{metrics.latency.toFixed(1)} {c.secondsShort}</div>
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-background/50 p-3 sm:p-4">
                <Boxes size={18} className="mb-2 text-purple-300" />
                <div className="truncate text-xs text-muted">{c.tokensLabel}</div>
                <div className="mt-1 text-lg font-bold tabular-nums text-text">{Math.round(metrics.totalTokens).toLocaleString(locale)}</div>
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-background/50 p-3 sm:p-4">
                <Coins size={18} className="mb-2 text-amber-300" />
                <div className="truncate text-xs text-muted">{c.costLabel}</div>
                <div className="mt-1 text-lg font-bold tabular-nums text-text">
                  {new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(metrics.cost)}
                </div>
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-background/50 p-3 sm:p-4">
                <Gauge size={18} className="mb-2 text-emerald-300" />
                <div className="text-xs leading-snug text-muted">{c.versusBase}</div>
                <div className="mt-1 text-lg font-bold tabular-nums text-text">{metrics.multiplier.toFixed(1)}×</div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <h3 className="font-heading text-sm font-bold text-text">{c.explanationTitle}</h3>
              <ul className="mt-3 space-y-2">
                {explanations.map((reason) => (
                  <li key={reason} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
