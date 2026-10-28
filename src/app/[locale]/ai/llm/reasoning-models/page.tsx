'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  EyeOff,
  FileCheck2,
  GitBranch,
  Layers3,
  MessageSquareText,
  Network,
  SearchCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TestTube2,
  Workflow,
  Wrench,
} from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { InferenceBudgetVisualizer } from '@/components/interactive/InferenceBudgetVisualizer'
import { ReasoningGrpoDemo } from '@/components/interactive/ReasoningGrpoDemo'
import { LatexBlock } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = {
  snell: { title: 'Snell et al. (2024): Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters', url: 'https://arxiv.org/abs/2408.03314' },
  o1: { title: 'OpenAI (2024): Learning to Reason with LLMs', url: 'https://openai.com/index/learning-to-reason-with-llms/' },
  r1: { title: 'DeepSeek-AI (2025): DeepSeek-R1 – Incentivizing Reasoning Capability in LLMs via Reinforcement Learning', url: 'https://arxiv.org/abs/2501.12948' },
  grpo: { title: 'Shao et al. (2024): DeepSeekMath – introduces GRPO', url: 'https://arxiv.org/abs/2402.03300' },
  tulu: { title: 'Lambert et al. (2024): Tülu 3 – names RLVR', url: 'https://arxiv.org/abs/2411.15124' },
  dapo: { title: 'Yu et al. (2025): DAPO – An Open-Source LLM Reinforcement Learning System at Scale', url: 'https://arxiv.org/abs/2503.14476' },
  yue: { title: 'Yue et al. (2025): Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?', url: 'https://arxiv.org/abs/2504.13837' },
  lightman: { title: 'Lightman et al. (2023): Let’s Verify Step by Step', url: 'https://arxiv.org/abs/2305.20050' },
  codex: { title: 'Chen et al. (2021): Evaluating Large Language Models Trained on Code – pass@k estimator', url: 'https://arxiv.org/abs/2107.03374' },
  selfConsistency: { title: 'Wang et al. (2022): Self-Consistency Improves Chain of Thought Reasoning', url: 'https://arxiv.org/abs/2203.11171' },
  monkeys: { title: 'Brown et al. (2024): Large Language Monkeys – Scaling Inference Compute with Repeated Sampling', url: 'https://arxiv.org/abs/2407.21787' },
  s1: { title: 'Muennighoff et al. (2025): s1 – Simple Test-Time Scaling', url: 'https://arxiv.org/abs/2501.19393' },
  faithfulness: { title: 'Chen et al. (2025): Reasoning Models Don’t Always Say What They Think', url: 'https://arxiv.org/abs/2505.05410' },
  openaiDocs: { title: 'OpenAI API: Reasoning models', url: 'https://platform.openai.com/docs/guides/reasoning' },
  anthropicDocs: { title: 'Claude API: Extended thinking', url: 'https://platform.claude.com/docs/en/build-with-claude/extended-thinking' },
  geminiDocs: { title: 'Gemini API: Thinking', url: 'https://ai.google.dev/gemini-api/docs/thinking' },
  o3: { title: 'OpenAI (2025): Introducing o3 and o4-mini', url: 'https://openai.com/index/introducing-o3-and-o4-mini/' },
} as const

type SourceKey = keyof typeof SOURCES

// AIME 2024 accuracy in percent, from OpenAI's o1 announcement (labels in the dictionary)
const RETURNS_VALUES = [12, 74, 83, 93]

function SourceLink({ id }: { id: SourceKey }) {
  const source = SOURCES[id]
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-start gap-1.5 text-xs leading-snug text-primary-light hover:underline">
      <span>{source.title}</span>
      <ExternalLink size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
    </a>
  )
}

