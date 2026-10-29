'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { KvCacheDecodeDemo } from '@/components/interactive/KvCacheDecodeDemo'
import { KvCacheMemoryCalculator } from '@/components/interactive/KvCacheMemoryCalculator'
import { KvCacheQuantDemo } from '@/components/interactive/KvCacheQuantDemo'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES: [string, string][] = [
  ['Shazeer (2019): Fast Transformer Decoding — Multi-Query Attention', 'https://arxiv.org/abs/1911.02150'],
  ['Ainslie et al. (2023): GQA — Grouped-Query Attention', 'https://arxiv.org/abs/2305.13245'],
  ['DeepSeek-AI (2024): DeepSeek-V2 — Multi-head Latent Attention', 'https://arxiv.org/abs/2405.04434'],
  ['DeepSeek-V3 config.json', 'https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json'],
  ['Jiang et al. (2023): Mistral 7B', 'https://arxiv.org/abs/2310.06825'],
  ['Gemma Team (2025): Gemma 3 Technical Report', 'https://arxiv.org/abs/2503.19786'],
  ['OpenAI (2025): gpt-oss-120b config.json', 'https://huggingface.co/openai/gpt-oss-120b/blob/main/config.json'],
  ['Meta (2025): The Llama 4 herd', 'https://ai.meta.com/blog/llama-4-multimodal-intelligence/'],
  ['Qwen (2025): Qwen3-Next-80B-A3B model card', 'https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct'],
  ['Kwon et al. (2023): Efficient Memory Management for LLM Serving with PagedAttention', 'https://arxiv.org/abs/2309.06180'],
  ['vLLM docs: Quantized KV Cache', 'https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache/'],
  ['Liu et al. (2024): KIVI — 2bit KV Cache Quantization', 'https://arxiv.org/abs/2402.02750'],
  ['Zandieh et al. (2025): TurboQuant', 'https://arxiv.org/abs/2504.19874'],
]

