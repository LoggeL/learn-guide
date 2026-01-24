'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { ChainOfThoughtDemo } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function AdvancedPromptingPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.advancedPrompting.title}
      description={t.advancedPrompting.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.prompting, href: '/ai/prompting' },
        { label: t.advancedPrompting.title },
      ]}
      prevTopic={{ label: t.topicNames['prompt-basics'], href: '/ai/prompting/basics' }}
      nextTopic={{ label: t.topicNames['system-prompts'], href: '/ai/prompting/system-prompts' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.advancedPrompting.overview}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.advancedPrompting.overviewDesc}
        </p>
      </section>

      {/* Chain of Thought */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.advancedPrompting.cot}</h2>
        <p className="text-muted leading-relaxed mb-4">
          {t.advancedPrompting.cotDesc}
        </p>
        <div className="p-4 bg-background rounded-xl border border-border">
          <p className="text-sm text-cyan-400 font-mono">{t.advancedPrompting.cotExample}</p>
        </div>
      </section>

      {/* Few-Shot Learning */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.advancedPrompting.fewShot}</h2>
        <p className="text-muted leading-relaxed mb-4">
          {t.advancedPrompting.fewShotDesc}
        </p>
        <div className="p-4 bg-background rounded-xl border border-border">
          <p className="text-sm text-purple-400 font-mono">{t.advancedPrompting.fewShotExample}</p>
        </div>
      </section>

      {/* Self-Consistency */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.advancedPrompting.selfConsistency}</h2>
        <p className="text-muted leading-relaxed mb-4">
          {t.advancedPrompting.selfConsistencyDesc}
        </p>
        <div className="p-4 bg-background rounded-xl border border-border">
          <p className="text-sm text-emerald-400 font-mono">{t.advancedPrompting.selfConsistencyExample}</p>
        </div>
      </section>

      {/* Task Decomposition */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.advancedPrompting.decomposition}</h2>
        <p className="text-muted leading-relaxed mb-4">
          {t.advancedPrompting.decompositionDesc}
        </p>
        <div className="p-4 bg-background rounded-xl border border-border">
          <p className="text-sm text-orange-400 font-mono">{t.advancedPrompting.decompositionExample}</p>
        </div>
      </section>

      {/* Additional Techniques */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.advancedPrompting.techniques}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.advancedPrompting.rolePlay}</h3>
            <p className="text-sm text-muted">{t.advancedPrompting.rolePlayDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">{t.advancedPrompting.constraints}</h3>
            <p className="text-sm text-muted">{t.advancedPrompting.constraintsDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.advancedPrompting.verification}</h3>
            <p className="text-sm text-muted">{t.advancedPrompting.verificationDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🧠</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.advancedPrompting.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.advancedPrompting.demoDesc}</p>
          </div>
        </div>
        <ChainOfThoughtDemo />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.advancedPrompting.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.advancedPrompting.takeaway1,
              t.advancedPrompting.takeaway2,
              t.advancedPrompting.takeaway3,
              t.advancedPrompting.takeaway4,
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
