'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { TrainingPipelineVisualizer } from '@/components/interactive/TrainingPipelineVisualizer'
import { PretrainingLossDemo } from '@/components/interactive/PretrainingLossDemo'
import { GrpoAdvantageDemo } from '@/components/interactive/GrpoAdvantageDemo'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  ['Hoffmann et al. (2022): Training Compute-Optimal Large Language Models (Chinchilla)', 'https://arxiv.org/abs/2203.15556'],
  ['Llama Team (2024): The Llama 3 Herd of Models', 'https://arxiv.org/abs/2407.21783'],
  ['Qwen Team (2025): Qwen3 Technical Report', 'https://arxiv.org/abs/2505.09388'],
  ['OLMo Team (2025): 2 OLMo 2 Furious', 'https://arxiv.org/abs/2501.00656'],
  ['Ouyang et al. (2022): Training language models to follow instructions with human feedback (InstructGPT)', 'https://arxiv.org/abs/2203.02155'],
  ['Rafailov et al. (2023): Direct Preference Optimization', 'https://arxiv.org/abs/2305.18290'],
  ['Shao et al. (2024): DeepSeekMath (GRPO)', 'https://arxiv.org/abs/2402.03300'],
  ['Lambert et al. (2024): Tülu 3 (RLVR)', 'https://arxiv.org/abs/2411.15124'],
  ['DeepSeek-AI (2025): DeepSeek-R1', 'https://arxiv.org/abs/2501.12948'],
  ['Gekhman et al. (2024): Does Fine-Tuning LLMs on New Knowledge Encourage Hallucinations?', 'https://arxiv.org/abs/2405.05904'],
  ['Yue et al. (2025): Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?', 'https://arxiv.org/abs/2504.13837'],
] as const

