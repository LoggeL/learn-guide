import { TopicLayout } from '@/components/layout/TopicLayout'
import { ContextRotSimulator } from '@/components/interactive'

export const metadata = {
  title: 'Context Rot | Learn AI',
  description: 'Understanding how LLM agents lose track of instructions over long conversations',
}

export default function ContextRotPage() {
  return (
    <TopicLayout
      title="Context Rot"
      description="How LLM agents gradually 'forget' their instructions as conversations grow longer, and why it matters for agent reliability."
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'LLM', href: '/' },
        { label: 'Context Rot' },
      ]}
    >
      {/* What is Context Rot */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">What is Context Rot?</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed">
            <span className="text-primary font-semibold">Context rot</span> refers to the gradual
            degradation of an LLM's adherence to its initial instructions as a conversation
            grows longer. It's a critical failure mode in LLM-based agents.
          </p>
          <div className="mt-4 p-4 bg-surface border border-border rounded-lg">
            <p className="text-text">
              Imagine telling someone: <em>"Always respond in French."</em> They follow this
              perfectly at first. But after hours of conversation, they start slipping back
              into English. That's context rot.
            </p>
          </div>
        </div>
      </section>

      {/* Why it happens */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Why Does It Happen?</h2>
        <div className="grid gap-4">
          <div className="p-4 bg-surface border border-border rounded-lg">
            <h3 className="text-primary font-semibold mb-2">1. Finite Context Windows</h3>
            <p className="text-muted text-sm">
              LLMs can only "see" a limited number of tokens at once (e.g., 4K, 8K, 128K).
              As conversations grow, earlier messages—including system prompts—get pushed
              toward the edge or truncated entirely.
            </p>
          </div>
          <div className="p-4 bg-surface border border-border rounded-lg">
            <h3 className="text-primary font-semibold mb-2">2. Attention Dilution</h3>
            <p className="text-muted text-sm">
              Even within the context window, the model's attention mechanism spreads across
              all tokens. More content means each token (including your instructions) gets
              proportionally less attention.
            </p>
          </div>
          <div className="p-4 bg-surface border border-border rounded-lg">
            <h3 className="text-primary font-semibold mb-2">3. Recency Bias</h3>
            <p className="text-muted text-sm">
              Transformers tend to weight recent tokens more heavily. Instructions at the
              start of a conversation naturally become less influential over time.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Try It Yourself</h2>
        <p className="text-muted mb-6">
          Experience context rot firsthand. Set an instruction, then watch how it visually
          "fades" as the conversation grows. The purple system message will dim as the
          context fills up.
        </p>
        <ContextRotSimulator />
      </section>

      {/* Mitigation strategies */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Mitigation Strategies</h2>
        <div className="space-y-3">
          {[
            {
              title: 'Periodic Instruction Reinforcement',
              desc: 'Re-inject system prompts at regular intervals throughout the conversation.',
            },
            {
              title: 'Conversation Summarization',
              desc: 'Periodically summarize older messages to compress context while preserving key information.',
            },
            {
              title: 'Hierarchical Memory',
              desc: 'Use external memory systems to store and retrieve relevant context on-demand.',
            },
            {
              title: 'Instruction Anchoring',
              desc: 'Place critical instructions at both the beginning AND end of the context.',
            },
            {
              title: 'Shorter Task Chains',
              desc: 'Break long tasks into shorter, independent sub-tasks with fresh contexts.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-surface border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <span className="text-primary font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-text font-semibold">{item.title}</h3>
                <p className="text-muted text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Key Takeaways</h2>
        <div className="p-6 bg-primary/5 border border-primary/30 rounded-lg">
          <ul className="space-y-2 text-text">
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              Context rot is inevitable in long conversations with LLMs
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              It's caused by finite windows, attention dilution, and recency bias
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              Design your agents with context management strategies from the start
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              Longer context windows help but don't eliminate the problem
            </li>
          </ul>
        </div>
      </section>
    </TopicLayout>
  )
}
