'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n/context'
import { learningSoftmax, distributionKL, distillationStep } from '@/lib/llmLearningMath'

const teacherLogits = [3, 1.5, 0.5, -0.5]
const initialStudent = [0, 0.5, 1, -0.5]
const tokens = ['Paris', 'Lyon', 'London', 'Rome']
const copy = {
  en: { title: 'One logit-distillation step', note: 'A four-token toy vocabulary and fixed teacher logits. The student has independent logits. Each click applies the gradient of T² × KL(teacher || student); this is a real update of four numbers, not a trained language model.', temp: 'Shared temperature', train: 'Update student', reset: 'Reset student', steps: 'Updates', token: 'Token', hard: 'One-hot target', teacher: 'Teacher', student: 'Student', loss: 'Scaled distillation loss', limit: 'Both distributions use the same temperature. One-hot labels remain one-hot; a softmax at T = 1 is still a probability distribution. This example uses only the soft loss. In practice, it can be mixed with cross-entropy on labelled tokens. Sequence distillation instead trains on teacher-generated text and does not require access to logits.' },
  de: { title: 'Ein Schritt Logit-Destillation', note: 'Ein Spielzeugvokabular mit vier Tokens und festen Teacher-Logits. Der Student hat eigene Logits. Jeder Klick wendet den Gradienten von T² × KL(Teacher || Student) an. Vier Zahlen werden tatsächlich aktualisiert; ein Sprachmodell wird hier nicht trainiert.', temp: 'Gemeinsame Temperatur', train: 'Student aktualisieren', reset: 'Student zurücksetzen', steps: 'Updates', token: 'Token', hard: 'One-Hot-Ziel', teacher: 'Teacher', student: 'Student', loss: 'Skalierter Destillations-Loss', limit: 'Beide Verteilungen nutzen dieselbe Temperatur. One-Hot-Labels bleiben One-Hot; Softmax bei T = 1 ist weiterhin eine Wahrscheinlichkeitsverteilung. Das Beispiel nutzt nur den weichen Loss. Im Training kann Cross-Entropy auf gelabelten Tokens hinzukommen. Sequenzdestillation trainiert dagegen mit erzeugten Teacher-Texten und benötigt keinen Logit-Zugriff.' },
}

export function DistillationVisualizer() {
  const { locale } = useLocale()
  const c = copy[locale === 'de' ? 'de' : 'en']
  const [temperature, setTemperature] = useState(2)
  const [student, setStudent] = useState(initialStudent)
  const [steps, setSteps] = useState(0)
  const p = learningSoftmax(teacherLogits, temperature)
  const q = learningSoftmax(student, temperature)
  const loss = temperature ** 2 * distributionKL(p, q)
  return <div className="space-y-5">
    <h3 className="text-xl font-semibold">{c.title}</h3><p className="text-sm leading-relaxed text-muted">{c.note}</p>
    <label className="block text-sm">{c.temp}: {temperature.toFixed(1)}<input className="mt-2 w-full" type="range" min={1} max={5} step={0.5} value={temperature} onChange={e => setTemperature(Number(e.target.value))} /></label>
    <div className="overflow-x-auto"><table className="w-full text-right text-sm"><thead><tr>{[c.token, c.hard, c.teacher, c.student].map(label => <th key={label} className="p-2">{label}</th>)}</tr></thead><tbody>{tokens.map((token, i) => <tr key={token} className="border-t border-border"><th className="p-2 font-mono font-normal">{token}</th><td className="p-2 font-mono">{i === 0 ? '1.000' : '0.000'}</td><td className="p-2 font-mono text-purple-300">{p[i].toFixed(3)}<div className="mt-1 h-1 rounded bg-purple-400" style={{ width: `${p[i] * 100}%` }} /></td><td className="p-2 font-mono text-cyan-300">{q[i].toFixed(3)}<div className="mt-1 h-1 rounded bg-cyan-400" style={{ width: `${q[i] * 100}%` }} /></td></tr>)}</tbody></table></div>
    <p aria-live="polite" className="font-mono text-sm">{c.loss}: {Math.max(0, loss).toFixed(5)} · {c.steps}: {steps}</p>
    <div className="flex flex-wrap gap-3"><button type="button" className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-200" onClick={() => { setStudent(previous => distillationStep(previous, teacherLogits, temperature, 1)); setSteps(previous => previous + 1) }}>{c.train}</button><button type="button" className="rounded-lg border border-border px-4 py-2" onClick={() => { setStudent(initialStudent); setSteps(0) }}>{c.reset}</button></div>
    <p className="text-sm text-muted">{c.limit}</p>
  </div>
}
