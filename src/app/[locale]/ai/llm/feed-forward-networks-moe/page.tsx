'use client'

import { CheckCircle2, Cpu, GitBranch, Layers, Network, Scale, Share2, Split } from 'lucide-react'
import { FeedForwardMoeVisualizer } from '@/components/interactive/FeedForwardMoeVisualizer'
import { FfnParameterShare } from '@/components/interactive/FfnParameterShare'
import { MoEVisualizer } from '@/components/interactive/MoEVisualizer'
import { MoeLoadBalancingDemo } from '@/components/interactive/MoeLoadBalancingDemo'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

const sources = [
  { label: 'Vaswani et al. (2017): Attention Is All You Need', href: 'https://arxiv.org/abs/1706.03762' },
  { label: 'Shazeer (2020): GLU Variants Improve Transformer', href: 'https://arxiv.org/abs/2002.05202' },
  { label: 'Touvron et al. (2023): LLaMA', href: 'https://arxiv.org/abs/2302.13971' },
  { label: 'Llama Team (2024): The Llama 3 Herd of Models', href: 'https://arxiv.org/abs/2407.21783' },
  { label: 'Geva et al. (2021): Transformer Feed-Forward Layers Are Key-Value Memories', href: 'https://arxiv.org/abs/2012.14913' },
  { label: 'Geva et al. (2022): Transformer Feed-Forward Layers Build Predictions by Promoting Concepts in the Vocabulary Space', href: 'https://arxiv.org/abs/2203.14680' },
  { label: 'Meng et al. (2022): Locating and Editing Factual Associations in GPT (ROME)', href: 'https://arxiv.org/abs/2202.05262' },
  { label: 'Shazeer et al. (2017): Outrageously Large Neural Networks', href: 'https://arxiv.org/abs/1701.06538' },
  { label: 'Lepikhin et al. (2020): GShard', href: 'https://arxiv.org/abs/2006.16668' },
  { label: 'Fedus et al. (2021): Switch Transformers', href: 'https://arxiv.org/abs/2101.03961' },
  { label: 'Zoph et al. (2022): ST-MoE', href: 'https://arxiv.org/abs/2202.08906' },
  { label: 'Gale et al. (2022): MegaBlocks', href: 'https://arxiv.org/abs/2211.15841' },
  { label: 'Dai et al. (2024): DeepSeekMoE', href: 'https://arxiv.org/abs/2401.06066' },
  { label: 'Wang et al. (2024): Auxiliary-Loss-Free Load Balancing', href: 'https://arxiv.org/abs/2408.15664' },
  { label: 'DeepSeek-AI (2024): DeepSeek-V3 Technical Report', href: 'https://arxiv.org/abs/2412.19437' },
  { label: 'Jiang et al. (2024): Mixtral of Experts', href: 'https://arxiv.org/abs/2401.04088' },
  { label: 'Qwen Team (2025): Qwen3 Technical Report', href: 'https://arxiv.org/abs/2505.09388' },
  { label: 'OpenAI (2025): gpt-oss-120b & gpt-oss-20b Model Card', href: 'https://arxiv.org/abs/2508.10925' },
  { label: 'Kimi Team (2025): Kimi K2', href: 'https://arxiv.org/abs/2507.20534' },
  { label: 'DeepEP (GitHub)', href: 'https://github.com/deepseek-ai/DeepEP' },
  { label: 'llama.cpp (GitHub)', href: 'https://github.com/ggml-org/llama.cpp' },
]

const sectionClass = 'rounded-2xl border border-border bg-surface/50 p-6 md:p-8'
const formulaClass = 'overflow-x-auto rounded-xl border border-cyan-500/25 bg-background/60 p-4 font-mono text-base text-cyan-200 md:text-lg'

