'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

interface TokenProb {
  token: string
  prob: number
  gradient: string
}

interface TemperatureVisualizerProps {
  temperature: number
}

const BASE_PROBS: TokenProb[] = [
  { token: 'the', prob: 0.6, gradient: 'from-purple-500 to-pink-500' },
  { token: 'a', prob: 0.25, gradient: 'from-cyan-500 to-blue-500' },
  { token: 'one', prob: 0.1, gradient: 'from-emerald-500 to-teal-500' },
  { token: 'every', prob: 0.04, gradient: 'from-orange-500 to-amber-500' },
  { token: 'some', prob: 0.01, gradient: 'from-red-500 to-rose-500' },
]

export function TemperatureVisualizer({ temperature }: TemperatureVisualizerProps) {
  const adjustedProbs = BASE_PROBS.map((p) => {
    const weight = temperature === 0 
      ? (p.prob === 0.6 ? 1000 : 0) 
      : Math.pow(p.prob, 1 / Math.max(0.1, temperature))
    return { ...p, weight }
  })

  const totalWeight = adjustedProbs.reduce((sum, p) => sum + p.weight, 0)
  const finalProbs = adjustedProbs.map((p) => ({
    ...p,
    displayProb: totalWeight === 0 ? (p.prob === 0.6 ? 1 : 0) : p.weight / totalWeight
  }))

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-text font-heading">Probability Distribution</h3>
          <p className="text-xs text-muted">Next token probabilities</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {finalProbs.map((p, index) => (
          <motion.div 
            key={p.token} 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-14 text-sm font-mono font-medium text-text px-2 py-0.5 rounded bg-surface-elevated border border-border">
                  "{p.token}"
                </span>
              </div>
              <motion.span 
                key={p.displayProb}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className={clsx(
                  'text-sm font-mono font-medium tabular-nums',
                  p.displayProb > 0.5 ? 'text-primary-light' : 'text-muted'
                )}
              >
                {(p.displayProb * 100).toFixed(1)}%
              </motion.span>
            </div>
            <div className="h-3 bg-surface-elevated rounded-full overflow-hidden border border-border/50">
              <motion.div
                className={clsx('h-full rounded-full bg-gradient-to-r', p.gradient)}
                initial={false}
                animate={{ width: `${Math.max(p.displayProb * 100, 0.5)}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Explanation */}
      <motion.div 
        key={temperature}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-4 border-t border-border space-y-3"
      >
        <div className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
          {temperature === 0 && (
            <p className="text-sm text-cyan-400">
              <strong className="text-cyan-300">Greedy Sampling (T=0):</strong> Always picks the highest probability token. Output is 100% deterministic.
            </p>
          )}
          {temperature > 0 && temperature <= 0.7 && (
            <p className="text-sm text-blue-400">
              <strong className="text-blue-300">Focused Sampling:</strong> Distribution is sharpened. High-probability tokens dominate while low-probability tokens are suppressed.
            </p>
          )}
          {temperature > 0.7 && temperature <= 1.2 && (
            <p className="text-sm text-purple-400">
              <strong className="text-purple-300">Balanced Sampling (T≈1):</strong> Natural distribution preserved. Good balance between coherence and creativity.
            </p>
          )}
          {temperature > 1.2 && (
            <p className="text-sm text-orange-400">
              <strong className="text-orange-300">Flat Sampling:</strong> Distribution becomes more uniform. Low-probability tokens gain significant weight, leading to more unpredictable outputs.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
