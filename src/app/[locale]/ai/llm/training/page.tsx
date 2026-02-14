'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { TrainingPipelineVisualizer } from '@/components/interactive'
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
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.llmTraining.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">
          {t.llmTraining.whatIsDesc}
        </p>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <p className="text-muted leading-relaxed text-sm">
            {t.llmTraining.whyMattersDesc}
          </p>
        </div>
      </section>

      {/* Interactive Pipeline Visualizer — Centerpiece */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.llmTraining.pipelineVisualizer}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.llmTraining.pipelineVisualizerDesc}
        </p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <TrainingPipelineVisualizer />
        </div>
      </section>

      {/* Pipeline Stages */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.llmTraining.detailedPipeline}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.llmTraining.detailedPipelineDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { n: 1, color: 'slate', title: t.llmTraining.stage1Title, desc: t.llmTraining.stage1Desc },
            { n: 2, color: 'blue', title: t.llmTraining.stage2Title, desc: t.llmTraining.stage2Desc },
            { n: 3, color: 'cyan', title: t.llmTraining.stage3Title, desc: t.llmTraining.stage3Desc },
            { n: 4, color: 'purple', title: t.llmTraining.stage4Title, desc: t.llmTraining.stage4Desc },
            { n: 5, color: 'emerald', title: t.llmTraining.stage5Title, desc: t.llmTraining.stage5Desc },
            { n: 6, color: 'orange', title: t.llmTraining.stage6Title, desc: t.llmTraining.stage6Desc },
            { n: 7, color: 'red', title: t.llmTraining.stage7Title, desc: t.llmTraining.stage7Desc },
            { n: 8, color: 'teal', title: t.llmTraining.stage8Title, desc: t.llmTraining.stage8Desc },
          ].map(({ n, color, title, desc }) => (
            <div key={n} className={`p-5 bg-gradient-to-br from-${color}-500/10 to-${color}-500/5 border border-${color}-500/20 rounded-xl`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`w-7 h-7 rounded-lg bg-${color}-500/20 flex items-center justify-center shrink-0`}>
                  <span className={`text-${color}-400 text-xs font-bold`}>{n}</span>
                </span>
                <h3 className={`text-base font-bold font-heading text-${color}-300`}>{title}</h3>
              </div>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Training Methods: DPO vs RLHF vs GRPO */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.llmTraining.dpoVsRlhf}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.llmTraining.dpoVsRlhfDesc}</p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-5">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-3">{t.llmTraining.rlhfDeep}</h3>
            <p className="text-sm text-muted mb-3">{t.llmTraining.rlhfDeepDesc}</p>
            <div className="space-y-2">
              {[t.llmTraining.rlhfStep1, t.llmTraining.rlhfStep2, t.llmTraining.rlhfStep3].map((step, i) => (
                <p key={i} className="text-xs text-muted/80"><span className="text-purple-400 font-medium">{i + 1}.</span> {step}</p>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-5">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-3">{t.llmTraining.dpoDeep}</h3>
            <p className="text-sm text-muted mb-3">{t.llmTraining.dpoDeepDesc}</p>
            <div className="space-y-2">
              {[t.llmTraining.dpoStep1, t.llmTraining.dpoStep2, t.llmTraining.dpoStep3].map((step, i) => (
                <p key={i} className="text-xs text-muted/80"><span className="text-cyan-400 font-medium">{i + 1}.</span> {step}</p>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 p-5">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-3">{t.llmTraining.grpo}</h3>
            <p className="text-sm text-muted mb-3">{t.llmTraining.grpoDesc}</p>
            <div className="space-y-2">
              {[t.llmTraining.grpoStep1, t.llmTraining.grpoStep2, t.llmTraining.grpoStep3].map((step, i) => (
                <p key={i} className="text-xs text-muted/80"><span className="text-orange-400 font-medium">{i + 1}.</span> {step}</p>
              ))}
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
                {[
                  [t.llmTraining.complexity, t.llmTraining.rlhfComplexity, t.llmTraining.dpoComplexity],
                  [t.llmTraining.rewardModel, t.llmTraining.rlhfRewardModel, t.llmTraining.dpoRewardModel],
                  [t.llmTraining.stability, t.llmTraining.rlhfStability, t.llmTraining.dpoStability],
                  [t.llmTraining.usedBy, t.llmTraining.rlhfUsedBy, t.llmTraining.dpoUsedBy],
                ].map(([label, rlhf, dpo], i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-4 font-medium text-text">{label}</td>
                    <td className="py-3 px-4">{rlhf}</td>
                    <td className="py-3 px-4">{dpo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
