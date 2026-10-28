'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { ReinforcementLearningPlayground } from '@/components/interactive/ReinforcementLearningPlayground'
import { DiscountedReturnDemo } from '@/components/interactive/DiscountedReturnDemo'
import { Latex } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  { title: 'Sutton & Barto: Reinforcement Learning – An Introduction (2nd ed., 2018)', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
  { title: 'Watkins & Dayan: Q-learning (1992)', url: 'https://link.springer.com/article/10.1007/BF00992698' },
  { title: 'Mnih et al.: Human-level control through deep reinforcement learning (2015)', url: 'https://www.nature.com/articles/nature14236' },
  { title: 'Williams: Simple statistical gradient-following algorithms (REINFORCE, 1992)', url: 'https://link.springer.com/article/10.1007/BF00992696' },
  { title: 'Schulman et al.: Proximal Policy Optimization Algorithms (2017)', url: 'https://arxiv.org/abs/1707.06347' },
  { title: 'Shao et al.: DeepSeekMath – introduces GRPO (2024)', url: 'https://arxiv.org/abs/2402.03300' },
  { title: 'Ouyang et al.: Training language models to follow instructions with human feedback (2022)', url: 'https://arxiv.org/abs/2203.02155' },
  { title: 'DeepSeek-AI: DeepSeek-R1 (2025)', url: 'https://arxiv.org/abs/2501.12948' },
]

const RETURN_FORMULA = 'G_t = r_{t+1} + \\gamma\\, r_{t+2} + \\gamma^2 r_{t+3} + \\dots = \\sum_{k=0}^{\\infty} \\gamma^k\\, r_{t+k+1}'
const returnExample = (dec: string) =>
  `G_0 = -1 + 0${dec}85\\cdot(-1) + 0${dec}85^2\\cdot(-1) + 0${dec}85^3\\cdot 10 \\approx 3${dec}57`
const BELLMAN = 'Q^*(s,a) = \\mathbb{E}\\big[\\, r + \\gamma \\max_{a\'} Q^*(s\',a\') \\,\\big]'
const qUpdate = (target: string) =>
  `Q(s,a) \\leftarrow Q(s,a) + \\alpha \\Big[\\underbrace{r + \\gamma \\max_{a'} Q(s',a')}_{\\text{${target}}} - Q(s,a)\\Big]`

const METHOD_FORMULAS = {
  dqn: 'L(\\theta) = \\big(r + \\gamma \\max_{a\'} Q_{\\bar\\theta}(s\',a\') - Q_\\theta(s,a)\\big)^2',
  policyGradient: '\\nabla_\\theta J(\\theta) = \\mathbb{E}\\Big[\\sum_t \\nabla_\\theta \\log \\pi_\\theta(a_t \\mid s_t)\\,\\big(G_t - b(s_t)\\big)\\Big]',
  actorCritic: '\\hat A_t = r_{t+1} + \\gamma V_\\phi(s_{t+1}) - V_\\phi(s_t)',
  ppo: 'L^{\\text{CLIP}}(\\theta) = \\mathbb{E}_t\\big[\\min\\big(\\rho_t \\hat A_t,\\ \\text{clip}(\\rho_t, 1-\\varepsilon, 1+\\varepsilon)\\,\\hat A_t\\big)\\big],\\quad \\rho_t = \\frac{\\pi_\\theta(a_t\\mid s_t)}{\\pi_{\\text{old}}(a_t\\mid s_t)}',
  grpo: '\\hat A_i = \\frac{r_i - \\operatorname{mean}(r_1,\\dots,r_G)}{\\operatorname{std}(r_1,\\dots,r_G)}',
} as const

const METHOD_ORDER = ['dqn', 'policyGradient', 'actorCritic', 'ppo', 'grpo'] as const

const RELATED = [
  { id: 'world-models', path: '/ai/ml-fundamentals/world-models' },
  { id: 'llm-training', path: '/ai/llm/training' },
  { id: 'verifiable-rewards', path: '/ai/agents/verifiable-rewards' },
  { id: 'reasoning-models', path: '/ai/llm/reasoning-models' },
] as const

export default function ReinforcementLearningPage() {
  const { t, locale } = useTranslation()
  const r = t.reinforcementLearning

  return (
    <TopicLayout
      topicId="reinforcement-learning"
      title={r.title}
      description={r.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: r.title },
      ]}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{r.consequencesTitle}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">{r.consequencesDesc}</p>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 text-sm text-muted leading-relaxed">
          {r.creditAssignmentNote}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{r.loopTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.loopIntro}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {r.concepts.map((concept, i) => (
            <div key={concept.title} className="rounded-xl bg-surface/70 border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light text-xs font-bold">
                  {i + 1}
                </span>
                <h3 className="font-bold font-heading text-text">{concept.title}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">{concept.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{r.returnTitle}</h2>
        <p className="text-muted leading-relaxed">{r.returnIntro}</p>
        <div className="overflow-x-auto rounded-xl border border-primary/25 bg-primary/5 p-4 text-text">
          <Latex block>{RETURN_FORMULA}</Latex>
        </div>
        <p className="text-muted leading-relaxed">{r.returnGamma}</p>
        <p className="text-sm text-muted">{r.returnExample}</p>
        <div className="overflow-x-auto text-text">
          <Latex block>{returnExample(locale === 'de' ? '{,}' : '.')}</Latex>
        </div>
        <DiscountedReturnDemo />
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{r.valueTitle}</h2>
        <p className="text-muted leading-relaxed">{r.valueDesc}</p>
        <p className="text-muted leading-relaxed">{r.bellmanDesc}</p>
        <div className="overflow-x-auto text-text">
          <Latex block>{BELLMAN}</Latex>
        </div>
        <h3 className="text-xl font-bold font-heading text-text pt-2">{r.qUpdateTitle}</h3>
        <p className="text-muted leading-relaxed">{r.qUpdateIntro}</p>
        <div className="overflow-x-auto rounded-xl border border-primary/25 bg-primary/5 p-4 text-text">
          <Latex block>{qUpdate(r.qUpdateParts[0].term)}</Latex>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {r.qUpdateParts.map((part) => (
            <div key={part.term} className="rounded-xl bg-background border border-border p-4">
              <h4 className="font-bold text-primary-light mb-1">{part.term}</h4>
              <p className="text-sm text-muted leading-relaxed">{part.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted leading-relaxed">{r.qUpdateModelFree}</p>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <ReinforcementLearningPlayground />
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{r.methodsTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.methodsIntro}</p>
        <div className="space-y-4">
          {METHOD_ORDER.map((id) => (
            <div key={id} className="rounded-xl bg-surface/70 border border-border p-5">
              <h3 className="text-lg font-bold font-heading text-primary-light mb-2">{r.methods[id].name}</h3>
              <div className="overflow-x-auto text-text text-sm mb-2">
                <Latex block>{METHOD_FORMULAS[id]}</Latex>
              </div>
              <p className="text-sm text-muted leading-relaxed">{r.methods[id].desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{r.whyMattersTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{r.whyMattersDesc1}</p>
        <p className="text-muted leading-relaxed">{r.whyMattersDesc2}</p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{r.relatedTitle}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {RELATED.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${item.path}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/55 p-4 hover:border-primary/45"
            >
              <span className="font-heading font-bold text-text group-hover:text-primary-light">{t.topicNames[item.id]}</span>
              <ArrowRight size={18} className="shrink-0 text-primary-light" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-xl font-bold text-text">{r.sourcesTitle}</h2>
        <ul className="mt-4 space-y-3">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-light hover:underline">
                {source.title}
                <ExternalLink size={14} className="shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
