'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { AttentionVisualizer } from '@/components/interactive/AttentionVisualizer'
import { useTranslation } from '@/lib/i18n/context'
import { softmax } from '@/lib/learning/decoding'

const SOURCES = [
  ['Attention Is All You Need (2017)', 'https://arxiv.org/abs/1706.03762'],
  ['FlashAttention (2022)', 'https://arxiv.org/abs/2205.14135'],
  ['Attention is not Explanation (2019)', 'https://arxiv.org/abs/1902.10186'],
] as const

// Raw scores +σ, 0, −σ with σ = √dₖ, before and after dividing by √dₖ.
const SQRT_ROWS = [2, 64, 128].map(dk => {
  const sigma = Math.sqrt(dk)
  return { dk, sigma, unscaled: softmax([sigma, 0, -sigma], 1), scaled: softmax([1, 0, -1], 1) }
})

export default function AttentionPage() {
  const { t, locale } = useTranslation()
  const c = t.attention
  const num = (value: number, digits: number) => value.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
  const weights = (row: number[]) => row.map(w => num(w, 3)).join(' / ')
  return <TopicLayout topicId="attention" title={c.title} description={c.description} breadcrumbs={[{ label: t.categories.ai, href: '/' }, { label: t.categories.llm, href: '/ai/llm' }, { label: c.title }]}>
    <section><h2 className="mb-3 text-xl font-semibold">{c.what}</h2><p className="leading-relaxed text-muted">{c.body}</p><div className="mt-5 grid gap-3 md:grid-cols-3">{c.parts.map(part => <article className="rounded-xl border border-border bg-surface p-4" key={part.title}><h3 className="mb-2 font-semibold text-cyan-300">{part.title}</h3><p className="text-sm leading-relaxed text-muted">{part.body}</p></article>)}</div></section>
    <AttentionVisualizer />
    <section className="rounded-xl border border-border bg-surface p-6"><h2 className="mb-3 text-xl font-semibold">{c.formula}</h2><p className="mb-4 overflow-x-auto font-mono text-sm text-cyan-300">Attention(Q,K,V) = softmax(QKᵀ / √dₖ + M) V</p><p className="leading-relaxed text-muted">{c.formulaBody}</p></section>
    <section>
      <h2 className="mb-3 text-xl font-semibold">{c.sqrtTitle}</h2>
      <p className="leading-relaxed text-muted">{c.sqrtBody}</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-right text-sm">
          <caption className="mb-3 text-left text-muted">{c.sqrtCaption}</caption>
          <thead><tr>{[c.sqrtHeadDim, c.sqrtRawStd, c.sqrtUnscaled, c.sqrtScaled].map(label => <th className="p-3" key={label}>{label}</th>)}</tr></thead>
          <tbody>{SQRT_ROWS.map(row => <tr key={row.dk} className="border-t border-border"><td className="p-3 font-mono">{row.dk}</td><td className="p-3 font-mono">{num(row.sigma, 2)}</td><td className="whitespace-nowrap p-3 font-mono">{weights(row.unscaled)}</td><td className="whitespace-nowrap p-3 font-mono text-cyan-300">{weights(row.scaled)}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{c.sqrtCaveat}</p>
    </section>
    <section><h2 className="mb-3 text-xl font-semibold">{c.causal}</h2><p className="leading-relaxed text-muted">{c.causalBody}</p></section>
    <section><h2 className="mb-3 text-xl font-semibold">{c.cost}</h2><p className="leading-relaxed text-muted">{c.costBody}</p><div className="mt-4 overflow-x-auto"><table className="w-full text-right text-sm"><thead><tr>{[c.length, c.pairs, c.storage].map(label => <th className="p-3" key={label}>{label}</th>)}</tr></thead><tbody>{[4096, 8192, 16384].map(n => <tr key={n} className="border-t border-border"><td className="p-3">{n.toLocaleString(locale)} {c.tokens}</td><td className="p-3 font-mono">{(n * n).toLocaleString(locale)}</td><td className="p-3 font-mono">{n * n * 2 / 2 ** 20} MiB</td></tr>)}</tbody></table></div></section>
    {[[c.flash, c.flashBody], [c.interpretation, c.interpretationBody]].map(([title, body]) => <section key={title}><h2 className="mb-3 text-xl font-semibold">{title}</h2><p className="leading-relaxed text-muted">{body}</p></section>)}
    <section><h2 className="mb-3 text-xl font-semibold">{c.sources}</h2><ul className="space-y-2 text-cyan-300">{SOURCES.map(([name, href]) => <li key={href}><a className="underline" href={href} target="_blank" rel="noopener noreferrer">{name}</a></li>)}</ul></section>
  </TopicLayout>
}
