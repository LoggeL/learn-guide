'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

/**
 * Simplified tokenizer: words (with their leading whitespace, like BPE) and single
 * punctuation marks. Real tokenizers split differently, but the prefix rule is the same.
 */
export function promptCacheTokenize(text: string) {
  return text.match(/\s*[A-Za-zÀ-ÿ0-9_]+|\s*[^\sA-Za-zÀ-ÿ0-9_]|\s+/g) ?? []
}

/** Block-based prefix reuse with a minimum cacheable length. */
export function promptCacheMatch(
  cached: string[],
  next: string[],
  blockSize: number,
  minTokens: number,
) {
  let matching = 0
  while (
    matching < cached.length &&
    matching < next.length &&
    cached[matching] === next[matching]
  )
    matching++
  const fullBlocks = Math.floor(matching / blockSize) * blockSize
  const reused = fullBlocks >= minTokens ? fullBlocks : 0
  return { matching, reused, recomputed: next.length - reused, total: next.length }
}

const BLOCK_SIZES = [4, 8, 16]
const MIN_LENGTHS = [16, 32, 64]

export function PromptCachePrefixDemo() {
  const { t, locale } = useTranslation()
  const p = t.promptCaching
  const original = p.prefixDemoPrompt + p.prefixDemoQuestion
  const [edited, setEdited] = useState(original)
  const [blockSize, setBlockSize] = useState(8)
  const [minTokens, setMinTokens] = useState(32)

  const presets: [string, () => string][] = [
    [p.prefixPresetReset, () => original],
    [p.prefixPresetQuestion, () => p.prefixDemoPrompt + p.prefixDemoQuestionAlt],
    [p.prefixPresetDate, () => p.prefixDemoDateLine + original],
    [p.prefixPresetSpace, () => original.replace(' ', '  ')],
  ]

  const cachedTokens = useMemo(() => promptCacheTokenize(original), [original])
  const editedTokens = useMemo(() => promptCacheTokenize(edited), [edited])
  const m = promptCacheMatch(cachedTokens, editedTokens, blockSize, minTokens)
  const share = m.total > 0 ? Math.round((m.reused / m.total) * 100) : 0

  const tokenClass = (i: number) =>
    i < m.reused
      ? 'bg-emerald-500/20 text-emerald-200'
      : i < m.matching
        ? 'bg-amber-500/20 text-amber-200'
        : 'bg-cyan-500/15 text-cyan-100'

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {presets.map(([label, apply]) => (
          <button
            key={label}
            onClick={() => setEdited(apply())}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-primary hover:text-text"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">
            {p.prefixOriginal}
          </div>
          <div className="h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-surface-elevated p-3 font-mono text-xs leading-relaxed text-muted">
            {original}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">
            {p.prefixEdited}
          </div>
          <textarea
            value={edited}
            onChange={(e) => setEdited(e.target.value)}
            spellCheck={false}
            aria-label={p.prefixEdited}
            className="h-64 w-full resize-none rounded-xl border border-border bg-surface p-3 font-mono text-xs leading-relaxed text-text transition-colors focus:border-violet-500/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          [p.prefixBlockSize, BLOCK_SIZES, blockSize, setBlockSize] as const,
          [p.prefixMinLength, MIN_LENGTHS, minTokens, setMinTokens] as const,
        ].map(([label, options, value, set]) => (
          <div key={label} className="text-sm">
            <div className="mb-2 text-muted">{label}</div>
            <div className="flex gap-2">
              {options.map((o) => (
                <button
                  key={o}
                  onClick={() => set(o)}
                  aria-pressed={value === o}
                  className={`rounded-lg border px-3 py-1 font-mono text-xs ${
                    value === o ? 'border-primary text-primary-light' : 'border-border text-muted'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Token view */}
      <div className="max-h-64 overflow-auto rounded-xl border border-border bg-background/60 p-3 font-mono text-xs leading-loose">
        {editedTokens.map((tok, i) => (
          <span key={i}>
            {i > 0 && i % blockSize === 0 && (
              <span className="mx-px inline-block h-3 w-px bg-violet-400/70 align-middle" />
            )}
            <span className={`whitespace-pre-wrap rounded-sm ${tokenClass(i)}`}>{tok}</span>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500/40" />
          {p.prefixLegendCached}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-500/40" />
          {p.prefixLegendPartial}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-cyan-500/30" />
          {p.prefixLegendNew}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-px bg-violet-400" />
          {p.prefixLegendBlock}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [p.prefixMatching, m.matching.toLocaleString(locale), 'text-amber-300'],
          [p.prefixCached, m.reused.toLocaleString(locale), 'text-emerald-400'],
          [p.prefixRecomputed, m.recomputed.toLocaleString(locale), 'text-cyan-300'],
          [p.prefixShare, `${share} %`, 'text-violet-300'],
        ].map(([label, value, color]) => (
          <motion.div
            key={`${label}-${value}`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-border bg-background/50 p-3 text-center"
          >
            <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
            <div className={`mt-1 font-mono text-2xl font-bold ${color}`}>{value}</div>
          </motion.div>
        ))}
      </div>
      {m.matching > 0 && m.reused === 0 && (
        <p className="text-sm text-orange-300">{p.prefixBelowMin}</p>
      )}
    </div>
  )
}
