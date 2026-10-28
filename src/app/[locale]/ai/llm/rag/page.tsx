'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { RAGPipelineVisualizer } from '@/components/interactive/RAGPipelineVisualizer'
import { RAGComparisonVisualizer } from '@/components/interactive/RAGComparisonVisualizer'
import { RAGCaseStudyVisualizer } from '@/components/interactive/RAGCaseStudyVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  { label: 'Lewis et al. (2020): Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', href: 'https://arxiv.org/abs/2005.11401' },
  { label: 'Robertson & Zaragoza (2009): The Probabilistic Relevance Framework – BM25 and Beyond', href: 'https://doi.org/10.1561/1500000019' },
  { label: 'Cormack, Clarke, Büttcher (2009): Reciprocal Rank Fusion', href: 'https://doi.org/10.1145/1571941.1572114' },
  { label: 'Malkov & Yashunin (2016/2018): HNSW – Hierarchical Navigable Small World graphs', href: 'https://arxiv.org/abs/1603.09320' },
  { label: 'Nogueira & Cho (2019): Passage Re-ranking with BERT', href: 'https://arxiv.org/abs/1901.04085' },
  { label: 'Anthropic (2024): Introducing Contextual Retrieval', href: 'https://www.anthropic.com/news/contextual-retrieval' },
  { label: 'Greshake et al. (2023): Not what you’ve signed up for – Indirect Prompt Injection', href: 'https://arxiv.org/abs/2302.12173' },
  { label: 'Zou et al. (2025): PoisonedRAG. USENIX Security', href: 'https://arxiv.org/abs/2402.07867' },
  { label: 'Li et al. (2024): Retrieval Augmented Generation or Long-Context LLMs? EMNLP Industry', href: 'https://arxiv.org/abs/2407.16833' },
  { label: 'Asai et al. (2023): Self-RAG', href: 'https://arxiv.org/abs/2310.11511' },
  { label: 'Edge et al. (2024): From Local to Global – A Graph RAG Approach', href: 'https://arxiv.org/abs/2404.16130' },
  { label: 'Gao et al. (2022): HyDE – Precise Zero-Shot Dense Retrieval without Relevance Labels', href: 'https://arxiv.org/abs/2212.10496' },
  { label: 'Es et al. (2023): RAGAS – Automated Evaluation of Retrieval Augmented Generation', href: 'https://arxiv.org/abs/2309.15217' },
  { label: 'Ragas docs: Context Recall', href: 'https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/' },
]

const CARD = 'rounded-2xl bg-surface/50 border border-border p-6 md:p-8'
const H2 = 'text-2xl font-bold font-heading text-gradient mb-4'

