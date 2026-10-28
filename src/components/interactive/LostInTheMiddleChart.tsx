'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

/**
 * Multi-document QA accuracy (%) by position of the answer passage.
 * Source: Liu et al., "Lost in the Middle", TACL 2024 (arXiv 2307.03172v3),
 * Tables 5 (10 docs), 6 (20 docs), 7 (30 docs); closed-book/oracle from Table 1.
 */
type DocCount = 10 | 20 | 30

const POSITIONS: Record<DocCount, number[]> = {
  10: [1, 5, 10],
  20: [1, 5, 10, 15, 20],
  30: [1, 5, 10, 15, 20, 25, 30],
}

const MODELS = [
  {
    name: 'GPT-3.5-Turbo (16K)', color: '#22d3ee', closedBook: 56.0, oracle: 88.6,
    values: { 10: [76.9, 61.0, 62.5], 20: [75.7, 57.3, 54.1, 55.4, 63.1], 30: [73.4, 55.1, 50.5, 50.9, 51.8, 54.9, 63.7] },
  },
  {
    name: 'Claude-1.3', color: '#c084fc', closedBook: 48.3, oracle: 76.1,
    values: { 10: [62.9, 58.3, 59.7], 20: [59.9, 55.9, 56.8, 57.2, 60.1], 30: [59.1, 55.1, 54.8, 55.7, 56.4, 56.2, 59.9] },
  },
  {
    name: 'LongChat-13B (16K)', color: '#fb923c', closedBook: 35.0, oracle: 83.4,
    values: { 10: [72.1, 58.9, 58.5], 20: [68.6, 57.4, 55.3, 52.5, 55.0], 30: [66.9, 54.8, 52.5, 52.9, 52.2, 51.3, 55.1] },
  },
  {
    name: 'MPT-30B-Instruct', color: '#34d399', closedBook: 31.5, oracle: 81.9,
    values: { 10: [60.2, 56.2, 59.7], 20: [53.7, 51.8, 52.2, 52.7, 56.3], 30: [51.6, 51.3, 51.2, 49.0, 49.6, 51.3, 54.1] },
  },
] as const

const W = 640
const H = 320
const PAD = { left: 48, right: 16, top: 16, bottom: 44 }
const Y_MIN = 30
const Y_MAX = 90

export function LostInTheMiddleChart() {
  const { t } = useTranslation()
  const c = t.contextRot
  const [docs, setDocs] = useState<DocCount>(20)
  const [selected, setSelected] = useState(0)

  const positions = POSITIONS[docs]
  const x = (pos: number) => PAD.left + ((pos - 1) / (docs - 1)) * (W - PAD.left - PAD.right)
  const y = (v: number) => PAD.top + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom)
  const model = MODELS[selected]
  const path = (vals: readonly number[]) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(positions[i]).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted mr-1">{c.litmDocs}:</span>
        {([10, 20, 30] as DocCount[]).map(n => (
          <button
            key={n}
            onClick={() => setDocs(n)}
            className={`min-h-11 min-w-11 px-3 rounded-lg border text-sm ${docs === n ? 'border-primary/60 bg-primary/10' : 'border-border text-muted'}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {MODELS.map((m, i) => (
          <button
            key={m.name}
            onClick={() => setSelected(i)}
            className={`min-h-11 px-3 rounded-lg border text-xs flex items-center gap-2 ${selected === i ? 'border-primary/60 bg-primary/10 text-text' : 'border-border text-muted'}`}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: m.color }} />
            {m.name}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={c.litmChartAria}>
        {[30, 40, 50, 60, 70, 80, 90].map(v => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="currentColor" className="text-border" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(v) + 4} textAnchor="end" fontSize={11} fill="currentColor" className="text-muted">{v}%</text>
          </g>
        ))}
        {positions.map(p => (
          <text key={p} x={x(p)} y={H - PAD.bottom + 18} textAnchor="middle" fontSize={11} fill="currentColor" className="text-muted">{p}</text>
        ))}
        <text x={(W + PAD.left) / 2} y={H - 6} textAnchor="middle" fontSize={12} fill="currentColor" className="text-muted">{c.litmPosition}</text>

        {/* Reference lines for the selected model */}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(model.closedBook)} y2={y(model.closedBook)} stroke={model.color} strokeDasharray="4 4" strokeWidth={1.5} opacity={0.8} />
        <text x={W - PAD.right} y={y(model.closedBook) - 5} textAnchor="end" fontSize={11} fill={model.color}>{c.litmClosedBook} {model.closedBook}%</text>
        <line x1={PAD.left} x2={W - PAD.right} y1={y(model.oracle)} y2={y(model.oracle)} stroke={model.color} strokeDasharray="1 4" strokeWidth={1.5} opacity={0.8} />
        <text x={W - PAD.right} y={y(model.oracle) - 5} textAnchor="end" fontSize={11} fill={model.color}>{c.litmOracle} {model.oracle}%</text>

        {/* Faint lines for the other models */}
        {MODELS.map((m, i) => i !== selected && (
          <path key={`${m.name}-${docs}`} d={path(m.values[docs])} fill="none" stroke={m.color} strokeWidth={1.5} opacity={0.25} />
        ))}

        {/* Selected model */}
        <motion.path
          key={`${model.name}-${docs}`}
          d={path(model.values[docs])}
          fill="none"
          stroke={model.color}
          strokeWidth={3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {model.values[docs].map((v, i) => (
          <motion.g key={`${model.name}-${docs}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 * i }}>
            <circle cx={x(positions[i])} cy={y(v)} r={4.5} fill={model.color} />
            <text x={x(positions[i])} y={y(v) - 10} textAnchor="middle" fontSize={11} fill="currentColor" className="text-text">{v}</text>
          </motion.g>
        ))}
      </svg>
      <p className="text-xs text-muted">{c.litmChartNote}</p>
    </div>
  )
}
