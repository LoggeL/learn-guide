'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Aperture, Braces, Brain, Database, Link2, Network, RotateCcw, StepForward, Telescope } from 'lucide-react'
import { useLocale } from '@/lib/i18n/context'

type HeadId = 'syntax' | 'reference' | 'topic' | 'position'

const TOKENS = ['The', 'robot', 'that', 'Lena', 'built', 'explains', 'attention']

const HEADS: Record<HeadId, {
  label: { en: string; de: string }
  short: { en: string; de: string }
  lens: { en: string; de: string }
  icon: typeof Braces
  color: string
  beam: string
  glow: string
  weights: number[]
  explanation: { en: string; de: string }
}> = {
  syntax: {
    label: { en: 'Syntax head', de: 'Syntax-Head' },
    short: { en: 'syntax', de: 'Syntax' },
    lens: { en: 'Grammar lens', de: 'Grammatik-Linse' },
    icon: Braces,
    color: '#22d3ee',
    beam: 'from-cyan-300 via-sky-400 to-cyan-200',
    glow: 'shadow-cyan-500/25',
    weights: [0.1, 0.24, 0.12, 0.08, 0.32, 0.92, 0.58],
    explanation: {
      en: 'This lens mostly checks which earlier words make the current verb phrase grammatically fit.',
      de: 'Diese Linse prüft vor allem, welche früheren Wörter zur aktuellen Verbphrase grammatisch passen.',
    },
  },
  reference: {
    label: { en: 'Reference head', de: 'Referenz-Head' },
    short: { en: 'reference', de: 'Referenz' },
    lens: { en: 'Entity lens', de: 'Entitäten-Linse' },
    icon: Link2,
    color: '#a78bfa',
    beam: 'from-violet-300 via-fuchsia-400 to-violet-200',
    glow: 'shadow-violet-500/25',
    weights: [0.08, 0.84, 0.18, 0.76, 0.22, 0.36, 0.9],
    explanation: {
      en: 'This lens looks for entities and long-range links: what is being explained, and who built it?',
      de: 'Diese Linse sucht Entitäten und Langstreckenbezüge: Was wird erklärt, und wer hat es gebaut?',
    },
  },
  topic: {
    label: { en: 'Topic head', de: 'Themen-Head' },
    short: { en: 'topic', de: 'Thema' },
    lens: { en: 'Meaning lens', de: 'Bedeutungs-Linse' },
    icon: Brain,
    color: '#34d399',
    beam: 'from-emerald-300 via-teal-400 to-lime-200',
    glow: 'shadow-emerald-500/25',
    weights: [0.05, 0.64, 0.1, 0.18, 0.42, 0.74, 0.96],
    explanation: {
      en: 'This lens gives more weight to the semantic theme, keeping “robot” and “attention” active.',
      de: 'Diese Linse gewichtet das semantische Thema stärker und hält „robot“ und „attention“ aktiv.',
    },
  },
  position: {
    label: { en: 'Local order head', de: 'Lokaler-Ordnungs-Head' },
    short: { en: 'order', de: 'Ordnung' },
    lens: { en: 'Nearby lens', de: 'Nähe-Linse' },
    icon: Network,
    color: '#fbbf24',
    beam: 'from-amber-300 via-orange-400 to-yellow-200',
    glow: 'shadow-amber-500/25',
    weights: [0.04, 0.08, 0.12, 0.18, 0.42, 0.86, 0.94],
    explanation: {
      en: 'This lens prefers nearby tokens, useful for word order and short local dependencies.',
      de: 'Diese Linse bevorzugt nahe Tokens, nützlich für Wortreihenfolge und kurze lokale Abhängigkeiten.',
    },
  },
}

