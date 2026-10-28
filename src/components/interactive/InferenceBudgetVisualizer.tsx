'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Boxes, CheckCheck, Gauge, Vote } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const K_MAX = 64
const K_OPTIONS = [1, 2, 4, 8, 16, 32, 64]
const LENGTH_OPTIONS = [1000, 4000, 16000]

type PresetId = 'checker' | 'likely' | 'misconception'

const PRESETS: Record<PresetId, { p: number; q: number }> = {
  checker: { p: 0.2, q: 0.1 },
  likely: { p: 0.55, q: 0.2 },
  misconception: { p: 0.3, q: 0.4 },
}

const LOG_FACTORIAL: number[] = (() => {
  const values = [0]
  for (let n = 1; n <= K_MAX; n += 1) values.push(values[n - 1] + Math.log(n))
  return values
})()

function logPower(base: number, exponent: number) {
  if (exponent === 0) return 0
  if (base <= 0) return -Infinity
  return exponent * Math.log(base)
}

/** Probability that at least one of k independent samples is correct. */
function passAtK(p: number, k: number) {
  return 1 - Math.pow(1 - p, k)
}

/**
 * Probability that plurality voting over k independent samples returns the
 * correct answer. Answers fall into three classes: correct (p), one common
 * wrong answer (q), and scattered wrong answers (1 - p - q) that are all
 * distinct from each other. Ties are broken uniformly at random.
 */
function majAtK(p: number, q: number, k: number) {
  const r = Math.max(0, 1 - p - q)
  let total = 0
  for (let c = 0; c <= k; c += 1) {
    for (let w = 0; w <= k - c; w += 1) {
      const o = k - c - w
      const logProb = LOG_FACTORIAL[k] - LOG_FACTORIAL[c] - LOG_FACTORIAL[w] - LOG_FACTORIAL[o]
        + logPower(p, c) + logPower(q, w) + logPower(r, o)
      if (!Number.isFinite(logProb)) continue
      const top = Math.max(c, w, o > 0 ? 1 : 0)
      if (c < top) continue
      const tied = (c === top ? 1 : 0) + (w === top ? 1 : 0) + (top === 1 ? o : 0)
      total += Math.exp(logProb) / tied
    }
  }
  return Math.min(1, Math.max(0, total))
}

const CHART = { width: 560, height: 240, left: 44, right: 16, top: 16, bottom: 34 }

function xFor(k: number) {
  const inner = CHART.width - CHART.left - CHART.right
  return CHART.left + (Math.log2(k) / Math.log2(K_MAX)) * inner
}

function yFor(value: number) {
  const inner = CHART.height - CHART.top - CHART.bottom
  return CHART.top + (1 - value) * inner
}

function pathFor(values: number[]) {
  return values
    .map((value, index) => `${index === 0 ? 'M' : 'L'}${xFor(index + 1).toFixed(1)},${yFor(value).toFixed(1)}`)
    .join(' ')
}

