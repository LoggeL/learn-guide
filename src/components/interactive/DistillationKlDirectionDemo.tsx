'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

/**
 * Forward vs. reverse KL with a capacity-limited student.
 * Teacher: mixture of two discretised Gaussians over an ordered 10-token toy vocabulary.
 * Student family: one discretised Gaussian bump with centre μ and width s.
 * For each divergence an exhaustive grid search over (μ, s) finds the best student.
 */
const V = 10
const EPS = 1e-4

function bump(mu: number, s: number) {
  const x = Array.from({ length: V }, (_, i) => Math.exp(-((i - mu) ** 2) / (2 * s * s)))
  const z = x.reduce((a, b) => a + b, 0)
  return x.map(v => v / z)
}

function teacher(weight: number) {
  const left = bump(2, 0.6)
  const right = bump(7, 0.6)
  const mix = left.map((v, i) => (1 - weight) * v + weight * right[i] + EPS)
  const z = mix.reduce((a, b) => a + b, 0)
  return mix.map(v => v / z)
}

const kl = (p: number[], q: number[]) => p.reduce((sum, v, i) => sum + v * Math.log(v / q[i]), 0)

function bestFit(p: number[], direction: 'forward' | 'reverse') {
  let best = { q: bump(0, 1), value: Infinity }
  for (let mu = 0; mu <= V - 1 + 1e-9; mu += 0.05) {
    for (let s = 0.3; s <= 4 + 1e-9; s += 0.05) {
      const q = bump(mu, s).map(v => v + 1e-12)
      const value = direction === 'forward' ? kl(p, q) : kl(q, p)
      if (value < best.value) best = { q, value }
    }
  }
  return best
}

function Bars({ values, color, label, value, locale }: { values: number[]; color: string; label: string; value?: number; locale: string }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-text">{label}</span>
        {value !== undefined && <span className="font-mono text-muted">{value.toLocaleString(locale, { maximumFractionDigits: 3, minimumFractionDigits: 3 })}</span>}
      </div>
      <div className="flex h-24 items-end gap-1 rounded-lg border border-border bg-background p-2">
        {values.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col justify-end">
            <motion.div className={`w-full rounded-t ${color}`} initial={false} animate={{ height: `${Math.min(100, v * 150)}%` }} transition={{ type: 'spring', stiffness: 140, damping: 22 }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1 font-mono text-[10px] text-muted">
        {values.map((_, i) => <span key={i} className="flex-1 text-center">{i + 1}</span>)}
      </div>
    </div>
  )
}

export function DistillationKlDirectionDemo() {
  const { t, locale } = useTranslation()
  const c = t.distillation
  const [weight, setWeight] = useState(0.3)
  const p = useMemo(() => teacher(weight), [weight])
  const forward = useMemo(() => bestFit(p, 'forward'), [p])
  const reverse = useMemo(() => bestFit(p, 'reverse'), [p])

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{c.klTitle}</h3>
        <p className="text-sm leading-relaxed text-muted">{c.klDesc}</p>
      </div>
      <label className="block text-sm text-muted">
        {c.klWeight}: <span className="font-mono text-cyan-400">{weight.toLocaleString(locale, { minimumFractionDigits: 2 })}</span>
        <input className="mt-2 w-full accent-cyan-400" type="range" min={0.1} max={0.9} step={0.05} value={weight} onChange={e => setWeight(Number(e.target.value))} />
      </label>
      <Bars values={p} color="bg-purple-400" label={c.klTeacher} locale={locale} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Bars values={forward.q} color="bg-cyan-400" label={c.klForward} value={forward.value} locale={locale} />
          <p className="text-sm text-muted">{c.klForwardExplain}</p>
        </div>
        <div className="space-y-2">
          <Bars values={reverse.q} color="bg-emerald-400" label={c.klReverse} value={reverse.value} locale={locale} />
          <p className="text-sm text-muted">{c.klReverseExplain}</p>
        </div>
      </div>
      <p className="text-xs text-muted">{c.klCaveat}</p>
    </div>
  )
}
