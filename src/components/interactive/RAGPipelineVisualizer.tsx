'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { bm25, dense, rrf, type Ranked, type Fused } from '@/lib/learning/hybrid-retrieval'

/** Non-translatable metadata for the six demo chunks. Texts live in the dictionary (t.rag.demoDocs). */
const DOC_META = [
  { id: 1, file: 'returns.md', trust: 'internal' },
  { id: 2, file: 'errors.md#E-4012', trust: 'internal' },
  { id: 3, file: 'errors.md#E-4021', trust: 'internal' },
  { id: 4, file: 'shipping.md', trust: 'internal' },
  { id: 5, file: 'warranty.md', trust: 'internal' },
  { id: 6, file: 'forum/post-881', trust: 'external' },
] as const

const TOP_K = 3

function RankList({ title, subtitle, items, format, matchedLabel, emptyLabel, color }: {
  title: string
  subtitle: string
  items: (Ranked | Fused)[]
  format: (item: Ranked | Fused) => string
  matchedLabel?: string
  emptyLabel: string
  color: string
}) {
  return (
    <div className="rounded-xl bg-surface border border-border p-4 min-w-0">
      <h4 className={`font-semibold ${color}`}>{title}</h4>
      <p className="text-xs text-muted mb-3">{subtitle}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{emptyLabel}</p>
      ) : (
        <ol className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map(item => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`text-sm rounded-lg px-3 py-2 border ${item.rank <= TOP_K ? 'border-primary/40 bg-primary/5' : 'border-border'}`}
              >
                <div className="flex justify-between gap-2">
                  <span className="font-mono">#{item.rank} · [{item.id}]</span>
                  <span className="font-mono text-muted">{format(item)}</span>
                </div>
                {matchedLabel && 'matched' in item && item.matched.length > 0 && (
                  <p className="text-xs text-muted mt-1 break-words">{matchedLabel}: {item.matched.join(', ')}</p>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}
    </div>
  )
}

export function RAGPipelineVisualizer() {
  const { t } = useTranslation()
  const r = t.rag
  const [query, setQuery] = useState(r.demoPresets[0])
  const [submitted, setSubmitted] = useState(r.demoPresets[0])
  const [internalOnly, setInternalOnly] = useState(false)

  const docs = useMemo(
    () => DOC_META
      .map((m, i) => ({ ...m, text: r.demoDocs[i] }))
      .filter(d => !internalOnly || d.trust === 'internal'),
    [r.demoDocs, internalOnly]
  )

  const lexical = useMemo(() => bm25(submitted, docs), [submitted, docs])
  const semantic = useMemo(() => dense(submitted, docs), [submitted, docs])
  const fused = useMemo(() => rrf({ lexical, dense: semantic }), [lexical, semantic])
  const context = fused.slice(0, TOP_K).map(f => docs.find(d => d.id === f.id)!)

  const prompt = [
    r.demoPromptInstruction,
    '',
    ...context.map(d => `<source id="${d.id}" file="${d.file}" trust="${d.trust}">\n${d.text}\n</source>`),
    '',
    `${r.demoPromptQuestion}: ${submitted}`,
  ].join('\n')

  const injected = context.some(d => d.trust === 'external')

  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-4 sm:p-6 space-y-5">
      <p className="text-sm text-muted">{r.demoIntro}</p>

      <details className="rounded-lg border border-border p-3">
        <summary className="cursor-pointer text-sm">{r.demoShowDocs}</summary>
        <ul className="mt-3 space-y-2">
          {DOC_META.map((m, i) => (
            <li key={m.id} className="text-sm">
              <span className="font-mono">[{m.id}] {m.file}</span>{' '}
              <span className={`text-xs px-1.5 py-0.5 rounded ${m.trust === 'external' ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                {m.trust === 'external' ? r.demoTrustExternal : r.demoTrustInternal}
              </span>
              <p className="text-muted">{r.demoDocs[i]}</p>
            </li>
          ))}
        </ul>
      </details>

      <form onSubmit={e => { e.preventDefault(); setSubmitted(query) }} className="space-y-3">
        <label className="block text-sm">
          {r.demoQuestionLabel}
          <input
            className="block w-full min-w-0 mt-2 rounded-lg border border-border bg-background px-3 py-3"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="min-h-11 rounded-lg px-4 border border-primary/40 bg-primary/10" disabled={!query.trim()}>
            {r.demoSearch}
          </button>
          {r.demoPresets.map(q => (
            <button
              type="button"
              key={q}
              className={`text-xs min-h-11 px-3 rounded-lg border ${submitted === q ? 'border-primary/60 bg-primary/10' : 'border-border'}`}
              onClick={() => { setQuery(q); setSubmitted(q) }}
            >
              {q}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={internalOnly} onChange={e => setInternalOnly(e.target.checked)} />
          {r.demoFilterLabel}
        </label>
      </form>

      <div className="grid gap-4 lg:grid-cols-3">
        <RankList
          title={r.demoLexicalTitle}
          subtitle={r.demoLexicalSub}
          items={lexical}
          format={i => i.score.toFixed(2)}
          matchedLabel={r.demoMatched}
          emptyLabel={r.demoNoHits}
          color="text-cyan-400"
        />
        <RankList
          title={r.demoDenseTitle}
          subtitle={r.demoDenseSub}
          items={semantic}
          format={i => i.score.toFixed(2)}
          emptyLabel={r.demoNoHits}
          color="text-purple-400"
        />
        <RankList
          title={r.demoFusedTitle}
          subtitle={r.demoFusedSub}
          items={fused}
          format={i => {
            const f = i as Fused
            return `${f.score.toFixed(4)} (${f.lexicalRank ?? '–'}/${f.denseRank ?? '–'})`
          }}
          emptyLabel={r.demoNoHits}
          color="text-emerald-400"
        />
      </div>
      <p className="text-xs text-muted">{r.demoFusedLegend}</p>

      <div className="space-y-2">
        <h4 className="font-semibold">{r.demoPromptTitle}</h4>
        {context.length === 0 ? (
          <p className="text-sm text-muted">{r.demoNoContext}</p>
        ) : (
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-background border border-border p-4 text-xs">{prompt}</pre>
        )}
        {injected && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300">
            {r.demoInjectionWarning}
          </motion.p>
        )}
      </div>
      <p className="text-xs text-muted">{r.demoToyNote}</p>
    </div>
  )
}
