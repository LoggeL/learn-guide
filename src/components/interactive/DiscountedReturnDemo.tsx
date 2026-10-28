'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

// Shortest route in the Q-learning gridworld: 7 moves at −1, then +10 at the goal.
const REWARDS = [-1, -1, -1, -1, -1, -1, -1, 10]

export function DiscountedReturnDemo() {
  const { t } = useTranslation()
  const c = t.reinforcementLearning
  const [gamma, setGamma] = useState(0.85)

  const terms = REWARDS.map((r, k) => Math.pow(gamma, k) * r)
  const total = terms.reduce((a, b) => a + b, 0)
  const raw = REWARDS.reduce((a, b) => a + b, 0)
  const maxAbs = Math.max(...terms.map(Math.abs), 1)

  return (
    <div className="rounded-xl border border-border bg-background p-5 space-y-4">
      <div>
        <h3 className="font-bold font-heading text-text">{c.discountTitle}</h3>
        <p className="text-xs text-muted mt-1">{c.discountNote}</p>
      </div>
      <label className="block">
        <span className="flex justify-between text-sm mb-1">
          <span className="text-muted">{c.discountGamma}</span>
          <span className="font-mono text-text">{gamma.toFixed(2)}</span>
        </span>
        <input
          aria-label={c.discountGamma}
          type="range"
          min={0}
          max={0.99}
          step={0.01}
          value={gamma}
          onChange={(e) => setGamma(Number(e.target.value))}
          className="w-full"
        />
      </label>
      <div className="grid grid-cols-8 gap-1 sm:gap-2" role="img" aria-label={c.discountTitle}>
        {terms.map((term, k) => (
          <div key={k} className="flex flex-col items-center">
            <div className="relative h-32 w-full">
              <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
              <motion.div
                className={`absolute inset-x-1 rounded ${term >= 0 ? 'bg-emerald-400/70' : 'bg-red-400/70'}`}
                animate={{
                  height: `${(Math.abs(term) / maxAbs) * 50}%`,
                  top: term >= 0 ? `${50 - (Math.abs(term) / maxAbs) * 50}%` : '50%',
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted sm:text-xs">{term.toFixed(2)}</div>
            <div className="font-mono text-[10px] text-muted/70">
              {c.discountStep}={k}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-text">
          {c.discountReturn}: <span className={`font-mono ${total >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>{total.toFixed(2)}</span>
        </span>
        <span className="text-muted">
          {c.discountRaw}: <span className="font-mono">{raw}</span>
        </span>
      </div>
      <p className="text-xs text-muted">{c.discountInsight}</p>
    </div>
  )
}
