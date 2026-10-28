'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

const GROUP_SIZE = 8

/** GRPO advantage: (r_i − mean(r)) / std(r); 0 for every answer when all rewards are equal. */
export function groupAdvantages(rewards: number[]): { mean: number; std: number; advantages: number[] } {
  const mean = rewards.reduce((a, b) => a + b, 0) / rewards.length
  const std = Math.sqrt(rewards.reduce((a, r) => a + (r - mean) ** 2, 0) / rewards.length)
  const advantages = rewards.map((r) => (std === 0 ? 0 : (r - mean) / std))
  return { mean, std, advantages }
}

export function GrpoAdvantageDemo() {
  const { t, locale } = useTranslation()
  const tr = t.llmTraining
  const [correct, setCorrect] = useState(2)
  const nf = (x: number) =>
    x.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'exceptZero' })

  const rewards = Array.from({ length: GROUP_SIZE }, (_, i) => (i < correct ? 1 : 0))
  const { mean, std, advantages } = groupAdvantages(rewards)
  const maxAbs = 2.7 // |A| for 1 of 8 successes is about 2.65

  const insight = correct === 0 || correct === GROUP_SIZE ? tr.rlvrAllSame : correct <= GROUP_SIZE / 4 ? tr.rlvrRare : correct >= (GROUP_SIZE * 3) / 4 ? tr.rlvrCommon : null

  return (
    <div className="space-y-5">
      <label className="flex flex-wrap items-center gap-3 text-sm text-text">
        <span>
          {tr.rlvrCorrectCount}: <span className="font-mono text-orange-300">{correct} / {GROUP_SIZE}</span>
        </span>
        <input
          type="range"
          min={0}
          max={GROUP_SIZE}
          step={1}
          value={correct}
          onChange={(e) => setCorrect(Number(e.target.value))}
          className="w-56 accent-orange-400"
        />
      </label>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {rewards.map((r, i) => {
          const a = advantages[i]
          return (
            <div
              key={i}
              className={`rounded-xl border p-3 ${r === 1 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/25 bg-red-500/5'}`}
            >
              <div className="text-xs text-muted">
                {tr.rlvrSample} {i + 1}
              </div>
              <div className={`mt-1 font-mono text-xs ${r === 1 ? 'text-emerald-300' : 'text-red-300'}`}>
                {tr.rlvrReward} = {r}
              </div>
              <div className="mt-2 h-10 relative rounded bg-background/70">
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                <motion.div
                  className={`absolute left-1/2 w-3 -translate-x-1/2 rounded-sm ${a >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`}
                  animate={{
                    height: `${(Math.abs(a) / maxAbs) * 50}%`,
                    top: a >= 0 ? `${50 - (Math.abs(a) / maxAbs) * 50}%` : '50%',
                  }}
                  transition={{ duration: 0.35 }}
                />
              </div>
              <div className="mt-1 font-mono text-xs text-text">
                {tr.rlvrAdvantage} {nf(a)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-muted">{tr.rlvrMean}</div>
          <div className="mt-1 font-mono text-lg text-text">{mean.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 3 })}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-muted">{tr.rlvrStd}</div>
          <div className="mt-1 font-mono text-lg text-text">{std.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 3 })}</div>
        </div>
      </div>
      {insight && <p className="text-sm leading-relaxed text-muted">{insight}</p>}
    </div>
  )
}
