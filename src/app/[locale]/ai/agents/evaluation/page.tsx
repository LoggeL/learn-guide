'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function EvaluationPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.evaluation.title}
      description={t.evaluation.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.evaluation.title },
      ]}
      prevTopic={{ label: t.topicNames.orchestration, href: '/ai/agents/orchestration' }}
    >
      {/* Why Evaluate */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.evaluation.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.evaluation.whatIsDesc}
        </p>
      </section>

      {/* Key Metrics */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.evaluation.metrics}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.evaluation.metricsDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.evaluation.taskSuccess}</h3>
            <p className="text-sm text-muted">{t.evaluation.taskSuccessDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.evaluation.efficiency}</h3>
            <p className="text-sm text-muted">{t.evaluation.efficiencyDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.evaluation.accuracy}</h3>
            <p className="text-sm text-muted">{t.evaluation.accuracyDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.evaluation.reliability}</h3>
            <p className="text-sm text-muted">{t.evaluation.reliabilityDesc}</p>
          </div>
        </div>
      </section>

      {/* Evaluation Approaches */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.evaluation.approaches}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.evaluation.approachesDesc}
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.evaluation.unitTests}</h4>
            <p className="text-sm text-muted">{t.evaluation.unitTestsDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.evaluation.integration}</h4>
            <p className="text-sm text-muted">{t.evaluation.integrationDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.evaluation.benchmarks}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarksDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.evaluation.humanEval}</h4>
            <p className="text-sm text-muted">{t.evaluation.humanEvalDesc}</p>
          </div>
        </div>
      </section>

      {/* Benchmarks Section */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.evaluation.benchmarksSection}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.evaluation.benchmarksSectionDesc}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-cyan-400 mb-2">{t.evaluation.benchmarkMmlu}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkMmluDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-emerald-400 mb-2">{t.evaluation.benchmarkHellaswag}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkHellaswagDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-purple-400 mb-2">{t.evaluation.benchmarkHumaneval}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkHumanevalDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-orange-400 mb-2">{t.evaluation.benchmarkGsm8k}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkGsm8kDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-pink-400 mb-2">{t.evaluation.benchmarkArc}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkArcDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-amber-400 mb-2">{t.evaluation.benchmarkMath}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkMathDesc}</p>
          </div>
        </div>

        {/* Benchmark Caveats */}
        <div className="rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 p-5">
          <h4 className="font-bold text-amber-400 mb-3">{t.evaluation.benchmarkCaveats}</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-2">
              <span className="text-amber-400">⚠</span>
              <span>{t.evaluation.benchmarkCaveat1}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">⚠</span>
              <span>{t.evaluation.benchmarkCaveat2}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">⚠</span>
              <span>{t.evaluation.benchmarkCaveat3}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">⚠</span>
              <span>{t.evaluation.benchmarkCaveat4}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* LLM as a Judge */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.evaluation.llmJudge}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.evaluation.llmJudgeDesc}
        </p>

        {/* How it works */}
        <div className="rounded-2xl bg-surface/50 border border-border p-6 mb-6">
          <h3 className="text-lg font-bold font-heading text-text mb-3">{t.evaluation.llmJudgeWhat}</h3>
          <p className="text-muted">{t.evaluation.llmJudgeWhatDesc}</p>
        </div>

        {/* Advantages */}
        <div className="mb-6">
          <h3 className="text-lg font-bold font-heading text-emerald-400 mb-4">{t.evaluation.llmJudgeAdvantages}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
              <h4 className="font-bold text-emerald-400 mb-2">{t.evaluation.llmJudgeAdv1}</h4>
              <p className="text-sm text-muted">{t.evaluation.llmJudgeAdv1Desc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
              <h4 className="font-bold text-emerald-400 mb-2">{t.evaluation.llmJudgeAdv2}</h4>
              <p className="text-sm text-muted">{t.evaluation.llmJudgeAdv2Desc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
              <h4 className="font-bold text-emerald-400 mb-2">{t.evaluation.llmJudgeAdv3}</h4>
              <p className="text-sm text-muted">{t.evaluation.llmJudgeAdv3Desc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
              <h4 className="font-bold text-emerald-400 mb-2">{t.evaluation.llmJudgeAdv4}</h4>
              <p className="text-sm text-muted">{t.evaluation.llmJudgeAdv4Desc}</p>
            </div>
          </div>
        </div>

        {/* Problems */}
        <div className="mb-6">
          <h3 className="text-lg font-bold font-heading text-red-400 mb-4">{t.evaluation.llmJudgeProblems}</h3>
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
              <h4 className="font-bold text-red-400 mb-2">{t.evaluation.llmJudgeProb1}</h4>
              <p className="text-sm text-muted">{t.evaluation.llmJudgeProb1Desc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
              <h4 className="font-bold text-red-400 mb-2">{t.evaluation.llmJudgeProb2}</h4>
              <p className="text-sm text-muted">{t.evaluation.llmJudgeProb2Desc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
              <h4 className="font-bold text-red-400 mb-2">{t.evaluation.llmJudgeProb3}</h4>
              <p className="text-sm text-muted">{t.evaluation.llmJudgeProb3Desc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
              <h4 className="font-bold text-red-400 mb-2">{t.evaluation.llmJudgeProb4}</h4>
              <p className="text-sm text-muted">{t.evaluation.llmJudgeProb4Desc}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
              <h4 className="font-bold text-red-400 mb-2">{t.evaluation.llmJudgeProb5}</h4>
              <p className="text-sm text-muted">{t.evaluation.llmJudgeProb5Desc}</p>
            </div>
          </div>
        </div>

        {/* Best Practices for LLM Judges */}
        <div className="rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20 p-5">
          <h4 className="font-bold text-blue-400 mb-3">{t.evaluation.llmJudgeBestPractices}</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-2">
              <span className="text-blue-400">→</span>
              <span>{t.evaluation.llmJudgePractice1}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">→</span>
              <span>{t.evaluation.llmJudgePractice2}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">→</span>
              <span>{t.evaluation.llmJudgePractice3}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">→</span>
              <span>{t.evaluation.llmJudgePractice4}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">→</span>
              <span>{t.evaluation.llmJudgePractice5}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CLASSIC Framework */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.evaluation.classicFramework}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.evaluation.classicFrameworkDesc}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <h4 className="font-bold text-green-400 mb-2">C - {t.evaluation.classicCost}</h4>
            <p className="text-sm text-muted">{t.evaluation.classicCostDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
            <h4 className="font-bold text-blue-400 mb-2">L - {t.evaluation.classicLatency}</h4>
            <p className="text-sm text-muted">{t.evaluation.classicLatencyDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-xl">
            <h4 className="font-bold text-purple-400 mb-2">A - {t.evaluation.classicAccuracy}</h4>
            <p className="text-sm text-muted">{t.evaluation.classicAccuracyDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-xl">
            <h4 className="font-bold text-cyan-400 mb-2">S - {t.evaluation.classicStability}</h4>
            <p className="text-sm text-muted">{t.evaluation.classicStabilityDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
            <h4 className="font-bold text-red-400 mb-2">S - {t.evaluation.classicSecurity}</h4>
            <p className="text-sm text-muted">{t.evaluation.classicSecurityDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl">
            <h4 className="font-bold text-amber-400 mb-2">I - {t.evaluation.classicInterpretability}</h4>
            <p className="text-sm text-muted">{t.evaluation.classicInterpretabilityDesc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-xl md:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-indigo-400 mb-2">C - {t.evaluation.classicCompliance}</h4>
            <p className="text-sm text-muted">{t.evaluation.classicComplianceDesc}</p>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-5">
          <p className="text-sm text-muted">{t.evaluation.classicNote}</p>
        </div>
      </section>

      {/* Agent-Specific Benchmarks */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.evaluation.agentBenchmarks}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.evaluation.agentBenchmarksDesc}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-cyan-400 mb-2">{t.evaluation.benchmarkAgentBench}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkAgentBenchDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-emerald-400 mb-2">{t.evaluation.benchmarkGaia}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkGaiaDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-purple-400 mb-2">{t.evaluation.benchmarkBfcl}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkBfclDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-orange-400 mb-2">{t.evaluation.benchmarkSwe}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkSweDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-pink-400 mb-2">{t.evaluation.benchmarkWebArena}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkWebArenaDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-amber-400 mb-2">{t.evaluation.benchmarkTau}</h4>
            <p className="text-sm text-muted">{t.evaluation.benchmarkTauDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Evaluation */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.evaluation.interactiveEval}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.evaluation.interactiveEvalDesc}
        </p>

        <div className="rounded-xl bg-background border border-border p-5 mb-6">
          <h3 className="text-lg font-bold font-heading text-text mb-3">{t.evaluation.interactiveWhat}</h3>
          <p className="text-muted">{t.evaluation.interactiveWhatDesc}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h4 className="font-bold text-cyan-400 mb-2">{t.evaluation.interactiveApproach1}</h4>
            <p className="text-sm text-muted">{t.evaluation.interactiveApproach1Desc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h4 className="font-bold text-purple-400 mb-2">{t.evaluation.interactiveApproach2}</h4>
            <p className="text-sm text-muted">{t.evaluation.interactiveApproach2Desc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h4 className="font-bold text-emerald-400 mb-2">{t.evaluation.interactiveApproach3}</h4>
            <p className="text-sm text-muted">{t.evaluation.interactiveApproach3Desc}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl">
            <h4 className="font-bold text-orange-400 mb-2">{t.evaluation.interactiveApproach4}</h4>
            <p className="text-sm text-muted">{t.evaluation.interactiveApproach4Desc}</p>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-5">
          <p className="text-sm text-muted">{t.evaluation.interactiveNote}</p>
        </div>
      </section>

      {/* Best Practices */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.evaluation.bestPractices}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.evaluation.bestPracticesDesc}
        </p>
        <ul className="space-y-3">
          {[
            t.evaluation.practice1,
            t.evaluation.practice2,
            t.evaluation.practice3,
            t.evaluation.practice4,
          ].map((practice, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary-light text-sm">✓</span>
              </span>
              <span className="text-muted leading-relaxed">{practice}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.evaluation.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.evaluation.takeaway1,
              t.evaluation.takeaway2,
              t.evaluation.takeaway3,
              t.evaluation.takeaway4,
              t.evaluation.takeaway5,
              t.evaluation.takeaway6,
              t.evaluation.takeaway7,
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
