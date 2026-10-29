'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

type Placement = 'top' | 'bottom'

interface Block {
  id: string
  label: string
}

const TIMES = ['09:41', '09:42']

/**
 * Builds the two requests and counts how many leading blocks are identical.
 * Prefix caches can only reuse content up to the first difference.
 */
export function sharedPrefixLength(a: Block[], b: Block[]): number {
  let n = 0
  while (n < a.length && n < b.length && a[n].label === b[n].label) n++
  return n
}

export function PromptCachePrefixDemo() {
  const { t } = useTranslation()
  const c = t.systemPrompts
  const [placement, setPlacement] = useState<Placement>('top')

  const requests = useMemo(() => {
    const questions = [c.cacheQuestion1, c.cacheQuestion2]
    return TIMES.map((time, i) => {
      const stable: Block[] = [
        { id: 'tools', label: c.cacheBlocks.tools },
        { id: 'instructions', label: c.cacheBlocks.instructions },
        { id: 'examples', label: c.cacheBlocks.examples },
      ]
      const timestamp: Block = { id: 'timestamp', label: c.cacheBlocks.timestamp.replace('{time}', time) }
      const question: Block = { id: 'question', label: c.cacheBlocks.question.replace('{question}', questions[i]) }
      return placement === 'top' ? [timestamp, ...stable, question] : [...stable, timestamp, question]
    })
  }, [c, placement])

  const reused = sharedPrefixLength(requests[0], requests[1])
  const total = requests[1].length

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <h3 className="text-lg font-bold font-heading text-text">{c.cacheDemoTitle}</h3>
      <p className="mt-1 text-sm text-muted">{c.cacheDemoDesc}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(['top', 'bottom'] as const).map(option => (
          <button
            key={option}
            onClick={() => setPlacement(option)}
            aria-pressed={placement === option}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              placement === option
                ? 'border-primary/40 bg-primary/20 text-primary-light'
                : 'border-border bg-background text-muted hover:text-text'
            }`}
          >
            {option === 'top' ? c.cacheTop : c.cacheBottom}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {requests.map((blocks, r) => (
          <div key={r}>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {c.cacheRequest.replace('{n}', String(r + 1))}
            </h4>
            <div className="space-y-2">
              {blocks.map((block, i) => {
                const cached = r === 1 && i < reused
                const recomputed = r === 1 && i >= reused
                return (
                  <motion.div
                    key={block.id}
                    layout
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${
                      cached
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : recomputed
                          ? 'border-orange-500/40 bg-orange-500/10 text-orange-300'
                          : 'border-border bg-background text-text'
                    }`}
                  >
                    <span className="font-mono">{block.label}</span>
                    {r === 1 && (
                      <span className="shrink-0 text-[11px] opacity-80">{cached ? c.cacheReused : c.cacheRecomputed}</span>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p role="status" className={`mt-4 text-sm font-semibold ${reused > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
        {c.cacheSummary.replace('{reused}', String(reused)).replace('{total}', String(total))}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{c.cacheNote}</p>
    </div>
  )
}
