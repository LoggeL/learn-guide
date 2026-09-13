'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
export function PromptComparisonDemo() {
  const { t } = useTranslation(); const c = t.agentReview
  const [source, setSource] = useState(false)
  const [format, setFormat] = useState(false)
  const [check, setCheck] = useState(false)
  const prompt = [c.promptTask, source && `${c.source}:\n${c.promptSource}`, format && c.formatInstruction, check && c.checkInstruction].filter(Boolean).join('\n\n')
  return <div className="rounded-xl border border-border bg-surface p-5 space-y-5">
    <h3 className="text-xl font-semibold">{c.promptTitle}</h3><p className="text-sm text-muted">{c.promptNote}</p>
    <blockquote className="border-l-2 border-cyan-400 pl-4"><strong>{c.source}</strong><p>{c.promptSource}</p></blockquote>
    <div className="space-y-2">{[[source, setSource, c.includeSource], [format, setFormat, c.includeFormat], [check, setCheck, c.includeCheck]].map(([value, update, label], i) => <label className="flex gap-3 items-center" key={i}><input type="checkbox" checked={value as boolean} onChange={e => (update as (v:boolean)=>void)(e.target.checked)} />{label as string}</label>)}</div>
    <pre className="whitespace-pre-wrap break-words rounded-lg bg-background p-4 text-sm">{prompt}</pre>
    <p className="text-sm text-muted">{c.promptChecks}</p>
  </div>
}
