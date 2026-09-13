'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
export function ContextAnatomyVisualizer() {
  const {t,locale}=useTranslation(); const c=t.agentReview; const a=t.agentContext
  const [expanded,setExpanded]=useState(0)
  const layers=[
    {title:a.systemPrompt,desc:a.systemPromptDesc,tokens:850,example:c.checkInstruction},
    {title:a.toolDefs,desc:a.toolDefsDesc,tokens:1200,example:JSON.stringify({name:'read_file',description:c.schemaRead,parameters:{type:'object',properties:{path:{type:'string'}},required:['path']}},null,2)},
    {title:a.retrieved,desc:a.retrievedDesc,tokens:2500,example:c.promptSource},
    {title:a.history,desc:a.historyDesc,tokens:3200,example:c.promptTask},
  ]
  const colors=['bg-purple-400','bg-orange-400','bg-cyan-400','bg-emerald-400']
  return <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
    <h3 className="text-xl font-semibold">{a.title}</h3><p className="text-sm text-muted">{c.contextNote}</p>
    <p>{(7750).toLocaleString(locale)} / {(8192).toLocaleString(locale)} tokens</p><div className="flex h-8 rounded overflow-hidden bg-background">{layers.map((layer,i)=><button key={layer.title} aria-label={layer.title} onClick={()=>setExpanded(i)} className={colors[i]} style={{width:`${100*layer.tokens/8192}%`}}/>)}</div>
    <div className="space-y-3">{layers.map((layer,i)=><section key={layer.title} className="border border-border rounded-lg p-3"><button className="text-left w-full flex justify-between gap-3" onClick={()=>setExpanded(expanded===i?-1:i)} aria-expanded={expanded===i}><span>{layer.title}</span><span>{layer.tokens.toLocaleString(locale)} tokens</span></button>{expanded===i&&<div className="mt-3"><p className="text-sm text-muted mb-2">{layer.desc}</p><pre className="whitespace-pre-wrap break-words bg-background p-3 rounded text-sm">{layer.example}</pre></div>}</section>)}</div>
  </div>
}
