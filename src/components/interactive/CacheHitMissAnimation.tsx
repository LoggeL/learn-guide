'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
export function CacheHitMissAnimation({ t: p }: { t: Record<string, string> }) {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [hit, setHit] = useState(false)
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface/50 p-5">
      <p className="text-sm text-muted">{p.animDesc}</p>
      <div className="flex gap-3">
        <button
          className={`rounded-lg border p-3 ${!hit ? 'border-primary' : 'border-border'}`}
          onClick={() => setHit(false)}
          aria-pressed={!hit}
        >
          {p.animCacheMiss}
        </button>
        <button
          className={`rounded-lg border p-3 ${hit ? 'border-primary' : 'border-border'}`}
          onClick={() => setHit(true)}
          aria-pressed={hit}
        >
          {p.animCacheHit}
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          [p.animTokensProcessed, hit ? 2000 : 10000],
          [c.writeTokens, hit ? 0 : 8000],
          [c.readTokens, hit ? 8000 : 0],
        ].map(([label, n]) => (
          <div key={label} className="rounded-lg border border-border p-4">
            <div className="text-sm text-muted">{label}</div>
            <div className="text-2xl font-mono">{n}</div>
          </div>
        ))}
      </div>
      <div className="flex overflow-hidden rounded-lg text-center text-xs">
        <div
          className={`w-4/5 p-3 ${hit ? 'bg-emerald-500/20' : 'bg-violet-500/20'}`}
        >
          {p.animCachedPrefix}: 8,000
        </div>
        <div className="w-1/5 bg-cyan-500/20 p-3">{p.animNewTokens}: 2,000</div>
      </div>
    </div>
  )
}
