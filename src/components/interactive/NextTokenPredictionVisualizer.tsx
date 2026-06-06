'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, BrainCircuit, Crosshair, Dice5, Gauge, Sparkles } from 'lucide-react'
import { useLocale } from '@/lib/i18n/context'

type TokenCandidate = {
  token: string
  logit: number
  note: {
    en: string
    de: string
  }
}

const candidates: TokenCandidate[] = [
  { token: 'mat', logit: 4.8, note: { en: 'most likely object', de: 'wahrscheinlichstes Objekt' } },
  { token: 'sofa', logit: 4.1, note: { en: 'also plausible', de: 'auch plausibel' } },
  { token: 'rug', logit: 3.5, note: { en: 'lower but valid', de: 'seltener, aber möglich' } },
  { token: 'moon', logit: 2.2, note: { en: 'creative jump', de: 'kreativer Sprung' } },
  { token: 'code', logit: 1.4, note: { en: 'off-topic tail', de: 'Off-Topic-Tail' } },
]

const copy = {
  en: {
    title: 'Next-token prediction, step by step',
    subtitle: 'Move the decoding controls and watch raw model scores become one sampled token.',
    promptLabel: 'Prompt context',
    prompt: 'The cat slept on the',
    logits: 'Logits',
    softmax: 'Softmax probabilities',
    sample: 'Sampling pick',
    temperature: 'Temperature',
    topP: 'Top-p nucleus',
    colder: 'sharper',
    hotter: 'flatter',
    smaller: 'focused',
    wider: 'wider',
    kept: 'kept by top-p',
    removed: 'filtered out',
    selected: 'Selected next token',
    appended: 'Append it, then run the model again for the next position.',
    helper:
      'Logits are raw scores. Temperature reshapes them, softmax normalizes them, and top-p removes the low-probability tail before the sampler chooses.',
  },
  de: {
    title: 'Next-Token Prediction, Schritt für Schritt',
    subtitle: 'Bewege die Decoding-Regler und sieh, wie rohe Scores zu einem gesampelten Token werden.',
    promptLabel: 'Prompt-Kontext',
    prompt: 'Die Katze schlief auf der',
    logits: 'Logits',
    softmax: 'Softmax-Wahrscheinlichkeiten',
    sample: 'Sampling-Auswahl',
    temperature: 'Temperature',
    topP: 'Top-p Nucleus',
    colder: 'schärfer',
    hotter: 'flacher',
    smaller: 'fokussiert',
    wider: 'breiter',
    kept: 'von top-p behalten',
    removed: 'herausgefiltert',
    selected: 'Ausgewähltes nächstes Token',
    appended: 'Anhängen, dann läuft das Modell erneut für die nächste Position.',
    helper:
      'Logits sind rohe Scores. Temperature formt sie um, Softmax normalisiert sie, und top-p entfernt den unwahrscheinlichen Tail vor der Auswahl.',
  },
}

