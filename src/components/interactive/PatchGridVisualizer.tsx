'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { InspectionImage } from './InspectionImage'

export function PatchGridVisualizer() {
  const { locale }=useTranslation(); const de=locale==='de'
  const [patch,setPatch]=useState(256)
  const [index,setIndex]=useState(15)
  const cols=Math.ceil(1536/patch),rows=Math.ceil(1024/patch)
  const selected=Math.min(index,cols*rows-1)
  const x=(selected%cols)*patch,y=Math.floor(selected/cols)*patch
  return <section className="rounded-2xl border border-border p-4 sm:p-6 space-y-4">
    <h2 className="text-xl font-semibold">{de?'Ein Bild, viele Patches':'One image, many patches'}</h2>
    <p className="text-sm text-muted">{de?'Dasselbe generierte Referenzbild, hier in große Patches zerlegt. 64, 128 und 256 Pixel machen das Raster gut sichtbar. Das sind Anschauungsgrößen, keine Architektur eines bestimmten Modells und keine API-Abrechnung.':'The same generated reference image, divided into large patches. Sizes of 64, 128 and 256 pixels keep the grid readable. These are teaching settings, not a specific model architecture or API billing rules.'}</p>
    <label className="block text-sm">{de?'Patch-Kantenlänge':'Patch side length'}<select value={patch} onChange={e=>{setPatch(+e.target.value);setIndex(0)}} className="ml-3 bg-background rounded border border-border px-3 py-2">{[64,128,256].map(n=><option key={n} value={n}>{n} px</option>)}</select></label>
    <InspectionImage alt={de?'Referenzbild mit auswählbarem Patch-Raster':'Reference image with selectable patch grid'}>
      {Array.from({length:cols*rows},(_,i)=><rect key={i} x={(i%cols)*patch} y={Math.floor(i/cols)*patch} width={patch} height={patch} fill={i===selected?'rgba(168,85,247,.35)':'transparent'} stroke={i===selected?'#fbbf24':'rgba(255,255,255,.7)'} strokeWidth={i===selected?6:2} onClick={()=>setIndex(i)} className="cursor-pointer" />)}
    </InspectionImage>
    <label className="block text-sm">{de?'Patch auswählen (auch mit Pfeiltasten)':'Select patch (arrow keys supported)'}: {selected+1} / {cols*rows}<input className="w-full mt-2" type="range" min="0" max={cols*rows-1} value={selected} onChange={e=>setIndex(+e.target.value)}/></label>
    <div className="grid sm:grid-cols-2 gap-4 items-start"><InspectionImage crop={[x,y,Math.min(patch,1536-x),Math.min(patch,1024-y)]} alt={de?'Ausgewählter Bildausschnitt':'Selected image patch'}/><div className="space-y-3 text-sm text-muted"><p>{cols} × {rows} = {cols*rows} {de?'Patches':'patches'}</p><p>{de?'Ein RGB-Patch mit P × P Pixeln enthält 3P² Zahlen. ViT flacht sie ab und projiziert sie mit einer gelernten Matrix in einen Embedding-Vektor. Dabei wird der Patch nicht einfach auf seine Durchschnittsfarbe reduziert.':'An RGB patch with P × P pixels contains 3P² values. ViT flattens them and applies a learned linear projection into an embedding vector. This does not simply average the patch into one color.'}</p><p>{de?'Das Raster zeigt nur die Zerlegung. Es berechnet keine gelernten Bild-Embeddings. Die Fähigkeit, kleine Schrift zu lesen, hängt auch von Auflösung, Projektion, Training und Aufgabe ab.':'This grid shows only the partition. It does not calculate learned image embeddings. Reading small text also depends on resolution, projection, training and task.'}</p></div></div>
  </section>
}
