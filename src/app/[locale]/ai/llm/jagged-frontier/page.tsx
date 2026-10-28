'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  LineChart,
  MoveRight,
  Shuffle,
  SplitSquareHorizontal,
} from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { JaggedFrontierMap } from '@/components/interactive/JaggedFrontierMap'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = {
  paper: { title: 'Dell’Acqua, McFowland, Mollick et al. (2023): Navigating the Jagged Technological Frontier – HBS Working Paper 24-013', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321' },
  journal: { title: 'Dell’Acqua et al. (2026), Organization Science – DOI 10.1287/orsc.2025.21838', url: 'https://doi.org/10.1287/orsc.2025.21838' },
  mollick: { title: 'Ethan Mollick (2023): Centaurs and Cyborgs on the Jagged Frontier', url: 'https://www.oneusefulthing.org/p/centaurs-and-cyborgs-on-the-jagged' },
} as const

export default function JaggedFrontierPage() {
  const { t, locale } = useTranslation()
  const c = t.jaggedFrontier

  const related = [
    { id: 'reasoning-models', href: '/ai/llm/reasoning-models' },
    { id: 'subtoken-blindness', href: '/ai/llm/subtoken-blindness' },
    { id: 'verifiable-rewards', href: '/ai/agents/verifiable-rewards' },
    { id: 'evaluation', href: '/ai/agents/evaluation' },
  ] as const

  return (
    <TopicLayout
      topicId="jagged-frontier"
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/15">
            <LineChart size={21} className="text-cyan-300" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.introTitle}</h2>
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-muted">
          <p>{c.intro}</p>
          <p className="border-l-2 border-primary/50 pl-4 text-text">{c.thesis}</p>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <FlaskConical size={24} className="text-violet-300" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.studyTitle}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {c.studyFacts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-border bg-surface/55 p-5">
              <div className="font-heading text-3xl font-bold text-text">{fact.value}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{fact.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-3xl leading-relaxed text-muted">{c.studyDesc}</p>
        <a href={SOURCES.paper.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-start gap-1.5 text-xs text-primary-light hover:underline">
          <span>{SOURCES.paper.title}</span>
          <ExternalLink size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
        </a>
      </section>

      <JaggedFrontierMap />

      <section>
        <div className="mb-5 flex items-center gap-3">
          <AlertTriangle size={24} className="text-amber-300" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold text-text">{c.whyTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {c.whyItems.map((item) => (
            <article key={item.title} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h3 className="mb-3 font-heading text-lg font-bold text-amber-100">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-3">
          <SplitSquareHorizontal size={24} className="text-cyan-300" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.patternsTitle}</h2>
        </div>
        <p className="mb-5 text-muted">{c.patternsIntro}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-purple-500/25 bg-purple-500/5 p-6">
            <h3 className="font-heading text-xl font-bold text-text">{c.centaurTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.centaurDesc}</p>
          </article>
          <article className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-6">
            <h3 className="font-heading text-xl font-bold text-text">{c.cyborgTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.cyborgDesc}</p>
          </article>
        </div>
        <a href={SOURCES.mollick.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-start gap-1.5 text-xs text-primary-light hover:underline">
          <span>{SOURCES.mollick.title}</span>
          <ExternalLink size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
        </a>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <Shuffle size={22} className="text-violet-300" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.movingTitle}</h2>
        </div>
        <p className="leading-relaxed text-muted">{c.movingDesc}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {related.slice(0, 2).map(({ id, href }) => (
            <Link
              key={id}
              href={`/${locale}${href}`}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary-light hover:bg-primary/20"
            >
              {t.topicNames[id]}
              <MoveRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-emerald-200">{c.useTitle}</h2>
        <ul className="space-y-3">
          {c.useItems.map((item) => (
            <li key={item} className="flex gap-3 text-muted">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.pairsTitle}</h2>
        <p className="mt-2 text-muted">{c.pairsIntro}</p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          <div className="hidden grid-cols-2 border-b border-border bg-surface/70 text-xs font-bold uppercase tracking-wide text-muted sm:grid">
            <div className="px-4 py-2">{c.pairsA}</div>
            <div className="px-4 py-2">{c.pairsB}</div>
          </div>
          {c.pairs.map((pair) => (
            <div key={pair.a} className="grid border-b border-border last:border-b-0 sm:grid-cols-2">
              <div className="px-4 py-3 text-sm text-text">{pair.a}</div>
              <div className="px-4 py-3 text-sm text-muted sm:border-l sm:border-border">{pair.b}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{c.relatedTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {related.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 text-primary-light transition hover:border-primary/40 hover:bg-primary/10"
            >
              <span>{t.topicNames[item.id]}</span>
              <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/45 p-6">
        <h2 className="font-heading text-xl font-bold text-text">{c.sourcesTitle}</h2>
        <ul className="mt-4 space-y-2">
          {Object.values(SOURCES).map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-sm text-primary-light hover:underline">
                <span>{source.title}</span>
                <ExternalLink size={13} className="mt-1 shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
