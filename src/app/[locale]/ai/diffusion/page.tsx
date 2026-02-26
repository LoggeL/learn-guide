'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useLocale, useTranslation } from '@/lib/i18n/context'

export default function DiffusionPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()

  return (
    <TopicLayout
      title={t.diffusion.title}
      description={t.diffusion.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.topicNames.diffusion },
      ]}
      nextTopic={{ label: t.topicNames['diffusion-fundamentals'], href: '/ai/diffusion/fundamentals' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.diffusion.whatIs}</h2>
        <p className="text-muted leading-relaxed">{t.diffusion.whatIsDesc}</p>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.diffusion.coreIdea}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.diffusion.coreIdeaDesc}</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10">
            <h3 className="text-lg font-bold font-heading text-violet-300 mb-2">{t.diffusion.textTrackTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{t.diffusion.textTrackDesc}</p>
          </div>
          <div className="p-5 rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10">
            <h3 className="text-lg font-bold font-heading text-fuchsia-300 mb-2">{t.diffusion.imageTrackTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{t.diffusion.imageTrackDesc}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.diffusion.roadmapTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.diffusion.roadmapDesc}</p>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: t.diffusion.roadmapFundamentalsTitle,
              desc: t.diffusion.roadmapFundamentalsDesc,
              href: '/ai/diffusion/fundamentals',
            },
            {
              title: t.diffusion.roadmapTextTitle,
              desc: t.diffusion.roadmapTextDesc,
              href: '/ai/diffusion/text',
            },
            {
              title: t.diffusion.roadmapImageTitle,
              desc: t.diffusion.roadmapImageDesc,
              href: '/ai/diffusion/image',
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="group rounded-xl border border-purple-500/25 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5 hover:border-purple-400/40 transition-colors"
            >
              <h3 className="text-base font-semibold font-heading text-violet-200 mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">{item.desc}</p>
              <span className="text-xs text-violet-300 inline-flex items-center gap-1.5">
                {t.diffusion.openTopic}
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </TopicLayout>
  )
}
