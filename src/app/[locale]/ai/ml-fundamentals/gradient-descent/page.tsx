'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { GradientDescentVisualizer } from '@/components/interactive/GradientDescentVisualizer'
import { LatexBlock } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const SECTION = 'rounded-2xl bg-surface/50 border border-border p-6 md:p-8'
const H2 = 'text-2xl font-bold font-heading text-gradient mb-6'

const F = {
  update: '\\theta_{t+1} = \\theta_t - \\eta\\,\\nabla_\\theta L(\\theta_t)',
  taylor: 'L(\\theta + \\Delta) \\approx L(\\theta) + \\nabla L(\\theta)^{\\top}\\Delta',
  stability: '0 < \\eta < \\frac{2}{a}',
  chain:
    'L = (\\hat y - y)^2,\\quad \\hat y = w x \\quad\\Rightarrow\\quad \\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial \\hat y}\\cdot\\frac{\\partial \\hat y}{\\partial w} = 2(\\hat y - y)\\cdot x',
  minibatch:
    'g_t = \\frac{1}{B}\\sum_{i \\in \\mathcal{B}_t} \\nabla_\\theta\\, \\ell(\\theta_t;\\, x_i, y_i) \\;\\approx\\; \\nabla L(\\theta_t)',
  sgd: '\\theta_{t+1} = \\theta_t - \\eta\\, g_t',
  momentum: 'v_{t+1} = \\beta\\, v_t + g_t, \\qquad \\theta_{t+1} = \\theta_t - \\eta\\, v_{t+1}',
  adam:
    '\\begin{aligned} m_t &= \\beta_1 m_{t-1} + (1-\\beta_1)\\, g_t \\\\ v_t &= \\beta_2 v_{t-1} + (1-\\beta_2)\\, g_t^{2} \\\\ \\hat m_t &= \\frac{m_t}{1-\\beta_1^{t}}, \\quad \\hat v_t = \\frac{v_t}{1-\\beta_2^{t}} \\\\ \\theta_t &= \\theta_{t-1} - \\eta\\, \\frac{\\hat m_t}{\\sqrt{\\hat v_t} + \\varepsilon} \\end{aligned}',
  adamw:
    '\\theta_t = \\theta_{t-1} - \\eta \\left( \\frac{\\hat m_t}{\\sqrt{\\hat v_t} + \\varepsilon} + \\lambda\\, \\theta_{t-1} \\right)',
  muon:
    '\\begin{aligned} M_t &= \\mu\\, M_{t-1} + G_t \\\\ O_t &= \\mathrm{NS}_5(M_t) \\approx U V^{\\top} \\quad (M_t = U \\Sigma V^{\\top}) \\\\ W_t &= W_{t-1} - \\eta\\, O_t \\\\[4pt] X_{k+1} &= a X_k + b\\,(X_k X_k^{\\top}) X_k + c\\,(X_k X_k^{\\top})^2 X_k,\\quad X_0 = \\frac{M_t}{\\lVert M_t \\rVert_F} \\\\ (a, b, c) &= (3.4445,\\, -4.7750,\\, 2.0315) \\end{aligned}',
  warmup: '\\eta_t = \\eta_{\\max} \\cdot \\frac{t}{T_w} \\qquad (t \\le T_w)',
  cosine:
    '\\eta_t = \\eta_{\\min} + \\tfrac{1}{2}\\,(\\eta_{\\max} - \\eta_{\\min})\\left(1 + \\cos\\frac{\\pi\\,(t - T_w)}{T - T_w}\\right)',
  wsd: '\\eta_t = \\begin{cases} \\eta_{\\max}\\, t / T_w & t \\le T_w \\\\ \\eta_{\\max} & T_w < t \\le T_d \\\\ \\eta_{\\max} \\searrow \\eta_{\\min} & T_d < t \\le T \\end{cases}',
  step: '\\eta_t = \\eta_0 \\cdot \\gamma^{\\lfloor t / s \\rfloor}',
  kappa: '\\kappa = \\frac{a_{\\max}}{a_{\\min}}',
}

