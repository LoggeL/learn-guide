'use client'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import {
  loss,
  gradient,
  descentStep,
  stationaryPoint,
} from '@/lib/learning-math'

export function GradientDescentVisualizer() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [start, setStart] = useState(1.8),
    [x, setX] = useState(1.8),
    [rate, setRate] = useState(0.1),
    [running, setRunning] = useState(false),
    [history, setHistory] = useState<number[]>([])
  const outside = !Number.isFinite(x) || Math.abs(x) > 2
  const reset = (value = start) => {
    setRunning(false)
    setX(value)
    setHistory([])
  }
  const step = () => {
    if (outside) return
    const next = descentStep(x, rate)
    setX(next)
    setHistory((h) => [...h, next])
    if (Math.abs(next) > 2 || Math.abs(gradient(next)) < 0.001)
      setRunning(false)
  }
  useEffect(() => {
    if (!running) return
    const id = setTimeout(step, 300)
    return () => clearTimeout(id)
  })
  const sx = (v: number) => 40 + (v + 2) * 125,
    sy = (v: number) => 260 - (v / 12) * 220
  const curve = Array.from({ length: 161 }, (_, i) => -2 + i / 40)
    .map((v) => `${sx(v)},${sy(loss(v))}`)
    .join(' ')
  const minima = [stationaryPoint(-1), stationaryPoint(1)]
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <h3 className="text-xl text-gradient">{c.descentTitle}</h3>
      <p className="text-sm text-muted">{c.descentNote}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          {c.startPoint}: {start.toFixed(2)}
          <input
            aria-label={c.startPoint}
            className="w-full"
            type="range"
            min={-2}
            max={2}
            step={0.01}
            value={start}
            onChange={(e) => {
              const n = +e.target.value
              setStart(n)
              reset(n)
            }}
          />
        </label>
        <label>
          {c.rate}: {rate.toFixed(2)}
          <input
            aria-label={c.rate}
            className="w-full"
            type="range"
            min={0.01}
            max={0.3}
            step={0.01}
            value={rate}
            onChange={(e) => {
              setRate(+e.target.value)
              reset()
            }}
          />
        </label>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button
          disabled={outside}
          className="rounded-lg border border-primary px-4 py-2 disabled:opacity-50"
          onClick={() => setRunning(!running)}
        >
          {running ? c.pause : c.run}
        </button>
        <button
          disabled={outside || running}
          className="rounded-lg border border-border px-4 py-2 disabled:opacity-50"
          onClick={step}
        >
          {c.step}
        </button>
        <button
          className="rounded-lg border border-border px-4 py-2"
          onClick={() => reset()}
        >
          {c.reset}
        </button>
      </div>
      {outside && (
        <p role="status" className="text-orange-400">
          {c.divergence}
        </p>
      )}
      <svg
        viewBox="0 0 580 300"
        className="w-full rounded-xl bg-background"
        role="img"
        aria-label={c.descentTitle}
      >
        <polyline points={curve} fill="none" stroke="#a78bfa" strokeWidth="2" />
        {history
          .filter((v) => Math.abs(v) <= 2)
          .map((v, i) => (
            <circle key={i} cx={sx(v)} cy={sy(loss(v))} r="3" fill="#22c55e" />
          ))}
        {!outside && (
          <circle cx={sx(x)} cy={sy(loss(x))} r="8" fill="#ef4444" />
        )}
        {minima.map((v, i) => (
          <g key={v}>
            <circle
              cx={sx(v)}
              cy={sy(loss(v))}
              r="5"
              fill="none"
              stroke="#22c55e"
            />
            <text
              x={sx(v)}
              y={sy(loss(v)) + 20}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="12"
            >
              {i === 0 ? c.globalMinimum : c.localMinimum}
            </text>
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-3 text-sm font-mono">
        <div>
          {c.position}: {x.toFixed(5)}
        </div>
        <div>
          {c.loss}: {loss(x).toFixed(5)}
        </div>
        <div>
          {c.gradient}: {gradient(x).toFixed(5)}
        </div>
        <div>
          {c.iteration}: {history.length}
        </div>
      </div>
    </div>
  )
}
