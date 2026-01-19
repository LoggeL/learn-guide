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
        { label: t.categories.llm, href: '/' },
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
