'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { FlaskConical, AlertTriangle, Brain, Zap, RefreshCw } from 'lucide-react'

export default function NestedLearningPage() {
  const { t } = useTranslation()

  const problems = [
    { text: t.nestedLearning.problemExample1, color: 'red' },
    { text: t.nestedLearning.problemExample2, color: 'orange' },
    { text: t.nestedLearning.problemExample3, color: 'yellow' },
  ]

  const insights = [
    t.nestedLearning.insightPoint1,
    t.nestedLearning.insightPoint2,
    t.nestedLearning.insightPoint3,
  ]

  const hopeFeatures = [
    t.nestedLearning.hopeFeature1,
    t.nestedLearning.hopeFeature2,
    t.nestedLearning.hopeFeature3,
  ]

  const hopeResults = [
    t.nestedLearning.hopeResult1,
    t.nestedLearning.hopeResult2,
    t.nestedLearning.hopeResult3,
  ]

  const matters = [
    { title: t.nestedLearning.matter1Title, desc: t.nestedLearning.matter1Desc, icon: RefreshCw, color: 'purple' },
    { title: t.nestedLearning.matter2Title, desc: t.nestedLearning.matter2Desc, icon: Zap, color: 'cyan' },
    { title: t.nestedLearning.matter3Title, desc: t.nestedLearning.matter3Desc, icon: Brain, color: 'emerald' },
  ]

  return (
    <TopicLayout
      title={t.nestedLearning.title}
      description={t.nestedLearning.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.nestedLearning.title },
      ]}
      prevTopic={{ label: t.topicNames['quantization'], href: '/ai/llm/quantization' }}
      nextTopic={{ label: t.topicNames['neural-networks'], href: '/ai/ml-fundamentals/neural-networks' }}
    >
      {/* Research Disclaimer */}
      <section className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <FlaskConical size={24} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-2">{t.nestedLearning.researchDisclaimer}</h3>
            <p className="text-muted">{t.nestedLearning.researchDisclaimerDesc}</p>
          </div>
        </div>
      </section>

      {/* What is Nested Learning */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.nestedLearning.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg mb-4">
            {t.nestedLearning.whatIsDesc}
          </p>
          <p className="text-muted leading-relaxed">
            {t.nestedLearning.whatIsDesc2}
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.nestedLearning.problemTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{t.nestedLearning.problemDesc}</p>
        <div className="space-y-3">
          {problems.map((problem, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl bg-${problem.color}-500/10 border border-${problem.color}-500/20`}>
              <div className={`w-8 h-8 rounded-lg bg-${problem.color}-500/20 flex items-center justify-center shrink-0`}>
                <AlertTriangle size={16} className={`text-${problem.color}-400`} />
              </div>
              <span className="text-text">{problem.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Core Insight */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.nestedLearning.insightTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{t.nestedLearning.insightDesc}</p>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                <span className="text-purple-400 font-bold">{i + 1}</span>
              </div>
              <span className="text-text leading-relaxed">{insight}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Nested Structure Diagram */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.nestedLearning.structureTitle}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border">
          {/* Nested boxes visualization */}
          <div className="relative p-6 rounded-xl bg-purple-500/10 border-2 border-purple-500/30">
            <div className="absolute -top-3 left-4 px-3 py-1 bg-surface rounded-full border border-purple-500/30">
              <span className="text-sm font-semibold text-purple-400">{t.nestedLearning.outerLoop}</span>
            </div>
            <p className="text-xs text-purple-300 mb-4 mt-2">{t.nestedLearning.outerLoopDesc}</p>

            <div className="relative p-5 rounded-xl bg-cyan-500/10 border-2 border-cyan-500/30">
              <div className="absolute -top-3 left-4 px-3 py-1 bg-surface rounded-full border border-cyan-500/30">
                <span className="text-sm font-semibold text-cyan-400">{t.nestedLearning.middleLoop}</span>
              </div>
              <p className="text-xs text-cyan-300 mb-4 mt-2">{t.nestedLearning.middleLoopDesc}</p>

              <div className="relative p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30">
                <div className="absolute -top-3 left-4 px-3 py-1 bg-surface rounded-full border border-emerald-500/30">
                  <span className="text-sm font-semibold text-emerald-400">{t.nestedLearning.innerLoop}</span>
                </div>
                <p className="text-xs text-emerald-300 mt-2">{t.nestedLearning.innerLoopDesc}</p>
              </div>
            </div>
          </div>

          <p className="text-muted text-sm mt-6 text-center">{t.nestedLearning.structureExplain}</p>
        </div>
      </section>

      {/* Comparison */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.nestedLearning.comparisonTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
            <h3 className="text-lg font-semibold text-red-400 mb-3">{t.nestedLearning.traditionalTitle}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.nestedLearning.traditionalDesc}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-red-500/30" />
              <span className="text-xs text-red-400">Single loop</span>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-lg font-semibold text-emerald-400 mb-3">{t.nestedLearning.nestedTitle}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.nestedLearning.nestedDesc}</p>
            <div className="mt-4 space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-purple-500/50" />
                <span className="text-xs text-purple-400">Slow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-cyan-500/50" />
                <span className="text-xs text-cyan-400">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-emerald-500/50" />
                <span className="text-xs text-emerald-400">Fast</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hope Architecture */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.nestedLearning.hopeTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{t.nestedLearning.hopeDesc}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Features */}
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h4 className="font-semibold text-text mb-4">Features</h4>
            <ul className="space-y-3">
              {hopeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-xs font-bold">{i + 1}</span>
                  </span>
                  <span className="text-muted text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <h4 className="font-semibold text-emerald-400 mb-4">{t.nestedLearning.hopeResults}</h4>
            <ul className="space-y-3">
              {hopeResults.map((result, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-text text-sm leading-relaxed">{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why it Matters */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.nestedLearning.mattersTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{t.nestedLearning.mattersDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {matters.map((item, i) => (
            <div key={i} className={`p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
              <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center mb-3`}>
                <item.icon size={20} className={`text-${item.color}-400`} />
              </div>
              <h3 className={`font-semibold text-${item.color}-400 mb-2`}>{item.title}</h3>
              <p className="text-muted text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.nestedLearning.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.nestedLearning.takeaway1,
              t.nestedLearning.takeaway2,
              t.nestedLearning.takeaway3,
              t.nestedLearning.takeaway4,
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
