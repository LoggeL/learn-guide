'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { CacheHitMissAnimation, CostSavingsCalculator, PrefixMatchingDemo } from '@/components/interactive'

const promptOrder = [
  {
    label: 'Stable prefix',
    content: 'System instructions, tool schemas, long documents, examples, policy text, or product context that stays identical across calls.',
  },
  {
    label: 'Cache boundary',
    content: 'The provider can reuse the computed attention state for this shared prefix instead of pre-filling it again.',
  },
  {
    label: 'Changing suffix',
    content: 'The user question, latest turn, small retrieved snippets, or task-specific details still run normally.',
  },
]

const goodBadExamples = [
  {
    label: 'Good',
    code: `system: You are a support agent...
tools: [stable tool schemas]
context: 40k token policy manual
user: "Can I refund this order?"`,
    note: 'The expensive part comes first and stays byte-for-byte stable.',
  },
  {
    label: 'Bad',
    code: `system: Request id: 7f3a...
timestamp: 2026-05-25T14:03:11Z
context: 40k token policy manual
user: "Can I refund this order?"`,
    note: 'A changing value before the long context breaks the shared prefix.',
  },
]

const providers = [
  {
    name: 'Anthropic',
    behavior: 'Explicit or automatic cache control. Useful when you want to choose exactly where the reusable prefix ends.',
    watch: 'Check cache creation and cache read token fields. Default ephemeral caches are short-lived unless a longer duration is selected.',
  },
  {
    name: 'OpenAI',
    behavior: 'Automatic prompt-prefix caching on eligible long prompts. Cache hits appear as cached token usage.',
    watch: 'Keep message order, tool definitions, images, and structured output schemas stable. Short prompts may show zero cached tokens.',
  },
  {
    name: 'Google Gemini',
    behavior: 'Explicit cached content objects for reusing large context across requests.',
    watch: 'Treat the cache like a managed resource: choose TTL, reference it by name, and update or delete it deliberately.',
  },
]

const implementationChecklist = [
  'Put stable, high-token content before volatile request data.',
  'Keep tool schemas, JSON schemas, image detail settings, and system prompts versioned and deterministic.',
  'Move timestamps, request ids, user ids, tracing metadata, and random examples after the cacheable prefix.',
  'Measure cache creation tokens, cache read tokens, and latency before calling the optimization successful.',
  'Design fallbacks for cold cache, expired cache, and provider-specific minimum token thresholds.',
]

const useCases = [
  'Multi-turn agents with a stable system prompt and large tool surface.',
  'Document analysis where many questions target the same long file.',
  'Support, legal, finance, or medical workflows with large standing instructions.',
  'Code assistants that repeatedly include repository maps, style guides, or API docs.',
]

const antiPatterns = [
  'Small one-shot prompts where the prefix is below the provider threshold.',
  'Pipelines that rebuild prompts with changing metadata at the top.',
  'RAG flows where every retrieval result replaces the entire context prefix.',
  'Treating cache hits as guaranteed instead of measuring them from usage metadata.',
]

