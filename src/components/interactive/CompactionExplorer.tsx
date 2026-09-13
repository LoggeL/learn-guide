'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
export function CompactionExplorer(){
  const {t}=useTranslation(); const c=t.agentReview
  const [stage,setStage]=useState(0)
  const shown=stage===0?c.compactOriginal:stage===1?[c.compactSummary,c.compactTail]:stage===2?[c.compactSummary,c.compactQuestion,c.compactTail]:[c.compactSummary,...c.compactOriginal]
  return <div className="rounded-xl border border-border bg-surface p-5 space-y-5">
    <p className="text-sm text-muted">{c.compactionNote}</p>
    <div className="flex flex-wrap gap-2">{c.compactStages.map((name,i)=><button key={name} aria-pressed={stage===i} className={`px-3 py-2 rounded border ${stage===i?'border-primary bg-primary/10':'border-border'}`} onClick={()=>setStage(i)}>{i+1}. {name}</button>)}</div>
    <section><h3 className="font-semibold mb-2">{c.compactContext}</h3><ul className="space-y-2">{shown.map((text,i)=><li className="bg-background rounded p-3" key={i}>{text}</li>)}</ul></section>
    {stage>0&&<section className="border border-purple-400/40 rounded p-3"><h3>{c.result}</h3><p className="text-sm mt-2">{c.compactSummary}</p></section>}
    <details className="border border-border rounded p-3"><summary className="cursor-pointer">{c.compactArchive}</summary><ol className="list-decimal pl-5 mt-2 space-y-2">{c.compactOriginal.map(text=><li key={text}>{text}</li>)}</ol></details>
    <p className="text-sm text-muted">{c.compactQuestion}</p>
  </div>
}
