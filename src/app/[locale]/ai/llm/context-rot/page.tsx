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
    <TopicLayout topicId="context-rot"
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

      {/* 2025 Research Findings */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.contextRot.researchTitle}</h2>
        <p className="text-muted leading-relaxed mb-8">{t.contextRot.researchDesc}</p>

        {/* Needle in Haystack */}
        <div className="mb-8">
          <h3 className="text-xl font-bold font-heading text-cyan-400 mb-3">{t.contextRot.needleTitle}</h3>
          <p className="text-muted leading-relaxed mb-4">{t.contextRot.needleDesc}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
              <h4 className="text-text font-semibold mb-2">{t.contextRot.needleMethod}</h4>
              <p className="text-muted text-sm leading-relaxed">{t.contextRot.needleMethodDesc}</p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
              <h4 className="text-text font-semibold mb-2">{t.contextRot.needleFindings}</h4>
              <p className="text-muted text-sm leading-relaxed">{t.contextRot.needleFindingsDesc}</p>
            </div>
          </div>
        </div>

        {/* Lost in the Middle */}
        <div className="mb-8">
          <h3 className="text-xl font-bold font-heading text-orange-400 mb-3">{t.contextRot.lostMiddleTitle}</h3>
          <p className="text-muted leading-relaxed mb-4">{t.contextRot.lostMiddleDesc}</p>

          {/* U-Shaped Pattern Visual */}
          <div className="mb-4 p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
            <h4 className="text-text font-semibold mb-4">{t.contextRot.lostMiddlePattern}</h4>
            <div className="flex items-end justify-between h-32 mb-4 px-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t" style={{ height: '90%' }}></div>
                <span className="text-xs text-muted">Start</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t" style={{ height: '70%' }}></div>
                <span className="text-xs text-muted">25%</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-gradient-to-t from-red-500 to-red-400 rounded-t" style={{ height: '40%' }}></div>
                <span className="text-xs text-muted">Middle</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t" style={{ height: '65%' }}></div>
                <span className="text-xs text-muted">75%</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t" style={{ height: '85%' }}></div>
                <span className="text-xs text-muted">End</span>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed">{t.contextRot.lostMiddlePatternDesc}</p>
          </div>

          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <h4 className="text-text font-semibold mb-2">{t.contextRot.lostMiddleImplication}</h4>
            <p className="text-muted text-sm leading-relaxed">{t.contextRot.lostMiddleImplicationDesc}</p>
          </div>
        </div>

        {/* Quantitative Findings */}
        <div>
          <h3 className="text-xl font-bold font-heading text-purple-400 mb-3">{t.contextRot.quantTitle}</h3>
          <p className="text-muted leading-relaxed mb-4">{t.contextRot.quantDesc}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <h4 className="text-text font-semibold mb-2">{t.contextRot.quantFinding1Title}</h4>
              <p className="text-muted text-sm leading-relaxed">{t.contextRot.quantFinding1Desc}</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <h4 className="text-text font-semibold mb-2">{t.contextRot.quantFinding2Title}</h4>
              <p className="text-muted text-sm leading-relaxed">{t.contextRot.quantFinding2Desc}</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <h4 className="text-text font-semibold mb-2">{t.contextRot.quantFinding3Title}</h4>
              <p className="text-muted text-sm leading-relaxed">{t.contextRot.quantFinding3Desc}</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <h4 className="text-text font-semibold mb-2">{t.contextRot.quantFinding4Title}</h4>
              <p className="text-muted text-sm leading-relaxed">{t.contextRot.quantFinding4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Position-Aware Strategies */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.contextRot.positionTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.contextRot.positionDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex gap-4 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 font-bold">1</span>
            </div>
            <div>
              <h3 className="text-text font-semibold font-heading mb-1">{t.contextRot.position1Title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.contextRot.position1Desc}</p>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 font-bold">2</span>
            </div>
            <div>
              <h3 className="text-text font-semibold font-heading mb-1">{t.contextRot.position2Title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.contextRot.position2Desc}</p>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 font-bold">3</span>
            </div>
            <div>
              <h3 className="text-text font-semibold font-heading mb-1">{t.contextRot.position3Title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.contextRot.position3Desc}</p>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 font-bold">4</span>
            </div>
            <div>
              <h3 className="text-text font-semibold font-heading mb-1">{t.contextRot.position4Title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.contextRot.position4Desc}</p>
            </div>
          </div>
        </div>
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
              t.contextRot.takeaway5,
              t.contextRot.takeaway6,
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
