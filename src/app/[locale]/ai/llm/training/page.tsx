'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function LLMTrainingPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="llm-training"
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

      {/* DPO vs RLHF Deep Dive */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.llmTraining.dpoVsRlhf}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.llmTraining.dpoVsRlhfDesc}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* RLHF Card */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6">
            <h3 className="text-xl font-bold font-heading text-purple-400 mb-4">{t.llmTraining.rlhfDeep}</h3>
            <p className="text-sm text-muted mb-4">{t.llmTraining.rlhfDeepDesc}</p>
            <div className="space-y-3">
              <div className="p-3 bg-background/50 rounded-lg border border-purple-500/10">
                <h4 className="font-medium text-purple-300 text-sm mb-1">{t.llmTraining.rlhfStep1}</h4>
                <p className="text-xs text-muted">{t.llmTraining.rlhfStep1Desc}</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-purple-500/10">
                <h4 className="font-medium text-purple-300 text-sm mb-1">{t.llmTraining.rlhfStep2}</h4>
                <p className="text-xs text-muted">{t.llmTraining.rlhfStep2Desc}</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-purple-500/10">
                <h4 className="font-medium text-purple-300 text-sm mb-1">{t.llmTraining.rlhfStep3}</h4>
                <p className="text-xs text-muted">{t.llmTraining.rlhfStep3Desc}</p>
              </div>
            </div>
          </div>

          {/* DPO Card */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-6">
            <h3 className="text-xl font-bold font-heading text-cyan-400 mb-4">{t.llmTraining.dpoDeep}</h3>
            <p className="text-sm text-muted mb-4">{t.llmTraining.dpoDeepDesc}</p>
            <div className="space-y-3">
              <div className="p-3 bg-background/50 rounded-lg border border-cyan-500/10">
                <h4 className="font-medium text-cyan-300 text-sm mb-1">{t.llmTraining.dpoStep1}</h4>
                <p className="text-xs text-muted">{t.llmTraining.dpoStep1Desc}</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-cyan-500/10">
                <h4 className="font-medium text-cyan-300 text-sm mb-1">{t.llmTraining.dpoStep2}</h4>
                <p className="text-xs text-muted">{t.llmTraining.dpoStep2Desc}</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-cyan-500/10">
                <h4 className="font-medium text-cyan-300 text-sm mb-1">{t.llmTraining.dpoStep3}</h4>
                <p className="text-xs text-muted">{t.llmTraining.dpoStep3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl bg-surface/50 border border-border p-6">
          <h3 className="text-lg font-bold font-heading text-gradient mb-4">{t.llmTraining.comparisonTable}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted font-medium">{t.llmTraining.aspect}</th>
                  <th className="text-left py-3 px-4 text-purple-400 font-medium">RLHF</th>
                  <th className="text-left py-3 px-4 text-cyan-400 font-medium">DPO</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-text">{t.llmTraining.complexity}</td>
                  <td className="py-3 px-4">{t.llmTraining.rlhfComplexity}</td>
                  <td className="py-3 px-4">{t.llmTraining.dpoComplexity}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-text">{t.llmTraining.rewardModel}</td>
                  <td className="py-3 px-4">{t.llmTraining.rlhfRewardModel}</td>
                  <td className="py-3 px-4">{t.llmTraining.dpoRewardModel}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-text">{t.llmTraining.stability}</td>
                  <td className="py-3 px-4">{t.llmTraining.rlhfStability}</td>
                  <td className="py-3 px-4">{t.llmTraining.dpoStability}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-text">{t.llmTraining.flexibility}</td>
                  <td className="py-3 px-4">{t.llmTraining.rlhfFlexibility}</td>
                  <td className="py-3 px-4">{t.llmTraining.dpoFlexibility}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-text">{t.llmTraining.usedBy}</td>
                  <td className="py-3 px-4">{t.llmTraining.rlhfUsedBy}</td>
                  <td className="py-3 px-4">{t.llmTraining.dpoUsedBy}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* GRPO Section */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.llmTraining.grpo}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.llmTraining.grpoDesc}</p>

        <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 p-6 md:p-8 mb-6">
          <h3 className="text-xl font-bold font-heading text-orange-400 mb-3">{t.llmTraining.grpoHow}</h3>
          <p className="text-muted leading-relaxed mb-6">{t.llmTraining.grpoHowDesc}</p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-background/50 rounded-xl border border-orange-500/10">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                <span className="text-orange-400 text-sm font-bold">1</span>
              </div>
              <h4 className="font-bold text-orange-300 mb-2">{t.llmTraining.grpoStep1}</h4>
              <p className="text-sm text-muted">{t.llmTraining.grpoStep1Desc}</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-orange-500/10">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                <span className="text-orange-400 text-sm font-bold">2</span>
              </div>
              <h4 className="font-bold text-orange-300 mb-2">{t.llmTraining.grpoStep2}</h4>
              <p className="text-sm text-muted">{t.llmTraining.grpoStep2Desc}</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-orange-500/10">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                <span className="text-orange-400 text-sm font-bold">3</span>
              </div>
              <h4 className="font-bold text-orange-300 mb-2">{t.llmTraining.grpoStep3}</h4>
              <p className="text-sm text-muted">{t.llmTraining.grpoStep3Desc}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.llmTraining.grpoAdvantages}</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">+</span>
                <span>{t.llmTraining.grpoAdv1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">+</span>
                <span>{t.llmTraining.grpoAdv2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">+</span>
                <span>{t.llmTraining.grpoAdv3}</span>
              </li>
            </ul>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">{t.llmTraining.grpoUseCases}</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">-</span>
                <span>{t.llmTraining.grpoUse1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">-</span>
                <span>{t.llmTraining.grpoUse2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">-</span>
                <span>{t.llmTraining.grpoUse3}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Synthetic Data Section */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.llmTraining.syntheticData}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.llmTraining.syntheticDataDesc}</p>

        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 mb-6">
          <h3 className="text-xl font-bold font-heading text-gradient mb-4">{t.llmTraining.syntheticHow}</h3>
          <p className="text-muted leading-relaxed mb-6">{t.llmTraining.syntheticHowDesc}</p>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl">
              <h4 className="font-bold text-violet-400 mb-2">{t.llmTraining.syntheticCAI}</h4>
              <p className="text-sm text-muted">{t.llmTraining.syntheticCAIDesc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
              <h4 className="font-bold text-blue-400 mb-2">{t.llmTraining.syntheticSelfInstruct}</h4>
              <p className="text-sm text-muted">{t.llmTraining.syntheticSelfInstructDesc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-xl">
              <h4 className="font-bold text-teal-400 mb-2">{t.llmTraining.syntheticDistillation}</h4>
              <p className="text-sm text-muted">{t.llmTraining.syntheticDistillationDesc}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-3">{t.llmTraining.syntheticBenefits}</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">+</span>
                <span>{t.llmTraining.syntheticBenefit1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">+</span>
                <span>{t.llmTraining.syntheticBenefit2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">+</span>
                <span>{t.llmTraining.syntheticBenefit3}</span>
              </li>
            </ul>
          </div>
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-3">{t.llmTraining.syntheticRisks}</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">!</span>
                <span>{t.llmTraining.syntheticRisk1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">!</span>
                <span>{t.llmTraining.syntheticRisk2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">!</span>
                <span>{t.llmTraining.syntheticRisk3}</span>
              </li>
            </ul>
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
