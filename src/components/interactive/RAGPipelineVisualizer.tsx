'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { retrieve, searchTerms } from '@/lib/learning/retrieval'

const corpus = {
  de: [
    {id:1,title:'Frankreich',content:'Paris ist die Hauptstadt von Frankreich. In Paris stehen der Eiffelturm und der Louvre.'},
    {id:2,title:'Deutschland',content:'Berlin ist die Hauptstadt von Deutschland. Das Brandenburger Tor steht in Berlin.'},
    {id:3,title:'Einstein',content:'Albert Einstein entwickelte die Relativitätstheorie. E = mc² beschreibt den Zusammenhang zwischen Masse und Energie.'},
    {id:4,title:'Künstliche Intelligenz',content:'Künstliche Intelligenz (KI) umfasst Verfahren für Aufgaben wie Mustererkennung, Vorhersagen und Sprachverarbeitung.'},
  ],
  en: [
    {id:1,title:'France',content:'Paris is the capital of France. The Eiffel Tower and the Louvre are in Paris.'},
    {id:2,title:'Germany',content:'Berlin is the capital of Germany. The Brandenburg Gate is in Berlin.'},
    {id:3,title:'Einstein',content:'Albert Einstein developed the theory of relativity. E = mc² describes the relation between mass and energy.'},
    {id:4,title:'Artificial intelligence',content:'Artificial intelligence (AI) includes methods for tasks such as pattern recognition, prediction and language processing.'},
  ],
}
export function RAGPipelineVisualizer() {
  const {locale}=useTranslation(); const de=locale==='de'
  const [query,setQuery]=useState('')
  const [submitted,setSubmitted]=useState<string|null>(null)
  const documents=corpus[de?'de':'en']
  const hits=submitted===null?[]:retrieve(submitted,documents)
  const selected=hits.slice(0,2)
  const presets=de?['Was ist die Hauptstadt von Frankreich?','Erkläre Einstein','Was ist KI?','Wie ist das Wetter morgen?']:['What is the capital of France?','Tell me about Einstein','What is AI?','What is tomorrow’s weather?']
  return <section className="rounded-2xl border border-border p-4 sm:p-6 space-y-5">
    <h3 className="text-xl font-semibold">{de?'Lokales Retrieval nachvollziehen':'Inspect local retrieval'}</h3>
    <p className="text-sm text-muted">{de?'Diese Demo sucht nach gleichen Wörtern in vier Dokumenten. Sie berechnet keine Embeddings und generiert keine Modellantwort. Du siehst Suchbegriffe, Treffer und den daraus gebauten Prompt. Probiere auch Synonyme oder eine Frage ohne passende Quelle.':'This demo finds exact words in four documents. It does not calculate embeddings or generate model answers. Inspect search terms, matches and the assembled prompt. Try synonyms or a question with no matching source.'}</p>
    <details className="rounded-lg border border-border p-3"><summary className="cursor-pointer">{de?'Dokumente ansehen':'Inspect documents'}</summary>{documents.map(doc=><div key={doc.id} className="mt-3 text-sm"><strong>[{doc.id}] {doc.title}</strong><p className="text-muted">{doc.content}</p></div>)}</details>
    <form onSubmit={e=>{e.preventDefault();setSubmitted(query)}} className="space-y-3"><label className="block text-sm">{de?'Frage':'Question'}<input className="block w-full min-w-0 mt-2 rounded border border-border bg-background px-3 py-3" value={query} onChange={e=>{setQuery(e.target.value);setSubmitted(null)}}/></label><button className="min-h-11 rounded-lg px-4 border border-primary/40 bg-primary/10" disabled={!query.trim()}>{de?'Quellen suchen':'Retrieve sources'}</button></form>
    <div className="flex flex-wrap gap-2">{presets.map(q=><button key={q} className="text-xs min-h-11 px-3 rounded-lg border border-border" onClick={()=>{setQuery(q);setSubmitted(q)}}>{q}</button>)}</div>
    {submitted!==null && <div className="space-y-4" aria-live="polite">
      <p className="text-sm text-muted">{de?'Suchbegriffe':'Search terms'}: {searchTerms(submitted).join(', ')||'∅'}</p>
      <div><h4 className="font-semibold">{de?'Treffer nach Wortüberschneidung':'Matches ranked by word overlap'}</h4>{hits.length?hits.map(doc=><p key={doc.id} className="text-sm py-2 border-b border-border">[{doc.id}] {doc.title}: {doc.matches.length} {de?'Treffer':'matches'} ({doc.matches.join(', ')})</p>):<p className="text-sm text-muted">{de?'Keine passende Quelle. Prüfe Suchbegriffe und Dokumentbestand.':'No matching source. Check the search terms and available documents.'}</p>}</div>
      {selected.length>0&&<><h4 className="font-semibold">{de?'Prompt mit maximal zwei Quellen':'Prompt with at most two sources'}</h4><pre className="whitespace-pre-wrap break-words rounded-lg bg-background p-4 text-xs">{(de?'Beantworte die Frage anhand der Quellen. Belege Aussagen mit [ID]. Fehlt die Antwort, sage das.':'Answer using the sources. Cite claims with [ID]. If the answer is missing, say so.')+'\n\n'+selected.map(doc=>`[${doc.id}] ${doc.content}`).join('\n')+'\n\n'+submitted}</pre><p className="text-sm text-muted">{de?'Erst ein Sprachmodell würde aus diesem Prompt eine Antwort erzeugen. Auch ein Worttreffer garantiert noch nicht, dass die Quelle die Frage beantwortet.':'A language model would still need to generate an answer from this prompt. A word match does not guarantee that the source answers the question.'}</p></>}
    </div>}
  </section>
}
