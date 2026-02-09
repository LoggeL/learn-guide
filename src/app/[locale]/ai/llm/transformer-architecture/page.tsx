'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { TransformerVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function TransformerArchitecturePage() {
  const { t } = useTranslation()

  const concepts = [
    { title: t.transformerArchitecture.concept1Title, desc: t.transformerArchitecture.concept1Desc, color: 'purple' },
    { title: t.transformerArchitecture.concept2Title, desc: t.transformerArchitecture.concept2Desc, color: 'cyan' },
    { title: t.transformerArchitecture.concept3Title, desc: t.transformerArchitecture.concept3Desc, color: 'emerald' },
  ]

  return (
    <TopicLayout topicId="transformer-architecture"
      title={t.transformerArchitecture.title}
      description={t.transformerArchitecture.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.transformerArchitecture.title },
      ]}
      prevTopic={{ label: t.topicNames.attention, href: '/ai/llm/attention' }}
      nextTopic={{ label: t.topicNames['llm-training'], href: '/ai/llm/training' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.transformerArchitecture.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.transformerArchitecture.whatIsDesc}
          </p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-lg text-text italic font-heading">
              &ldquo;Attention is all you need.&rdquo;
            </p>
            <p className="text-sm text-muted mt-2">
              {t.transformerArchitecture.paperCitation}
            </p>
          </div>
        </div>
      </section>

      {/* Bycroft LLM Visualizer — prominent link */}
      <section>
        <a
          href="https://bbycroft.net/llm"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300">
            <div className="rounded-2xl bg-background p-6 md:p-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                    <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold font-heading text-gradient group-hover:opacity-90 transition-opacity">
                      {t.transformerArchitecture.bycroftTitle}
                    </h3>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted group-hover:text-cyan-400 transition-colors shrink-0">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </div>
                  <p className="text-muted text-sm leading-relaxed mb-3">
                    {t.transformerArchitecture.bycroftDesc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">3D Interactive</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">By Brendan Bycroft</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/20">bbycroft.net/llm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </section>

      {/* Interactive: Layer Explorer */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.transformerArchitecture.layersHeading}</h2>
        <p className="text-muted mb-6">{t.transformerArchitecture.layersIntro}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <TransformerVisualizer section="layers" t={t.transformerArchitecture as unknown as Record<string, string>} />
        </div>
      </section>

      {/* Interactive: Encoder-Decoder */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.transformerArchitecture.archHeading}</h2>
        <p className="text-muted mb-6">{t.transformerArchitecture.archIntro}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <TransformerVisualizer section="encoder-decoder" t={t.transformerArchitecture as unknown as Record<string, string>} />
        </div>
      </section>

      {/* Interactive: Dataflow */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.transformerArchitecture.dataflowHeading}</h2>
        <p className="text-muted mb-6">{t.transformerArchitecture.dataflowIntro}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <TransformerVisualizer section="dataflow" t={t.transformerArchitecture as unknown as Record<string, string>} />
        </div>
      </section>

      {/* Key Concepts */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.transformerArchitecture.conceptsTitle}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {concepts.map((c) => (
            <div key={c.title} className={`p-6 rounded-xl bg-gradient-to-br from-${c.color}-500/10 to-${c.color}-500/5 border border-${c.color}-500/20`}>
              <h3 className={`text-lg font-bold font-heading text-${c.color}-400 mb-2`}>{c.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.transformerArchitecture.whyMattersTitle}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <p className="text-muted leading-relaxed mb-6">{t.transformerArchitecture.whyMattersDesc}</p>
          <ul className="space-y-4 text-text">
            {[
              t.transformerArchitecture.takeaway1,
              t.transformerArchitecture.takeaway2,
              t.transformerArchitecture.takeaway3,
              t.transformerArchitecture.takeaway4,
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
