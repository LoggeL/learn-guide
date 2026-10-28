'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

type Vec = [number, number]
type Mode = 'original' | 'ablate' | 'add'

// Fixed toy activations in a 2D "residual stream". They are illustrative inputs, not model measurements.
const HARMFUL: Vec[] = [
  [1.2, 1.4], [1.7, 1.6], [0.8, 1.8], [1.5, 0.9], [0.9, 1.1], [1.9, 1.2], [1.4, 2.0],
]
const HARMLESS: Vec[] = [
  [-1.0, -0.3], [-0.5, -0.1], [-1.4, 0.1], [-0.7, -0.8], [-1.3, -0.6], [-0.4, -0.5], [-1.1, 0.3],
]
// Toy output matrix that writes into the stream (used for the weight-orthogonalization check).
const W: [Vec, Vec] = [[0.9, -0.4], [0.5, 1.1]]

const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1]
const scale = (a: Vec, s: number): Vec => [a[0] * s, a[1] * s]
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]]
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1]]
const mean = (pts: Vec[]): Vec => scale(pts.reduce((acc, p) => add(acc, p), [0, 0] as Vec), 1 / pts.length)

// SVG mapping: data range [-3, 3] on both axes
const SIZE = 360
const RANGE = 3
const sx = (x: number) => ((x + RANGE) / (2 * RANGE)) * SIZE
const sy = (y: number) => SIZE - ((y + RANGE) / (2 * RANGE)) * SIZE

