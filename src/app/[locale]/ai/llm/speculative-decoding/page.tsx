'use client'

import Link from 'next/link'
import { ArrowRight, Check, TriangleAlert } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { LatexBlock } from '@/components/ui/Latex'
import { SpeculativeDecodingVisualizer } from '@/components/interactive/SpeculativeDecodingVisualizer'
import { SpeculativeSamplingDemo } from '@/components/interactive/SpeculativeSamplingDemo'
import { useTranslation } from '@/lib/i18n/context'

// Roofline numbers: dense 70B model in BF16 on one H100 SXM (3.35 TB/s HBM3, ~989 dense BF16 TFLOP/s).
const WEIGHT_BYTES = 70e9 * 2
const HBM_BANDWIDTH = 3.35e12
const PEAK_FLOPS = 989e12
const FLOPS_PER_TOKEN = 2 * 70e9

const RESIDUAL = "p'(x) = \\frac{\\max\\big(0,\\; p(x) - q(x)\\big)}{\\sum_{y} \\max\\big(0,\\; p(y) - q(y)\\big)}"
const ALPHA = '\\alpha = \\mathbb{E}_{x \\sim q}\\!\\left[\\min\\!\\left(1, \\tfrac{p(x)}{q(x)}\\right)\\right] = \\sum_{x} \\min\\big(p(x), q(x)\\big) = 1 - \\operatorname{TV}(p, q)'
const PROOF = "P(x) = \\underbrace{q(x)\\,\\min\\!\\left(1, \\tfrac{p(x)}{q(x)}\\right)}_{\\min(p(x),\\,q(x))} + \\underbrace{(1-\\alpha)\\,p'(x)}_{\\max(0,\\,p(x)-q(x))} = p(x)"

// Order matches t.speculativeDecoding.variantsList: Medusa (index 3) is the only non-exact one.
const VARIANT_EXACT = [true, true, true, false, true, true]
const VARIANT_TONES = [
  'border-purple-500/20 bg-purple-500/5',
  'border-cyan-500/20 bg-cyan-500/5',
  'border-emerald-500/20 bg-emerald-500/5',
  'border-orange-500/20 bg-orange-500/5',
  'border-sky-500/20 bg-sky-500/5',
  'border-fuchsia-500/20 bg-fuchsia-500/5',
]

