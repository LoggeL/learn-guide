'use client'

import { CheckCircle2, Cpu, Layers, Zap } from 'lucide-react'
import { FeedForwardMoeVisualizer } from '@/components/interactive/FeedForwardMoeVisualizer'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Feed-Forward Networks & MoE',
    description: 'The per-token MLP blocks where much of a transformer’s capacity lives, plus how MoE routes tokens through experts.',
    crumb: 'Feed-Forward Networks',
    prev: 'Transformer Architecture',
    next: 'Residual Stream & LayerNorm',
    sections: [
      {
        title: 'The token-wise MLP',
        body: 'After attention mixes information across tokens, the feed-forward network processes each token independently. It expands the hidden vector, applies a nonlinearity, then compresses it back.',
        bullets: [
      'Expansion creates room for many features.',
      'The nonlinearity prevents the block from collapsing into one linear map.',
      'The compression writes a useful update back to the model width.',
      'Many parameters live in these blocks; factual and semantic patterns are distributed across weights and activations, not stored in one neat lookup table.'
    ],
      },
      {
        title: 'GELU, SwiGLU, and gates',
        body: 'Modern LLMs often use gated activations such as SwiGLU. One learned pathway controls another, letting the block select which features should pass through.',
        bullets: [
      'Original transformers used simpler activations such as ReLU.',
      'Many GPT-era models used GELU.',
      'LLaMA-style models commonly use SwiGLU variants.'
    ],
      },
      {
        title: 'Mixture of Experts',
        body: 'MoE replaces one dense MLP with many expert MLPs and a router that activates only a few for each token. This raises total parameters without using all of them every token.',
        bullets: [
      'MoE can be compute-efficient compared with a dense model of the same total parameter count.',
      'Experts may specialize, but not always in neat human topic categories.'
    ],
      }
    ],
    takeawaysTitle: 'Key Takeaways',
    takeaways: [
      'FFNs process tokens independently after attention has mixed context.',
      'SwiGLU-style gated MLPs are common in modern LLMs.',
      'MoE is many MLP experts plus learned routing, not magic subject drawers.'
    ],
  },
  de: {
    title: 'Feed-Forward Networks & MoE',
    description: 'Die tokenweisen MLP-Blöcke, in denen viel Transformer-Kapazität steckt, plus wie MoE Tokens zu Experts routet.',
    crumb: 'Feed-Forward Networks',
    prev: 'Transformer-Architektur',
    next: 'Residual Stream & LayerNorm',
    sections: [
      {
        title: 'Das tokenweise MLP',
        body: 'Nachdem Attention Informationen zwischen Tokens mischt, verarbeitet das Feed-Forward Network jedes Token unabhängig. Es expandiert den Hidden-Vektor, wendet eine Nichtlinearität an und komprimiert zurück.',
        bullets: [
      'Expansion schafft Platz für viele Features.',
      'Die Nichtlinearität verhindert, dass alles zu einer linearen Abbildung kollabiert.',
      'Die Kompression schreibt ein nützliches Update zurück auf Modellbreite.',
      'Viele Parameter stecken in diesen Blöcken; Fakten- und Bedeutungsstrukturen sind über Gewichte und Aktivierungen verteilt, nicht in einer sauberen Lookup-Tabelle.'
    ],
      },
      {
        title: 'GELU, SwiGLU und Gates',
        body: 'Moderne LLMs nutzen oft gated Activations wie SwiGLU. Ein gelernter Pfad steuert einen anderen und entscheidet, welche Features durchkommen.',
        bullets: [
      'Der originale Transformer nutzte einfachere Aktivierungen wie ReLU.',
      'Viele GPT-Ära-Modelle nutzten GELU.',
      'LLaMA-artige Modelle nutzen häufig SwiGLU-Varianten.'
    ],
      },
      {
        title: 'Mixture of Experts',
        body: 'MoE ersetzt ein dichtes MLP durch viele Expert-MLPs und einen Router, der pro Token nur wenige aktiviert. So steigt die Gesamtparameterzahl, ohne alle Parameter pro Token zu nutzen.',
        bullets: [
      'MoE kann effizienter sein als ein dichtes Modell gleicher Gesamtgröße.',
      'Experts können sich spezialisieren, aber nicht sauber wie menschliche Themenordner.'
    ],
      }
    ],
    takeawaysTitle: 'Kernaussagen',
    takeaways: [
      'FFNs verarbeiten Tokens unabhängig, nachdem Attention Kontext gemischt hat.',
      'SwiGLU-artige gated MLPs sind in modernen LLMs verbreitet.',
      'MoE ist viele MLP-Experts plus gelerntes Routing, keine magischen Themen-Schubladen.'
    ],
  },
}

export default function FeedForwardNetworksMoePage() {
  const { t, locale } = useTranslation()
  const c = locale === 'de' ? copy.de : copy.en

  return (
    <TopicLayout
      topicId="feed-forward-networks-moe"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.crumb },
      ]}
      prevTopic={{ label: c.prev, href: '/ai/llm/transformer-architecture' }}
      nextTopic={{ label: c.next, href: '/ai/llm/residual-stream-layer-norm' }}
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

      <FeedForwardMoeVisualizer locale={locale} />

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
