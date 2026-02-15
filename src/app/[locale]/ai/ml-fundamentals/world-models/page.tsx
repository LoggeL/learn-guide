'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function WorldModelsPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="world-models"
      title={t.worldModels.title}
      description={t.worldModels.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: t.worldModels.title },
      ]}
      prevTopic={{ label: t.topicNames['training'], href: '/ai/ml-fundamentals/training' }}
    >
      {/* What are World Models */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.worldModels.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">
          {t.worldModels.whatIsDesc}
        </p>
        <p className="text-muted leading-relaxed">
          {t.worldModels.whatIsDesc2}
        </p>
      </section>

      {/* How do they work */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.worldModels.howTheyWork}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.worldModels.howTheyWorkDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.worldModels.latentSpace}</h3>
            <p className="text-sm text-muted">{t.worldModels.latentSpaceDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.worldModels.videoPrediction}</h3>
            <p className="text-sm text-muted">{t.worldModels.videoPredictionDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.worldModels.physicsAware}</h3>
            <p className="text-sm text-muted">{t.worldModels.physicsAwareDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.worldModels.diffusion}</h3>
            <p className="text-sm text-muted">{t.worldModels.diffusionDesc}</p>
          </div>
        </div>
      </section>

      {/* Why do we need them */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.worldModels.whyNeeded}</h2>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.worldModels.slowExpensive}</h4>
            <p className="text-sm text-muted">{t.worldModels.slowExpensiveDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.worldModels.parallelTraining}</h4>
            <p className="text-sm text-muted">{t.worldModels.parallelTrainingDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.worldModels.physicsUnderstanding}</h4>
            <p className="text-sm text-muted">{t.worldModels.physicsUnderstandingDesc}</p>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.worldModels.examples}</h2>
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚗</span>
              <div>
                <h3 className="text-lg font-bold font-heading text-emerald-400 mb-1">{t.worldModels.nvidiaCosmos}</h3>
                <p className="text-sm text-muted">{t.worldModels.nvidiaCosmosDesc}</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <h3 className="text-lg font-bold font-heading text-purple-400 mb-1">{t.worldModels.googleGenie}</h3>
                <p className="text-sm text-muted">{t.worldModels.googleGenieDesc}</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <h3 className="text-lg font-bold font-heading text-blue-400 mb-1">{t.worldModels.genesis}</h3>
                <p className="text-sm text-muted">{t.worldModels.genesisDesc}</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="text-lg font-bold font-heading text-orange-400 mb-1">{t.worldModels.others}</h3>
                <p className="text-sm text-muted">{t.worldModels.othersDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.worldModels.useCases}</h2>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <div className="flex items-start gap-3">
              <span className="text-xl">🚙</span>
              <div>
                <h4 className="font-bold text-text mb-2">{t.worldModels.autonomousDriving}</h4>
                <p className="text-sm text-muted">{t.worldModels.autonomousDrivingDesc}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <div className="flex items-start gap-3">
              <span className="text-xl">🦾</span>
              <div>
                <h4 className="font-bold text-text mb-2">{t.worldModels.robotics}</h4>
                <p className="text-sm text-muted">{t.worldModels.roboticsDesc}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <div className="flex items-start gap-3">
              <span className="text-xl">🎬</span>
              <div>
                <h4 className="font-bold text-text mb-2">{t.worldModels.videoGeneration}</h4>
                <p className="text-sm text-muted">{t.worldModels.videoGenerationDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.worldModels.challenges}</h2>
            <p className="text-sm text-muted">{t.worldModels.challengesDesc}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">{t.worldModels.computeIntensive}</h3>
            <p className="text-sm text-muted">{t.worldModels.computeIntensiveDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{t.worldModels.simToReal}</h3>
            <p className="text-sm text-muted">{t.worldModels.simToRealDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.worldModels.generalization}</h3>
            <p className="text-sm text-muted">{t.worldModels.generalizationDesc}</p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.worldModels.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.worldModels.takeaway1,
              t.worldModels.takeaway2,
              t.worldModels.takeaway3,
              t.worldModels.takeaway4,
              t.worldModels.takeaway5,
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
