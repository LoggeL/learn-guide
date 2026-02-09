'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Data ──────────────────────────────────────────────────────────────
const BATCH_DATA = [
  { batch: 1,   throughput: 225,  latency: 4.4 },
  { batch: 2,   throughput: 440,  latency: 4.5 },
  { batch: 4,   throughput: 850,  latency: 4.7 },
  { batch: 8,   throughput: 1500, latency: 5.3 },
  { batch: 16,  throughput: 2600, latency: 6.2 },
  { batch: 32,  throughput: 4000, latency: 8.0 },
  { batch: 64,  throughput: 5400, latency: 11.9 },
  { batch: 128, throughput: 6500, latency: 19.7 },
  { batch: 256, throughput: 7600, latency: 33.7 },
]

const MAX_THROUGHPUT = 8000
const MAX_LATENCY = 36

// ── 1. Throughput Chart ───────────────────────────────────────────────
function ThroughputChart({ t }: { t: Record<string, string> }) {
  const [idx, setIdx] = useState(0)
  const d = BATCH_DATA[idx]

  return (
    <div className="space-y-6">
      {/* Slider */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-sm text-muted font-medium">{t.batchSizeLabel}: <span className="text-primary-light font-bold">{d.batch}</span></label>
        <input
          type="range"
          min={0}
          max={BATCH_DATA.length - 1}
          value={idx}
          onChange={e => setIdx(Number(e.target.value))}
          className="w-full max-w-md accent-primary"
        />
        <div className="flex justify-between w-full max-w-md text-xs text-muted">
          <span>1</span><span>256</span>
        </div>
      </div>

      {/* Dual bars */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Throughput */}
        <div className="p-5 rounded-xl bg-surface border border-border">
          <div className="text-sm text-muted mb-2">{t.throughputLabel}</div>
          <div className="text-3xl font-bold text-cyan-400 font-mono">{d.throughput.toLocaleString()} <span className="text-sm text-muted">{t.tokPerSec}</span></div>
          <div className="mt-3 h-4 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={false}
              animate={{ width: `${(d.throughput / MAX_THROUGHPUT) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
        {/* Latency */}
        <div className="p-5 rounded-xl bg-surface border border-border">
          <div className="text-sm text-muted mb-2">{t.latencyLabel}</div>
          <div className="text-3xl font-bold text-orange-400 font-mono">{d.latency.toFixed(1)} <span className="text-sm text-muted">{t.msPerTok}</span></div>
          <div className="mt-3 h-4 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={false}
              animate={{ width: `${(d.latency / MAX_LATENCY) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5 rounded-xl bg-surface border border-border">
        <div className="flex items-end gap-1 h-48">
          {BATCH_DATA.map((point, i) => (
            <div key={point.batch} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <motion.div
                className={`w-full rounded-t-md ${i === idx ? 'bg-cyan-400' : 'bg-cyan-500/30'}`}
                initial={false}
                animate={{ height: `${(point.throughput / MAX_THROUGHPUT) * 100}%` }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              />
              <span className={`text-xs ${i === idx ? 'text-cyan-400 font-bold' : 'text-muted'}`}>{point.batch}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plateau callout */}
      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm text-muted">
        <span className="text-orange-400 font-semibold">⚠️ {t.improvementNote}</span>
        <p className="mt-1">{t.plateauExplain}</p>
      </div>
    </div>
  )
}

// ── 2. Prefill vs Decode ──────────────────────────────────────────────
function PrefillDecodeViz({ t }: { t: Record<string, string> }) {
  const [step, setStep] = useState(0)
  const [auto, setAuto] = useState(false)
  const promptTokens = ['What', 'is', 'the', 'capital', 'of', 'France', '?']
  const outputTokens = ['The', 'capital', 'of', 'France', 'is', 'Paris', '.']

  useEffect(() => {
    if (!auto) return
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= 1 + outputTokens.length) { setAuto(false); return s }
        return s + 1
      })
    }, 800)
    return () => clearInterval(timer)
  }, [auto, outputTokens.length])

  const reset = useCallback(() => { setStep(0); setAuto(false) }, [])

  const isPrefillDone = step >= 1
  const decodedCount = Math.max(0, step - 1)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button onClick={() => setAuto(true)} disabled={auto} className="px-4 py-2 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 disabled:opacity-50 text-sm font-medium transition-colors">
          ▶ {t.phaseAnimTitle}
        </button>
        <button onClick={reset} className="px-4 py-2 rounded-lg bg-surface border border-border text-muted hover:text-text text-sm font-medium transition-colors">
          ↺ Reset
        </button>
      </div>

      {/* Phase indicator */}
      <div className="flex gap-2 justify-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${step === 0 ? 'bg-surface text-muted' : step === 1 ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40' : 'bg-emerald-500/10 text-emerald-400/60'}`}>
          {t.prefillLabel}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${step <= 1 ? 'bg-surface text-muted' : 'bg-purple-500/20 text-purple-400 ring-2 ring-purple-500/40'}`}>
          {t.decodeLabel}
        </span>
      </div>

      {/* Token flow */}
      <div className="p-5 rounded-xl bg-surface border border-border space-y-4">
        {/* Input tokens */}
        <div>
          <div className="text-xs text-muted mb-2">{t.promptIn}</div>
          <div className="flex flex-wrap gap-2">
            {promptTokens.map((tok, i) => (
              <motion.span
                key={i}
                className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-sm font-mono"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isPrefillDone ? 1 : 0.3, scale: isPrefillDone ? 1 : 0.9 }}
                transition={{ delay: isPrefillDone ? i * 0.03 : 0 }}
              >
                {tok}
              </motion.span>
            ))}
            <AnimatePresence>
              {isPrefillDone && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-emerald-400 self-center ml-1"
                >
                  ✓ {t.prefillBurst}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Arrow */}
        {isPrefillDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted text-lg">↓</motion.div>
        )}

        {/* Output tokens */}
        {isPrefillDone && (
          <div>
            <div className="text-xs text-muted mb-2">{t.tokensOut}</div>
            <div className="flex flex-wrap gap-2">
              {outputTokens.map((tok, i) => (
                <motion.span
                  key={i}
                  className={`px-2 py-1 rounded text-sm font-mono ${i < decodedCount ? 'bg-purple-500/20 text-purple-300' : 'bg-surface text-muted/30'}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: i < decodedCount ? 1 : 0.2, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {tok}
                </motion.span>
              ))}
              {decodedCount > 0 && decodedCount < outputTokens.length && (
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="text-purple-400 self-center"
                >▌</motion.span>
              )}
            </div>
            {decodedCount > 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-purple-400 mt-2">
                {t.decodeTrickle}
              </motion.p>
            )}
          </div>
        )}
      </div>

      {/* Comparison cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <h4 className="font-bold text-emerald-400 mb-2">{t.prefillTitle}</h4>
          <div className="space-y-2 text-sm text-muted">
            <div className="flex items-center gap-2"><span className="text-emerald-400">●</span> {t.computeBound}</div>
            <div className="flex items-center gap-2"><span className="text-emerald-400">●</span> {t.highUtil}</div>
            <div className="flex items-center gap-2"><span className="text-emerald-400">●</span> {t.parallelProcess}</div>
            <div className="flex items-center gap-2"><span className="text-emerald-400">●</span> {t.ttft}</div>
          </div>
          <p className="text-xs text-emerald-400/70 mt-3 italic">{t.prefillAnalogy}</p>
        </div>
        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <h4 className="font-bold text-purple-400 mb-2">{t.decodeTitle}</h4>
          <div className="space-y-2 text-sm text-muted">
            <div className="flex items-center gap-2"><span className="text-purple-400">●</span> {t.memoryBound}</div>
            <div className="flex items-center gap-2"><span className="text-purple-400">●</span> {t.lowUtil}</div>
            <div className="flex items-center gap-2"><span className="text-purple-400">●</span> {t.sequentialProcess}</div>
            <div className="flex items-center gap-2"><span className="text-purple-400">●</span> {t.tbot}</div>
          </div>
          <p className="text-xs text-purple-400/70 mt-3 italic">{t.decodeAnalogy}</p>
        </div>
      </div>

      {/* Key insight */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
        <p className="text-sm text-text font-medium leading-relaxed">💡 {t.keyInsight}</p>
      </div>
    </div>
  )
}

