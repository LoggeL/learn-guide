'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { InspectionImage, LABEL_CROP } from './InspectionImage'

export function VisualChallengesDemo() {
  const { locale }=useTranslation(); const de=locale==='de'
  const [exercise,setExercise]=useState(0)
  const [zoom,setZoom]=useState(false)
  const [reveal,setReveal]=useState(false)
  const questions=de ? ['Wie viele Schraubenköpfe sind sichtbar?', 'Welche Farbe hat die mittlere Leuchte?', 'Welche Seriennummer steht auf dem Etikett?'] : ['How many screw heads are visible?', 'What color is the middle light?', 'What serial number is printed on the label?']
  const answers=de ? ['Vier, jeweils einer an jeder Ecke der Frontplatte.', 'Bernsteinfarben. Links und rechts davon ist jeweils eine blaue Leuchte.', 'SN-4827-XK. Darunter steht 24 V DC.'] : ['Four, one at each corner of the faceplate.', 'Amber, with a blue light on each side.', 'SN-4827-XK. Below it: 24 V DC.']
  const crop=exercise===2 ? LABEL_CROP : exercise===1 ? [420,260,690,200] : [290,120,950,745]
  return <section className="rounded-2xl border border-border p-4 sm:p-6 space-y-5">
    <h2 className="text-xl font-semibold">{de?'Am Bild prüfen':'Check the image'}</h2>
    <p className="text-sm text-muted">{de?'Generiertes Referenzbild, visuell geprüft am 13.09.2026. Die Antworten sind Annotationen dieses Bildes. Hier werden keine Sprachmodelle getestet und keine Modellantworten nachgestellt.':'Generated reference image, visually checked on 2026-09-13. Answers are annotations of this image. This exercise does not run language models or simulate model answers.'}</p>
    <div className="flex flex-wrap gap-2">{questions.map((_,i)=><button key={i} aria-pressed={exercise===i} className={`min-h-11 px-4 rounded-lg border ${exercise===i?'border-primary bg-primary/15':'border-border'}`} onClick={()=>{setExercise(i);setReveal(false);setZoom(false)}}>{[de?'Zählen':'Counting',de?'Position':'Position',de?'Schrift':'Text'][i]}</button>)}</div>
    <h3 className="font-medium">{questions[exercise]}</h3>
    <InspectionImage crop={zoom?crop:undefined} alt={de?'Prüfgehäuse mit Leuchten, Schrauben und Etikett':'Inspection box with lights, screws and a label'} />
    <div className="flex flex-wrap gap-3"><button className="min-h-11 rounded-lg border border-border px-4" onClick={()=>setZoom(!zoom)}>{zoom?(de?'Ganzes Bild':'Full image'):(de?'Ausschnitt vergrößern':'Enlarge crop')}</button><button className="min-h-11 rounded-lg border border-primary/40 px-4 bg-primary/10" onClick={()=>setReveal(!reveal)}>{de?'Referenz ein-/ausblenden':'Toggle reference'}</button></div>
    {reveal && <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4" role="status">{answers[exercise]}</p>}
    <p className="text-sm text-muted">{de?'Vergrößern kann vorhandene Details zugänglich machen. Wenn Pixel bereits durch eine zu kleine Eingabe verloren gingen, kann ein Crop sie nicht wiederherstellen. Für einen Modellvergleich müsstest du Bild, Frage, Modellversion und Originalantworten speichern und gegen dieselbe Referenz prüfen.':'Enlarging a crop can make existing detail accessible. It cannot recover pixels already lost in a low-resolution input. A model comparison needs the image, question, model version and original responses, checked against this same reference.'}</p>
  </section>
}