const COPY = {
  en: {
    eyebrow: 'Attention observatory',
    title: 'Multiple lenses scan the prompt while MQA/GQA share key-value shelves',
    desc: 'Switch the telescope lens, then step through grouped-query layouts. Each query head keeps its own attention view, while MQA/GQA share fewer key-value shelves behind the scenes.',
    headFocus: 'Lens array',
    decodeStep: 'Head grouping',
    next: 'More sharing',
    reset: 'Reset',
    attentionView: 'Radar sweep for this head',
    cache: 'Key-value sharing shelf',
    cached: 'KV groups',
    newWork: 'query lens',
    avoided: 'saved KV heads',
    withoutCache: 'separate K/V',
    withCache: 'shared K/V',
    prompt: 'Every query lens can either own separate key/value shelves or share them in MQA/GQA groups.',
    reads: 'query beams read shared key-value shelves',
    queries: 'More sharing means fewer key-value heads to store and read, while the model still keeps multiple query lenses.',
    currentToken: 'Current token',
    intensity: 'attention intensity',
    scan: 'scan',
    key: 'K',
    value: 'V',
  },
  de: {
    eyebrow: 'Attention-Observatorium',
    title: 'Mehrere Linsen scannen den Prompt, während MQA/GQA Key-Value-Regale teilen',
    desc: 'Wechsle die Teleskop-Linse und gehe durch Grouped-Query-Layouts. Jeder Query-Head behält seine eigene Attention-Sicht, während MQA/GQA im Hintergrund weniger Key-Value-Regale teilen.',
    headFocus: 'Linsen-Array',
    decodeStep: 'Head-Gruppierung',
    next: 'Mehr Sharing',
    reset: 'Zurücksetzen',
    attentionView: 'Radar-Sweep für diesen Head',
    cache: 'Key-Value-Sharing-Regal',
    cached: 'KV-Gruppen',
    newWork: 'Query-Linse',
    avoided: 'gesparte KV-Heads',
    withoutCache: 'separate K/V',
    withCache: 'geteilte K/V',
    prompt: 'Jede Query-Linse kann eigene Key/Value-Regale besitzen oder sie in MQA/GQA-Gruppen teilen.',
    reads: 'Query-Strahlen lesen geteilte Key-Value-Regale',
    queries: 'Mehr Sharing bedeutet weniger Key-Value-Heads zum Speichern und Lesen, während mehrere Query-Linsen erhalten bleiben.',
    currentToken: 'Aktuelles Token',
    intensity: 'Attention-Stärke',
    scan: 'Scan',
    key: 'K',
    value: 'V',
  },
}

function vector(seed: number) {
  return Array.from({ length: 3 }, (_, i) => Math.round((Math.sin(seed * 4.7 + i * 2.3) * 0.5 + 0.5) * 9))
}

function polarPoint(index: number, total: number, radius: number) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
    angle,
  }
}

