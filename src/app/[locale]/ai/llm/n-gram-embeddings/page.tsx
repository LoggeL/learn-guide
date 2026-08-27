'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { NGramKeyExplorer } from '@/components/interactive/NGramKeyExplorer'
import { NGramInferenceStepper } from '@/components/interactive/NGramInferenceStepper'
import { useTranslation } from '@/lib/i18n/context'
import { Check, ExternalLink, TriangleAlert } from 'lucide-react'

export default function NGramEmbeddingsPage() {
  const { t } = useTranslation(); const c = t.nGramEmbeddings
  return <TopicLayout topicId="n-gram-embeddings" title={c.title} description={c.description} breadcrumbs={[{label:t.categories.ai,href:'/'},{label:t.categories.llm,href:'/ai/llm'},{label:c.title}]} prevTopic={{label:t.topicNames.mtp,href:'/ai/llm/mtp'}} nextTopic={{label:t.topicNames['speculative-decoding'],href:'/ai/llm/speculative-decoding'}}>
    <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8"><h2 className="text-2xl font-bold text-gradient">{c.whatTitle}</h2><p className="mt-4 text-lg leading-relaxed text-muted">{c.whatBody}</p><p className="mt-3 leading-relaxed text-muted">{c.trainingBody}</p></section>
    <NGramKeyExplorer copy={c.keyExplorer} />
    <section><h2 className="mb-5 text-2xl font-bold text-gradient">{c.caseTitle}</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{c.facts.map((x:string)=><div key={x} className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 font-mono text-sm text-cyan-200">{x}</div>)}</div><p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">{c.activeCaveat}</p></section>
    <NGramInferenceStepper copy={c.inference} />
    <section className="grid gap-4 md:grid-cols-2"><Panel title={c.whyTitle} items={c.benefits} good/><Panel title={c.limitsTitle} items={c.limits}/></section>
    <section className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 md:p-8"><h2 className="text-2xl font-bold text-purple-300">{c.notTitle}</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><div className="rounded-xl bg-background/70 p-4"><h3 className="font-bold text-text">{c.specTitle}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{c.specBody}</p></div><div className="rounded-xl bg-background/70 p-4"><h3 className="font-bold text-text">{c.mtpTitle}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{c.mtpBody}</p></div></div></section>
    <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8"><h2 className="text-2xl font-bold text-gradient">{c.evidenceTitle}</h2><p className="mt-3 leading-relaxed text-muted">{c.evidenceBody}</p></section>
    <section><h2 className="mb-4 text-2xl font-bold text-gradient">{c.sourcesTitle}</h2><div className="grid gap-3">{c.sources.map((s:{label:string;url:string})=><a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-between rounded-xl border border-border bg-surface px-4 text-primary-light hover:border-primary"><span>{s.label}</span><ExternalLink size={16}/></a>)}</div></section>
  </TopicLayout>
}
function Panel({title,items,good=false}:{title:string;items:string[];good?:boolean}) { const Icon=good?Check:TriangleAlert; return <div className={`rounded-2xl border p-6 ${good?'border-emerald-500/20 bg-emerald-500/5':'border-orange-500/20 bg-orange-500/5'}`}><h2 className="text-xl font-bold text-text">{title}</h2><ul className="mt-4 space-y-3">{items.map(x=><li key={x} className="flex gap-2 text-sm leading-relaxed text-muted"><Icon size={16} className={`mt-1 shrink-0 ${good?'text-emerald-300':'text-orange-300'}`}/>{x}</li>)}</ul></div> }
