'use client'

import { useMemo, useState } from 'react'
import { Hash } from 'lucide-react'

export type NGramKeyCopy = {
  title: string; description: string; tokensLabel: string; orderLabel: string
  position: string; key: string; slot: string; value: string; illustrative: string; empty: string
}

const TABLE_SIZE = 20_000_000
const tokenId = (token: string) => Array.from(token).reduce((h, c) => (h * 31 + c.codePointAt(0)!) >>> 0, 17)
const demoSlot = (tokens: string[]) => tokens.reduce((h, token) => (Math.imul(h ^ tokenId(token), 16777619) >>> 0), 2166136261) % TABLE_SIZE
const demoVector = (slot: number) => [0, 1, 2, 3].map(i => ((((slot >>> (i * 5)) & 31) - 15) / 10).toFixed(1))

export function NGramKeyExplorer({ copy }: { copy: NGramKeyCopy }) {
  const [n, setN] = useState(2)
  const [input, setInput] = useState('the quick brown fox')
  const tokens = useMemo(() => input.trim().split(/\s+/).filter(Boolean).slice(0, 10), [input])
  const rows = tokens.map((_, end) => {
    const start = end - n + 1
    if (start < 0) return null
    const gram = tokens.slice(start, end + 1)
    const slot = demoSlot(gram)
    return { end, gram, slot, vector: demoVector(slot) }
  }).filter(Boolean) as { end: number; gram: string[]; slot: number; vector: string[] }[]

  return <section className="rounded-2xl border border-border bg-surface/50 p-5 md:p-7">
    <div className="mb-5 flex gap-3"><div className="rounded-xl bg-cyan-500/15 p-3 text-cyan-300"><Hash /></div><div><h2 className="font-heading text-2xl font-bold text-gradient">{copy.title}</h2><p className="mt-1 text-sm text-muted">{copy.description}</p></div></div>
    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
      <label className="text-sm text-muted">{copy.tokensLabel}<input value={input} onChange={e => setInput(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-text outline-none focus:border-primary" /></label>
      <fieldset><legend className="mb-2 text-sm text-muted">{copy.orderLabel}</legend><div className="flex gap-2">{[1,2,3].map(value => <button key={value} type="button" aria-pressed={n === value} onClick={() => setN(value)} className={`min-h-11 min-w-11 rounded-xl border px-4 font-mono ${n === value ? 'border-primary bg-primary/20 text-primary-light' : 'border-border bg-background text-muted'}`}>n={value}</button>)}</div></fieldset>
    </div>
    <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">{copy.illustrative}</p>
    <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-muted"><tr><th className="p-3">{copy.position}</th><th className="p-3">{copy.key}</th><th className="p-3">{copy.slot}</th><th className="p-3">{copy.value}</th></tr></thead><tbody>{rows.map(row => <tr key={row.end} className="border-t border-border"><td className="p-3 font-mono">t={row.end}</td><td className="p-3"><code className="rounded bg-background px-2 py-1 text-cyan-300">[{row.gram.join(' · ')}]</code></td><td className="p-3 font-mono">{row.slot.toLocaleString()}</td><td className="p-3 font-mono text-emerald-300">[{row.vector.join(', ')}, …]</td></tr>)}</tbody></table>{!rows.length && <p className="p-4 text-muted">{copy.empty}</p>}</div>
  </section>
}
