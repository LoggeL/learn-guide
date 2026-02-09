'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { AlertTriangle, Repeat, Clock, Bug } from 'lucide-react'

export default function AgentProblemsPage() {
  const { t } = useTranslation()

  const problems = [
    { title: t.agentProblems.problem1, desc: t.agentProblems.problem1Desc, icon: '🔧', color: 'red' },
    { title: t.agentProblems.problem2, desc: t.agentProblems.problem2Desc, icon: '🔄', color: 'orange' },
    { title: t.agentProblems.problem3, desc: t.agentProblems.problem3Desc, icon: '🎯', color: 'yellow' },
    { title: t.agentProblems.problem4, desc: t.agentProblems.problem4Desc, icon: '💪', color: 'purple' },
  ]

  return (
    <TopicLayout topicId="agent-problems"
      title={t.agentProblems.title}
      description={t.agentProblems.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
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

      {/* Problems Grid */}
      <section>
        <div className="grid gap-4 md:grid-cols-2">
          {problems.map((problem, i) => (
            <div
              key={i}
              className={`flex flex-col gap-4 p-6 rounded-xl bg-${problem.color}-500/5 border border-${problem.color}-500/20 hover:border-${problem.color}-500/40 transition-colors h-full`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${problem.color}-500/20 flex items-center justify-center shrink-0`}>
                <span className="text-xl">{problem.icon}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-2">{problem.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{problem.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Dive: Hallucination */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Bug size={24} className="text-red-400" />
            <h3 className="text-xl font-bold text-text">{t.agentProblems.hallucination}</h3>
          </div>
          <p className="text-muted mb-4 leading-relaxed">
            {t.agentProblems.hallucinationDesc}
          </p>
          <div className="p-4 rounded-lg bg-background/50 border border-red-500/20 text-sm font-mono text-red-300">
            {t.agentProblems.hallucinationExample}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/5 to-yellow-500/5 border border-orange-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Repeat size={24} className="text-orange-400" />
            <h3 className="text-xl font-bold text-text">{t.agentProblems.loops}</h3>
          </div>
          <p className="text-muted mb-4 leading-relaxed">
            {t.agentProblems.loopsDesc}
          </p>
          <div className="p-4 rounded-lg bg-background/50 border border-orange-500/20 text-sm text-orange-300">
            {t.agentProblems.loopsMitigation}
          </div>
        </div>
      </section>

      {/* Deep Dive: Cost & Latency */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="p-6 md:p-8 bg-gradient-to-r from-surface to-surface-elevated">
          <div className="flex items-center gap-3 mb-6">
            <Clock size={24} className="text-purple-400" />
            <h2 className="text-2xl font-bold font-heading text-text">{t.agentProblems.costLatency}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-muted leading-relaxed mb-4">
                {t.agentProblems.costLatencyDesc}
              </p>
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-surface-elevated overflow-hidden flex">
                  <div className="w-[20%] bg-green-500/50" />
                  <div className="w-[80%] bg-purple-500/50" />
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>Chat (1 Call)</span>
                  <span>Agent Task (5+ Calls)</span>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <h4 className="font-semibold text-purple-300 mb-2">{t.agentProblems.costFactor}</h4>
              <p className="text-sm text-muted">
                {t.agentProblems.costFactorDesc}
              </p>
            </div>
          </div>
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
