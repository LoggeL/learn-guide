'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'

export function ScaleCalculator() {
  const { locale } = useTranslation()
  const de=locale==='de'
  const [tokens,setTokens]=useState(1000)
  const format=(n:number)=>n.toLocaleString(locale)
  return <section className="rounded-2xl border border-border p-4 sm:p-6 space-y-4">
    <h2 className="text-xl font-semibold">{de ? 'Rechenaufwand ist keine Erfolgsquote' : 'Compute cost is not task accuracy'}</h2>
    <label className="block">{de ? 'Sequenzlänge n' : 'Sequence length n'}: <output>{format(tokens)}</output><input aria-label={de ? 'Sequenzlänge n' : 'Sequence length n'} className="w-full mt-3" type="range" min="1000" max="128000" step="1000" value={tokens} onChange={e=>setTokens(+e.target.value)}/></label>
    <dl className="grid gap-4 sm:grid-cols-2"><div><dt className="text-sm text-muted">{de ? 'Volle Score-Matrix pro Head' : 'Full score matrix per head'}</dt><dd className="text-xl tabular-nums">{format(tokens*tokens)}</dd><dd className="text-sm text-muted">n²</dd></div><div><dt className="text-sm text-muted">{de ? 'Kausal erlaubte Einträge inklusive Diagonale' : 'Causally allowed entries including diagonal'}</dt><dd className="text-xl tabular-nums">{format(tokens*(tokens+1)/2)}</dd><dd className="text-sm text-muted">n(n+1)/2</dd></div></dl>
    <p className="text-sm text-muted">{de ? 'Das sind Zählungen für dichte Self-Attention über eine ganze Sequenz, keine gemessenen Laufzeiten. FlashAttention muss die volle Matrix nicht im Hauptspeicher ablegen; ein Decode-Schritt mit KV-Cache hat andere Kosten. Gelernte Attention ist keine Gleichverteilung: Ein Token kann auch in langem Kontext ein hohes Gewicht erhalten.' : 'These count dense self-attention scores across a full sequence, not measured runtime. FlashAttention need not materialize the full matrix in main memory; a decode step with KV cache has different costs. Learned attention is not uniform: a token can receive high weight even in a long context.'}</p>
  </section>
}
