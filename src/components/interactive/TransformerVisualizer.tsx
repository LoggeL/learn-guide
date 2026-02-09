'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-1">
        {['Q', 'K', 'V'].map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-8 rounded-md bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">
              {label}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex items-center gap-1"
        >
          <svg width="80" height="20" viewBox="0 0 80 20" className="text-cyan-400">
            <path d="M10 10 L35 2 L35 18 Z" fill="currentColor" opacity={0.2} stroke="currentColor" strokeWidth="0.5" />
            <text x="50" y="14" fontSize="8" fill="currentColor" opacity={0.7}>softmax</text>
          </svg>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mx-auto w-28 h-20 rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-1 grid grid-cols-4 grid-rows-4 gap-px"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: Math.random() * 0.8 + 0.2 }}
            transition={{ delay: 0.8 + i * 0.03 }}
            className="rounded-sm bg-cyan-400"
          />
        ))}
      </motion.div>
      <p className="text-center text-xs text-muted">{t.layer_detail_attention_matrix}</p>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex justify-center"
      >
        <div className="px-3 py-1.5 rounded-md bg-cyan-500/15 border border-cyan-500/25 text-xs text-cyan-300">
          {t.layer_detail_concat_heads}
        </div>
      </motion.div>
    </div>
  )
}

function FFNDiagram({ t }: { t: Record<string, string> }) {
  const bars = [3, 5, 7, 8, 6, 4, 7, 5]
  const expanded = [2, 6, 8, 3, 7, 1, 9, 4, 5, 8, 3, 6]
  const contracted = [4, 6, 5, 7, 5, 4, 6, 5]
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-center gap-0.5 h-10">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: h * 4 }}
            transition={{ delay: i * 0.05 }}
            className="w-2 rounded-t-sm bg-orange-400/60"
          />
        ))}
      </div>
      <div className="text-center text-xs text-muted">{t.layer_detail_ffn_input}</div>
      <div className="flex justify-center">
        <svg width="20" height="16" className="text-orange-400"><path d="M10 0 v12 m-4-4 l4 4 l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
      </div>
      <div className="flex items-end justify-center gap-0.5 h-12">
        {expanded.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: h * 4 }}
            transition={{ delay: 0.4 + i * 0.03 }}
            className="w-2 rounded-t-sm bg-orange-500/70"
          />
        ))}
      </div>
      <div className="text-center text-xs text-orange-300">{t.layer_detail_ffn_expand}</div>
      <div className="flex justify-center">
        <svg width="20" height="16" className="text-orange-400"><path d="M10 0 v12 m-4-4 l4 4 l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
      </div>
      <div className="flex items-end justify-center gap-0.5 h-10">
        {contracted.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: h * 4 }}
            transition={{ delay: 0.8 + i * 0.05 }}
            className="w-2 rounded-t-sm bg-orange-400/60"
          />
        ))}
      </div>
      <div className="text-center text-xs text-muted">{t.layer_detail_ffn_contract}</div>
    </div>
  )
}

function LayerNormDiagram({ t }: { t: Record<string, string> }) {
  const before = [2, 9, 1, 8, 3, 7, 2, 6]
  const after = [4, 6, 4, 6, 4, 6, 4, 5]
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-end justify-center gap-0.5 h-12">
            {before.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: h * 4 }}
                className="w-2 rounded-t-sm bg-emerald-500/50"
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-1">{t.layer_detail_norm_before}</p>
        </div>
        <div>
          <div className="flex items-end justify-center gap-0.5 h-12">
            {after.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: h * 4 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="w-2 rounded-t-sm bg-emerald-400/70"
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-1">{t.layer_detail_norm_after}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-2">
        <svg width="120" height="24" viewBox="0 0 120 24" className="text-emerald-400">
          <path d="M10 18 Q20 4, 30 18 Q40 4, 50 18" stroke="currentColor" strokeWidth="1.5" fill="none" opacity={0.4} />
          <path d="M5 12 h5 m-2.5-2.5 v5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M60 12 h30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M95 14 Q100 10, 105 14 Q110 18, 115 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <p className="text-center text-xs text-emerald-300">{t.layer_detail_norm_desc}</p>
    </div>
  )
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
          <rect x="72" y="36" width="48" height="20" rx="4" fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeWidth="1" />
          <text x="96" y="50" textAnchor="middle" fontSize="8" fill="currentColor">sublayer</text>
          {/* Skip label */}
          <text x="166" y="52" textAnchor="middle" fontSize="7" fill="currentColor" opacity={0.6}>skip</text>
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

