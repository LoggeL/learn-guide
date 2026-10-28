'use client'

import { AlertTriangle, Brain, Calculator, CheckCircle2, SplitSquareHorizontal } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { SubtokenBlindnessDemo } from '@/components/interactive/SubtokenBlindnessDemo'
import { useTranslation } from '@/lib/i18n/context'

const SOURCE_LINKS = {
  letters: 'https://arxiv.org/abs/2412.18626',
  strawberry: 'https://arxiv.org/abs/2505.14172',
  techRadar: 'https://www.techradar.com/ai-platforms-assistants/chatgpt-just-announced-it-can-finally-pass-the-simple-how-many-rs-in-strawberry-test-but-users-are-still-tripping-it-up-by-switching-to-cranberry',
}

export default function SubtokenBlindnessPage() {
  const { t } = useTranslation()
  const c = t.subtokenBlindness
  const sources = [
    [c.sourceLetters, SOURCE_LINKS.letters],
    [c.sourceStrawberry, SOURCE_LINKS.strawberry],
    [c.sourceTechRadar, SOURCE_LINKS.techRadar],
  ]

  return (
    <TopicLayout
      topicId="subtoken-blindness"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.title },
      ]}
    >
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15">
            <AlertTriangle size={21} className="text-amber-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.introTitle}</h2>
        </div>
        <p className="text-lg leading-relaxed text-muted">{c.intro}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <SplitSquareHorizontal size={24} className="mb-4 text-cyan-300" />
          <h2 className="mb-3 font-heading text-xl font-bold text-cyan-200">{c.termTitle}</h2>
          <p className="leading-relaxed text-muted">{c.term}</p>
        </div>
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <Brain size={24} className="mb-4 text-violet-300" />
          <h2 className="mb-3 font-heading text-xl font-bold text-violet-200">{c.notJustTokenizerTitle}</h2>
          <p className="leading-relaxed text-muted">{c.notJustTokenizer}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{c.currentTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {c.examples.map((example) => (
            <article key={example.title} className="rounded-2xl border border-border bg-surface/55 p-5">
              <h3 className="mb-3 font-heading text-lg font-bold text-text">{example.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{example.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <Calculator size={24} className="text-emerald-300" />
          <h2 className="font-heading text-2xl font-bold text-text">{c.demoTitle}</h2>
        </div>
        <SubtokenBlindnessDemo />
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.whyTitle}</h2>
        <p className="text-lg leading-relaxed text-muted">{c.why}</p>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-emerald-200">{c.mitigationsTitle}</h2>
        <ul className="space-y-3">
          {c.mitigations.map((item) => (
            <li key={item} className="flex gap-3 text-muted">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{c.sourcesTitle}</h2>
        <ul className="space-y-3">
          {sources.map(([label, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-light underline-offset-4 hover:underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
