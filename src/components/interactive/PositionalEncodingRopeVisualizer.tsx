'use client'

import { useId, useMemo, useState } from 'react'
import { ArrowRight, CircleDot, RotateCw } from 'lucide-react'
import clsx from 'clsx'
import { useLocale } from '@/lib/i18n/context'

const WORDS = ['The', 'quick', 'fox', 'tracks', 'the', 'hidden', 'token', 'through', 'long', 'context', 'windows', 'again']
const CENTER = 180
const ORBIT_RADIUS = 118
const INNER_RADIUS = 62
const BASE_STEP = Math.PI / 7

const copy = {
  en: {
    title: 'RoPE phase orbits: position becomes rotation',
    subtitle: 'Each token rides around a phase wheel. Shift both query and key together and their planets move, but the angular separation RoPE compares stays locked.',
    sequence: 'Sequence length',
    focus: 'Focus token position',
    distance: 'Compare distance',
    focusLabel: 'query planet',
    keyLabel: 'key planet',
    relativeOffset: 'relative offset',
    sameOffset: 'shifted pair',
    sameGap: 'same phase gap',
    similarity: 'RoPE similarity cue',
    formula: 'attention reads angle(qᵢ) − angle(kⱼ) ≈ (i − j) × rotation step',
    tokens: 'Token orbit map',
    absolute: 'current orbit',
    relative: 'relative phase survives translation',
    note: 'This is a simplified 2D vector pair. Real RoPE uses many paired dimensions, each orbiting at its own frequency.',
    ghost: 'ghosted shifted pair',
    phaseArc: 'phase arc',
    qVector: 'q vector',
    kVector: 'k vector',
    position: 'pos',
  },
  de: {
    title: 'RoPE-Phasenorbits: Position wird Rotation',
    subtitle: 'Jedes Token läuft auf einem Phasenrad. Verschiebst du Query und Key gemeinsam, wandern die Planeten, aber die von RoPE verglichene Winkeldistanz bleibt gleich.',
    sequence: 'Sequenzlänge',
    focus: 'Fokus-Token-Position',
    distance: 'Vergleichsabstand',
    focusLabel: 'Query-Planet',
    keyLabel: 'Key-Planet',
    relativeOffset: 'relativer Offset',
    sameOffset: 'verschobenes Paar',
    sameGap: 'gleiche Phasenlücke',
    similarity: 'RoPE-Ähnlichkeits-Hinweis',
    formula: 'Attention liest Winkel(qᵢ) − Winkel(kⱼ) ≈ (i − j) × Rotationsschritt',
    tokens: 'Token-Orbitkarte',
    absolute: 'aktueller Orbit',
    relative: 'relative Phase überlebt Verschiebung',
    note: 'Das ist ein vereinfachtes 2D-Vektorpaar. Echtes RoPE nutzt viele Dimensionspaare, jedes mit eigener Umlauffrequenz.',
    ghost: 'geisterhaft verschobenes Paar',
    phaseArc: 'Phasenbogen',
    qVector: 'q-Vektor',
    kVector: 'k-Vektor',
    position: 'pos',
  },
}

function pointFor(angle: number, radius = ORBIT_RADIUS, center = CENTER) {
  return {
    x: center + Math.cos(angle - Math.PI / 2) * radius,
    y: center + Math.sin(angle - Math.PI / 2) * radius,
  }
}

