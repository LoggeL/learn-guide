'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'
import clsx from 'clsx'
import { useTranslation } from '@/lib/i18n/context'
import { ropeAlignedScore, ropeThetas, ropeWavelength } from '@/lib/attention-math'

const DIM = 16
const MAX_POSITION = 63
const BASES = [100, 10000] as const
type PairMode = 'all' | 'fast' | 'slow'

const CHART_W = 520
const CHART_H = 160
const PAD = 28

function formatNumber(value: number, locale: string) {
  if (value >= 100) return Math.round(value).toLocaleString(locale)
  if (value >= 1) return value.toLocaleString(locale, { maximumFractionDigits: 1 })
  return value.toLocaleString(locale, { maximumSignificantDigits: 2 })
}

function PairDial({ theta, m, n, active, label, wavelengthLabel, locale }: {
  theta: number
  m: number
  n: number
  active: boolean
  label: string
  wavelengthLabel: string
  locale: string
}) {
  const qDeg = (m * theta * 180) / Math.PI
  const kDeg = (n * theta * 180) / Math.PI
  const gap = ((m - n) * theta) % (2 * Math.PI)
  const gapDeg = (gap * 180) / Math.PI
  const r = 34
  const arcEnd = { x: 50 + Math.sin(gap) * 22, y: 50 - Math.cos(gap) * 22 }
  const largeArc = gap > Math.PI ? 1 : 0

  return (
    <div className={clsx('rounded-xl border p-2 transition', active ? 'border-cyan-400/40 bg-surface-elevated' : 'border-border bg-surface/40 opacity-45')}>
      <svg viewBox="0 0 100 100" className="mx-auto w-full max-w-[110px]" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth="1.5" />
        {/* Each rotating group contains an invisible full-size circle, so its bounding box (and rotation origin) is the dial centre. */}
        <motion.g animate={{ rotate: kDeg }} transition={{ type: 'tween', duration: 0.35 }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="none" />
          {gap > 1e-3 && (
            <path d={`M 50 28 A 22 22 0 ${largeArc} 1 ${arcEnd.x} ${arcEnd.y}`} fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          )}
          <line x1="50" y1="50" x2="50" y2={50 - r} stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
        </motion.g>
        <motion.g animate={{ rotate: qDeg }} transition={{ type: 'tween', duration: 0.35 }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="none" />
          <line x1="50" y1="50" x2="50" y2={50 - r + 6} stroke="#c084fc" strokeWidth="4" strokeLinecap="round" />
        </motion.g>
        <circle cx="50" cy="50" r="3" fill="#f8fafc" />
      </svg>
      <div className="mt-1 text-center font-mono text-[11px] leading-tight text-muted">
        <div className="text-text">{label}</div>
        <div>θ = {formatNumber(theta, locale)}</div>
        <div>{wavelengthLabel} {formatNumber(ropeWavelength(theta), locale)}</div>
        <div className="text-emerald-300">Δφ {gapDeg.toFixed(0)}°</div>
      </div>
    </div>
  )
}

export function PositionalEncodingRopeVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.positionalEncoding.viz
  const [keyPosition, setKeyPosition] = useState(10)
  const [distance, setDistance] = useState(3)
  const [base, setBase] = useState<(typeof BASES)[number]>(10000)
  const [mode, setMode] = useState<PairMode>('all')

  const thetas = useMemo(() => ropeThetas(DIM, base), [base])
  const activeIndices = useMemo(() => (mode === 'all' ? thetas.map((_, i) => i) : mode === 'fast' ? [0] : [thetas.length - 1]), [mode, thetas])
  const activeThetas = useMemo(() => activeIndices.map((i) => thetas[i]), [activeIndices, thetas])

  const safeDistance = Math.min(distance, MAX_POSITION - keyPosition)
  const queryPosition = keyPosition + safeDistance
  const score = ropeAlignedScore(safeDistance, activeThetas)

  const curve = useMemo(() => {
    const pts = Array.from({ length: MAX_POSITION + 1 }, (_, d) => {
      const s = ropeAlignedScore(d, activeThetas)
      const x = PAD + (d / MAX_POSITION) * (CHART_W - 2 * PAD)
      const y = PAD / 2 + ((1 - s) / 2) * (CHART_H - PAD * 1.5)
      return `${d === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    return pts.join(' ')
  }, [activeThetas])

  const markerX = PAD + (safeDistance / MAX_POSITION) * (CHART_W - 2 * PAD)
  const markerY = PAD / 2 + ((1 - score) / 2) * (CHART_H - PAD * 1.5)
  const zeroY = PAD / 2 + 0.5 * (CHART_H - PAD * 1.5)

  const aliasText = mode === 'fast' ? c.aliasFast : mode === 'slow' ? c.aliasSlow : c.aliasAll

  return (
    <section className="rounded-2xl border border-border bg-surface/55 p-5 md:p-6">
      <div className="mb-5">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
          <RotateCw size={14} /> RoPE
        </div>
        <h3 className="font-heading text-xl font-bold text-text md:text-2xl">{c.title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{c.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-3">
          <div className="mb-2 flex justify-between text-sm text-cyan-100"><span>{c.keyPosition}</span><span className="font-mono">{keyPosition}</span></div>
          <input type="range" min={0} max={MAX_POSITION - 1} value={keyPosition} onChange={(e) => setKeyPosition(Number(e.target.value))} className="w-full accent-cyan-400" aria-label={c.keyPosition} />
        </label>
        <label className="block rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3">
          <div className="mb-2 flex justify-between text-sm text-emerald-100"><span>{c.distance}</span><span className="font-mono">{safeDistance}</span></div>
          <input type="range" min={0} max={MAX_POSITION - keyPosition} value={safeDistance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-emerald-400" aria-label={c.distance} />
        </label>
        <div className="rounded-xl border border-purple-500/25 bg-purple-500/5 p-3 text-sm text-purple-100">
          <div className="flex justify-between"><span>{c.queryPosition}</span><span className="font-mono">{queryPosition}</span></div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-muted">{c.base}</span>
            {BASES.map((b) => (
              <button key={b} type="button" onClick={() => setBase(b)} aria-pressed={base === b} className={clsx('rounded-full px-3 py-1 font-mono text-xs ring-1 transition', base === b ? 'bg-purple-400/20 text-purple-100 ring-purple-300/50' : 'text-muted ring-border hover:text-text')}>
                {b.toLocaleString(locale)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {thetas.map((theta, i) => (
          <PairDial key={i} theta={theta} m={queryPosition} n={keyPosition} active={activeIndices.includes(i)} label={`${c.pair} ${i}`} wavelengthLabel={c.wavelength} locale={locale} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-purple-400" />{c.queryLegend}</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-cyan-400" />{c.keyLegend}</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-emerald-400" />{c.gapLegend}</span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-text">{c.scoreTitle}</div>
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'fast', 'slow'] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m} className={clsx('rounded-full px-3 py-1 text-xs ring-1 transition', mode === m ? 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/50' : 'text-muted ring-border hover:text-text')}>
                  {m === 'all' ? c.pairsAll : m === 'fast' ? c.pairsFast : c.pairsSlow}
                </button>
              ))}
            </div>
          </div>
          <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full" role="img" aria-label={c.scoreTitle}>
            <line x1={PAD} x2={CHART_W - PAD} y1={zeroY} y2={zeroY} stroke="rgba(148,163,184,0.25)" strokeDasharray="4 4" />
            <text x={4} y={PAD / 2 + 4} fill="#7b8aa3" fontSize="10">1</text>
            <text x={4} y={zeroY + 3} fill="#7b8aa3" fontSize="10">0</text>
            <text x={2} y={CHART_H - PAD + 4} fill="#7b8aa3" fontSize="10">−1</text>
            <text x={PAD} y={CHART_H - 4} fill="#7b8aa3" fontSize="10">0</text>
            <text x={CHART_W - PAD} y={CHART_H - 4} fill="#7b8aa3" fontSize="10" textAnchor="end">{MAX_POSITION}</text>
            <text x={CHART_W / 2} y={CHART_H - 4} fill="#7b8aa3" fontSize="10" textAnchor="middle">{c.distance}</text>
            <motion.path key={`${base}-${mode}`} d={curve} fill="none" stroke="#34d399" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
            <motion.circle cx={markerX} cy={markerY} r="5" fill="#c084fc" stroke="#f8fafc" strokeWidth="1.5" animate={{ cx: markerX, cy: markerY }} transition={{ type: 'tween', duration: 0.25 }} />
          </svg>
          <p className="mt-2 text-sm leading-relaxed text-muted">{aliasText}</p>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-muted">{c.scoreCurrent}</div>
          <div className="mt-1 font-mono text-3xl font-bold text-emerald-200">{score.toFixed(3)}</div>
          <div className="mt-1 font-mono text-xs text-muted">m − n = {queryPosition} − {keyPosition} = {safeDistance}</div>
          <p className="mt-3 text-xs leading-relaxed text-muted">{c.shiftHint}</p>
          <p className="mt-3 text-xs leading-relaxed text-subtle">{c.scoreNote}</p>
        </div>
      </div>
    </section>
  )
}
