'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { rewardCandidates, rewardCases, checkReward } from '@/lib/agent-demo-models'
export function VerifiableRewardsSimulator() {
  const { t } = useTranslation(); const c = t.agentReview
  const [candidate, setCandidate] = useState<keyof typeof rewardCandidates>('constant')
  const [exact, setExact] = useState(true); const [hidden, setHidden] = useState(false)
  const cases = hidden ? rewardCases : rewardCases.slice(0, 1)
  const results = cases.map(values => ({ values, ...checkReward(candidate, values, exact) }))
  const code = { sum: 'values => values.reduce((sum, value) => sum + value, 0)', constant: 'values => 3', length: 'values => values.length' }
  return <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
    <h3 className="text-xl font-semibold">{c.rewardTitle}</h3><p className="text-sm text-muted">{c.rewardNote}</p>
    <label className="block">{c.candidate}<select value={candidate} onChange={e => setCandidate(e.target.value as keyof typeof rewardCandidates)} className="block bg-background border border-border rounded p-2 mt-2 w-full">{(['sum','constant','length'] as const).map(key => <option key={key} value={key}>{c[key]}</option>)}</select></label>
    <pre className="whitespace-pre-wrap break-words p-3 bg-background rounded text-sm">{code[candidate]}</pre>
    <label className="block">{c.checker}<select value={exact ? 'exact' : 'weak'} onChange={e => setExact(e.target.value === 'exact')} className="block bg-background border border-border rounded p-2 mt-2 w-full"><option value="exact">{c.exact}</option><option value="weak">{c.weak}</option></select></label>
    <label className="flex gap-2"><input type="checkbox" checked={hidden} onChange={e => setHidden(e.target.checked)} />{c.hidden}</label>
    <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr>{[c.test,c.input,c.expected,c.actual,c.result].map(s => <th className="p-2" key={s}>{s}</th>)}</tr></thead><tbody>{results.map((r,i) => <tr className="border-t border-border" key={i}><td className="p-2">{i === 0 ? c.public : c.heldOut}</td><td className="p-2 font-mono">{JSON.stringify(r.values)}</td><td className="p-2">{r.expected}</td><td className="p-2">{r.actual}</td><td className="p-2">{r.passed ? c.passed : c.failed}</td></tr>)}</tbody></table></div>
    <p role="status">{c.passes}: {results.filter(r => r.passed).length} / {results.length}</p><p className="text-sm text-muted">{c.rewardLesson}</p>
  </div>
}
