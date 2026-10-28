'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { softmax, sampleIndex } from '@/lib/learning/decoding'

export function TemperatureDemo() {
  const { t } = useTranslation()
  const c = t.temperature.demo
  const [temperature, setTemperature] = useState(1)
  const [counts, setCounts] = useState([0, 0, 0, 0, 0])
  const logits = [3, 2, 1, 0, -1]
  const tokens = c.tokens
  const probabilities = softmax(logits, temperature)
  const total = counts.reduce((a,b) => a+b,0)
  function draw() {
    const next = [...counts]
    for (let i=0; i<100; i++) next[sampleIndex(probabilities, Math.random())]++
    setCounts(next)
  }
  return <div className="rounded-2xl border border-border bg-surface/60 p-4 sm:p-6 space-y-5">
    <p className="text-sm text-muted">{c.note}</p>
    <label className="block text-sm">{c.tempLabel}: <output>{temperature.toFixed(2)}</output><input aria-label={c.tempLabel} className="w-full mt-3" type="range" min="0" max="2" step="0.05" value={temperature} onChange={e => {setTemperature(+e.target.value);setCounts([0,0,0,0,0])}} /></label>
    <div className="space-y-4">{tokens.map((token,i) => <div key={token}>
      <div className="flex justify-between gap-2 text-sm"><span>{token} <span className="text-muted">({logits[i]})</span></span><span className="tabular-nums">{(probabilities[i]*100).toFixed(1)}% · {counts[i]} / {total}</span></div>
      <div className="h-2 mt-2 rounded bg-background"><div className="h-full rounded bg-primary-light" style={{width:`${probabilities[i]*100}%`}} /></div>
      {total > 0 && <div className="h-2 mt-1 rounded bg-background"><div className="h-full rounded bg-cyan-400" style={{width:`${counts[i]/total*100}%`}} /></div>}
    </div>)}</div>
    <p className="text-xs text-muted">{c.legend}</p>
    <div className="flex flex-wrap gap-3"><button onClick={draw} className="min-h-11 px-4 py-2 rounded-lg border border-primary/40 bg-primary/10">{c.sample}</button><button className="min-h-11 px-4 py-2 rounded-lg border border-border" onClick={()=>setCounts([0,0,0,0,0])}>{c.clear}</button></div>
  </div>
}
