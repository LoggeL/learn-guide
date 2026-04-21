'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Archive, ChevronRight, FileSearch, Layers3, RefreshCcw, Snowflake, Zap } from 'lucide-react'

type SessionMode = 'active' | 'inactive'
type Stage = 'raw' | 'compacted' | 'retrieved' | 'expanded'

type ItemState = 'fresh' | 'summary' | 'retrieved' | 'expanded'

interface Item {
  id: string
  label: string
  detail: string
  state: ItemState
}

const activeStages: Stage[] = ['raw', 'compacted', 'retrieved', 'expanded']
const inactiveStages: Stage[] = ['compacted', 'retrieved', 'expanded']

function buildItems(mode: SessionMode, stage: Stage): Item[] {
  const base: Item[] = [
    { id: 'tail', label: 'Fresh tail', detail: 'Recent tool calls, user turns, and working state still live in hot context.', state: 'fresh' },
    { id: 'decision', label: 'Decision log', detail: 'Why the agent changed approach, what it rejected, and what remains open.', state: 'fresh' },
    { id: 'old-1', label: 'Older work block', detail: 'Earlier implementation details, failed attempts, and intermediate outputs.', state: 'fresh' },
    { id: 'old-2', label: 'Oldest archived block', detail: 'Cold history from a previous day or a resumed session that is no longer cached.', state: 'fresh' },
  ]

  if (mode === 'active') {
    if (stage === 'raw') return base
    if (stage === 'compacted') {
      return [
        base[0],
        { ...base[1], state: 'summary', detail: 'Condensed into a summary node with decisions, blockers, and references.' },
        { ...base[2], state: 'summary', detail: 'Compacted to save context while keeping the thread recoverable.' },
        { ...base[3], state: 'summary', detail: 'Archived summary for very old turns that no longer belong in hot context.' },
      ]
    }
    if (stage === 'retrieved') {
      return [
        base[0],
        { ...base[1], state: 'retrieved', detail: 'Retrieved because the current task depends on the earlier decision.' },
        { ...base[2], state: 'summary', detail: 'Still compacted because it is not relevant right now.' },
        { ...base[3], state: 'summary', detail: 'Still cold and archived.' },
      ]
    }

    return [
      base[0],
      { ...base[1], state: 'expanded', detail: 'Expanded back into richer context because the agent needs exact wording and causal detail.' },
      { ...base[2], state: 'summary', detail: 'Remains compacted to avoid context bloat.' },
      { ...base[3], state: 'summary', detail: 'Cold archive stays compacted until needed.' },
    ]
  }

  const coldBase: Item[] = [
    { id: 'cold-summary', label: 'Cold session summary', detail: 'The session is no longer cached, only its compacted history remains immediately available.', state: 'summary' },
    { id: 'cold-index', label: 'Recall index', detail: 'Entities, decisions, tasks, and timestamps make the inactive session searchable.', state: 'summary' },
    { id: 'cold-proof', label: 'Original turns', detail: 'Detailed message history exists, but should only be pulled in when exact evidence is needed.', state: 'summary' },
  ]

  if (stage === 'compacted') return coldBase
  if (stage === 'retrieved') {
    return [
      { ...coldBase[0], state: 'retrieved', detail: 'Relevant summary fetched to resume the old thread quickly.' },
      coldBase[1],
      coldBase[2],
    ]
  }

  return [
    { ...coldBase[0], state: 'retrieved', detail: 'The summary identifies the right part of the old session.' },
    { ...coldBase[1], state: 'retrieved', detail: 'The recall index helps target the exact old decision or artifact.' },
    { ...coldBase[2], state: 'expanded', detail: 'Only the necessary original turns are expanded back into context.' },
  ]
}

function stateClasses(state: ItemState) {
  switch (state) {
    case 'fresh':
      return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200'
    case 'summary':
      return 'border-purple-500/30 bg-purple-500/10 text-purple-200'
    case 'retrieved':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-200'
    case 'expanded':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
  }
}

