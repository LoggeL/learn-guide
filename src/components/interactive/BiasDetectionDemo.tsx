'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { biasGroups, groupCounts } from '@/lib/agent-demo-models'
export function BiasDetectionDemo() {
  const { t } = useTranslation(); const c = t.agentReview
  const [threshold, setThreshold] = useState(50)
  return <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
    <h3 className="text-xl font-semibold">{c.biasTitle}</h3><p className="text-sm text-muted">{c.biasNote}</p>
    <label className="block">{c.threshold}: {threshold}<input className="block w-full mt-2" type="range" min="0" max="100" step="10" value={threshold} onChange={e => setThreshold(Number(e.target.value))}/></label>
    <div className="grid xl:grid-cols-2 gap-5">{biasGroups.map((group, index) => { const r = groupCounts(group, threshold); return <section className="border border-border rounded-lg p-3" key={index}><h4 className="font-semibold mb-2">{c.group} {index === 0 ? 'A' : 'B'}</h4><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr><th>{c.score}</th><th>{c.label}</th><th>{c.selected}</th></tr></thead><tbody>{group.map((row, i) => <tr key={i}><td>{row.score}</td><td>{row.positive ? c.yes : c.no}</td><td>{row.score >= threshold ? c.yes : c.no}</td></tr>)}</tbody></table></div><dl className="text-sm mt-4 space-y-2"><div><dt>{c.tpr}</dt><dd>{r.tp}/{r.positives} = {(100*r.tp/r.positives).toFixed(0)}%</dd></div><div><dt>{c.fpr}</dt><dd>{r.fp}/{r.negatives} = {(100*r.fp/r.negatives).toFixed(0)}%</dd></div><div><dt>{c.selection}</dt><dd>{r.selected}/{group.length} = {(100*r.selected/group.length).toFixed(0)}%</dd></div></dl></section>})}</div>
    <p className="text-sm text-muted">{c.biasLesson}</p>
  </div>
}
