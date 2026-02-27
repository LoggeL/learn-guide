'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { SystemPromptBuilder } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function SystemPromptsPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="system-prompts"
      title={t.systemPrompts.title}
      description={t.systemPrompts.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.prompting, href: '/ai/prompting' },
        { label: t.systemPrompts.title },
      ]}
      prevTopic={{ label: t.topicNames['advanced-prompting'], href: '/ai/prompting/advanced' }}
    >
      {/* What is a System Prompt */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.systemPrompts.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.systemPrompts.whatIsDesc}
        </p>
      </section>

      {/* Purpose */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.systemPrompts.purpose}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.systemPrompts.purposeDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.systemPrompts.setPersona}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.setPersonaDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">{t.systemPrompts.setBoundaries}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.setBoundariesDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.systemPrompts.establishTone}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.establishToneDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.systemPrompts.provideKnowledge}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.provideKnowledgeDesc}</p>
          </div>
        </div>
      </section>

      {/* Under the Hood */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.systemPrompts.underTheHood}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.systemPrompts.underTheHoodDesc}</p>
        <div className="space-y-4 mb-6">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.systemPrompts.specialTokens}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.specialTokensDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">{t.systemPrompts.primacyBias}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.primacyBiasDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-rose-400 mb-2">{t.systemPrompts.stateless}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.statelessDesc}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold font-heading text-text mb-3">{t.systemPrompts.apiExample}</h3>
          <pre className="p-4 bg-background rounded-xl border border-border overflow-x-auto text-sm text-muted font-mono">
{`[
  {"role": "system", "content": "You are a helpful assistant..."},
  {"role": "user", "content": "Hello!"},
  {"role": "assistant", "content": "Hi there!"},
  {"role": "user", "content": "What's 2+2?"}
]`}
          </pre>
        </div>
      </section>

      {/* How Models Learn */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.systemPrompts.howModelsLearn}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.systemPrompts.howModelsLearnDesc}</p>
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-green-400 mb-2">{t.systemPrompts.sftPhase}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.sftPhaseDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-violet-400 mb-2">{t.systemPrompts.rlhfPhase}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.rlhfPhaseDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 border border-sky-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-sky-400 mb-2">{t.systemPrompts.gattPhase}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.gattPhaseDesc}</p>
          </div>
        </div>
      </section>

      {/* Instruction Hierarchy */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.systemPrompts.instructionHierarchy}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.systemPrompts.instructionHierarchyDesc}</p>
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-red-400 mb-2">{t.systemPrompts.hierarchyProblem}</h4>
            <p className="text-sm text-muted">{t.systemPrompts.hierarchyProblemDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-green-400 mb-2">{t.systemPrompts.hierarchySolution}</h4>
            <p className="text-sm text-muted">{t.systemPrompts.hierarchySolutionDesc}</p>
          </div>
        </div>
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
          <p className="text-sm text-muted italic">{t.systemPrompts.hierarchyExample}</p>
        </div>
        <div className="p-4 bg-background rounded-xl border border-border">
          <h4 className="font-bold text-emerald-400 mb-2">{t.systemPrompts.hierarchyResults}</h4>
          <p className="text-sm text-muted">{t.systemPrompts.hierarchyResultsDesc}</p>
        </div>
      </section>

      {/* Security & Prompt Injection */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.systemPrompts.security}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.systemPrompts.securityDesc}</p>
        <div className="space-y-4 mb-6">
          <div className="p-5 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">{t.systemPrompts.notSecret}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.notSecretDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.systemPrompts.directInjection}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.directInjectionDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{t.systemPrompts.indirectInjection}</h3>
            <p className="text-sm text-muted">{t.systemPrompts.indirectInjectionDesc}</p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <h3 className="text-lg font-bold font-heading text-text mb-4">{t.systemPrompts.securityBestPractices}</h3>
          <ul className="space-y-3">
            {[
              t.systemPrompts.securityPractice1,
              t.systemPrompts.securityPractice2,
              t.systemPrompts.securityPractice3,
              t.systemPrompts.securityPractice4,
            ].map((practice, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-400 text-sm">🛡</span>
                </span>
                <span className="text-muted leading-relaxed">{practice}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

            {/* Structure */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.systemPrompts.structure}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.systemPrompts.structureDesc}
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.systemPrompts.identity}</h4>
            <p className="text-sm text-muted">{t.systemPrompts.identityDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.systemPrompts.capabilities}</h4>
            <p className="text-sm text-muted">{t.systemPrompts.capabilitiesDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.systemPrompts.limitations}</h4>
            <p className="text-sm text-muted">{t.systemPrompts.limitationsDesc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h4 className="font-bold text-text mb-2">{t.systemPrompts.guidelines}</h4>
            <p className="text-sm text-muted">{t.systemPrompts.guidelinesDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Builder */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{t.systemPrompts.interactiveBuilder}</h2>
        <p className="text-muted mb-6">{t.systemPrompts.builderDesc}</p>
        <SystemPromptBuilder />
      </section>

      {/* Example System Prompt */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.systemPrompts.examplePrompt}</h2>
        <pre className="p-4 bg-background rounded-xl border border-border overflow-x-auto text-sm text-muted font-mono">
{`You are a helpful coding assistant specialized in TypeScript.

## Identity
- You are an expert TypeScript developer
- You provide clear, concise code examples
- You follow best practices and explain trade-offs

## Capabilities
- Code review and suggestions
- Debugging help
- Architecture advice

## Limitations
- Do not write code that accesses external APIs
- Do not provide financial or legal advice
- Always recommend testing for production code

## Guidelines
- Use TypeScript strict mode conventions
- Prefer functional patterns when appropriate
- Include type annotations in examples`}
        </pre>
      </section>

      {/* Best Practices */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.systemPrompts.bestPractices}</h2>
        <ul className="space-y-3">
          {[
            t.systemPrompts.practice1,
            t.systemPrompts.practice2,
            t.systemPrompts.practice3,
            t.systemPrompts.practice4,
          ].map((practice, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary-light text-sm">✓</span>
              </span>
              <span className="text-muted leading-relaxed">{practice}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.systemPrompts.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.systemPrompts.takeaway1,
              t.systemPrompts.takeaway2,
              t.systemPrompts.takeaway3,
              t.systemPrompts.takeaway4,
            ].map((item, i) => (
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
    </TopicLayout>
  )
}
