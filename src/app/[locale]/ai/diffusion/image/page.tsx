'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { DiffusionGuidanceVisualizer } from '@/components/interactive/DiffusionGuidanceVisualizer'
import { DiffusionJointAttentionDiagram } from '@/components/interactive/DiffusionJointAttentionDiagram'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { Latex } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  { title: 'Rombach et al. (2022): High-Resolution Image Synthesis with Latent Diffusion Models', url: 'https://arxiv.org/abs/2112.10752' },
  { title: 'Peebles & Xie (2023): Scalable Diffusion Models with Transformers (DiT)', url: 'https://arxiv.org/abs/2212.09748' },
  { title: 'Podell et al. (2023): SDXL – Improving Latent Diffusion Models for High-Resolution Image Synthesis', url: 'https://arxiv.org/abs/2307.01952' },
  { title: 'Esser et al. (2024): Scaling Rectified Flow Transformers for High-Resolution Image Synthesis (SD3)', url: 'https://arxiv.org/abs/2403.03206' },
  { title: 'Black Forest Labs: FLUX.1 [dev] model card', url: 'https://huggingface.co/black-forest-labs/FLUX.1-dev' },
  { title: 'Black Forest Labs: FLUX.1 [schnell] model card', url: 'https://huggingface.co/black-forest-labs/FLUX.1-schnell' },
  { title: 'Hugging Face (2025): Welcome FLUX.2', url: 'https://huggingface.co/blog/flux-2' },
  { title: 'Qwen Team (2025): Qwen-Image Technical Report', url: 'https://arxiv.org/abs/2508.02324' },
  { title: 'Ho & Salimans (2022): Classifier-Free Diffusion Guidance', url: 'https://arxiv.org/abs/2207.12598' },
  { title: 'Meng et al. (2023): On Distillation of Guided Diffusion Models', url: 'https://arxiv.org/abs/2210.03142' },
  { title: 'Luo et al. (2023): Latent Consistency Models', url: 'https://arxiv.org/abs/2310.04378' },
  { title: 'Luo et al. (2023): LCM-LoRA – A Universal Stable-Diffusion Acceleration Module', url: 'https://arxiv.org/abs/2311.05556' },
  { title: 'Sauer et al. (2023): Adversarial Diffusion Distillation (SDXL Turbo)', url: 'https://arxiv.org/abs/2311.17042' },
  { title: 'Sauer et al. (2024): Latent Adversarial Diffusion Distillation (LADD)', url: 'https://arxiv.org/abs/2403.12015' },
] as const

/** Source indices for each entry of t.imageDiffusion.distillItems (same order). */
const DISTILL_SOURCES = [[9, 4], [10, 11], [12, 13, 5]]

const CFG_FORMULA = String.raw`\tilde\varepsilon = \varepsilon_u + w\,(\varepsilon_c - \varepsilon_u)\qquad\Rightarrow\qquad \tilde s(x_t) = \nabla_{x_t} \log p(x_t) + w\,\nabla_{x_t} \log p(c \mid x_t)`

function SourceLink({ index }: { index: number }) {
  const source = SOURCES[index]
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-primary-light hover:underline">
      {source.title}
      <ExternalLink size={13} className="shrink-0" aria-hidden="true" />
    </a>
  )
}

const sectionClass = 'rounded-2xl bg-surface/50 border border-border p-6 md:p-8'
const headingClass = 'text-2xl font-bold font-heading text-gradient mb-6'

export default function ImageDiffusionPage() {
  const { t, locale } = useTranslation()
  const c = t.imageDiffusion

  return (
    <TopicLayout
      topicId="image-diffusion"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.topicNames.diffusion, href: '/ai/diffusion' },
        { label: t.topicNames['image-diffusion'] },
      ]}
    >
      <section className={sectionClass}>
        <h2 className={headingClass}>{c.latentTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.latentBody}</p>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {c.pipelineSteps.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4">
              <div className="mb-1 font-mono text-xs text-primary-light">{i + 1}</div>
              <h3 className="text-sm font-semibold font-heading text-violet-200 mb-1">{step.title}</h3>
              <p className="text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-muted mb-4">{c.pipelineNote}</p>
        <SourceLink index={0} />
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.backboneTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {c.backbones.map((item, i) => (
            <div key={item.title} className="rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-5">
              <h3 className="text-base font-semibold font-heading text-fuchsia-200 mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-3">{item.body}</p>
              <SourceLink index={[0, 1, 3][i] ?? 0} />
            </div>
          ))}
        </div>
        <h3 className="mt-8 mb-2 text-lg font-semibold font-heading text-text">{c.attentionTitle}</h3>
        <p className="text-sm text-muted leading-relaxed mb-4">{c.attentionBody}</p>
        <DiffusionJointAttentionDiagram />
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.encoderTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.encoderBody}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                {c.encoderHeaders.map((header) => (
                  <th key={header} className="p-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.encoderRows.map((row) => (
                <tr key={row.model} className="border-t border-border">
                  <td className="p-3 font-medium text-text">{row.model}</td>
                  <td className="p-3 text-muted">{row.backbone}</td>
                  <td className="p-3 text-muted">{row.objective}</td>
                  <td className="p-3 text-muted">{row.encoder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <SourceLink index={2} />
          <SourceLink index={3} />
          <SourceLink index={4} />
          <SourceLink index={7} />
          <SourceLink index={6} />
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.flowTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{c.flowBody}</p>
        <p className="text-sm text-muted">
          {c.flowLink}{' '}
          <Link href={`/${locale}/ai/diffusion/fundamentals`} className="inline-flex items-center gap-1 text-primary-light hover:underline">
            {t.topicNames['diffusion-fundamentals']}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.cfgTitle}</h2>
        <p className="text-muted leading-relaxed">{c.cfgBody}</p>
        <div className="my-5 overflow-x-auto rounded-xl border border-primary/25 bg-primary/5 px-4 py-2 text-text">
          <Latex block>{CFG_FORMULA}</Latex>
        </div>
        <p className="text-muted leading-relaxed mb-4">{c.cfgNote}</p>
        <SourceLink index={8} />
        <h3 className="mt-8 mb-2 text-lg font-semibold font-heading text-text">{c.cfgDemoTitle}</h3>
        <p className="text-sm text-muted mb-4">{c.cfgDemoBody}</p>
        <DiffusionGuidanceVisualizer />
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.distillTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.distillBody}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {c.distillItems.map((item, i) => (
            <div key={item.title} className="rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-5">
              <h3 className="text-base font-semibold font-heading text-cyan-200 mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-3">{item.body}</p>
              <div className="flex flex-col gap-1">
                {DISTILL_SOURCES[i]?.map((index) => <SourceLink key={index} index={index} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.stepsTitle}</h2>
        <p className="text-muted leading-relaxed">{c.stepsBody}</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.takeawaysTitle}</h2>
        <ul className="list-disc space-y-3 pl-5 text-muted">
          {c.takeaways.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl font-bold text-text">{c.sourcesTitle}</h2>
        <ul className="mt-4 space-y-3">
          {SOURCES.map((source, index) => (
            <li key={source.url}>
              <SourceLink index={index} />
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
