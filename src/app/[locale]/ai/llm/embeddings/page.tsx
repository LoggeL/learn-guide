'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { EmbeddingVisualizer } from '@/components/interactive'
import { getEmbedding } from '@/components/interactive/EmbeddingVisualizer'
import { MatryoshkaDemo } from '@/components/interactive/MatryoshkaDemo'
import { useTranslation } from '@/lib/i18n/context'

// Real o200k_base ID of " cat" (verified with js-tiktoken) and vocabulary size.
const CAT_TOKEN_ID = 9059
const O200K_VOCAB = 200_019

// Sources: GPT-2 paper (Table 2), Llama 3 Herd paper (Table 3).
const MODEL_WIDTHS: [string, number][] = [
  ['GPT-2 small', 768],
  ['GPT-2 XL', 1600],
  ['Llama 3.1 8B', 4096],
  ['Llama 3.1 70B', 8192],
  ['Llama 3.1 405B', 16384],
]

// Sources: model cards / provider docs listed in the sources section.
const TEXT_MODELS: [string, string, boolean][] = [
  ['all-MiniLM-L6-v2', '384', false],
  ['text-embedding-3-small', '1536', true],
  ['text-embedding-3-large', '3072', true],
  ['gemini-embedding-001', '3072', true],
  ['Qwen3-Embedding-8B', '4096', true],
]

const COSINE_PAIRS: [string, string][] = [
  ['king', 'queen'],
  ['king', 'banana'],
]

function dot(a: number[], b: number[]) {
  return a.reduce((sum, x, i) => sum + x * b[i], 0)
}
function len(a: number[]) {
  return Math.sqrt(dot(a, a))
}

