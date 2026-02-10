'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CacheEntry {
  token: string
  key: number[]
  value: number[]
  step: number
}

const SAMPLE_TOKENS = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'and', 'purred']

function randomVector(seed: number): number[] {
  // Deterministic pseudo-random for consistent display
  const vals: number[] = []
  for (let i = 0; i < 4; i++) {
    vals.push(Math.round((Math.sin(seed * (i + 1) * 9.1 + i * 3.7) * 0.5 + 0.5) * 100) / 100)
  }
  return vals
}

function VectorCell({ values, color }: { values: number[]; color: string }) {
  return (
    <div className={`flex gap-1 font-mono text-xs ${color}`}>
      [
      {values.map((v, i) => (
        <span key={i}>
          {v.toFixed(2)}
          {i < values.length - 1 ? ',' : ''}
        </span>
      ))}
      ]
    </div>
  )
}

// Main KV Cache step-by-step demo
function KVCacheStepDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cache, setCache] = useState<CacheEntry[]>([])
  const maxStep = SAMPLE_TOKENS.length

  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1
      if (next > maxStep) {
        setIsPlaying(false)
        return prev
      }
      // Add to cache
      if (next <= maxStep) {
        const token = SAMPLE_TOKENS[next - 1]
        setCache((c) => [
          ...c,
          {
            token,
            key: randomVector(next * 7),
            value: randomVector(next * 13),
            step: next,
          },
        ])
      }
      return next
    })
  }, [maxStep])

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(advanceStep, 1200)
    return () => clearInterval(id)
  }, [isPlaying, advanceStep])

  const reset = () => {
    setCurrentStep(0)
    setCache([])
    setIsPlaying(false)
  }

  const computationsWithout = currentStep > 0 ? (currentStep * (currentStep + 1)) / 2 : 0
  const computationsWith = currentStep

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => {
            if (currentStep >= maxStep) reset()
            else setIsPlaying(!isPlaying)
          }}
          className="px-4 py-2 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors font-medium text-sm"
        >
          {currentStep >= maxStep ? '↺ Reset' : isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        {!isPlaying && currentStep < maxStep && (
          <button
            onClick={advanceStep}
            className="px-4 py-2 rounded-lg bg-surface-elevated border border-border text-text hover:border-primary/40 transition-colors text-sm"
          >
            Step →
          </button>
        )}
        <span className="text-sm text-muted">
          Step {currentStep} / {maxStep}
        </span>
      </div>

      {/* Token sequence */}
      <div>
        <div className="text-xs text-muted uppercase tracking-wider mb-2">Input Sequence</div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_TOKENS.map((token, i) => {
            const processed = i < currentStep
            const isCurrently = i === currentStep - 1
            return (
              <motion.div
                key={i}
                animate={{
                  scale: isCurrently ? 1.1 : 1,
                  borderColor: isCurrently
                    ? 'rgb(var(--color-primary))'
                    : processed
                      ? 'rgba(var(--color-primary), 0.3)'
                      : 'rgba(255,255,255,0.1)',
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono border transition-colors ${
                  processed
                    ? 'bg-primary/10 text-primary-light'
                    : 'bg-surface text-muted'
                }`}
              >
                {token}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* KV Cache table */}
      <div>
        <div className="text-xs text-muted uppercase tracking-wider mb-2">KV Cache</div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-elevated border-b border-border text-xs sm:text-[10px] uppercase tracking-widest text-muted">
                <th className="py-3 px-4 text-left">Pos</th>
                <th className="py-3 px-4 text-left">Token</th>
                <th className="py-3 px-4 text-left">Key Vector</th>
                <th className="py-3 px-4 text-left">Value Vector</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {cache.map((entry, i) => (
                  <motion.tr
                    key={entry.step}
                    initial={{ opacity: 0, x: -20, backgroundColor: 'rgba(var(--color-primary), 0.15)' }}
                    animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                    transition={{ duration: 0.5 }}
                    className="border-b border-border/50"
                  >
                    <td className="py-2 px-4 text-muted font-mono">{i}</td>
                    <td className="py-2 px-4 text-text font-medium font-mono">{entry.token}</td>
                    <td className="py-2 px-4">
                      <VectorCell values={entry.key} color="text-cyan-400" />
                    </td>
                    <td className="py-2 px-4">
                      <VectorCell values={entry.value} color="text-orange-400" />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {cache.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted text-sm">
                    Press Play or Step to start generating tokens...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Computation comparison */}
      {currentStep > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <div className="text-xs text-red-400 uppercase tracking-wider mb-1">Without KV Cache</div>
            <div className="text-2xl font-bold text-red-400">{computationsWithout}</div>
            <div className="text-xs text-muted mt-1">
              attention computations (recompute all previous tokens each step)
            </div>
          </div>
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <div className="text-xs text-green-400 uppercase tracking-wider mb-1">With KV Cache</div>
            <div className="text-2xl font-bold text-green-400">{computationsWith}</div>
            <div className="text-xs text-muted mt-1">
              new computations (only the new token against cached K/V)
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Memory growth visualization
function MemoryGrowthChart() {
  const [seqLen, setSeqLen] = useState(512)
  const [numLayers, setNumLayers] = useState(32)
  const [dModel, setDModel] = useState(4096)
  const [numKvHeads, setNumKvHeads] = useState(32) // MHA default

  // KV cache memory: 2 * num_layers * seq_len * d_head * num_kv_heads * 2 bytes (fp16)
  const dHead = dModel / 32 // assume 32 heads for d_head calculation
  const memoryBytes = 2 * numLayers * seqLen * dHead * numKvHeads * 2
  const memoryMB = memoryBytes / (1024 * 1024)

  // Compare MHA vs GQA vs MQA
  const mhaMemMB = (2 * numLayers * seqLen * dHead * 32 * 2) / (1024 * 1024)
  const gqaMemMB = (2 * numLayers * seqLen * dHead * 8 * 2) / (1024 * 1024)
  const mqaMemMB = (2 * numLayers * seqLen * dHead * 1 * 2) / (1024 * 1024)
  const maxMem = Math.max(mhaMemMB, 0.1)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted uppercase tracking-wider">
            Sequence Length: <span className="text-text font-mono">{seqLen}</span>
          </label>
          <input
            type="range"
            min={128}
            max={32768}
            step={128}
            value={seqLen}
            onChange={(e) => setSeqLen(Number(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
        </div>
        <div>
          <label className="text-xs text-muted uppercase tracking-wider">
            Layers: <span className="text-text font-mono">{numLayers}</span>
          </label>
          <input
            type="range"
            min={8}
            max={80}
            step={8}
            value={numLayers}
            onChange={(e) => setNumLayers(Number(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
        </div>
      </div>

      {/* Memory bars comparison */}
      <div className="space-y-3">
        <div className="text-xs text-muted uppercase tracking-wider">KV Cache Memory by Attention Type</div>
        {[
          { label: 'MHA (32 heads)', mem: mhaMemMB, color: 'bg-red-500', textColor: 'text-red-400' },
          { label: 'GQA (8 groups)', mem: gqaMemMB, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
          { label: 'MQA (1 head)', mem: mqaMemMB, color: 'bg-green-500', textColor: 'text-green-400' },
        ].map(({ label, mem, color, textColor }) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className={textColor}>{label}</span>
              <span className="text-muted font-mono">{mem.toFixed(1)} MB</span>
            </div>
            <div className="h-4 bg-surface rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max((mem / maxMem) * 100, 1)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-surface border border-border text-sm text-muted">
        <strong className="text-text">Formula:</strong>{' '}
        Memory = 2 × layers × seq_len × d_head × num_kv_heads × 2 bytes (FP16)
        <br />
        <span className="text-xs mt-1 block">
          GQA uses 8 KV heads (¼ of MHA), MQA uses just 1 KV head (1/32 of MHA).
          This is why models like Llama 3 use GQA — massive memory savings with minimal quality loss.
        </span>
      </div>
    </div>
  )
}

export function KVCacheVisualizer() {
  const [tab, setTab] = useState<'mechanism' | 'memory'>('mechanism')

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2">
        {[
          { id: 'mechanism' as const, label: '⚙️ Cache Mechanism' },
          { id: 'memory' as const, label: '📊 Memory Impact' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-primary/20 text-primary-light border border-primary/40'
                : 'bg-surface border border-border text-muted hover:text-text hover:border-primary/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'mechanism' ? <KVCacheStepDemo /> : <MemoryGrowthChart />}
    </div>
  )
}
