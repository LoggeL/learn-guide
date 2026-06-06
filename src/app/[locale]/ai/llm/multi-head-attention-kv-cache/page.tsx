'use client'

import { CheckCircle2, Cpu, Layers, Zap } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { MultiHeadKvCacheVisualizer } from '@/components/interactive/MultiHeadKvCacheVisualizer'
import { useLocale } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Multi-Head Attention & KV Cache',
    description: 'How attention runs many learned views in parallel, and why the KV cache dominates long-context inference memory.',
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
        title: 'KV cache, MQA, and GQA',
        body: 'During generation, old keys and values are stored so the model does not recompute the whole prompt for every new token. This KV cache grows with context length.',
        bullets: [
      'MQA lets many query heads share one key/value set.',
      'GQA groups query heads over fewer key/value heads.',
      'Both reduce KV-cache memory and bandwidth while keeping many query views.'
    ],
      }
    ],
    takeawaysTitle: 'Key Takeaways',
    takeaways: [
      'Heads are learned views, not fixed chunks.',
      'The KV cache is the main long-context inference memory cost.',
      'GQA/MQA reduce cache cost by sharing key/value heads.'
    ],
  },
  de: {
    title: 'Multi-Head Attention & KV-Cache',
    description: 'Wie Attention viele gelernte Blickwinkel parallel nutzt und warum der KV-Cache bei langem Kontext Speicher frisst.',
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
        title: 'KV-Cache, MQA und GQA',
        body: 'Bei der Generierung werden alte Keys und Values gespeichert, damit das Modell nicht für jedes neue Token den ganzen Prompt neu berechnen muss. Dieser KV-Cache wächst mit der Kontextlänge.',
        bullets: [
      'MQA lässt viele Query-Heads ein Key/Value-Set teilen.',
      'GQA gruppiert Query-Heads über weniger Key/Value-Heads.',
      'Beides reduziert Speicher und Bandbreite des KV-Caches.'
    ],
      }
    ],
    takeawaysTitle: 'Kernaussagen',
    takeaways: [
      'Heads sind gelernte Sichten, keine festen Vektorstücke.',
      'Der KV-Cache ist der zentrale Speicherfresser bei Long-Context-Inferenz.',
      'GQA/MQA senken Cache-Kosten durch geteilte Key/Value-Heads.'
    ],
  },
}

export default function MultiHeadAttentionKvCachePage() {
  const { locale } = useLocale()
  const c = locale === 'de' ? copy.de : copy.en

  return (
    <TopicLayout
      topicId="multi-head-attention-kv-cache"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'Large Language Models', href: '/ai/llm' },
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

      <MultiHeadKvCacheVisualizer />

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