function Cards({ items, color }: { items: readonly { title: string; desc: string }[]; color: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map(item => (
        <div key={item.title} className="p-5 rounded-xl bg-surface border border-border">
          <h3 className={`font-bold font-heading mb-2 ${color}`}>{item.title}</h3>
          <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  )
}

function StepList({ title, steps, color }: { title: string; steps: readonly { title: string; desc: string }[]; color: string }) {
  return (
    <div className="rounded-xl bg-surface border border-border p-5">
      <h3 className={`text-lg font-bold font-heading mb-4 ${color}`}>{title}</h3>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary-light text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
            <div>
              <p className="font-semibold text-text">{s.title}</p>
              <p className="text-sm text-muted">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function RAGPage() {
  const { t, locale } = useTranslation()
  const r = t.rag

  return (
    <TopicLayout
      topicId="rag"
      title={r.title}
      description={r.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: r.title },
      ]}
    >
      <section className={CARD}>
        <h2 className={H2}>{r.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">{r.whatIsDesc}</p>
        <p className="text-muted leading-relaxed">{r.whatIsDesc2}</p>
      </section>

      <section className={CARD}>
        <h2 className={H2}>{r.whyRag}</h2>
        <p className="text-muted leading-relaxed">{r.whyRagDesc}</p>
      </section>

      <section>
        <h2 className={H2}>{r.pipeline}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.pipelineDesc}</p>
        <div className="grid lg:grid-cols-2 gap-4">
          <StepList title={r.indexPhase} steps={r.indexSteps} color="text-cyan-400" />
          <StepList title={r.queryPhase} steps={r.querySteps} color="text-purple-400" />
        </div>
      </section>

      <section className={CARD}>
        <h2 className={H2}>{r.chunking}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.chunkingDesc}</p>
        <Cards items={r.chunkingItems} color="text-amber-400" />
      </section>

      <section>
        <h2 className={H2}>{r.retrievalTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.retrievalDesc}</p>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <h3 className="font-bold font-heading text-cyan-400 mb-2">{r.bm25Title}</h3>
            <p className="text-sm text-muted leading-relaxed mb-3">{r.bm25Desc}</p>
            <p className="text-xs font-mono bg-background/60 rounded-lg p-3 break-words">{r.bm25Formula}</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <h3 className="font-bold font-heading text-purple-400 mb-2">{r.denseTitle}</h3>
            <p className="text-sm text-muted leading-relaxed mb-3">{r.denseDesc}</p>
            <Link href={`/${locale}/ai/llm/embeddings`} className="text-sm text-primary-light underline">{t.topicNames.embeddings}</Link>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <h3 className="font-bold font-heading text-emerald-400 mb-2">{r.hybridTitle}</h3>
            <p className="text-sm text-muted leading-relaxed mb-3">{r.hybridDesc}</p>
            <p className="text-xs font-mono bg-background/60 rounded-lg p-3">RRF(d) = Σ 1 / (k + rank(d)), k = 60</p>
          </div>
        </div>
      </section>

      <section className={CARD}>
        <h2 className={H2}>{r.annTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{r.annDesc}</p>
        <p className="text-muted leading-relaxed mb-6">{r.hnswDesc}</p>
        <Cards items={r.hnswParams} color="text-sky-400" />
      </section>

      <section className={CARD}>
        <h2 className={H2}>{r.rerankTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.rerankDesc}</p>
        <Cards items={r.rerankItems} color="text-rose-400" />
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-text mb-2">{r.interactiveDemo}</h2>
        <p className="text-sm text-muted mb-6">{r.demoDesc}</p>
        <RAGPipelineVisualizer />
      </section>

      <section className={CARD}>
        <h2 className={H2}>{r.citeTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{r.citeDesc}</p>
        <ul className="space-y-2 text-sm text-muted list-disc pl-5">
          {r.citeItems.map(item => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 p-6 md:p-8">
        <h2 className={H2}>{r.injectionTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{r.injectionDesc}</p>
        <p className="text-muted leading-relaxed mb-6">{r.injectionPoison}</p>
        <h3 className="font-bold font-heading text-text mb-3">{r.injectionDefenseTitle}</h3>
        <ul className="space-y-2 text-sm text-muted list-disc pl-5 mb-4">
          {r.injectionDefenses.map(item => <li key={item}>{item}</li>)}
        </ul>
        <Link href={`/${locale}/ai/agents/security`} className="text-sm text-primary-light underline">{t.topicNames['agent-security']}</Link>
      </section>

      <section className={CARD}>
        <h2 className={H2}>{r.lcTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">{r.lcDesc}</p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-3">{r.lcSituation}</th>
                <th className="py-3">{r.lcChoice}</th>
              </tr>
            </thead>
            <tbody>
              {r.lcRows.map(row => (
                <tr key={row.situation} className="border-b border-border">
                  <td className="py-3 pr-3 text-muted">{row.situation}</td>
                  <td className="py-3 text-text">{row.choice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href={`/${locale}/ai/llm/context-rot`} className="text-sm text-primary-light underline">{t.topicNames['context-rot']}</Link>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-text mb-2">{r.comparisonTitle}</h2>
        <p className="text-sm text-muted mb-6">{r.comparisonDesc}</p>
        <RAGComparisonVisualizer />
      </section>

      <section className={CARD}>
        <h2 className={H2}>{r.agenticRag}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.agenticRagDesc}</p>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-3">{r.agenticAdvantages}</h3>
            <ul className="space-y-2 text-sm text-muted list-disc pl-5">
              {r.agenticAdv.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-3">{r.agenticDisadvantages}</h3>
            <ul className="space-y-2 text-sm text-muted list-disc pl-5">
              {r.agenticDisadv.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
        <h3 className="text-lg font-bold font-heading text-text mb-2">{r.multiTool}</h3>
        <p className="text-muted leading-relaxed mb-4">{r.multiToolDesc}</p>
        <Cards items={r.tools} color="text-sky-400" />
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-text mb-2">{r.caseStudyTitle}</h2>
        <p className="text-sm text-muted mb-6">{r.caseStudyDesc}</p>
        <RAGCaseStudyVisualizer />
      </section>

      <section className={CARD}>
        <h2 className={H2}>{r.advancedTechniques}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.advancedTechniquesDesc}</p>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold font-heading text-cyan-400 mb-2">{r.selfRag}</h3>
            <p className="text-muted leading-relaxed">{r.selfRagDesc}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-pink-400 mb-2">{r.graphRag}</h3>
            <p className="text-muted leading-relaxed">{r.graphRagDesc}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-lime-400 mb-2">{r.queryAugmentation}</h3>
            <p className="text-muted leading-relaxed mb-4">{r.queryAugmentationDesc}</p>
            <Cards items={r.queryTechniques} color="text-lime-400" />
          </div>
        </div>
      </section>

      <section className={CARD}>
        <h2 className={H2}>{r.evaluation}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.evaluationDesc}</p>
        <h3 className="text-lg font-bold font-heading text-text mb-3">{r.retrievalMetricsTitle}</h3>
        <p className="text-muted leading-relaxed mb-6">{r.retrievalMetricsDesc}</p>
        <h3 className="text-lg font-bold font-heading text-text mb-3">{r.ragasFramework}</h3>
        <p className="text-muted leading-relaxed mb-4">{r.ragasFrameworkDesc}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-3">{r.metricName}</th>
                <th className="py-3 pr-3">{r.metricQuestion}</th>
                <th className="py-3">{r.metricNeedsReference}</th>
              </tr>
            </thead>
            <tbody>
              {r.metrics.map(m => (
                <tr key={m.name} className="border-b border-border align-top">
                  <td className="py-3 pr-3 font-semibold text-text">{m.name}</td>
                  <td className="py-3 pr-3 text-muted">{m.desc}</td>
                  <td className="py-3 text-muted">{m.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className={H2}>{r.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {r.takeaways.map((item, i) => (
              <li key={item} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary-light text-sm font-bold">{i + 1}</span>
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold font-heading text-text">{r.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map(s => (
            <li key={s.href}>
              <a className="text-primary-light underline" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
