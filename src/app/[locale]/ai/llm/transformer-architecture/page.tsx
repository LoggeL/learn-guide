'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { TransformerVisualizer } from '@/components/interactive/TransformerVisualizer'
import { useTranslation } from '@/lib/i18n/context'

// Pre-Norm decoder block as in Llama (2023/2024). Math notation, identical in all languages.
const MODERN_BLOCK = [
  'x = Embedding(token_ids)',
  'h = RMSNorm(x)',
  'q, k, v = h·W_Q, h·W_K, h·W_V;  q, k = RoPE(q, k)',
  'x = x + CausalAttention(q, k, v)·W_O',
  'h = RMSNorm(x)',
  'x = x + (SiLU(h·W_gate) ⊙ h·W_up)·W_down',
]

const SOURCES = [
  { title: 'Vaswani et al. (2017): Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762' },
  { title: 'Xiong et al. (2020): On Layer Normalization in the Transformer Architecture', url: 'https://arxiv.org/abs/2002.04745' },
  { title: 'Zhang & Sennrich (2019): Root Mean Square Layer Normalization', url: 'https://arxiv.org/abs/1910.07467' },
  { title: 'Su et al. (2021): RoFormer – Rotary Position Embedding', url: 'https://arxiv.org/abs/2104.09864' },
  { title: 'Shazeer (2020): GLU Variants Improve Transformer', url: 'https://arxiv.org/abs/2002.05202' },
  { title: 'Ainslie et al. (2023): GQA – Grouped-Query Attention', url: 'https://arxiv.org/abs/2305.13245' },
  { title: 'Touvron et al. (2023): LLaMA', url: 'https://arxiv.org/abs/2302.13971' },
  { title: 'Llama Team (2024): The Llama 3 Herd of Models', url: 'https://arxiv.org/abs/2407.21783' },
  { title: 'Geva et al. (2021): Transformer Feed-Forward Layers Are Key-Value Memories', url: 'https://arxiv.org/abs/2012.14913' },
  { title: 'Kaplan et al. (2020): Scaling Laws for Neural Language Models', url: 'https://arxiv.org/abs/2001.08361' },
  { title: 'Hoffmann et al. (2022): Training Compute-Optimal Large Language Models', url: 'https://arxiv.org/abs/2203.15556' },
  { title: 'Lieber et al. (2024): Jamba – A Hybrid Transformer-Mamba Language Model', url: 'https://arxiv.org/abs/2403.19887' },
  { title: 'NVIDIA (2025): Nemotron-H – Hybrid Mamba-Transformer Models', url: 'https://arxiv.org/abs/2504.03624' },
  { title: 'Qwen Team (2025): Qwen3-Next-80B-A3B model card', url: 'https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct' },
]

export default function TransformerArchitecturePage() {
  const { t, locale } = useTranslation()
  const ta = t.transformerArchitecture
  const vizT = ta as unknown as Record<string, string>
  const [modern, setModern] = useState(true)

  const concepts = [
    { title: ta.concept1Title, desc: ta.concept1Desc },
    { title: ta.concept2Title, desc: ta.concept2Desc },
    { title: ta.concept3Title, desc: ta.concept3Desc },
  ]

  const tabClass = (active: boolean) =>
    `rounded-lg border px-4 py-2 text-sm transition-colors ${active ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-border text-muted hover:border-cyan-500/40'}`

  return (
    <TopicLayout topicId="transformer-architecture"
      title={ta.title}
      description={ta.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: ta.title },
      ]}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{ta.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {ta.whatIsDesc}
          </p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-lg text-text italic font-heading">
              &ldquo;Attention is all you need.&rdquo;
            </p>
            <p className="text-sm text-muted mt-2">
              {ta.paperCitation}
            </p>
          </div>
        </div>
      </section>

      {/* Bycroft LLM Visualizer — prominent link */}
      <section>
        <a
          href="https://bbycroft.net/llm"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300">
            <div className="rounded-2xl bg-background p-6 md:p-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                    <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold font-heading text-gradient group-hover:opacity-90 transition-opacity">
                      {ta.bycroftTitle}
                    </h3>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted group-hover:text-cyan-400 transition-colors shrink-0">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </div>
                  <p className="text-muted text-sm leading-relaxed mb-3">
                    {ta.bycroftDesc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">{ta.bycroftBadge3d}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">{ta.bycroftBadgeBy}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/20">bbycroft.net/llm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </section>

      {/* Interactive: one block, two generations */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{ta.layersHeading}</h2>
        <p className="text-muted mb-6">{ta.layersIntro}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <div className="mb-5 flex flex-wrap gap-2" role="group">
            <button type="button" aria-pressed={modern} onClick={() => setModern(true)} className={tabClass(modern)}>{ta.modernTab}</button>
            <button type="button" aria-pressed={!modern} onClick={() => setModern(false)} className={tabClass(!modern)}>{ta.legacyTab}</button>
          </div>
          {modern ? (
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-muted">{ta.modernIntro}</p>
              <div className="space-y-2 font-mono text-sm">
                {MODERN_BLOCK.map((line, i) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`overflow-x-auto rounded-lg border bg-background p-3 ${line.startsWith('x = x +') ? 'border-emerald-500/40 text-emerald-200' : 'border-border text-text'}`}
                  >
                    <span className="mr-3 text-cyan-300">{i + 1}</span>{line}
                  </motion.div>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted">{ta.modernOutro}</p>
              <div>
                <h3 className="mb-3 font-heading text-lg font-bold text-text">{ta.modernChangesTitle}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ta.modernChanges.map((change) => (
                    <div key={change.name} className="rounded-xl border border-border bg-background/60 p-4">
                      <div className="mb-1 font-mono text-sm text-cyan-300">{change.name}</div>
                      <p className="text-sm leading-relaxed text-muted">{change.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-cyan-300">
                <Link href={`/${locale}/ai/llm/residual-stream-layer-norm`} className="underline">{t.topicNames['residual-stream-layer-norm']}</Link>
                <Link href={`/${locale}/ai/llm/attention`} className="underline">{t.topicNames.attention}</Link>
                <Link href={`/${locale}/ai/llm/multi-head-attention-gqa`} className="underline">{t.topicNames['multi-head-attention-gqa']}</Link>
                <Link href={`/${locale}/ai/llm/positional-encoding`} className="underline">{t.topicNames['positional-encoding']}</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-muted">{ta.legacyIntro}</p>
              <TransformerVisualizer section="layers" t={vizT} />
            </div>
          )}
        </div>
      </section>

      {/* Interactive: Encoder-Decoder */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{ta.archHeading}</h2>
        <p className="text-muted mb-6">{ta.archIntro}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <TransformerVisualizer section="encoder-decoder" t={vizT} />
        </div>
      </section>

      {/* Interactive: Dataflow (modern decoder) */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{ta.dataflowHeading}</h2>
        <p className="text-muted mb-6">{ta.dataflowIntro}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <TransformerVisualizer section="dataflow" t={vizT} />
        </div>
      </section>

      {/* Key Concepts */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{ta.conceptsTitle}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {concepts.map((c) => (
            <div key={c.title} className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
              <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{c.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{ta.whyMattersTitle}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <p className="text-muted leading-relaxed mb-6">{ta.whyMattersDesc}</p>
          <ul className="space-y-4 text-text">
            {[ta.takeaway1, ta.takeaway2, ta.takeaway3, ta.takeaway4].map((item, i) => (
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
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-xl font-bold text-text">{ta.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline hover:text-cyan-200">
                {source.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
