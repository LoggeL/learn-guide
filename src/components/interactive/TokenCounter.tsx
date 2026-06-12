'use client'

import { motion } from 'framer-motion'
import { Database, AlertTriangle, CheckCircle, Skull } from 'lucide-react'
import { useLocale } from '@/lib/i18n/context'

const COPY = {
  en: {
    contextWindow: 'Context Window',
    windowExceeded: 'Window exceeded!',
    tokenUsage: 'Token usage',
    messagesPushedOut: 'Messages being pushed out!',
    contextNearlyFull: 'Context nearly full!',
    gettingCrowded: 'Getting crowded...',
    healthyCapacity: 'Healthy capacity',
  },
  de: {
    contextWindow: 'Kontextfenster',
    windowExceeded: 'Fenster überschritten!',
    tokenUsage: 'Token-Auslastung',
    messagesPushedOut: 'Nachrichten werden verdrängt!',
    contextNearlyFull: 'Kontext fast voll!',
    gettingCrowded: 'Es wird eng …',
    healthyCapacity: 'Ausreichend Kapazität',
  },
}

interface TokenCounterProps {
  current: number
  max: number
  label?: string
  overflow?: boolean
}

export function TokenCounter({ current, max, label, overflow = false }: TokenCounterProps) {
  const { locale } = useLocale()
  const c = COPY[locale === 'de' ? 'de' : 'en']
  const displayLabel = label ?? c.contextWindow
  const percentage = max > 0 ? (current / max) * 100 : 0
  const displayPercentage = Math.min(percentage, 100)
  const isWarning = percentage > 70 && percentage <= 100
  const isCritical = percentage > 90 && percentage <= 100
  const isOverflow = percentage > 100 || overflow

  return (
    <div className={`rounded-2xl border p-5 ${
      isOverflow 
        ? "bg-red-500/5 border-red-500/30" 
        : "bg-surface border-border"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isOverflow
              ? "bg-gradient-to-br from-red-500/20 to-rose-500/20"
              : isCritical 
              ? "bg-gradient-to-br from-red-500/20 to-rose-500/20"
              : isWarning
              ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
              : "bg-gradient-to-br from-primary/20 to-secondary/20"
          }`}>
            {isOverflow ? (
              <Skull size={18} className="text-red-400" />
            ) : (
              <Database size={18} className={
                isCritical ? "text-red-400" : isWarning ? "text-yellow-400" : "text-primary-light"
              } />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{displayLabel}</h3>
            <p className="text-xs text-muted">
              {isOverflow ? c.windowExceeded : c.tokenUsage}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <motion.span
            key={current}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-mono font-bold ${
              isOverflow ? 'text-red-400' : isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-gradient'
            }`}
          >
            {isOverflow ? `${percentage.toFixed(0)}%` : `${displayPercentage.toFixed(0)}%`}
          </motion.span>
          <p className="text-xs text-muted font-mono">
            {current.toLocaleString()} / {max.toLocaleString()}
            {isOverflow && <span className="text-red-400 ml-1">(+{(current - max).toLocaleString()})</span>}
          </p>
        </div>
      </div>
      
      <div className="h-4 bg-background rounded-full overflow-hidden border border-border relative">
        <motion.div
          className={`h-full rounded-full relative ${
            isOverflow
              ? 'bg-gradient-to-r from-red-600 to-red-400'
              : isCritical
              ? 'bg-gradient-to-r from-red-600 to-red-400'
              : isWarning
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
              : 'bg-gradient-to-r from-primary to-secondary'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        </motion.div>
        
        {/* Overflow indicator */}
        {isOverflow && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-red-500/50 to-transparent"
          />
        )}
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          {isOverflow ? (
            <>
              <Skull size={14} className="text-red-400" />
              <span className="text-xs text-red-400 font-medium">{c.messagesPushedOut}</span>
            </>
          ) : isCritical ? (
            <>
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-xs text-red-400 font-medium">{c.contextNearlyFull}</span>
            </>
          ) : isWarning ? (
            <>
              <AlertTriangle size={14} className="text-yellow-400" />
              <span className="text-xs text-yellow-400">{c.gettingCrowded}</span>
            </>
          ) : (
            <>
              <CheckCircle size={14} className="text-success" />
              <span className="text-xs text-muted">{c.healthyCapacity}</span>
            </>
          )}
        </div>
        <span className="text-xs text-subtle font-mono">{max.toLocaleString()} max</span>
      </div>
    </div>
  )
}
