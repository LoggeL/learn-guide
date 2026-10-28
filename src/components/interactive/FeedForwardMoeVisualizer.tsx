'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

// Fixed toy weights in row-vector convention: hidden = x · W (x is 1 × 2, W is 2 × 4).
const up = [[1, -0.5, 0.8, 0.2], [0.3, 1, -0.4, 0.7]]
const gate = [[0.5, 1, -1, 0.2], [1, -0.2, 0.4, 0.8]]
// Row i of W_down is the value vector vᵢ written by hidden unit i.
const down = [[0.5, -0.2], [0.3, 0.4], [-0.5, 0.1], [0.2, 0.6]]
const activations = ['ReLU', 'GELU', 'SwiGLU'] as const
type Activation = (typeof activations)[number]

const project = (x: number[], w: number[][]) => w[0].map((_, j) => x.reduce((sum, value, i) => sum + value * w[i][j], 0))
const fmt = (x: number[]) => `[${x.map(v => v.toFixed(3)).join(', ')}]`
const gelu = (v: number) => 0.5 * v * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (v + 0.044715 * v ** 3)))
const silu = (v: number) => v / (1 + Math.exp(-v))

export function FeedForwardMoeVisualizer() {
  const { t } = useTranslation()
  const c = t.ffnMoe
  const [x, setX] = useState([0.8, -0.5])
  const [kind, setKind] = useState<Activation>('GELU')

  const expanded = project(x, up)
  const gates = project(x, gate)
  const hidden = expanded.map((v, i) => kind === 'ReLU' ? Math.max(0, v) : kind === 'GELU' ? gelu(v) : silu(gates[i]) * v)
  const output = project(hidden, down)
  const contributions = hidden.map((m, i) => down[i].map(v => m * v))
  const maxAbs = Math.max(0.001, ...hidden.map(Math.abs))

  const rows: [string, number[]][] = [
    [c.demoExpanded, expanded],
    ...(kind === 'SwiGLU' ? [[c.demoGate, gates] as [string, number[]]] : []),
    [c.demoActivated, hidden],
    [c.demoOutput, output],
  ]

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div>
        <h3 className="text-xl font-semibold text-text">{c.demoTitle}</h3>
        <p className="mt-1 text-sm text-muted">{c.demoNote}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {x.map((value, i) => (
          <label key={i} className="text-sm text-muted">
            {c.demoInput} x{i}: <span className="font-mono text-text">{value.toFixed(1)}</span>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.1}
              className="mt-2 block w-full accent-cyan-400"
              value={value}
              onChange={e => setX(previous => previous.map((v, j) => (i === j ? Number(e.target.value) : v)))}
            />
          </label>
        ))}
        <label className="text-sm text-muted">
          {c.demoActivation}
          <select
            className="mt-2 block w-full rounded border border-border bg-background p-2 text-text"
            value={kind}
            onChange={e => setKind(e.target.value as Activation)}
          >
            {activations.map(name => <option key={name}>{name}</option>)}
          </select>
        </label>
      </div>

      <div className="space-y-2">
        {rows.map(([name, values]) => (
          <div key={name} className="rounded-lg border border-border bg-background/40 p-3">
            <p className="text-sm text-muted">{name}</p>
            <p className="mt-1 overflow-x-auto font-mono text-sm text-cyan-300">{fmt(values)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-purple-500/25 bg-purple-500/5 p-4">
        <h4 className="font-semibold text-purple-300">{c.demoMemoryTitle}</h4>
        <p className="mt-1 text-sm text-muted">{c.demoMemoryNote}</p>
        <div className="mt-4 space-y-2">
          {hidden.map((m, i) => (
            <div key={i} className="grid grid-cols-[4.5rem_1fr] items-center gap-3 sm:grid-cols-[4.5rem_10rem_1fr]">
              <span className="font-mono text-xs text-muted">{c.demoUnit} {i}</span>
              <div className="h-3 overflow-hidden rounded-full bg-background">
                <motion.div
                  className={`h-full rounded-full ${m >= 0 ? 'bg-purple-400' : 'bg-orange-400'}`}
                  animate={{ width: `${(Math.abs(m) / maxAbs) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
              </div>
              <span className="col-span-2 overflow-x-auto font-mono text-xs text-text sm:col-span-1">
                m{i} = {m.toFixed(3)} · v{i} {fmt(down[i])} = {fmt(contributions[i])}
              </span>
            </div>
          ))}
          <p className="border-t border-border pt-2 font-mono text-sm text-cyan-300">
            {c.demoSum}: Σ mᵢ · vᵢ = {fmt(output)}
          </p>
        </div>
      </div>

      <details className="rounded-lg border border-border p-3">
        <summary className="cursor-pointer text-sm text-muted">{c.demoMatrices}</summary>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {([['W_up', up], ['W_gate', gate], ['W_down', down]] as [string, number[][]][]).map(([name, matrix]) => (
            <div key={name} className="overflow-x-auto font-mono text-xs text-text">
              <p className="mb-2 text-muted">{name}</p>
              {matrix.map((row, i) => <p key={i}>{fmt(row)}</p>)}
            </div>
          ))}
        </div>
      </details>
      <p className="text-sm text-muted">{c.demoLimit}</p>
    </div>
  )
}