export default function PromptCachingPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      topicId="prompt-caching"
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
      <section className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            The core idea
          </p>
          <h2 className="text-3xl font-bold font-heading text-text mb-4">
            Prompt caching rewards stable prefixes.
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            Prompt caching is not memory, retrieval, or a database. It is a way for an inference provider to
            reuse the already-computed KV state for the beginning of a prompt when later requests start with
            the same tokens. The changing part still has to be processed; the win comes from not recomputing
            the repeated prefix.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {promptOrder.map((step, index) => (
            <div key={step.label} className="border border-border bg-surface/40 rounded-lg p-4">
              <div className="text-xs text-primary font-semibold mb-2">0{index + 1}</div>
              <h3 className="font-bold text-text mb-2">{step.label}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">
            The prefix is the contract
          </h2>
          <p className="text-muted leading-relaxed">
            Cacheability is mostly determined before the model sees the user&apos;s actual task. If the long,
            expensive part begins at token 500 but token 20 changes on every request, the shared prefix is
            effectively broken. Design the prompt shape first, then tune provider settings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {goodBadExamples.map((example) => (
            <div key={example.label} className="border border-border rounded-lg overflow-hidden bg-background">
              <div className="border-b border-border px-4 py-3">
                <h3 className="font-bold text-text">{example.label} prompt layout</h3>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-muted">
                <code>{example.code}</code>
              </pre>
              <p className="border-t border-border px-4 py-3 text-sm text-muted">{example.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-text">Cache hit versus cache miss</h2>
        <p className="text-muted leading-relaxed max-w-3xl">
          On a miss, the provider performs the expensive prefill for the whole prompt and may write the
          reusable prefix. On a hit, the provider reads the cached prefix and only computes the suffix.
          This changes input cost and latency, but output generation still costs what it costs.
        </p>
        <CacheHitMissAnimation t={t.promptCaching} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-text">Try the prefix rule</h2>
        <p className="text-muted leading-relaxed max-w-3xl">
          The fastest way to understand prompt caching is to edit the beginning of a prompt. Tiny changes
          near the top can destroy the cache hit; changes after the stable prefix usually preserve it.
        </p>
        <PrefixMatchingDemo t={t.promptCaching} />
      </section>

      <section className="space-y-5">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">Provider behavior differs</h2>
          <p className="text-muted leading-relaxed">
            Do not build your architecture around a single marketing number. Providers differ in how caches
            are created, how long they live, which inputs count, and how usage is reported. The portable
            skill is prompt discipline: stable prefix first, volatile suffix last, measure every deployment.
          </p>
        </div>

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-muted">
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Provider</th>
                <th className="text-left py-3 px-4 font-semibold">How to think about it</th>
                <th className="text-left py-3 px-4 font-semibold">What to verify</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.name} className="border-b border-border/60 last:border-b-0">
                  <td className="py-4 px-4 font-semibold text-text align-top">{provider.name}</td>
                  <td className="py-4 px-4 text-muted align-top">{provider.behavior}</td>
                  <td className="py-4 px-4 text-muted align-top">{provider.watch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold font-heading text-text mb-4">Use it when</h2>
          <ul className="space-y-3">
            {useCases.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary flex-none" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading text-text mb-4">Avoid expecting wins when</h2>
          <ul className="space-y-3">
            {antiPatterns.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="mt-1 h-2 w-2 rounded-full bg-orange-400 flex-none" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-5">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">Cost model</h2>
          <p className="text-muted leading-relaxed">
            A useful rule of thumb: cache writes are often more expensive than normal input, cache reads are
            cheaper, and the break-even point depends on how often the same prefix is reused before expiry.
            Use the calculator as an intuition builder, then confirm with real usage fields from your API
            responses.
          </p>
        </div>
        <CostSavingsCalculator t={t.promptCaching} />
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-bold font-heading text-text">Implementation checklist</h2>
        <div className="border border-border rounded-lg divide-y divide-border bg-surface/30">
          {implementationChecklist.map((item, index) => (
            <div key={item} className="flex gap-4 p-4">
              <span className="text-sm font-semibold text-primary w-6 flex-none">{index + 1}</span>
              <p className="text-sm text-muted leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold font-heading text-text mb-3">Minimal implementation pattern</h2>
          <p className="text-muted leading-relaxed">
            The exact API differs by provider, but the prompt shape should look like this: stable context
            first, cache boundary around the reusable prefix, task-specific input last.
          </p>
        </div>

        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-surface/30">
            <span className="text-xs text-muted">prompt_cache_shape.py</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="text-muted">{`stable_prefix = [
    system_instructions,
    tool_schemas,
    long_reference_document,
    few_shot_examples,
]

request = {
    "cacheable_prefix": stable_prefix,
    "task": {
        "user_question": current_question,
        "small_dynamic_context": retrieved_facts,
    },
}

response = model.generate(request)

usage = response.usage
print("cache written:", usage.cache_creation_tokens)
print("cache read:", usage.cache_read_tokens)
print("normal input:", usage.input_tokens)`}</code>
          </pre>
        </div>
      </section>

      <section className="border border-primary/30 bg-primary/10 rounded-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-text mb-4">What to remember</h2>
        <p className="text-muted leading-relaxed max-w-3xl">
          Prompt caching is an inference optimization for repeated prefixes. It works best when prompt
          construction is boring and deterministic. Put the reusable mass first, keep it stable, move noisy
          data later, and trust only the measured cache-hit fields.
        </p>
      </section>
    </TopicLayout>
  )
}
