'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

// Illustrative session: token sizes are stated assumptions, not measurements.
const PREFIX_TOKENS = 15_000 // system prompt + tool definitions
const TRIGGER_TOKENS = 60_000 // compaction trigger chosen for the demo
const PLACEHOLDER_TOKENS = 20
const SUMMARY_TOKENS = 1_500
const KEEP_TOOL_RESULTS = 3 // Anthropic's default `keep` for clear_tool_uses_20250919
const KEEP_RECENT_TURNS = 2

type Kind = 'user' | 'assistant' | 'tool'
type Strategy = 'none' | 'window' | 'clear' | 'summary'
type ItemState = 'kept' | 'dropped' | 'cleared' | 'summarized'
type ProbeStatus = 'verbatim' | 'summary' | 'refetch' | 'lost'

const ITEMS: { kind: Kind; tokens: number; refetchable: boolean }[] = [
  { kind: 'user', tokens: 300, refetchable: false },
  { kind: 'tool', tokens: 12_000, refetchable: true },
  { kind: 'tool', tokens: 18_000, refetchable: false },
  { kind: 'assistant', tokens: 400, refetchable: false },
  { kind: 'tool', tokens: 6_000, refetchable: true },
  { kind: 'tool', tokens: 17_000, refetchable: false },
  { kind: 'assistant', tokens: 500, refetchable: false },
  { kind: 'user', tokens: 200, refetchable: false },
  { kind: 'tool', tokens: 9_000, refetchable: true },
]

// Which session item answers each probe, and whether the summary preserves it.
const PROBES: { item: number; inSummary: boolean }[] = [
  { item: 0, inSummary: true },
  { item: 3, inSummary: true },
  { item: 2, inSummary: false },
  { item: 1, inSummary: false },
  { item: 7, inSummary: true },
]

const STRATEGIES: Strategy[] = ['none', 'window', 'clear', 'summary']

function applyStrategy(strategy: Strategy): ItemState[] {
  if (strategy === 'none') return ITEMS.map(() => 'kept')
  if (strategy === 'window') {
    const states: ItemState[] = ITEMS.map(() => 'kept')
    let total = PREFIX_TOKENS + ITEMS.reduce((sum, item) => sum + item.tokens, 0)
    for (let i = 0; i < ITEMS.length && total > TRIGGER_TOKENS; i++) {
      states[i] = 'dropped'
      total -= ITEMS[i].tokens
    }
    return states
  }
  if (strategy === 'clear') {
    const toolIndices = ITEMS.flatMap((item, i) => (item.kind === 'tool' ? [i] : []))
    const keep = new Set(toolIndices.slice(-KEEP_TOOL_RESULTS))
    return ITEMS.map((item, i) => (item.kind === 'tool' && !keep.has(i) ? 'cleared' : 'kept'))
  }
  return ITEMS.map((_, i) => (i >= ITEMS.length - KEEP_RECENT_TURNS ? 'kept' : 'summarized'))
}

function itemTokens(state: ItemState, tokens: number) {
  if (state === 'kept') return tokens
  if (state === 'cleared') return PLACEHOLDER_TOKENS
  return 0
}

