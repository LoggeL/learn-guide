'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from '@/lib/i18n/context'
import { learningSoftmax, normalizeVector, scaledAttention } from '@/lib/llmLearningMath'
import Link from 'next/link'

interface TransformerVisualizerProps {
  section: 'layers' | 'encoder-decoder' | 'dataflow'
  t: Record<string, string>
}

// ── 1. Layer Stack Explorer ───────────────────────────────────────────

const LAYERS = [
  { id: 'input-embedding', color: 'purple', icon: 'embed' },
  { id: 'positional-encoding', color: 'pink', icon: 'position' },
  { id: 'multi-head-attention', color: 'cyan', icon: 'attention' },
  { id: 'add-norm-1', color: 'emerald', icon: 'residual' },
  { id: 'feed-forward', color: 'orange', icon: 'ffn' },
  { id: 'add-norm-2', color: 'emerald', icon: 'residual' },
  { id: 'output', color: 'amber', icon: 'output' },
] as const

// Mini SVG icons for each layer type
function LayerIcon({ type, size = 28, active = false }: { type: string; size?: number; active?: boolean }) {
  const color = active ? 'currentColor' : 'currentColor'
  const s = size
  switch (type) {
    case 'embed':
      return (
        <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
          <rect x="3" y="8" width="6" height="12" rx="1" stroke={color} strokeWidth="1.5" opacity={0.5} />
          <rect x="11" y="5" width="6" height="18" rx="1" stroke={color} strokeWidth="1.5" opacity={0.7} />
          <rect x="19" y="10" width="6" height="8" rx="1" stroke={color} strokeWidth="1.5" opacity={0.9} />
        </svg>
      )
    case 'position':
      return (
        <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
          <path d="M3 14 Q7 6, 10 14 Q13 22, 17 14 Q20 6, 24 14" stroke={color} strokeWidth="1.5" fill="none" />
          <circle cx="7" cy="10" r="1.5" fill={color} opacity={0.5} />
          <circle cx="14" cy="18" r="1.5" fill={color} opacity={0.7} />
          <circle cx="21" cy="10" r="1.5" fill={color} opacity={0.9} />
        </svg>
      )
    case 'attention':
      return (
        <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
          <circle cx="6" cy="8" r="2" fill={color} opacity={0.6} />
          <circle cx="6" cy="14" r="2" fill={color} opacity={0.6} />
          <circle cx="6" cy="20" r="2" fill={color} opacity={0.6} />
          <circle cx="22" cy="8" r="2" fill={color} opacity={0.6} />
          <circle cx="22" cy="14" r="2" fill={color} opacity={0.6} />
          <circle cx="22" cy="20" r="2" fill={color} opacity={0.6} />
          <line x1="8" y1="8" x2="20" y2="14" stroke={color} strokeWidth="1" opacity={0.4} />
          <line x1="8" y1="14" x2="20" y2="8" stroke={color} strokeWidth="1" opacity={0.4} />
          <line x1="8" y1="14" x2="20" y2="20" stroke={color} strokeWidth="1" opacity={0.4} />
          <line x1="8" y1="20" x2="20" y2="14" stroke={color} strokeWidth="1" opacity={0.4} />
        </svg>
      )
    case 'residual':
      return (
        <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
          <path d="M6 22 V14 H22 V6" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M14 22 V6" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" opacity={0.5} />
          <circle cx="14" cy="14" r="3" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M12 14 h4" stroke={color} strokeWidth="1.5" />
          <path d="M14 12 v4" stroke={color} strokeWidth="1.5" />
        </svg>
      )
    case 'ffn':
      return (
        <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
          <circle cx="5" cy="14" r="2" fill={color} opacity={0.5} />
          <circle cx="14" cy="7" r="2" fill={color} opacity={0.7} />
          <circle cx="14" cy="14" r="2" fill={color} opacity={0.7} />
          <circle cx="14" cy="21" r="2" fill={color} opacity={0.7} />
          <circle cx="23" cy="14" r="2" fill={color} opacity={0.5} />
          <line x1="7" y1="14" x2="12" y2="7" stroke={color} strokeWidth="1" opacity={0.3} />
          <line x1="7" y1="14" x2="12" y2="14" stroke={color} strokeWidth="1" opacity={0.3} />
          <line x1="7" y1="14" x2="12" y2="21" stroke={color} strokeWidth="1" opacity={0.3} />
          <line x1="16" y1="7" x2="21" y2="14" stroke={color} strokeWidth="1" opacity={0.3} />
          <line x1="16" y1="14" x2="21" y2="14" stroke={color} strokeWidth="1" opacity={0.3} />
          <line x1="16" y1="21" x2="21" y2="14" stroke={color} strokeWidth="1" opacity={0.3} />
        </svg>
      )
    case 'output':
      return (
        <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
          <rect x="4" y="6" width="20" height="16" rx="3" stroke={color} strokeWidth="1.5" fill="none" />
          <rect x="7" y="16" width="3" height="3" rx="0.5" fill={color} opacity={0.3} />
          <rect x="12" y="12" width="3" height="7" rx="0.5" fill={color} opacity={0.6} />
          <rect x="17" y="9" width="3" height="10" rx="0.5" fill={color} opacity={0.9} />
        </svg>
      )
    default:
      return null
  }
}

