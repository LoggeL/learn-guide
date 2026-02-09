'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { LoraVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function LoraPage() {
  const { t } = useTranslation()

  const useCases = [
    { icon: '💻', title: t.lora.useCase1Title, desc: t.lora.useCase1Desc, color: 'cyan' },
    { icon: '🎭', title: t.lora.useCase2Title, desc: t.lora.useCase2Desc, color: 'purple' },
    { icon: '🌍', title: t.lora.useCase3Title, desc: t.lora.useCase3Desc, color: 'emerald' },
    { icon: '📋', title: t.lora.useCase4Title, desc: t.lora.useCase4Desc, color: 'orange' },
  ]

  return (
    <TopicLayout topicId="lora"
      title={t.lora.title}
      description={t.lora.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.lora.title },
      ]}
      prevTopic={{ label: t.topicNames['distillation'], href: '/ai/llm/distillation' }}
      nextTopic={{ label: t.topicNames['speculative-decoding'], href: '/ai/llm/speculative-decoding' }}
    >
      {/* 1. What is Fine-Tuning? */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">{t.lora.whatIsDesc}</p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-red-500/10 border border-purple-500/20">
            <p className="text-lg text-text italic font-heading">{t.lora.problem}</p>
            <p className="text-sm text-muted mt-2">{t.lora.problemDesc}</p>
          </div>
        </div>
      </section>

      {/* 2. The LoRA Insight — Core Visualization */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.insightTitle}</h2>
        <p className="text-muted mb-6">{t.lora.insightDesc}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LoraVisualizer section="matrix" t={t.lora as unknown as Record<string, string>} />
        </div>
      </section>

      {/* 3. Why LoRA is Easy to Train */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.whyEasyTitle}</h2>
        <p className="text-muted mb-6">{t.lora.whyEasyDesc}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LoraVisualizer section="memory" t={t.lora as unknown as Record<string, string>} />
        </div>
        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-2 border-emerald-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl">🧊</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-3">{t.lora.frozenTitle}</h3>
              <p className="text-text leading-relaxed">{t.lora.frozenDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Use Cases */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.useCasesTitle}</h2>
        <p className="text-muted mb-6">{t.lora.useCasesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {useCases.map((uc) => (
            <div key={uc.title} className={`p-5 rounded-xl bg-${uc.color}-500/5 border border-${uc.color}-500/20`}>
              <div className="w-10 h-10 rounded-lg bg-${uc.color}-500/20 flex items-center justify-center mb-3">
                <span className="text-xl">{uc.icon}</span>
              </div>
              <h3 className={`text-${uc.color}-400 font-semibold font-heading mb-2`}>{uc.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Anti Use Cases */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.antiUseCasesTitle}</h2>
        <p className="text-muted mb-6">{t.lora.antiUseCasesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '💬', title: t.lora.antiUseCase1Title, desc: t.lora.antiUseCase1Desc, color: 'red' },
            { icon: '📚', title: t.lora.antiUseCase2Title, desc: t.lora.antiUseCase2Desc, color: 'orange' },
            { icon: '🗑️', title: t.lora.antiUseCase3Title, desc: t.lora.antiUseCase3Desc, color: 'amber' },
            { icon: '⏱️', title: t.lora.antiUseCase4Title, desc: t.lora.antiUseCase4Desc, color: 'rose' },
          ].map((uc) => (
            <div key={uc.title} className={`p-5 rounded-xl bg-${uc.color}-500/5 border border-${uc.color}-500/20`}>
              <div className={`w-10 h-10 rounded-lg bg-${uc.color}-500/20 flex items-center justify-center mb-3`}>
                <span className="text-xl">{uc.icon}</span>
              </div>
              <h3 className={`text-${uc.color}-400 font-semibold font-heading mb-2`}>{uc.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why Not Used for Pre-Training */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.whyNotTitle}</h2>
        <p className="text-muted mb-6">{t.lora.whyNotDesc}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LoraVisualizer section="rank-quality" t={t.lora as unknown as Record<string, string>} />
        </div>
        <div className="mt-6 space-y-4">
          {[
            { num: 1, title: t.lora.whyNot1Title, desc: t.lora.whyNot1Desc, color: 'purple' },
            { num: 2, title: t.lora.whyNot2Title, desc: t.lora.whyNot2Desc, color: 'cyan' },
            { num: 3, title: t.lora.whyNot3Title, desc: t.lora.whyNot3Desc, color: 'emerald' },
          ].map((item) => (
            <div key={item.num} className={`flex gap-5 p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center shrink-0`}>
                <span className={`text-xl font-bold text-${item.color}-400`}>{item.num}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LoRA Variants */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <LoraVisualizer section="variants" t={t.lora as unknown as Record<string, string>} />
      </section>

      {/* 7. Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.lora.takeaway1,
              t.lora.takeaway2,
              t.lora.takeaway3,
              t.lora.takeaway4,
              t.lora.takeaway5,
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