export default function FeedForwardNetworksMoePage() {
  const { t } = useTranslation()
  const c = t.ffnMoe

  const flow = [
    { title: c.whereAttention, desc: c.whereAttentionDesc, color: 'border-orange-500/30 text-orange-300' },
    { title: c.whereFfn, desc: c.whereFfnDesc, color: 'border-cyan-500/40 text-cyan-300' },
    { title: c.whereResidual, desc: c.whereResidualDesc, color: 'border-emerald-500/30 text-emerald-300' },
  ]
  const balanceCards = [
    { title: c.balanceAuxTitle, body: c.balanceAuxBody },
    { title: c.balanceZTitle, body: c.balanceZBody },
    { title: c.balanceFreeTitle, body: c.balanceFreeBody },
  ]
  const epSteps = [
    { title: c.epStep1, desc: c.epStep1Desc },
    { title: c.epStep2, desc: c.epStep2Desc },
    { title: c.epStep3, desc: c.epStep3Desc },
    { title: c.epStep4, desc: c.epStep4Desc },
  ]
  const costCards = [
    { title: c.costCompute, body: c.costComputeBody, color: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/5' },
    { title: c.costMemory, body: c.costMemoryBody, color: 'text-orange-300 border-orange-500/20 bg-orange-500/5' },
    { title: c.costBandwidth, body: c.costBandwidthBody, color: 'text-purple-300 border-purple-500/20 bg-purple-500/5' },
  ]
  const takeaways = [c.takeaway1, c.takeaway2, c.takeaway3, c.takeaway4, c.takeaway5]

  return (
    <TopicLayout
      topicId="feed-forward-networks-moe"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.topicNames['feed-forward-networks-moe'] },
      ]}
    >
      {/* 1. Position in the block */}
      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
            <Layers size={21} className="text-primary-light" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.whereTitle}</h2>
        </div>
        <p className="text-lg leading-relaxed text-muted">{c.whereBody}</p>
        <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-stretch">
          {flow.map((step, i) => (
            <div key={step.title} className="flex flex-1 items-center gap-2">
              {i > 0 && <span className="hidden font-bold text-muted md:inline">→</span>}
              <div className={`flex-1 rounded-xl border bg-background/50 p-4 ${step.color}`}>
                <p className="font-semibold">{step.title}</p>
                <p className="mt-1 text-sm text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Formula */}
      <section className={sectionClass}>
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.formulaTitle}</h2>
        <p className="mb-4 leading-relaxed text-muted">{c.formulaBody}</p>
        <div className={formulaClass}>FFN(x) = W₂ · σ(W₁ x)</div>
        <p className="mb-6 mt-3 text-sm leading-relaxed text-muted">{c.formulaClassicNote}</p>
        <div className={formulaClass}>SwiGLU(x) = W₂ · (SiLU(W_gate x) ⊙ W_up x)</div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{c.formulaGluNote}</p>
        <p className="mt-4 rounded-lg border border-border bg-background/40 p-4 text-sm leading-relaxed text-muted">{c.formulaWhyNonlinear}</p>
      </section>

      {/* 3. Parameter share */}
      <section className={sectionClass}>
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.shareTitle}</h2>
        <p className="mb-6 leading-relaxed text-muted">{c.shareBody}</p>
        <FfnParameterShare />
      </section>

      {/* 4. Dense demo */}
      <FeedForwardMoeVisualizer />

      {/* 5. Key-value memory */}
      <section className={sectionClass}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-500/25 bg-purple-500/10">
            <Cpu size={18} className="text-purple-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.memoryTitle}</h2>
        </div>
        <p className="mb-4 leading-relaxed text-muted">{c.memoryBody}</p>
        <ul className="space-y-2">
          {[c.memoryPoint1, c.memoryPoint2, c.memoryPoint3].map(item => (
            <li key={item} className="flex gap-2 text-sm text-muted">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-purple-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm italic text-muted">{c.memoryCaveat}</p>
      </section>

      {/* 6. From dense to sparse */}
      <section className={sectionClass}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10">
            <GitBranch size={18} className="text-cyan-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.sparseTitle}</h2>
        </div>
        <p className="mb-4 leading-relaxed text-muted">{c.sparseBody}</p>
        <div className={`${formulaClass} space-y-1`}>
          <p>s = W_r x</p>
          <p>MoE(x) = Σ_(i ∈ TopK(s)) gᵢ · Eᵢ(x)</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{c.sparseFormulaNote}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{c.sparseHistory}</p>
      </section>

      <MoEVisualizer />

      {/* 7. Expert design */}
      <section className={sectionClass}>
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{c.designTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Split size={18} className="text-cyan-300" />
              <h3 className="font-heading text-lg font-bold text-cyan-300">{c.fineTitle}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted">{c.fineBody}</p>
          </article>
          <article className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Share2 size={18} className="text-purple-300" />
              <h3 className="font-heading text-lg font-bold text-purple-300">{c.sharedTitle}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted">{c.sharedBody}</p>
          </article>
        </div>
        <p className="mt-4 text-sm text-muted">{c.denseLayersNote}</p>
      </section>

      {/* 8. Load balancing */}
      <section className={sectionClass}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10">
            <Scale size={18} className="text-emerald-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.balanceTitle}</h2>
        </div>
        <p className="mb-5 leading-relaxed text-muted">{c.balanceBody}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {balanceCards.map(card => (
            <article key={card.title} className="rounded-xl border border-border bg-background/40 p-5">
              <h3 className="mb-2 font-heading text-lg font-bold text-text">{card.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <MoeLoadBalancingDemo />

      {/* 9. Capacity */}
      <section className={sectionClass}>
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.capacityTitle}</h2>
        <p className="mb-4 leading-relaxed text-muted">{c.capacityBody}</p>
        <p className="leading-relaxed text-muted">{c.capacityModern}</p>
      </section>

      {/* 10. Expert parallelism */}
      <section className={sectionClass}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-500/25 bg-orange-500/10">
            <Network size={18} className="text-orange-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.epTitle}</h2>
        </div>
        <p className="mb-5 leading-relaxed text-muted">{c.epBody}</p>
        <ol className="grid gap-3 md:grid-cols-4">
          {epSteps.map((step, i) => (
            <li key={step.title} className={`rounded-xl border p-4 ${i === 1 || i === 3 ? 'border-orange-500/30 bg-orange-500/5' : 'border-border bg-background/40'}`}>
              <p className="font-mono text-xs text-muted">{i + 1}</p>
              <p className="font-semibold text-text">{step.title}</p>
              <p className="mt-1 text-sm text-muted">{step.desc}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 leading-relaxed text-muted">{c.epCost}</p>
      </section>

      {/* 11. Cost */}
      <section className={sectionClass}>
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{c.costTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {costCards.map(card => (
            <article key={card.title} className={`rounded-xl border p-5 ${card.color}`}>
              <h3 className="mb-2 font-heading text-lg font-bold">{card.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 12. Models */}
      <section className={sectionClass}>
        <h2 className="mb-2 font-heading text-2xl font-bold text-gradient">{c.modelsTitle}</h2>
        <p className="mb-5 text-sm text-muted">{c.modelsSubtitle}</p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-background/60 text-muted">
              <tr>
                {[c.colModel, c.colTotal, c.colActive, c.colExperts, c.colShared].map(col => (
                  <th key={col} className="p-3 font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.modelRows.map((row, i) => (
                <tr key={row.name} className={`border-t border-border ${i % 2 ? 'bg-background/30' : ''}`}>
                  <td className="p-3 font-semibold text-text">
                    <a href={row.href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 hover:underline">{row.name}</a>
                  </td>
                  <td className="p-3 font-mono text-muted">{row.total}</td>
                  <td className="p-3 font-mono text-cyan-300">{row.active}</td>
                  <td className="p-3 font-mono text-muted">{row.experts}</td>
                  <td className="p-3 font-mono text-muted">{row.shared}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">{c.modelsNote}</p>
      </section>

      {/* 13. Takeaways */}
      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-emerald-200">{c.takeawaysTitle}</h2>
        <ul className="space-y-3">
          {takeaways.map(item => (
            <li key={item} className="flex gap-3 text-muted">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 14. Sources */}
      <section className={sectionClass}>
        <h2 className="mb-4 font-heading text-xl font-bold text-text">{c.sourcesTitle}</h2>
        <ul className="grid gap-2 text-sm md:grid-cols-2">
          {sources.map(source => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">{source.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
