'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { PatchGridVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function VisionPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.vision.title}
      description={t.vision.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.vision.title },
      ]}
      prevTopic={{ label: t.topicNames.attention, href: '/ai/llm/attention' }}
      nextTopic={{ label: t.topicNames['visual-challenges'], href: '/ai/llm/visual-challenges' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.vision.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.vision.whatIsDesc}
          </p>
        </div>
      </section>

      {/* Vision Transformer Architecture */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.vision.vitTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.vision.vitDesc}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
              <span className="text-blue-400 font-bold">1</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.vision.vitStep1}</h3>
            <p className="text-sm text-muted">{t.vision.vitStep1Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
              <span className="text-purple-400 font-bold">2</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.vision.vitStep2}</h3>
            <p className="text-sm text-muted">{t.vision.vitStep2Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
              <span className="text-emerald-400 font-bold">3</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.vision.vitStep3}</h3>
            <p className="text-sm text-muted">{t.vision.vitStep3Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
              <span className="text-orange-400 font-bold">4</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.vision.vitStep4}</h3>
            <p className="text-sm text-muted">{t.vision.vitStep4Desc}</p>
          </div>
        </div>
      </section>

      {/* Patch Encoding */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🖼️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.vision.patchEncoding}</h2>
            <p className="text-sm text-muted">{t.vision.patchEncodingDesc}</p>
          </div>
        </div>
        <PatchGridVisualizer />
      </section>

      {/* Token Costs */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.vision.tokenCosts}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.vision.tokenCostsDesc}</p>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center p-4 bg-background rounded-xl border border-border">
            <span className="text-text">{t.vision.tokenExample1}</span>
            <span className="text-cyan-400 font-mono font-semibold">{t.vision.tokenExample1Value}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-background rounded-xl border border-border">
            <span className="text-text">{t.vision.tokenExample2}</span>
            <span className="text-purple-400 font-mono font-semibold">{t.vision.tokenExample2Value}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-background rounded-xl border border-border">
            <span className="text-text">{t.vision.tokenExample3}</span>
            <span className="text-emerald-400 font-mono font-semibold">{t.vision.tokenExample3Value}</span>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-sm text-muted"><span className="text-yellow-400 font-semibold">Tip:</span> {t.vision.tokenTip}</p>
        </div>
      </section>

      {/* Common Use Cases */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.vision.useCases}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.vision.useCasesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.vision.useCase1}</h3>
            <p className="text-sm text-muted">{t.vision.useCase1Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.vision.useCase2}</h3>
            <p className="text-sm text-muted">{t.vision.useCase2Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.vision.useCase3}</h3>
            <p className="text-sm text-muted">{t.vision.useCase3Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.vision.useCase4}</h3>
            <p className="text-sm text-muted">{t.vision.useCase4Desc}</p>
          </div>
        </div>
      </section>

      {/* Multimodal Understanding */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.vision.multimodal}</h2>
        <p className="text-muted leading-relaxed">
          {t.vision.multimodalDesc}
        </p>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.vision.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.vision.takeaway1,
              t.vision.takeaway2,
              t.vision.takeaway3,
              t.vision.takeaway4,
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