export default function LLMTrainingPage() {
  const { t, locale } = useTranslation()
  const tr = t.llmTraining
  const href = (path: string) => `/${locale}${path}`

  const methods = [
    { title: tr.ppoTitle, body: tr.ppoBody, steps: tr.ppoSteps, box: 'from-purple-500/10 to-pink-500/10 border-purple-500/20', text: 'text-purple-400' },
    { title: tr.dpoTitle, body: tr.dpoBody, steps: tr.dpoSteps, box: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20', text: 'text-cyan-400' },
    { title: tr.grpoTitle, body: tr.grpoBody, steps: tr.grpoSteps, box: 'from-orange-500/10 to-amber-500/10 border-orange-500/20', text: 'text-orange-400' },
  ]

  const tableRows = [
    [tr.table.signal, tr.table.signalPpo, tr.table.signalDpo, tr.table.signalGrpo],
    [tr.table.isRl, tr.table.isRlPpo, tr.table.isRlDpo, tr.table.isRlGrpo],
    [tr.table.critic, tr.table.criticPpo, tr.table.criticDpo, tr.table.criticGrpo],
    [tr.table.reward, tr.table.rewardPpo, tr.table.rewardDpo, tr.table.rewardGrpo],
    [tr.table.cost, tr.table.costPpo, tr.table.costDpo, tr.table.costGrpo],
  ]

  return (
    <TopicLayout
      topicId="llm-training"
      title={tr.title}
      description={tr.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: tr.title },
      ]}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{tr.overviewTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{tr.overviewBody}</p>
        <div className="mt-6 flex flex-col gap-2 text-sm text-muted">
          <p>
            {tr.overviewBasics}{' '}
            <Link href={href('/ai/ml-fundamentals/training')} className="text-cyan-300 underline">
              {t.topicNames['training']}
            </Link>
          </p>
          <p>
            {tr.overviewData}{' '}
            <Link href={href('/ai/llm/training-data')} className="text-cyan-300 underline">
              {t.topicNames['training-data']}
            </Link>
          </p>
        </div>
      </section>

      {/* Pipeline */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{tr.pipelineTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{tr.pipelineDesc}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <TrainingPipelineVisualizer />
        </div>
      </section>

      {/* Pretraining loss */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{tr.lossTitle}</h2>
        <p className="text-muted leading-relaxed">{tr.lossIntro}</p>
        <div className="my-5 overflow-x-auto rounded-xl border border-primary/20 bg-background/60 px-4 py-3 text-center font-mono text-base text-text">
          {tr.lossFormula}
        </div>
        <p className="text-muted leading-relaxed mb-8">{tr.lossExplain}</p>
        <h3 className="text-lg font-bold font-heading text-text mb-1">{tr.lossDemoTitle}</h3>
        <p className="text-sm text-muted mb-4">{tr.lossDemoDesc}</p>
        <PretrainingLossDemo />
        <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20">
          <h3 className="text-lg font-bold font-heading text-blue-300 mb-2">{tr.scaleTitle}</h3>
          <p className="text-sm text-muted leading-relaxed">{tr.scaleBody}</p>
        </div>
      </section>

      {/* Mid-training */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{tr.midTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{tr.midIntro}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-500/20">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{tr.annealTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{tr.annealBody}</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{tr.longTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{tr.longBody}</p>
            <p className="mt-3 text-sm text-muted">
              {tr.longLink}{' '}
              <Link href={href('/ai/llm/positional-encoding')} className="text-cyan-300 underline">
                {t.topicNames['positional-encoding']}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Post-training */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{tr.postTitle}</h2>
        <div className="p-5 rounded-xl bg-surface border border-border mb-8">
          <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{tr.sftTitle}</h3>
          <p className="text-sm text-muted leading-relaxed">{tr.sftBody}</p>
        </div>

        <h3 className="text-xl font-bold font-heading text-text mb-2">{tr.methodsTitle}</h3>
        <p className="text-muted leading-relaxed mb-6">{tr.methodsIntro}</p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {methods.map((m) => (
            <div key={m.title} className={`rounded-xl bg-gradient-to-br border p-5 ${m.box}`}>
              <h4 className={`text-lg font-bold font-heading mb-3 ${m.text}`}>{m.title}</h4>
              <p className="text-sm text-muted mb-3">{m.body}</p>
              <ol className="space-y-2">
                {[m.steps.s1, m.steps.s2, m.steps.s3].map((step, i) => (
                  <li key={i} className="text-xs text-muted/90">
                    <span className={`font-medium ${m.text}`}>{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <div className="mb-6 overflow-x-auto rounded-xl border border-cyan-500/20 bg-background/60 px-4 py-3 text-center font-mono text-sm text-text">
          {tr.dpoFormula}
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface p-4">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr>
                {[tr.table.property, 'PPO', 'DPO', 'GRPO'].map((name) => (
                  <th className="p-3" key={name}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map(([name, ...values]) => (
                <tr key={name} className="border-t border-border">
                  <th className="p-3 font-medium">{name}</th>
                  {values.map((value, i) => (
                    <td className="p-3 text-muted" key={i}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* RLVR */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{tr.rlvrTitle}</h2>
        <p className="text-muted leading-relaxed mb-8">{tr.rlvrIntro}</p>
        <h3 className="text-lg font-bold font-heading text-text mb-1">{tr.rlvrDemoTitle}</h3>
        <p className="text-sm text-muted mb-4">{tr.rlvrDemoDesc}</p>
        <GrpoAdvantageDemo />
        <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
          <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{tr.rlvrLimitTitle}</h3>
          <p className="text-sm text-muted leading-relaxed">{tr.rlvrLimitBody}</p>
        </div>
        <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span>{tr.rlvrMore}</span>
          <Link href={href('/ai/agents/verifiable-rewards')} className="text-cyan-300 underline">
            {t.topicNames['verifiable-rewards']}
          </Link>
          <Link href={href('/ai/llm/reasoning-models')} className="text-cyan-300 underline">
            {t.topicNames['reasoning-models']}
          </Link>
        </p>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{tr.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[tr.takeaways.t1, tr.takeaways.t2, tr.takeaways.t3, tr.takeaways.t4, tr.takeaways.t5, tr.takeaways.t6].map((item, i) => (
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

      {/* Sources */}
      <section>
        <h2 className="text-xl font-bold font-heading text-text mb-3">{tr.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map(([label, url]) => (
            <li key={url}>
              <a href={url} className="text-cyan-300 underline" target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
