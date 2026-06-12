'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { VerifiableRewardsSimulator } from '@/components/interactive/VerifiableRewardsSimulator'
import { useTranslation } from '@/lib/i18n/context'
import { CheckCircle2, Cloud, Cpu, FlaskConical, Gauge, ServerCog, Target, TestTube2 } from 'lucide-react'

const rewardLoop = [
  {
    icon: Target,
    title: 'Define a measurable target',
    desc: 'The task needs an outcome that can be checked without vibes: tests pass, file exists, spreadsheet total matches, browser state is correct, latency drops, or a ticket reaches the requested status.',
  },
  {
    icon: ServerCog,
    title: 'Run the agent in an environment',
    desc: 'The model needs a realistic workspace: repo, terminal, browser, Office files, APIs, mocks, permissions, time limits, and failure modes. A prompt alone is not enough.',
  },
  {
    icon: TestTube2,
    title: 'Verify the result automatically',
    desc: 'A grader runs deterministic checks, property tests, browser assertions, API probes, or domain-specific validators. This converts messy behavior into a reward signal.',
  },
  {
    icon: Gauge,
    title: 'Optimize against reward',
    desc: 'The system can rank rollouts, filter synthetic data, tune prompts, fine-tune policies, or run RL-style updates. The reward becomes a training signal instead of a subjective review.',
  },
]

const environments = [
  ['Coding agent', 'Repo checkout, issue text, tests, linter, hidden regression suite, mutation checks, runtime logs.'],
  ['Office agent', 'Documents, spreadsheets, slide decks, email drafts, calendar constraints, formatting checks, calculated fields.'],
  ['Browser agent', 'Real web app, seeded account, Playwright assertions, network traces, accessibility tree, screenshot diff.'],
  ['Ops agent', 'Sandboxed services, health checks, config drift, deploy simulation, rollback checks, cost and latency budgets.'],
]

const verifierTypes = [
  {
    title: 'Binary success',
    desc: 'Did the tests pass? Did the agent create the requested file? Did the workflow reach the final state?',
  },
  {
    title: 'Partial credit',
    desc: 'How many assertions passed? How close is the spreadsheet total? How much did latency improve?',
  },
  {
    title: 'Preference fallback',
    desc: 'When the result cannot be fully checked, pairwise model or human judgment can still rank outputs, but it is weaker than direct verification.',
  },
]

const bottlenecks = [
  'Designing tasks that are realistic but still objectively gradable.',
  'Keeping environments isolated, resettable, and cheap enough to run thousands of times.',
  'Preventing reward hacking, where the agent learns to satisfy the checker while missing the real intent.',
  'Splitting GPU-heavy model training from CPU-heavy environment simulation and verification.',
]

export default function VerifiableRewardsPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      topicId="verifiable-rewards"
      title={t.verifiableRewards.title}
      description={t.verifiableRewards.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.verifiableRewards.title },
      ]}
      prevTopic={{ label: t.topicNames['evaluation'], href: '/ai/agents/evaluation' }}
      nextTopic={{ label: t.topicNames['powerful-agents'], href: '/ai/agents/powerful' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.verifiableRewards.outcomesTitle}</h2>
            <p className="text-muted leading-relaxed text-lg">
              {t.verifiableRewards.outcomesDesc}
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 text-sm text-muted leading-relaxed">
          {t.verifiableRewards.hardPartNote}
        </div>
      </section>

      <VerifiableRewardsSimulator />

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.verifiableRewards.rewardLoopTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {rewardLoop.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="rounded-xl bg-surface/70 border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light text-xs font-bold">{i + 1}</span>
                <Icon size={18} className="text-primary-light" />
                <h3 className="font-bold font-heading text-text">{title}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.verifiableRewards.environmentsTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.verifiableRewards.environmentsDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {environments.map(([title, desc]) => (
            <div key={title} className="p-4 rounded-xl bg-background border border-border">
              <h3 className="font-bold text-cyan-400 mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.verifiableRewards.verifierDesignTitle}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {verifierTypes.map((item) => (
            <div key={item.title} className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
              <FlaskConical size={20} className="text-emerald-400 mb-3" />
              <h3 className="font-bold text-emerald-400 mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cpu size={22} className="text-purple-400" />
            <h2 className="text-xl font-bold font-heading text-text">{t.verifiableRewards.gpuWorkTitle}</h2>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            {t.verifiableRewards.gpuWorkDesc}
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cloud size={22} className="text-orange-400" />
            <h2 className="text-xl font-bold font-heading text-text">{t.verifiableRewards.envWorkTitle}</h2>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            {t.verifiableRewards.envWorkDesc}
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-surface border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.verifiableRewards.whyHardTitle}</h2>
        <ul className="space-y-4">
          {bottlenecks.map((item, i) => (
            <li key={item} className="flex gap-3 items-start text-text">
              <span className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-orange-300 text-sm font-bold">{i + 1}</span>
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.verifiableRewards.strategicTitle}</h2>
        <p className="text-muted leading-relaxed">
          {t.verifiableRewards.strategicDesc}
        </p>
      </section>
    </TopicLayout>
  )
}
