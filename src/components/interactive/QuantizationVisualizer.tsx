'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n/context'
import { uniformQuantize } from '@/lib/llmLearningMath'

const weights = [-2.4, -1.8, -0.7, -0.25, 0, 0.3, 0.9, 1.6, 2.7]
const copy = {
  en: {
    title: 'Round actual weights', note: 'A uniform toy quantizer with fixed example weights. Change the bit width and clipping range to inspect rounding and clipping error. This does not predict model accuracy or perplexity.',
    bits: 'Bits per weight', range: 'Represented range', original: 'Original weight', code: 'Integer code', reconstructed: 'Reconstructed', error: 'Error', levels: 'Representable values', mse: 'Mean squared weight error',
    params: 'Model parameters (billions)', memory: 'Raw weight storage', memoryNote: 'Decimal GB. This counts only packed weights: parameters × bits / 8. Scales, metadata, activations, runtime buffers and the KV cache need additional memory. CPU offloading can reduce GPU residency at a latency cost.',
    formula: 'Δ = (max − min) / (2ᵇ − 1); q = clamp(round((w − min) / Δ), 0, 2ᵇ − 1); ŵ = min + qΔ.',
    limit: 'The endpoints are included, giving exactly 2ᵇ available values. Zero need not be one of them in this simplified grid. Production formats use other grids, group scales and calibration methods. Weight error alone is not a measure of task quality.',
  },
  de: {
    title: 'Echte Gewichtswerte runden', note: 'Ein gleichmäßiger Spielzeugquantisierer mit festen Beispielgewichten. Ändere Bitbreite und Wertebereich, um Rundungs- und Clippingfehler zu untersuchen. Daraus folgt keine Modellgenauigkeit oder Perplexität.',
    bits: 'Bits pro Gewicht', range: 'Darstellbarer Bereich', original: 'Originalgewicht', code: 'Ganzzahlcode', reconstructed: 'Rekonstruiert', error: 'Fehler', levels: 'Darstellbare Werte', mse: 'Mittlerer quadratischer Gewichtsfehler',
    params: 'Modellparameter (Milliarden)', memory: 'Roher Gewichtsspeicher', memoryNote: 'Dezimale GB. Gezählt werden nur gepackte Gewichte: Parameter × Bits / 8. Skalen, Metadaten, Aktivierungen, Laufzeitpuffer und KV-Cache benötigen zusätzlichen Speicher. CPU-Offloading kann GPU-Speicher sparen, kostet aber gegebenenfalls Latenz.',
    formula: 'Δ = (max − min) / (2ᵇ − 1); q = clamp(round((w − min) / Δ), 0, 2ᵇ − 1); ŵ = min + qΔ.',
    limit: 'Mit beiden Endpunkten gibt es genau 2ᵇ mögliche Werte. Null muss in diesem vereinfachten Raster nicht enthalten sein. Produktive Formate nutzen andere Raster, Gruppenskalen und Kalibrierung. Gewichtsfehler allein misst keine Aufgabenqualität.',
  },
}

export function QuantizationVisualizer() {
  const { locale } = useLocale()
  const c = copy[locale === 'de' ? 'de' : 'en']
  const [bits, setBits] = useState(4)
  const [range, setRange] = useState(3)
  const [billions, setBillions] = useState(70)
  const q = uniformQuantize(weights, bits, -range, range)
  return <div className="space-y-5">
    <h3 className="text-xl font-semibold">{c.title}</h3>
    <p className="text-sm leading-relaxed text-muted">{c.note}</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm">{c.bits}<select value={bits} onChange={e => setBits(Number(e.target.value))} className="mt-2 block w-full rounded-lg border border-border bg-background p-2">{[2, 3, 4, 8].map(b => <option key={b} value={b}>{b}</option>)}</select></label>
      <label className="text-sm">{c.range}: [{(-range).toFixed(1)}, {range.toFixed(1)}]<input type="range" className="mt-4 block w-full" min={1} max={4} step={0.1} value={range} onChange={e => setRange(Number(e.target.value))} /></label>
    </div>
    <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border p-4"><p className="text-sm text-muted">{c.levels}</p><p className="font-mono text-2xl text-cyan-300">{q.levels}</p></div><div className="rounded-xl border border-border p-4"><p className="text-sm text-muted">{c.mse}</p><p className="font-mono text-2xl text-orange-300">{q.mse.toFixed(5)}</p></div></div>
    <div className="overflow-x-auto"><table className="w-full text-right font-mono text-sm"><thead><tr>{[c.original, c.code, c.reconstructed, c.error].map(label => <th className="p-2 font-sans" key={label}>{label}</th>)}</tr></thead><tbody>{weights.map((value, i) => <tr key={i} className="border-t border-border"><td className="p-2">{value.toFixed(3)}</td><td className="p-2 text-cyan-300">{q.codes[i]}</td><td className="p-2">{q.reconstructed[i].toFixed(3)}</td><td className="p-2 text-orange-300">{q.errors[i].toFixed(3)}</td></tr>)}</tbody></table></div>
    <p className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-sm">{c.formula}</p>
    <p className="text-sm text-muted">{c.limit}</p>
    <div className="space-y-3 rounded-xl border border-border p-4"><label className="block text-sm">{c.params}: {billions}<input className="mt-2 block w-full" type="range" min={1} max={120} value={billions} onChange={e => setBillions(Number(e.target.value))} /></label><p>{c.memory}: <strong className="font-mono text-cyan-300">{(billions * bits / 8).toFixed(2)} GB</strong></p><p className="text-sm text-muted">{c.memoryNote}</p></div>
  </div>
}
