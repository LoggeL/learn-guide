'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { learningSoftmax } from '@/lib/llmLearningMath'

/** Router weights W_r of the toy MoE layer: one row per expert, logit sᵢ = W_r[i] · x. */
export const toyRouter = [[1, 0.2], [-0.5, 1], [0.4, -1], [-0.7, -0.3]]
const experts = [[[1, 0.2], [-0.3, 0.8]], [[-0.5, 0.7], [1, 0.2]], [[0.4, -0.8], [0.5, 1]], [[0.8, 0.3], [0.1, -0.7]]]
const fmt = (v: number[]) => `[${v.map(x => x.toFixed(3)).join(', ')}]`

export function MoEVisualizer() {
  const { t } = useTranslation()
  const c = t.ffnMoe
  const [x, setX] = useState([0.8, -0.4])
  const [k, setK] = useState(2)

  const logits = toyRouter.map(row => row.reduce((sum, value, i) => sum + value * x[i], 0))
  const probabilities = learningSoftmax(logits)
  const chosen = logits.map((_, i) => i).sort((a, b) => logits[b] - logits[a] || a - b).slice(0, k)
  const total = chosen.reduce((sum, i) => sum + probabilities[i], 0)
  const mixture = probabilities.map((p, i) => (chosen.includes(i) ? p / total : 0))
  const outputs = experts.map((matrix, i) => (chosen.includes(i) ? matrix.map(row => Math.tanh(row.reduce((sum, value, j) => sum + value * x[j], 0))) : null))
  const output = [0, 1].map(d => outputs.reduce((sum, value, i) => sum + (value ? mixture[i] * value[d] : 0), 0))

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div>
        <h3 className="text-xl font-semibold text-text">{c.routerDemoTitle}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{c.routerDemoNote}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {x.map((value, i) => (
          <label key={i} className="font-mono text-sm text-muted">
            x{i} = <span className="text-text">{value.toFixed(1)}</span>
            <input
              className="mt-2 block w-full accent-cyan-400"
              type="range"
              min={-2}
              max={2}
              step={0.1}
              value={value}
              onChange={e => setX(previous => previous.map((v, j) => (i === j ? Number(e.target.value) : v)))}
            />
          </label>
        ))}
        <label className="font-mono text-sm text-muted">
          k = <span className="text-text">{k}</span>
          <input className="mt-2 block w-full accent-cyan-400" type="range" min={1} max={4} value={k} onChange={e => setK(Number(e.target.value))} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {toyRouter.map((row, i) => {
          const active = chosen.includes(i)
          return (
            <motion.div
              key={i}
              layout
              animate={{ opacity: active ? 1 : 0.55 }}
              className={`space-y-2 rounded-xl border p-4 ${active ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-border'}`}
            >
              <h4 className="font-semibold text-text">E{i}</h4>
              <p className="font-mono text-xs text-muted">s{i} = {fmt(row)} · x = {logits[i].toFixed(3)}</p>
              <p className="font-mono text-xs text-muted">softmax = {probabilities[i].toFixed(3)}</p>
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>{c.routerDemoGate} g{i} = {mixture[i].toFixed(3)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background">
                <motion.div className="h-full rounded-full bg-cyan-400" animate={{ width: `${mixture[i] * 100}%` }} transition={{ type: 'spring', stiffness: 200, damping: 25 }} />
              </div>
              <p className="font-mono text-sm text-text">{outputs[i] ? `E${i}(x) = ${fmt(outputs[i]!)}` : c.routerDemoSkipped}</p>
            </motion.div>
          )
        })}
      </div>
      <p className="text-sm text-muted">{c.routerDemoFootnote}</p>
      <p aria-live="polite" className="rounded-lg bg-background p-4 font-mono text-lg text-cyan-300">Σᵢ gᵢ Eᵢ(x) = {fmt(output)}</p>
      <details className="rounded-lg border border-border p-3">
        <summary className="cursor-pointer text-sm text-muted">{c.routerDemoMatrices}</summary>
        <div className="mt-3 grid grid-cols-2 gap-4">
          {experts.map((matrix, i) => (
            <div className="font-mono text-xs text-text" key={i}>
              M{i}
              {matrix.map((row, j) => <p key={j}>{fmt(row)}</p>)}
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