const SOURCES: [string, string][] = [
  ['Rumelhart, Hinton & Williams (1986): Learning representations by back-propagating errors', 'https://doi.org/10.1038/323533a0'],
  ['Baydin et al. (2018): Automatic differentiation in machine learning: a survey', 'https://arxiv.org/abs/1502.05767'],
  ['Bengio (2012): Practical recommendations for gradient-based training of deep architectures', 'https://arxiv.org/abs/1206.5533'],
  ['Goyal et al. (2017): Accurate, Large Minibatch SGD', 'https://arxiv.org/abs/1706.02677'],
  ['Polyak (1964): Some methods of speeding up the convergence of iteration methods', 'https://doi.org/10.1016/0041-5553(64)90137-5'],
  ['Kingma & Ba (2015): Adam: A Method for Stochastic Optimization', 'https://arxiv.org/abs/1412.6980'],
  ['Loshchilov & Hutter (2019): Decoupled Weight Decay Regularization (AdamW)', 'https://arxiv.org/abs/1711.05101'],
  ['Jordan (2024): Muon: An optimizer for hidden layers in neural networks', 'https://kellerjordan.github.io/posts/muon/'],
  ['Liu et al. (2025): Muon is Scalable for LLM Training', 'https://arxiv.org/abs/2502.16982'],
  ['Kimi Team (2025): Kimi K2: Open Agentic Intelligence', 'https://arxiv.org/abs/2507.20534'],
  ['Touvron et al. (2023): Llama 2: Open Foundation and Fine-Tuned Chat Models', 'https://arxiv.org/abs/2307.09288'],
  ['Loshchilov & Hutter (2017): SGDR: Stochastic Gradient Descent with Warm Restarts', 'https://arxiv.org/abs/1608.03983'],
  ['Hu et al. (2024): MiniCPM (WSD schedule)', 'https://arxiv.org/abs/2404.06395'],
  ['He et al. (2016): Deep Residual Learning for Image Recognition', 'https://arxiv.org/abs/1512.03385'],
  ['Dauphin et al. (2014): Identifying and attacking the saddle point problem', 'https://arxiv.org/abs/1406.2572'],
  ['Lee et al. (2016): Gradient Descent Converges to Minimizers', 'https://arxiv.org/abs/1602.04915'],
  ['Choromanska et al. (2015): The Loss Surfaces of Multilayer Networks', 'https://arxiv.org/abs/1412.0233'],
]

/** Worked example: L(w) = (w − 3)², η = 0.1, w₀ = 0. */
const WORKED_ROWS = (() => {
  const rows: { k: number; w: number; grad: number; next: number }[] = []
  let w = 0
  for (let k = 0; k < 4; k++) {
    const grad = 2 * (w - 3)
    const next = w - 0.1 * grad
    rows.push({ k, w, grad, next })
    w = next
  }
  return rows
})()

