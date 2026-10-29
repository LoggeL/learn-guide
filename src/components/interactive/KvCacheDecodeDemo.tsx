'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

/**
 * Exact operation counts for one layer and one KV head.
 * Prefill processes positions 1..P at once; each decode step adds one position n.
 * With cache: a step computes K/V for its own position(s) and one score per
 * (query, visible key) pair. Without cache: every step reruns the full prefix.
 */
export function kvCacheStepCost(prev: number, next: number) {
  // positions prev+1..next are new in this step
  const triangle = (n: number) => (n * (n + 1)) / 2
  return {
    withCache: {
      projections: next - prev,
      scores: triangle(next) - triangle(prev),
    },
    withoutCache: {
      projections: next,
      scores: triangle(next),
    },
  }
}

export function KvCacheDecodeDemo() {
  const { t, locale } = useTranslation()
  const k = t.kvCache
  const promptTokens = k.demoPromptTokens.split(' ')
  const generatedTokens = k.demoGeneratedTokens.split(' ')
  const allTokens = [...promptTokens, ...generatedTokens]
  const P = promptTokens.length
  const N = allTokens.length

  // length = number of positions currently in the cache (0 = nothing run yet)
  const [length, setLength] = useState(0)

  const history = useMemo(() => {
    const steps: number[] = []
    if (length >= P) {
      steps.push(P)
      for (let n = P + 1; n <= length; n++) steps.push(n)
    }
    return steps
  }, [length, P])

  const totals = useMemo(() => {
    let prev = 0
    const sum = { wp: 0, ws: 0, op: 0, os: 0 }
    for (const n of history) {
      const c = kvCacheStepCost(prev, n)
      sum.wp += c.withCache.projections
      sum.ws += c.withCache.scores
      sum.op += c.withoutCache.projections
      sum.os += c.withoutCache.scores
      prev = n
    }
    return sum
  }, [history])

  const lastStep =
    history.length > 0
      ? kvCacheStepCost(
          history.length > 1 ? history[history.length - 2] : 0,
          history[history.length - 1],
        )
      : null

  const advance = () => setLength((l) => (l === 0 ? P : Math.min(l + 1, N)))
  const fmt = (n: number) => n.toLocaleString(locale)

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      {/* Token strip */}
      <div className="flex flex-wrap gap-2">
        {allTokens.map((token, i) => {
          const isPrompt = i < P
          const inCache = i < length
          const isNewest = i === length - 1
          return (
            <span
              key={i}
              className={`rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors ${
                inCache
                  ? isPrompt
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                    : 'border-orange-500/40 bg-orange-500/10 text-orange-200'
                  : 'border-dashed border-border text-muted/60'
              } ${isNewest ? 'ring-2 ring-primary/60' : ''}`}
            >
              {inCache || isPrompt ? token : '…'}
            </span>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-cyan-500/40" />
          {k.demoPhasePrompt}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-orange-500/40" />
          {k.demoPhaseGenerated}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={advance}
          disabled={length >= N}
          className="rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary-light transition-colors hover:bg-primary/20 disabled:opacity-40"
        >
          {length === 0 ? k.demoPrefill : k.demoDecode}
        </button>
        <button
          onClick={() => setLength(0)}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-text"
        >
          {k.demoReset}
        </button>
      </div>

      {/* Cache table */}
      <div className="rounded-xl border border-border bg-background/60 p-4">
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          {k.demoCacheTitle}
        </div>
        {length === 0 ? (
          <p className="text-sm text-muted">{k.demoCacheEmpty}</p>
        ) : (
          <div className="space-y-1.5">
            <AnimatePresence initial={false}>
              {allTokens.slice(0, length).map((token, i) => {
                const isNewRow = lastStep
                  ? i >= length - lastStep.withCache.projections
                  : false
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: isNewRow ? 0.04 * (i % 8) : 0 }}
                    className="grid grid-cols-[5.5rem_1fr_1fr] items-center gap-2 font-mono text-xs sm:grid-cols-[7rem_1fr_1fr]"
                  >
                    <span className="truncate text-muted">
                      {i + 1}. {token}
                    </span>
                    <span
                      className={`rounded-md border bg-cyan-500/10 px-2 py-1 text-cyan-200 ${
                        isNewRow ? 'border-cyan-400' : 'border-cyan-500/20'
                      }`}
                    >
                      k<sub>{i + 1}</sub>
                    </span>
                    <span
                      className={`rounded-md border bg-orange-500/10 px-2 py-1 text-orange-200 ${
                        isNewRow ? 'border-orange-400' : 'border-orange-500/20'
                      }`}
                    >
                      v<sub>{i + 1}</sub>
                    </span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <motion.p
              key={length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-2 text-xs text-primary-light"
            >
              q<sub>{length}</sub> · k<sub>1…{length}</sub> —{' '}
              {k.demoQueryLabel.replace('{n}', String(length))}
            </motion.p>
          </div>
        )}
      </div>

      {/* Counters */}
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: k.demoWithCache,
            color: 'text-emerald-400',
            border: 'border-emerald-500/30',
            step: lastStep?.withCache,
            total: { projections: totals.wp, scores: totals.ws },
          },
          {
            title: k.demoWithoutCache,
            color: 'text-red-400',
            border: 'border-red-500/30',
            step: lastStep?.withoutCache,
            total: { projections: totals.op, scores: totals.os },
          },
        ].map((col) => (
          <div key={col.title} className={`rounded-xl border ${col.border} bg-background/40 p-4`}>
            <div className={`mb-3 text-sm font-bold ${col.color}`}>{col.title}</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted">
                  <th className="pb-2 text-left font-normal" />
                  <th className="pb-2 text-right font-normal">{k.demoThisStep}</th>
                  <th className="pb-2 text-right font-normal">{k.demoTotal}</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-t border-border">
                  <td className="py-2 font-sans text-muted">{k.demoProjections}</td>
                  <td className="py-2 text-right">{fmt(col.step?.projections ?? 0)}</td>
                  <td className="py-2 text-right">{fmt(col.total.projections)}</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="py-2 font-sans text-muted">{k.demoScores}</td>
                  <td className="py-2 text-right">{fmt(col.step?.scores ?? 0)}</td>
                  <td className="py-2 text-right">{fmt(col.total.scores)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-muted">{k.demoInsight}</p>
    </div>
  )
}
