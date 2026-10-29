'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { chunkedPrefillTimeline } from '@/lib/batching-math'

// Same hypothetical dense 7B model as the roofline demo (inference-math.ts):
// 14 GB FP16 weights at 1 TB/s and 2·7e9 FLOPs per token at 100 TFLOP/s.
const WEIGHT_READ_MS = 14
const MS_PER_TOKEN = 0.14
const TAIL_STEPS = 3
const BUDGETS: (number | null)[] = [null, 2048, 1024, 512, 256, 128]

export function BatchingChunkedPrefillDemo() {
  const { t } = useTranslation()
  const c = t.batching
  const [prompt, setPrompt] = useState(2048)
  const [running, setRunning] = useState(8)
  const [budgetIndex, setBudgetIndex] = useState(4)
  const budget = BUDGETS[budgetIndex]

  const { result, scale } = useMemo(() => {
    const run = (chunkBudget: number | null) =>
      chunkedPrefillTimeline({
        promptTokens: prompt,
        runningDecodes: running,
        chunkBudget,
        weightReadMs: WEIGHT_READ_MS,
        msPerToken: MS_PER_TOKEN,
        tailSteps: TAIL_STEPS,
      })
    // Common time axis for all budgets so bar lengths stay comparable while switching.
    return { result: run(budget), scale: Math.max(...BUDGETS.map((b) => run(b).total)) }
  }, [prompt, running, budget])
  const fmt = (ms: number) => `${ms.toFixed(0)} ${c.ms}`

  const metrics = [
    { label: c.chunkTtft, value: fmt(result.ttft), color: 'text-amber-400' },
    { label: c.chunkWorstGap, value: fmt(result.worstGap), color: 'text-violet-400' },
    { label: c.chunkDecodeStep, value: fmt(result.decodeStep), color: 'text-text' },
    { label: c.chunkSteps, value: String(result.steps.length), color: 'text-text' },
  ]

  return (
    <div className="space-y-5">
      <h3 className="text-xl text-gradient">{c.chunkDemoTitle}</h3>
      <p className="text-sm text-muted">{c.chunkDemoNote}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">
          {c.chunkPrompt}: {prompt}
          <input
            aria-label={c.chunkPrompt}
            type="range"
            min={256}
            max={8192}
            step={256}
            value={prompt}
            onChange={(e) => setPrompt(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="text-sm">
          {c.chunkRunning}: {running}
          <input
            aria-label={c.chunkRunning}
            type="range"
            min={1}
            max={64}
            value={running}
            onChange={(e) => setRunning(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="text-sm">
          {c.chunkBudget}: {budget === null ? c.chunkOff : budget}
          <input
            aria-label={c.chunkBudget}
            type="range"
            min={0}
            max={BUDGETS.length - 1}
            value={budgetIndex}
            onChange={(e) => setBudgetIndex(+e.target.value)}
            className="w-full"
          />
        </label>
      </div>

      <div className="p-4 rounded-xl bg-background/60 border border-border">
        <div className="relative h-10 flex">
          {result.steps.map((s, i) => {
            const prefillShare = s.prefillTokens / (s.prefillTokens + s.decodeTokens)
            return (
              <motion.div
                key={`${budgetIndex}-${prompt}-${running}-${i}`}
                initial={{ opacity: 0, scaleY: 0.4 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: Math.min(i * 0.03, 0.6), duration: 0.2 }}
                className="h-10 border-r border-background overflow-hidden flex flex-col"
                style={{ width: `${(100 * s.duration) / scale}%` }}
                title={`${s.prefillTokens} + ${s.decodeTokens} · ${s.duration.toFixed(1)} ${c.ms}`}
              >
                <div className="bg-amber-400/70" style={{ height: `${prefillShare * 100}%` }} />
                <div className="flex-1 bg-violet-400/60" />
              </motion.div>
            )
          })}
          <div
            className="absolute -bottom-5 text-[10px] text-amber-400 -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${(100 * result.ttft) / scale}%` }}
          >
            ▲ {c.chunkFirstToken}
          </div>
        </div>
        <div className="h-5" />
        <div className="flex gap-4 mt-2 text-xs text-muted flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-400/70" /> {c.chunkLegendPrefill}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-violet-400/60" /> {c.chunkLegendDecode}
          </span>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {metrics.map((mt) => (
          <div key={mt.label} className="rounded-xl border border-border p-4">
            <div className="text-xs text-muted">{mt.label}</div>
            <div className={`text-xl font-mono ${mt.color}`}>{mt.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
