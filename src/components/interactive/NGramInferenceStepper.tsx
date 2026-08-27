'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Cpu, Database, Layers3, MemoryStick } from 'lucide-react'

export type InferenceCopy = { title: string; description: string; previous: string; next: string; step: string; compute: string; memory: string; vector: string; steps: { title: string; body: string; detail: string; kind: string }[] }
const icons = [Cpu, MemoryStick, Database, Layers3]

export function NGramInferenceStepper({ copy }: { copy: InferenceCopy }) {
  const [active, setActive] = useState(0)
  const current = copy.steps[active]
  const compute = [20, 12, 8, 100][active]
  const memory = [8, 100, 75, 20][active]
  const Icon = icons[active]
  return <section className="rounded-2xl border border-border bg-surface/50 p-5 md:p-7" aria-live="polite">
    <h2 className="font-heading text-2xl font-bold text-gradient">{copy.title}</h2><p className="mt-2 text-muted">{copy.description}</p>
    <ol className="mt-6 grid gap-2 sm:grid-cols-4">{copy.steps.map((item, i) => <li key={item.title}><button type="button" onClick={() => setActive(i)} aria-current={i === active ? 'step' : undefined} className={`h-full min-h-16 w-full rounded-xl border p-3 text-left text-sm ${i === active ? 'border-primary bg-primary/15 text-text' : 'border-border bg-background text-muted'}`}><span className="mr-2 font-mono text-primary-light">{i+1}</span>{item.title}</button></li>)}</ol>
    <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-xl border border-primary/20 bg-background p-5"><div className="mb-4 flex items-center gap-3"><span className="rounded-xl bg-primary/15 p-3 text-primary-light"><Icon /></span><div><p className="text-xs uppercase tracking-wider text-muted">{copy.step} {active+1}/4 · {current.kind}</p><h3 className="font-heading text-xl font-bold text-text">{current.title}</h3></div></div><p className="leading-relaxed text-muted">{current.body}</p><code className="mt-4 block overflow-x-auto rounded-lg bg-surface p-3 text-sm text-cyan-300">{current.detail}</code>{active === 2 && <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 font-mono text-sm text-emerald-300">{copy.vector}: [−0.4, 1.1, 0.2, −0.7, …] → h₂ + eₙ₋gram</div>}</div>
      <div className="rounded-xl border border-border bg-background p-5"><Meter label={copy.compute} value={compute} color="bg-purple-400"/><Meter label={copy.memory} value={memory} color="bg-cyan-400"/><p className="mt-5 text-xs leading-relaxed text-muted">{active < 3 ? copy.memory : copy.compute}: {current.kind}</p></div>
    </div>
    <div className="mt-4 flex justify-between"><button type="button" disabled={active === 0} onClick={() => setActive(v => v-1)} className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-muted disabled:opacity-40"><ArrowLeft size={16}/>{copy.previous}</button><button type="button" disabled={active === 3} onClick={() => setActive(v => v+1)} className="flex min-h-11 items-center gap-2 rounded-lg bg-primary/20 px-4 text-primary-light disabled:opacity-40">{copy.next}<ArrowRight size={16}/></button></div>
  </section>
}
function Meter({label,value,color}:{label:string;value:number;color:string}) { return <div className="mb-5"><div className="mb-2 flex justify-between text-sm"><span className="text-muted">{label}</span><span className="font-mono text-text">{value}%</span></div><div className="h-3 rounded-full bg-surface"><div className={`h-full rounded-full transition-all ${color}`} style={{width:`${value}%`}}/></div></div> }
