'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Database, Network } from 'lucide-react'
import clsx from 'clsx'
import { useTranslation } from '@/lib/i18n/context'
import { GIB, KIB, kvCacheBytes, type KvArchitecture } from '@/lib/attention-math'

const NUM_QUERY_HEADS = 8
const QUERY_HEAD_COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#fb923c', '#60a5fa', '#f87171']

type LevelId = 'mha' | 'gqa4' | 'gqa2' | 'mqa'
const LEVELS: { id: LevelId; label: string; kvHeads: number }[] = [
  { id: 'mha', label: 'MHA', kvHeads: 8 },
  { id: 'gqa4', label: 'GQA-4', kvHeads: 4 },
  { id: 'gqa2', label: 'GQA-2', kvHeads: 2 },
  { id: 'mqa', label: 'MQA', kvHeads: 1 },
]

type PresetId = 'llamaGqa' | 'llamaMha' | 'llamaMqa' | 'deepseek' | 'gemma' | 'qwen'
// Configurations from the published Hugging Face config.json files (see sources on the page).
const PRESETS: { id: PresetId; arch: KvArchitecture; color: string }[] = [
  { id: 'llamaMha', arch: { kind: 'gqa', layers: 80, kvHeads: 64, headDim: 128 }, color: 'bg-red-400/80' },
  { id: 'llamaGqa', arch: { kind: 'gqa', layers: 80, kvHeads: 8, headDim: 128 }, color: 'bg-amber-300/80' },
  { id: 'llamaMqa', arch: { kind: 'gqa', layers: 80, kvHeads: 1, headDim: 128 }, color: 'bg-orange-300/70' },
  { id: 'gemma', arch: { kind: 'swa', globalLayers: 10, localLayers: 52, window: 1024, kvHeads: 16, headDim: 128 }, color: 'bg-cyan-400/80' },
  { id: 'deepseek', arch: { kind: 'mla', layers: 61, latentDim: 512, ropeDim: 64 }, color: 'bg-purple-400/80' },
  { id: 'qwen', arch: { kind: 'hybrid', attentionLayers: 12, kvHeads: 2, headDim: 256 }, color: 'bg-emerald-400/80' },
]

const CONTEXTS = [4096, 8192, 16384, 32768, 65536, 131072]
const PRECISIONS = [
  { id: 'bf16', label: 'BF16', bytes: 2 },
  { id: 'fp8', label: 'FP8', bytes: 1 },
] as const

function formatBytes(bytes: number, locale: string) {
  if (bytes >= GIB) return `${(bytes / GIB).toLocaleString(locale, { maximumFractionDigits: bytes >= 10 * GIB ? 0 : 1 })} GiB`
  if (bytes >= 1024 * KIB) return `${(bytes / (1024 * KIB)).toLocaleString(locale, { maximumFractionDigits: 1 })} MiB`
  return `${(bytes / KIB).toLocaleString(locale, { maximumFractionDigits: 1 })} KiB`
}

