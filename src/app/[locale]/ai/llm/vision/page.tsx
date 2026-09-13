'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { PatchGridVisualizer } from '@/components/interactive/PatchGridVisualizer'
import { useTranslation } from '@/lib/i18n/context'

export default function VisionPage() {
 const {t,locale}=useTranslation();const de=locale==='de'
 return <TopicLayout topicId="vision" title={t.vision.title} description={t.vision.description} breadcrumbs={[{label:t.categories.ai,href:'/'},{label:t.categories.llm,href:'/ai/llm'},{label:t.vision.title}]}>
   <section className="rounded-2xl border border-border p-5 sm:p-7 space-y-4"><h2 className="text-2xl font-semibold">{t.vision.whatIs}</h2><p className="text-muted">{t.vision.whatIsDesc}</p></section>
   <section className="space-y-4"><h2 className="text-2xl font-semibold">{t.vision.vitTitle}</h2><p className="text-muted">{t.vision.vitDesc}</p><div className="grid gap-4 sm:grid-cols-2">{[[t.vision.vitStep1,t.vision.vitStep1Desc],[t.vision.vitStep2,t.vision.vitStep2Desc],[t.vision.vitStep3,t.vision.vitStep3Desc],[t.vision.vitStep4,t.vision.vitStep4Desc]].map(([title,body],i)=><div key={title} className="rounded-xl border border-border p-4"><h3 className="font-semibold mb-2">{i+1}. {title}</h3><p className="text-sm text-muted">{body}</p></div>)}</div><a href="https://arxiv.org/abs/2010.11929" className="text-sm text-primary-light underline" target="_blank" rel="noopener noreferrer">Dosovitskiy et al.: An Image is Worth 16x16 Words</a></section>
   <PatchGridVisualizer />
   <section className="rounded-2xl border border-border p-5 sm:p-7 space-y-4"><h2 className="text-2xl font-semibold">{de?'API-Bildtoken sind eine eigene Zählregel':'API image tokens use separate accounting rules'}</h2><p className="text-sm text-muted">{de?'OpenAI-Dokumentation, geprüft am 13.09.2026. Abrechnungspatches sind nicht automatisch die Patches des Vision-Encoders.':'OpenAI documentation, checked 2026-09-13. Billing patches are not necessarily the vision encoder’s patches.'}</p>
     <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="py-3">{de?'Modell / Modus':'Model / mode'}</th><th className="px-3">{de?'Beispiel oder Grenze':'Example or limit'}</th></tr></thead><tbody>
       <tr className="border-t border-border"><th className="py-3 font-medium">GPT-5-mini</th><td className="px-3">1024² px → 1024 × 1.2 ≈ 1229 {de?'Bildtoken':'image tokens'}</td></tr>
       <tr className="border-t border-border"><th className="py-3 font-medium">GPT-5.4 / original</th><td className="px-3">6000 px; 10,000 {de?'Patches als Skalierungsbudget':'patch resizing budget'}</td></tr>
       <tr className="border-t border-border"><th className="py-3 font-medium">GPT-5.6-sol/terra/luna / original</th><td className="px-3">65,535 px; &gt;30,000 {de?'Patches werden abgewiesen':'patches rejected'}</td></tr>
     </tbody></table></div>
     <p className="text-sm text-muted">{de?'Genaue Skalierung, unterstützte Modi und Grenzen hängen vom Modell ab. Bildtoken, Text und Ausgabe müssen ins Kontextbudget passen.':'Exact resizing, supported modes and limits depend on the model. Image tokens, text and output must fit the context budget.'}</p>
     <a className="text-primary-light underline" href="https://developers.openai.com/api/docs/guides/images-vision" target="_blank" rel="noopener noreferrer">{de?'Aktuelle Regeln und Kostenrechner':'Current rules and cost calculator'}</a>
   </section>
   <section className="rounded-2xl border border-border p-5 sm:p-7 space-y-4"><h2 className="text-2xl font-semibold">{de?'Welche Details braucht die Aufgabe?':'Which details does the task need?'}</h2><p className="text-muted">{de?'Eine grobe Szenenbeschreibung und eine exakte Seriennummer verlangen unterschiedliche Details. Bewahre das Original auf, wähle passende Ausschnitte und prüfe das Ergebnis gegen eine Referenz. Ein höher aufgelöstes Bild kann helfen, garantiert aber keine korrekte Antwort.':'A scene description and an exact serial number need different detail. Keep the original, choose useful crops and check the result against a reference. Higher resolution may help, but does not guarantee a correct answer.'}</p></section>
 </TopicLayout>
}
