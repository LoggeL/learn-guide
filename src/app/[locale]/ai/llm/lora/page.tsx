'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { ExternalLink } from 'lucide-react'
import { LoraVisualizer } from '@/components/interactive/LoraVisualizer'
import { LoraTrainingDynamicsDemo } from '@/components/interactive/LoraTrainingDynamicsDemo'
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
        <p className="text-muted mb-4">{t.lora.insightDesc}</p>
        <p className="text-muted mb-6">{t.lora.insightHypothesis}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LoraVisualizer section="matrix" />
        </div>
      </section>

      {/* 2b. Initialization and α/r scaling */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.initTitle}</h2>
        <p className="text-muted mb-4">{t.lora.initDesc}</p>
        <div className="mb-6 rounded-xl bg-surface border border-border p-4 text-center font-mono text-sm md:text-base text-text overflow-x-auto">
          h = W₀x + (α/r) · B(Ax)
        </div>
        <ul className="mb-6 space-y-3">
          {[
            { key: 'A', text: t.lora.initA, color: 'text-emerald-400' },
            { key: 'B', text: t.lora.initB, color: 'text-cyan-400' },
            { key: '∇A', text: t.lora.initGrad, color: 'text-orange-400' },
            { key: 'α/r', text: t.lora.initScale, color: 'text-purple-400' },
          ].map(item => (
            <li key={item.key} className="flex gap-4 rounded-xl border border-border bg-surface/50 p-4">
              <span className={`w-10 shrink-0 font-mono font-bold ${item.color}`}>{item.key}</span>
              <span className="text-sm leading-relaxed text-muted">{item.text}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LoraTrainingDynamicsDemo />
        </div>
      </section>

      {/* 3. Why LoRA is Easy to Train */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.whyEasyTitle}</h2>
        <p className="text-muted mb-6">{t.lora.whyEasyDesc}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LoraVisualizer section="memory" />
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

      {/* 3b. Serving: merge or swap */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.serveTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <h3 className="text-purple-400 font-semibold font-heading mb-2">{t.lora.serveMergeTitle}</h3>
            <p className="font-mono text-xs text-text mb-3">W = W₀ + (α/r)·BA</p>
            <p className="text-muted text-sm leading-relaxed">{t.lora.serveMergeDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <h3 className="text-cyan-400 font-semibold font-heading mb-2">{t.lora.serveSwapTitle}</h3>
            <p className="font-mono text-xs text-text mb-3">h = W₀x + (α/r)·B(Ax)</p>
            <p className="text-muted text-sm leading-relaxed">{t.lora.serveSwapDesc}</p>
          </div>
        </div>
      </section>

      {/* 4. Use Cases */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.lora.useCasesTitle}</h2>
        <p className="text-muted mb-6">{t.lora.useCasesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {useCases.map((uc) => (
            <div key={uc.title} className={`p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20`}>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3">
                <span className="text-xl">{uc.icon}</span>
              </div>
              <h3 className={`text-cyan-400 font-semibold font-heading mb-2`}>{uc.title}</h3>
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
            <div key={uc.title} className={`p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20`}>
              <div className={`w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3`}>
                <span className="text-xl">{uc.icon}</span>
              </div>
              <h3 className={`text-cyan-400 font-semibold font-heading mb-2`}>{uc.title}</h3>
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
          <LoraVisualizer section="rank-quality" />
        </div>
        <div className="mt-6 space-y-4">
          {[
            { num: 1, title: t.lora.whyNot1Title, desc: t.lora.whyNot1Desc, color: 'purple' },
            { num: 2, title: t.lora.whyNot2Title, desc: t.lora.whyNot2Desc, color: 'cyan' },
            { num: 3, title: t.lora.whyNot3Title, desc: t.lora.whyNot3Desc, color: 'emerald' },
          ].map((item) => (
            <div key={item.num} className={`flex gap-5 p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20`}>
              <div className={`w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0`}>
                <span className={`text-xl font-bold text-cyan-400`}>{item.num}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-xl border border-border bg-surface p-5 text-sm leading-relaxed text-muted">{t.lora.rankChoice}</p>
      </section>

      {/* 6. LoRA Variants */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <LoraVisualizer section="variants" />
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
      {/* 8. Sources */}
      <section>
        <h2 className="font-heading text-xl font-bold text-text">{t.lora.sourcesTitle}</h2>
        <ul className="mt-4 space-y-3">
          {t.lora.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-light hover:underline">
                {source.label}
                <ExternalLink size={14} className="shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
