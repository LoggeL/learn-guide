'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { DiffusionNoiseVisualizer } from '@/components/interactive/DiffusionNoiseVisualizer'
import { DiffusionSamplerPlayground } from '@/components/interactive/DiffusionSamplerPlayground'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { Latex } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  { title: 'Ho, Jain & Abbeel (2020): Denoising Diffusion Probabilistic Models', url: 'https://arxiv.org/abs/2006.11239' },
  { title: 'Song, Meng & Ermon (2020): Denoising Diffusion Implicit Models', url: 'https://arxiv.org/abs/2010.02502' },
  { title: 'Song et al. (2021): Score-Based Generative Modeling through Stochastic Differential Equations', url: 'https://arxiv.org/abs/2011.13456' },
  { title: 'Vincent (2011): A Connection Between Score Matching and Denoising Autoencoders', url: 'https://doi.org/10.1162/NECO_a_00142' },
  { title: 'Nichol & Dhariwal (2021): Improved Denoising Diffusion Probabilistic Models', url: 'https://arxiv.org/abs/2102.09672' },
  { title: 'Salimans & Ho (2022): Progressive Distillation for Fast Sampling of Diffusion Models', url: 'https://arxiv.org/abs/2202.00512' },
  { title: 'Lipman et al. (2022): Flow Matching for Generative Modeling', url: 'https://arxiv.org/abs/2210.02747' },
  { title: 'Liu, Gong & Liu (2022): Flow Straight and Fast – Rectified Flow', url: 'https://arxiv.org/abs/2209.03003' },
  { title: 'Gao et al. (2024): Diffusion Meets Flow Matching – Two Sides of the Same Coin', url: 'https://diffusionflow.github.io/' },
  { title: 'Esser et al. (2024): Scaling Rectified Flow Transformers for High-Resolution Image Synthesis', url: 'https://arxiv.org/abs/2403.03206' },
  { title: 'Song et al. (2023): Consistency Models', url: 'https://arxiv.org/abs/2303.01469' },
  { title: 'Luo et al. (2023): Latent Consistency Models', url: 'https://arxiv.org/abs/2310.04378' },
  { title: 'Sauer et al. (2023): Adversarial Diffusion Distillation', url: 'https://arxiv.org/abs/2311.17042' },
] as const

const F = {
  forwardStep: String.raw`q(x_t \mid x_{t-1}) = \mathcal{N}\!\big(x_t;\ \sqrt{1-\beta_t}\,x_{t-1},\ \beta_t I\big)`,
  closedForm: String.raw`x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\varepsilon,\qquad \varepsilon \sim \mathcal{N}(0, I),\qquad \bar\alpha_t = \prod_{s=1}^{t}(1-\beta_s)`,
  loss: String.raw`\mathcal{L}_{\text{simple}}(\theta) = \mathbb{E}_{x_0,\,t,\,\varepsilon}\Big[\big\|\varepsilon - \varepsilon_\theta\big(\sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\varepsilon,\ t\big)\big\|^2\Big]`,
  x0Hat: String.raw`\hat x_0 = \frac{x_t - \sqrt{1-\bar\alpha_t}\;\varepsilon_\theta(x_t, t)}{\sqrt{\bar\alpha_t}}`,
  ddpm: String.raw`x_{t-1} = \frac{1}{\sqrt{\alpha_t}}\Big(x_t - \frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\varepsilon_\theta(x_t, t)\Big) + \sigma_t z,\qquad z \sim \mathcal{N}(0, I)`,
  ddim: String.raw`x_s = \sqrt{\bar\alpha_s}\,\hat x_0 + \sqrt{1-\bar\alpha_s-\sigma_t^2}\;\varepsilon_\theta(x_t, t) + \sigma_t z,\qquad \sigma_t = \eta\sqrt{\tfrac{1-\bar\alpha_s}{1-\bar\alpha_t}}\sqrt{1-\tfrac{\bar\alpha_t}{\bar\alpha_s}}`,
  score: String.raw`\nabla_{x_t}\log q(x_t \mid x_0) = -\frac{x_t - \sqrt{\bar\alpha_t}\,x_0}{1-\bar\alpha_t} = -\frac{\varepsilon}{\sqrt{1-\bar\alpha_t}}`,
  linear: String.raw`\beta_t = \beta_1 + \tfrac{t-1}{T-1}(\beta_T-\beta_1),\quad \beta_1 = 10^{-4},\ \beta_T = 0.02`,
  cosine: String.raw`\bar\alpha_t = \frac{f(t)}{f(0)},\qquad f(t) = \cos^2\!\Big(\frac{t/T + s}{1+s}\cdot\frac{\pi}{2}\Big)`,
  v: String.raw`v = \sqrt{\bar\alpha_t}\,\varepsilon - \sqrt{1-\bar\alpha_t}\,x_0`,
  flowPath: String.raw`x_t = (1-t)\,x_0 + t\,\varepsilon,\qquad t \in [0, 1]`,
  flowLoss: String.raw`\mathcal{L}_{\text{FM}}(\theta) = \mathbb{E}_{x_0,\,t,\,\varepsilon}\big\|(\varepsilon - x_0) - v_\theta(x_t, t)\big\|^2`,
}

