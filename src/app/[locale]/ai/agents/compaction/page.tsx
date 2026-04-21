'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { CompactionExplorer } from '@/components/interactive'

export default function AgentCompactionPage() {
  const title = 'Chat Compaction'
  const description = 'How to compress long agent chats without losing the ability to resume, retrieve, and recover exact details later.'

  const pillars = [
    {
      title: 'Compress',
      desc: 'Convert older turns into summaries once they no longer need to live in the hot context window.',
      color: 'cyan',
    },
    {
      title: 'Structure',
      desc: 'Store compacted history in linked chunks or hierarchies so old work remains navigable instead of becoming a blob.',
      color: 'purple',
    },
    {
      title: 'Retrieve',
      desc: 'Pull only the relevant compacted fragments back when the current task depends on earlier decisions or facts.',
      color: 'amber',
    },
    {
      title: 'Expand',
      desc: 'Recover exact wording, values, and causal chains on demand instead of guessing from summaries alone.',
      color: 'emerald',
    },
  ]

  const takeaways = [
    'Compaction is not just about saving tokens. It is about preserving recoverability.',
    'Good compaction helps both overloaded live sessions and older inactive sessions that are no longer cached.',
    'Summaries are recall cues, not proof. Exact claims should come from targeted expansion.',
    'The best systems separate fresh context, compacted history, retrieval, and long-term memory.',
  ]

  return (
    <TopicLayout
      topicId="memory"
      title={title}
      description={description}
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'AI Agents', href: '/ai/agents' },
        { label: title },
      ]}
      prevTopic={{ label: 'Memory Systems', href: '/ai/agents/memory' }}
      nextTopic={{ label: 'Orchestration', href: '/ai/agents/orchestration' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">What is chat compaction?</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            Chat compaction is the deliberate compression of long agent conversations into smaller, structured representations.
            The goal is not just to fit more text into a context window. The real goal is to keep old work recoverable,
            so an agent can continue a task later without re-reading every raw turn.
          </p>
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <p className="text-xl text-text font-heading font-semibold mb-0">
              Compaction is navigation, not truth.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Why agents need it</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">Active sessions</h3>
            <p className="text-sm text-muted">
              Long-running agents accumulate user turns, tool calls, results, retries, and intermediate reasoning. If nothing is compacted,
              the context window fills up and the agent starts losing useful recent state or paying heavily to keep it all alive.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">Inactive sessions</h3>
            <p className="text-sm text-muted">
              Old sessions often fall out of hot cache entirely. Compaction gives you a resumable version of cold history, so the agent can
              restart from a compacted summary plus targeted recall instead of rehydrating the whole thread.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The four building blocks</h2>
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
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The core pattern</h2>
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
            <h2 className="text-2xl font-bold font-heading text-text">Interactive compaction explorer</h2>
            <p className="text-sm text-muted">Compare overloaded live sessions with old inactive sessions that need to be resumed later.</p>
          </div>
        </div>
        <CompactionExplorer />
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">What naive compaction breaks</h2>
        <div className="space-y-4 text-muted leading-relaxed">
          <p>
            Naive truncation drops old context entirely. Naive summarization keeps only a plausible paraphrase. Both approaches fail in the same way:
            they make old work cheaper to carry, but harder to trust.
          </p>
          <ul className="space-y-3 list-disc pl-5">
            <li>Important decisions lose their rationale.</li>
            <li>Open loops disappear, so the agent forgets what was still unresolved.</li>
            <li>Exact commands, paths, timestamps, and values get blurred into summary language.</li>
            <li>Old summaries can contradict newer evidence if they are treated like ground truth.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Good compaction in practice</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">Design rules</h3>
            <ul className="space-y-2 text-sm text-muted list-disc pl-5">
              <li>Keep a fresh tail for active work.</li>
              <li>Compact old turns into structured, queryable units.</li>
              <li>Retrieve summaries for relevance, expand for precision.</li>
              <li>Let newer evidence override stale summaries.</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">Separation of concerns</h3>
            <ul className="space-y-2 text-sm text-muted list-disc pl-5">
              <li>Fresh context is for immediate reasoning.</li>
              <li>Compacted history is for navigation and resumability.</li>
              <li>Expansion is for exact facts and causal detail.</li>
              <li>Long-term memory stores distilled facts, not every turn.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Key takeaways</h2>
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
