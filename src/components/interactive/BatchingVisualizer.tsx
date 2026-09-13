'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { batchRoofline } from '@/lib/inference-math'

function Roofline() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [batch, setBatch] = useState(16),
    [context, setContext] = useState(512),
    [capacity, setCapacity] = useState(80)
  const result = batchRoofline(batch, context, capacity)
  const rows = [
    [c.roofMemory, result.memoryMs.toFixed(2)],
    [c.roofCompute, result.computeMs.toFixed(2)],
    [c.roofStep, result.stepMs.toFixed(2)],
    [c.memory, ((result.memoryGB * 1e9) / 2 ** 30).toFixed(2)],
  ]
  return (
    <div className="space-y-5">
      <h3 className="text-xl text-gradient">{c.roofTitle}</h3>
      <p className="text-sm text-muted">{c.roofNote}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <label>
          {c.batch}: {batch}
          <input
            aria-label={c.batch}
            type="range"
            min={1}
            max={1024}
            value={batch}
            onChange={(e) => setBatch(+e.target.value)}
            className="w-full"
          />
        </label>
        <label>
          {c.sequence}: {context}
          <input
            aria-label={c.sequence}
            type="range"
            min={64}
            max={8192}
            step={64}
            value={context}
            onChange={(e) => setContext(+e.target.value)}
            className="w-full"
          />
        </label>
        <label>
          {c.capacity}: {capacity}
          <input
            aria-label={c.capacity}
            type="range"
            min={24}
            max={256}
            step={8}
            value={capacity}
            onChange={(e) => setCapacity(+e.target.value)}
            className="w-full"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border p-4">
            <div className="text-sm text-muted">{label}</div>
            <div className="text-2xl font-mono">{value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          [c.roofMemory, result.memoryMs, 'bg-cyan-400'],
          [c.roofCompute, result.computeMs, 'bg-violet-400'],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="text-xs text-muted">
            {label}
            <div className="h-3 rounded bg-background">
              <div
                className={`h-3 rounded ${color}`}
                style={{ width: (100 * Number(value)) / result.stepMs + '%' }}
              />
            </div>
          </div>
        ))}
      </div>
      {result.fits ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            {c.roofThroughput}: <strong>{result.total.toFixed(0)}</strong>
          </div>
          <div>
            {c.roofUser}: <strong>{result.perUser.toFixed(1)}</strong>
          </div>
        </div>
      ) : (
        <p role="status" className="text-orange-400">
          {c.roofOom}
        </p>
      )}
      <a
        href="https://jax-ml.github.io/scaling-book/inference/"
        className="text-sm text-primary-light underline"
        target="_blank"
        rel="noreferrer"
      >
        JAX Scaling Book: Inference
      </a>
    </div>
  )
}
function Prefill() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [step, setStep] = useState(0)
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{c.prefillNote}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border p-4">
          <h3>{t.batching.prefillLabel}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <span
                className={`rounded p-2 font-mono ${step > 0 ? 'bg-emerald-500/20' : 'bg-background text-muted'}`}
                key={i}
              >
                x{i + 1}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border p-4">
          <h3>{t.batching.decodeLabel}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <span
                className={`rounded p-2 font-mono ${step > i + 1 ? 'bg-violet-500/20' : 'bg-background text-muted'}`}
                key={i}
              >
                y{i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          disabled={step >= 7}
          className="rounded-lg border border-primary px-4 py-2 disabled:opacity-50"
          onClick={() => setStep((s) => s + 1)}
        >
          {c.step}
        </button>
        <button
          className="rounded-lg border border-border px-4 py-2"
          onClick={() => setStep(0)}
        >
          {c.reset}
        </button>
      </div>
    </div>
  )
}
const SLOT_COUNT = 4
const COLORS = [
  'bg-cyan-500/50',
  'bg-emerald-500/50',
  'bg-purple-500/50',
  'bg-orange-500/50',
  'bg-pink-500/50',
  'bg-yellow-500/50',
  'bg-teal-500/50',
  'bg-blue-500/50',
]

