'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { ContextAnatomyVisualizer } from '@/components/interactive/ContextAnatomyVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const TONES = {
  red: { box: 'bg-red-500/5 border-red-500/20', title: 'text-red-400' },
  orange: { box: 'bg-orange-500/5 border-orange-500/20', title: 'text-orange-400' },
  amber: { box: 'bg-amber-500/5 border-amber-500/20', title: 'text-amber-400' },
  cyan: { box: 'bg-cyan-500/5 border-cyan-500/20', title: 'text-cyan-400' },
  purple: { box: 'bg-purple-500/5 border-purple-500/20', title: 'text-purple-400' },
  emerald: { box: 'bg-emerald-500/5 border-emerald-500/20', title: 'text-emerald-400' },
} as const

export default function AgentContextPage() {
  const { t, locale } = useTranslation()
  const c = t.agentContext

  const levers = [
    { title: c.lever1Title, desc: c.lever1Desc, color: 'cyan' as const, link: { href: '/ai/llm-inference/prompt-caching', label: c.lever1Link } },
    { title: c.lever2Title, desc: c.lever2Desc, color: 'orange' as const },
    { title: c.lever3Title, desc: c.lever3Desc, color: 'purple' as const },
    { title: c.lever4Title, desc: c.lever4Desc, color: 'emerald' as const, link: { href: '/ai/agents/compaction', label: c.lever4Link } },
  ]

  const pitfalls = [
    { title: c.pitfallOverflow, desc: c.pitfallOverflowDesc },
    { title: c.pitfallCache, desc: c.pitfallCacheDesc },
    { title: c.pitfallDistractors, desc: c.pitfallDistractorsDesc },
    { title: c.pitfallStale, desc: c.pitfallStaleDesc },
  ]

  const sources = [
    { label: c.srcContextEng, href: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents' },
    { label: c.srcCaching, href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching' },
    { label: c.srcToolSearch, href: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool' },
    { label: c.srcAdvancedTools, href: 'https://www.anthropic.com/engineering/advanced-tool-use' },
    { label: c.srcClaudeCode, href: 'https://code.claude.com/docs/en/context-window' },
    { label: c.srcContextRot, href: 'https://research.trychroma.com/context-rot' },
    { label: c.srcLostMiddle, href: 'https://arxiv.org/abs/2307.03172' },
    { label: c.srcTruncation, href: 'https://developers.openai.com/api/reference/resources/responses/methods/create' },
  ]

  const k = (text: string) => <span className="text-purple-400">&quot;{text}&quot;</span>
  const s = (text: string) => <span className="text-cyan-400">&quot;{text}&quot;</span>
  const comment = (text: string) => <span className="text-subtle">{`// ${text}`}</span>

  return (
    <TopicLayout
      topicId="agent-context"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: c.title },
      ]}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">{c.whatIsDesc}</p>
        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <p className="text-xl text-text font-heading font-semibold mb-0">{c.workingMemory}</p>
        </div>
      </section>

      {/* Request anatomy */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.anatomy}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.anatomyDesc}</p>
        <div className="rounded-2xl bg-background border border-border p-6 md:p-8 font-mono text-sm overflow-x-auto">
          <pre className="text-muted">
            <code>
              {'{'}{'\n'}
              {'  '}{comment(c.codeTools)}{'\n'}
              {'  '}{k('tools')}: [{'\n'}
              {'    '}{'{'} {k('name')}: {s('read_file')}, {k('description')}: {s('Read a file')}, {k('input_schema')}: {'{…}'} {'}'},{'\n'}
              {'    '}{'{'} {k('name')}: {s('run_tests')}, {k('description')}: {s('Run the test suite')}, {k('input_schema')}: {'{…}'} {'}'}{'\n'}
              {'  '}],{'\n\n'}
              {'  '}{comment(c.codeSystem)}{'\n'}
              {'  '}{k('system')}: [{'{'} {k('type')}: {s('text')}, {k('text')}: {s('You are a coding agent… <CLAUDE.md>')},{'\n'}
              {'              '}{k('cache_control')}: {'{'} {k('type')}: {s('ephemeral')} {'}'} {'}'}],{'\n\n'}
              {'  '}{comment(c.codeHistory)}{'\n'}
              {'  '}{k('messages')}: [{'\n'}
              {'    '}{'{'} {k('role')}: {s('user')}, {k('content')}: {s('Fix the failing checkout test')} {'}'},{'\n'}
              {'    '}{'{'} {k('role')}: {s('assistant')}, {k('content')}: [{'\n'}
              {'      '}{'{'} {k('type')}: {s('tool_use')}, {k('id')}: {s('toolu_01')}, {k('name')}: {s('read_file')}, {k('input')}: {'{'} {k('path')}: {s('src/checkout.ts')} {'}'} {'}'} ] {'}'},{'\n'}
              {'    '}{'{'} {k('role')}: {s('user')}, {k('content')}: [{'\n'}
              {'      '}{'{'} {k('type')}: {s('tool_result')}, {k('tool_use_id')}: {s('toolu_01')}, {k('content')}: {s('export function applyCoupon…')} {'}'} ] {'}'},{'\n\n'}
              {'    '}{comment(c.codeLatest)}{'\n'}
              {'    '}{'{'} {k('role')}: {s('user')}, {k('content')}: {s('Keep the change under 20 lines')} {'}'}{'\n'}
              {'  '}]{'\n'}
              {'}'}
            </code>
          </pre>
        </div>
        <p className="text-sm text-muted mt-3">{c.anatomyNote}</p>
      </section>

      {/* Interactive Visualizer */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{c.exploreLayers}</h2>
            <p className="text-sm text-muted">{c.exploreLayersDesc}</p>
          </div>
        </div>
        <ContextAnatomyVisualizer />
      </section>

      {/* Levers */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.levers}</h2>
        <div className="space-y-4">
          {levers.map((lever, i) => (
            <div key={lever.title} className={`p-5 rounded-xl border ${TONES[lever.color].box}`}>
              <h3 className={`text-lg font-bold font-heading mb-2 ${TONES[lever.color].title}`}>
                {i + 1}. {lever.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{lever.desc}</p>
              {lever.link && (
                <Link href={`/${locale}${lever.link.href}`} className="mt-3 inline-block text-sm text-primary-light underline">
                  {lever.link.label} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Context rot */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.rotTitle}</h2>
        <p className="text-muted leading-relaxed">{c.rotDesc}</p>
        <Link href={`/${locale}/ai/llm/context-rot`} className="mt-4 inline-block text-sm text-primary-light underline">
          {c.rotLink} →
        </Link>
      </section>

      {/* Common Pitfalls */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.pitfalls}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {pitfalls.map((p) => (
            <div key={p.title} className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
              <h3 className="text-lg font-bold font-heading text-red-400 mb-2">{p.title}</h3>
              <p className="text-sm text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[c.takeaway1, c.takeaway2, c.takeaway3, c.takeaway4].map((item, i) => (
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
      <section className="border-t border-border pt-5">
        <h2 className="font-semibold mb-3">{c.sources}</h2>
        <ul className="space-y-2 text-sm">
          {sources.map((src) => (
            <li key={src.href}>
              <a className="text-primary-light underline" href={src.href} target="_blank" rel="noopener noreferrer">{src.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
