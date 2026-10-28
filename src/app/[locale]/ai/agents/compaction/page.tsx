'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { CompactionExplorer } from '@/components/interactive/CompactionExplorer'
import { useTranslation } from '@/lib/i18n/context'

const TONES = {
  red: { box: 'bg-red-500/5 border-red-500/20', title: 'text-red-400' },
  orange: { box: 'bg-orange-500/5 border-orange-500/20', title: 'text-orange-400' },
  amber: { box: 'bg-amber-500/5 border-amber-500/20', title: 'text-amber-400' },
  cyan: { box: 'bg-cyan-500/5 border-cyan-500/20', title: 'text-cyan-400' },
  purple: { box: 'bg-purple-500/5 border-purple-500/20', title: 'text-purple-400' },
  emerald: { box: 'bg-emerald-500/5 border-emerald-500/20', title: 'text-emerald-400' },
} as const

export default function AgentCompactionPage() {
  const { t, locale } = useTranslation()
  const c = t.chatCompaction

  const mechanisms = [
    { title: c.mech1Title, desc: c.mech1Desc, code: 'messages = messages[-MAX_MESSAGES:]', color: 'red' as const },
    {
      title: c.mech2Title,
      desc: c.mech2Desc,
      code: '"context_management": { "edits": [{\n  "type": "clear_tool_uses_20250919",\n  "trigger": { "type": "input_tokens", "value": 100000 },\n  "keep": { "type": "tool_uses", "value": 3 },\n  "clear_at_least": { "type": "input_tokens", "value": 5000 }\n}] }',
      color: 'orange' as const,
    },
    { title: c.mech3Title, desc: c.mech3Desc, code: 'summary = llm(SUMMARY_PROMPT, messages[:-KEEP])\nmessages = [summary] + messages[-KEEP:]', color: 'amber' as const },
    {
      title: c.mech4Title,
      desc: c.mech4Desc,
      code: '"context_management": { "edits": [{\n  "type": "compact_20260112",\n  "trigger": { "type": "input_tokens", "value": 150000 },\n  "pause_after_compaction": false\n}] }',
      color: 'cyan' as const,
    },
    { title: c.mech5Title, desc: c.mech5Desc, code: '/compact focus on the failing checkout test', color: 'purple' as const },
  ]

  const sources = [
    { label: c.srcCompaction, href: 'https://platform.claude.com/docs/en/build-with-claude/compaction' },
    { label: c.srcThreshold, href: 'https://platform.claude.com/docs/en/build-with-claude/compaction-threshold' },
    { label: c.srcContextEditing, href: 'https://platform.claude.com/docs/en/build-with-claude/context-editing' },
    { label: c.srcOpenAi, href: 'https://developers.openai.com/api/docs/guides/compaction' },
    { label: c.srcClaudeCode, href: 'https://code.claude.com/docs/en/context-window' },
    { label: c.srcContextEng, href: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents' },
  ]

  return (
    <TopicLayout
      topicId="chat-compaction"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: c.title },
      ]}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">{c.whatIsDesc}</p>
        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <p className="text-xl text-text font-heading font-semibold mb-0">{c.quote}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.when}</h2>
        <p className="text-muted leading-relaxed">{c.whenDesc}</p>
        <Link href={`/${locale}/ai/llm/context-rot`} className="mt-3 inline-block text-sm text-primary-light underline">
          {c.whenLink} →
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.mechanisms}</h2>
        <div className="space-y-4">
          {mechanisms.map((m, i) => (
            <div key={m.title} className={`p-5 rounded-xl border ${TONES[m.color].box}`}>
              <h3 className={`text-lg font-bold font-heading mb-2 ${TONES[m.color].title}`}>
                {i + 1}. {m.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-3">{m.desc}</p>
              <pre className="font-mono text-xs bg-background/60 rounded-lg p-3 text-muted overflow-x-auto whitespace-pre">{m.code}</pre>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🗜️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{c.interactive}</h2>
            <p className="text-sm text-muted">{c.interactiveDesc}</p>
          </div>
        </div>
        <CompactionExplorer />
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.breaks}</h2>
        <div className="space-y-4 text-muted leading-relaxed">
          <p>{c.breaksDesc}</p>
          <ul className="space-y-3 list-disc pl-5">
            {[c.break1, c.break2, c.break3, c.break4].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.practice}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{c.rules}</h3>
            <ul className="space-y-2 text-sm text-muted list-disc pl-5">
              {[c.rule1, c.rule2, c.rule3, c.rule4].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">{c.costs}</h3>
            <ul className="space-y-2 text-sm text-muted list-disc pl-5">
              {[c.cost1, c.cost2, c.cost3, c.cost4].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <Link href={`/${locale}/ai/agents/memory`} className="mt-4 inline-block text-sm text-primary-light underline">
          {c.memoryLink} →
        </Link>
      </section>

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
