'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

type BlockKind = 'system' | 'user' | 'assistant' | 'result' | 'error'

interface ContextBlock {
  id: string
  kind: BlockKind
  /** Assumed example size in tokens (not a tokenizer measurement). */
  tokens: number
}

interface LoopStep {
  /** Blocks appended to the message history in this step. */
  adds: ContextBlock[]
  /** Set for steps that are a model call. */
  stopReason?: 'tool_use' | 'end_turn'
}

// Scripted run. Each model call reads every block that exists before it.
const STEPS: LoopStep[] = [
  { adds: [{ id: 'system', kind: 'system', tokens: 1500 }, { id: 'user', kind: 'user', tokens: 60 }] },
  { adds: [{ id: 'call1', kind: 'assistant', tokens: 90 }], stopReason: 'tool_use' },
  { adds: [{ id: 'flights', kind: 'result', tokens: 800 }, { id: 'hotelError', kind: 'error', tokens: 60 }] },
  { adds: [{ id: 'call2', kind: 'assistant', tokens: 45 }], stopReason: 'tool_use' },
  { adds: [{ id: 'hotels', kind: 'result', tokens: 700 }] },
  { adds: [{ id: 'answer', kind: 'assistant', tokens: 180 }], stopReason: 'end_turn' },
]

const MAX_TURNS = 10

const kindStyles: Record<BlockKind, { border: string; text: string; bar: string }> = {
  system: { border: 'border-yellow-500/30', text: 'text-yellow-400', bar: 'bg-yellow-400/60' },
  user: { border: 'border-cyan-500/30', text: 'text-cyan-400', bar: 'bg-cyan-400/60' },
  assistant: { border: 'border-purple-500/30', text: 'text-purple-400', bar: 'bg-purple-400/60' },
  result: { border: 'border-emerald-500/30', text: 'text-emerald-400', bar: 'bg-emerald-400/60' },
  error: { border: 'border-orange-500/40', text: 'text-orange-400', bar: 'bg-orange-400/60' },
}

export function AgentLoopVisualizer() {
  const { t, locale } = useTranslation()
  const d = t.agentLoop.demo
  const [step, setStep] = useState(0)
  const fmt = (n: number) => n.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US')

  const blockLabel: Record<BlockKind, string> = {
    system: d.blockSystem,
    user: d.blockUser,
    assistant: d.blockAssistant,
    result: d.blockResult,
    error: d.blockError,
  }
  const blockContent: Record<string, string> = {
    system: d.contentSystem,
    user: d.contentUser,
    call1: d.contentCall1,
    flights: d.contentFlights,
    hotelError: d.contentHotelError,
    call2: d.contentCall2,
    hotels: d.contentHotels,
    answer: d.contentAnswer,
  }

  // Context visible after the current step, and the input size of each model call so far.
  const visibleBlocks = STEPS.slice(0, step + 1).flatMap((s) => s.adds)
  let running = 0
  const callInputs: number[] = []
  STEPS.slice(0, step + 1).forEach((s) => {
    if (s.stopReason) callInputs.push(running)
    running += s.adds.reduce((sum, b) => sum + b.tokens, 0)
  })
  const current = STEPS[step]
  const contextTokens = visibleBlocks.reduce((sum, b) => sum + b.tokens, 0)
  const thisCall = current.stopReason ? callInputs[callInputs.length - 1] : null
  const totalInput = callInputs.reduce((a, b) => a + b, 0)
  const finished = current.stopReason === 'end_turn'
  const newIds = new Set(current.adds.map((b) => b.id))

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold font-heading text-text">{d.title}</h3>
        <p className="text-sm text-muted mt-1">{d.note}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-light disabled:opacity-40"
          disabled={step === STEPS.length - 1}
          onClick={() => setStep(step + 1)}
        >
          {d.next}
        </button>
        <button className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-text" onClick={() => setStep(0)}>
          {d.reset}
        </button>
      </div>

      {/* Step explanation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`rounded-xl border p-4 ${finished ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-background/60'}`}
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono text-muted">{step + 1}/{STEPS.length}</span>
            {current.stopReason && (
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${current.stopReason === 'end_turn' ? 'border-emerald-500/40 text-emerald-400' : 'border-purple-500/40 text-purple-400'}`}>
                {d.stopReasonLabel}: {current.stopReason}
              </span>
            )}
          </div>
          <p className="text-sm text-text leading-relaxed">{d.steps[step]}</p>
          {finished && <p className="text-sm text-emerald-400 mt-2 font-semibold">{d.loopEnded}</p>}
        </motion.div>
      </AnimatePresence>

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="text-xs text-muted">{d.callsLabel}</div>
          <div className="text-lg font-bold font-mono text-text">{callInputs.length} / {MAX_TURNS}</div>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="text-xs text-muted">{d.thisCallLabel}</div>
          <div className="text-lg font-bold font-mono text-purple-400">{thisCall === null ? '–' : fmt(thisCall)}</div>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="text-xs text-muted">{d.totalLabel}</div>
          <div className="text-lg font-bold font-mono text-cyan-400">{fmt(totalInput)}</div>
        </div>
      </div>

      {/* Message history */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h4 className="text-sm font-semibold text-text">{d.contextTitle}</h4>
          <span className="text-xs font-mono text-muted">{fmt(contextTokens)} {t.agentLoop.tokens}</span>
        </div>
        <ol className="space-y-2">
          <AnimatePresence initial={false}>
            {visibleBlocks.map((block) => {
              const s = kindStyles[block.kind]
              return (
                <motion.li
                  key={block.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-lg border bg-background/60 p-3 ${s.border} ${newIds.has(block.id) && step > 0 ? 'ring-1 ring-primary/40' : ''}`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className={`text-xs font-semibold ${s.text}`}>{blockLabel[block.kind]}</span>
                    <span className="text-xs font-mono text-muted shrink-0">{fmt(block.tokens)}</span>
                  </div>
                  <p className="text-sm text-muted break-words">{blockContent[block.id]}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-border/40 overflow-hidden">
                    <motion.div
                      className={`h-full ${s.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(block.tokens / 1500) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ol>
      </div>
    </div>
  )
}
