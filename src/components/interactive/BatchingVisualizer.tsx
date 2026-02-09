'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Data ──────────────────────────────────────────────────────────────
const BATCH_DATA = [
  { batch: 1,   totalThroughput: 45,   perUserTokS: 45 },
  { batch: 2,   totalThroughput: 88,   perUserTokS: 44 },
  { batch: 4,   totalThroughput: 168,  perUserTokS: 42 },
  { batch: 8,   totalThroughput: 312,  perUserTokS: 39 },
  { batch: 16,  totalThroughput: 560,  perUserTokS: 35 },
  { batch: 32,  totalThroughput: 896,  perUserTokS: 28 },
  { batch: 64,  totalThroughput: 1344, perUserTokS: 21 },
  { batch: 128, totalThroughput: 1920, perUserTokS: 15 },
  { batch: 256, totalThroughput: 2304, perUserTokS: 9 },
  { batch: 512, totalThroughput: 1536, perUserTokS: 3 },
  { batch: 1024,totalThroughput: 512,  perUserTokS: 0.5 },
]

const MAX_TOTAL = 2500
const MAX_PER_USER = 50

// ── 1. Throughput Chart ───────────────────────────────────────────────
function ThroughputChart({ t }: { t: Record<string, string> }) {
  const [idx, setIdx] = useState(0)
  const d = BATCH_DATA[idx]
  const isCollapse = d.batch >= 512

  return (
    <div className="space-y-6">
      {/* Slider */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-sm text-muted font-medium">
          {t.batchSizeLabel}: <span className={`font-bold ${isCollapse ? 'text-red-400' : 'text-primary-light'}`}>{d.batch}</span>
        </label>
        <input
          type="range" min={0} max={BATCH_DATA.length - 1} value={idx}
          onChange={e => setIdx(Number(e.target.value))}
          className="w-full max-w-md accent-primary"
        />
        <div className="flex justify-between w-full max-w-md text-xs text-muted">
          <span>1</span><span>1024</span>
        </div>
      </div>

      {/* Dual metric cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Total throughput */}
        <div className="p-5 rounded-xl bg-surface border border-border">
          <div className="text-sm text-muted mb-2">{t.totalThroughputLabel}</div>
          <div className={`text-3xl font-bold font-mono ${isCollapse ? 'text-red-400' : 'text-cyan-400'}`}>
            {d.totalThroughput.toLocaleString()} <span className="text-sm text-muted">{t.tokPerSec}</span>
          </div>
          <div className="mt-3 h-4 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className={`h-full rounded-full ${isCollapse ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
              initial={false}
              animate={{ width: `${(d.totalThroughput / MAX_TOTAL) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="text-xs text-muted mt-2">{t.totalThroughputHint}</div>
        </div>

        {/* Per-user speed */}
        <div className="p-5 rounded-xl bg-surface border border-border">
          <div className="text-sm text-muted mb-2">{t.perUserSpeedLabel}</div>
          <div className={`text-3xl font-bold font-mono ${d.perUserTokS < 5 ? 'text-red-400' : d.perUserTokS < 20 ? 'text-orange-400' : 'text-emerald-400'}`}>
            {d.perUserTokS < 1 ? d.perUserTokS.toFixed(1) : d.perUserTokS} <span className="text-sm text-muted">{t.tokPerSec}</span>
          </div>
          <div className="mt-3 h-4 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className={`h-full rounded-full ${d.perUserTokS < 5 ? 'bg-gradient-to-r from-red-500 to-orange-500' : d.perUserTokS < 20 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
              initial={false}
              animate={{ width: `${(d.perUserTokS / MAX_PER_USER) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="text-xs text-muted mt-2">{t.perUserSpeedHint}</div>
        </div>
      </div>

      {/* Bar chart with both metrics */}
      <div className="p-5 rounded-xl bg-surface border border-border">
        <div className="flex gap-4 mb-3 text-xs text-muted">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-cyan-500" /> {t.totalThroughputLabel}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500" /> {t.perUserSpeedLabel}</span>
        </div>
        <div className="flex items-end gap-1 h-48">
          {BATCH_DATA.map((point, i) => {
            const isOom = point.batch >= 512
            return (
              <div key={point.batch} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end relative">
                {/* Total throughput bar */}
                <motion.div
                  className={`w-full rounded-t-md ${i === idx ? (isOom ? 'bg-red-400' : 'bg-cyan-400') : (isOom ? 'bg-red-500/30' : 'bg-cyan-500/30')}`}
                  initial={false}
                  animate={{ height: `${(point.totalThroughput / MAX_TOTAL) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                />
                {/* Per-user overlay dot */}
                <motion.div
                  className="absolute w-2 h-2 rounded-full bg-emerald-400 border border-emerald-300"
                  initial={false}
                  animate={{ bottom: `${(point.perUserTokS / MAX_PER_USER) * 192 + 20}px` }}
                  transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                />
                <span className={`text-xs ${i === idx ? (isOom ? 'text-red-400 font-bold' : 'text-cyan-400 font-bold') : 'text-muted'}`}>
                  {point.batch}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Collapse warning */}
      <AnimatePresence>
        {isCollapse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm"
          >
            <span className="text-red-400 font-semibold">🔥 {t.collapseWarning}</span>
            <p className="mt-1 text-muted">{t.collapseExplain}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isCollapse && (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm text-muted">
          <span className="text-orange-400 font-semibold">⚠️ {t.improvementNote}</span>
          <p className="mt-1">{t.plateauExplain}</p>
        </div>
      )}
    </div>
  )
}

// ── 2. Prefill vs Decode ──────────────────────────────────────────────
function PrefillDecodeViz({ t }: { t: Record<string, string> }) {
  const [step, setStep] = useState(0)
  const [auto, setAuto] = useState(false)
  const [raceRunning, setRaceRunning] = useState(false)
  const [prefillProgress, setPrefillProgress] = useState(0)
  const [decodeProgress, setDecodeProgress] = useState(0)
  const raceRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  // Race visualization
  const startRace = useCallback(() => {
    setPrefillProgress(0)
    setDecodeProgress(0)
    setRaceRunning(true)
    if (raceRef.current) clearInterval(raceRef.current)
    let pf = 0, dc = 0
    raceRef.current = setInterval(() => {
      pf = Math.min(1000, pf + 50) // prefill: 50 tokens per tick (parallel)
      dc = Math.min(1000, dc + 1)  // decode: 1 token per tick (sequential)
      setPrefillProgress(pf)
      setDecodeProgress(dc)
      if (pf >= 1000) {
        if (raceRef.current) clearInterval(raceRef.current)
        setRaceRunning(false)
      }
    }, 30)
  }, [])

  useEffect(() => { return () => { if (raceRef.current) clearInterval(raceRef.current) } }, [])

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-3 justify-center flex-wrap">
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
        <div>
          <div className="text-xs text-muted mb-2">{t.promptIn}</div>
          <div className="flex flex-wrap gap-2">
            {promptTokens.map((tok, i) => (
              <motion.span key={i} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-sm font-mono"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isPrefillDone ? 1 : 0.3, scale: isPrefillDone ? 1 : 0.9 }}
                transition={{ delay: isPrefillDone ? i * 0.03 : 0 }}
              >{tok}</motion.span>
            ))}
            <AnimatePresence>
              {isPrefillDone && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-emerald-400 self-center ml-1">✓ {t.prefillBurst}</motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {isPrefillDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted text-lg">↓</motion.div>
        )}

        {isPrefillDone && (
          <div>
            <div className="text-xs text-muted mb-2">{t.tokensOut}</div>
            <div className="flex flex-wrap gap-2">
              {outputTokens.map((tok, i) => (
                <motion.span key={i}
                  className={`px-2 py-1 rounded text-sm font-mono ${i < decodedCount ? 'bg-purple-500/20 text-purple-300' : 'bg-surface text-muted/30'}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: i < decodedCount ? 1 : 0.2, y: 0 }}
                  transition={{ delay: 0.1 }}
                >{tok}</motion.span>
              ))}
              {decodedCount > 0 && decodedCount < outputTokens.length && (
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8 }}
                  className="text-purple-400 self-center">▌</motion.span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Speed Race */}
      <div className="p-5 rounded-xl bg-surface border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-text text-sm">{t.raceTitle}</h4>
          <button onClick={startRace} disabled={raceRunning}
            className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 disabled:opacity-50 text-xs font-medium transition-colors">
            🏁 {t.raceStart}
          </button>
        </div>
        <p className="text-xs text-muted">{t.raceDesc}</p>

        {/* Prefill bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-emerald-400 font-medium">{t.prefillLabel}</span>
            <span className="text-emerald-400 font-mono">{prefillProgress}/1000 {t.tokensProcessed}</span>
          </div>
          <div className="h-6 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              initial={false} animate={{ width: `${(prefillProgress / 1000) * 100}%` }}
              transition={{ duration: 0.05 }} />
          </div>
        </div>

        {/* Decode bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-purple-400 font-medium">{t.decodeLabel}</span>
            <span className="text-purple-400 font-mono">{decodeProgress}/1000 {t.tokensProcessed}</span>
          </div>
          <div className="h-6 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={false} animate={{ width: `${(decodeProgress / 1000) * 100}%` }}
              transition={{ duration: 0.05 }} />
          </div>
        </div>

        {prefillProgress >= 1000 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-cyan-400 font-medium text-center">
            {t.raceResult}
          </motion.p>
        )}
      </div>

      {/* Roofline concept */}
      <div className="p-5 rounded-xl bg-surface border border-border">
        <h4 className="font-bold text-text text-sm mb-3">{t.rooflineTitle}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-sm font-bold text-emerald-400 mb-1">{t.prefillLabel}</div>
            <div className="text-xs text-muted mb-2">{t.limitedBy}: <span className="text-emerald-400 font-semibold">{t.computeFlops}</span></div>
            <div className="text-lg font-mono font-bold text-emerald-400">312 TFLOPS</div>
            <div className="text-xs text-muted mt-1">{t.tensorCoreBottleneck}</div>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 text-center">
            <div className="text-3xl mb-2">🐌</div>
            <div className="text-sm font-bold text-purple-400 mb-1">{t.decodeLabel}</div>
            <div className="text-xs text-muted mb-2">{t.limitedBy}: <span className="text-purple-400 font-semibold">{t.memBandwidth}</span></div>
            <div className="text-lg font-mono font-bold text-purple-400">2 TB/s</div>
            <div className="text-xs text-muted mt-1">{t.dramBottleneck}</div>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-text leading-relaxed">{t.arithmeticIntensity}</p>
        </div>
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
            <div className="flex items-center gap-2"><span className="text-emerald-400">●</span> {t.prefillSpeed}</div>
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
            <div className="flex items-center gap-2"><span className="text-purple-400">●</span> {t.decodeSpeed}</div>
          </div>
          <p className="text-xs text-purple-400/70 mt-3 italic">{t.decodeAnalogy}</p>
        </div>
      </div>

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
          <div>~45 {t.tokPerSec} {t.totalWord}</div>
          <div>~45 {t.tokPerSec} {t.perUserWord}</div>
        </div>
        <p className="text-xs text-muted mt-3">{t.lowBatchDesc}</p>
      </div>
      <div className="p-6 rounded-xl bg-orange-500/5 border border-orange-500/20 text-center">
        <div className="text-4xl mb-3">🏭</div>
        <h4 className="font-bold text-orange-400 mb-2">{t.highBatch}</h4>
        <div className="text-sm text-muted space-y-1">
          <div>~2,304 {t.tokPerSec} {t.totalWord}</div>
          <div>~9 {t.tokPerSec} {t.perUserWord}</div>
        </div>
        <p className="text-xs text-muted mt-3">{t.highBatchDesc}</p>
      </div>
    </div>
  )
}

// ── 4. Continuous Batching Viz (Interactive & Animated) ───────────────
const SLOT_COUNT = 4
const COLORS = ['bg-cyan-500/50', 'bg-emerald-500/50', 'bg-purple-500/50', 'bg-orange-500/50', 'bg-pink-500/50', 'bg-yellow-500/50', 'bg-teal-500/50', 'bg-blue-500/50']

interface Request {
  id: number
  slot: number
  startStep: number
  duration: number
  color: string
}

function ContinuousBatchingViz({ t }: { t: Record<string, string> }) {
  const [playing, setPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [mode, setMode] = useState<'static' | 'continuous'>('continuous')
  const maxSteps = 20
  const nextId = useRef(0)

  // Static scenario
  const [staticRequests] = useState<Request[]>(() => {
    const reqs: Request[] = []
    const durations = [6, 10, 15, 8]
    for (let s = 0; s < SLOT_COUNT; s++) {
      reqs.push({ id: nextId.current++, slot: s, startStep: 0, duration: durations[s], color: COLORS[s % COLORS.length] })
    }
    return reqs
  })

  const [contRequests, setContRequests] = useState<Request[]>(() => {
    const reqs: Request[] = []
    const durations = [6, 10, 15, 8]
    for (let s = 0; s < SLOT_COUNT; s++) {
      reqs.push({ id: nextId.current++, slot: s, startStep: 0, duration: durations[s], color: COLORS[s % COLORS.length] })
    }
    return reqs
  })

  // Continuous: when a request finishes, add a new one
  useEffect(() => {
    if (mode !== 'continuous' || !playing) return
    setContRequests(prev => {
      const newReqs = [...prev]
      let changed = false
      for (let s = 0; s < SLOT_COUNT; s++) {
        const active = newReqs.find(r => r.slot === s && r.startStep + r.duration > currentStep && r.startStep <= currentStep)
        if (!active && currentStep > 0) {
          const dur = 4 + Math.floor(Math.random() * 8)
          newReqs.push({ id: nextId.current++, slot: s, startStep: currentStep, duration: dur, color: COLORS[nextId.current % COLORS.length] })
          changed = true
        }
      }
      return changed ? newReqs : prev
    })
  }, [currentStep, mode, playing])

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => {
      setCurrentStep(s => {
        if (s >= maxSteps - 1) { setPlaying(false); return s }
        return s + 1
      })
    }, 400)
    return () => clearInterval(timer)
  }, [playing])

  const resetAll = () => {
    setPlaying(false)
    setCurrentStep(0)
    nextId.current = 0
    const durations = [6, 10, 15, 8]
    const reqs: Request[] = []
    for (let s = 0; s < SLOT_COUNT; s++) {
      reqs.push({ id: nextId.current++, slot: s, startStep: 0, duration: durations[s], color: COLORS[s % COLORS.length] })
    }
    setContRequests(reqs)
  }

  const addRequest = () => {
    // Find an empty slot
    const activeSlots = new Set(contRequests.filter(r => r.startStep + r.duration > currentStep && r.startStep <= currentStep).map(r => r.slot))
    for (let s = 0; s < SLOT_COUNT; s++) {
      if (!activeSlots.has(s)) {
        const dur = 4 + Math.floor(Math.random() * 8)
        setContRequests(prev => [...prev, { id: nextId.current++, slot: s, startStep: currentStep, duration: dur, color: COLORS[nextId.current % COLORS.length] }])
        return
      }
    }
  }

  const getSlotStatus = (requests: Request[], slot: number, step: number) => {
    return requests.find(r => r.slot === slot && r.startStep <= step && r.startStep + r.duration > step)
  }

  // GPU utilization
  const getUtilization = (requests: Request[], step: number, isStatic: boolean) => {
    if (isStatic) {
      // Static: longest request determines batch end
      const longestDur = Math.max(...requests.filter(r => r.startStep === 0).map(r => r.duration))
      if (step >= longestDur) return 0
      let active = 0
      for (let s = 0; s < SLOT_COUNT; s++) {
        if (getSlotStatus(requests, s, step)) active++
      }
      return (active / SLOT_COUNT) * 100
    }
    let active = 0
    for (let s = 0; s < SLOT_COUNT; s++) {
      if (getSlotStatus(requests, s, step)) active++
    }
    return (active / SLOT_COUNT) * 100
  }

  const staticUtil = getUtilization(staticRequests, currentStep, true)
  const contUtil = getUtilization(contRequests, currentStep, false)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={() => setPlaying(!playing)} className="px-4 py-2 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 text-sm font-medium transition-colors">
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={resetAll} className="px-4 py-2 rounded-lg bg-surface border border-border text-muted hover:text-text text-sm font-medium transition-colors">
          ↺ Reset
        </button>
        {mode === 'continuous' && (
          <button onClick={addRequest} className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm font-medium transition-colors">
            + {t.addRequest}
          </button>
        )}
      </div>

      {/* Step indicator */}
      <div className="text-center text-sm text-muted">
        {t.timeStep}: <span className="text-primary-light font-mono font-bold">{currentStep}</span> / {maxSteps - 1}
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 justify-center">
        <button onClick={() => { setMode('static'); resetAll() }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'static' ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/40' : 'bg-surface text-muted'}`}>
          {t.staticBatchTitle}
        </button>
        <button onClick={() => { setMode('continuous'); resetAll() }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'continuous' ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-surface text-muted'}`}>
          {t.continuousBatchTitle}
        </button>
      </div>

      {/* Timeline grid */}
      <div className="p-5 rounded-xl bg-surface border border-border">
        <div className="space-y-2">
          {Array.from({ length: SLOT_COUNT }, (_, s) => {
            const requests = mode === 'static' ? staticRequests : contRequests
            return (
              <div key={s} className="flex items-center gap-1">
                <span className="text-xs text-muted w-12">{t.slotLabel} {s + 1}</span>
                <div className="flex gap-0.5 flex-1">
                  {Array.from({ length: maxSteps }, (_, step) => {
                    const req = getSlotStatus(requests, s, step)
                    const isCurrent = step === currentStep
                    const isPast = step < currentStep

                    // Static mode: after longest request, everything is idle
                    let isIdle = false
                    if (mode === 'static') {
                      const longestDur = Math.max(...staticRequests.filter(r => r.startStep === 0).map(r => r.duration))
                      if (step < longestDur && !req) isIdle = true
                      if (step >= longestDur) isIdle = true
                    }

                    return (
                      <div key={step}
                        className={`flex-1 h-6 rounded-sm transition-all duration-200 ${
                          req && isPast ? req.color :
                          req && isCurrent ? `${req.color} ring-1 ring-white/30` :
                          req ? 'bg-surface/50' :
                          isIdle && isPast ? 'bg-red-500/20' :
                          'bg-surface/30'
                        } ${isCurrent ? 'ring-1 ring-primary/50' : ''}`}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* GPU Utilization */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-muted">{t.gpuUtilization}</span>
            <span className={`font-mono font-bold ${(mode === 'static' ? staticUtil : contUtil) > 75 ? 'text-emerald-400' : (mode === 'static' ? staticUtil : contUtil) > 25 ? 'text-orange-400' : 'text-red-400'}`}>
              {Math.round(mode === 'static' ? staticUtil : contUtil)}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className={`h-full rounded-full ${(mode === 'static' ? staticUtil : contUtil) > 75 ? 'bg-emerald-500' : (mode === 'static' ? staticUtil : contUtil) > 25 ? 'bg-orange-500' : 'bg-red-500'}`}
              initial={false}
              animate={{ width: `${mode === 'static' ? staticUtil : contUtil}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-3 mt-3 text-xs text-muted flex-wrap">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-cyan-500/50" /> {t.activeLabel}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500/20" /> {t.idleLabel}</span>
          {mode === 'continuous' && (
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/50" /> {t.newReqLabel}</span>
          )}
        </div>
      </div>

      {/* Insight */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
        <p className="text-sm text-text leading-relaxed">💡 {mode === 'static' ? t.staticInsight : t.continuousInsight}</p>
      </div>
    </div>
  )
}

// ── 5. Per-User vs System Throughput ──────────────────────────────────
function PerUserVsSystemViz({ t }: { t: Record<string, string> }) {
  const [users, setUsers] = useState(1)
  const maxUsers = 128

  // Model: per-user speed drops, total goes up then collapses
  const perUser = Math.max(0.5, 45 * Math.exp(-0.025 * users))
  const total = users <= 80
    ? perUser * users
    : perUser * users * Math.max(0.1, 1 - ((users - 80) / 80) ** 1.5)

  const avatars = Math.min(users, 32) // show max 32 avatar icons

  return (
    <div className="space-y-6">
      {/* Slider */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-sm text-muted font-medium">
          {t.concurrentUsers}: <span className={`font-bold ${users > 80 ? 'text-red-400' : 'text-primary-light'}`}>{users}</span>
        </label>
        <input type="range" min={1} max={maxUsers} value={users} onChange={e => setUsers(Number(e.target.value))}
          className="w-full max-w-md accent-primary" />
        <div className="flex justify-between w-full max-w-md text-xs text-muted">
          <span>1</span><span>{maxUsers}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-surface border border-border">
          <div className="text-sm text-muted mb-2">{t.perUserSpeedLabel}</div>
          <div className={`text-3xl font-bold font-mono ${perUser < 5 ? 'text-red-400' : perUser < 15 ? 'text-orange-400' : 'text-emerald-400'}`}>
            {perUser.toFixed(1)} <span className="text-sm text-muted">{t.tokPerSec}</span>
          </div>
          <div className="mt-3 h-4 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className={`h-full rounded-full ${perUser < 5 ? 'bg-gradient-to-r from-red-500 to-orange-500' : perUser < 15 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
              initial={false} animate={{ width: `${(perUser / 50) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
        <div className="p-5 rounded-xl bg-surface border border-border">
          <div className="text-sm text-muted mb-2">{t.totalThroughputLabel}</div>
          <div className={`text-3xl font-bold font-mono ${users > 100 ? 'text-red-400' : 'text-cyan-400'}`}>
            {Math.round(total).toLocaleString()} <span className="text-sm text-muted">{t.tokPerSec}</span>
          </div>
          <div className="mt-3 h-4 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className={`h-full rounded-full ${users > 100 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
              initial={false} animate={{ width: `${Math.min(100, (total / 2000) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      </div>

      {/* User avatars */}
      <div className="p-5 rounded-xl bg-surface border border-border">
        <div className="text-xs text-muted mb-3">{t.bandwidthPerUser}</div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: avatars }, (_, i) => {
            const opacity = Math.max(0.2, perUser / 45)
            return (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.02, type: 'spring', stiffness: 300, damping: 20 }}
                className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center"
                style={{ opacity }}>
                <span className="text-xs">👤</span>
              </motion.div>
            )
          })}
          {users > 32 && <span className="self-center text-xs text-muted ml-2">+{users - 32} {t.moreUsers}</span>}
        </div>
        <div className="mt-3 text-xs text-muted">
          {t.eachUserGets}: <span className={`font-mono font-bold ${perUser < 5 ? 'text-red-400' : 'text-emerald-400'}`}>{perUser.toFixed(1)} {t.tokPerSec}</span>
        </div>
      </div>

      {/* Collapse warning */}
      <AnimatePresence>
        {users > 80 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm">
            <span className="text-red-400 font-semibold">🔥 {t.systemOverload}</span>
            <p className="mt-1 text-muted">{t.overloadExplain}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Export ────────────────────────────────────────────────────────
export function BatchingVisualizer({ section, t }: { section: 'throughput' | 'prefill' | 'tradeoff' | 'continuous' | 'peruser'; t: Record<string, string> }) {
  switch (section) {
    case 'throughput': return <ThroughputChart t={t} />
    case 'prefill': return <PrefillDecodeViz t={t} />
    case 'tradeoff': return <TradeoffViz t={t} />
    case 'continuous': return <ContinuousBatchingViz t={t} />
    case 'peruser': return <PerUserVsSystemViz t={t} />
  }
}
