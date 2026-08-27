'use client'

import { useState } from 'react'
import { ArrowDown, Check, Database, Sparkles, X } from 'lucide-react'

export type NGramGenerationCopy = {
  title: string
  description: string
  scenarioLabel: string
  sharedInput: string
  baseRepresentation: string
  baseLogits: string
  withoutTitle: string
  withTitle: string
  backboneOnly: string
  lookup: string
  addVector: string
  downstream: string
  important: string
  scenarios: Array<{
    id: string
    tab: string
    badge: string
    context: string
    key: string
    lookupResult: string
    vector: string
    baseLogits: Array<{ token: string; score: string }>
    withoutLogits: Array<{ token: string; score: string }>
    withLogits: Array<{ token: string; score: string }>
    withoutNote: string
    withNote: string
    useful: string
  }>
}

export function NGramGenerationComparison({ copy }: { copy: NGramGenerationCopy }) {
  const [activeId, setActiveId] = useState(copy.scenarios[0].id)
  const scenario = copy.scenarios.find(item => item.id === activeId) ?? copy.scenarios[0]
  const useful = scenario.useful === 'true'

  return <section className="rounded-2xl border border-primary/30 bg-surface/50 p-5 md:p-7" aria-labelledby="generation-comparison-title">
    <div className="flex gap-3">
      <span className="h-fit rounded-xl bg-primary/15 p-3 text-primary-light"><Sparkles aria-hidden="true" /></span>
      <div><h2 id="generation-comparison-title" className="font-heading text-2xl font-bold text-gradient">{copy.title}</h2><p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">{copy.description}</p></div>
    </div>

    <fieldset className="mt-6">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{copy.scenarioLabel}</legend>
      <div className="grid gap-2 sm:grid-cols-3">{copy.scenarios.map(item => <button key={item.id} type="button" aria-pressed={item.id === scenario.id} onClick={() => setActiveId(item.id)} className={`min-h-12 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition-colors ${item.id === scenario.id ? 'border-primary bg-primary/15 text-text' : 'border-border bg-background text-muted hover:border-primary/50'}`}>{item.tab}</button>)}</div>
    </fieldset>

    <div className="mt-5 rounded-xl border border-border bg-background p-4" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted">{copy.sharedInput}</span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${useful ? 'bg-emerald-500/10 text-emerald-300' : 'bg-orange-500/10 text-orange-300'}`}>{scenario.badge}</span></div>
      <code className="mt-3 block overflow-x-auto whitespace-pre rounded-lg bg-surface p-3 text-sm text-cyan-200">{scenario.context}<span className="animate-pulse text-primary-light">▌</span></code>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <SharedValue label={copy.baseRepresentation} value="xₜ = token_embed(t)" />
        <Logits label={copy.baseLogits} values={scenario.baseLogits} muted />
      </div>
    </div>

    <ArrowDown className="mx-auto my-3 text-muted" aria-hidden="true" />

    <div className="grid gap-4 lg:grid-cols-2">
      <Branch title={copy.withoutTitle} accent="neutral">
        <Step label={copy.backboneOnly} value="xₜ → backbone → hₜ → LM head" />
        <p className="text-sm leading-relaxed text-muted">{scenario.withoutNote}</p>
        <Logits label={copy.downstream} values={scenario.withoutLogits} />
      </Branch>
      <Branch title={copy.withTitle} accent={useful ? 'good' : 'warn'}>
        <Step icon={<Database size={15} />} label={copy.lookup} value={`${scenario.key} → ${scenario.lookupResult}`} />
        <Step label={copy.addVector} value={`x′ₜ = xₜ + ${scenario.vector}`} />
        <Step label={copy.backboneOnly} value="x′ₜ → backbone → h′ₜ → LM head" />
        <p className="text-sm leading-relaxed text-muted">{scenario.withNote}</p>
        <Logits label={copy.downstream} values={scenario.withLogits} />
      </Branch>
    </div>

    <p className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-relaxed text-amber-100"><strong>{copy.important}</strong></p>
  </section>
}

function Branch({ title, accent, children }: { title: string; accent: 'neutral' | 'good' | 'warn'; children: React.ReactNode }) {
  const styles = accent === 'good' ? 'border-emerald-500/30' : accent === 'warn' ? 'border-orange-500/30' : 'border-border'
  const Icon = accent === 'good' ? Check : accent === 'warn' ? X : null
  return <article className={`rounded-xl border bg-background p-4 ${styles}`}><h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-text">{Icon && <Icon size={18} className={accent === 'good' ? 'text-emerald-300' : 'text-orange-300'} aria-hidden="true" />}{title}</h3><div className="space-y-3">{children}</div></article>
}

function Step({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="rounded-lg border border-border bg-surface p-3"><p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">{icon}{label}</p><code className="mt-1 block overflow-x-auto text-xs text-cyan-200">{value}</code></div>
}

function SharedValue({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-surface p-3"><p className="text-xs uppercase tracking-wider text-muted">{label}</p><code className="mt-1 block text-xs text-text">{value}</code></div>
}

function Logits({ label, values, muted = false }: { label: string; values: Array<{ token: string; score: string }>; muted?: boolean }) {
  const max = Math.max(...values.map(value => Number(value.score)))
  return <div className={`rounded-lg bg-surface p-3 ${muted ? 'opacity-80' : ''}`}><p className="mb-2 text-xs uppercase tracking-wider text-muted">{label}</p><div className="space-y-2">{values.map(value => <div key={value.token} className="grid grid-cols-[5rem_1fr_3rem] items-center gap-2 text-xs"><code className="truncate text-text">{value.token}</code><span className="h-2 rounded-full bg-background"><span className="block h-full rounded-full bg-primary-light transition-[width]" style={{ width: `${Math.max(8, Number(value.score) / max * 100)}%` }} /></span><span className="text-right font-mono text-muted">{Number(value.score).toFixed(1)}</span></div>)}</div></div>
}
