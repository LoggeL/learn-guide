'use client'

import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Cpu, Eye, Gauge, HardDrive, Network, Repeat2, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const METRIC_ICONS = [HardDrive, Gauge, Cpu, Network, Eye]
const DEMO_ITERATIONS = 6

/** Illustrative activations only: these values do not model accuracy or cost. */
function StateStrip({ iteration, label }: { iteration: number; label: string }) {
  const reduceMotion = useReducedMotion()
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="text-xs text-muted">{label}</span>
      <div className="grid min-w-[120px] flex-1 grid-cols-8 gap-1" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <motion.span
            key={index}
            initial={false}
            animate={{ opacity: 0.2 + ((index * 7 + iteration * 11) % 17) / 22 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="h-6 rounded-sm bg-primary-light"
          />
        ))}
      </div>
    </div>
  )
}

export function LoopedTransformerVisualizer() {
  const { t } = useTranslation()
  const c = t.loopedTransformers
  const selectId = useId()
  const [baseline, setBaseline] = useState<'direct' | 'cot'>('direct')
  const [iteration, setIteration] = useState(1)
  const [unrolled, setUnrolled] = useState(false)
  const [monitor, setMonitor] = useState(false)
  const controls = 'min-h-11 rounded-lg border border-border bg-background px-4 py-2 text-sm text-text transition-colors hover:border-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none'

  return (
    <section aria-labelledby={`${selectId}-title`} className="overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="border-b border-border bg-gradient-to-r from-purple-500/10 to-cyan-500/5 p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2 text-primary-light"><Repeat2 size={20} aria-hidden="true" /><span className="text-xs font-medium">{c.quality}</span></div>
        <h2 id={`${selectId}-title`} className="font-heading text-2xl font-bold text-gradient">{c.demoTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{c.demoNote}</p>
      </div>
      <div className="p-5 sm:p-6">
        <label htmlFor={selectId} className="mb-2 block text-sm text-muted">{c.compareLabel}</label>
        <select id={selectId} value={baseline} onChange={(event) => setBaseline(event.target.value as 'direct' | 'cot')} className={`${controls} w-full min-w-0 max-w-full`}>
          <option value="direct">{c.directOption}</option>
          <option value="cot">{c.cotOption}</option>
        </select>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <article className="min-w-0 rounded-xl border border-border bg-background/60 p-4">
            <h3 className="font-heading font-bold text-text">{c.standard}</h3>
            <div className="my-5 flex items-center justify-center gap-2" aria-label={c.directCaption}>
              {['A', 'B', 'C'].map((letter, index) => (
                <div key={letter} className="flex min-w-0 items-center gap-2">
                  {index > 0 && <ArrowRight size={16} className="shrink-0 text-muted" aria-hidden="true" />}
                  <div className="rounded-lg border border-cyan-400/25 bg-cyan-400/5 px-3 py-4 text-center text-xs text-cyan-200">{c.block}<br /><span className="font-mono">{letter}</span></div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs leading-relaxed text-muted">{baseline === 'cot' ? c.cotCaption : c.directCaption}</p>
            {!monitor && <StateStrip iteration={0} label={c.state} />}
          </article>

          <article className="min-w-0 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <h3 className="font-heading font-bold text-text">{c.loop}</h3>
            <div className="my-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-muted">{c.input}</span><ArrowRight size={16} className="text-muted" aria-hidden="true" />
              <div className="rounded-lg border border-primary/50 bg-primary/10 px-3 py-3 text-center text-primary-light">
                {c.core} <span className="font-mono">θ</span>
                <div className="mt-1 font-mono text-text">h<sub>{iteration}</sub></div>
              </div>
              <ArrowRight size={16} className="text-muted" aria-hidden="true" /><span className="text-muted">{c.output}</span>
            </div>
            <div className="mx-auto flex max-w-xs items-center gap-2 rounded-b-xl border-x border-b border-primary/40 px-3 pb-2 text-primary-light">
              <Repeat2 size={18} className="shrink-0" aria-hidden="true" /><span className="text-xs">{c.returnLabel}</span>
            </div>
            {!monitor && <StateStrip iteration={iteration} label={c.state} />}
          </article>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setIteration((value) => value === DEMO_ITERATIONS ? 1 : value + 1)} className={controls}>
            <span className="flex items-center gap-2">{iteration === DEMO_ITERATIONS ? <RotateCcw size={16} aria-hidden="true" /> : <Repeat2 size={16} aria-hidden="true" />}{iteration === DEMO_ITERATIONS ? c.reset : c.step}</span>
          </button>
          <span className="text-xs text-muted" role="status">{c.iteration} {iteration} · {c.fixed}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-text"><input type="checkbox" checked={unrolled} onChange={(event) => setUnrolled(event.target.checked)} className="h-4 w-4 accent-purple-500" />{c.unroll}</label>
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-text"><input type="checkbox" checked={monitor} onChange={(event) => setMonitor(event.target.checked)} className="h-4 w-4 accent-purple-500" />{c.monitor}</label>
        </div>
        {unrolled && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background/60 p-4" aria-label={c.unroll}>
            {Array.from({ length: iteration }, (_, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 font-mono text-primary-light">F<sub>θ</sub>(h<sub>{index}</sub>)</span>
                <ArrowRight size={14} className="text-muted" aria-hidden="true" />
              </div>
            ))}
            <span className="font-mono text-text">h<sub>{iteration}</sub></span>
          </div>
        )}
        {monitor && (
          <div className="mt-3 rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-4" role="status">
            <p className="text-sm text-text">{baseline === 'cot' ? c.monitorCot : c.monitorDirect}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{c.monitorLimit}</p>
          </div>
        )}

        <div className="mt-8">
          <h3 className="font-heading text-xl font-bold text-text">{c.metricsTitle}</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">{c.metricsNote}</p>
          <dl className="mt-4 divide-y divide-border border-y border-border" aria-live="polite">
            {c.metrics.map((metric, index) => {
              const Icon = METRIC_ICONS[index]
              return (
                <div key={metric.name} className="grid gap-3 py-5 md:grid-cols-[210px_minmax(0,1fr)] md:gap-6">
                  <dt><span className="flex items-center gap-2 font-heading font-bold text-text"><Icon size={18} className="shrink-0 text-primary-light" aria-hidden="true" />{metric.name}</span><span className="mt-2 block text-xs leading-relaxed text-muted">{metric.unit}</span></dt>
                  <dd><p className="text-sm font-medium text-text">{baseline === 'direct' ? metric.directTitle : metric.cotTitle}</p><p className="mt-1 text-sm leading-relaxed text-muted">{baseline === 'direct' ? metric.directBody : metric.cotBody}</p></dd>
                </div>
              )
            })}
          </dl>
        </div>
        <details className="mt-5">
          <summary className="min-h-11 cursor-pointer py-2 text-sm font-medium text-primary-light">{c.methodsTitle}</summary>
          <div className="mt-3 grid gap-6 md:grid-cols-2">
            {c.methods.map((method) => <div key={method.title}><h4 className="font-heading font-bold text-text">{method.title}</h4><p className="mt-2 text-sm leading-relaxed text-muted">{method.body}</p></div>)}
          </div>
        </details>
      </div>
    </section>
  )
}
