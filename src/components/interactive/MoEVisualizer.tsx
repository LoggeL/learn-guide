'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n/context'
import { learningSoftmax } from '@/lib/llmLearningMath'

const router = [[1, 0.2], [-0.5, 1], [0.4, -1], [-0.7, -0.3]]
const experts = [[[1, 0.2], [-0.3, 0.8]], [[-0.5, 0.7], [1, 0.2]], [[0.4, -0.8], [0.5, 1]], [[0.8, 0.3], [0.1, -0.7]]]
const fmt = (v: number[]) => `[${v.map(x => x.toFixed(3)).join(', ')}]`
export function MoEVisualizer() {
  const { locale } = useLocale()
  const de = locale === 'de'
  const [x, setX] = useState([0.8, -0.4])
  const [k, setK] = useState(2)
  const logits = router.map(row => row.reduce((sum, value, i) => sum + value * x[i], 0))
  const probabilities = learningSoftmax(logits)
  const chosen = logits.map((_, i) => i).sort((a, b) => logits[b] - logits[a] || a - b).slice(0, k)
  const total = chosen.reduce((sum, i) => sum + probabilities[i], 0)
  const mixture = probabilities.map((p, i) => chosen.includes(i) ? p / total : 0)
  const outputs = experts.map((matrix, i) => chosen.includes(i) ? matrix.map(row => Math.tanh(row.reduce((sum, value, j) => sum + value * x[j], 0))) : null)
  const output = [0, 1].map(d => outputs.reduce((sum, value, i) => sum + (value ? mixture[i] * value[d] : 0), 0))
  return <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
    <h3 className="text-xl font-semibold">{de ? 'Eine aktuelle Repräsentation routen' : 'Route a current representation'}</h3>
    <p className="text-sm leading-relaxed text-muted">{de ? 'Vier künstliche Experten, zwei Dimensionen, ein MoE-Layer. x ist die Hidden-Repräsentation eines bereits vorhandenen Tokens. Die festen Gewichte sind Beispiele ohne benannte Fachgebiete. Es wird kein zukünftiges Token an den Router übergeben.' : 'Four toy experts, two dimensions, one MoE layer. x is the hidden representation of an existing token. Fixed weights are illustrative and have no assigned subject areas. A future token is not passed into the router.'}</p>
    <div className="grid gap-4 sm:grid-cols-3">{x.map((value, i) => <label key={i} className="font-mono text-sm">x{i} = {value.toFixed(1)}<input className="mt-2 block w-full" type="range" min={-2} max={2} step={0.1} value={value} onChange={e => setX(previous => previous.map((v, j) => i === j ? Number(e.target.value) : v))} /></label>)}<label className="text-sm">Top-k = {k}<input className="mt-2 block w-full" type="range" min={1} max={4} value={k} onChange={e => setK(Number(e.target.value))} /></label></div>
    <div className="grid gap-3 sm:grid-cols-2">{router.map((row, i) => <div key={i} className={`space-y-2 rounded-xl border p-4 ${chosen.includes(i) ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-border'}`}><h4 className="font-semibold">E{i}</h4><p className="font-mono text-xs">logit = {fmt(row)} · x = {logits[i].toFixed(3)}</p><p className="text-sm">softmax: {probabilities[i].toFixed(3)}</p><p className="text-sm">{de ? 'Mischgewicht' : 'Mixture weight'}: {mixture[i].toFixed(3)}</p><p className="font-mono text-sm">{outputs[i] ? fmt(outputs[i]!) : de ? 'Nicht ausgeführt' : 'Not evaluated'}</p></div>)}</div>
    <p className="text-sm text-muted">{de ? 'Hier werden die Top-k-Softmaxwerte auf Summe 1 normiert. Nur ausgewählte Experten berechnen tanh(Mᵢx). Deren gewichtete Summe ergibt das FFN-Update dieser Position. Andere MoE-Rezepte nutzen andere Router-Normalisierungen.' : 'Here the selected top-k softmax scores are renormalized to sum to 1. Only selected experts calculate tanh(Mᵢx). Their weighted sum gives the FFN update for this position. Other MoE recipes use different router normalization.'}</p>
    <p aria-live="polite" className="rounded-lg bg-background p-4 font-mono text-lg text-cyan-300">Σᵢ gᵢ Eᵢ(x) = {fmt(output)}</p>
    <details className="rounded-lg border border-border p-3"><summary className="cursor-pointer text-sm">{de ? 'Feste Expertenmatrizen Mᵢ ansehen' : 'Inspect fixed expert matrices Mᵢ'}</summary><div className="mt-3 grid grid-cols-2 gap-4">{experts.map((matrix, i) => <div className="font-mono text-xs" key={i}>E{i}{matrix.map((row, j) => <p key={j}>{fmt(row)}</p>)}</div>)}</div></details>
  </div>
}
