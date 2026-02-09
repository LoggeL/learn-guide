'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { WorkflowVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function OrchestrationPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="orchestration"
      title={t.orchestration.title}
      description={t.orchestration.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
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

      {/* 2025 Multi-Agent Patterns */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.orchestration.multiAgentPatterns}</h2>
        <p className="text-muted leading-relaxed mb-4">
          {t.orchestration.multiAgentPatternsDesc}
        </p>
        {/* Enterprise Adoption Note */}
        <div className="p-4 mb-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-lg">72%</span>
            <span className="text-muted">{t.orchestration.enterpriseAdoption}</span>
            <span className="text-xs text-muted ml-auto">— {t.orchestration.enterpriseAdoptionSource}</span>
          </div>
        </div>

        {/* Supervisor Pattern */}
        <div className="mb-6 p-5 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl">
          <h3 className="text-lg font-bold font-heading text-violet-400 mb-2">{t.orchestration.supervisorPattern}</h3>
          <p className="text-sm text-muted mb-3">{t.orchestration.supervisorPatternDesc}</p>
          <p className="text-xs text-violet-300/70">{t.orchestration.supervisorBenefits}</p>
        </div>

        {/* Orchestrator-Worker Pattern */}
        <div className="mb-6 p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
          <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.orchestration.orchestratorWorker}</h3>
          <p className="text-sm text-muted mb-3">{t.orchestration.orchestratorWorkerDesc}</p>
          <p className="text-xs text-blue-300/70">{t.orchestration.orchestratorWorkerBenefits}</p>
        </div>

        {/* Handoff Mechanisms */}
        <div className="mb-6 p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
          <h3 className="text-lg font-bold font-heading text-emerald-400 mb-3">{t.orchestration.handoffMechanisms}</h3>
          <p className="text-sm text-muted mb-4">{t.orchestration.handoffMechanismsDesc}</p>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <h4 className="font-bold text-text text-sm mb-1">{t.orchestration.handoffExplicit}</h4>
              <p className="text-xs text-muted">{t.orchestration.handoffExplicitDesc}</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <h4 className="font-bold text-text text-sm mb-1">{t.orchestration.handoffCondition}</h4>
              <p className="text-xs text-muted">{t.orchestration.handoffConditionDesc}</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <h4 className="font-bold text-text text-sm mb-1">{t.orchestration.handoffEscalation}</h4>
              <p className="text-xs text-muted">{t.orchestration.handoffEscalationDesc}</p>
            </div>
          </div>
        </div>

        {/* Group Chat Pattern */}
        <div className="mb-6 p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
          <h3 className="text-lg font-bold font-heading text-amber-400 mb-3">{t.orchestration.groupChatPattern}</h3>
          <p className="text-sm text-muted mb-4">{t.orchestration.groupChatPatternDesc}</p>
          <h4 className="font-bold text-text text-sm mb-2">{t.orchestration.groupChatRoles}</h4>
          <ul className="space-y-2 text-xs text-muted">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">*</span>
              <span>{t.orchestration.groupChatModerator}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">*</span>
              <span>{t.orchestration.groupChatExpert}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">*</span>
              <span>{t.orchestration.groupChatCritic}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">*</span>
              <span>{t.orchestration.groupChatExecutor}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Pattern Comparison Table */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.orchestration.patternComparison}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.orchestration.patternComparisonDesc}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text font-bold">Pattern</th>
                <th className="text-left py-3 px-4 text-text font-bold">{t.orchestration.comparisonComplexity}</th>
                <th className="text-left py-3 px-4 text-text font-bold">{t.orchestration.comparisonScalability}</th>
                <th className="text-left py-3 px-4 text-text font-bold">{t.orchestration.comparisonUseCase}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-violet-400 font-medium">{t.orchestration.supervisorPattern}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.supervisorComplexity}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.supervisorScalability}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.supervisorUseCase}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-blue-400 font-medium">{t.orchestration.orchestratorWorker}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.orchestratorComplexity}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.orchestratorScalability}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.orchestratorUseCase}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-emerald-400 font-medium">{t.orchestration.handoffMechanisms}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.handoffComplexity}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.handoffScalability}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.handoffUseCase}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-amber-400 font-medium">{t.orchestration.groupChatPattern}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.groupChatComplexity}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.groupChatScalability}</td>
                <td className="py-3 px-4 text-muted">{t.orchestration.groupChatUseCase}</td>
              </tr>
            </tbody>
          </table>
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
