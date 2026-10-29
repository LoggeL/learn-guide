'use client'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { batchRoofline } from '@/lib/inference-math'
import {
  batchingContinuous,
  batchingOccupancy,
  batchingQueue,
  batchingStatic,
  type BatchingRun,
} from '@/lib/batching-math'

function Roofline() {
  const { t } = useTranslation()
  const c = t.batching
  const [batch, setBatch] = useState(16),
    [context, setContext] = useState(512),
    [capacity, setCapacity] = useState(80)
  const result = batchRoofline(batch, context, capacity)
  const rows = [
    [c.roofMemory, result.memoryMs.toFixed(2)],
    [c.roofCompute, result.computeMs.toFixed(2)],
    [c.roofStep, result.stepMs.toFixed(2)],
    [c.roofMemoryUse, ((result.memoryGB * 1e9) / 2 ** 30).toFixed(2)],
  ]
  return (
    <div className="space-y-5">
      <h3 className="text-xl text-gradient">{c.roofTitle}</h3>
      <p className="text-sm text-muted">{c.roofNote}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">
          {c.roofBatch}: {batch}
          <input
            aria-label={c.roofBatch}
            type="range"
            min={1}
            max={1024}
            value={batch}
            onChange={(e) => setBatch(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="text-sm">
          {c.roofContext}: {context}
          <input
            aria-label={c.roofContext}
            type="range"
            min={64}
            max={8192}
            step={64}
            value={context}
            onChange={(e) => setContext(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="text-sm">
          {c.roofCapacity}: {capacity}
          <input
            aria-label={c.roofCapacity}
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
        {c.roofSource}
      </a>
    </div>
  )
}

const SLOT_COUNT = 4
const HORIZON = 24
const QUEUE_LENGTH = 64
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

function findRun(runs: BatchingRun[], slot: number, step: number) {
  return runs.find((r) => r.slot === slot && r.start <= step && r.start + r.length > step)
}

function ContinuousBatchingViz() {
  const { t } = useTranslation()
  const c = t.batching
  const [seed, setSeed] = useState(1)
  const [mode, setMode] = useState<'static' | 'continuous'>('static')
  const [playing, setPlaying] = useState(false)
  // Number of decode steps already executed (0 … HORIZON).
  const [elapsed, setElapsed] = useState(0)

  // Both policies consume the same request queue, so the comparison is fair.
  const queue = useMemo(() => batchingQueue(seed, QUEUE_LENGTH), [seed])
  const runs = useMemo(
    () =>
      mode === 'static'
        ? batchingStatic(queue, SLOT_COUNT, HORIZON)
        : batchingContinuous(queue, SLOT_COUNT, HORIZON),
    [mode, queue],
  )
  const batchStarts = useMemo(
    () => (mode === 'static' ? new Set(runs.filter((r) => r.slot === 0 && r.start > 0).map((r) => r.start)) : new Set<number>()),
    [mode, runs],
  )
  const stats = batchingOccupancy(runs, SLOT_COUNT, elapsed)

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setElapsed((s) => Math.min(s + 1, HORIZON)), 350)
    return () => clearInterval(timer)
  }, [playing])

  useEffect(() => {
    if (elapsed >= HORIZON) setPlaying(false)
  }, [elapsed])

  const reset = () => {
    setPlaying(false)
    setElapsed(0)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={() => {
            setMode('static')
            reset()
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'static' ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/40' : 'bg-surface text-muted'}`}
        >
          {c.staticBatchTitle}
        </button>
        <button
          onClick={() => {
            setMode('continuous')
            reset()
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'continuous' ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-surface text-muted'}`}
        >
          {c.continuousBatchTitle}
        </button>
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button
          disabled={elapsed >= HORIZON}
          onClick={() => setPlaying(!playing)}
          className="px-4 py-2 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {playing ? c.pause : c.run}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-surface border border-border text-muted hover:text-text text-sm font-medium transition-colors"
        >
          {c.reset}
        </button>
        <button
          onClick={() => {
            setSeed((s) => s + 1)
            reset()
          }}
          className="px-4 py-2 rounded-lg bg-surface border border-border text-muted hover:text-text text-sm font-medium transition-colors"
        >
          {c.reshuffle}
        </button>
      </div>

      <div className="text-center text-sm text-muted">
        {c.timeStep}: <span className="text-primary-light font-mono font-bold">{elapsed}</span> / {HORIZON}
      </div>

      <div className="p-5 rounded-xl bg-surface border border-border">
        <div className="space-y-2">
          {Array.from({ length: SLOT_COUNT }, (_, s) => (
            <div key={s} className="flex items-center gap-1">
              <span className="text-xs text-muted w-12 shrink-0">
                {c.slotLabel} {s + 1}
              </span>
              <div className="flex gap-0.5 flex-1">
                {Array.from({ length: HORIZON }, (_, step) => {
                  const run = findRun(runs, s, step)
                  const done = step < elapsed
                  const boundary = batchStarts.has(step)
                  return (
                    <div
                      key={step}
                      className={`flex-1 h-6 rounded-sm transition-colors duration-200 ${
                        boundary ? 'ring-1 ring-orange-400/70' : ''
                      } ${
                        !done
                          ? 'bg-surface/30'
                          : run
                            ? COLORS[run.id % COLORS.length]
                            : 'bg-red-500/25'
                      }`}
                      title={run && done ? `#${run.id + 1}` : undefined}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border grid gap-3 sm:grid-cols-2 text-xs">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted">{c.occupancyLabel}</span>
              <span className="font-mono font-bold text-text">{Math.round(stats.share * 100)}%</span>
            </div>
            <div className="h-3 rounded-full bg-surface overflow-hidden border border-border">
              <motion.div
                className={`h-full rounded-full ${stats.share > 0.9 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                initial={false}
                animate={{ width: `${stats.share * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-muted">{c.completedLabel}</span>
            <span className="font-mono font-bold text-text text-base">{stats.completed}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-3 text-xs text-muted flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-cyan-500/50" /> {c.activeLabel}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-red-500/25" /> {c.idleLabel}
          </span>
          {mode === 'static' && (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm ring-1 ring-orange-400/70" /> {c.batchStartLabel}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
        <p className="text-sm text-text leading-relaxed">{mode === 'static' ? c.staticInsight : c.continuousInsight}</p>
      </div>
    </div>
  )
}

export function BatchingVisualizer({ section }: { section: 'throughput' | 'continuous' }) {
  if (section === 'continuous') return <ContinuousBatchingViz />
  return <Roofline />
}
