'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { normalNoise } from '@/lib/learning-math'
import {
  diffusionAlphaBars,
  diffusionSampleTrajectories,
  diffusionTimesteps,
  type DiffusionVec2,
} from '@/lib/diffusion-math'

const DATA: DiffusionVec2[] = Array.from({ length: 12 }, (_, i) => [
  0.9 * Math.cos((2 * Math.PI * i) / 12),
  0.9 * Math.sin((2 * Math.PI * i) / 12),
])
const SAMPLE_COUNT = 40
const STEP_OPTIONS = [1, 2, 5, 10, 50]
const SIZE = 300
const SCALE = 52 // pixels per unit
const toPx = (v: number) => SIZE / 2 + v * SCALE
const ALPHA_BARS = diffusionAlphaBars('cosine')

/** Runs the real DDIM/DDPM update with the exact denoiser E[x₀ | xₜ] of a 12-point ring dataset. */
export function DiffusionSamplerPlayground() {
  const { t } = useTranslation()
  const c = t.diffusionFundamentals
  const [steps, setSteps] = useState(10)
  const [eta, setEta] = useState(0)
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(false)

  const trajectories = useMemo(() => {
    const g = normalNoise(2024)
    const starts: DiffusionVec2[] = Array.from({ length: SAMPLE_COUNT }, () => [g(), g()])
    return diffusionSampleTrajectories(DATA, starts, steps, eta, 'cosine', normalNoise(77))
  }, [steps, eta])

  useEffect(() => {
    if (!playing) return
    if (frame >= steps) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => setFrame((f) => f + 1), Math.max(60, 900 / steps))
    return () => clearTimeout(id)
  }, [playing, frame, steps])

  const reset = () => {
    setPlaying(false)
    setFrame(0)
  }

  const timesteps = diffusionTimesteps(steps)
  const alphaBar = ALPHA_BARS[timesteps[frame]]
  const points = trajectories.map((path) => path[frame])
  const meanDistance =
    points.reduce(
      (sum, p) => sum + Math.min(...DATA.map((d) => Math.hypot(p[0] - d[0], p[1] - d[1]))),
      0,
    ) / points.length

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">{c.samplerStepsLabel}</span>
        {STEP_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={steps === n}
            onClick={() => {
              setSteps(n)
              reset()
            }}
            className={`min-w-10 rounded-lg border px-3 py-1.5 font-mono text-sm ${
              steps === n ? 'border-primary bg-primary/15 text-text' : 'border-border text-muted hover:text-text'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">{c.samplerEtaLabel}</span>
        {[0, 1].map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={eta === value}
            onClick={() => {
              setEta(value)
              reset()
            }}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              eta === value ? 'border-primary bg-primary/15 text-text' : 'border-border text-muted hover:text-text'
            }`}
          >
            {value === 0 ? c.samplerDdim : c.samplerDdpm}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_220px]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-md rounded-lg bg-background" role="img" aria-label={c.samplerAria}>
          {trajectories.map((path, i) => (
            <polyline
              key={`path-${i}`}
              points={path
                .slice(0, frame + 1)
                .map(([x, y]) => `${toPx(x).toFixed(1)},${toPx(-y).toFixed(1)}`)
                .join(' ')}
              fill="none"
              stroke="#a78bfa"
              strokeOpacity={0.25}
              strokeWidth={1}
            />
          ))}
          {DATA.map(([x, y], i) => (
            <circle key={`data-${i}`} cx={toPx(x)} cy={toPx(-y)} r={5} fill="none" stroke="#34d399" strokeWidth={1.5} />
          ))}
          {points.map(([x, y], i) => (
            <motion.circle
              key={`sample-${i}`}
              r={3}
              fill="#f472b6"
              initial={false}
              animate={{ cx: toPx(x), cy: toPx(-y) }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          ))}
        </svg>

        <div className="space-y-4 text-sm">
          <div className="rounded-lg border border-border bg-background p-3 font-mono text-text">
            {c.samplerProgress
              .replace('{current}', String(frame))
              .replace('{total}', String(steps))
              .replace('{alphaBar}', alphaBar.toFixed(3))}
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="text-xs text-muted">{c.samplerDistance}</div>
            <div className="font-mono text-lg text-text">{meanDistance.toFixed(3)}</div>
          </div>
          <div className="space-y-1 text-xs text-muted">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full border-2 border-emerald-400" aria-hidden="true" />
              {c.samplerData}
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-pink-400" aria-hidden="true" />
              {c.samplerSamples}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={playing || frame >= steps}
              onClick={() => setPlaying(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-primary px-3 py-1.5 disabled:opacity-50"
            >
              <Play size={14} aria-hidden="true" />
              {c.samplerPlay}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-muted hover:text-text"
            >
              <RotateCcw size={14} aria-hidden="true" />
              {c.samplerReset}
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted">{c.samplerLimit}</p>
    </div>
  )
}
