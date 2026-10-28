'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

// Illustrative token assumptions (stated in the UI note, not tokenizer measurements).
// Tool numbers follow Anthropic's five-MCP-server example (58 tools, ~55k tokens)
// and the documented >85 % reduction with tool search.
const SYSTEM_TOKENS = 3_000
const INSTRUCTION_TOKENS = 2_000
const TOOLS_ALL_TOKENS = 55_000
const TOOLS_SEARCH_TOKENS = 8_000
const DOCS_PRELOAD_TOKENS = 40_000
const DOCS_INDEX_TOKENS = 1_500
const STEP_TOKENS = 2_500
const JIT_READ_TOKENS = 800
const WINDOWS = [200_000, 1_000_000] as const

interface Segment {
  key: string
  label: string
  tokens: number
  color: string
  stable: boolean
}

export function ContextAnatomyVisualizer() {
  const { t, locale } = useTranslation()
  const v = t.agentContext.viz
  const [windowSize, setWindowSize] = useState<(typeof WINDOWS)[number]>(200_000)
  const [toolSearch, setToolSearch] = useState(false)
  const [jit, setJit] = useState(false)
  const [timestamp, setTimestamp] = useState(false)
  const [steps, setSteps] = useState(20)

  const fmt = (n: number) => n.toLocaleString(locale)
  const perStep = STEP_TOKENS + (jit ? JIT_READ_TOKENS : 0)

  const segments: Segment[] = [
    { key: 'tools', label: v.segTools, tokens: toolSearch ? TOOLS_SEARCH_TOKENS : TOOLS_ALL_TOKENS, color: 'bg-orange-400', stable: true },
    { key: 'system', label: v.segSystem, tokens: SYSTEM_TOKENS, color: 'bg-purple-400', stable: true },
    { key: 'instructions', label: v.segInstructions, tokens: INSTRUCTION_TOKENS, color: 'bg-pink-400', stable: true },
    { key: 'docs', label: jit ? v.segIndex : v.segDocs, tokens: jit ? DOCS_INDEX_TOKENS : DOCS_PRELOAD_TOKENS, color: 'bg-cyan-400', stable: true },
    { key: 'history', label: v.segHistory, tokens: steps * perStep, color: 'bg-emerald-400', stable: false },
  ]

  const total = segments.reduce((sum, s) => sum + s.tokens, 0)
  const overflow = total > windowSize
  // Append-only history: everything except the newest step is byte-identical to the
  // previous request — unless a changing timestamp sits at the very top of the prompt.
  const cacheable = timestamp || steps === 0 ? 0 : total - perStep
  const scale = Math.max(total, windowSize)

  const toggle = (active: boolean) =>
    `px-3 py-1.5 rounded-lg border text-sm transition-colors ${active ? 'border-primary bg-primary/10 text-text' : 'border-border text-muted hover:text-text'}`

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 space-y-5">
      <p className="text-sm text-muted">{v.note}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text mb-2">{v.window}</legend>
          <div className="flex flex-wrap gap-2">
            {WINDOWS.map((w) => (
              <button key={w} type="button" aria-pressed={windowSize === w} className={toggle(windowSize === w)} onClick={() => setWindowSize(w)}>
                {fmt(w)} {v.tokens}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text mb-2">{v.tools}</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={!toolSearch} className={toggle(!toolSearch)} onClick={() => setToolSearch(false)}>{v.toolsAll}</button>
            <button type="button" aria-pressed={toolSearch} className={toggle(toolSearch)} onClick={() => setToolSearch(true)}>{v.toolsSearch}</button>
          </div>
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text mb-2">{v.docs}</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={!jit} className={toggle(!jit)} onClick={() => setJit(false)}>{v.docsPreload}</button>
            <button type="button" aria-pressed={jit} className={toggle(jit)} onClick={() => setJit(true)}>{v.docsJit}</button>
          </div>
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text mb-2">{v.prefix}</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={!timestamp} className={toggle(!timestamp)} onClick={() => setTimestamp(false)}>{v.prefixStable}</button>
            <button type="button" aria-pressed={timestamp} className={toggle(timestamp)} onClick={() => setTimestamp(true)}>{v.prefixTimestamp}</button>
          </div>
        </fieldset>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-text">{v.steps}: {steps}</span>
        <input type="range" min={0} max={80} value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="mt-2 w-full accent-primary" />
      </label>

      <div>
        <div className="relative h-10 rounded-lg overflow-hidden bg-background border border-border flex">
          {segments.map((s) => (
            <motion.div
              key={s.key}
              className={`${s.color} h-full`}
              initial={false}
              animate={{ width: `${(100 * s.tokens) / scale}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              title={`${s.label}: ${fmt(s.tokens)} ${v.tokens}`}
            />
          ))}
          {overflow && (
            <div className="absolute top-0 bottom-0 border-r-2 border-dashed border-red-400" style={{ left: `${(100 * windowSize) / scale}%` }} />
          )}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>0</span>
          <span>{v.window}: {fmt(windowSize)}</span>
        </div>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm">
            <span className={`h-3 w-3 shrink-0 rounded-sm ${s.color}`} />
            <span className="flex-1 text-text">{s.label}</span>
            <span className="font-mono text-muted">{fmt(s.tokens)}</span>
            <span className={`text-xs ${s.stable ? 'text-cyan-400' : 'text-emerald-400'}`}>{s.stable ? v.stable : v.grows}</span>
          </li>
        ))}
      </ul>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`rounded-xl border p-4 ${overflow ? 'border-red-500/40 bg-red-500/5' : 'border-border bg-background/50'}`}>
          <p className="text-xs uppercase tracking-wide text-muted">{v.used}</p>
          <p className="text-2xl font-bold font-heading text-text">{fmt(total)} <span className="text-sm font-normal text-muted">{v.tokens}</span></p>
          <p className="text-sm text-muted">{Math.round((100 * total) / windowSize)} % {v.ofWindow}</p>
          {overflow && <p className="mt-2 text-sm text-red-400">{v.overflow}</p>}
        </div>
        <div className="rounded-xl border border-border bg-background/50 p-4">
          <p className="text-xs uppercase tracking-wide text-muted">{v.cacheable}</p>
          <p className="text-2xl font-bold font-heading text-text">{fmt(cacheable)} <span className="text-sm font-normal text-muted">{v.tokens}</span></p>
          <p className={`text-sm ${timestamp ? 'text-red-400' : 'text-muted'}`}>{timestamp ? v.cacheBroken : v.cacheNote}</p>
        </div>
      </div>
    </div>
  )
}
