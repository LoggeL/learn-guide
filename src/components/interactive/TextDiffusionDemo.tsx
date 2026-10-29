'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw, SkipForward, StepForward } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import {
  diffusionBuildToyLm,
  diffusionClassifySentence,
  diffusionRunTextSampler,
  diffusionUniform,
  type DiffusionRemaskOrder,
} from '@/lib/diffusion-math'

const CANVAS_LENGTH = 8
const K_OPTIONS = [1, 2, 4, 8]
const MASK = '[MASK]'

/** Masked diffusion sampling with a computed bidirectional bigram denoiser and LLaDA-style remasking. */
export function TextDiffusionDemo() {
  const { t } = useTranslation()
  const c = t.textDiffusion
  const [k, setK] = useState(1)
  const [order, setOrder] = useState<DiffusionRemaskOrder>('confidence')
  const [step, setStep] = useState(0)

  const lm = useMemo(() => diffusionBuildToyLm(c.demoCorpus, CANVAS_LENGTH), [c.demoCorpus])
  const trace = useMemo(() => diffusionRunTextSampler(lm, k, order, diffusionUniform(7)), [lm, k, order])

  const total = trace.length - 1
  const current = trace[Math.min(step, total)]
  const finalCanvas = trace[total].canvas as string[]
  const finished = step >= total
  const kind = finished ? diffusionClassifySentence(lm, finalCanvas) : null

  const choose = (next: () => void) => {
    next()
    setStep(0)
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <details className="rounded-lg border border-border bg-background p-3 text-sm">
        <summary className="cursor-pointer text-muted">{c.demoCorpusLabel}</summary>
        <ol className="mt-2 grid gap-1 font-mono text-xs text-text sm:grid-cols-2">
          {c.demoCorpus.map((sentence) => (
            <li key={sentence}>{sentence}</li>
          ))}
        </ol>
      </details>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">{c.demoTokensPerStep}</span>
        {K_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={k === n}
            onClick={() => choose(() => setK(n))}
            className={`min-w-10 rounded-lg border px-3 py-1.5 font-mono text-sm ${
              k === n ? 'border-primary bg-primary/15 text-text' : 'border-border text-muted hover:text-text'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">{c.demoOrderLabel}</span>
        {(['confidence', 'random'] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={order === value}
            onClick={() => choose(() => setOrder(value))}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              order === value ? 'border-primary bg-primary/15 text-text' : 'border-border text-muted hover:text-text'
            }`}
          >
            {value === 'confidence' ? c.demoOrderConfidence : c.demoOrderRandom}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {current.canvas.map((token, i) => (
          <div
            key={i}
            className={`relative flex min-h-16 flex-col items-center justify-center overflow-hidden rounded-lg border p-2 text-center ${
              token ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-violet-500/50 bg-violet-500/5'
            }`}
          >
            <span className="text-[10px] text-muted">{i + 1}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={token ?? MASK}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className={`font-mono text-xs sm:text-sm ${token ? 'text-emerald-300' : 'text-violet-300'}`}
              >
                {token ?? MASK}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={finished}
          onClick={() => setStep((s) => Math.min(total, s + 1))}
          className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm disabled:opacity-50"
        >
          <StepForward size={14} aria-hidden="true" />
          {c.demoNext}
        </button>
        <button
          type="button"
          disabled={finished}
          onClick={() => setStep(total)}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-text disabled:opacity-50"
        >
          <SkipForward size={14} aria-hidden="true" />
          {c.demoRunAll}
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-text"
        >
          <RotateCcw size={14} aria-hidden="true" />
          {c.demoReset}
        </button>
        <span className="ml-auto font-mono text-xs text-muted">
          {c.demoProgress
            .replace('{current}', String(step))
            .replace('{total}', String(total))
            .replace('{passes}', String(step))}
        </span>
      </div>

      {step === 0 ? (
        <p className="text-sm text-muted">{c.demoStart}</p>
      ) : (
        <div className="overflow-x-auto">
          <h4 className="mb-2 text-sm font-semibold text-text">{c.demoTableTitle}</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="p-2">{c.demoColPosition}</th>
                <th className="p-2">{c.demoColPrediction}</th>
                <th className="p-2">{c.demoColConfidence}</th>
                <th className="p-2">{c.demoColStatus}</th>
              </tr>
            </thead>
            <tbody>
              {current.proposals.map((p) => {
                const wrong = !p.kept && finalCanvas[p.index] !== p.token
                return (
                  <tr key={p.index} className="border-t border-border">
                    <td className="p-2 font-mono">{p.index + 1}</td>
                    <td className={`p-2 font-mono ${wrong ? 'text-orange-300 line-through decoration-orange-400/60' : 'text-text'}`}>
                      {p.token}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
                          <div className="h-full bg-primary" style={{ width: `${Math.round(p.confidence * 100)}%` }} />
                        </div>
                        <span className="font-mono text-xs">{(p.confidence * 100).toFixed(0)} %</span>
                      </div>
                    </td>
                    <td className={`p-2 text-xs ${p.kept ? 'text-emerald-300' : 'text-muted'}`}>
                      {p.kept ? c.demoKept : c.demoRemasked}
                      {wrong && <span className="ml-1 text-orange-300">· {c.demoChanged}</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {kind && (
        <p
          className={`rounded-lg border p-3 text-sm ${
            kind === 'broken' ? 'border-orange-500/40 bg-orange-500/10 text-orange-200' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          {kind === 'corpus' ? c.demoResultCorpus : kind === 'novel' ? c.demoResultNovel : c.demoResultBroken}
        </p>
      )}

      <p className="text-sm text-muted">{c.demoObserve}</p>
    </div>
  )
}
