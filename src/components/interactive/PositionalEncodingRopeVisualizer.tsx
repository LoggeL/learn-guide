'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, CircleDot, RotateCw } from 'lucide-react'
import clsx from 'clsx'
import { useLocale } from '@/lib/i18n/context'

const WORDS = ['The', 'quick', 'fox', 'tracks', 'the', 'hidden', 'token', 'through', 'long', 'context', 'windows', 'again']
const RADIUS = 72
const CENTER = 96
const BASE_STEP = Math.PI / 7

const copy = {
  en: {
    title: 'RoPE: rotate by position, compare by distance',
    subtitle: 'Pick a token and an offset. The absolute angles move around the circle, but equal offsets keep the same angular gap.',
    sequence: 'Sequence length',
    focus: 'Focus token position',
    distance: 'Compare distance',
    focusLabel: 'query at position',
    keyLabel: 'key at position',
    relativeOffset: 'relative offset',
    sameOffset: 'Same offset, shifted right',
    sameGap: 'same rotation gap',
    similarity: 'RoPE similarity cue',
    formula: 'attention sees angle(qᵢ) − angle(kⱼ) ≈ (i − j) × rotation step',
    tokens: 'Tokens receive position before attention',
    absolute: 'absolute position',
    relative: 'relative comparison',
    note: 'This is a simplified 2D slice. Real RoPE rotates many vector pairs at different frequencies.',
  },
  de: {
    title: 'RoPE: nach Position drehen, nach Abstand vergleichen',
    subtitle: 'Wähle ein Token und einen Abstand. Absolute Winkel wandern über den Kreis, aber gleiche Offsets behalten dieselbe Winkeldifferenz.',
    sequence: 'Sequenzlänge',
    focus: 'Fokus-Token-Position',
    distance: 'Vergleichsabstand',
    focusLabel: 'Query an Position',
    keyLabel: 'Key an Position',
    relativeOffset: 'relativer Offset',
    sameOffset: 'Gleicher Offset, nach rechts verschoben',
    sameGap: 'gleiche Rotationslücke',
    similarity: 'RoPE-Ähnlichkeits-Hinweis',
    formula: 'Attention sieht Winkel(qᵢ) − Winkel(kⱼ) ≈ (i − j) × Rotationsschritt',
    tokens: 'Tokens bekommen Positionsinformation vor Attention',
    absolute: 'absolute Position',
    relative: 'relativer Vergleich',
    note: 'Das ist ein vereinfachter 2D-Ausschnitt. Echtes RoPE rotiert viele Vektorpaare mit unterschiedlichen Frequenzen.',
  },
}

function pointFor(angle: number, radius = RADIUS) {
  return {
    x: CENTER + Math.cos(angle - Math.PI / 2) * radius,
    y: CENTER + Math.sin(angle - Math.PI / 2) * radius,
  }
}

function arcPath(startAngle: number, endAngle: number) {
  const start = pointFor(startAngle, RADIUS + 18)
  const end = pointFor(endAngle, RADIUS + 18)
  const delta = Math.abs(endAngle - startAngle)
  const largeArc = delta % (Math.PI * 2) > Math.PI ? 1 : 0
  const sweep = endAngle >= startAngle ? 1 : 0
  return `M ${start.x} ${start.y} A ${RADIUS + 18} ${RADIUS + 18} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`
}

