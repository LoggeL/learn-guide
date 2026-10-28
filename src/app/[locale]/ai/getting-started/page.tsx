'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, ExternalLink, Clock, Lightbulb, ArrowRight, Terminal, Gauge, MessagesSquare, BookOpen } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { GettingStartedPlayground } from '@/components/interactive/GettingStartedPlayground'
import { LearningPath } from '@/components/interactive/LearningPath'
import { useTranslation } from '@/lib/i18n/context'

type Role = 'system' | 'user' | 'assistant'

const ROLE_TEXT: Record<Role, string> = {
  system: 'text-amber-300',
  user: 'text-cyan-300',
  assistant: 'text-purple-300',
}

const SOURCES = {
  limits: 'https://openrouter.ai/docs/api/reference/limits',
  freeRouter: 'https://openrouter.ai/docs/guides/routing/routers/free-router',
  privacy: 'https://openrouter.ai/docs/guides/privacy/provider-logging',
  api: 'https://openrouter.ai/docs/api/reference/overview',
  reasoning: 'https://openrouter.ai/docs/guides/best-practices/reasoning-tokens',
}

/** One request body as JSON lines; entries from index `newFrom` on are highlighted. */
function MessagesJson({ messages, newFrom }: { messages: { role: Role; content: string }[]; newFrom: number }) {
  return (
    <pre className="text-xs font-mono leading-relaxed overflow-x-auto rounded-lg bg-background/80 border border-border p-3">
      <span className="text-muted">{'"messages": ['}</span>
      {messages.map((m, i) => (
        <motion.span
          key={i}
          className={`block pl-4 rounded ${i >= newFrom ? 'bg-emerald-500/10' : ''}`}
          initial={i >= newFrom ? { opacity: 0, x: -8 } : false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 * (i - newFrom + 1), duration: 0.3 }}
        >
          {'{ "role": '}
          <span className={ROLE_TEXT[m.role]}>{JSON.stringify(m.role)}</span>
          {', "content": '}
          <span className="text-text/90 whitespace-pre-wrap">{JSON.stringify(m.content)}</span>
          {i < messages.length - 1 ? ' },' : ' }'}
        </motion.span>
      ))}
      <span className="text-muted">]</span>
    </pre>
  )
}