export function MultiHeadGqaVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.multiHeadAttentionGqa.viz
  const [levelIndex, setLevelIndex] = useState(0)
  const [contextIndex, setContextIndex] = useState(CONTEXTS.length - 1)
  const [precision, setPrecision] = useState<(typeof PRECISIONS)[number]['id']>('bf16')
  const level = LEVELS[levelIndex]
  const groupSize = NUM_QUERY_HEADS / level.kvHeads
  const tokens = CONTEXTS[contextIndex]
  const bytesPerValue = PRECISIONS.find((p) => p.id === precision)?.bytes ?? 2

  const rows = PRESETS.map((preset) => {
    const total = kvCacheBytes(preset.arch, tokens, bytesPerValue)
    return { ...preset, total, perToken: total / tokens, text: c.presets[preset.id] }
  })
  const maxTotal = Math.max(...rows.map((r) => r.total))

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface/55 p-5 md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10">
            <Network size={18} className="text-cyan-300" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-text">{c.groupingTitle}</h3>
            <p className="text-sm text-muted">{c.groupingBody}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {LEVELS.map((lvl, index) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setLevelIndex(index)}
              aria-pressed={index === levelIndex}
              className={clsx('rounded-full px-3 py-1.5 font-mono text-xs font-semibold ring-1 transition', index === levelIndex ? 'bg-amber-300/15 text-amber-100 ring-amber-300/50' : 'text-muted ring-border hover:text-text')}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[420px] gap-2" style={{ gridTemplateColumns: `repeat(${level.kvHeads}, minmax(0, 1fr))` }}>
            {Array.from({ length: level.kvHeads }, (_, group) => {
              const members = Array.from({ length: groupSize }, (_, member) => group * groupSize + member)
              return (
                <motion.div layout key={`${level.id}-kv-${group}`} className="rounded-xl border border-border bg-background/60 p-2">
                  <div className="flex min-h-[3.75rem] flex-wrap content-start justify-center gap-1">
                    {members.map((q) => (
                      <motion.span
                        layoutId={`query-head-${q}`}
                        key={q}
                        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                        className="grid h-7 w-7 place-items-center rounded-full border bg-surface font-mono text-[10px] font-semibold text-text"
                        style={{ borderColor: QUERY_HEAD_COLORS[q] }}
                      >
                        Q{q + 1}
                      </motion.span>
                    ))}
                  </div>
                  <div className="my-1 text-center text-xs text-subtle">↓</div>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="rounded bg-cyan-400/10 px-1.5 py-1 text-center text-cyan-100">K{group + 1}</div>
                    <div className="rounded bg-orange-400/10 px-1.5 py-1 text-center text-orange-100">V{group + 1}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{c.levels[level.id]}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="text-xs uppercase tracking-[0.16em] text-muted">{c.queryHeads}</div>
            <div className="mt-1 font-mono text-2xl font-bold text-text">{NUM_QUERY_HEADS}</div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="text-xs uppercase tracking-[0.16em] text-muted">{c.kvHeadsStored}</div>
            <div className="mt-1 font-mono text-2xl font-bold text-emerald-200">{level.kvHeads}</div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="text-xs uppercase tracking-[0.16em] text-muted">{c.cacheFactor}</div>
            <div className="mt-1 font-mono text-2xl font-bold text-cyan-200">{level.kvHeads}/{NUM_QUERY_HEADS}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface/55 p-5 md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/10">
            <Calculator size={18} className="text-amber-300" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-text">{c.calcTitle}</h3>
            <p className="text-sm text-muted">{c.calcBody}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <label className="block rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-3">
            <div className="mb-2 flex justify-between text-sm text-cyan-100">
              <span>{c.context}</span>
              <span className="font-mono">{tokens.toLocaleString(locale)} {c.tokens}</span>
            </div>
            <input type="range" min={0} max={CONTEXTS.length - 1} value={contextIndex} onChange={(e) => setContextIndex(Number(e.target.value))} className="w-full accent-cyan-400" aria-label={c.context} />
          </label>
          <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="mb-2 text-sm text-muted">{c.precision}</div>
            <div className="flex gap-2">
              {PRECISIONS.map((p) => (
                <button key={p.id} type="button" onClick={() => setPrecision(p.id)} aria-pressed={precision === p.id} className={clsx('rounded-full px-3 py-1 font-mono text-xs ring-1 transition', precision === p.id ? 'bg-purple-400/15 text-purple-100 ring-purple-300/50' : 'text-muted ring-border hover:text-text')}>
                  {p.label} · {p.bytes} B
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {rows.map((row) => (
            <div key={row.id}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                <span className="font-semibold text-text">{row.text.name}</span>
                <span className="font-mono text-xs text-muted">
                  <span className="text-text">{formatBytes(row.total, locale)}</span> · {formatBytes(row.perToken, locale)} {row.id === 'gemma' ? c.perTokenAvg : c.perToken}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-background/80">
                <motion.div className={clsx('h-full rounded-full', row.color)} initial={false} animate={{ width: `${Math.max(0.6, (row.total / maxTotal) * 100)}%` }} transition={{ type: 'spring', stiffness: 180, damping: 26 }} />
              </div>
              <div className="mt-1 text-xs text-subtle">{row.text.note}</div>
            </div>
          ))}
        </div>

        <p className="mt-5 flex gap-2 text-xs leading-relaxed text-subtle">
          <Database size={14} className="mt-0.5 shrink-0" />
          {c.note}
        </p>
      </div>
    </section>
  )
}
