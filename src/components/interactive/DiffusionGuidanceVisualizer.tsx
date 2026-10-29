'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

type Vec = [number, number]

// Two fixed example predictions (not model outputs); the guided vector is computed from them.
const EPS_UNCOND: Vec = [1.0, 0.3]
const EPS_COND: Vec = [0.6, 0.9]
const W_MAX = 5

const X_MIN = -1.6
const X_MAX = 1.6
const Y_MIN = -0.5
const Y_MAX = 3.7
const WIDTH = 320
const HEIGHT = (WIDTH * (Y_MAX - Y_MIN)) / (X_MAX - X_MIN)
const px = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * WIDTH
const py = (y: number) => ((Y_MAX - y) / (Y_MAX - Y_MIN)) * HEIGHT

const diffusionGuide =(w: number): Vec => [
  EPS_UNCOND[0] + w * (EPS_COND[0] - EPS_UNCOND[0]),
  EPS_UNCOND[1] + w * (EPS_COND[1] - EPS_UNCOND[1]),
]

const COLORS = { uncond: '#94a3b8', cond: '#22d3ee', guided: '#f472b6' }

/** Classifier-free guidance as extrapolation along the line from ε_u through ε_c. */
export function DiffusionGuidanceVisualizer() {
  const { t } = useTranslation()
  const c = t.imageDiffusion
  const [w, setW] = useState(3)
  const guided = diffusionGuide(w)
  const lineStart = diffusionGuide(-0.3)
  const lineEnd = diffusionGuide(W_MAX + 0.3)

  const arrow = (v: Vec, color: string, animated = false) => {
    const props = { x1: px(0), y1: py(0), stroke: color, strokeWidth: 2.5, markerEnd: `url(#cfg-head-${color.slice(1)})` }
    return animated ? (
      <motion.line {...props} animate={{ x2: px(v[0]), y2: py(v[1]) }} transition={{ type: 'spring', stiffness: 260, damping: 28 }} />
    ) : (
      <line {...props} x2={px(v[0])} y2={py(v[1])} />
    )
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <label className="block text-sm text-muted">
        {c.cfgScaleLabel}: <span className="font-mono text-text">{w.toFixed(1)}</span>
        <input
          aria-label={c.cfgScaleLabel}
          type="range"
          min={0}
          max={W_MAX}
          step={0.1}
          value={w}
          onChange={(e) => setW(+e.target.value)}
          className="mt-2 w-full"
        />
      </label>
      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_240px]">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto w-full max-w-sm rounded-lg bg-background" role="img" aria-label={c.cfgAria}>
          <defs>
            {Object.values(COLORS).map((color) => (
              <marker key={color} id={`cfg-head-${color.slice(1)}`} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill={color} />
              </marker>
            ))}
          </defs>
          <line x1={px(X_MIN)} x2={px(X_MAX)} y1={py(0)} y2={py(0)} stroke="currentColor" className="text-border" strokeWidth={0.6} />
          <line x1={px(0)} x2={px(0)} y1={py(Y_MIN)} y2={py(Y_MAX)} stroke="currentColor" className="text-border" strokeWidth={0.6} />
          <line
            x1={px(lineStart[0])}
            y1={py(lineStart[1])}
            x2={px(lineEnd[0])}
            y2={py(lineEnd[1])}
            stroke="currentColor"
            className="text-muted"
            strokeDasharray="4 4"
            strokeWidth={0.8}
          />
          {arrow(EPS_UNCOND, COLORS.uncond)}
          {arrow(EPS_COND, COLORS.cond)}
          {arrow(guided, COLORS.guided, true)}
        </svg>
        <dl className="space-y-3 text-sm">
          {[
            { label: c.cfgUncond, v: EPS_UNCOND, color: COLORS.uncond },
            { label: c.cfgCond, v: EPS_COND, color: COLORS.cond },
            { label: c.cfgGuided, v: guided, color: COLORS.guided },
          ].map((row) => (
            <div key={row.label} className="rounded-lg border border-border bg-background p-3">
              <dt className="flex items-center gap-2 text-xs text-muted">
                <span className="inline-block h-2 w-4 rounded" style={{ backgroundColor: row.color }} aria-hidden="true" />
                {row.label}
              </dt>
              <dd className="mt-1 font-mono text-text">
                [{row.v[0].toFixed(2)}, {row.v[1].toFixed(2)}]
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="text-sm text-muted">{c.cfgLimit}</p>
    </div>
  )
}
