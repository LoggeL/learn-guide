'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { cacheCosts } from '@/lib/inference-math'

export function CostSavingsCalculator({
  t: copy,
}: {
  t: Record<string, string>
}) {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [tokens, setTokens] = useState(10000),
    [percent, setPercent] = useState(80),
    [requests, setRequests] = useState(100)
  const [reuse, setReuse] = useState(10),
    [price, setPrice] = useState(3),
    [write, setWrite] = useState(1.25),
    [read, setRead] = useState(0.1)
  const result = cacheCosts({
    tokens,
    prefixFraction: percent / 100,
    requests,
    reuse,
    price,
    write,
    read,
  })
  const controls: [
    string,
    number,
    (n: number) => void,
    number,
    number,
    number,
  ][] = [
    [copy.calcTotalTokens, tokens, setTokens, 1, 1000000, 1],
    [copy.calcCachedPercent, percent, setPercent, 0, 100, 1],
    [copy.calcRequestsPerDay, requests, setRequests, 1, 100000, 1],
    [c.reuse, reuse, setReuse, 1, 100000, 1],
    [c.inputPrice, price, setPrice, 0, 100, 0.1],
    [c.writeFactor, write, setWrite, 0, 10, 0.05],
    [c.readFactor, read, setRead, 0, 10, 0.05],
  ]
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <p className="text-muted">{c.cacheNote}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {controls.map(([label, value, set, min, max, step]) => (
          <label key={label} className="text-sm">
            <span className="mb-2 block text-muted">{label}</span>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => {
                const n = Number(e.target.value)
                if (Number.isFinite(n) && n >= min && n <= max)
                  set(step === 1 ? Math.floor(n) : n)
              }}
              className="w-full rounded-lg border border-border bg-background p-2 font-mono"
            />
          </label>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          [c.writes, result.writes],
          [c.reads, result.reads],
          [c.costWithout, '$' + result.baseline.toFixed(4)],
          [c.costWith, '$' + result.cached.toFixed(4)],
        ].map(([label, value]) => (
          <div className="rounded-xl border border-border p-4" key={label}>
            <div className="text-sm text-muted">{label}</div>
            <div className="text-2xl font-mono">{value}</div>
          </div>
        ))}
      </div>
      <p
        role="status"
        className={result.savings >= 0 ? 'text-emerald-400' : 'text-orange-400'}
      >
        {result.savings >= 0 ? c.saving : c.extra}:{' '}
        <strong>${Math.abs(result.savings).toFixed(4)}</strong>
      </p>
    </div>
  )
}