export function CompactionExplorer() {
  const { t, locale } = useTranslation()
  const v = t.chatCompaction.viz
  const [strategy, setStrategy] = useState<Strategy>('none')
  const fmt = (n: number) => n.toLocaleString(locale)

  const states = applyStrategy(strategy)
  const summaryActive = strategy === 'summary'
  const total =
    PREFIX_TOKENS +
    (summaryActive ? SUMMARY_TOKENS : 0) +
    ITEMS.reduce((sum, item, i) => sum + itemTokens(states[i], item.tokens), 0)
  const overBudget = total > TRIGGER_TOKENS
  const scale = PREFIX_TOKENS + ITEMS.reduce((sum, item) => sum + item.tokens, 0)

  const probeStatus = (probe: (typeof PROBES)[number]): ProbeStatus => {
    const state = states[probe.item]
    if (state === 'kept') return 'verbatim'
    if (state === 'summarized' && probe.inSummary) return 'summary'
    return ITEMS[probe.item].refetchable ? 'refetch' : 'lost'
  }

  const statusStyle: Record<ProbeStatus, string> = {
    verbatim: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    summary: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    refetch: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    lost: 'border-red-500/40 bg-red-500/10 text-red-300',
  }
  const kindStyle: Record<Kind, string> = {
    user: 'text-purple-400',
    assistant: 'text-emerald-400',
    tool: 'text-orange-400',
  }
  const kindLabel: Record<Kind, string> = { user: v.kindUser, assistant: v.kindAssistant, tool: v.kindTool }
  const stateLabel: Record<ItemState, string> = { kept: v.stateKept, dropped: v.stateDropped, cleared: v.stateCleared, summarized: v.stateSummarized }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 space-y-5">
      <p className="text-sm text-muted">{v.note}</p>

      <div className="flex flex-wrap gap-2" role="group" aria-label={v.strategyLabel}>
        {STRATEGIES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={strategy === s}
            onClick={() => setStrategy(s)}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${strategy === s ? 'border-primary bg-primary/10 text-text' : 'border-border text-muted hover:text-text'}`}
          >
            {v.strategies[s]}
          </button>
        ))}
      </div>
      <p className="text-sm text-text">{v.strategyDesc[strategy]}</p>

      {/* Budget bar */}
      <div>
        <div className="relative h-6 rounded-lg overflow-hidden bg-background border border-border">
          <motion.div
            className={`h-full ${overBudget ? 'bg-red-400/70' : 'bg-emerald-400/70'}`}
            initial={false}
            animate={{ width: `${(100 * total) / scale}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
          <div className="absolute top-0 bottom-0 border-r-2 border-dashed border-text/60" style={{ left: `${(100 * TRIGGER_TOKENS) / scale}%` }} />
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted">
          <span>{v.inContext}: <span className="font-mono text-text">{fmt(total)}</span> {v.tokens}</span>
          <span>{v.trigger}: {fmt(TRIGGER_TOKENS)}</span>
        </div>
        <p className={`mt-1 text-sm ${overBudget ? 'text-red-400' : 'text-emerald-400'}`}>{overBudget ? v.overBudget : v.underBudget}</p>
      </div>

      {/* Context contents */}
      <section>
        <h3 className="font-semibold text-text mb-2">{v.contextTitle}</h3>
        <ul className="space-y-2">
          <li className="rounded-lg border border-border bg-background/50 px-3 py-2 text-sm flex justify-between gap-3">
            <span className="text-muted">{v.prefixLabel}</span>
            <span className="font-mono text-muted">{fmt(PREFIX_TOKENS)}</span>
          </li>
          <AnimatePresence initial={false}>
            {summaryActive && (
              <motion.li
                key="summary"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-sm"
              >
                <div className="flex justify-between gap-3">
                  <span className="font-semibold text-amber-300">{v.summaryLabel}</span>
                  <span className="font-mono text-muted">{fmt(SUMMARY_TOKENS)}</span>
                </div>
                <p className="mt-1 text-muted">{v.summaryText}</p>
              </motion.li>
            )}
          </AnimatePresence>
          {ITEMS.map((item, i) => {
            const state = states[i]
            const faded = state !== 'kept'
            return (
              <motion.li
                key={i}
                layout
                className={`rounded-lg border px-3 py-2 text-sm ${faded ? 'border-border/50 bg-background/20' : 'border-border bg-background/50'}`}
                animate={{ opacity: faded ? 0.55 : 1 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${kindStyle[item.kind]}`}>{kindLabel[item.kind]}</span>
                  <span className="flex items-center gap-2">
                    {faded && <span className="text-xs rounded border border-border px-1.5 py-0.5 text-muted">{stateLabel[state]}</span>}
                    <span className="font-mono text-xs text-muted">{fmt(itemTokens(state, item.tokens))}</span>
                  </span>
                </div>
                <p className={`mt-1 ${faded ? 'line-through decoration-muted/50 text-muted' : 'text-text'}`}>
                  {state === 'cleared' ? v.placeholder : v.items[i]}
                </p>
              </motion.li>
            )
          })}
        </ul>
      </section>

      {/* Probes */}
      <section>
        <h3 className="font-semibold text-text mb-1">{v.probesTitle}</h3>
        <p className="text-sm text-muted mb-3">{v.probesDesc}</p>
        <ul className="space-y-2">
          {PROBES.map((probe, i) => {
            const status = probeStatus(probe)
            return (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm">
                <span className="text-text">{v.probes[i]}</span>
                <span className={`rounded-md border px-2 py-0.5 text-xs ${statusStyle[status]}`}>{v.status[status]}</span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
