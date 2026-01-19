'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { AgenticPatternsVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function AgenticPatternsPage() {
  const { t } = useTranslation()

  const patterns = [
    { title: t.agenticPatterns.pattern1, desc: t.agenticPatterns.pattern1Desc, icon: '🧠', color: 'purple' },
    { title: t.agenticPatterns.pattern2, desc: t.agenticPatterns.pattern2Desc, icon: '📋', color: 'cyan' },
    { title: t.agenticPatterns.pattern3, desc: t.agenticPatterns.pattern3Desc, icon: '👥', color: 'emerald' },
    { title: t.agenticPatterns.pattern4, desc: t.agenticPatterns.pattern4Desc, icon: '🔍', color: 'orange' },
  ]

  return (
    <TopicLayout
      title={t.agenticPatterns.title}
      description={t.agenticPatterns.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/' },
        { label: t.agenticPatterns.title },
      ]}
      prevTopic={{ label: t.topicNames['agent-security'], href: '/ai/agents/security' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agenticPatterns.overview}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.agenticPatterns.overviewDesc}
        </p>
      </section>

      {/* Patterns */}
      <section>
        <div className="grid md:grid-cols-2 gap-4">
          {patterns.map((pattern, i) => (
            <div key={i} className={`p-5 rounded-xl bg-${pattern.color}-500/5 border border-${pattern.color}-500/20`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{pattern.icon}</span>
                <h3 className={`text-lg font-bold font-heading text-${pattern.color}-400`}>{pattern.title}</h3>
              </div>
              <p className="text-sm text-muted">{pattern.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Visualization */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔄</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">Pattern Comparison</h2>
            <p className="text-sm text-muted">Explore different agentic architectures</p>
          </div>
        </div>
        <AgenticPatternsVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agenticPatterns.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.agenticPatterns.takeaway1,
              t.agenticPatterns.takeaway2,
              t.agenticPatterns.takeaway3,
              t.agenticPatterns.takeaway4,
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
