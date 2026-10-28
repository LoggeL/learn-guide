// Tabular world-model demo: an agent explores a gridworld, records every
// observed transition (s, a) -> s', and plans inside that learned model.
// Everything here is deterministic given the seed, so the demo is reproducible.

export const WM_SIZE = 6
export type Cell = { x: number; y: number }
export type WmAction = 'up' | 'right' | 'down' | 'left'

export const WM_ACTIONS: { id: WmAction; dx: number; dy: number; label: string }[] = [
  { id: 'right', dx: 1, dy: 0, label: '→' },
  { id: 'down', dx: 0, dy: 1, label: '↓' },
  { id: 'left', dx: -1, dy: 0, label: '←' },
  { id: 'up', dx: 0, dy: -1, label: '↑' },
]

export const WM_START: Cell = { x: 0, y: 0 }
export const WM_GOAL: Cell = { x: 5, y: 5 }
export const WM_WALLS = new Set(['3,0', '3,1', '3,2', '1,4', '2,4'])
export const WM_TRAPS = new Set(['5,4'])

export const cellKey = (c: Cell) => `${c.x},${c.y}`
const transitionKey = (c: Cell, a: WmAction) => `${cellKey(c)}|${a}`

export const isGoal = (c: Cell) => c.x === WM_GOAL.x && c.y === WM_GOAL.y
export const isTrap = (c: Cell) => WM_TRAPS.has(cellKey(c))
export const isTerminal = (c: Cell) => isGoal(c) || isTrap(c)

function actionById(a: WmAction) {
  return WM_ACTIONS.find((item) => item.id === a)!
}

/** Intended target of a move, ignoring walls (used for the optimistic default). */
function intended(c: Cell, a: WmAction): Cell {
  const { dx, dy } = actionById(a)
  return {
    x: Math.max(0, Math.min(WM_SIZE - 1, c.x + dx)),
    y: Math.max(0, Math.min(WM_SIZE - 1, c.y + dy)),
  }
}

/** The real environment: walls block, the agent stays in place. */
export function realStep(c: Cell, a: WmAction): Cell {
  const next = intended(c, a)
  return WM_WALLS.has(cellKey(next)) ? c : next
}

export type WorldModel = {
  transitions: Map<string, Cell>
  /** Cells the agent has actually stood on. */
  visited: Set<string>
  /** Cells the agent tried to enter but was blocked (inferred walls). */
  blocked: Set<string>
  /** Cells observed to end the episode with a penalty. */
  traps: Set<string>
}

export function emptyModel(): WorldModel {
  return {
    transitions: new Map(),
    visited: new Set([cellKey(WM_START)]),
    blocked: new Set(),
    traps: new Set(),
  }
}

export function cloneModel(m: WorldModel): WorldModel {
  return {
    transitions: new Map(m.transitions),
    visited: new Set(m.visited),
    blocked: new Set(m.blocked),
    traps: new Set(m.traps),
  }
}

/** Store one real transition in the model (mutates). */
export function record(m: WorldModel, c: Cell, a: WmAction, next: Cell) {
  m.transitions.set(transitionKey(c, a), next)
  m.visited.add(cellKey(next))
  const target = intended(c, a)
  if (next.x === c.x && next.y === c.y && cellKey(target) !== cellKey(c)) {
    m.blocked.add(cellKey(target))
  }
  if (isTrap(next)) m.traps.add(cellKey(next))
}

/** Learned dynamics: a recorded transition if one exists, otherwise the optimistic guess. */
export function modelStep(m: WorldModel, c: Cell, a: WmAction): { next: Cell; known: boolean } {
  const known = m.transitions.get(transitionKey(c, a))
  if (known) return { next: known, known: true }
  return { next: intended(c, a), known: false }
}

export function mulberry32(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Random-walk exploration in the real environment; returns the learned model. */
export function explore(steps: number, seed: number): WorldModel {
  const m = emptyModel()
  const rand = mulberry32(seed)
  let pos = WM_START
  for (let i = 0; i < steps; i++) {
    const a = WM_ACTIONS[Math.floor(rand() * WM_ACTIONS.length)].id
    const next = realStep(pos, a)
    record(m, pos, a, next)
    pos = isTerminal(next) ? WM_START : next
  }
  return m
}

export type PlanStep = { from: Cell; action: WmAction; to: Cell; known: boolean }

/**
 * Breadth-first search inside the learned model: the shortest imagined route
 * from start to goal that avoids every cell the model believes is a trap.
 */
export function planInModel(m: WorldModel): PlanStep[] | null {
  const startKey = cellKey(WM_START)
  const prev = new Map<string, PlanStep | null>([[startKey, null]])
  const queue: Cell[] = [WM_START]
  while (queue.length) {
    const c = queue.shift()!
    if (isGoal(c)) break
    for (const { id } of WM_ACTIONS) {
      const { next, known } = modelStep(m, c, id)
      const k = cellKey(next)
      if (prev.has(k) || m.traps.has(k) || m.blocked.has(k)) continue
      prev.set(k, { from: c, action: id, to: next, known })
      queue.push(next)
    }
  }
  const goalKey = cellKey(WM_GOAL)
  if (!prev.has(goalKey)) return null
  const plan: PlanStep[] = []
  let k = goalKey
  while (k !== startKey) {
    const step = prev.get(k)!
    plan.unshift(step)
    k = cellKey(step.from)
  }
  return plan
}

export type Outcome = 'goal' | 'trap' | 'surprise'
export type Execution = {
  path: Cell[]
  executed: PlanStep[]
  outcome: Outcome
  /** Index in the plan where reality first disagreed with the model. */
  surpriseAt: number | null
}

/** Run the imagined plan open-loop in reality and stop at the first surprise. */
export function executePlan(plan: PlanStep[]): Execution {
  let pos = WM_START
  const path = [pos]
  const executed: PlanStep[] = []
  for (let i = 0; i < plan.length; i++) {
    const step = plan[i]
    const next = realStep(pos, step.action)
    executed.push({ from: pos, action: step.action, to: next, known: true })
    path.push(next)
    if (isTrap(next)) return { path, executed, outcome: 'trap', surpriseAt: i }
    if (cellKey(next) !== cellKey(step.to)) {
      return { path, executed, outcome: 'surprise', surpriseAt: i }
    }
    if (isGoal(next)) return { path, executed, outcome: 'goal', surpriseAt: null }
    pos = next
  }
  return { path, executed, outcome: 'surprise', surpriseAt: plan.length - 1 }
}

export function countValidTransitions() {
  let n = 0
  for (let y = 0; y < WM_SIZE; y++) {
    for (let x = 0; x < WM_SIZE; x++) {
      const c = { x, y }
      if (!WM_WALLS.has(cellKey(c)) && !isTerminal(c)) n += WM_ACTIONS.length
    }
  }
  return n
}

export function knownTransitionCount(m: WorldModel) {
  return m.transitions.size
}
