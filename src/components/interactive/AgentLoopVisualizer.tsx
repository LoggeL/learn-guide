'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
export function AgentLoopVisualizer() {
  const {t} = useTranslation(); const c=t.agentReview
  const [step,setStep]=useState(0)
  return <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
    <h3 className="text-xl font-semibold">{c.loopTitle}</h3><p className="text-sm text-muted">{c.loopNote}</p>
    <div className="flex gap-3"><button className="rounded border border-border px-3 py-2 disabled:opacity-40" disabled={step===c.loopFlow.length-1} onClick={()=>setStep(step+1)}>{c.next}</button><button className="rounded border border-border px-3 py-2" onClick={()=>setStep(0)}>{c.reset}</button></div>
    <ol className="space-y-3">{c.loopFlow.slice(0,step+1).map((content,i)=><li key={i} className={`rounded-lg border p-4 ${i===4?'border-orange-400/50':'border-border'}`}><h4 className="text-sm font-semibold mb-2">{i+1}. {c.loopPhases[i]}</h4><p className="text-sm break-words">{content}</p></li>)}</ol>
  </div>
}
