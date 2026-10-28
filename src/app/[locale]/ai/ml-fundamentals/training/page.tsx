'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { TrainingProgressVisualizer } from '@/components/interactive/TrainingProgressVisualizer'
import { LatexBlock } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const SECTION = 'rounded-2xl bg-surface/50 border border-border p-6 md:p-8'
const H2 = 'text-2xl font-bold font-heading text-gradient mb-6'

const F = {
  empirical: '\\hat R(\\theta) = \\frac{1}{n}\\sum_{i=1}^{n} \\ell\\big(f_\\theta(x_i),\\, y_i\\big)',
  risk: 'R(\\theta) = \\mathbb{E}_{(x,y)\\sim D}\\Big[\\ell\\big(f_\\theta(x),\\, y\\big)\\Big]',
  mse: '\\ell_{\\mathrm{MSE}} = \\frac{1}{n}\\sum_{i=1}^{n}\\big(\\hat y_i - y_i\\big)^2',
  ce: '\\ell_{\\mathrm{CE}} = -\\log p_\\theta(y \\mid x), \\qquad p_\\theta(k \\mid x) = \\frac{e^{z_k}}{\\sum_j e^{z_j}}',
  ppl: '\\mathrm{PPL} = \\exp\\Big(\\frac{1}{T}\\sum_{t=1}^{T} -\\log p_\\theta(x_t \\mid x_{<t})\\Big)',
  biasVariance:
    '\\mathbb{E}\\big[(y - \\hat f(x))^2\\big] = \\underbrace{\\big(\\mathbb{E}[\\hat f(x)] - f(x)\\big)^2}_{\\mathrm{Bias}^2} + \\underbrace{\\mathrm{Var}\\big[\\hat f(x)\\big]}_{\\mathrm{Var}} + \\sigma^2',
  l2: '\\tilde L(w) = L(w) + \\lambda \\lVert w \\rVert^2 \\;\\Rightarrow\\; w \\leftarrow (1 - 2\\eta\\lambda)\\, w - \\eta\\, \\nabla L(w)',
  l1: '\\tilde L(w) = L(w) + \\lambda \\sum_i |w_i|',
  dropout: '\\tilde h_i = \\frac{r_i}{1-p}\\, h_i, \\qquad r_i \\sim \\mathrm{Bernoulli}(1-p)',
}

const SOURCES: [string, string][] = [
  ['Hastie, Tibshirani & Friedman: The Elements of Statistical Learning, ch. 7', 'https://hastie.su.domains/ElemStatLearn/'],
  ['Goodfellow, Bengio & Courville (2016): Deep Learning, ch. 7 (Regularization)', 'https://www.deeplearningbook.org/contents/regularization.html'],
  ['Srivastava et al. (2014): Dropout: A Simple Way to Prevent Neural Networks from Overfitting', 'https://jmlr.org/papers/v15/srivastava14a.html'],
  ['Zhang et al. (2017): Understanding deep learning requires rethinking generalization', 'https://arxiv.org/abs/1611.03530'],
  ['Belkin et al. (2019): Reconciling modern machine-learning practice and the classical bias–variance trade-off', 'https://arxiv.org/abs/1812.11118'],
  ['Nakkiran et al. (2019): Deep Double Descent', 'https://arxiv.org/abs/1912.02292'],
  ['Muennighoff et al. (2023): Scaling Data-Constrained Language Models', 'https://arxiv.org/abs/2305.16264'],
  ['Touvron et al. (2023): Llama 2: Open Foundation and Fine-Tuned Chat Models', 'https://arxiv.org/abs/2307.09288'],
]

