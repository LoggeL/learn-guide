'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { normalizeVector, vectorMean } from '@/lib/llmLearningMath'

export function ResidualStreamLayerNormVisualizer() {
  const { t } = useTranslation()
  const c = t.residualStream.viz
  const [x, setX] = useState([1, -1, 2, 0])
  const [mode, setMode] = useState<'pre' | 'post'>('pre')
  const [norm, setNorm] = useState<'layer' | 'rms'>('layer')
  const [gain, setGain] = useState(0.8)
  const normalize = (v: number[]) => normalizeVector(v, norm)
  const branchInput = mode === 'pre' ? normalize(x) : x
  const delta = branchInput.map((value, i) => gain * Math.tanh(0.6 * value + 0.3 * branchInput[(i + 1) % 4]))
  const sum = x.map((value, i) => value + delta[i])
  const output = mode === 'post' ? normalize(sum) : sum
  const normInput = mode === 'pre' ? x : sum
  const mean = vectorMean(normInput)
  const variance = vectorMean(normInput.map(value => (value - mean) ** 2))
  const rows = [[c.input, x], [c.before, branchInput], [c.delta, delta], [c.sum, sum], [c.output, output]] as const
  return <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 md:p-6">
    <h3 className="text-xl font-semibold">{c.title}</h3>
    <p className="text-sm leading-relaxed text-muted">{c.note}</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="space-y-2 text-sm">{c.mode}<select className="block w-full rounded-lg border border-border bg-background p-2" value={mode} onChange={e => setMode(e.target.value as 'pre' | 'post')}><option value="pre">{c.pre}</option><option value="post">{c.post}</option></select></label>
      <label className="space-y-2 text-sm">{c.norm}<select className="block w-full rounded-lg border border-border bg-background p-2" value={norm} onChange={e => setNorm(e.target.value as 'layer' | 'rms')}><option value="layer">LayerNorm</option><option value="rms">RMSNorm</option></select></label>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{x.map((value, i) => <label key={i} className="text-sm">x{i}: {value.toFixed(1)}<input className="block w-full" aria-label={`x${i}`} type="range" min={-4} max={4} step={0.1} value={value} onChange={e => setX(previous => previous.map((v, j) => i === j ? Number(e.target.value) : v))} /></label>)}</div>
    <label className="block text-sm">{c.gain}: {gain.toFixed(1)}<input className="block w-full" type="range" min={0} max={2} step={0.1} value={gain} onChange={e => setGain(Number(e.target.value))} /></label>
    <p className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-sm text-cyan-300">{mode === 'pre' ? 'y = x + F(Norm(x))' : 'y = Norm(x + F(x))'}</p>
    <div className="overflow-x-auto"><table className="w-full text-right font-mono text-sm"><thead><tr><th className="p-2 text-left">x</th>{x.map((_, i) => <th className="p-2" key={i}>{i}</th>)}</tr></thead><tbody>{rows.map(([label, values]) => <tr key={label} className="border-t border-border"><th className="p-2 text-left font-sans font-normal">{label}</th>{values.map((v, i) => <td className="p-2" key={i}>{v.toFixed(3)}</td>)}</tr>)}</tbody></table></div>
    <p className="text-sm text-muted">{c.normalized}: {c.mean} = {mean.toFixed(3)}; {c.variance} = {variance.toFixed(3)}.</p>
    <p className="text-sm text-muted">{norm === 'layer' ? c.layer : c.rms}</p>
    <p className="text-sm text-muted">{c.formula}</p>
    <p className="border-l-2 border-cyan-500 pl-4 text-sm text-muted">{c.limit}</p>
    <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => { setX([1, -1, 2, 0]); setGain(0.8); setMode('pre'); setNorm('layer') }}>{c.reset}</button>
  </div>
}
