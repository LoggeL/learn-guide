'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { normalNoise, noisySample } from '@/lib/learning-math'
import { DIFFUSION_STEPS, diffusionAlphaBars, type DiffusionSchedule } from '@/lib/diffusion-math'

const COLS = 32
const ROWS = 20
const PLOT_W = 320
const PLOT_H = 200
const PAD = 28

const SCHEDULE_COLORS: Record<DiffusionSchedule, string> = {
  linear: '#fb923c', // orange-400
  cosine: '#22d3ee', // cyan-400
}

/** Forward-process explorer: ᾱₜ for linear-β vs cosine schedules, with the exact noisy sample xₜ. */
export function DiffusionNoiseVisualizer() {
  const { t } = useTranslation()
  const c = t.diffusionFundamentals
  const [schedule, setSchedule] = useState<DiffusionSchedule>('linear')
  const [timestep, setTimestep] = useState(250)
  const [seed, setSeed] = useState(42)

  const curves = useMemo(
    () => ({ linear: diffusionAlphaBars('linear'), cosine: diffusionAlphaBars('cosine') }),
    [],
  )

  const pixels = useMemo(() => {
    const noise = normalNoise(seed)
    return Array.from({ length: COLS * ROWS }, (_, i) => {
      const x = i % COLS
      const y = Math.floor(i / COLS)
      // a filled disc (x₀ = +1) on a dark background (x₀ = −1)
      const signal = (x - 16) ** 2 + (y - 10) ** 2 < 49 ? 1 : -1
      return { signal, noise: noise() }
    })
  }, [seed])

  const alphaBar = curves[schedule][timestep]
  const snr = alphaBar / Math.max(1 - alphaBar, 1e-12)
  const centre = pixels[10 * COLS + 16]

  const toX = (step: number) => PAD + (step / DIFFUSION_STEPS) * (PLOT_W - PAD - 8)
  const toY = (value: number) => 8 + (1 - value) * (PLOT_H - PAD - 8)
  const path = (values: number[]) =>
    values
      .filter((_, i) => i % 10 === 0 || i === DIFFUSION_STEPS)
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(Math.min(i * 10, DIFFUSION_STEPS)).toFixed(1)},${toY(v).toFixed(1)}`)
      .join(' ')

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted">{c.scheduleLabel}</span>
        {(['linear', 'cosine'] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => setSchedule(kind)}
            aria-pressed={schedule === kind}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              schedule === kind ? 'border-primary bg-primary/15 text-text' : 'border-border text-muted hover:text-text'
            }`}
          >
            {kind === 'linear' ? c.linearLabel : c.cosineLabel}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSeed((s) => (s * 7919 + 13) % 99991)}
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-text"
        >
          <RefreshCw size={14} aria-hidden="true" />
          {c.newNoise}
        </button>
      </div>

      <label className="block text-sm text-muted">
        {c.timestepLabel}: <span className="font-mono text-text">{timestep}</span> / {DIFFUSION_STEPS}
        <input
          aria-label={c.timestepLabel}
          type="range"
          min={0}
          max={DIFFUSION_STEPS}
          step={1}
          value={timestep}
          onChange={(e) => setTimestep(+e.target.value)}
          className="mt-2 w-full"
        />
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} className="w-full rounded-lg bg-background" role="img" aria-label={c.plotAria}>
          {[0, 0.5, 1].map((v) => (
            <g key={v}>
              <line x1={PAD} x2={PLOT_W - 8} y1={toY(v)} y2={toY(v)} stroke="currentColor" className="text-border" strokeWidth={0.5} />
              <text x={PAD - 4} y={toY(v) + 3} textAnchor="end" fontSize={9} fill="currentColor" className="text-muted">
                {v}
              </text>
            </g>
          ))}
          {[0, 500, 1000].map((step) => (
            <text key={step} x={toX(step)} y={PLOT_H - 10} textAnchor="middle" fontSize={9} fill="currentColor" className="text-muted">
              {step}
            </text>
          ))}
          {(['linear', 'cosine'] as const).map((kind) => (
            <path
              key={kind}
              d={path(curves[kind])}
              fill="none"
              stroke={SCHEDULE_COLORS[kind]}
              strokeWidth={kind === schedule ? 2.5 : 1.2}
              opacity={kind === schedule ? 1 : 0.45}
            />
          ))}
          <line x1={toX(timestep)} x2={toX(timestep)} y1={8} y2={PLOT_H - PAD} stroke="currentColor" className="text-muted" strokeDasharray="3 3" strokeWidth={0.8} />
          <motion.circle
            r={5}
            fill={SCHEDULE_COLORS[schedule]}
            animate={{ cx: toX(timestep), cy: toY(alphaBar) }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <g fontSize={10}>
            <rect x={PLOT_W - 98} y={12} width={10} height={3} fill={SCHEDULE_COLORS.linear} />
            <text x={PLOT_W - 84} y={16} fill="currentColor" className="text-muted">{c.linearLabel}</text>
            <rect x={PLOT_W - 98} y={26} width={10} height={3} fill={SCHEDULE_COLORS.cosine} />
            <text x={PLOT_W - 84} y={30} fill="currentColor" className="text-muted">{c.cosineLabel}</text>
          </g>
        </svg>

        <svg viewBox={`0 0 ${COLS * 10} ${ROWS * 10}`} className="w-full rounded-lg" role="img" aria-label={c.imageAria}>
          {pixels.map((p, i) => {
            const value = noisySample(p.signal, p.noise, alphaBar)
            const grey = Math.round(Math.max(0, Math.min(255, 127.5 + value * 65)))
            return (
              <rect
                key={i}
                x={(i % COLS) * 10}
                y={Math.floor(i / COLS) * 10}
                width={10}
                height={10}
                fill={`rgb(${grey},${grey},${grey})`}
              />
            )
          })}
        </svg>
      </div>

      <div className="grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="text-xs text-muted">{c.alphaBarLabel}</div>
          <div className="font-mono text-lg text-text">{alphaBar.toFixed(4)}</div>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="text-xs text-muted">{c.snrLabel}</div>
          <div className="font-mono text-lg text-text">{snr >= 1000 ? snr.toExponential(1) : snr.toFixed(3)}</div>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="text-xs text-muted">{c.pixelLabel}</div>
          <div className="font-mono text-xs text-text break-words">
            x₀ = {centre.signal}, ε = {centre.noise.toFixed(3)} → xₜ = {noisySample(centre.signal, centre.noise, alphaBar).toFixed(3)}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted">{c.vizLimit}</p>
    </div>
  )
}
