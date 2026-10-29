'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type ArtifactKey = 'outputs' | 'weights' | 'rights' | 'code' | 'data'
type LevelKey = 'api' | 'restricted' | 'permissive' | 'full'

const ARTIFACTS: ArtifactKey[] = ['outputs', 'weights', 'rights', 'code', 'data']

const LEVELS: { key: LevelKey; unlocked: number; accent: string; bar: string }[] = [
  { key: 'api', unlocked: 1, accent: 'text-orange-400 border-orange-500/40', bar: 'bg-orange-500/60' },
  { key: 'restricted', unlocked: 2, accent: 'text-amber-300 border-amber-400/40', bar: 'bg-amber-400/60' },
  { key: 'permissive', unlocked: 3, accent: 'text-cyan-400 border-cyan-500/40', bar: 'bg-cyan-500/60' },
  { key: 'full', unlocked: 5, accent: 'text-emerald-400 border-emerald-500/40', bar: 'bg-emerald-500/60' },
]

export function OpennessLadder() {
  const { t } = useTranslation()
  const o = t.openSource
  const [active, setActive] = useState<LevelKey>('permissive')
  const level = LEVELS.find((l) => l.key === active) ?? LEVELS[0]

  const titles: Record<LevelKey, string> = {
    api: o.ladder.apiTitle,
    restricted: o.ladder.restrictedTitle,
    permissive: o.ladder.permissiveTitle,
    full: o.ladder.fullTitle,
  }
  const descs: Record<LevelKey, string> = {
    api: o.ladder.apiDesc,
    restricted: o.ladder.restrictedDesc,
    permissive: o.ladder.permissiveDesc,
    full: o.ladder.fullDesc,
  }
  const examples: Record<LevelKey, string> = {
    api: o.ladder.apiExamples,
    restricted: o.ladder.restrictedExamples,
    permissive: o.ladder.permissiveExamples,
    full: o.ladder.fullExamples,
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist">
        {LEVELS.map((l, i) => {
          const selected = l.key === active
          return (
            <button
              key={l.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(l.key)}
              className={`relative rounded-xl border p-3 text-left transition-colors ${
                selected ? `bg-background ${l.accent}` : 'border-border bg-surface/40 text-muted hover:text-text'
              }`}
            >
              <div className="mb-2 flex items-end gap-1" aria-hidden>
                {LEVELS.map((_, j) => (
                  <span
                    key={j}
                    className={`w-2 rounded-sm ${j <= i ? l.bar : 'bg-border'}`}
                    style={{ height: `${8 + j * 5}px` }}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{titles[l.key]}</span>
              {selected && (
                <motion.span
                  layoutId="openness-ladder-indicator"
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded bg-current"
                />
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4 rounded-xl border border-border bg-background/60 p-5"
        >
          <p className="text-muted leading-relaxed">{descs[active]}</p>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{o.youGet}</div>
            <div className="flex flex-wrap gap-2">
              {ARTIFACTS.map((a, i) => {
                const has = i < level.unlocked
                return (
                  <motion.span
                    key={a}
                    animate={{ opacity: has ? 1 : 0.45 }}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${
                      has ? 'border-emerald-500/30 bg-emerald-500/10 text-text' : 'border-border text-muted line-through'
                    }`}
                  >
                    {has ? <Check size={14} className="text-emerald-400" /> : <X size={14} />}
                    {o.artifacts[a]}
                  </motion.span>
                )
              })}
            </div>
          </div>
          <p className="text-sm">
            <span className="font-semibold text-text">{o.examplesLabel}: </span>
            <span className="text-muted">{examples[active]}</span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
