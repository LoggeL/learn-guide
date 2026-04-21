'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { CompactionExplorer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function AgentCompactionPage() {
  const { t } = useTranslation()

  const pillars = [
    { title: t.chatCompaction.compress, desc: t.chatCompaction.compressDesc, color: 'cyan' },
    { title: t.chatCompaction.structure, desc: t.chatCompaction.structureDesc, color: 'purple' },
    { title: t.chatCompaction.retrieve, desc: t.chatCompaction.retrieveDesc, color: 'amber' },
    { title: t.chatCompaction.expand, desc: t.chatCompaction.expandDesc, color: 'emerald' },
  ]

  const takeaways = [
    t.chatCompaction.takeaway1,
    t.chatCompaction.takeaway2,
    t.chatCompaction.takeaway3,
    t.chatCompaction.takeaway4,
  ]

  return (
    <TopicLayout
      topicId="chat-compaction"
      title={t.chatCompaction.title}
      description={t.chatCompaction.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.chatCompaction.title },
      ]}
      prevTopic={{ label: t.topicNames.memory, href: '/ai/agents/memory' }}
      nextTopic={{ label: t.topicNames.orchestration, href: '/ai/agents/orchestration' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.chatCompaction.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.chatCompaction.whatIsDesc}
          </p>
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <p className="text-xl text-text font-heading font-semibold mb-0">
              {t.chatCompaction.quote}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.chatCompaction.why}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.chatCompaction.activeTitle}</h3>
            <p className="text-sm text-muted">
              {t.chatCompaction.activeDesc}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.chatCompaction.inactiveTitle}</h3>
            <p className="text-sm text-muted">
              {t.chatCompaction.inactiveDesc}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.chatCompaction.blocks}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {pillars.map((pillar) => (
            <div key={pillar.title} className={`p-5 rounded-xl bg-${pillar.color}-500/5 border border-${pillar.color}-500/20`}>
              <h3 className={`text-lg font-bold font-heading text-${pillar.color}-400 mb-2`}>{pillar.title}</h3>
              <p className="text-sm text-muted">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.chatCompaction.pattern}</h2>
        <div className="rounded-2xl bg-background border border-border p-6 md:p-8 font-mono text-sm md:text-base overflow-x-auto">
          <pre className="text-muted">
            <code>
              <span className="text-purple-400">fresh_context</span> = <span className="text-cyan-400">recent_messages</span> + <span className="text-cyan-400">tool_results</span>{'\n'}
              <span className="text-purple-400">compacted_history</span> = <span className="text-cyan-400">summaries</span> + <span className="text-cyan-400">recall_index</span>{'\n\n'}
              <span className="text-pink-400">if</span> <span className="text-yellow-400">context_too_large</span>:{'\n'}
              {'  '}<span className="text-purple-400">compacted_history</span>.<span className="text-cyan-400">add</span>(<span className="text-yellow-400">compact</span>(<span className="text-cyan-400">older_turns</span>)){"\n\n"}
              <span className="text-purple-400">matches</span> = <span className="text-yellow-400">retrieve</span>(<span className="text-purple-400">compacted_history</span>, <span className="text-cyan-400">current_task</span>){'\n\n'}
              <span className="text-pink-400">if</span> <span className="text-cyan-400">exact_details_needed</span>:{'\n'}
              {'  '}<span className="text-purple-400">restored</span> = <span className="text-yellow-400">expand</span>(<span className="text-purple-400">matches</span>){'\n'}
              {'  '}<span className="text-purple-400">context</span> = <span className="text-purple-400">fresh_context</span> + <span className="text-purple-400">restored</span>{'\n'}
              <span className="text-pink-400">else</span>:{'\n'}
              {'  '}<span className="text-purple-400">context</span> = <span className="text-purple-400">fresh_context</span> + <span className="text-purple-400">matches</span>
            </code>
          </pre>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🗜️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.chatCompaction.interactive}</h2>
            <p className="text-sm text-muted">{t.chatCompaction.interactiveDesc}</p>
          </div>
        </div>
        <CompactionExplorer />
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.chatCompaction.breaks}</h2>
        <div className="space-y-4 text-muted leading-relaxed">
          <p>
            {t.chatCompaction.breaksDesc}
          </p>
          <ul className="space-y-3 list-disc pl-5">
            <li>{t.chatCompaction.break1}</li>
            <li>{t.chatCompaction.break2}</li>
            <li>{t.chatCompaction.break3}</li>
            <li>{t.chatCompaction.break4}</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.chatCompaction.practice}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.chatCompaction.rules}</h3>
            <ul className="space-y-2 text-sm text-muted list-disc pl-5">
              <li>{t.chatCompaction.rule1}</li>
              <li>{t.chatCompaction.rule2}</li>
              <li>{t.chatCompaction.rule3}</li>
              <li>{t.chatCompaction.rule4}</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">{t.chatCompaction.separation}</h3>
            <ul className="space-y-2 text-sm text-muted list-disc pl-5">
              <li>{t.chatCompaction.separation1}</li>
              <li>{t.chatCompaction.separation2}</li>
              <li>{t.chatCompaction.separation3}</li>
              <li>{t.chatCompaction.separation4}</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.chatCompaction.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {takeaways.map((item, i) => (
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
