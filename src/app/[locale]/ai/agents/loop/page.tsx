'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { AgentLoopVisualizer } from '@/components/interactive/AgentLoopVisualizer'
import { useTranslation } from '@/lib/i18n/context'

export default function AgentLoopPage() {
  const { t } = useTranslation()

  const phases = [
    { title: t.agentLoop.observe, desc: t.agentLoop.observeDesc, color: 'emerald' },
    { title: t.agentLoop.think, desc: t.agentLoop.thinkDesc, color: 'cyan' },
    { title: t.agentLoop.act, desc: t.agentLoop.actDesc, color: 'purple' },
    { title: t.agentLoop.learn, desc: t.agentLoop.learnDesc, color: 'orange' },
  ]

  return (
    <TopicLayout topicId="agent-loop"
      title={t.agentLoop.title}
      description={t.agentLoop.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.agentLoop.title },
      ]}
      nextTopic={{ label: t.topicNames['agent-context'], href: '/ai/agents/context' }}
    >
      {/* The Big Reveal */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentLoop.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.agentLoop.whatIsDesc}
          </p>
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <p className="text-xl text-text font-heading font-semibold mb-0">
              The reality? An agent is just an LLM running in a <code className="px-2 py-1 rounded bg-surface-elevated text-primary-light">while</code> loop.
            </p>
          </div>
        </div>
      </section>

      {/* The Four Phases */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentLoop.phases}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {phases.map((phase, i) => (
            <div key={i} className={`p-5 rounded-xl bg-${phase.color}-500/5 border border-${phase.color}-500/20`}>
              <h3 className={`text-lg font-bold font-heading text-${phase.color}-400 mb-2`}>{phase.title}</h3>
              <p className="text-sm text-muted">{phase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Pseudocode */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The Core Pattern</h2>
        <div className="rounded-2xl bg-background border border-border p-6 md:p-8 font-mono text-sm md:text-base overflow-x-auto">
          <pre className="text-muted">
            <code>
              <span className="text-purple-400">context</span> = [<span className="text-yellow-400">system_prompt</span>, <span className="text-orange-400">tool_definitions</span>]{'\n'}
              <span className="text-purple-400">context</span>.<span className="text-cyan-400">append</span>(<span className="text-cyan-400">user_message</span>){'\n\n'}
              <span className="text-pink-400">while</span> <span className="text-cyan-400">True</span>:{'\n'}
              {'  '}<span className="text-purple-400">response</span> = <span className="text-yellow-400">llm</span>(<span className="text-purple-400">context</span>){'\n\n'}
              {'  '}<span className="text-pink-400">if</span> response.<span className="text-cyan-400">has_tool_call</span>:{'\n'}
              {'    '}<span className="text-muted">{'# Execute the tool and add result to context'}</span>{'\n'}
              {'    '}<span className="text-purple-400">result</span> = <span className="text-yellow-400">execute_tool</span>(response.<span className="text-cyan-400">tool_call</span>){'\n'}
              {'    '}<span className="text-purple-400">context</span>.<span className="text-cyan-400">append</span>(response){'\n'}
              {'    '}<span className="text-purple-400">context</span>.<span className="text-cyan-400">append</span>(<span className="text-purple-400">result</span>){'\n'}
              {'    '}<span className="text-pink-400">continue</span>  <span className="text-muted">{'# Loop again'}</span>{'\n\n'}
              {'  '}<span className="text-pink-400">else</span>:{'\n'}
              {'    '}<span className="text-muted">{'# No tool call = final answer'}</span>{'\n'}
              {'    '}<span className="text-pink-400">return</span> response.<span className="text-cyan-400">content</span>
            </code>
          </pre>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔄</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">Watch It In Action</h2>
            <p className="text-sm text-muted">See how the context builds up through the loop</p>
          </div>
        </div>
        <AgentLoopVisualizer />
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentLoop.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.agentLoop.takeaway1,
              t.agentLoop.takeaway2,
              t.agentLoop.takeaway3,
              t.agentLoop.takeaway4,
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
