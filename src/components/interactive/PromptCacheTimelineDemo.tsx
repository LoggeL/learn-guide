'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

export type PromptCacheScenario = 'stable5m' | 'stable1h' | 'timestamp'

const SYSTEM_TOKENS = 4000
const USER_TOKENS = 300
const ANSWER_TOKENS = 500
const REQUEST_MINUTES = [0, 2, 4, 12, 14]
const READ_FACTOR = 0.1

export interface PromptCacheRequestRow {
  minute: number
  input: number
  read: number
  write: number
  cost: number
  baseline: number
  status: 'cold' | 'hit' | 'expired' | 'miss'
}

/**
 * Simulates automatic caching with one breakpoint at the end of each request.
 * Lifetime counts from the start of the request that writes or reads an entry.
 */
export function simulatePromptCache(scenario: PromptCacheScenario): PromptCacheRequestRow[] {
  const ttl = scenario === 'stable1h' ? 60 : 5
  const writeFactor = scenario === 'stable1h' ? 2 : 1.25
  let entry: { length: number; expires: number } | null = null
  let everWritten = false
  return REQUEST_MINUTES.map((minute, i) => {
    const input = SYSTEM_TOKENS + i * (USER_TOKENS + ANSWER_TOKENS) + USER_TOKENS
    let read = 0
    let status: PromptCacheRequestRow['status'] = everWritten ? 'miss' : 'cold'
    if (scenario !== 'timestamp' && entry) {
      if (minute < entry.expires) {
        read = entry.length
        status = 'hit'
      } else {
        status = 'expired'
      }
    }
    const write = input - read
    entry = { length: input, expires: minute + ttl }
    everWritten = true
    return {
      minute,
      input,
      read,
      write,
      cost: read * READ_FACTOR + write * writeFactor,
      baseline: input,
      status,
    }
  })
}

export function PromptCacheTimelineDemo() {
  const { t, locale } = useTranslation()
  const p = t.promptCaching
  const [scenario, setScenario] = useState<PromptCacheScenario>('stable5m')
  const rows = simulatePromptCache(scenario)
  const totalCost = rows.reduce((s, r) => s + r.cost, 0)
  const totalBase = rows.reduce((s, r) => s + r.baseline, 0)
  const delta = Math.round((1 - totalCost / totalBase) * 100)
  const maxInput = Math.max(...rows.map((r) => r.input))
  const fmt = (n: number) => Math.round(n).toLocaleString(locale)

  const scenarios: [PromptCacheScenario, string, string][] = [
    ['stable5m', p.timelineScenarioStable, p.timelineExplainStable],
    ['stable1h', p.timelineScenario1h, p.timelineExplain1h],
    ['timestamp', p.timelineScenarioTimestamp, p.timelineExplainTimestamp],
  ]
  const statusLabel = {
    cold: p.timelineCold,
    hit: p.timelineHit,
    expired: p.timelineExpired,
    miss: p.timelineMiss,
  }
  const statusColor = {
    cold: 'text-violet-300',
    hit: 'text-emerald-400',
    expired: 'text-orange-400',
    miss: 'text-red-400',
  }

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {scenarios.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setScenario(id)}
            aria-pressed={scenario === id}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              scenario === id
                ? 'border-primary bg-primary/10 text-primary-light'
                : 'border-border text-muted hover:text-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="space-y-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
              <span className="text-muted">
                {p.timelineRequest} {i + 1} · {p.timelineMinute} {r.minute}
              </span>
              <span className={`font-medium ${statusColor[r.status]}`}>{statusLabel[r.status]}</span>
            </div>
            <div className="flex h-5 overflow-hidden rounded-md bg-background">
              <motion.div
                className="h-full bg-emerald-500/70"
                animate={{ width: `${(r.read / maxInput) * 100}%` }}
                transition={{ duration: 0.35 }}
              />
              <motion.div
                className="h-full bg-violet-500/70"
                animate={{ width: `${(r.write / maxInput) * 100}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500/70" />
          {p.timelineRead} (× {READ_FACTOR.toLocaleString(locale)})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-violet-500/70" />
          {p.timelineWrite} (× {(scenario === 'stable1h' ? 2 : 1.25).toLocaleString(locale)})
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="p-2 text-left font-normal">{p.timelineRequest}</th>
              <th className="p-2 text-right font-normal">{p.timelineInput}</th>
              <th className="p-2 text-right font-normal">{p.timelineRead}</th>
              <th className="p-2 text-right font-normal">{p.timelineWrite}</th>
              <th className="p-2 text-right font-normal">{p.timelineCost}</th>
              <th className="p-2 text-right font-normal">{p.timelineBaseline}</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-2 font-sans">{i + 1}</td>
                <td className="p-2 text-right">{fmt(r.input)}</td>
                <td className="p-2 text-right text-emerald-300">{fmt(r.read)}</td>
                <td className="p-2 text-right text-violet-300">{fmt(r.write)}</td>
                <td className="p-2 text-right">{fmt(r.cost)}</td>
                <td className="p-2 text-right text-muted">{fmt(r.baseline)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-border font-bold">
              <td className="p-2 font-sans">{p.timelineTotal}</td>
              <td className="p-2" colSpan={3} />
              <td className="p-2 text-right">{fmt(totalCost)}</td>
              <td className="p-2 text-right text-muted">{fmt(totalBase)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p
        role="status"
        className={`text-lg font-semibold ${delta >= 0 ? 'text-emerald-400' : 'text-orange-400'}`}
      >
        {delta >= 0 ? p.timelineSavings : p.timelineExtra}: {Math.abs(delta)} %
      </p>
      <p className="text-sm leading-relaxed text-muted">
        {scenarios.find(([id]) => id === scenario)?.[2]}
      </p>
    </div>
  )
}
