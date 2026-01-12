'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { TemperatureDemo } from '@/components/interactive'
import { Latex, LatexBlock } from '@/components/ui/Latex'

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
            The model generates a score <Latex>{'z_i'}</Latex> for every possible token. To get probabilities, we use
            the <strong className="text-text">Softmax</strong> function, modified by temperature <Latex>{'T'}</Latex>:
          </p>
          
          <div className="bg-background border border-border rounded-xl p-8 flex justify-center overflow-x-auto">
            <div className="text-primary text-xl">
              <LatexBlock>
                {'P(x_i) = \\frac{e^{z_i / T}}{\\sum_{j} e^{z_j / T}}'}
              </LatexBlock>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-cyan-400 font-bold">When T → 0</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Low</span>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-3">
                Dividing by a small <Latex>{'T'}</Latex> amplifies differences between scores. 
                The highest logit dominates exponentially.
              </p>
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <LatexBlock>{'\\lim_{T \\to 0} P(x_{\\text{max}}) = 1'}</LatexBlock>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-400 font-bold">When T → ∞</span>
                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">High</span>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-3">
                Dividing by a large <Latex>{'T'}</Latex> compresses all scores toward zero,
                making them nearly equal after exponentiation.
              </p>
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <LatexBlock>{'\\lim_{T \\to \\infty} P(x_i) = \\frac{1}{N}'}</LatexBlock>
              </div>
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
              <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                <td className="py-4 px-6 text-text font-medium">Coding & Math</td>
                <td className="py-4 px-6"><span className="font-mono px-2 py-1 rounded bg-cyan-500/10 text-cyan-400">0.0 - 0.2</span></td>
                <td className="py-4 px-6 italic">Errors in logic are costly; you want the most likely correct path.</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                <td className="py-4 px-6 text-text font-medium">Fact Retrieval</td>
                <td className="py-4 px-6"><span className="font-mono px-2 py-1 rounded bg-blue-500/10 text-blue-400">0.1 - 0.4</span></td>
                <td className="py-4 px-6 italic">Reduces "hallucinations" by sticking to the most probable data points.</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                <td className="py-4 px-6 text-text font-medium">General Chat</td>
                <td className="py-4 px-6"><span className="font-mono px-2 py-1 rounded bg-purple-500/10 text-purple-400">0.7 - 0.8</span></td>
                <td className="py-4 px-6 italic">The "sweet spot" for most models to sound natural and helpful.</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                <td className="py-4 px-6 text-text font-medium">Creative Writing</td>
                <td className="py-4 px-6"><span className="font-mono px-2 py-1 rounded bg-orange-500/10 text-orange-400">1.0 - 1.2</span></td>
                <td className="py-4 px-6 italic">Encourages the model to use more interesting, varied vocabulary.</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                <td className="py-4 px-6 text-text font-medium">Brainstorming</td>
                <td className="py-4 px-6"><span className="font-mono px-2 py-1 rounded bg-red-500/10 text-red-400">1.2 - 1.5</span></td>
                <td className="py-4 px-6 italic">Generates wild, unconventional ideas that might spark inspiration.</td>
              </tr>
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
              'Temperature 0 is deterministic ("Greedy Search") — always picks the top token',
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
