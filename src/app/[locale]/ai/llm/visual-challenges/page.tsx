'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function VisualChallengesPage() {
  const { t } = useTranslation()

  const challenges = [
    { title: t.visualChallenges.challenge1, desc: t.visualChallenges.challenge1Desc, icon: '🔢' },
    { title: t.visualChallenges.challenge2, desc: t.visualChallenges.challenge2Desc, icon: '📍' },
    { title: t.visualChallenges.challenge3, desc: t.visualChallenges.challenge3Desc, icon: '🔤' },
    { title: t.visualChallenges.challenge4, desc: t.visualChallenges.challenge4Desc, icon: '👻' },
  ]

  return (
    <TopicLayout
      title={t.visualChallenges.title}
      description={t.visualChallenges.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/' },
        { label: t.visualChallenges.title },
      ]}
      prevTopic={{ label: t.topicNames.vision, href: '/ai/llm/vision' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.visualChallenges.overview}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.visualChallenges.overviewDesc}
        </p>
      </section>

      {/* Challenges */}
      <section>
        <div className="space-y-4">
          {challenges.map((challenge, i) => (
            <div
              key={i}
              className="flex gap-5 p-5 rounded-xl bg-surface border border-border hover:border-primary/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 flex items-center justify-center shrink-0 group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-colors">
                <span className="text-xl">{challenge.icon}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{challenge.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{challenge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.visualChallenges.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.visualChallenges.takeaway1,
              t.visualChallenges.takeaway2,
              t.visualChallenges.takeaway3,
              t.visualChallenges.takeaway4,
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
