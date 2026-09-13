'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { worldRollout } from '@/lib/learning-math'

export function WorldModelPipeline() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [stage, setStage] = useState(0)
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {c.pipelineLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => setStage(i)}
            aria-pressed={stage === i}
            className={`rounded-xl border px-4 py-3 ${stage === i ? 'border-primary text-primary-light' : 'border-border text-muted'}`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>
      <p className="rounded-xl bg-background p-5 text-muted">
        {c.pipelineDescriptions[stage]}
      </p>
    </div>
  )
}
export function SimToRealToggle() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [velocity, setVelocity] = useState(2),
    [acceleration, setAcceleration] = useState(0.5),
    [estimate, setEstimate] = useState(0.4),
    [horizon, setHorizon] = useState(10)
  const points = worldRollout(velocity, acceleration, estimate, horizon),
    end = points[points.length - 1]
  const max = Math.max(
    1,
    ...points.flatMap((p) => [Math.abs(p.actual), Math.abs(p.predicted)]),
  )
  const sx = (time: number) => 30 + (time / horizon) * 510,
    sy = (v: number) => 150 - (v / max) * 115
  const controls: [
    string,
    number,
    (n: number) => void,
    number,
    number,
    number,
  ][] = [
    [c.worldVelocity, velocity, setVelocity, -5, 5, 0.1],
    [c.worldAcceleration, acceleration, setAcceleration, -1, 1, 0.05],
    [c.worldEstimate, estimate, setEstimate, -1, 1, 0.05],
    [c.worldHorizon, horizon, setHorizon, 1, 20, 1],
  ]
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <h3 className="text-xl text-gradient">{c.worldTitle}</h3>
      <p className="text-sm text-muted">{c.worldNote}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {controls.map(([label, v, set, min, max, step]) => (
          <label className="text-sm" key={label}>
            {label}: {v}
            <input
              aria-label={label}
              type="range"
              min={min}
              max={max}
              step={step}
              value={v}
              onChange={(e) => set(+e.target.value)}
              className="w-full"
            />
          </label>
        ))}
      </div>
      <svg
        viewBox="0 0 580 300"
        className="w-full rounded-lg bg-background"
        role="img"
        aria-label={c.worldTitle}
      >
        <line x1="30" x2="540" y1="150" y2="150" stroke="#64748b" />
        {['actual', 'predicted'].map((key) => (
          <polyline
            key={key}
            fill="none"
            stroke={key === 'actual' ? '#22d3ee' : '#fb923c'}
            strokeWidth="3"
            strokeDasharray={key === 'actual' ? undefined : '6 3'}
            points={points
              .map(
                (p) => `${sx(p.time)},${sy(p[key as 'actual' | 'predicted'])}`,
              )
              .join(' ')}
          />
        ))}
        <text x="30" y="20" fill="#94a3b8" fontSize="12">
          {c.positionMetres}: ±{max.toFixed(1)}
        </text>
        <text x="30" y="280" fill="#94a3b8" fontSize="12">
          0
        </text>
        <text x="540" y="280" textAnchor="end" fill="#94a3b8" fontSize="12">
          {horizon} {c.timeSeconds}
        </text>
      </svg>
      <div className="flex flex-wrap gap-5 text-sm">
        <span className="text-cyan-400">
          {c.reference}: {end.actual.toFixed(2)} m
        </span>
        <span className="text-orange-400">
          {c.prediction}: {end.predicted.toFixed(2)} m
        </span>
        <span>
          {c.error}: {Math.abs(end.actual - end.predicted).toFixed(2)} m
        </span>
      </div>
      <p className="text-sm text-muted">{c.worldLimit}</p>
    </div>
  )
}
export function TrainingLoopViz() {
  const { t } = useTranslation()
  return <p className="text-muted">{t.vramCalc.audit.worldDistinction}</p>
}
