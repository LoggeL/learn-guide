'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { IMAGE_H, IMAGE_W, LABEL_CAP_HEIGHT, LABEL_REGION, OriginalView, ResampledView, fitInto, type Rect } from './InspectionImage'

// Same budget as the fixed-resolution encoder in the encoding demo: 336 × 336 px, 14 px patches.
const BUDGET = 336
const PATCH = 14
const TOKENS = (BUDGET / PATCH) ** 2

const full = fitInto(IMAGE_W, IMAGE_H, BUDGET, BUDGET)
const FULL_TARGET: Rect = [full.x, full.y, full.w, full.h]

// The scripted model output: the label region expressed in the model's own 336 × 336 input frame (x0, y0, x1, y1).
const MODEL_BOX = [
  Math.round(LABEL_REGION[0] * full.scale + full.x),
  Math.round(LABEL_REGION[1] * full.scale + full.y),
  Math.round((LABEL_REGION[0] + LABEL_REGION[2]) * full.scale + full.x),
  Math.round((LABEL_REGION[1] + LABEL_REGION[3]) * full.scale + full.y),
] as const

/** Correct tool: remove the letterbox offset, then undo the scale. */
function toOriginal(box: readonly number[]): Rect {
  const x0 = Math.round((box[0] - full.x) / full.scale)
  const y0 = Math.round((box[1] - full.y) / full.scale)
  const x1 = Math.round((box[2] - full.x) / full.scale)
  const y1 = Math.round((box[3] - full.y) / full.scale)
  return [x0, y0, x1 - x0, y1 - y0]
}

/** Buggy tool: uses the model-frame coordinates as if they were original pixels. */
function withoutRescale(box: readonly number[]): Rect {
  return [box[0], box[1], box[2] - box[0], box[3] - box[1]]
}

export function AgenticVisionDemo() {
  const { t, locale } = useTranslation()
  const v = t.vision
  const [step, setStep] = useState(0)
  const [bug, setBug] = useState(false)
  const fmt = (n: number, digits = 0) => n.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const crop = bug ? withoutRescale(MODEL_BOX) : toOriginal(MODEL_BOX)
  const cropFit = fitInto(crop[2], crop[3], BUDGET, BUDGET)
  const cropTarget: Rect = [cropFit.x, cropFit.y, cropFit.w, cropFit.h]
  const capFull = LABEL_CAP_HEIGHT * full.scale
  const capCrop = LABEL_CAP_HEIGHT * cropFit.scale

  const steps = [
    { name: v.loopStep1, desc: v.loopStep1Desc.replace('{tokens}', fmt(TOKENS)).replace('{cap}', fmt(capFull, 1)) },
    { name: v.loopStep2, desc: v.loopStep2Desc },
    { name: v.loopStep3, desc: bug ? v.loopStep3DescBug : v.loopStep3Desc.replace('{factor}', fmt(1 / full.scale, 2)) },
    {
      name: v.loopStep4,
      desc: bug
        ? v.loopStep4DescBug
        : v.loopStep4Desc.replace('{tokens}', fmt(TOKENS)).replace('{cap}', fmt(capCrop, 1)).replace('{patches}', fmt(capCrop / PATCH, 1)).replace('{total}', fmt(2 * TOKENS)),
    },
  ]

  const toolCall = JSON.stringify({ tool: 'crop_image', box_xyxy: MODEL_BOX })
  const boxColor = bug ? '#f97316' : '#10b981'

  return (
    <section className="rounded-2xl bg-surface border border-border p-4 sm:p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold font-heading text-text">{v.loopDemoTitle}</h3>
        <p className="text-sm text-muted mt-1">{v.loopDemoDesc}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.name} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted" aria-hidden="true">→</span>}
            <button
              aria-pressed={step === i}
              onClick={() => setStep(i)}
              className={`min-h-11 px-3 rounded-lg border text-sm transition-colors ${step === i ? 'border-primary bg-primary/15 text-text' : i < step ? 'border-primary/40 text-text' : 'border-border text-muted hover:text-text'}`}
            >
              {i + 1}. {s.name}
            </button>
          </div>
        ))}
        <span className="text-muted" aria-hidden="true">⟲</span>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={bug} onChange={e => setBug(e.target.checked)} />
        {v.loopBugToggle}
      </label>

      <AnimatePresence mode="wait">
        <motion.p
          key={`${step}-${bug}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-text/90"
          role="status"
        >
          {steps[step].desc}
        </motion.p>
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2 items-start">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{v.loopModelView} · {BUDGET} × {BUDGET} px</div>
          {step < 3 ? (
            <ResampledView source={[0, 0, IMAGE_W, IMAGE_H]} canvas={[BUDGET, BUDGET]} target={FULL_TARGET} grid={PATCH} alt={v.loopImageAlt}>
              {step >= 1 && (
                <rect x={MODEL_BOX[0]} y={MODEL_BOX[1]} width={MODEL_BOX[2] - MODEL_BOX[0]} height={MODEL_BOX[3] - MODEL_BOX[1]} fill="none" stroke="#e11d48" strokeWidth={2} />
              )}
            </ResampledView>
          ) : (
            <ResampledView source={crop} canvas={[BUDGET, BUDGET]} target={cropTarget} grid={PATCH} alt={v.loopImageAlt} />
          )}
          {step === 3 && !bug && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-300">{v.loopReading}</p>
          )}
        </div>

        <div className="space-y-4">
          {step >= 1 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">{v.loopToolCall}</div>
              <pre className="rounded-lg bg-background border border-border p-3 text-xs font-mono text-cyan-300 overflow-x-auto">{toolCall}</pre>
            </div>
          )}
          {step >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">{v.loopToolResult}: <span className="font-mono normal-case" style={{ color: boxColor }}>x={crop[0]}, y={crop[1]}, w={crop[2]}, h={crop[3]}</span></div>
              <div className="text-xs text-muted">{v.loopOriginalView}</div>
              <OriginalView alt={v.loopOriginalAlt}>
                <rect x={crop[0]} y={crop[1]} width={crop[2]} height={crop[3]} fill="none" stroke={boxColor} strokeWidth={8} />
              </OriginalView>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
