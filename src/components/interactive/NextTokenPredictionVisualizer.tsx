'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Crosshair, Gauge, Orbit, Pipette, Radar, Sparkles, Zap } from 'lucide-react'
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

const tokenColors = ['#22d3ee', '#a78bfa', '#34d399', '#f59e0b', '#f472b6']

const copy = {
  en: {
    title: 'Decoding cockpit: choosing the next token',
    subtitle: 'Raw logits drop through temperature, softmax, and the top-p gate before one token is sampled.',
    promptLabel: 'Prompt strip',
    prompt: 'The cat slept on the',
    cockpit: 'Probability lab',
    logits: 'logit intake',
    softmax: 'softmax funnel',
    nucleus: 'top-p gate',
    race: 'probability race',
    roulette: 'sampling cursor',
    controls: 'Decoding controls',
    temperature: 'Temperature',
    topP: 'Top-p nucleus',
    colder: 'sharper peaks',
    hotter: 'flatter field',
    smaller: 'tight gate',
    wider: 'open gate',
    kept: 'in nucleus',
    removed: 'tail cut',
    selected: 'Selected next token',
    appended: 'Append it, then run the model again for the next position.',
    raw: 'raw',
    normalized: 'sample weight',
    helper:
      'Temperature changes the slope of the funnel: low values make one lane dominate, high values flatten the race. Top-p closes the gate once enough probability mass is inside the nucleus.',
  },
  de: {
    title: 'Decoding-Cockpit: das nächste Token wählen',
    subtitle: 'Rohe Logits laufen durch Temperature, Softmax und das Top-p-Gate, bevor ein Token gesampelt wird.',
    promptLabel: 'Prompt-Leiste',
    prompt: 'Die Katze schlief auf der',
    cockpit: 'Wahrscheinlichkeitslabor',
    logits: 'Logit-Einlass',
    softmax: 'Softmax-Trichter',
    nucleus: 'Top-p-Gate',
    race: 'Wahrscheinlichkeitsrennen',
    roulette: 'Sampling-Cursor',
    controls: 'Decoding-Regler',
    temperature: 'Temperature',
    topP: 'Top-p Nucleus',
    colder: 'spitzere Peaks',
    hotter: 'flacheres Feld',
    smaller: 'enges Gate',
    wider: 'offenes Gate',
    kept: 'im Nucleus',
    removed: 'Tail gekappt',
    selected: 'Ausgewähltes nächstes Token',
    appended: 'Anhängen, dann läuft das Modell erneut für die nächste Position.',
    raw: 'roh',
    normalized: 'Sample-Gewicht',
    helper:
      'Temperature verändert die Steigung des Trichters: niedrige Werte lassen eine Spur dominieren, hohe Werte machen das Rennen flacher. Top-p schließt das Gate, sobald genug Wahrscheinlichkeitsmasse im Nucleus liegt.',
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
      .map((probability, index) => ({ ...candidates[index], probability, color: tokenColors[index] }))
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

    return { rows: normalized, selected, cursor, keptTotal }
  }, [temperature, topP])

  const maxLogit = Math.max(...candidates.map((candidate) => candidate.logit))
  const selectedIndex = distribution.rows.findIndex((item) => item.token === distribution.selected.token)
  let rouletteAngle = 0
  const rouletteGradient = distribution.rows
    .filter((item) => item.keep)
    .map((item) => {
      const start = rouletteAngle
      rouletteAngle += item.sampledProbability * 360
      return `${item.color} ${start}deg ${rouletteAngle}deg`
    })
    .join(', ')
  const cursorAngle = distribution.cursor * 360 - 90

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[#07111f] text-text shadow-2xl shadow-cyan-950/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(167,139,250,0.2),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.1),rgba(2,6,23,0.75))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative border-b border-cyan-300/20 px-5 py-5 md:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-lg shadow-cyan-500/10">
              <Radar size={26} className="text-cyan-200" />
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                <Orbit size={13} />
                {c.cockpit}
              </div>
              <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">{c.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">{c.subtitle}</p>
            </div>
          </div>

          <div className="rounded-full border border-cyan-300/25 bg-slate-950/70 px-4 py-3 shadow-inner shadow-cyan-950/40" aria-label={c.promptLabel}>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200/80">{c.promptLabel}</div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-sm md:text-base">
              {c.prompt.split(' ').map((word) => (
                <span key={word} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-100">
                  {word}
                </span>
              ))}
              <span className="rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-1 font-bold text-emerald-100">
                {distribution.selected.token}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative grid gap-6 p-5 md:p-8 xl:grid-cols-[1.05fr_1.25fr_0.9fr]">
        <aside className="space-y-4 rounded-[1.75rem] border border-cyan-300/20 bg-slate-950/55 p-5 shadow-inner shadow-black/20">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-100">
            <Gauge size={17} />
            {c.controls}
          </div>

          <label className="block rounded-3xl border border-cyan-300/15 bg-cyan-300/5 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-200">{c.temperature}</span>
              <motion.span key={temperature} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="font-mono text-2xl font-black text-cyan-100">
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
              className="mt-4 w-full accent-cyan-300"
              aria-label={c.temperature}
            />
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>{c.colder}</span>
              <span>{c.hotter}</span>
            </div>
          </label>

          <label className="block rounded-3xl border border-violet-300/15 bg-violet-300/5 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-200">{c.topP}</span>
              <motion.span key={topP} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="font-mono text-2xl font-black text-violet-100">
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
              className="mt-4 w-full accent-violet-300"
              aria-label={c.topP}
            />
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>{c.smaller}</span>
              <span>{c.wider}</span>
            </div>
          </label>

          <motion.div
            key={distribution.selected.token}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] border border-emerald-300/25 bg-emerald-300/10 p-4"
            aria-live="polite"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-100">
              <Sparkles size={16} />
              {c.selected}
            </div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-base">
              <span className="rounded-full bg-slate-950 px-3 py-2 text-slate-300">… {c.prompt.split(' ').slice(-2).join(' ')}</span>
              <ArrowRight size={16} className="text-emerald-200" />
              <span className="rounded-full border border-emerald-300/50 bg-emerald-300/15 px-4 py-2 font-black text-emerald-50">
                {distribution.selected.token}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{c.appended}</p>
          </motion.div>
        </aside>

        <div className="relative min-h-[560px] rounded-[2rem] border border-slate-600/50 bg-slate-950/45 p-4 md:p-6">
          <div className="mb-5 grid grid-cols-3 items-center gap-2 text-center text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-2 text-amber-100">{c.logits}</span>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-2 text-cyan-100">{c.softmax}</span>
            <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-2 py-2 text-violet-100">{c.nucleus}</span>
          </div>

          <div className="space-y-3" role="list" aria-label={c.race}>
            {distribution.rows.map((item, index) => {
              const isSelected = item.token === distribution.selected.token
              const logitWidth = `${(item.logit / maxLogit) * 100}%`
              const probabilityWidth = `${Math.max(item.sampledProbability * 100, item.keep ? 3 : 0)}%`
              const funnelInset = 7 + index * 5

              return (
                <motion.div
                  key={item.token}
                  layout
                  role="listitem"
                  className={`relative overflow-hidden rounded-[1.35rem] border p-3 transition-colors ${
                    isSelected
                      ? 'border-emerald-300/60 bg-emerald-300/10 shadow-lg shadow-emerald-500/10'
                      : item.keep
                        ? 'border-slate-600/70 bg-slate-900/65'
                        : 'border-slate-700/50 bg-slate-900/35 opacity-55'
                  }`}
                >
                  <div className="grid gap-3 md:grid-cols-[0.65fr_1fr_1.15fr] md:items-center">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full font-mono text-sm font-black text-slate-950" style={{ backgroundColor: item.color }}>
                        {index + 1}
                      </span>
                      <div>
                        <div className="font-mono text-lg font-black text-white">{item.token}</div>
                        <div className="text-xs text-slate-400">{item.note[locale === 'de' ? 'de' : 'en']}</div>
                      </div>
                    </div>

                    <div className="relative h-12 overflow-hidden rounded-full border border-amber-200/15 bg-slate-950">
                      <motion.div
                        className="absolute inset-y-1 left-1 rounded-full bg-gradient-to-r from-amber-300 to-orange-400"
                        animate={{ width: logitWidth }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-4 font-mono text-xs">
                        <span className="font-bold text-slate-950 mix-blend-screen">{c.raw}</span>
                        <span className="text-amber-100">{item.logit.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="relative h-16 overflow-hidden rounded-full border border-cyan-200/15 bg-slate-950">
                      <motion.div
                        className="absolute inset-y-2 rounded-r-full"
                        animate={{ left: `${funnelInset}%`, right: `${funnelInset}%`, opacity: item.keep ? 1 : 0.35 }}
                        style={{ background: `linear-gradient(90deg, ${item.color}, rgba(255,255,255,0.72))`, clipPath: 'polygon(0 0, 100% 24%, 100% 76%, 0 100%)' }}
                      />
                      <motion.div
                        className="absolute bottom-1 left-2 top-1 rounded-full"
                        animate={{ width: probabilityWidth }}
                        style={{ backgroundColor: item.keep ? item.color : '#475569' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-4 font-mono text-xs">
                        <span className={item.keep ? 'font-bold text-white' : 'text-slate-400'}>{formatPercent(item.sampledProbability)}</span>
                        <span className="text-slate-400">{c.raw} {formatPercent(item.probability)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-slate-950" aria-hidden="true">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        animate={{ width: probabilityWidth }}
                        style={{ backgroundColor: item.keep ? item.color : '#334155' }}
                      />
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-y-0 flex items-center"
                          style={{ left: `${distribution.cursor * 100}%` }}
                        >
                          <Crosshair size={17} className="-ml-2 text-emerald-100 drop-shadow" />
                        </motion.div>
                      )}
                    </div>
                    <span className={`min-w-24 rounded-full px-2 py-1 text-center text-[11px] font-bold ${item.keep ? 'bg-cyan-300/10 text-cyan-100' : 'bg-slate-800 text-slate-400'}`}>
                      {item.keep ? c.kept : c.removed}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-violet-300/20 bg-slate-950/55 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-violet-100">
                <Pipette size={16} />
                {c.roulette}
              </div>
              <span className="font-mono text-xs text-slate-400">{formatPercent(distribution.cursor)}</span>
            </div>

            <div className="relative mx-auto aspect-square max-w-[260px] rounded-full border border-slate-600 bg-slate-950 p-3 shadow-inner shadow-black">
              <motion.div
                className="h-full rounded-full"
                animate={{ background: `conic-gradient(from -90deg, ${rouletteGradient || '#334155 0deg 360deg'})` }}
              />
              <div className="absolute inset-[18%] grid place-items-center rounded-full border border-slate-700 bg-slate-950/90 text-center">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{c.selected}</div>
                  <div className="mt-1 font-mono text-3xl font-black text-white">{distribution.selected.token}</div>
                  <div className="mt-1 text-xs text-emerald-100">#{selectedIndex + 1}</div>
                </div>
              </div>
              <motion.div
                className="absolute left-1/2 top-1/2 h-[46%] w-0.5 origin-bottom rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,.8)]"
                animate={{ rotate: cursorAngle }}
                style={{ translateX: '-50%', translateY: '-100%' }}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/55 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-cyan-100">
              <Zap size={16} />
              {c.race}
            </div>
            <div className="space-y-3">
              {distribution.rows.map((item) => (
                <div key={item.token} className="grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-slate-200">{item.token}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{ width: `${Math.max(item.sampledProbability * 100, item.keep ? 3 : 0)}%` }}
                      style={{ backgroundColor: item.keep ? item.color : '#475569' }}
                    />
                  </div>
                  <span className="text-right font-mono text-slate-300">{formatPercent(item.sampledProbability)}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="rounded-[1.5rem] border border-slate-700/70 bg-slate-950/55 p-4 text-sm leading-relaxed text-slate-300">
            {c.helper}
          </p>
        </aside>
      </div>
    </section>
  )
}
