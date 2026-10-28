'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { AgentTrajectoryEvalDemo } from '@/components/interactive/AgentTrajectoryEvalDemo'
import { PassKExplorer } from '@/components/interactive/PassKExplorer'

const accents = [
  { text: 'text-cyan-400', card: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20' },
  { text: 'text-purple-400', card: 'from-purple-500/10 to-pink-500/10 border-purple-500/20' },
  { text: 'text-emerald-400', card: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20' },
  { text: 'text-orange-400', card: 'from-orange-500/10 to-red-500/10 border-orange-500/20' },
  { text: 'text-pink-400', card: 'from-pink-500/10 to-rose-500/10 border-pink-500/20' },
  { text: 'text-amber-400', card: 'from-amber-500/10 to-orange-500/10 border-amber-500/20' },
  { text: 'text-blue-400', card: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20' },
]

const sourceLinks = {
  anthropic: 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents',
  openaiSwe: 'https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/',
  sweVerified: 'https://openai.com/index/introducing-swe-bench-verified/',
  swePro: 'https://arxiv.org/abs/2509.16941',
  terminalBench: 'https://arxiv.org/abs/2601.11868',
  osworld: 'https://os-world.github.io/',
  tau: 'https://arxiv.org/abs/2406.12045',
  tau2: 'https://arxiv.org/abs/2506.07982',
  browseComp: 'https://arxiv.org/abs/2504.12516',
  metr: 'https://arxiv.org/abs/2503.14499',
  metr11: 'https://metr.org/blog/2026-1-29-time-horizon-1-1/',
  codex: 'https://arxiv.org/abs/2107.03374',
  judge: 'https://arxiv.org/abs/2306.05685',
} as const

export default function EvaluationPage() {
  const { t } = useTranslation()
  const e = t.evaluation

  const terms = Object.values(e.terms)
  const graderTypes = Object.values(e.graderTypes)
  const biases = Object.values(e.judgeBiases)
  const steps = Object.values(e.suiteSteps)
  const benchmarks = Object.values(e.bench)

  return (
    <TopicLayout topicId="evaluation"
      title={e.title}
      description={e.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: e.title },
      ]}
    >
      {/* Why agents need their own evaluation */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{e.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">{e.whatIsDesc}</p>
        <p className="text-sm text-muted mt-4 border-l-2 border-primary/40 pl-3">{e.llmBenchmarksNote}</p>
      </section>

      {/* Anatomy */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{e.anatomyTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.anatomyDesc}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {terms.map((term, i) => (
            <div key={term.name} className={`p-5 bg-gradient-to-br ${accents[i % accents.length].card} border rounded-xl`}>
              <h3 className={`text-lg font-bold font-heading mb-2 ${accents[i % accents.length].text}`}>{term.name}</h3>
              <p className="text-sm text-muted">{term.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Outcome vs trajectory */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{e.ovtTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.ovtDesc}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{e.outcomeTitle}</h3>
            <p className="text-sm text-muted mb-3">{e.outcomeDesc}</p>
            <p className="text-xs text-text bg-background border border-border rounded-lg p-3">{e.outcomeExample}</p>
          </div>
          <div className="p-5 bg-purple-500/5 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{e.trajectoryTitle}</h3>
            <p className="text-sm text-muted mb-3">{e.trajectoryDesc}</p>
            <p className="text-xs text-text bg-background border border-border rounded-lg p-3">{e.trajectoryExample}</p>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-5">
          <p className="text-sm text-muted">{e.ovtRule}</p>
        </div>
      </section>

      {/* Grader types */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{e.gradersTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.gradersDesc}</p>
        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          {graderTypes.map((g, i) => (
            <div key={g.name} className="p-5 bg-background rounded-xl border border-border space-y-3">
              <h3 className={`text-lg font-bold font-heading ${accents[i].text}`}>{g.name}</h3>
              <div className="text-sm">
                <p className="font-semibold text-emerald-400">{e.strengthsLabel}</p>
                <p className="text-muted">{g.strengths}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-red-400">{e.weaknessesLabel}</p>
                <p className="text-muted">{g.weaknesses}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-text">{e.examplesLabel}</p>
                <p className="text-muted">{g.examples}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-surface/50 border border-border p-6">
          <h3 className="text-lg font-bold font-heading text-text mb-2">{e.judgeTitle}</h3>
          <p className="text-sm text-muted mb-4">{e.judgeDesc}</p>
          <div className="grid md:grid-cols-3 gap-3 mb-5">
            {biases.map(b => (
              <div key={b.name} className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
                <h4 className="font-bold text-red-400 mb-1">{b.name}</h4>
                <p className="text-sm text-muted">{b.desc}</p>
              </div>
            ))}
          </div>
          <h4 className="font-bold text-blue-400 mb-2">{e.judgePracticesTitle}</h4>
          <ul className="space-y-2 text-sm text-muted">
            {Object.values(e.judgePractices).map(practice => (
              <li key={practice} className="flex gap-2">
                <span className="text-blue-400">→</span>
                <span>{practice}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AgentTrajectoryEvalDemo />

      {/* pass@k vs pass^k */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{e.passKTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.passKDesc}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{e.passAtTitle}</h3>
            <p className="text-sm text-muted">{e.passAtDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{e.passHatTitle}</h3>
            <p className="text-sm text-muted">{e.passHatDesc}</p>
          </div>
        </div>
        <p className="text-muted leading-relaxed mb-6">{e.passKExample}</p>
        <PassKExplorer />
        <p className="text-sm text-muted leading-relaxed mt-6">{e.passKEstimator}</p>
      </section>

      {/* Build a suite from real failures */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{e.suiteTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.suiteDesc}</p>
        <ol className="space-y-3 mb-6">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-3 items-start p-4 bg-background rounded-xl border border-border">
              <span className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary-light text-sm font-bold font-mono">{i + 1}</span>
              </span>
              <div>
                <h3 className="font-bold text-text mb-1">{step.title}</h3>
                <p className="text-sm text-muted">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{e.capTitle}</h3>
            <p className="text-sm text-muted">{e.capDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{e.regTitle}</h3>
            <p className="text-sm text-muted">{e.regDesc}</p>
          </div>
        </div>
      </section>

      {/* Environment reset */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{e.envTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.envDesc}</p>
        <ul className="space-y-3">
          {Object.values(e.envPoints).map(point => (
            <li key={point} className="flex gap-3 items-start">
              <span className="text-cyan-400 mt-0.5">▸</span>
              <span className="text-muted leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Transcript review */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{e.transcriptsTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.transcriptsDesc}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {Object.values(e.transcriptCases).map((item, i) => (
            <div key={item.title} className="p-5 bg-background rounded-xl border border-border">
              <h3 className={`text-lg font-bold font-heading mb-2 ${i === 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-5">
          <p className="text-sm text-muted">{e.transcriptRule}</p>
        </div>
      </section>

      {/* Public agent benchmarks */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{e.benchTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{e.benchDesc}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {benchmarks.map((b, i) => (
            <div key={b.name} className="p-5 bg-background rounded-xl border border-border space-y-2">
              <h3 className={`font-bold font-heading ${accents[i % accents.length].text}`}>{b.name}</h3>
              <p className="text-sm text-muted"><span className="font-semibold text-text">{e.benchWhatLabel}: </span>{b.what}</p>
              <p className="text-sm text-muted"><span className="font-semibold text-text">{e.benchGradingLabel}: </span>{b.grading}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 p-5">
          <p className="text-sm text-muted">{e.benchCaveat}</p>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{e.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {Object.values(e.takeaways).map((item, i) => (
              <li key={item} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary-light text-sm font-bold">{i + 1}</span>
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sources */}
      <section className="border-t border-border pt-5">
        <h2 className="font-semibold mb-3">{e.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {(Object.keys(sourceLinks) as (keyof typeof sourceLinks)[]).map(key => (
            <li key={key}>
              <a className="text-primary-light underline" href={sourceLinks[key]} target="_blank" rel="noopener noreferrer">{e.sources[key]}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
