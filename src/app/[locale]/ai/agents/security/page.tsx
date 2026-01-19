'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function AgentSecurityPage() {
  const { t } = useTranslation()

  const threats = [
    { title: t.agentSecurity.threat1, desc: t.agentSecurity.threat1Desc, icon: '💉', color: 'red' },
    { title: t.agentSecurity.threat2, desc: t.agentSecurity.threat2Desc, icon: '⚠️', color: 'orange' },
    { title: t.agentSecurity.threat3, desc: t.agentSecurity.threat3Desc, icon: '📤', color: 'yellow' },
    { title: t.agentSecurity.threat4, desc: t.agentSecurity.threat4Desc, icon: '🔓', color: 'purple' },
  ]

  return (
    <TopicLayout
      title={t.agentSecurity.title}
      description={t.agentSecurity.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/' },
        { label: t.agentSecurity.title },
      ]}
      prevTopic={{ label: t.topicNames['agent-problems'], href: '/ai/agents/problems' }}
      nextTopic={{ label: t.topicNames['agentic-patterns'], href: '/ai/agents/patterns' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentSecurity.overview}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.agentSecurity.overviewDesc}
        </p>
      </section>

      {/* Threats */}
      <section>
        <div className="space-y-4">
          {threats.map((threat, i) => (
            <div
              key={i}
              className={`flex gap-5 p-5 rounded-xl bg-${threat.color}-500/5 border border-${threat.color}-500/20 hover:border-${threat.color}-500/40 transition-colors`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${threat.color}-500/20 flex items-center justify-center shrink-0`}>
                <span className="text-xl">{threat.icon}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{threat.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{threat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentSecurity.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.agentSecurity.takeaway1,
              t.agentSecurity.takeaway2,
              t.agentSecurity.takeaway3,
              t.agentSecurity.takeaway4,
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
