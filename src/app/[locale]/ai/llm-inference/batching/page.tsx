'use client'
import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { BatchingVisualizer } from '@/components/interactive/BatchingVisualizer'
import { BatchingChunkedPrefillDemo } from '@/components/interactive/BatchingChunkedPrefillDemo'
import { useTranslation } from '@/lib/i18n/context'

export default function BatchingPage() {
  const { t, locale } = useTranslation()
  const b = t.batching

  const metrics = [
    { title: b.metricTtftTitle, desc: b.metricTtftDesc, color: 'text-amber-400' },
    { title: b.metricTpotTitle, desc: b.metricTpotDesc, color: 'text-violet-400' },
    { title: b.metricE2eTitle, desc: b.metricE2eDesc, color: 'text-cyan-400' },
    { title: b.metricGoodputTitle, desc: b.metricGoodputDesc, color: 'text-emerald-400' },
  ]

  const paged = [
    { title: b.pagedAdmitTitle, desc: b.pagedAdmitDesc },
    { title: b.pagedPreemptTitle, desc: b.pagedPreemptDesc },
    { title: b.pagedShareTitle, desc: b.pagedShareDesc },
  ]

  const sources = [
    { label: b.srcOrca, href: 'https://www.usenix.org/conference/osdi22/presentation/yu' },
    { label: b.srcPaged, href: 'https://arxiv.org/abs/2309.06180' },
    { label: b.srcSarathi, href: 'https://arxiv.org/abs/2403.02310' },
    { label: b.srcDistServe, href: 'https://arxiv.org/abs/2401.09670' },
    { label: b.srcSplitwise, href: 'https://arxiv.org/abs/2311.18677' },
    { label: b.srcMooncake, href: 'https://arxiv.org/abs/2407.00079' },
    { label: b.srcVllmOpt, href: 'https://docs.vllm.ai/en/latest/configuration/optimization.html' },
    { label: b.srcVllmDisagg, href: 'https://docs.vllm.ai/en/latest/features/disagg_prefill.html' },
  ]

  return (
    <TopicLayout
      topicId="batching"
      title={b.title}
      description={b.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: b.title },
      ]}
    >
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{b.whatIs}</h2>
        <p className="text-muted">{b.whatIsDesc}</p>
        <p className="text-sm text-muted">
          {b.whatIsMega}{' '}
          <Link href={`/${locale}/ai/llm-inference/mega-kernels`} className="font-medium text-primary-light hover:underline">
            {b.megaLink}
          </Link>
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{b.throughputTitle}</h2>
        <p className="text-muted">{b.throughputExplain}</p>
        <BatchingVisualizer section="throughput" />
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{b.metricsTitle}</h2>
        <p className="text-muted">{b.metricsIntro}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((mt) => (
            <article key={mt.title} className="rounded-xl border border-border bg-background p-4">
              <h3 className={`mb-2 font-semibold ${mt.color}`}>{mt.title}</h3>
              <p className="text-sm text-muted">{mt.desc}</p>
            </article>
          ))}
        </div>
        <p className="text-sm text-muted">{b.metricsSlo}</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{b.continuousTitle}</h2>
        <p className="text-muted">{b.continuousExplain}</p>
        <BatchingVisualizer section="continuous" />
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{b.pagedTitle}</h2>
        <p className="text-muted">{b.pagedIntro}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {paged.map((p) => (
            <article key={p.title} className="rounded-xl border border-border bg-background p-4">
              <h3 className="mb-2 font-semibold text-cyan-400">{p.title}</h3>
              <p className="text-sm text-muted">{p.desc}</p>
            </article>
          ))}
        </div>
        <p className="text-sm text-muted">{b.pagedResult}</p>
        <Link
          href={`/${locale}/ai/llm-inference/prompt-caching`}
          className="inline-block text-sm font-medium text-primary-light hover:underline"
        >
          {b.promptCachingLink}
        </Link>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{b.chunkedTitle}</h2>
        <p className="text-muted">{b.chunkedIntro}</p>
        <p className="text-muted">{b.chunkedTradeoff}</p>
        <BatchingChunkedPrefillDemo />
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{b.disaggTitle}</h2>
        <p className="text-muted">{b.disaggIntro}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-emerald-500/20 bg-background p-4">
            <h3 className="mb-2 font-semibold text-emerald-400">{b.disaggProTitle}</h3>
            <p className="text-sm text-muted">{b.disaggProDesc}</p>
          </article>
          <article className="rounded-xl border border-orange-500/20 bg-background p-4">
            <h3 className="mb-2 font-semibold text-orange-400">{b.disaggConTitle}</h3>
            <p className="text-sm text-muted">{b.disaggConDesc}</p>
          </article>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{b.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[b.takeaway1, b.takeaway2, b.takeaway3, b.takeaway4].map((item, i) => (
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

      <section className="rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl font-bold font-heading text-text mb-4">{b.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {sources.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noreferrer" className="text-primary-light hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
