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

      {/* Patterns Overview */}
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

      {/* ReAct Deep Dive */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.agenticPatterns.reactDeepDive}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.agenticPatterns.reactDeepDiveDesc}</p>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text mb-3">{t.agenticPatterns.reactHow}</h3>
          <div className="space-y-2">
            <div className="flex gap-3 items-start p-3 bg-background rounded-lg border border-border">
              <span className="text-purple-400 font-mono text-sm">1.</span>
              <span className="text-muted text-sm">{t.agenticPatterns.reactStep1}</span>
            </div>
            <div className="flex gap-3 items-start p-3 bg-background rounded-lg border border-border">
              <span className="text-purple-400 font-mono text-sm">2.</span>
              <span className="text-muted text-sm">{t.agenticPatterns.reactStep2}</span>
            </div>
            <div className="flex gap-3 items-start p-3 bg-background rounded-lg border border-border">
              <span className="text-purple-400 font-mono text-sm">3.</span>
              <span className="text-muted text-sm">{t.agenticPatterns.reactStep3}</span>
            </div>
            <div className="flex gap-3 items-start p-3 bg-background rounded-lg border border-border">
              <span className="text-purple-400 font-mono text-sm">4.</span>
              <span className="text-muted text-sm">{t.agenticPatterns.reactStep4}</span>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <h4 className="font-semibold text-emerald-400 mb-2">{t.agenticPatterns.reactPros}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li>• {t.agenticPatterns.reactPro1}</li>
              <li>• {t.agenticPatterns.reactPro2}</li>
              <li>• {t.agenticPatterns.reactPro3}</li>
            </ul>
          </div>
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <h4 className="font-semibold text-red-400 mb-2">{t.agenticPatterns.reactCons}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li>• {t.agenticPatterns.reactCon1}</li>
              <li>• {t.agenticPatterns.reactCon2}</li>
              <li>• {t.agenticPatterns.reactCon3}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Plan-and-Execute Deep Dive */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.agenticPatterns.planExecuteDeepDive}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.agenticPatterns.planExecuteDeepDiveDesc}</p>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text mb-3">{t.agenticPatterns.planExecuteHow}</h3>
          <div className="space-y-2">
            <div className="flex gap-3 items-start p-3 bg-background rounded-lg border border-border">
              <span className="text-cyan-400 font-mono text-sm">1.</span>
              <span className="text-muted text-sm">{t.agenticPatterns.planStep1}</span>
            </div>
            <div className="flex gap-3 items-start p-3 bg-background rounded-lg border border-border">
              <span className="text-cyan-400 font-mono text-sm">2.</span>
              <span className="text-muted text-sm">{t.agenticPatterns.planStep2}</span>
            </div>
            <div className="flex gap-3 items-start p-3 bg-background rounded-lg border border-border">
              <span className="text-cyan-400 font-mono text-sm">3.</span>
              <span className="text-muted text-sm">{t.agenticPatterns.planStep3}</span>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <h4 className="font-semibold text-emerald-400 mb-2">{t.agenticPatterns.planExecutePros}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li>• {t.agenticPatterns.planExecutePro1}</li>
              <li>• {t.agenticPatterns.planExecutePro2}</li>
              <li>• {t.agenticPatterns.planExecutePro3}</li>
            </ul>
          </div>
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <h4 className="font-semibold text-red-400 mb-2">{t.agenticPatterns.planExecuteCons}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li>• {t.agenticPatterns.planExecuteCon1}</li>
              <li>• {t.agenticPatterns.planExecuteCon2}</li>
              <li>• {t.agenticPatterns.planExecuteCon3}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Choosing the Right Pattern */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.agenticPatterns.choosingTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.agenticPatterns.choosingDesc}</p>
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border gap-2">
            <span className="text-text">{t.agenticPatterns.choosingSimple}</span>
            <span className="text-purple-400 font-semibold">{t.agenticPatterns.choosingSimpleAnswer}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border gap-2">
            <span className="text-text">{t.agenticPatterns.choosingTransparency}</span>
            <span className="text-purple-400 font-semibold">{t.agenticPatterns.choosingTransparencyAnswer}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border gap-2">
            <span className="text-text">{t.agenticPatterns.choosingComplex}</span>
            <span className="text-cyan-400 font-semibold">{t.agenticPatterns.choosingComplexAnswer}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border gap-2">
            <span className="text-text">{t.agenticPatterns.choosingQuality}</span>
            <span className="text-orange-400 font-semibold">{t.agenticPatterns.choosingQualityAnswer}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border gap-2">
            <span className="text-text">{t.agenticPatterns.choosingDiverse}</span>
            <span className="text-emerald-400 font-semibold">{t.agenticPatterns.choosingDiverseAnswer}</span>
          </div>
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
            <h2 className="text-2xl font-bold font-heading text-text">{t.agenticPatterns.interactiveTitle}</h2>
            <p className="text-sm text-muted">{t.agenticPatterns.interactiveDesc}</p>
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
