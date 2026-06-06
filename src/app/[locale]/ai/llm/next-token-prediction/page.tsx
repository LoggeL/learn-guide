'use client'

import { CheckCircle2, Cpu, Layers, Zap } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { NextTokenPredictionVisualizer } from '@/components/interactive/NextTokenPredictionVisualizer'
import { useLocale } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Next-Token Prediction',
    description: 'What an LLM actually outputs: logits over the vocabulary, decoded one token at a time into text.',
    crumb: 'Next-Token Prediction',
    prev: 'Residual Stream & LayerNorm',
    next: 'LLM Training',
    sections: [
      {
        title: 'Logits over the vocabulary',
        body: 'At the end of the network, the final hidden vector is projected to one score for every token in the vocabulary. These raw scores are called logits.',
        bullets: [
      'A logit is not a word; it is a score for a token ID.',
      'Softmax turns logits into a probability distribution over possible next tokens.'
    ],
      },
      {
        title: 'Decoding choices',
        body: 'Generation depends on how the model chooses from those probabilities. Greedy decoding picks the top token, while sampling methods introduce controlled randomness.',
        bullets: [
      'Temperature reshapes the probability distribution.',
      'Top-k keeps only the k most likely tokens.',
      'Top-p keeps the smallest set whose probability mass reaches p.'
    ],
      },
      {
        title: 'The generation loop',
        body: 'The chosen token is appended to the context. The model runs again, predicts the next token, appends it, and repeats until it stops.',
        bullets: [
      'Training can predict many sequence positions in parallel with causal masking.',
      'Inference generation is sequential because each new token depends on the previous one.',
      'High probability means likely continuation, not guaranteed truth.'
    ],
      }
    ],
    takeawaysTitle: 'Key Takeaways',
    takeaways: [
      'LLMs output next-token probabilities, not direct truth claims.',
      'Decoding strategy changes style, determinism, and error profile.',
      'Text is produced by repeating predict → choose → append.'
    ],
  },
  de: {
    title: 'Next-Token Prediction',
    description: 'Was ein LLM tatsächlich ausgibt: Logits über das Vokabular, die Token für Token zu Text decodiert werden.',
    crumb: 'Next-Token Prediction',
    prev: 'Residual Stream & LayerNorm',
    next: 'LLM Training',
    sections: [
      {
        title: 'Logits über das Vokabular',
        body: 'Am Ende des Netzwerks wird der finale Hidden-Vektor auf einen Score pro Token im Vokabular projiziert. Diese rohen Scores heißen Logits.',
        bullets: [
      'Ein Logit ist kein Wort, sondern ein Score für eine Token-ID.',
      'Softmax verwandelt Logits in eine Wahrscheinlichkeitsverteilung über nächste Tokens.'
    ],
      },
      {
        title: 'Decoding-Entscheidungen',
        body: 'Generierung hängt davon ab, wie das Modell aus diesen Wahrscheinlichkeiten auswählt. Greedy Decoding nimmt das Top-Token, Sampling bringt kontrollierte Zufälligkeit hinein.',
        bullets: [
      'Temperature formt die Verteilung um.',
      'Top-k behält nur die k wahrscheinlichsten Tokens.',
      'Top-p behält die kleinste Tokenmenge mit Wahrscheinlichkeitsmasse p.'
    ],
      },
      {
        title: 'Die Generierungsschleife',
        body: 'Das gewählte Token wird an den Kontext gehängt. Das Modell läuft erneut, sagt das nächste Token voraus, hängt es an und wiederholt das.',
        bullets: [
      'Training kann viele Positionen parallel mit Causal Masking vorhersagen.',
      'Inference ist sequenziell, weil jedes neue Token vom vorherigen abhängt.',
      'Hohe Wahrscheinlichkeit heißt plausible Fortsetzung, nicht Wahrheit.'
    ],
      }
    ],
    takeawaysTitle: 'Kernaussagen',
    takeaways: [
      'LLMs geben Next-Token-Wahrscheinlichkeiten aus, keine direkten Wahrheitsbehauptungen.',
      'Die Decoding-Strategie verändert Stil, Determinismus und Fehlerprofil.',
      'Text entsteht durch wiederholtes predict → choose → append.'
    ],
  },
}

export default function NextTokenPredictionPage() {
  const { locale } = useLocale()
  const c = locale === 'de' ? copy.de : copy.en

  return (
    <TopicLayout
      topicId="next-token-prediction"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'Large Language Models', href: '/ai/llm' },
        { label: c.crumb },
      ]}
      prevTopic={{ label: c.prev, href: '/ai/llm/residual-stream-layer-norm' }}
      nextTopic={{ label: c.next, href: '/ai/llm/training' }}
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
