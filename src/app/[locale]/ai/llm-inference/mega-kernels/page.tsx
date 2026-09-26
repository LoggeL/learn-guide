'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function MegaKernelsPage() {
  const { t } = useTranslation()

  const compareRows = [
    { dim: t.megaKernels.rowScope, fused: t.megaKernels.rowScopeFused, mega: t.megaKernels.rowScopeMega },
    { dim: t.megaKernels.rowLaunches, fused: t.megaKernels.rowLaunchesFused, mega: t.megaKernels.rowLaunchesMega },
    { dim: t.megaKernels.rowHbm, fused: t.megaKernels.rowHbmFused, mega: t.megaKernels.rowHbmMega },
    { dim: t.megaKernels.rowComplexity, fused: t.megaKernels.rowComplexityFused, mega: t.megaKernels.rowComplexityMega },
    { dim: t.megaKernels.rowRegisters, fused: t.megaKernels.rowRegistersFused, mega: t.megaKernels.rowRegistersMega },
    { dim: t.megaKernels.rowScheduling, fused: t.megaKernels.rowSchedulingFused, mega: t.megaKernels.rowSchedulingMega },
    { dim: t.megaKernels.rowExamples, fused: t.megaKernels.rowExamplesFused, mega: t.megaKernels.rowExamplesMega },
  ]

  const pipelineSteps = [
    { name: t.megaKernels.megaStep1, desc: t.megaKernels.megaStep1Desc },
    { name: t.megaKernels.megaStep2, desc: t.megaKernels.megaStep2Desc },
    { name: t.megaKernels.megaStep3, desc: t.megaKernels.megaStep3Desc },
    { name: t.megaKernels.megaStep4, desc: t.megaKernels.megaStep4Desc },
    { name: t.megaKernels.megaStep5, desc: t.megaKernels.megaStep5Desc },
    { name: t.megaKernels.megaStep6, desc: t.megaKernels.megaStep6Desc },
    { name: t.megaKernels.megaStep7, desc: t.megaKernels.megaStep7Desc },
  ]

  return (
    <TopicLayout topicId="mega-kernels"
      title={t.megaKernels.title}
      description={t.megaKernels.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: t.megaKernels.title },
      ]}
    >
      {/* Fused Kernel */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.megaKernels.fusedTitle}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.megaKernels.fusedIntro}
          </p>
        </div>
        <div className="mt-8 space-y-4">
          {/* Without fusion */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
            <div className="text-sm font-bold text-orange-400 mb-3">{t.megaKernels.fusedUnfusedLabel}</div>
            <div className="flex flex-wrap items-center gap-2">
              {[t.megaKernels.opMatMul, t.megaKernels.opBias, t.megaKernels.opGelu].map((op, i) => (
                <div key={op} className="flex items-center gap-2">
                  {i > 0 && (
                    <div className="flex flex-col items-center">
                      <span className="text-orange-400 font-bold">→</span>
                      <span className="text-[10px] text-orange-300/70">HBM</span>
                    </div>
                  )}
                  <span className="px-3 py-2 rounded-lg bg-background border border-orange-500/30 text-sm font-mono text-text">{op}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">{t.megaKernels.fusedUnfusedDesc}</p>
          </div>
          {/* With fusion */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20">
            <div className="text-sm font-bold text-green-400 mb-3">{t.megaKernels.fusedFusedLabel}</div>
            <div className="inline-flex flex-wrap items-center gap-2 px-4 py-3 rounded-xl bg-background border border-green-500/30">
              {[t.megaKernels.opMatMul, t.megaKernels.opBias, t.megaKernels.opGelu].map((op, i) => (
                <div key={op} className="flex items-center gap-2">
                  {i > 0 && <span className="text-green-400 font-bold">→</span>}
                  <span className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-sm font-mono text-text">{op}</span>
                </div>
              ))}
              <span className="text-[10px] px-2 py-1 rounded bg-green-500/10 text-green-300 border border-green-500/20 font-mono">
                Register / Shared Memory
              </span>
            </div>
            <p className="text-xs text-muted mt-3">{t.megaKernels.fusedFusedDesc}</p>
          </div>
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.megaKernels.benefitLaunchTitle}</h3>
            <p className="text-sm text-muted">{t.megaKernels.benefitLaunchDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.megaKernels.benefitMemoryTitle}</h3>
            <p className="text-sm text-muted">{t.megaKernels.benefitMemoryDesc}</p>
          </div>
        </div>
      </section>

      {/* Mega-Kernel */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.megaKernels.megaTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{t.megaKernels.megaIntro}</p>
        <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
          <h3 className="text-lg font-bold font-heading text-primary-light mb-1">{t.megaKernels.megaPipelineTitle}</h3>
          <p className="text-xs text-muted mb-4">{t.megaKernels.megaPipelineDesc}</p>
          <div className="p-4 rounded-xl bg-background/60 border border-dashed border-primary/30">
            <div className="flex flex-wrap items-stretch gap-2">
              {pipelineSteps.map((step, i) => (
                <div key={step.name} className="flex items-center gap-2">
                  {i > 0 && <span className="text-primary-light font-bold">→</span>}
                  <div className="px-3 py-2 rounded-lg bg-surface border border-border min-w-[7rem]">
                    <div className="text-sm font-bold text-text font-mono">{step.name}</div>
                    <div className="text-[10px] text-muted leading-tight mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{t.megaKernels.compareTitle}</h2>
        <p className="text-muted mb-6">{t.megaKernels.compareSubtitle}</p>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 bg-background/60 text-sm font-bold">
            <div className="p-3 border-b md:border-b-0 md:border-r border-border text-muted">{t.megaKernels.tableDimension}</div>
            <div className="p-3 border-b md:border-b-0 md:border-r border-border text-cyan-400">{t.megaKernels.tableFused}</div>
            <div className="p-3 border-b md:border-b-0 border-border text-purple-400">{t.megaKernels.tableMega}</div>
          </div>
          {compareRows.map((row, i) => (
            <div key={row.dim} className={`grid grid-cols-1 md:grid-cols-3 text-sm ${i % 2 ? 'bg-background/30' : ''}`}>
              <div className="p-3 font-semibold text-text border-t border-border">{row.dim}</div>
              <div className="p-3 text-muted border-t border-border">{row.fused}</div>
              <div className="p-3 text-muted border-t border-border">{row.mega}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Persistent Kernels */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.megaKernels.persistentTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{t.megaKernels.persistentIntro}</p>
        <div className="mt-8 space-y-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.megaKernels.persistentWhatIs}</h3>
            <p className="text-sm text-muted leading-relaxed">{t.megaKernels.persistentWhatIsDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-background border border-border">
            <h3 className="text-lg font-bold font-heading text-text mb-1">{t.megaKernels.persistentLoopTitle}</h3>
            <p className="text-xs text-muted mb-4">{t.megaKernels.persistentLoopDesc}</p>
            <div className="flex flex-wrap items-center gap-2">
              {[t.megaKernels.persistentLoop1, t.megaKernels.persistentLoop2, t.megaKernels.persistentLoop3].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  {i > 0 && <span className="text-emerald-400 font-bold">→</span>}
                  <span className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm font-mono text-text">{step}</span>
                </div>
              ))}
              <span className="text-emerald-400 font-bold">⟲</span>
              <span className="text-xs text-muted">{t.megaKernels.persistentLoopAgain}</span>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
            <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{t.megaKernels.persistentMoeTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{t.megaKernels.persistentMoeDesc}</p>
          </div>
        </div>
      </section>

      {/* Key Insight */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.megaKernels.keyInsightTitle}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30">
          <div className="space-y-4">
            <p className="text-lg text-text leading-relaxed">
              <span className="font-bold text-primary-light">{t.megaKernels.keyInsightFusionLabel} = </span>
              {t.megaKernels.keyInsightFusion}
            </p>
            <p className="text-lg text-text leading-relaxed">
              <span className="font-bold text-accent">{t.megaKernels.keyInsightMegaLabel} = </span>
              {t.megaKernels.keyInsightMega}
            </p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.megaKernels.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.megaKernels.takeaway1,
              t.megaKernels.takeaway2,
              t.megaKernels.takeaway3,
              t.megaKernels.takeaway4,
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
