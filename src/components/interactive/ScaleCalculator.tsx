'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const formatLarge = (n: number): string => {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return n.toLocaleString()
}

interface ScaleCalculatorProps {
  title: string
  inputLabel: string
  pairwiseLabel: string
  attentionLabel: string
  referenceTitle: string
}

const REFERENCE_POINTS = [
  { label: '10K', tokens: 10_000, pairs: '100M' },
  { label: '100K', tokens: 100_000, pairs: '10B' },
  { label: '1M', tokens: 1_000_000, pairs: '1T' },
]

export function ScaleCalculator({ title, inputLabel, pairwiseLabel, attentionLabel, referenceTitle }: ScaleCalculatorProps) {
  const [tokens, setTokens] = useState(10000)

  const pairwise = Math.floor(tokens * (tokens - 1) / 2)
  const attentionPct = 1 / tokens * 100
  const attentionStr = attentionPct < 0.01
    ? attentionPct.toExponential(1) + '%'
    : attentionPct.toFixed(4) + '%'

  // Log scale bar (relative to 1M tokens ≈ 5e11 pairs)
  const logMax = Math.log10(5e11)
  const logVal = Math.log10(Math.max(1, pairwise))
  const barWidth = Math.min(100, Math.max(2, (logVal / logMax) * 100))

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border">
      <h3 className="text-lg font-bold font-heading text-purple-400 mb-4">{title}</h3>

      {/* Slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-sm text-muted">{inputLabel}</label>
          <span className="text-sm font-bold text-text tabular-nums">{formatLarge(tokens)}</span>
        </div>
        <input
          type="range"
          min={1000}
          max={1000000}
          step={1000}
          value={tokens}
          onChange={(e) => setTokens(Number(e.target.value))}
          className="w-full accent-purple-400"
        />
        <div className="flex justify-between mt-0.5">
          <span className="text-xs text-muted">1K</span>
          <span className="text-xs text-muted">1M</span>
        </div>
      </div>

      {/* Result cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
          <p className="text-xs text-muted mb-1">{pairwiseLabel}</p>
          <motion.p
            key={pairwise}
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="text-2xl font-bold font-heading text-purple-400 tabular-nums"
          >
            {formatLarge(pairwise)}
          </motion.p>
        </div>
        <div className="p-3 rounded-xl bg-pink-500/5 border border-pink-500/20">
          <p className="text-xs text-muted mb-1">{attentionLabel}</p>
          <motion.p
            key={attentionStr}
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="text-2xl font-bold font-heading text-pink-400 tabular-nums"
          >
            {attentionStr}
          </motion.p>
        </div>
      </div>

      {/* Scale bar (log scale) */}
      <div className="mb-5">
        <div className="h-3 rounded-full bg-surface-elevated border border-border overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{ width: `${barWidth}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <p className="text-xs text-muted mt-1 text-right">log scale</p>
      </div>

      {/* Reference table */}
      <div className="space-y-1.5">
        <p className="text-xs text-muted font-semibold mb-2">{referenceTitle}</p>
        {REFERENCE_POINTS.map(({ label, tokens: refTokens, pairs }) => {
          const active = tokens >= refTokens
          return (
            <div
              key={label}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${active ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-surface-elevated'}`}
            >
              <span className="text-xs font-mono font-bold text-muted w-10">{label}</span>
              <span className="text-xs text-text flex-1 font-mono">= {pairs} pairs</span>
              <motion.span
                initial={false}
                animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
                className="text-purple-400 text-xs font-bold"
              >
                ✓
              </motion.span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
