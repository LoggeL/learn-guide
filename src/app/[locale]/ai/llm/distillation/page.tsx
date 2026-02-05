'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { DistillationVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function DistillationPage() {
  const { t } = useTranslation()

  const benefits = [
    { num: 1, title: t.distillation.benefit1Title, desc: t.distillation.benefit1Desc, color: 'purple' },
    { num: 2, title: t.distillation.benefit2Title, desc: t.distillation.benefit2Desc, color: 'cyan' },
    { num: 3, title: t.distillation.benefit3Title, desc: t.distillation.benefit3Desc, color: 'emerald' },
    { num: 4, title: t.distillation.benefit4Title, desc: t.distillation.benefit4Desc, color: 'orange' },
  ]

  const types = [
    { id: 'response', title: t.distillation.typeResponseTitle, desc: t.distillation.typeResponseDesc, color: 'purple' },
    { id: 'feature', title: t.distillation.typeFeatureTitle, desc: t.distillation.typeFeatureDesc, color: 'cyan' },
    { id: 'relation', title: t.distillation.typeRelationTitle, desc: t.distillation.typeRelationDesc, color: 'emerald' },
    { id: 'online', title: t.distillation.typeOnlineTitle, desc: t.distillation.typeOnlineDesc, color: 'orange' },
  ]

  return (
    <TopicLayout
      title={t.distillation.title}
      description={t.distillation.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.distillation.title },
      ]}
      prevTopic={{ label: t.topicNames['nested-learning'], href: '/ai/llm/nested-learning' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.distillation.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.distillation.whatIsDesc}
          </p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
            <p className="text-lg text-text italic font-heading">
              {t.distillation.analogy}
            </p>
            <p className="text-sm text-muted mt-2">
              {t.distillation.analogyDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Teacher-Student Paradigm */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.distillation.teacherStudentTitle}</h2>
        <p className="text-muted mb-6">{t.distillation.teacherStudentDesc}</p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Teacher */}
          <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">&#x1F393;</span>
            </div>
            <h3 className="text-lg font-bold text-purple-400 mb-2">{t.distillation.teacherTitle}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.distillation.teacherDesc}</p>
          </div>
          {/* Student */}
          <div className="p-6 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">&#x1F4D6;</span>
            </div>
            <h3 className="text-lg font-bold text-cyan-400 mb-2">{t.distillation.studentTitle}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.distillation.studentDesc}</p>
          </div>
        </div>
        {/* Flow Diagram */}
        <div className="mt-6 p-6 rounded-xl bg-surface border border-border">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
            <div className="px-4 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 font-semibold text-center">
              {t.distillation.flowTeacher}
            </div>
            <div className="text-muted hidden md:block">&#x2192;</div>
            <div className="text-muted md:hidden">&#x2193;</div>
            <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-center">
              {t.distillation.flowSoftDistribution}
            </div>
            <div className="text-muted hidden md:block">&#x2192;</div>
            <div className="text-muted md:hidden">&#x2193;</div>
            <div className="px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold text-center">
              {t.distillation.flowStudent}
            </div>
          </div>
        </div>
      </section>

      {/* The Key Insight: Distributions, Not Tokens */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.distillation.keyInsightTitle}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-2 border-emerald-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl">&#x1F4A1;</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-3">{t.distillation.keyInsightSubtitle}</h3>
              <p className="text-text leading-relaxed mb-4">{t.distillation.keyInsightDesc}</p>
              <p className="text-muted leading-relaxed">{t.distillation.keyInsightDesc2}</p>
            </div>
          </div>
        </div>

        {/* Hard vs Soft Labels Comparison */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
            <h4 className="text-red-400 font-semibold mb-3">{t.distillation.hardLabelTitle}</h4>
            <div className="font-mono text-sm bg-background rounded-lg p-4 mb-3">
              <div className="text-muted">{t.distillation.hardLabelExample}</div>
            </div>
            <p className="text-muted text-sm">{t.distillation.hardLabelExplain}</p>
          </div>
          <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="text-emerald-400 font-semibold mb-3">{t.distillation.softLabelTitle}</h4>
            <div className="font-mono text-sm bg-background rounded-lg p-4 mb-3">
              <div className="text-muted">{t.distillation.softLabelExample}</div>
            </div>
            <p className="text-muted text-sm">{t.distillation.softLabelExplain}</p>
          </div>
        </div>
      </section>

      {/* Interactive Visualizer */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <DistillationVisualizer />
      </section>

      {/* Why Distillation Works */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.distillation.whyWorks}</h2>
        <p className="text-muted mb-6">{t.distillation.whyWorksDesc}</p>
        <div className="space-y-4">
          {benefits.map((item) => (
            <div key={item.num} className={`flex gap-5 p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
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

      {/* The Distillation Loss */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.distillation.lossTitle}</h2>
        <p className="text-muted mb-6">{t.distillation.lossDesc}</p>
        <div className="p-6 rounded-xl bg-surface border border-border">
          <div className="font-mono text-sm md:text-base bg-background rounded-lg p-6 text-center text-text mb-4 overflow-x-auto">
            L = (1 - &#x3B1;) &middot; CE(y, p<sub>student</sub>) + &#x3B1; &middot; T&sup2; &middot; KL(p<sub>teacher</sub><sup>T</sup> || p<sub>student</sub><sup>T</sup>)
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-mono font-bold">CE</span>
              <span className="text-muted">{t.distillation.lossCE}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-mono font-bold">KL</span>
              <span className="text-muted">{t.distillation.lossKL}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-mono font-bold">T</span>
              <span className="text-muted">{t.distillation.lossT}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-400 font-mono font-bold">&#x3B1;</span>
              <span className="text-muted">{t.distillation.lossAlpha}</span>
            </li>
          </ul>
          <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm text-muted">{t.distillation.lossInsight}</p>
          </div>
        </div>
      </section>

      {/* Types of Distillation */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.distillation.typesTitle}</h2>
        <p className="text-muted mb-6">{t.distillation.typesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {types.map((type) => (
            <div key={type.id} className={`p-5 rounded-xl bg-${type.color}-500/5 border border-${type.color}-500/20`}>
              <h3 className={`text-${type.color}-400 font-semibold font-heading mb-2`}>{type.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-World Examples */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.distillation.examplesTitle}</h2>
        <p className="text-muted mb-6">{t.distillation.examplesDesc}</p>
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text mb-2">{t.distillation.example1Title}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.distillation.example1Desc}</p>
          </div>
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text mb-2">{t.distillation.example2Title}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.distillation.example2Desc}</p>
          </div>
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text mb-2">{t.distillation.example3Title}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.distillation.example3Desc}</p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.distillation.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.distillation.takeaway1,
              t.distillation.takeaway2,
              t.distillation.takeaway3,
              t.distillation.takeaway4,
              t.distillation.takeaway5,
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
