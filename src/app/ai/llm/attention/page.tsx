import { TopicLayout } from '@/components/layout/TopicLayout'
import { AttentionVisualizer } from '@/components/interactive'

export const metadata = {
  title: 'Attention Mechanism | Learn AI',
  description: 'How Transformers use attention to weigh the importance of different words in context',
}

export default function AttentionPage() {
  return (
    <TopicLayout
      title="Attention Mechanism"
      description="The breakthrough that enabled modern LLMs. Learn how models focus on specific parts of an input to understand meaning and context."
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'LLM', href: '/' },
        { label: 'Attention Mechanism' },
      ]}
      prevTopic={{ label: 'Temperature', href: '/ai/llm/temperature' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">What is Attention?</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            In the context of Neural Networks, <span className="text-primary-light font-semibold">Attention</span> is a 
            mechanism that allows a model to focus on specific parts of its input when producing an output. 
            Before attention, models processed text sequentially and often "forgot" the beginning of a long sentence 
            by the time they reached the end.
          </p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-lg text-text italic font-heading">
              "Attention is all you need."
            </p>
            <p className="text-sm text-muted mt-2">
              — The title of the 2017 paper that introduced the Transformer architecture
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Visualization */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">👁️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">Interactive Attention Map</h2>
            <p className="text-sm text-muted">Hover to explore attention patterns</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">
          Hover over different words in the sentences below. The highlighting shows where the model is 
          "looking" to understand that specific word. Pay close attention to how pronouns like <strong className="text-primary-light">"it"</strong> link back to the nouns they refer to.
        </p>
        <AttentionVisualizer />
      </section>

      {/* Core Concepts */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The Three Keys: Query, Key, and Value</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-purple-400">Q</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">Query</h3>
            <p className="text-sm text-muted">"What am I looking for?" - Represents the current word seeking context.</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-cyan-400">K</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">Key</h3>
            <p className="text-sm text-muted">"What do I contain?" - A label for every word in the sequence to check against the query.</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-emerald-400">V</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">Value</h3>
            <p className="text-sm text-muted">"What information do I offer?" - The actual content that gets passed forward if the Query and Key match.</p>
          </div>
        </div>
        <div className="mt-6 p-5 rounded-xl bg-surface border border-border text-center">
          <p className="text-muted">
            The model calculates a score by multiplying <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-semibold">Q</span> and <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold">K</span>. 
            This score determines how much of <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">V</span> to keep.
          </p>
        </div>
      </section>

      {/* Why it changed everything */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Why it Changed Everything</h2>
        <div className="space-y-4">
          {[
            { num: 1, title: 'Parallel Processing', desc: 'Unlike older models (RNNs), Transformers can process all words in a sentence at the same time, making training much faster.', color: 'purple' },
            { num: 2, title: 'Long-Range Dependencies', desc: 'Attention can link two words even if they are thousands of tokens apart, as long as they are within the same context window.', color: 'cyan' },
            { num: 3, title: 'Dynamic Context', desc: "The model doesn't just look at words; it learns which words are important *for each other* based on the specific sentence.", color: 'emerald' },
          ].map((item) => (
            <div key={item.num} className={`flex gap-5 p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
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

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Key Takeaways</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              'Self-Attention allows models to relate different positions of a single sequence',
              'It solves the "vanishing gradient" problem of older sequential models',
              'Query, Key, and Value work like a retrieval system (Database query)',
              'Attention is the "engine" inside the Transformer architecture',
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
