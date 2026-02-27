'use client'

import { useState, useMemo } from 'react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { models, gpuPresets, quantPresets, type ModelEntry, type GpuCategory } from '@/lib/models'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Cpu, Zap, Info, ChevronDown, MemoryStick } from 'lucide-react'
import Link from 'next/link'

// ── Derived data from shared models.ts ────────────────────────────────────────

const CTX_OPTIONS = [2048, 4096, 8192, 16384, 32768, 65536, 131072]
const GPU_TIERS = [8, 12, 16, 24, 32, 48, 80, 96, 128]

/** Models with param data → usable as presets in calculator */
const modelPresets = models.filter(m => m.totalParamsB != null)

/** GPU category labels */
const gpuCategoryLabels: Record<GpuCategory, string> = {
  'nvidia-consumer': 'NVIDIA Consumer',
  'nvidia-pro': 'NVIDIA Pro',
  'apple': 'Apple Silicon',
  'amd-apu': 'AMD APU',
  'datacenter': 'Datacenter',
}

const gpuCategoryOrder: GpuCategory[] = ['nvidia-consumer', 'nvidia-pro', 'apple', 'amd-apu', 'datacenter']

// ── Helpers ───────────────────────────────────────────────────────────────────

function estimateVram(
  totalParamsB: number,
  bitsPerParam: number,
  layers: number,
  dModel: number,
  ctxLen: number,
): number {
  const modelGB = (totalParamsB * 1e9 * bitsPerParam) / 8 / 1e9
  const kvCacheGB = (2 * layers * dModel * ctxLen * 2) / 1e9
  const overheadGB = 0.5
  return modelGB + kvCacheGB + overheadGB
}

function estimateSpeed(activeParamsB: number, bitsPerParam: number, bandwidthGBs: number): number {
  const modelSizeGB = (activeParamsB * 1e9 * bitsPerParam) / 8 / 1e9
  if (modelSizeGB === 0) return 0
  return bandwidthGBs / modelSizeGB
}

function speedLabel(tokS: number, t: Record<string, string>): { text: string; color: string } {
  if (tokS >= 30) return { text: t.speedFast, color: 'text-emerald-400' }
  if (tokS >= 15) return { text: t.speedGood, color: 'text-cyan-400' }
  if (tokS >= 5) return { text: t.speedUsable, color: 'text-yellow-400' }
  return { text: t.speedSlow, color: 'text-red-400' }
}

function fitColor(vramGB: number, gpuGB: number): string {
  const ratio = vramGB / gpuGB
  if (ratio <= 0.85) return 'bg-emerald-500'
  if (ratio <= 1.0) return 'bg-yellow-500'
  return 'bg-red-500'
}

