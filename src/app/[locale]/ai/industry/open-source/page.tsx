'use client'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
export default function OpenSourcePage() {
  const { t } = useTranslation(),
    o = t.openSource
  const advantages = [
    [o.advantage1Title, o.advantage1Desc],
    [o.advantage2Title, o.advantage2Desc],
    [o.advantage3Title, o.advantage3Desc],
    [o.advantage4Title, o.advantage4Desc],
    [o.advantage5Title, o.advantage5Desc],
    [o.advantage6Title, o.advantage6Desc],
  ]
  return (
    <TopicLayout
      topicId="open-source"
      title={o.title}
      description={o.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: o.title },
      ]}
    >
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{o.intro}</h2>
        <p className="text-muted">{o.introDesc}</p>
        <a
          href="https://opensource.org/ai/open-source-ai-definition"
          target="_blank"
          rel="noreferrer"
          className="text-primary-light text-sm underline"
        >
          Open Source AI Definition 1.0
        </a>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        {advantages.map(([label, body]) => (
          <article
            className="rounded-xl border border-border bg-surface/50 p-5"
            key={label}
          >
            <h2 className="mb-3 font-semibold">{label}</h2>
            <p className="text-sm text-muted">{body}</p>
          </article>
        ))}
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{o.businessTitle}</h2>
        <p className="text-muted">{o.businessDesc}</p>
        <ul className="list-disc space-y-3 pl-5 text-muted">
          {[o.consider1, o.consider2, o.consider3, o.consider4].map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{o.project1Name}</h2>
        <p className="text-muted">{o.project1Desc}</p>
        <a
          href="https://arxiv.org/html/2412.19437v2"
          target="_blank"
          rel="noreferrer"
          className="text-primary-light text-sm underline"
        >
          DeepSeek-V3 Technical Report, Table 1
        </a>
        <p className="text-muted">{o.trend1Desc}</p>
      </section>
    </TopicLayout>
  )
}
