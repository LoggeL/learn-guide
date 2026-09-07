'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Cpu, Eye, Gauge, HardDrive, Network, Pause, Play, Repeat2, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const METRIC_ICONS = [HardDrive, Gauge, Cpu, Network, Eye]
const DURATION_MS = 10000
// A shared timeline illustrates two core traversals vs one distinct-layer stack.
// The return leg carries the updated activation, not a newly decoded token.
const LOOP_PATH = [
  [0, 180, 24], [0.12, 180, 96], [0.34, 180, 192],
  [0.42, 300, 192], [0.52, 300, 70], [0.60, 180, 70],
  [0.65, 180, 96], [0.87, 180, 192], [1, 180, 300],
]

function loopPosition(progress: number) {
  const index = Math.max(1, LOOP_PATH.findIndex(([time]) => time >= progress))
  const [start, x1, y1] = LOOP_PATH[index - 1]
  const [end, x2, y2] = LOOP_PATH[index]
  const fraction = (progress - start) / (end - start)
  return { x: x1 + (x2 - x1) * fraction, y: y1 + (y2 - y1) * fraction }
}

function StateStrip({ stage, label, symbol }: { stage: number; label: string; symbol: string }) {
  const reduceMotion = useReducedMotion()
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-muted"><span>{label}</span><span className="font-mono text-text">{symbol}<sub>{stage}</sub></span></div>
      <div className="grid grid-cols-8 gap-1.5" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <motion.span key={index} initial={false} animate={{ opacity: 0.2 + ((index * 7 + stage * 11) % 17) / 22 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="h-5 rounded-sm bg-primary-light" />
        ))}
      </div>
    </div>
  )
}

