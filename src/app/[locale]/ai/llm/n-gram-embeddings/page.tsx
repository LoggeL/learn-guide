'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { NGramGenerationComparison } from '@/components/interactive/NGramGenerationComparison'
import { NGramKeyExplorer } from '@/components/interactive/NGramKeyExplorer'
import { useTranslation } from '@/lib/i18n/context'
import { Check, ExternalLink, TriangleAlert } from 'lucide-react'

export default function NGramEmbeddingsPage() {
  const { t } = useTranslation()
  const c = t.nGramEmbeddings
  return (
    <TopicLayout topicId="n-gram-embeddings" title={c.title} description={c.description} breadcrumbs={[{ label: t.categories.ai, href: '/' }, { label: t.categories.llm, href: '/ai/llm' }, { label: c.title }]}>
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gradient">{c.whatTitle}</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">{c.whatBody}</p>
        <p className="mt-3 leading-relaxed text-muted">{c.trainingBody}</p>
      </section>

      <NGramGenerationComparison copy={c.generation} />

      <section>
        <h2 className="text-2xl font-bold text-gradient">{c.mechanismTitle}</h2>
        <p className="mt-3 leading-relaxed text-muted">{c.mechanismIntro}</p>
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {c.mechanismSteps.map((step, index) => (
            <li key={step.title} className="grid gap-3 py-5 sm:grid-cols-[36px_minmax(0,1fr)]">
              <span className="font-mono text-sm text-primary-light">0{index + 1}</span>
              <div className="min-w-0">
                <h3 className="font-heading text-lg font-bold text-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                <code className="mt-3 block overflow-x-auto rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary-light">{step.formula}</code>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <NGramKeyExplorer copy={c.keyExplorer} />

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gradient">{c.trainingTitle}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">{c.trainingPoints.map((point) => <li key={point}>{point}</li>)}</ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2"><Panel title={c.whyTitle} items={c.benefits} good /><Panel title={c.limitsTitle} items={c.limits} /></section>

      <section>
        <h2 className="text-2xl font-bold text-gradient">{c.lineageTitle}</h2>
        <p className="mt-3 leading-relaxed text-muted">{c.lineageIntro}</p>
        <ol className="mt-6 space-y-4 border-l border-border pl-5">
          {c.lineage.map((item) => (
            <li key={item.name} className="relative">
              <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-cyan-300 bg-background" aria-hidden="true" />
              <p className="font-mono text-xs text-cyan-300">{item.year}</p>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-2 font-heading text-lg font-bold text-text hover:text-primary-light">{item.name}<ExternalLink size={14} aria-hidden="true" /></a>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 md:p-8">
        <h2 className="text-xl font-bold text-cyan-200">{c.caseTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{c.caseBody}</p>
        <div className="mt-4 flex flex-wrap gap-2">{c.facts.map((fact) => <span key={fact} className="rounded-lg border border-cyan-500/20 bg-background/60 px-3 py-2 font-mono text-xs text-cyan-200">{fact}</span>)}</div>
        <h3 className="mt-6 font-heading font-bold text-text">{c.ablationTitle}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">{c.ablation.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="mt-4 text-xs leading-relaxed text-muted">{c.activeCaveat}</p>
      </section>

      <section className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-purple-300">{c.notTitle}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-background/70 p-4"><h3 className="font-bold text-text">{c.specTitle}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{c.specBody}</p></div>
          <div className="rounded-xl bg-background/70 p-4"><h3 className="font-bold text-text">{c.mtpTitle}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{c.mtpBody}</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text">{c.sourcesTitle}</h2>
        <ul className="mt-4 space-y-3">{c.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-light hover:underline">{source.label}<ExternalLink size={14} className="shrink-0" aria-hidden="true" /></a></li>)}</ul>
      </section>
    </TopicLayout>
  )
}

function Panel({ title, items, good = false }: { title: string; items: string[]; good?: boolean }) {
  const Icon = good ? Check : TriangleAlert
  return (
    <div className={`rounded-2xl border p-6 ${good ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-orange-500/20 bg-orange-500/5'}`}>
      <h2 className="text-xl font-bold text-text">{title}</h2>
      <ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted"><Icon size={16} className={`mt-1 shrink-0 ${good ? 'text-emerald-300' : 'text-orange-300'}`} aria-hidden="true" />{item}</li>)}</ul>
    </div>
  )
}