// ── 3. Tradeoff Viz ───────────────────────────────────────────────────
function TradeoffViz({ t }: { t: Record<string, string> }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-6 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-center">
        <div className="text-4xl mb-3">🐇</div>
        <h4 className="font-bold text-cyan-400 mb-2">{t.lowBatch}</h4>
        <div className="text-sm text-muted space-y-1">
          <div>~225 {t.tokPerSec}</div>
          <div>4.4 {t.msPerTok}</div>
        </div>
        <p className="text-xs text-muted mt-3">{t.lowBatchDesc}</p>
      </div>
      <div className="p-6 rounded-xl bg-orange-500/5 border border-orange-500/20 text-center">
        <div className="text-4xl mb-3">🏭</div>
        <h4 className="font-bold text-orange-400 mb-2">{t.highBatch}</h4>
        <div className="text-sm text-muted space-y-1">
          <div>~7,600 {t.tokPerSec}</div>
          <div>33.7 {t.msPerTok}</div>
        </div>
        <p className="text-xs text-muted mt-3">{t.highBatchDesc}</p>
      </div>
    </div>
  )
}

// ── 4. Continuous Batching Viz ────────────────────────────────────────
const SLOT_COUNT = 4
const STATIC_TIMELINE = 8
const CONTINUOUS_TIMELINE = 8

