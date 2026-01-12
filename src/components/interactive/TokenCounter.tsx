'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Database, AlertTriangle, CheckCircle } from 'lucide-react'

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
    <div className="rounded-2xl bg-surface border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isCritical 
              ? "bg-gradient-to-br from-red-500/20 to-rose-500/20"
              : isWarning
              ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
              : "bg-gradient-to-br from-primary/20 to-secondary/20"
          )}>
            <Database size={18} className={clsx(
              isCritical ? "text-red-400" : isWarning ? "text-yellow-400" : "text-primary-light"
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{label}</h3>
            <p className="text-xs text-muted">Token usage</p>
          </div>
        </div>
        
        <div className="text-right">
          <motion.span
            key={current}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={clsx(
              'text-2xl font-mono font-bold',
              isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-gradient'
            )}
          >
            {percentage.toFixed(0)}%
          </motion.span>
          <p className="text-xs text-muted font-mono">
            {current.toLocaleString()} / {max.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="h-4 bg-background rounded-full overflow-hidden border border-border">
        <motion.div
          className={clsx(
            'h-full rounded-full relative',
            isCritical
              ? 'bg-gradient-to-r from-red-600 to-red-400'
              : isWarning
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
              : 'bg-gradient-to-r from-primary to-secondary'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        </motion.div>
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <>
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-xs text-red-400 font-medium">Context nearly full!</span>
            </>
          ) : isWarning ? (
            <>
              <AlertTriangle size={14} className="text-yellow-400" />
              <span className="text-xs text-yellow-400">Getting crowded...</span>
            </>
          ) : (
            <>
              <CheckCircle size={14} className="text-success" />
              <span className="text-xs text-muted">Healthy capacity</span>
            </>
          )}
        </div>
        <span className="text-xs text-subtle font-mono">{max.toLocaleString()} max</span>
      </div>
    </div>
  )
}
