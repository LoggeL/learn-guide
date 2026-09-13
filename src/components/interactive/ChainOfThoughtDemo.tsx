'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
export function ChainOfThoughtDemo() {
  const { t } = useTranslation(); const c = t.agentReview
  const [answer, setAnswer] = useState('10')
  const ball = Number(answer); const valid = answer.trim() !== '' && Number.isFinite(ball) && ball >= 0
  const bat = ball + 100; const total = ball + bat; const passes = valid && total === 110
  return <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
    <h3 className="text-xl font-semibold">{c.reasoningTitle}</h3><p className="text-muted text-sm">{c.reasoningNote}</p><p>{c.puzzle}</p>
    <label className="block">{c.ball}<input type="number" min="0" step="1" value={answer} onChange={e => setAnswer(e.target.value)} className="block rounded border border-border bg-background px-3 py-2 mt-2 w-40" /></label>
    {valid && <dl className="space-y-2 font-mono"><div><dt>{c.bat}</dt><dd>{ball} + 100 = {bat}</dd></div><div><dt>{c.total}</dt><dd>{ball} + {bat} = {total} {passes ? '=' : '≠'} 110</dd></div></dl>}
    <p role="status" className={passes ? 'text-emerald-400' : 'text-orange-400'}>{passes ? c.correct : c.wrong}</p>
  </div>
}
