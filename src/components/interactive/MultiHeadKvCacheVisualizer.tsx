'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Braces, Database, Link2, Network, RotateCcw, StepForward, Zap } from 'lucide-react'
import { useLocale } from '@/lib/i18n/context'

type HeadId = 'syntax' | 'reference' | 'topic' | 'position'

const TOKENS = ['The', 'robot', 'that', 'Lena', 'built', 'explains', 'attention']

const HEADS: Record<HeadId, {
  label: { en: string; de: string }
  short: { en: string; de: string }
  icon: typeof Braces
  color: string
  ring: string
  bg: string
  weights: number[]
  explanation: { en: string; de: string }
}> = {
  syntax: {
    label: { en: 'Syntax head', de: 'Syntax-Head' },
    short: { en: 'syntax', de: 'Syntax' },
    icon: Braces,
    color: 'text-cyan-300',
    ring: 'border-cyan-400/40',
    bg: 'bg-cyan-500/10',
    weights: [0.1, 0.24, 0.12, 0.08, 0.32, 0.92, 0.58],
    explanation: {
      en: 'This head mostly checks which earlier words make the current verb phrase grammatically fit.',
      de: 'Dieser Head prüft vor allem, welche früheren Wörter zur aktuellen Verbphrase grammatisch passen.',
    },
  },
  reference: {
    label: { en: 'Reference head', de: 'Referenz-Head' },
    short: { en: 'reference', de: 'Referenz' },
    icon: Link2,
    color: 'text-violet-300',
    ring: 'border-violet-400/40',
    bg: 'bg-violet-500/10',
    weights: [0.08, 0.84, 0.18, 0.76, 0.22, 0.36, 0.9],
    explanation: {
      en: 'This head looks for entities and long-range links: what is being explained, and who built it?',
      de: 'Dieser Head sucht Entitäten und Langstreckenbezüge: Was wird erklärt, und wer hat es gebaut?',
    },
  },
  topic: {
    label: { en: 'Topic head', de: 'Themen-Head' },
    short: { en: 'topic', de: 'Thema' },
    icon: Brain,
    color: 'text-emerald-300',
    ring: 'border-emerald-400/40',
    bg: 'bg-emerald-500/10',
    weights: [0.05, 0.64, 0.1, 0.18, 0.42, 0.74, 0.96],
    explanation: {
      en: 'This head gives more weight to the semantic theme, keeping “robot” and “attention” active.',
      de: 'Dieser Head gewichtet das semantische Thema stärker und hält „robot“ und „attention“ aktiv.',
    },
  },
  position: {
    label: { en: 'Local order head', de: 'Lokaler-Ordnungs-Head' },
    short: { en: 'order', de: 'Ordnung' },
    icon: Network,
    color: 'text-amber-300',
    ring: 'border-amber-400/40',
    bg: 'bg-amber-500/10',
    weights: [0.04, 0.08, 0.12, 0.18, 0.42, 0.86, 0.94],
    explanation: {
      en: 'This head prefers nearby tokens, useful for word order and short local dependencies.',
      de: 'Dieser Head bevorzugt nahe Tokens, nützlich für Wortreihenfolge und kurze lokale Abhängigkeiten.',
    },
  },
}

const COPY = {
  en: {
    eyebrow: 'Interactive decoder view',
    title: 'Heads look differently; the KV cache remembers old keys and values',
    desc: 'Switch the head focus, then step through generation. Each head reads the same token stream through a different learned projection. During decoding, previous K/V vectors are reused from cache, so the model only adds work for the newest token.',
    headFocus: 'Head focus',
    decodeStep: 'Decode step',
    next: 'Next token',
    reset: 'Reset',
    attentionView: 'What this head attends to',
    cache: 'KV cache growth',
    cached: 'cached K/V',
    newWork: 'new Q/K/V work',
    avoided: 'avoided recomputation',
    withoutCache: 'without cache',
    withCache: 'with cache',
    prompt: 'Prompt tokens are already cached. Step forward to decode one new token at a time.',
    reads: 'new token reads cached keys/values',
    queries: 'Only the new token creates a fresh query; old keys and values stay in memory.',
  },
  de: {
    eyebrow: 'Interaktive Decoder-Ansicht',
    title: 'Heads schauen unterschiedlich; der KV-Cache merkt sich alte Keys und Values',
    desc: 'Wechsle den Head-Fokus und gehe dann durch die Generierung. Jeder Head liest denselben Token-Stream durch eine andere gelernte Projektion. Beim Decoding werden frühere K/V-Vektoren aus dem Cache wiederverwendet, daher kommt nur Arbeit für das neueste Token hinzu.',
    headFocus: 'Head-Fokus',
    decodeStep: 'Decoding-Schritt',
    next: 'Nächstes Token',
    reset: 'Zurücksetzen',
    attentionView: 'Worauf dieser Head achtet',
    cache: 'KV-Cache-Wachstum',
    cached: 'K/V im Cache',
    newWork: 'neue Q/K/V-Arbeit',
    avoided: 'vermiedene Neuberechnung',
    withoutCache: 'ohne Cache',
    withCache: 'mit Cache',
    prompt: 'Die Prompt-Tokens sind bereits gecacht. Gehe vorwärts, um jeweils ein neues Token zu decodieren.',
    reads: 'neues Token liest gecachte Keys/Values',
    queries: 'Nur das neue Token erzeugt eine frische Query; alte Keys und Values bleiben im Speicher.',
  },
}

function vector(seed: number) {
  return Array.from({ length: 3 }, (_, i) => Math.round((Math.sin(seed * 4.7 + i * 2.3) * 0.5 + 0.5) * 9))
}

