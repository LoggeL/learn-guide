'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { BatchingVisualizer } from '@/components/interactive/BatchingVisualizer'
import { useTranslation } from '@/lib/i18n/context'

export default function BatchingPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.batching.title}
      description={t.batching.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: t.batching.title },
      ]}
      prevTopic={{ label: t.topicNames['kv-cache'], href: '/ai/llm-inference/kv-cache' }}
    >
      {/* Section 1: What is Batching */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.batching.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-8">{t.batching.whatIsDesc}</p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.batching.staticTitle}</h3>
            <p className="text-sm text-muted">{t.batching.staticDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.batching.dynamicTitle}</h3>
            <p className="text-sm text-muted">{t.batching.dynamicDesc}</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/20">
          <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.batching.wasteTitle}</h3>
          <p className="text-sm text-muted">{t.batching.wasteDesc}</p>
        </div>
      </section>

      {/* Section 2: Throughput vs Batch Size */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.batching.throughputTitle}</h2>
            <p className="text-sm text-muted">{t.batching.throughputSubtitle}</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">{t.batching.throughputExplain}</p>
        <BatchingVisualizer section="throughput" t={t.batching as unknown as Record<string, string>} />
      </section>

      {/* Section 3: Prefill vs Decode */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-purple-500 p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.batching.prefillDecodeTitle}</h2>
            <p className="text-sm text-muted">{t.batching.prefillDecodeSubtitle}</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">{t.batching.prefillDecodeExplain}</p>
        <BatchingVisualizer section="prefill" t={t.batching as unknown as Record<string, string>} />
      </section>

      {/* Section 4: Throughput-Latency Tradeoff */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.batching.tradeoffTitle}</h2>
        <p className="text-muted mb-8 leading-relaxed">{t.batching.tradeoffDesc}</p>
        <BatchingVisualizer section="tradeoff" t={t.batching as unknown as Record<string, string>} />
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <p className="text-sm text-text leading-relaxed">💡 {t.batching.tradeoffInsight}</p>
        </div>
      </section>

      {/* Section 5: Continuous Batching */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔄</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.batching.continuousTitle}</h2>
            <p className="text-sm text-muted">{t.batching.continuousSubtitle}</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">{t.batching.continuousExplain}</p>
        <BatchingVisualizer section="continuous" t={t.batching as unknown as Record<string, string>} />
      </section>

      {/* Section 6: Per-User vs System Throughput */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.batching.perUserTitle}</h2>
            <p className="text-sm text-muted">{t.batching.perUserSubtitle}</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">{t.batching.perUserExplain}</p>
        <BatchingVisualizer section="peruser" t={t.batching as unknown as Record<string, string>} />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.batching.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.batching.takeaway1,
              t.batching.takeaway2,
              t.batching.takeaway3,
              t.batching.takeaway4,
              t.batching.takeaway5,
            ].map((item, i) => (
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
    </TopicLayout>
  )
}
