'use client'

import { useState } from 'react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function ImageDiffusionPage() {
  const { t } = useTranslation()
  const c = t.vramCalc.audit
  const [guidance, setGuidance] = useState(1)

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
      prevTopic={{
        label: t.topicNames['text-diffusion'],
        href: '/ai/diffusion/text',
      }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">
          {t.imageDiffusion.latentPipeline}
        </h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.imageDiffusion.latentPipelineDesc}
        </p>

        <p className="text-muted mb-5">{c.imagePipelineNote}</p>
        <ol className="grid gap-3 sm:grid-cols-2">
          {c.imageSteps.map((label, i) => (
            <li key={label} className="rounded-xl border border-border p-4">
              <span className="text-primary-light">{i + 1}. </span>
              {label}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">
          {t.imageDiffusion.unetVsDit}
        </h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.imageDiffusion.unetVsDitDesc}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-violet-200 mb-2">
              {t.imageDiffusion.unetTitle}
            </h3>
            <p className="text-sm text-muted">{t.imageDiffusion.unetDesc}</p>
          </div>
          <div className="rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-fuchsia-200 mb-2">
              {t.imageDiffusion.ditTitle}
            </h3>
            <p className="text-sm text-muted">{t.imageDiffusion.ditDesc}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">
          {t.imageDiffusion.textConditioning}
        </h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.imageDiffusion.textConditioningDesc}
        </p>

        <div className="rounded-xl border border-purple-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5">
          <h3 className="text-base font-semibold font-heading text-violet-200 mb-2">
            {t.imageDiffusion.cfgTitle}
          </h3>
          <p className="text-sm text-muted">{t.imageDiffusion.cfgDesc}</p>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">
          {t.imageDiffusion.stepsTradeoff}
        </h2>
        <p className="text-muted leading-relaxed">
          {t.imageDiffusion.stepsTradeoffDesc}
        </p>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">
          {t.imageDiffusion.interactiveTitle}
        </h2>
        <p className="text-sm text-muted mb-6">
          {t.imageDiffusion.interactiveDesc}
        </p>
        <p className="text-sm text-muted mb-4">{c.imageFlowNote}</p>
        <label className="block">
          Guidance: {guidance.toFixed(1)}
          <input
            aria-label="Guidance"
            type="range"
            min={0}
            max={10}
            step={0.1}
            value={guidance}
            onChange={(e) => setGuidance(+e.target.value)}
            className="w-full"
          />
        </label>
        <div className="rounded-lg bg-background p-4 font-mono text-sm space-y-2">
          <div>εᵤ = [0.2, −0.4] · ε꜀ = [0.6, −0.1]</div>
          <div>ε = εᵤ + s(ε꜀ − εᵤ)</div>
          <div>
            ε = [{(0.2 + guidance * 0.4).toFixed(2)},{' '}
            {(-0.4 + guidance * 0.3).toFixed(2)}]
          </div>
        </div>
        <p className="text-sm text-muted mt-4">{c.imageGuidanceNote}</p>
        <a
          className="text-primary-light text-sm underline"
          href="https://arxiv.org/abs/2207.12598"
          target="_blank"
          rel="noreferrer"
        >
          Classifier-Free Diffusion Guidance (2022)
        </a>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">
          {t.imageDiffusion.keyTakeaways}
        </h2>
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