function arcPath(startAngle: number, endAngle: number, radius = ORBIT_RADIUS + 18) {
  const start = pointFor(startAngle, radius)
  const end = pointFor(endAngle, radius)
  const normalizedDelta = Math.abs(endAngle - startAngle) % (Math.PI * 2)
  const largeArc = normalizedDelta > Math.PI ? 1 : 0
  const sweep = endAngle >= startAngle ? 1 : 0
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`
}

function angleDelta(queryAngle: number, keyAngle: number) {
  return Math.abs(queryAngle - keyAngle)
}

function OrbitalPhaseWheel({
  tokens,
  focusPosition,
  keyPosition,
  shiftedFocus,
  shiftedKey,
  onSelectFocus,
  labels,
}: {
  tokens: string[]
  focusPosition: number
  keyPosition: number
  shiftedFocus: number
  shiftedKey: number
  onSelectFocus: (index: number) => void
  labels: typeof copy.en
}) {
  const gradientId = useId()
  const glowId = useId()
  const queryAngle = focusPosition * BASE_STEP
  const keyAngle = keyPosition * BASE_STEP
  const shiftedQueryAngle = shiftedFocus * BASE_STEP
  const shiftedKeyAngle = shiftedKey * BASE_STEP
  const queryPoint = pointFor(queryAngle)
  const keyPoint = pointFor(keyAngle)
  const shiftedQueryPoint = pointFor(shiftedQueryAngle, INNER_RADIUS)
  const shiftedKeyPoint = pointFor(shiftedKeyAngle, INNER_RADIUS)
  const currentGap = angleDelta(queryAngle, keyAngle)
  const shiftedGap = angleDelta(shiftedQueryAngle, shiftedKeyAngle)

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.16),rgba(15,23,42,0.36)_42%,rgba(2,6,23,0.72)_100%)] p-4 shadow-2xl shadow-cyan-950/30">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(167,139,250,0.12),transparent)]" />
      <div className="relative mb-3 flex flex-wrap items-center justify-between gap-3 px-2 pt-1">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">{labels.absolute}</div>
          <div className="font-heading text-lg font-bold text-text">{labels.tokens}</div>
        </div>
        <div className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 font-mono text-xs text-emerald-100">
          Δθ {currentGap.toFixed(2)} rad = {shiftedGap.toFixed(2)} rad
        </div>
      </div>

      <svg viewBox="0 0 360 360" role="img" aria-label={`${labels.tokens}: ${labels.focusLabel} ${focusPosition}, ${labels.keyLabel} ${keyPosition}`} className="relative mx-auto aspect-square w-full max-w-[520px] overflow-visible">
        <defs>
          <radialGradient id={`${gradientId}-planet`} cx="35%" cy="30%">
            <stop offset="0%" stopColor="#f0abfc" />
            <stop offset="55%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#581c87" />
          </radialGradient>
          <radialGradient id={`${gradientId}-key`} cx="35%" cy="30%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="60%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#164e63" />
          </radialGradient>
          <linearGradient id={`${gradientId}-arc`} x1="0" x2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CENTER} cy={CENTER} r="154" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="18" strokeDasharray="1 14" />
        <circle cx={CENTER} cy={CENTER} r={ORBIT_RADIUS} fill="rgba(15,23,42,0.36)" stroke="rgba(125,211,252,0.28)" strokeWidth="2" />
        <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS} fill="none" stroke="rgba(167,139,250,0.22)" strokeWidth="2" strokeDasharray="8 8" />
        <circle cx={CENTER} cy={CENTER} r="18" fill="rgba(226,232,240,0.08)" stroke="rgba(226,232,240,0.28)" />

        {[0, 1, 2, 3, 4, 5, 6, 7].map((tick) => {
          const angle = (tick * Math.PI) / 4
          const p1 = pointFor(angle, INNER_RADIUS - 7)
          const p2 = pointFor(angle, ORBIT_RADIUS + 12)
          return <line key={tick} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(148,163,184,0.16)" strokeWidth="1" />
        })}

        <path d={arcPath(keyAngle, queryAngle)} fill="none" stroke={`url(#${gradientId}-arc)`} strokeWidth="9" strokeLinecap="round" opacity="0.92" filter={`url(#${glowId})`} />
        <path d={arcPath(shiftedKeyAngle, shiftedQueryAngle, INNER_RADIUS + 14)} fill="none" stroke="rgba(226,232,240,0.38)" strokeWidth="5" strokeLinecap="round" strokeDasharray="7 8" />

        <line x1={CENTER} y1={CENTER} x2={shiftedKeyPoint.x} y2={shiftedKeyPoint.y} stroke="rgba(125,211,252,0.36)" strokeWidth="5" strokeLinecap="round" strokeDasharray="5 8" />
        <line x1={CENTER} y1={CENTER} x2={shiftedQueryPoint.x} y2={shiftedQueryPoint.y} stroke="rgba(216,180,254,0.36)" strokeWidth="5" strokeLinecap="round" strokeDasharray="5 8" />
        <line x1={CENTER} y1={CENTER} x2={keyPoint.x} y2={keyPoint.y} stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" filter={`url(#${glowId})`} />
        <line x1={CENTER} y1={CENTER} x2={queryPoint.x} y2={queryPoint.y} stroke="#c084fc" strokeWidth="6" strokeLinecap="round" filter={`url(#${glowId})`} />

        {tokens.map((token, index) => {
          const angle = index * BASE_STEP
          const p = pointFor(angle)
          const isFocus = index === focusPosition
          const isKey = index === keyPosition
          const isShifted = index === shiftedFocus || index === shiftedKey
          const isActive = isFocus || isKey
          const isInert = index < focusPosition - keyPosition

          return (
            <g
              key={`${token}-${index}`}
              className={isInert ? undefined : 'cursor-pointer'}
              onClick={() => onSelectFocus(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectFocus(index)
                }
              }}
              tabIndex={isInert ? undefined : 0}
              role="button"
              aria-disabled={isInert || undefined}
              aria-label={`${token} ${labels.position} ${index}`}
            >
              <circle cx={p.x} cy={p.y} r={isActive ? 13 : 8} fill={isFocus ? `url(#${gradientId}-planet)` : isKey ? `url(#${gradientId}-key)` : isShifted ? 'rgba(226,232,240,0.42)' : 'rgba(148,163,184,0.34)'} stroke={isActive ? '#f8fafc' : 'rgba(226,232,240,0.24)'} strokeWidth={isActive ? 2 : 1} opacity={isShifted && !isActive ? 0.75 : 1} />
              <text x={p.x} y={p.y + (p.y > CENTER ? 27 : -18)} textAnchor="middle" fill={isActive ? '#f8fafc' : 'rgba(203,213,225,0.72)'} fontSize="10" fontWeight={isActive ? 800 : 600}>
                {index}
              </text>
            </g>
          )
        })}

        <circle cx={shiftedKeyPoint.x} cy={shiftedKeyPoint.y} r="7" fill="rgba(34,211,238,0.35)" stroke="rgba(186,230,253,0.7)" />
        <circle cx={shiftedQueryPoint.x} cy={shiftedQueryPoint.y} r="7" fill="rgba(192,132,252,0.35)" stroke="rgba(233,213,255,0.7)" />
        <circle cx={keyPoint.x} cy={keyPoint.y} r="15" fill={`url(#${gradientId}-key)`} stroke="#e0f2fe" strokeWidth="2" filter={`url(#${glowId})`} />
        <circle cx={queryPoint.x} cy={queryPoint.y} r="15" fill={`url(#${gradientId}-planet)`} stroke="#f5d0fe" strokeWidth="2" filter={`url(#${glowId})`} />
        <text x={queryPoint.x + 18} y={queryPoint.y - 14} fill="#f5d0fe" fontSize="16" fontWeight="800">q</text>
        <text x={keyPoint.x + 18} y={keyPoint.y + 22} fill="#cffafe" fontSize="16" fontWeight="800">k</text>
      </svg>

      <div className="relative grid gap-2 px-2 pb-1 text-xs text-muted sm:grid-cols-3">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-purple-400" />{labels.qVector}</div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />{labels.kVector}</div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-6 rounded-full border border-slate-300/40 bg-slate-300/20" />{labels.ghost}</div>
      </div>
    </div>
  )
}

