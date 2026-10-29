'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { CostSavingsCalculator } from '@/components/interactive/CostSavingsCalculator'
import { PromptCachePrefixDemo } from '@/components/interactive/PromptCachePrefixDemo'
import { PromptCacheTimelineDemo } from '@/components/interactive/PromptCacheTimelineDemo'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES: [string, string][] = [
  ['Anthropic: Prompt caching', 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching'],
  ['OpenAI: Prompt caching', 'https://developers.openai.com/api/docs/guides/prompt-caching'],
  ['Google: Gemini API context caching', 'https://ai.google.dev/gemini-api/docs/caching'],
  ['Google: Gemini API pricing', 'https://ai.google.dev/gemini-api/docs/pricing'],
  ['vLLM: Automatic prefix caching (design)', 'https://docs.vllm.ai/en/latest/design/prefix_caching.html'],
  ['Kwon et al. (2023): PagedAttention', 'https://arxiv.org/abs/2309.06180'],
  ['Zheng et al. (2024): SGLang — RadixAttention', 'https://arxiv.org/abs/2312.07104'],
]

export default function PromptCachingPage() {
  const { t, locale } = useTranslation()
  const p = t.promptCaching

  const providers = [
    {
      name: p.anthropicTitle,
      desc: p.anthropicDesc,
      url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching',
    },
    {
      name: p.openaiTitle,
      desc: p.openaiDesc,
      url: 'https://developers.openai.com/api/docs/guides/prompt-caching',
    },
    {
      name: p.googleTitle,
      desc: p.googleDesc,
      url: 'https://ai.google.dev/gemini-api/docs/caching',
    },
  ]

  return (
    <TopicLayout
      topicId="prompt-caching"
      title={p.title}
      description={p.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: p.title },
      ]}
    >
      {/* Core idea */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{p.coreIdeaTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{p.coreIdeaDesc}</p>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{p.kvCacheConnectionTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{p.kvCacheConnectionDesc}</p>
            <Link
              href={`/${locale}/ai/llm-inference/kv-cache`}
              className="mt-3 inline-block text-sm text-primary-light underline underline-offset-2"
            >
              {p.kvCacheConnectionLink}
            </Link>
          </div>
          <div className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{p.whatSavesTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{p.whatSavesDesc}</p>
          </div>
        </div>
      </section>

      {/* Matching */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{p.matchingTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{p.matchingDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
            <h3 className="text-lg font-bold text-purple-400 mb-2">{p.matchingBlocksTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{p.matchingBlocksDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">{p.matchingMinTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{p.matchingMinDesc}</p>
          </div>
        </div>
      </section>

      {/* Prefix demo */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-text mb-2">{p.prefixDemoTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{p.prefixDemoDesc}</p>
        <PromptCachePrefixDemo />
      </section>

      {/* Timeline demo */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-text mb-2">{p.timelineTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{p.timelineDesc}</p>
        <PromptCacheTimelineDemo />
      </section>

      {/* Providers */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{p.providerDiffTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{p.providerDiffDesc}</p>
        <div className="grid gap-4 lg:grid-cols-3">
          {providers.map((provider) => (
            <article key={provider.name} className="flex flex-col rounded-xl border border-border bg-background/50 p-5">
              <h3 className="font-bold text-text">{provider.name}</h3>
              <p className="my-3 flex-1 text-sm leading-relaxed text-muted">{provider.desc}</p>
              <a
                href={provider.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary-light underline underline-offset-2"
              >
                {p.providerDocs}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Cost model */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-text mb-2">{p.costModelTitle}</h2>
        <p className="text-muted mb-6 leading-relaxed">{p.costModelDesc}</p>
        <CostSavingsCalculator t={p} />
      </section>

      {/* Self-hosted */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{p.selfHostedTitle}</h2>
        <p className="text-muted leading-relaxed">{p.selfHostedDesc}</p>
      </section>

      {/* Checklist */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{p.checklistTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [p.tip1Title, p.tip1Desc],
            [p.tip2Title, p.tip2Desc],
            [p.tip3Title, p.tip3Desc],
            [p.tip4Title, p.tip4Desc],
          ].map(([title, desc], i) => (
            <article key={title} className="rounded-xl border border-border bg-surface/50 p-5">
              <h3 className="mb-2 font-semibold text-text">
                <span className="mr-2 text-primary-light">{i + 1}.</span>
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{p.takeawaysTitle}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[p.takeaway1, p.takeaway2, p.takeaway3, p.takeaway4].map((item, i) => (
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

      {/* Sources */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-xl font-bold font-heading text-text mb-4">{p.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map(([name, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noreferrer" className="text-cyan-300 underline underline-offset-2">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
