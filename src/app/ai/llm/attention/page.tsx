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
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">What is Attention?</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed">
            In the context of Neural Networks, <span className="text-primary font-semibold">Attention</span> is a 
            mechanism that allows a model to focus on specific parts of its input when producing an output. 
            Before attention, models processed text sequentially and often "forgot" the beginning of a long sentence 
            by the time they reached the end.
          </p>
          <div className="mt-6 p-4 bg-surface border border-border rounded-lg">
            <p className="text-text italic">
              "Attention is all you need." — The title of the 2017 paper that introduced the Transformer architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Visualization */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Interactive Attention Map</h2>
        <p className="text-muted mb-6">
          Hover over different words in the sentences below. The highlighting shows where the model is 
          "looking" to understand that specific word. Pay close attention to how pronouns like **"it"** 
          link back to the nouns they refer to.
        </p>
        <AttentionVisualizer />
      </section>

      {/* Core Concepts */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">The Three Keys: Query, Key, and Value</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-surface border border-border rounded-lg">
            <h3 className="text-primary font-bold mb-2">Query (Q)</h3>
            <p className="text-xs text-muted">"What am I looking for?" - Represents the current word seeking context.</p>
          </div>
          <div className="p-4 bg-surface border border-border rounded-lg">
            <h3 className="text-secondary font-bold mb-2">Key (K)</h3>
            <p className="text-xs text-muted">"What do I contain?" - A label for every word in the sequence to check against the query.</p>
          </div>
          <div className="p-4 bg-surface border border-border rounded-lg">
            <h3 className="text-purple-400 font-bold mb-2">Value (V)</h3>
            <p className="text-xs text-muted">"What information do I offer?" - The actual content that gets passed forward if the Query and Key match.</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-background border border-border/50 rounded-lg text-center">
          <p className="text-sm text-muted">
            The model calculates a score by multiplying <span className="text-primary">Q</span> and <span className="text-secondary">K</span>. 
            This score determines how much of <span className="text-purple-400">V</span> to keep.
          </p>
        </div>
      </section>

      {/* Why it changed everything */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Why it Changed Everything</h2>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-surface border border-border rounded-lg">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold">1</span>
            </div>
            <div>
              <h3 className="text-text font-semibold">Parallel Processing</h3>
              <p className="text-muted text-sm">Unlike older models (RNNs), Transformers can process all words in a sentence at the same time, making training much faster.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-surface border border-border rounded-lg">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <h3 className="text-text font-semibold">Long-Range Dependencies</h3>
              <p className="text-muted text-sm">Attention can link two words even if they are thousands of tokens apart, as long as they are within the same context window.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-surface border border-border rounded-lg">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <h3 className="text-text font-semibold">Dynamic Context</h3>
              <p className="text-muted text-sm">The model doesn't just look at words; it learns which words are important *for each other* based on the specific sentence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Key Takeaways</h2>
        <div className="p-6 bg-primary/5 border border-primary/30 rounded-lg">
          <ul className="space-y-2 text-text">
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              Self-Attention allows models to relate different positions of a single sequence
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              It solves the "vanishing gradient" problem of older sequential models
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              Query, Key, and Value work like a retrieval system (Database query)
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              Attention is the "engine" inside the Transformer architecture
            </li>
          </ul>
        </div>
      </section>
    </TopicLayout>
  )
}
