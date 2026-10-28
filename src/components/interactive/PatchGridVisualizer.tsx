'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { IMAGE_H, IMAGE_W, LABEL_CAP_HEIGHT, LABEL_REGION, ResampledView, fitInto, type Rect } from './InspectionImage'

type ModeId = 'fixed' | 'tiles' | 'native'

interface EncoderMode {
  id: ModeId
  canvas: readonly [number, number]
  target: Rect
  /** Grid spacing drawn on the canvas (ViT patch or merged token cell). */
  grid: number
  major?: number
  tokens: number
}

const PATCH = 14

function letterboxed(canvasW: number, canvasH: number): Rect {
  const f = fitInto(IMAGE_W, IMAGE_H, canvasW, canvasH)
  return [f.x, f.y, f.w, f.h]
}

// Qwen2-VL rounds each side to a multiple of 28 px (14 px patches, 2 × 2 merge).
const NATIVE_W = Math.round(IMAGE_W / 28) * 28
const NATIVE_H = Math.round(IMAGE_H / 28) * 28

const MODES: EncoderMode[] = [
  // LLaVA-1.5: 336 px square, 24 × 24 patches = 576 tokens
  { id: 'fixed', canvas: [336, 336], target: letterboxed(336, 336), grid: PATCH, tokens: (336 / PATCH) ** 2 },
  // LLaVA-NeXT AnyRes: 2 × 2 tiles of 336 px plus one 336 px overview image
  { id: 'tiles', canvas: [672, 672], target: letterboxed(672, 672), grid: PATCH, major: 336, tokens: 4 * (336 / PATCH) ** 2 + (336 / PATCH) ** 2 },
  // Qwen2-VL native resolution: one token per 28 × 28 px
  { id: 'native', canvas: [NATIVE_W, NATIVE_H], target: [0, 0, NATIVE_W, NATIVE_H], grid: 28, tokens: (NATIVE_W / 28) * (NATIVE_H / 28) },
]

export function PatchGridVisualizer() {
  const { t, locale } = useTranslation()
  const v = t.vision
  const [modeId, setModeId] = useState<ModeId>('fixed')
  const [showGrid, setShowGrid] = useState(true)
  const mode = MODES.find(m => m.id === modeId) ?? MODES[0]
  const fmt = (n: number, digits = 0) => n.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const sx = mode.target[2] / IMAGE_W
  const sy = mode.target[3] / IMAGE_H
  const capPx = LABEL_CAP_HEIGHT * sy
  const zoom: Rect = [
    mode.target[0] + LABEL_REGION[0] * sx,
    mode.target[1] + LABEL_REGION[1] * sy,
    LABEL_REGION[2] * sx,
    LABEL_REGION[3] * sy,
  ]

  const labels: Record<ModeId, string> = { fixed: v.budgetModeFixed, tiles: v.budgetModeTiles, native: v.budgetModeNative }
  const notes: Record<ModeId, string> = { fixed: v.budgetModeFixedNote, tiles: v.budgetModeTilesNote, native: v.budgetModeNativeNote }

  const stats = [
    { label: v.budgetInput, value: `${mode.canvas[0]} × ${mode.canvas[1]} px` },
    { label: v.budgetScale, value: `${fmt(sy, 2)}×` },
    { label: v.budgetTokens, value: fmt(mode.tokens) },
    { label: v.budgetCapHeight, value: v.budgetCapHeightValue.replace('{px}', fmt(capPx, 1)).replace('{patches}', fmt(capPx / PATCH, 2)) },
  ]

  return (
    <section className="rounded-2xl bg-surface border border-border p-4 sm:p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold font-heading text-text">{v.budgetDemoTitle}</h3>
        <p className="text-sm text-muted mt-1">{v.budgetDemoDesc}</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label={v.budgetInput}>
        {MODES.map(m => (
          <button
            key={m.id}
            aria-pressed={modeId === m.id}
            onClick={() => setModeId(m.id)}
            className={`min-h-11 px-4 rounded-lg border text-sm transition-colors ${modeId === m.id ? 'border-primary bg-primary/15 text-text' : 'border-border text-muted hover:text-text'}`}
          >
            {labels[m.id]}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} />
          {v.budgetShowGrid}
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[3fr_2fr] items-start">
        <ResampledView
          source={[0, 0, IMAGE_W, IMAGE_H]}
          canvas={mode.canvas}
          target={mode.target}
          grid={showGrid ? mode.grid : undefined}
          majorGrid={showGrid ? mode.major : undefined}
          alt={v.budgetImageAlt}
        >
          <rect x={zoom[0]} y={zoom[1]} width={zoom[2]} height={zoom[3]} fill="none" stroke="#e11d48" strokeWidth={mode.canvas[0] / 160} />
        </ResampledView>
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{v.budgetZoomLabel}</div>
          <ResampledView
            source={[0, 0, IMAGE_W, IMAGE_H]}
            canvas={mode.canvas}
            target={mode.target}
            view={zoom}
            grid={showGrid ? PATCH : undefined}
            alt={v.budgetZoomAlt}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map(s => (
              <div key={s.label} className="rounded-xl bg-background border border-border p-3">
                <div className="text-xs text-muted">{s.label}</div>
                <div className="font-mono text-sm text-text mt-1">{s.value}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted">{notes[mode.id]}</p>
        </motion.div>
      </AnimatePresence>

      <p className="text-sm text-text/90 rounded-lg border border-primary/20 bg-primary/5 p-3">{v.budgetTakeaway}</p>
    </section>
  )
}