function Formula({ children }: { children: string }) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl border border-primary/25 bg-primary/5 px-4 py-2 text-text">
      <Latex block>{children}</Latex>
    </div>
  )
}

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

export default function DiffusionFundamentalsPage() {
  const { t, locale } = useTranslation()
  const c = t.diffusionFundamentals

  return (
    <TopicLayout
      topicId="diffusion-fundamentals"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.topicNames.diffusion, href: '/ai/diffusion' },
        { label: t.topicNames['diffusion-fundamentals'] },
      ]}
    >
      <section className="rounded-2xl border border-border bg-gradient-to-br from-violet-500/10 via-surface/70 to-fuchsia-500/10 p-6 md:p-8">
        <h2 className={headingClass}>{c.introTitle}</h2>
        <p className="text-muted leading-relaxed">{c.introBody}</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.forwardTitle}</h2>
        <p className="text-muted leading-relaxed">{c.forwardBody}</p>
        <Formula>{F.forwardStep}</Formula>
        <p className="text-muted leading-relaxed">{c.closedFormBody}</p>
        <Formula>{F.closedForm}</Formula>
        <p className="text-muted leading-relaxed">{c.closedFormNote}</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.trainingTitle}</h2>
        <p className="text-muted leading-relaxed">{c.trainingBody}</p>
        <Formula>{F.loss}</Formula>
        <p className="text-muted leading-relaxed mb-4">{c.trainingNote}</p>
        <ol className="grid gap-3 sm:grid-cols-2">
          {c.trainingSteps.map((item, i) => (
            <li key={item} className="flex gap-3 rounded-xl border border-violet-500/25 bg-violet-500/5 p-4 text-sm text-muted">
              <span className="font-mono text-primary-light">{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <p className="text-muted leading-relaxed mt-6">{c.x0Body}</p>
        <Formula>{F.x0Hat}</Formula>
        <SourceLink index={0} />
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.reverseTitle}</h2>
        <p className="text-muted leading-relaxed">{c.reverseBody}</p>
        <Formula>{F.ddpm}</Formula>
        <p className="text-muted leading-relaxed mb-6">{c.ddpmNote}</p>
        <p className="text-muted leading-relaxed">{c.ddimBody}</p>
        <Formula>{F.ddim}</Formula>
        <p className="text-muted leading-relaxed mb-4">{c.ddimNote}</p>
        <SourceLink index={1} />
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.samplerTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.samplerBody}</p>
        <DiffusionSamplerPlayground />
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.scoreTitle}</h2>
        <p className="text-muted leading-relaxed">{c.scoreBody}</p>
        <Formula>{F.score}</Formula>
        <p className="text-muted leading-relaxed mb-4">{c.scoreNote}</p>
        <div className="flex flex-col gap-2">
          <SourceLink index={2} />
          <SourceLink index={3} />
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.schedulesTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.schedulesBody}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-orange-400/30 bg-orange-400/5 p-5">
            <h3 className="text-base font-semibold font-heading text-orange-300 mb-2">{c.linearTitle}</h3>
            <div className="overflow-x-auto text-sm text-text"><Latex>{F.linear}</Latex></div>
            <p className="mt-3 text-sm text-muted leading-relaxed">{c.linearBody}</p>
          </div>
          <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-5">
            <h3 className="text-base font-semibold font-heading text-cyan-300 mb-2">{c.cosineTitle}</h3>
            <div className="overflow-x-auto text-sm text-text"><Latex>{F.cosine}</Latex></div>
            <p className="mt-3 text-sm text-muted leading-relaxed">{c.cosineBody}</p>
          </div>
        </div>
        <h3 className="mt-8 mb-2 text-lg font-semibold font-heading text-text">{c.vizTitle}</h3>
        <p className="text-sm text-muted mb-4">{c.vizBody}</p>
        <DiffusionNoiseVisualizer />
        <div className="mt-4">
          <SourceLink index={4} />
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.paramTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{c.paramBody}</p>
        <Formula>{F.v}</Formula>
        <div className="grid gap-4 md:grid-cols-3">
          {c.paramItems.map((item) => (
            <div key={item.title} className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5">
              <h3 className="text-base font-semibold font-heading text-violet-200 mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <SourceLink index={5} />
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.flowTitle}</h2>
        <p className="text-muted leading-relaxed">{c.flowBody}</p>
        <Formula>{F.flowPath}</Formula>
        <p className="text-muted leading-relaxed">{c.flowTarget}</p>
        <Formula>{F.flowLoss}</Formula>
        <p className="text-muted leading-relaxed mb-4">{c.flowSampling}</p>
        <p className="text-muted leading-relaxed mb-4">{c.flowRelation}</p>
        <div className="flex flex-col gap-2">
          <SourceLink index={6} />
          <SourceLink index={7} />
          <SourceLink index={8} />
          <SourceLink index={9} />
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.fewStepTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.fewStepBody}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {c.fewStepItems.map((item) => (
            <div key={item.title} className="rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-5">
              <h3 className="text-base font-semibold font-heading text-fuchsia-200 mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          {c.fewStepLink}{' '}
          <Link href={`/${locale}/ai/diffusion/image`} className="inline-flex items-center gap-1 text-primary-light hover:underline">
            {t.topicNames['image-diffusion']}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
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
