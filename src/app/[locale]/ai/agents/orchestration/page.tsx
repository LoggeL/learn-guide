'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { WorkflowVisualizer } from '@/components/interactive/WorkflowVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const HANDOFF_CODE = `from agents import Agent, Runner, handoff

billing = Agent(name="Billing agent", instructions="Answer invoice and refund questions.")
support = Agent(name="Support agent", instructions="Fix installation problems.")

triage = Agent(
    name="Triage agent",
    instructions="Find out what the user needs and transfer to the right agent.",
    handoffs=[billing, handoff(support)],  # exposed as transfer_to_billing_agent, ...
)

result = await Runner.run(triage, "My update failed and I was charged twice.")
print(result.last_agent.name, result.final_output)`

const CARD_COLORS = [
  { box: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20', title: 'text-cyan-400' },
  { box: 'from-purple-500/10 to-pink-500/10 border-purple-500/20', title: 'text-purple-400' },
  { box: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20', title: 'text-emerald-400' },
]

export default function OrchestrationPage() {
  const { t } = useTranslation()
  const o = t.orchestration

  return (
    <TopicLayout
      topicId="orchestration"
      title={o.title}
      description={o.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: o.title },
      ]}
    >
      {/* Intro */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{o.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">{o.whatIsDesc}</p>
        <p className="text-muted leading-relaxed mb-6">{o.whatIsWorkflow}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {o.questions.map((q, i) => (
            <div key={q.title} className="p-4 bg-background rounded-xl border border-border">
              <span className="text-xs font-mono text-primary-light">{i + 1}</span>
              <h3 className="text-sm font-bold text-text mt-1 mb-2">{q.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{q.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Single agent first */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{o.singleFirstTitle}</h2>
        <p className="text-muted leading-relaxed">{o.singleFirstDesc}</p>
      </section>

      {/* When multi-agent pays off */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{o.whenMultiTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{o.whenMultiDesc}</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-3">{o.gainsTitle}</h3>
            <div className="space-y-3">
              {o.gains.map(item => (
                <div key={item.title} className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <h4 className="text-sm font-bold text-text mb-1">{item.title}</h4>
                  <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-3">{o.costsTitle}</h3>
            <div className="space-y-3">
              {o.costs.map(item => (
                <div key={item.title} className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <h4 className="text-sm font-bold text-text mb-1">{item.title}</h4>
                  <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-border bg-surface p-5">
          <h3 className="font-semibold text-text mb-3">{o.checklistTitle}</h3>
          <ul className="space-y-2 text-sm text-muted list-disc pl-5">
            {o.checklist.map(item => <li key={item}>{item}</li>)}
          </ul>
          <p className="text-sm text-muted mt-3 leading-relaxed">{o.checklistNote}</p>
        </div>
      </section>

      {/* Interactive model */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{o.demoTitle}</h2>
        <p className="text-muted leading-relaxed mb-3">{o.demoIntro}</p>
        <p className="text-muted leading-relaxed mb-3">{o.demoCostModel}</p>
        <p className="text-xs text-muted mb-5 leading-relaxed">{o.demoAssumptions}</p>
        <WorkflowVisualizer />
      </section>

      {/* Patterns */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{o.patternsTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{o.patternsIntro}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {o.patternList.map(p => (
            <article key={p.name} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <h3 className="font-semibold text-text">{p.name}</h3>
                <span className="text-xs text-primary-light">{o.patternWhoLabel}: {p.who}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-3">{p.example}</p>
              <p className="text-xs text-muted"><span className="text-text font-medium">{o.patternWhenLabel}:</span> {p.when}</p>
            </article>
          ))}
        </div>
        <p className="text-xs text-muted mt-4">{o.patternsSource}</p>
      </section>

      {/* Subagents */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{o.subagentsTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{o.subagentsIntro}</p>
        <ol className="space-y-3">
          {o.subagentSteps.map((step, i) => (
            <li key={step.title} className="flex gap-4 p-4 bg-background rounded-xl border border-border">
              <span className="w-7 h-7 shrink-0 rounded-lg bg-purple-500/20 text-purple-400 font-mono text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <div>
                <h3 className="text-sm font-bold text-text mb-1">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted mt-5 leading-relaxed">{o.scaleNote}</p>
      </section>

      {/* Handoffs */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{o.handoffMechanisms}</h2>
        <p className="text-muted leading-relaxed mb-6">{o.handoffMechanismsDesc}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-semibold text-text mb-2">{o.handoffHistory}</h3>
            <p className="text-sm text-muted leading-relaxed">{o.handoffHistoryDesc}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-semibold text-text mb-2">{o.handoffVsTool}</h3>
            <p className="text-sm text-muted leading-relaxed">{o.handoffVsToolDesc}</p>
          </div>
        </div>
        <p className="text-sm text-muted mb-2">{o.handoffCodeCaption}</p>
        <pre className="p-4 bg-background rounded-xl border border-border text-sm text-muted font-mono overflow-x-auto leading-relaxed mb-6">{HANDOFF_CODE}</pre>
        <h3 className="font-semibold text-text mb-3">{o.handoffKindsTitle}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: o.handoffExplicit, body: o.handoffExplicitDesc },
            { title: o.handoffCondition, body: o.handoffConditionDesc },
            { title: o.handoffEscalation, body: o.handoffEscalationDesc },
          ].map((item, i) => (
            <div key={item.title} className={`p-5 bg-gradient-to-br border rounded-xl ${CARD_COLORS[i].box}`}>
              <h4 className={`font-bold font-heading mb-2 ${CARD_COLORS[i].title}`}>{item.title}</h4>
              <p className="text-sm text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* State */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{o.stateManagement}</h2>
        <p className="text-muted leading-relaxed mb-6">{o.stateManagementDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: o.checkpointing, body: o.checkpointingDesc },
            { title: o.rollback, body: o.rollbackDesc },
            { title: o.scheduleTitle, body: o.scheduleBody },
          ].map(item => (
            <div key={item.title} className="p-4 bg-background rounded-xl border border-border">
              <h3 className="text-sm font-bold text-text mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Failure modes */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{o.failuresTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{o.failuresDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {o.failures.map((f, i) => (
            <div key={f.title} className={`p-5 bg-gradient-to-br border rounded-xl ${CARD_COLORS[(i + 1) % 3].box}`}>
              <h3 className={`font-bold font-heading mb-2 ${CARD_COLORS[(i + 1) % 3].title}`}>{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Takeaways */}
      <section className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{o.keyTakeaways}</h2>
        <ul className="space-y-2 text-muted list-disc pl-5">
          {o.takeaways.map(item => <li key={item}>{item}</li>)}
        </ul>
      </section>

      {/* Sources */}
      <section className="border-t border-border pt-5">
        <h2 className="font-semibold mb-3">{o.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {o.sources.map(s => (
            <li key={s.url}>
              <a className="text-primary-light underline" href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
