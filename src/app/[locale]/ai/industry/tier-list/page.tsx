'use client'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { tierListModels, tierConfig, type TierLevel } from '@/lib/models'

const order: TierLevel[] = ['S+', 'A', 'B', 'C', 'D', 'F', 'Google']
export default function TierListPage() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit,
    tl = t.tierList
  const labels = {
    'S+': tl.sPlusTierDesc,
    A: tl.aTierDesc,
    B: tl.bTierDesc,
    C: tl.cTierDesc,
    D: tl.dTierDesc,
    F: tl.fTierDesc,
    Google: tl.googleTierDesc,
  }
  return (
    <TopicLayout
      topicId="tier-list"
      title={c.modelNotesTitle}
      description={c.modelNotesDesc}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: c.modelNotesTitle },
      ]}
    >
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <p className="text-muted">{tl.intro}</p>
        <p className="text-sm text-muted">{tl.disclaimerText}</p>
        <p className="text-sm text-primary-light">{c.modelNotesDate}</p>
        <h2 className="text-xl text-gradient">{c.favouriteHeading}</h2>
        <p>{c.favouriteFable}</p>
        <p>{c.favouriteSol}</p>
        <p className="text-sm text-muted">{c.historicalAvailability}</p>
        <a
          href="https://www.anthropic.com/claude/fable"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-primary-light underline"
        >
          Anthropic: Fable
        </a>
      </section>
      <section className="space-y-5">
        {order.map((tier) => (
          <div
            key={tier}
            className={`overflow-hidden rounded-2xl border ${tierConfig[tier].borderColor} bg-gradient-to-br ${tierConfig[tier].bgGradient}`}
          >
            <h2 className="flex flex-wrap gap-3 border-b border-border px-5 py-4">
              <span className={`text-2xl font-bold ${tierConfig[tier].color}`}>
                {tier}
              </span>
              <span className="self-center text-sm text-muted">
                {labels[tier]}
              </span>
            </h2>
            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {tierListModels
                .filter((m) => m.tier === tier)
                .map((model) => (
                  <article
                    key={model.id}
                    className="rounded-xl border border-border bg-background/50 p-4"
                  >
                    <h3 className="font-semibold">
                      {(tl as Record<string, string>)[model.nameKey] ||
                        model.id}
                    </h3>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </section>
    </TopicLayout>
  )
}
