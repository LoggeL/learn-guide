'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Network, Clock, Coins, EyeOff, AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import {
  compareOrchestration,
  ORCH_ASSUMPTIONS,
  windowTotal,
  type WindowBreakdown,
} from '@/lib/orchestration-model'

/**
 * Single agent vs. orchestrator + subagents. All numbers come from
 * compareOrchestration() in src/lib/orchestration-model.ts — a deterministic
 * teaching model, no random values.
 */

const SEGMENTS: { key: keyof WindowBreakdown; color: string }[] = [
  { key: 'base', color: 'bg-purple-400/70' },
  { key: 'overhead', color: 'bg-orange-400/70' },
  { key: 'previous', color: 'bg-pink-400/70' },
  { key: 'tool', color: 'bg-cyan-400/70' },
  { key: 'summaries', color: 'bg-emerald-400/70' },
  { key: 'output', color: 'bg-zinc-400/60' },
]

const BAR_HEIGHT = 168

function ContextBar({ window, label, scale }: { window: WindowBreakdown; label: string; scale: number }) {
  const total = windowTotal(window)
  const overflow = total > scale
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
      <div
        className={`relative w-full max-w-[56px] rounded-md border bg-background overflow-hidden flex flex-col-reverse ${overflow ? 'border-red-400/70' : 'border-border'}`}
        style={{ height: BAR_HEIGHT }}
      >
        {SEGMENTS.map(seg => {
          const value = window[seg.key]
          const pct = Math.min(value / scale, 1) * 100
          return (
            <motion.div
              key={seg.key}
              className={seg.color}
              initial={false}
              animate={{ height: `${pct}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          )
        })}
      </div>
      <span className="text-[11px] text-muted truncate max-w-full">{label}</span>
      <span className={`text-[11px] font-mono ${overflow ? 'text-red-400' : 'text-text'}`}>{(total / 1000).toFixed(1)}k</span>
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange, format, hint }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; format: (v: number) => string; hint?: string
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-text">{label}</span>
        <span className="font-mono text-primary-light">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-purple-400"
      />
      {hint && <p className="text-xs text-muted mt-1 leading-snug">{hint}</p>}
    </label>
  )
}

export function WorkflowVisualizer() {
  const { t, locale } = useTranslation()
  const l = t.orchestration.lab

  const [subtasks, setSubtasks] = useState(4)
  const [toolOutput, setToolOutput] = useState(12000)
  const [summary, setSummary] = useState(800)
  const [overhead, setOverhead] = useState(4000)
  const [dependent, setDependent] = useState(false)

  const r = useMemo(
    () => compareOrchestration({ subtasks, toolOutput, summary, overhead, dependent }),
    [subtasks, toolOutput, summary, overhead, dependent],
  )

  const nf = (v: number) => Math.round(v).toLocaleString(locale)
  const tok = (v: number) => `${nf(v)} ${l.tokens}`
  const scale = ORCH_ASSUMPTIONS.contextScale
  const ratio = r.multi.cost / r.single.cost
  const maxTime = Math.max(r.single.time, r.multi.time)
  const a = ORCH_ASSUMPTIONS

  const insight = dependent
    ? l.insightDependent
    : ratio < 1
      ? l.insightCheaper
      : l.insightParallel
  const insightText = insight
    .replace('{multi}', String(r.multi.time))
    .replace('{single}', String(r.single.time))
    .replace('{peak}', nf(r.multi.peak))
    .replace('{singlePeak}', nf(r.single.peak))

  // Timeline rows: [start, duration, color]
  const singleRow = [
    ...Array.from({ length: subtasks }, (_, i) => ({ start: i * a.secondsPerSubtask, dur: a.secondsPerSubtask, color: 'bg-cyan-400/60' })),
    { start: subtasks * a.secondsPerSubtask, dur: a.secondsPerModelCall, color: 'bg-purple-400/70' },
  ]
  const lanes = Array.from({ length: subtasks }, (_, i) => ({
    start: a.secondsPerModelCall + (dependent ? i * a.secondsPerSubtask : 0),
    dur: a.secondsPerSubtask,
  }))
  const synthStart = a.secondsPerModelCall + (dependent ? subtasks : 1) * a.secondsPerSubtask

  const metrics = [
    { icon: Bot, label: l.metricPeak, single: tok(r.single.peak), multi: tok(r.multi.peak) },
    { icon: Clock, label: l.metricTime, single: `${r.single.time} ${l.seconds}`, multi: `${r.multi.time} ${l.seconds}` },
    { icon: Coins, label: l.metricCost, single: nf(r.single.cost), multi: nf(r.multi.cost), extra: `${l.ratioLabel}: ${ratio.toFixed(2)}×` },
    { icon: EyeOff, label: l.metricHidden, single: tok(r.single.hidden), multi: tok(r.multi.hidden) },
  ]

  const segLabels: Record<keyof WindowBreakdown, string> = {
    base: l.segBase,
    overhead: l.segOverhead,
    previous: l.segPrevious,
    tool: l.segTool,
    summaries: l.segSummary,
    output: l.segOutput,
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-2xl bg-surface border border-border p-5 grid md:grid-cols-2 gap-5">
        <Slider label={l.ctrlSubtasks} value={subtasks} min={2} max={8} step={1} onChange={setSubtasks} format={v => String(v)} />
        <Slider label={l.ctrlToolOutput} value={toolOutput} min={2000} max={24000} step={1000} onChange={setToolOutput} format={tok} />
        <Slider label={l.ctrlSummary} value={summary} min={200} max={3000} step={100} onChange={setSummary} format={tok} />
        <Slider label={l.ctrlOverhead} value={overhead} min={0} max={20000} step={1000} onChange={setOverhead} format={tok} hint={l.ctrlOverheadHint} />
        <label className="md:col-span-2 flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={dependent} onChange={e => setDependent(e.target.checked)} className="mt-1 accent-purple-400" />
          <span>
            <span className="text-sm text-text">{l.ctrlDependent}</span>
            <span className="block text-xs text-muted">{l.ctrlDependentHint}</span>
          </span>
        </label>
      </div>

      {/* Context windows */}
      <div className="rounded-2xl bg-surface border border-border p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h3 className="font-semibold text-text">{l.windowsTitle}</h3>
          <span className="text-xs text-muted">{l.windowsScale}</span>
        </div>
        <div className="grid md:grid-cols-[1fr_3fr] gap-6">
          <div>
            <p className="text-sm font-medium text-text mb-3 flex items-center gap-2"><Bot size={15} className="text-purple-300" />{l.singleLabel}</p>
            <div className="flex justify-center">
              <ContextBar window={r.single.window} label={l.singleShort} scale={scale} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-text mb-3 flex items-center gap-2"><Network size={15} className="text-cyan-300" />{l.multiLabel}</p>
            <div className="flex gap-2 items-end">
              <ContextBar window={r.multi.orchestrator} label={l.orchestratorShort} scale={scale} />
              <div className="w-px self-stretch bg-border mx-1" />
              {r.multi.subagents.map((w, i) => (
                <ContextBar key={i} window={w} label={`${l.subagentShort}${i + 1}`} scale={scale} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-xs text-muted">
          {SEGMENTS.filter(s => s.key !== 'previous' || dependent).map(s => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${s.color}`} />
              {segLabels[s.key]}
            </span>
          ))}
        </div>
        {r.single.peak > scale && (
          <p className="mt-3 text-xs text-red-300 flex items-start gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            {l.overflow}
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="rounded-2xl bg-surface border border-border p-5">
        <h3 className="font-semibold text-text mb-4">{l.timelineTitle}</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted mb-1">{l.singleLabel} · {r.single.time} {l.seconds}</p>
            <div className="relative h-5 rounded bg-background border border-border overflow-hidden">
              {singleRow.map((seg, i) => (
                <motion.div
                  key={i}
                  className={`absolute top-0.5 bottom-0.5 rounded-sm ${seg.color}`}
                  initial={false}
                  animate={{ left: `${(seg.start / maxTime) * 100}%`, width: `calc(${(seg.dur / maxTime) * 100}% - 2px)` }}
                  transition={{ duration: 0.35 }}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">{l.multiLabel} · {r.multi.time} {l.seconds}</p>
            <div className="relative rounded bg-background border border-border overflow-hidden" style={{ height: 8 + subtasks * 10 }}>
              <motion.div
                className="absolute top-1 bottom-1 rounded-sm bg-purple-400/70"
                initial={false}
                animate={{ left: '0%', width: `calc(${(a.secondsPerModelCall / maxTime) * 100}% - 2px)` }}
              />
              {lanes.map((lane, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 rounded-sm bg-cyan-400/60"
                  style={{ top: 4 + i * 10 }}
                  initial={false}
                  animate={{ left: `${(lane.start / maxTime) * 100}%`, width: `calc(${(lane.dur / maxTime) * 100}% - 2px)` }}
                  transition={{ duration: 0.35 }}
                />
              ))}
              <motion.div
                className="absolute top-1 bottom-1 rounded-sm bg-purple-400/70"
                initial={false}
                animate={{ left: `${(synthStart / maxTime) * 100}%`, width: `calc(${(a.secondsPerModelCall / maxTime) * 100}% - 2px)` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-400/60" />{l.timeSubtask}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-purple-400/70" />{l.timeModelCall}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid sm:grid-cols-2 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="rounded-xl bg-surface border border-border p-4">
            <p className="text-xs text-muted flex items-center gap-2 mb-2"><m.icon size={14} />{m.label}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="block text-[11px] text-muted">{l.singleLabel}</span><span className="font-mono text-text">{m.single}</span></div>
              <div><span className="block text-[11px] text-muted">{l.multiLabel}</span><span className="font-mono text-text">{m.multi}</span></div>
            </div>
            {m.extra && <p className="text-xs text-primary-light mt-2 font-mono">{m.extra}</p>}
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 px-5 py-4">
        <p className="text-sm text-muted leading-relaxed">{insightText}</p>
      </div>
    </div>
  )
}
