'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { skillRules, matchSkill } from '@/lib/agent-demo-models'
export function SkillComposerDemo() {
  const { t } = useTranslation(); const c = t.agentReview; const s = t.skillComposer
  const [input, setInput] = useState(''); const [selected, setSelected] = useState(0); const [loaded, setLoaded] = useState(false)
  const skills = [{name:s.codeReviewSkill,description:s.codeReviewDesc},{name:s.documentationSkill,description:s.documentationDesc},{name:s.gitWorkflowSkill,description:s.gitWorkflowDesc},{name:s.explainSkill,description:s.explainDesc}]
  const matches = matchSkill(input)
  const update = (value: string) => { setInput(value); const match = matchSkill(value)[0]; if (match) setSelected(match.index); setLoaded(false) }
  const metadata = `---\nname: ${skillRules[selected].id}\ndescription: ${JSON.stringify(skills[selected].description)}\n---`
  return <div className="rounded-xl border border-border bg-surface p-5 space-y-5">
    <h3 className="text-xl font-semibold">{c.skillTitle}</h3><p className="text-sm text-muted">{c.skillNote}</p>
    <div className="flex flex-wrap gap-2">{[s.exampleReview,s.exampleDocs,s.exampleGit,s.exampleExplain].map(text => <button className="px-3 py-2 rounded border border-border text-sm" key={text} onClick={() => update(text)}>{text}</button>)}</div>
    <label className="block">{c.skillRequest}<input value={input} onChange={e => update(e.target.value)} className="block w-full mt-2 p-3 rounded border border-border bg-background" /></label>
    <div role="status" className="text-sm">{matches.length ? matches.map(m => <p key={m.id}>{skills[m.index].name}: {c.skillRule} <code>{m.matched}</code></p>) : c.noSkill}</div>
    <h4 className="font-semibold">{c.skillMetadata}</h4><div className="grid md:grid-cols-2 gap-3">{skills.map((skill,index) => <button className={`text-left p-3 rounded border ${selected === index ? 'border-primary' : 'border-border'}`} key={index} onClick={() => {setSelected(index);setLoaded(false)}}><strong>{skill.name}</strong><p className="text-sm text-muted">{skill.description}</p><code className="text-xs break-words">{skillRules[index].words.join(', ')}</code></button>)}</div>
    <pre className="whitespace-pre-wrap break-words bg-background p-3 rounded text-sm">{metadata}</pre>
    <button className="px-4 py-2 bg-primary/20 rounded" onClick={() => setLoaded(!loaded)}>{loaded ? c.hide : c.skillLoad}</button>
    {loaded && <section className="p-4 rounded border border-primary/40"><h4>{c.skillBody}</h4><p className="mt-2 text-sm">{c.skillInstructions[selected]}</p></section>}
  </div>
}
