'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n/context'

const draft = ['sat', 'on', 'the', 'mat']
const replacement = ['slept', 'beside', 'a', 'rug', '.']
const copy = {
  en: {
    title: 'Account for one draft-and-verify round', note: 'A chosen outcome for four draft tokens, not a stochastic sampler. Set how many proposals the target accepts before the first rejection. All later proposals are discarded; the target supplies a correction, or one bonus token if all proposals pass.',
    prefix: 'Shared prefix: The cat', accepted: 'Accepted prefix length', draftTime: 'Time per draft forward pass', targetTime: 'Time per ordinary target step', verifyTime: 'Time for one target block verification',
    proposed: 'Four sequential draft passes', verified: 'One parallel target verification', emitted: 'Emitted tokens', standard: 'Target-only time', speculative: 'Draft + verification time', ratio: 'Speedup under these assumptions',
    formula: 'Draft cost = 4 × draft-step time. Round cost = draft cost + target verification. Baseline cost = emitted tokens × target-step time.',
    limit: 'All timings are editable assumptions, not measurements. Verification of a block need not cost the same as a single-token target step. Real latency also depends on batch size, KV cache, transfer, kernel overhead and rejected work. Exact speculative sampling preserves the target distribution through its acceptance and correction rules, not by merely replacing any rejected word.',
    extra: 'Target correction / bonus', discarded: 'Discarded suffix',
  },
  de: {
    title: 'Eine Draft-und-Verify-Runde abrechnen', note: 'Ein gewählter Verlauf für vier Draft-Tokens, kein stochastischer Sampler. Wähle, wie viele Vorschläge das Target vor der ersten Ablehnung akzeptiert. Alle späteren Vorschläge werden verworfen. Das Target liefert eine Korrektur oder ein zusätzliches Token, wenn alle Vorschläge bestehen.',
    prefix: 'Gemeinsamer Präfix: The cat', accepted: 'Länge des akzeptierten Präfixes', draftTime: 'Zeit pro Draft-Forward-Pass', targetTime: 'Zeit pro normalem Target-Schritt', verifyTime: 'Zeit einer Target-Blockprüfung',
    proposed: 'Vier sequenzielle Draft-Pässe', verified: 'Eine parallele Target-Prüfung', emitted: 'Ausgegebene Tokens', standard: 'Zeit nur mit Target', speculative: 'Zeit für Draft + Prüfung', ratio: 'Beschleunigung unter diesen Annahmen',
    formula: 'Draft-Kosten = 4 × Draft-Schrittzeit. Rundenkosten = Draft-Kosten + Target-Prüfung. Vergleichskosten = ausgegebene Tokens × Target-Schrittzeit.',
    limit: 'Alle Zeiten sind einstellbare Annahmen, keine Messwerte. Eine Blockprüfung muss nicht so lange dauern wie ein einzelner Target-Schritt. Reale Latenz hängt auch von Batchgröße, KV-Cache, Transfers, Kernel-Aufwand und verworfener Arbeit ab. Exaktes Speculative Sampling erhält die Target-Verteilung durch seine Annahme- und Korrekturregeln, nicht durch beliebiges Ersetzen abgelehnter Wörter.',
    extra: 'Target-Korrektur / Zusatz', discarded: 'Verworfener Rest',
  },
}
export function SpeculativeDecodingVisualizer() {
  const { locale } = useLocale()
  const c = copy[locale === 'de' ? 'de' : 'en']
  const [accepted, setAccepted] = useState(3)
  const [draftMs, setDraftMs] = useState(5)
  const [targetMs, setTargetMs] = useState(40)
  const [verifyMs, setVerifyMs] = useState(45)
  const output = [...draft.slice(0, accepted), replacement[accepted]]
  const baseline = output.length * targetMs
  const speculative = draft.length * draftMs + verifyMs
  return <div className="space-y-5">
    <h3 className="text-xl font-semibold">{c.title}</h3><p className="text-sm leading-relaxed text-muted">{c.note}</p>
    <label className="block text-sm">{c.accepted}: {accepted}<input type="range" min={0} max={4} value={accepted} onChange={e => setAccepted(Number(e.target.value))} className="mt-2 w-full" /></label>
    <div className="rounded-xl border border-border bg-background p-4"><p className="mb-3 text-sm text-muted">{c.prefix}</p><p className="mb-2 text-sm">{c.proposed}</p><div className="flex flex-wrap gap-2">{draft.map((word, i) => <span key={i} className={`rounded-lg border px-3 py-2 font-mono ${i < accepted ? 'border-emerald-400/40 text-emerald-300' : 'border-border text-muted line-through'}`}>{word}</span>)}</div><p className="mt-3 text-xs text-muted">{c.discarded}: {draft.slice(accepted).join(' ') || '∅'}</p><p className="mt-3 text-sm">{c.verified} → {c.extra}: <span className="font-mono text-cyan-300">{replacement[accepted]}</span></p><p className="mt-4 text-sm">{c.emitted}: <strong className="font-mono text-emerald-300">{output.join(' ')}</strong> ({output.length})</p></div>
    <div className="grid gap-4 sm:grid-cols-3">{[[c.draftTime, draftMs, setDraftMs, 1, 50], [c.targetTime, targetMs, setTargetMs, 10, 150], [c.verifyTime, verifyMs, setVerifyMs, 10, 200]].map(([label, value, setter, min, max]) => <label key={String(label)} className="text-sm">{String(label)}: {Number(value)} ms<input type="range" className="mt-2 block w-full" min={Number(min)} max={Number(max)} value={Number(value)} onChange={e => (setter as (n: number) => void)(Number(e.target.value))} /></label>)}</div>
    <div className="grid gap-3 sm:grid-cols-3">{[[c.standard, `${baseline} ms`], [c.speculative, `${speculative} ms`], [c.ratio, `${(baseline / speculative).toFixed(2)}×`]].map(([name, value]) => <div key={name} className="rounded-lg border border-border p-4"><p className="text-sm text-muted">{name}</p><p className="mt-2 font-mono text-xl text-cyan-300">{value}</p></div>)}</div>
    <p className="text-sm text-muted">{c.formula}</p><p className="border-l-2 border-cyan-500 pl-4 text-sm leading-relaxed text-muted">{c.limit}</p>
  </div>
}
