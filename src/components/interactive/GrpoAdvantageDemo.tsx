'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

const REFERENCE = '408'
// Wrong final answers a model might plausibly produce for 17 × 24 (arithmetic slips).
const WRONG_ANSWERS = ['398', '418', '388', '4080', '368', '428', '308', '448']

const PRESETS = {
  mixed: [true, false, false, true, false, false, true, false],
  rare: [false, false, false, false, false, true, false, false],
  all: [true, true, true, true, true, true, true, true],
  none: [false, false, false, false, false, false, false, false],
} as const

type PresetKey = keyof typeof PRESETS

/** GRPO advantage: (r_i - mean(r)) / std(r), population std; zero when all rewards are equal. */
export function groupAdvantages(rewards: number[]) {
  const n = rewards.length
  const mean = rewards.reduce((a, b) => a + b, 0) / n
  const std = Math.sqrt(rewards.reduce((a, r) => a + (r - mean) ** 2, 0) / n)
  const advantages = rewards.map(r => (std === 0 ? 0 : (r - mean) / std))
  return { mean, std, advantages }
}

const MAX_ABS = 3

export function GrpoAdvantageDemo() {
  const { t } = useTranslation()
  const d = t.verifiableRewards.grpoDemo
  const [correct, setCorrect] = useState<boolean[]>([...PRESETS.mixed])

  const answers = correct.map((ok, i) => (ok ? REFERENCE : WRONG_ANSWERS[i]))
  // The checker: exact match of the extracted final answer against the reference.
  const rewards = answers.map(a => (a === REFERENCE ? 1 : 0))
  const { mean, std, advantages } = groupAdvantages(rewards)

  const successes = rewards.filter(r => r === 1).length
  const message = std === 0 ? d.zeroSignal : successes === 1 ? d.rareSignal : d.normalSignal

  const presetLabels: Record<PresetKey, string> = {
    mixed: d.presetMixed,
    rare: d.presetRare,
    all: d.presetAll,
    none: d.presetNone,
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 space-y-5">
      <div>
        <h3 className="text-xl font-semibold mb-2">{d.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{d.intro}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(PRESETS) as PresetKey[]).map(key => (
          <button
            key={key}
            type="button"
            onClick={() => setCorrect([...PRESETS[key]])}
            className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:border-cyan-400/60 transition-colors"
          >
            {presetLabels[key]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {answers.map((answer, i) => {
          const adv = advantages[i]
          const height = (Math.min(Math.abs(adv), MAX_ABS) / MAX_ABS) * 100
          const positive = adv > 0
          const zero = Math.abs(adv) < 1e-9
          return (
            <button
              key={i}
              type="button"
              aria-pressed={correct[i]}
              onClick={() => setCorrect(prev => prev.map((v, j) => (j === i ? !v : v)))}
              className={`rounded-lg border p-2 text-left transition-colors bg-background ${
                rewards[i] === 1 ? 'border-emerald-500/50' : 'border-red-500/40'
              }`}
            >
              <div className="text-[11px] text-muted">{d.answer} {i + 1}</div>
              <div className="font-mono text-lg">{answer}</div>
              <div className="text-xs text-muted">
                {d.reward}: <span className={rewards[i] === 1 ? 'text-emerald-400' : 'text-red-400'}>{rewards[i]}</span>
              </div>
              {/* Advantage bar: upper half for positive, lower half for negative */}
              <div className="relative h-24 mt-2" aria-hidden="true">
                <div className="absolute inset-x-0 top-1/2 border-t border-border" />
                <div className="absolute inset-x-3 top-0 h-1/2 flex items-end">
                  <motion.div
                    className="w-full rounded-t bg-emerald-400/70"
                    initial={false}
                    animate={{ height: positive ? `${height}%` : '0%' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                  />
                </div>
                <div className="absolute inset-x-3 bottom-0 h-1/2 flex items-start">
                  <motion.div
                    className="w-full rounded-b bg-red-400/70"
                    initial={false}
                    animate={{ height: !positive && !zero ? `${height}%` : '0%' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                  />
                </div>
              </div>
              <div className="text-[11px] text-muted mt-1">{d.advantage}</div>
              <div className="text-xs font-mono">{adv >= 0 ? '+' : ''}{adv.toFixed(2)}</div>
              <div className={`text-[11px] ${zero ? 'text-muted' : positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {zero ? d.none : positive ? d.up : d.down}
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-background border border-border p-3">
          <span className="text-muted">{d.mean}: </span>
          <span className="font-mono">{mean.toFixed(3)}</span>
        </div>
        <div className="rounded-lg bg-background border border-border p-3">
          <span className="text-muted">{d.std}: </span>
          <span className="font-mono">{std.toFixed(3)}</span>
        </div>
      </div>

      <motion.p
        key={message}
        role="status"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-sm rounded-lg p-3 border ${
          std === 0 ? 'border-orange-400/40 bg-orange-400/10' : 'border-cyan-400/30 bg-cyan-400/5'
        }`}
      >
        {message}
      </motion.p>
      <p className="text-xs text-muted">{d.stdNote}</p>
    </div>
  )
}
