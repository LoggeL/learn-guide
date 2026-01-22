'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function AlignmentPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.alignment.title}
      description={t.alignment.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.safety, href: '/' },
        { label: t.alignment.title },
      ]}
      nextTopic={{ label: t.topicNames.bias, href: '/ai/safety/bias' }}
    >
      {/* What is AI Alignment */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.alignment.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.alignment.whatIsDesc}
        </p>
      </section>

      {/* Why It Matters */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.alignment.whyMatters}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.alignment.whyMattersDesc}
        </p>
      </section>

      {/* Key Concepts */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.alignment.concepts}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.alignment.conceptsDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.alignment.outerAlignment}</h3>
            <p className="text-sm text-muted">{t.alignment.outerAlignmentDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.alignment.innerAlignment}</h3>
            <p className="text-sm text-muted">{t.alignment.innerAlignmentDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.alignment.specification}</h3>
            <p className="text-sm text-muted">{t.alignment.specificationDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.alignment.robustness}</h3>
            <p className="text-sm text-muted">{t.alignment.robustnessDesc}</p>
          </div>
        </div>
      </section>

      {/* Alignment Techniques */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.alignment.techniques}</h2>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.alignment.rlhf}</h4>
            <p className="text-sm text-muted">{t.alignment.rlhfDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.alignment.constitutionalAi}</h4>
            <p className="text-sm text-muted">{t.alignment.constitutionalAiDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.alignment.redTeaming}</h4>
            <p className="text-sm text-muted">{t.alignment.redTeamingDesc}</p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.alignment.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.alignment.takeaway1,
              t.alignment.takeaway2,
              t.alignment.takeaway3,
              t.alignment.takeaway4,
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
