'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import {
  MEGA_KERNEL_LAYER,
  simulateMegaKernel,
  type MegaKernelMode,
} from '@/lib/mega-kernel-math'

const OP_COLORS = [
  { load: 'bg-cyan-400/30', compute: 'bg-cyan-400' },
  { load: 'bg-purple-400/30', compute: 'bg-purple-400' },
  { load: 'bg-emerald-400/30', compute: 'bg-emerald-400' },
  { load: 'bg-orange-400/30', compute: 'bg-orange-400' },
  { load: 'bg-pink-400/30', compute: 'bg-pink-400' },
]

const MODES: MegaKernelMode[] = ['kernels', 'graph', 'megakernel']

export function MegaKernelTimelineDemo() {
  const { t } = useTranslation()
  const m = t.megaKernels
  const [mode, setMode] = useState<MegaKernelMode>('kernels')

  const timelines = useMemo(
    () =>
      Object.fromEntries(MODES.map((md) => [md, simulateMegaKernel(MEGA_KERNEL_LAYER, md)])) as Record<
        MegaKernelMode,
        ReturnType<typeof simulateMegaKernel>
      >,
    [],
  )
  const timeline = timelines[mode]
  // Common scale so the three modes can be compared by bar length.
  const scale = Math.max(...MODES.map((md) => timelines[md].makespan))
  const pct = (x: number) => `${(100 * x) / scale}%`
  const smCount = MEGA_KERNEL_LAYER[0].load.length

  const modeLabel: Record<MegaKernelMode, string> = {
    kernels: m.demoModeKernels,
    graph: m.demoModeGraph,
    megakernel: m.demoModeMega,
  }
  const insight: Record<MegaKernelMode, string> = {
    kernels: m.demoInsightKernels,
    graph: m.demoInsightGraph,
    megakernel: m.demoInsightMega,
  }
  const opNames = [m.demoOp1, m.demoOp2, m.demoOp3, m.demoOp4, m.demoOp5]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="tablist">
        {MODES.map((md) => (
          <button
            key={md}
            role="tab"
            aria-selected={mode === md}
            onClick={() => setMode(md)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === md
                ? 'bg-primary/20 text-primary-light ring-1 ring-primary/40'
                : 'bg-surface text-muted hover:text-text'
            }`}
          >
            {modeLabel[md]}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-background/60 border border-border space-y-2">
        {/* Launch lane */}
        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-[11px] text-muted">{m.demoLaunchLane}</span>
          <div className="relative h-4 flex-1">
            {timeline.gaps.map((g, i) => (
              <motion.div
                key={`${mode}-gap-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (g.start / scale) * 0.8 }}
                className="absolute top-0 h-4 rounded-sm bg-red-500/40 border border-red-500/50"
                style={{ left: pct(g.start), width: pct(g.end - g.start) }}
              />
            ))}
          </div>
        </div>
        {/* SM lanes */}
        {Array.from({ length: smCount }, (_, sm) => (
          <div key={sm} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-[11px] text-muted font-mono">
              {m.demoSm} {sm + 1}
            </span>
            {/* Upper track: loads, lower track: compute (they may overlap in time). */}
            <div className="relative h-7 flex-1 rounded-sm bg-surface/40">
              {timeline.segments
                .filter((s) => s.sm === sm)
                .map((s) => (
                  <motion.div
                    key={`${mode}-${s.op}-${s.kind}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: (s.start / scale) * 0.8, duration: 0.25 }}
                    className={`absolute h-3 origin-left rounded-sm ${
                      s.kind === 'load' ? `top-0 ${OP_COLORS[s.op].load}` : `bottom-0 ${OP_COLORS[s.op].compute}`
                    }`}
                    style={{ left: pct(s.start), width: pct(s.end - s.start) }}
                    title={`${opNames[s.op]} · ${s.kind === 'load' ? m.demoLegendLoad : m.demoLegendCompute}`}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
        {opNames.map((name, i) => (
          <span key={name} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${OP_COLORS[i].compute}`} />
            {name}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-sm bg-text/30 self-start mt-0.5" />
          {m.demoLegendLoad}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-sm bg-text self-end mb-0.5" />
          {m.demoLegendCompute}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-500/40 border border-red-500/50" />
          {m.demoLegendGap}
        </span>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border p-4">
          <div className="text-sm text-muted">{m.demoMakespan}</div>
          <div className="text-2xl font-mono text-text">
            {timeline.makespan.toFixed(1)} <span className="text-sm text-muted">{m.demoUnits}</span>
          </div>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="text-sm text-muted">{m.demoLoadBusy}</div>
          <div className="text-2xl font-mono text-text">{Math.round(timeline.loadBusy * 100)}%</div>
          <div className="mt-2 h-2 rounded-full bg-surface overflow-hidden">
            <motion.div
              className="h-full bg-primary-light"
              initial={false}
              animate={{ width: `${timeline.loadBusy * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-text leading-relaxed p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
        {insight[mode]}
      </p>
    </div>
  )
}
