'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

/** Anthropic standard multipliers relative to the base input price. */
const CACHE_READ = 0.1
const CACHE_WRITE_5M = 1.25

/**
 * Input tokens read by each model call for N tool rounds plus the final call.
 * Call k (1-based) reads the starting context P plus (k-1) rounds of A tokens.
 */
function callInputs(rounds: number, perRound: number, prefix: number): number[] {
  return Array.from({ length: rounds + 1 }, (_, i) => prefix + i * perRound)
}

/**
 * Price-weighted input with prompt caching, assuming every call hits the cache
 * for everything the previous call already sent and writes only the new part.
 */
function cachedCost(rounds: number, perRound: number, prefix: number): number {
  let cost = CACHE_WRITE_5M * prefix
  for (let k = 2; k <= rounds + 1; k++) {
    const seen = prefix + (k - 2) * perRound
    cost += CACHE_READ * seen + CACHE_WRITE_5M * perRound
  }
  return cost
}

export function AgentLoopContextCost() {
  const { t, locale } = useTranslation()
  const c = t.agentLoop
  const [rounds, setRounds] = useState(10)
  const [perRound, setPerRound] = useState(1000)
  const [prefix, setPrefix] = useState(3000)
  const fmt = (n: number) => Math.round(n).toLocaleString(locale === 'de' ? 'de-DE' : 'en-US')

  const inputs = callInputs(rounds, perRound, prefix)
  const total = inputs.reduce((a, b) => a + b, 0)
  const last = inputs[inputs.length - 1]
  const ratio = total / last
  const cached = cachedCost(rounds, perRound, prefix)

  const sliders = [
    { label: c.costRounds, value: rounds, set: setRounds, min: 1, max: 40, step: 1 },
    { label: c.costPerRound, value: perRound, set: setPerRound, min: 100, max: 5000, step: 100 },
    { label: c.costPrefix, value: prefix, set: setPrefix, min: 500, max: 20000, step: 500 },
  ]

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold font-heading text-text">{c.costCalcTitle}</h3>
        <p className="text-sm text-muted mt-1">{c.costCalcDesc}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {sliders.map((s) => (
          <label key={s.label} className="block">
            <span className="text-xs text-muted block mb-1">{s.label}</span>
            <span className="text-lg font-bold font-mono text-text">{fmt(s.value)}</span>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="w-full mt-1 accent-purple-400"
            />
          </label>
        ))}
      </div>

      {/* Bars: input tokens per model call */}
      <div>
        <div className="flex h-40 items-end gap-[2px] rounded-xl border border-border bg-background/60 p-3">
          {inputs.map((value, i) => (
            <motion.div
              key={i}
              className={`flex-1 rounded-t ${i === inputs.length - 1 ? 'bg-emerald-400/70' : 'bg-purple-400/60'}`}
              initial={false}
              animate={{ height: `${(value / last) * 100}%` }}
              transition={{ duration: 0.3 }}
              title={`${c.costCallAxis} ${i + 1}: ${fmt(value)} ${c.tokens}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted mt-1 font-mono">
          <span>{c.costCallAxis} 1</span>
          <span>{c.costCallAxis} {inputs.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="text-xs text-muted">{c.costLastCall}</div>
          <div className="text-lg font-bold font-mono text-emerald-400">{fmt(last)}</div>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="text-xs text-muted">{c.costTotal}</div>
          <div className="text-lg font-bold font-mono text-purple-400">{fmt(total)}</div>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="text-xs text-muted">{c.costRatio}</div>
          <div className="text-lg font-bold font-mono text-orange-400">{ratio.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 1 })}×</div>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="text-xs text-muted">{c.costCached}</div>
          <div className="text-lg font-bold font-mono text-cyan-400">{fmt(cached)}</div>
          <div className="text-[11px] text-muted">{c.costCachedHint}</div>
        </div>
      </div>

      <p className="text-xs text-muted font-mono">{c.costFormula}</p>
      <p className="text-xs text-muted">{c.costCacheNote}</p>
    </div>
  )
}
