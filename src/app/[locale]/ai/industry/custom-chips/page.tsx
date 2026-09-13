'use client'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { ChipTradeoffSimulator } from '@/components/interactive/ChipTradeoffSimulator'
export default function CustomChipsPage() {
  const { t } = useTranslation(),
    c = t.customChips
  return (
    <TopicLayout
      topicId="custom-chips"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: c.title },
      ]}
    >
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{c.hardwareStoryTitle}</h2>
        <p className="text-muted">{c.hardwareStoryDesc}</p>
        <p className="text-muted">{c.tradeoffNote}</p>
      </section>
      <section className="rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <ChipTradeoffSimulator />
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{c.strategicTitle}</h2>
        <p className="text-muted">{c.strategicDesc1}</p>
        <p className="text-muted">{c.strategicDesc2}</p>
        <a
          className="text-primary-light text-sm underline"
          href="https://jax-ml.github.io/scaling-book/roofline/"
          target="_blank"
          rel="noreferrer"
        >
          JAX Scaling Book: Rooflines
        </a>
      </section>
    </TopicLayout>
  )
}
