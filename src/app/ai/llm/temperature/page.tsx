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
      nextTopic={{ label: 'Attention', href: '/ai/llm/attention' }}
    >
      {/* What is Temperature */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">What is Temperature?</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            In LLMs, <span className="text-primary-light font-semibold">Temperature</span> is a hyperparameter
            that scales the "logits" (raw scores) of the next token predictions before they are
            converted into probabilities. It essentially controls how much the model
            favors the most likely options versus exploring less likely ones.
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
              <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">Low Temperature</h3>
              <p className="text-sm text-muted">Focuses on the top results. Reliable, consistent, and factual. Great for code, math, and structured data.</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
              <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">High Temperature</h3>
              <p className="text-sm text-muted">Spreads probability to more tokens. Diverse, creative, and surprising. Great for stories, brainstorming, and poetry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🎛️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">Interactive Distribution</h2>
            <p className="text-sm text-muted">Adjust the temperature to see its effect</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">
          Adjust the temperature slider to see how it reshapes the probability distribution
          for the next token. Watch how "the" (the most likely choice) dominates at low
          temperatures and loses its lead as the temperature rises.
        </p>
        <TemperatureDemo />
      </section>

      {/* The Softmax Connection */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">How it Works Mathematically</h2>
        <div className="space-y-6">
          <p className="text-muted leading-relaxed">
            The model generates a score <code className="px-2 py-0.5 bg-surface-elevated rounded text-primary-light">z_i</code> for every possible token. To get probabilities, we use
            the <strong className="text-text">Softmax</strong> function, modified by temperature <code className="px-2 py-0.5 bg-surface-elevated rounded text-primary-light">T</code>:
          </p>
          <div className="bg-background border border-border rounded-xl p-8 flex justify-center">
            <code className="text-primary text-xl font-mono">
              P(x_i) = exp(z_i / T) / Σ exp(z_j / T)
            </code>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
              <p className="text-muted text-sm leading-relaxed">
                <span className="text-purple-400 font-bold block mb-2">When T is low (e.g., 0.1):</span>
                The differences between scores are magnified. The highest score becomes much larger than others after the division, 
                forcing the probability toward 1.0 for the winner.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
              <p className="text-muted text-sm leading-relaxed">
                <span className="text-orange-400 font-bold block mb-2">When T is high (e.g., 1.5):</span>
                The differences between scores are minimized. Dividing by a large number makes all scores closer to zero, resulting 
                in a flatter, more uniform distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to use which */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Practical Guidelines</h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-surface-elevated border-b border-border text-muted uppercase text-[10px] tracking-widest">
                <th className="py-4 px-6">Use Case</th>
                <th className="py-4 px-6">Temperature</th>
                <th className="py-4 px-6">Why?</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              {[
                { case: 'Coding & Math', temp: '0.0 - 0.2', why: 'Errors in logic are costly; you want the most likely correct path.', color: 'cyan' },
                { case: 'Fact Retrieval', temp: '0.1 - 0.4', why: 'Reduces "hallucinations" by sticking to the most probable data points.', color: 'blue' },
                { case: 'General Chat', temp: '0.7 - 0.8', why: 'The "sweet spot" for most models to sound natural and helpful.', color: 'purple' },
                { case: 'Creative Writing', temp: '1.0 - 1.2', why: 'Encourages the model to use more interesting, varied vocabulary.', color: 'orange' },
                { case: 'Brainstorming', temp: '1.2 - 1.5', why: 'Generates wild, unconventional ideas that might spark inspiration.', color: 'red' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                  <td className="py-4 px-6 text-text font-medium">{row.case}</td>
                  <td className="py-4 px-6">
                    <span className={`font-mono px-2 py-1 rounded bg-${row.color}-500/10 text-${row.color}-400`}>
                      {row.temp}
                    </span>
                  </td>
                  <td className="py-4 px-6 italic">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Key Takeaways</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              'Temperature 0 is deterministic ("Greedy Search")',
              'Higher temperature increases variety and creativity but decreases coherence',
              'Too high temperature (> 1.5) often results in gibberish',
              'Always match your temperature to the task\'s requirement for precision vs. creativity',
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
