'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

const TEXT_TOKENS = 3
const IMAGE_TOKENS = 5
const N = TEXT_TOKENS + IMAGE_TOKENS
const CELL = 26
const OFFSET = 70
const SIZE = OFFSET + N * CELL + 8

type Mode = 'cross' | 'joint'

/** In cross-attention only image queries read text keys; in MMDiT joint attention all blocks of [text; image] are computed. */
function isComputed(mode: Mode, row: number, col: number) {
  if (mode === 'joint') return true
  return row >= TEXT_TOKENS && col < TEXT_TOKENS
}

export function DiffusionJointAttentionDiagram() {
  const { t } = useTranslation()
  const c = t.imageDiffusion
  const [mode, setMode] = useState<Mode>('joint')
  const isText = (i: number) => i < TEXT_TOKENS

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {(['cross', 'joint'] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              mode === value ? 'border-primary bg-primary/15 text-text' : 'border-border text-muted hover:text-text'
            }`}
          >
            {value === 'cross' ? c.attentionCross : c.attentionJoint}
          </button>
        ))}
      </div>

      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_240px]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-sm" role="img" aria-label={c.attentionAria}>
          <text x={OFFSET + (N * CELL) / 2} y={12} textAnchor="middle" fontSize={10} fill="currentColor" className="text-muted">
            {c.attentionKeys}
          </text>
          <text x={10} y={OFFSET + (N * CELL) / 2} textAnchor="middle" fontSize={10} fill="currentColor" className="text-muted" transform={`rotate(-90 10 ${OFFSET + (N * CELL) / 2})`}>
            {c.attentionQueries}
          </text>
          {Array.from({ length: N }, (_, i) => (
            <g key={`label-${i}`}>
              <rect x={OFFSET + i * CELL + 4} y={OFFSET - 22} width={CELL - 8} height={14} rx={3} fill={isText(i) ? '#22d3ee' : '#f472b6'} opacity={0.75} />
              <rect x={OFFSET - 22} y={OFFSET + i * CELL + 4} width={14} height={CELL - 8} rx={3} fill={isText(i) ? '#22d3ee' : '#f472b6'} opacity={0.75} />
            </g>
          ))}
          {Array.from({ length: N * N }, (_, idx) => {
            const row = Math.floor(idx / N)
            const col = idx % N
            const on = isComputed(mode, row, col)
            return (
              <motion.rect
                key={idx}
                x={OFFSET + col * CELL + 1}
                y={OFFSET + row * CELL + 1}
                width={CELL - 2}
                height={CELL - 2}
                rx={3}
                initial={false}
                animate={{ opacity: on ? 0.85 : 0.12 }}
                transition={{ duration: 0.3, delay: (row + col) * 0.015 }}
                fill={on ? (isText(row) === isText(col) ? '#a78bfa' : '#f59e0b') : '#64748b'}
              />
            )
          })}
          <line x1={OFFSET + TEXT_TOKENS * CELL} x2={OFFSET + TEXT_TOKENS * CELL} y1={OFFSET} y2={OFFSET + N * CELL} stroke="currentColor" className="text-text" strokeWidth={1} />
          <line x1={OFFSET} x2={OFFSET + N * CELL} y1={OFFSET + TEXT_TOKENS * CELL} y2={OFFSET + TEXT_TOKENS * CELL} stroke="currentColor" className="text-text" strokeWidth={1} />
        </svg>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block h-3 w-3 rounded bg-cyan-400" aria-hidden="true" />
            {c.attentionText}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block h-3 w-3 rounded bg-pink-400" aria-hidden="true" />
            {c.attentionImage}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block h-3 w-3 rounded bg-amber-500" aria-hidden="true" />
            <span className="inline-block h-3 w-3 rounded bg-violet-400" aria-hidden="true" />
            {c.attentionComputed}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block h-3 w-3 rounded bg-slate-500/30" aria-hidden="true" />
            {c.attentionSkipped}
          </div>
          <p className="text-muted">{mode === 'cross' ? c.attentionCrossNote : c.attentionJointNote}</p>
        </div>
      </div>
    </div>
  )
}