export function MultiHeadKvCacheVisualizer() {
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

  const advance = () => setStep((value) => Math.min(TOKENS.length, value + 1))
  const reset = () => setStep(3)

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface/60 p-5 shadow-2xl shadow-black/10 md:p-7">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
            <Zap size={13} />
            {c.eyebrow}
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient md:text-3xl">{c.title}</h2>
          <p className="mt-3 leading-relaxed text-muted">{c.desc}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-elevated/70 p-4 text-sm text-muted md:w-72">
          <div className="mb-2 flex items-center gap-2 font-semibold text-text">
            <Database size={16} className="text-primary-light" />
            KV cache
          </div>
          {c.prompt}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">{c.headFocus}</div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(HEADS) as HeadId[]).map((id) => {
                const option = HEADS[id]
                const OptionIcon = option.icon
                const active = id === headId
                return (
                  <button
                    key={id}
                    onClick={() => setHeadId(id)}
                    className={`rounded-xl border p-3 text-left transition-all ${active ? `${option.ring} ${option.bg}` : 'border-border bg-surface-elevated/50 hover:border-primary/30'}`}
                  >
                    <OptionIcon size={17} className={active ? option.color : 'text-muted'} />
                    <div className="mt-2 text-sm font-semibold text-text">{option.label[lang]}</div>
                    <div className="text-xs text-muted">{option.short[lang]}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className={`rounded-2xl border ${head.ring} ${head.bg} p-4`}>
            <div className="mb-3 flex items-center gap-2">
              <Icon size={18} className={head.color} />
              <h3 className="font-heading text-lg font-bold text-text">{c.attentionView}</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted">{head.explanation[lang]}</p>
            <div className="space-y-2">
              {visibleTokens.map((token, index) => {
                const weight = head.weights[index]
                const isCurrent = index === step - 1
                return (
                  <div key={`${token}-${index}`} className="grid grid-cols-[5rem_1fr_3rem] items-center gap-3 text-sm">
                    <div className={`rounded-lg border px-2 py-1 font-mono ${isCurrent ? 'border-primary/50 bg-primary/15 text-primary-light' : 'border-border bg-surface/70 text-text'}`}>
                      {token}
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className={`h-full rounded-full ${isCurrent ? 'bg-primary' : 'bg-gradient-to-r from-cyan-400 to-violet-400'}`}
                        animate={{ width: `${Math.max(8, weight * 100)}%` }}
                        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                      />
                    </div>
                    <span className="font-mono text-xs text-muted">{Math.round(weight * 100)}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-surface-elevated/45 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted">{c.decodeStep}</div>
                <div className="mt-1 font-heading text-xl font-bold text-text">{step} / {TOKENS.length} tokens</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={advance}
                  disabled={step >= TOKENS.length}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary/20 px-3 py-2 text-sm font-semibold text-primary-light transition-colors hover:bg-primary/30 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <StepForward size={16} />
                  {c.next}
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:border-primary/40"
                >
                  <RotateCcw size={16} />
                  {c.reset}
                </button>
              </div>
            </div>

            <div className="relative rounded-xl border border-border bg-black/15 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {TOKENS.map((token, index) => {
                  const active = index < step
                  const current = index === step - 1
                  return (
                    <motion.div
                      key={`${token}-${index}`}
                      animate={{ scale: current ? 1.08 : 1, opacity: active ? 1 : 0.35 }}
                      className={`rounded-lg border px-3 py-2 font-mono text-sm ${current ? 'border-primary/60 bg-primary/20 text-primary-light shadow-lg shadow-primary/10' : active ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100' : 'border-border bg-surface text-muted'}`}
                    >
                      {token}
                    </motion.div>
                  )
                })}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {c.reads}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-elevated/45 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-heading text-lg font-bold text-text">{c.cache}</h3>
              <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                {step} {c.cached}
              </span>
            </div>
            <div className="grid gap-2">
              {visibleTokens.map((token, index) => {
                const fresh = index === step - 1
                const values = vector(index + (headId.length * 3))
                return (
                  <motion.div
                    key={`${token}-cache-${index}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`grid grid-cols-[4.5rem_1fr] items-center gap-3 rounded-xl border p-3 ${fresh ? 'border-primary/50 bg-primary/10' : 'border-border bg-surface/55'}`}
                  >
                    <div className="font-mono text-sm font-semibold text-text">{token}</div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-md bg-cyan-500/10 px-2 py-1 font-mono text-cyan-300">K [{values.join(' ') }]</span>
                      <span className="rounded-md bg-orange-500/10 px-2 py-1 font-mono text-orange-300">V [{values.slice().reverse().join(' ') }]</span>
                      {fresh && <span className="rounded-md bg-primary/15 px-2 py-1 font-semibold text-primary-light">{c.newWork}</span>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.queries}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-red-400/20 bg-red-500/5 p-4">
              <div className="text-xs uppercase tracking-widest text-red-300">{c.withoutCache}</div>
              <div className="mt-1 font-heading text-3xl font-bold text-red-300">{totals.withoutCache}</div>
            </div>
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4">
              <div className="text-xs uppercase tracking-widest text-emerald-300">{c.withCache}</div>
              <div className="mt-1 font-heading text-3xl font-bold text-emerald-300">{totals.withCache}</div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="text-xs uppercase tracking-widest text-primary-light">{c.avoided}</div>
              <div className="mt-1 font-heading text-3xl font-bold text-primary-light">{totals.avoided}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
