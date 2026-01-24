'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { TrainingProgressVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function TrainingPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.training.title}
      description={t.training.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: t.training.title },
      ]}
      prevTopic={{ label: t.topicNames['gradient-descent'], href: '/ai/ml-fundamentals/gradient-descent' }}
    >
      {/* What is Training */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.training.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.training.whatIsDesc}
        </p>
      </section>

      {/* Training Phases */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.training.phases}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.training.phasesDesc}
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h4 className="font-bold text-blue-400 mb-2">{t.training.initialization}</h4>
            <p className="text-sm text-muted">{t.training.initializationDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h4 className="font-bold text-purple-400 mb-2">{t.training.forwardPass}</h4>
            <p className="text-sm text-muted">{t.training.forwardPassDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h4 className="font-bold text-cyan-400 mb-2">{t.training.lossCalc}</h4>
            <p className="text-sm text-muted">{t.training.lossCalcDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h4 className="font-bold text-emerald-400 mb-2">{t.training.backprop}</h4>
            <p className="text-sm text-muted">{t.training.backpropDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h4 className="font-bold text-orange-400 mb-2">{t.training.optimization}</h4>
            <p className="text-sm text-muted">{t.training.optimizationDesc}</p>
          </div>
        </div>
      </section>

      {/* Key Concepts */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.training.concepts}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.training.epoch}</h3>
            <p className="text-sm text-muted">{t.training.epochDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.training.batch}</h3>
            <p className="text-sm text-muted">{t.training.batchDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">{t.training.overfitting}</h3>
            <p className="text-sm text-muted">{t.training.overfittingDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.training.regularization}</h3>
            <p className="text-sm text-muted">{t.training.regularizationDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.training.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.training.demoDesc}</p>
          </div>
        </div>
        <TrainingProgressVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.training.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.training.takeaway1,
              t.training.takeaway2,
              t.training.takeaway3,
              t.training.takeaway4,
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
