'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { LatexBlock } from '@/components/ui/Latex'
import { RefusalDirectionDemo } from '@/components/interactive/RefusalDirectionDemo'
import { useTranslation } from '@/lib/i18n/context'

const FORMULA_DIFF_MEANS = String.raw`\mathbf r_i^{(l)} = \boldsymbol\mu_i^{(l)} - \boldsymbol\nu_i^{(l)}, \qquad \boldsymbol\mu_i^{(l)} = \frac{1}{|\mathcal D_{\text{harmful}}|}\sum_{t \in \mathcal D_{\text{harmful}}} \mathbf x_i^{(l)}(t), \qquad \boldsymbol\nu_i^{(l)} = \frac{1}{|\mathcal D_{\text{harmless}}|}\sum_{t \in \mathcal D_{\text{harmless}}} \mathbf x_i^{(l)}(t)`
const FORMULA_ABLATION = String.raw`\mathbf x' = \mathbf x - \hat{\mathbf r}\,\hat{\mathbf r}^{\top}\mathbf x = \left(I - \hat{\mathbf r}\,\hat{\mathbf r}^{\top}\right)\mathbf x, \qquad \hat{\mathbf r} = \frac{\mathbf r}{\lVert \mathbf r \rVert}`
const FORMULA_ADDITION = String.raw`\mathbf x^{(l^*)\prime} = \mathbf x^{(l^*)} + \mathbf r^{(l^*)}`
const FORMULA_ORTHO = String.raw`W_{\text{out}}' = W_{\text{out}} - \hat{\mathbf r}\,\hat{\mathbf r}^{\top} W_{\text{out}} = \left(I - \hat{\mathbf r}\,\hat{\mathbf r}^{\top}\right) W_{\text{out}}`
const FORMULA_ORTHO_CHECK = String.raw`\hat{\mathbf r}^{\top} W_{\text{out}}' = \hat{\mathbf r}^{\top} W_{\text{out}} - (\hat{\mathbf r}^{\top}\hat{\mathbf r})\,\hat{\mathbf r}^{\top} W_{\text{out}} = \mathbf 0^{\top}`

const SOURCES = [
  { key: 'source1', href: 'https://arxiv.org/abs/2406.11717' },
  { key: 'source2', href: 'https://arxiv.org/abs/2502.17420' },
  { key: 'source3', href: 'https://arxiv.org/abs/2308.10248' },
  { key: 'source4', href: 'https://arxiv.org/abs/2310.01405' },
  { key: 'source5', href: 'https://arxiv.org/abs/2310.03693' },
  { key: 'source6', href: 'https://arxiv.org/abs/2508.03153' },
  { key: 'source7', href: 'https://arxiv.org/abs/2505.19056' },
  { key: 'source8', href: 'https://arxiv.org/abs/2408.00761' },
  { key: 'source9', href: 'https://huggingface.co/blog/mlabonne/abliteration' },
] as const

export default function AbliterationPage() {
  const { t } = useTranslation()
  const c = t.abliteration

  const openCards = [
    { title: c.openCard1Title, desc: c.openCard1Desc, color: 'text-orange-400', box: 'from-orange-500/10 to-red-500/5 border-orange-500/20' },
    { title: c.openCard2Title, desc: c.openCard2Desc, color: 'text-emerald-400', box: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20' },
    { title: c.openCard3Title, desc: c.openCard3Desc, color: 'text-purple-400', box: 'from-purple-500/10 to-pink-500/5 border-purple-500/20' },
    { title: c.openCard4Title, desc: c.openCard4Desc, color: 'text-cyan-400', box: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/20' },
  ]

  const selectionCriteria = [c.step1Criterion1, c.step1Criterion2, c.step1Criterion3, c.step1Criterion4]
  const takeaways = [c.takeaway1, c.takeaway2, c.takeaway3, c.takeaway4, c.takeaway5]

  return (
    <TopicLayout topicId="abliteration"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.title },
      ]}
    >
      {/* Intro */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.introTitle}</h2>
        <div className="space-y-4 text-muted leading-relaxed text-lg">
          <p>{c.introP1}</p>
          <p>{c.introP2}</p>
        </div>
      </section>

      {/* Linear representations */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.linearTitle}</h2>
        <div className="space-y-4 text-muted leading-relaxed">
          <p>{c.linearP1}</p>
          <p>{c.linearP2}</p>
        </div>
      </section>

      {/* Step 1: difference in means */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.step1Title}</h2>
        <p className="text-muted leading-relaxed">{c.step1P1}</p>
        <div className="my-6 overflow-x-auto rounded-xl bg-background/60 border border-border p-4 text-text">
          <LatexBlock>{FORMULA_DIFF_MEANS}</LatexBlock>
        </div>
        <p className="text-muted leading-relaxed mb-4">{c.step1P2}</p>
        <ul className="grid md:grid-cols-2 gap-3">
          {selectionCriteria.map((item, i) => (
            <li key={i} className="flex gap-3 items-start p-4 rounded-xl bg-background/60 border border-border text-sm text-muted">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Step 2: ablation and addition */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.step2Title}</h2>
        <p className="text-muted leading-relaxed">{c.step2P1}</p>
        <div className="my-6 overflow-x-auto rounded-xl bg-background/60 border border-border p-4 text-text">
          <LatexBlock>{FORMULA_ABLATION}</LatexBlock>
        </div>
        <p className="text-muted leading-relaxed">{c.step2P2}</p>
        <div className="my-6 overflow-x-auto rounded-xl bg-background/60 border border-border p-4 text-text">
          <LatexBlock>{FORMULA_ADDITION}</LatexBlock>
        </div>
        <p className="text-muted leading-relaxed">{c.step2P3}</p>
      </section>

      {/* Interactive demo */}
      <section>
        <RefusalDirectionDemo />
      </section>

      {/* Step 3: weight orthogonalization */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.step3Title}</h2>
        <p className="text-muted leading-relaxed">{c.step3P1}</p>
        <div className="my-6 overflow-x-auto rounded-xl bg-background/60 border border-border p-4 text-text">
          <LatexBlock>{FORMULA_ORTHO}</LatexBlock>
          <LatexBlock>{FORMULA_ORTHO_CHECK}</LatexBlock>
        </div>
        <p className="text-muted leading-relaxed">{c.step3P2}</p>
      </section>

      {/* Evidence and limits */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.evidenceTitle}</h2>
        <div className="space-y-4 text-muted leading-relaxed">
          <p>{c.evidenceP1}</p>
          <p>{c.evidenceP2}</p>
        </div>
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
          <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{c.limitsTitle}</h3>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>{c.limitsP1}</p>
            <p>{c.limitsP2}</p>
          </div>
        </div>
      </section>

      {/* Open weights */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.openTitle}</h2>
        <p className="text-muted leading-relaxed">{c.openP1}</p>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {openCards.map(card => (
            <div key={card.title} className={`p-5 rounded-xl bg-gradient-to-br border ${card.box}`}>
              <h3 className={`text-lg font-bold font-heading mb-2 ${card.color}`}>{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-muted leading-relaxed">{c.openP2}</p>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {takeaways.map((item, i) => (
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
        <h2 className="text-xl font-bold font-heading text-text mb-4">{c.sourcesTitle}</h2>
        <ol className="space-y-2 text-sm list-decimal pl-5">
          {SOURCES.map(s => (
            <li key={s.key} className="text-muted">
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline hover:text-cyan-200">{c[s.key]}</a>
            </li>
          ))}
        </ol>
      </section>
    </TopicLayout>
  )
}
