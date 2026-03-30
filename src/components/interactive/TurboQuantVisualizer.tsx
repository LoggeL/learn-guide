'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const stages = [
  {
    id: 0,
    label: 'Original KV Vector',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300',
    icon: '📦',
    vector: [0.82, -0.41, 0.67, -0.23],
    description: 'A raw Key or Value vector from the attention layer. Each component is stored as FP16 (16 bits).',
    insight: 'Traditional quantization stores a scale + zero_point per block in full FP32 — adding 1–2 bits of overhead per value.',
    memory: { label: '64 bits (4 × FP16)', overhead: '+ 32 bits quantization constants', total: '≈ 96 bits total', compression: '1.0×' },
  },
  {
    id: 1,
    label: 'After Random Rotation',
    color: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-500/30',
    accent: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300',
    icon: '🔄',
    vector: [0.53, 0.71, -0.38, 0.51],
    description: 'PolarQuant applies a random orthogonal rotation (preconditioner). The values change but the dot-product relationships are perfectly preserved.',
    insight: 'Key insight: after rotation, the distribution of angles is analytically known and tightly concentrated. No need to compute or store normalization parameters.',
    memory: { label: '64 bits (still FP16)', overhead: 'But now: angles follow a known distribution', total: 'No constants needed', compression: '—' },
  },
  {
    id: 2,
    label: 'PolarQuant Output',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300',
    icon: '🧭',
    vector: null,
    polar: { radius: 1.08, angles: [26, -53, 43] },
    description: 'Convert to polar coordinates: one radius (magnitude) + angles (direction). Angles are quantized to 4 bits each — no scale factor needed.',
    insight: 'Because the angle distribution is known, we can use a fixed uniform quantizer with zero memory overhead. This is the core breakthrough.',
    memory: { label: '16 bits (radius FP16)', overhead: '+ 12 bits (3 angles × 4 bits)', total: '28 bits total — zero overhead', compression: '≈ 2.3×' },
  },
  {
    id: 3,
    label: 'QJL Error Correction',
    color: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    accent: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
    icon: '✅',
    vector: null,
    residual: [0.04, -0.02, 0.03, -0.01],
    signBits: ['+1', '-1', '+1', '-1'],
    description: 'The tiny residual error from PolarQuant is captured by QJL using the Johnson-Lindenstrauss transform — reduced to just 1 sign bit per dimension.',
    insight: 'These sign bits debias the attention dot product, recovering accuracy that matches FP16 quality. Google\'s benchmarks: zero quality loss on LongBench, RULER, and Needle-in-a-Haystack.',
    memory: { label: '28 bits (PolarQuant)', overhead: '+ 4 bits (QJL sign bits)', total: '32 bits vs original 96 bits', compression: '3×' },
  },
]

