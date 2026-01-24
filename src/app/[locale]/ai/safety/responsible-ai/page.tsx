'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function ResponsibleAIPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.responsibleAi.title}
      description={t.responsibleAi.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.safety, href: '/ai/safety' },
        { label: t.responsibleAi.title },
      ]}
      prevTopic={{ label: t.topicNames.bias, href: '/ai/safety/bias' }}
    >
      {/* What is Responsible AI */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.responsibleAi.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.responsibleAi.whatIsDesc}
        </p>
      </section>

      {/* Pillars */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.responsibleAi.pillars}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.responsibleAi.pillarsDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.responsibleAi.transparency}</h3>
            <p className="text-sm text-muted">{t.responsibleAi.transparencyDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.responsibleAi.accountability}</h3>
            <p className="text-sm text-muted">{t.responsibleAi.accountabilityDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.responsibleAi.privacy}</h3>
            <p className="text-sm text-muted">{t.responsibleAi.privacyDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.responsibleAi.safety}</h3>
            <p className="text-sm text-muted">{t.responsibleAi.safetyDesc}</p>
          </div>
        </div>
      </section>

      {/* Responsible Practices */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.responsibleAi.practices}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.responsibleAi.practicesDesc}
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.responsibleAi.documentation}</h4>
            <p className="text-sm text-muted">{t.responsibleAi.documentationDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.responsibleAi.testing}</h4>
            <p className="text-sm text-muted">{t.responsibleAi.testingDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.responsibleAi.monitoring}</h4>
            <p className="text-sm text-muted">{t.responsibleAi.monitoringDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.responsibleAi.feedback}</h4>
            <p className="text-sm text-muted">{t.responsibleAi.feedbackDesc}</p>
          </div>
        </div>
      </section>

      {/* Ethical Considerations */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.responsibleAi.considerations}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-green-400 mb-2">{t.responsibleAi.environmental}</h3>
            <p className="text-sm text-muted">{t.responsibleAi.environmentalDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{t.responsibleAi.labor}</h3>
            <p className="text-sm text-muted">{t.responsibleAi.laborDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.responsibleAi.access}</h3>
            <p className="text-sm text-muted">{t.responsibleAi.accessDesc}</p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.responsibleAi.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.responsibleAi.takeaway1,
              t.responsibleAi.takeaway2,
              t.responsibleAi.takeaway3,
              t.responsibleAi.takeaway4,
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
