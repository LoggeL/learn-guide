'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Expand } from 'lucide-react'
import clsx from 'clsx'
import { useTranslation } from '@/lib/i18n/context'
import {
  pairStatus,
  ropeThetas,
  ropeWavelength,
  scaledThetas,
  yarnLogitScale,
  type PairStatus,
  type RopeScalingMethod,
} from '@/lib/attention-math'

const DIM = 128
const BASE = 10000
const TRAIN_LENGTH = 4096
const FACTORS = [2, 4, 8, 16, 32] as const
const METHODS: RopeScalingMethod[] = ['none', 'pi', 'ntk', 'yarn']

const STATUS_STYLE: Record<PairStatus, string> = {
  fullTurn: 'bg-emerald-400/70',
  inRange: 'bg-amber-300/80',
  outOfRange: 'bg-red-400/85',
}

export function RopeScalingVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.positionalEncoding.scaling
  const [method, setMethod] = useState<RopeScalingMethod>('none')
  const [factor, setFactor] = useState<(typeof FACTORS)[number]>(8)
  const [selected, setSelected] = useState(50)

  const targetLength = TRAIN_LENGTH * factor
  const original = useMemo(() => ropeThetas(DIM, BASE), [])
  const effective = useMemo(() => scaledThetas(method, DIM, BASE, TRAIN_LENGTH, factor), [method, factor])
  const statuses = useMemo(
    () => original.map((theta, i) => pairStatus(theta, effective[i], TRAIN_LENGTH, targetLength)),
    [original, effective, targetLength],
  )
  const outCount = statuses.filter((s) => s === 'outOfRange').length
  const neighborRatio = effective[0] / original[0]
  const logitScale = method === 'yarn' ? yarnLogitScale(factor) : 1

  const sel = {
    theta: original[selected],
    effective: effective[selected],
    turns: TRAIN_LENGTH / ropeWavelength(original[selected]),
    ratio: (targetLength * effective[selected]) / (TRAIN_LENGTH * original[selected]),
    status: statuses[selected],
  }

  const methodLabel: Record<RopeScalingMethod, string> = { none: c.methodNone, pi: c.methodPi, ntk: c.methodNtk, yarn: c.methodYarn }
  const methodNote: Record<RopeScalingMethod, string> = { none: c.noteNone, pi: c.notePi, ntk: c.noteNtk, yarn: c.noteYarn }
  const statusLabel: Record<PairStatus, string> = { fullTurn: c.statusFull, inRange: c.statusIn, outOfRange: c.statusOut }
  const fmt = (v: number, digits = 2) => v.toLocaleString(locale, { maximumSignificantDigits: digits })

  return (
    <section className="rounded-2xl border border-border bg-surface/55 p-5 md:p-6">
      <div className="mb-5">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
          <Expand size={14} /> {c.eyebrow}
        </div>
        <h3 className="font-heading text-xl font-bold text-text md:text-2xl">{c.title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{c.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-muted">{c.method}</div>
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button key={m} type="button" onClick={() => setMethod(m)} aria-pressed={method === m} className={clsx('rounded-full px-3 py-1.5 text-sm ring-1 transition', method === m ? 'bg-amber-400/15 text-amber-100 ring-amber-300/50' : 'text-muted ring-border hover:text-text')}>
                {methodLabel[m]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-muted">{c.factor}</div>
          <div className="flex flex-wrap gap-2">
            {FACTORS.map((f) => (
              <button key={f} type="button" onClick={() => setFactor(f)} aria-pressed={factor === f} className={clsx('rounded-full px-3 py-1.5 font-mono text-sm ring-1 transition', factor === f ? 'bg-cyan-400/15 text-cyan-100 ring-cyan-300/50' : 'text-muted ring-border hover:text-text')}>
                {f}×
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">
        {c.target}: <span className="font-mono text-text">{TRAIN_LENGTH.toLocaleString(locale)} → {targetLength.toLocaleString(locale)}</span> {c.tokens}
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background/60 p-3">
        <div className="mb-1 flex justify-between text-xs text-muted"><span>{c.fast} · {c.pair} 0</span><span>{c.pair} 63 · {c.slow}</span></div>
        <div className="flex h-24 items-end gap-[2px]" role="group" aria-label={c.title}>
          {statuses.map((status, i) => {
            const height = Math.min(1, (TRAIN_LENGTH * original[i]) / (2 * Math.PI))
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`${c.pair} ${i}: ${statusLabel[status]}`}
                aria-pressed={selected === i}
                className={clsx('relative flex-1 rounded-t-sm outline-none ring-offset-0 focus-visible:ring-2 focus-visible:ring-cyan-300', selected === i && 'ring-2 ring-white/80')}
                style={{ height: '100%' }}
              >
                <motion.span
                  className={clsx('absolute inset-x-0 bottom-0 rounded-t-sm', STATUS_STYLE[status])}
                  initial={false}
                  animate={{ height: `${Math.max(6, height * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                />
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-subtle">{c.barHint}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
          {(['fullTurn', 'inRange', 'outOfRange'] as const).map((s) => (
            <span key={s} className="flex items-center gap-1.5"><span className={clsx('h-2.5 w-4 rounded-sm', STATUS_STYLE[s])} />{statusLabel[s]}</span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-red-200">{c.countOut}</div>
          <div className="mt-1 font-mono text-2xl font-bold text-red-100">{outCount} / {DIM / 2}</div>
        </div>
        <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-cyan-200">{c.neighborStep}</div>
          <div className="mt-1 font-mono text-2xl font-bold text-cyan-100">×{fmt(neighborRatio, 3)}</div>
        </div>
        <div className="rounded-xl border border-purple-500/25 bg-purple-500/5 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-purple-200">{c.logitScale}</div>
          <div className="mt-1 font-mono text-2xl font-bold text-purple-100">×{fmt(logitScale, 3)}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-background/60 p-4 text-sm">
          <div className="mb-2 font-semibold text-text">{c.selectedPair}: {c.pair} {selected}</div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs text-muted">
            <dt>θ</dt><dd className="text-text">{fmt(sel.theta, 3)}</dd>
            <dt>θ′</dt><dd className="text-text">{fmt(sel.effective, 3)}</dd>
            <dt>λ</dt><dd className="text-text">{fmt(ropeWavelength(sel.theta), 3)} {c.tokens}</dd>
            <dt>{c.trainedTurns}</dt><dd className="text-text">{fmt(sel.turns, 3)}</dd>
            <dt>{c.neededRatio}</dt><dd className="text-text">{sel.status === 'fullTurn' ? '—' : fmt(sel.ratio, 3)}</dd>
          </dl>
          <div className="mt-2 text-xs text-muted">{statusLabel[sel.status]}</div>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-relaxed text-muted">
          <div className="mb-1 font-semibold text-amber-100">{methodLabel[method]}</div>
          {methodNote[method]}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-subtle">{c.note}</p>
    </section>
  )
}
