'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface CostSavingsCalculatorProps {
  t: Record<string, string>
}

interface Provider {
  id: string
  name: string
  basePricePerMTok: number
  cacheSavings: number
  color: string
  borderColor: string
  bgColor: string
}

const PROVIDERS: Provider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    basePricePerMTok: 3.0,
    cacheSavings: 0.9,
    color: 'text-violet-400',
    borderColor: 'border-violet-500/40',
    bgColor: 'bg-violet-500/20',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    basePricePerMTok: 2.5,
    cacheSavings: 0.5,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    bgColor: 'bg-cyan-500/20',
  },
  {
    id: 'google',
    name: 'Google',
    basePricePerMTok: 1.25,
    cacheSavings: 0.75,
    color: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/40',
    bgColor: 'bg-fuchsia-500/20',
  },
]

function formatCost(value: number): string {
  if (value < 0.01) return `$${value.toFixed(6)}`
  if (value < 1) return `$${value.toFixed(4)}`
  if (value < 100) return `$${value.toFixed(2)}`
  return `$${value.toFixed(0)}`
}

export function CostSavingsCalculator({ t }: CostSavingsCalculatorProps) {
  const [totalTokens, setTotalTokens] = useState(10000)
  const [cachedPercent, setCachedPercent] = useState(80)
  const [requestsPerDay, setRequestsPerDay] = useState(100)
  const [selectedProvider, setSelectedProvider] = useState<string>('anthropic')

  const provider = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0]

  const calculations = useMemo(() => {
    const cachedTokens = Math.round((totalTokens * cachedPercent) / 100)
    const newTokens = totalTokens - cachedTokens
    const pricePerToken = provider.basePricePerMTok / 1_000_000
    const cachedPricePerToken = pricePerToken * (1 - provider.cacheSavings)

    const uncachedCostPerReq = totalTokens * pricePerToken
    const cachedCostPerReq = cachedTokens * cachedPricePerToken + newTokens * pricePerToken

    const dailySavings = (uncachedCostPerReq - cachedCostPerReq) * requestsPerDay
    const monthlySavings = dailySavings * 30

    const savingsPercent = uncachedCostPerReq > 0
      ? Math.round(((uncachedCostPerReq - cachedCostPerReq) / uncachedCostPerReq) * 100)
      : 0

    return {
      cachedTokens,
      newTokens,
      uncachedCostPerReq,
      cachedCostPerReq,
      dailySavings,
      monthlySavings,
      savingsPercent,
    }
  }, [totalTokens, cachedPercent, requestsPerDay, provider])

  return (
    <div className="space-y-6">
      {/* Provider Selector */}
      <div className="space-y-2">
        <div className="text-xs text-muted uppercase tracking-wider font-heading">
          {t.calcProvider}
        </div>
        <div className="flex flex-wrap gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProvider(p.id)}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${selectedProvider === p.id
                  ? `${p.bgColor} ${p.borderColor} ${p.color} border`
                  : 'bg-surface border border-border text-muted hover:text-text hover:border-violet-500/20'
                }
              `}
            >
              <div className="font-semibold">{p.name}</div>
              <div className="text-[10px] opacity-70">
                ${p.basePricePerMTok.toFixed(2)}/MTok &middot; {Math.round(p.cacheSavings * 100)}% savings
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Total Tokens */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
          <label className="text-xs text-muted uppercase tracking-wider block">
            {t.calcTotalTokens}
          </label>
          <div className="text-2xl font-bold font-mono text-text">
            {totalTokens.toLocaleString()}
          </div>
          <input
            type="range"
            min={100}
            max={100000}
            step={100}
            value={totalTokens}
            onChange={(e) => setTotalTokens(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-muted">
            <span>100</span>
            <span>100K</span>
          </div>
        </div>

        {/* Cached Percent */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
          <label className="text-xs text-muted uppercase tracking-wider block">
            {t.calcCachedPercent}
          </label>
          <div className="text-2xl font-bold font-mono text-green-400">
            {cachedPercent}%
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={cachedPercent}
            onChange={(e) => setCachedPercent(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-[10px] text-muted">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Requests per Day */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
          <label className="text-xs text-muted uppercase tracking-wider block">
            {t.calcRequestsPerDay}
          </label>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {requestsPerDay.toLocaleString()}
          </div>
          <input
            type="range"
            min={1}
            max={10000}
            step={1}
            value={requestsPerDay}
            onChange={(e) => setRequestsPerDay(Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-muted">
            <span>1</span>
            <span>10K</span>
          </div>
        </div>
      </div>

      {/* Animated Bar Chart */}
      <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
        <div className="text-xs text-muted uppercase tracking-wider font-heading">
          {t.calcPerRequest}
        </div>

        {/* Uncached bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-red-400 font-medium">{t.calcUncachedCost}</span>
            <span className="text-red-400 font-mono font-bold">
              {formatCost(calculations.uncachedCostPerReq)}
            </span>
          </div>
          <div className="h-6 rounded-full bg-surface-elevated overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Cached bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-green-400 font-medium">{t.calcCachedCost}</span>
            <span className="text-green-400 font-mono font-bold">
              {formatCost(calculations.cachedCostPerReq)}
            </span>
          </div>
          <div className="h-6 rounded-full bg-surface-elevated overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{
                width: calculations.uncachedCostPerReq > 0
                  ? `${(calculations.cachedCostPerReq / calculations.uncachedCostPerReq) * 100}%`
                  : '0%',
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Savings percentage */}
        <div className="text-center">
          <motion.span
            className={`text-lg font-bold font-mono ${provider.color}`}
            key={calculations.savingsPercent}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {calculations.savingsPercent}%
          </motion.span>
          <span className="text-sm text-muted ml-2">{t.calcDailySavings.split(':')[0]}</span>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20 text-center"
          key={`daily-${calculations.dailySavings.toFixed(4)}`}
          initial={{ opacity: 0.7, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs text-muted uppercase tracking-wider mb-2">
            {t.calcPerDay}
          </div>
          <div className="text-3xl font-bold font-mono text-green-400">
            {formatCost(calculations.dailySavings)}
          </div>
          <div className="text-xs text-muted mt-1">{t.calcDailySavings}</div>
        </motion.div>

        <motion.div
          className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-center"
          key={`monthly-${calculations.monthlySavings.toFixed(4)}`}
          initial={{ opacity: 0.7, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs text-muted uppercase tracking-wider mb-2">
            {t.calcPerMonth}
          </div>
          <div className="text-3xl font-bold font-mono text-violet-400">
            {formatCost(calculations.monthlySavings)}
          </div>
          <div className="text-xs text-muted mt-1">{t.calcMonthlySavings}</div>
        </motion.div>
      </div>
    </div>
  )
}
