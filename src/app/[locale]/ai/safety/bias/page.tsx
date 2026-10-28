'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { BiasDetectionDemo } from '@/components/interactive/BiasDetectionDemo'
import { useTranslation } from '@/lib/i18n/context'

const ORIGIN_STYLES = [
  { card: 'from-red-500/10 to-rose-500/10 border-red-500/20', title: 'text-red-400' },
  { card: 'from-orange-500/10 to-yellow-500/10 border-orange-500/20', title: 'text-orange-400' },
  { card: 'from-purple-500/10 to-pink-500/10 border-purple-500/20', title: 'text-purple-400' },
  { card: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20', title: 'text-cyan-400' },
]

const LLM_STYLES = ['text-purple-400', 'text-cyan-400', 'text-emerald-400', 'text-orange-400']

export default function BiasPage() {
  const { t } = useTranslation()
  const b = t.bias

  return (
    <TopicLayout topicId="bias"
      title={b.title}
      description={b.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.safety, href: '/ai/safety' },
        { label: b.title },
      ]}
    >
      {/* What is AI Bias */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{b.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">{b.whatIsDesc}</p>
      </section>

      {/* Where bias enters */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{b.originsTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{b.originsDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {b.origins.map((origin, i) => (
            <div key={origin.title} className={`p-5 bg-gradient-to-br border rounded-xl ${ORIGIN_STYLES[i % ORIGIN_STYLES.length].card}`}>
              <h3 className={`text-lg font-bold font-heading mb-1 ${ORIGIN_STYLES[i % ORIGIN_STYLES.length].title}`}>{origin.title}</h3>
              <p className="text-sm text-text mb-3">{origin.desc}</p>
              <p className="text-sm text-muted leading-relaxed">{origin.example}</p>
              <a className="inline-block mt-3 text-xs text-primary-light underline" href={origin.href} target="_blank" rel="noopener noreferrer">{origin.source}</a>
            </div>
          ))}
        </div>
      </section>

      {/* COMPAS + impossibility */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{b.compasTitle}</h2>
        <p className="text-muted leading-relaxed">{b.compasP1}</p>
        <p className="text-muted leading-relaxed">{b.compasP2}</p>
        <p className="text-muted leading-relaxed">{b.compasP3}</p>
        <div className="p-4 rounded-xl bg-background border border-primary/30 font-mono text-center text-text">{b.compasFormula}</div>
        <p className="text-muted leading-relaxed">{b.compasP4}</p>
        <p className="text-muted leading-relaxed">{b.compasP5}</p>
      </section>

      {/* Fairness criteria */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{b.metricsTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{b.metricsDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {b.metrics.map(metric => (
            <div key={metric.name} className="p-4 bg-background rounded-xl border border-border">
              <h3 className="font-bold text-text">{metric.name}</h3>
              <div className="text-sm font-mono text-cyan-400 my-2">{metric.formula}</div>
              <p className="text-sm text-muted">{metric.question}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-heading text-gradient">{b.interactiveDemo}</h2>
          <p className="text-sm text-muted mt-1">{b.demoDesc}</p>
        </div>
        <BiasDetectionDemo />
      </section>

      {/* LLM bias */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{b.llmTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{b.llmDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {b.llmCards.map((card, i) => (
            <div key={card.title} className="p-5 bg-surface/50 rounded-xl border border-border">
              <h3 className={`text-lg font-bold font-heading mb-2 ${LLM_STYLES[i % LLM_STYLES.length]}`}>{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
              <a className="inline-block mt-3 text-xs text-primary-light underline" href={card.href} target="_blank" rel="noopener noreferrer">{card.source}</a>
            </div>
          ))}
        </div>
      </section>

      {/* Mitigation */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{b.mitigation}</h2>
        <p className="text-muted leading-relaxed mb-6">{b.mitigationDesc}</p>
        <div className="space-y-4">
          {b.mitigationCards.map(card => (
            <div key={card.title} className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl">
              <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 p-4 rounded-xl border border-orange-500/30 bg-orange-500/5 text-sm text-muted leading-relaxed">{b.mitigationCaveat}</p>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{b.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {b.takeaways.map((item, i) => (
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
      <section className="border-t border-border pt-6">
        <h2 className="text-xl font-bold font-heading text-text mb-4">{b.references}</h2>
        <ul className="space-y-2 text-sm">
          {b.referenceList.map(ref => (
            <li key={ref.href + ref.label}>
              <a className="text-primary-light underline" href={ref.href} target="_blank" rel="noopener noreferrer">{ref.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
