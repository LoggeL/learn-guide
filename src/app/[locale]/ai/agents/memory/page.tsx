'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { MemorySystemVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function MemoryPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="memory"
      title={t.memorySystems.title}
      description={t.memorySystems.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.memorySystems.title },
      ]}
      prevTopic={{ label: t.topicNames['programmatic-tools'], href: '/ai/agents/programmatic-tools' }}
      nextTopic={{ label: t.topicNames.orchestration, href: '/ai/agents/orchestration' }}
    >
      {/* What are Memory Systems */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.memorySystems.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.memorySystems.whatIsDesc}
        </p>
      </section>

      {/* Types of Memory */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.memorySystems.types}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.memorySystems.typesDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.memorySystems.shortTerm}</h3>
            <p className="text-sm text-muted">{t.memorySystems.shortTermDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.memorySystems.longTerm}</h3>
            <p className="text-sm text-muted">{t.memorySystems.longTermDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.memorySystems.episodic}</h3>
            <p className="text-sm text-muted">{t.memorySystems.episodicDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.memorySystems.semantic}</h3>
            <p className="text-sm text-muted">{t.memorySystems.semanticDesc}</p>
          </div>
        </div>
      </section>

      {/* Implementation Approaches */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.memorySystems.implementation}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.memorySystems.implementationDesc}
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.memorySystems.vectorStore}</h4>
            <p className="text-sm text-muted">{t.memorySystems.vectorStoreDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.memorySystems.summaries}</h4>
            <p className="text-sm text-muted">{t.memorySystems.summariesDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.memorySystems.keyValue}</h4>
            <p className="text-sm text-muted">{t.memorySystems.keyValueDesc}</p>
          </div>
        </div>
      </section>

      {/* Hybrid Memory (2025 Pattern) */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.memorySystems.hybridMemory}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.memorySystems.hybridMemoryDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-violet-400 mb-2">{t.memorySystems.memgptPattern}</h3>
            <p className="text-sm text-muted">{t.memorySystems.memgptPatternDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.memorySystems.tieredMemory}</h3>
            <p className="text-sm text-muted">{t.memorySystems.tieredMemoryDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.memorySystems.selfEditing}</h3>
            <p className="text-sm text-muted">{t.memorySystems.selfEditingDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">{t.memorySystems.dualEncoder}</h3>
            <p className="text-sm text-muted">{t.memorySystems.dualEncoderDesc}</p>
          </div>
        </div>
      </section>

      {/* Temporal Knowledge Graphs */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.memorySystems.temporalGraphs}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.memorySystems.temporalGraphsDesc}
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.memorySystems.entityRelations}</h4>
            <p className="text-sm text-muted">{t.memorySystems.entityRelationsDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.memorySystems.timeWeighted}</h4>
            <p className="text-sm text-muted">{t.memorySystems.timeWeightedDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.memorySystems.zepApproach}</h4>
            <p className="text-sm text-muted">{t.memorySystems.zepApproachDesc}</p>
          </div>
        </div>
      </section>

      {/* Memory Management */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.memorySystems.memoryManagement}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.memorySystems.memoryManagementDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-rose-400 mb-2">{t.memorySystems.deduplication}</h3>
            <p className="text-sm text-muted">{t.memorySystems.deduplicationDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.memorySystems.tokenBudgets}</h3>
            <p className="text-sm text-muted">{t.memorySystems.tokenBudgetsDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-slate-500/10 to-gray-500/10 border border-slate-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-slate-400 mb-2">{t.memorySystems.garbageCollection}</h3>
            <p className="text-sm text-muted">{t.memorySystems.garbageCollectionDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{t.memorySystems.priorityRules}</h3>
            <p className="text-sm text-muted">{t.memorySystems.priorityRulesDesc}</p>
          </div>
        </div>
      </section>

      {/* Adaptive Retention */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.memorySystems.adaptiveRetention}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.memorySystems.adaptiveRetentionDesc}
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.memorySystems.contextSummarization}</h4>
            <p className="text-sm text-muted">{t.memorySystems.contextSummarizationDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.memorySystems.entityExtraction}</h4>
            <p className="text-sm text-muted">{t.memorySystems.entityExtractionDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.memorySystems.decayStrategies}</h4>
            <p className="text-sm text-muted">{t.memorySystems.decayStrategiesDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🧠</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.memorySystems.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.memorySystems.demoDesc}</p>
          </div>
        </div>
        <MemorySystemVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.memorySystems.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.memorySystems.takeaway1,
              t.memorySystems.takeaway2,
              t.memorySystems.takeaway3,
              t.memorySystems.takeaway4,
              t.memorySystems.takeaway5,
              t.memorySystems.takeaway6,
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
