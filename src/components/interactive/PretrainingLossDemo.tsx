'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

const TARGETS = ['t1', 't2', 't3', 't4', 't5', 't6'] as const
const CONTEXT_KEYS = ['t0', 't1', 't2', 't3', 't4', 't5', 't6'] as const

// Illustrative probabilities the model assigns to the correct next token.
const PROBS = {
  early: [0.02, 0.3, 0.01, 0.2, 0.05, 0.3],
  late: [0.08, 0.85, 0.04, 0.75, 0.92, 0.6],
} as const

const MAX_NLL = 5

export function PretrainingLossDemo() {
  const { t, locale } = useTranslation()
  const tr = t.llmTraining
  const [checkpoint, setCheckpoint] = useState<'early' | 'late'>('early')
  const nf = (x: number, digits = 2) =>
    x.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const probs = PROBS[checkpoint]
  const nll = probs.map((p) => -Math.log(p))
  const mean = nll.reduce((a, b) => a + b, 0) / nll.length
  const perplexity = Math.exp(mean)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(['early', 'late'] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={checkpoint === c}
            onClick={() => setCheckpoint(c)}
            className={`rounded-lg border px-3 py-2 text-sm ${
              checkpoint === c ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-border bg-surface text-muted'
            }`}
          >
            {c === 'early' ? tr.lossEarly : tr.lossLate}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-background/60 text-xs text-muted">
            <tr>
              <th className="p-3 font-medium">{tr.lossContextCol}</th>
              <th className="p-3 font-medium">{tr.lossTokenCol}</th>
              <th className="p-3 font-medium">{tr.lossProbCol}</th>
              <th className="p-3 font-medium w-1/3">{tr.lossNllCol}</th>
            </tr>
          </thead>
          <tbody>
            {TARGETS.map((key, i) => (
              <tr key={key} className="border-t border-border">
                <td className="p-3 font-mono text-xs text-muted whitespace-pre">
                  {CONTEXT_KEYS.slice(0, i + 1).map((k) => tr.lossTokens[k]).join('')}
                </td>
                <td className="p-3 font-mono text-xs text-text whitespace-pre">{tr.lossTokens[key]}</td>
                <td className="p-3 font-mono text-xs text-text">{nf(probs[i])}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-background overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-orange-400"
                        animate={{ width: `${Math.min(100, (nll[i] / MAX_NLL) * 100)}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-xs text-text">{nf(nll[i])}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-muted">{tr.lossMean}</div>
          <div className="mt-1 font-mono text-xl text-cyan-300">{nf(mean)}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-muted">{tr.lossPerplexity}</div>
          <div className="mt-1 font-mono text-xl text-orange-300">{nf(perplexity, 1)}</div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted">{tr.lossFloor}</p>
    </div>
  )
}
