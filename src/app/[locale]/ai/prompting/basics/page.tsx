'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { PromptComparisonDemo } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function PromptBasicsPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.promptBasics.title}
      description={t.promptBasics.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.prompting, href: '/' },
        { label: t.promptBasics.title },
      ]}
      nextTopic={{ label: t.topicNames['advanced-prompting'], href: '/ai/prompting/advanced' }}
    >
      {/* What is a Prompt */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptBasics.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.promptBasics.whatIsDesc}
        </p>
      </section>

      {/* Core Principles */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptBasics.principles}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.promptBasics.principlesDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.promptBasics.beSpecific}</h3>
            <p className="text-sm text-muted">{t.promptBasics.beSpecificDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.promptBasics.showExamples}</h3>
            <p className="text-sm text-muted">{t.promptBasics.showExamplesDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.promptBasics.giveContext}</h3>
            <p className="text-sm text-muted">{t.promptBasics.giveContextDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.promptBasics.setFormat}</h3>
            <p className="text-sm text-muted">{t.promptBasics.setFormatDesc}</p>
          </div>
        </div>
      </section>

      {/* Anatomy of a Prompt */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptBasics.anatomy}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.promptBasics.anatomyDesc}
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.promptBasics.role}</h4>
            <p className="text-sm text-muted">{t.promptBasics.roleDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.promptBasics.task}</h4>
            <p className="text-sm text-muted">{t.promptBasics.taskDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.promptBasics.context}</h4>
            <p className="text-sm text-muted">{t.promptBasics.contextDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.promptBasics.format}</h4>
            <p className="text-sm text-muted">{t.promptBasics.formatDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.promptBasics.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.promptBasics.demoDesc}</p>
          </div>
        </div>
        <PromptComparisonDemo />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptBasics.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.promptBasics.takeaway1,
              t.promptBasics.takeaway2,
              t.promptBasics.takeaway3,
              t.promptBasics.takeaway4,
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
