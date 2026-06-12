'use client'

import { CheckCircle2, Cpu, Layers, Zap } from 'lucide-react'
import { PositionalEncodingRopeVisualizer } from '@/components/interactive/PositionalEncodingRopeVisualizer'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Positional Encoding & RoPE',
    description: 'How transformer LLMs know token order, why RoPE is common, and why long context can still miss the middle.',
    crumb: 'Positional Encoding',
    prev: 'Embeddings',
    next: 'Attention Mechanism',
    sections: [
      {
        title: 'Why position has to be added',
        body: 'Self-attention sees token vectors, but order is not built in. Without a position signal, the model has no direct way to distinguish “dog bites man” from “man bites dog”.',
        bullets: [
      'Early transformers added fixed sinusoidal patterns to token embeddings.',
      'Learned absolute position embeddings assign a learned vector to each slot.',
      'Both approaches give order information, but long-context generalization can be fragile.'
    ],
      },
      {
        title: 'RoPE in modern LLMs',
        body: 'Rotary Position Embeddings rotate parts of the query and key vectors by an angle based on position. When attention compares two tokens, relative distance is encoded in the rotation difference.',
        bullets: [
      'RoPE is common in LLaMA-, Mistral-, Gemma-, and Qwen-style models.',
      'It does not add a separate learned vector for every absolute position.',
      'Long-context models often extend RoPE with scaling or interpolation tricks.'
    ],
      },
      {
        title: 'Lost in the middle',
        body: 'More context length does not mean perfect recall. Models often use information near the beginning or end of a prompt more reliably than information buried in the middle.',
        bullets: [
      'Position encodings, attention patterns, training mix, and prompt structure all matter.',
      'Important facts should be placed clearly and retrieved or verified when stakes are high.'
    ],
      }
    ],
    takeawaysTitle: 'Key Takeaways',
    takeaways: [
      'Transformers need explicit position information; self-attention alone is order-agnostic.',
      'RoPE encodes relative distance through rotations in Q/K space.',
      'Long context improves capacity, not guaranteed recall or reasoning.'
    ],
  },
  de: {
    title: 'Positionskodierung & RoPE',
    description: 'Wie Transformer-LLMs Token-Reihenfolge erkennen, warum RoPE üblich ist und warum langer Kontext trotzdem die Mitte verlieren kann.',
    crumb: 'Positionskodierung',
    prev: 'Einbettungen',
    next: 'Attention-Mechanismus',
    sections: [
      {
        title: 'Warum Position extra rein muss',
        body: 'Self-Attention sieht Token-Vektoren, aber Reihenfolge ist nicht eingebaut. Ohne Positionssignal kann das Modell nicht direkt unterscheiden, ob “Hund beißt Mann” oder “Mann beißt Hund” gemeint ist.',
        bullets: [
      'Frühe Transformer addierten feste Sinus-/Cosinus-Muster zu Embeddings.',
      'Gelernte absolute Positionen geben jedem Slot einen eigenen Vektor.',
      'Beides hilft, aber lange Kontexte generalisieren damit nicht automatisch sauber.'
    ],
      },
      {
        title: 'RoPE in modernen LLMs',
        body: 'Rotary Position Embeddings drehen Teile der Query- und Key-Vektoren abhängig von der Position. Beim Attention-Vergleich steckt die relative Entfernung dann in der Rotationsdifferenz.',
        bullets: [
      'RoPE steckt in vielen LLaMA-, Mistral-, Gemma- und Qwen-artigen Modellen.',
      'Es braucht keinen separaten gelernten Vektor für jede absolute Position.',
      'Long-Context-Modelle nutzen oft RoPE-Scaling oder Interpolation.'
    ],
      },
      {
        title: 'Lost in the middle',
        body: 'Mehr Kontext heißt nicht perfekte Erinnerung. Modelle nutzen Informationen am Anfang und Ende eines Prompts oft zuverlässiger als Informationen in der Mitte.',
        bullets: [
      'Positionskodierung, Attention-Muster, Trainingsmix und Prompt-Struktur spielen zusammen.',
      'Wichtige Fakten sollten klar platziert und bei Bedarf retrieved oder validiert werden.'
    ],
      }
    ],
    takeawaysTitle: 'Kernaussagen',
    takeaways: [
      'Transformer brauchen explizite Positionsinformation; Self-Attention allein kennt keine Reihenfolge.',
      'RoPE kodiert relative Distanz über Rotationen im Query/Key-Raum.',
      'Langer Kontext erhöht Kapazität, garantiert aber kein zuverlässiges Erinnern oder Reasoning.'
    ],
  },
}

export default function PositionalEncodingPage() {
  const { t, locale } = useTranslation()
  const c = locale === 'de' ? copy.de : copy.en

  return (
    <TopicLayout
      topicId="positional-encoding"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.crumb },
      ]}
      prevTopic={{ label: c.prev, href: '/ai/llm/embeddings' }}
      nextTopic={{ label: c.next, href: '/ai/llm/attention' }}
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

      <PositionalEncodingRopeVisualizer />

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
