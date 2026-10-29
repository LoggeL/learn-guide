'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Pause, Play, RefreshCw, RotateCcw } from 'lucide-react'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'

type NL = Dictionary['nestedLearning']

/* ─── 1. Associative memory: forgetting through shared capacity ─── */

type Vec = [number, number]
type Mat = [[number, number], [number, number]]
type PairName = 'A' | 'B' | 'C'

const ETA = 0.5
const ZERO: Mat = [[0, 0], [0, 0]]
const VALUES: Record<PairName, Vec> = { A: [1, 0.3], B: [-0.4, 1], C: [-0.8, -0.7] }
const PAIR_STYLE: Record<PairName, string> = { A: 'text-cyan-300', B: 'text-purple-300', C: 'text-orange-300' }
const PAIRS: PairName[] = ['A', 'B', 'C']

const unit = (deg: number): Vec => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
const apply = (m: Mat, k: Vec): Vec => [m[0][0] * k[0] + m[0][1] * k[1], m[1][0] * k[0] + m[1][1] * k[1]]
const norm = (v: Vec) => Math.hypot(v[0], v[1])

function keysFor(angle: number): Record<PairName, Vec> {
  return { A: unit(0), B: unit(angle), C: unit(135) }
}

/** One gradient step of the chosen rule: delta = −η(Mk − v)kᵀ, Hebbian = +η v kᵀ. */
function writeStep(m: Mat, k: Vec, v: Vec, rule: 'delta' | 'hebbian'): Mat {
  const recall = apply(m, k)
  const signal: Vec = rule === 'delta' ? [v[0] - recall[0], v[1] - recall[1]] : v
  return [
    [m[0][0] + ETA * signal[0] * k[0], m[0][1] + ETA * signal[0] * k[1]],
    [m[1][0] + ETA * signal[1] * k[0], m[1][1] + ETA * signal[1] * k[1]],
  ]
}

function MiniPlot({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="rounded-xl border border-border bg-background/60 p-3">
      <figcaption className="mb-2 text-xs text-muted">{title}</figcaption>
      <svg viewBox="-1.6 -1.6 3.2 3.2" className="mx-auto aspect-square w-full max-w-[220px]" role="img" aria-label={title}>
        <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="currentColor" strokeWidth="0.01" className="text-border" />
        <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="currentColor" strokeWidth="0.01" className="text-border" />
        <circle cx="0" cy="0" r="1" fill="none" stroke="currentColor" strokeWidth="0.008" strokeDasharray="0.04 0.04" className="text-border" />
        {children}
      </svg>
    </figure>
  )
}

const clamp = (x: number) => Math.max(-1.5, Math.min(1.5, x))

