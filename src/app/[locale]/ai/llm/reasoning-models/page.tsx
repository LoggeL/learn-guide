'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Binary,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  EyeOff,
  FileCheck2,
  GitBranch,
  Layers3,
  Network,
  SearchCheck,
  Sparkles,
  Target,
  TestTube2,
  Workflow,
} from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { InferenceBudgetVisualizer } from '@/components/interactive/InferenceBudgetVisualizer'
import { useTranslation } from '@/lib/i18n/context'

export default function ReasoningModelsPage() {
  const { t, locale } = useTranslation()
  const c = t.reasoningModels

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
    { icon: Binary, title: c.conciseTitle, description: c.conciseDesc },
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

  const related = [
    { title: c.relatedNextToken, description: c.relatedNextTokenDesc, href: '/ai/llm/next-token-prediction' },
    { title: c.relatedRewards, description: c.relatedRewardsDesc, href: '/ai/agents/verifiable-rewards' },
    { title: c.relatedEvaluation, description: c.relatedEvaluationDesc, href: '/ai/agents/evaluation' },
    { title: c.relatedSpeculative, description: c.relatedSpeculativeDesc, href: '/ai/llm/speculative-decoding' },
  ]

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
      </section>

      <InferenceBudgetVisualizer />

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

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.supervisionTitle}</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">{c.supervisionIntro}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 to-transparent p-6">
            <Network size={21} className="mb-3 text-purple-300" aria-hidden="true" />
            <h3 className="font-heading text-xl font-bold text-text">{c.processTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.processDesc}</p>
          </article>
          <article className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
            <Target size={21} className="mb-3 text-emerald-300" aria-hidden="true" />
            <h3 className="font-heading text-xl font-bold text-text">{c.outcomeTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.outcomeDesc}</p>
          </article>
        </div>
        <div className="mt-5 flex gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <CheckCircle2 size={21} className="mt-0.5 shrink-0 text-cyan-300" aria-hidden="true" />
          <div>
            <h3 className="font-heading font-bold text-text">{c.consistencyTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.consistencyDesc}</p>
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
        <p className="border-t border-amber-400/20 bg-amber-400/10 p-5 text-sm font-medium leading-relaxed text-amber-100">
          {c.visibilityWarning}
        </p>
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
        <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6">
            <h3 className="font-heading text-xl font-bold text-text">{c.returnsTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.returnsDesc}</p>
            <div className="mt-5 flex h-24 items-end gap-2" aria-hidden="true">
              {[42, 67, 82, 90, 94, 96, 97].map((height, index) => (
                <div key={height} className="flex-1 rounded-t bg-gradient-to-t from-purple-500/70 to-cyan-400/70" style={{ height: `${height - index * 3}%` }} />
              ))}
            </div>
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
                <h3 className="font-heading font-bold text-text group-hover:text-primary-light">{item.title}</h3>
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
    </TopicLayout>
  )
}
