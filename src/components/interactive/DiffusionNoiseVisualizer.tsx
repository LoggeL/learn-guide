'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, RotateCcw, Pause } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type AutoDirection = 'forward' | 'reverse' | null

function pseudoNoise(x: number, y: number, t: number): number {
  const a = Math.sin((x * 0.092) + (t * 0.008))
  const b = Math.cos((y * 0.11) - (t * 0.01))
  const c = Math.sin(((x + y) * 0.045) + (t * 0.012))
  return (a + b + c) / 3
}

export function DiffusionNoiseVisualizer() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const [noiseLevel, setNoiseLevel] = useState(36)
  const [autoDirection, setAutoDirection] = useState<AutoDirection>(null)

  const noiseRatio = useMemo(() => noiseLevel / 100, [noiseLevel])

  useEffect(() => {
    if (!autoDirection) return

    const intervalId = window.setInterval(() => {
      setNoiseLevel((current) => {
        if (autoDirection === 'forward') {
          if (current >= 100) {
            setAutoDirection(null)
            return 100
          }
          return Math.min(100, current + 1)
        }

        if (current <= 0) {
          setAutoDirection(null)
          return 0
        }

        return Math.max(0, current - 1)
      })
    }, 45)

    return () => window.clearInterval(intervalId)
  }, [autoDirection])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = (time: number) => {
      const dpr = window.devicePixelRatio || 1
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const cell = 8
      const glow = Math.max(0.15, 1 - noiseRatio * 0.6)
      const wave = 1 - noiseRatio

      for (let y = 0; y < height; y += cell) {
        for (let x = 0; x < width; x += cell) {
          const smooth = Math.sin((x * 0.024) + (time * 0.0014)) * Math.cos((y * 0.02) - (time * 0.0011))
          const random = pseudoNoise(x, y, time)
          const mixed = (smooth * wave) + (random * noiseRatio)
          const intensity = (mixed + 1) / 2

          const hue = 248 + (intensity * 48)
          const saturation = 72 + (noiseRatio * 20)
          const lightness = 24 + (intensity * 42 * glow)

          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
          ctx.fillRect(x, y, cell, cell)
        }
      }

      const overlay = ctx.createLinearGradient(0, 0, width, height)
      overlay.addColorStop(0, `rgba(139, 92, 246, ${0.08 + noiseRatio * 0.12})`)
      overlay.addColorStop(1, `rgba(217, 70, 239, ${0.06 + noiseRatio * 0.1})`)
      ctx.fillStyle = overlay
      ctx.fillRect(0, 0, width, height)

      frameRef.current = requestAnimationFrame(render)
    }

    frameRef.current = requestAnimationFrame(render)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [noiseRatio])

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-semibold font-heading text-text">{t.interactive.diffusionNoiseTitle}</h3>
            <p className="text-xs text-muted">{t.interactive.diffusionNoiseDesc}</p>
          </div>
          <span className="text-sm font-mono text-purple-300">{noiseLevel}%</span>
        </div>

        <div className="rounded-xl border border-purple-500/30 overflow-hidden bg-[#0b0b1a]">
          <canvas ref={canvasRef} className="w-full h-56 md:h-64 block" />
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-subtle">
            <span>{t.interactive.diffusionNoiseSignal}</span>
            <span>{t.interactive.diffusionNoiseNoisy}</span>
          </div>
          <label className="block">
            <span className="sr-only">{t.interactive.diffusionNoiseLevel}</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAutoDirection((current) => (current === 'forward' ? null : 'forward'))}
            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              autoDirection === 'forward'
                ? 'bg-violet-500/20 border-violet-400/40 text-violet-200'
                : 'bg-surface-elevated border-border text-text hover:border-violet-400/40'
            }`}
          >
            {autoDirection === 'forward' ? <Pause size={14} /> : <Play size={14} />}
            {autoDirection === 'forward' ? t.interactive.diffusionPause : t.interactive.diffusionPlayForward}
          </button>

          <button
            onClick={() => setAutoDirection((current) => (current === 'reverse' ? null : 'reverse'))}
            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              autoDirection === 'reverse'
                ? 'bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-200'
                : 'bg-surface-elevated border-border text-text hover:border-fuchsia-400/40'
            }`}
          >
            {autoDirection === 'reverse' ? <Pause size={14} /> : <Play size={14} />}
            {autoDirection === 'reverse' ? t.interactive.diffusionPause : t.interactive.diffusionPlayReverse}
          </button>

          <button
            onClick={() => {
              setAutoDirection(null)
              setNoiseLevel(36)
            }}
            className="px-3 py-2 rounded-lg border border-border bg-surface-elevated text-text hover:border-purple-400/40 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            {t.interactive.diffusionReset}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4">
        <p className="text-xs text-muted">{t.interactive.diffusionAutoplayHint}</p>
      </div>
    </div>
  )
}
