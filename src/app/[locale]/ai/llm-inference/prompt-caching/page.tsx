'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { CacheHitMissAnimation, PrefixMatchingDemo, CostSavingsCalculator, CacheTTLVisualization } from '@/components/interactive'

export default function PromptCachingPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="prompt-caching"
      title={t.promptCaching.title}
      description={t.promptCaching.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: t.promptCaching.title },
      ]}
      prevTopic={{ label: t.topicNames['kv-cache'], href: '/ai/llm-inference/kv-cache' }}
      nextTopic={{ label: t.topicNames['batching'], href: '/ai/llm-inference/batching' }}
    >
      {/* What is Prompt Caching */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptCaching.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.promptCaching.whatIsDesc}
          </p>
          <div className="mt-6 p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.promptCaching.kvCacheConnection}</h3>
            <p className="text-sm text-muted">{t.promptCaching.kvCacheConnectionDesc}</p>
          </div>
        </div>
      </section>

      {/* Cache Hit vs Miss — Interactive Animation */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptCaching.visualTitle}</h2>
        <p className="text-muted mb-6">{t.promptCaching.visualDesc}</p>
        <CacheHitMissAnimation t={t.promptCaching} />
      </section>

      {/* Interactive Prefix Matching Demo */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <PrefixMatchingDemo t={t.promptCaching} />
      </section>

      {/* How Providers Implement It */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptCaching.howItWorks}</h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">{t.promptCaching.howItWorksDesc}</p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-violet-500/5 border border-purple-500/20">
              <div className="text-2xl mb-2">🟣</div>
              <h3 className="text-sm font-bold text-purple-400 mb-1">{t.promptCaching.anthropicTitle}</h3>
              <p className="text-xs text-muted">{t.promptCaching.anthropicDesc}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20">
              <div className="text-2xl mb-2">🟢</div>
              <h3 className="text-sm font-bold text-green-400 mb-1">{t.promptCaching.openaiTitle}</h3>
              <p className="text-xs text-muted">{t.promptCaching.openaiDesc}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20">
              <div className="text-2xl mb-2">🔵</div>
              <h3 className="text-sm font-bold text-blue-400 mb-1">{t.promptCaching.googleTitle}</h3>
              <p className="text-xs text-muted">{t.promptCaching.googleDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* When to use */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptCaching.whenToUse}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-3">{t.promptCaching.idealFor}</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✓</span>{t.promptCaching.ideal1}</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✓</span>{t.promptCaching.ideal2}</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✓</span>{t.promptCaching.ideal3}</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✓</span>{t.promptCaching.ideal4}</li>
            </ul>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-3">{t.promptCaching.notIdealFor}</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">✗</span>{t.promptCaching.notIdeal1}</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">✗</span>{t.promptCaching.notIdeal2}</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">✗</span>{t.promptCaching.notIdeal3}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cost & Performance — Interactive Calculator */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptCaching.costTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.promptCaching.costDesc}</p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">90%</div>
            <p className="text-sm text-muted">{t.promptCaching.costSaving}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">~3×</div>
            <p className="text-sm text-muted">{t.promptCaching.speedBoost}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-violet-500/5 border border-purple-500/20 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">5 min</div>
            <p className="text-sm text-muted">{t.promptCaching.cacheTTL}</p>
          </div>
        </div>

        <CostSavingsCalculator t={t.promptCaching} />

        <div className="mt-8 p-4 bg-background border border-border rounded-xl">
          <h3 className="text-sm font-bold text-text mb-3">{t.promptCaching.pricingComparison}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted border-b border-border">
                  <th className="text-left py-2 pr-4">{t.promptCaching.tableProvider}</th>
                  <th className="text-left py-2 pr-4">{t.promptCaching.tableBase}</th>
                  <th className="text-left py-2 pr-4">{t.promptCaching.tableCached}</th>
                  <th className="text-left py-2">{t.promptCaching.tableSavings}</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 text-purple-400">Anthropic (Claude)</td>
                  <td className="py-2 pr-4">$3.00 / MTok</td>
                  <td className="py-2 pr-4 text-green-400">$0.30 / MTok</td>
                  <td className="py-2 text-green-400">90%</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 text-green-400">OpenAI (GPT-4o)</td>
                  <td className="py-2 pr-4">$2.50 / MTok</td>
                  <td className="py-2 pr-4 text-green-400">$1.25 / MTok</td>
                  <td className="py-2 text-green-400">50%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-blue-400">Google (Gemini)</td>
                  <td className="py-2 pr-4">$1.25 / MTok</td>
                  <td className="py-2 pr-4 text-green-400">$0.3125 / MTok</td>
                  <td className="py-2 text-green-400">75%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-3">{t.promptCaching.pricingNote}</p>
        </div>
      </section>

      {/* Cache TTL Visualization */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptCaching.cacheTTL}</h2>
        <CacheTTLVisualization t={t.promptCaching} />
      </section>

      {/* Code Example */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptCaching.codeTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.promptCaching.codeDesc}</p>

        <div className="bg-background border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-surface/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-xs text-muted ml-2">anthropic_prompt_caching.py</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="text-muted">{`import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an expert legal assistant. Here is the "
                    "complete contract document you must analyze...\\n\\n"
                    "[... 15,000 tokens of contract text ...]",
            "cache_control": {"type": "ephemeral"}  # ← Cache this!
        }
    ],
    messages=[
        {"role": "user", "content": "Summarize the key obligations."}
    ]
)

# Check cache performance in the response
usage = response.usage
print(f"Input tokens:        {usage.input_tokens}")
print(f"Cache creation:      {usage.cache_creation_input_tokens}")
print(f"Cache read (hits):   {usage.cache_read_input_tokens}")
# First request:  cache_creation = 15000, cache_read = 0
# Second request: cache_creation = 0,     cache_read = 15000  ← 90% cheaper!`}</code>
          </pre>
        </div>
      </section>

      {/* Implementation Tips */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptCaching.tipsTitle}</h2>
        <div className="space-y-4">
          {[
            { emoji: '📌', title: t.promptCaching.tip1Title, desc: t.promptCaching.tip1Desc },
            { emoji: '🔢', title: t.promptCaching.tip2Title, desc: t.promptCaching.tip2Desc },
            { emoji: '⏱️', title: t.promptCaching.tip3Title, desc: t.promptCaching.tip3Desc },
            { emoji: '📏', title: t.promptCaching.tip4Title, desc: t.promptCaching.tip4Desc },
          ].map((tip, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-surface/50 to-transparent border border-border/50">
              <span className="text-2xl">{tip.emoji}</span>
              <div>
                <h3 className="text-sm font-bold text-text mb-1">{tip.title}</h3>
                <p className="text-sm text-muted">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.promptCaching.takeawaysTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            t.promptCaching.takeaway1,
            t.promptCaching.takeaway2,
            t.promptCaching.takeaway3,
            t.promptCaching.takeaway4,
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <span className="text-primary font-bold mt-0.5">✦</span>
              <p className="text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </TopicLayout>
  )
}
