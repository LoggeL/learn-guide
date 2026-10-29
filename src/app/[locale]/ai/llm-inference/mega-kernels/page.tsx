'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { MegaKernelTimelineDemo } from '@/components/interactive/MegaKernelTimelineDemo'
import { useTranslation } from '@/lib/i18n/context'

export default function MegaKernelsPage() {
  const { t, locale } = useTranslation()
  const m = t.megaKernels

  const boundaryCards = [
    { title: m.boundaryLaunchTitle, desc: m.boundaryLaunchDesc, color: 'text-red-400', border: 'border-red-500/20' },
    { title: m.boundaryTailTitle, desc: m.boundaryTailDesc, color: 'text-orange-400', border: 'border-orange-500/20' },
    { title: m.boundaryLoadTitle, desc: m.boundaryLoadDesc, color: 'text-yellow-400', border: 'border-yellow-500/20' },
  ]

  const pipelineSteps = [
    { name: m.megaStep1, desc: m.megaStep1Desc },
    { name: m.megaStep2, desc: m.megaStep2Desc },
    { name: m.megaStep3, desc: m.megaStep3Desc },
    { name: m.megaStep4, desc: m.megaStep4Desc },
    { name: m.megaStep5, desc: m.megaStep5Desc },
    { name: m.megaStep6, desc: m.megaStep6Desc },
  ]

  const mechanisms = [
    { title: m.mechPagesTitle, desc: m.mechPagesDesc, color: 'text-cyan-400', bg: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20' },
    { title: m.mechCountersTitle, desc: m.mechCountersDesc, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20' },
    { title: m.mechHbmTitle, desc: m.mechHbmDesc, color: 'text-orange-400', bg: 'from-orange-500/10 to-red-500/10 border-orange-500/20' },
  ]

  const compareRows = [
    { dim: m.rowScope, fused: m.rowScopeFused, graph: m.rowScopeGraph, mega: m.rowScopeMega },
    { dim: m.rowRemoves, fused: m.rowRemovesFused, graph: m.rowRemovesGraph, mega: m.rowRemovesMega },
    { dim: m.rowBoundaries, fused: m.rowBoundariesFused, graph: m.rowBoundariesGraph, mega: m.rowBoundariesMega },
    { dim: m.rowHbm, fused: m.rowHbmFused, graph: m.rowHbmGraph, mega: m.rowHbmMega },
    { dim: m.rowFlex, fused: m.rowFlexFused, graph: m.rowFlexGraph, mega: m.rowFlexMega },
    { dim: m.rowEffort, fused: m.rowEffortFused, graph: m.rowEffortGraph, mega: m.rowEffortMega },
  ]

  const results = [m.resultsHazy1, m.resultsHazy2, m.resultsMpk]
  const whenNot = [m.whenNot1, m.whenNot2, m.whenNot3, m.whenNot4]

  const sources = [
    { label: m.srcHazyBubbles, href: 'https://hazyresearch.stanford.edu/blog/2025-05-27-no-bubbles' },
    { label: m.srcHazyTp, href: 'https://hazyresearch.stanford.edu/blog/2025-09-28-tp-llama-main' },
    { label: m.srcMpk, href: 'https://arxiv.org/abs/2512.22219' },
    { label: m.srcVllmGraphs, href: 'https://docs.vllm.ai/en/latest/design/cuda_graphs.html' },
    {
      label: m.srcPdl,
      href: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#programmatic-dependent-launch-and-synchronization',
    },
  ]

  return (
    <TopicLayout
      topicId="mega-kernels"
      title={m.title}
      description={m.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: m.title },
      ]}
    >
      {/* Problem */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.problemTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{m.problemIntro}</p>
        <p className="text-muted leading-relaxed mt-4">{m.problemBatch}</p>
        <Link
          href={`/${locale}/ai/llm-inference/batching`}
          className="inline-block mt-3 text-sm font-medium text-primary-light hover:underline"
        >
          {m.batchingLink}
        </Link>
      </section>

      {/* Fused Kernel */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.fusedTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{m.fusedIntro}</p>
        <div className="mt-8 space-y-4">
          {/* Without fusion */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
            <div className="text-sm font-bold text-orange-400 mb-3">{m.fusedUnfusedLabel}</div>
            <div className="flex flex-wrap items-center gap-2">
              {[m.opMatMul, m.opBias, m.opGelu].map((op, i) => (
                <div key={op} className="flex items-center gap-2">
                  {i > 0 && (
                    <div className="flex flex-col items-center">
                      <span className="text-orange-400 font-bold">→</span>
                      <span className="text-[10px] text-orange-300/70">{m.hbmLabel}</span>
                    </div>
                  )}
                  <span className="px-3 py-2 rounded-lg bg-background border border-orange-500/30 text-sm font-mono text-text">
                    {op}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">{m.fusedUnfusedDesc}</p>
          </div>
          {/* With fusion */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20">
            <div className="text-sm font-bold text-green-400 mb-3">{m.fusedFusedLabel}</div>
            <div className="inline-flex flex-wrap items-center gap-2 px-4 py-3 rounded-xl bg-background border border-green-500/30">
              {[m.opMatMul, m.opBias, m.opGelu].map((op, i) => (
                <div key={op} className="flex items-center gap-2">
                  {i > 0 && <span className="text-green-400 font-bold">→</span>}
                  <span className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-sm font-mono text-text">
                    {op}
                  </span>
                </div>
              ))}
              <span className="text-[10px] px-2 py-1 rounded bg-green-500/10 text-green-300 border border-green-500/20 font-mono">
                {m.fusedOnChip}
              </span>
            </div>
            <p className="text-xs text-muted mt-3">{m.fusedFusedDesc}</p>
          </div>
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{m.benefitLaunchTitle}</h3>
            <p className="text-sm text-muted">{m.benefitLaunchDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{m.benefitMemoryTitle}</h3>
            <p className="text-sm text-muted">{m.benefitMemoryDesc}</p>
          </div>
        </div>
        <p className="text-muted leading-relaxed mt-6">{m.fusedLimit}</p>
      </section>

      {/* Kernel boundaries */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.boundaryTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{m.boundaryIntro}</p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {boundaryCards.map((card) => (
            <div key={card.title} className={`p-5 rounded-xl bg-background border ${card.border}`}>
              <h3 className={`text-lg font-bold font-heading mb-2 ${card.color}`}>{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CUDA Graphs */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.graphTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{m.graphIntro}</p>
        <p className="text-muted leading-relaxed mt-4">{m.graphLimit}</p>
        <p className="text-muted leading-relaxed mt-4">{m.graphShapes}</p>
      </section>

      {/* Mega-Kernel */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.megaTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{m.megaIntro}</p>
        <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
          <h3 className="text-lg font-bold font-heading text-primary-light mb-1">{m.megaPipelineTitle}</h3>
          <p className="text-xs text-muted mb-4">{m.megaPipelineDesc}</p>
          <div className="p-4 rounded-xl bg-background/60 border border-dashed border-primary/30">
            <div className="flex flex-wrap items-stretch gap-2">
              {pipelineSteps.map((step, i) => (
                <div key={step.name} className="flex items-center gap-2">
                  {i > 0 && <span className="text-primary-light font-bold">→</span>}
                  <div className="px-3 py-2 rounded-lg bg-surface border border-border min-w-[7rem] max-w-[11rem]">
                    <div className="text-sm font-bold text-text font-mono">{step.name}</div>
                    <div className="text-[10px] text-muted leading-tight mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-dashed border-primary/20 flex items-center gap-2">
              <span className="text-primary-light font-bold">⟲ ×16 →</span>
              <div className="px-3 py-2 rounded-lg bg-surface border border-border">
                <div className="text-sm font-bold text-text font-mono">{m.megaStep7}</div>
                <div className="text-[10px] text-muted leading-tight mt-0.5">{m.megaStep7Desc}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {mechanisms.map((card) => (
            <div key={card.title} className={`p-5 rounded-xl bg-gradient-to-br border ${card.bg}`}>
              <h3 className={`text-lg font-bold font-heading mb-2 ${card.color}`}>{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{m.demoTitle}</h2>
        <p className="text-muted mb-6">{m.demoDesc}</p>
        <MegaKernelTimelineDemo />
      </section>

      {/* Comparison table */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{m.compareTitle}</h2>
        <p className="text-muted mb-6">{m.compareSubtitle}</p>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 bg-background/60 text-sm font-bold">
            <div className="p-3 border-b md:border-b-0 md:border-r border-border text-muted">{m.tableDimension}</div>
            <div className="p-3 border-b md:border-b-0 md:border-r border-border text-cyan-400">{m.tableFused}</div>
            <div className="p-3 border-b md:border-b-0 md:border-r border-border text-emerald-400">{m.tableGraph}</div>
            <div className="p-3 border-border text-purple-400">{m.tableMega}</div>
          </div>
          {compareRows.map((row, i) => (
            <div key={row.dim} className={`grid grid-cols-1 md:grid-cols-4 text-sm ${i % 2 ? 'bg-background/30' : ''}`}>
              <div className="p-3 font-semibold text-text border-t border-border">{row.dim}</div>
              <div className="p-3 text-muted border-t border-border">{row.fused}</div>
              <div className="p-3 text-muted border-t border-border">{row.graph}</div>
              <div className="p-3 text-muted border-t border-border">{row.mega}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.resultsTitle}</h2>
        <ul className="space-y-4">
          {results.map((item) => (
            <li key={item} className="p-4 rounded-xl bg-background border border-border text-sm text-muted leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Persistent Kernels & MoE */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.persistentTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{m.persistentIntro}</p>
        <div className="mt-8 space-y-4">
          <div className="p-5 rounded-xl bg-background border border-border">
            <h3 className="text-lg font-bold font-heading text-text mb-1">{m.persistentLoopTitle}</h3>
            <p className="text-xs text-muted mb-4">{m.persistentLoopDesc}</p>
            <div className="flex flex-wrap items-center gap-2">
              {[m.persistentLoop1, m.persistentLoop2, m.persistentLoop3].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  {i > 0 && <span className="text-emerald-400 font-bold">→</span>}
                  <span className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm font-mono text-text">
                    {step}
                  </span>
                </div>
              ))}
              <span className="text-emerald-400 font-bold">⟲</span>
              <span className="text-xs text-muted">{m.persistentLoopAgain}</span>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
            <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{m.persistentMoeTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{m.persistentMoeDesc}</p>
          </div>
        </div>
      </section>

      {/* When not */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.whenNotTitle}</h2>
        <ul className="space-y-3">
          {whenNot.map((item) => (
            <li key={item} className="flex gap-3 items-start text-muted leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Key Insight */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.keyInsightTitle}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30">
          <div className="space-y-4">
            {[
              [m.keyInsightFusionLabel, m.keyInsightFusion, 'text-cyan-400'],
              [m.keyInsightGraphLabel, m.keyInsightGraph, 'text-emerald-400'],
              [m.keyInsightMegaLabel, m.keyInsightMega, 'text-purple-400'],
            ].map(([label, text, color]) => (
              <p key={label} className="text-lg text-text leading-relaxed">
                <span className={`font-bold ${color}`}>{label} </span>
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[m.takeaway1, m.takeaway2, m.takeaway3, m.takeaway4].map((item, i) => (
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
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-xl font-bold font-heading text-text mb-4">{m.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {sources.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noreferrer" className="text-primary-light hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
