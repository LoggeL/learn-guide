'use client'
import { useState, useMemo } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { normalNoise, noisySample } from '@/lib/learning-math'

export function DiffusionNoiseVisualizer() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [alpha, setAlpha] = useState(1),
    [seed, setSeed] = useState(42)
  const pixels = useMemo(() => {
    const noise = normalNoise(seed)
    return Array.from({ length: 32 * 20 }, (_, i) => {
      const x = i % 32,
        y = Math.floor(i / 32)
      const signal = (x - 16) ** 2 + (y - 10) ** 2 < 49 ? 1 : -1
      return { signal, noise: noise() }
    })
  }, [seed])
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <h3 className="text-xl text-gradient">{c.noiseTitle}</h3>
      <p className="text-sm text-muted">{c.noiseNote}</p>
      <label className="block">
        {c.signal}: {alpha.toFixed(2)}
        <input
          aria-label={c.signal}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={alpha}
          onChange={(e) => setAlpha(+e.target.value)}
          className="w-full"
        />
      </label>
      <label className="block text-sm">
        Seed{' '}
        <input
          aria-label="Seed"
          type="number"
          min={1}
          max={99999}
          value={seed}
          onChange={(e) => {
            const n = +e.target.value
            if (Number.isInteger(n) && n > 0) setSeed(n)
          }}
          className="ml-3 w-24 rounded-lg border border-border bg-background p-2"
        />
      </label>
      <svg
        viewBox="0 0 320 200"
        className="w-full max-w-xl rounded-lg mx-auto"
        role="img"
        aria-label={c.noiseTitle}
      >
        {pixels.map((p, i) => {
          const val = noisySample(p.signal, p.noise, alpha)
          const display = Math.round(
            Math.max(0, Math.min(255, 127.5 + val * 65)),
          )
          return (
            <rect
              key={i}
              x={(i % 32) * 10}
              y={Math.floor(i / 32) * 10}
              width="10"
              height="10"
              fill={`rgb(${display},${display},${display})`}
            />
          )
        })}
      </svg>
      <code className="block text-xs break-words">
        x₀={pixels[336].signal}, ε={pixels[336].noise.toFixed(4)} → xₜ=
        {noisySample(pixels[336].signal, pixels[336].noise, alpha).toFixed(4)}
      </code>
      <p className="text-sm text-muted">{c.noiseLimit}</p>
      <a
        href="https://arxiv.org/abs/2006.11239"
        target="_blank"
        rel="noreferrer"
        className="text-primary-light text-sm underline"
      >
        DDPM (2020)
      </a>
    </div>
  )
}