export function MultiHeadGqaVisualizer() {
  const { locale } = useLocale()
  const lang = locale === 'de' ? 'de' : 'en'
  const c = COPY[lang]
  const [headId, setHeadId] = useState<HeadId>('reference')
  const [step, setStep] = useState(3)
  const head = HEADS[headId]
  const visibleTokens = TOKENS.slice(0, step)
  const Icon = head.icon

  const totals = useMemo(() => {
    const withoutCache = (step * (step + 1)) / 2
    const withCache = step
    return { withoutCache, withCache, avoided: Math.max(0, withoutCache - withCache) }
  }, [step])

  const tokenPoints = useMemo(() => TOKENS.map((_, index) => polarPoint(index, TOKENS.length, 34)), [])
  const activeHeadIds = Object.keys(HEADS) as HeadId[]
  const advance = () => setStep((value) => Math.min(TOKENS.length, value + 1))
  const reset = () => setStep(3)
  const currentPoint = tokenPoints[step - 1]

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[#070b18] p-4 text-text shadow-2xl shadow-cyan-950/30 md:p-7">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.12)_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <div className="relative mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
            <Telescope size={14} />
            {c.eyebrow}
          </div>
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">{c.title}</h2>
          <p className="mt-3 leading-relaxed text-slate-300">{c.desc}</p>
        </div>
        <div className="rounded-2xl border border-amber-300/25 bg-amber-200/10 p-4 text-sm text-amber-50 lg:w-80">
          <div className="mb-2 flex items-center gap-2 font-semibold text-white">
            <Database size={16} className="text-amber-200" />
            {c.cache}
          </div>
          {c.prompt}
        </div>
      </div>

      <div className="relative grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">{c.attentionView}</div>
              <div className="mt-1 flex items-center gap-2 font-heading text-xl font-bold text-white">
                <Icon size={20} style={{ color: head.color }} />
                {head.lens[lang]}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={advance}
                disabled={step >= TOKENS.length}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-200/25 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <StepForward size={16} />
                {c.next}
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-slate-100 ring-1 ring-white/15 transition hover:bg-white/10"
              >
                <RotateCcw size={16} />
                {c.reset}
              </button>
            </div>
          </div>

          <div className="grid items-center gap-5 lg:grid-cols-[minmax(290px,1fr)_18rem]">
            <div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-full border border-cyan-100/15 bg-black/30 p-2 shadow-inner shadow-cyan-950/70">
              <svg viewBox="0 0 100 100" role="img" aria-label={c.attentionView} className="h-full w-full">
                <defs>
                  <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={head.color} stopOpacity="0.36" />
                    <stop offset="58%" stopColor={head.color} stopOpacity="0.08" />
                    <stop offset="100%" stopColor={head.color} stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="beamGradient" x1="50" y1="50" x2={currentPoint.x} y2={currentPoint.y} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={head.color} stopOpacity="0.82" />
                    <stop offset="100%" stopColor={head.color} stopOpacity="0.08" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#radarGlow)" />
                {[14, 24, 34, 44].map((radius) => (
                  <circle key={radius} cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.35" />
                ))}
                {Array.from({ length: 12 }, (_, index) => {
                  const point = polarPoint(index, 12, 45)
                  return <line key={index} x1="50" y1="50" x2={point.x} y2={point.y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
                })}
                <motion.line
                  key={`${headId}-${step}-sweep`}
                  x1="50"
                  y1="50"
                  x2={currentPoint.x}
                  y2={currentPoint.y}
                  stroke="url(#beamGradient)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.32, 0.9, 0.45] }}
                  transition={{ duration: 0.9 }}
                />
                {visibleTokens.slice(0, -1).map((token, index) => {
                  const point = tokenPoints[index]
                  const weight = head.weights[index]
                  return (
                    <motion.line
                      key={`${headId}-${token}-${index}`}
                      x1={currentPoint.x}
                      y1={currentPoint.y}
                      x2={point.x}
                      y2={point.y}
                      stroke={head.color}
                      strokeOpacity={0.16 + weight * 0.72}
                      strokeWidth={0.45 + weight * 2.2}
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, delay: index * 0.04 }}
                    />
                  )
                })}
                <circle cx="50" cy="50" r="7.5" fill="rgba(15,23,42,0.92)" stroke={head.color} strokeWidth="0.8" />
                <circle cx="50" cy="50" r="2.4" fill={head.color} />
                {TOKENS.map((token, index) => {
                  const point = tokenPoints[index]
                  const active = index < step
                  const current = index === step - 1
                  const weight = head.weights[index]
                  return (
                    <g key={`${token}-${index}`} opacity={active ? 1 : 0.28}>
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r={current ? 4.6 : 3 + weight * 2.4}
                        fill={current ? head.color : 'rgba(15,23,42,0.96)'}
                        stroke={active ? head.color : 'rgba(255,255,255,0.28)'}
                        strokeWidth={current ? 1.2 : 0.8}
                        animate={{ scale: current ? [1, 1.16, 1] : 1 }}
                        transition={{ duration: 1.1, repeat: current ? Infinity : 0 }}
                      />
                      <text
                        x={point.x}
                        y={point.y + 8.5}
                        textAnchor="middle"
                        className="fill-slate-100 font-mono text-[3px]"
                      >
                        {token}
                      </text>
                    </g>
                  )
                })}
              </svg>
              <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
                <div className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-slate-200 backdrop-blur">
                  {c.currentToken}: <span className="font-mono text-white">{TOKENS[step - 1]}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm leading-relaxed text-slate-300">{head.explanation[lang]}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: head.color }} />
                  {c.reads}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{c.intensity}</div>
                <div className="space-y-2">
                  {visibleTokens.map((token, index) => {
                    const weight = head.weights[index]
                    const current = index === step - 1
                    return (
                      <div key={`${token}-beam-${index}`} className="grid grid-cols-[4.6rem_1fr_2.6rem] items-center gap-2 text-sm">
                        <span className={`rounded-full px-2 py-1 font-mono ${current ? 'bg-white text-slate-950' : 'bg-white/8 text-slate-200'}`}>{token}</span>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${head.beam}`}
                            animate={{ width: `${Math.max(6, weight * 100)}%` }}
                            transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-400">{Math.round(weight * 100)}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">{c.headFocus}</div>
                <div className="mt-1 text-sm text-slate-300">{c.scan}: {step} / {TOKENS.length}</div>
              </div>
              <Aperture size={24} style={{ color: head.color }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {activeHeadIds.map((id) => {
                const option = HEADS[id]
                const OptionIcon = option.icon
                const active = id === headId
                return (
                  <button
                    key={id}
                    onClick={() => setHeadId(id)}
                    aria-pressed={active}
                    className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition ${active ? 'border-white/40 bg-white/12' : 'border-white/10 bg-black/20 hover:border-white/25 hover:bg-white/8'}`}
                  >
                    <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl ${active ? 'opacity-60' : 'opacity-0 group-hover:opacity-30'}`} style={{ backgroundColor: option.color }} />
                    <div className="relative flex items-center gap-2">
                      <span className={`grid h-9 w-9 place-items-center rounded-full border bg-black/30 ${active ? `shadow-lg ${option.glow}` : ''}`} style={{ borderColor: active ? option.color : 'rgba(255,255,255,0.12)' }}>
                        <OptionIcon size={17} style={{ color: active ? option.color : 'rgb(148 163 184)' }} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-white">{option.label[lang]}</span>
                        <span className="text-xs text-slate-400">{option.short[lang]}</span>
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-amber-200/15 bg-[linear-gradient(135deg,rgba(120,53,15,0.28),rgba(15,23,42,0.52))] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-heading text-lg font-bold text-white">{c.cache}</h3>
              <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-3 py-1 text-xs font-semibold text-amber-100">
                {step} {c.cached}
              </span>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-max gap-2">
                {TOKENS.map((token, index) => {
                  const active = index < step
                  const fresh = index === step - 1
                  const values = vector(index + headId.length * 3)
                  return (
                    <motion.div
                      key={`${token}-ledger-${index}`}
                      animate={{ opacity: active ? 1 : 0.32, y: fresh ? -4 : 0 }}
                      className={`w-28 shrink-0 rounded-xl border p-2 ${fresh ? 'border-cyan-200/55 bg-cyan-200/15 shadow-lg shadow-cyan-500/10' : active ? 'border-amber-100/20 bg-black/24' : 'border-white/10 bg-black/10'}`}
                    >
                      <div className="mb-2 truncate font-mono text-sm font-semibold text-white">{token}</div>
                      <div className="space-y-1 font-mono text-[11px]">
                        <div className="rounded bg-cyan-300/10 px-1.5 py-1 text-cyan-100">{c.key} [{values.join('')}]</div>
                        <div className="rounded bg-orange-300/10 px-1.5 py-1 text-orange-100">{c.value} [{values.slice().reverse().join('')}]</div>
                      </div>
                      {fresh && <div className="mt-2 rounded-full bg-white px-2 py-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-slate-950">{c.newWork}</div>}
                    </motion.div>
                  )
                })}
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-amber-50/80">{c.queries}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-2xl border border-red-300/20 bg-red-400/8 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-red-200">{c.withoutCache}</div>
              <div className="mt-1 font-heading text-3xl font-bold text-red-100">{totals.withoutCache}</div>
            </div>
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/8 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-200">{c.withCache}</div>
              <div className="mt-1 font-heading text-3xl font-bold text-emerald-100">{totals.withCache}</div>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/8 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-200">{c.avoided}</div>
              <div className="mt-1 font-heading text-3xl font-bold text-cyan-100">{totals.avoided}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
