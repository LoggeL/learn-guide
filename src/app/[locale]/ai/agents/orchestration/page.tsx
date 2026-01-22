'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { WorkflowVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function OrchestrationPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.orchestration.title}
      description={t.orchestration.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/' },
        { label: t.orchestration.title },
      ]}
      prevTopic={{ label: t.topicNames.memory, href: '/ai/agents/memory' }}
      nextTopic={{ label: t.topicNames.evaluation, href: '/ai/agents/evaluation' }}
    >
      {/* What is Orchestration */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.orchestration.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.orchestration.whatIsDesc}
        </p>
      </section>

      {/* Orchestration Patterns */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.orchestration.patterns}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.orchestration.patternsDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.orchestration.sequential}</h3>
            <p className="text-sm text-muted">{t.orchestration.sequentialDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.orchestration.parallel}</h3>
            <p className="text-sm text-muted">{t.orchestration.parallelDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.orchestration.hierarchical}</h3>
            <p className="text-sm text-muted">{t.orchestration.hierarchicalDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.orchestration.dynamic}</h3>
            <p className="text-sm text-muted">{t.orchestration.dynamicDesc}</p>
          </div>
        </div>
      </section>

      {/* State Management */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.orchestration.stateManagement}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.orchestration.stateManagementDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.orchestration.checkpointing}</h4>
            <p className="text-sm text-muted">{t.orchestration.checkpointingDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.orchestration.rollback}</h4>
            <p className="text-sm text-muted">{t.orchestration.rollbackDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔀</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.orchestration.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.orchestration.demoDesc}</p>
          </div>
        </div>
        <WorkflowVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.orchestration.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.orchestration.takeaway1,
              t.orchestration.takeaway2,
              t.orchestration.takeaway3,
              t.orchestration.takeaway4,
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
