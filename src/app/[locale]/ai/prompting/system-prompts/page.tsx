'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { SystemPromptBuilder } from '@/components/interactive/SystemPromptBuilder'
import { SystemPromptCacheDemo } from '@/components/interactive/SystemPromptCacheDemo'
import { PromptApiRolesExample } from '@/components/interactive/PromptApiRolesExample'
import { useTranslation } from '@/lib/i18n/context'

function Bullets({ items, marker, color }: { items: string[]; marker: string; color: string }) {
  return (
    <ul className="space-y-3">
      {items.map(item => (
        <li key={item} className="flex gap-3 items-start">
          <span className={`${color} mt-0.5 shrink-0`}>{marker}</span>
          <span className="text-sm text-muted leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function SystemPromptsPage() {
  const { t, locale } = useTranslation()
  const c = t.systemPrompts

  return (
    <TopicLayout topicId="system-prompts"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.prompting, href: '/ai/prompting' },
        { label: c.title },
      ]}
    >
      {/* What is a system prompt */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">{c.whatIsDesc}</p>
      </section>

      {/* Purpose */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.purpose}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.purposeDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{c.setPersona}</h3>
            <p className="text-sm text-muted">{c.setPersonaDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">{c.setBoundaries}</h3>
            <p className="text-sm text-muted">{c.setBoundariesDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{c.establishTone}</h3>
            <p className="text-sm text-muted">{c.establishToneDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{c.provideKnowledge}</h3>
            <p className="text-sm text-muted">{c.provideKnowledgeDesc}</p>
          </div>
        </div>
      </section>

      {/* Structure */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.structure}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.structureDesc}</p>
        <ol className="grid gap-3 md:grid-cols-2">
          {c.structureSections.map((section, i) => (
            <li key={section.name} className="p-4 bg-background rounded-xl border border-border">
              <h3 className="font-bold text-text mb-1">
                <span className="text-primary-light mr-2">{i + 1}.</span>{section.name}
              </h3>
              <p className="text-sm text-muted">{section.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Generic vs concrete role */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.expertTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.expertDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-400 mb-2">{c.expertWeakLabel}</p>
            <p className="font-mono text-sm text-muted">{c.expertWeak}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400 mb-2">{c.expertStrongLabel}</p>
            <p className="font-mono text-sm text-text">{c.expertStrong}</p>
          </div>
        </div>
      </section>

      {/* Example system prompt */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.examplePrompt}</h2>
        <p className="text-muted leading-relaxed mb-4">{c.examplePromptDesc}</p>
        <pre className="p-4 bg-background rounded-xl border border-border overflow-x-auto text-sm text-muted font-mono">{c.examplePromptCode}</pre>
      </section>

      {/* Tools */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.toolsTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.toolsDesc}</p>
        <Bullets items={c.toolsTips} marker="→" color="text-cyan-400" />
        <Link href={`/${locale}/ai/agents/tool-design`} className="mt-4 inline-block text-sm text-primary-light underline">{c.toolsLink}</Link>
      </section>

      {/* Caching-friendly prefix */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.cachingTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.cachingDesc}</p>
        <SystemPromptCacheDemo />
        <Link href={`/${locale}/ai/llm-inference/prompt-caching`} className="mt-4 inline-block text-sm text-primary-light underline">{c.cachingLink}</Link>
      </section>

      {/* Interactive builder */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{c.interactiveBuilder}</h2>
        <p className="text-muted mb-6">{c.builderDesc}</p>
        <SystemPromptBuilder />
      </section>

      {/* Testing */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.testingTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.testingDesc}</p>
        <Bullets items={c.testingTips} marker="✓" color="text-emerald-400" />
        <Link href={`/${locale}/ai/agents/evaluation`} className="mt-4 inline-block text-sm text-primary-light underline">{c.testingLink}</Link>
      </section>

      {/* Under the hood */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.underTheHood}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.underTheHoodDesc}</p>
        <div className="space-y-4 mb-6">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{c.specialTokens}</h3>
            <p className="text-sm text-muted">{c.specialTokensDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">{c.primacyBias}</h3>
            <p className="text-sm text-muted">{c.primacyBiasDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-rose-400 mb-2">{c.stateless}</h3>
            <p className="text-sm text-muted">{c.statelessDesc}</p>
          </div>
        </div>
        <h3 className="text-lg font-bold font-heading text-text mb-2">{c.apiExample}</h3>
        <p className="text-sm text-muted mb-4">{c.apiExampleDesc}</p>
        <PromptApiRolesExample />
      </section>

      {/* How models learn */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.howModelsLearn}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.howModelsLearnDesc}</p>
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-green-400 mb-2">{c.sftPhase}</h3>
            <p className="text-sm text-muted">{c.sftPhaseDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-violet-400 mb-2">{c.rlhfPhase}</h3>
            <p className="text-sm text-muted">{c.rlhfPhaseDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 border border-sky-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-sky-400 mb-2">{c.gattPhase}</h3>
            <p className="text-sm text-muted">{c.gattPhaseDesc}</p>
          </div>
        </div>
      </section>

      {/* Instruction hierarchy */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.instructionHierarchy}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.instructionHierarchyDesc}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h3 className="font-bold text-red-400 mb-2">{c.hierarchyProblem}</h3>
            <p className="text-sm text-muted">{c.hierarchyProblemDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h3 className="font-bold text-green-400 mb-2">{c.hierarchySolution}</h3>
            <p className="text-sm text-muted">{c.hierarchySolutionDesc}</p>
          </div>
        </div>
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
          <p className="text-sm text-muted">{c.hierarchyExample}</p>
        </div>
        <div className="p-4 bg-background rounded-xl border border-border">
          <h3 className="font-bold text-emerald-400 mb-2">{c.hierarchyResults}</h3>
          <p className="text-sm text-muted">{c.hierarchyResultsDesc}</p>
        </div>
      </section>

      {/* Security (short – details on the Agent Security page) */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{c.security}</h2>
        <p className="text-muted leading-relaxed mb-6">{c.securityDesc}</p>
        <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20">
          <Bullets items={c.securityPoints} marker="!" color="text-red-400 font-bold" />
        </div>
        <Link href={`/${locale}/ai/agents/security`} className="mt-4 inline-block text-sm text-primary-light underline">{c.securityLink}</Link>
      </section>

      {/* Best practices */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.bestPractices}</h2>
        <Bullets items={c.practices} marker="✓" color="text-primary-light" />
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{c.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {c.takeaways.map((item, i) => (
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
        <h2 className="font-semibold mb-3">{c.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {c.sources.map(source => (
            <li key={source.url}><a className="text-primary-light underline" href={source.url}>{source.label}</a></li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
