'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { LostInTheMiddleChart } from '@/components/interactive/LostInTheMiddleChart'
import { EffectiveContextChart } from '@/components/interactive/EffectiveContextChart'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = [
  { label: 'Liu et al. (2024): Lost in the Middle – How Language Models Use Long Contexts. TACL', href: 'https://arxiv.org/abs/2307.03172' },
  { label: 'Hsieh et al. (2024): RULER – What’s the Real Context Size of Your Long-Context Language Models? COLM', href: 'https://arxiv.org/abs/2404.06654' },
  { label: 'Modarressi et al. (2025): NoLiMa – Long-Context Evaluation Beyond Literal Matching. ICML', href: 'https://arxiv.org/abs/2502.05167' },
  { label: 'Hong, Troynikov, Huber (2025): Context Rot – How Increasing Input Tokens Impacts LLM Performance. Chroma', href: 'https://www.trychroma.com/research/context-rot' },
  { label: 'Anthropic (2025): Effective context engineering for AI agents', href: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents' },
]

export default function ContextRotPage() {
  const { t, locale } = useTranslation()
  const c = t.contextRot

  return (
    <TopicLayout
      topicId="context-rot"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.title },
      ]}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{c.whatTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{c.whatP1}</p>
        <p className="text-muted leading-relaxed">{c.whatP2}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{c.mechTitle}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {c.mechItems.map(item => (
            <div key={item.title} className="p-5 rounded-xl bg-surface border border-border">
              <h3 className="font-bold font-heading text-cyan-400 mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted italic">{c.mechCaveat}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{c.litmTitle}</h2>
        <p className="text-muted leading-relaxed">{c.litmSetup}</p>
        <LostInTheMiddleChart />
        <div className="rounded-2xl bg-surface/50 border border-border p-6 space-y-3">
          <h3 className="text-lg font-bold font-heading text-text">{c.litmReadTitle}</h3>
          <ul className="space-y-2 text-sm text-muted list-disc pl-5">
            {c.litmRead.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{c.effTitle}</h2>
        <p className="text-muted leading-relaxed">{c.effIntro}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <h3 className="font-bold font-heading text-cyan-400 mb-2">{c.rulerTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{c.rulerDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <h3 className="font-bold font-heading text-purple-400 mb-2">{c.nolimaTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{c.nolimaDesc}</p>
          </div>
        </div>
        <EffectiveContextChart />
        <p className="text-muted leading-relaxed">{c.effTakeaway}</p>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{c.chromaTitle}</h2>
        <p className="text-muted leading-relaxed">{c.chromaIntro}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {c.chromaFindings.map(f => (
            <div key={f.title} className="p-4 rounded-xl bg-surface border border-border">
              <h3 className="font-semibold text-text mb-1">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted italic">{c.chromaNote}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{c.mitTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {c.mitItems.map(item => (
            <div key={item.title} className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <h3 className="font-bold font-heading text-emerald-400 mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              <Link href={`/${locale}${item.href}`} className="mt-3 inline-block text-sm text-primary-light underline">
                {t.topicNames[item.topic as keyof typeof t.topicNames]}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{c.testTitle}</h2>
        <ol className="list-decimal pl-5 space-y-3 text-muted">
          {c.testSteps.map(item => <li key={item}>{item}</li>)}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold font-heading text-text">{c.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map(s => (
            <li key={s.href}>
              <a className="text-primary-light underline" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
