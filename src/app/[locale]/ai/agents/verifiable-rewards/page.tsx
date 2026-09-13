'use client'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { VerifiableRewardsSimulator } from '@/components/interactive/VerifiableRewardsSimulator'
import { useTranslation } from '@/lib/i18n/context'
export default function VerifiableRewardsPage(){
 const {t}=useTranslation();const c=t.agentReview;const v=t.verifiableRewards
 return <TopicLayout topicId="verifiable-rewards" title={v.title} description={v.description} breadcrumbs={[{label:t.categories.ai,href:'/'},{label:t.categories.agents,href:'/ai/agents'},{label:v.title}]}>
  <section><h2 className="text-2xl font-semibold mb-3">{v.outcomesTitle}</h2><p className="text-muted leading-relaxed">{v.outcomesDesc}</p></section>
  <section><h2 className="text-2xl font-semibold mb-4">{v.rewardLoopTitle}</h2><ol className="grid md:grid-cols-2 gap-4">{c.rewardStages.map((stage,i)=><li className="border border-border rounded-xl p-5" key={stage.title}><h3 className="font-semibold mb-2">{i+1}. {stage.title}</h3><p className="text-sm text-muted">{stage.body}</p></li>)}</ol></section>
  <VerifiableRewardsSimulator/>
  <section><h2 className="text-xl font-semibold mb-4">{v.environmentsTitle}</h2><div className="grid md:grid-cols-3 gap-4">{c.rewardEnvironments.map(env=><article className="border border-border rounded-xl p-4" key={env.title}><h3 className="font-semibold mb-2">{env.title}</h3><p className="text-sm text-muted">{env.body}</p></article>)}</div></section>
  <section><h2 className="text-xl font-semibold mb-4">{v.whyHardTitle}</h2><ul className="list-disc pl-5 space-y-3 text-muted">{c.rewardRisks.map(risk=><li key={risk}>{risk}</li>)}</ul></section>
 </TopicLayout>
}
