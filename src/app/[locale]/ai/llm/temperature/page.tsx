'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { TemperatureDemo } from '@/components/interactive'
import { Latex, LatexBlock } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

export default function TemperaturePage() {
  const { t, locale } = useTranslation()

  return (
    <TopicLayout topicId="temperature"
      title={t.temperature.title}
      description={t.temperature.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.temperature.title },
      ]}
      prevTopic={{ label: t.topicNames['context-rot'], href: '/ai/llm/context-rot' }}
      nextTopic={{ label: t.topicNames.attention, href: '/ai/llm/attention' }}
    >
      {/* What is Temperature */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.temperature.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.temperature.whatIsDesc.split('Temperature').map((part, i, arr) => 
              i === arr.length - 1 ? part : (
                <span key={i}>{part}<span className="text-primary-light font-semibold">Temperature</span></span>
              )
            )}
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
              <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.temperature.lowTemp}</h3>
              <p className="text-sm text-muted">{t.temperature.lowTempDesc}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
              <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.temperature.highTemp}</h3>
              <p className="text-sm text-muted">{t.temperature.highTempDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🎛️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.temperature.interactiveDistribution}</h2>
            <p className="text-sm text-muted">{t.temperature.adjustSlider}</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">
          {t.temperature.adjustDesc}
        </p>
        <TemperatureDemo />
      </section>

      {/* The Softmax Connection */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.temperature.howItWorks}</h2>
        <div className="space-y-6">
          <p className="text-muted leading-relaxed">
            {t.temperature.mathDesc}
          </p>
          
          <div className="bg-background border border-border rounded-xl p-8 flex justify-center overflow-x-auto">
            <div className="text-primary text-xl">
              <LatexBlock>
                {'P(x_i) = \\frac{e^{z_i / T}}{\\sum_{j} e^{z_j / T}}'}
              </LatexBlock>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-cyan-400 font-bold">{t.temperature.whenLow}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">{t.temperature.low}</span>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-3">
                {t.temperature.whenLowDesc}
              </p>
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <LatexBlock>{'\\lim_{T \\to 0} P(x_{\\text{max}}) = 1'}</LatexBlock>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-400 font-bold">{t.temperature.whenHigh}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">{t.temperature.high}</span>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-3">
                {t.temperature.whenHighDesc}
              </p>
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <LatexBlock>{'\\lim_{T \\to \\infty} P(x_i) = \\frac{1}{N}'}</LatexBlock>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border p-5 sm:p-7 space-y-4">
        <h2 className="text-2xl font-semibold">{t.temperature.practicalGuidelines}</h2>
        <p className="text-muted">{locale === 'de' ? 'Beginne mit der Empfehlung für dein konkretes Modell und deinen Modus. Vergleiche danach Einstellungen anhand derselben Aufgaben, Referenzantworten und mehrerer Läufe. Fakten brauchen Quellen, Code braucht Tests; Temperature ersetzt diese Prüfung nicht.' : 'Start with guidance for the specific model and mode. Then compare settings on the same tasks and reference answers over multiple runs. Facts need sources and code needs tests; temperature does not replace these checks.'}</p>
        <p className="text-muted">{locale === 'de' ? 'Beispiel: Qwen3 empfiehlt für Thinking T = 0,6 und warnt vor Greedy Decoding. Ein allgemeines Rezept wie "Mathe immer mit T = 0" wäre damit unpassend.' : 'For example, Qwen3 recommends T = 0.6 for thinking and warns against greedy decoding. A universal recipe such as "always use T = 0 for math" would not fit this model.'}</p>
        <a href="https://huggingface.co/Qwen/Qwen3-32B#best-practices" target="_blank" rel="noopener noreferrer" className="text-primary-light underline">Qwen3-32B: Best practices</a>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.temperature.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.temperature.takeaway1,
              t.temperature.takeaway2,
              t.temperature.takeaway3,
              t.temperature.takeaway4,
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
