'use client'

import { AlertTriangle, CheckCircle2, Cpu, GitBranch, Layers, Radio, ShieldCheck } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { ResidualStreamLayerNormVisualizer } from '@/components/interactive/ResidualStreamLayerNormVisualizer'
import { AttentionLogitGrowthDemo } from '@/components/interactive/AttentionLogitGrowthDemo'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  { title: 'Elhage et al. (2021): A Mathematical Framework for Transformer Circuits', url: 'https://transformer-circuits.pub/2021/framework/index.html' },
  { title: 'nostalgebraist (2020): interpreting GPT – the logit lens', url: 'https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens' },
  { title: 'He et al. (2016): Deep Residual Learning for Image Recognition', url: 'https://arxiv.org/abs/1512.03385' },
  { title: 'Xiong et al. (2020): On Layer Normalization in the Transformer Architecture', url: 'https://arxiv.org/abs/2002.04745' },
  { title: 'Liu et al. (2020): Understanding the Difficulty of Training Transformers', url: 'https://arxiv.org/abs/2004.08249' },
  { title: 'Wang et al. (2022): DeepNet – Scaling Transformers to 1,000 Layers', url: 'https://arxiv.org/abs/2203.00555' },
  { title: 'Sun et al. (2025): The Curse of Depth in Large Language Models', url: 'https://arxiv.org/abs/2502.05795' },
  { title: 'Zhang & Sennrich (2019): Root Mean Square Layer Normalization', url: 'https://arxiv.org/abs/1910.07467' },
  { title: 'Henry et al. (2020): Query-Key Normalization for Transformers', url: 'https://arxiv.org/abs/2010.04245' },
  { title: 'Dehghani et al. (2023): Scaling Vision Transformers to 22 Billion Parameters', url: 'https://arxiv.org/abs/2302.05442' },
  { title: 'Wortsman et al. (2023): Small-scale proxies for large-scale Transformer training instabilities', url: 'https://arxiv.org/abs/2309.14322' },
  { title: 'Ding et al. (2021): CogView (Sandwich-LN)', url: 'https://arxiv.org/abs/2105.13290' },
  { title: 'Kim et al. (2025): Peri-LN – Revisiting Normalization Layer in the Transformer Architecture', url: 'https://arxiv.org/abs/2502.02732' },
  { title: 'Team OLMo (2025): 2 OLMo 2 Furious', url: 'https://arxiv.org/abs/2501.00656' },
  { title: 'Gemma Team (2024): Gemma 2 – Improving Open Language Models at a Practical Size', url: 'https://arxiv.org/abs/2408.00118' },
  { title: 'Gemma Team (2025): Gemma 3 Technical Report', url: 'https://arxiv.org/abs/2503.19786' },
  { title: 'Llama Team (2024): The Llama 3 Herd of Models', url: 'https://arxiv.org/abs/2407.21783' },
]

// Unrolled Pre-Norm stack (math notation, identical in all languages).
const UNROLLED = [
  'x₀ = Embedding(tokens)',
  'x_l = x_{l−1} + F_l(Norm(x_{l−1}))      l = 1 … L',
  'x_L = x₀ + Σ_{l=1..L} F_l(Norm(x_{l−1}))',
  'logits = W_U · Norm(x_L)',
]

export default function ResidualStreamLayerNormPage() {
  const { t } = useTranslation()
  const r = t.residualStream

  return (
    <TopicLayout
      topicId="residual-stream-layer-norm"
      title={r.title}
      description={r.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.topicNames['residual-stream-layer-norm'] },
      ]}
    >
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
            <Cpu size={21} className="text-primary-light" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{r.introTitle}</h2>
        </div>
        <p className="text-lg leading-relaxed text-muted">{r.intro}</p>
      </section>

      <ResidualStreamLayerNormVisualizer />

      {/* Residual stream as communication channel */}
      <section className="rounded-2xl border border-border bg-surface/55 p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10">
            <Radio size={18} className="text-cyan-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-text">{r.streamTitle}</h2>
        </div>
        <p className="mb-5 leading-relaxed text-muted">{r.streamBody}</p>
        <div className="mb-5 space-y-1 overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-sm text-cyan-200">
          {UNROLLED.map((line) => <div key={line} className="whitespace-pre">{line}</div>)}
        </div>
        <p className="mb-5 text-sm text-muted">{r.equationNote}</p>
        <ul className="grid gap-3 md:grid-cols-2">
          {r.streamPoints.map((item) => (
            <li key={item} className="flex gap-2 rounded-xl border border-border bg-background/50 p-4 text-sm text-muted">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Depth and gradients */}
      <section className="rounded-2xl border border-border bg-surface/55 p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/25 bg-violet-500/10">
            <Layers size={18} className="text-violet-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-text">{r.depthTitle}</h2>
        </div>
        <p className="mb-4 leading-relaxed text-muted">{r.depthBody}</p>
        <ul className="space-y-2">
          {r.depthPoints.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Post-Norm vs Pre-Norm */}
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-orange-500/25 bg-orange-500/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-500/25 bg-orange-500/10">
              <AlertTriangle size={18} className="text-orange-300" />
            </div>
            <h3 className="font-heading text-xl font-bold text-text">{r.postTitle}</h3>
          </div>
          <p className="mb-3 font-mono text-sm text-orange-200">x ← Norm(x + F(x))</p>
          <p className="mb-4 leading-relaxed text-muted">{r.postBody}</p>
          <ul className="space-y-2">
            {r.postPoints.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-300" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10">
              <GitBranch size={18} className="text-emerald-300" />
            </div>
            <h3 className="font-heading text-xl font-bold text-text">{r.preTitle}</h3>
          </div>
          <p className="mb-3 font-mono text-sm text-emerald-200">x ← x + F(Norm(x))</p>
          <p className="leading-relaxed text-muted">{r.preBody}</p>
        </article>
      </section>

      {/* Stabilizers */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10">
            <ShieldCheck size={18} className="text-cyan-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{r.stabilizersTitle}</h2>
        </div>
        <p className="mb-5 leading-relaxed text-muted">{r.stabilizersIntro}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {r.stabilizers.map((s) => (
            <article key={s.name} className="flex flex-col rounded-2xl border border-border bg-surface/55 p-5">
              <h3 className="mb-2 font-heading text-lg font-bold text-text">{s.name}</h3>
              <p className="mb-3 overflow-x-auto rounded-lg bg-background p-2 font-mono text-xs text-cyan-200">{s.formula}</p>
              <p className="mb-3 flex-1 text-sm leading-relaxed text-muted">{s.desc}</p>
              <p className="text-xs text-muted/80">{s.usedBy}</p>
            </article>
          ))}
        </div>
      </section>

      <AttentionLogitGrowthDemo />

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-emerald-200">{r.takeawaysTitle}</h2>
        <ul className="space-y-3">
          {r.takeaways.map((item) => (
            <li key={item} className="flex gap-3 text-muted">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-xl font-bold text-text">{r.sourcesTitle}</h2>
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
