'use client'

import { DiffusionNoiseVisualizer } from '@/components/interactive'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function ImageDiffusionPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      topicId="image-diffusion"
      title={t.imageDiffusion.title}
      description={t.imageDiffusion.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.topicNames.diffusion, href: '/ai/diffusion' },
        { label: t.topicNames['image-diffusion'] },
      ]}
      prevTopic={{ label: t.topicNames['text-diffusion'], href: '/ai/diffusion/text' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.imageDiffusion.latentPipeline}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.imageDiffusion.latentPipelineDesc}</p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4">
            <h3 className="text-sm font-semibold font-heading text-violet-200 mb-2">{t.imageDiffusion.pipelineEncodeTitle}</h3>
            <p className="text-sm text-muted">{t.imageDiffusion.pipelineEncodeDesc}</p>
          </div>
          <div className="rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-4">
            <h3 className="text-sm font-semibold font-heading text-purple-200 mb-2">{t.imageDiffusion.pipelineDenoiseTitle}</h3>
            <p className="text-sm text-muted">{t.imageDiffusion.pipelineDenoiseDesc}</p>
          </div>
          <div className="rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 p-4">
            <h3 className="text-sm font-semibold font-heading text-fuchsia-200 mb-2">{t.imageDiffusion.pipelineDecodeTitle}</h3>
            <p className="text-sm text-muted">{t.imageDiffusion.pipelineDecodeDesc}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.imageDiffusion.unetVsDit}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.imageDiffusion.unetVsDitDesc}</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-violet-200 mb-2">{t.imageDiffusion.unetTitle}</h3>
            <p className="text-sm text-muted">{t.imageDiffusion.unetDesc}</p>
          </div>
          <div className="rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-fuchsia-200 mb-2">{t.imageDiffusion.ditTitle}</h3>
            <p className="text-sm text-muted">{t.imageDiffusion.ditDesc}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.imageDiffusion.textConditioning}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.imageDiffusion.textConditioningDesc}</p>

        <div className="rounded-xl border border-purple-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5">
          <h3 className="text-base font-semibold font-heading text-violet-200 mb-2">{t.imageDiffusion.cfgTitle}</h3>
          <p className="text-sm text-muted">{t.imageDiffusion.cfgDesc}</p>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.imageDiffusion.stepsTradeoff}</h2>
        <p className="text-muted leading-relaxed">{t.imageDiffusion.stepsTradeoffDesc}</p>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.imageDiffusion.interactiveTitle}</h2>
        <p className="text-sm text-muted mb-6">{t.imageDiffusion.interactiveDesc}</p>
        <DiffusionNoiseVisualizer />
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.imageDiffusion.keyTakeaways}</h2>
        <ul className="space-y-3 text-muted">
          <li>{t.imageDiffusion.takeaway1}</li>
          <li>{t.imageDiffusion.takeaway2}</li>
          <li>{t.imageDiffusion.takeaway3}</li>
          <li>{t.imageDiffusion.takeaway4}</li>
        </ul>
      </section>
    </TopicLayout>
  )
}
