'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { PromptChainDemo } from '@/components/interactive/PromptChainDemo'
import { useTranslation } from '@/lib/i18n/context'

const TICKET_SCHEMA = {
  type: 'object',
  properties: {
    category: { type: 'string', enum: ['bug', 'billing', 'feature_request', 'other'] },
    urgency: { type: 'string', enum: ['low', 'normal', 'high'] },
    summary: { type: 'string' },
  },
  required: ['category', 'urgency', 'summary'],
  additionalProperties: false,
}

function Bullets({ items, marker, color }: { items: string[]; marker: string; color: string }) {
  return (
    <ul className="space-y-2">
      {items.map(item => (
        <li key={item} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
          <span className={`${color} mt-0.5 shrink-0`}>{marker}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function AdvancedPromptingPage() {
  const { t, locale } = useTranslation()
  const c = t.advancedPrompting

  return (
    <TopicLayout topicId="advanced-prompting"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.prompting, href: '/ai/prompting' },
        { label: c.title },
      ]}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.overview}</h2>
        <p className="text-muted leading-relaxed text-lg">{c.overviewDesc}</p>
      </section>

      {/* Technique chooser */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.chooserTitle}</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-muted">
              <tr>
                <th className="p-3 font-semibold">{c.chooserProblem}</th>
                <th className="p-3 font-semibold">{c.chooserTechnique}</th>
                <th className="p-3 font-semibold">{c.chooserCost}</th>
              </tr>
            </thead>
            <tbody>
              {c.chooser.map(row => (
                <tr key={row.problem} className="border-t border-border">
                  <td className="p-3 text-muted">{row.problem}</td>
                  <td className="p-3 font-medium text-text">{row.technique}</td>
                  <td className="p-3 text-muted">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reasoning models and effort */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.reasoningTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.reasoningDesc}</p>
        <div className="overflow-x-auto rounded-xl border border-border mb-6">
          <table className="w-full text-sm">
            <thead className="bg-background text-left text-muted">
              <tr>
                <th className="p-3 font-semibold">{c.effortProvider}</th>
                <th className="p-3 font-semibold">{c.effortParam}</th>
                <th className="p-3 font-semibold">{c.effortNote}</th>
              </tr>
            </thead>
            <tbody>
              {c.effortParams.map(row => (
                <tr key={row.provider} className="border-t border-border">
                  <td className="p-3 text-text">{row.provider}</td>
                  <td className="p-3 font-mono text-cyan-300 whitespace-nowrap">{row.param}</td>
                  <td className="p-3 text-muted">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Bullets items={c.reasoningTips} marker="→" color="text-cyan-400" />
        <p className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-sm text-muted">{c.reasoningCaveat}</p>
      </section>

      {/* Structured outputs */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.structuredTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{c.structuredDesc}</p>
        <div className="mb-6">
          <Bullets items={c.structuredProviders} marker="•" color="text-purple-400" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{c.structuredSchemaLabel}</h3>
            <pre className="p-4 bg-background rounded-xl border border-border overflow-x-auto text-sm text-purple-300 font-mono">{JSON.stringify(TICKET_SCHEMA, null, 2)}</pre>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{c.structuredOutputLabel}</h3>
            <pre className="p-4 bg-background rounded-xl border border-dashed border-border overflow-x-auto text-sm text-emerald-300 font-mono">{JSON.stringify({ category: 'billing', urgency: 'high', summary: c.structuredExampleSummary }, null, 2)}</pre>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted leading-relaxed">{c.structuredLimits}</p>
      </section>

      {/* Prompt chaining */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.chainingTitle}</h2>
        <p className="text-muted leading-relaxed mb-3">{c.chainingDesc}</p>
        <p className="text-sm text-muted leading-relaxed mb-6">{c.chainingWhen}</p>
        <PromptChainDemo />
      </section>

      {/* Long context */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.longContextTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{c.longContextDesc}</p>
        <div className="grid gap-6 lg:grid-cols-2">
          <Bullets items={c.longContextTips} marker="→" color="text-emerald-400" />
          <pre className="p-4 bg-background rounded-xl border border-border overflow-x-auto text-xs text-cyan-300 font-mono">{c.longContextCode}</pre>
        </div>
        <Link href={`/${locale}/ai/llm/context-rot`} className="mt-4 inline-block text-sm text-primary-light underline">{c.longContextLink}</Link>
      </section>

      {/* Few-shot */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.fewShotTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{c.fewShotDesc}</p>
        <Bullets items={c.fewShotTips} marker="•" color="text-purple-400" />
      </section>

      {/* Verification + ToT/GoT */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="p-6 rounded-2xl bg-surface/50 border border-border">
          <h2 className="text-xl font-bold font-heading text-gradient mb-4">{c.verifyTitle}</h2>
          <p className="text-sm text-muted leading-relaxed">{c.verifyDesc}</p>
        </div>
        <div className="p-6 rounded-2xl bg-surface/50 border border-border">
          <h2 className="text-xl font-bold font-heading text-gradient mb-4">{c.searchTitle}</h2>
          <p className="text-sm text-muted leading-relaxed">{c.searchDesc}</p>
        </div>
      </section>

      {/* Eval-driven iteration */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.evalTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.evalDesc}</p>
        <ol className="space-y-3">
          {c.evalSteps.map((step, i) => (
            <li key={step} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400 text-sm font-bold">{i + 1}</span>
              <span className="text-sm text-muted leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
        <Link href={`/${locale}/ai/agents/evaluation`} className="mt-4 inline-block text-sm text-primary-light underline">{c.evalLink}</Link>
      </section>

      {/* DSPy */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.dspyTitle}</h2>
        <p className="text-muted leading-relaxed">{c.dspyDesc}</p>
      </section>

      {/* Cost */}
      <section className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20">
        <h2 className="text-xl font-bold font-heading text-orange-400 mb-3">{c.costTitle}</h2>
        <p className="text-sm text-muted leading-relaxed">{c.costDesc}</p>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {c.takeaways.map((item, i) => (
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
      <section className="border-t border-border pt-5">
        <h2 className="font-semibold mb-3">{c.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {c.sources.map(source => (
            <li key={source.url}><a className="text-primary-light underline" href={source.url}>{source.label}</a></li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
