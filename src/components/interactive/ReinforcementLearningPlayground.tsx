'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { Latex } from '@/components/ui/Latex'

const size = 5
const start = { x: 0, y: 0 }
const goal = { x: 4, y: 4 }
const traps = new Set(['1,3', '3,1'])
const walls = new Set(['1,1', '2,1', '3,3'])
const STEP_REWARD = -1
const GOAL_REWARD = 10
const TRAP_REWARD = -8
const MAX_EPISODE_STEPS = 40
const actions = [
  { id: 'up', label: '↑', dx: 0, dy: -1 },
  { id: 'right', label: '→', dx: 1, dy: 0 },
  { id: 'down', label: '↓', dx: 0, dy: 1 },
  { id: 'left', label: '←', dx: -1, dy: 0 },
] as const

type Position = { x: number; y: number }
type Action = (typeof actions)[number]
type QTable = Record<string, Record<Action['id'], number>>
type Update = {
  state: Position
  action: Action
  next: Position
  reward: number
  oldQ: number
  maxNext: number
  terminal: boolean
  newQ: number
  alpha: number
  gamma: number
}
type Episode = { steps: number; sum: number; discounted: number; finished: boolean }

function key(x: number, y: number) {
  return `${x},${y}`
}

function isTerminal(pos: Position) {
  return (pos.x === goal.x && pos.y === goal.y) || traps.has(key(pos.x, pos.y))
}

function makeEmptyQTable(): QTable {
  const table: QTable = {}
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!walls.has(key(x, y))) {
        table[key(x, y)] = { up: 0, right: 0, down: 0, left: 0 }
      }
    }
  }
  return table
}

function move(pos: Position, action: Action) {
  const next = {
    x: Math.max(0, Math.min(size - 1, pos.x + action.dx)),
    y: Math.max(0, Math.min(size - 1, pos.y + action.dy)),
  }
  return walls.has(key(next.x, next.y)) ? pos : next
}

function rewardFor(pos: Position) {
  if (pos.x === goal.x && pos.y === goal.y) return GOAL_REWARD
  if (traps.has(key(pos.x, pos.y))) return TRAP_REWARD
  return STEP_REWARD
}

/** Greedy action; ties are broken randomly so an untrained agent does not always walk up. */
function bestAction(table: QTable, pos: Position) {
  const values = table[key(pos.x, pos.y)]
  const max = Math.max(...actions.map((a) => values[a.id]))
  const best = actions.filter((a) => values[a.id] === max)
  return best[Math.floor(Math.random() * best.length)]
}

/** Display-only greedy action: null while all four values are still equal. */
function displayAction(table: QTable, pos: Position) {
  const values = table[key(pos.x, pos.y)]
  const max = Math.max(...actions.map((a) => values[a.id]))
  const best = actions.filter((a) => values[a.id] === max)
  return best.length === actions.length ? null : best[0]
}

function chooseAction(table: QTable, pos: Position, epsilon: number) {
  if (Math.random() * 100 < epsilon) {
    return actions[Math.floor(Math.random() * actions.length)]
  }
  return bestAction(table, pos)
}

/** One Q-learning update: Q ← Q + α (r + γ·max Q(s′,·) − Q). Mutates the table. */
function applyUpdate(
  table: QTable,
  state: Position,
  action: Action,
  alpha: number,
  gamma: number,
): Update {
  const next = move(state, action)
  const reward = rewardFor(next)
  const terminal = isTerminal(next)
  const maxNext = terminal ? 0 : Math.max(...Object.values(table[key(next.x, next.y)]))
  const oldQ = table[key(state.x, state.y)][action.id]
  const newQ = oldQ + alpha * (reward + gamma * maxNext - oldQ)
  table[key(state.x, state.y)][action.id] = newQ
  return { state, action, next, reward, oldQ, maxNext, terminal, newQ, alpha, gamma }
}

function cloneTable(table: QTable): QTable {
  const copy: QTable = {}
  for (const [k, v] of Object.entries(table)) copy[k] = { ...v }
  return copy
}

