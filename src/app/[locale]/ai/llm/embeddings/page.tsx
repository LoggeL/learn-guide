'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { EmbeddingVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function EmbeddingsPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="embeddings"
      title={t.embeddings.title}
      description={t.embeddings.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.embeddings.title },
      ]}
      prevTopic={{ label: t.topicNames.tokenization, href: '/ai/llm/tokenization' }}
      nextTopic={{ label: t.topicNames.rag, href: '/ai/llm/rag' }}
    >
      {/* What are Embeddings */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.embeddings.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.embeddings.whatIsDesc}
        </p>
      </section>

      {/* How Embeddings Work */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.embeddings.howWorks}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.embeddings.howWorksDesc}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.embeddings.similarity}</h3>
            <p className="text-sm text-muted">{t.embeddings.similarityDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.embeddings.dimensions}</h3>
            <p className="text-sm text-muted">{t.embeddings.dimensionsDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.embeddings.operations}</h3>
            <p className="text-sm text-muted">{t.embeddings.operationsDesc}</p>
          </div>
        </div>
      </section>

      {/* How Embeddings Are Created */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.embeddings.howCreated}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.embeddings.howCreatedDesc}
        </p>

        {/* Embedding Layer Diagram */}
        <div className="mb-6 p-6 rounded-xl bg-background border border-border">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <div className="text-2xl mb-1">Token</div>
              <div className="text-xs text-muted font-mono">&quot;cat&quot; → ID: 2368</div>
            </div>
            <div className="text-2xl text-muted">→</div>
            <div className="p-4 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
              <div className="text-lg mb-1">{t.embeddings.embeddingLayer}</div>
              <div className="text-xs text-muted font-mono">matrix[2368]</div>
            </div>
            <div className="text-2xl text-muted">→</div>
            <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <div className="text-2xl mb-1">Vector</div>
              <div className="text-xs text-muted font-mono">[0.23, -0.87, 0.41, ...]</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.embeddings.embeddingLayer}</h3>
            <p className="text-sm text-muted">{t.embeddings.embeddingLayerDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.embeddings.training}</h3>
            <p className="text-sm text-muted">{t.embeddings.trainingDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.embeddings.inLLM}</h3>
            <p className="text-sm text-muted">{t.embeddings.inLLMDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.embeddings.dedicated}</h3>
            <p className="text-sm text-muted">{t.embeddings.dedicatedDesc}</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <h4 className="font-semibold text-text mb-2">{t.embeddings.embeddingSize}</h4>
          <p className="text-sm text-muted">{t.embeddings.embeddingSizeDesc}</p>
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.embeddings.useCases}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.embeddings.search}</h3>
            <p className="text-sm text-muted">{t.embeddings.searchDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-green-400 mb-2">{t.embeddings.clustering}</h3>
            <p className="text-sm text-muted">{t.embeddings.clusteringDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{t.embeddings.classification}</h3>
            <p className="text-sm text-muted">{t.embeddings.classificationDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-pink-400 mb-2">{t.embeddings.rag}</h3>
            <p className="text-sm text-muted">{t.embeddings.ragDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.embeddings.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.embeddings.demoDesc}</p>
          </div>
        </div>
        <EmbeddingVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.embeddings.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.embeddings.takeaway1,
              t.embeddings.takeaway2,
              t.embeddings.takeaway3,
              t.embeddings.takeaway4,
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
