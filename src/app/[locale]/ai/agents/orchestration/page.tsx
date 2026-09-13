'use client'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { WorkflowVisualizer } from '@/components/interactive/WorkflowVisualizer'
import { useTranslation } from '@/lib/i18n/context'
export default function OrchestrationPage() {
  const {t}=useTranslation(); const c=t.agentReview; const o=t.orchestration
  return <TopicLayout topicId="orchestration" title={o.title} description={o.description} breadcrumbs={[{label:t.categories.ai,href:'/'},{label:t.categories.agents,href:'/ai/agents'},{label:o.title}]}>
    <section><h2 className="text-2xl font-semibold mb-4">{c.mergeTitle}</h2><p className="text-muted leading-relaxed">{c.mergeIntro}</p><div className="grid md:grid-cols-2 gap-4 mt-5">{c.patterns.map(pattern=><article className="rounded-xl border border-border bg-surface p-5" key={pattern.title}><h3 className="font-semibold mb-2">{pattern.title}</h3><p className="text-sm text-muted">{pattern.body}</p></article>)}</div></section>
    <section><h2 className="text-2xl font-semibold mb-4">{o.interactiveDemo}</h2><p className="text-sm text-muted mb-5">{c.workflowNote}</p><WorkflowVisualizer/></section>
    <section className="rounded-xl border border-border p-5"><h2 className="text-xl font-semibold mb-3">{o.stateManagement}</h2><p className="text-muted mb-4">{o.stateManagementDesc}</p><div className="grid md:grid-cols-2 gap-4">{[{title:o.checkpointing,body:o.checkpointingDesc},{title:o.rollback,body:o.rollbackDesc}].map(item=><div key={item.title}><h3 className="font-semibold mb-2">{item.title}</h3><p className="text-sm text-muted">{item.body}</p></div>)}</div></section>
    <section><h2 className="text-xl font-semibold mb-3">{o.handoffMechanisms}</h2><p className="text-muted mb-4">{o.handoffMechanismsDesc}</p><div className="grid md:grid-cols-3 gap-4">{[{title:o.handoffExplicit,body:o.handoffExplicitDesc},{title:o.handoffCondition,body:o.handoffConditionDesc},{title:o.handoffEscalation,body:o.handoffEscalationDesc}].map(item=><div className="border border-border rounded p-4" key={item.title}><h3 className="font-semibold mb-2">{item.title}</h3><p className="text-sm text-muted">{item.body}</p></div>)}</div></section>
    <section className="rounded-xl border border-border p-5"><h2 className="text-xl font-semibold mb-3">{c.scheduleTitle}</h2><p className="text-muted leading-relaxed">{c.scheduleBody}</p></section>
    <p className="text-sm text-muted">{c.securityRuntime}</p><p className="text-sm text-muted">{c.costModel}</p>
  </TopicLayout>
}