export function LoopedTransformerVisualizer() {
  const { t } = useTranslation()
  const c = t.loopedTransformers
  const id = useId()
  const reduceMotion = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const [playing, setPlaying] = useState(false)
  const update = (value: number) => { progressRef.current = value; setProgress(value) }

  useEffect(() => {
    if (!playing) return
    if (reduceMotion) { progressRef.current = 1; setProgress(1); setPlaying(false); return }
    const offset = progressRef.current
    const started = performance.now()
    let frame: number
    const tick = (now: number) => {
      const next = Math.min(1, offset + (now - started) / DURATION_MS)
      progressRef.current = next
      setProgress(next)
      if (next === 1) setPlaying(false)
      else frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, reduceMotion])

  const togglePlayback = () => {
    if (progress >= 1) update(0)
    setPlaying((value) => !value)
  }
  const loopStage = progress >= 0.87 ? 2 : progress >= 0.34 ? 1 : 0
  const largeStage = Math.max(0, Math.min(6, Math.floor((progress * 276 + 24 - 66) / 30)))
  const position = loopPosition(progress)
  const percent = Math.round(progress * 100)
  const textCount = Math.min(c.cotSteps.length, Math.floor(progress * c.cotSteps.length))
  const playbackLabel = playing ? c.pause : progress >= 1 ? c.replay : c.play
  const PlaybackIcon = playing ? Pause : progress >= 1 ? RotateCcw : Play
  const buttonClass = 'inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary-light hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'

  return (
    <>
      <section data-loop-flow aria-labelledby={`${id}-title`} className="overflow-hidden rounded-2xl border border-border bg-surface/60">
        <div className="border-b border-border bg-gradient-to-r from-purple-500/10 to-cyan-500/5 p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-primary-light"><Repeat2 size={20} aria-hidden="true" /><span className="text-xs">{c.quality}</span></div>
          <h2 id={`${id}-title`} className="font-heading text-2xl font-bold text-gradient">{c.demoTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{c.demoNote}</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {(['loop', 'standard'] as const).map((kind) => {
              const small = kind === 'loop'
              return (
                <article key={kind} data-model={kind} className={`min-w-0 rounded-xl border p-3 sm:p-4 ${small ? 'border-primary/30 bg-primary/5' : 'border-cyan-400/25 bg-cyan-400/5'}`}>
                  <h3 className="font-heading font-bold text-text">{c[kind]}</h3>
                  <p className="mt-1 text-xs text-muted">{small ? c.smallCaption : c.largeCaption}</p>
                  <div className="mt-5 text-center text-xs text-muted">{c.input}</div>
                  <svg viewBox="0 0 360 325" className="mx-auto w-full max-w-[380px]" role="img" aria-label={small ? c.smallCaption : c.largeCaption}>
                    <path d="M180 24 V300" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
                    {small ? (
                      <>
                        <path d="M180 192 H300 V70 H180 V96" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-light/60" />
                        <path d="m185 86 -5 10 -5 -10" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-light" />
                        <rect x="110" y="96" width="140" height="96" rx="12" className="fill-surface stroke-primary/60" />
                        <text x="180" y="85" textAnchor="middle" fontSize="14" fill="currentColor" className="text-primary-light">{c.core}</text>
                        {[0, 1].map((index) => <g key={index}><rect x="126" y={113 + index * 36} width="108" height="24" rx="5" className="fill-primary/20 stroke-primary/30" /><text x="143" y={130 + index * 36} fontSize="14" fill="currentColor" className="text-primary-light">θ{index + 1}</text></g>)}
                      </>
                    ) : (
                      <>
                        <rect x="60" y="60" width="240" height="204" rx="12" className="fill-surface stroke-cyan-400/50" />
                        {Array.from({ length: 6 }, (_, index) => <g key={index}><rect x="77" y={72 + index * 30} width="206" height="24" rx="5" className="fill-cyan-400/10 stroke-cyan-400/25" /><text x="92" y={89 + index * 30} fontSize="14" fill="currentColor" className="text-cyan-200">θ{index + 1}</text></g>)}
                      </>
                    )}
                    <circle data-token cx={small ? position.x : 180} cy={small ? position.y : 24 + progress * 276} r="11" fill="currentColor" className={small ? 'text-primary-light' : 'text-cyan-300'} />
                    <circle cx={small ? position.x : 180} cy={small ? position.y : 24 + progress * 276} r="4" className="fill-background" />
                  </svg>
                  <div className={`mb-5 rounded-lg border px-3 py-2 text-center text-xs ${progress === 1 ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-border text-muted'}`}>{progress === 1 ? c.done : c.output}</div>
                  <StateStrip stage={small ? loopStage : largeStage} label={c.state} symbol={small ? 'h' : 'z'} />
                  <p className="mt-3 text-xs text-muted">{small ? c.loopPass : c.largePass}: <span className="font-mono text-text">{small ? loopStage : progress >= 0.87 ? 1 : 0} / {small ? 2 : 1}</span></p>
                </article>
              )
            })}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button type="button" onClick={togglePlayback} className={buttonClass}><PlaybackIcon size={16} aria-hidden="true" />{playbackLabel}</button>
            <span className="flex items-center gap-2 text-xs text-muted"><span className="h-2.5 w-2.5 rounded-full bg-primary-light" aria-hidden="true" />{c.tokenLabel}</span>
          </div>
          <label htmlFor={`${id}-progress`} className="mt-4 flex justify-between text-xs text-muted"><span>{c.progress}</span><span className="font-mono">{percent}%</span></label>
          <input id={`${id}-progress`} aria-label={c.progress} type="range" min="0" max="100" step="1" value={percent} onChange={(event) => { setPlaying(false); update(Number(event.target.value) / 100) }} className="mt-2 h-6 w-full cursor-pointer accent-purple-500" />
          <span className="sr-only" role="status">{progress === 1 ? c.done : playing ? c.play : c.pause}</span>
          <div className="mt-7">
            <h3 className="font-heading text-xl font-bold text-text">{c.metricsTitle}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">{c.metricsNote}</p>
            <dl className="mt-4 divide-y divide-border border-y border-border">
              {c.metrics.map((metric, index) => {
                const Icon = METRIC_ICONS[index]
                return <div key={metric.name} className="grid gap-3 py-5 md:grid-cols-[210px_minmax(0,1fr)] md:gap-6"><dt><span className="flex items-center gap-2 font-heading font-bold text-text"><Icon size={18} className="shrink-0 text-primary-light" aria-hidden="true" />{metric.name}</span><span className="mt-2 block text-xs leading-relaxed text-muted">{metric.unit}</span></dt><dd><p className="text-sm font-medium text-text">{metric.directTitle}</p><p className="mt-1 text-sm leading-relaxed text-muted">{metric.directBody}</p></dd></div>
              })}
            </dl>
          </div>
        </div>
      </section>
      <section data-loop-cot className="rounded-2xl border border-border bg-surface/50 p-5 sm:p-6">
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.cotTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{c.cotIntro}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="min-w-0 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <h3 className="mb-5 font-heading font-bold text-text">{c.latentTitle}</h3>
            <StateStrip stage={loopStage} label={c.state} symbol="h" />
            <div className="my-4 flex flex-wrap gap-2 font-mono text-sm">{[0, 1, 2].map((index) => <span key={index} className={index === loopStage ? 'text-primary-light' : 'text-muted'}>h<sub>{index}</sub>{index < 2 ? ' →' : ''}</span>)}</div>
            <p className="text-xs leading-relaxed text-muted">{c.latentNote}</p>
          </article>
          <article className="min-w-0 rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-4">
            <h3 className="mb-5 font-heading font-bold text-text">{c.cotLaneTitle}</h3>
            <StateStrip stage={textCount} label={c.state} symbol="s" />
            <div className="mt-4 flex min-h-28 flex-wrap content-start gap-2" data-cot-trace>
              {textCount === 0 ? <span className="text-xs text-muted">{c.cotEmpty}</span> : c.cotSteps.slice(0, textCount).map((text, index) => <span key={index} className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-1.5 font-mono text-xs text-cyan-100">{text}</span>)}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">{c.cotNote}</p>
          </article>
        </div>
        <p className="mt-4 text-xs text-muted">{c.cotExample}</p>
        <button type="button" onClick={togglePlayback} className={`${buttonClass} mt-4`}><PlaybackIcon size={16} aria-hidden="true" />{playbackLabel}</button>
        <p className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-muted">{c.monitorExplanation}</p>
      </section>
    </>
  )
}
