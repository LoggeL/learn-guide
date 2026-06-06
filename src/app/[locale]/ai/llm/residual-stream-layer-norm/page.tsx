'use client'

import { CheckCircle2, Cpu, Layers, Zap } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { ResidualStreamLayerNormVisualizer } from '@/components/interactive/ResidualStreamLayerNormVisualizer'
import { useLocale } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Residual Stream & LayerNorm',
    description: 'The running workspace that transformer layers read from and write to, and the normalization that keeps deep stacks trainable.',
    crumb: 'Residual Stream',
    prev: 'Feed-Forward Networks',
    next: 'Next-Token Prediction',
    sections: [
      {
        title: 'Layers add updates',
        body: 'A transformer layer does not replace a token representation from scratch. Attention and MLP blocks compute updates that are added to a shared residual stream.',
        bullets: [
      'The residual stream carries the current representation for every token.',
      'Each block reads it, computes an update, and writes back by addition.'
    ],
      },
      {
        title: 'Why residual connections matter',
        body: 'Residual connections make very deep networks easier to optimize because gradients and information can flow through many layers without every block having to perfectly preserve them.',
        bullets: [
      'This is one reason transformer stacks can be dozens or hundreds of layers deep.',
      'The stream is a vector workspace, not a literal database or memory file.'
    ],
      },
      {
        title: 'LayerNorm and pre-norm',
        body: 'Layer normalization keeps activations in a stable range. Modern decoder-only LLMs often use pre-norm: normalize before attention or MLP, then add the block output back.',
        bullets: [
      'Pre-norm improves training stability for deep models.',
      'Different model families vary in exact normalization choices, such as RMSNorm.'
    ],
      }
    ],
    takeawaysTitle: 'Key Takeaways',
    takeaways: [
      'The residual stream is the running vector workspace of the model.',
      'Transformer blocks add updates instead of replacing representations.',
      'LayerNorm/RMSNorm keeps deep stacks numerically stable.'
    ],
  },
  de: {
    title: 'Residual Stream & LayerNorm',
    description: 'Der laufende Arbeitsbereich, aus dem Transformer-Schichten lesen und in den sie schreiben, plus Normalisierung für trainierbare tiefe Stacks.',
    crumb: 'Residual Stream',
    prev: 'Feed-Forward Networks',
    next: 'Next-Token Prediction',
    sections: [
      {
        title: 'Schichten addieren Updates',
        body: 'Eine Transformer-Schicht ersetzt die Token-Repräsentation nicht komplett. Attention- und MLP-Blöcke berechnen Updates, die zum gemeinsamen Residual Stream addiert werden.',
        bullets: [
      'Der Residual Stream trägt die aktuelle Repräsentation für jedes Token.',
      'Jeder Block liest daraus, berechnet ein Update und schreibt per Addition zurück.'
    ],
      },
      {
        title: 'Warum Residual Connections wichtig sind',
        body: 'Residual Connections machen sehr tiefe Netze trainierbarer, weil Gradienten und Information durch viele Schichten fließen können, ohne dass jeder Block alles perfekt erhalten muss.',
        bullets: [
      'Darum können Transformer-Stacks dutzende oder hunderte Schichten tief sein.',
      'Der Stream ist ein Vektor-Arbeitsbereich, keine wörtliche Datenbank.'
    ],
      },
      {
        title: 'LayerNorm und Pre-Norm',
        body: 'Layer Normalization hält Aktivierungen in einem stabilen Bereich. Moderne decoder-only LLMs nutzen oft Pre-Norm: erst normalisieren, dann Attention oder MLP, danach residual addieren.',
        bullets: [
      'Pre-Norm verbessert Trainingsstabilität in tiefen Modellen.',
      'Modellfamilien unterscheiden sich in Details, etwa RMSNorm.'
    ],
      }
    ],
    takeawaysTitle: 'Kernaussagen',
    takeaways: [
      'Der Residual Stream ist der laufende Vektor-Arbeitsbereich des Modells.',
      'Transformer-Blöcke addieren Updates, statt Repräsentationen zu ersetzen.',
      'LayerNorm/RMSNorm hält tiefe Stacks numerisch stabil.'
    ],
  },
}

export default function ResidualStreamLayerNormPage() {
  const { locale } = useLocale()
  const c = locale === 'de' ? copy.de : copy.en

  return (
    <TopicLayout
      topicId="residual-stream-layer-norm"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'Large Language Models', href: '/ai/llm' },
        { label: c.crumb },
      ]}
      prevTopic={{ label: c.prev, href: '/ai/llm/feed-forward-networks-moe' }}
      nextTopic={{ label: c.next, href: '/ai/llm/next-token-prediction' }}
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

      <ResidualStreamLayerNormVisualizer />

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
