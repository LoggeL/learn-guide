'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import {
  landscapes,
  optimizerPath,
  type LandscapeId,
  type OptimizerId,
  type Vec2,
} from '@/lib/learning-math'

const MAX_STEPS = 150
const X_RANGE: [number, number] = [-3, 3]
const Y_RANGE: [number, number] = [-2, 2]
const W = 600,
  H = 400,
  GRID_X = 60,
  GRID_Y = 40
const MIN_LOSS: Record<LandscapeId, number> = { valley: 0, rotatedValley: 0, saddle: -0.25 }
const OPTIMIZERS: { id: OptimizerId; color: string }[] = [
  { id: 'gd', color: '#38bdf8' },
  { id: 'momentum', color: '#fb923c' },
  { id: 'adam', color: '#34d399' },
]
const LANDSCAPE_IDS: LandscapeId[] = ['valley', 'rotatedValley', 'saddle']

const sx = (x: number) => ((x - X_RANGE[0]) / (X_RANGE[1] - X_RANGE[0])) * W
const sy = (y: number) => H - ((y - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * H
const isDiverged = (p: Vec2) => !p.every(Number.isFinite) || Math.hypot(...p) > 1e6

export function GradientDescentVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.gradientDescent.demo
  const [landscapeId, setLandscapeId] = useState<LandscapeId>('valley')
  const [eta, setEta] = useState(0.07)
  const [k, setK] = useState(0)
  const [running, setRunning] = useState(false)
  const land = landscapes[landscapeId]
  const minLoss = MIN_LOSS[landscapeId]

  const paths = useMemo(
    () =>
      Object.fromEntries(
        OPTIMIZERS.map((o) => [o.id, optimizerPath(o.id, land, eta, MAX_STEPS)]),
      ) as Record<OptimizerId, Vec2[]>,
    [land, eta],
  )

  const heat = useMemo(() => {
    const cells: { x: number; y: number; v: number }[] = []
    let max = 0
    for (let i = 0; i < GRID_X; i++)
      for (let j = 0; j < GRID_Y; j++) {
        const x = X_RANGE[0] + ((i + 0.5) / GRID_X) * (X_RANGE[1] - X_RANGE[0])
        const y = Y_RANGE[0] + ((j + 0.5) / GRID_Y) * (Y_RANGE[1] - Y_RANGE[0])
        const v = Math.log1p(Math.max(0, land.loss([x, y]) - minLoss))
        max = Math.max(max, v)
        cells.push({ x: i, y: j, v })
      }
    return cells.map((cell) => ({ ...cell, v: cell.v / (max || 1) }))
  }, [land, minLoss])

  useEffect(() => {
    if (!running) return
    if (k >= MAX_STEPS) {
      setRunning(false)
      return
    }
    const id = setTimeout(() => setK((v) => Math.min(MAX_STEPS, v + 1)), 70)
    return () => clearTimeout(id)
  }, [running, k])

  const fmt = (v: number, digits = 3) =>
    v.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  const fmtLoss = (v: number) =>
    Math.abs(v) >= 1e4 || (Math.abs(v) < 1e-3 && v !== 0)
      ? v.toExponential(2)
      : fmt(v, 4)

  const rows = OPTIMIZERS.map((o) => {
    const path = paths[o.id]
    const ended = path.length - 1 < k
    const p = path[Math.min(k, path.length - 1)]
    const loss = land.loss(p)
    const gradNorm = Math.hypot(...land.grad(p))
    const diverged = ended || isDiverged(p) || loss > 1e6
    const converged = !diverged && loss - minLoss < 1e-6 && gradNorm < 1e-3
    return { ...o, path, p, loss, diverged, converged }
  })

  const hint =
    landscapeId === 'valley'
      ? c.valleyHint
      : landscapeId === 'rotatedValley'
        ? c.rotatedValleyHint
        : c.saddleHint
  const cellW = W / GRID_X,
    cellH = H / GRID_Y
  const markers: Vec2[] = landscapeId === 'saddle' ? [[0, 1], [0, -1]] : [[0, 0]]

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient">{c.title}</h3>
        <p className="mt-2 text-sm text-muted">{c.note}</p>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted">{c.landscape}</p>
        <div className="flex flex-wrap gap-2">
          {LANDSCAPE_IDS.map((id) => (
            <button
              key={id}
              onClick={() => {
                setLandscapeId(id)
                setK(0)
                setRunning(false)
              }}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                id === landscapeId
                  ? 'border-primary bg-primary/20 text-text'
                  : 'border-border text-muted hover:text-text'
              }`}
            >
              {c[id]}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">{hint}</p>
      </div>

      <label className="block text-sm text-text">
        {c.eta}: <span className="font-mono">{fmt(eta)}</span>
        <input
          aria-label={c.eta}
          className="mt-1 w-full"
          type="range"
          min={0.01}
          max={0.12}
          step={0.005}
          value={eta}
          onChange={(e) => setEta(+e.target.value)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          disabled={k >= MAX_STEPS}
          className="rounded-lg border border-primary px-4 py-2 text-sm disabled:opacity-50"
          onClick={() => setRunning(!running)}
        >
          {running ? c.pause : c.run}
        </button>
        <button
          disabled={running || k >= MAX_STEPS}
          className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50"
          onClick={() => setK((v) => Math.min(MAX_STEPS, v + 1))}
        >
          {c.step}
        </button>
        <button
          className="rounded-lg border border-border px-4 py-2 text-sm"
          onClick={() => {
            setRunning(false)
            setK(0)
          }}
        >
          {c.reset}
        </button>
        <span className="font-mono text-sm text-muted">
          {c.iteration} {k} / {MAX_STEPS}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-xl bg-background"
        role="img"
        aria-label={c.ariaPlot}
      >
        <defs>
          <clipPath id="gd-plot-area">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>
        {heat.map((cell) => (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x * cellW}
            y={H - (cell.y + 1) * cellH}
            width={cellW + 0.5}
            height={cellH + 0.5}
            fill="#a78bfa"
            fillOpacity={0.04 + cell.v * 0.5}
          />
        ))}
        <line x1={sx(0)} x2={sx(0)} y1={0} y2={H} stroke="#64748b" strokeOpacity={0.4} />
        <line x1={0} x2={W} y1={sy(0)} y2={sy(0)} stroke="#64748b" strokeOpacity={0.4} />
        {markers.map(([mx, my]) => (
          <path
            key={`${mx},${my}`}
            d={`M${sx(mx) - 6},${sy(my)} L${sx(mx) + 6},${sy(my)} M${sx(mx)},${sy(my) - 6} L${sx(mx)},${sy(my) + 6}`}
            stroke="#e2e8f0"
            strokeWidth={1.5}
          />
        ))}
        {landscapeId === 'saddle' && (
          <circle cx={sx(0)} cy={sy(0)} r={5} fill="none" stroke="#facc15" strokeWidth={1.5} />
        )}
        <g clipPath="url(#gd-plot-area)">
          {rows.map((r) => (
            <polyline
              key={r.id}
              fill="none"
              stroke={r.color}
              strokeWidth={2}
              strokeOpacity={0.85}
              points={r.path
                .slice(0, k + 1)
                .filter((p) => !isDiverged(p))
                .map((p) => `${sx(p[0])},${sy(p[1])}`)
                .join(' ')}
            />
          ))}
          {rows.map(
            (r) =>
              !r.diverged && (
                <motion.circle
                  key={`dot-${r.id}`}
                  r={6}
                  fill={r.color}
                  stroke="#0f172a"
                  strokeWidth={1.5}
                  initial={false}
                  animate={{ cx: sx(r.p[0]), cy: sy(r.p[1]) }}
                  transition={{ duration: 0.06, ease: 'linear' }}
                />
              ),
          )}
        </g>
        <circle cx={sx(land.start[0])} cy={sy(land.start[1])} r={5} fill="#ffffff" />
        <text x={sx(land.start[0]) + 8} y={sy(land.start[1]) - 8} fill="#e2e8f0" fontSize={12}>
          {c.start}
        </text>
      </svg>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-2 pr-4 font-medium">{c.colOptimizer}</th>
              <th className="py-2 pr-4 font-medium">{c.colLoss}</th>
              <th className="py-2 pr-4 font-medium">{c.colPosition}</th>
              <th className="py-2 font-medium">{c.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/50 last:border-0">
                <td className="py-2 pr-4 font-semibold" style={{ color: r.color }}>
                  {c[r.id]}
                </td>
                <td className="py-2 pr-4 font-mono text-text">
                  {r.diverged ? '—' : fmtLoss(r.loss)}
                </td>
                <td className="py-2 pr-4 font-mono text-muted">
                  {r.diverged ? '—' : `(${fmt(r.p[0])}, ${fmt(r.p[1])})`}
                </td>
                <td
                  className={`py-2 ${
                    r.diverged ? 'text-red-400' : r.converged ? 'text-emerald-400' : 'text-muted'
                  }`}
                >
                  {r.diverged ? c.statusDiverged : r.converged ? c.statusConverged : c.statusRunning}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
