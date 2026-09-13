'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { InspectionImage, LABEL_CROP } from './InspectionImage'

export function AgenticVisionDemo() {
  const {locale}=useTranslation();const de=locale==='de'
  const [step,setStep]=useState(0)
  const names=de?['Frage festlegen','Bildstelle wählen','Ausschnitt prüfen','Antwort belegen']:['Set question','Choose region','Inspect crop','Support answer']
  const descriptions=de?[
    'Welche Seriennummer steht auf dem Gehäuse? Die Aufgabe verlangt exakte Zeichen.',
    'Das Etikett liegt in der unteren Bildhälfte. Der hier vorgegebene Prüfplan wählt x=600, y=580, Breite=350, Höhe=190 Pixel.',
    'Die Ansicht zeigt tatsächlich diese Pixel aus dem Originalbild. Lies die Zeichen und prüfe Bindestriche sowie ähnliche Zeichen einzeln.',
    'Referenzannotation: SN-4827-XK. Der gezeigte Ausschnitt belegt die Zeichenfolge; 24 V DC ist die zweite Zeile und gehört nicht zur Seriennummer.'
  ]:[
    'What serial number is on the box? The task requires exact characters.',
    'The label is in the lower half. This supplied inspection plan chooses x=600, y=580, width=350, height=190 pixels.',
    'The view actually displays those pixels from the original. Read the characters and check hyphens and similar-looking characters individually.',
    'Reference annotation: SN-4827-XK. The crop supports this string; 24 V DC is the second line and is not part of the serial number.'
  ]
  return <section className="rounded-2xl border border-border p-4 sm:p-6 space-y-5">
    <h2 className="text-xl font-semibold">{de?'Ein überprüfbarer Bild-Workflow':'An inspectable image workflow'}</h2>
    <p className="text-sm text-muted">{de?'Vorgegebener Ablauf mit einem generierten Referenzbild. Der Crop ist echt; Planung und Referenzantwort sind redaktionell vorgegeben. Es laufen weder ein Vision-Modell noch OCR.':'A supplied workflow using a generated reference image. The crop is real; the plan and reference answer are authored. No vision model or OCR runs here.'}</p>
    <div className="flex flex-wrap gap-2">{names.map((name,i)=><button key={name} aria-pressed={step===i} className={`text-sm min-h-11 px-3 rounded border ${i===step?'border-primary bg-primary/15':'border-border'}`} onClick={()=>setStep(i)}>{i+1}. {name}</button>)}</div>
    <InspectionImage crop={step>=2?LABEL_CROP:undefined} alt={de?'Referenzgehäuse mit Seriennummer-Etikett':'Reference box with serial-number label'}>{step===1&&<rect x={600} y={580} width={350} height={190} fill="none" stroke="#e11d48" strokeWidth={8}/>}</InspectionImage>
    <p className="text-muted" role="status">{descriptions[step]}</p>
    <p className="text-xs text-muted">{de?'Ein echter Agent müsste die Region aus dem Bild bestimmen, ein Crop-Werkzeug aufrufen, dessen Ausgabe lesen und bei Unsicherheit erneut prüfen. Mehr Schritte können helfen, kosten aber Zeit und garantieren kein korrektes Ergebnis.':'A real agent would locate the region, call a crop tool, read its output and check again if uncertain. Extra steps can help, but cost time and do not guarantee correctness.'}</p>
  </section>
}
