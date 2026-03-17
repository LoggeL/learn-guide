'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { PatchGridVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function VisionPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="vision"
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

      {/* Image Tokenization in Practice */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.vision.imgTokenTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.vision.imgTokenDesc}</p>

        {/* Disclaimer banner */}
        <div className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-xl mb-6">
          <p className="text-sm text-muted"><span className="text-amber-400 font-semibold">Note:</span> {t.vision.imgTokenDisclaimer}</p>
        </div>

        {/* Two approaches */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
              <span className="text-blue-400 font-bold">1</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-1">{t.vision.imgTokenPatchTitle}</h3>
            <p className="text-xs text-blue-400/70 font-mono mb-2">{t.vision.imgTokenPatchModels}</p>
            <p className="text-sm text-muted mb-3">{t.vision.imgTokenPatchDesc}</p>
            <p className="text-xs text-muted italic">{t.vision.imgTokenPatchMultipliers}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
              <span className="text-purple-400 font-bold">2</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-1">{t.vision.imgTokenTileTitle}</h3>
            <p className="text-xs text-purple-400/70 font-mono mb-2">{t.vision.imgTokenTileModels}</p>
            <p className="text-sm text-muted">{t.vision.imgTokenTileDesc}</p>
          </div>
        </div>

        {/* Detail Levels */}
        <div className="rounded-xl bg-surface/50 border border-border p-5 mb-6">
          <h3 className="text-lg font-bold font-heading text-text mb-4">{t.vision.imgTokenDetailTitle}</h3>
          <div className="space-y-2">
            {[
              { text: t.vision.imgTokenDetailLow, color: 'text-emerald-400' },
              { text: t.vision.imgTokenDetailHigh, color: 'text-cyan-400' },
              { text: t.vision.imgTokenDetailOriginal, color: 'text-purple-400' },
              { text: t.vision.imgTokenDetailAuto, color: 'text-orange-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <span className={`${item.color} font-mono text-sm font-semibold min-w-[20px]`}>{i + 1}</span>
                <span className="text-sm text-muted">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Calculation */}
        <div className="rounded-xl bg-surface/50 border border-border p-5 mb-6">
          <h3 className="text-lg font-bold font-heading text-text mb-4">{t.vision.imgTokenCalcTitle}</h3>
          <div className="space-y-2 mb-4">
            {[t.vision.imgTokenCalcStep1, t.vision.imgTokenCalcStep2, t.vision.imgTokenCalcStep3].map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary-light text-xs font-bold">{i + 1}</span>
                </span>
                <code className="text-sm text-cyan-400 font-mono">{step}</code>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <p className="text-sm text-muted">{t.vision.imgTokenCalcExample}</p>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl mb-6">
          <p className="text-sm text-muted"><span className="text-emerald-400 font-semibold">Formats:</span> {t.vision.imgTokenFormats}</p>
        </div>

        {/* Known Limitations */}
        <div className="rounded-xl bg-surface/50 border border-border p-5">
          <h3 className="text-lg font-bold font-heading text-text mb-4">{t.vision.imgTokenLimitationsTitle}</h3>
          <ul className="space-y-2">
            {[
              t.vision.imgTokenLimitation1,
              t.vision.imgTokenLimitation2,
              t.vision.imgTokenLimitation3,
              t.vision.imgTokenLimitation4,
              t.vision.imgTokenLimitation5,
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted">
                <span className="text-red-400/70 mt-0.5">&#x2715;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
