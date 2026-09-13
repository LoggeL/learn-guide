'use client'

import { useState } from 'react'

const up = [[1, -0.5, 0.8, 0.2], [0.3, 1, -0.4, 0.7]]
const gate = [[0.5, 1, -1, 0.2], [1, -0.2, 0.4, 0.8]]
const down = [[0.5, -0.2], [0.3, 0.4], [-0.5, 0.1], [0.2, 0.6]]
const project = (x: number[], w: number[][]) => w[0].map((_, j) => x.reduce((sum, value, i) => sum + value * w[i][j], 0))
const fmt = (x: number[]) => `[${x.map(v => v.toFixed(3)).join(', ')}]`
const copy = {
  en: { title: 'A token through a feed-forward block', note: 'A real 2 → 4 → 2 calculation with fixed toy weights and no biases. The same function is applied independently to each token. This block does not mix tokens.', activation: 'Activation', input: 'Input', expanded: 'Expanded vector xWup', activated: 'After activation / gate', output: 'Output update', matrices: 'Inspect the fixed matrices (row-vector convention)', gate: 'Gate input xWgate', limit: 'GELU uses the common tanh approximation. SwiGLU here computes SiLU(xWgate) ⊙ (xWup), followed by Wdown. Real models learn these matrices; wider activations do not imply named semantic channels.' },
  de: { title: 'Ein Token durch einen Feed-Forward-Block', note: 'Eine echte 2 → 4 → 2-Rechnung mit festen Beispielgewichten ohne Bias. Dieselbe Funktion wird unabhängig auf jedes Token angewendet. Dieser Block mischt keine Tokens.', activation: 'Aktivierung', input: 'Eingabe', expanded: 'Expandierter Vektor xWup', activated: 'Nach Aktivierung / Gate', output: 'Ausgabe-Update', matrices: 'Feste Matrizen ansehen (Zeilenvektoren)', gate: 'Gate-Eingabe xWgate', limit: 'GELU nutzt die übliche tanh-Näherung. SwiGLU berechnet hier SiLU(xWgate) ⊙ (xWup), danach Wdown. Echte Modelle lernen diese Matrizen; breitere Aktivierungen haben keine fest zugewiesenen Bedeutungen.' },
}
export function FeedForwardMoeVisualizer({ locale = 'en' }: { locale?: string }) {
  const c = copy[locale === 'de' ? 'de' : 'en']
  const [x, setX] = useState([0.8, -0.5])
  const [kind, setKind] = useState('GELU')
  const expanded = project(x, up)
  const gates = project(x, gate)
  const active = expanded.map((v, i) => kind === 'ReLU' ? Math.max(0, v) : kind === 'GELU' ? 0.5 * v * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (v + 0.044715 * v ** 3))) : v * gates[i] / (1 + Math.exp(-gates[i])))
  const output = project(active, down)
  return <div className="space-y-5 rounded-2xl border border-border bg-surface p-5">
    <h3 className="text-xl font-semibold">{c.title}</h3><p className="text-sm text-muted">{c.note}</p>
    <div className="grid gap-4 sm:grid-cols-3">{x.map((value, i) => <label key={i} className="text-sm">{c.input} x{i}: {value.toFixed(1)}<input type="range" min={-2} max={2} step={0.1} className="mt-2 block w-full" value={value} onChange={e => setX(previous => previous.map((v, j) => i === j ? Number(e.target.value) : v))} /></label>)}<label className="text-sm">{c.activation}<select className="mt-2 block w-full rounded border border-border bg-background p-2" value={kind} onChange={e => setKind(e.target.value)}>{['ReLU', 'GELU', 'SwiGLU'].map(name => <option key={name}>{name}</option>)}</select></label></div>
    {[[c.expanded, expanded], ...(kind === 'SwiGLU' ? [[c.gate, gates]] : []), [c.activated, active], [c.output, output]].map(([name, values]) => <div key={String(name)} className="rounded-lg border border-border p-3"><p className="text-sm text-muted">{String(name)}</p><p className="mt-1 overflow-x-auto font-mono text-sm text-cyan-300">{fmt(values as number[])}</p></div>)}
    <details className="rounded-lg border border-border p-3"><summary className="cursor-pointer text-sm">{c.matrices}</summary><div className="mt-3 grid gap-4 sm:grid-cols-3">{[['Wup', up], ['Wgate', gate], ['Wdown', down]].map(([name, matrix]) => <div key={String(name)} className="overflow-x-auto font-mono text-xs"><p className="mb-2">{String(name)}</p>{(matrix as number[][]).map((row, i) => <p key={i}>{fmt(row)}</p>)}</div>)}</div></details>
    <p className="text-sm text-muted">{c.limit}</p>
  </div>
}
