'use client'

import { useMemo, useState } from 'react'

const size = 5
const start = { x: 0, y: 0 }
const goal = { x: 4, y: 4 }
const traps = new Set(['1,3', '3,1'])
const walls = new Set(['1,1', '2,1', '3,3'])
const actions = [
  { id: 'up', label: '↑', dx: 0, dy: -1 },
  { id: 'right', label: '→', dx: 1, dy: 0 },
  { id: 'down', label: '↓', dx: 0, dy: 1 },
  { id: 'left', label: '←', dx: -1, dy: 0 },
] as const

type Position = { x: number; y: number }
type Action = (typeof actions)[number]
type QTable = Record<string, Record<Action['id'], number>>

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
  if (pos.x === goal.x && pos.y === goal.y) return 10
  if (traps.has(key(pos.x, pos.y))) return -8
  return -1
}

function bestAction(table: QTable, pos: Position) {
  const values = table[key(pos.x, pos.y)]
  return [...actions].sort((a, b) => values[b.id] - values[a.id])[0]
}

function chooseAction(table: QTable, pos: Position, epsilon: number) {
  if (Math.random() * 100 < epsilon) {
    return actions[Math.floor(Math.random() * actions.length)]
  }
  return bestAction(table, pos)
}

function updateQ(table: QTable, pos: Position, action: Action, next: Position, reward: number) {
  const alpha = 0.35
  const gamma = 0.85
  const nextValues = table[key(next.x, next.y)]
  const maxNext = isTerminal(next) ? 0 : Math.max(...Object.values(nextValues))
  const current = table[key(pos.x, pos.y)][action.id]
  return current + alpha * (reward + gamma * maxNext - current)
}