export function InferenceBudgetVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.reasoningModels
  const [p, setP] = useState(PRESETS.likely.p)
  const [q, setQ] = useState(PRESETS.likely.q)
  const [k, setK] = useState(8)
  const [length, setLength] = useState(4000)

  const percent = (value: number) => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(value)
  const rest = Math.max(0, 1 - p - q)

  const curves = useMemo(() => {
    const pass: number[] = []
    const maj: number[] = []
    for (let n = 1; n <= K_MAX; n += 1) {
      pass.push(passAtK(p, n))
      maj.push(majAtK(p, q, n))
    }
    return { pass, maj }
  }, [p, q])

  const currentPass = curves.pass[k - 1]
  const currentMaj = curves.maj[k - 1]
  const majInsight = Math.abs(p - q) < 0.005 ? c.insightMajTie : p > q ? c.insightMajWin : c.insightMajLose

  const applyPreset = (id: PresetId) => {
    setP(PRESETS[id].p)
    setQ(PRESETS[id].q)
  }

  const updateP = (value: number) => {
    setP(value)
    if (value + q > 1) setQ(Math.max(0, 1 - value))
  }

  const updateQ = (value: number) => {
    setQ(Math.min(value, 1 - p))
  }

  const presets: { id: PresetId; label: string }[] = [
    { id: 'checker', label: c.presetChecker },
    { id: 'likely', label: c.presetLikely },
    { id: 'misconception', label: c.presetMisconception },
  ]

  return (
    <section className="interactive-surface overflow-hidden p-4 sm:p-5 md:p-7">
      <div className="mb-6 max-w-3xl">
        <div className="mb-2 flex items-center gap-2">
          <Gauge size={21} className="shrink-0 text-primary-light" aria-hidden="true" />
          <h3 className="font-heading text-2xl font-bold text-gradient">{c.vizTitle}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted">{c.vizIntro}</p>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="min-w-0 space-y-5">
          <fieldset>
            <legend className="mb-3 text-sm font-bold text-text">{c.presetLabel}</legend>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {presets.map((preset) => {
                const active = Math.abs(PRESETS[preset.id].p - p) < 0.001 && Math.abs(PRESETS[preset.id].q - q) < 0.001
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => applyPreset(preset.id)}
                    className={`min-h-11 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition-colors motion-reduce:transition-none ${
                      active ? 'border-primary/60 bg-primary/10 text-text' : 'border-border bg-background/50 text-muted hover:border-primary/35 hover:text-text'
                    }`}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="space-y-4 rounded-2xl border border-border bg-background/45 p-4">
            <label htmlFor="sampling-p" className="block">
              <span className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-text">{c.pLabel}</span>
                <span className="font-mono font-bold tabular-nums text-emerald-300">{percent(p)}</span>
              </span>
              <input id="sampling-p" type="range" min={0.01} max={0.95} step={0.01} value={p} onChange={(event) => updateP(Number(event.target.value))} className="h-11 w-full cursor-pointer accent-emerald-500" />
            </label>
            <label htmlFor="sampling-q" className="block">
              <span className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-text">{c.qLabel}</span>
                <span className="font-mono font-bold tabular-nums text-orange-300">{percent(q)}</span>
              </span>
              <input id="sampling-q" type="range" min={0} max={0.95} step={0.01} value={q} onChange={(event) => updateQ(Number(event.target.value))} className="h-11 w-full cursor-pointer accent-orange-500" />
            </label>
            <div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface" aria-hidden="true">
                <motion.div className="bg-emerald-400" animate={{ width: `${p * 100}%` }} transition={{ duration: 0.25 }} />
                <motion.div className="bg-orange-400" animate={{ width: `${q * 100}%` }} transition={{ duration: 0.25 }} />
                <motion.div className="bg-muted/40" animate={{ width: `${rest * 100}%` }} transition={{ duration: 0.25 }} />
              </div>
              <p className="mt-2 text-xs text-muted">{c.restLabel}: <span className="font-mono tabular-nums">{percent(rest)}</span></p>
            </div>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-bold text-text">{c.kLabel}</legend>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {K_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={k === value}
                  onClick={() => setK(value)}
                  className={`min-h-11 rounded-lg border px-2 text-sm font-bold tabular-nums transition-colors motion-reduce:transition-none ${
                    k === value ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200' : 'border-border bg-background/50 text-muted hover:border-cyan-400/35 hover:text-text'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-bold text-text">{c.lengthLabel}</legend>
            <div className="grid grid-cols-3 gap-2">
              {LENGTH_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={length === value}
                  onClick={() => setLength(value)}
                  className={`min-h-11 rounded-lg border px-2 text-sm font-bold tabular-nums transition-colors motion-reduce:transition-none ${
                    length === value ? 'border-purple-400/60 bg-purple-400/10 text-purple-200' : 'border-border bg-background/50 text-muted hover:border-purple-400/35 hover:text-text'
                  }`}
                >
                  {value.toLocaleString(locale)}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="min-w-0 rounded-2xl border border-border bg-gradient-to-br from-surface/90 via-background/70 to-cyan-950/20 p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-3" aria-live="polite" aria-atomic="true">
            <div className="min-w-0 rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-3">
              <CheckCheck size={17} className="mb-2 text-cyan-300" aria-hidden="true" />
              <div className="text-xs leading-snug text-muted">{c.passLabel}</div>
              <div className="mt-1 text-xl font-bold tabular-nums text-text sm:text-2xl">{percent(currentPass)}</div>
            </div>
            <div className="min-w-0 rounded-xl border border-purple-400/25 bg-purple-400/5 p-3">
              <Vote size={17} className="mb-2 text-purple-300" aria-hidden="true" />
              <div className="text-xs leading-snug text-muted">{c.majLabel}</div>
              <div className="mt-1 text-xl font-bold tabular-nums text-text sm:text-2xl">{percent(currentMaj)}</div>
            </div>
            <div className="min-w-0 rounded-xl border border-border bg-background/50 p-3">
              <Boxes size={17} className="mb-2 text-amber-300" aria-hidden="true" />
              <div className="text-xs leading-snug text-muted">{c.tokensLabel}</div>
              <div className="mt-1 text-xl font-bold tabular-nums text-text sm:text-2xl">{(k * length).toLocaleString(locale)}</div>
            </div>
          </div>

          <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} className="mt-5 h-auto w-full" role="img" aria-label={c.chartAria}>
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
              <g key={tick}>
                <line x1={CHART.left} x2={CHART.width - CHART.right} y1={yFor(tick)} y2={yFor(tick)} className="stroke-border" strokeWidth={1} />
                <text x={CHART.left - 8} y={yFor(tick) + 4} textAnchor="end" className="fill-muted text-[11px]">{Math.round(tick * 100)}%</text>
              </g>
            ))}
            {K_OPTIONS.map((value) => (
              <text key={value} x={xFor(value)} y={CHART.height - 14} textAnchor="middle" className="fill-muted text-[11px]">{value}</text>
            ))}
            <text x={CHART.width - CHART.right} y={CHART.height - 1} textAnchor="end" className="fill-muted text-[10px]">{c.axisK}</text>
            <line x1={xFor(k)} x2={xFor(k)} y1={CHART.top} y2={CHART.height - CHART.bottom} className="stroke-primary/50" strokeDasharray="4 4" />
            <motion.path d={pathFor(curves.pass)} animate={{ d: pathFor(curves.pass) }} transition={{ duration: 0.35 }} fill="none" stroke="#22d3ee" strokeWidth={2.5} />
            <motion.path d={pathFor(curves.maj)} animate={{ d: pathFor(curves.maj) }} transition={{ duration: 0.35 }} fill="none" stroke="#c084fc" strokeWidth={2.5} />
            <motion.circle animate={{ cx: xFor(k), cy: yFor(currentPass) }} transition={{ duration: 0.3 }} r={5} fill="#22d3ee" />
            <motion.circle animate={{ cx: xFor(k), cy: yFor(currentMaj) }} transition={{ duration: 0.3 }} r={5} fill="#c084fc" />
          </svg>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 bg-cyan-400" aria-hidden="true" />{c.passLabel}</span>
            <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 bg-purple-400" aria-hidden="true" />{c.majLabel}</span>
          </div>

          <ul className="mt-5 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
            {[c.insightPass, majInsight, c.tokensNote].map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-5 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100">{c.correlationNote}</p>
    </section>
  )
}
