'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from '@/lib/i18n/context'

// ── Types ─────────────────────────────────────────────────────────────
interface LoraVisualizerProps {
  section: 'matrix' | 'memory' | 'rank-quality' | 'variants'
  t: Record<string, string>
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
}

// ── 1. Matrix Decomposition ───────────────────────────────────────────
const RANKS = [1, 2, 4, 8, 16, 32, 64]
const D = 512

function MatrixSection({ t }: { t: Record<string, string> }) {
  const [rankIdx, setRankIdx] = useState(3) // default r=8
  const r = RANKS[rankIdx]
  const fullParams = D * D
  const loraParams = 2 * D * r
  const pct = ((loraParams / fullParams) * 100).toFixed(1)
  const savings = ((1 - loraParams / fullParams) * 100).toFixed(1)

  // Visual scaling: matrix display
  const fullSize = 120 // px for full matrix visual
  const aWidth = Math.max(8, (r / D) * fullSize)
  const bHeight = Math.max(8, (r / D) * fullSize)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{t.matrixTitle}</h3>
        <p className="text-muted text-sm max-w-2xl mx-auto">{t.matrixDesc}</p>
      </div>

      {/* Slider */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-sm text-muted font-medium">
          {t.rankLabel}: <span className="font-bold text-cyan-400">r = {r}</span>
          <span className="text-muted ml-2">({D}×{D} {t.matrix})</span>
        </label>
        <input
          type="range" min={0} max={RANKS.length - 1} value={rankIdx}
          onChange={e => setRankIdx(Number(e.target.value))}
          className="w-full max-w-md accent-cyan-400"
        />
        <div className="flex justify-between w-full max-w-md text-xs text-muted">
          <span>r=1</span><span>r=64</span>
        </div>
      </div>

      {/* Visual decomposition */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
        {/* Full matrix W */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="rounded-lg border-2 border-purple-500/50 bg-purple-500/20"
            style={{ width: fullSize, height: fullSize }}
            initial={false}
            animate={{ opacity: 1 }}
          >
            <div className="w-full h-full flex items-center justify-center text-purple-400 font-mono text-sm font-bold">
              ΔW
            </div>
          </motion.div>
          <span className="text-xs text-muted">{D}×{D}</span>
          <span className="text-xs text-purple-400 font-mono">{fullParams.toLocaleString()} {t.params}</span>
        </div>

        <span className="text-2xl text-muted font-bold">=</span>

        {/* Matrix A */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="rounded-lg border-2 border-cyan-500/50 bg-cyan-500/20 flex items-center justify-center"
            initial={false}
            animate={{ width: aWidth, height: fullSize }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <span className="text-cyan-400 font-mono text-sm font-bold">A</span>
          </motion.div>
          <span className="text-xs text-muted">{D}×{r}</span>
        </div>

        <span className="text-xl text-muted font-bold">×</span>

        {/* Matrix B */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="rounded-lg border-2 border-cyan-500/50 bg-cyan-500/20 flex items-center justify-center"
            initial={false}
            animate={{ width: fullSize, height: bHeight }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <span className="text-cyan-400 font-mono text-sm font-bold">B</span>
          </motion.div>
          <span className="text-xs text-muted">{r}×{D}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
          <div className="text-sm text-muted mb-1">{t.fullParams}</div>
          <div className="text-2xl font-bold font-mono text-purple-400">{fullParams.toLocaleString()}</div>
          <div className="text-xs text-muted mt-1">d² = {D}²</div>
        </div>
        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-center">
          <div className="text-sm text-muted mb-1">{t.loraParams}</div>
          <motion.div
            key={r}
            className="text-2xl font-bold font-mono text-cyan-400"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {loraParams.toLocaleString()}
          </motion.div>
          <div className="text-xs text-muted mt-1">2 × d × r = 2 × {D} × {r}</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
          <div className="text-sm text-muted mb-1">{t.savings}</div>
          <motion.div
            key={r}
            className="text-2xl font-bold font-mono text-emerald-400"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {savings}%
          </motion.div>
          <div className="text-xs text-muted mt-1">{t.onlyPct.replace('{pct}', pct)}</div>
        </div>
      </div>

      {/* Math formula */}
      <div className="p-4 rounded-xl bg-surface border border-border text-center">
        <div className="font-mono text-sm text-muted">
          params<sub>full</sub> = d² = {D}² = {fullParams.toLocaleString()}
        </div>
        <div className="font-mono text-sm text-cyan-400 mt-1">
          params<sub>LoRA</sub> = 2 × d × r = 2 × {D} × {r} = {loraParams.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

function MemorySection({ t }: { t: Record<string, string> }) {
  const { locale } = useLocale()
  const de = locale === 'de'
  const [rank, setRank] = useState(16)
  const [bits, setBits] = useState(16)
  // Explicit example: 7B frozen parameters, 64 square 4096×4096 target matrices.
  const adapterParams = 64 * rank * (4096 + 4096)
  const baseGB = 7 * bits / 8
  const adapterGB = adapterParams * 2 / 1e9
  const gradientGB = adapterParams * 2 / 1e9
  const adamGB = adapterParams * 8 / 1e9
  return <div className="space-y-5">
    <h3 className="text-xl font-semibold">{de ? 'Parameter und Speicher nachrechnen' : 'Count parameters and storage'}</h3>
    <p className="text-sm text-muted">{de ? 'Beispielkonfiguration: 7 Milliarden eingefrorene Parameter und 64 Zielmatrizen mit je 4096 × 4096 Einträgen. Adapter und Gradienten sind FP16, zwei Adam-Zustände FP32. Dies ist eine offengelegte Rechenannahme, keine Hardwareempfehlung.' : 'Example configuration: 7 billion frozen parameters and 64 target matrices of 4096 × 4096 entries each. Adapter weights and gradients are FP16; the two Adam states are FP32. These are explicit accounting assumptions, not a hardware recommendation.'}</p>
    <label className="block text-sm">{t.rankLabel}: {rank}<input type="range" min={1} max={128} value={rank} onChange={e => setRank(Number(e.target.value))} className="mt-2 block w-full" /></label>
    <label className="block text-sm">{de ? 'Basispräzision' : 'Base precision'}<select className="mt-2 block w-full rounded-lg border border-border bg-background p-2" value={bits} onChange={e => setBits(Number(e.target.value))}><option value={16}>LoRA · FP16</option><option value={4}>QLoRA · 4-bit</option></select></label>
    <p className="font-mono text-sm">64 × r × (4096 + 4096) = {adapterParams.toLocaleString(locale)}</p>
    <dl className="grid grid-cols-2 gap-3 text-sm">{[
      [de ? 'Basisgewichte, roh' : 'Raw base weights', baseGB],
      [de ? 'Adaptergewichte' : 'Adapter weights', adapterGB],
      [de ? 'Adaptergradienten' : 'Adapter gradients', gradientGB],
      [de ? 'Adam-Zustände' : 'Adam states', adamGB],
    ].map(([name, value]) => <div key={String(name)} className="rounded-lg border border-border p-3"><dt className="text-muted">{String(name)}</dt><dd className="mt-1 font-mono text-cyan-300">{Number(value).toFixed(3)} GB</dd></div>)}</dl>
    <p className="text-sm text-muted">{de ? 'Dezimale GB. Nicht enthalten: Aktivierungen, temporäre Puffer, Quantisierungsskalen und gegebenenfalls FP32-Mastergewichte. Batchgröße, Kontextlänge, Zielmodule und Optimizer verändern den tatsächlichen Trainingsspeicher. QLoRA quantisiert die eingefrorene Basis; LoRA allein verlangt keine quantisierte Basis.' : 'Decimal GB. Excludes activations, temporary buffers, quantization scales and any FP32 master weights. Batch size, context length, target modules and optimizer change actual training memory. QLoRA quantizes the frozen base; LoRA itself does not require a quantized base.'}</p>
  </div>
}

function RankQualitySection() {
  const { locale } = useLocale()
  const de = locale === 'de'
  const [rank, setRank] = useState(2)
  const singular = [4, 2, 1, 0.5]
  const residual = Math.sqrt(singular.slice(rank).reduce((sum, value) => sum + value ** 2, 0))
  return <div className="space-y-5">
    <h3 className="text-xl font-semibold">{de ? 'Was ein Ranglimit mathematisch bedeutet' : 'What a rank limit means mathematically'}</h3>
    <p className="text-sm text-muted">{de ? 'Eine konstruierte Zielmatrix diag(4, 2, 1, 0,5). Die beste Rang-r-Näherung in Frobeniusnorm behält hier die r größten Diagonaleinträge. Wir messen einen Matrixfehler, keine Sprachfähigkeit und keinen Wissenserhalt.' : 'A constructed target matrix diag(4, 2, 1, 0.5). Its best rank-r approximation in Frobenius norm keeps the r largest diagonal entries. We measure a matrix error, not language ability or knowledge retention.'}</p>
    <label className="block text-sm">r = {rank}<input className="mt-2 block w-full" type="range" min={1} max={4} value={rank} onChange={e => setRank(Number(e.target.value))} /></label>
    <div className="grid grid-cols-4 gap-2">{singular.map((value, i) => <div key={i} className={`rounded-lg border p-3 text-center font-mono ${i < rank ? 'border-cyan-500/40 text-cyan-300' : 'border-border text-muted'}`}>{value} → {i < rank ? value : 0}</div>)}</div>
    <p className="font-mono text-sm">‖ΔW − B A‖F = √Σᵢ₎ᵣ σᵢ² = {residual.toFixed(3)}</p>
    <p className="text-sm text-muted">{de ? 'LoRA lernt A und B durch Training; es kennt die optimale Zielmatrix nicht vorher. Ein größerer Rang erlaubt mehr unabhängige Update-Richtungen, garantiert aber keine bessere Evaluation. Daten, Zielmodule und Training müssen mitgeprüft werden.' : 'LoRA learns A and B during training; it does not know an optimal target matrix in advance. Higher rank permits more independent update directions, but does not guarantee better evaluation results. Data, target modules and training must be evaluated too.'}</p>
  </div>
}

// ── 4. Variants ───────────────────────────────────────────────────────
function VariantsSection({ t }: { t: Record<string, string> }) {
  const variants = [
    {
      id: 'qlora',
      name: 'QLoRA',
      color: 'emerald',
      icon: '📦',
      title: t.qloraTitle,
      desc: t.qloraDesc,
      detail: t.qloraDetail,
    },
    {
      id: 'dora',
      name: 'DoRA',
      color: 'purple',
      icon: '🔬',
      title: t.doraTitle,
      desc: t.doraDesc,
      detail: t.doraDetail,
    },
    {
      id: 'loraplus',
      name: 'LoRA+',
      color: 'cyan',
      icon: '⚡',
      title: t.loraPlusTitle,
      desc: t.loraPlusDesc,
      detail: t.loraPlusDetail,
    },
  ]

  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{t.variantsTitle}</h3>
        <p className="text-muted text-sm max-w-2xl mx-auto">{t.variantsDesc}</p>
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
                  <motion.span
                    className="text-muted text-sm"
                    animate={{ rotate: expanded === v.id ? 180 : 0 }}
                  >
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
                      <p className="text-text text-sm mt-3 pt-3 border-t border-border leading-relaxed">
                        {v.detail}
                      </p>
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
export function LoraVisualizer({ section, t }: LoraVisualizerProps) {
  switch (section) {
    case 'matrix':
      return <MatrixSection t={t} />
    case 'memory':
      return <MemorySection t={t} />
    case 'rank-quality':
      return <RankQualitySection />
    case 'variants':
      return <VariantsSection t={t} />
    default:
      return null
  }
}
