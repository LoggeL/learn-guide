'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

// Fixed toy target distribution p and a deliberately miscalibrated drafter b.
// The draft used in a round is q = (1 − m)·p + m·b.
const TARGET = [0.45, 0.25, 0.15, 0.1, 0.05]
const BAD_DRAFT = [0.08, 0.52, 0.05, 0.3, 0.05]
const ROUNDS_PER_RUN = 5000

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function sampleIndex(dist: number[], u: number) {
  let acc = 0
  for (let i = 0; i < dist.length; i++) {
    acc += dist[i]
    if (u < acc) return i
  }
  return dist.length - 1
}

interface RunState {
  counts: number[]
  accepted: number
  rounds: number
  seed: number
}

export function SpeculativeSamplingDemo() {
  const { t, locale } = useTranslation()
  const c = t.speculativeDecoding
  const nf = (value: number, digits = 2) =>
    value.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
  const pct = (value: number) =>
    value.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })

  const [mismatch, setMismatch] = useState(0.6)
  const [seed, setSeed] = useState(7)
  const [run, setRun] = useState<RunState>({ counts: TARGET.map(() => 0), accepted: 0, rounds: 0, seed: 7 })

  const stats = useMemo(() => {
    const q = TARGET.map((p, i) => (1 - mismatch) * p + mismatch * BAD_DRAFT[i])
    const accept = TARGET.map((p, i) => (q[i] > 0 ? Math.min(1, p / q[i]) : 1))
    const positive = TARGET.map((p, i) => Math.max(0, p - q[i]))
    const mass = positive.reduce((s, v) => s + v, 0)
    const residual = mass > 1e-12 ? positive.map((v) => v / mass) : null
    const alpha = TARGET.reduce((s, p, i) => s + Math.min(p, q[i]), 0)
    return { q, accept, residual, alpha }
  }, [mismatch])

  const reset = (nextSeed = seed) => setRun({ counts: TARGET.map(() => 0), accepted: 0, rounds: 0, seed: nextSeed })

  const changeMismatch = (value: number) => {
    setMismatch(value)
    reset()
  }

  const simulate = () => {
    // Continue the same random stream across clicks by deriving the generator from seed and rounds done.
    const rand = mulberry32(run.seed * 1000003 + run.rounds)
    const counts = [...run.counts]
    let accepted = run.accepted
    for (let n = 0; n < ROUNDS_PER_RUN; n++) {
      const x = sampleIndex(stats.q, rand())
      if (rand() < stats.accept[x]) {
        counts[x] += 1
        accepted += 1
      } else {
        const residual = stats.residual ?? TARGET
        counts[sampleIndex(residual, rand())] += 1
      }
    }
    setRun({ counts, accepted, rounds: run.rounds + ROUNDS_PER_RUN, seed: run.seed })
  }

  const reseed = () => {
    const next = seed + 1
    setSeed(next)
    reset(next)
  }

  const maxBar = Math.max(...TARGET, ...run.counts.map((n) => (run.rounds ? n / run.rounds : 0)))

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-6">
      <div>
        <h3 className="font-heading text-xl font-semibold text-text">{c.samplingTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{c.samplingDesc}</p>
      </div>

      <p className="font-mono text-sm text-text">{c.samplingPrefix}</p>

      <label className="block text-sm text-text">
        {c.samplingMismatch}: <span className="font-mono text-cyan-300">m = {nf(mismatch)}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={mismatch}
          onChange={(e) => changeMismatch(Number(e.target.value))}
          className="mt-2 w-full"
        />
        <span className="mt-1 flex justify-between text-xs text-muted">
          <span>{c.samplingMismatchLow}</span>
          <span>{c.samplingMismatchHigh}</span>
        </span>
      </label>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2 pr-3 font-medium">{c.samplingToken}</th>
              <th className="py-2 pr-3 font-medium">{c.samplingTarget}</th>
              <th className="py-2 pr-3 font-medium">{c.samplingDraft}</th>
              <th className="py-2 pr-3 font-medium">{c.samplingAccept}</th>
              <th className="py-2 font-medium">{c.samplingResidual}</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {TARGET.map((p, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-2 pr-3 font-sans text-text">{c.samplingTokens[i]}</td>
                <td className="py-2 pr-3 text-emerald-300">{nf(p)}</td>
                <td className="py-2 pr-3 text-purple-300">{nf(stats.q[i])}</td>
                <td className={`py-2 pr-3 ${stats.accept[i] < 1 ? 'text-orange-300' : 'text-text'}`}>{nf(stats.accept[i])}</td>
                <td className="py-2 text-cyan-300">{stats.residual ? nf(stats.residual[i]) : '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="font-mono text-sm text-text" aria-live="polite">
        {c.samplingAlpha} = <span className="text-cyan-300">{nf(stats.alpha, 3)}</span>
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={simulate}
          className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20"
        >
          {c.samplingRun}
        </button>
        <button
          type="button"
          onClick={reseed}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted transition-colors hover:text-text"
        >
          {c.samplingReseed}
        </button>
      </div>

      {run.rounds > 0 && (
        <div className="space-y-3 rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-text">{c.samplingEmpirical.replace('{n}', run.rounds.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US'))}</p>
          <div className="flex items-end gap-3" style={{ height: 160 }}>
            {TARGET.map((p, i) => {
              const empirical = run.counts[i] / run.rounds
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-[128px] w-full items-end justify-center gap-1">
                    <motion.div
                      className="w-1/2 rounded-t bg-emerald-400/70"
                      initial={false}
                      animate={{ height: `${(p / maxBar) * 100}%` }}
                      transition={{ duration: 0.4 }}
                      title={nf(p, 3)}
                    />
                    <motion.div
                      className="w-1/2 rounded-t bg-cyan-400"
                      initial={false}
                      animate={{ height: `${(empirical / maxBar) * 100}%` }}
                      transition={{ duration: 0.4 }}
                      title={nf(empirical, 3)}
                    />
                  </div>
                  <span className="text-xs text-muted">{c.samplingTokens[i]}</span>
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-400/70" />{c.samplingLegendTarget}</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-cyan-400" />{c.samplingLegendOutput}</span>
          </div>
          <p className="font-mono text-sm text-text">
            {c.samplingAcceptedShare.replace('{share}', pct(run.accepted / run.rounds)).replace('{alpha}', pct(stats.alpha))}
          </p>
        </div>
      )}

      <p className="border-l-2 border-cyan-500 pl-4 text-sm leading-relaxed text-muted">{c.samplingNote}</p>
    </div>
  )
}
