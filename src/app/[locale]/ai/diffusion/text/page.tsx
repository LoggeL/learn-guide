'use client'

import { ExternalLink } from 'lucide-react'
import { TextDiffusionDemo } from '@/components/interactive/TextDiffusionDemo'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { Latex } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  { title: 'Austin et al. (2021): Structured Denoising Diffusion Models in Discrete State-Spaces (D3PM)', url: 'https://arxiv.org/abs/2107.03006' },
  { title: 'Li et al. (2022): Diffusion-LM Improves Controllable Text Generation', url: 'https://arxiv.org/abs/2205.14217' },
  { title: 'Sahoo et al. (2024): Simple and Effective Masked Diffusion Language Models (MDLM)', url: 'https://arxiv.org/abs/2406.07524' },
  { title: 'Lou, Meng & Ermon (2024): Discrete Diffusion Modeling by Estimating the Ratios of the Data Distribution (SEDD)', url: 'https://arxiv.org/abs/2310.16834' },
  { title: 'Nie et al. (2025): Large Language Diffusion Models (LLaDA)', url: 'https://arxiv.org/abs/2502.09992' },
  { title: 'Wang et al. (2025): Remasking Discrete Diffusion Models with Inference-Time Scaling (ReMDM)', url: 'https://arxiv.org/abs/2503.00307' },
  { title: 'Wu et al. (2025): Fast-dLLM – Training-free Acceleration of Diffusion LLM', url: 'https://arxiv.org/abs/2505.22618' },
  { title: 'Arriola et al. (2025): Block Diffusion – Interpolating Between Autoregressive and Diffusion Language Models', url: 'https://arxiv.org/abs/2503.09573' },
  { title: 'Bie et al. (2025): LLaDA2.0 – Scaling Up Diffusion Language Models to 100B', url: 'https://arxiv.org/abs/2512.15745' },
  { title: 'Inception Labs (2025): Mercury – Ultra-Fast Language Models Based on Diffusion', url: 'https://arxiv.org/abs/2506.17298' },
  { title: 'Inception (Feb 2026): Mercury 2 launch announcement', url: 'https://www.businesswire.com/news/home/20260224034496/en' },
  { title: 'Google DeepMind: Gemini Diffusion', url: 'https://deepmind.google/models/gemini-diffusion/' },
  { title: 'The Decoder (Jun 2026): DiffusionGemma generates text from noise', url: 'https://the-decoder.com/googles-new-open-model-diffusiongemma-generates-text-from-noise-instead-of-word-by-word/' },
] as const

/** Source indices for each entry of t.textDiffusion.models (same order). */
const MODEL_SOURCES = [[4], [8], [9, 10], [11], [12]]

const F = {
  forward: String.raw`q\big(x_t^i = [\mathrm{MASK}] \mid x_0\big) = t,\qquad q\big(x_t^i = x_0^i \mid x_0\big) = 1 - t,\qquad t \in [0, 1]`,
  loss: String.raw`\mathcal{L}(\theta) = -\,\mathbb{E}_{t \sim \mathcal{U}[0,1],\ x_0,\ x_t}\Big[\frac{1}{t}\sum_{i=1}^{L} \mathbf{1}\big[x_t^i = [\mathrm{MASK}]\big]\,\log p_\theta\big(x_0^i \mid x_t\big)\Big]`,
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

function Formula({ children }: { children: string }) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl border border-primary/25 bg-primary/5 px-4 py-2 text-text">
      <Latex block>{children}</Latex>
    </div>
  )
}

const sectionClass = 'rounded-2xl bg-surface/50 border border-border p-6 md:p-8'
const headingClass = 'text-2xl font-bold font-heading text-gradient mb-6'

export default function TextDiffusionPage() {
  const { t } = useTranslation()
  const c = t.textDiffusion

  return (
    <TopicLayout
      topicId="text-diffusion"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.topicNames.diffusion, href: '/ai/diffusion' },
        { label: t.topicNames['text-diffusion'] },
      ]}
    >
      <section className={sectionClass}>
        <h2 className={headingClass}>{c.introTitle}</h2>
        <p className="text-muted leading-relaxed">{c.introBody}</p>
        <Formula>{F.forward}</Formula>
        <p className="text-muted leading-relaxed mb-4">{c.continuousBody}</p>
        <div className="flex flex-col gap-2">
          <SourceLink index={0} />
          <SourceLink index={1} />
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.objectiveTitle}</h2>
        <p className="text-muted leading-relaxed">{c.objectiveBody}</p>
        <Formula>{F.loss}</Formula>
        <p className="text-muted leading-relaxed mb-6">{c.objectiveNote}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-violet-200 mb-2">{c.mdlmTitle}</h3>
            <p className="text-sm text-muted leading-relaxed mb-3">{c.mdlmBody}</p>
            <SourceLink index={2} />
          </div>
          <div className="rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-5">
            <h3 className="text-base font-semibold font-heading text-fuchsia-200 mb-2">{c.seddTitle}</h3>
            <p className="text-sm text-muted leading-relaxed mb-3">{c.seddBody}</p>
            <SourceLink index={3} />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.samplingTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{c.samplingBody}</p>
        <p className="text-muted leading-relaxed mb-4">{c.independenceBody}</p>
        <p className="text-muted leading-relaxed mb-4">{c.revisionBody}</p>
        <div className="flex flex-col gap-2">
          <SourceLink index={4} />
          <SourceLink index={5} />
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.demoTitle}</h2>
        <p className="text-sm text-muted leading-relaxed mb-6">{c.demoBody}</p>
        <TextDiffusionDemo />
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.lengthTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{c.lengthBody}</p>
        <p className="text-sm text-muted leading-relaxed">{c.lengthCaveat}</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.kvTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.kvBody}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {c.kvFixes.map((item, i) => (
            <div key={item.title} className="rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-5">
              <h3 className="text-base font-semibold font-heading text-cyan-200 mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-3">{item.body}</p>
              <SourceLink index={i === 0 ? 6 : 7} />
            </div>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.modelsTitle}</h2>
        <div className="divide-y divide-border border-y border-border">
          {c.models.map((model, i) => (
            <article key={model.name} className="grid gap-2 py-5 md:grid-cols-[200px_minmax(0,1fr)]">
              <div>
                <h3 className="font-heading text-lg font-bold text-text">{model.name}</h3>
                <p className="text-xs text-muted">{model.org}</p>
              </div>
              <div>
                <p className="text-sm text-muted leading-relaxed mb-2">{model.body}</p>
                <div className="flex flex-col gap-1">
                  {MODEL_SOURCES[i]?.map((index) => <SourceLink key={index} index={index} />)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>{c.gapTitle}</h2>
        <p className="text-muted leading-relaxed mb-8">{c.gapBody}</p>
        <h3 className="mb-4 text-lg font-semibold font-heading text-text">{c.compareTitle}</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left">
                {c.compareHeaders.map((header, i) => (
                  <th key={i} className={`p-3 ${i === 2 ? 'text-violet-300' : i === 1 ? 'text-fuchsia-300' : 'text-muted'}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.compareRows.map((row) => (
                <tr key={row.dim} className="border-t border-border">
                  <td className="p-3 font-medium text-text">{row.dim}</td>
                  <td className="p-3 text-muted">{row.ar}</td>
                  <td className="p-3 text-muted">{row.diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
