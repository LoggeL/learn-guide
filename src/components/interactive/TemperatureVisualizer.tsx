'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

interface TokenProb {
  token: string
  prob: number
  color: string
}

interface TemperatureVisualizerProps {
  temperature: number
}

const BASE_PROBS: TokenProb[] = [
  { token: 'The', prob: 0.6, color: 'bg-primary' },
  { token: 'A', prob: 0.25, color: 'bg-secondary' },
  { token: 'One', prob: 0.1, color: 'bg-purple-500' },
  { token: 'Every', prob: 0.04, color: 'bg-yellow-500' },
  { token: 'Some', prob: 0.01, color: 'bg-red-500' },
]

export function TemperatureVisualizer({ temperature }: TemperatureVisualizerProps) {
  // Apply softmax-like transformation based on temperature
  // T -> 0: Highest prob becomes 1, others 0
  // T -> 1: Original probs
  // T -> 2+: Probs flatten out toward uniform
  
  const adjustedProbs = BASE_PROBS.map((p) => {
    // Simple simulation of temperature effect on logits
    // logit = log(prob)
    // new_prob = exp(logit / T) / sum(exp(logit / T))
    
    // For visualization purposes, we'll use a simplified power-based scaling
    // which looks similar enough to the actual softmax behavior
    const weight = temperature === 0 ? (p.prob === 0.6 ? 1000 : 0) : Math.pow(p.prob, 1 / Math.max(0.1, temperature))
    return { ...p, weight }
  })

  const totalWeight = adjustedProbs.reduce((sum, p) => sum + p.weight, 0)
  const finalProbs = adjustedProbs.map((p) => ({
    ...p,
    displayProb: totalWeight === 0 ? (p.prob === 0.6 ? 1 : 0) : p.weight / totalWeight
  }))

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <h3 className="text-sm font-semibold text-muted mb-6 uppercase tracking-wider">
        Next Token Probability Distribution
      </h3>
      
      <div className="space-y-4">
        {finalProbs.map((p) => (
          <div key={p.token} className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text font-bold">"{p.token}"</span>
              <span className={clsx(
                p.displayProb > 0.5 ? 'text-primary' : 'text-muted'
              )}>
                {(p.displayProb * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-4 bg-surface rounded-full overflow-hidden border border-border/50">
              <motion.div
                className={clsx('h-full rounded-full', p.color)}
                initial={false}
                animate={{ width: `${p.displayProb * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border/50 text-xs text-muted italic">
        {temperature === 0 && (
          <p className="text-primary/80">
            <strong>Greedy Sampling (T=0):</strong> The model always picks the single most likely token. 
            Response is 100% deterministic.
          </p>
        )}
        {temperature > 0 && temperature <= 0.7 && (
          <p>
            <strong>Focused Sampling:</strong> Probabilities are sharpened. The model favors 
            likely tokens but allows some variety.
          </p>
        )}
        {temperature > 0.7 && temperature <= 1.2 && (
          <p>
            <strong>Balanced Sampling (T≈1):</strong> The natural distribution is preserved. 
            Balances coherence with creativity.
          </p>
        )}
        {temperature > 1.2 && (
          <p className="text-yellow-400/80">
            <strong>Random Sampling:</strong> Distribution is flattened. Less likely tokens 
            gain significant weight. Results may become chaotic or nonsensical.
          </p>
        )}
      </div>
    </div>
  )
}
