'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { TemperatureDemo } from '@/components/interactive/TemperatureDemo'
import { LatexBlock } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  ['Qwen3-32B: Best practices', 'https://huggingface.co/Qwen/Qwen3-32B#best-practices'],
  ['Holtzman et al. (2019): The Curious Case of Neural Text Degeneration', 'https://arxiv.org/abs/1904.09751'],
  ['Nguyen et al. (2024): Turning Up the Heat: Min-p Sampling for Creative and Coherent LLM Outputs', 'https://arxiv.org/abs/2407.01082'],
  ['llama.cpp: sampler order (--samplers)', 'https://github.com/ggml-org/llama.cpp/blob/master/tools/cli/README.md'],
] as const

export default function TemperaturePage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="temperature"
      title={t.temperature.title}
      description={t.temperature.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.temperature.title },
      ]}
    >
      {/* What is Temperature */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.temperature.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            <span className="text-primary-light font-semibold">{t.temperature.whatIsTerm}</span> {t.temperature.whatIsDesc}
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
              <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.temperature.lowTemp}</h3>
              <p className="text-sm text-muted">{t.temperature.lowTempDesc}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
              <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.temperature.highTemp}</h3>
              <p className="text-sm text-muted">{t.temperature.highTempDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🎛️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.temperature.interactiveDistribution}</h2>
            <p className="text-sm text-muted">{t.temperature.adjustSlider}</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">
          {t.temperature.adjustDesc}
        </p>
        <TemperatureDemo />
      </section>

      {/* The Softmax Connection */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.temperature.howItWorks}</h2>
        <div className="space-y-6">
          <p className="text-muted leading-relaxed">
            {t.temperature.mathDesc}
          </p>
          
          <div className="bg-background border border-border rounded-xl p-8 flex justify-center overflow-x-auto">
            <div className="text-primary text-xl">
              <LatexBlock>
                {'P(x_i) = \\frac{e^{z_i / T}}{\\sum_{j} e^{z_j / T}}'}
              </LatexBlock>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-cyan-400 font-bold">{t.temperature.whenLow}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">{t.temperature.low}</span>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-3">
                {t.temperature.whenLowDesc}
              </p>
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <LatexBlock>{'\\lim_{T \\to 0} P(x_{\\text{max}}) = 1'}</LatexBlock>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-400 font-bold">{t.temperature.whenHigh}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">{t.temperature.high}</span>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-3">
                {t.temperature.whenHighDesc}
              </p>
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <LatexBlock>{'\\lim_{T \\to \\infty} P(x_i) = \\frac{1}{N}'}</LatexBlock>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Temperature with truncation samplers */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{t.temperature.truncationTitle}</h2>
        <p className="text-muted leading-relaxed">{t.temperature.truncationBody}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
            <p className="text-sm text-muted leading-relaxed">{t.temperature.truncationTopP}</p>
          </div>
          <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-sm text-muted leading-relaxed">{t.temperature.truncationMinP}</p>
          </div>
        </div>
        <p className="text-muted leading-relaxed">{t.temperature.truncationOrder}</p>
      </section>

      <section className="rounded-2xl border border-border p-5 sm:p-7 space-y-4">
        <h2 className="text-2xl font-semibold">{t.temperature.practicalGuidelines}</h2>
        <p className="text-muted">{t.temperature.guidelinesBody}</p>
        <p className="text-muted">{t.temperature.guidelinesExample}</p>
      </section>

      <section className="rounded-2xl border border-border p-5 sm:p-7 space-y-3">
        <h2 className="text-xl font-semibold">{t.temperature.sourcesTitle}</h2>
        <ul className="space-y-2">
          {SOURCES.map(([label, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-light underline">{label}</a>
            </li>
          ))}
        </ul>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.temperature.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.temperature.takeaway1,
              t.temperature.takeaway2,
              t.temperature.takeaway3,
              t.temperature.takeaway4,
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
