'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { AttentionVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function AttentionPage() {
  const { t } = useTranslation()

  const qkvCards = [
    { letter: 'Q', title: t.attention.queryTitle, desc: t.attention.queryDesc, color: 'purple' },
    { letter: 'K', title: t.attention.keyTitle, desc: t.attention.keyDesc, color: 'cyan' },
    { letter: 'V', title: t.attention.valueTitle, desc: t.attention.valueDesc, color: 'emerald' },
  ]

  const benefits = [
    { num: 1, title: t.attention.benefit1Title, desc: t.attention.benefit1Desc, color: 'purple' },
    { num: 2, title: t.attention.benefit2Title, desc: t.attention.benefit2Desc, color: 'cyan' },
    { num: 3, title: t.attention.benefit3Title, desc: t.attention.benefit3Desc, color: 'emerald' },
  ]

  return (
    <TopicLayout
      title={t.attention.title}
      description={t.attention.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/' },
        { label: t.attention.title },
      ]}
      prevTopic={{ label: t.topicNames.temperature, href: '/ai/llm/temperature' }}
      nextTopic={{ label: t.topicNames.vision, href: '/ai/llm/vision' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.attention.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            In the context of Neural Networks, <span className="text-primary-light font-semibold">Attention</span> is a 
            mechanism that allows a model to focus on specific parts of its input when producing an output. 
            {t.attention.whatIsDesc}
          </p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-lg text-text italic font-heading">
              "Attention is all you need."
            </p>
            <p className="text-sm text-muted mt-2">
              — The title of the 2017 paper that introduced the Transformer architecture
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Visualization */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">👁️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.attention.interactiveTitle}</h2>
            <p className="text-sm text-muted">{t.attention.interactiveDesc}</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">
          {t.attention.interactiveExplain}
        </p>
        <AttentionVisualizer />
      </section>

      {/* Core Concepts */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.attention.qkvTitle}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {qkvCards.map((card) => (
            <div key={card.letter} className={`p-6 rounded-xl bg-gradient-to-br from-${card.color}-500/10 to-${card.color}-500/5 border border-${card.color}-500/20`}>
              <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/20 flex items-center justify-center mb-4`}>
                <span className={`text-2xl font-bold text-${card.color}-400`}>{card.letter}</span>
              </div>
              <h3 className={`text-lg font-bold font-heading text-${card.color}-400 mb-2`}>{card.title}</h3>
              <p className="text-sm text-muted">{card.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 rounded-xl bg-surface border border-border text-center">
          <p className="text-muted">
            The model calculates a score by multiplying <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-semibold">Q</span> and <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold">K</span>. 
            This score determines how much of <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">V</span> to keep.
          </p>
        </div>
      </section>

      {/* Why it changed everything */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.attention.benefitsTitle}</h2>
        <div className="space-y-4">
          {benefits.map((item) => (
            <div key={item.num} className={`flex gap-5 p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center shrink-0`}>
                <span className={`text-xl font-bold text-${item.color}-400`}>{item.num}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.attention.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.attention.takeaway1,
              t.attention.takeaway2,
              t.attention.takeaway3,
              t.attention.takeaway4,
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