// Animated particles flowing upward through the stack
function FlowParticles({ active, colorClass, count = 3 }: { active: boolean; colorClass: string; count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1.5 h-1.5 rounded-full ${colorClass}`}
          initial={{ x: 8 + i * 12, y: 40, opacity: 0 }}
          animate={active ? {
            y: [-5, 40],
            opacity: [0, 0.8, 0.8, 0],
            x: 8 + i * 12 + Math.sin(i) * 4,
          } : { opacity: 0 }}
          transition={{
            duration: 1.8,
            delay: i * 0.4,
            repeat: active ? Infinity : 0,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Detail diagrams for each layer type
function AttentionDiagram({ t }: { t: Record<string, string> }) {
  const { locale } = useLocale()
  const result = scaledAttention([1, 0], [[1, 0], [0, 1]], [[1, 2], [-1, 0]], 1, true)
  return <div className="space-y-3 text-sm">
    <p className="text-muted">{t.attnExampleNote}</p>
    <p className="font-mono">q₂ = [1, 0]<br />K = [[1, 0], [0, 1]]<br />V = [[1, 2], [−1, 0]]</p>
    <p className="font-mono">softmax([1 / √2, 0]) = [{result.weights.map(v => v.toFixed(3)).join(', ')}]</p>
    <p className="font-mono text-cyan-300">Σ aⱼVⱼ = [{result.output.map(v => v.toFixed(3)).join(', ')}]</p>
    <Link className="text-cyan-300 underline" href={`/${locale}/ai/llm/attention`}>{t.attnExampleLink}</Link>
  </div>
}

// Schematic only: 8 bars stand for d_model, 32 bars for d_ff = 4 · d_model.
const FFN_IN = [3, 5, 7, 8, 6, 4, 7, 5]
const FFN_HIDDEN = Array.from({ length: 32 }, (_, i) => 2 + ((i * 7) % 9))
const FFN_OUT = [4, 6, 5, 7, 5, 4, 6, 5]

function FFNDiagram({ t }: { t: Record<string, string> }) {
  const arrow = (
    <div className="flex justify-center">
      <svg width="20" height="16" className="text-orange-400"><path d="M10 0 v12 m-4-4 l4 4 l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
    </div>
  )
  const barRow = (values: number[], delay: number, color: string, height: string) => (
    <div className={`flex items-end justify-center gap-0.5 ${height}`}>
      {values.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: h * 4 }}
          transition={{ delay: delay + i * 0.015 }}
          className={`w-1.5 rounded-t-sm ${color}`}
        />
      ))}
    </div>
  )
  return (
    <div className="space-y-2">
      {barRow(FFN_IN, 0, 'bg-orange-400/60', 'h-10')}
      <div className="text-center text-xs text-muted">{t.layer_detail_ffn_input}</div>
      {arrow}
      {barRow(FFN_HIDDEN, 0.3, 'bg-orange-500/70', 'h-12')}
      <div className="text-center text-xs text-orange-300">{t.layer_detail_ffn_expand}</div>
      {arrow}
      {barRow(FFN_OUT, 0.9, 'bg-orange-400/60', 'h-10')}
      <div className="text-center text-xs text-muted">{t.layer_detail_ffn_contract}</div>
      <p className="text-center text-[11px] text-muted/70">{t.layer_detail_ffn_schematic}</p>
    </div>
  )
}

function LayerNormDiagram({ t }: { t: Record<string, string> }) {
  const { locale } = useLocale()
  const before = [1, -1, 2, 0]
  const after = normalizeVector(before)
  return <div className="space-y-2 text-sm">
    <p className="text-muted">{t.normExampleNote}</p>
    <p className="font-mono">x = [{before.join(', ')}]</p><p className="font-mono text-emerald-300">LN(x) = [{after.map(v => v.toFixed(3)).join(', ')}]</p>
    <Link className="text-cyan-300 underline" href={`/${locale}/ai/llm/residual-stream-layer-norm`}>{t.normExampleLink}</Link>
  </div>
}

function ResidualDiagram({ t }: { t: Record<string, string> }) {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-48 h-24"
      >
        <svg width="192" height="96" viewBox="0 0 192 96" className="text-emerald-400">
          {/* Main path */}
          <motion.path
            d="M96 8 V88"
            stroke="currentColor" strokeWidth="2" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
          />
          {/* Skip connection */}
          <motion.path
            d="M96 8 H160 V88 H96"
            stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" fill="none" opacity={0.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
          />
          {/* Plus circle */}
          <circle cx="96" cy="88" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M92 88 h8 M96 84 v8" stroke="currentColor" strokeWidth="1.5" />
          {/* Sublayer box */}
          <rect x="60" y="36" width="72" height="20" rx="4" fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeWidth="1" />
          <text x="96" y="50" textAnchor="middle" fontSize="8" fill="currentColor">{t.layer_detail_sublayer}</text>
          {/* Skip label */}
          <text x="174" y="52" textAnchor="middle" fontSize="7" fill="currentColor" opacity={0.6}>{t.layer_detail_skip}</text>
          {/* Animated pulse along skip */}
          <motion.circle
            r="3" fill="currentColor"
            initial={{ offsetDistance: '0%' }}
            animate={{ offsetDistance: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ offsetPath: "path('M96 8 L160 8 L160 88 L96 88')" }}
          />
        </svg>
      </motion.div>
      <p className="text-xs text-emerald-300 text-center">{t.layer_detail_residual_desc}</p>
    </div>
  )
}

function AddNormDiagram({ t }: { t: Record<string, string> }) {
  return (
    <div className="space-y-4">
      <ResidualDiagram t={t} />
      <div className="border-t border-border/50 pt-3">
        <LayerNormDiagram t={t} />
      </div>
    </div>
  )
}

const TOY_TOKENS = ['The', 'cat', 'sat']
const TOY_EMBEDDINGS = [
  [0.3, 0.7, 0.5, 0.9],
  [0.8, 0.2, 0.6, 0.4],
  [0.5, 0.9, 0.1, 0.6],
]

function EmbeddingDiagram({ t }: { t: Record<string, string> }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-3">
        {TOY_TOKENS.map((tok, i) => (
          <motion.div
            key={tok}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="px-2 py-1 rounded bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 font-mono">{tok}</div>
            <svg width="8" height="16" className="text-purple-400"><path d="M4 0 v12 m-3-3 l3 3 l3-3" stroke="currentColor" strokeWidth="1" fill="none" /></svg>
            <div className="flex gap-px">
              {TOY_EMBEDDINGS[i].map((v, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: v }}
                  transition={{ delay: 0.3 + i * 0.15 + j * 0.05 }}
                  className="w-2 h-6 rounded-sm bg-purple-400"
                />
              ))}
            </div>
            <span className="font-mono text-[10px] text-muted">[{TOY_EMBEDDINGS[i].join(', ')}]</span>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-purple-300">{t.layer_detail_embed_desc}</p>
    </div>
  )
}

/** Sinusoidal encoding from Vaswani et al. (2017), Section 3.5. */
function sinusoidalEncoding(pos: number, d: number) {
  return Array.from({ length: d }, (_, j) => {
    const i = Math.floor(j / 2)
    const angle = pos / Math.pow(10000, (2 * i) / d)
    return j % 2 === 0 ? Math.sin(angle) : Math.cos(angle)
  })
}

const WAVE_PATH = Array.from({ length: 61 }, (_, i) => `${i === 0 ? 'M' : 'L'}${i * 2} ${(12 - 10 * Math.sin(i / 6)).toFixed(2)}`).join(' ')

function PositionalDiagram({ t }: { t: Record<string, string> }) {
  // Token "sat" sits at position 2 (0-based) in "The cat sat".
  const embedding = TOY_EMBEDDINGS[2]
  const pe = sinusoidalEncoding(2, 4)
  const sum = embedding.map((v, i) => v + pe[i])
  const rows: [string, number[], string][] = [
    [t.layer_detail_pos_row_embed, embedding, 'text-muted'],
    [t.layer_detail_pos_row_pe, pe, 'text-pink-300'],
    [t.layer_detail_pos_row_sum, sum, 'text-pink-200'],
  ]
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="mx-auto font-mono text-xs">
          <tbody>
            {rows.map(([label, values, color], r) => (
              <motion.tr key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: r * 0.25 }} className={color}>
                <th className="pr-3 py-0.5 text-left font-sans font-normal">{label}</th>
                {values.map((v, i) => <td key={i} className="px-1.5 text-right">{v.toFixed(3)}</td>)}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <svg width="120" height="24" viewBox="0 0 120 24" className="mx-auto block text-pink-400" aria-hidden="true">
        <motion.path
          d={WAVE_PATH}
          stroke="currentColor" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      </svg>
      <p className="text-center text-xs text-pink-300">{t.layer_detail_pos_desc}</p>
    </div>
  )
}

// Example logits for the next token after "The cat sat" — chosen for teaching, not taken from a model.
const OUTPUT_EXAMPLE = [
  { tok: 'on', logit: 3.0 },
  { tok: 'down', logit: 1.6 },
  { tok: 'in', logit: 1.1 },
  { tok: 'still', logit: 0.2 },
]

function OutputDiagram({ t }: { t: Record<string, string> }) {
  const probs = learningSoftmax(OUTPUT_EXAMPLE.map(o => o.logit))
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-center gap-2 h-16">
        {OUTPUT_EXAMPLE.map((o, i) => (
          <motion.div
            key={o.tok}
            initial={{ height: 0 }}
            animate={{ height: Math.max(probs[i] * 60, 12) }}
            transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 100 }}
            className="w-10 rounded-t-md bg-amber-400/70 flex items-end justify-center pb-0.5"
          >
            <span className="text-[9px] text-amber-950 font-bold">{Math.round(probs[i] * 100)}%</span>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {OUTPUT_EXAMPLE.map((o) => (
          <div key={o.tok} className="w-10 text-center text-xs text-amber-300 font-mono">{o.tok}</div>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {OUTPUT_EXAMPLE.map((o) => (
          <div key={o.tok} className="w-10 text-center text-[10px] text-muted font-mono" title={t.layer_detail_output_logits}>{o.logit.toFixed(1)}</div>
        ))}
      </div>
      <p className="text-center text-[10px] text-muted">↑ {t.layer_detail_output_logits}</p>
      <p className="text-center text-xs text-amber-300">{t.layer_detail_output_desc}</p>
    </div>
  )
}

function DetailDiagram({ layerId, t }: { layerId: string; t: Record<string, string> }) {
  switch (layerId) {
    case 'input-embedding': return <EmbeddingDiagram t={t} />
    case 'positional-encoding': return <PositionalDiagram t={t} />
    case 'multi-head-attention': return <AttentionDiagram t={t} />
    case 'add-norm-1':
    case 'add-norm-2': return <AddNormDiagram t={t} />
    case 'feed-forward': return <FFNDiagram t={t} />
    case 'output': return <OutputDiagram t={t} />
    default: return null
  }
}

// Particle color utility
function particleBg(color: string) {
  const map: Record<string, string> = {
    purple: 'bg-purple-400', pink: 'bg-pink-400', cyan: 'bg-cyan-400',
    emerald: 'bg-emerald-400', orange: 'bg-orange-400', amber: 'bg-amber-400',
  }
  return map[color] || 'bg-white'
}

function LayersSection({ t }: { t: Record<string, string> }) {
  const [activeLayer, setActiveLayer] = useState<number>(0)
  const [tokenFlying, setTokenFlying] = useState(false)
  const [tokenAt, setTokenAt] = useState<number>(-1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const layer = LAYERS[activeLayer]

  const sendToken = useCallback(() => {
    if (tokenFlying) return
    setTokenFlying(true)
    setTokenAt(0)
    setActiveLayer(0)
    let current = 0
    intervalRef.current = setInterval(() => {
      current++
      if (current >= LAYERS.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = null
        timeoutRef.current = setTimeout(() => { setTokenFlying(false); setTokenAt(-1) }, 600)
        return
      }
      setTokenAt(current)
      setActiveLayer(current)
    }, 900)
  }, [tokenFlying])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

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

  const glowMap: Record<string, string> = {
    purple: 'shadow-purple-500/30', pink: 'shadow-pink-500/30', cyan: 'shadow-cyan-500/30',
    emerald: 'shadow-emerald-500/30', orange: 'shadow-orange-500/30', amber: 'shadow-amber-500/30',
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{t.layersTitle}</h3>
        <p className="text-muted text-sm">{t.layersDesc}</p>
      </div>

      {/* Send Token Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={sendToken}
          disabled={tokenFlying}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-purple-500/30 text-sm font-medium text-purple-300 hover:border-purple-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <motion.span
            animate={tokenFlying ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: tokenFlying ? Infinity : 0, ease: 'linear' }}
          >
            ⚡
          </motion.span>
          {tokenFlying ? t.layers_token_flying : t.layers_send_token}
        </motion.button>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        {/* Layer stack — visual blocks with icons and particles */}
        <div className="flex flex-col gap-1.5 relative">
          {LAYERS.map((l, i) => {
            const isActive = activeLayer === i
            const isTokenHere = tokenAt === i
            return (
              <div key={l.id} className="relative">
                <motion.button
                  onClick={() => { if (!tokenFlying) setActiveLayer(i) }}
                  animate={isTokenHere ? {
                    scale: [1, 1.04, 1],
                    transition: { duration: 0.4 },
                  } : {}}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? `${bgMap[l.color]} scale-[1.02] shadow-lg ${glowMap[l.color]}`
                      : 'bg-surface/30 border-border/50 hover:border-border'
                  }`}
                >
                  {/* Animated particles when token is here */}
                  <FlowParticles active={isTokenHere} colorClass={particleBg(l.color)} />

                  {/* Processing glow effect */}
                  {isTokenHere && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      style={{ background: `radial-gradient(ellipse at center, ${l.color === 'purple' ? 'rgb(168,85,247)' : l.color === 'pink' ? 'rgb(236,72,153)' : l.color === 'cyan' ? 'rgb(6,182,212)' : l.color === 'emerald' ? 'rgb(52,211,153)' : l.color === 'orange' ? 'rgb(249,115,22)' : 'rgb(245,158,11)'}20, transparent 70%)` }}
                    />
                  )}

                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? bgMap[l.color] : 'bg-surface border border-border'
                    } ${isActive ? colorMap[l.color].split(' ').pop()! : 'text-muted'}`}>
                      <LayerIcon type={l.icon} active={isActive} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium block truncate ${isActive ? colorMap[l.color].split(' ').pop() : 'text-muted'}`}>
                        {t[`layer_${l.id.replace(/-/g, '_')}`]}
                      </span>
                      <span className="text-xs text-muted/60 block truncate">
                        {t[`layer_${l.id.replace(/-/g, '_')}_in`]} → {t[`layer_${l.id.replace(/-/g, '_')}_out`]}
                      </span>
                    </div>
                  </div>
                </motion.button>

                {/* Connector between layers with flowing particle */}
                {i < LAYERS.length - 1 && (
                  <div className="flex justify-center py-0.5 relative">
                    <div className="w-0.5 h-4 bg-border/30 rounded-full relative overflow-hidden">
                      {(isActive || tokenAt === i) && (
                        <motion.div
                          className={`absolute w-full h-2 rounded-full ${particleBg(l.color)}`}
                          animate={{ y: [-8, 16] }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                    </div>
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

        {/* Detail panel with visual diagrams */}
        <AnimatePresence mode="wait">
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className={`rounded-2xl bg-gradient-to-br ${colorMap[layer.color]} border-2 p-5 flex flex-col`}
          >
            <h4 className="text-lg font-bold font-heading mb-2">
              {t[`layer_${layer.id.replace(/-/g, '_')}`]}
            </h4>
            <p className="text-muted text-sm leading-relaxed mb-4">
              {t[`layer_${layer.id.replace(/-/g, '_')}_desc`]}
            </p>

            {/* Visual mini-diagram */}
            <div className="flex-1 p-4 rounded-xl bg-background/50 border border-border/50">
              <DetailDiagram layerId={layer.id} t={t} />
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
  'decoder-only': ['GPT-3', 'Llama 3', 'Qwen3', 'DeepSeek-V3'],
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
            {[t.blockSelfAttention, t.blockAddNorm, t.blockFfn, t.blockAddNorm].map((block, i) => (
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
            {[t.blockMaskedSelfAttention, t.blockAddNorm, ...(hasCrossAttention ? [t.crossAttention, t.blockAddNorm] : []), t.blockFfn, t.blockAddNorm].map((block, i) => (
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
        <p className="text-xs text-muted/70 mt-3">{t.archBlockNote}</p>
      </div>
    </div>
  )
}

// ── 3. Dataflow Animation ─────────────────────────────────────────────

// Modern Pre-Norm decoder (RoPE, GQA, SwiGLU) with Llama 3 8B dimensions:
// d_model 4096, 32 layers, 32 query heads, 8 KV heads, d_head 128, d_ff 14336, vocab 128256.
// `stream` marks the steps that set or update the residual stream x.
const FLOW_STEPS = [
  { id: 'tokenize', color: 'purple', shape: '[B, T]', concrete: '[1, 6]', stream: false },
  { id: 'embed', color: 'pink', shape: '[B, T, d_model]', concrete: '[1, 6, 4096]', stream: true },
  { id: 'qkv', color: 'cyan', shape: 'Q [B, H_q, T, d_head] · K/V [B, H_kv, T, d_head]', concrete: 'Q [1, 32, 6, 128] · K/V [1, 8, 6, 128]', stream: false },
  { id: 'rope', color: 'cyan', shape: 'Q [B, H_q, T, d_head] · K [B, H_kv, T, d_head]', concrete: 'Q [1, 32, 6, 128] · K [1, 8, 6, 128]', stream: false },
  { id: 'scores', color: 'cyan', shape: '[B, H_q, T, T]', concrete: '[1, 32, 6, 6]', stream: false },
  { id: 'attn_out', color: 'emerald', shape: '[B, T, d_model]', concrete: '[1, 6, 4096]', stream: true },
  { id: 'ffn', color: 'orange', shape: '[B, T, d_ff]', concrete: '[1, 6, 14336]', stream: false },
  { id: 'ffn_out', color: 'emerald', shape: '[B, T, d_model]', concrete: '[1, 6, 4096]', stream: true },
  { id: 'logits', color: 'amber', shape: '[B, T, vocab]', concrete: '[1, 6, 128256]', stream: false },
] as const

function DataflowSection({ t }: { t: Record<string, string> }) {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopPlaying = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsPlaying(false)
  }

  const play = () => {
    if (isPlaying) return
    setIsPlaying(true)
    setStep(0)
    let current = 0
    intervalRef.current = setInterval(() => {
      current++
      if (current >= FLOW_STEPS.length) {
        stopPlaying()
        return
      }
      setStep(current)
    }, 800)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
    pink: 'bg-pink-500/20 border-pink-500/40 text-pink-400',
    cyan: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
    orange: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
    amber: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
    emerald: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
  }

  const renderStep = (s: (typeof FLOW_STEPS)[number], i: number) => (
    <motion.div
      key={s.id}
      animate={{
        opacity: i <= step ? 1 : 0.3,
        x: i <= step ? 0 : 20,
      }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl border-2 transition-colors ${
        i === step ? colorClasses[s.color] : i < step ? 'bg-surface/30 border-border/30' : 'bg-surface/10 border-border/20'
      }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
          i <= step ? colorClasses[s.color] : 'bg-surface/30 text-muted/30'
        }`}>
          {i + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-text">
            {t[`flow_${s.id}`]}
            {s.stream && <span className="ml-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">x</span>}
          </div>
          {i <= step && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs text-muted mt-1 leading-relaxed"
            >
              {t[`flow_${s.id}_desc`]}
            </motion.div>
          )}
        </div>
      </div>
      <div className={`sm:w-64 shrink-0 font-mono text-[11px] leading-snug sm:text-right ${i <= step ? '' : 'opacity-30'}`}>
        <div className="text-muted"><span className="sr-only">{t.dataflowSymbolic}: </span>{s.shape}</div>
        <div className="text-text"><span className="sr-only">{t.dataflowConcrete}: </span>{s.concrete}</div>
      </div>
    </motion.div>
  )

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

      <p className="text-xs text-muted text-center max-w-2xl mx-auto">{t.dataflowDims}</p>
      <div className="flex justify-center gap-4 font-mono text-[11px]">
        <span className="text-muted">{t.dataflowSymbolic}</span>
        <span className="text-text">{t.dataflowConcrete}</span>
      </div>

      {/* Step indicators */}
      <div className="space-y-2">
        {FLOW_STEPS.slice(0, 2).map((s, i) => renderStep(s, i))}
        <div className="relative rounded-xl border border-dashed border-emerald-500/30 p-2 pt-6 space-y-2">
          <span className="absolute left-3 top-1 text-[11px] font-mono text-emerald-300">× 32</span>
          {FLOW_STEPS.slice(2, 8).map((s, i) => renderStep(s, i + 2))}
        </div>
        {FLOW_STEPS.slice(8).map((s, i) => renderStep(s, i + 8))}
      </div>

      {/* Step scrubber */}
      <div className="flex flex-col items-center gap-2">
        <input
          type="range"
          min={0}
          max={FLOW_STEPS.length - 1}
          value={step}
          onChange={(e) => { stopPlaying(); setStep(Number(e.target.value)) }}
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
