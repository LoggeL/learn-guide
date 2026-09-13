'use client'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { BatchingVisualizer } from '@/components/interactive/BatchingVisualizer'
import { useTranslation } from '@/lib/i18n/context'
export default function BatchingPage() {
  const { t } = useTranslation(),
    b = t.batching
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
        <div className="grid gap-4 sm:grid-cols-2">
          <article>
            <h3 className="mb-2 font-semibold">{b.staticTitle}</h3>
            <p className="text-sm text-muted">{b.staticDesc}</p>
          </article>
          <article>
            <h3 className="mb-2 font-semibold">{b.dynamicTitle}</h3>
            <p className="text-sm text-muted">{b.dynamicDesc}</p>
          </article>
        </div>
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{b.throughputTitle}</h2>
        <p className="text-muted">{b.throughputExplain}</p>
        <BatchingVisualizer section="throughput" t={b} />
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{b.prefillDecodeTitle}</h2>
        <p className="text-muted">{b.prefillDecodeExplain}</p>
        <BatchingVisualizer section="prefill" t={b} />
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{b.continuousTitle}</h2>
        <p className="text-muted">{b.continuousExplain}</p>
        <BatchingVisualizer section="continuous" t={b} />
      </section>
    </TopicLayout>
  )
}
