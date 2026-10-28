'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { learningSoftmax, normalizeVector } from '@/lib/llmLearningMath'

type Remedy = 'none' | 'qkNorm' | 'softcap'

// Fixed teaching vectors (d = 4). Key 1 is most similar to the query, key 4 least.
const QUERY = [1.0, 0.5, -0.5, 0.2]
const KEYS = [
  [1.0, 0.4, -0.6, 0.1],
  [0.6, 0.8, 0.2, -0.3],
  [-0.2, 0.3, 0.9, 0.5],
  [-0.8, -0.5, 0.4, 0.0],
]
const DIM = QUERY.length
const DEMO_CAP = 5

const dot = (a: number[], b: number[]) => a.reduce((sum, value, i) => sum + value * b[i], 0)

/** Attention scores for one query when W_Q and W_K are both scaled by s. */
function attentionScores(scale: number, remedy: Remedy) {
  const q = QUERY.map(v => v * scale)
  const keys = KEYS.map(k => k.map(v => v * scale))
  if (remedy === 'qkNorm') {
    // RMSNorm (gain 1) on q and every k: the scale s cancels out.
    const qn = normalizeVector(q, 'rms')
    return keys.map(k => dot(qn, normalizeVector(k, 'rms')) / Math.sqrt(DIM))
  }
  const raw = keys.map(k => dot(q, k) / Math.sqrt(DIM))
  return remedy === 'softcap' ? raw.map(z => DEMO_CAP * Math.tanh(z / DEMO_CAP)) : raw
}

export function AttentionLogitGrowthDemo() {
  const { t } = useTranslation()
  const c = t.residualStream.logitDemo
  const [scale, setScale] = useState(1)
  const [remedy, setRemedy] = useState<Remedy>('none')

  const scores = attentionScores(scale, remedy)
  const weights = learningSoftmax(scores)
  const entropy = -weights.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0)
  const sensitivity = Math.max(...weights.map(p => p * (1 - p)))
  const explanation = remedy === 'none' ? c.explainNone : remedy === 'qkNorm' ? c.explainQkNorm : c.explainSoftcap

  const remedies: [Remedy, string][] = [
    ['none', c.modeNone],
    ['qkNorm', c.modeQkNorm],
    ['softcap', c.modeSoftcap],
  ]

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 md:p-6">
      <h3 className="text-xl font-semibold text-text">{c.title}</h3>
      <p className="text-sm leading-relaxed text-muted">{c.note}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-text">
          {c.scale}: <span className="font-mono">{scale.toFixed(1)}</span>
          <input className="mt-2 block w-full accent-cyan-400" type="range" min={0.5} max={6} step={0.1} value={scale} onChange={e => setScale(Number(e.target.value))} />
        </label>
        <div className="text-sm text-text">
          {c.mode}
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={c.mode}>
            {remedies.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={remedy === id}
                onClick={() => setRemedy(id)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${remedy === id ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-border text-muted hover:border-cyan-500/40'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-sm text-cyan-300">
        {remedy === 'none' && 'score = (s·q)·(s·k) / √d'}
        {remedy === 'qkNorm' && 'score = RMSNorm(s·q)·RMSNorm(s·k) / √d'}
        {remedy === 'softcap' && `score = ${DEMO_CAP}·tanh((s·q)·(s·k) / (√d · ${DEMO_CAP}))`}
      </p>

      <div className="space-y-2">
        {weights.map((w, i) => (
          <div key={i} className="grid grid-cols-[4.5rem_1fr_7.5rem] items-center gap-3 text-sm">
            <span className="text-muted">{c.key} {i + 1}</span>
            <div className="h-5 overflow-hidden rounded-md bg-background">
              <motion.div
                className="h-full rounded-md bg-gradient-to-r from-cyan-500/70 to-purple-500/70"
                animate={{ width: `${(w * 100).toFixed(1)}%` }}
                transition={{ type: 'spring', stiffness: 160, damping: 22 }}
              />
            </div>
            <span className="text-right font-mono text-xs text-text">
              {scores[i].toFixed(2)} → {(w * 100).toFixed(1)}%
            </span>
          </div>
        ))}
        <div className="grid grid-cols-[4.5rem_1fr_7.5rem] gap-3 text-[11px] text-muted">
          <span />
          <span />
          <span className="text-right">{c.score} → {c.weight}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="text-xs text-muted">{c.entropy} ({c.entropyMax})</div>
          <div className="font-mono text-lg text-text">{entropy.toFixed(3)}</div>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="text-xs text-muted">{c.sensitivity}</div>
          <div className="font-mono text-lg text-text">{sensitivity.toFixed(4)}</div>
        </div>
      </div>

      <p className="border-l-2 border-cyan-500 pl-4 text-sm leading-relaxed text-muted">{explanation}</p>
    </div>
  )
}
