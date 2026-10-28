'use client'

import { useId, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

/** Probability that a step succeeds when a fraction `detection` of failures is caught and retried once. */
export function effectiveStepSuccess(p: number, detection: number): number {
  return p + (1 - p) * detection * p
}

/** Probability that all `steps` independent steps succeed. */
export function taskSuccess(p: number, steps: number): number {
  return Math.pow(p, steps)
}

const MAX_STEPS = 50
const WIDTH = 520
const HEIGHT = 220
const PAD = { left: 54, right: 16, top: 12, bottom: 32 }

const xScale = (step: number) => PAD.left + ((step - 1) / (MAX_STEPS - 1)) * (WIDTH - PAD.left - PAD.right)
const yScale = (value: number) => PAD.top + (1 - value) * (HEIGHT - PAD.top - PAD.bottom)

function curvePath(stepSuccess: number): string {
  const points: string[] = []
  for (let step = 1; step <= MAX_STEPS; step++) {
    points.push(`${step === 1 ? 'M' : 'L'}${xScale(step).toFixed(1)},${yScale(taskSuccess(stepSuccess, step)).toFixed(1)}`)
  }
  return points.join(' ')
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}

export function ErrorCompoundingDemo() {
  const { t, locale } = useTranslation()
  const c = t.agentProblems.compounding
  const id = useId()
  const [p, setP] = useState(0.95)
  const [steps, setSteps] = useState(20)
  const [detection, setDetection] = useState(0)

  const pEff = effectiveStepSuccess(p, detection)
  const plain = taskSuccess(p, steps)
  const checked = taskSuccess(pEff, steps)

  const decimal = useMemo(() => new Intl.NumberFormat(locale, { minimumFractionDigits: 3, maximumFractionDigits: 3 }), [locale])
  const percent = useMemo(() => new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }), [locale])
  const wholePercent = useMemo(() => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }), [locale])

  const plainPath = curvePath(p)
  const checkedPath = curvePath(pEff)
  const markerX = xScale(steps)

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{c.title}</h2>
        <p className="text-muted leading-relaxed">{c.intro}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label htmlFor={`${id}-p`} className="block p-4 rounded-xl bg-background border border-border">
          <span className="flex justify-between text-sm text-text font-medium mb-2">
            <span>{c.stepSuccess}</span>
            <span className="font-mono text-cyan-400">{wholePercent.format(p)}</span>
          </span>
          <input id={`${id}-p`} type="range" min={0.8} max={0.995} step={0.005} value={p}
            onChange={event => setP(Number(event.target.value))} className="w-full accent-cyan-400" />
        </label>
        <label htmlFor={`${id}-n`} className="block p-4 rounded-xl bg-background border border-border">
          <span className="flex justify-between text-sm text-text font-medium mb-2">
            <span>{c.steps}</span>
            <span className="font-mono text-cyan-400">{steps}</span>
          </span>
          <input id={`${id}-n`} type="range" min={1} max={MAX_STEPS} step={1} value={steps}
            onChange={event => setSteps(Number(event.target.value))} className="w-full accent-cyan-400" />
        </label>
        <label htmlFor={`${id}-d`} className="block p-4 rounded-xl bg-background border border-border">
          <span className="flex justify-between text-sm text-text font-medium mb-2">
            <span>{c.detection}</span>
            <span className="font-mono text-emerald-400">{wholePercent.format(detection)}</span>
          </span>
          <input id={`${id}-d`} type="range" min={0} max={0.9} step={0.05} value={detection}
            onChange={event => setDetection(Number(event.target.value))} className="w-full accent-emerald-400" aria-describedby={`${id}-d-hint`} />
          <span id={`${id}-d-hint`} className="block text-xs text-muted mt-2 leading-relaxed">{c.detectionHint}</span>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
        <div className="rounded-xl bg-background border border-border p-3">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label={c.chartLabel}>
            {[0, 0.25, 0.5, 0.75, 1].map(tick => (
              <g key={tick}>
                <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yScale(tick)} y2={yScale(tick)} className="stroke-border" strokeWidth={1} />
                <text x={PAD.left - 6} y={yScale(tick) + 4} textAnchor="end" className="fill-muted text-[10px]">{wholePercent.format(tick)}</text>
              </g>
            ))}
            {[1, 10, 20, 30, 40, 50].map(tick => (
              <text key={tick} x={xScale(tick)} y={HEIGHT - PAD.bottom + 16} textAnchor="middle" className="fill-muted text-[10px]">{tick}</text>
            ))}
            <text x={(PAD.left + WIDTH - PAD.right) / 2} y={HEIGHT - 2} textAnchor="middle" className="fill-muted text-[10px]">{c.axisSteps}</text>
            <text transform="rotate(-90)" x={-(PAD.top + HEIGHT - PAD.bottom) / 2} y={10} textAnchor="middle" className="fill-muted text-[10px]">{c.axisSuccess}</text>
            <motion.path d={plainPath} animate={{ d: plainPath }} transition={{ duration: 0.3 }} fill="none" className="stroke-orange-400" strokeWidth={2.5} />
            <motion.path d={checkedPath} animate={{ d: checkedPath }} transition={{ duration: 0.3 }} fill="none" className="stroke-emerald-400" strokeWidth={2.5} strokeDasharray={detection > 0 ? undefined : '4 4'} />
            <motion.line animate={{ x1: markerX, x2: markerX }} y1={PAD.top} y2={HEIGHT - PAD.bottom} className="stroke-cyan-400/60" strokeWidth={1} strokeDasharray="3 3" transition={{ duration: 0.2 }} />
            <motion.circle animate={{ cx: markerX, cy: yScale(plain) }} r={5} className="fill-orange-400" transition={{ duration: 0.3 }} />
            <motion.circle animate={{ cx: markerX, cy: yScale(checked) }} r={5} className="fill-emerald-400" transition={{ duration: 0.3 }} />
          </svg>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <p className="text-sm text-orange-400 font-semibold mb-1">{c.withoutChecks}</p>
            <p className="text-3xl font-bold font-mono text-text" aria-live="polite">{percent.format(plain)}</p>
            <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">
              <motion.div className="h-full bg-orange-400" animate={{ width: `${plain * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
            <p className="text-xs text-muted font-mono mt-3">
              {fill(c.formulaPlain, { p: decimal.format(p), n: String(steps), result: percent.format(plain) })}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-sm text-emerald-400 font-semibold mb-1">{c.withChecks}</p>
            <p className="text-3xl font-bold font-mono text-text" aria-live="polite">{percent.format(checked)}</p>
            <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">
              <motion.div className="h-full bg-emerald-400" animate={{ width: `${checked * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
            <p className="text-xs text-muted font-mono mt-3">
              {fill(c.formulaChecked, { pEff: decimal.format(pEff), n: String(steps), result: percent.format(checked) })}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted leading-relaxed">{c.caveat}</p>
    </div>
  )
}
