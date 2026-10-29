'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

interface PromptVersion {
  prompt: string
  output: string
  note: string
}

function VersionCard({ version, kind }: { version: PromptVersion; kind: 'before' | 'after' }) {
  const { t } = useTranslation()
  const c = t.promptBasics
  const isAfter = kind === 'after'
  const accent = isAfter
    ? { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10' }
    : { border: 'border-orange-500/30', text: 'text-orange-400', bg: 'bg-orange-500/10' }

  return (
    <div className={`flex flex-col rounded-xl border ${accent.border} bg-background p-4`}>
      <span className={`self-start rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${accent.bg} ${accent.text}`}>
        {isAfter ? c.afterLabel : c.beforeLabel}
      </span>
      <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{c.promptLabel}</h4>
      <pre className="mt-1 whitespace-pre-wrap break-words rounded-lg border border-border bg-surface p-3 font-mono text-sm text-text">
        {version.prompt}
      </pre>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{c.outputLabel}</h4>
        <span className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted">{c.illustrativeBadge}</span>
      </div>
      <pre className="mt-1 whitespace-pre-wrap break-words rounded-lg border border-dashed border-border bg-surface/60 p-3 text-sm text-muted">
        {version.output}
      </pre>
      <p className={`mt-4 text-sm leading-relaxed ${isAfter ? 'text-text' : 'text-muted'}`}>
        <span className={`font-semibold ${accent.text}`}>→ </span>
        {version.note}
      </p>
    </div>
  )
}

export function PromptBeforeAfterDemo() {
  const { t } = useTranslation()
  const c = t.promptBasics
  const [active, setActive] = useState(0)
  const pair = c.pairs[active]

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div role="tablist" aria-label={c.pairsTitle} className="flex flex-wrap gap-2">
        {c.pairs.map((p, i) => (
          <button
            key={p.label}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              active === i
                ? 'border-primary/40 bg-primary/20 text-primary-light'
                : 'border-border bg-background text-muted hover:text-text'
            }`}
          >
            <span className="mr-1.5 text-xs opacity-70">{i + 1}</span>
            {p.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mt-5 grid gap-4 lg:grid-cols-2"
        >
          <VersionCard version={pair.before} kind="before" />
          <VersionCard version={pair.after} kind="after" />
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-xs leading-relaxed text-muted">{c.illustrativeNote}</p>
    </div>
  )
}