export function ForgettingDemo({ copy }: { copy: NL['memoryDemo'] }) {
  const reduceMotion = useReducedMotion()
  const [angle, setAngle] = useState(30)
  const [rule, setRule] = useState<'delta' | 'hebbian'>('delta')
  const [memory, setMemory] = useState<Mat>(ZERO)
  const [steps, setSteps] = useState(0)
  const keys = keysFor(angle)

  const reset = () => { setMemory(ZERO); setSteps(0) }
  const write = (name: PairName) => { setMemory((m) => writeStep(m, keys[name], VALUES[name], rule)); setSteps((s) => s + 1) }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div>
        <h3 className="font-heading text-lg font-bold text-text">{copy.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{copy.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-muted">
          <span className="flex justify-between"><span>{copy.angleLabel}</span><span className="font-mono text-text">{angle}°</span></span>
          <input type="range" min="10" max="90" step="5" value={angle} onChange={(e) => { setAngle(Number(e.target.value)); reset() }} className="mt-2 h-6 w-full cursor-pointer accent-purple-500" />
        </label>
        <fieldset>
          <legend className="mb-2 text-sm text-muted">{copy.ruleLabel}</legend>
          <div className="flex gap-2">
            {(['delta', 'hebbian'] as const).map((r) => (
              <button key={r} type="button" aria-pressed={rule === r} onClick={() => { setRule(r); reset() }} className={`min-h-11 rounded-lg border px-4 text-sm ${rule === r ? 'border-primary bg-primary/15 text-primary-light' : 'border-border bg-background text-muted hover:border-primary/40'}`}>{copy[r]}</button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-wrap gap-2">
        {PAIRS.map((name) => (
          <button key={name} type="button" onClick={() => write(name)} className={`min-h-11 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:border-primary/50 ${PAIR_STYLE[name]}`}>{copy.write} {name}</button>
        ))}
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm text-muted hover:text-text"><RotateCcw size={15} aria-hidden="true" />{copy.reset}</button>
        <span className="self-center font-mono text-xs text-muted">{copy.steps}: {steps}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MiniPlot title={copy.keysPlot}>
          {PAIRS.map((name) => (
            <g key={name} className={PAIR_STYLE[name]}>
              <line x1="0" y1="0" x2={keys[name][0]} y2={-keys[name][1]} stroke="currentColor" strokeWidth="0.04" />
              <text x={keys[name][0] * 1.22} y={-keys[name][1] * 1.22 + 0.06} fontSize="0.18" textAnchor="middle" fill="currentColor">k{name}</text>
            </g>
          ))}
        </MiniPlot>
        <MiniPlot title={copy.valuesPlot}>
          {PAIRS.map((name) => {
            const target = VALUES[name]
            const recall = apply(memory, keys[name])
            const rx = clamp(recall[0]); const ry = clamp(-recall[1])
            return (
              <g key={name} className={PAIR_STYLE[name]}>
                <line x1={target[0]} y1={-target[1]} x2={rx} y2={ry} stroke="currentColor" strokeWidth="0.015" strokeDasharray="0.05 0.04" />
                <circle cx={target[0]} cy={-target[1]} r="0.11" fill="none" stroke="currentColor" strokeWidth="0.035" />
                <motion.circle initial={false} animate={{ cx: rx, cy: ry }} transition={{ duration: reduceMotion ? 0 : 0.3 }} r="0.07" fill="currentColor" />
                <text x={target[0] + 0.16} y={-target[1] - 0.12} fontSize="0.17" fill="currentColor">v{name}</text>
              </g>
            )
          })}
        </MiniPlot>
      </div>
      <p className="text-xs text-muted">{copy.targetLegend} · {copy.recallLegend}</p>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="mb-2 text-xs text-muted">{copy.errorLabel}</p>
          <div className="space-y-2">
            {PAIRS.map((name) => {
              const recall = apply(memory, keys[name])
              const error = norm([recall[0] - VALUES[name][0], recall[1] - VALUES[name][1]])
              return (
                <div key={name} className="grid grid-cols-[2rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs">
                  <span className={`font-mono ${PAIR_STYLE[name]}`}>{name}</span>
                  <span className="h-2 rounded-full bg-background"><motion.span initial={false} animate={{ width: `${Math.min(100, (error / 1.6) * 100)}%` }} transition={{ duration: reduceMotion ? 0 : 0.3 }} className="block h-full rounded-full bg-current text-primary-light" /></span>
                  <span className="text-right font-mono text-text">{error.toFixed(3)}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background/60 p-3">
          <p className="mb-1 text-xs text-muted">{copy.matrixLabel}</p>
          <table className="font-mono text-xs text-text"><tbody>{memory.map((row, i) => <tr key={i}>{row.map((x, j) => <td key={j} className="px-2 py-0.5 text-right">{x.toFixed(2)}</td>)}</tr>)}</tbody></table>
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium text-text">{copy.hintsTitle}</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">{copy.hints.map((hint) => <li key={hint}>{hint}</li>)}</ul>
      </div>
    </div>
  )
}

/* ─── 2. Continuum Memory System: three update frequencies ─── */

const STREAM_LENGTH = 192
const LEVELS = [
  { chunk: 1, eta: 0.25, stroke: 'text-emerald-300', fill: 'bg-emerald-300' },
  { chunk: 8, eta: 0.03, stroke: 'text-cyan-300', fill: 'bg-cyan-300' },
  { chunk: 32, eta: 0.01, stroke: 'text-purple-300', fill: 'bg-purple-300' },
]
const target = (t: number) => (t < 64 || t >= 128 ? 1 : -1)

/** CMS rule: accumulate η·∇ over C steps, apply only when i ≡ 0 (mod C). Loss ½(w − y)², so ∇ = w − y. */
function simulateLevel(chunk: number, eta: number) {
  const values: number[] = []
  let w = 0
  let accumulated = 0
  for (let i = 1; i <= STREAM_LENGTH; i++) {
    accumulated += eta * (w - target(i - 1))
    if (i % chunk === 0) { w -= accumulated; accumulated = 0 }
    values.push(w)
  }
  return values
}

const CHART_W = 560
const CHART_H = 200
const px = (t: number) => 30 + (t / (STREAM_LENGTH - 1)) * (CHART_W - 40)
const py = (v: number) => CHART_H / 2 - v * (CHART_H / 2 - 20)

export function NestedLoopsDemo({ copy }: { copy: NL['cmsDemo'] }) {
  const reduceMotion = useReducedMotion()
  const trajectories = useMemo(() => LEVELS.map((level) => simulateLevel(level.chunk, level.eta)), [])
  const [cursor, setCursor] = useState(STREAM_LENGTH - 1)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    if (reduceMotion) { setCursor(STREAM_LENGTH - 1); setPlaying(false); return }
    const id = setInterval(() => {
      setCursor((c) => {
        if (c >= STREAM_LENGTH - 1) { setPlaying(false); return c }
        return c + 1
      })
    }, 40)
    return () => clearInterval(id)
  }, [playing, reduceMotion])

  const toggle = () => {
    if (!playing && cursor >= STREAM_LENGTH - 1) setCursor(0)
    setPlaying((p) => !p)
  }
  const path = (values: number[]) => values.slice(0, cursor + 1).map((v, t) => `${t === 0 ? 'M' : 'L'}${px(t).toFixed(1)} ${py(v).toFixed(1)}`).join(' ')
  const targetPath = Array.from({ length: cursor + 1 }, (_, t) => `${t === 0 ? 'M' : 'L'}${px(t).toFixed(1)} ${py(target(t)).toFixed(1)}`).join(' ')

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div>
        <h3 className="font-heading text-lg font-bold text-text">{copy.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{copy.description}</p>
      </div>

      <svg viewBox={`0 0 ${CHART_W} ${CHART_H + 50}`} className="w-full" role="img" aria-label={copy.title}>
        <rect x={px(64)} y="8" width={px(128) - px(64)} height={CHART_H - 16} className="fill-orange-400/5" />
        <text x={px(32)} y="22" textAnchor="middle" fontSize="11" fill="currentColor" className="text-muted">{copy.regimeA}</text>
        <text x={px(96)} y="22" textAnchor="middle" fontSize="11" fill="currentColor" className="text-orange-300">{copy.regimeB}</text>
        <text x={px(160)} y="22" textAnchor="middle" fontSize="11" fill="currentColor" className="text-muted">{copy.regimeA}</text>
        {[1, 0, -1].map((v) => (
          <g key={v}>
            <line x1="30" x2={CHART_W - 10} y1={py(v)} y2={py(v)} stroke="currentColor" strokeWidth="1" className="text-border" />
            <text x="22" y={py(v) + 4} textAnchor="end" fontSize="10" fill="currentColor" className="text-muted">{v > 0 ? '+1' : v}</text>
          </g>
        ))}
        <path d={targetPath} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-muted" />
        {trajectories.map((values, i) => <path key={i} d={path(values)} fill="none" stroke="currentColor" strokeWidth="2.25" className={LEVELS[i].stroke} />)}
        <line x1={px(cursor)} x2={px(cursor)} y1="8" y2={CHART_H - 8} stroke="currentColor" strokeWidth="1" className="text-primary-light/60" />
        {LEVELS.map((level, i) => (
          <g key={level.chunk} className={level.stroke}>
            {Array.from({ length: Math.floor((cursor + 1) / level.chunk) }, (_, k) => {
              const t = (k + 1) * level.chunk - 1
              return <line key={k} x1={px(t)} x2={px(t)} y1={CHART_H + 8 + i * 13} y2={CHART_H + 16 + i * 13} stroke="currentColor" strokeWidth="1" />
            })}
          </g>
        ))}
      </svg>
      <p className="-mt-3 text-xs text-muted">{copy.updates}: {copy.levels.join(' · ')}</p>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={toggle} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 text-sm text-primary-light hover:bg-primary/20">{playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}{playing ? copy.pause : copy.play}</button>
        <button type="button" onClick={() => { setPlaying(false); setCursor(0) }} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm text-muted hover:text-text"><RotateCcw size={15} aria-hidden="true" />{copy.reset}</button>
        <label className="flex min-w-[200px] flex-1 items-center gap-3 text-xs text-muted">
          <span>{copy.step}</span>
          <input type="range" min="0" max={STREAM_LENGTH - 1} value={cursor} onChange={(e) => { setPlaying(false); setCursor(Number(e.target.value)) }} className="h-6 flex-1 cursor-pointer accent-purple-500" />
          <span className="w-8 text-right font-mono text-text">{cursor + 1}</span>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {LEVELS.map((level, i) => {
          const w = trajectories[i][cursor]
          return (
            <div key={level.chunk} className="rounded-xl border border-border bg-background/60 p-3">
              <p className={`flex items-center gap-2 text-sm font-medium ${level.stroke}`}><span className={`h-2.5 w-2.5 rounded-full ${level.fill}`} aria-hidden="true" />{copy.levels[i]}</p>
              <p className="mt-2 font-mono text-lg text-text">w = {w.toFixed(2)}</p>
              <p className="mt-1 font-mono text-xs text-muted">{copy.errorA}: {Math.abs(w - 1).toFixed(2)} · {copy.errorB}: {Math.abs(w + 1).toFixed(2)}</p>
            </div>
          )
        })}
      </div>
      <p className="text-xs leading-relaxed text-muted">{copy.target}: <span className="font-mono">- - -</span>. {copy.note}</p>
    </div>
  )
}

/* ─── 3. Update-frequency spectrum (Transformer vs Titans vs HOPE) ─── */

const POS_STYLE = ['border-emerald-400/40 bg-emerald-400/10 text-emerald-200', 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200', 'border-purple-400/40 bg-purple-400/10 text-purple-200', 'border-border bg-background text-muted']

export function ComparisonDemo({ copy }: { copy: NL['comparison'] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <h3 className="font-heading text-lg font-bold text-text">{copy.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{copy.description}</p>
      <div className="mt-5 hidden grid-cols-[110px_repeat(4,minmax(0,1fr))] gap-2 text-xs text-muted md:grid">
        <span />
        {copy.axis.map((label) => <span key={label} className="border-b border-border pb-1 text-center">{label}</span>)}
      </div>
      <div className="mt-3 space-y-4">
        {copy.rows.map((row) => (
          <div key={row.name} className="rounded-xl border border-border bg-background/40 p-3 md:border-0 md:bg-transparent md:p-0">
            <div className="grid gap-2 md:grid-cols-[110px_repeat(4,minmax(0,1fr))] md:items-start">
              <span className="font-heading font-bold text-text">{row.name}</span>
              {copy.axis.map((label, pos) => (
                <div key={label} className="flex min-h-10 flex-wrap content-start gap-1.5 md:justify-center">
                  {row.items.filter((item) => Number(item.pos) === pos).map((item) => (
                    <span key={item.label} className={`rounded-md border px-2 py-1 text-xs ${POS_STYLE[pos]}`}><span className="text-muted md:hidden">{label}: </span>{item.label}</span>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted md:pl-[118px]">{row.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── 4. HOPE data flow ─── */

export function HopeDiagram({ copy }: { copy: NL['hopeDiagram'] }) {
  const box = 'rounded-xl border px-4 py-3 text-center text-sm'
  const arrow = <ArrowDown size={18} className="mx-auto my-1.5 text-muted" aria-hidden="true" />
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <h3 className="mb-5 font-heading text-lg font-bold text-text">{copy.title}</h3>
      <div className="mx-auto max-w-xl">
        <div className={`${box} border-border bg-background text-text`}>{copy.input}</div>
        {arrow}
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className={`${box} border-border bg-background text-muted`}>{copy.query}</div>
          <div className={`${box} border-purple-400/40 bg-purple-400/10`}>
            <p className="font-medium text-purple-200">{copy.memories}</p>
            <p className="mt-1 text-xs text-muted">{copy.generates}</p>
            <div className="mt-3 rounded-lg border border-purple-400/30 bg-background/60 px-3 py-2 text-xs text-purple-200">{copy.update}</div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-purple-300"><RefreshCw size={13} aria-hidden="true" />{copy.selfLoop}</p>
          </div>
        </div>
        {arrow}
        <div className={`${box} border-cyan-400/40 bg-cyan-400/10`}>
          <p className="font-medium text-cyan-200">{copy.cms}</p>
          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-xs">
            {['C₁', 'C₂', 'C₃'].map((c, i) => <span key={c} className={`rounded-md border px-3 py-1.5 ${POS_STYLE[Math.min(i, 2)]}`}>MLP · {c}</span>)}
          </div>
        </div>
        {arrow}
        <div className={`${box} border-emerald-400/40 bg-emerald-400/10 text-emerald-200`}>{copy.output}</div>
      </div>
    </div>
  )
}
