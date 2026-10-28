'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { MemorySystemVisualizer } from '@/components/interactive/MemorySystemVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const TONES = {
  cyan: { box: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20', title: 'text-cyan-400' },
  purple: { box: 'from-purple-500/10 to-pink-500/10 border-purple-500/20', title: 'text-purple-400' },
  emerald: { box: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20', title: 'text-emerald-400' },
  orange: { box: 'from-orange-500/10 to-red-500/10 border-orange-500/20', title: 'text-orange-400' },
} as const

export default function MemoryPage() {
  const { t, locale } = useTranslation()
  const m = t.memorySystems

  const types = [
    { title: m.working, desc: m.workingDesc, tone: TONES.cyan },
    { title: m.episodic, desc: m.episodicDesc, tone: TONES.emerald },
    { title: m.semantic, desc: m.semanticDesc, tone: TONES.orange },
    { title: m.procedural, desc: m.proceduralDesc, tone: TONES.purple },
  ]

  const architectures = [
    { ...m.archFiles, tone: TONES.cyan },
    { ...m.archRetrieval, tone: TONES.emerald },
    { ...m.archAgentManaged, tone: TONES.purple },
    { ...m.archTemporal, tone: TONES.orange },
  ]

  const sources = [
    { label: m.srcCoala, href: 'https://arxiv.org/abs/2309.02427' },
    { label: m.srcClaudeMemory, href: 'https://code.claude.com/docs/en/memory' },
    { label: m.srcAgentsMd, href: 'https://agents.md/' },
    { label: m.srcMemoryTool, href: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool' },
    { label: m.srcGenerativeAgents, href: 'https://arxiv.org/abs/2304.03442' },
    { label: m.srcMem0, href: 'https://arxiv.org/abs/2504.19413' },
    { label: m.srcMemgpt, href: 'https://arxiv.org/abs/2310.08560' },
    { label: m.srcZep, href: 'https://arxiv.org/abs/2501.13956' },
    { label: m.srcExperience, href: 'https://arxiv.org/abs/2505.16067' },
    { label: m.srcMinja, href: 'https://arxiv.org/abs/2503.03704' },
  ]

  return (
    <TopicLayout
      topicId="memory"
      title={m.title}
      description={m.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: m.title },
      ]}
    >
      {/* What is agent memory */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">{m.whatIsDesc}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {m.questions.map((q, i) => (
            <div key={q.title} className="p-4 rounded-xl bg-background border border-border">
              <h3 className="font-bold text-text mb-1">{i + 1}. {q.title}</h3>
              <p className="text-sm text-muted">{q.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted mt-6">
          {m.relation}{' '}
          <Link href={`/${locale}/ai/agents/context`} className="text-primary-light underline">{t.topicNames['agent-context']}</Link>
          {' · '}
          <Link href={`/${locale}/ai/agents/compaction`} className="text-primary-light underline">{t.topicNames['chat-compaction']}</Link>
        </p>
      </section>

      {/* Types of memory */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.types}</h2>
        <p className="text-muted leading-relaxed mb-6">{m.typesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {types.map((type) => (
            <div key={type.title} className={`p-5 bg-gradient-to-br border rounded-xl ${type.tone.box}`}>
              <h3 className={`text-lg font-bold font-heading mb-2 ${type.tone.title}`}>{type.title}</h3>
              <p className="text-sm text-muted">{type.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architectures */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.architectures}</h2>
        <p className="text-muted leading-relaxed mb-6">{m.architecturesDesc}</p>
        <div className="space-y-4">
          {architectures.map((arch, i) => (
            <article key={arch.title} className={`p-5 md:p-6 bg-gradient-to-br border rounded-xl ${arch.tone.box}`}>
              <h3 className={`text-xl font-bold font-heading mb-1 ${arch.tone.title}`}>{i + 1}. {arch.title}</h3>
              <p className="text-sm text-subtle mb-4">{arch.examples}</p>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-text">{m.labelWrite}</dt>
                  <dd className="text-muted leading-relaxed">{arch.write}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-text">{m.labelRead}</dt>
                  <dd className="text-muted leading-relaxed">{arch.read}</dd>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <dt className="font-semibold text-emerald-400">{m.labelStrength}</dt>
                    <dd className="text-muted leading-relaxed">{arch.strength}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-red-400">{m.labelWeakness}</dt>
                    <dd className="text-muted leading-relaxed">{arch.weakness}</dd>
                  </div>
                </div>
              </dl>
              {arch.code && (
                <pre className="mt-4 font-mono text-xs bg-background/60 rounded-lg p-3 text-muted overflow-x-auto whitespace-pre">{arch.code}</pre>
              )}
            </article>
          ))}
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
            <h2 className="text-2xl font-bold font-heading text-text">{m.interactiveDemo}</h2>
            <p className="text-sm text-muted">{m.demoDesc}</p>
          </div>
        </div>
        <MemorySystemVisualizer />
      </section>

      {/* When memory hurts */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.hurts}</h2>
        <p className="text-muted leading-relaxed mb-6">{m.hurtsDesc}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {m.risks.map((risk) => (
            <div key={risk.title} className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <h3 className="font-bold text-red-400 mb-1">{risk.title}</h3>
              <p className="text-sm text-muted">{risk.desc}</p>
            </div>
          ))}
        </div>
        <h3 className="text-lg font-bold font-heading text-emerald-400 mb-3">{m.mitigations}</h3>
        <ul className="space-y-2 text-sm text-muted list-disc pl-5">
          {m.mitigationList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[m.takeaway1, m.takeaway2, m.takeaway3, m.takeaway4, m.takeaway5].map((item, i) => (
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

      {/* Sources */}
      <section className="border-t border-border pt-5">
        <h2 className="font-semibold mb-3">{m.sources}</h2>
        <ul className="space-y-2 text-sm">
          {sources.map((src) => (
            <li key={src.href}>
              <a className="text-primary-light underline" href={src.href} target="_blank" rel="noopener noreferrer">{src.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
