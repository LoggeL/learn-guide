'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { LatexBlock } from '@/components/ui/Latex'

const MAX_K = 12

function expectedTokens(alpha: number, k: number) {
  if (alpha >= 1) return k + 1
  return (1 - Math.pow(alpha, k + 1)) / (1 - alpha)
}

function speedup(alpha: number, k: number, cost: number) {
  return expectedTokens(alpha, k) / (k * cost + 1)
}

/**
 * Expected-value calculator for speculative decoding (Leviathan et al. 2023, Eq. 1 and Thm. 3.8):
 * tokens per round, the distribution of the accepted length and the speedup as a function of K.
 */
export function SpeculativeDecodingVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.speculativeDecoding
  const nf = (value: number, digits = 2) =>
    value.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const [alpha, setAlpha] = useState(0.8)
  const [k, setK] = useState(4)
  const [cost, setCost] = useState(0.05)

  const result = useMemo(() => {
    const tokens = expectedTokens(alpha, k)
    const roundCost = k * cost + 1
    const byK = Array.from({ length: MAX_K }, (_, i) => speedup(alpha, i + 1, cost))
    const bestK = byK.indexOf(Math.max(...byK)) + 1
    const dist = Array.from({ length: k + 1 }, (_, i) => (i < k ? Math.pow(alpha, i) * (1 - alpha) : Math.pow(alpha, k)))
    return { tokens, roundCost, speed: tokens / roundCost, byK, bestK, dist }
  }, [alpha, k, cost])

  const maxDist = Math.max(...result.dist)
  const maxSpeed = Math.max(1.5, ...result.byK)

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface p-6">
      <div>
        <h3 className="font-heading text-xl font-semibold text-text">{c.calcTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{c.calcDesc}</p>
        <LatexBlock className="my-3 overflow-x-auto text-text">{'\\mathbb{E}[N] = \\sum_{i=0}^{K} \\alpha^{i} = \\frac{1-\\alpha^{K+1}}{1-\\alpha}'}</LatexBlock>
        <p className="text-sm leading-relaxed text-muted">{c.calcSpeedupDesc}</p>
        <LatexBlock className="my-3 overflow-x-auto text-text">{'S(\\alpha, K, c) = \\frac{1-\\alpha^{K+1}}{(1-\\alpha)\\,(K c + 1)}'}</LatexBlock>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm text-text">
          {c.calcAlpha}: <span className="font-mono text-cyan-300">{nf(alpha)}</span>
          <input type="range" min={0.3} max={0.98} step={0.01} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} className="mt-2 block w-full" />
        </label>
        <label className="text-sm text-text">
          {c.calcK}: <span className="font-mono text-cyan-300">{k}</span>
          <input type="range" min={1} max={MAX_K} step={1} value={k} onChange={(e) => setK(Number(e.target.value))} className="mt-2 block w-full" />
        </label>
        <label className="text-sm text-text">
          {c.calcC}: <span className="font-mono text-cyan-300">{nf(cost)}</span>
          <input type="range" min={0} max={0.5} step={0.01} value={cost} onChange={(e) => setCost(Number(e.target.value))} className="mt-2 block w-full" />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        {[
          [c.calcExpected, nf(result.tokens)],
          [c.calcCost, nf(result.roundCost)],
          [c.calcSpeedup, `${nf(result.speed)}×`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-muted">{label}</p>
            <p className={`mt-2 font-mono text-2xl ${label === c.calcSpeedup && result.speed < 1 ? 'text-orange-300' : 'text-cyan-300'}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <h4 className="font-semibold text-text">{c.calcDistTitle}</h4>
          <p className="mt-1 text-xs leading-relaxed text-muted">{c.calcDistDesc}</p>
          <div className="mt-4 flex items-end gap-1" style={{ height: 140 }}>
            {result.dist.map((prob, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <motion.div
                  className={`w-full rounded-t ${i === k ? 'bg-emerald-400' : 'bg-purple-400/70'}`}
                  initial={false}
                  animate={{ height: `${(prob / maxDist) * 100}%` }}
                  transition={{ duration: 0.35 }}
                  title={nf(prob, 3)}
                />
                <span className="font-mono text-[10px] text-muted">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <h4 className="font-semibold text-text">{c.calcByKTitle}</h4>
          <p className="mt-1 text-xs leading-relaxed text-muted">{c.calcByKDesc}</p>
          <div className="relative mt-4 flex items-end gap-1" style={{ height: 140 }}>
            <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-orange-400/60" style={{ bottom: `${(1 / maxSpeed) * 100}%` }} />
            {result.byK.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setK(i + 1)}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                aria-label={`K = ${i + 1}: ${nf(s)}×`}
              >
                <motion.div
                  className={`w-full rounded-t ${i + 1 === k ? 'bg-cyan-400' : i + 1 === result.bestK ? 'bg-emerald-400/70' : 'bg-cyan-400/30'}`}
                  initial={false}
                  animate={{ height: `${(s / maxSpeed) * 100}%` }}
                  transition={{ duration: 0.35 }}
                />
                <span className="font-mono text-[10px] text-muted">{i + 1}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 font-mono text-sm text-emerald-300">{c.calcBestK.replace('{k}', String(result.bestK))}</p>
        </div>
      </div>

      <p className="border-l-2 border-cyan-500 pl-4 text-sm leading-relaxed text-muted">{c.calcAssumption}</p>
    </div>
  )
}
