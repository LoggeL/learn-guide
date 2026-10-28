'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { QuantizationVisualizer, QuantizationMemoryCalculator } from '@/components/interactive/QuantizationVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const GGUF_BPW: [string, number][] = [
  ['Q2_K', 3.16], ['Q3_K_M', 4.0], ['Q4_K_S', 4.67], ['Q4_K_M', 4.89], ['Q5_K_M', 5.7], ['Q6_K', 6.56], ['Q8_0', 8.5],
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
      <h2 className="mb-4 text-2xl font-bold font-heading text-gradient">{title}</h2>
      {children}
    </section>
  )
}

function Formula({ children }: { children: React.ReactNode }) {
  return <p className="overflow-x-auto whitespace-nowrap rounded-lg border border-border bg-background p-3 font-mono text-sm text-cyan-200">{children}</p>
}

export default function QuantizationPage() {
  const { t, locale } = useTranslation()
  const c = t.quantization
  const num = (value: number, digits: number) => value.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const granularity = [
    { title: c.granTensor, desc: c.granTensorDesc, color: 'text-orange-400' },
    { title: c.granChannel, desc: c.granChannelDesc, color: 'text-cyan-400' },
    { title: c.granGroup, desc: c.granGroupDesc, color: 'text-emerald-400' },
  ]

  const methods = [
    { title: c.rtnTitle, desc: c.rtnDesc, href: undefined },
    { title: c.gptqTitle, desc: c.gptqDesc, href: 'https://arxiv.org/abs/2210.17323' },
    { title: c.awqTitle, desc: c.awqDesc, href: 'https://arxiv.org/abs/2306.00978' },
    { title: c.smoothTitle, desc: c.smoothDesc, href: 'https://arxiv.org/abs/2211.10438' },
    { title: c.rotTitle, desc: c.rotDesc, href: 'https://arxiv.org/abs/2404.00456' },
    { title: c.qatTitle, desc: c.qatDesc, href: undefined },
    { title: c.qloraTitle, desc: c.qloraDesc, href: 'https://arxiv.org/abs/2305.14314' },
  ]

  const schemes = [
    { name: c.wvaW4, what: c.wvaW4What, gain: c.wvaW4Gain },
    { name: c.wvaW8, what: c.wvaW8What, gain: c.wvaW8Gain },
    { name: c.wvaW4A4, what: c.wvaW4A4What, gain: c.wvaW4A4Gain },
  ]

  const formats = [
    { name: 'BF16', layout: c.fmtBf16Layout, scaling: c.fmtBf16Scaling, bits: 16, use: c.fmtBf16Use },
    { name: 'FP8 E4M3', layout: c.fmtE4m3Layout, scaling: c.fmtE4m3Scaling, bits: 8, use: c.fmtE4m3Use },
    { name: 'FP8 E5M2', layout: c.fmtE5m2Layout, scaling: c.fmtE5m2Scaling, bits: 8, use: c.fmtE5m2Use },
    { name: 'MXFP4', layout: c.fmtMxLayout, scaling: c.fmtMxScaling, bits: 4.25, use: c.fmtMxUse },
    { name: 'NVFP4', layout: c.fmtNvLayout, scaling: c.fmtNvScaling, bits: 4.5, use: c.fmtNvUse },
  ]

  const takeaways = [c.takeaway1, c.takeaway2, c.takeaway3, c.takeaway4, c.takeaway5]

  const sources: [string, string][] = [
    [c.srcInt8, 'https://arxiv.org/abs/2208.07339'],
    [c.srcInt8Blog, 'https://huggingface.co/blog/hf-bitsandbytes-integration'],
    [c.srcGptq, 'https://arxiv.org/abs/2210.17323'],
    [c.srcAwq, 'https://arxiv.org/abs/2306.00978'],
    [c.srcSmooth, 'https://arxiv.org/abs/2211.10438'],
    [c.srcQuarot, 'https://arxiv.org/abs/2404.00456'],
    [c.srcQlora, 'https://arxiv.org/abs/2305.14314'],
    [c.srcMarlin, 'https://arxiv.org/abs/2408.11743'],
    [c.srcKivi, 'https://arxiv.org/abs/2402.02750'],
    [c.srcVllmKv, 'https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache.html'],
    [c.srcFp8, 'https://arxiv.org/abs/2209.05433'],
    [c.srcMx, 'https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf'],
    [c.srcNvfp4, 'https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference'],
    [c.srcDeepseek, 'https://arxiv.org/abs/2412.19437'],
    [c.srcGptOss, 'https://huggingface.co/openai/gpt-oss-120b'],
    [c.srcKquants, 'https://github.com/ggml-org/llama.cpp/pull/1684'],
    [c.srcQuantize, 'https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md'],
    [c.srcBitnet, 'https://arxiv.org/abs/2402.17764'],
    [c.srcBitnet2b, 'https://arxiv.org/abs/2504.12285'],
  ]

  return (
    <TopicLayout
      topicId="quantization"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.title },
      ]}
    >
      <Section title={c.introTitle}>
        <div className="space-y-4 text-lg leading-relaxed text-muted">
          <p>{c.introP1}</p>
          <p>{c.introP2}</p>
        </div>
      </Section>

      <Section title={c.mapTitle}>
        <p className="mb-6 leading-relaxed text-muted">{c.mapIntro}</p>
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { title: c.symTitle, formula: c.symFormula, desc: c.symDesc, tone: 'border-cyan-500/20 from-cyan-500/5 text-cyan-400' },
            { title: c.asymTitle, formula: c.asymFormula, desc: c.asymDesc, tone: 'border-purple-500/20 from-purple-500/5 text-purple-400' },
          ].map(card => (
            <article key={card.title} className={`min-w-0 space-y-3 rounded-xl border bg-gradient-to-br to-transparent p-5 ${card.tone}`}>
              <h3 className="text-lg font-bold font-heading">{card.title}</h3>
              <Formula>{card.formula}</Formula>
              <p className="text-sm leading-relaxed text-muted">{card.desc}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-border bg-background p-5">
          <h3 className="mb-2 font-semibold text-text">{c.exampleTitle}</h3>
          <p className="font-mono text-sm leading-relaxed text-muted">{c.exampleBody}</p>
        </div>
      </Section>

      <Section title={c.granTitle}>
        <p className="mb-6 leading-relaxed text-muted">{c.granIntro}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {granularity.map(g => (
            <article key={g.title} className="rounded-xl border border-border bg-background p-5">
              <h3 className={`mb-2 font-bold font-heading ${g.color}`}>{g.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{g.desc}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm leading-relaxed text-muted">{c.granOverhead}</p>
      </Section>

      <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
        <QuantizationVisualizer />
      </section>

      <Section title={c.outlierTitle}>
        <p className="leading-relaxed text-muted">{c.outlierP1}</p>
        <div className="mt-6 rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent p-5">
          <h3 className="mb-2 text-lg font-bold font-heading text-orange-400">{c.outlierInt8Title}</h3>
          <p className="text-sm leading-relaxed text-muted">{c.outlierInt8Desc}</p>
        </div>
        <p className="mt-6 leading-relaxed text-text">{c.outlierLesson}</p>
      </Section>

      <Section title={c.methodsTitle}>
        <p className="mb-6 leading-relaxed text-muted">{c.methodsIntro}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {methods.map(m => (
            <article key={m.title} className="rounded-xl border border-border bg-background p-5">
              <h3 className="mb-2 font-bold font-heading text-text">
                {m.href ? <a href={m.href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300">{m.title} ↗</a> : m.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{m.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title={c.wvaTitle}>
        <p className="mb-6 leading-relaxed text-muted">{c.wvaIntro}</p>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="hidden grid-cols-[1fr_2fr_2fr] bg-background/60 text-sm font-bold md:grid">
            <div className="border-r border-border p-3 text-muted">{c.wvaScheme}</div>
            <div className="border-r border-border p-3 text-cyan-400">{c.wvaWhat}</div>
            <div className="p-3 text-emerald-400">{c.wvaGain}</div>
          </div>
          {schemes.map((row, i) => (
            <div key={row.name} className={`grid grid-cols-1 text-sm md:grid-cols-[1fr_2fr_2fr] ${i % 2 ? 'bg-background/30' : ''}`}>
              <div className="border-t border-border p-3 font-mono font-semibold text-text">{row.name}</div>
              <div className="border-t border-border p-3 text-muted">{row.what}</div>
              <div className="border-t border-border p-3 text-muted">{row.gain}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={c.kvTitle}>
        <div className="space-y-4 leading-relaxed text-muted">
          <p>{c.kvP1}</p>
          <p>{c.kvP2}</p>
        </div>
        <Link href={`/${locale}/ai/llm-inference/kv-cache`} className="mt-4 inline-block text-cyan-300 hover:underline">{c.kvLink}</Link>
      </Section>

      <Section title={c.fmtTitle}>
        <p className="mb-6 leading-relaxed text-muted">{c.fmtIntro}</p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-background/60 text-muted">
              <tr>{[c.fmtFormat, c.fmtLayout, c.fmtScaling, c.fmtBits, c.fmtUse].map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {formats.map(f => (
                <tr key={f.name} className="border-t border-border align-top">
                  <td className="p-3 font-mono font-semibold text-text">{f.name}</td>
                  <td className="p-3 text-muted">{f.layout}</td>
                  <td className="p-3 text-muted">{f.scaling}</td>
                  <td className="p-3 font-mono text-cyan-300">{num(f.bits, f.bits % 1 ? 2 : 0)}</td>
                  <td className="p-3 text-muted">{f.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted">{c.fmtWhy}</p>
      </Section>

      <Section title={c.ggufTitle}>
        <div className="space-y-4 leading-relaxed text-muted">
          <p>{c.ggufP1}</p>
          <p>{c.ggufP2}</p>
        </div>
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-background/60 text-muted"><tr><th className="p-3 text-left font-semibold">{c.ggufType}</th><th className="p-3 text-right font-semibold">{c.ggufBpw}</th></tr></thead>
            <tbody>{GGUF_BPW.map(([name, bpw]) => (
              <tr key={name} className="border-t border-border"><td className="p-3 font-mono text-text">{name}</td><td className="p-3 text-right font-mono text-cyan-300">{num(bpw, 2)}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">{c.ggufNote}</p>
      </Section>

      <Section title={c.bitnetTitle}>
        <div className="space-y-4 leading-relaxed text-muted">
          <p>{c.bitnetP1}</p>
          <p>{c.bitnetP2}</p>
        </div>
      </Section>

      <Section title={c.memTitle}>
        <p className="mb-6 leading-relaxed text-muted">{c.memIntro}</p>
        <QuantizationMemoryCalculator />
        <Link href={`/${locale}/ai/llm-inference/vram-calc`} className="mt-6 block rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 hover:border-cyan-400/40">
          <span className="font-semibold text-cyan-300">{c.vramCalcLink} →</span>
          <span className="mt-1 block text-sm text-muted">{c.vramCalcLinkDesc}</span>
        </Link>
      </Section>

      <Section title={c.evalTitle}>
        <p className="leading-relaxed text-muted">{c.evalBody}</p>
      </Section>

      <section>
        <h2 className="mb-6 text-2xl font-bold font-heading text-gradient">{c.keyTakeaways}</h2>
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 md:p-8">
          <ul className="space-y-4 text-text">
            {takeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <span className="text-sm font-bold text-primary-light">{i + 1}</span>
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">{c.sourcesTitle}</h2>
        <ul className="grid gap-2 text-sm text-cyan-300 md:grid-cols-2">
          {sources.map(([label, url]) => (
            <li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="underline">{label}</a></li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
