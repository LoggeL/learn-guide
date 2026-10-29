'use client'

import { useMemo, useState } from 'react'
import { Hash } from 'lucide-react'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'

export type NGramKeyCopy = Dictionary['nGramEmbeddings']['keyExplorer']

// Deliberately tiny prime-sized tables so that collisions show up with a handful of tokens.
const HEADS = [
  { size: 13, seed: 0x9e3779b1 },
  { size: 17, seed: 0x85ebca6b },
]

/** Canonicalisation: case-fold and Unicode-normalise, as Engram does on token IDs. */
const canon = (token: string) => token.normalize('NFKC').toLowerCase()
const tokenId = (token: string) => Array.from(token).reduce((h, c) => (Math.imul(h, 31) + c.codePointAt(0)!) >>> 0, 17)
/** Multiplicative-XOR hash over the n-gram's token IDs, one seed per head. */
const hashGram = (gram: string[], seed: number) => gram.reduce((h, token) => (Math.imul(h ^ tokenId(token), 0x01000193) >>> 0), seed >>> 0)

type Row = { end: number; key: string; slots: number[] }

export function NGramKeyExplorer({ copy }: { copy: NGramKeyCopy }) {
  const [n, setN] = useState(2)
  const [input, setInput] = useState('The cat sat on the mat and the cat sat down')
  const tokens = useMemo(() => input.trim().split(/\s+/).filter(Boolean).slice(0, 14).map(canon), [input])

  const rows: Row[] = useMemo(() => tokens.flatMap((_, end) => {
    const start = end - n + 1
    if (start < 0) return []
    const gram = tokens.slice(start, end + 1)
    return [{ end, key: gram.join(' · '), slots: HEADS.map((head) => hashGram(gram, head.seed) % head.size) }]
  }), [tokens, n])

  // A collision means two *different* keys share a row; identical keys are a legitimate reuse.
  const collides = (row: Row, head: number) => rows.some((other) => other.key !== row.key && other.slots[head] === row.slots[head])
  const collidesAll = (row: Row) => rows.some((other) => other.key !== row.key && other.slots.every((slot, h) => slot === row.slots[h]))
  const uniqueKeys = Array.from(new Map(rows.map((row) => [row.key, row])).values())
  const headCounts = HEADS.map((_, h) => uniqueKeys.filter((row) => collides(row, h)).length)
  const allCount = uniqueKeys.filter(collidesAll).length

  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-5 md:p-7">
      <div className="mb-5 flex gap-3">
        <div className="h-fit rounded-xl bg-cyan-500/15 p-3 text-cyan-300"><Hash aria-hidden="true" /></div>
        <div><h2 className="font-heading text-2xl font-bold text-gradient">{copy.title}</h2><p className="mt-1 text-sm leading-relaxed text-muted">{copy.description}</p></div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <label className="text-sm text-muted">{copy.tokensLabel}<input value={input} onChange={(e) => setInput(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-text outline-none focus:border-primary" /></label>
        <fieldset>
          <legend className="mb-2 text-sm text-muted">{copy.orderLabel}</legend>
          <div className="flex gap-2">{[2, 3].map((value) => <button key={value} type="button" aria-pressed={n === value} onClick={() => setN(value)} className={`min-h-11 min-w-11 rounded-xl border px-4 font-mono ${n === value ? 'border-primary bg-primary/20 text-primary-light' : 'border-border bg-background text-muted'}`}>n={value}</button>)}</div>
        </fieldset>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-lg border border-border bg-background px-3 py-2 text-muted">{copy.summary}:</span>
        {HEADS.map((head, h) => <span key={head.size} className="rounded-lg border border-orange-400/30 bg-orange-400/5 px-3 py-2 font-mono text-orange-200">{copy.summaryHead} {h + 1} ({head.size} {copy.rows}): {headCounts[h]}</span>)}
        <span className="rounded-lg border border-red-400/30 bg-red-400/5 px-3 py-2 font-mono text-red-200">{copy.summaryBoth}: {allCount}</span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted"><tr><th className="p-3">{copy.position}</th><th className="p-3">{copy.key}</th>{HEADS.map((head, h) => <th key={head.size} className="p-3">{copy.head} {h + 1} · mod {head.size}</th>)}</tr></thead>
          <tbody>
            {rows.map((row) => {
              const both = collidesAll(row)
              return (
                <tr key={row.end} className={`border-t border-border ${both ? 'bg-red-400/5' : ''}`}>
                  <td className="p-3 font-mono text-muted">t={row.end}</td>
                  <td className="p-3"><code className="rounded bg-background px-2 py-1 text-cyan-300">[{row.key}]</code></td>
                  {row.slots.map((slot, h) => {
                    const hit = collides(row, h)
                    return <td key={h} className="p-3"><span title={hit ? (both ? copy.collisionAll : copy.collisionHead) : undefined} className={`inline-block min-w-10 rounded-md border px-2 py-1 text-center font-mono ${both ? 'border-red-400/50 text-red-200' : hit ? 'border-orange-400/50 text-orange-200' : 'border-border text-text'}`}>{slot}</span></td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {!rows.length && <p className="p-4 text-muted">{copy.empty}</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded border border-orange-400/60" aria-hidden="true" />{copy.collisionHead}</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded border border-red-400/60 bg-red-400/10" aria-hidden="true" />{copy.collisionAll}</span>
      </div>
      <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-200">{copy.illustrative}</p>
    </section>
  )
}
