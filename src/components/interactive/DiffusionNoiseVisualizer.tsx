'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type AutoDirection = 'forward' | 'reverse' | null

// Draw a simple recognizable image: a smiley face inside a sun
function drawBaseImage(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.28

  ctx.clearRect(0, 0, w, h)

  // Background gradient
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7)
  bg.addColorStop(0, '#1a103a')
  bg.addColorStop(1, '#0b0b1a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Sun rays
  ctx.save()
  ctx.translate(cx, cy)
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(Math.cos(angle) * (r + 8), Math.sin(angle) * (r + 8))
    ctx.lineTo(Math.cos(angle) * (r + 28), Math.sin(angle) * (r + 28))
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.stroke()
  }
  ctx.restore()

  // Main circle (face)
  const faceGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r)
  faceGrad.addColorStop(0, '#fbbf24')
  faceGrad.addColorStop(1, '#f59e0b')
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = faceGrad
  ctx.fill()
  ctx.strokeStyle = '#d97706'
  ctx.lineWidth = 2
  ctx.stroke()

  // Eyes
  const eyeOffsetX = r * 0.3
  const eyeOffsetY = r * 0.15
  const eyeRadius = r * 0.1

  // Left eye
  ctx.beginPath()
  ctx.arc(cx - eyeOffsetX, cy - eyeOffsetY, eyeRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#292524'
  ctx.fill()

  // Right eye
  ctx.beginPath()
  ctx.arc(cx + eyeOffsetX, cy - eyeOffsetY, eyeRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#292524'
  ctx.fill()

  // Eye highlights
  const hlR = eyeRadius * 0.35
  ctx.beginPath()
  ctx.arc(cx - eyeOffsetX + hlR, cy - eyeOffsetY - hlR, hlR, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + eyeOffsetX + hlR, cy - eyeOffsetY - hlR, hlR, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fill()

  // Smile
  ctx.beginPath()
  ctx.arc(cx, cy + r * 0.05, r * 0.5, Math.PI * 0.15, Math.PI * 0.85)
  ctx.strokeStyle = '#292524'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.stroke()

  // Rosy cheeks
  ctx.beginPath()
  ctx.arc(cx - r * 0.5, cy + r * 0.2, r * 0.12, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(239, 68, 68, 0.25)'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + r * 0.5, cy + r * 0.2, r * 0.12, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(239, 68, 68, 0.25)'
  ctx.fill()
}

// Generate a static noise buffer (seeded, deterministic)
function generateNoiseBuffer(w: number, h: number): Uint8ClampedArray {
  const buf = new Uint8ClampedArray(w * h * 4)
  let seed = 42
  for (let i = 0; i < w * h; i++) {
    // Simple LCG PRNG
    seed = (seed * 1664525 + 1013904223) & 0xffffffff
    const v = (seed >>> 16) & 0xff
    const idx = i * 4
    buf[idx] = v
    buf[idx + 1] = v
    buf[idx + 2] = v
    buf[idx + 3] = 255
  }
  return buf
}

export function DiffusionNoiseVisualizer() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const baseImageRef = useRef<ImageData | null>(null)
  const noiseBufferRef = useRef<Uint8ClampedArray | null>(null)
  const [noiseLevel, setNoiseLevel] = useState(0)
  const [autoDirection, setAutoDirection] = useState<AutoDirection>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  const noiseRatio = noiseLevel / 100

  // Initialize base image
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawBaseImage(ctx, width, height)

    // Capture the clean image
    baseImageRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
    noiseBufferRef.current = generateNoiseBuffer(canvas.width, canvas.height)
    setHasInitialized(true)
  }, [])

  // Render blended image whenever noise level changes
  useEffect(() => {
    if (!hasInitialized) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const baseImage = baseImageRef.current
    const noiseBuf = noiseBufferRef.current
    if (!baseImage || !noiseBuf) return

    const blended = ctx.createImageData(baseImage.width, baseImage.height)
    const src = baseImage.data
    const dst = blended.data
    const nr = noiseRatio

    // Interpolate pixels: clean image → noise
    for (let i = 0; i < src.length; i += 4) {
      dst[i] = Math.round(src[i] * (1 - nr) + noiseBuf[i] * nr)
      dst[i + 1] = Math.round(src[i + 1] * (1 - nr) + noiseBuf[i + 1] * nr)
      dst[i + 2] = Math.round(src[i + 2] * (1 - nr) + noiseBuf[i + 2] * nr)
      dst[i + 3] = 255
    }

    ctx.putImageData(blended, 0, 0)
  }, [noiseRatio, hasInitialized])

  // Autoplay
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
    }, 40)

    return () => window.clearInterval(intervalId)
  }, [autoDirection])

  const runFullCycle = useCallback(() => {
    setNoiseLevel(0)
    setAutoDirection('forward')
    // After reaching 100, auto-reverse
    const checkForward = setInterval(() => {
      setNoiseLevel((current) => {
        if (current >= 100) {
          clearInterval(checkForward)
          setTimeout(() => setAutoDirection('reverse'), 600)
        }
        return current
      })
    }, 100)
    return () => clearInterval(checkForward)
  }, [])

  // Get the current step label
  const getStepLabel = () => {
    if (noiseRatio < 0.05) return t.interactive.diffusionStepClean
    if (noiseRatio < 0.35) return t.interactive.diffusionStepLight
    if (noiseRatio < 0.65) return t.interactive.diffusionStepMedium
    if (noiseRatio < 0.9) return t.interactive.diffusionStepHeavy
    return t.interactive.diffusionStepPure
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface border border-border p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
              <Sparkles size={18} className="text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold font-heading text-text">{t.interactive.diffusionNoiseTitle}</h3>
              <p className="text-xs text-muted">{t.interactive.diffusionNoiseDesc}</p>
            </div>
          </div>
          <span className="text-sm font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
            {noiseLevel}%
          </span>
        </div>

        {/* Canvas */}
        <div className="rounded-xl border border-purple-500/30 overflow-hidden bg-[#0b0b1a] relative">
          <canvas ref={canvasRef} className="w-full h-56 md:h-72 block" />
          {/* Step label overlay */}
          <motion.div
            key={getStepLabel()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10"
          >
            <span className="text-xs font-medium text-white/80">{getStepLabel()}</span>
          </motion.div>
        </div>

        {/* Process Diagram */}
        <div className="mt-4 grid grid-cols-5 gap-1 items-center">
          {[0, 25, 50, 75, 100].map((level, i) => (
            <button
              key={level}
              onClick={() => { setAutoDirection(null); setNoiseLevel(level) }}
              className={`text-center py-2 rounded-lg border text-xs transition-all cursor-pointer ${
                Math.abs(noiseLevel - level) < 13
                  ? 'bg-violet-500/20 border-violet-400/40 text-violet-200'
                  : 'bg-surface-elevated border-border text-muted hover:border-violet-400/20'
              }`}
            >
              <div className="font-mono font-semibold">t={i}</div>
              <div className="text-[10px] mt-0.5 opacity-70">
                {i === 0 ? t.interactive.diffusionTimeClean : i === 4 ? t.interactive.diffusionTimeNoise : `${level}%`}
              </div>
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              {t.interactive.diffusionNoiseSignal}
            </span>
            <span className="flex items-center gap-1">
              {t.interactive.diffusionNoiseNoisy}
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            </span>
          </div>
          <div className="relative">
            <div
              className="absolute top-1/2 left-0 h-2 rounded-full -translate-y-1/2 bg-gradient-to-r from-emerald-500/40 via-violet-500/40 to-red-500/40"
              style={{ width: '100%' }}
            />
            <label className="block relative">
              <span className="sr-only">{t.interactive.diffusionNoiseLevel}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={noiseLevel}
                onChange={(e) => {
                  setAutoDirection(null)
                  setNoiseLevel(Number(e.target.value))
                }}
                className="w-full relative z-10"
              />
            </label>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAutoDirection((c) => (c === 'forward' ? null : 'forward'))}
            className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              autoDirection === 'forward'
                ? 'bg-violet-500/20 border-violet-400/40 text-violet-200'
                : 'bg-surface-elevated border-border text-text hover:border-violet-400/40'
            }`}
          >
            {autoDirection === 'forward' ? <Pause size={14} /> : <ArrowRight size={14} />}
            {autoDirection === 'forward' ? t.interactive.diffusionPause : t.interactive.diffusionPlayForward}
          </button>

          <button
            onClick={() => setAutoDirection((c) => (c === 'reverse' ? null : 'reverse'))}
            className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              autoDirection === 'reverse'
                ? 'bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-200'
                : 'bg-surface-elevated border-border text-text hover:border-fuchsia-400/40'
            }`}
          >
            {autoDirection === 'reverse' ? <Pause size={14} /> : <ArrowLeft size={14} />}
            {autoDirection === 'reverse' ? t.interactive.diffusionPause : t.interactive.diffusionPlayReverse}
          </button>

          <button
            onClick={runFullCycle}
            className="px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-violet-500/30 text-violet-200 hover:from-violet-500/20 hover:to-fuchsia-500/20"
          >
            <Play size={14} />
            {t.interactive.diffusionFullCycle}
          </button>

          <button
            onClick={() => {
              setAutoDirection(null)
              setNoiseLevel(0)
            }}
            className="px-3.5 py-2 rounded-lg border border-border bg-surface-elevated text-text hover:border-purple-400/40 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            {t.interactive.diffusionReset}
          </button>
        </div>
      </div>

      {/* Educational callout */}
      <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4">
        <p className="text-xs text-muted leading-relaxed">{t.interactive.diffusionAutoplayHint}</p>
      </div>
    </div>
  )
}