export function RefusalDirectionDemo() {
  const { t, locale } = useTranslation()
  const c = t.abliteration
  const [mode, setMode] = useState<Mode>('original')
  const [strength, setStrength] = useState(1)
  const [selected, setSelected] = useState<{ group: 'harmful' | 'harmless'; index: number }>({ group: 'harmful', index: 0 })

  const fmt = (n: number) => {
    const v = Math.abs(n) < 0.005 ? 0 : n
    return v.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  const fmtVec = (v: Vec) => `(${fmt(v[0])}; ${fmt(v[1])})`

  const base = useMemo(() => {
    const mu = mean(HARMFUL)
    const nu = mean(HARMLESS)
    const r = sub(mu, nu)
    const norm = Math.hypot(r[0], r[1])
    const rHat: Vec = [r[0] / norm, r[1] / norm]
    const tau = (dot(rHat, mu) + dot(rHat, nu)) / 2
    // P = I - r̂ r̂ᵀ
    const P: [Vec, Vec] = [
      [1 - rHat[0] * rHat[0], -rHat[0] * rHat[1]],
      [-rHat[1] * rHat[0], 1 - rHat[1] * rHat[1]],
    ]
    const matMul = (A: [Vec, Vec], B: [Vec, Vec]): [Vec, Vec] => [
      [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
      [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
    ]
    const Wp = matMul(P, W)
    const rowTimes = (v: Vec, A: [Vec, Vec]): Vec => [v[0] * A[0][0] + v[1] * A[1][0], v[0] * A[0][1] + v[1] * A[1][1]]
    return { mu, nu, r, norm, rHat, tau, P, Wp, rW: rowTimes(rHat, W), rWp: rowTimes(rHat, Wp) }
  }, [])

  const transform = (p: Vec, group: 'harmful' | 'harmless'): Vec => {
    if (mode === 'ablate') return sub(p, scale(base.rHat, strength * dot(base.rHat, p)))
    if (mode === 'add' && group === 'harmless') return add(p, scale(base.r, strength))
    return p
  }

  const harmful = HARMFUL.map(p => transform(p, 'harmful'))
  const harmless = HARMLESS.map(p => transform(p, 'harmless'))
  const muNow = mean(harmful)
  const nuNow = mean(harmless)
  const refusesHarmful = harmful.filter(p => dot(base.rHat, p) > base.tau).length
  const refusesHarmless = harmless.filter(p => dot(base.rHat, p) > base.tau).length
  const gap = dot(base.rHat, sub(muNow, nuNow))

  const selOrig = (selected.group === 'harmful' ? HARMFUL : HARMLESS)[selected.index]
  const selNow = (selected.group === 'harmful' ? harmful : harmless)[selected.index]

  // Lines: hyperplane r̂ᵀx = 0 and toy threshold r̂ᵀx = τ (both perpendicular to r̂)
  const perp: Vec = [-base.rHat[1], base.rHat[0]]
  const lineThrough = (offset: number) => {
    const p0 = scale(base.rHat, offset)
    const a = add(p0, scale(perp, 2 * RANGE))
    const b = sub(p0, scale(perp, 2 * RANGE))
    return { x1: sx(a[0]), y1: sy(a[1]), x2: sx(b[0]), y2: sy(b[1]) }
  }
  const arrowEnd = scale(base.rHat, 2.4)

  const modes: { id: Mode; label: string }[] = [
    { id: 'original', label: c.demoModeOriginal },
    { id: 'ablate', label: c.demoModeAblate },
    { id: 'add', label: c.demoModeAdd },
  ]

  const renderMatrix = (label: string, M: [Vec, Vec]) => (
    <div className="rounded-lg bg-background/60 border border-border p-3">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="font-mono text-sm text-text">[{fmt(M[0][0])}, {fmt(M[0][1])}]<br />[{fmt(M[1][0])}, {fmt(M[1][1])}]</div>
    </div>
  )

  return (
    <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-6">
      <div>
        <h3 className="text-xl font-bold font-heading text-text mb-2">{c.demoTitle}</h3>
        <p className="text-sm text-muted leading-relaxed">{c.demoNote}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3 py-2 rounded-lg text-sm font-mono border transition-colors ${mode === m.id ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-background border-border text-muted hover:text-text'}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      {mode !== 'original' && (
        <label className="block text-sm text-muted">
          {c.demoStrength}: <span className="font-mono text-text">{fmt(strength)}</span>
          <input type="range" min={0} max={1} step={0.05} value={strength} onChange={e => setStrength(Number(e.target.value))} className="block w-full max-w-sm mt-1" />
        </label>
      )}

      <div className="grid lg:grid-cols-[minmax(0,380px)_1fr] gap-6 items-start">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[380px] rounded-xl bg-background border border-border" role="img" aria-label={c.demoTitle}>
          <line x1={sx(-RANGE)} y1={sy(0)} x2={sx(RANGE)} y2={sy(0)} className="stroke-border" strokeWidth={1} />
          <line x1={sx(0)} y1={sy(-RANGE)} x2={sx(0)} y2={sy(RANGE)} className="stroke-border" strokeWidth={1} />
          <line {...lineThrough(0)} stroke="#94a3b8" strokeWidth={1.2} strokeDasharray="6 4" />
          <line {...lineThrough(base.tau)} stroke="#fb923c" strokeWidth={1.2} strokeDasharray="2 4" />
          <defs>
            <marker id="rhat-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="#22d3ee" />
            </marker>
          </defs>
          <line x1={sx(0)} y1={sy(0)} x2={sx(arrowEnd[0])} y2={sy(arrowEnd[1])} stroke="#22d3ee" strokeWidth={2.5} markerEnd="url(#rhat-arrow)" />
          <text x={sx(arrowEnd[0]) + 6} y={sy(arrowEnd[1]) - 4} fill="#22d3ee" fontSize={13} fontFamily="monospace">r̂</text>

          {selNow && (
            <motion.line
              initial={false}
              animate={{ x1: sx(selOrig[0]), y1: sy(selOrig[1]), x2: sx(selNow[0]), y2: sy(selNow[1]) }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              stroke="#e2e8f0" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3 3"
            />
          )}

          {(['harmless', 'harmful'] as const).map(group => (group === 'harmful' ? harmful : harmless).map((p, i) => {
            const isSel = selected.group === group && selected.index === i
            return (
              <motion.circle
                key={`${group}-${i}`}
                initial={false}
                animate={{ cx: sx(p[0]), cy: sy(p[1]) }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                r={isSel ? 7 : 5}
                fill={group === 'harmful' ? '#f87171' : '#34d399'}
                fillOpacity={0.85}
                stroke={isSel ? '#ffffff' : 'none'}
                strokeWidth={2}
                className="cursor-pointer"
                onClick={() => setSelected({ group, index: i })}
              />
            )
          }))}

          {([[muNow, '#f87171'], [nuNow, '#34d399']] as const).map(([m, color], i) => (
            <motion.g
              key={i}
              initial={false}
              animate={{ x: sx(m[0]), y: sy(m[1]) }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              pointerEvents="none"
            >
              <rect x={-7} y={-7} width={14} height={14} fill="none" stroke={color} strokeWidth={2.5} transform="rotate(45)" />
            </motion.g>
          ))}
        </svg>

        <div className="space-y-4 text-sm">
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-muted">
            <li><span className="inline-block w-2.5 h-2.5 rounded-full bg-red-400 mr-2" />{c.demoLegendHarmful}</li>
            <li><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2" />{c.demoLegendHarmless}</li>
            <li><span className="inline-block w-2.5 h-2.5 rotate-45 border-2 border-muted mr-2" />{c.demoLegendMean}</li>
            <li><span className="inline-block w-4 h-0.5 bg-cyan-400 align-middle mr-2" />{c.demoLegendDirection}</li>
            <li><span className="inline-block w-4 border-t-2 border-dashed border-slate-400 align-middle mr-2" />{c.demoLegendPlane}</li>
            <li><span className="inline-block w-4 border-t-2 border-dotted border-orange-400 align-middle mr-2" />{c.demoLegendBoundary}</li>
          </ul>

          <div className="grid sm:grid-cols-2 gap-2 font-mono">
            <div className="rounded-lg bg-background/60 border border-border p-3"><span className="text-muted">r = μ − ν = </span>{fmtVec(base.r)}</div>
            <div className="rounded-lg bg-background/60 border border-border p-3"><span className="text-muted">‖r‖ = </span>{fmt(base.norm)}</div>
            <div className="rounded-lg bg-background/60 border border-border p-3"><span className="text-muted">r̂ = </span>{fmtVec(base.rHat)}</div>
            <div className="rounded-lg bg-background/60 border border-border p-3"><span className="text-muted">τ = </span>{fmt(base.tau)}</div>
          </div>

          <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/20 p-4 space-y-2">
            <p className="text-text">{c.demoGap.replace('{gap}', fmt(gap))}</p>
            <p className="text-text">
              {c.demoRefusals
                .replace('{harmful}', String(refusesHarmful))
                .replace('{harmless}', String(refusesHarmless))
                .replace(/\{n\}/g, String(HARMFUL.length))}
            </p>
            <p className="text-xs text-muted">{c.demoAssumption}</p>
          </div>

          <div className="rounded-xl bg-background/60 border border-border p-4 space-y-1 font-mono">
            <div className="font-sans text-muted mb-1">{c.demoSelected}</div>
            <div><span className="text-muted">x = </span>{fmtVec(selOrig)} <span className="text-muted">→ x′ = </span>{fmtVec(selNow)}</div>
            <div><span className="text-muted">r̂ᵀx = </span>{fmt(dot(base.rHat, selOrig))} <span className="text-muted">→ r̂ᵀx′ = </span>{fmt(dot(base.rHat, selNow))}</div>
            <div><span className="text-muted">{c.demoPerpComponent}: </span>{fmt(dot(perp, selOrig))} <span className="text-muted">→ </span>{fmt(dot(perp, selNow))}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-purple-500/20 p-5">
        <h4 className="text-lg font-bold font-heading text-purple-400 mb-1">{c.demoMatrixTitle}</h4>
        <p className="text-sm text-muted mb-4 leading-relaxed">{c.demoMatrixDesc}</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {renderMatrix('P = I − r̂r̂ᵀ', base.P)}
          {renderMatrix('W', W)}
          {renderMatrix('W′ = PW', base.Wp)}
          <div className="rounded-lg bg-background/60 border border-border p-3">
            <div className="text-xs text-muted mb-1">r̂ᵀW</div>
            <div className="font-mono text-sm text-orange-300">{fmtVec(base.rW)}</div>
          </div>
          <div className="rounded-lg bg-background/60 border border-border p-3">
            <div className="text-xs text-muted mb-1">r̂ᵀW′</div>
            <div className="font-mono text-sm text-emerald-300">{fmtVec(base.rWp)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