export default function KVCachePage() {
  const { t, locale } = useTranslation()
  const k = t.kvCache

  const optimizations = [
    { title: k.gqaTitle, desc: k.gqaDesc, box: 'from-cyan-500/5 to-blue-500/5 border-cyan-500/20', heading: 'text-cyan-400' },
    { title: k.mlaTitle, desc: k.mlaDesc, box: 'from-blue-500/5 to-indigo-500/5 border-blue-500/20', heading: 'text-blue-400' },
    { title: k.windowTitle, desc: k.windowDesc, box: 'from-yellow-500/5 to-orange-500/5 border-yellow-500/20', heading: 'text-yellow-400' },
    { title: k.hybridTitle, desc: k.hybridDesc, box: 'from-pink-500/5 to-rose-500/5 border-pink-500/20', heading: 'text-pink-400' },
    { title: k.pagedTitle, desc: k.pagedDesc, box: 'from-purple-500/5 to-pink-500/5 border-purple-500/20', heading: 'text-purple-400' },
    { title: k.fp8Title, desc: k.fp8Desc, box: 'from-emerald-500/5 to-teal-500/5 border-emerald-500/20', heading: 'text-emerald-400' },
  ]

  return (
    <TopicLayout
      topicId="kv-cache"
      title={k.title}
      description={k.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: k.title },
      ]}
    >
      {/* What is KV Cache */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{k.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">{k.whatIsDesc}</p>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{k.keyCache}</h3>
            <p className="text-sm text-muted">{k.keyCacheDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{k.valueCache}</h3>
            <p className="text-sm text-muted">{k.valueCacheDesc}</p>
          </div>
          <div className="p-5 bg-background border border-border rounded-xl">
            <h3 className="text-lg font-bold font-heading text-text mb-2">{k.noQueryCacheTitle}</h3>
            <p className="text-sm text-muted">{k.noQueryCacheDesc}</p>
          </div>
        </div>
      </section>

      {/* Prefill and decode */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{k.phasesTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{k.phasesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">{k.prefillTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{k.prefillDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
            <h3 className="text-lg font-bold text-orange-400 mb-2">{k.decodeTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{k.decodeDesc}</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted">
          {k.phasesLinkText}{' '}
          <Link
            href={`/${locale}/ai/llm-inference/prompt-caching`}
            className="text-primary-light underline underline-offset-2"
          >
            {k.phasesLinkLabel}
          </Link>
        </p>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold font-heading text-text">{k.interactiveTitle}</h2>
          <p className="text-sm text-muted">{k.interactiveSubtitle}</p>
        </div>
        <p className="text-muted mb-6 leading-relaxed">{k.interactiveDesc}</p>
        <KvCacheDecodeDemo />
      </section>

      {/* Complexity */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{k.complexityTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{k.complexityDesc}</p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[28rem] text-sm">
            <thead className="bg-background/60">
              <tr>
                <th className="p-3 text-left font-semibold text-muted" />
                <th className="p-3 text-left font-semibold text-emerald-400">{k.complexityWith}</th>
                <th className="p-3 text-left font-semibold text-red-400">{k.complexityWithout}</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-t border-border">
                <td className="p-3 font-sans font-semibold text-text">{k.complexityStep}</td>
                <td className="p-3">O(d² + n·d)</td>
                <td className="p-3">O(n·d² + n²·d)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-sans font-semibold text-text">{k.complexityTotal}</td>
                <td className="p-3">O(n·d² + n²·d)</td>
                <td className="p-3">O(n²·d² + n³·d)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted leading-relaxed">{k.complexityNote}</p>
      </section>

      {/* Memory */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{k.memoryTitle}</h2>
        <p className="text-muted leading-relaxed">{k.memoryDesc}</p>
        <div className="my-5 p-5 bg-background border border-border rounded-xl">
          <code className="text-primary-light text-sm block font-mono break-words">
            KV bytes = 2 × n_layers × n_kv_heads × d_head × bytes × tokens
          </code>
          <p className="text-xs text-muted mt-3">{k.memoryFormulaNote}</p>
        </div>
        <p className="text-muted leading-relaxed">{k.memoryRelative}</p>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold font-heading text-text">{k.calcTitle}</h2>
          <p className="text-sm text-muted">{k.calcDesc}</p>
        </div>
        <KvCacheMemoryCalculator />
      </section>

      {/* Optimization Techniques */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{k.optimizationsTitle}</h2>
        <div className="space-y-4">
          {optimizations.map((o) => (
            <div key={o.title} className={`p-5 rounded-xl bg-gradient-to-br border ${o.box}`}>
              <h3 className={`text-lg font-bold mb-2 ${o.heading}`}>{o.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TurboQuant */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{k.turboQuantTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{k.turboQuantDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            [k.turboStep1Title, k.turboStep1Desc],
            [k.turboStep2Title, k.turboStep2Desc],
            [k.turboStep3Title, k.turboStep3Desc],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl border border-emerald-500/20 bg-background/60 p-4">
              <h3 className="font-semibold text-emerald-300 mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted leading-relaxed">{k.turboResult}</p>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold font-heading text-text">{k.quantDemoTitle}</h2>
          <p className="text-sm text-muted">{k.quantDemoSubtitle}</p>
        </div>
        <KvCacheQuantDemo />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{k.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[k.takeaway1, k.takeaway2, k.takeaway3, k.takeaway4].map((item, i) => (
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

      {/* Next */}
      <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 p-6 md:p-8">
        <h2 className="text-xl font-bold font-heading text-text mb-2">{k.nextTitle}</h2>
        <p className="text-muted mb-4">{k.nextDesc}</p>
        <Link
          href={`/${locale}/ai/llm-inference/prompt-caching`}
          className="inline-block rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary-light hover:bg-primary/10"
        >
          {k.nextLink}
        </Link>
      </section>

      {/* Sources */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-xl font-bold font-heading text-text mb-4">{k.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map(([name, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noreferrer" className="text-cyan-300 underline underline-offset-2">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
