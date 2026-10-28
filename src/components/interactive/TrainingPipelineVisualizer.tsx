'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

const STAGES = ['pretrain', 'mid', 'sft', 'pref', 'rlvr'] as const
type StageId = (typeof STAGES)[number]

const ACCENT: Record<StageId, { border: string; soft: string; text: string; bg: string }> = {
  pretrain: { border: 'border-blue-400', soft: 'border-blue-400/40', text: 'text-blue-300', bg: 'bg-blue-500/10' },
  mid: { border: 'border-cyan-400', soft: 'border-cyan-400/40', text: 'text-cyan-300', bg: 'bg-cyan-500/10' },
  sft: { border: 'border-emerald-400', soft: 'border-emerald-400/40', text: 'text-emerald-300', bg: 'bg-emerald-500/10' },
  pref: { border: 'border-purple-400', soft: 'border-purple-400/40', text: 'text-purple-300', bg: 'bg-purple-500/10' },
  rlvr: { border: 'border-orange-400', soft: 'border-orange-400/40', text: 'text-orange-300', bg: 'bg-orange-500/10' },
}

export function TrainingPipelineVisualizer() {
  const { t } = useTranslation()
  const tr = t.llmTraining
  const [selected, setSelected] = useState<StageId>('pretrain')
  const stage = tr.stages[selected]
  const accent = ACCENT[selected]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {STAGES.map((id, i) => (
          <div key={id} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted" aria-hidden="true">→</span>}
            <button
              type="button"
              aria-pressed={selected === id}
              onClick={() => setSelected(id)}
              className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                selected === id ? `${ACCENT[id].border} ${ACCENT[id].bg} ${ACCENT[id].text}` : 'border-border bg-surface text-muted hover:text-text'
              }`}
            >
              <span className="mr-1.5 font-mono text-xs opacity-70">{i + 1}</span>
              {tr.stages[id].name}
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid gap-4 lg:grid-cols-2"
        >
          <dl className="space-y-3 rounded-xl border border-border bg-surface p-5 text-sm">
            {[
              [tr.pipelineObjective, stage.objective],
              [tr.pipelineData, stage.data],
              [tr.pipelineScale, stage.scale],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className={`text-xs font-bold uppercase tracking-wide ${accent.text}`}>{label}</dt>
                <dd className="mt-1 leading-relaxed text-muted">{value}</dd>
              </div>
            ))}
          </dl>
          <div className={`space-y-3 rounded-xl border ${accent.soft} ${accent.bg} p-5`}>
            <div className="text-xs font-bold uppercase tracking-wide text-muted">{tr.pipelinePrompt}</div>
            <div className="rounded-lg bg-background/70 px-3 py-2 font-mono text-sm text-text">{tr.pipelinePromptText}</div>
            <div className="text-xs font-bold uppercase tracking-wide text-muted">{tr.pipelineOutput}</div>
            <motion.div
              key={`${selected}-out`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`rounded-lg bg-background/70 px-3 py-2 font-mono text-sm ${accent.text}`}
            >
              {stage.output}
            </motion.div>
            <div className="text-xs font-bold uppercase tracking-wide text-muted">{tr.pipelineWhy}</div>
            <p className="text-sm leading-relaxed text-muted">{stage.note}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