const fmt = (n: number) => (Math.abs(n) < 0.005 ? '0.00' : n.toFixed(2))

function cellColor(value: number) {
  const strength = Math.min(1, Math.abs(value) / 8)
  if (value > 0) return `rgba(16, 185, 129, ${0.08 + strength * 0.4})`
  if (value < 0) return `rgba(239, 68, 68, ${0.06 + strength * 0.35})`
  return 'transparent'
}

export function ReinforcementLearningPlayground() {
  const { t } = useTranslation()
  const c = t.reinforcementLearning.playground
  const [agent, setAgent] = useState<Position>(start)
  const [epsilon, setEpsilon] = useState(30)
  const [alpha, setAlpha] = useState(0.35)
  const [gamma, setGamma] = useState(0.85)
  const [qTable, setQTable] = useState<QTable>(() => makeEmptyQTable())
  const [steps, setSteps] = useState(0)
  const [current, setCurrent] = useState<Episode>({ steps: 0, sum: 0, discounted: 0, finished: false })
  const [history, setHistory] = useState<Episode[]>([])
  const [lastUpdate, setLastUpdate] = useState<Update | null>(null)
  const [selected, setSelected] = useState<Position | null>(null)
  const [log, setLog] = useState<string[]>([c.startLog])

  const policy = useMemo(() => {
    const map = new Map<string, Action | null>()
    for (const state of Object.keys(qTable)) {
      const [x, y] = state.split(',').map(Number)
      if (!isTerminal({ x, y })) map.set(state, displayAction(qTable, { x, y }))
    }
    return map
  }, [qTable])

  const describe = (u: Update) =>
    `(${key(u.state.x, u.state.y)}) ${u.action.label} (${key(u.next.x, u.next.y)}) · r = ${u.reward > 0 ? '+' : ''}${u.reward} · Q: ${fmt(u.oldQ)} → ${fmt(u.newQ)}${u.terminal ? ' · ' + c.ended : ''}`

  /** Run `count` updates starting from the current agent state; shared by all buttons. */
  function run(choose: (table: QTable, pos: Position) => Action, mode: 'step' | 'episodes', count: number) {
    const table = cloneTable(qTable)
    let pos = agent
    let episode = { ...current }
    const finished: Episode[] = []
    const lines: string[] = []
    let update: Update | null = null
    let taken = 0

    const closeEpisode = (done: boolean) => {
      const ep = { ...episode, finished: done }
      finished.push(ep)
      lines.push(
        `${c.episodeLabel} ${history.length + finished.length}: ${ep.steps} ${c.steps}, ${c.sumLabel} ${ep.sum}, G₀ = ${ep.discounted.toFixed(2)}${done ? '' : ' · ' + c.truncated}`,
      )
      episode = { steps: 0, sum: 0, discounted: 0, finished: false }
      pos = start
    }

    const doStep = (action: Action) => {
      update = applyUpdate(table, pos, action, alpha, gamma)
      episode = {
        steps: episode.steps + 1,
        sum: episode.sum + update.reward,
        discounted: episode.discounted + Math.pow(gamma, episode.steps) * update.reward,
        finished: false,
      }
      taken += 1
      if (mode === 'step') lines.push(describe(update))
      if (update.terminal) closeEpisode(true)
      else {
        pos = update.next
        if (episode.steps >= MAX_EPISODE_STEPS) closeEpisode(false)
      }
    }

    if (mode === 'step') {
      doStep(choose(table, pos))
    } else {
      for (let e = 0; e < count; e++) {
        const target = history.length + finished.length + 1
        while (history.length + finished.length < target) doStep(choose(table, pos))
      }
    }

    setQTable(table)
    setAgent(pos)
    setCurrent(episode)
    setSteps((s) => s + taken)
    if (finished.length) setHistory((h) => [...h, ...finished].slice(-200))
    setLastUpdate(update)
    setLog((old) => [...lines.reverse(), ...old].slice(0, 6))
  }

  const stepEpsilon = (table: QTable, pos: Position) => chooseAction(table, pos, epsilon)

  function resetLearning() {
    setAgent(start)
    setQTable(makeEmptyQTable())
    setSteps(0)
    setCurrent({ steps: 0, sum: 0, discounted: 0, finished: false })
    setHistory([])
    setLastUpdate(null)
    setLog([c.startLog])
  }

  const lastEpisode = history[history.length - 1]
  const recent = history.slice(-30)
  const maxSteps = Math.max(MAX_EPISODE_STEPS, ...recent.map((e) => e.steps))
  const selectedValues = selected ? qTable[key(selected.x, selected.y)] : null

  const sliders: [string, number, (n: number) => void, number, number, number, string][] = [
    [c.alpha, alpha, setAlpha, 0.05, 1, 0.05, alpha.toFixed(2)],
    [c.gamma, gamma, setGamma, 0, 0.99, 0.01, gamma.toFixed(2)],
    [c.epsilon, epsilon, setEpsilon, 0, 80, 1, `${epsilon}%`],
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{c.title}</h3>
        <p className="text-muted text-sm">{c.intro}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface/50 p-4">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
              {Array.from({ length: size * size }, (_, i) => {
                const x = i % size
                const y = Math.floor(i / size)
                const k = key(x, y)
                const isAgent = agent.x === x && agent.y === y
                const isGoal = goal.x === x && goal.y === y
                const isTrap = traps.has(k)
                const isWall = walls.has(k)
                const plain = !isWall && !isGoal && !isTrap
                const maxQ = plain ? Math.max(...Object.values(qTable[k])) : 0
                const isSelected = selected?.x === x && selected?.y === y
                return (
                  <button
                    type="button"
                    key={k}
                    disabled={!plain}
                    onClick={() => setSelected({ x, y })}
                    aria-label={`(${k})`}
                    className={`aspect-square min-h-12 rounded-xl border flex flex-col items-center justify-center text-lg font-bold relative overflow-hidden ${isWall ? 'bg-slate-800 border-slate-700' : isGoal ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : isTrap ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-background border-border text-text'} ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  >
                    {plain && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{ backgroundColor: cellColor(maxQ) }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <span className="relative z-10">
                      {isAgent ? '🤖' : isWall ? '■' : isGoal ? '+10' : isTrap ? '−8' : (policy.get(k)?.label ?? '·')}
                    </span>
                    {plain && (
                      <span className="relative z-10 text-[10px] font-mono text-muted">{fmt(maxQ)}</span>
                    )}
                  </button>
                )
              })}
            </div>
            <ul className="mt-3 grid gap-1 text-xs text-muted sm:grid-cols-2">
              <li>{c.legendStep}</li>
              <li><span className="text-emerald-300">+10</span> {c.legendGoal}</li>
              <li><span className="text-red-300">−8</span> {c.legendTrap}</li>
              <li>■ {c.legendWall}</li>
              <li>· {c.untried}</li>
              <li className="sm:col-span-2">{c.legendCell}</li>
            </ul>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="text-sm font-semibold text-text mb-2">{c.lastUpdateTitle}</div>
            {lastUpdate ? (
              <div className="space-y-2 overflow-x-auto text-sm text-text">
                <Latex block>{`Q(s,a) \\leftarrow \\underbrace{${fmt(lastUpdate.oldQ)}}_{Q(s,a)} + \\underbrace{${lastUpdate.alpha.toFixed(2)}}_{\\alpha}\\Big(\\underbrace{${lastUpdate.reward}}_{r} + \\underbrace{${lastUpdate.gamma.toFixed(2)}}_{\\gamma}\\cdot \\underbrace{${fmt(lastUpdate.maxNext)}}_{\\max_{a'} Q(s',a')} - ${fmt(lastUpdate.oldQ)}\\Big) = ${fmt(lastUpdate.newQ)}`}</Latex>
                <p className="text-xs text-muted">
                  s = ({key(lastUpdate.state.x, lastUpdate.state.y)}), a = {lastUpdate.action.label}, s′ = ({key(lastUpdate.next.x, lastUpdate.next.y)})
                  {lastUpdate.terminal ? ` · ${c.terminalNote}` : ''}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted">{c.lastUpdateEmpty}</p>
            )}
          </div>

          {selected && selectedValues && (
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-sm font-semibold text-text mb-2">
                {c.inspectTitle} ({key(selected.x, selected.y)})
              </div>
              <div className="grid grid-cols-4 gap-2 text-center font-mono text-sm">
                {actions.map((a) => (
                  <div key={a.id} className="rounded-lg border border-border bg-surface p-2">
                    <div className="text-muted">{a.label}</div>
                    <div className={selectedValues[a.id] > 0 ? 'text-emerald-300' : selectedValues[a.id] < 0 ? 'text-red-300' : 'text-text'}>
                      {fmt(selectedValues[a.id])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="text-sm font-semibold text-text mb-3">{c.historyTitle}</div>
            {recent.length ? (
              <div className="flex h-24 items-end gap-1" aria-label={c.historyTitle} role="img">
                {recent.map((ep, i) => (
                  <motion.div
                    key={history.length - recent.length + i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(ep.steps / maxSteps) * 100}%` }}
                    className={`flex-1 rounded-t ${!ep.finished ? 'bg-slate-500/60' : ep.sum > 0 ? 'bg-emerald-400/70' : 'bg-red-400/60'}`}
                    title={`${ep.steps} ${c.steps}, ${c.sumLabel} ${ep.sum}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">{c.historyEmpty}</p>
            )}
            <p className="mt-2 text-xs text-muted">{c.historyNote}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
            {sliders.map(([label, value, set, min, max, step, shown]) => (
              <label key={label} className="block">
                <span className="flex justify-between text-sm mb-1">
                  <span className="text-muted">{label}</span>
                  <span className="font-mono text-text">{shown}</span>
                </span>
                <input
                  aria-label={label}
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full"
                />
              </label>
            ))}
            <p className="text-xs text-muted">{c.epsilonNote}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-3">
              <div className="text-xs text-muted">{c.episodes}</div>
              <div className="text-xl font-mono text-text">{history.length}</div>
            </div>
            <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-3">
              <div className="text-xs text-muted">{c.steps}</div>
              <div className="text-xl font-mono text-text">{steps}</div>
            </div>
            <div className="rounded-xl bg-accent/10 border border-accent/20 p-3">
              <div className="text-xs text-muted">{c.lastReturn}</div>
              <div className="text-xl font-mono text-text">{lastEpisode ? lastEpisode.discounted.toFixed(2) : '–'}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted mb-2">{c.manual}</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { action: actions[0], cls: 'col-start-2' },
                { action: actions[3], cls: '' },
                { action: actions[2], cls: '' },
                { action: actions[1], cls: '' },
              ].map(({ action, cls }) => (
                <button
                  key={action.id}
                  type="button"
                  aria-label={action.id}
                  onClick={() => run(() => action, 'step', 1)}
                  className={`${cls} rounded-lg border border-border bg-background p-3 hover:border-primary`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => run(stepEpsilon, 'step', 1)} className="w-full rounded-xl bg-primary text-background font-semibold py-3 hover:opacity-90">
            {c.step}
          </button>
          <button type="button" onClick={() => run(stepEpsilon, 'episodes', 1)} className="w-full rounded-xl bg-secondary text-background font-semibold py-3 hover:opacity-90">
            {c.episode}
          </button>
          <button type="button" onClick={() => run(stepEpsilon, 'episodes', 20)} className="w-full rounded-xl border border-secondary/40 bg-secondary/10 text-text font-semibold py-3 hover:border-secondary">
            {c.episodes20}
          </button>
          <button type="button" onClick={resetLearning} className="w-full rounded-xl border border-border bg-surface py-3 text-text hover:border-primary/50">
            {c.reset}
          </button>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="text-sm font-semibold text-text mb-2">{c.trace}</div>
            <div className="space-y-1 font-mono text-[11px] text-muted">
              {log.map((item, i) => (
                <div key={i}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
