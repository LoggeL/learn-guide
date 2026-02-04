'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function SpeculativeCodingPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.speculativeCoding.title}
      description={t.speculativeCoding.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.speculativeCoding.title },
      ]}
      prevTopic={{ label: t.topicNames['orchestration'], href: '/ai/agents/orchestration' }}
      nextTopic={{ label: t.topicNames['agent-problems'], href: '/ai/agents/problems' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.speculativeCoding.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">
          {t.speculativeCoding.whatIsDesc}
        </p>
        <p className="text-muted leading-relaxed">
          {t.speculativeCoding.whatIsDesc2}
        </p>
      </section>

      {/* CPU Inspiration */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeCoding.cpuInspiration}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.speculativeCoding.cpuInspirationDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
            <h3 className="font-semibold text-purple-400 mb-2">{t.speculativeCoding.cpuApproach}</h3>
            <p className="text-sm text-muted">{t.speculativeCoding.cpuApproachDesc}</p>
          </div>
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <h3 className="font-semibold text-cyan-400 mb-2">{t.speculativeCoding.agentApproach}</h3>
            <p className="text-sm text-muted">{t.speculativeCoding.agentApproachDesc}</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeCoding.howItWorks}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.speculativeCoding.howItWorksDesc}</p>
        <div className="space-y-3">
          <div className="flex gap-3 items-start p-4 bg-background rounded-xl border border-border">
            <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
              <span className="text-purple-400 font-bold">1</span>
            </span>
            <div>
              <h4 className="font-semibold text-text mb-1">{t.speculativeCoding.step1Title}</h4>
              <p className="text-sm text-muted">{t.speculativeCoding.step1Desc}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 bg-background rounded-xl border border-border">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">2</span>
            </span>
            <div>
              <h4 className="font-semibold text-text mb-1">{t.speculativeCoding.step2Title}</h4>
              <p className="text-sm text-muted">{t.speculativeCoding.step2Desc}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 bg-background rounded-xl border border-border">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 font-bold">3</span>
            </span>
            <div>
              <h4 className="font-semibold text-text mb-1">{t.speculativeCoding.step3Title}</h4>
              <p className="text-sm text-muted">{t.speculativeCoding.step3Desc}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 bg-background rounded-xl border border-border">
            <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
              <span className="text-orange-400 font-bold">4</span>
            </span>
            <div>
              <h4 className="font-semibold text-text mb-1">{t.speculativeCoding.step4Title}</h4>
              <p className="text-sm text-muted">{t.speculativeCoding.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeCoding.useCases}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.speculativeCoding.useCasesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <h3 className="font-semibold text-emerald-400 mb-2">{t.speculativeCoding.useCase1}</h3>
            <p className="text-sm text-muted">{t.speculativeCoding.useCase1Desc}</p>
          </div>
          <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">{t.speculativeCoding.useCase2}</h3>
            <p className="text-sm text-muted">{t.speculativeCoding.useCase2Desc}</p>
          </div>
          <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
            <h3 className="font-semibold text-purple-400 mb-2">{t.speculativeCoding.useCase3}</h3>
            <p className="text-sm text-muted">{t.speculativeCoding.useCase3Desc}</p>
          </div>
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <h3 className="font-semibold text-cyan-400 mb-2">{t.speculativeCoding.useCase4}</h3>
            <p className="text-sm text-muted">{t.speculativeCoding.useCase4Desc}</p>
          </div>
        </div>
      </section>

      {/* Pros and Cons */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeCoding.tradeoffs}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <h4 className="font-semibold text-emerald-400 mb-2">{t.speculativeCoding.benefits}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li>• {t.speculativeCoding.benefit1}</li>
              <li>• {t.speculativeCoding.benefit2}</li>
              <li>• {t.speculativeCoding.benefit3}</li>
              <li>• {t.speculativeCoding.benefit4}</li>
            </ul>
          </div>
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <h4 className="font-semibold text-red-400 mb-2">{t.speculativeCoding.challenges}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li>• {t.speculativeCoding.challenge1}</li>
              <li>• {t.speculativeCoding.challenge2}</li>
              <li>• {t.speculativeCoding.challenge3}</li>
              <li>• {t.speculativeCoding.challenge4}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Real World Example */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeCoding.realWorld}</h2>
        <p className="text-muted leading-relaxed mb-4">{t.speculativeCoding.realWorldDesc}</p>
        <div className="p-4 bg-background rounded-xl border border-border font-mono text-sm">
          <div className="text-muted mb-2">{t.speculativeCoding.exampleComment}</div>
          <div className="space-y-1">
            <div><span className="text-purple-400">Task:</span> <span className="text-text">{t.speculativeCoding.exampleTask}</span></div>
            <div className="mt-3"><span className="text-cyan-400">{t.speculativeCoding.exampleBranch1}</span></div>
            <div className="pl-4 text-muted">{t.speculativeCoding.exampleBranch1Desc}</div>
            <div className="mt-2"><span className="text-emerald-400">{t.speculativeCoding.exampleBranch2}</span></div>
            <div className="pl-4 text-muted">{t.speculativeCoding.exampleBranch2Desc}</div>
            <div className="mt-2"><span className="text-orange-400">{t.speculativeCoding.exampleBranch3}</span></div>
            <div className="pl-4 text-muted">{t.speculativeCoding.exampleBranch3Desc}</div>
            <div className="mt-3 text-emerald-400">{t.speculativeCoding.exampleResult}</div>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.speculativeCoding.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.speculativeCoding.takeaway1,
              t.speculativeCoding.takeaway2,
              t.speculativeCoding.takeaway3,
              t.speculativeCoding.takeaway4,
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
