'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { NeuralNetworkVisualizer } from '@/components/interactive/NeuralNetworkVisualizer'
import { NeuralNetForwardPassWalkthrough } from '@/components/interactive/NeuralNetForwardPassWalkthrough'
import { NeuralNetPlayground } from '@/components/interactive/NeuralNetPlayground'
import {
  NEURAL_NET_CASES,
  NEURAL_NET_XOR_WEIGHTS,
  neuralNetForward221,
  neuralNetFormat,
} from '@/components/interactive/NeuralNetShared'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  { key: 'sourceGoodfellow', href: 'https://www.deeplearningbook.org/contents/mlp.html' },
  { key: 'sourceLeshno', href: 'https://doi.org/10.1016/S0893-6080(05)80131-5' },
  { key: 'sourceGpt3', href: 'https://arxiv.org/abs/2005.14165' },
  { key: 'sourceGrinsztajn', href: 'https://arxiv.org/abs/2207.08815' },
  { key: 'sourceTabpfn', href: 'https://doi.org/10.1038/s41586-024-08328-6' },
  { key: 'sourceTransformer', href: 'https://arxiv.org/abs/1706.03762' },
] as const

/** The four XOR cases in the input plane with two failed attempts at a separating line. */
function NeuralNetXorLinePlot() {
  const s = 160
  const pad = 30
  const px = (v: number) => pad + v * s
  const py = (v: number) => pad + (1 - v) * s
  return (
    <svg viewBox={`0 0 ${s + 2 * pad} ${s + 2 * pad}`} className="w-full max-w-[220px] mx-auto" aria-hidden>
      <rect x={pad} y={pad} width={s} height={s} className="fill-background" stroke="#1e293b" />
      <line x1={px(-0.15)} y1={py(0.65)} x2={px(1.15)} y2={py(-0.15)} stroke="#a78bfa" strokeDasharray="5 4" strokeWidth={1.5} />
      <line x1={px(0.5)} y1={py(-0.15)} x2={px(0.5)} y2={py(1.15)} stroke="#a78bfa" strokeDasharray="5 4" strokeWidth={1.5} strokeOpacity={0.6} />
      {NEURAL_NET_CASES.map(([a, b]) => (
        <g key={`${a}-${b}`}>
          <circle cx={px(a)} cy={py(b)} r={10} fill={a !== b ? '#22d3ee' : '#fb923c'} />
          <text x={px(a)} y={py(b) + (b === 1 ? -16 : 24)} textAnchor="middle" className="fill-muted font-mono text-[11px]">
            ({a}, {b})
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function NeuralNetworksPage() {
  const { t, locale } = useTranslation()
  const nn = t.neuralNetworks
  const fmt = (v: number) => neuralNetFormat(v, locale, 2)

  return (
    <TopicLayout topicId="neural-networks"
      title={nn.title}
      description={nn.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: nn.title },
      ]}
    >
      {/* What is a Neural Network */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{nn.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">{nn.whatIsDesc}</p>
        <p className="text-sm text-subtle leading-relaxed mt-4">{nn.whatIsBrain}</p>
      </section>

      {/* One neuron */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{nn.neuronTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{nn.neuronIntro}</p>
        <div className="p-5 rounded-xl bg-background border border-border mb-6 text-center space-y-2">
          <div className="font-mono text-lg text-text">
            z = <span className="text-emerald-400">w₁</span>·x₁ + <span className="text-emerald-400">w₂</span>·x₂ + <span className="text-cyan-400">b</span>
          </div>
          <div className="font-mono text-lg text-text">
            a = <span className="text-orange-400">ReLU</span>(z) = max(0, z)
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{nn.weights}</h3>
            <p className="text-sm text-muted">{nn.weightsDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{nn.bias}</h3>
            <p className="text-sm text-muted">{nn.biasDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{nn.activations}</h3>
            <p className="text-sm text-muted">{nn.activationsDesc}</p>
          </div>
        </div>
        <div className="mt-6 p-5 rounded-xl bg-surface border border-border">
          <h3 className="font-bold text-text mb-3">{nn.neuronExampleTitle}</h3>
          <div className="space-y-2 font-mono text-sm text-cyan-300 whitespace-pre-wrap break-words">
            <div>{nn.neuronExample1}</div>
            <div>{nn.neuronExample2}</div>
          </div>
          <p className="text-sm text-muted mt-3">{nn.neuronExampleNote}</p>
        </div>
      </section>

      {/* Layers */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{nn.layersTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{nn.layersDesc}</p>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-background border border-border">
            <h3 className="font-bold text-text mb-2">{nn.layersParamsTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{nn.layersParamsDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-sm text-muted leading-relaxed">{nn.layersScale}</p>
          </div>
        </div>
      </section>

      {/* Worked example */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{nn.walkthroughTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{nn.walkthroughIntro}</p>
        <NeuralNetForwardPassWalkthrough />
      </section>

      {/* Why non-linearity */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{nn.nonlinTitle}</h2>
        <p className="text-muted leading-relaxed">{nn.nonlinIntro}</p>
        <div className="my-5 p-4 rounded-xl bg-background border border-border font-mono text-center text-text break-words">
          {nn.nonlinFormula}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-left border-b border-border">
                <th className="py-2 pr-4 font-medium">{nn.walkthrough.colInput}</th>
                <th className="py-2 pr-4 font-medium">{nn.colYRelu}</th>
                <th className="py-2 pr-4 font-medium">{nn.colYLinear}</th>
                <th className="py-2 font-medium">{nn.walkthrough.colTarget}</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {NEURAL_NET_CASES.map(([a, b]) => {
                const relu = neuralNetForward221(NEURAL_NET_XOR_WEIGHTS, a, b, 'relu')
                const lin = neuralNetForward221(NEURAL_NET_XOR_WEIGHTS, a, b, 'linear')
                const target = a !== b ? 1 : 0
                return (
                  <tr key={`${a}-${b}`} className="border-b border-border/50">
                    <td className="py-2 pr-4 text-text">({a}, {b})</td>
                    <td className="py-2 pr-4 text-emerald-300">{fmt(relu.y)} → {relu.prediction}</td>
                    <td className={`py-2 pr-4 ${lin.prediction === target ? 'text-muted' : 'text-red-400 font-bold'}`}>
                      {fmt(lin.y)} → {lin.prediction}
                    </td>
                    <td className="py-2 text-text">{target}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-muted leading-relaxed mt-4">{nn.nonlinResult}</p>

        <div className="mt-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-background border border-border">
              <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{nn.nonlinCollapseTitle}</h3>
              <p className="text-sm text-muted leading-relaxed">{nn.nonlinCollapseDesc}</p>
            </div>
            <div className="p-5 rounded-xl bg-background border border-border">
              <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{nn.nonlinLineTitle}</h3>
              <p className="text-sm text-muted leading-relaxed">{nn.nonlinLineDesc}</p>
            </div>
          </div>
          <figure className="md:w-64">
            <NeuralNetXorLinePlot />
            <figcaption className="text-xs text-muted text-center mt-2">{nn.nonlinPlotCaption}</figcaption>
          </figure>
        </div>
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{nn.nonlinKinkTitle}</h3>
          <p className="text-sm text-muted leading-relaxed">{nn.nonlinKinkDesc}</p>
        </div>
      </section>

      {/* Playground */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{nn.playground.title}</h2>
        <p className="text-muted leading-relaxed mb-6">{nn.playground.desc}</p>
        <NeuralNetPlayground />
      </section>

      {/* Bigger networks */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{nn.visualizer.sectionTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{nn.visualizer.sectionDesc}</p>
        <NeuralNetworkVisualizer />
      </section>

      {/* Types of Networks */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{nn.typesOfNetworks}</h2>
        <p className="text-muted leading-relaxed mb-6">{nn.typesIntro}</p>
        <div className="space-y-4">
          {[
            { title: nn.feedforward, desc: nn.feedforwardDesc },
            { title: nn.cnn, desc: nn.cnnDesc },
            { title: nn.rnn, desc: nn.rnnDesc },
            { title: nn.transformer, desc: nn.transformerDesc },
          ].map((item) => (
            <div key={item.title} className="p-4 bg-background rounded-xl border border-border">
              <h3 className="font-bold text-text mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Where do weights come from */}
      <section className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{nn.trainingTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{nn.trainingDesc}</p>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{nn.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[nn.takeaway1, nn.takeaway2, nn.takeaway3, nn.takeaway4, nn.takeaway5].map((item, i) => (
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
        <h2 className="text-xl font-bold font-heading text-text mb-4">{nn.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map((s) => (
            <li key={s.key}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline hover:text-cyan-200">
                {nn[s.key]}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
