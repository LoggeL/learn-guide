'use client'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import {
  CacheHitMissAnimation,
  CostSavingsCalculator,
  PrefixMatchingDemo,
} from '@/components/interactive'
export default function PromptCachingPage() {
  const { t } = useTranslation(),
    p = t.promptCaching
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
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-2xl text-gradient">{p.coreIdeaTitle}</h2>
        <p className="text-muted">{p.coreIdeaDesc}</p>
        <h3 className="font-semibold">{p.prefixContractTitle}</h3>
        <p className="text-muted">{p.prefixContractDesc}</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl text-gradient">{p.hitVsMissTitle}</h2>
        <p className="text-muted">{p.hitVsMissDesc}</p>
        <CacheHitMissAnimation t={p} />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl text-gradient">{p.tryPrefixTitle}</h2>
        <p className="text-muted">{p.tryPrefixDesc}</p>
        <PrefixMatchingDemo t={p} />
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{p.providerDiffTitle}</h2>
        <p className="text-muted">{p.providerDiffDesc}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [
              p.anthropicTitle,
              p.anthropicDesc,
              'https://platform.claude.com/docs/en/build-with-claude/prompt-caching',
            ],
            [
              p.openaiTitle,
              p.openaiDesc,
              'https://platform.openai.com/docs/guides/prompt-caching',
            ],
            [
              p.googleTitle,
              p.googleDesc,
              'https://ai.google.dev/gemini-api/docs/caching',
            ],
          ].map(([name, text, url]) => (
            <article key={name} className="rounded-xl border border-border p-4">
              <h3 className="font-semibold">{name}</h3>
              <p className="my-3 text-sm text-muted">{text}</p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary-light underline"
              >
                {t.vramCalc.audit.sources}
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl text-gradient">{p.costModelTitle}</h2>
        <p className="text-muted">{p.costModelDesc}</p>
        <CostSavingsCalculator t={p} />
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{p.checklistTitle}</h2>
        {[
          [p.tip1Title, p.tip1Desc],
          [p.tip2Title, p.tip2Desc],
          [p.tip3Title, p.tip3Desc],
          [p.tip4Title, p.tip4Desc],
        ].map(([name, text]) => (
          <article key={name}>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-muted text-sm">{text}</p>
          </article>
        ))}
      </section>
    </TopicLayout>
  )
}
