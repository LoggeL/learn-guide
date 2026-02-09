'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TransformerVisualizerProps {
  section: 'layers' | 'encoder-decoder' | 'dataflow'
  t: Record<string, string>
}

// ── 1. Layer Stack Explorer ───────────────────────────────────────────

const LAYERS = [
  { id: 'input-embedding', color: 'purple' },
  { id: 'positional-encoding', color: 'pink' },
  { id: 'multi-head-attention', color: 'cyan' },
  { id: 'add-norm-1', color: 'emerald' },
  { id: 'feed-forward', color: 'orange' },
  { id: 'add-norm-2', color: 'emerald' },
  { id: 'output', color: 'amber' },
] as const

function LayersSection({ t }: { t: Record<string, string> }) {
  const [activeLayer, setActiveLayer] = useState<number>(0)
  const layer = LAYERS[activeLayer]

  const colorMap: Record<string, string> = {
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/40 text-purple-400',
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/40 text-pink-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/40 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/40 text-emerald-400',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/40 text-orange-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/40 text-amber-400',
  }

  const bgMap: Record<string, string> = {
    purple: 'bg-purple-500/20 border-purple-500/50',
    pink: 'bg-pink-500/20 border-pink-500/50',
    cyan: 'bg-cyan-500/20 border-cyan-500/50',
    emerald: 'bg-emerald-500/20 border-emerald-500/50',
    orange: 'bg-orange-500/20 border-orange-500/50',
    amber: 'bg-amber-500/20 border-amber-500/50',
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{t.layersTitle}</h3>
        <p className="text-muted text-sm">{t.layersDesc}</p>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Layer stack */}
        <div className="flex flex-col gap-2">
          {LAYERS.map((l, i) => {
            const isRepeat = l.id === 'multi-head-attention'
            return (
              <div key={l.id} className="relative">
                {isRepeat && (
                  <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-cyan-500/30" />
                )}
                <button
                  onClick={() => setActiveLayer(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    activeLayer === i
                      ? `${bgMap[l.color]} scale-[1.02]`
                      : 'bg-surface/30 border-border/50 hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      activeLayer === i ? bgMap[l.color] : 'bg-surface border border-border'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`text-sm font-medium ${activeLayer === i ? colorMap[l.color].split(' ').pop() : 'text-muted'}`}>
                      {t[`layer_${l.id.replace(/-/g, '_')}`]}
                    </span>
                  </div>
                </button>
                {i < LAYERS.length - 1 && (
                  <div className="flex justify-center py-1">
                    <motion.div
                      className="w-0.5 h-3 bg-border/50 rounded-full"
                      animate={activeLayer === i ? { backgroundColor: 'rgba(139,92,246,0.5)', scaleY: [1, 1.5, 1] } : {}}
                      transition={{ repeat: activeLayer === i ? Infinity : 0, duration: 1 }}
                    />
                  </div>
                )}
              </div>
            )
          })}
          {/* Nx indicator */}
          <div className="mt-2 text-center">
            <span className="text-xs text-muted px-3 py-1 rounded-full bg-surface border border-border">
              {t.layersNx}
            </span>
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl bg-gradient-to-br ${colorMap[layer.color]} border-2 p-6`}
          >
            <h4 className="text-lg font-bold font-heading mb-3">
              {t[`layer_${layer.id.replace(/-/g, '_')}`]}
            </h4>
            <p className="text-muted text-sm leading-relaxed mb-4">
              {t[`layer_${layer.id.replace(/-/g, '_')}_desc`]}
            </p>
            {/* Visual representation */}
            <div className="mt-4 p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center justify-center gap-2 text-xs text-muted">
                <span className="px-2 py-1 rounded bg-surface border border-border">{t[`layer_${layer.id.replace(/-/g, '_')}_in`]}</span>
                <svg width="24" height="12" viewBox="0 0 24 12" className="text-muted">
                  <path d="M0 6h18m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
                <span className={`px-2 py-1 rounded ${bgMap[layer.color]}`}>{t[`layer_${layer.id.replace(/-/g, '_')}`]}</span>
                <svg width="24" height="12" viewBox="0 0 24 12" className="text-muted">
                  <path d="M0 6h18m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
                <span className="px-2 py-1 rounded bg-surface border border-border">{t[`layer_${layer.id.replace(/-/g, '_')}_out`]}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── 2. Encoder-Decoder Architecture Toggle ────────────────────────────

type ArchType = 'encoder-decoder' | 'encoder-only' | 'decoder-only'

const ARCH_MODELS: Record<ArchType, string[]> = {
  'encoder-decoder': ['T5', 'BART', 'mBART'],
  'encoder-only': ['BERT', 'RoBERTa', 'DeBERTa'],
  'decoder-only': ['GPT', 'LLaMA', 'Claude'],
}

function EncoderDecoderSection({ t }: { t: Record<string, string> }) {
  const [arch, setArch] = useState<ArchType>('encoder-decoder')

  const hasEncoder = arch !== 'decoder-only'
  const hasDecoder = arch !== 'encoder-only'
  const hasCrossAttention = arch === 'encoder-decoder'

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{t.archTitle}</h3>
        <p className="text-muted text-sm">{t.archDesc}</p>
      </div>

      {/* Toggle buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {(['encoder-decoder', 'encoder-only', 'decoder-only'] as ArchType[]).map((a) => (
          <button
            key={a}
            onClick={() => setArch(a)}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
              arch === a
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                : 'bg-surface/30 border-border/50 text-muted hover:border-border'
            }`}
          >
            {t[`arch_${a.replace(/-/g, '_')}`]}
          </button>
        ))}
      </div>

      {/* Architecture visualization */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
        {/* Encoder */}
        <motion.div
          animate={{ opacity: hasEncoder ? 1 : 0.15, scale: hasEncoder ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-48 rounded-2xl border-2 border-purple-500/40 bg-gradient-to-b from-purple-500/15 to-purple-500/5 p-4"
        >
          <div className="text-center mb-3">
            <span className="text-purple-400 font-bold font-heading text-sm">{t.encoder}</span>
          </div>
          <div className="space-y-2">
            {['Self-Attention', 'Add & Norm', 'FFN', 'Add & Norm'].map((block, i) => (
              <div key={i} className={`text-xs text-center py-1.5 rounded-lg border transition-all ${
                hasEncoder ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : 'bg-surface/20 border-border/20 text-muted/30'
              }`}>
                {block}
              </div>
            ))}
          </div>
          {!hasEncoder && (
            <div className="mt-2 text-center text-xs text-muted/50 italic">{t.notUsed}</div>
          )}
        </motion.div>

        {/* Cross attention arrow */}
        <motion.div
          animate={{ opacity: hasCrossAttention ? 1 : 0.15 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-1"
        >
          <svg width="60" height="24" viewBox="0 0 60 24" className={hasCrossAttention ? 'text-cyan-400' : 'text-muted/20'}>
            <path d="M0 12h48m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
          <span className={`text-xs ${hasCrossAttention ? 'text-cyan-400' : 'text-muted/20'}`}>
            {t.crossAttention}
          </span>
        </motion.div>

        {/* Decoder */}
        <motion.div
          animate={{ opacity: hasDecoder ? 1 : 0.15, scale: hasDecoder ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-48 rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-b from-cyan-500/15 to-cyan-500/5 p-4"
        >
          <div className="text-center mb-3">
            <span className="text-cyan-400 font-bold font-heading text-sm">{t.decoder}</span>
          </div>
          <div className="space-y-2">
            {['Masked Self-Attn', hasCrossAttention ? 'Cross-Attention' : null, 'Add & Norm', 'FFN', 'Add & Norm'].filter(Boolean).map((block, i) => (
              <div key={i} className={`text-xs text-center py-1.5 rounded-lg border transition-all ${
                hasDecoder ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' : 'bg-surface/20 border-border/20 text-muted/30'
              }`}>
                {block}
              </div>
            ))}
          </div>
          {!hasDecoder && (
            <div className="mt-2 text-center text-xs text-muted/50 italic">{t.notUsed}</div>
          )}
        </motion.div>
      </div>

      {/* Model examples */}
      <div className="text-center">
        <p className="text-sm text-muted mb-2">{t.archModels}:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {ARCH_MODELS[arch].map((m) => (
            <span key={m} className="px-3 py-1 text-sm rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
              {m}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted mt-4 max-w-lg mx-auto">{t[`arch_${arch.replace(/-/g, '_')}_desc`]}</p>
      </div>
    </div>
  )
}

// ── 3. Dataflow Animation ─────────────────────────────────────────────

const FLOW_STEPS = [
  { id: 'tokenize', color: 'purple', shape: '[batch, seq_len]' },
  { id: 'embed', color: 'pink', shape: '[batch, seq_len, d_model]' },
  { id: 'pos_encode', color: 'pink', shape: '[batch, seq_len, d_model]' },
  { id: 'attention', color: 'cyan', shape: '[batch, heads, seq_len, seq_len]' },
  { id: 'attn_output', color: 'cyan', shape: '[batch, seq_len, d_model]' },
  { id: 'ffn', color: 'orange', shape: '[batch, seq_len, d_ff]' },
  { id: 'ffn_output', color: 'orange', shape: '[batch, seq_len, d_model]' },
  { id: 'logits', color: 'amber', shape: '[batch, seq_len, vocab_size]' },
] as const

function DataflowSection({ t }: { t: Record<string, string> }) {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const play = () => {
    if (isPlaying) return
    setIsPlaying(true)
    setStep(0)
    let current = 0
    const interval = setInterval(() => {
      current++
      if (current >= FLOW_STEPS.length) {
        clearInterval(interval)
        setIsPlaying(false)
        return
      }
      setStep(current)
    }, 800)
  }

  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
    pink: 'bg-pink-500/20 border-pink-500/40 text-pink-400',
    cyan: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
    orange: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
    amber: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{t.dataflowTitle}</h3>
        <p className="text-muted text-sm">{t.dataflowDesc}</p>
      </div>

      {/* Play button */}
      <div className="flex justify-center">
        <button
          onClick={play}
          disabled={isPlaying}
          className="px-6 py-2 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/40 text-cyan-400 font-medium text-sm hover:bg-cyan-500/30 transition-all disabled:opacity-50"
        >
          {isPlaying ? t.dataflowPlaying : t.dataflowPlay}
        </button>
      </div>

      {/* Step indicators */}
      <div className="space-y-2">
        {FLOW_STEPS.map((s, i) => (
          <motion.div
            key={s.id}
            animate={{
              opacity: i <= step ? 1 : 0.3,
              x: i <= step ? 0 : 20,
            }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-colors ${
              i === step ? colorClasses[s.color] : i < step ? 'bg-surface/30 border-border/30' : 'bg-surface/10 border-border/20'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
              i <= step ? colorClasses[s.color] : 'bg-surface/30 text-muted/30'
            }`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{t[`flow_${s.id}`]}</div>
              {i <= step && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-muted mt-1"
                >
                  {t[`flow_${s.id}_desc`]}
                </motion.div>
              )}
            </div>
            <div className={`text-xs font-mono shrink-0 ${i <= step ? '' : 'opacity-30'}`}>
              {s.shape}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Step scrubber */}
      <div className="flex flex-col items-center gap-2">
        <input
          type="range"
          min={0}
          max={FLOW_STEPS.length - 1}
          value={step}
          onChange={(e) => { setIsPlaying(false); setStep(Number(e.target.value)) }}
          className="w-full max-w-md accent-cyan-400"
        />
        <div className="flex justify-between w-full max-w-md text-xs text-muted">
          <span>{t.flow_tokenize}</span>
          <span>{t.flow_logits}</span>
        </div>
      </div>
    </div>
  )
}

// ── Main Export ────────────────────────────────────────────────────────

export function TransformerVisualizer({ section, t }: TransformerVisualizerProps) {
  switch (section) {
    case 'layers':
      return <LayersSection t={t} />
    case 'encoder-decoder':
      return <EncoderDecoderSection t={t} />
    case 'dataflow':
      return <DataflowSection t={t} />
    default:
      return null
  }
}
