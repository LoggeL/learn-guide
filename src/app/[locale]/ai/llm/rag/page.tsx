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
        { label: t.categories.llm, href: '/ai/llm' },
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

      {/* Agentic RAG */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.rag.agenticRag}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">
          {t.rag.agenticRagDesc}
        </p>

        <h3 className="text-xl font-bold font-heading text-text mb-3">{t.rag.agenticHow}</h3>
        <p className="text-muted leading-relaxed mb-6">
          {t.rag.agenticHowDesc}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Advantages */}
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-emerald-400 mb-3">{t.rag.agenticAdvantages}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex gap-2 items-start">
                <span className="text-emerald-400 mt-0.5">+</span>
                <span>{t.rag.agenticAdv1}</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-emerald-400 mt-0.5">+</span>
                <span>{t.rag.agenticAdv2}</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-emerald-400 mt-0.5">+</span>
                <span>{t.rag.agenticAdv3}</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-emerald-400 mt-0.5">+</span>
                <span>{t.rag.agenticAdv4}</span>
              </li>
            </ul>
          </div>

          {/* Disadvantages */}
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-red-400 mb-3">{t.rag.agenticDisadvantages}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex gap-2 items-start">
                <span className="text-red-400 mt-0.5">-</span>
                <span>{t.rag.agenticDisadv1}</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-red-400 mt-0.5">-</span>
                <span>{t.rag.agenticDisadv2}</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-red-400 mt-0.5">-</span>
                <span>{t.rag.agenticDisadv3}</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-red-400 mt-0.5">-</span>
                <span>{t.rag.agenticDisadv4}</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-muted italic">
          {t.rag.whenToUseDesc}
        </p>
      </section>

      {/* Multi-Tool Retrieval */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.rag.multiTool}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.rag.multiToolDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.rag.toolSemantic}</h3>
            <p className="text-sm text-muted">{t.rag.toolSemanticDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.rag.toolFulltext}</h3>
            <p className="text-sm text-muted">{t.rag.toolFulltextDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">{t.rag.toolSql}</h3>
            <p className="text-sm text-muted">{t.rag.toolSqlDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-rose-400 mb-2">{t.rag.toolKg}</h3>
            <p className="text-sm text-muted">{t.rag.toolKgDesc}</p>
          </div>
        </div>
      </section>

      {/* Advanced Techniques Section Header */}
      <section className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.rag.advancedTechniques}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.rag.advancedTechniquesDesc}
        </p>
      </section>

      {/* Self-RAG */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.rag.selfRag}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">
          {t.rag.selfRagDesc}
        </p>

        <h3 className="text-xl font-bold font-heading text-text mb-3">{t.rag.selfRagHow}</h3>
        <p className="text-muted leading-relaxed mb-6">
          {t.rag.selfRagHowDesc}
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.rag.selfRagRetrieve}</h4>
            <p className="text-sm text-muted">{t.rag.selfRagRetrieveDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-violet-400 mb-2">{t.rag.selfRagCritique}</h4>
            <p className="text-sm text-muted">{t.rag.selfRagCritiqueDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.rag.selfRagGenerate}</h4>
            <p className="text-sm text-muted">{t.rag.selfRagGenerateDesc}</p>
          </div>
        </div>
      </section>

      {/* GraphRAG */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.rag.graphRag}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">
          {t.rag.graphRagDesc}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-indigo-400 mb-3">{t.rag.graphRagVector}</h4>
            <p className="text-sm text-muted">{t.rag.graphRagVectorDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-pink-400 mb-3">{t.rag.graphRagGraph}</h4>
            <p className="text-sm text-muted">{t.rag.graphRagGraphDesc}</p>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
          <h4 className="text-lg font-bold font-heading text-amber-400 mb-2">{t.rag.graphRagBenefits}</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-2 items-start">
              <span className="text-amber-400 mt-0.5">+</span>
              <span>{t.rag.graphRagBenefit1}</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-amber-400 mt-0.5">+</span>
              <span>{t.rag.graphRagBenefit2}</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-amber-400 mt-0.5">+</span>
              <span>{t.rag.graphRagBenefit3}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Query Augmentation */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.rag.queryAugmentation}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">
          {t.rag.queryAugmentationDesc}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-teal-400 mb-2">{t.rag.queryHyde}</h4>
            <p className="text-sm text-muted mb-3">{t.rag.queryHydeDesc}</p>
            <div className="text-xs text-muted/70 bg-background/50 p-3 rounded-lg font-mono">
              {t.rag.queryHydeExample}
            </div>
          </div>
          <div className="p-5 bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-fuchsia-400 mb-2">{t.rag.queryDecomposition}</h4>
            <p className="text-sm text-muted mb-3">{t.rag.queryDecompositionDesc}</p>
            <div className="text-xs text-muted/70 bg-background/50 p-3 rounded-lg font-mono">
              {t.rag.queryDecompositionExample}
            </div>
          </div>
          <div className="p-5 bg-gradient-to-br from-lime-500/10 to-green-500/10 border border-lime-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-lime-400 mb-2">{t.rag.queryExpansion}</h4>
            <p className="text-sm text-muted">{t.rag.queryExpansionDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-sky-400 mb-2">{t.rag.queryRewrite}</h4>
            <p className="text-sm text-muted">{t.rag.queryRewriteDesc}</p>
          </div>
        </div>
      </section>

      {/* RAG Evaluation */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.rag.evaluation}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">
          {t.rag.evaluationDesc}
        </p>

        <h3 className="text-xl font-bold font-heading text-text mb-4">{t.rag.ragasFramework}</h3>
        <p className="text-muted leading-relaxed mb-6">
          {t.rag.ragasFrameworkDesc}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-green-400 mb-2">{t.rag.metricFaithfulness}</h4>
            <p className="text-sm text-muted">{t.rag.metricFaithfulnessDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.rag.metricRelevance}</h4>
            <p className="text-sm text-muted">{t.rag.metricRelevanceDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.rag.metricContextRecall}</h4>
            <p className="text-sm text-muted">{t.rag.metricContextRecallDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl">
            <h4 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.rag.metricContextPrecision}</h4>
            <p className="text-sm text-muted">{t.rag.metricContextPrecisionDesc}</p>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-slate-500/10 to-gray-500/10 border border-slate-500/20 rounded-xl">
          <h4 className="text-lg font-bold font-heading text-slate-300 mb-2">{t.rag.evaluationTips}</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-2 items-start">
              <span className="text-slate-400 mt-0.5">1.</span>
              <span>{t.rag.evaluationTip1}</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-slate-400 mt-0.5">2.</span>
              <span>{t.rag.evaluationTip2}</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-slate-400 mt-0.5">3.</span>
              <span>{t.rag.evaluationTip3}</span>
            </li>
          </ul>
        </div>
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
              t.rag.takeaway5,
              t.rag.takeaway6,
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
