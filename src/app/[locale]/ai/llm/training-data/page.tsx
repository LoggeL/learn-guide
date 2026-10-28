'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { TrainingDataPipelineDemo } from '@/components/interactive/TrainingDataPipelineDemo'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  ['Penedo et al. (2024): The FineWeb Datasets', 'https://arxiv.org/abs/2406.17557'],
  ['Llama Team (2024): The Llama 3 Herd of Models', 'https://arxiv.org/abs/2407.21783'],
  ['Qwen Team (2025): Qwen3 Technical Report', 'https://arxiv.org/abs/2505.09388'],
  ['DeepSeek-AI (2024): DeepSeek-V3 Technical Report', 'https://arxiv.org/abs/2412.19437'],
  ['Brown et al. (2020): Language Models are Few-Shot Learners (GPT-3)', 'https://arxiv.org/abs/2005.14165'],
  ['Lee et al. (2021): Deduplicating Training Data Makes Language Models Better', 'https://arxiv.org/abs/2107.06499'],
  ['Hugging Face (2024): Cosmopedia', 'https://huggingface.co/blog/cosmopedia'],
  ['Maini et al. (2024): Rephrasing the Web (WRAP)', 'https://arxiv.org/abs/2401.16380'],
  ['NVIDIA (2024): Nemotron-4 340B Technical Report', 'https://arxiv.org/abs/2406.11704'],
  ['Shumailov et al. (2024): AI models collapse when trained on recursively generated data', 'https://www.nature.com/articles/s41586-024-07566-y'],
  ['Gerstgrasser et al. (2024): Is Model Collapse Inevitable?', 'https://arxiv.org/abs/2404.01413'],
  ['Zhang et al. (2024): A Careful Examination of LLM Performance on Grade School Arithmetic (GSM1k)', 'https://arxiv.org/abs/2405.00332'],
  ['Jain et al. (2024): LiveCodeBench', 'https://arxiv.org/abs/2403.07974'],
] as const

export default function TrainingDataPage() {
  const { t, locale } = useTranslation()
  const d = t.trainingData
  const href = (path: string) => `/${locale}${path}`

  // Llama 3 final pretraining mix, from the Llama 3 paper (section 3.1.2).
  const mix = [
    { label: d.mixGeneral, share: 50, color: 'bg-blue-400' },
    { label: d.mixMath, share: 25, color: 'bg-purple-400' },
    { label: d.mixCode, share: 17, color: 'bg-emerald-400' },
    { label: d.mixMultilingual, share: 8, color: 'bg-orange-400' },
  ]

  const synth = [
    { title: d.synthRephraseTitle, body: d.synthRephraseBody, box: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/20', text: 'text-cyan-400' },
    { title: d.synthVerifyTitle, body: d.synthVerifyBody, box: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20', text: 'text-emerald-400' },
    { title: d.synthAlignTitle, body: d.synthAlignBody, box: 'from-purple-500/10 to-pink-500/5 border-purple-500/20', text: 'text-purple-400' },
  ]

  return (
    <TopicLayout
      topicId="training-data"
      title={d.title}
      description={d.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: d.title },
      ]}
    >
      {/* Scale */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{d.scaleTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{d.scaleBody}</p>
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <p className="text-muted leading-relaxed text-sm">{d.scaleFineWeb}</p>
        </div>
      </section>

      {/* Pipeline demo */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{d.pipelineTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{d.pipelineDesc}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <TrainingDataPipelineDemo />
        </div>
      </section>

      {/* Mix and annealing */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{d.mixTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{d.mixBody}</p>
        <h3 className="text-sm font-bold text-text mb-3">{d.mixChartTitle}</h3>
        <div className="flex h-8 w-full overflow-hidden rounded-lg border border-border">
          {mix.map((m, i) => (
            <motion.div
              key={m.label}
              className={`${m.color} h-full`}
              initial={{ width: 0 }}
              whileInView={{ width: `${m.share}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
          ))}
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          {mix.map((m) => (
            <li key={m.label} className="flex items-center gap-2 text-muted">
              <span className={`h-3 w-3 shrink-0 rounded-sm ${m.color}`} aria-hidden="true" />
              <span>
                {m.label} <span className="font-mono text-text">{m.share}%</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-500/20">
          <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{d.annealTitle}</h3>
          <p className="text-sm text-muted leading-relaxed">{d.annealBody}</p>
          <p className="mt-3 text-sm text-muted">
            {d.annealLink}{' '}
            <Link href={href('/ai/llm/training')} className="text-cyan-300 underline">
              {t.topicNames['llm-training']}
            </Link>
          </p>
        </div>
      </section>

      {/* Synthetic data */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{d.synthTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{d.synthIntro}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {synth.map((s) => (
            <div key={s.title} className={`p-5 rounded-xl bg-gradient-to-br border ${s.box}`}>
              <h3 className={`text-lg font-bold font-heading mb-2 ${s.text}`}>{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
          <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{d.collapseTitle}</h3>
          <p className="text-sm text-muted leading-relaxed">{d.collapseBody}</p>
        </div>
      </section>

      {/* Contamination and rights */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-surface/50 border border-border p-6">
          <h2 className="text-xl font-bold font-heading text-text mb-3">{d.contamTitle}</h2>
          <p className="text-sm text-muted leading-relaxed">{d.contamBody}</p>
        </div>
        <div className="rounded-2xl bg-surface/50 border border-border p-6">
          <h2 className="text-xl font-bold font-heading text-text mb-3">{d.rightsTitle}</h2>
          <p className="text-sm text-muted leading-relaxed">{d.rightsBody}</p>
          <a
            className="mt-4 inline-block text-sm text-cyan-300 underline"
            href="https://digital-strategy.ec.europa.eu/en/policies/guidelines-gpai-providers"
            target="_blank"
            rel="noopener noreferrer"
          >
            {d.rightsLink}
          </a>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{d.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[d.takeaways.t1, d.takeaways.t2, d.takeaways.t3, d.takeaways.t4, d.takeaways.t5, d.takeaways.t6].map((item, i) => (
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

      {/* Sources */}
      <section>
        <h2 className="text-xl font-bold font-heading text-text mb-3">{d.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map(([label, url]) => (
            <li key={url}>
              <a href={url} className="text-cyan-300 underline" target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
