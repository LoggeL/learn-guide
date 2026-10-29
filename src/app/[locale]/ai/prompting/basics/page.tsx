'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { PromptBeforeAfterDemo } from '@/components/interactive/PromptBeforeAfterDemo'
import { useTranslation } from '@/lib/i18n/context'

const BLOCK_COLORS = ['text-blue-400', 'text-purple-400', 'text-emerald-400', 'text-orange-400', 'text-cyan-400']

export default function PromptBasicsPage() {
  const { t, locale } = useTranslation()
  const c = t.promptBasics

  return (
    <TopicLayout topicId="prompt-basics"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.prompting, href: '/ai/prompting' },
        { label: c.title },
      ]}
    >
      {/* What is a prompt */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">{c.whatIsDesc}</p>
        <p className="mt-4 text-sm text-muted leading-relaxed">{c.whatIsLimit}</p>
        <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <h3 className="font-bold text-cyan-400 mb-1">{c.colleagueTest}</h3>
          <p className="text-sm text-muted leading-relaxed">{c.colleagueTestDesc}</p>
        </div>
      </section>

      {/* Building blocks */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.blocksTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.blocksDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {[...c.blocks.map(block => ({ ...block, optional: false })), ...c.optionalBlocks.map(block => ({ ...block, optional: true }))].map((block, i) => (
            <div key={block.name} className="p-5 bg-surface border border-border rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-lg font-bold font-heading ${BLOCK_COLORS[i % BLOCK_COLORS.length]}`}>{block.name}</h3>
                {block.optional && (
                  <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted">{c.optional}</span>
                )}
              </div>
              <p className="text-sm text-muted leading-relaxed">{block.desc}</p>
              <p className="mt-3 rounded-lg bg-background border border-border p-3 font-mono text-xs text-text">{block.example}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Before / after */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.pairsTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.pairsDesc}</p>
        <PromptBeforeAfterDemo />
      </section>

      {/* Structure with delimiters */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.structureTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{c.structureDesc}</p>
        <pre className="p-4 bg-background rounded-xl border border-border overflow-x-auto text-sm text-cyan-300 font-mono">{c.structureCode}</pre>
        <p className="mt-4 text-sm text-muted">
          {c.structureTip}{' '}
          <Link href={`/${locale}/ai/prompting/advanced`} className="text-primary-light underline">{c.structureLink}</Link>
        </p>
      </section>

      {/* Positive instructions + reasons */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.positiveTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.positiveDesc}</p>
        <div className="space-y-3">
          {c.positiveRows.map(row => (
            <div key={row.weak} className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-400 mb-1">{c.positiveWeak}</p>
                <p className="text-sm text-muted">{row.weak}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400 mb-1">{c.positiveStrong}</p>
                <p className="text-sm text-text">{row.strong}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">{c.positiveNote}</p>
      </section>

      {/* Iterate */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.iterateTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.iterateDesc}</p>
        <ol className="grid gap-3 md:grid-cols-5">
          {c.iterateSteps.map((step, i) => (
            <li key={step.title} className="p-4 bg-background rounded-xl border border-border">
              <span className="w-6 h-6 rounded-lg bg-primary/20 inline-flex items-center justify-center text-primary-light text-sm font-bold mb-2">{i + 1}</span>
              <h3 className="font-bold text-text text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted">{c.iterateNote}</p>
      </section>

      {/* Common mistakes */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.mistakesTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {c.mistakes.map(mistake => (
            <div key={mistake.title} className="p-5 bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20 rounded-xl">
              <h3 className="font-bold text-red-400 mb-1">{mistake.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{mistake.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {c.takeaways.map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary-light text-sm font-bold">{i + 1}</span>
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sources */}
      <section className="border-t border-border pt-5">
        <h2 className="font-semibold mb-3">{c.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {c.sources.map(source => (
            <li key={source.url}><a className="text-primary-light underline" href={source.url}>{source.label}</a></li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