interface Request {
  id: number
  slot: number
  startStep: number
  duration: number
  color: string
}

function ContinuousBatchingViz({ t }: { t: Record<string, string> }) {
  const { t: dictionary } = useTranslation()
  const c = dictionary.vramCalc.audit
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
      reqs.push({
        id: nextId.current++,
        slot: s,
        startStep: 0,
        duration: durations[s],
        color: COLORS[s % COLORS.length],
      })
    }
    return reqs
  })

  const [contRequests, setContRequests] = useState<Request[]>(() => {
    const reqs: Request[] = []
    const durations = [6, 10, 15, 8]
    for (let s = 0; s < SLOT_COUNT; s++) {
      reqs.push({
        id: nextId.current++,
        slot: s,
        startStep: 0,
        duration: durations[s],
        color: COLORS[s % COLORS.length],
      })
    }
    return reqs
  })

  // Continuous: when a request finishes, add a new one
  useEffect(() => {
    if (mode !== 'continuous' || !playing || currentStep === 0) return
    const newReqs: Request[] = []
    for (let s = 0; s < SLOT_COUNT; s++) {
      const active = contRequests.find(
        (r) =>
          r.slot === s &&
          r.startStep + r.duration > currentStep &&
          r.startStep <= currentStep,
      )
      if (!active) {
        const id = nextId.current++
        const dur = 4 + Math.floor(Math.random() * 8)
        newReqs.push({
          id,
          slot: s,
          startStep: currentStep,
          duration: dur,
          color: COLORS[id % COLORS.length],
        })
      }
    }
    if (newReqs.length > 0) setContRequests((prev) => [...prev, ...newReqs])
  }, [currentStep, mode, playing, contRequests])

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => {
      setCurrentStep((s) => Math.min(s + 1, maxSteps - 1))
    }, 400)
    return () => clearInterval(timer)
  }, [playing])

  useEffect(() => {
    if (currentStep >= maxSteps - 1) setPlaying(false)
  }, [currentStep])

  const resetAll = () => {
    setPlaying(false)
    setCurrentStep(0)
    nextId.current = 0
    const durations = [6, 10, 15, 8]
    const reqs: Request[] = []
    for (let s = 0; s < SLOT_COUNT; s++) {
      reqs.push({
        id: nextId.current++,
        slot: s,
        startStep: 0,
        duration: durations[s],
        color: COLORS[s % COLORS.length],
      })
    }
    setContRequests(reqs)
  }

  const addRequest = () => {
    // Find an empty slot
    const activeSlots = new Set(
      contRequests
        .filter(
          (r) =>
            r.startStep + r.duration > currentStep &&
            r.startStep <= currentStep,
        )
        .map((r) => r.slot),
    )
    for (let s = 0; s < SLOT_COUNT; s++) {
      if (!activeSlots.has(s)) {
        const id = nextId.current++
        const dur = 4 + Math.floor(Math.random() * 8)
        const newReq: Request = {
          id,
          slot: s,
          startStep: currentStep,
          duration: dur,
          color: COLORS[id % COLORS.length],
        }
        setContRequests((prev) => [...prev, newReq])
        return
      }
    }
  }

  const getSlotStatus = (requests: Request[], slot: number, step: number) => {
    return requests.find(
      (r) =>
        r.slot === slot &&
        r.startStep <= step &&
        r.startStep + r.duration > step,
    )
  }

  // GPU utilization
  const getUtilization = (
    requests: Request[],
    step: number,
    isStatic: boolean,
  ) => {
    if (isStatic) {
      // Static: longest request determines batch end
      const longestDur = Math.max(
        ...requests.filter((r) => r.startStep === 0).map((r) => r.duration),
      )
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
        <button
          disabled={currentStep >= maxSteps - 1}
          onClick={() => setPlaying(!playing)}
          className="px-4 py-2 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {playing ? c.pause : c.run}
        </button>
        <button
          onClick={resetAll}
          className="px-4 py-2 rounded-lg bg-surface border border-border text-muted hover:text-text text-sm font-medium transition-colors"
        >
          {c.reset}
        </button>
        {mode === 'continuous' && (
          <button
            disabled={
              currentStep >= maxSteps - 1 ||
              contRequests.filter(
                (r) =>
                  r.startStep <= currentStep &&
                  r.startStep + r.duration > currentStep,
              ).length >= SLOT_COUNT
            }
            onClick={addRequest}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm font-medium transition-colors disabled:opacity-50"
          >
            + {t.addRequest}
          </button>
        )}
      </div>

      {/* Step indicator */}
      <div className="text-center text-sm text-muted">
        {t.timeStep}:{' '}
        <span className="text-primary-light font-mono font-bold">
          {currentStep}
        </span>{' '}
        / {maxSteps - 1}
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => {
            setMode('static')
            resetAll()
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'static' ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/40' : 'bg-surface text-muted'}`}
        >
          {t.staticBatchTitle}
        </button>
        <button
          onClick={() => {
            setMode('continuous')
            resetAll()
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'continuous' ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-surface text-muted'}`}
        >
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
                <span className="text-xs text-muted w-12">
                  {t.slotLabel} {s + 1}
                </span>
                <div className="flex gap-0.5 flex-1">
                  {Array.from({ length: maxSteps }, (_, step) => {
                    const req = getSlotStatus(requests, s, step)
                    const isCurrent = step === currentStep
                    const isPast = step < currentStep

                    // Static mode: after longest request, everything is idle
                    let isIdle = false
                    if (mode === 'static') {
                      const longestDur = Math.max(
                        ...staticRequests
                          .filter((r) => r.startStep === 0)
                          .map((r) => r.duration),
                      )
                      if (step < longestDur && !req) isIdle = true
                      if (step >= longestDur) isIdle = true
                    }

                    return (
                      <div
                        key={step}
                        className={`flex-1 h-6 rounded-sm transition-all duration-200 ${
                          req && isPast
                            ? req.color
                            : req && isCurrent
                              ? `${req.color} ring-1 ring-white/30`
                              : req
                                ? 'bg-surface/50'
                                : isIdle && isPast
                                  ? 'bg-red-500/20'
                                  : 'bg-surface/30'
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
            <span
              className={`font-mono font-bold ${(mode === 'static' ? staticUtil : contUtil) > 75 ? 'text-emerald-400' : (mode === 'static' ? staticUtil : contUtil) > 25 ? 'text-orange-400' : 'text-red-400'}`}
            >
              {Math.round(mode === 'static' ? staticUtil : contUtil)}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-surface overflow-hidden border border-border">
            <motion.div
              className={`h-full rounded-full ${(mode === 'static' ? staticUtil : contUtil) > 75 ? 'bg-emerald-500' : (mode === 'static' ? staticUtil : contUtil) > 25 ? 'bg-orange-500' : 'bg-red-500'}`}
              initial={false}
              animate={{
                width: `${mode === 'static' ? staticUtil : contUtil}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-3 mt-3 text-xs text-muted flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-cyan-500/50" />{' '}
            {t.activeLabel}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-red-500/20" /> {t.idleLabel}
          </span>
          {mode === 'continuous' && (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-emerald-500/50" />{' '}
              {t.newReqLabel}
            </span>
          )}
        </div>
      </div>

      {/* Insight */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
        <p className="text-sm text-text leading-relaxed">
          💡 {mode === 'static' ? t.staticInsight : t.continuousInsight}
        </p>
      </div>
    </div>
  )
}

export function BatchingVisualizer({
  section,
  t,
}: {
  section: 'throughput' | 'prefill' | 'tradeoff' | 'continuous' | 'peruser'
  t: Record<string, string>
}) {
  if (section === 'continuous') return <ContinuousBatchingViz t={t} />
  if (section === 'prefill') return <Prefill />
  return <Roofline />
}
