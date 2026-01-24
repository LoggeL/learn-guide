'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { ContextRotSimulator } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function ContextRotPage() {
  const { t } = useTranslation()

  const reasons = [
    { num: 1, title: t.contextRot.reason1Title, desc: t.contextRot.reason1Desc, color: 'purple' },
    { num: 2, title: t.contextRot.reason2Title, desc: t.contextRot.reason2Desc, color: 'cyan' },
    { num: 3, title: t.contextRot.reason3Title, desc: t.contextRot.reason3Desc, color: 'orange' },
  ]

  const mitigations = [
    { title: t.contextRot.mitigation1Title, desc: t.contextRot.mitigation1, icon: '🔄' },
    { title: t.contextRot.mitigation2Title, desc: t.contextRot.mitigation2, icon: '📝' },
    { title: t.contextRot.mitigation3Title, desc: t.contextRot.mitigation3, icon: '🗄️' },
    { title: t.contextRot.mitigation4Title, desc: t.contextRot.mitigation4, icon: '⚓' },
    { title: t.contextRot.mitigation5Title, desc: t.contextRot.mitigation5, icon: '🔗' },
  ]

  return (
    <TopicLayout
      title={t.contextRot.title}
      description={t.contextRot.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.contextRot.title },
      ]}
      prevTopic={{ label: t.topicNames.rag, href: '/ai/llm/rag' }}
      nextTopic={{ label: t.topicNames.temperature, href: '/ai/llm/temperature' }}
    >
      {/* What is Context Rot */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.contextRot.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            <span className="text-primary-light font-semibold">Context rot</span> {t.contextRot.whatIsDesc}
          </p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-text text-lg leading-relaxed">
              Imagine telling someone: <em className="text-purple-300">"Always respond in French."</em> They follow this
              perfectly at first. But after hours of conversation, they start slipping back
              into English. That's context rot.
            </p>
          </div>
        </div>
      </section>

      {/* Why it happens */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.contextRot.whyHappens}</h2>
        <div className="grid gap-4">
          {reasons.map((item) => (
            <div
              key={item.num}
              className={`flex gap-5 p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20 hover:border-${item.color}-500/40 transition-colors`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center shrink-0`}>
                <span className={`text-xl font-bold text-${item.color}-400`}>{item.num}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🧪</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.contextRot.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.contextRot.demoDesc}</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">
          Set an instruction, then watch how it visually <strong className="text-primary-light">"fades"</strong> as the conversation grows. 
          The purple system message will dim as the context fills up—this simulates how the model's attention 
          to your original instruction weakens over time.
        </p>
        <ContextRotSimulator />
      </section>

      {/* Mitigation strategies */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.contextRot.mitigation}</h2>
        <div className="space-y-4">
          {mitigations.map((item, i) => (
            <div
              key={i}
              className="flex gap-5 p-5 rounded-xl bg-surface border border-border hover:border-primary/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                <span className="text-xl">{item.icon}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.contextRot.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.contextRot.takeaway1,
              t.contextRot.takeaway2,
              t.contextRot.takeaway3,
              t.contextRot.takeaway4,
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
