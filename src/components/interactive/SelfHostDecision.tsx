'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server, Cloud, KeyRound } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type QuestionKey = 'offline' | 'residency' | 'frontier' | 'finetune' | 'volume' | 'team'
type ResultKey = 'selfHost' | 'hostedOpen' | 'closedApi'
type ReasonKey =
  | 'offline'
  | 'residencyTeam'
  | 'residencyNoTeam'
  | 'frontierResidency'
  | 'frontier'
  | 'finetune'
  | 'volume'
  | 'noTeam'
  | 'fallback'

type Answers = Record<QuestionKey, boolean>

const QUESTIONS: QuestionKey[] = ['offline', 'residency', 'frontier', 'finetune', 'volume', 'team']

/**
 * Explicit, ordered rules. Hard constraints (offline, data residency) come first,
 * then capability needs, then economics. Every rule that fires is shown as a reason.
 */
export function decide(a: Answers): { result: ResultKey; reasons: ReasonKey[] } {
  const reasons: ReasonKey[] = []

  if (a.offline) {
    reasons.push('offline')
    if (!a.team) reasons.push('noTeam')
    return { result: 'selfHost', reasons }
  }

  if (a.residency) {
    if (a.frontier) reasons.push('frontierResidency')
    if (a.team) {
      reasons.push('residencyTeam')
      if (a.volume) reasons.push('volume')
      if (a.finetune) reasons.push('finetune')
      return { result: 'selfHost', reasons }
    }
    reasons.push('residencyNoTeam')
    if (a.finetune) reasons.push('finetune')
    return { result: 'hostedOpen', reasons }
  }

  if (a.finetune) {
    reasons.push('finetune')
    if (a.team && a.volume) {
      reasons.push('volume')
      return { result: 'selfHost', reasons }
    }
    if (!a.team) reasons.push('noTeam')
    return { result: 'hostedOpen', reasons }
  }

  if (a.frontier) {
    reasons.push('frontier')
    return { result: 'closedApi', reasons }
  }

  if (a.volume && a.team) {
    reasons.push('volume')
    return { result: 'selfHost', reasons }
  }

  reasons.push('fallback')
  return { result: 'closedApi', reasons }
}

const RESULT_STYLE: Record<ResultKey, { cls: string; Icon: typeof Server }> = {
  selfHost: { cls: 'border-emerald-500/30 from-emerald-500/10 to-teal-500/5 text-emerald-400', Icon: Server },
  hostedOpen: { cls: 'border-cyan-500/30 from-cyan-500/10 to-blue-500/5 text-cyan-400', Icon: Cloud },
  closedApi: { cls: 'border-purple-500/30 from-purple-500/10 to-pink-500/5 text-purple-400', Icon: KeyRound },
}

export function SelfHostDecision() {
  const { t } = useTranslation()
  const o = t.openSource
  const [answers, setAnswers] = useState<Answers>({
    offline: false,
    residency: true,
    frontier: false,
    finetune: false,
    volume: false,
    team: false,
  })

  const { result, reasons } = decide(answers)
  const { cls, Icon } = RESULT_STYLE[result]
  const titles: Record<ResultKey, string> = {
    selfHost: o.results.selfHost,
    hostedOpen: o.results.hostedOpen,
    closedApi: o.results.closedApi,
  }
  const descs: Record<ResultKey, string> = {
    selfHost: o.results.selfHostDesc,
    hostedOpen: o.results.hostedOpenDesc,
    closedApi: o.results.closedApiDesc,
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
      <ul className="space-y-2">
        {QUESTIONS.map((q) => (
          <li
            key={q}
            className="flex flex-col gap-2 rounded-xl border border-border bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm text-text">{o.questions[q]}</span>
            <div className="flex shrink-0 gap-1" role="group" aria-label={o.questions[q]}>
              {[true, false].map((value) => {
                const selected = answers[q] === value
                return (
                  <button
                    key={String(value)}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q]: value }))}
                    className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                      selected
                        ? 'border-primary/50 bg-primary/15 text-text'
                        : 'border-border text-muted hover:text-text'
                    }`}
                  >
                    {value ? o.answerYes : o.answerNo}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ul>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${result}-${reasons.join('-')}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className={`rounded-xl border bg-gradient-to-br p-5 ${cls}`}
        >
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{o.recommendation}</div>
          <div className="mb-2 flex items-center gap-2 text-lg font-bold font-heading">
            <Icon size={20} />
            {titles[result]}
          </div>
          <p className="mb-4 text-sm text-muted">{descs[result]}</p>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{o.why}</div>
          <ul className="list-disc space-y-1 pl-5 text-sm text-text">
            {reasons.map((r) => (
              <li key={r}>{o.reasons[r]}</li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
