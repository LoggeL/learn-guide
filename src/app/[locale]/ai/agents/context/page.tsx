'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function AgentContextPage() {
  const { t } = useTranslation()

  const components = [
    { title: t.agentContext.systemPrompt, desc: t.agentContext.systemPromptDesc, icon: '📋', color: 'purple' },
    { title: t.agentContext.toolDefs, desc: t.agentContext.toolDefsDesc, icon: '🔧', color: 'cyan' },
    { title: t.agentContext.history, desc: t.agentContext.historyDesc, icon: '💬', color: 'emerald' },
    { title: t.agentContext.retrieved, desc: t.agentContext.retrievedDesc, icon: '📚', color: 'orange' },
  ]

  return (
    <TopicLayout
      title={t.agentContext.title}
      description={t.agentContext.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/' },
        { label: t.agentContext.title },
      ]}
      prevTopic={{ label: t.topicNames['agent-loop'], href: '/ai/agents/loop' }}
      nextTopic={{ label: t.topicNames['agent-problems'], href: '/ai/agents/problems' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentContext.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.agentContext.whatIsDesc}
        </p>
      </section>

      {/* Components */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentContext.components}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {components.map((comp, i) => (
            <div key={i} className={`p-5 rounded-xl bg-${comp.color}-500/5 border border-${comp.color}-500/20`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{comp.icon}</span>
                <h3 className={`text-lg font-bold font-heading text-${comp.color}-400`}>{comp.title}</h3>
              </div>
              <p className="text-sm text-muted">{comp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentContext.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.agentContext.takeaway1,
              t.agentContext.takeaway2,
              t.agentContext.takeaway3,
              t.agentContext.takeaway4,
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
