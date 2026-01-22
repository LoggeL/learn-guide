'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { BiasDetectionDemo } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function BiasPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.bias.title}
      description={t.bias.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.safety, href: '/' },
        { label: t.bias.title },
      ]}
      prevTopic={{ label: t.topicNames.alignment, href: '/ai/safety/alignment' }}
      nextTopic={{ label: t.topicNames['responsible-ai'], href: '/ai/safety/responsible-ai' }}
    >
      {/* What is AI Bias */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.bias.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.bias.whatIsDesc}
        </p>
      </section>

      {/* Sources of Bias */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.bias.sources}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.bias.sourcesDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">{t.bias.dataBias}</h3>
            <p className="text-sm text-muted">{t.bias.dataBiasDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.bias.labelBias}</h3>
            <p className="text-sm text-muted">{t.bias.labelBiasDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.bias.selectionBias}</h3>
            <p className="text-sm text-muted">{t.bias.selectionBiasDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.bias.measurementBias}</h3>
            <p className="text-sm text-muted">{t.bias.measurementBiasDesc}</p>
          </div>
        </div>
      </section>

      {/* Types of Bias */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.bias.types}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.bias.typesDesc}
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.bias.stereotyping}</h4>
            <p className="text-sm text-muted">{t.bias.stereotypingDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.bias.erasure}</h4>
            <p className="text-sm text-muted">{t.bias.erasureDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.bias.disparateImpact}</h4>
            <p className="text-sm text-muted">{t.bias.disparateImpactDesc}</p>
          </div>
        </div>
      </section>

      {/* Mitigation */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.bias.mitigation}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.bias.mitigationDesc}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.bias.diverseData}</h3>
            <p className="text-sm text-muted">{t.bias.diverseDataDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.bias.auditing}</h3>
            <p className="text-sm text-muted">{t.bias.auditingDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.bias.constraints}</h3>
            <p className="text-sm text-muted">{t.bias.constraintsDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">⚖️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.bias.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.bias.demoDesc}</p>
          </div>
        </div>
        <BiasDetectionDemo />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.bias.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.bias.takeaway1,
              t.bias.takeaway2,
              t.bias.takeaway3,
              t.bias.takeaway4,
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
