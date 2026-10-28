'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { VerifiableRewardsSimulator } from '@/components/interactive/VerifiableRewardsSimulator'
import { GrpoAdvantageDemo } from '@/components/interactive/GrpoAdvantageDemo'
import { Latex } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const REWARD_FORMULA = String.raw`r(x, y) = \mathbb{1}\big[\operatorname{extract}(y) = y^{*}\big] \in \{0, 1\}`
const ADVANTAGE_FORMULA = String.raw`A_i = \frac{r_i - \operatorname{mean}(r_1, \dots, r_G)}{\operatorname{std}(r_1, \dots, r_G)}`

const SOURCES = [
  { label: 'Lambert et al. (2024): Tülu 3 – Pushing Frontiers in Open Language Model Post-Training', href: 'https://arxiv.org/abs/2411.15124' },
  { label: 'Shao et al. (2024): DeepSeekMath – Pushing the Limits of Mathematical Reasoning in Open Language Models', href: 'https://arxiv.org/abs/2402.03300' },
  { label: 'DeepSeek-AI (2025): DeepSeek-R1 (Nature 645, 633–638)', href: 'https://arxiv.org/abs/2501.12948' },
  { label: 'Yu et al. (2025): DAPO – An Open-Source LLM Reinforcement Learning System at Scale', href: 'https://arxiv.org/abs/2503.14476' },
  { label: 'Yue et al. (2025): Does RL Really Incentivize Reasoning Capacity Beyond the Base Model?', href: 'https://arxiv.org/abs/2504.13837' },
  { label: 'Gao, Schulman, Hilton (2022): Scaling Laws for Reward Model Overoptimization', href: 'https://arxiv.org/abs/2210.10760' },
  { label: 'Lightman et al. (2023): Let’s Verify Step by Step', href: 'https://arxiv.org/abs/2305.20050' },
  { label: 'OpenAI (2025): Detecting misbehavior in frontier reasoning models', href: 'https://openai.com/index/chain-of-thought-monitoring/' },
  { label: 'Anthropic (2025): Natural emergent misalignment from reward hacking', href: 'https://www.anthropic.com/research/emergent-misalignment-reward-hacking' },
  { label: 'METR (2025): Recent frontier models are reward hacking', href: 'https://metr.org/blog/2025-06-05-recent-reward-hacking/' },
  { label: 'Zhong, Raghunathan, Carlini (2025): ImpossibleBench', href: 'https://arxiv.org/abs/2510.20270' },
]

const LOOP_COLORS = [
  { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  { bg: 'bg-orange-500/20', text: 'text-orange-400' },
]

export default function VerifiableRewardsPage() {
  const { t } = useTranslation()
  const v = t.verifiableRewards

  return (
    <TopicLayout
      topicId="verifiable-rewards"
      title={v.title}
      description={v.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: v.title },
      ]}
    >
      {/* Intro */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{v.introTitle}</h2>
        <p className="text-muted leading-relaxed">{v.introP1}</p>
        <p className="text-muted leading-relaxed">{v.introP2}</p>
        <div className="rounded-xl bg-background border border-border p-4 overflow-x-auto">
          <Latex block>{REWARD_FORMULA}</Latex>
          <p className="text-xs text-muted mt-2">{v.formulaLabel}</p>
        </div>
      </section>

      {/* Training loop */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{v.loopTitle}</h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {v.loopSteps.map((step, i) => (
            <li key={step.title} className="p-4 bg-background rounded-xl border border-border">
              <div className={`w-8 h-8 rounded-lg ${LOOP_COLORS[i].bg} flex items-center justify-center mb-3`}>
                <span className={`text-sm font-bold font-mono ${LOOP_COLORS[i].text}`}>{i + 1}</span>
              </div>
              <h3 className="text-sm font-bold text-text mb-1">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* GRPO */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{v.grpoTitle}</h2>
        <p className="text-muted leading-relaxed">{v.grpoP1}</p>
        <p className="text-muted leading-relaxed">{v.grpoP2}</p>
        <div className="rounded-xl bg-background border border-border p-4 overflow-x-auto">
          <Latex block>{ADVANTAGE_FORMULA}</Latex>
        </div>
        <p className="text-muted leading-relaxed">{v.grpoP3}</p>
        <GrpoAdvantageDemo />
      </section>

      {/* Practice */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{v.practiceTitle}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {v.practiceCards.map(card => (
            <article key={card.title} className="p-5 bg-surface border border-border rounded-xl">
              <h3 className="font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 p-5 rounded-xl border border-purple-500/20 bg-purple-500/5">
          <h3 className="font-semibold text-purple-400 mb-2">{v.practiceCaveatTitle}</h3>
          <p className="text-sm text-muted leading-relaxed">{v.practiceCaveat}</p>
        </div>
      </section>

      {/* Verifier vs reward model */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{v.verifierTitle}</h2>
        <p className="text-muted leading-relaxed">{v.verifierIntro}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[640px]">
            <thead>
              <tr>
                {v.verifierHeaders.map((h, i) => (
                  <th key={i} className="p-3 font-semibold text-text border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {v.verifierRows.map(row => (
                <tr key={row.label} className="border-b border-border align-top">
                  <td className="p-3 font-medium text-text">{row.label}</td>
                  <td className="p-3 text-muted">{row.verifier}</td>
                  <td className="p-3 text-muted">{row.rewardModel}</td>
                  <td className="p-3 text-muted">{row.judge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted leading-relaxed">{v.verifierNote}</p>
        <p className="text-sm text-muted leading-relaxed">{v.prmNote}</p>
      </section>

      {/* Checker demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{v.simTitle}</h2>
        <p className="text-muted leading-relaxed">{v.simIntro}</p>
        <VerifiableRewardsSimulator />
      </section>

      {/* Reward hacking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{v.hackingTitle}</h2>
        <p className="text-muted leading-relaxed">{v.hackingIntro}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {v.hackingCases.map(item => (
            <article key={item.title} className="p-5 rounded-xl border border-red-500/20 bg-red-500/5">
              <h3 className="font-semibold text-red-400">{item.title}</h3>
              <p className="text-xs text-muted mb-2">{item.source}</p>
              <p className="text-sm text-muted leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <h3 className="font-semibold text-emerald-400 mb-3">{v.defensesTitle}</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted">
            {v.defenses.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      {/* Environments */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{v.environmentsTitle}</h2>
        <p className="text-muted leading-relaxed">{v.environmentsDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {v.environments.map(env => (
            <article key={env.title} className="p-4 bg-background border border-border rounded-xl">
              <h3 className="font-semibold mb-2">{env.title}</h3>
              <p className="text-sm text-muted">{env.body}</p>
            </article>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="font-bold font-heading text-cyan-400 mb-2">{v.gpuWorkTitle}</h3>
            <p className="text-sm text-muted">{v.gpuWorkDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="font-bold font-heading text-orange-400 mb-2">{v.envWorkTitle}</h3>
            <p className="text-sm text-muted">{v.envWorkDesc}</p>
          </div>
        </div>
        <p className="text-sm text-muted leading-relaxed">{v.hardPartNote}</p>
      </section>

      {/* Where it works */}
      <section className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{v.strategicTitle}</h2>
        <p className="text-text leading-relaxed">{v.strategicDesc}</p>
      </section>

      {/* Sources */}
      <section className="border-t border-border pt-5">
        <h2 className="font-semibold mb-3">{v.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map(source => (
            <li key={source.href}>
              <a className="text-primary-light underline" href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
