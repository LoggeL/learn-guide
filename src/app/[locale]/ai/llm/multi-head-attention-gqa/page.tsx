'use client'

import { CheckCircle2, Cpu, Layers, Zap } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { MultiHeadGqaVisualizer } from '@/components/interactive/MultiHeadGqaVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Multi-Head Attention, MQA & GQA',
    description: 'How attention runs many learned views in parallel, and how MQA/GQA share key-value heads to reduce inference memory.',
    crumb: 'Multi-Head Attention',
    prev: 'Attention Mechanism',
    next: 'Transformer Architecture',
    sections: [
      {
        title: 'Heads are learned projections',
        body: 'Each head has its own learned Q, K, and V projection matrices. It is not a fixed slice of the original vector; it is a learned view of the full residual stream.',
        bullets: [
      'Different heads can track syntax, copying patterns, local order, or long-range references.',
      'Do not assume every head has a clean human-readable job. Many behaviors are distributed.'
    ],
      },
      {
        title: 'Concatenate, then mix',
        body: 'The head outputs are concatenated and passed through another learned output projection. That final projection mixes the parallel views back into one update.',
        bullets: [
      'Multi-head attention gives the layer several relationship detectors at once.',
      'The result is written back through the residual connection.'
    ],
      },
      {
        title: 'MQA and GQA share key-value heads',
        body: 'Standard multi-head attention can give every query head its own key/value heads. MQA and GQA keep many query views while sharing fewer key-value projections.',
        bullets: [
      'MQA lets many query heads share one key-value set.',
      'GQA groups query heads over fewer key-value heads.',
      'This reduces inference memory and bandwidth while preserving multiple query lenses.'
    ],
      }
    ],
    takeawaysTitle: 'Key Takeaways',
    takeaways: [
      'Heads are learned views, not fixed chunks.',
      'MQA/GQA are attention-architecture choices: many query views, fewer key-value heads.',
      'Sharing key-value heads reduces inference memory and bandwidth.'
    ],
  },
  de: {
    title: 'Multi-Head Attention, MQA & GQA',
    description: 'Wie Attention viele gelernte Blickwinkel parallel nutzt und wie MQA/GQA Key-Value-Heads teilen, um Inferenzspeicher zu sparen.',
    crumb: 'Multi-Head Attention',
    prev: 'Attention-Mechanismus',
    next: 'Transformer-Architektur',
    sections: [
      {
        title: 'Heads sind gelernte Projektionen',
        body: 'Jeder Head hat eigene gelernte Q-, K- und V-Projektionsmatrizen. Er bekommt keinen festen Slice des Originalvektors, sondern eine gelernte Sicht auf den ganzen Residual Stream.',
        bullets: [
      'Heads können Syntax, Copying-Muster, lokale Ordnung oder Langstreckenbezüge mittragen.',
      'Nicht jeder Head hat eine saubere menschenlesbare Aufgabe; vieles ist verteilt.'
    ],
      },
      {
        title: 'Konkatenieren, dann mischen',
        body: 'Die Ausgaben der Heads werden konkateniert und durch eine weitere gelernte Output-Projektion geschickt. Diese mischt die parallelen Sichten zurück zu einem Update.',
        bullets: [
      'Multi-Head Attention gibt einer Schicht mehrere Beziehungssucher gleichzeitig.',
      'Das Ergebnis wird über die Residual-Verbindung zurückgeschrieben.'
    ],
      },
      {
        title: 'MQA und GQA teilen Key-Value-Heads',
        body: 'Standard-Multi-Head-Attention kann jedem Query-Head eigene Key/Value-Heads geben. MQA und GQA behalten viele Query-Sichten, teilen aber weniger Key-Value-Projektionen.',
        bullets: [
      'MQA lässt viele Query-Heads ein Key-Value-Set teilen.',
      'GQA gruppiert Query-Heads über weniger Key-Value-Heads.',
      'Das reduziert Speicher und Bandbreite bei der Inferenz, ohne alle Query-Sichten aufzugeben.'
    ],
      }
    ],
    takeawaysTitle: 'Kernaussagen',
    takeaways: [
      'Heads sind gelernte Sichten, keine festen Vektorstücke.',
      'MQA/GQA sind Attention-Architektur: viele Query-Sichten, aber weniger Key-Value-Heads.',
      'Geteilte Key-Value-Heads senken Speicher und Bandbreite bei der Inferenz.'
    ],
  },
}

export default function MultiHeadAttentionGqaPage() {
  const { t, locale } = useTranslation()
  const c = locale === 'de' ? copy.de : copy.en

  return (
    <TopicLayout
      topicId="multi-head-attention-gqa"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.crumb },
      ]}
      prevTopic={{ label: c.prev, href: '/ai/llm/attention' }}
      nextTopic={{ label: c.next, href: '/ai/llm/transformer-architecture' }}
    >
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
            <Cpu size={21} className="text-primary-light" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.title}</h2>
        </div>
        <p className="text-lg leading-relaxed text-muted">{c.description}</p>
      </section>

      <MultiHeadGqaVisualizer />

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
