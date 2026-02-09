'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { SpeculativeDecodingVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function SpeculativeDecodingPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="speculative-decoding"
      title={t.speculativeDecoding.title}
      description={t.speculativeDecoding.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.speculativeDecoding.title },
      ]}
      prevTopic={{ label: t.topicNames['distillation'], href: '/ai/llm/distillation' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.speculativeDecoding.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">
          {t.speculativeDecoding.whatIsDesc}
        </p>
        <p className="text-muted leading-relaxed">
          {t.speculativeDecoding.whatIsDesc2}
        </p>
      </section>

      {/* The Problem */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeDecoding.problem}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.speculativeDecoding.problemDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <h3 className="font-semibold text-red-400 mb-2">{t.speculativeDecoding.bottleneck}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.bottleneckDesc}</p>
          </div>
          <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">{t.speculativeDecoding.memoryBound}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.memoryBoundDesc}</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeDecoding.howItWorks}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.speculativeDecoding.howItWorksDesc}</p>
        <div className="space-y-3">
          <div className="flex gap-3 items-start p-4 bg-background rounded-xl border border-border">
            <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
              <span className="text-purple-400 font-bold">1</span>
            </span>
            <div>
              <h4 className="font-semibold text-text mb-1">{t.speculativeDecoding.step1Title}</h4>
              <p className="text-sm text-muted">{t.speculativeDecoding.step1Desc}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 bg-background rounded-xl border border-border">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold">2</span>
            </span>
            <div>
              <h4 className="font-semibold text-text mb-1">{t.speculativeDecoding.step2Title}</h4>
              <p className="text-sm text-muted">{t.speculativeDecoding.step2Desc}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 bg-background rounded-xl border border-border">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 font-bold">3</span>
            </span>
            <div>
              <h4 className="font-semibold text-text mb-1">{t.speculativeDecoding.step3Title}</h4>
              <p className="text-sm text-muted">{t.speculativeDecoding.step3Desc}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 bg-background rounded-xl border border-border">
            <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
              <span className="text-orange-400 font-bold">4</span>
            </span>
            <div>
              <h4 className="font-semibold text-text mb-1">{t.speculativeDecoding.step4Title}</h4>
              <p className="text-sm text-muted">{t.speculativeDecoding.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Example */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeDecoding.visualExample}</h2>
        <p className="text-muted leading-relaxed mb-4">{t.speculativeDecoding.visualExampleDesc}</p>
        <div className="p-4 bg-background rounded-xl border border-border font-mono text-sm space-y-4">
          <div>
            <div className="text-muted mb-2">{t.speculativeDecoding.examplePrompt}</div>
            <div className="text-text">"The quick brown fox"</div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="text-purple-400 mb-2">{t.speculativeDecoding.exampleDraft}</div>
            <div className="text-muted">{t.speculativeDecoding.exampleDraftTokens}</div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="text-cyan-400 mb-2">{t.speculativeDecoding.exampleVerify}</div>
            <div className="space-y-1">
              <div><span className="text-emerald-400">✓</span> <span className="text-muted">"jumps" - {t.speculativeDecoding.accepted}</span></div>
              <div><span className="text-emerald-400">✓</span> <span className="text-muted">"over" - {t.speculativeDecoding.accepted}</span></div>
              <div><span className="text-emerald-400">✓</span> <span className="text-muted">"the" - {t.speculativeDecoding.accepted}</span></div>
              <div><span className="text-red-400">✗</span> <span className="text-muted">"lazy" → "sleeping" - {t.speculativeDecoding.rejected}</span></div>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="text-emerald-400 mb-2">{t.speculativeDecoding.exampleResult}</div>
            <div className="text-text">"The quick brown fox jumps over the sleeping"</div>
            <div className="text-muted text-xs mt-2">{t.speculativeDecoding.exampleSavings}</div>
          </div>
        </div>
      </section>

      {/* Draft Model Requirements */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeDecoding.draftRequirements}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.speculativeDecoding.draftRequirementsDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
            <h3 className="font-semibold text-purple-400 mb-2">{t.speculativeDecoding.requirement1}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.requirement1Desc}</p>
          </div>
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <h3 className="font-semibold text-cyan-400 mb-2">{t.speculativeDecoding.requirement2}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.requirement2Desc}</p>
          </div>
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <h3 className="font-semibold text-emerald-400 mb-2">{t.speculativeDecoding.requirement3}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.requirement3Desc}</p>
          </div>
          <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">{t.speculativeDecoding.requirement4}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.requirement4Desc}</p>
          </div>
        </div>
      </section>

      {/* Speedup Factors */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeDecoding.speedupFactors}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.speculativeDecoding.speedupFactorsDesc}</p>
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border gap-2">
            <span className="text-text">{t.speculativeDecoding.factor1}</span>
            <span className="text-purple-400 font-semibold">{t.speculativeDecoding.factor1Impact}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border gap-2">
            <span className="text-text">{t.speculativeDecoding.factor2}</span>
            <span className="text-cyan-400 font-semibold">{t.speculativeDecoding.factor2Impact}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border gap-2">
            <span className="text-text">{t.speculativeDecoding.factor3}</span>
            <span className="text-emerald-400 font-semibold">{t.speculativeDecoding.factor3Impact}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border gap-2">
            <span className="text-text">{t.speculativeDecoding.factor4}</span>
            <span className="text-orange-400 font-semibold">{t.speculativeDecoding.factor4Impact}</span>
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeDecoding.variants}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.speculativeDecoding.variantsDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
            <h3 className="font-semibold text-purple-400 mb-2">{t.speculativeDecoding.variant1}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.variant1Desc}</p>
          </div>
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <h3 className="font-semibold text-cyan-400 mb-2">{t.speculativeDecoding.variant2}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.variant2Desc}</p>
          </div>
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <h3 className="font-semibold text-emerald-400 mb-2">{t.speculativeDecoding.variant3}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.variant3Desc}</p>
          </div>
          <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">{t.speculativeDecoding.variant4}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.variant4Desc}</p>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.speculativeDecoding.limitations}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.speculativeDecoding.limitationsDesc}</p>
        <div className="space-y-4">
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <h3 className="font-semibold text-red-400 mb-2">{t.speculativeDecoding.limit1}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.limit1Desc}</p>
          </div>
          <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">{t.speculativeDecoding.limit2}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.limit2Desc}</p>
          </div>
          <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
            <h3 className="font-semibold text-yellow-400 mb-2">{t.speculativeDecoding.limit3}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.limit3Desc}</p>
          </div>
          <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
            <h3 className="font-semibold text-purple-400 mb-2">{t.speculativeDecoding.limit4}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.limit4Desc}</p>
          </div>
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <h3 className="font-semibold text-cyan-400 mb-2">{t.speculativeDecoding.limit5}</h3>
            <p className="text-sm text-muted">{t.speculativeDecoding.limit5Desc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Visualization */}
      <section>
        <SpeculativeDecodingVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.speculativeDecoding.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.speculativeDecoding.takeaway1,
              t.speculativeDecoding.takeaway2,
              t.speculativeDecoding.takeaway3,
              t.speculativeDecoding.takeaway4,
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
