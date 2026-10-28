'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { scaledAttention } from '@/lib/llmLearningMath'

// Row-vector convention: q = x Wq. Deliberately tiny, fixed toy projections.
const WQ = [[1, 0.5], [0, 1]]
const WK = [[0.5, 1], [1, 0]]
const WV = [[1, -1], [0.5, 1]]
const initial = [[1, 0], [0, 1], [1, 1]]
const project = (x: number[], w: number[][]) => [0, 1].map(j => x.reduce((sum, value, i) => sum + value * w[i][j], 0))
const fmt = (v: number[]) => `[${v.map(n => n.toFixed(2)).join(', ')}]`
export function AttentionVisualizer() {
  const { t } = useTranslation()
  const c = t.attention.viz
  const [input, setInput] = useState(initial)
  const [selected, setSelected] = useState(1)
  const [causal, setCausal] = useState(true)
  const queries = input.map(x => project(x, WQ))
  const keys = input.map(x => project(x, WK))
  const values = input.map(x => project(x, WV))
  const attention = scaledAttention(queries[selected], keys, values, selected, causal)
  return <div className="space-y-6 rounded-2xl border border-border bg-surface p-5 md:p-6">
    <div><h3 className="text-xl font-semibold">{c.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{c.note}</p></div>
    <fieldset><legend className="mb-3 font-medium">{c.choose}</legend><div className="flex flex-wrap gap-2">{c.words.map((word, i) => <button type="button" key={word} aria-pressed={selected === i} onClick={() => setSelected(i)} className={`rounded-xl border px-4 py-3 text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${selected === i ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200' : 'border-border bg-background'}`}>{word}</button>)}</div></fieldset>
    <fieldset><legend className="mb-3 font-medium">{c.input}: {c.words[selected]}</legend><div className="grid grid-cols-2 gap-5">{input[selected].map((value, j) => <label key={j} className="font-mono text-sm">x{j} = {value.toFixed(1)}<input className="mt-2 w-full" type="range" min={-2} max={2} step={0.1} value={value} onChange={e => setInput(previous => previous.map((row, i) => i === selected ? row.map((v, k) => j === k ? Number(e.target.value) : v) : row))} /></label>)}</div></fieldset>
    <div><p className="mb-3 text-sm text-muted">{c.projections}</p><div className="grid grid-cols-3 gap-2">{[['WQ', WQ], ['WK', WK], ['WV', WV]].map(([name, matrix]) => <div key={String(name)} className="rounded-lg border border-border bg-background p-3 text-center font-mono text-xs sm:text-sm"><p className="mb-2 text-cyan-300">{String(name)}</p>{(matrix as number[][]).map((row, i) => <p key={i}>{fmt(row)}</p>)}</div>)}</div></div>
    <div><h4 className="mb-3 font-medium">{c.vectors}</h4><div className="overflow-x-auto"><table className="w-full text-right font-mono text-sm"><thead><tr>{[c.token, 'x', 'Q', 'K', 'V'].map(name => <th key={name} className="p-2">{name}</th>)}</tr></thead><tbody>{input.map((x, i) => <tr key={i} className={`border-t border-border ${i === selected ? 'bg-cyan-500/10' : ''}`}><th className="p-2 font-normal">{c.words[i]}</th>{[x, queries[i], keys[i], values[i]].map((row, j) => <td className="whitespace-nowrap p-2" key={j}>{fmt(row)}</td>)}</tr>)}</tbody></table></div></div>
    <div><h4 className="mb-3 font-medium">{c.scores}</h4><label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={causal} onChange={e => setCausal(e.target.checked)} className="mt-1" />{c.mask}</label><p className="mt-3 text-sm text-muted">{causal ? c.explain : `${c.explain} ${c.bidirectional}`}</p>
      <div className="mt-3 overflow-x-auto"><table className="w-full text-right font-mono text-sm"><thead><tr>{[c.token, c.dot, c.scaled, c.weight, c.weighted].map(name => <th key={name} className="p-2 font-sans">{name}</th>)}</tr></thead><tbody>{c.words.map((word, i) => <tr key={word} className="border-t border-border"><th className="p-2 font-normal">{word}</th><td className="p-2">{attention.dots[i].toFixed(3)}</td><td className="p-2">{Number.isFinite(attention.scores[i]) ? attention.scores[i].toFixed(3) : '−∞'}</td><td className="p-2 text-cyan-300">{attention.weights[i].toFixed(3)}<div className="mt-1 h-1 rounded bg-cyan-400" style={{ width: `${attention.weights[i] * 100}%` }} /></td><td className="whitespace-nowrap p-2">{fmt(values[i].map(v => v * attention.weights[i]))}</td></tr>)}</tbody></table></div>
    </div>
    <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4"><h4 className="mb-2 font-medium">{c.result}</h4><p aria-live="polite" className="font-mono text-xl text-cyan-200">Σⱼ aⱼVⱼ = {fmt(attention.output)}</p></div>
    <p className="text-sm leading-relaxed text-muted">{c.limit}</p><button type="button" className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setInput(initial)}>{c.reset}</button>
  </div>
}
