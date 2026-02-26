'use client'

import { TextDiffusionDemo } from '@/components/interactive'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function TextDiffusionPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      topicId="text-diffusion"
      title={t.textDiffusion.title}
      description={t.textDiffusion.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.topicNames.diffusion, href: '/ai/diffusion' },
        { label: t.topicNames['text-diffusion'] },
      ]}
      prevTopic={{ label: t.topicNames['diffusion-fundamentals'], href: '/ai/diffusion/fundamentals' }}
      nextTopic={{ label: t.topicNames['image-diffusion'], href: '/ai/diffusion/image' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.textDiffusion.discreteVsContinuous}</h2>
        <p className="text-muted leading-relaxed">{t.textDiffusion.discreteVsContinuousDesc}</p>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.textDiffusion.maskPredict}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.textDiffusion.maskPredictDesc}</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-violet-200 mb-2">{t.textDiffusion.mdlmTitle}</h3>
            <p className="text-sm text-muted">{t.textDiffusion.mdlmDesc}</p>
          </div>
          <div className="rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-fuchsia-200 mb-2">{t.textDiffusion.seddTitle}</h3>
            <p className="text-sm text-muted">{t.textDiffusion.seddDesc}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.textDiffusion.paddingTokens}</h2>
        <p className="text-muted leading-relaxed">{t.textDiffusion.paddingTokensDesc}</p>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.textDiffusion.vsAutoregressive}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.textDiffusion.vsAutoregressiveDesc}</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-violet-200 mb-2">{t.textDiffusion.diffusionColumn}</h3>
            <p className="text-sm text-muted">{t.textDiffusion.diffusionColumnDesc}</p>
          </div>
          <div className="rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-fuchsia-200 mb-2">{t.textDiffusion.autoregressiveColumn}</h3>
            <p className="text-sm text-muted">{t.textDiffusion.autoregressiveColumnDesc}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.textDiffusion.interactiveTitle}</h2>
        <p className="text-sm text-muted mb-6">{t.textDiffusion.interactiveDesc}</p>
        <TextDiffusionDemo />
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.textDiffusion.keyTakeaways}</h2>
        <ul className="space-y-3 text-muted">
          <li>{t.textDiffusion.takeaway1}</li>
          <li>{t.textDiffusion.takeaway2}</li>
          <li>{t.textDiffusion.takeaway3}</li>
          <li>{t.textDiffusion.takeaway4}</li>
        </ul>
      </section>
    </TopicLayout>
  )
}
