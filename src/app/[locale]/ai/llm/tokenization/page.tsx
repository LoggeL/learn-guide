'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { TokenizerDemo } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function TokenizationPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.tokenization.title}
      description={t.tokenization.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/' },
        { label: t.tokenization.title },
      ]}
      nextTopic={{ label: t.topicNames.embeddings, href: '/ai/llm/embeddings' }}
    >
      {/* What is Tokenization */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.tokenization.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.tokenization.whatIsDesc}
        </p>
      </section>

      {/* Why It Matters */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.tokenization.whyMatters}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.tokenization.whyMattersDesc}
        </p>
      </section>

      {/* How It Works */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.tokenization.howWorks}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.tokenization.howWorksDesc}
        </p>
        <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
          <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.tokenization.bpe}</h3>
          <p className="text-sm text-muted">{t.tokenization.bpeDesc}</p>
        </div>
      </section>

      {/* Token Types */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.tokenization.tokenTypes}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.tokenization.wholeWords}</h3>
            <p className="text-sm text-muted">{t.tokenization.wholeWordsDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.tokenization.subwords}</h3>
            <p className="text-sm text-muted">{t.tokenization.subwordsDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.tokenization.specialTokens}</h3>
            <p className="text-sm text-muted">{t.tokenization.specialTokensDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔤</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.tokenization.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.tokenization.demoDesc}</p>
          </div>
        </div>
        <TokenizerDemo />
      </section>

      {/* Cost Implications */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.tokenization.costImplications}</h2>
        <p className="text-muted leading-relaxed">
          {t.tokenization.costDesc}
        </p>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.tokenization.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.tokenization.takeaway1,
              t.tokenization.takeaway2,
              t.tokenization.takeaway3,
              t.tokenization.takeaway4,
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