export default function TrainingPage() {
  const { t, locale } = useTranslation()
  const tr = t.training

  const splits = [
    { name: tr.trainSplit, desc: tr.trainSplitDesc, cls: 'from-sky-500/10 to-blue-500/10 border-sky-500/20', accent: 'text-sky-400' },
    { name: tr.valSplit, desc: tr.valSplitDesc, cls: 'from-orange-500/10 to-amber-500/10 border-orange-500/20', accent: 'text-orange-400' },
    { name: tr.testSplit, desc: tr.testSplitDesc, cls: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20', accent: 'text-emerald-400' },
  ]

  const regularizers = [
    { name: tr.l2, desc: tr.l2Desc, formula: F.l2, accent: 'text-purple-400' },
    { name: tr.l1, desc: tr.l1Desc, formula: F.l1, accent: 'text-cyan-400' },
    { name: tr.dropout, desc: tr.dropoutDesc, formula: F.dropout, accent: 'text-orange-400' },
    { name: tr.earlyStopping, desc: tr.earlyStoppingDesc, accent: 'text-emerald-400' },
    { name: tr.augmentation, desc: tr.augmentationDesc, accent: 'text-sky-400' },
  ]

  return (
    <TopicLayout
      topicId="training"
      title={tr.title}
      description={tr.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: tr.title },
      ]}
    >
      {/* Empirical risk vs. risk */}
      <section className={SECTION}>
        <h2 className={H2}>{tr.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">{tr.whatIsDesc}</p>
        <LatexBlock className="my-6 overflow-x-auto text-text">{F.empirical}</LatexBlock>
        <p className="text-muted leading-relaxed">{tr.whatIsDesc2}</p>
        <LatexBlock className="my-6 overflow-x-auto text-text">{F.risk}</LatexBlock>
        <p className="text-muted leading-relaxed">
          {tr.whatIsDesc3}{' '}
          <Link href={`/${locale}/ai/ml-fundamentals/gradient-descent`} className="text-cyan-300 underline">
            {tr.optimizationLinkLabel}
          </Link>
          .
        </p>
      </section>

      {/* Loss functions */}
      <section className={SECTION}>
        <h2 className={H2}>{tr.lossFunctions}</h2>
        <p className="text-muted leading-relaxed mb-6">{tr.lossFunctionsDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-3">{tr.mse}</h3>
            <LatexBlock className="mb-3 overflow-x-auto text-text">{F.mse}</LatexBlock>
            <p className="text-sm text-muted">{tr.mseDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-3">{tr.crossEntropy}</h3>
            <LatexBlock className="mb-3 overflow-x-auto text-text">{F.ce}</LatexBlock>
            <p className="text-sm text-muted">{tr.crossEntropyDesc}</p>
          </div>
        </div>
        <div className="mt-6 p-5 rounded-xl bg-background border border-border">
          <LatexBlock className="mb-3 overflow-x-auto text-text">{F.ppl}</LatexBlock>
          <p className="text-sm text-muted">
            {tr.llmNote}{' '}
            <Link href={`/${locale}/ai/llm/training`} className="text-cyan-300 underline">
              {tr.llmLinkLabel}
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Data splits */}
      <section className={SECTION}>
        <h2 className={H2}>{tr.splits}</h2>
        <p className="text-muted leading-relaxed mb-6">{tr.splitsDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {splits.map((s) => (
            <div key={s.name} className={`p-5 bg-gradient-to-br border rounded-xl ${s.cls}`}>
              <h3 className={`text-lg font-bold font-heading mb-2 ${s.accent}`}>{s.name}</h3>
              <p className="text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted leading-relaxed">{tr.leakage}</p>
      </section>

      {/* Under- and overfitting */}
      <section className={SECTION}>
        <h2 className={H2}>{tr.fit}</h2>
        <p className="text-muted leading-relaxed">{tr.fitDesc}</p>
        <LatexBlock className="my-6 overflow-x-auto text-text">{F.biasVariance}</LatexBlock>
        <p className="text-muted leading-relaxed">{tr.fitDesc2}</p>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{tr.interactiveDemo}</h2>
            <p className="text-sm text-muted">{tr.demoDesc}</p>
          </div>
        </div>
        <TrainingProgressVisualizer />
      </section>

      {/* Regularization */}
      <section className={SECTION}>
        <h2 className={H2}>{tr.regularization}</h2>
        <p className="text-muted leading-relaxed mb-6">{tr.regularizationDesc}</p>
        <div className="space-y-4">
          {regularizers.map((r) => (
            <div key={r.name} className="p-5 bg-background rounded-xl border border-border">
              <h3 className={`text-lg font-bold font-heading mb-2 ${r.accent}`}>{r.name}</h3>
              {r.formula && <LatexBlock className="mb-3 overflow-x-auto text-text">{r.formula}</LatexBlock>}
              <p className="text-sm text-muted leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted leading-relaxed">{tr.llmRegNote}</p>
      </section>

      {/* Double descent */}
      <section className={SECTION}>
        <h2 className={H2}>{tr.modern}</h2>
        <p className="text-muted leading-relaxed">{tr.modernDesc}</p>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className={H2}>{tr.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[tr.takeaway1, tr.takeaway2, tr.takeaway3, tr.takeaway4].map((item, i) => (
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
      <section className={SECTION}>
        <h2 className="text-xl font-bold font-heading text-text mb-4">{tr.sources}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map(([label, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
