'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink, Repeat2 } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { LoopedTransformerVisualizer } from '@/components/interactive/LoopedTransformerVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  { title: 'Scaling up Test-Time Compute with Latent Reasoning', url: 'https://arxiv.org/abs/2502.05171' },
  { title: 'Latent Chain-of-Thought? Decoding the Depth-Recurrent Transformer', url: 'https://arxiv.org/abs/2507.02199' },
  { title: 'LOTUS: Bridging the Gap Between Latent and Explicit Reasoning', url: 'https://arxiv.org/abs/2606.31779' },
  { title: 'Depth-Recurrent Attention Mixtures', url: 'https://arxiv.org/abs/2601.21582' },
  { title: 'NVIDIA GPU Performance Background', url: 'https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background/index.html' },
  { title: 'GPT-6 Astra System Card', url: 'https://deploymentsafety.openai.com/gpt-6-astra' },
  { title: 'The Information', url: 'https://www.theinformation.com/articles/secret-technique-behind-openais-astra-model-sparks-security-concerns' },
]

export default function LoopedTransformersPage() {
  const { t, locale } = useTranslation()
  const c = t.loopedTransformers
  const related = [
    { id: 'transformer-architecture', path: '/ai/llm/transformer-architecture' },
    { id: 'reasoning-models', path: '/ai/llm/reasoning-models' },
    { id: 'residual-stream-layer-norm', path: '/ai/llm/residual-stream-layer-norm' },
    { id: 'kv-cache', path: '/ai/llm-inference/kv-cache' },
  ] as const

  return (
    <TopicLayout topicId="looped-transformers" title={c.title} description={c.description} breadcrumbs={[
      { label: t.categories.ai, href: '/' },
      { label: t.categories.llm, href: '/ai/llm' },
      { label: c.title },
    ]}>
      <section className="rounded-2xl border border-border bg-gradient-to-br from-purple-500/10 via-surface/70 to-cyan-500/10 p-6 md:p-8">
        <Repeat2 size={28} className="mb-4 text-primary-light" aria-hidden="true" />
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.heroTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted">{c.heroBody}</p>
      </section>

      <LoopedTransformerVisualizer />

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.hiddenTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted">{c.hiddenBody}</p>
        <div className="my-5 rounded-xl border border-primary/25 bg-primary/5 p-4 text-center font-mono text-lg text-primary-light">{c.formula}</div>
        <p className="text-sm leading-relaxed text-muted">{c.hiddenLimit}</p>
        <a href={SOURCES[0].url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-primary-light hover:underline">{SOURCES[0].title}<ExternalLink size={13} aria-hidden="true" /></a>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.motivationTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted">{c.motivationBody}</p>
        <div className="mt-6 divide-y divide-border border-y border-border">
          {c.bottlenecks.map((item, index) => <article key={item.title} className="grid gap-3 py-5 sm:grid-cols-[36px_minmax(0,1fr)]"><span className="font-mono text-sm text-primary-light">0{index + 1}</span><div><h3 className="font-heading text-lg font-bold text-text">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p></div></article>)}
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.visibilityTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted">{c.visibilityBody}</p>
        <div className="mt-4 flex flex-wrap gap-4">{SOURCES.slice(1, 3).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-primary-light hover:underline">{source.title}<ExternalLink size={13} className="shrink-0" aria-hidden="true" /></a>)}</div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6">
        <h2 className="font-heading text-xl font-bold text-text">{c.astraTitle}</h2>
        <p className="mt-3 text-sm text-text">{c.astraNews} <a href={SOURCES[6].url} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">{SOURCES[6].title}</a></p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{c.astraBody}</p>
        <a href={SOURCES[5].url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-primary-light hover:underline">{SOURCES[5].title}<ExternalLink size={13} aria-hidden="true" /></a>
      </section>

      <section>
        <h2 className="font-heading text-xl font-bold text-text">{c.sourcesTitle}</h2>
        <ul className="mt-4 space-y-3">{SOURCES.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-light hover:underline">{source.title}<ExternalLink size={14} className="shrink-0" aria-hidden="true" /></a></li>)}</ul>
      </section>
      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.relatedTitle}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{related.map((item) => <Link key={item.id} href={`/${locale}${item.path}`} className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/55 p-4 hover:border-primary/45"><span className="font-heading font-bold text-text group-hover:text-primary-light">{t.topicNames[item.id]}</span><ArrowRight size={18} className="shrink-0 text-primary-light" aria-hidden="true" /></Link>)}</div>
      </section>
    </TopicLayout>
  )
}