export default function EmbeddingsPage() {
  const { t, locale } = useTranslation()
  const e = t.embeddings
  const fmt = (x: number) => x.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const vecStr = (v: number[]) => `[${v.map(fmt).join(', ')}]`

  return (
    <TopicLayout topicId="embeddings"
      title={e.title}
      description={e.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: e.title },
      ]}
    >
      {/* Two meanings */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{e.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">{e.whatIsDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{e.kindTokenTitle}</h3>
            <p className="text-sm text-muted">{e.kindTokenDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{e.kindTextTitle}</h3>
            <p className="text-sm text-muted">{e.kindTextDesc}</p>
          </div>
        </div>
      </section>

      {/* Token embeddings: lookup */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{e.lookupTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.lookupDesc}</p>

        <div className="mb-6 p-6 rounded-xl bg-background border border-border">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <div className="text-lg font-semibold mb-1">{e.diagramToken}</div>
              <div className="text-xs text-muted font-mono">&quot; cat&quot; → ID {CAT_TOKEN_ID}</div>
            </div>
            <div className="text-2xl text-muted">→</div>
            <div className="p-4 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
              <div className="text-lg font-semibold mb-1">{e.diagramTable}</div>
              <div className="text-xs text-muted font-mono">
                {e.diagramTableSize.replace('{vocab}', O200K_VOCAB.toLocaleString(locale))}
              </div>
              <div className="text-xs text-cyan-300 font-mono mt-1">E[{CAT_TOKEN_ID}]</div>
            </div>
            <div className="text-2xl text-muted">→</div>
            <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <div className="text-lg font-semibold mb-1">{e.diagramVector}</div>
              <div className="text-xs text-muted font-mono">[0.23, −0.87, 0.41, …]</div>
            </div>
          </div>
          <p className="text-xs text-muted text-center mt-4">{e.diagramNote}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{e.trainingTitle}</h3>
            <p className="text-sm text-muted">{e.trainingDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{e.contextTitle}</h3>
            <p className="text-sm text-muted">{e.contextDesc}</p>
          </div>
        </div>

        <div className="mt-4 p-5 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl">
          <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{e.positionTitle}</h3>
          <p className="text-sm text-muted mb-3">{e.positionDesc}</p>
          <Link
            href={`/${locale}/ai/llm/positional-encoding`}
            className="text-sm text-primary-light hover:underline"
          >
            {e.positionLink} →
          </Link>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold font-heading text-text mb-3">{e.widthTitle}</h3>
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-2 bg-background/60 text-sm font-bold">
              <div className="p-3 border-r border-border text-muted">{e.widthModel}</div>
              <div className="p-3 text-muted">{e.widthDim}</div>
            </div>
            {MODEL_WIDTHS.map(([model, width], i) => (
              <div key={model} className={`grid grid-cols-2 text-sm ${i % 2 ? 'bg-background/30' : ''}`}>
                <div className="p-3 border-t border-r border-border text-text">{model}</div>
                <div className="p-3 border-t border-border font-mono text-cyan-300">{width.toLocaleString(locale)}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-2">{e.widthNote}</p>
        </div>
      </section>

      {/* Text embedding models */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{e.textEmbTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.textEmbDesc}</p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: e.poolMeanTitle, desc: e.poolMeanDesc, cls: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400' },
            { title: e.poolClsTitle, desc: e.poolClsDesc, cls: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-400' },
            { title: e.poolLastTitle, desc: e.poolLastDesc, cls: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400' },
          ].map((card) => (
            <div key={card.title} className={`p-5 bg-gradient-to-br border rounded-xl ${card.cls}`}>
              <h3 className="text-lg font-bold font-heading mb-2">{card.title}</h3>
              <p className="text-sm text-muted">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl bg-background border border-border mb-6">
          <h3 className="text-lg font-bold font-heading text-text mb-2">{e.contrastiveTitle}</h3>
          <p className="text-sm text-muted leading-relaxed mb-4">{e.contrastiveDesc}</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              (q, d⁺) — {e.contrastivePositive}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
              (q, d⁻₁ … d⁻ₙ) — {e.contrastiveNegative}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold font-heading text-text mb-3">{e.modelsTitle}</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-background/60 text-muted">
              <tr>
                <th className="p-3 text-left font-bold">{e.modelsModel}</th>
                <th className="p-3 text-left font-bold">{e.modelsDim}</th>
                <th className="p-3 text-left font-bold">{e.modelsShorten}</th>
              </tr>
            </thead>
            <tbody>
              {TEXT_MODELS.map(([model, dims, mrl]) => (
                <tr key={model} className="border-t border-border">
                  <td className="p-3 font-mono text-text">{model}</td>
                  <td className="p-3 font-mono text-cyan-300">{dims}</td>
                  <td className={`p-3 ${mrl ? 'text-emerald-400' : 'text-muted'}`}>{mrl ? e.yes : e.no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Matryoshka */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{e.matryoshkaTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.matryoshkaDesc}</p>
        <MatryoshkaDemo />
      </section>

      {/* Cosine similarity */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{e.cosineTitle}</h2>
        <div className="mb-6 p-4 rounded-xl bg-background border border-border text-center font-mono text-lg text-text">
          cos(θ) = (a · b) / (‖a‖ · ‖b‖)
        </div>
        <p className="text-muted leading-relaxed mb-6">{e.cosineDesc}</p>
        <p className="text-sm text-text mb-3">{e.cosineWorked}</p>
        <div className="space-y-3">
          {COSINE_PAIRS.map(([wa, wb]) => {
            const a = getEmbedding(wa)
            const b = getEmbedding(wb)
            const d = dot(a, b)
            const la = len(a)
            const lb = len(b)
            return (
              <div key={`${wa}-${wb}`} className="p-4 rounded-xl bg-background border border-border text-xs font-mono space-y-1 overflow-x-auto">
                <div className="text-muted">a = {wa} {vecStr(a)} · b = {wb} {vecStr(b)}</div>
                <div className="text-text">
                  {e.cosineDot}: a · b = {fmt(d)} · {e.cosineNorms}: ‖a‖ = {fmt(la)}, ‖b‖ = {fmt(lb)}
                </div>
                <div className={d / (la * lb) > 0.5 ? 'text-emerald-300' : 'text-red-300'}>
                  {e.cosineResult} = {fmt(d)} / ({fmt(la)} · {fmt(lb)}) = {fmt(d / (la * lb))}
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-muted mt-4">{e.cosineCaveat}</p>
      </section>

      {/* Vector arithmetic */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{e.operations}</h2>
        <p className="text-muted leading-relaxed">{e.operationsDesc}</p>
      </section>

      {/* Use Cases */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{e.useCases}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{e.search}</h3>
            <p className="text-sm text-muted">{e.searchDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-green-400 mb-2">{e.clustering}</h3>
            <p className="text-sm text-muted">{e.clusteringDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{e.classification}</h3>
            <p className="text-sm text-muted">{e.classificationDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-pink-400 mb-2">{e.rag}</h3>
            <p className="text-sm text-muted">{e.ragDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-heading text-text">{e.interactiveDemo}</h2>
          <p className="text-sm text-muted">{e.demoDesc}</p>
        </div>
        <EmbeddingVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{e.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[e.takeaway1, e.takeaway2, e.takeaway3, e.takeaway4].map((item, i) => (
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
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-5">{e.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {e.sources.map(({ label, href }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
