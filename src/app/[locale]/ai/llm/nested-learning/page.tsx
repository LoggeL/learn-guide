'use client'

import { ExternalLink, FlaskConical } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { ComparisonDemo, ForgettingDemo, HopeDiagram, NestedLoopsDemo } from '@/components/interactive/NestedLearningVisualizer'
import { useTranslation } from '@/lib/i18n/context'

function Formula({ children }: { children: React.ReactNode }) {
  return <div className="my-4 overflow-x-auto rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-center font-mono text-sm text-primary-light md:text-base">{children}</div>
}

export default function NestedLearningPage() {
  const { t } = useTranslation()
  const nl = t.nestedLearning

  return (
    <TopicLayout
      topicId="nested-learning"
      title={nl.title}
      description={nl.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: nl.title },
      ]}
    >
      <section className="rounded-2xl border border-border bg-gradient-to-br from-purple-500/10 via-surface/70 to-cyan-500/10 p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-gradient">{nl.heroTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted">{nl.heroBody}</p>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
          <FlaskConical size={20} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-muted"><span className="font-semibold text-amber-300">{nl.statusLabel}: </span>{nl.statusBody}</p>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{nl.memoryTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted">{nl.memoryBody}</p>
        <Formula>{nl.memoryFormula}</Formula>
        <p className="-mt-2 mb-4 text-center font-mono text-xs text-muted">{nl.memoryFormulaHebbian}</p>
        <p className="leading-relaxed text-muted">{nl.memoryLens}</p>
      </section>

      <ForgettingDemo copy={nl.memoryDemo} />

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-gradient">{nl.forgettingTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted">{nl.forgettingBody}</p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{nl.optimizerTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted">{nl.optimizerBody}</p>
        <Formula>{nl.optimizerFormula}</Formula>
        <div className="mt-2 divide-y divide-border border-y border-border">
          {nl.optimizerPoints.map((point, index) => (
            <article key={point.title} className="grid gap-3 py-5 sm:grid-cols-[36px_minmax(0,1fr)]">
              <span className="font-mono text-sm text-primary-light">0{index + 1}</span>
              <div>
                <h3 className="font-heading text-lg font-bold text-text">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{nl.levelsTitle}</h2>
        <p className="mt-4 mb-6 leading-relaxed text-muted">{nl.levelsBody}</p>
        <ComparisonDemo copy={nl.comparison} />
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{nl.cmsTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted">{nl.cmsBody}</p>
        <Formula>{nl.cmsFormula}</Formula>
        <p className="-mt-2 mb-4 overflow-x-auto text-center font-mono text-xs text-muted">{nl.cmsUpdate}</p>
        <p className="mb-6 leading-relaxed text-muted">{nl.cmsSpecial}</p>
        <NestedLoopsDemo copy={nl.cmsDemo} />
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{nl.hopeTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted">{nl.hopeBody}</p>
        <Formula>{nl.hopeFormula}</Formula>
        <HopeDiagram copy={nl.hopeDiagram} />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {nl.hopeParts.map((part) => (
            <article key={part.title} className="rounded-xl border border-border bg-surface/60 p-4">
              <h3 className="font-heading font-bold text-text">{part.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{part.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-gradient">{nl.evidenceTitle}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
          {nl.evidence.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="mb-6 font-heading text-2xl font-bold text-gradient">{nl.keyTakeaways}</h2>
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 md:p-8">
          <ul className="space-y-4 text-text">
            {nl.takeaways.map((item, i) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary-light">{i + 1}</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-xl font-bold text-text">{nl.sourcesTitle}</h2>
        <ul className="mt-4 space-y-3">
          {nl.sources.map((source) => (
            <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-light hover:underline">{source.label}<ExternalLink size={14} className="shrink-0" aria-hidden="true" /></a></li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
