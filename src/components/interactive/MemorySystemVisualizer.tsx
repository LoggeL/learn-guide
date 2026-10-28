'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

type Policy = 'append' | 'curated' | 'temporal'
type Decision = 'stored' | 'updated' | 'invalidated' | 'rejected' | 'skipped'
type Reason = 'appendAll' | 'fact' | 'ephemeral' | 'untrusted' | 'conflictUpdate' | 'conflictInvalidate' | 'verified'

const POLICIES: Policy[] = ['append', 'curated', 'temporal']

// Write decision of each policy for the five session events (same order as the i18n events).
const DECISIONS: Record<Policy, Decision[]> = {
  append: ['stored', 'stored', 'stored', 'stored', 'stored'],
  curated: ['stored', 'skipped', 'rejected', 'updated', 'stored'],
  temporal: ['stored', 'skipped', 'rejected', 'invalidated', 'stored'],
}
const REASONS: Record<Policy, Reason[]> = {
  append: ['appendAll', 'appendAll', 'appendAll', 'appendAll', 'appendAll'],
  curated: ['fact', 'ephemeral', 'untrusted', 'conflictUpdate', 'verified'],
  temporal: ['fact', 'ephemeral', 'untrusted', 'conflictInvalidate', 'verified'],
}

interface Entry {
  id: string
  text: string
  meta: string
  invalid?: boolean
}

export function MemorySystemVisualizer() {
  const { t } = useTranslation()
  const v = t.memorySystems.viz
  const events = v.events
  const [policy, setPolicy] = useState<Policy>('append')
  const [step, setStep] = useState(0)
  const done = step >= events.length

  const meta = (i: number) => `${events[i].source} · ${events[i].date}`

  const buildStore = (): Entry[] => {
    if (policy === 'append') {
      return events.slice(0, step).map((event, i) => ({ id: `e${i}`, text: event.text, meta: meta(i) }))
    }
    const entries: Entry[] = []
    if (policy === 'curated' && step >= 1) {
      entries.push(step >= 4
        ? { id: 'pm', text: v.facts.pmNpm, meta: `${meta(3)} · ${v.overwrote}` }
        : { id: 'pm', text: v.facts.pmPnpm, meta: meta(0) })
    }
    if (policy === 'temporal' && step >= 1) {
      entries.push({
        id: 'pnpm',
        text: v.facts.pmPnpm,
        meta: step >= 4
          ? `${v.validFrom} ${events[0].date} · ${v.validUntil} ${events[3].date}`
          : `${v.validFrom} ${events[0].date}`,
        invalid: step >= 4,
      })
      if (step >= 4) entries.push({ id: 'npm', text: v.facts.pmNpm, meta: `${v.validFrom} ${events[3].date}` })
    }
    if (step >= 5) entries.push({ id: 'build', text: v.facts.build, meta: meta(4) })
    return entries
  }

  const store = buildStore()
  const retrieved = store.filter((entry) => !entry.invalid)

  const decisionStyle: Record<Decision, string> = {
    stored: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    updated: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    invalidated: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    rejected: 'border-red-500/40 bg-red-500/10 text-red-300',
    skipped: 'border-border bg-background text-muted',
  }

  const btn = (active: boolean) =>
    `px-3 py-2 rounded-lg border text-sm transition-colors ${active ? 'border-primary bg-primary/10 text-text' : 'border-border text-muted hover:text-text'}`

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 space-y-5">
      <p className="text-sm text-muted">{v.note}</p>

      <div>
        <p className="text-sm font-semibold text-text mb-2">{v.policyLabel}</p>
        <div className="flex flex-wrap gap-2">
          {POLICIES.map((p) => (
            <button key={p} type="button" aria-pressed={policy === p} className={btn(policy === p)} onClick={() => setPolicy(p)}>
              {v.policies[p]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-text">{v.policyDesc[policy]}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Event timeline */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="font-semibold text-text">{v.eventsTitle}</h3>
            <div className="flex gap-2">
              <button type="button" className={btn(false)} disabled={done} onClick={() => setStep(step + 1)}>{v.next}</button>
              <button type="button" className={btn(false)} disabled={done} onClick={() => setStep(events.length)}>{v.all}</button>
              <button type="button" className={btn(false)} onClick={() => setStep(0)}>{v.reset}</button>
            </div>
          </div>
          <ol className="space-y-2">
            {events.map((event, i) => {
              const processed = i < step
              const decision = DECISIONS[policy][i]
              return (
                <li key={i} className={`rounded-lg border px-3 py-2 text-sm transition-opacity ${processed ? 'border-border bg-background/50' : 'border-border/40 opacity-40'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted">{event.source} · {event.date}</span>
                    {processed && <span className={`rounded-md border px-2 py-0.5 text-xs ${decisionStyle[decision]}`}>{v.decisions[decision]}</span>}
                  </div>
                  <p className="mt-1 text-text">{event.text}</p>
                  {processed && <p className="mt-1 text-xs text-muted">{v.reasons[REASONS[policy][i]]}</p>}
                </li>
              )
            })}
          </ol>
        </section>

        {/* Store */}
        <section>
          <h3 className="font-semibold text-text mb-2">{v.storeTitle}</h3>
          {store.length === 0 && <p className="text-sm text-muted">{v.storeEmpty}</p>}
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {store.map((entry) => (
                <motion.li
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: entry.invalid ? 0.55 : 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-lg border px-3 py-2 text-sm ${entry.invalid ? 'border-amber-500/30 bg-amber-500/5' : 'border-purple-500/30 bg-purple-500/5'}`}
                >
                  <p className={entry.invalid ? 'text-muted line-through' : 'text-text'}>{entry.text}</p>
                  <p className="mt-1 text-xs text-muted">{entry.meta}</p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </section>
      </div>

      {/* Retrieval in a new session */}
      <AnimatePresence>
        {done && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3"
          >
            <h3 className="font-semibold text-text">{v.queryTitle}</h3>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-1">{v.retrievedLabel}</p>
              <ul className="list-disc pl-5 text-sm text-text space-y-1">
                {retrieved.map((entry) => (
                  <li key={entry.id}>{entry.text}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-1">{v.outcomeTitle}</p>
              <p className="text-sm text-text">{v.outcomes[policy]}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-1">{v.historyQuery}</p>
              <p className="text-sm text-text">{v.historyAnswers[policy]}</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