function fitLabel(vramGB: number, gpuGB: number, t: Record<string, string>): { text: string; color: string } {
  const ratio = vramGB / gpuGB
  if (ratio <= 0.85) return { text: t.fits, color: 'text-emerald-400' }
  if (ratio <= 1.0) return { text: t.fitsTight, color: 'text-yellow-400' }
  return { text: t.doesNotFit, color: 'text-red-400' }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VramCalcPage() {
  const { t } = useTranslation()
  const vc = t.vramCalc

  // State
  const [totalParams, setTotalParams] = useState(7)
  const [activeParams, setActiveParams] = useState(7)
  const [isMoE, setIsMoE] = useState(false)
  const [quantIdx, setQuantIdx] = useState(4) // Q4_K_M default
  const [ctxLen, setCtxLen] = useState(8192)
  const [layers, setLayers] = useState(32)
  const [dModel, setDModel] = useState(4096)
  const [gpuIdx, setGpuIdx] = useState(5) // RTX 4090
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)

  const quant = quantPresets[quantIdx]
  const gpu = gpuPresets[gpuIdx]

  // Calculations
  const vramGB = useMemo(
    () => estimateVram(totalParams, quant.bitsPerParam, layers, dModel, ctxLen),
    [totalParams, quant.bitsPerParam, layers, dModel, ctxLen],
  )

  const tokPerSec = useMemo(
    () => estimateSpeed(activeParams, quant.bitsPerParam, gpu.bandwidthGBs),
    [activeParams, quant.bitsPerParam, gpu.bandwidthGBs],
  )

  const speed = speedLabel(tokPerSec, vc as unknown as Record<string, string>)
  const modelSizeGB = (totalParams * 1e9 * quant.bitsPerParam) / 8 / 1e9

  function applyPreset(model: ModelEntry) {
    setTotalParams(model.totalParamsB!)
    setActiveParams(model.activeParamsB ?? model.totalParamsB!)
    setIsMoE(!!model.isMoE)
    if (model.nLayers) setLayers(model.nLayers)
    if (model.dModel) setDModel(model.dModel)
    setSelectedModelId(model.id)
  }

  // Get display name from i18n tierList keys
  const tl = t.tierList as Record<string, string>
  function modelDisplayName(m: ModelEntry): string {
    return tl[m.nameKey] || m.id
  }

  return (
    <TopicLayout
      topicId="vram-calc"
      title={vc.title}
      description={vc.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: vc.title },
      ]}
      prevTopic={{ label: t.topicNames['local-inference'], href: '/ai/llm-inference/local-inference' }}
    >
      {/* ── Model Presets ──────────────────────────────────────── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{vc.presetsTitle}</h2>
        <p className="text-muted mb-5">{vc.presetsDesc}</p>
        <div className="flex flex-wrap gap-2">
          {modelPresets.map((m) => (
            <button
              key={m.id}
              onClick={() => applyPreset(m)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all
                ${selectedModelId === m.id
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'bg-surface border-border text-muted hover:border-violet-500/30 hover:text-text'
                }`}
            >
              {modelDisplayName(m)}
              {m.isMoE && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                  MoE
                </span>
              )}
              {m.params && (
                <span className="ml-1.5 text-[10px] opacity-50">{m.params}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── VRAM Calculator ───────────────────────────────────── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Calculator size={20} className="text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-gradient">{vc.calcTitle}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <div className="space-y-5">
            {/* Parameters */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">{vc.paramLabel}</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0.5}
                  max={2000}
                  step={0.5}
                  value={totalParams}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    if (!isNaN(v) && v > 0) {
                      setTotalParams(v)
                      if (!isMoE) setActiveParams(v)
                      setSelectedModelId(null)
                    }
                  }}
                  className="w-28 px-3 py-2 rounded-lg bg-background border border-border text-text text-center font-mono focus:border-violet-500/50 focus:outline-none"
                />
                <span className="text-muted text-sm">{vc.billion}</span>
              </div>
              {isMoE && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-fuchsia-400 mb-1">{vc.activeParamLabel}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0.5}
                      max={totalParams}
                      step={0.5}
                      value={activeParams}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value)
                        if (!isNaN(v) && v > 0) setActiveParams(v)
                      }}
                      className="w-28 px-3 py-2 rounded-lg bg-background border border-fuchsia-500/30 text-fuchsia-300 text-center font-mono focus:border-fuchsia-500/50 focus:outline-none"
                    />
                    <span className="text-muted text-sm">{vc.billion}</span>
                  </div>
                </div>
              )}
            </div>

            {/* MoE toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const next = !isMoE
                  setIsMoE(next)
                  if (!next) setActiveParams(totalParams)
                }}
                className={`relative w-11 h-6 rounded-full transition-colors ${isMoE ? 'bg-fuchsia-500' : 'bg-border'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isMoE ? 'translate-x-5' : ''}`}
                />
              </button>
              <span className="text-sm text-text">{vc.moeToggle}</span>
            </div>

            {/* Quantization */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">{vc.quantLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {quantPresets.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setQuantIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all
                      ${i === quantIdx
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                        : 'bg-surface border-border text-muted hover:border-purple-500/30 hover:text-text'
                      }`}
                  >
                    {q.label}
                    <span className="ml-1 text-[10px] opacity-60">{q.bitsPerParam}b</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Context Length */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">{vc.ctxLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {CTX_OPTIONS.map((ctx) => (
                  <button
                    key={ctx}
                    onClick={() => setCtxLen(ctx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all
                      ${ctx === ctxLen
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                        : 'bg-surface border-border text-muted hover:border-cyan-500/30 hover:text-text'
                      }`}
                  >
                    {ctx >= 1024 ? `${ctx / 1024}K` : ctx}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced: layers / d_model */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
              >
                <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                {vc.advanced}
              </button>
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-xs text-muted mb-1">{vc.layersLabel}</label>
                        <input
                          type="number"
                          min={1}
                          max={200}
                          value={layers}
                          onChange={(e) => setLayers(parseInt(e.target.value) || 32)}
                          className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-text text-sm font-mono focus:border-violet-500/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">{vc.dModelLabel}</label>
                        <input
                          type="number"
                          min={256}
                          max={32768}
                          step={256}
                          value={dModel}
                          onChange={(e) => setDModel(parseInt(e.target.value) || 4096)}
                          className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-text text-sm font-mono focus:border-violet-500/50 focus:outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-5">
            {/* VRAM Result */}
            <motion.div
              key={`${vramGB.toFixed(1)}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <MemoryStick size={16} className="text-violet-400" />
                <span className="text-sm font-medium text-violet-300">{vc.totalVram}</span>
              </div>
              <div className="text-4xl font-bold font-heading text-text mb-1">
                {vramGB.toFixed(1)} <span className="text-lg text-muted">GB</span>
              </div>
              <div className="text-xs text-muted space-y-0.5 mt-3 font-mono">
                <div>{vc.modelWeights}: {modelSizeGB.toFixed(1)} GB</div>
                <div>{vc.kvCache}: {((2 * layers * dModel * ctxLen * 2) / 1e9).toFixed(2)} GB</div>
                <div>{vc.overhead}: 0.50 GB</div>
              </div>
            </motion.div>

            {/* GPU Fit Chart */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-text">{vc.gpuFit}</span>
              {GPU_TIERS.map((gpuGB) => {
                const fit = fitLabel(vramGB, gpuGB, vc as unknown as Record<string, string>)
                const barWidth = Math.min((vramGB / gpuGB) * 100, 100)
                return (
                  <div key={gpuGB} className="flex items-center gap-3">
                    <span className="text-xs text-muted font-mono w-14 text-right">{gpuGB} GB</span>
                    <div className="flex-1 h-5 rounded-full bg-background/80 border border-border overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${fitColor(vramGB, gpuGB)} opacity-60`}
                      />
                    </div>
                    <span className={`text-[10px] font-medium w-16 ${fit.color}`}>{fit.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Speed Estimator ───────────────────────────────────── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Zap size={20} className="text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-gradient">{vc.speedTitle}</h2>
        </div>

        {/* GPU Select — grouped by category */}
        <div className="mb-6 space-y-4">
          <label className="block text-sm font-medium text-text">{vc.gpuLabel}</label>
          {gpuCategoryOrder.map((cat) => {
            const catGpus = gpuPresets.filter(g => g.category === cat)
            if (catGpus.length === 0) return null
            return (
              <div key={cat}>
                <span className="text-[10px] text-muted uppercase tracking-wider font-medium">{gpuCategoryLabels[cat]}</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {catGpus.map((g) => {
                    const idx = gpuPresets.indexOf(g)
                    return (
                      <button
                        key={g.name}
                        onClick={() => setGpuIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                          ${idx === gpuIdx
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                            : 'bg-surface border-border text-muted hover:border-cyan-500/30 hover:text-text'
                          }`}
                      >
                        {g.name}
                        <span className="ml-1 text-[10px] opacity-50">{g.vramGB}GB</span>
                        <span className="ml-1 text-[10px] opacity-40">{g.bandwidthGBs}GB/s</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Speed Result */}
        <motion.div
          key={`${tokPerSec.toFixed(0)}-${gpu.name}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">{vc.estimatedSpeed}</span>
              {gpu.note && <span className="text-[10px] text-muted px-1.5 py-0.5 rounded bg-surface border border-border">{gpu.note}</span>}
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
              tokPerSec >= 30 ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
              tokPerSec >= 15 ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' :
              tokPerSec >= 5 ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' :
              'bg-red-500/15 border-red-500/30 text-red-400'
            }`}>
              {speed.text}
            </span>
          </div>
          <div className="text-4xl font-bold font-heading text-text">
            ~{tokPerSec.toFixed(0)} <span className="text-lg text-muted">tok/s</span>
          </div>
          {isMoE && (
            <p className="text-xs text-fuchsia-400 mt-2">
              {vc.moeNote}
            </p>
          )}
          <p className="text-xs text-muted mt-2 font-mono">
            {gpu.bandwidthGBs} GB/s &divide; {((activeParams * 1e9 * quant.bitsPerParam) / 8 / 1e9).toFixed(1)} GB = ~{tokPerSec.toFixed(0)} tok/s
          </p>

          {/* Will it fit? */}
          {vramGB > gpu.vramGB && (
            <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {vc.wontFitWarning.replace('{vram}', vramGB.toFixed(1)).replace('{gpu}', gpu.vramGB.toString())}
            </div>
          )}
        </motion.div>

        {/* Speed Scale */}
        <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[10px]">
          <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/20">
            <div className="text-red-400 font-bold">&lt;5 tok/s</div>
            <div className="text-muted">{vc.speedSlow}</div>
          </div>
          <div className="p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <div className="text-yellow-400 font-bold">5–15</div>
            <div className="text-muted">{vc.speedUsable}</div>
          </div>
          <div className="p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
            <div className="text-cyan-400 font-bold">15–30</div>
            <div className="text-muted">{vc.speedGood}</div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <div className="text-emerald-400 font-bold">&gt;30</div>
            <div className="text-muted">{vc.speedFast}</div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Info size={20} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-gradient">{vc.howTitle}</h2>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-violet-500/5 border border-violet-500/20">
            <h3 className="text-violet-400 font-semibold font-heading mb-3">{vc.formulaVramTitle}</h3>
            <div className="font-mono text-sm text-text bg-background/60 p-4 rounded-lg mb-3 overflow-x-auto">
              VRAM &asymp; (params &times; bits_per_param / 8) + KV_cache + 0.5 GB
            </div>
            <p className="text-muted text-sm leading-relaxed">{vc.formulaVramDesc}</p>
          </div>

          <div className="p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <h3 className="text-cyan-400 font-semibold font-heading mb-3">{vc.formulaKvTitle}</h3>
            <div className="font-mono text-sm text-text bg-background/60 p-4 rounded-lg mb-3 overflow-x-auto">
              KV_cache &asymp; 2 &times; n_layers &times; d_model &times; ctx_len &times; 2 bytes
            </div>
            <p className="text-muted text-sm leading-relaxed">{vc.formulaKvDesc}</p>
          </div>

          <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-emerald-400 font-semibold font-heading mb-3">{vc.formulaSpeedTitle}</h3>
            <div className="font-mono text-sm text-text bg-background/60 p-4 rounded-lg mb-3 overflow-x-auto">
              tok/s &asymp; memory_bandwidth / model_size_in_ram
            </div>
            <p className="text-muted text-sm leading-relaxed">{vc.formulaSpeedDesc}</p>
          </div>
        </div>
      </section>

      {/* ── Caveats ───────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{vc.caveatsTitle}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[vc.caveat1, vc.caveat2, vc.caveat3, vc.caveat4, vc.caveat5].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary-light text-sm font-bold">{i + 1}</span>
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Cross-links ───────────────────────────────────────── */}
      <section className="grid sm:grid-cols-2 gap-4">
        <Link href="/ai/llm/quantization" className="block p-5 rounded-xl bg-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
          <h3 className="text-purple-400 font-semibold font-heading mb-1 group-hover:text-purple-300">{t.topicNames['quantization']} &rarr;</h3>
          <p className="text-muted text-sm">{vc.linkQuant}</p>
        </Link>
        <Link href="/ai/llm-inference/local-inference" className="block p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group">
          <h3 className="text-cyan-400 font-semibold font-heading mb-1 group-hover:text-cyan-300">{t.topicNames['local-inference']} &rarr;</h3>
          <p className="text-muted text-sm">{vc.linkLocal}</p>
        </Link>
      </section>
    </TopicLayout>
  )
}