export default function SpeculativeDecodingPage() {
  const { t, locale } = useTranslation()
  const c = t.speculativeDecoding
  const nf = (value: number, digits = 2) =>
    value.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const roofline = [
    { label: c.rooflineMemory, value: `${nf((WEIGHT_BYTES / HBM_BANDWIDTH) * 1000, 1)} ms`, tone: 'text-orange-300' },
    { label: c.rooflineCompute, value: `${nf((FLOPS_PER_TOKEN / PEAK_FLOPS) * 1000, 2)} ms`, tone: 'text-cyan-300' },
    { label: c.rooflineVerify, value: `${nf(((5 * FLOPS_PER_TOKEN) / PEAK_FLOPS) * 1000, 2)} ms`, tone: 'text-cyan-300' },
  ]
  const steps = [
    { title: c.step1Title, desc: c.step1Desc, tone: 'bg-purple-500/20 text-purple-400' },
    { title: c.step2Title, desc: c.step2Desc, tone: 'bg-cyan-500/20 text-cyan-400' },
    { title: c.step3Title, desc: c.step3Desc, tone: 'bg-emerald-500/20 text-emerald-400' },
    { title: c.step4Title, desc: c.step4Desc, tone: 'bg-orange-500/20 text-orange-400' },
  ]
  const draftFree = [
    { title: c.promptLookupTitle, desc: c.promptLookupDesc },
    { title: c.jacobiTitle, desc: c.jacobiDesc },
    { title: c.lookaheadTitle, desc: c.lookaheadDesc },
  ]
  const takeaways = [c.takeaway1, c.takeaway2, c.takeaway3, c.takeaway4]

  return (
    <TopicLayout
      topicId="speculative-decoding"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.title },
      ]}
    >
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-6 font-heading text-2xl font-bold text-gradient">{c.whatIs}</h2>
        <p className="mb-4 text-lg leading-relaxed text-muted">{c.whatIsDesc}</p>
        <p className="leading-relaxed text-muted">{c.whatIsDesc2}</p>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.problem}</h2>
        <p className="mb-6 leading-relaxed text-muted">{c.problemDesc}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <h3 className="mb-2 font-semibold text-red-400">{c.bottleneck}</h3>
            <p className="text-sm text-muted">{c.bottleneckDesc}</p>
          </div>
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
            <h3 className="mb-2 font-semibold text-orange-400">{c.memoryBound}</h3>
            <p className="text-sm text-muted">{c.memoryBoundDesc}</p>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-border bg-background p-5">
          <h3 className="mb-2 font-heading font-semibold text-text">{c.rooflineTitle}</h3>
          <p className="mb-4 text-sm leading-relaxed text-muted">{c.rooflineDesc}</p>
          <div className="space-y-2">
            {roofline.map((row) => (
              <div key={row.label} className="flex flex-col justify-between gap-1 rounded-lg border border-border px-4 py-3 sm:flex-row sm:items-center">
                <span className="text-sm text-text">{row.label}</span>
                <span className={`font-mono text-lg ${row.tone}`}>{row.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">{c.rooflineConclusion}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.howItWorks}</h2>
        <p className="mb-6 leading-relaxed text-muted">{c.howItWorksDesc}</p>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold ${step.tone}`}>{i + 1}</span>
              <div>
                <h3 className="mb-1 font-semibold text-text">{step.title}</h3>
                <p className="text-sm text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.ruleTitle}</h2>
        <p className="mb-4 leading-relaxed text-muted">{c.ruleDesc}</p>
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-sm font-semibold text-emerald-300">{c.ruleAcceptLabel}</p>
            <LatexBlock className="overflow-x-auto text-text">{'\\min\\!\\left(1,\\; \\frac{p(x)}{q(x)}\\right)'}</LatexBlock>
          </div>
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="text-sm font-semibold text-cyan-300">{c.ruleResidualLabel}</p>
            <LatexBlock className="overflow-x-auto text-text">{RESIDUAL}</LatexBlock>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-muted">{c.ruleAlphaLabel}</p>
            <LatexBlock className="overflow-x-auto text-text">{ALPHA}</LatexBlock>
          </div>
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
            <h3 className="mb-2 font-heading font-semibold text-text">{c.ruleProofTitle}</h3>
            <p className="text-sm leading-relaxed text-muted">{c.ruleProofDesc}</p>
            <LatexBlock className="overflow-x-auto text-text">{PROOF}</LatexBlock>
          </div>
        </div>
        <p className="mt-4 border-l-2 border-cyan-500 pl-4 text-sm leading-relaxed text-muted">{c.ruleGreedyNote}</p>
      </section>

      <SpeculativeSamplingDemo key={`sampling-${locale}`} />

      <SpeculativeDecodingVisualizer />

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.variants}</h2>
        <p className="mb-6 leading-relaxed text-muted">{c.variantsDesc}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {c.variantsList.map((variant, i) => {
            const exact = VARIANT_EXACT[i] ?? true
            return (
              <div key={variant.title} className={`rounded-xl border p-4 ${VARIANT_TONES[i % VARIANT_TONES.length]}`}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-text">{variant.title}</h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
                      exact ? 'border-emerald-500/40 text-emerald-300' : 'border-orange-500/40 text-orange-300'
                    }`}
                  >
                    {exact ? <Check size={12} /> : <TriangleAlert size={12} />}
                    {exact ? c.exactLabel : c.approxLabel}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted">{variant.desc}</p>
              </div>
            )
          })}
        </div>
        <Link
          href={`/${locale}/ai/llm/mtp`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
        >
          {t.topicNames.mtp}
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.draftFreeTitle}</h2>
        <p className="mb-6 leading-relaxed text-muted">{c.draftFreeDesc}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {draftFree.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-background p-4">
              <h3 className="mb-2 font-semibold text-text">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.limitations}</h2>
        <p className="mb-6 leading-relaxed text-muted">{c.limitationsDesc}</p>
        <div className="space-y-4">
          {c.limitsList.map((limit) => (
            <div key={limit.title} className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
              <h3 className="mb-2 font-semibold text-orange-300">{limit.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{limit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-heading text-2xl font-bold text-gradient">{c.keyTakeaways}</h2>
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 md:p-8">
          <ul className="space-y-4 text-text">
            {takeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <span className="text-sm font-bold text-primary-light">{i + 1}</span>
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-xl font-semibold text-text">{c.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {c.sources.map((source) => (
            <li key={source.url}>
              <a className="text-cyan-300 underline hover:text-cyan-200" href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