function VectorBar({ value, max = 1 }: { value: number; max?: number }) {
  const pct = Math.abs(value) / max
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="font-mono text-xs w-14 text-right shrink-0">{value > 0 ? '+' : ''}{value.toFixed(2)}</span>
      <div className="flex-1 h-5 bg-background rounded relative overflow-hidden">
        <motion.div
          className={`absolute top-0 h-full rounded ${value >= 0 ? 'bg-emerald-500/60 left-1/2' : 'bg-red-500/60 right-1/2'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct * 50}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
      </div>
    </div>
  )
}

export function TurboQuantVisualizer() {
  const [stage, setStage] = useState(0)
  const s = stages[stage]

  return (
    <div className="rounded-2xl border border-border bg-surface/30 overflow-hidden">
      {/* Progress header */}
      <div className="flex items-center gap-0 border-b border-border">
        {stages.map((st, i) => (
          <button
            key={i}
            onClick={() => setStage(i)}
            className={`flex-1 py-3 px-2 text-xs font-semibold transition-all border-r border-border last:border-r-0 ${
              i === stage
                ? 'bg-white/5 text-text'
                : 'text-muted hover:text-text hover:bg-white/3'
            }`}
          >
            <span className="mr-1">{st.icon}</span>
            <span className="hidden sm:inline">{st.label}</span>
            <span className="sm:hidden">{i + 1}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="p-6 md:p-8 space-y-6"
        >
          {/* Title */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <h3 className={`text-xl font-bold font-heading ${s.accent}`}>{s.label}</h3>
              <p className="text-sm text-muted">{s.description}</p>
            </div>
          </div>

          {/* Main visual */}
          <div className={`rounded-xl p-5 border bg-gradient-to-br ${s.color} ${s.border} space-y-3`}>
            {s.vector && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  {stage === 0 ? 'Raw vector (4 FP16 components)' : 'Rotated vector (same relationships, different coords)'}
                </div>
                {s.vector.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-muted w-6 shrink-0">v{i}</span>
                    <VectorBar value={v} />
                  </div>
                ))}
              </div>
            )}

            {s.polar && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted uppercase tracking-wider">Polar representation</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-emerald-500/30 bg-background/60 p-3">
                    <div className="text-xs text-muted mb-1">Radius (magnitude)</div>
                    <div className="font-mono text-lg text-emerald-300">{s.polar.radius.toFixed(2)}</div>
                    <div className="text-xs text-muted mt-1">→ stored as FP16 (16 bits)</div>
                  </div>
                  <div className="rounded-lg border border-emerald-500/30 bg-background/60 p-3">
                    <div className="text-xs text-muted mb-2">Angles (direction)</div>
                    <div className="flex gap-2">
                      {s.polar.angles.map((a, i) => (
                        <div key={i} className="font-mono text-sm text-emerald-300 bg-emerald-500/10 rounded px-2 py-1">
                          {a > 0 ? '+' : ''}{a}°
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted mt-2">→ 4 bits each, no scale needed</div>
                  </div>
                </div>
              </div>
            )}

            {s.residual && s.signBits && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted uppercase tracking-wider">QJL correction</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-purple-500/30 bg-background/60 p-3">
                    <div className="text-xs text-muted mb-2">Residual error (after PolarQuant)</div>
                    {s.residual.map((v, i) => (
                      <div key={i} className="flex justify-between font-mono text-xs text-muted">
                        <span>e{i}:</span>
                        <span className={v > 0 ? 'text-emerald-400' : 'text-red-400'}>{v > 0 ? '+' : ''}{v.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-purple-500/30 bg-background/60 p-3">
                    <div className="text-xs text-muted mb-2">JL sign bits (1 bit each)</div>
                    <div className="flex gap-2 flex-wrap">
                      {s.signBits.map((bit, i) => (
                        <div key={i} className={`font-mono text-sm rounded px-2 py-1 ${bit === '+1' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                          {bit}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted mt-2">→ debias dot product, zero overhead</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Insight */}
          <div className="rounded-lg border border-border bg-background/40 p-4 flex gap-3">
            <span className="text-lg shrink-0">💡</span>
            <p className="text-sm text-muted leading-relaxed">{s.insight}</p>
          </div>

          {/* Memory breakdown */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-border bg-surface/50 p-3">
              <div className="text-xs text-muted mb-1">Storage</div>
              <div className={`text-sm font-semibold ${s.accent}`}>{s.memory.label}</div>
            </div>
            <div className="rounded-lg border border-border bg-surface/50 p-3">
              <div className="text-xs text-muted mb-1">Overhead</div>
              <div className="text-sm font-semibold text-text">{s.memory.overhead}</div>
            </div>
            <div className={`rounded-lg border p-3 ${stage === 3 ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-border bg-surface/50'}`}>
              <div className="text-xs text-muted mb-1">Total / Ratio</div>
              <div className={`text-sm font-bold ${stage === 3 ? 'text-emerald-400' : s.accent}`}>
                {stage === 3 ? '🎉 ' : ''}{s.memory.compression}
              </div>
              <div className="text-xs text-muted">{s.memory.total}</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStage(Math.max(0, stage - 1))}
              disabled={stage === 0}
              className="px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-text hover:border-text/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>
            <div className="flex gap-2">
              {stages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === stage ? 'bg-text scale-125' : 'bg-border hover:bg-muted'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setStage(Math.min(stages.length - 1, stage + 1))}
              disabled={stage === stages.length - 1}
              className="px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-text hover:border-text/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
