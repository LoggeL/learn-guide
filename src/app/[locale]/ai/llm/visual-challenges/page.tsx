'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function VisualChallengesPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.visualChallenges.title}
      description={t.visualChallenges.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
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

      {/* Challenge 1: Counting Objects */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
            <span className="text-2xl">🔢</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-red-400">{t.visualChallenges.challenge1}</h2>
        </div>
        <p className="text-muted leading-relaxed mb-4">{t.visualChallenges.challenge1Desc}</p>

        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge1Why}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge1WhyDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge1Examples}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li className="flex gap-2"><span className="text-red-400">•</span>{t.visualChallenges.challenge1Example1}</li>
              <li className="flex gap-2"><span className="text-red-400">•</span>{t.visualChallenges.challenge1Example2}</li>
              <li className="flex gap-2"><span className="text-red-400">•</span>{t.visualChallenges.challenge1Example3}</li>
            </ul>
          </div>
          <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <h4 className="font-semibold text-emerald-400 mb-2">{t.visualChallenges.challenge1Mitigation}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge1MitigationDesc}</p>
          </div>
        </div>
      </section>

      {/* Challenge 2: Spatial Reasoning */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-2xl">📍</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-blue-400">{t.visualChallenges.challenge2}</h2>
        </div>
        <p className="text-muted leading-relaxed mb-4">{t.visualChallenges.challenge2Desc}</p>

        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge2Why}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge2WhyDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge2Examples}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li className="flex gap-2"><span className="text-blue-400">•</span>{t.visualChallenges.challenge2Example1}</li>
              <li className="flex gap-2"><span className="text-blue-400">•</span>{t.visualChallenges.challenge2Example2}</li>
              <li className="flex gap-2"><span className="text-blue-400">•</span>{t.visualChallenges.challenge2Example3}</li>
            </ul>
          </div>
          <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <h4 className="font-semibold text-emerald-400 mb-2">{t.visualChallenges.challenge2Mitigation}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge2MitigationDesc}</p>
          </div>
        </div>
      </section>

      {/* Challenge 3: Small Text Recognition */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
            <span className="text-2xl">🔤</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-purple-400">{t.visualChallenges.challenge3}</h2>
        </div>
        <p className="text-muted leading-relaxed mb-4">{t.visualChallenges.challenge3Desc}</p>

        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge3Why}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge3WhyDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge3Examples}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li className="flex gap-2"><span className="text-purple-400">•</span>{t.visualChallenges.challenge3Example1}</li>
              <li className="flex gap-2"><span className="text-purple-400">•</span>{t.visualChallenges.challenge3Example2}</li>
              <li className="flex gap-2"><span className="text-purple-400">•</span>{t.visualChallenges.challenge3Example3}</li>
            </ul>
          </div>
          <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <h4 className="font-semibold text-emerald-400 mb-2">{t.visualChallenges.challenge3Mitigation}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge3MitigationDesc}</p>
          </div>
        </div>
      </section>

      {/* Challenge 4: Visual Hallucination */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center shrink-0">
            <span className="text-2xl">👻</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-amber-400">{t.visualChallenges.challenge4}</h2>
        </div>
        <p className="text-muted leading-relaxed mb-4">{t.visualChallenges.challenge4Desc}</p>

        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge4Why}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge4WhyDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge4Examples}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li className="flex gap-2"><span className="text-amber-400">•</span>{t.visualChallenges.challenge4Example1}</li>
              <li className="flex gap-2"><span className="text-amber-400">•</span>{t.visualChallenges.challenge4Example2}</li>
              <li className="flex gap-2"><span className="text-amber-400">•</span>{t.visualChallenges.challenge4Example3}</li>
            </ul>
          </div>
          <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <h4 className="font-semibold text-emerald-400 mb-2">{t.visualChallenges.challenge4Mitigation}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge4MitigationDesc}</p>
          </div>
        </div>
      </section>

      {/* Challenge 5: Fine Detail Recognition */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-2xl">🔍</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-teal-400">{t.visualChallenges.challenge5}</h2>
        </div>
        <p className="text-muted leading-relaxed mb-4">{t.visualChallenges.challenge5Desc}</p>

        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge5Why}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge5WhyDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge5Examples}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li className="flex gap-2"><span className="text-teal-400">•</span>{t.visualChallenges.challenge5Example1}</li>
              <li className="flex gap-2"><span className="text-teal-400">•</span>{t.visualChallenges.challenge5Example2}</li>
              <li className="flex gap-2"><span className="text-teal-400">•</span>{t.visualChallenges.challenge5Example3}</li>
            </ul>
          </div>
          <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <h4 className="font-semibold text-emerald-400 mb-2">{t.visualChallenges.challenge5Mitigation}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge5MitigationDesc}</p>
          </div>
        </div>
      </section>

      {/* Challenge 6: Multi-Image Reasoning */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center shrink-0">
            <span className="text-2xl">🖼️</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-indigo-400">{t.visualChallenges.challenge6}</h2>
        </div>
        <p className="text-muted leading-relaxed mb-4">{t.visualChallenges.challenge6Desc}</p>

        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge6Why}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge6WhyDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-text mb-2">{t.visualChallenges.challenge6Examples}</h4>
            <ul className="space-y-1 text-sm text-muted">
              <li className="flex gap-2"><span className="text-indigo-400">•</span>{t.visualChallenges.challenge6Example1}</li>
              <li className="flex gap-2"><span className="text-indigo-400">•</span>{t.visualChallenges.challenge6Example2}</li>
              <li className="flex gap-2"><span className="text-indigo-400">•</span>{t.visualChallenges.challenge6Example3}</li>
            </ul>
          </div>
          <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <h4 className="font-semibold text-emerald-400 mb-2">{t.visualChallenges.challenge6Mitigation}</h4>
            <p className="text-sm text-muted">{t.visualChallenges.challenge6MitigationDesc}</p>
          </div>
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
              t.visualChallenges.takeaway5,
              t.visualChallenges.takeaway6,
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
