'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import {
  WM_SIZE,
  WM_START,
  WM_GOAL,
  WM_WALLS,
  WM_TRAPS,
  cellKey,
  cloneModel,
  countValidTransitions,
  executePlan,
  explore,
  planInModel,
  record,
  type Cell,
  type Execution,
  type PlanStep,
  type WorldModel,
} from '@/lib/world-model-grid'

type Attempt = { plan: PlanStep[] | null; execution: Execution | null }

const TOTAL_TRANSITIONS = countValidTransitions()
const cells: Cell[] = Array.from({ length: WM_SIZE * WM_SIZE }, (_, i) => ({ x: i % WM_SIZE, y: Math.floor(i / WM_SIZE) }))
const same = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y

function attempt(model: WorldModel): Attempt {
  const plan = planInModel(model)
  return { plan, execution: plan ? executePlan(plan) : null }
}

export function WorldModelPlanningDemo() {
  const { t } = useTranslation()
  const d = t.worldModels.demo
  const [exploreSteps, setExploreSteps] = useState(30)
  const [seed, setSeed] = useState(1)
  const [model, setModel] = useState<WorldModel>(() => explore(30, 1))
  const [result, setResult] = useState<Attempt | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [realSteps, setRealSteps] = useState(30)

  function restart(steps: number, nextSeed: number) {
    setExploreSteps(steps)
    setSeed(nextSeed)
    setModel(explore(steps, nextSeed))
    setResult(null)
    setAttempts(0)
    setRealSteps(steps)
  }

  function runAttempt(base: WorldModel) {
    const next = attempt(base)
    setResult(next)
    setAttempts((a) => a + 1)
    setRealSteps((s) => s + (next.execution?.executed.length ?? 0))
  }

  function learnAndRetry() {
    if (!result?.execution) return
    const updated = cloneModel(model)
    for (const step of result.execution.executed) record(updated, step.from, step.action, step.to)
    setModel(updated)
    runAttempt(updated)
  }

  const planIndex = useMemo(() => {
    const map = new Map<string, number>()
    result?.plan?.forEach((step, i) => {
      if (!map.has(cellKey(step.to))) map.set(cellKey(step.to), i + 1)
    })
    return map
  }, [result])

  const realIndex = useMemo(() => {
    const map = new Map<string, number>()
    result?.execution?.path.slice(1).forEach((c, i) => {
      if (!map.has(cellKey(c))) map.set(cellKey(c), i + 1)
    })
    return map
  }, [result])

  const execution = result?.execution ?? null
  const failCell: Cell | null = execution
    ? execution.outcome === 'trap'
      ? execution.path[execution.path.length - 1]
      : execution.outcome === 'surprise' && execution.surpriseAt !== null && result?.plan
        ? result.plan[execution.surpriseAt].to
        : null
    : null

  const outcomeText = !result
    ? d.idle
    : !result.plan || !execution
      ? d.noPlan
      : execution.outcome === 'goal'
        ? d.outcomeGoal
        : (execution.outcome === 'trap' ? d.outcomeTrap : d.outcomeSurprise).replace('{cell}', failCell ? `(${cellKey(failCell)})` : '')

  const guessed = result?.plan?.filter((s) => !s.known).length ?? 0

  const renderGrid = (view: 'model' | 'real') => (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${WM_SIZE}, minmax(0, 1fr))` }}>
      {cells.map((c) => {
        const k = cellKey(c)
        const isStart = same(c, WM_START)
        const isGoalCell = same(c, WM_GOAL)
        const wall = view === 'real' ? WM_WALLS.has(k) : model.blocked.has(k)
        const trap = view === 'real' ? WM_TRAPS.has(k) : model.traps.has(k)
        const unknown = view === 'model' && !model.visited.has(k) && !wall && !trap && !isGoalCell
        const order = view === 'model' ? planIndex.get(k) : realIndex.get(k)
        const isFail = view === 'real' && failCell !== null && same(c, failCell)
        const base = wall
          ? 'bg-slate-800 border-slate-700 text-slate-400'
          : trap
            ? 'bg-red-500/20 border-red-500/40 text-red-300'
            : isGoalCell
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : unknown
                ? 'border-dashed border-border bg-background/40 text-muted/60'
                : 'bg-background border-border text-text'
        return (
          <div key={k} className={`relative flex aspect-square items-center justify-center rounded-md border text-xs font-bold ${base} ${isFail ? 'ring-2 ring-orange-400' : ''}`}>
            {order !== undefined && !wall && (
              <motion.div
                className={`absolute inset-1 rounded ${view === 'model' ? 'bg-purple-400/30' : 'bg-cyan-400/30'}`}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: order * 0.06 }}
              />
            )}
            <span className="relative z-10">
              {wall ? '■' : trap ? '✕' : isGoalCell ? '★' : isStart ? 'S' : order !== undefined ? order : unknown ? '?' : ''}
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{d.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{d.intro}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="flex justify-between text-sm mb-1">
            <span className="text-muted">{d.exploreLabel}</span>
            <span className="font-mono text-text">{exploreSteps}</span>
          </span>
          <input
            aria-label={d.exploreLabel}
            type="range"
            min={0}
            max={300}
            step={10}
            value={exploreSteps}
            onChange={(e) => restart(Number(e.target.value), seed)}
            className="w-full"
          />
        </label>
        <button type="button" onClick={() => restart(exploreSteps, seed + 1)} className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-text hover:border-primary/50">
          {d.seed}
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <div className="mb-2 text-sm font-semibold text-purple-300">{d.modelTitle}</div>
          {renderGrid('model')}
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold text-cyan-300">{d.realTitle}</div>
          {renderGrid('real')}
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <li>? {d.legendUnknown}</li>
        <li>■ {d.legendBlocked}</li>
        <li className="text-red-300">✕ {d.legendTrap}</li>
        <li className="text-purple-300">1, 2, 3 … {d.legendImagined}</li>
        <li className="text-cyan-300">1, 2, 3 … {d.legendReal}</li>
      </ul>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => runAttempt(model)}
          disabled={result !== null}
          className="rounded-xl bg-primary px-5 py-3 font-semibold text-background hover:opacity-90 disabled:opacity-40"
        >
          {d.plan}
        </button>
        <button
          type="button"
          onClick={learnAndRetry}
          disabled={!execution || execution.outcome === 'goal'}
          className="rounded-xl bg-secondary px-5 py-3 font-semibold text-background hover:opacity-90 disabled:opacity-40"
        >
          {d.learn}
        </button>
        <button type="button" onClick={() => restart(exploreSteps, seed)} className="rounded-xl border border-border bg-surface px-5 py-3 text-text hover:border-primary/50">
          {d.reset}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-3">
          <div className="text-xs text-muted">{d.coverage}</div>
          <div className="font-mono text-lg text-text">
            {model.transitions.size}/{TOTAL_TRANSITIONS}
          </div>
        </div>
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3">
          <div className="text-xs text-muted">{d.imaginedSteps}</div>
          <div className="font-mono text-lg text-text">
            {result?.plan?.length ?? '–'}
            {result?.plan ? <span className="ml-1 text-xs text-muted">({guessed} {d.guessedSteps})</span> : null}
          </div>
        </div>
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3">
          <div className="text-xs text-muted">{d.realSteps}</div>
          <div className="font-mono text-lg text-text">{realSteps}</div>
        </div>
        <div className="rounded-xl border border-border bg-background p-3">
          <div className="text-xs text-muted">{d.attempts}</div>
          <div className="font-mono text-lg text-text">{attempts}</div>
        </div>
      </div>

      <p
        className={`rounded-xl border p-4 text-sm ${execution?.outcome === 'goal' ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200' : execution ? 'border-orange-500/30 bg-orange-500/5 text-orange-200' : 'border-border bg-background text-muted'}`}
        aria-live="polite"
      >
        {outcomeText}
      </p>
      <p className="text-sm text-muted leading-relaxed">{d.insight}</p>
    </div>
  )
}