export default function ReasoningModelsPage() {
  const { t, locale } = useTranslation()
  const c = t.reasoningModels

  const milestoneSources: SourceKey[] = ['snell', 'o1', 'r1']
  const rlvrIcons = [GitBranch, TestTube2, Network, Sparkles]
  const controlSources: SourceKey[] = ['openaiDocs', 'anthropicDocs', 'geminiDocs']

  const strategies = [
    { icon: BrainCircuit, title: c.serialTitle, description: c.serialDesc, accent: 'text-purple-300', line: 'from-purple-500/60 to-purple-500/5' },
    { icon: GitBranch, title: c.parallelTitle, description: c.parallelDesc, accent: 'text-cyan-300', line: 'from-cyan-500/60 to-cyan-500/5' },
    { icon: SearchCheck, title: c.verifierTitle, description: c.verifierDesc, accent: 'text-emerald-300', line: 'from-emerald-500/60 to-emerald-500/5' },
  ]

  const workflow = [
    { icon: Sparkles, title: c.workflowStep1, description: c.workflowStep1Desc },
    { icon: GitBranch, title: c.workflowStep2, description: c.workflowStep2Desc },
    { icon: TestTube2, title: c.workflowStep3, description: c.workflowStep3Desc },
    { icon: FileCheck2, title: c.workflowStep4, description: c.workflowStep4Desc },
  ]

  const visibility = [
    { icon: EyeOff, title: c.hiddenTitle, description: c.hiddenDesc },
    { icon: MessageSquareText, title: c.conciseTitle, description: c.conciseDesc },
    { icon: FileCheck2, title: c.artifactsTitle, description: c.artifactsDesc },
  ]

  const tradeoffs = [
    { icon: Clock3, title: c.latencyTitle, description: c.latencyDesc, color: 'text-cyan-300' },
    { icon: CircleDollarSign, title: c.costTitle, description: c.costDesc, color: 'text-amber-300' },
    { icon: Target, title: c.accuracyTitle, description: c.accuracyDesc, color: 'text-emerald-300' },
  ]

  const selection = [
    { title: c.selectionEasyTitle, description: c.selectionEasyDesc, marker: '01' },
    { title: c.selectionMathTitle, description: c.selectionMathDesc, marker: '02' },
    { title: c.selectionCodeTitle, description: c.selectionCodeDesc, marker: '03' },
    { title: c.selectionHighTitle, description: c.selectionHighDesc, marker: '04' },
  ]

  type Step = 'think' | 'tool' | 'result' | 'answer'
  const stepLabel: Record<Step, string> = { think: c.stepThink, tool: c.stepTool, result: c.stepResult, answer: c.stepAnswer }
  const stepStyle: Record<Step, string> = {
    think: 'border-purple-400/40 bg-purple-400/10 text-purple-100',
    tool: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-100',
    result: 'border-border bg-background/60 text-muted',
    answer: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100',
  }
  const lanes: { label: string; steps: Step[] }[] = [
    { label: c.upfrontLabel, steps: ['think', 'tool', 'result', 'tool', 'result', 'answer'] },
    { label: c.interleavedLabel, steps: ['think', 'tool', 'result', 'think', 'tool', 'result', 'think', 'answer'] },
  ]

  const related = [
    { id: 'next-token-prediction', href: '/ai/llm/next-token-prediction', description: c.relatedNextTokenDesc },
    { id: 'verifiable-rewards', href: '/ai/agents/verifiable-rewards', description: c.relatedRewardsDesc },
    { id: 'looped-transformers', href: '/ai/llm/looped-transformers', description: c.relatedLoopedDesc },
    { id: 'evaluation', href: '/ai/agents/evaluation', description: c.relatedEvaluationDesc },
  ] as const

  return (
    <TopicLayout
      topicId="reasoning-models"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.title },
      ]}
    >
      <section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-purple-500/10 via-surface/70 to-cyan-500/10 p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
              <BrainCircuit size={24} className="text-primary-light" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-gradient md:text-3xl">{c.introTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{c.introDesc}</p>
          </div>
          <div className="relative rounded-2xl border border-border bg-background/65 p-5">
            <div className="absolute inset-y-8 left-8 w-px bg-gradient-to-b from-purple-400 via-cyan-400 to-emerald-400" aria-hidden="true" />
            {[c.workflowStep1, c.workflowStep2, c.workflowStep3, c.workflowStep4].map((label, index) => (
              <div key={label} className="relative flex min-h-14 items-center gap-4 pl-1">
                <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background font-mono text-xs text-primary-light">
                  {index + 1}
                </span>
                <span className="font-heading text-sm font-bold text-text">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100">
          {c.definitionNote}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.milestonesTitle}</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {c.milestones.map((item, index) => (
            <li key={item.title} className="flex flex-col rounded-2xl border border-border bg-surface/55 p-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">{item.date}</span>
              <h3 className="mt-2 font-heading text-lg font-bold text-text">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.body}</p>
              <SourceLink id={milestoneSources[index]} />
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          <article className="rounded-2xl border border-purple-500/25 bg-purple-500/5 p-6">
            <Layers3 size={23} className="mb-4 text-purple-300" aria-hidden="true" />
            <h2 className="font-heading text-xl font-bold text-text">{c.trainingTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.trainingDesc}</p>
          </article>
          <div className="hidden items-center md:flex" aria-hidden="true">
            <ArrowRight size={24} className="text-muted" />
          </div>
          <article className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-6">
            <Workflow size={23} className="mb-4 text-cyan-300" aria-hidden="true" />
            <h2 className="font-heading text-xl font-bold text-text">{c.inferenceTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.inferenceDesc}</p>
          </article>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.rlvrTitle}</h2>
          <p className="mt-3 leading-relaxed text-muted">{c.rlvrIntro}</p>
          <div className="flex flex-wrap gap-x-5">
            <SourceLink id="tulu" />
            <SourceLink id="grpo" />
          </div>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.rlvrSteps.map((step, index) => {
            const Icon = rlvrIcons[index]
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="rounded-2xl border border-border bg-surface/55 p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-background">
                    <Icon size={17} className="text-primary-light" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs text-muted">0{index + 1}</span>
                </div>
                <h3 className="font-heading font-bold text-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </motion.li>
            )
          })}
        </ol>
        <figure className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
          <LatexBlock className="overflow-x-auto text-text">{'A_i = \\frac{r_i - \\operatorname{mean}(r_1, \\dots, r_G)}{\\operatorname{std}(r_1, \\dots, r_G)}'}</LatexBlock>
          <figcaption className="mt-2 text-center text-xs text-muted">{c.rlvrFormulaCaption}</figcaption>
        </figure>
        <ReasoningGrpoDemo />
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
            <h3 className="font-heading text-lg font-bold text-text">{c.rlvrEmergentTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.rlvrEmergent}</p>
            <SourceLink id="r1" />
          </article>
          <article className="rounded-2xl border border-orange-400/25 bg-orange-400/5 p-6">
            <h3 className="font-heading text-lg font-bold text-text">{c.rlvrLimitTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.rlvrLimit}</p>
            <SourceLink id="yue" />
          </article>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.supervisionTitle}</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">{c.supervisionIntro}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 to-transparent p-6">
            <Network size={21} className="mb-3 text-purple-300" aria-hidden="true" />
            <h3 className="font-heading text-xl font-bold text-text">{c.processTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.processDesc}</p>
            <SourceLink id="lightman" />
          </article>
          <article className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
            <Target size={21} className="mb-3 text-emerald-300" aria-hidden="true" />
            <h3 className="font-heading text-xl font-bold text-text">{c.outcomeTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.outcomeDesc}</p>
            <SourceLink id="r1" />
          </article>
        </div>
      </section>

      <section>
        <div className="mb-6 max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.budgetTitle}</h2>
          <p className="mt-3 leading-relaxed text-muted">{c.budgetDesc}</p>
        </div>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/55">
          {strategies.map(({ icon: Icon, title, description, accent, line }) => (
            <article key={title} className="relative grid gap-4 p-5 sm:grid-cols-[48px_minmax(0,1fr)] sm:p-6">
              <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${line}`} aria-hidden="true" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background/60">
                <Icon size={21} className={accent} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-text">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">{c.budgetSnell}</p>
        <SourceLink id="snell" />
      </section>

      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.metricsTitle}</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-6">
            <h3 className="font-heading text-lg font-bold text-text">pass@k</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.passAtKDesc}</p>
            <LatexBlock className="mt-3 overflow-x-auto text-text">{'\\text{pass@}k = 1 - \\binom{n-c}{k} \\Big/ \\binom{n}{k}'}</LatexBlock>
            <SourceLink id="codex" />
          </article>
          <article className="rounded-2xl border border-purple-500/25 bg-purple-500/5 p-6">
            <h3 className="font-heading text-lg font-bold text-text">maj@k</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.majAtKDesc}</p>
            <SourceLink id="selfConsistency" />
          </article>
        </div>
        <InferenceBudgetVisualizer />
        <SourceLink id="monkeys" />
      </section>

      <section className="rounded-2xl border border-border bg-surface/45 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={22} className="text-primary-light" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.controlsTitle}</h2>
        </div>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">{c.controlsIntro}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {c.controls.map((control, index) => (
            <article key={control.name} className="flex flex-col rounded-xl border border-border bg-background/50 p-5">
              <h3 className="font-heading font-bold text-text">{control.name}</h3>
              <code className="mt-2 w-fit rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-cyan-200">{control.param}</code>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{control.body}</p>
              <SourceLink id={controlSources[index]} />
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-purple-400/25 bg-purple-400/5 p-5">
          <h3 className="font-heading font-bold text-text">{c.budgetForcingTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{c.budgetForcingDesc}</p>
          <SourceLink id="s1" />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <Wrench size={22} className="text-cyan-300" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.interleavedTitle}</h2>
        </div>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">{c.interleavedDesc}</p>
        <div className="mt-6 space-y-5 rounded-2xl border border-border bg-background/45 p-5">
          {lanes.map((lane) => (
            <div key={lane.label}>
              <h3 className="mb-3 text-sm font-bold text-text">{lane.label}</h3>
              <ol className="flex flex-wrap items-center gap-2">
                {lane.steps.map((step, index) => (
                  <motion.li
                    key={`${step}-${index}`}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: index * 0.12 }}
                    className="flex items-center gap-2"
                  >
                    <span className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${stepStyle[step]}`}>{stepLabel[step]}</span>
                    {index < lane.steps.length - 1 && <ArrowRight size={14} className="text-subtle" aria-hidden="true" />}
                  </motion.li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{c.interleavedNote}</p>
        <div className="flex flex-wrap gap-x-5">
          <SourceLink id="anthropicDocs" />
          <SourceLink id="o3" />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/45 p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.workflowTitle}</h2>
        <div className="relative mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-6 hidden h-px bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 lg:block" aria-hidden="true" />
          {workflow.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="relative z-10">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-background shadow-[0_0_18px_rgba(168,85,247,0.18)]">
                <Icon size={19} className="text-primary-light" aria-hidden="true" />
              </div>
              <div className="text-xs font-mono text-muted">0{index + 1}</div>
              <h3 className="mt-1 font-heading font-bold text-text">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-7 grid gap-5 border-t border-border pt-6 md:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)]">
          <div>
            <h3 className="font-heading text-xl font-bold text-text">{c.searchTitle}</h3>
            <p className="mt-3 leading-relaxed text-muted">{c.searchDesc}</p>
          </div>
          <div className="rounded-xl border border-orange-400/20 bg-orange-400/5 p-4 text-sm leading-relaxed text-muted">
            {c.searchCaveat}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-background/45">
        <div className="border-b border-border bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 p-6 md:p-8">
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.visibilityTitle}</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted">{c.visibilityIntro}</p>
        </div>
        <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {visibility.map(({ icon: Icon, title, description }) => (
            <article key={title} className="p-6">
              <Icon size={21} className="mb-3 text-primary-light" aria-hidden="true" />
              <h3 className="font-heading font-bold text-text">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </article>
          ))}
        </div>
        <div className="border-t border-amber-400/20 bg-amber-400/10 p-5">
          <p className="text-sm font-medium leading-relaxed text-amber-100">{c.visibilityWarning}</p>
          <SourceLink id="faithfulness" />
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.tradeoffsTitle}</h2>
        <div className="mt-6 divide-y divide-border border-y border-border">
          {tradeoffs.map(({ icon: Icon, title, description, color }) => (
            <article key={title} className="grid gap-3 py-5 sm:grid-cols-[36px_130px_minmax(0,1fr)] sm:items-start">
              <Icon size={21} className={color} aria-hidden="true" />
              <h3 className="font-heading font-bold text-text">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6">
            <h3 className="font-heading text-xl font-bold text-text">{c.returnsTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.returnsDesc}</p>
            <div className="mt-5 space-y-3" role="img" aria-label={c.returnsAria}>
              {c.returnsBars.map((label, index) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between gap-3 text-xs">
                    <span className="text-muted">{label}</span>
                    <span className="font-mono font-bold tabular-nums text-text">{RETURNS_VALUES[index]}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-surface">
                    <motion.div
                      className={`h-full rounded-full ${index === 0 ? 'bg-muted/50' : 'bg-gradient-to-r from-purple-500 to-cyan-400'}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${RETURNS_VALUES[index]}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <SourceLink id="o1" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-text">{c.wasteTitle}</h3>
            <ul className="mt-4 space-y-3">
              {[c.waste1, c.waste2, c.waste3, c.waste4, c.waste5].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 border border-orange-300 bg-orange-400/25" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.selectionTitle}</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">{c.selectionIntro}</p>
        <div className="mt-7 grid gap-x-8 gap-y-6 md:grid-cols-2">
          {selection.map((item) => (
            <article key={item.marker} className="grid grid-cols-[42px_minmax(0,1fr)] gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 font-mono text-xs font-bold text-primary-light">
                {item.marker}
              </span>
              <div>
                <h3 className="font-heading font-bold text-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.relatedTitle}</h2>
        <p className="mt-3 text-muted">{c.relatedIntro}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {related.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="group flex min-h-[88px] items-center justify-between gap-4 rounded-xl border border-border bg-surface/55 p-4 transition-colors hover:border-primary/45 hover:bg-surface-elevated motion-reduce:transition-none"
            >
              <div>
                <h3 className="font-heading font-bold text-text group-hover:text-primary-light">{t.topicNames[item.id]}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{item.description}</p>
              </div>
              <ArrowRight size={18} className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary motion-reduce:transition-none" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-emerald-200">{c.takeawaysTitle}</h2>
        <ul className="mt-5 space-y-4">
          {[c.takeaway1, c.takeaway2, c.takeaway3].map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-muted">
              <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-surface/45 p-6">
        <h2 className="font-heading text-xl font-bold text-text">{c.sourcesTitle}</h2>
        <ul className="mt-4 space-y-2">
          {Object.values(SOURCES).map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-sm text-primary-light hover:underline">
                <span>{source.title}</span>
                <ExternalLink size={13} className="mt-1 shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
