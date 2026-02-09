'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { KVCacheVisualizer } from '@/components/interactive/KVCacheVisualizer'
import { useTranslation } from '@/lib/i18n/context'

export default function KVCachePage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="kv-cache"
      title={t.kvCache.title}
      description={t.kvCache.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: t.kvCache.title },
      ]}
    >
      {/* What is KV Cache */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.kvCache.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.kvCache.whatIsDesc}
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
              <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.kvCache.keyCache}</h3>
              <p className="text-sm text-muted">{t.kvCache.keyCacheDesc}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
              <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.kvCache.valueCache}</h3>
              <p className="text-sm text-muted">{t.kvCache.valueCacheDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.kvCache.whyMatters}</h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">{t.kvCache.whyMattersDesc}</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-sm font-bold text-green-400 mb-1">{t.kvCache.benefit1Title}</h3>
              <p className="text-xs text-muted">{t.kvCache.benefit1Desc}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/20">
              <div className="text-2xl mb-2">🔁</div>
              <h3 className="text-sm font-bold text-blue-400 mb-1">{t.kvCache.benefit2Title}</h3>
              <p className="text-xs text-muted">{t.kvCache.benefit2Desc}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
              <div className="text-2xl mb-2">📉</div>
              <h3 className="text-sm font-bold text-purple-400 mb-1">{t.kvCache.benefit3Title}</h3>
              <p className="text-xs text-muted">{t.kvCache.benefit3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔬</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.kvCache.interactiveTitle}</h2>
            <p className="text-sm text-muted">{t.kvCache.interactiveSubtitle}</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">
          {t.kvCache.interactiveDesc}
        </p>
        <KVCacheVisualizer />
      </section>

      {/* Memory Implications */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.kvCache.memoryTitle}</h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">{t.kvCache.memoryDesc}</p>
          <div className="p-5 bg-background border border-border rounded-xl">
            <code className="text-primary-light text-sm block font-mono">
              KV Cache Memory = 2 × num_layers × seq_len × d_head × num_kv_heads × dtype_size
            </code>
            <p className="text-xs text-muted mt-3">{t.kvCache.memoryFormula}</p>
          </div>
        </div>
      </section>

      {/* Optimization Techniques */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.kvCache.optimizationsTitle}</h2>
        <div className="space-y-4">
          {/* MQA / GQA */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">{t.kvCache.mqaGqaTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{t.kvCache.mqaGqaDesc}</p>
          </div>
          {/* Sliding Window */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">{t.kvCache.slidingWindowTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{t.kvCache.slidingWindowDesc}</p>
          </div>
          {/* Paged Attention */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
            <h3 className="text-lg font-bold text-purple-400 mb-2">{t.kvCache.pagedAttentionTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{t.kvCache.pagedAttentionDesc}</p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.kvCache.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.kvCache.takeaway1,
              t.kvCache.takeaway2,
              t.kvCache.takeaway3,
              t.kvCache.takeaway4,
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
