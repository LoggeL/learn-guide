'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { NeuralNetworkVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function NeuralNetworksPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.neuralNetworks.title}
      description={t.neuralNetworks.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: t.neuralNetworks.title },
      ]}
      nextTopic={{ label: t.topicNames['gradient-descent'], href: '/ai/ml-fundamentals/gradient-descent' }}
    >
      {/* What is a Neural Network */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.neuralNetworks.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.neuralNetworks.whatIsDesc}
        </p>
      </section>

      {/* Core Components */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.neuralNetworks.components}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.neuralNetworks.componentsDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.neuralNetworks.neurons}</h3>
            <p className="text-sm text-muted">{t.neuralNetworks.neuronsDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.neuralNetworks.layers}</h3>
            <p className="text-sm text-muted">{t.neuralNetworks.layersDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.neuralNetworks.weights}</h3>
            <p className="text-sm text-muted">{t.neuralNetworks.weightsDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.neuralNetworks.activations}</h3>
            <p className="text-sm text-muted">{t.neuralNetworks.activationsDesc}</p>
          </div>
        </div>
      </section>

      {/* Types of Networks */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.neuralNetworks.typesOfNetworks}</h2>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.neuralNetworks.feedforward}</h4>
            <p className="text-sm text-muted">{t.neuralNetworks.feedforwardDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.neuralNetworks.cnn}</h4>
            <p className="text-sm text-muted">{t.neuralNetworks.cnnDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.neuralNetworks.rnn}</h4>
            <p className="text-sm text-muted">{t.neuralNetworks.rnnDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.neuralNetworks.transformer}</h4>
            <p className="text-sm text-muted">{t.neuralNetworks.transformerDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🧠</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.neuralNetworks.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.neuralNetworks.demoDesc}</p>
          </div>
        </div>
        <NeuralNetworkVisualizer />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.neuralNetworks.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.neuralNetworks.takeaway1,
              t.neuralNetworks.takeaway2,
              t.neuralNetworks.takeaway3,
              t.neuralNetworks.takeaway4,
            ].map((item, i) => (
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
    </TopicLayout>
  )
}