function EmbeddingDiagram({ t }: { t: Record<string, string> }) {
  const tokens = ['The', 'cat', 'sat']
  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2">
        {tokens.map((tok, i) => (
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
              {[0.3, 0.7, 0.5, 0.9].map((v, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: v }}
                  transition={{ delay: 0.3 + i * 0.15 + j * 0.05 }}
                  className="w-2 h-6 rounded-sm bg-purple-400"
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-purple-300">{t.layer_detail_embed_desc}</p>
    </div>
  )
}

function PositionalDiagram({ t }: { t: Record<string, string> }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-px">
            {[0.3, 0.7, 0.5, 0.9].map((v, j) => (
              <div key={j} className="w-2 h-6 rounded-sm bg-pink-400" style={{ opacity: v }} />
            ))}
          </div>
          <span className="text-xs text-muted">embed</span>
        </div>
        <div className="flex items-center text-pink-400 font-bold text-lg">+</div>
        <div className="flex flex-col items-center gap-1">
          <svg width="32" height="24" viewBox="0 0 32 24" className="text-pink-400">
            <motion.path
              d="M0 12 Q4 4, 8 12 Q12 20, 16 12 Q20 4, 24 12 Q28 20, 32 12"
              stroke="currentColor" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
          </svg>
          <span className="text-xs text-muted">sin/cos</span>
        </div>
        <div className="flex items-center text-pink-400 font-bold text-lg">=</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex gap-px">
            {[0.5, 0.8, 0.3, 0.7].map((v, j) => (
              <div key={j} className="w-2 h-6 rounded-sm bg-pink-300" style={{ opacity: v }} />
            ))}
          </div>
          <span className="text-xs text-pink-300">pos-aware</span>
        </motion.div>
      </div>
      <p className="text-center text-xs text-pink-300">{t.layer_detail_pos_desc}</p>
    </div>
  )
}

function OutputDiagram({ t }: { t: Record<string, string> }) {
  const probs = [
    { tok: 'on', p: 0.72 },
    { tok: 'in', p: 0.15 },
    { tok: 'by', p: 0.08 },
    { tok: '...', p: 0.05 },
  ]
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-center gap-2 h-16">
        {probs.map((p, i) => (
          <motion.div
            key={p.tok}
            initial={{ height: 0 }}
            animate={{ height: p.p * 56 }}
            transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 100 }}
            className="w-8 rounded-t-md bg-amber-400/70 flex items-end justify-center pb-0.5"
          >
            <span className="text-[8px] text-amber-900 font-bold">{Math.round(p.p * 100)}%</span>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {probs.map((p) => (
          <div key={p.tok} className="w-8 text-center text-xs text-amber-300 font-mono">{p.tok}</div>
        ))}
      </div>
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
    case 'add-norm-2': return <ResidualDiagram t={t} />
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
  const layer = LAYERS[activeLayer]

  const sendToken = useCallback(() => {
    if (tokenFlying) return
    setTokenFlying(true)
    setTokenAt(0)
    setActiveLayer(0)
    let current = 0
    const interval = setInterval(() => {
      current++
      if (current >= LAYERS.length) {
        clearInterval(interval)
        setTimeout(() => { setTokenFlying(false); setTokenAt(-1) }, 600)
        return
      }
      setTokenAt(current)
      setActiveLayer(current)
    }, 900)
  }, [tokenFlying])

  // Cleanup on unmount
  useEffect(() => {
    return () => { setTokenFlying(false) }
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
