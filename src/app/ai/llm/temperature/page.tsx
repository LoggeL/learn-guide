import { TopicLayout } from '@/components/layout/TopicLayout'
import { TemperatureDemo } from '@/components/interactive'

export const metadata = {
  title: 'Temperature | Learn AI',
  description: 'How temperature controls randomness and creativity in LLM generations',
}

export default function TemperaturePage() {
  return (
    <TopicLayout
      title="Temperature"
      description="Understanding how a single parameter controls the balance between predictable logic and creative randomness in AI outputs."
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'LLM', href: '/' },
        { label: 'Temperature' },
      ]}
      prevTopic={{ label: 'Context Rot', href: '/ai/llm/context-rot' }}
    >
      {/* What is Temperature */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">What is Temperature?</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed">
            In LLMs, <span className="text-primary font-semibold">Temperature</span> is a hyperparameter
            that scales the "logits" (raw scores) of the next token predictions before they are
            converted into probabilities. It essentially controls how much the model
            favors the most likely options versus exploring less likely ones.
          </p>
          <div className="mt-4 p-4 bg-surface border border-border rounded-lg grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-text font-bold mb-1">Low Temperature</h3>
              <p className="text-xs text-muted">Focuses on the top results. Reliable, consistent, and factual. Great for code, math, and structured data.</p>
            </div>
            <div>
              <h3 className="text-text font-bold mb-1">High Temperature</h3>
              <p className="text-xs text-muted">Spreads probability to more tokens. Diverse, creative, and surprising. Great for stories, brainstorming, and poetry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Interactive Distribution</h2>
        <p className="text-muted mb-6">
          Adjust the temperature slider to see how it reshapes the probability distribution
          for the next token. Watch how "The" (the most likely choice) dominates at low
          temperatures and loses its lead as the temperature rises.
        </p>
        <TemperatureDemo />
      </section>

      {/* The Softmax Connection */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">How it Works Mathematically</h2>
        <div className="space-y-4">
          <p className="text-muted text-sm leading-relaxed">
            The model generates a score $z_i$ for every possible token. To get probabilities, we use
            the **Softmax** function, modified by temperature $T$:
          </p>
          <div className="bg-background border border-border rounded-lg p-6 flex justify-center">
            <code className="text-primary text-lg font-mono">
              P(x_i) = exp(z_i / T) / Σ exp(z_j / T)
            </code>
          </div>
          <div className="grid gap-3">
            <div className="p-4 bg-surface border border-border rounded-lg">
              <p className="text-muted text-sm">
                <span className="text-primary font-bold">When T is low (e.g., 0.1):</span> The differences between
                scores are magnified. The highest score becomes much larger than others after the division, 
                forcing the probability toward 1.0 for the winner.
              </p>
            </div>
            <div className="p-4 bg-surface border border-border rounded-lg">
              <p className="text-muted text-sm">
                <span className="text-primary font-bold">When T is high (e.g., 1.5):</span> The differences between
                scores are minimized. Dividing by a large number makes all scores closer to zero, resulting 
                in a flatter, more uniform distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to use which */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Practical Guidelines</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[10px] tracking-widest">
                <th className="py-3 px-4">Use Case</th>
                <th className="py-3 px-4">Temperature</th>
                <th className="py-3 px-4">Why?</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                <td className="py-3 px-4 text-text font-medium">Coding & Math</td>
                <td className="py-3 px-4 text-primary font-mono">0.0 - 0.2</td>
                <td className="py-3 px-4 italic">Errors in logic are costly; you want the most likely correct path.</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                <td className="py-3 px-4 text-text font-medium">Fact Retrieval</td>
                <td className="py-3 px-4 text-primary font-mono">0.1 - 0.4</td>
                <td className="py-3 px-4 italic">Reduces "hallucinations" by sticking to the most probable data points.</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                <td className="py-3 px-4 text-text font-medium">General Chat</td>
                <td className="py-3 px-4 text-primary font-mono">0.7 - 0.8</td>
                <td className="py-3 px-4 italic">The "sweet spot" for most models to sound natural and helpful.</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                <td className="py-3 px-4 text-text font-medium">Creative Writing</td>
                <td className="py-3 px-4 text-primary font-mono">1.0 - 1.2</td>
                <td className="py-3 px-4 italic">Encourages the model to use more interesting, varied vocabulary.</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                <td className="py-3 px-4 text-text font-medium">Brainstorming</td>
                <td className="py-3 px-4 text-primary font-mono">1.2 - 1.5</td>
                <td className="py-3 px-4 italic">Generates wild, unconventional ideas that might spark inspiration.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Key Takeaways</h2>
        <div className="p-6 bg-primary/5 border border-primary/30 rounded-lg">
          <ul className="space-y-2 text-text">
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              Temperature 0 is deterministic ("Greedy Search")
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              Higher temperature increases variety and creativity but decreases coherence
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              Too high temperature ( &gt; 1.5) often results in gibberish
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              Always match your temperature to the task's requirement for precision vs. creativity
            </li>
          </ul>
        </div>
      </section>
    </TopicLayout>
  )
}