function OrbitSlider({
  label,
  value,
  min,
  max,
  accent,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  accent: 'cyan' | 'purple' | 'emerald'
  onChange: (value: number) => void
}) {
  const accentClass = {
    cyan: 'accent-cyan-300 text-cyan-100 border-cyan-300/25 bg-cyan-300/10',
    purple: 'accent-purple-300 text-purple-100 border-purple-300/25 bg-purple-300/10',
    emerald: 'accent-emerald-300 text-emerald-100 border-emerald-300/25 bg-emerald-300/10',
  }[accent]

  return (
    <label className={clsx('block rounded-2xl border p-4', accentClass)}>
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold">{label}</span>
        <span className="rounded-full bg-slate-950/35 px-2.5 py-1 font-mono text-xs">{value}</span>
      </div>
      <input aria-label={label} type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </label>
  )
}

export function PositionalEncodingRopeVisualizer() {
  const { locale } = useLocale()
  const c = locale === 'de' ? copy.de : copy.en
  const [sequenceLength, setSequenceLength] = useState(9)
  const [focusPosition, setFocusPosition] = useState(5)
  const [distance, setDistance] = useState(3)

  const maxDistance = Math.max(1, Math.min(6, sequenceLength - 1))
  const safeDistance = Math.min(distance, maxDistance, focusPosition)
  const safeFocus = Math.min(Math.max(focusPosition, safeDistance), sequenceLength - 1)
  const keyPosition = safeFocus - safeDistance
  const shiftedKey = Math.min(sequenceLength - 1 - safeDistance, keyPosition + 2)
  const shiftedFocus = shiftedKey + safeDistance

  const tokens = useMemo(() => WORDS.slice(0, sequenceLength), [sequenceLength])
  const queryAngle = safeFocus * BASE_STEP
  const keyAngle = keyPosition * BASE_STEP
  const similarity = ((Math.cos(queryAngle - keyAngle) + 1) / 2) * 100
  const phaseTicks = useMemo(() => tokens.map((token, index) => ({ token, index, angle: index * BASE_STEP })), [tokens])

  const setFocusClamped = (value: number) => setFocusPosition(Math.max(Math.min(value, sequenceLength - 1), Math.min(distance, sequenceLength - 1)))
  const setDistanceClamped = (value: number) => setDistance(Math.min(value, maxDistance, focusPosition))
  const setLengthClamped = (value: number) => {
    setSequenceLength(value)
    setDistance((current) => Math.min(current, Math.min(6, value - 1)))
    setFocusPosition((current) => Math.min(current, value - 1))
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/70 shadow-2xl shadow-cyan-950/30">
      <div className="relative overflow-hidden border-b border-cyan-300/15 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.18),transparent_30%)] px-6 py-6">
        <div className="absolute -right-20 -top-28 h-56 w-56 rounded-full border border-cyan-300/15" />
        <div className="absolute -right-10 -top-16 h-36 w-36 rounded-full border border-purple-300/15" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              <RotateCw size={15} /> RoPE
            </div>
            <h3 className="font-heading text-2xl font-bold text-text md:text-3xl">{c.title}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">{c.subtitle}</p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-300/25 bg-emerald-300/10 px-5 py-4 text-emerald-100 shadow-lg shadow-emerald-950/20">
            <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/75">{c.relativeOffset}</div>
            <div className="mt-1 flex items-baseline gap-3"><span className="font-mono text-3xl font-bold">{safeDistance}</span><span className="text-sm">{c.sameGap}</span></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-6">
        <OrbitalPhaseWheel tokens={tokens} focusPosition={safeFocus} keyPosition={keyPosition} shiftedFocus={shiftedFocus} shiftedKey={shiftedKey} onSelectFocus={(index) => index >= safeDistance && setFocusPosition(index)} labels={c} />

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/30">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-text">
              <CircleDot size={16} className="text-cyan-300" />
              {c.tokens}
            </div>
            <div className="space-y-3">
              <OrbitSlider label={c.sequence} min={5} max={12} value={sequenceLength} accent="cyan" onChange={setLengthClamped} />
              <OrbitSlider label={c.focus} min={safeDistance} max={sequenceLength - 1} value={safeFocus} accent="purple" onChange={setFocusClamped} />
              <OrbitSlider label={c.distance} min={1} max={maxDistance} value={safeDistance} accent="emerald" onChange={setDistanceClamped} />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-900/70 p-4">
            <div className="mb-3 flex items-center gap-2 font-semibold text-text">
              <ArrowRight size={17} className="text-emerald-300" />
              {c.relative}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-2xl border border-purple-300/20 bg-purple-300/10 px-3 py-2 text-sm text-purple-100">
                <span>{c.focusLabel}</span><span className="font-mono font-bold">{safeFocus}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
                <span>{c.keyLabel}</span><span className="font-mono font-bold">{keyPosition}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-500/25 bg-slate-800/70 px-3 py-2 text-sm text-slate-200">
                <span>{c.sameOffset}</span><span className="font-mono font-bold">{shiftedFocus} → {shiftedKey}</span>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>{c.similarity}</span>
                <span className="font-mono text-emerald-200">{similarity.toFixed(0)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-950/70">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-purple-300 transition-all" style={{ width: `${similarity}%` }} />
              </div>
            </div>

            <p className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-950/35 p-3 font-mono text-[11px] leading-relaxed text-slate-300">{c.formula}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-cyan-300/15 bg-slate-950/55 px-5 py-4 lg:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm leading-relaxed text-slate-300">{c.note}</p>
          <div className="flex min-w-0 flex-wrap gap-2">
            {phaseTicks.map(({ token, index }) => {
              const isFocus = index === safeFocus
              const isKey = index === keyPosition
              return (
                <button
                  key={`${token}-${index}-timeline`}
                  type="button"
                  onClick={() => index >= safeDistance && setFocusPosition(index)}
                  disabled={index < safeDistance}
                  className={clsx(
                    'rounded-full border px-3 py-1.5 font-mono text-xs transition disabled:cursor-not-allowed disabled:opacity-35',
                    isFocus && 'border-purple-300/70 bg-purple-400/20 text-purple-100',
                    isKey && 'border-cyan-300/70 bg-cyan-400/20 text-cyan-100',
                    !isFocus && !isKey && 'border-slate-600/70 bg-slate-900/70 text-slate-300 hover:border-cyan-300/35 hover:text-text'
                  )}
                >
                  {token}<span className="ml-1 text-slate-500">{index}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
