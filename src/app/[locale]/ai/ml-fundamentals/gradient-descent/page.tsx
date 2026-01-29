'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { GradientDescentVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function GradientDescentPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.gradientDescent.title}
      description={t.gradientDescent.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: t.gradientDescent.title },
      ]}
      prevTopic={{ label: t.topicNames['neural-networks'], href: '/ai/ml-fundamentals/neural-networks' }}
      nextTopic={{ label: t.topicNames.training, href: '/ai/ml-fundamentals/training' }}
    >
      {/* What is Gradient Descent */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.gradientDescent.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.gradientDescent.whatIsDesc}
        </p>
      </section>

      {/* The Intuition */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.gradientDescent.intuition}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.gradientDescent.intuitionDesc}
        </p>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.gradientDescent.howWorks}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.gradientDescent.howWorksDesc}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
              <span className="text-blue-400 font-bold">1</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.gradientDescent.step1}</h3>
            <p className="text-sm text-muted">{t.gradientDescent.step1Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
              <span className="text-purple-400 font-bold">2</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.gradientDescent.step2}</h3>
            <p className="text-sm text-muted">{t.gradientDescent.step2Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
              <span className="text-emerald-400 font-bold">3</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.gradientDescent.step3}</h3>
            <p className="text-sm text-muted">{t.gradientDescent.step3Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
              <span className="text-orange-400 font-bold">4</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.gradientDescent.step4}</h3>
            <p className="text-sm text-muted">{t.gradientDescent.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* Learning Rate */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.gradientDescent.learningRate}</h2>
        <p className="text-muted leading-relaxed">
          {t.gradientDescent.learningRateDesc}
        </p>
      </section>

      {/* Variants */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.gradientDescent.variants}</h2>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.gradientDescent.sgd}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.sgdDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.gradientDescent.momentum}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.momentumDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.gradientDescent.adam}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.adamDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h4 className="font-bold text-emerald-400 mb-2">{t.gradientDescent.adamw}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.adamwDesc}</p>
          </div>
        </div>
      </section>

      {/* Learning Rate Scheduling */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.gradientDescent.lrScheduling}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.gradientDescent.lrSchedulingDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
            <h4 className="font-bold text-blue-400 mb-2">{t.gradientDescent.stepDecay}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.stepDecayDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h4 className="font-bold text-purple-400 mb-2">{t.gradientDescent.exponentialDecay}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.exponentialDecayDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl">
            <h4 className="font-bold text-orange-400 mb-2">{t.gradientDescent.cosineAnnealing}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.cosineAnnealingDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
            <h4 className="font-bold text-emerald-400 mb-2">{t.gradientDescent.warmup}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.warmupDesc}</p>
          </div>
        </div>
      </section>

      {/* Convergence Challenges */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.gradientDescent.convergenceChallenges}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.gradientDescent.convergenceChallengesDesc}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h4 className="font-bold text-red-400 mb-2">{t.gradientDescent.localMinima}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.localMinimaDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h4 className="font-bold text-yellow-400 mb-2">{t.gradientDescent.saddlePoints}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.saddlePointsDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-slate-500/10 to-gray-500/10 border border-slate-500/20 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-slate-500/20 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-300 mb-2">{t.gradientDescent.plateaus}</h4>
            <p className="text-sm text-muted">{t.gradientDescent.plateausDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">📉</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.gradientDescent.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.gradientDescent.demoDesc}</p>
          </div>
        </div>
        <GradientDescentVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.gradientDescent.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.gradientDescent.takeaway1,
              t.gradientDescent.takeaway2,
              t.gradientDescent.takeaway3,
              t.gradientDescent.takeaway4,
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
