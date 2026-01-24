'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function LLMTrainingPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.llmTraining.title}
      description={t.llmTraining.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.llmTraining.title },
      ]}
      prevTopic={{ label: t.topicNames['visual-challenges'], href: '/ai/llm/visual-challenges' }}
      nextTopic={{ label: t.topicNames['neural-networks'], href: '/ai/ml-fundamentals/neural-networks' }}
    >
      {/* What is LLM Training */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.llmTraining.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.llmTraining.whatIsDesc}
        </p>
      </section>

      {/* Why It Matters */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.llmTraining.whyMatters}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.llmTraining.whyMattersDesc}
        </p>
      </section>

      {/* LLM Training Pipeline */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.llmTraining.trainingPipeline}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.llmTraining.trainingPipelineDesc}
        </p>
        <div className="space-y-4">
          {/* Stage 1: Pretraining */}
          <div className="p-5 bg-gradient-to-br from-slate-500/10 to-gray-500/10 border border-slate-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-lg bg-slate-500/20 flex items-center justify-center shrink-0">
                <span className="text-slate-400 text-sm font-bold">1</span>
              </span>
              <h3 className="text-lg font-bold font-heading text-slate-300">{t.llmTraining.pretraining}</h3>
            </div>
            <p className="text-sm text-muted mb-3">{t.llmTraining.pretrainingDesc}</p>
            <div className="space-y-1 text-xs text-muted/80">
              <p><span className="text-slate-400 font-medium">→</span> {t.llmTraining.pretrainingGoal}</p>
              <p><span className="text-slate-400 font-medium">→</span> {t.llmTraining.pretrainingData}</p>
              <p><span className="text-slate-400 font-medium">→</span> {t.llmTraining.pretrainingResult}</p>
            </div>
          </div>

          {/* Stage 2: SFT */}
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <span className="text-blue-400 text-sm font-bold">2</span>
              </span>
              <h3 className="text-lg font-bold font-heading text-blue-300">{t.llmTraining.sft}</h3>
            </div>
            <p className="text-sm text-muted mb-3">{t.llmTraining.sftDesc}</p>
            <div className="space-y-1 text-xs text-muted/80">
              <p><span className="text-blue-400 font-medium">→</span> {t.llmTraining.sftGoal}</p>
              <p><span className="text-blue-400 font-medium">→</span> {t.llmTraining.sftData}</p>
              <p><span className="text-blue-400 font-medium">→</span> {t.llmTraining.sftResult}</p>
            </div>
          </div>

          {/* Stage 3: RLHF */}
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                <span className="text-purple-400 text-sm font-bold">3</span>
              </span>
              <h3 className="text-lg font-bold font-heading text-purple-300">{t.llmTraining.rlhfStage}</h3>
            </div>
            <p className="text-sm text-muted mb-3">{t.llmTraining.rlhfStageDesc}</p>
            <div className="space-y-1 text-xs text-muted/80">
              <p><span className="text-purple-400 font-medium">→</span> {t.llmTraining.rlhfGoal}</p>
              <p><span className="text-purple-400 font-medium">→</span> {t.llmTraining.rlhfData}</p>
              <p><span className="text-purple-400 font-medium">→</span> {t.llmTraining.rlhfResult}</p>
            </div>
          </div>

          {/* Stage 4: Continued Training */}
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="text-emerald-400 text-sm font-bold">4</span>
              </span>
              <h3 className="text-lg font-bold font-heading text-emerald-300">{t.llmTraining.continuedTraining}</h3>
            </div>
            <p className="text-sm text-muted">{t.llmTraining.continuedTrainingDesc}</p>
          </div>
        </div>
      </section>

      {/* RL Paradigm Section */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.llmTraining.rlParadigm}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.llmTraining.rlParadigmDesc}
        </p>

        <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-6 md:p-8 mb-6">
          <h3 className="text-xl font-bold font-heading text-orange-400 mb-3">{t.llmTraining.rlParadigmWhat}</h3>
          <p className="text-muted leading-relaxed">{t.llmTraining.rlParadigmWhatDesc}</p>
        </div>

        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 mb-6">
          <h3 className="text-xl font-bold font-heading text-gradient mb-4">{t.llmTraining.deepseekR1}</h3>
          <p className="text-muted leading-relaxed mb-6">{t.llmTraining.deepseekR1Desc}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-background rounded-xl border border-border">
              <h4 className="font-bold text-orange-400 mb-2">{t.llmTraining.rlKey1}</h4>
              <p className="text-sm text-muted">{t.llmTraining.rlKey1Desc}</p>
            </div>
            <div className="p-4 bg-background rounded-xl border border-border">
              <h4 className="font-bold text-emerald-400 mb-2">{t.llmTraining.rlKey2}</h4>
              <p className="text-sm text-muted">{t.llmTraining.rlKey2Desc}</p>
            </div>
            <div className="p-4 bg-background rounded-xl border border-border">
              <h4 className="font-bold text-cyan-400 mb-2">{t.llmTraining.rlKey3}</h4>
              <p className="text-sm text-muted">{t.llmTraining.rlKey3Desc}</p>
            </div>
            <div className="p-4 bg-background rounded-xl border border-border">
              <h4 className="font-bold text-amber-400 mb-2">{t.llmTraining.rlKey4}</h4>
              <p className="text-sm text-muted">{t.llmTraining.rlKey4Desc}</p>
            </div>
          </div>
        </div>

        {/* RL vs RLHF Comparison */}
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <h3 className="text-xl font-bold font-heading text-gradient mb-4">{t.llmTraining.rlVsRlhf}</h3>
          <p className="text-muted leading-relaxed mb-6">{t.llmTraining.rlVsRlhfDesc}</p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
              <h4 className="font-bold text-purple-400 mb-2">{t.llmTraining.rlhfApproach}</h4>
              <p className="text-sm text-muted">{t.llmTraining.rlhfApproachDesc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
              <h4 className="font-bold text-orange-400 mb-2">{t.llmTraining.rlApproach}</h4>
              <p className="text-sm text-muted">{t.llmTraining.rlApproachDesc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
              <h4 className="font-bold text-emerald-400 mb-2">{t.llmTraining.hybridApproach}</h4>
              <p className="text-sm text-muted">{t.llmTraining.hybridApproachDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Alignment Concepts */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.llmTraining.concepts}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.llmTraining.conceptsDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.llmTraining.outerAlignment}</h3>
            <p className="text-sm text-muted">{t.llmTraining.outerAlignmentDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.llmTraining.innerAlignment}</h3>
            <p className="text-sm text-muted">{t.llmTraining.innerAlignmentDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.llmTraining.specification}</h3>
            <p className="text-sm text-muted">{t.llmTraining.specificationDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.llmTraining.robustness}</h3>
            <p className="text-sm text-muted">{t.llmTraining.robustnessDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">{t.llmTraining.deception}</h3>
            <p className="text-sm text-muted">{t.llmTraining.deceptionDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">{t.llmTraining.goalMisgeneralization}</h3>
            <p className="text-sm text-muted">{t.llmTraining.goalMisgeneralizationDesc}</p>
          </div>
        </div>
      </section>

      {/* Alignment Techniques */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.llmTraining.techniques}</h2>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.llmTraining.rlhf}</h4>
            <p className="text-sm text-muted">{t.llmTraining.rlhfDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.llmTraining.constitutionalAi}</h4>
            <p className="text-sm text-muted">{t.llmTraining.constitutionalAiDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.llmTraining.dpo}</h4>
            <p className="text-sm text-muted">{t.llmTraining.dpoDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.llmTraining.redTeaming}</h4>
            <p className="text-sm text-muted">{t.llmTraining.redTeamingDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.llmTraining.interpretability}</h4>
            <p className="text-sm text-muted">{t.llmTraining.interpretabilityDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.llmTraining.safetyFilters}</h4>
            <p className="text-sm text-muted">{t.llmTraining.safetyFiltersDesc}</p>
          </div>
        </div>
      </section>

      {/* Fine-Tuning vs Alignment */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.llmTraining.fineTuningVsAlignment}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.llmTraining.fineTuningVsAlignmentDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-cyan-400 mb-2">{t.llmTraining.fineTuningDef}</h4>
            <p className="text-sm text-muted">{t.llmTraining.fineTuningDefDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-purple-400 mb-2">{t.llmTraining.alignmentDef}</h4>
            <p className="text-sm text-muted">{t.llmTraining.alignmentDefDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-emerald-400 mb-2">{t.llmTraining.postTrainingDef}</h4>
            <p className="text-sm text-muted">{t.llmTraining.postTrainingDefDesc}</p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.llmTraining.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.llmTraining.takeaway1,
              t.llmTraining.takeaway2,
              t.llmTraining.takeaway3,
              t.llmTraining.takeaway4,
              t.llmTraining.takeaway5,
              t.llmTraining.takeaway6,
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
