'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { ForgettingDemo, NestedLoopsDemo, ComparisonDemo, HopeDiagram } from '@/components/interactive'
import { FlaskConical, Brain, Zap, RefreshCw } from 'lucide-react'

export default function NestedLearningPage() {
  const { t } = useTranslation()
  const nl = t.nestedLearning

  return (
    <TopicLayout topicId="nested-learning"
      title={nl.title}
      description={nl.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: nl.title },
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
            <h3 className="text-lg font-bold text-amber-400 mb-2">{nl.researchDisclaimer}</h3>
            <p className="text-muted">{nl.researchDisclaimerDesc}</p>
          </div>
        </div>
      </section>

      {/* Analogy Intro */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{nl.analogyTitle}</h2>
        <p className="text-lg text-muted leading-relaxed mb-4">{nl.analogyDesc}</p>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-purple-300 italic text-lg leading-relaxed">&ldquo;{nl.analogyQuote}&rdquo;</p>
        </div>
        <p className="text-muted leading-relaxed mt-4">{nl.analogyPunchline}</p>
      </section>

      {/* The Problem — Interactive Forgetting Demo */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{nl.problemTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{nl.problemDesc}</p>
        <ForgettingDemo labels={{
          title: nl.forgettingDemoTitle,
          taskA: nl.forgettingTaskA,
          taskB: nl.forgettingTaskB,
          trainA: nl.forgettingTrainA,
          trainB: nl.forgettingTrainB,
          reset: nl.forgettingReset,
          knowledge: nl.forgettingKnowledge,
          step: nl.forgettingStep,
          forgettingWarning: nl.forgettingWarning,
        }} />
      </section>

      {/* The Solution — Simple Explanation */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{nl.solutionTitle}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">{nl.solutionDesc}</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: nl.speedSlow, desc: nl.speedSlowDesc, color: 'purple' },
            { label: nl.speedMedium, desc: nl.speedMediumDesc, color: 'cyan' },
            { label: nl.speedFast, desc: nl.speedFastDesc, color: 'emerald' },
          ].map((s, i) => (
            <div key={i} className={`p-4 rounded-xl bg-${s.color}-500/10 border border-${s.color}-500/20 text-center`}>
              <p className={`font-bold text-${s.color}-400 mb-1`}>{s.label}</p>
              <p className="text-muted text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-muted leading-relaxed mt-4">{nl.solutionAnalogy}</p>
      </section>

      {/* Interactive Nested Loops */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{nl.loopsTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{nl.loopsDesc}</p>
        <NestedLoopsDemo labels={{
          title: nl.loopsDemoTitle,
          outer: nl.outerLoop,
          middle: nl.middleLoop,
          inner: nl.innerLoop,
          outerDesc: nl.outerLoopDesc,
          middleDesc: nl.middleLoopDesc,
          innerDesc: nl.innerLoopDesc,
          running: nl.loopsRunning,
          paused: nl.loopsPaused,
          play: nl.loopsPlay,
          pause: nl.loopsPause,
        }} />
      </section>

      {/* Side-by-Side Comparison */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{nl.comparisonTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{nl.comparisonDesc}</p>
        <ComparisonDemo labels={{
          title: nl.comparisonDemoTitle,
          traditional: nl.traditionalTitle,
          nested: nl.nestedTitle,
          taskA: nl.compTaskA,
          taskB: nl.compTaskB,
          taskC: nl.compTaskC,
          runDemo: nl.compRun,
          reset: nl.compReset,
        }} />
      </section>

      {/* Hope Architecture — Visual */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{nl.hopeTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{nl.hopeDesc}</p>
        <HopeDiagram labels={{
          title: nl.hopeDiagramTitle,
          input: nl.hopeInput,
          selfModifying: nl.hopeSelfMod,
          memory: nl.hopeMemory,
          output: nl.hopeOutput,
          learnRules: nl.hopeLearnRules,
          storeRecall: nl.hopeStoreRecall,
        }} />
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          {[nl.hopePoint1, nl.hopePoint2, nl.hopePoint3].map((point, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span className="text-muted text-sm leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{nl.mattersTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{nl.mattersDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: nl.matter1Title, desc: nl.matter1Desc, icon: RefreshCw, color: 'purple' },
            { title: nl.matter2Title, desc: nl.matter2Desc, icon: Zap, color: 'cyan' },
            { title: nl.matter3Title, desc: nl.matter3Desc, icon: Brain, color: 'emerald' },
          ].map((item, i) => (
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
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{nl.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[nl.takeaway1, nl.takeaway2, nl.takeaway3, nl.takeaway4].map((item, i) => (
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
