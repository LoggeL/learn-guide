'use client'

import { CheckCircle2, Cpu, Layers, Sigma, Zap } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { NextTokenPredictionVisualizer, nextTokenLogitsByStep } from '@/components/interactive/NextTokenPredictionVisualizer'
import { useTranslation } from '@/lib/i18n/context'
import { softmax } from '@/lib/learning/decoding'

const SOURCES = [
  ['Hugging Face Transformers: Perplexity of fixed-length models', 'https://huggingface.co/docs/transformers/perplexity'],
  ['Jurafsky & Martin, Speech and Language Processing (3rd ed. draft), ch. 3: N-gram Language Models', 'https://web.stanford.edu/~jurafsky/slp3/3.pdf'],
] as const

// Step-1 distribution of the demo at T = 1, as the training loss sees it.
const STEP_ONE_PROBABILITIES = softmax(nextTokenLogitsByStep[0], 1)

export default function NextTokenPredictionPage() {
  const { t, locale } = useTranslation()
  const c = t.nextTokenPrediction
  const tr = c.training
  const num = (value: number, digits: number) => value.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })

  return (
    <TopicLayout
      topicId="next-token-prediction"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.title },
      ]}
    >
      <NextTokenPredictionVisualizer />

      <section className="grid gap-4 md:grid-cols-2">
        {c.sections.map((section, index) => (
          <article key={section.title} className="rounded-2xl border border-border bg-surface/55 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10">
                {index % 3 === 0 ? <Layers size={18} className="text-cyan-300" /> : index % 3 === 1 ? <Zap size={18} className="text-amber-300" /> : <Cpu size={18} className="text-violet-300" />}
              </div>
              <h3 className="font-heading text-xl font-bold text-text">{section.title}</h3>
            </div>
            <p className="mb-4 leading-relaxed text-muted">{section.body}</p>
            {section.bullets.length > 0 && (
              <ul className="space-y-2">
                {section.bullets.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/25 bg-violet-500/10">
            <Sigma size={18} className="text-violet-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{tr.title}</h2>
        </div>
        <p className="leading-relaxed text-muted">{tr.body}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <h3 className="mb-2 font-heading text-lg font-bold text-cyan-300">{tr.lossTitle}</h3>
            <p className="mb-3 font-mono text-sm text-cyan-200">L = −(1/N) Σₜ ln p(xₜ | x₁ … xₜ₋₁)</p>
            <p className="text-sm leading-relaxed text-muted">{tr.lossBody}</p>
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
            <h3 className="mb-2 font-heading text-lg font-bold text-violet-300">{tr.perplexityTitle}</h3>
            <p className="mb-3 font-mono text-sm text-violet-200">PPL = exp(L)</p>
            <p className="text-sm leading-relaxed text-muted">{tr.perplexityBody}</p>
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-heading text-lg font-bold text-text">{tr.exampleTitle}</h3>
          <p className="mb-3 text-sm leading-relaxed text-muted">{tr.exampleBody}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm tabular-nums">
              <thead className="text-muted">
                <tr>
                  <th className="p-2 text-left">{tr.columnToken}</th>
                  <th className="p-2">{tr.columnProbability}</th>
                  <th className="p-2">{tr.columnLoss}</th>
                  <th className="p-2">{tr.columnPerplexity}</th>
                </tr>
              </thead>
              <tbody>
                {c.viz.tokens.map((token, i) => {
                  const p = STEP_ONE_PROBABILITIES[i]
                  const loss = -Math.log(p)
                  return (
                    <tr key={token} className="border-t border-border">
                      <th className="p-2 text-left font-medium">{token}</th>
                      <td className="p-2 font-mono">{num(p, 3)}</td>
                      <td className="p-2 font-mono">{num(loss, 3)}</td>
                      <td className="p-2 font-mono">{num(Math.exp(loss), 2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted">{tr.note}</p>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text">{tr.sourcesTitle}</h3>
          <ul className="space-y-1 text-sm">
            {SOURCES.map(([label, href]) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-light underline-offset-4 hover:underline">{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-emerald-200">{c.takeawaysTitle}</h2>
        <ul className="space-y-3">
          {c.takeaways.map((item) => (
            <li key={item} className="flex gap-3 text-muted">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
