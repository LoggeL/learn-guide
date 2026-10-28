'use client'

import Link from 'next/link'
import { ArrowRight, AudioLines, ExternalLink, Eye, Film, Mic, Radio } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { MediaTokenBudget } from '@/components/interactive/MediaTokenBudget'
import { FusionArchitectureExplorer } from '@/components/interactive/FusionArchitectureExplorer'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  { title: 'Radford et al. (2022): Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)', url: 'https://arxiv.org/abs/2212.04356' },
  { title: 'Défossez et al. (2022): High Fidelity Neural Audio Compression (EnCodec)', url: 'https://github.com/facebookresearch/encodec' },
  { title: 'Défossez et al. (2024): Moshi – a speech-text foundation model for real-time dialogue (Mimi)', url: 'https://arxiv.org/abs/2410.00037' },
  { title: 'OpenAI (2024): Hello GPT-4o', url: 'https://openai.com/index/hello-gpt-4o/' },
  { title: 'Qwen Team (2025): Qwen2.5-Omni Technical Report', url: 'https://arxiv.org/abs/2503.20215' },
  { title: 'Wang et al. (2024): Qwen2-VL', url: 'https://arxiv.org/abs/2409.12191' },
  { title: 'Google: Gemini API – Video understanding (token calculation)', url: 'https://ai.google.dev/gemini-api/docs/video-understanding' },
  { title: 'Alayrac et al. (2022): Flamingo – a Visual Language Model for Few-Shot Learning', url: 'https://arxiv.org/abs/2204.14198' },
  { title: 'Chameleon Team (2024): Chameleon – Mixed-Modal Early-Fusion Foundation Models', url: 'https://arxiv.org/abs/2405.09818' },
  { title: 'Meta (2025): The Llama 4 herd', url: 'https://ai.meta.com/blog/llama-4-multimodal-intelligence/' },
  { title: 'Shukor et al. (2025): Scaling Laws for Native Multimodal Models', url: 'https://arxiv.org/abs/2504.07951' },
  { title: 'Zhou et al. (2024): Transfusion – Predict the Next Token and Diffuse Images with One Multi-Modal Model', url: 'https://arxiv.org/abs/2408.11039' },
  { title: 'OpenAI (2025): Addendum to GPT-4o System Card – 4o image generation', url: 'https://openai.com/index/gpt-4o-image-generation-system-card-addendum/' },
]

const RVQ_FRAMES = 5
const RVQ_CODEBOOKS = 8

function Chain({ steps, tone }: { steps: string[]; tone: string }) {
  return (
    <div className="flex flex-wrap items-stretch gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          {i > 0 && <span className={`font-bold ${tone}`}>→</span>}
          <span className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-text">{step}</span>
        </div>
      ))}
    </div>
  )
}