const stageMeta: Record<Stage, { title: string; desc: string }> = {
  raw: {
    title: 'Raw live context',
    desc: 'Everything is still in-context. This is rich, but expensive and fragile as the session grows.',
  },
  compacted: {
    title: 'Compacted history',
    desc: 'Older material is compressed into navigable summaries instead of being dropped or kept verbatim.',
  },
  retrieved: {
    title: 'Targeted retrieval',
    desc: 'Only the relevant summary nodes are pulled back when the current task needs them.',
  },
  expanded: {
    title: 'On-demand expansion',
    desc: 'Exact details come from expanding specific nodes, not from guessing based on summaries alone.',
  },
}

export function CompactionExplorer() {
  const [mode, setMode] = useState<SessionMode>('active')
  const [stageIndex, setStageIndex] = useState(0)

  const stages = mode === 'active' ? activeStages : inactiveStages
  const stage = stages[Math.min(stageIndex, stages.length - 1)]

  const items = useMemo(() => buildItems(mode, stage), [mode, stage])

  const reset = () => setStageIndex(0)
  const advance = () => setStageIndex((i) => Math.min(i + 1, stages.length - 1))

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
                <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                  {mode === 'active' ? <Zap size={18} className="text-primary-light" /> : <Snowflake size={18} className="text-primary-light" />}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-text font-heading">Hot vs. Cold Context Explorer</h3>
                <p className="text-xs text-muted">See how compaction helps both overloaded live sessions and older inactive sessions.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl bg-surface-elevated border border-border overflow-hidden">
              <button
                onClick={() => { setMode('active'); setStageIndex(0) }}
                className={`px-4 py-2 text-sm transition-colors ${mode === 'active' ? 'bg-cyan-500/20 text-cyan-300' : 'text-muted hover:text-text'}`}
              >
                Active session
              </button>
              <button
                onClick={() => { setMode('inactive'); setStageIndex(0) }}
                className={`px-4 py-2 text-sm transition-colors ${mode === 'inactive' ? 'bg-purple-500/20 text-purple-300' : 'text-muted hover:text-text'}`}
              >
                Inactive session
              </button>
            </div>

            <button onClick={reset} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-muted hover:text-text">
              <RefreshCcw size={14} /> Reset
            </button>
            <button onClick={advance} disabled={stageIndex >= stages.length - 1} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary-light border border-primary/30 disabled:opacity-50">
              Next step <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="rounded-2xl bg-surface border border-border p-5">
          <h4 className="font-semibold text-text mb-4">Lifecycle</h4>
          <div className="space-y-3">
            {stages.map((s, i) => {
              const active = s === stage
              return (
                <div key={s} className={`rounded-xl border p-3 transition-all ${active ? 'border-primary/40 bg-primary/10' : 'border-border bg-background/50'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-text">{stageMeta[s].title}</p>
                      <p className="text-xs text-muted mt-1">{stageMeta[s].desc}</p>
                    </div>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${active ? 'bg-primary/20 text-primary-light' : 'bg-surface-elevated text-muted'}`}>
                      {i + 1}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-surface border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              {stage === 'raw' ? <Layers3 size={18} className="text-cyan-300" /> : stage === 'compacted' ? <Archive size={18} className="text-purple-300" /> : stage === 'retrieved' ? <FileSearch size={18} className="text-amber-300" /> : <Archive size={18} className="text-emerald-300" />}
              <div>
                <h4 className="font-semibold text-text">{stageMeta[stage].title}</h4>
                <p className="text-sm text-muted">{stageMeta[stage].desc}</p>
              </div>
            </div>

            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={`${mode}-${stage}-${item.id}`}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.22 }}
                    className={`rounded-xl border p-4 ${stateClasses(item.state)}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm mt-1 opacity-90">{item.detail}</p>
                      </div>
                      <span className="text-[11px] uppercase tracking-wide opacity-70">{item.state}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="text-sm font-medium text-cyan-200 mb-1">Active sessions</p>
              <p className="text-xs text-muted">Compact when the live tail grows too large, but keep enough fresh context to continue working smoothly.</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <p className="text-sm font-medium text-purple-200 mb-1">Inactive sessions</p>
              <p className="text-xs text-muted">Compact old sessions too, especially once they fall out of cache and need fast resumption later.</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-sm font-medium text-emerald-200 mb-1">Exact details</p>
              <p className="text-xs text-muted">Use summaries for navigation. Use expansion when you need exact commands, values, or proof.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
