'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { learningSoftmax } from '@/lib/llmLearningMath'
import { toyRouter } from './MoEVisualizer'

// Eight fixed hidden vectors. Most point in the +x0 direction, so the unbiased router overloads E0.
const tokens = [[1.2, 0.3], [0.9, -0.2], [1.5, 0.5], [0.7, 0.1], [1.1, -0.6], [-0.4, 1.2], [0.8, 0.9], [-1.0, -0.5]]
const N = toyRouter.length
const GAMMA = 0.1
const capacityFactors = [1, 1.25, 1.5, 2]
const expertColors = ['bg-cyan-400', 'bg-purple-400', 'bg-emerald-400', 'bg-orange-400']
const expertText = ['text-cyan-300', 'text-purple-300', 'text-emerald-300', 'text-orange-300']

interface Routing {
  /** Selected experts per token, in selection order. */
  selections: number[][]
  /** Per token and selected expert: was the slot within capacity? */
  accepted: boolean[][]
  load: number[]
  dropped: number
  balance: number
  zLoss: number
}

function route(k: number, capacity: number, bias: number[]): Routing {
  const scores = tokens.map(x => toyRouter.map(row => row[0] * x[0] + row[1] * x[1]))
  const probs = scores.map(s => learningSoftmax(s))
  // Bias only affects which experts are selected (DeepSeek-V3 style), never the gate weights.
  const selections = scores.map(s =>
    s.map((v, i) => ({ v: v + bias[i], i })).sort((a, b) => b.v - a.v || a.i - b.i).slice(0, k).map(e => e.i),
  )
  const load = Array(N).fill(0)
  const filled = Array(N).fill(0)
  const accepted = selections.map(sel => sel.map(i => {
    load[i] += 1
    if (filled[i] < capacity) { filled[i] += 1; return true }
    return false
  }))
  const assignments = tokens.length * k
  const f = load.map(l => l / assignments)
  const P = Array.from({ length: N }, (_, i) => probs.reduce((sum, p) => sum + p[i], 0) / tokens.length)
  const balance = N * f.reduce((sum, fi, i) => sum + fi * P[i], 0)
  const zLoss = scores.reduce((sum, s) => {
    const max = Math.max(...s)
    const lse = max + Math.log(s.reduce((acc, v) => acc + Math.exp(v - max), 0))
    return sum + lse * lse
  }, 0) / tokens.length
  const dropped = accepted.flat().filter(ok => !ok).length
  return { selections, accepted, load, dropped, balance, zLoss }
}

export function MoeLoadBalancingDemo() {
  const { t } = useTranslation()
  const c = t.ffnMoe
  const [k, setK] = useState(1)
  const [cfIndex, setCfIndex] = useState(0)
  const [bias, setBias] = useState<number[]>(Array(N).fill(0))
  const [steps, setSteps] = useState(0)

  const cf = capacityFactors[cfIndex]
  const capacity = Math.ceil((cf * tokens.length * k) / N)
  const r = useMemo(() => route(k, capacity, bias), [k, capacity, bias])
  const maxBar = Math.max(capacity, ...r.load)

  const applyBiasUpdate = () => {
    const mean = (tokens.length * k) / N
    setBias(previous => previous.map((b, i) => Math.round((b + GAMMA * Math.sign(mean - r.load[i])) * 1000) / 1000))
    setSteps(s => s + 1)
  }
  const resetBias = () => { setBias(Array(N).fill(0)); setSteps(0) }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div>
        <h3 className="text-xl font-semibold text-text">{c.lbTitle}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{c.lbNote}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-muted">
          {c.lbTopK}: <span className="font-mono text-text">{k}</span>
          <input className="mt-2 block w-full accent-cyan-400" type="range" min={1} max={2} value={k} onChange={e => setK(Number(e.target.value))} />
        </label>
        <label className="text-sm text-muted">
          {c.lbCapacity}: <span className="font-mono text-text">{cf.toFixed(2)}</span>
          <input className="mt-2 block w-full accent-cyan-400" type="range" min={0} max={capacityFactors.length - 1} value={cfIndex} onChange={e => setCfIndex(Number(e.target.value))} />
        </label>
      </div>
      <p className="font-mono text-xs text-muted">{c.lbCapacityValue.replace('{c}', String(capacity))}</p>

      {/* Token → expert assignments */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {r.selections.map((sel, ti) => (
          <div key={ti} className="rounded-lg border border-border bg-background/50 p-2 text-center">
            <p className="text-[11px] text-muted">{c.lbToken} {ti + 1}</p>
            <div className="mt-1 flex justify-center gap-1">
              {sel.map((e, si) => (
                <motion.span
                  key={`${e}-${si}`}
                  layout
                  className={`rounded px-1.5 py-0.5 font-mono text-xs ${r.accepted[ti][si] ? `${expertText[e]} bg-surface` : 'text-muted line-through'}`}
                >
                  E{e}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Load per expert vs. capacity */}
      <div className="space-y-3">
        {r.load.map((load, i) => (
          <div key={i} className="grid grid-cols-[3rem_1fr_7.5rem] items-center gap-3 text-sm">
            <span className={`font-mono ${expertText[i]}`}>E{i}</span>
            <div className="relative h-4 overflow-hidden rounded-full bg-background">
              <motion.div
                className={`h-full rounded-full ${expertColors[i]}`}
                animate={{ width: `${(Math.min(load, capacity) / maxBar) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
              <motion.div
                className="absolute top-0 h-full bg-red-500/60"
                animate={{ left: `${(capacity / maxBar) * 100}%`, width: `${(Math.max(0, load - capacity) / maxBar) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
              <div className="absolute top-0 h-full w-px bg-text/70" style={{ left: `${(capacity / maxBar) * 100}%` }} />
            </div>
            <span className="font-mono text-xs text-muted">
              {c.lbLoad} {load}{load > capacity ? ` · ${load - capacity} ${c.lbDropped}` : ''}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background/40 p-3">
          <p className="text-xs text-muted">{c.lbDroppedCount.replace('{n}', String(r.dropped)).replace('{total}', String(tokens.length * k))}</p>
        </div>
        <div className="rounded-lg border border-border bg-background/40 p-3">
          <p className="text-xs text-muted">{c.lbAux}</p>
          <p className="font-mono text-sm text-cyan-300">{r.balance.toFixed(3)}</p>
        </div>
        <div className="rounded-lg border border-border bg-background/40 p-3">
          <p className="text-xs text-muted">{c.lbZ}</p>
          <p className="font-mono text-sm text-cyan-300">{r.zLoss.toFixed(3)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={applyBiasUpdate} className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/25">
            {c.lbStep}
          </button>
          <button type="button" onClick={resetBias} className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-text">
            {c.lbReset}
          </button>
          <span className="text-xs text-muted">{c.lbSteps.replace('{n}', String(steps))}</span>
        </div>
        <p className="mt-3 font-mono text-xs text-text">
          {c.lbBias}: {bias.map((b, i) => `b${i} = ${b >= 0 ? '+' : ''}${b.toFixed(2)}`).join(' · ')}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">{c.lbStepNote}</p>
      </div>
    </div>
  )
}
