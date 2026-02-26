'use client'

import { DiffusionNoiseVisualizer } from '@/components/interactive'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function DiffusionFundamentalsPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      topicId="diffusion-fundamentals"
      title={t.diffusionFundamentals.title}
      description={t.diffusionFundamentals.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.topicNames.diffusion, href: '/ai/diffusion' },
        { label: t.topicNames['diffusion-fundamentals'] },
      ]}
      prevTopic={{ label: t.topicNames.diffusion, href: '/ai/diffusion' }}
      nextTopic={{ label: t.topicNames['text-diffusion'], href: '/ai/diffusion/text' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.diffusionFundamentals.forwardProcess}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.diffusionFundamentals.forwardProcessDesc}</p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4">
            <h3 className="text-sm font-semibold font-heading text-violet-200 mb-2">{t.diffusionFundamentals.forwardStep1Title}</h3>
            <p className="text-sm text-muted">{t.diffusionFundamentals.forwardStep1Desc}</p>
          </div>
          <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4">
            <h3 className="text-sm font-semibold font-heading text-violet-200 mb-2">{t.diffusionFundamentals.forwardStep2Title}</h3>
            <p className="text-sm text-muted">{t.diffusionFundamentals.forwardStep2Desc}</p>
          </div>
          <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4">
            <h3 className="text-sm font-semibold font-heading text-violet-200 mb-2">{t.diffusionFundamentals.forwardStep3Title}</h3>
            <p className="text-sm text-muted">{t.diffusionFundamentals.forwardStep3Desc}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.diffusionFundamentals.reverseProcess}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.diffusionFundamentals.reverseProcessDesc}</p>

        <div className="rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-5">
          <h3 className="text-base font-semibold font-heading text-purple-200 mb-2">{t.diffusionFundamentals.noisePredictionIntuition}</h3>
          <p className="text-sm text-muted leading-relaxed">{t.diffusionFundamentals.noisePredictionIntuitionDesc}</p>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.diffusionFundamentals.schedulers}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.diffusionFundamentals.schedulersDesc}</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-purple-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-violet-200 mb-2">{t.diffusionFundamentals.schedulerLinearTitle}</h3>
            <p className="text-sm text-muted">{t.diffusionFundamentals.schedulerLinearDesc}</p>
          </div>
          <div className="rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-fuchsia-200 mb-2">{t.diffusionFundamentals.schedulerCosineTitle}</h3>
            <p className="text-sm text-muted">{t.diffusionFundamentals.schedulerCosineDesc}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.diffusionFundamentals.scoreMatching}</h2>
        <p className="text-muted leading-relaxed">{t.diffusionFundamentals.scoreMatchingDesc}</p>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.diffusionFundamentals.interactiveTitle}</h2>
        <p className="text-sm text-muted mb-6">{t.diffusionFundamentals.interactiveDesc}</p>
        <DiffusionNoiseVisualizer />
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.diffusionFundamentals.keyTakeaways}</h2>
        <ul className="space-y-3 text-muted">
          <li>{t.diffusionFundamentals.takeaway1}</li>
          <li>{t.diffusionFundamentals.takeaway2}</li>
          <li>{t.diffusionFundamentals.takeaway3}</li>
          <li>{t.diffusionFundamentals.takeaway4}</li>
        </ul>
      </section>
    </TopicLayout>
  )
}
