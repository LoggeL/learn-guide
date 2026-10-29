'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Code2, Play, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const CLAUSE_PATTERN = /§\s?\d+(?:\.\d+)?/g
const CHECK_STEP = 2

function normalizeClause(clause: string): string {
  return clause.replace(/\s+/g, '')
}

function findClauses(text: string): string[] {
  return Array.from(new Set((text.match(CLAUSE_PATTERN) ?? []).map(normalizeClause)))
}

function splitSentences(text: string): string[] {
  // A dot inside "§ 4.3" is not followed by whitespace, so clause numbers stay intact.
  return text.split(/(?<=[.!?])\s+/).filter(Boolean)
}

/**
 * Deterministic citation check: every clause cited in the draft answer must
 * appear among the clauses extracted in step 1. Sentences citing anything else
 * are removed before the final step.
 */
export function checkCitations(quotes: string, answer: string) {
  const known = new Set(findClauses(quotes))
  const results = findClauses(answer).map(clause => ({ clause, found: known.has(clause) }))
  const missing = new Set(results.filter(r => !r.found).map(r => r.clause))
  const kept = splitSentences(answer).filter(sentence => findClauses(sentence).every(c => !missing.has(c)))
  return { results, cleanedAnswer: kept.join(' ') }
}

export function PromptChainDemo() {
  const { t } = useTranslation()
  const c = t.advancedPrompting
  const steps = c.chainSteps
  const [completed, setCompleted] = useState(0)

  const check = useMemo(() => checkCitations(steps[0].output, steps[1].output), [steps])

  const outputFor = (index: number): string => {
    if (index !== CHECK_STEP) return steps[index].output
    const lines = check.results.map(r =>
      `${r.found ? '✓' : '✗'} ${(r.found ? c.chainCheckFound : c.chainCheckMissing).replace('{clause}', r.clause.replace('§', '§ '))}`
    )
    return `${lines.join('\n')}\n\n→ ${check.cleanedAnswer}`
  }

  const finished = completed >= steps.length

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <h3 className="text-lg font-bold font-heading text-text">{c.chainDemoTitle}</h3>
      <p className="mt-1 text-sm text-muted">{c.chainDemoDesc}</p>

      {/* Progress rail */}
      <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {steps.map((step, i) => {
          const isCode = i === CHECK_STEP
          const state = i < completed ? 'done' : i === completed ? 'next' : 'todo'
          return (
            <li
              key={step.title}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                state === 'done'
                  ? isCode
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                    : 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                  : state === 'next'
                    ? 'border-primary/40 text-text'
                    : 'border-border text-muted'
              }`}
            >
              {isCode ? <Code2 size={14} /> : <Bot size={14} />}
              <span className="font-medium">{i + 1}. {step.title}</span>
            </li>
          )
        })}
      </ol>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCompleted(n => Math.min(n + 1, steps.length))}
          disabled={finished}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            finished ? 'cursor-not-allowed bg-background text-muted' : 'bg-primary/20 text-primary-light hover:bg-primary/30'
          }`}
        >
          <Play size={14} />
          {c.chainRun}
        </button>
        <button
          onClick={() => setCompleted(0)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm text-muted transition-colors hover:text-text"
        >
          <RotateCcw size={14} />
          {c.chainRestart}
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <AnimatePresence initial={false}>
          {steps.slice(0, completed).map((step, i) => {
            const isCode = i === CHECK_STEP
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className={`rounded-xl border bg-background p-4 ${isCode ? 'border-cyan-500/30' : 'border-purple-500/30'}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isCode ? 'bg-cyan-500/10 text-cyan-300' : 'bg-purple-500/10 text-purple-300'}`}>
                    {isCode ? c.chainCodeStep : c.chainModelStep}
                  </span>
                  <span className="font-semibold text-text">{i + 1}. {step.title}</span>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{c.chainInput}</p>
                <p className="mt-1 text-sm text-muted">{step.prompt}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{c.chainOutput}</p>
                <pre className="mt-1 whitespace-pre-wrap break-words rounded-lg border border-border bg-surface p-3 text-sm text-text">
                  {outputFor(i)}
                </pre>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{c.chainDemoNote}</p>
    </div>
  )
}
