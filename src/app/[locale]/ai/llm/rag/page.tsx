'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { RAGPipelineVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function RAGPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.rag.title}
      description={t.rag.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/' },
        { label: t.rag.title },
      ]}
      prevTopic={{ label: t.topicNames.embeddings, href: '/ai/llm/embeddings' }}
      nextTopic={{ label: t.topicNames['context-rot'], href: '/ai/llm/context-rot' }}
    >
      {/* What is RAG */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.rag.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.rag.whatIsDesc}
        </p>
      </section>

      {/* Why Use RAG */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.rag.whyRag}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.rag.whyRagDesc}
        </p>
      </section>

      {/* The RAG Pipeline */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.rag.pipeline}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.rag.pipelineDesc}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
              <span className="text-blue-400 font-bold">1</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.rag.step1}</h3>
            <p className="text-sm text-muted">{t.rag.step1Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
              <span className="text-purple-400 font-bold">2</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.rag.step2}</h3>
            <p className="text-sm text-muted">{t.rag.step2Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
              <span className="text-emerald-400 font-bold">3</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.rag.step3}</h3>
            <p className="text-sm text-muted">{t.rag.step3Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
              <span className="text-orange-400 font-bold">4</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.rag.step4}</h3>
            <p className="text-sm text-muted">{t.rag.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* Chunking and Vector DBs */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-surface/50 border border-border p-6">
          <h2 className="text-xl font-bold font-heading text-gradient mb-4">{t.rag.chunking}</h2>
          <p className="text-muted leading-relaxed">
            {t.rag.chunkingDesc}
          </p>
        </div>
        <div className="rounded-2xl bg-surface/50 border border-border p-6">
          <h2 className="text-xl font-bold font-heading text-gradient mb-4">{t.rag.vectorDbs}</h2>
          <p className="text-muted leading-relaxed">
            {t.rag.vectorDbsDesc}
          </p>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔍</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.rag.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.rag.demoDesc}</p>
          </div>
        </div>
        <RAGPipelineVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.rag.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.rag.takeaway1,
              t.rag.takeaway2,
              t.rag.takeaway3,
              t.rag.takeaway4,
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
