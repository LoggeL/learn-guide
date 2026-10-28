'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type Outcome = 'success' | 'partial' | 'abstain' | 'failure'

/** Outcome per constructed case: [single-pass RAG, agentic RAG]. Texts live in t.rag.cases. */
const OUTCOMES: [Outcome, Outcome][] = [
  ['success', 'success'],
  ['partial', 'success'],
  ['failure', 'abstain'],
]

const OUTCOME_STYLE: Record<Outcome, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  partial: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  abstain: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  failure: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export function RAGCaseStudyVisualizer() {
  const { t } = useTranslation()
  const r = t.rag
  const [active, setActive] = useState(0)
  const c = r.cases[active]
  const [single, agentic] = OUTCOMES[active]
  const outcomeLabel: Record<Outcome, string> = {
    success: r.outcomeSuccess,
    partial: r.outcomePartial,
    abstain: r.outcomeAbstain,
    failure: r.outcomeFailure,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {r.cases.map((item, i) => (
          <button
            key={item.label}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`min-h-11 px-4 rounded-lg border text-sm ${active === i ? 'border-primary/60 bg-primary/10 text-text' : 'border-border text-muted'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <p className="rounded-xl border border-border bg-surface p-4 font-medium">&quot;{c.query}&quot;</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: r.traditionalRag, text: c.single, outcome: single, icon: <ArrowRight size={16} className="text-blue-400" /> },
              { title: r.agenticRag, text: c.agentic, outcome: agentic, icon: <RotateCcw size={16} className="text-purple-400" /> },
            ].map(col => (
              <div key={col.title} className="rounded-xl border border-border bg-surface/50 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-semibold">{col.icon}{col.title}</span>
                  <span className={`text-xs px-2 py-1 rounded border ${OUTCOME_STYLE[col.outcome]}`}>{outcomeLabel[col.outcome]}</span>
                </div>
                <p className="text-sm text-muted">{col.text}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted"><span className="font-semibold text-text">{r.caseLesson}:</span> {c.lesson}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