function softmax(values: number[]) {
  const max = Math.max(...values)
  const exps = values.map((value) => Math.exp(value - max))
  const total = exps.reduce((sum, value) => sum + value, 0)
  return exps.map((value) => value / total)
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(value >= 0.1 ? 0 : 1)}%`
}

export function NextTokenPredictionVisualizer() {
  const { locale } = useLocale()
  const c = locale === 'de' ? copy.de : copy.en
  const [temperature, setTemperature] = useState(0.8)
  const [topP, setTopP] = useState(0.9)

  const distribution = useMemo(() => {
    const adjustedLogits = candidates.map((candidate) => candidate.logit / Math.max(temperature, 0.1))
    const baseProbabilities = softmax(adjustedLogits)
      .map((probability, index) => ({ ...candidates[index], probability }))
      .sort((a, b) => b.probability - a.probability)

    let cumulative = 0
    const nucleus = baseProbabilities.map((item, index) => {
      const keep = cumulative < topP || index === 0
      if (keep) cumulative += item.probability
      return { ...item, keep }
    })

    const keptTotal = nucleus.reduce((sum, item) => sum + (item.keep ? item.probability : 0), 0)
    let running = 0
    const normalized = nucleus.map((item) => {
      const sampledProbability = item.keep ? item.probability / keptTotal : 0
      const start = running
      running += sampledProbability
      return { ...item, sampledProbability, start, end: running }
    })

    // Fixed sampling cursor keeps the demo deterministic while still showing real sampling behavior.
    const cursor = 0.58
    const selected = normalized.find((item) => item.keep && cursor >= item.start && cursor <= item.end) ?? normalized[0]

    return { rows: normalized, selected, cursor }
  }, [temperature, topP])

  const selectedIndex = distribution.rows.findIndex((item) => item.token === distribution.selected.token)
  const maxLogit = Math.max(...candidates.map((candidate) => candidate.logit))

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface/70 shadow-2xl shadow-primary/5">
      <div className="border-b border-border bg-gradient-to-r from-primary/10 via-cyan-500/10 to-violet-500/10 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15">
              <BrainCircuit size={23} className="text-primary-light" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-text">{c.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{c.subtitle}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 px-4 py-3 font-mono text-sm text-muted">
            <span className="text-subtle">{c.promptLabel}</span>
            <div className="mt-1 text-text">“{c.prompt}”</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-background/50 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-text">
              <Gauge size={16} className="text-cyan-300" />
              Decoding controls
            </div>

            <label className="space-y-3 block">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{c.temperature}</span>
                <motion.span key={temperature} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="font-mono text-lg font-bold text-cyan-200">
                  {temperature.toFixed(1)}
                </motion.span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.8"
                step="0.1"
                value={temperature}
                onChange={(event) => setTemperature(Number(event.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-subtle">
                <span>{c.colder}</span>
                <span>{c.hotter}</span>
              </div>
            </label>

            <label className="mt-6 space-y-3 block">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{c.topP}</span>
                <motion.span key={topP} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="font-mono text-lg font-bold text-violet-200">
                  {topP.toFixed(2)}
                </motion.span>
              </div>
              <input
                type="range"
                min="0.45"
                max="1"
                step="0.05"
                value={topP}
                onChange={(event) => setTopP(Number(event.target.value))}
                className="w-full accent-violet-400"
              />
              <div className="flex justify-between text-xs text-subtle">
                <span>{c.smaller}</span>
                <span>{c.wider}</span>
              </div>
            </label>
          </div>

          <motion.div
            key={distribution.selected.token}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <Sparkles size={16} />
              {c.selected}
            </div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-lg">
              <span className="rounded-lg bg-background px-3 py-2 text-muted">{c.prompt}</span>
              <ArrowRight size={17} className="text-emerald-300" />
              <span className="rounded-lg border border-emerald-400/40 bg-emerald-400/15 px-3 py-2 font-bold text-emerald-100">
                {distribution.selected.token}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.appended}</p>
          </motion.div>
        </div>

        <div className="rounded-2xl border border-border bg-background/40 p-4 md:p-5">
          <div className="mb-4 grid grid-cols-[1fr_0.8fr_1.3fr_0.8fr] gap-3 px-2 text-xs font-semibold uppercase tracking-wide text-subtle">
            <span>Token</span>
            <span className="flex items-center gap-1"><BarChart3 size={13} /> {c.logits}</span>
            <span>{c.softmax}</span>
            <span className="flex items-center gap-1"><Dice5 size={13} /> {c.sample}</span>
          </div>

          <div className="space-y-3">
            {distribution.rows.map((item, index) => {
              const isSelected = item.token === distribution.selected.token
              const logitWidth = `${(item.logit / maxLogit) * 100}%`
              const probabilityWidth = `${Math.max(item.sampledProbability * 100, item.keep ? 2 : 0)}%`

              return (
                <motion.div
                  key={item.token}
                  layout
                  className={`grid grid-cols-[1fr_0.8fr_1.3fr_0.8fr] items-center gap-3 rounded-xl border p-3 transition-colors ${
                    isSelected
                      ? 'border-emerald-400/50 bg-emerald-400/10'
                      : item.keep
                        ? 'border-border bg-surface/55'
                        : 'border-border/70 bg-surface/25 opacity-55'
                  }`}
                >
                  <div>
                    <div className="font-mono text-base font-bold text-text">{item.token}</div>
                    <div className="text-xs text-subtle">{item.note[locale === 'de' ? 'de' : 'en']}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-2 overflow-hidden rounded-full bg-background">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400" animate={{ width: logitWidth }} />
                    </div>
                    <div className="font-mono text-xs text-amber-200">{item.logit.toFixed(1)}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="relative h-6 overflow-hidden rounded-full bg-background">
                      <motion.div
                        className={`h-full rounded-full ${item.keep ? 'bg-gradient-to-r from-cyan-400 to-violet-400' : 'bg-slate-600'}`}
                        animate={{ width: probabilityWidth }}
                      />
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-y-0 right-2 flex items-center text-emerald-950"
                        >
                          <Crosshair size={13} />
                        </motion.div>
                      )}
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className={item.keep ? 'text-cyan-200' : 'text-subtle'}>{formatPercent(item.sampledProbability)}</span>
                      <span className="text-subtle">raw {formatPercent(item.probability)}</span>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className={`rounded-full px-2 py-1 ${item.keep ? 'bg-primary/15 text-primary-light' : 'bg-surface-elevated text-subtle'}`}>
                      {item.keep ? c.kept : c.removed}
                    </span>
                    {isSelected && <div className="mt-2 font-semibold text-emerald-200">#{selectedIndex + 1}</div>}
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-5 rounded-xl border border-border bg-surface/45 p-4 text-sm leading-relaxed text-muted">
            {c.helper}
          </div>
        </div>
      </div>
    </section>
  )
}
