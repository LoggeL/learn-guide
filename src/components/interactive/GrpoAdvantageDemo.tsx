'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Scale, XCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const INITIAL_REWARDS = [1, 0, 0, 1, 0, 0]
const EPSILON = 1e-6

/** GRPO advantage: (r_i - mean) / std over the group (population std). */
function groupAdvantages(rewards: number[]) {
  const mean = rewards.reduce((sum, value) => sum + value, 0) / rewards.length
  const variance = rewards.reduce((sum, value) => sum + (value - mean) ** 2, 0) / rewards.length
  const std = Math.sqrt(variance)
  const advantages = rewards.map((value) => (std < EPSILON ? 0 : (value - mean) / std))
  return { mean, std, advantages }
}

export function GrpoAdvantageDemo() {
  const { t, locale } = useTranslation()
  const c = t.reasoningModels
  const [rewards, setRewards] = useState(INITIAL_REWARDS)
  const { mean, std, advantages } = useMemo(() => groupAdvantages(rewards), [rewards])
  const correctCount = rewards.filter((value) => value === 1).length
  const format = (value: number) => new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'exceptZero' }).format(value)
  const maxAdvantage = 2.5

  const insight = std < EPSILON
    ? c.grpoNoSignal
    : correctCount === 1
      ? c.grpoRare
      : correctCount === rewards.length - 1
        ? c.grpoCommon
        : c.grpoBalanced

  const toggle = (index: number) => {
    setRewards((current) => current.map((value, i) => (i === index ? 1 - value : value)))
  }

  return (
    <section className="interactive-surface p-4 sm:p-5 md:p-7">
      <div className="mb-5 flex items-start gap-3">
        <Scale size={21} className="mt-1 shrink-0 text-primary-light" aria-hidden="true" />
        <div>
          <h3 className="font-heading text-xl font-bold text-text">{c.grpoTitle}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{c.grpoIntro}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward, index) => {
          const advantage = advantages[index]
          const width = Math.min(1, Math.abs(advantage) / maxAdvantage) * 50
          const positive = advantage >= 0
          return (
            <button
              key={index}
              type="button"
              aria-pressed={reward === 1}
              onClick={() => toggle(index)}
              className={`rounded-xl border p-4 text-left transition-colors motion-reduce:transition-none ${
                reward === 1 ? 'border-emerald-400/40 bg-emerald-400/5 hover:border-emerald-400/70' : 'border-red-400/30 bg-red-400/5 hover:border-red-400/60'
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-heading text-sm font-bold text-text">{c.grpoAttempt.replace('{n}', String(index + 1))}</span>
                {reward === 1
                  ? <CheckCircle2 size={18} className="text-emerald-300" aria-hidden="true" />
                  : <XCircle size={18} className="text-red-300" aria-hidden="true" />}
              </span>
              <span className={`mt-1 block font-mono text-xs ${reward === 1 ? 'text-emerald-200' : 'text-red-200'}`}>
                {reward === 1 ? c.grpoCorrect : c.grpoWrong}
              </span>
              <span className="mt-3 flex items-center justify-between text-xs text-muted">
                <span>{c.grpoAdvantage}</span>
                <span className="font-mono font-bold tabular-nums text-text">{format(advantage)}</span>
              </span>
              <span className="relative mt-2 block h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
                <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
                <motion.span
                  className={`absolute inset-y-0 block rounded-full ${positive ? 'bg-emerald-400' : 'bg-red-400'}`}
                  initial={false}
                  animate={{ width: `${width}%`, left: positive ? '50%' : `${50 - width}%` }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                />
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[200px_minmax(0,1fr)]" aria-live="polite">
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-1">
          <div className="rounded-xl border border-border bg-background/50 p-3">
            <dt className="text-xs text-muted">{c.grpoMean}</dt>
            <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-text">{mean.toLocaleString(locale, { maximumFractionDigits: 2 })}</dd>
          </div>
          <div className="rounded-xl border border-border bg-background/50 p-3">
            <dt className="text-xs text-muted">{c.grpoStd}</dt>
            <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-text">{std.toLocaleString(locale, { maximumFractionDigits: 2 })}</dd>
          </div>
        </dl>
        <p className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-muted">{insight}</p>
      </div>
    </section>
  )
}