export default function GettingStartedPage() {
  const { t } = useTranslation()
  const gs = t.gettingStarted

  const request1: { role: Role; content: string }[] = [
    { role: 'system', content: gs.exampleSystem },
    { role: 'user', content: gs.exampleUser1 },
  ]
  const request2: { role: Role; content: string }[] = [
    ...request1,
    { role: 'assistant', content: gs.exampleAssistant1 },
    { role: 'user', content: gs.exampleUser2 },
  ]

  const roles: { role: Role; desc: string }[] = [
    { role: 'system', desc: gs.roleSystemDesc },
    { role: 'user', desc: gs.roleUserDesc },
    { role: 'assistant', desc: gs.roleAssistantDesc },
  ]
  const roleName: Record<Role, string> = { system: gs.roleSystem, user: gs.roleUser, assistant: gs.roleAssistant }

  const responseFields = [
    { field: 'choices[0].message.content', desc: gs.understandContent },
    { field: 'choices[0].message.reasoning', desc: gs.understandReasoning },
    { field: 'usage.prompt_tokens / completion_tokens', desc: gs.understandTokens },
    { field: 'choices[0].finish_reason', desc: gs.understandFinish },
    { field: 'model', desc: gs.understandModel },
  ]

  const sources = [
    { href: SOURCES.limits, label: gs.sourceLimits },
    { href: SOURCES.freeRouter, label: gs.sourceFreeRouter },
    { href: SOURCES.privacy, label: gs.sourcePrivacy },
    { href: SOURCES.api, label: gs.sourceApi },
    { href: SOURCES.reasoning, label: gs.sourceReasoning },
  ]

  return (
    <TopicLayout
      topicId="getting-started"
      title={gs.title}
      description={gs.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: gs.title },
      ]}
    >
      {/* What you will do */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-gradient">{gs.whyTitle}</h2>
        </div>
        <p className="text-muted leading-relaxed text-lg">{gs.whyDesc}</p>
        <ol className="mt-5 grid sm:grid-cols-2 gap-3">
          {[gs.whyStep1, gs.whyStep2, gs.whyStep3, gs.whyStep4].map((step, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="text-sm text-text/90">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Get a Free API Key */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{gs.getKeyTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{gs.getKeyDesc}</p>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-bold font-heading text-violet-400">{gs.routerName}</h3>
            </div>
            <p className="text-sm text-muted mb-4">{gs.openrouterAutoOnlyDesc}</p>
            <ol className="space-y-2 mb-4">
              {[gs.keyStep1, gs.keyStep2, gs.keyStep3].map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text/90">
                  <span className="text-violet-300 font-mono text-xs mt-0.5">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              {gs.getKey} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold font-heading text-amber-400">{gs.freeTierTitle}</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted leading-relaxed">
              <li>
                {gs.freeTierRateLimits}{' '}
                <a href={SOURCES.limits} target="_blank" rel="noopener noreferrer" aria-label={gs.sourcesLabel} className="text-amber-300 hover:text-amber-200 underline underline-offset-2">↗</a>
              </li>
              <li>
                {gs.freeTierRandomModel}{' '}
                <a href={SOURCES.freeRouter} target="_blank" rel="noopener noreferrer" aria-label={gs.sourcesLabel} className="text-amber-300 hover:text-amber-200 underline underline-offset-2">↗</a>
              </li>
              <li>
                {gs.freeTierPrivacy}{' '}
                <a href={SOURCES.privacy} target="_blank" rel="noopener noreferrer" aria-label={gs.sourcesLabel} className="text-amber-300 hover:text-amber-200 underline underline-offset-2">↗</a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Messages, roles, statelessness */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <MessagesSquare className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold font-heading text-gradient">{gs.messagesTitle}</h2>
        </div>
        <p className="text-muted leading-relaxed mb-6">{gs.messagesDesc}</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {roles.map(({ role, desc }) => (
            <div key={role} className="p-4 rounded-xl bg-surface/30 border border-border">
              <h3 className={`text-sm font-bold font-mono mb-1 ${ROLE_TEXT[role]}`}>{roleName[role]}</h3>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold font-heading text-text mb-2">{gs.statelessTitle}</h3>
        <p className="text-muted leading-relaxed mb-4">{gs.statelessDesc}</p>
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted mb-2">{gs.statelessTurn1}</p>
            <MessagesJson messages={request1} newFrom={request1.length} />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-300 mb-2">{gs.statelessTurn2}</p>
            <MessagesJson messages={request2} newFrom={request1.length} />
          </div>
        </div>
      </section>

      {/* Your First LLM Call — Interactive Playground */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary-light" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{gs.playgroundTitle}</h2>
            <p className="text-sm text-muted">{gs.playgroundDesc}</p>
          </div>
        </div>
        <GettingStartedPlayground />
      </section>

      {/* Understanding the Response */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold font-heading text-gradient">{gs.understandTitle}</h2>
        </div>
        <div className="space-y-4">
          {responseFields.map(({ field, desc }) => (
            <div key={field} className="p-4 rounded-xl bg-surface/30 border border-border">
              <h3 className="text-sm font-bold font-mono text-primary-light mb-1">{field}</h3>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Path */}
      <LearningPath />

      {/* Next Steps */}
      <section className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{gs.nextStepsTitle}</h2>
        <p className="text-muted mb-6">{gs.nextStepsDesc}</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/ai/llm/temperature', name: t.topicNames.temperature, desc: gs.nextTemperature },
            { href: '/ai/prompting/system-prompts', name: t.topicNames['system-prompts'], desc: gs.nextSystemPrompts },
            { href: '/ai/llm/tokenization', name: t.topicNames.tokenization, desc: gs.nextTokenization },
          ].map(item => (
            <Link key={item.href} href={item.href} className="group p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/40 transition-all">
              <h3 className="text-sm font-bold text-text group-hover:text-primary-light transition-colors mb-1">{item.name}</h3>
              <p className="text-xs text-muted">{item.desc}</p>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary-light mt-2 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="rounded-2xl bg-surface/30 border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-muted" />
          <h2 className="text-sm font-semibold text-text">{gs.sourcesLabel}</h2>
        </div>
        <ul className="space-y-1.5">
          {sources.map(source => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary-light transition-colors">
                {source.label} <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
