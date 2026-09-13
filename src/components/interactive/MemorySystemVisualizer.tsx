'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { retrieveNotes } from '@/lib/agent-demo-models'
export function MemorySystemVisualizer() {
  const { t } = useTranslation(); const c = t.agentReview
  const [notes, setNotes] = useState(() => c.memorySeed.map((text,id) => ({id,text})))
  const [saved, setSaved] = useState<{id:number;text:string}[]>([])
  const [nextId, setNextId] = useState(3); const [note, setNote] = useState(''); const [query, setQuery] = useState('')
  const results = retrieveNotes(saved, query)
  const add = () => { if (!note.trim()) return; setNotes([...notes, {id:nextId,text:note.trim()}].slice(-5)); setNextId(nextId+1);setNote('') }
  return <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
    <h3 className="text-xl font-semibold">{c.memoryTitle}</h3><p className="text-sm text-muted">{c.memoryNote}</p>
    <form onSubmit={e => {e.preventDefault();add()}} className="flex flex-wrap gap-2"><label className="flex-1 min-w-0">{c.note}<input value={note} onChange={e => setNote(e.target.value)} maxLength={500} className="block w-full mt-1 p-2 rounded bg-background border border-border"/></label><button className="self-end px-3 py-2 border border-border rounded" disabled={!note.trim()}>{c.add}</button></form>
    <h4 className="font-semibold">{c.recent}</h4><ul className="space-y-2">{notes.map(item => <li className="p-3 border border-border rounded flex gap-3 flex-wrap justify-between" key={item.id}><span>{item.text}</span><button className="text-sm text-primary-light" disabled={saved.some(s => s.id === item.id)} onClick={() => setSaved([...saved,item])}>{saved.some(s => s.id === item.id) ? c.savedState : c.save}</button></li>)}</ul>
    <label className="block">{c.query}<input value={query} onChange={e => setQuery(e.target.value)} className="block w-full mt-1 p-2 rounded bg-background border border-border"/></label>
    <h4 className="font-semibold">{c.saved}</h4><ul className="space-y-2">{results.map(item => <li className="p-3 border border-border rounded" key={item.id}><p>{item.text}</p>{query && <p className="text-sm text-muted">{c.matches}: {item.matched.join(', ')}</p>}<button className="text-sm text-orange-400 mt-2" onClick={() => setSaved(saved.filter(s => s.id !== item.id))}>{c.remove}</button></li>)}</ul>{!results.length && <p className="text-sm text-muted">{c.memoryEmpty}</p>}
    <p className="text-sm text-muted">{c.memoryLesson}</p><button className="text-sm border border-border rounded px-3 py-2" onClick={() => {setNotes(c.memorySeed.map((text,id) => ({id,text})));setSaved([]);setNextId(3);setNote('');setQuery('')}}>{c.reset}</button>
  </div>
}
