'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function AgentProblemsPage() {
  const { t } = useTranslation()

  const problems = [
    { title: t.agentProblems.problem1, desc: t.agentProblems.problem1Desc, icon: '🔧', color: 'red' },
    { title: t.agentProblems.problem2, desc: t.agentProblems.problem2Desc, icon: '🔄', color: 'orange' },
    { title: t.agentProblems.problem3, desc: t.agentProblems.problem3Desc, icon: '🎯', color: 'yellow' },
    { title: t.agentProblems.problem4, desc: t.agentProblems.problem4Desc, icon: '💪', color: 'purple' },
  ]

  return (
    <TopicLayout
      title={t.agentProblems.title}
      description={t.agentProblems.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/' },
        { label: t.agentProblems.title },
      ]}
      prevTopic={{ label: t.topicNames['agent-context'], href: '/ai/agents/context' }}
      nextTopic={{ label: t.topicNames['agent-security'], href: '/ai/agents/security' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentProblems.overview}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.agentProblems.overviewDesc}
        </p>
      </section>

      {/* Problems */}
      <section>
        <div className="space-y-4">
          {problems.map((problem, i) => (
            <div
              key={i}
              className={`flex gap-5 p-5 rounded-xl bg-${problem.color}-500/5 border border-${problem.color}-500/20 hover:border-${problem.color}-500/40 transition-colors`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${problem.color}-500/20 flex items-center justify-center shrink-0`}>
                <span className="text-xl">{problem.icon}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{problem.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{problem.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentProblems.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.agentProblems.takeaway1,
              t.agentProblems.takeaway2,
              t.agentProblems.takeaway3,
              t.agentProblems.takeaway4,
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