export default function GradientDescentPage() {
  const { t, locale } = useTranslation()
  const g = t.gradientDescent
  const num = (v: number) =>
    v.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 4 })

  const optimizers = [
    { name: g.sgd, formula: F.sgd, desc: g.sgdDesc, accent: 'text-sky-400', href: 'https://arxiv.org/abs/1206.5533' },
    { name: g.momentum, formula: F.momentum, desc: g.momentumDesc, accent: 'text-orange-400', href: 'https://doi.org/10.1016/0041-5553(64)90137-5' },
    { name: g.adam, formula: F.adam, desc: g.adamDesc, accent: 'text-emerald-400', href: 'https://arxiv.org/abs/1412.6980' },
    { name: g.adamw, formula: F.adamw, desc: g.adamwDesc, accent: 'text-emerald-300', href: 'https://arxiv.org/abs/1711.05101' },
    { name: g.muon, formula: F.muon, desc: g.muonDesc, accent: 'text-purple-400', href: 'https://kellerjordan.github.io/posts/muon/' },
  ]

  const schedules = [
    { name: g.warmup, formula: F.warmup, desc: g.warmupDesc, cls: 'from-emerald-500/10 to-green-500/10 border-emerald-500/20', accent: 'text-emerald-400' },
    { name: g.cosineAnnealing, formula: F.cosine, desc: g.cosineAnnealingDesc, cls: 'from-orange-500/10 to-amber-500/10 border-orange-500/20', accent: 'text-orange-400' },
    { name: g.wsd, formula: F.wsd, desc: g.wsdDesc, cls: 'from-purple-500/10 to-pink-500/10 border-purple-500/20', accent: 'text-purple-400' },
    { name: g.stepDecay, formula: F.step, desc: g.stepDecayDesc, cls: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20', accent: 'text-blue-400' },
  ]

  const challenges = [
    { name: g.illConditioning, desc: g.illConditioningDesc, formula: F.kappa, cls: 'from-red-500/10 to-orange-500/10 border-red-500/20', accent: 'text-red-400' },
    { name: g.saddlePoints, desc: g.saddlePointsDesc, cls: 'from-yellow-500/10 to-amber-500/10 border-yellow-500/20', accent: 'text-yellow-400' },
    { name: g.plateaus, desc: g.plateausDesc, cls: 'from-slate-500/10 to-gray-500/10 border-slate-500/20', accent: 'text-slate-300' },
    { name: g.localMinima, desc: g.localMinimaDesc, cls: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20', accent: 'text-cyan-400' },
  ]

  return (
    <TopicLayout
      topicId="gradient-descent"
      title={g.title}
      description={g.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: g.title },
      ]}
    >
      {/* Update rule */}
      <section className={SECTION}>
        <h2 className={H2}>{g.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">{g.whatIsDesc}</p>
        <LatexBlock className="my-6 overflow-x-auto text-text">{F.update}</LatexBlock>
        <p className="text-muted leading-relaxed">{g.whatIsSymbols}</p>
        <p className="mt-4 text-sm text-muted">
          {g.lossLinkText}{' '}
          <Link href={`/${locale}/ai/ml-fundamentals/training`} className="text-cyan-300 underline">
            {g.lossLinkLabel}
          </Link>
        </p>
      </section>

      {/* Why the negative gradient */}
      <section className={SECTION}>
        <h2 className={H2}>{g.whyNegative}</h2>
        <p className="text-muted leading-relaxed">{g.whyNegativeDesc}</p>
        <LatexBlock className="my-6 overflow-x-auto text-text">{F.taylor}</LatexBlock>
        <p className="text-muted leading-relaxed">{g.whyNegativeDesc2}</p>
      </section>

      {/* Worked example */}
      <section className={SECTION}>
        <h2 className={H2}>{g.worked}</h2>
        <p className="text-muted leading-relaxed mb-6">{g.workedDesc}</p>
        <div className="overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-2 font-medium">{g.colStep}</th>
                <th className="px-4 py-2 font-medium">{g.colW}</th>
                <th className="px-4 py-2 font-medium">{g.colGrad}</th>
                <th className="px-4 py-2 font-medium">{g.colUpdate}</th>
              </tr>
            </thead>
            <tbody className="font-mono text-text">
              {WORKED_ROWS.map((row) => (
                <tr key={row.k} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2">{row.k}</td>
                  <td className="px-4 py-2">{num(row.w)}</td>
                  <td className="px-4 py-2">{num(row.grad)}</td>
                  <td className="px-4 py-2 text-emerald-400">{num(row.next)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted leading-relaxed mt-6">{g.workedConclusion}</p>
        <LatexBlock className="my-4 overflow-x-auto text-text">{F.stability}</LatexBlock>
        <p className="text-muted leading-relaxed">{g.workedStability}</p>
      </section>

      {/* Backpropagation */}
      <section className={SECTION}>
        <h2 className={H2}>{g.backprop}</h2>
        <p className="text-muted leading-relaxed">{g.backpropDesc}</p>
        <LatexBlock className="my-6 overflow-x-auto text-text">{F.chain}</LatexBlock>
        <p className="text-muted leading-relaxed">{g.backpropDesc2}</p>
      </section>

      {/* Mini-batches */}
      <section className={SECTION}>
        <h2 className={H2}>{g.minibatch}</h2>
        <p className="text-muted leading-relaxed">{g.minibatchDesc}</p>
        <LatexBlock className="my-6 overflow-x-auto text-text">{F.minibatch}</LatexBlock>
        <p className="text-muted leading-relaxed mb-6">{g.minibatchDesc2}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{g.epoch}</h3>
            <p className="text-sm text-muted">{g.epochDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{g.batchSize}</h3>
            <p className="text-sm text-muted">{g.batchSizeDesc}</p>
          </div>
        </div>
      </section>

      {/* Optimizers */}
      <section className={SECTION}>
        <h2 className={H2}>{g.optimizers}</h2>
        <p className="text-muted leading-relaxed mb-6">{g.optimizersDesc}</p>
        <div className="space-y-4">
          {optimizers.map((o) => (
            <div key={o.name} className="p-5 bg-background rounded-xl border border-border">
              <h3 className={`text-lg font-bold font-heading mb-3 ${o.accent}`}>{o.name}</h3>
              <LatexBlock className="mb-3 overflow-x-auto text-text">{o.formula}</LatexBlock>
              <p className="text-sm text-muted leading-relaxed">{o.desc}</p>
              <a href={o.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-cyan-300 underline">
                {g.sourceLabel}
              </a>
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <h3 className="font-bold text-emerald-400 mb-2">{g.practical}</h3>
          <p className="text-sm text-muted leading-relaxed">{g.practicalDesc}</p>
        </div>
      </section>

      {/* Learning-rate schedules */}
      <section className={SECTION}>
        <h2 className={H2}>{g.lrScheduling}</h2>
        <p className="text-muted leading-relaxed mb-6">{g.lrSchedulingDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {schedules.map((s) => (
            <div key={s.name} className={`p-5 bg-gradient-to-br border rounded-xl ${s.cls}`}>
              <h3 className={`font-bold mb-2 ${s.accent}`}>{s.name}</h3>
              <LatexBlock className="mb-2 overflow-x-auto text-sm text-text">{s.formula}</LatexBlock>
              <p className="text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What slows optimization down */}
      <section className={SECTION}>
        <h2 className={H2}>{g.convergenceChallenges}</h2>
        <p className="text-muted leading-relaxed mb-6">{g.convergenceChallengesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {challenges.map((c) => (
            <div key={c.name} className={`p-5 bg-gradient-to-br border rounded-xl ${c.cls}`}>
              <h3 className={`font-bold mb-2 ${c.accent}`}>{c.name}</h3>
              {c.formula && <LatexBlock className="mb-2 overflow-x-auto text-sm text-text">{c.formula}</LatexBlock>}
              <p className="text-sm text-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">📉</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{g.interactiveDemo}</h2>
            <p className="text-sm text-muted">{g.demoDesc}</p>
          </div>
        </div>
        <GradientDescentVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className={H2}>{g.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[g.takeaway1, g.takeaway2, g.takeaway3, g.takeaway4].map((item, i) => (
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
        <h2 className="text-xl font-bold font-heading text-text mb-4">{g.sources}</h2>
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