function VectorCircle({
  queryAngle,
  keyAngle,
  label,
  muted = false,
}: {
  queryAngle: number
  keyAngle: number
  label: string
  muted?: boolean
}) {
  const q = pointFor(queryAngle)
  const k = pointFor(keyAngle)
  const gapPath = arcPath(keyAngle, queryAngle)

  return (
    <div className={clsx('rounded-2xl border bg-background/45 p-4', muted ? 'border-border/70 opacity-75' : 'border-primary/25')}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-text">{label}</span>
        <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-1 font-mono text-xs text-cyan-200">
          Δθ {Math.abs(queryAngle - keyAngle).toFixed(2)} rad
        </span>
      </div>
      <svg viewBox="0 0 192 192" className="mx-auto h-52 w-full max-w-[260px] overflow-visible">
        <defs>
          <filter id={muted ? 'ropeGlowMuted' : 'ropeGlow'} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={muted ? 'ropeArcMuted' : 'ropeArc'} x1="0" x2="1">
            <stop offset="0%" stopColor={muted ? '#64748b' : '#22d3ee'} />
            <stop offset="100%" stopColor={muted ? '#94a3b8' : '#a78bfa'} />
          </linearGradient>
        </defs>
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="rgba(15,23,42,0.32)" stroke="rgba(148,163,184,0.22)" strokeWidth="1.5" />
        {[0, 1, 2, 3].map((tick) => {
          const angle = (tick * Math.PI) / 2
          const p1 = pointFor(angle, RADIUS - 5)
          const p2 = pointFor(angle, RADIUS + 5)
          return <line key={tick} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
        })}
        <path d={gapPath} fill="none" stroke={`url(#${muted ? 'ropeArcMuted' : 'ropeArc'})`} strokeWidth="5" strokeLinecap="round" opacity={muted ? 0.55 : 0.9} />
        <line x1={CENTER} y1={CENTER} x2={k.x} y2={k.y} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity={muted ? 0.55 : 1} />
        <line x1={CENTER} y1={CENTER} x2={q.x} y2={q.y} stroke="#c084fc" strokeWidth="4" strokeLinecap="round" opacity={muted ? 0.55 : 1} />
        <circle cx={CENTER} cy={CENTER} r="4" fill="rgba(226,232,240,0.7)" />
        <circle cx={k.x} cy={k.y} r="7" fill="#38bdf8" filter={`url(#${muted ? 'ropeGlowMuted' : 'ropeGlow'})`} />
        <circle cx={q.x} cy={q.y} r="7" fill="#c084fc" filter={`url(#${muted ? 'ropeGlowMuted' : 'ropeGlow'})`} />
        <text x={q.x + 9} y={q.y - 7} fill="#e9d5ff" fontSize="12" fontWeight="700">q</text>
        <text x={k.x + 9} y={k.y + 14} fill="#bae6fd" fontSize="12" fontWeight="700">k</text>
      </svg>
    </div>
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
  const shiftedQueryAngle = shiftedFocus * BASE_STEP
  const shiftedKeyAngle = shiftedKey * BASE_STEP
  const similarity = ((Math.cos(queryAngle - keyAngle) + 1) / 2) * 100

  const setFocusClamped = (value: number) => setFocusPosition(Math.max(Math.min(value, sequenceLength - 1), Math.min(distance, sequenceLength - 1)))
  const setLengthClamped = (value: number) => {
    setSequenceLength(value)
    setDistance((current) => Math.min(current, Math.min(6, value - 1)))
    setFocusPosition((current) => Math.min(current, value - 1))
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface/60 shadow-2xl shadow-primary/5">
      <div className="border-b border-border bg-surface-elevated/70 px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
                <RotateCw size={19} className="text-primary-light" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text">{c.title}</h3>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-muted">{c.subtitle}</p>
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            <div className="font-semibold">{c.relativeOffset}: {safeDistance}</div>
            <div className="text-xs text-emerald-200/75">{c.sameGap}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-text">
              <CircleDot size={16} className="text-cyan-300" />
              {c.tokens}
            </div>
            <div className="space-y-3">
              <label className="block">
                <div className="mb-2 flex justify-between text-xs text-muted"><span>{c.sequence}</span><span className="font-mono text-text">{sequenceLength}</span></div>
                <input aria-label={c.sequence} type="range" min={5} max={12} value={sequenceLength} onChange={(e) => setLengthClamped(Number(e.target.value))} className="w-full accent-cyan-400" />
              </label>
              <label className="block">
                <div className="mb-2 flex justify-between text-xs text-muted"><span>{c.focus}</span><span className="font-mono text-purple-200">{safeFocus}</span></div>
                <input aria-label={c.focus} type="range" min={safeDistance} max={sequenceLength - 1} value={safeFocus} onChange={(e) => setFocusClamped(Number(e.target.value))} className="w-full accent-purple-400" />
              </label>
              <label className="block">
                <div className="mb-2 flex justify-between text-xs text-muted"><span>{c.distance}</span><span className="font-mono text-emerald-200">{safeDistance}</span></div>
                <input aria-label={c.distance} type="range" min={1} max={maxDistance} value={safeDistance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-emerald-400" />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {tokens.map((token, index) => {
                const isFocus = index === safeFocus
                const isKey = index === keyPosition
                const isShifted = index === shiftedFocus || index === shiftedKey
                return (
                  <button
                    key={`${token}-${index}`}
                    onClick={() => index >= safeDistance && setFocusPosition(index)}
                    className={clsx(
                      'group relative rounded-xl border px-3 py-2 text-left transition-all',
                      isFocus && 'border-purple-300/70 bg-purple-500/20 text-purple-100 shadow-lg shadow-purple-500/10',
                      isKey && 'border-cyan-300/70 bg-cyan-500/20 text-cyan-100 shadow-lg shadow-cyan-500/10',
                      !isFocus && !isKey && isShifted && 'border-slate-400/35 bg-slate-400/10 text-slate-200',
                      !isFocus && !isKey && !isShifted && 'border-border bg-surface/70 text-muted hover:border-primary/30 hover:text-text'
                    )}
                  >
                    <div className="font-mono text-sm">{token}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider opacity-70">pos {index}</div>
                    <div className="absolute -bottom-2 left-3 right-3 h-1 rounded-full bg-gradient-to-r from-cyan-400/0 via-cyan-300/60 to-purple-400/0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                )
              })}
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-purple-400/20 bg-purple-400/10 p-3 text-purple-100">
                {c.focusLabel} <span className="font-mono font-bold">{safeFocus}</span>
              </div>
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-100">
                {c.keyLabel} <span className="font-mono font-bold">{keyPosition}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <VectorCircle queryAngle={queryAngle} keyAngle={keyAngle} label={`${c.absolute}: ${safeFocus} → ${keyPosition}`} />
            <VectorCircle queryAngle={shiftedQueryAngle} keyAngle={shiftedKeyAngle} label={`${c.sameOffset}: ${shiftedFocus} → ${shiftedKey}`} muted />
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 font-semibold text-text">
                <ArrowRight size={17} className="text-emerald-300" />
                {c.relative}
              </div>
              <div className="font-mono text-sm text-muted">{c.formula}</div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-surface-elevated">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 transition-all" style={{ width: `${similarity}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>{c.similarity}</span>
              <span className="font-mono text-emerald-200">{similarity.toFixed(0)}%</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{c.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
