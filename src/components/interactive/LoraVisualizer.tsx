'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────
interface LoraVisualizerProps {
  section: 'matrix' | 'memory' | 'rank-quality' | 'variants'
  t: Record<string, string>
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

// ── 2. Memory Comparison ──────────────────────────────────────────────
interface ModelConfig {
  name: string
  params: string
  fullVram: number
  loraVram: number
  fullStorage: number
  loraStorage: number
}

const MODELS: ModelConfig[] = [
  { name: '7B', params: '7B', fullVram: 28, loraVram: 8, fullStorage: 28, loraStorage: 0.05 },
  { name: '13B', params: '13B', fullVram: 52, loraVram: 14, fullStorage: 52, loraStorage: 0.08 },
  { name: '70B', params: '70B', fullVram: 280, loraVram: 48, fullStorage: 280, loraStorage: 0.2 },
]

function MemorySection({ t }: { t: Record<string, string> }) {
  const [modelIdx, setModelIdx] = useState(0)
  const model = MODELS[modelIdx]
  const maxVram = 300

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{t.memoryTitle}</h3>
        <p className="text-muted text-sm max-w-2xl mx-auto">{t.memoryDesc}</p>
      </div>

      {/* Model selector */}
      <div className="flex justify-center gap-3">
        {MODELS.map((m, i) => (
          <button
            key={m.name}
            onClick={() => setModelIdx(i)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              i === modelIdx
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                : 'bg-surface border border-border text-muted hover:text-text'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* VRAM comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
          <div className="text-sm text-muted mb-1">{t.fullFineTune}</div>
          <div className="text-3xl font-bold font-mono text-purple-400">
            {model.fullVram} GB
          </div>
          <div className="mt-3 h-4 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
              initial={false}
              animate={{ width: `${(model.fullVram / maxVram) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="text-xs text-muted mt-2">{t.vramNeeded}</div>
        </div>

        <div className="p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <div className="text-sm text-muted mb-1">{t.loraFineTune}</div>
          <div className="text-3xl font-bold font-mono text-cyan-400">
            {model.loraVram} GB
          </div>
          <div className="mt-3 h-4 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={false}
              animate={{ width: `${(model.loraVram / maxVram) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="text-xs text-muted mt-2">{t.vramNeeded}</div>
        </div>
      </div>

      {/* Storage comparison */}
      <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
        <div className="text-sm text-muted mb-3">{t.adapterStorage}</div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-purple-400">{t.fullModel}</span>
              <span className="text-purple-400 font-mono">{model.fullStorage} GB</span>
            </div>
            <div className="h-6 rounded-full bg-surface overflow-hidden border border-border">
              <motion.div
                className="h-full rounded-full bg-purple-500/40"
                initial={false}
                animate={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-emerald-400">{t.loraAdapter}</span>
              <span className="text-emerald-400 font-mono">{model.loraStorage} GB</span>
            </div>
            <div className="h-6 rounded-full bg-surface overflow-hidden border border-border">
              <motion.div
                className="h-full rounded-full bg-emerald-500/40"
                initial={false}
                animate={{ width: `${(model.loraStorage / model.fullStorage) * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-emerald-400 mt-3">{t.storageSavings.replace('{x}', Math.round(model.fullStorage / model.loraStorage).toLocaleString())}</p>
      </div>

      {/* Key advantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '💾', title: t.memoryBenefit, desc: t.memoryBenefitDesc, color: 'cyan' },
          { icon: '⚡', title: t.speedBenefit, desc: t.speedBenefitDesc, color: 'emerald' },
          { icon: '🔀', title: t.swapBenefit, desc: t.swapBenefitDesc, color: 'purple' },
        ].map((item) => (
          <div key={item.title} className={`p-4 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
            <span className="text-2xl">{item.icon}</span>
            <h4 className={`text-${item.color}-400 font-semibold mt-2 mb-1`}>{item.title}</h4>
            <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 3. Rank vs Quality ────────────────────────────────────────────────
function RankQualitySection({ t }: { t: Record<string, string> }) {
  const [rankIdx, setRankIdx] = useState(3)
  const ranks = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
  const r = ranks[rankIdx]

  // Simulated reconstruction quality (logarithmic curve)
  const quality = Math.min(100, 20 * Math.log2(r + 1))
  const taskAdaptation = Math.min(100, 30 * Math.log2(r + 1)) // saturates faster
  const generalKnowledge = Math.min(100, 8 * Math.log2(r + 1)) // much lower ceiling with low rank

  const isOverkill = r >= 256

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{t.rankQualityTitle}</h3>
        <p className="text-muted text-sm max-w-2xl mx-auto">{t.rankQualityDesc}</p>
      </div>

      {/* Slider */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-sm text-muted font-medium">
          {t.rankLabel}: <span className={`font-bold ${isOverkill ? 'text-orange-400' : 'text-cyan-400'}`}>r = {r}</span>
        </label>
        <input
          type="range" min={0} max={ranks.length - 1} value={rankIdx}
          onChange={e => setRankIdx(Number(e.target.value))}
          className="w-full max-w-md accent-cyan-400"
        />
        <div className="flex justify-between w-full max-w-md text-xs text-muted">
          <span>r=1</span><span>r=512</span>
        </div>
      </div>

      {/* Quality bars */}
      <div className="space-y-4">
        <div className="p-5 rounded-xl bg-surface border border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-emerald-400 font-semibold">{t.taskSpecific}</span>
            <span className="text-emerald-400 font-mono">{taskAdaptation.toFixed(0)}%</span>
          </div>
          <div className="h-5 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              initial={false}
              animate={{ width: `${taskAdaptation}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <p className="text-xs text-muted mt-1">{t.taskSpecificHint}</p>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-purple-400 font-semibold">{t.generalKnowledge}</span>
            <span className="text-purple-400 font-mono">{generalKnowledge.toFixed(0)}%</span>
          </div>
          <div className="h-5 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={false}
              animate={{ width: `${generalKnowledge}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <p className="text-xs text-muted mt-1">{t.generalKnowledgeHint}</p>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-cyan-400 font-semibold">{t.reconstructionQuality}</span>
            <span className="text-cyan-400 font-mono">{quality.toFixed(0)}%</span>
          </div>
          <div className="h-5 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={false}
              animate={{ width: `${quality}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <p className="text-xs text-muted mt-1">{t.reconstructionHint}</p>
        </div>
      </div>

      {/* Insight box */}
      <AnimatePresence mode="wait">
        {isOverkill ? (
          <motion.div
            key="overkill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30"
          >
            <p className="text-sm text-orange-400">
              <span className="font-bold">⚠️ {t.overkillTitle}</span> {t.overkillDesc}
            </p>
          </motion.div>
        ) : r <= 4 ? (
          <motion.div
            key="lowrank"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30"
          >
            <p className="text-sm text-cyan-400">
              <span className="font-bold">💡 {t.sweetSpotTitle}</span> {t.lowRankDesc}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="sweetspot"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
          >
            <p className="text-sm text-emerald-400">
              <span className="font-bold">✅ {t.sweetSpotTitle}</span> {t.sweetSpotDesc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
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
            className={`p-5 rounded-xl bg-${v.color}-500/5 border border-${v.color}-500/20 cursor-pointer transition-all hover:bg-${v.color}-500/10`}
            onClick={() => setExpanded(expanded === v.id ? null : v.id)}
            layout
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{v.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-lg font-bold text-${v.color}-400`}>{v.title}</h4>
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
      return <RankQualitySection t={t} />
    case 'variants':
      return <VariantsSection t={t} />
    default:
      return null
  }
}
