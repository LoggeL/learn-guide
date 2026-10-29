'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

// ── Types ─────────────────────────────────────────────────────────────
interface LoraVisualizerProps {
  section: 'matrix' | 'memory' | 'rank-quality' | 'variants'
}

// Literal class lookups — Tailwind cannot see runtime-constructed class names
const accentClasses: Record<string, { card: string; cardHover: string; text: string }> = {
  cyan: {
    card: 'bg-cyan-500/5 border border-cyan-500/20',
    cardHover: 'hover:bg-cyan-500/10',
    text: 'text-cyan-400',
  },
  emerald: {
    card: 'bg-emerald-500/5 border border-emerald-500/20',
    cardHover: 'hover:bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  purple: {
    card: 'bg-purple-500/5 border border-purple-500/20',
    cardHover: 'hover:bg-purple-500/10',
    text: 'text-purple-400',
  },
  orange: {
    card: 'bg-orange-500/5 border border-orange-500/20',
    cardHover: 'hover:bg-orange-500/10',
    text: 'text-orange-400',
  },
}

// ── 1. Matrix Decomposition ───────────────────────────────────────────
const RANKS = [1, 2, 4, 8, 16, 32, 64]
// One 4096 × 4096 projection, the hidden size of a 7B Llama-style model.
const D = 4096
const K = 4096