export function ReinforcementLearningPlayground() {
  const [agent, setAgent] = useState<Position>(start)
  const [epsilon, setEpsilon] = useState(30)
  const [qTable, setQTable] = useState<QTable>(() => makeEmptyQTable())
  const [totalReward, setTotalReward] = useState(0)
  const [episodes, setEpisodes] = useState(0)
  const [steps, setSteps] = useState(0)
  const [log, setLog] = useState<string[]>(['Q-values start at zero. Train a few episodes and the arrows will change.'])

  const bestPolicy = useMemo(() => {
    const policy = new Map<string, Action>()
    for (const state of Object.keys(qTable)) {
      const [x, y] = state.split(',').map(Number)
      if (!isTerminal({ x, y })) policy.set(state, bestAction(qTable, { x, y }))
    }
    return policy
  }, [qTable])

  function learnOneStep(chosen?: Action) {
    const current = isTerminal(agent) ? start : agent
    const action = chosen ?? chooseAction(qTable, current, epsilon)
    const next = move(current, action)
    const reward = rewardFor(next)
    const updatedValue = updateQ(qTable, current, action, next, reward)

    setQTable((old) => ({
      ...old,
      [key(current.x, current.y)]: {
        ...old[key(current.x, current.y)],
        [action.id]: updatedValue,
      },
    }))
    setAgent(isTerminal(next) ? start : next)
    setTotalReward((r) => r + reward)
    setSteps((s) => s + 1)
    if (isTerminal(next)) setEpisodes((e) => e + 1)
    setLog((old) => [
      `${key(current.x, current.y)} ${action.label} → ${key(next.x, next.y)} reward ${reward > 0 ? '+' : ''}${reward}; Q=${updatedValue.toFixed(1)}${isTerminal(next) ? ' · episode ended' : ''}`,
      ...old,
    ].slice(0, 6))
  }

  function trainEpisode() {
    let table = structuredClone(qTable) as QTable
    let pos = start
    let rewardSum = 0
    let localSteps = 0
    const trace: string[] = []

    for (let i = 0; i < 40; i++) {
      const action = chooseAction(table, pos, epsilon)
      const next = move(pos, action)
      const reward = rewardFor(next)
      table[key(pos.x, pos.y)][action.id] = updateQ(table, pos, action, next, reward)
      rewardSum += reward
      localSteps += 1
      if (trace.length < 4) trace.push(`${action.label}${reward > 0 ? '+' : ''}${reward}`)
      if (isTerminal(next)) break
      pos = next
    }

    setQTable(table)
    setAgent(start)
    setTotalReward((r) => r + rewardSum)
    setSteps((s) => s + localSteps)
    setEpisodes((e) => e + 1)
    setLog((old) => [`Episode ${episodes + 1}: ${localSteps} steps, return ${rewardSum}. ${trace.join(' ')}`, ...old].slice(0, 6))
  }

  function resetLearning() {
    setAgent(start)
    setQTable(makeEmptyQTable())
    setTotalReward(0)
    setEpisodes(0)
    setSteps(0)
    setLog(['Learning reset: all Q-values are back to zero.'])
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">Q-learning gridworld</h3>
        <p className="text-muted text-sm">This is now actual learning, not a fixed heuristic. The agent updates Q-values after each reward, then the arrows show which action currently looks best in each state.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
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
              const policy = bestPolicy.get(k)
              const confidence = policy ? Math.min(100, Math.max(0, Math.abs(qTable[k]?.[policy.id] ?? 0) * 12)) : 0
              return (
                <div key={k} className={`aspect-square min-h-14 rounded-xl border flex flex-col items-center justify-center text-lg font-bold relative overflow-hidden ${isWall ? 'bg-slate-800 border-slate-700' : isGoal ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : isTrap ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-background border-border text-muted'}`}>
                  {!isWall && !isGoal && !isTrap && <div className="absolute inset-x-0 bottom-0 bg-primary/20" style={{ height: `${confidence}%` }} />}
                  <span className="relative z-10">{isAgent ? '🤖' : isWall ? '■' : isGoal ? '🏁' : isTrap ? '⚠' : policy?.label}</span>
                  {!isWall && !isGoal && !isTrap && <span className="relative z-10 text-[10px] font-mono text-muted/70">{Math.max(...Object.values(qTable[k])).toFixed(1)}</span>}
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
            <span>🤖 current state</span><span>🏁 +10 terminal</span><span>⚠ -8 terminal</span><span>■ wall</span><span>arrow = best learned action</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex justify-between text-sm mb-2"><span className="text-muted">Exploration ε</span><span className="font-mono text-text">{epsilon}%</span></div>
            <input aria-label="Exploration rate" type="range" min="0" max="80" value={epsilon} onChange={(e) => setEpsilon(Number(e.target.value))} className="w-full" />
            <p className="text-xs text-muted mt-2">High ε discovers the map; low ε exploits the learned Q-values.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-3"><div className="text-xs text-muted">Episodes</div><div className="text-xl font-mono text-text">{episodes}</div></div>
            <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-3"><div className="text-xs text-muted">Steps</div><div className="text-xl font-mono text-text">{steps}</div></div>
            <div className="rounded-xl bg-accent/10 border border-accent/20 p-3"><div className="text-xs text-muted">Return</div><div className="text-xl font-mono text-text">{totalReward}</div></div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => learnOneStep(actions[0])} className="col-start-2 rounded-lg border border-border bg-background p-3 hover:border-primary">↑</button>
            <button onClick={() => learnOneStep(actions[3])} className="rounded-lg border border-border bg-background p-3 hover:border-primary">←</button>
            <button onClick={() => learnOneStep(actions[2])} className="rounded-lg border border-border bg-background p-3 hover:border-primary">↓</button>
            <button onClick={() => learnOneStep(actions[1])} className="rounded-lg border border-border bg-background p-3 hover:border-primary">→</button>
          </div>
          <button onClick={() => learnOneStep()} className="w-full rounded-xl bg-primary text-background font-semibold py-3 hover:opacity-90">Let ε-greedy policy step</button>
          <button onClick={trainEpisode} className="w-full rounded-xl bg-secondary text-background font-semibold py-3 hover:opacity-90">Train one full episode</button>
          <button onClick={resetLearning} className="w-full rounded-xl border border-border bg-surface py-3 text-text hover:border-primary/50">Reset learning</button>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="text-sm font-semibold text-text mb-2">Learning trace</div>
            <div className="space-y-1 text-xs text-muted">{log.map((item, i) => <div key={i}>{item}</div>)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
