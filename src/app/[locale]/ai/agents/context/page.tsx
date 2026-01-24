'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { ContextAnatomyVisualizer } from '@/components/interactive/ContextAnatomyVisualizer'
import { useTranslation } from '@/lib/i18n/context'

export default function AgentContextPage() {
  const { t } = useTranslation()

  const components = [
    { title: t.agentContext.systemPrompt, desc: t.agentContext.systemPromptDesc, icon: '📋', color: 'purple' },
    { title: t.agentContext.toolDefs, desc: t.agentContext.toolDefsDesc, icon: '🔧', color: 'orange' },
    { title: t.agentContext.history, desc: t.agentContext.historyDesc, icon: '💬', color: 'emerald' },
    { title: t.agentContext.retrieved, desc: t.agentContext.retrievedDesc, icon: '📚', color: 'cyan' },
  ]

  return (
    <TopicLayout
      title={t.agentContext.title}
      description={t.agentContext.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.agentContext.title },
      ]}
      prevTopic={{ label: t.topicNames['agent-loop'], href: '/ai/agents/loop' }}
      nextTopic={{ label: t.topicNames['agent-problems'], href: '/ai/agents/problems' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentContext.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">
          {t.agentContext.whatIsDesc}
        </p>
        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <p className="text-xl text-text font-heading font-semibold mb-0">
            Think of context as the agent&apos;s working memory—everything it needs to understand the task and respond appropriately.
          </p>
        </div>
      </section>

      {/* Interactive Visualizer */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">Explore Context Layers</h2>
            <p className="text-sm text-muted">Click each layer to see example content</p>
          </div>
        </div>
        <ContextAnatomyVisualizer />
      </section>

      {/* What Gets Sent */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">What Actually Gets Sent to the Model</h2>
        <div className="rounded-2xl bg-background border border-border p-6 md:p-8 font-mono text-sm md:text-base overflow-x-auto">
          <pre className="text-muted">
            <code>
              <span className="text-pink-400">messages</span> = [{'\n'}
              {'  '}<span className="text-muted">{'// 1. System prompt (highest priority)'}</span>{'\n'}
              {'  '}{'{'} <span className="text-purple-400">&quot;role&quot;</span>: <span className="text-yellow-400">&quot;system&quot;</span>, <span className="text-purple-400">&quot;content&quot;</span>: <span className="text-cyan-400">&quot;You are a helpful coding assistant...&quot;</span> {'}'},{'\n\n'}
              {'  '}<span className="text-muted">{'// 2. Conversation history'}</span>{'\n'}
              {'  '}{'{'} <span className="text-purple-400">&quot;role&quot;</span>: <span className="text-yellow-400">&quot;user&quot;</span>, <span className="text-purple-400">&quot;content&quot;</span>: <span className="text-cyan-400">&quot;Help me fix this bug&quot;</span> {'}'},{'\n'}
              {'  '}{'{'} <span className="text-purple-400">&quot;role&quot;</span>: <span className="text-yellow-400">&quot;assistant&quot;</span>, <span className="text-purple-400">&quot;content&quot;</span>: <span className="text-cyan-400">&quot;I&apos;ll read the file first&quot;</span> {'}'},{'\n\n'}
              {'  '}<span className="text-muted">{'// 3. Tool calls and results'}</span>{'\n'}
              {'  '}{'{'} <span className="text-purple-400">&quot;role&quot;</span>: <span className="text-yellow-400">&quot;assistant&quot;</span>, <span className="text-purple-400">&quot;tool_calls&quot;</span>: [{'{'}<span className="text-orange-400">&quot;name&quot;</span>: <span className="text-cyan-400">&quot;read_file&quot;</span>{'}'}] {'}'},{'\n'}
              {'  '}{'{'} <span className="text-purple-400">&quot;role&quot;</span>: <span className="text-yellow-400">&quot;tool&quot;</span>, <span className="text-purple-400">&quot;content&quot;</span>: <span className="text-cyan-400">&quot;def buggy_function():...&quot;</span> {'}'},{'\n\n'}
              {'  '}<span className="text-muted">{'// 4. Latest user message'}</span>{'\n'}
              {'  '}{'{'} <span className="text-purple-400">&quot;role&quot;</span>: <span className="text-yellow-400">&quot;user&quot;</span>, <span className="text-purple-400">&quot;content&quot;</span>: <span className="text-cyan-400">&quot;Thanks, what was the issue?&quot;</span> {'}'},{'\n'}
              ]{'\n\n'}
              <span className="text-pink-400">tools</span> = [{'\n'}
              {'  '}{'{'} <span className="text-purple-400">&quot;name&quot;</span>: <span className="text-orange-400">&quot;read_file&quot;</span>, <span className="text-purple-400">&quot;description&quot;</span>: <span className="text-cyan-400">&quot;Read file contents&quot;</span>, ... {'}'},{'\n'}
              {'  '}{'{'} <span className="text-purple-400">&quot;name&quot;</span>: <span className="text-orange-400">&quot;write_file&quot;</span>, <span className="text-purple-400">&quot;description&quot;</span>: <span className="text-cyan-400">&quot;Write to a file&quot;</span>, ... {'}'},{'\n'}
              ]
            </code>
          </pre>
        </div>
      </section>

      {/* Components Grid */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentContext.components}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {components.map((comp, i) => (
            <div key={i} className={`p-5 rounded-xl bg-${comp.color}-500/5 border border-${comp.color}-500/20`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{comp.icon}</span>
                <h3 className={`text-lg font-bold font-heading text-${comp.color}-400`}>{comp.title}</h3>
              </div>
              <p className="text-sm text-muted">{comp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Context Management Strategies */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Context Management Strategies</h2>
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-surface/50 border border-border">
            <h3 className="text-lg font-bold font-heading text-primary-light mb-2">Sliding Window</h3>
            <p className="text-sm text-muted mb-3">
              Keep the most recent N messages. Simple but may lose important early context.
            </p>
            <div className="font-mono text-xs bg-background/50 rounded-lg p-3 text-muted">
              messages = messages[-MAX_MESSAGES:]
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface/50 border border-border">
            <h3 className="text-lg font-bold font-heading text-primary-light mb-2">Summarization</h3>
            <p className="text-sm text-muted mb-3">
              Periodically compress older messages into summaries. Preserves key information while reducing tokens.
            </p>
            <div className="font-mono text-xs bg-background/50 rounded-lg p-3 text-muted">
              summary = llm(&quot;Summarize this conversation: &quot; + old_messages)<br/>
              context = [system, summary] + recent_messages
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface/50 border border-border">
            <h3 className="text-lg font-bold font-heading text-primary-light mb-2">Priority-based Truncation</h3>
            <p className="text-sm text-muted mb-3">
              Assign priority scores to messages. System prompts and recent turns get highest priority.
            </p>
            <div className="font-mono text-xs bg-background/50 rounded-lg p-3 text-muted">
              priority: system &gt; tools &gt; recent_user &gt; recent_assistant &gt; old_history
            </div>
          </div>
        </div>
      </section>

      {/* Common Pitfalls */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Common Pitfalls</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">Context Overflow</h3>
            <p className="text-sm text-muted">
              Exceeding the context window causes truncation. The model loses access to earlier information,
              potentially forgetting instructions or important context.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">Tool Definition Bloat</h3>
            <p className="text-sm text-muted">
              Too many tools or overly verbose descriptions eat into context space.
              Keep tool definitions concise and only include tools relevant to the task.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">Lost in the Middle</h3>
            <p className="text-sm text-muted">
              Models pay less attention to information in the middle of long contexts.
              Place critical information at the start or end.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">Stale Retrieved Data</h3>
            <p className="text-sm text-muted">
              RAG results from earlier in conversation may become outdated as discussion evolves.
              Refresh retrieved data when the topic shifts.
            </p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentContext.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.agentContext.takeaway1,
              t.agentContext.takeaway2,
              t.agentContext.takeaway3,
              t.agentContext.takeaway4,
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