function MatrixSection() {
  const { t, locale } = useTranslation()
  const c = t.lora
  const [rankIdx, setRankIdx] = useState(3) // default r=8
  const r = RANKS[rankIdx]
  const fullParams = D * K
  const loraParams = r * (D + K)
  const pct = ((loraParams / fullParams) * 100).toLocaleString(locale, { maximumFractionDigits: 2 })
  const factor = Math.round(fullParams / loraParams).toLocaleString(locale)

  // Visual scaling: thin dimension drawn to scale, with a minimum so it stays visible
  const fullSize = 120
  const thin = Math.max(3, (r / D) * fullSize)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{c.matrixTitle}</h3>
        <p className="text-muted text-sm max-w-2xl mx-auto">{c.matrixDesc}</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <label htmlFor="lora-matrix-rank" className="text-sm text-muted font-medium">
          {c.rankLabel}: <span className="font-bold text-cyan-400">r = {r}</span>
          <span className="text-muted ml-2">({c.matrixShape.replace('{d}', String(D)).replace('{k}', String(K))})</span>
        </label>
        <input
          id="lora-matrix-rank"
          type="range" min={0} max={RANKS.length - 1} value={rankIdx}
          onChange={e => setRankIdx(Number(e.target.value))}
          className="w-full max-w-md accent-cyan-400"
        />
        <div className="flex justify-between w-full max-w-md text-xs text-muted">
          <span>r = 1</span><span>r = 64</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
        <div className="flex flex-col items-center gap-2">
          <div
            className="rounded-lg border-2 border-purple-500/50 bg-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-sm font-bold"
            style={{ width: fullSize, height: fullSize }}
          >
            ΔW
          </div>
          <span className="text-xs text-muted">d × k = {D} × {K}</span>
        </div>

        <span className="text-2xl text-muted font-bold">=</span>
        <span className="text-sm text-muted font-mono">(α/r) ·</span>

        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="rounded-sm border border-cyan-500/60 bg-cyan-500/40"
            initial={false}
            animate={{ width: thin, height: fullSize }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
          <span className="text-cyan-400 font-mono text-sm font-bold">B</span>
          <span className="text-xs text-muted">{D} × {r}</span>
        </div>

        <span className="text-xl text-muted font-bold">·</span>

        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="rounded-sm border border-emerald-500/60 bg-emerald-500/40"
            initial={false}
            animate={{ width: fullSize, height: thin }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
          <span className="text-emerald-400 font-mono text-sm font-bold">A</span>
          <span className="text-xs text-muted">{r} × {K}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
          <div className="text-sm text-muted mb-1">{c.fullParams}</div>
          <div className="text-2xl font-bold font-mono text-purple-400">{fullParams.toLocaleString(locale)}</div>
          <div className="text-xs text-muted mt-1">{D} × {K}</div>
        </div>
        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-center">
          <div className="text-sm text-muted mb-1">{c.loraParams}</div>
          <motion.div key={r} className="text-2xl font-bold font-mono text-cyan-400" initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
            {loraParams.toLocaleString(locale)}
          </motion.div>
          <div className="text-xs text-muted mt-1">{r} × ({D} + {K})</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
          <div className="text-sm text-muted mb-1">{c.savings}</div>
          <motion.div key={`f-${r}`} className="text-2xl font-bold font-mono text-emerald-400" initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
            {factor}×
          </motion.div>
          <div className="text-xs text-muted mt-1">{c.onlyPct.replace('{pct}', pct)}</div>
        </div>
      </div>
    </div>
  )
}

// ── 2. Memory accounting ──────────────────────────────────────────────
const BASE_PARAMS = 7e9
const TARGET_MATRICES = 64 // W_q and W_v in each of 32 layers

function MemorySection() {
  const { t, locale } = useTranslation()
  const c = t.lora
  const [rank, setRank] = useState(16)
  const [bits, setBits] = useState(16)
  const adapterParams = TARGET_MATRICES * rank * (4096 + 4096)
  const baseGB = BASE_PARAMS * bits / 8 / 1e9
  const adapterGB = adapterParams * 2 / 1e9
  const gradientGB = adapterParams * 2 / 1e9
  const adamGB = adapterParams * 8 / 1e9
  const loraTotal = baseGB + adapterGB + gradientGB + adamGB
  const fullGB = BASE_PARAMS * 16 / 1e9
  const fmt = (value: number) => value.toLocaleString(locale, { minimumFractionDigits: value < 1 ? 3 : 1, maximumFractionDigits: value < 1 ? 3 : 1 })
  const rows: [string, number][] = [
    [c.memBase, baseGB],
    [c.memAdapter, adapterGB],
    [c.memGrad, gradientGB],
    [c.memAdam, adamGB],
  ]
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{c.memTitle}</h3>
        <p className="text-sm text-muted">{c.memDesc}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-muted">
          {c.rankLabel}: <span className="font-mono text-cyan-400">r = {rank}</span>
          <input type="range" min={1} max={128} value={rank} onChange={e => setRank(Number(e.target.value))} className="mt-2 block w-full accent-cyan-400" />
        </label>
        <label className="block text-sm text-muted">
          {c.memBasePrecision}
          <select className="mt-2 block w-full rounded-lg border border-border bg-background p-2 text-text" value={bits} onChange={e => setBits(Number(e.target.value))}>
            <option value={16}>{c.memOptFull}</option>
            <option value={4}>{c.memOptQ}</option>
          </select>
        </label>
      </div>
      <p className="font-mono text-sm text-muted">{TARGET_MATRICES} × r × (4096 + 4096) = {adapterParams.toLocaleString(locale)} {c.params}</p>
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {rows.map(([name, value]) => (
          <div key={name} className="rounded-lg border border-border bg-surface p-3">
            <dt className="text-muted">{name}</dt>
            <dd className="mt-1 font-mono text-cyan-300">{fmt(value)} GB</dd>
          </div>
        ))}
      </dl>
      <div className="space-y-3">
        {[
          { label: c.memTotal, value: loraTotal, bar: 'bg-cyan-400' },
          { label: c.memFullFt, value: fullGB, bar: 'bg-purple-400' },
        ].map(item => (
          <div key={item.label}>
            <div className="flex justify-between text-sm">
              <span className="text-muted">{item.label}</span>
              <span className="font-mono text-text">{fmt(item.value)} GB</span>
            </div>
            <div className="mt-1 h-2 rounded bg-background">
              <motion.div className={`h-2 rounded ${item.bar}`} initial={false} animate={{ width: `${(item.value / fullGB) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted">{c.memNote}</p>
    </div>
  )
}

// ── 3. Rank limit ─────────────────────────────────────────────────────
const SINGULAR = [4, 2, 1, 0.5]

function RankQualitySection() {
  const { t, locale } = useTranslation()
  const c = t.lora
  const [rank, setRank] = useState(2)
  const residual = Math.sqrt(SINGULAR.slice(rank).reduce((sum, value) => sum + value ** 2, 0))
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{c.rqTitle}</h3>
        <p className="text-sm text-muted">{c.rqDesc}</p>
      </div>
      <label className="block text-sm text-muted">
        <span className="font-mono text-cyan-400">r = {rank}</span>
        <input className="mt-2 block w-full accent-cyan-400" type="range" min={1} max={4} value={rank} onChange={e => setRank(Number(e.target.value))} />
      </label>
      <div className="grid grid-cols-4 gap-2">
        {SINGULAR.map((value, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i < rank ? 1 : 0.45 }}
            className={`rounded-lg border p-3 text-center font-mono text-sm ${i < rank ? 'border-cyan-500/40 text-cyan-300' : 'border-border text-muted'}`}
          >
            σ{i + 1} = {value.toLocaleString(locale)} → {(i < rank ? value : 0).toLocaleString(locale)}
          </motion.div>
        ))}
      </div>
      <p className="font-mono text-sm text-text">{c.rqResidual} = √(Σ<sub>i&gt;r</sub> σᵢ²) = {residual.toLocaleString(locale, { maximumFractionDigits: 3 })}</p>
      <p className="text-sm text-muted">{c.rqNote}</p>
    </div>
  )
}

// ── 4. Variants ───────────────────────────────────────────────────────
function VariantsSection() {
  const { t } = useTranslation()
  const c = t.lora
  const variants = [
    { id: 'qlora', color: 'emerald', icon: '📦', title: c.qloraTitle, desc: c.qloraDesc, detail: c.qloraDetail },
    { id: 'dora', color: 'purple', icon: '🔬', title: c.doraTitle, desc: c.doraDesc, detail: c.doraDetail },
    { id: 'loraplus', color: 'cyan', icon: '⚡', title: c.loraPlusTitle, desc: c.loraPlusDesc, detail: c.loraPlusDetail },
    { id: 'rslora', color: 'orange', icon: '📐', title: c.rsloraTitle, desc: c.rsloraDesc, detail: c.rsloraDetail },
  ]

  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{c.variantsTitle}</h3>
        <p className="text-muted text-sm max-w-2xl mx-auto">{c.variantsDesc}</p>
      </div>

      <div className="grid gap-4">
        {variants.map((v) => (
          <motion.div
            key={v.id}
            className={`p-5 rounded-xl ${accentClasses[v.color].card} cursor-pointer transition-all ${accentClasses[v.color].cardHover}`}
            onClick={() => setExpanded(expanded === v.id ? null : v.id)}
            layout
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{v.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-lg font-bold ${accentClasses[v.color].text}`}>{v.title}</h4>
                  <motion.span className="text-muted text-sm" animate={{ rotate: expanded === v.id ? 180 : 0 }}>
                    ▼
                  </motion.span>
                </div>
                <p className="text-muted text-sm mt-1">{v.desc}</p>
                <AnimatePresence>
                  {expanded === v.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-text text-sm mt-3 pt-3 border-t border-border leading-relaxed">{v.detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Main Export ────────────────────────────────────────────────────────
export function LoraVisualizer({ section }: LoraVisualizerProps) {
  switch (section) {
    case 'matrix':
      return <MatrixSection />
    case 'memory':
      return <MemorySection />
    case 'rank-quality':
      return <RankQualitySection />
    case 'variants':
      return <VariantsSection />
    default:
      return null
  }
}