export default function MultimodalityPage() {
  const { t, locale } = useTranslation()
  const c = t.multimodality

  const videoSteps = [
    { title: c.videoStep1Title, desc: c.videoStep1Desc },
    { title: c.videoStep2Title, desc: c.videoStep2Desc },
    { title: c.videoStep3Title, desc: c.videoStep3Desc },
    { title: c.videoStep4Title, desc: c.videoStep4Desc },
  ]

  const outputRoutes = [
    { route: c.outputRoute1, predicts: c.outputRoute1Predicts, decoder: c.outputRoute1Decoder, example: c.outputRoute1Example },
    { route: c.outputRoute2, predicts: c.outputRoute2Predicts, decoder: c.outputRoute2Decoder, example: c.outputRoute2Example },
    { route: c.outputRoute3, predicts: c.outputRoute3Predicts, decoder: c.outputRoute3Decoder, example: c.outputRoute3Example },
    { route: c.outputRoute4, predicts: c.outputRoute4Predicts, decoder: c.outputRoute4Decoder, example: c.outputRoute4Example },
  ]

  const related = [
    { id: 'vision', path: '/ai/llm/vision' },
    { id: 'tokenization', path: '/ai/llm/tokenization' },
    { id: 'positional-encoding', path: '/ai/llm/positional-encoding' },
    { id: 'image-diffusion', path: '/ai/diffusion/image' },
  ] as const

  return (
    <TopicLayout topicId="multimodality"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.title },
      ]}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.introTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{c.introP1}</p>
        <ol className="mt-6 space-y-3">
          {[c.introQ1, c.introQ2, c.introQ3].map((q, i) => (
            <li key={q} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-light">{i + 1}</span>
              </span>
              <span className="text-text leading-relaxed">{q}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center gap-4">
          <Eye className="w-6 h-6 text-cyan-400 shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <div className="font-bold text-cyan-400 mb-1">{c.visionNoteTitle}</div>
            <p className="text-sm text-muted">{c.visionNote}</p>
          </div>
          <Link href={`/${locale}/ai/llm/vision`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light hover:underline shrink-0">
            {c.visionLink}<ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Token budget */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{c.budgetTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.budgetDesc}</p>
        <MediaTokenBudget />
      </section>

      {/* Audio */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.audioTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{c.audioIntro}</p>

        <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold font-heading text-purple-400">
            <AudioLines className="w-5 h-5" aria-hidden="true" />{c.melTitle}
          </h3>
          <Chain steps={[c.melStep1, c.melStep2, c.melStep3, c.melStep4]} tone="text-purple-400" />
          <p className="text-sm text-muted leading-relaxed">{c.melDesc}</p>
          <div className="p-4 rounded-lg bg-background border border-border">
            <div className="font-semibold text-text mb-1">{c.whisperTitle}</div>
            <p className="text-sm text-muted leading-relaxed">{c.whisperDesc}</p>
          </div>
        </div>

        <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-fuchsia-500/5 to-violet-500/5 border border-fuchsia-500/20 space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold font-heading text-fuchsia-400">
            <Radio className="w-5 h-5" aria-hidden="true" />{c.codecTitle}
          </h3>
          <Chain steps={[c.codecStep1, c.codecStep2, c.codecStep3, c.codecStep4]} tone="text-fuchsia-400" />
          <p className="text-sm text-muted leading-relaxed">{c.codecDesc}</p>
          <div className="p-4 rounded-lg bg-background border border-border">
            <div className="font-semibold text-text mb-3">{c.rvqTitle}</div>
            <div className="overflow-x-auto">
              <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${RVQ_FRAMES}, 2.5rem)` }} aria-hidden="true">
                {Array.from({ length: RVQ_FRAMES }, (_, f) => (
                  <div key={`h-${f}`} className="text-[10px] text-muted text-center font-mono">{c.rvqFrame} {f + 1}</div>
                ))}
                {Array.from({ length: RVQ_CODEBOOKS * RVQ_FRAMES }, (_, i) => {
                  const level = Math.floor(i / RVQ_FRAMES)
                  return (
                    <div
                      key={i}
                      className={`h-5 rounded-sm ${level === 0 ? 'bg-fuchsia-400' : 'bg-violet-400'}`}
                      style={{ opacity: level === 0 ? 0.95 : 0.75 - level * 0.07 }}
                    />
                  )
                })}
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-text"><span className="w-3 h-3 rounded-sm bg-fuchsia-400 shrink-0" aria-hidden="true" />{c.rvqSemantic}</div>
              <div className="flex items-center gap-2 text-text"><span className="w-3 h-3 rounded-sm bg-violet-400/60 shrink-0" aria-hidden="true" />{c.rvqAcoustic}</div>
            </div>
            <p className="mt-3 text-xs text-muted">{c.rvqCaption}</p>
          </div>
        </div>
      </section>

      {/* Speech-to-speech */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.speechTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{c.speechIntro}</p>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20 space-y-3">
            <div className="text-sm font-bold text-orange-400">{c.cascadeLabel}</div>
            <Chain steps={[c.cascadeStep1, c.cascadeStep2, c.cascadeStep3]} tone="text-orange-400" />
            <p className="text-sm text-muted leading-relaxed">{c.cascadeDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 space-y-3">
            <div className="text-sm font-bold text-emerald-400">{c.nativeLabel}</div>
            <Chain steps={[c.nativeStep1, c.nativeStep2, c.nativeStep3]} tone="text-emerald-400" />
            <p className="text-sm text-muted leading-relaxed">{c.nativeDesc}</p>
          </div>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-background rounded-xl border border-border">
            <h3 className="flex items-center gap-2 text-lg font-bold font-heading text-text mb-2">
              <Mic className="w-5 h-5 text-cyan-400" aria-hidden="true" />{c.moshiTitle}
            </h3>
            <p className="text-sm text-muted leading-relaxed">{c.moshiDesc}</p>
          </div>
          <div className="p-5 bg-background rounded-xl border border-border">
            <h3 className="flex items-center gap-2 text-lg font-bold font-heading text-text mb-2">
              <Mic className="w-5 h-5 text-purple-400" aria-hidden="true" />{c.omniTitle}
            </h3>
            <p className="text-sm text-muted leading-relaxed">{c.omniDesc}</p>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.videoTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{c.videoIntro}</p>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {videoSteps.map((step, i) => (
            <div key={step.title} className="p-5 bg-background rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="text-emerald-400 font-bold">{i + 1}</span>
                </span>
                <h3 className="text-lg font-bold font-heading text-text">{step.title}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex gap-3 items-start">
          <Film className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-text leading-relaxed">{c.videoConsequence}</p>
        </div>
      </section>

      {/* Fusion */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{c.fusionTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.fusionIntro}</p>
        <FusionArchitectureExplorer />
        <p className="mt-4 text-sm text-muted leading-relaxed p-4 rounded-xl bg-background border border-border">{c.fusionTerminology}</p>
      </section>

      {/* Output */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.outputTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{c.outputIntro}</p>
        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <div className="hidden md:grid md:grid-cols-4 bg-background/60 text-sm font-bold">
            <div className="p-3 border-r border-border text-muted">{c.outputColRoute}</div>
            <div className="p-3 border-r border-border text-cyan-400">{c.outputColPredicts}</div>
            <div className="p-3 border-r border-border text-purple-400">{c.outputColDecoder}</div>
            <div className="p-3 text-emerald-400">{c.outputColExample}</div>
          </div>
          {outputRoutes.map((row, i) => (
            <div key={row.route} className={`grid grid-cols-1 md:grid-cols-4 text-sm border-t border-border first:border-t-0 md:first:border-t ${i % 2 ? 'bg-background/30' : ''}`}>
              <div className="p-3 font-semibold text-text">{i + 1}. {row.route}</div>
              <div className="px-3 pb-2 md:p-3 text-muted"><span className="md:hidden text-xs text-cyan-400 block">{c.outputColPredicts}</span>{row.predicts}</div>
              <div className="px-3 pb-2 md:p-3 text-muted"><span className="md:hidden text-xs text-purple-400 block">{c.outputColDecoder}</span>{row.decoder}</div>
              <div className="px-3 pb-3 md:p-3 text-muted"><span className="md:hidden text-xs text-emerald-400 block">{c.outputColExample}</span>{row.example}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted leading-relaxed">{c.outputNote}</p>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[c.takeaway1, c.takeaway2, c.takeaway3, c.takeaway4, c.takeaway5].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary-light">{i + 1}</span>
                </span>
                <span className="text-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sources */}
      <section>
        <h2 className="font-heading text-xl font-bold text-text">{c.sourcesTitle}</h2>
        <ul className="mt-4 space-y-3">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-light hover:underline">
                {source.title}<ExternalLink size={14} className="shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Related */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.relatedTitle}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {related.map((item) => (
            <Link key={item.id} href={`/${locale}${item.path}`} className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/55 p-4 hover:border-primary/45">
              <span className="font-heading font-bold text-text group-hover:text-primary-light">{t.topicNames[item.id]}</span>
              <ArrowRight size={18} className="shrink-0 text-primary-light" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </TopicLayout>
  )
}