interface SlotState { active: boolean; label?: string }

function ContinuousBatchingViz({ t }: { t: Record<string, string> }) {
  // Static: all slots busy for different durations, but all wait for longest
  const staticSlots: SlotState[][] = Array.from({ length: STATIC_TIMELINE }, (_, step) => {
    const lengths = [3, 5, 8, 4] // different request durations
    return Array.from({ length: SLOT_COUNT }, (_, s) => ({
      active: step < lengths[s],
      label: step >= lengths[s] ? t.idleLabel : undefined,
    }))
  })

  // Continuous: requests leave and new ones join
  const continuousSlots: SlotState[][] = Array.from({ length: CONTINUOUS_TIMELINE }, (_, step) => {
    return Array.from({ length: SLOT_COUNT }, (_, s) => {
      // Stagger completions and replacements
      const phases = [
        [true, true, true, false, true, true, true, true],  // slot 0: done at 3, replaced at 4
        [true, true, true, true, true, false, true, true],  // slot 1: done at 5, replaced at 6
        [true, true, true, true, true, true, true, true],   // slot 2: long running
        [true, true, true, true, false, true, true, true],  // slot 3: done at 4, replaced at 5
      ]
      return { active: phases[s][step] }
    })
  })

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Static */}
      <div className="p-5 rounded-xl bg-surface border border-border">
        <h4 className="font-bold text-text mb-3">{t.staticBatchTitle}</h4>
        <p className="text-xs text-muted mb-4">{t.staticBatchDesc}</p>
        <div className="space-y-2">
          {Array.from({ length: SLOT_COUNT }, (_, s) => (
            <div key={s} className="flex items-center gap-1">
              <span className="text-xs text-muted w-12">{t.slotLabel} {s + 1}</span>
              <div className="flex gap-0.5 flex-1">
                {staticSlots.map((frame, step) => (
                  <div
                    key={step}
                    className={`flex-1 h-5 rounded-sm ${frame[s].active ? 'bg-cyan-500/40' : 'bg-red-500/20'}`}
                    title={frame[s].active ? t.activeLabel : t.idleLabel}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-3 text-xs text-muted">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-cyan-500/40" /> {t.activeLabel}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500/20" /> {t.idleLabel}</span>
        </div>
      </div>

      {/* Continuous */}
      <div className="p-5 rounded-xl bg-surface border border-primary/20">
        <h4 className="font-bold text-text mb-3">{t.continuousBatchTitle}</h4>
        <p className="text-xs text-muted mb-4">{t.continuousBatchDesc}</p>
        <div className="space-y-2">
          {Array.from({ length: SLOT_COUNT }, (_, s) => (
            <div key={s} className="flex items-center gap-1">
              <span className="text-xs text-muted w-12">{t.slotLabel} {s + 1}</span>
              <div className="flex gap-0.5 flex-1">
                {continuousSlots.map((frame, step) => {
                  const isNew = !frame[s].active
                  return (
                    <div
                      key={step}
                      className={`flex-1 h-5 rounded-sm ${isNew ? 'bg-emerald-500/30 border border-emerald-500/40' : 'bg-cyan-500/40'}`}
                      title={isNew ? t.newReqLabel : t.activeLabel}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-3 text-xs text-muted">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-cyan-500/40" /> {t.activeLabel}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500/40" /> {t.newReqLabel}</span>
        </div>
      </div>
    </div>
  )
}

// ── Main Export ────────────────────────────────────────────────────────
export function BatchingVisualizer({ section, t }: { section: 'throughput' | 'prefill' | 'tradeoff' | 'continuous'; t: Record<string, string> }) {
  switch (section) {
    case 'throughput': return <ThroughputChart t={t} />
    case 'prefill': return <PrefillDecodeViz t={t} />
    case 'tradeoff': return <TradeoffViz t={t} />
    case 'continuous': return <ContinuousBatchingViz t={t} />
  }
}
