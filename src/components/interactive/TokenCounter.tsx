'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

interface TokenCounterProps {
  current: number
  max: number
  label?: string
}

export function TokenCounter({ current, max, label = 'Context Window' }: TokenCounterProps) {
  const percentage = Math.min((current / max) * 100, 100)
  const isWarning = percentage > 70
  const isCritical = percentage > 90

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted">{label}</span>
        <span
          className={clsx(
            'text-sm font-mono',
            isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-primary'
          )}
        >
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div className="h-3 bg-background rounded-full overflow-hidden">
        <motion.div
          className={clsx(
            'h-full rounded-full',
            isCritical
              ? 'bg-gradient-to-r from-red-500 to-red-400'
              : isWarning
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
              : 'bg-gradient-to-r from-primary to-secondary'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-muted">
        <span>0</span>
        <span>{isCritical ? '⚠️ Context nearly full!' : isWarning ? 'Getting full...' : ''}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  )
}
