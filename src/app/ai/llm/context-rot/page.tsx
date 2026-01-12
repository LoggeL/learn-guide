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
      nextTopic={{ label: 'Temperature', href: '/ai/llm/temperature' }}
    >
      {/* What is Context Rot */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">What is Context Rot?</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            <span className="text-primary-light font-semibold">Context rot</span> refers to the gradual
            degradation of an LLM's adherence to its initial instructions as a conversation
            grows longer. It's a critical failure mode in LLM-based agents.
          </p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-text text-lg leading-relaxed">
              Imagine telling someone: <em className="text-purple-300">"Always respond in French."</em> They follow this
              perfectly at first. But after hours of conversation, they start slipping back
              into English. That's context rot.
            </p>
          </div>
        </div>
      </section>

      {/* Why it happens */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Why Does It Happen?</h2>
        <div className="grid gap-4">
          {[
            {
              num: 1,
              title: 'Finite Context Windows',
              desc: 'LLMs can only "see" a limited number of tokens at once (e.g., 4K, 8K, 128K). As conversations grow, earlier messages—including system prompts—get pushed toward the edge or truncated entirely.',
              color: 'purple',
            },
            {
              num: 2,
              title: 'Attention Dilution',
              desc: "Even within the context window, the model's attention mechanism spreads across all tokens. More content means each token (including your instructions) gets proportionally less attention.",
              color: 'cyan',
            },
            {
              num: 3,
              title: 'Recency Bias',
              desc: 'Transformers tend to weight recent tokens more heavily. Instructions at the start of a conversation naturally become less influential over time.',
              color: 'orange',
            },
          ].map((item) => (
            <div
              key={item.num}
              className={`flex gap-5 p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20 hover:border-${item.color}-500/40 transition-colors`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center shrink-0`}>
                <span className={`text-xl font-bold text-${item.color}-400`}>{item.num}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🧪</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">Try It Yourself</h2>
            <p className="text-sm text-muted">Experience context rot firsthand</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">
          Set an instruction, then watch how it visually <strong className="text-primary-light">"fades"</strong> as the conversation grows. 
          The purple system message will dim as the context fills up—this simulates how the model's attention 
          to your original instruction weakens over time.
        </p>
        <ContextRotSimulator />
      </section>

      {/* Mitigation strategies */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Mitigation Strategies</h2>
        <div className="space-y-4">
          {[
            {
              title: 'Periodic Instruction Reinforcement',
              desc: 'Re-inject system prompts at regular intervals throughout the conversation.',
              icon: '🔄',
            },
            {
              title: 'Conversation Summarization',
              desc: 'Periodically summarize older messages to compress context while preserving key information.',
              icon: '📝',
            },
            {
              title: 'Hierarchical Memory',
              desc: 'Use external memory systems to store and retrieve relevant context on-demand.',
              icon: '🗄️',
            },
            {
              title: 'Instruction Anchoring',
              desc: 'Place critical instructions at both the beginning AND end of the context.',
              icon: '⚓',
            },
            {
              title: 'Shorter Task Chains',
              desc: 'Break long tasks into shorter, independent sub-tasks with fresh contexts.',
              icon: '🔗',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-5 p-5 rounded-xl bg-surface border border-border hover:border-primary/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                <span className="text-xl">{item.icon}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Key Takeaways</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              'Context rot is inevitable in long conversations with LLMs',
              "It's caused by finite windows, attention dilution, and recency bias",
              'Design your agents with context management strategies from the start',
              "Longer context windows help but don't eliminate the problem",
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
