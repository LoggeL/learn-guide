'use client'

import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Activity, ArrowRight, Gauge, Layers, Scale3D } from 'lucide-react'

type NormMode = 'pre' | 'post'

const layerDeltas = [
  { name: 'Layer 1', attention: 0.55, mlp: 0.35, color: 'from-cyan-400 to-blue-500' },
  { name: 'Layer 2', attention: 0.35, mlp: 0.8, color: 'from-violet-400 to-fuchsia-500' },
  { name: 'Layer 3', attention: 0.7, mlp: 0.5, color: 'from-emerald-400 to-teal-500' },
]

const vectorLabels = ['syntax', 'position', 'entity', 'tone', 'next-token']

function normalize(value: number) {
  return Math.min(1, Math.max(0.08, value))
}

export function ResidualStreamLayerNormVisualizer() {
  const [selectedLayer, setSelectedLayer] = useState(1)
  const [normMode, setNormMode] = useState<NormMode>('pre')
  const [signalScale, setSignalScale] = useState(1.6)

  const currentLayer = layerDeltas[selectedLayer]

  const streamVector = useMemo(() => {
    const base = [0.42, 0.68, 0.5, 0.36, 0.58]
    const deltaMix = currentLayer.attention * 0.34 + currentLayer.mlp * 0.28
    const raw = base.map((value, index) => value * signalScale + deltaMix * (index % 2 === 0 ? 0.62 : 0.28))
    const stableScale = normMode === 'pre' ? 0.78 : 0.9
    const normalized = raw.map((value) => normalize(value / (signalScale + deltaMix) * stableScale))
    const output = normMode === 'pre'
      ? normalized.map((value, index) => normalize(value + (index % 2 === 0 ? currentLayer.attention : currentLayer.mlp) * 0.22))
      : raw.map((value) => normalize(value / 2.6))

    return { raw, normalized, output }
  }, [currentLayer, normMode, signalScale])

  const instability = Math.min(100, Math.round((signalScale * (currentLayer.attention + currentLayer.mlp) / 2) * 62))
  const stability = normMode === 'pre' ? Math.max(12, 100 - Math.round(instability * 0.35)) : Math.max(8, 100 - instability)
  const selectedCopy = normMode === 'pre'
    ? 'Pre-norm gives each block a stable input, then the delta is added back to the shared stream.'
    : 'Post-norm lets the block operate on the raw stream first, so large scales can make the update harder to control.'

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface/60 shadow-2xl shadow-cyan-950/10">
      <div className="border-b border-border bg-surface-elevated/80 p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
              <Scale3D size={21} className="text-cyan-200" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-text md:text-2xl">Residual stream conveyor</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                Watch layers read a shared vector stream, write deltas back, and use LayerNorm to keep signal scale usable.
              </p>
            </div>
          </div>

          <div className="flex rounded-xl border border-border bg-background/70 p-1 text-sm">
            {(['pre', 'post'] as NormMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setNormMode(mode)}
                className={clsx(
                  'rounded-lg px-3 py-2 font-medium transition-all',
                  normMode === mode
                    ? 'bg-primary/20 text-primary-light shadow-sm ring-1 ring-primary/30'
                    : 'text-muted hover:bg-surface hover:text-text'
                )}
              >
                {mode === 'pre' ? 'Pre-norm' : 'Post-norm'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6 p-5 md:p-6">
          <div className="rounded-2xl border border-cyan-500/20 bg-background/50 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">shared vector stream</p>
                <p className="mt-1 text-sm text-muted">The belt carries one evolving representation forward.</p>
              </div>
              <ArrowRight className="text-cyan-200" size={22} />
            </div>

            <div className="relative rounded-xl border border-border bg-slate-950/40 p-4">
              <div className="absolute left-4 right-4 top-1/2 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/20 via-primary/30 to-emerald-500/20" />
              <div className="relative grid grid-cols-5 gap-2">
                {streamVector.output.map((value, index) => (
                  <div key={vectorLabels[index]} className="rounded-xl border border-border bg-surface/80 p-3 text-center">
                    <div className="mx-auto flex h-24 items-end justify-center rounded-lg bg-background/70 p-2">
                      <div
                        className="w-7 rounded-t-md bg-gradient-to-t from-cyan-500 to-emerald-300 transition-all duration-300"
                        style={{ height: `${Math.round(value * 100)}%` }}
                      />
                    </div>
                    <p className="mt-2 truncate text-[11px] text-muted">{vectorLabels[index]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {layerDeltas.map((layer, index) => (
              <button
                key={layer.name}
                type="button"
                onClick={() => setSelectedLayer(index)}
                className={clsx(
                  'rounded-2xl border p-4 text-left transition-all',
                  selectedLayer === index
                    ? 'border-primary/50 bg-primary/10 shadow-lg shadow-primary/10'
                    : 'border-border bg-surface/50 hover:border-primary/30 hover:bg-surface'
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-heading font-semibold text-text">{layer.name}</span>
                  <Layers size={18} className={selectedLayer === index ? 'text-primary-light' : 'text-muted'} />
                </div>
                <div className="space-y-2">
                  <DeltaBar label="attention Δ" value={layer.attention} color={layer.color} />
                  <DeltaBar label="MLP Δ" value={layer.mlp} color={layer.color} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside className="border-t border-border bg-background/35 p-5 md:p-6 lg:border-l lg:border-t-0">
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-surface/60 p-4">
              <div className="mb-3 flex items-center gap-2 text-text">
                <Gauge size={18} className="text-amber-200" />
                <h3 className="font-heading font-semibold">Signal scale</h3>
              </div>
              <input
                aria-label="Signal scale"
                type="range"
                min="0.7"
                max="2.6"
                step="0.1"
                value={signalScale}
                onChange={(event) => setSignalScale(Number(event.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>quiet</span>
                <span className="font-mono text-cyan-200">×{signalScale.toFixed(1)}</span>
                <span>loud</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface/60 p-4">
              <div className="mb-4 flex items-center gap-2">
                <Activity size={18} className="text-emerald-200" />
                <h3 className="font-heading font-semibold text-text">LayerNorm effect</h3>
              </div>
              <div className="space-y-3">
                <Meter label="raw stream variance" value={instability} tone="amber" />
                <Meter label="usable stability" value={stability} tone="emerald" />
              </div>
              <p className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm leading-relaxed text-cyan-50/85">
                {selectedCopy}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">current path</p>
              <div className="mt-3 space-y-2 text-sm text-muted">
                <Step active={normMode === 'pre'} label="1. Normalize read" />
                <Step active label={`2. ${currentLayer.name} computes attention + MLP deltas`} />
                <Step active={normMode === 'post'} label="3. Normalize after write" />
                <Step active label="4. Pass updated stream to the next layer" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

function DeltaBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div className={clsx('h-full rounded-full bg-gradient-to-r', color)} style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
    </div>
  )
}

function Meter({ label, value, tone }: { label: string; value: number; tone: 'amber' | 'emerald' }) {
  const color = tone === 'amber' ? 'from-amber-500 to-orange-400' : 'from-emerald-500 to-teal-300'

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-background">
        <div className={clsx('h-full rounded-full bg-gradient-to-r transition-all duration-300', color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function Step({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={clsx('flex items-center gap-2 rounded-lg px-2 py-1.5', active ? 'bg-primary/10 text-text' : 'text-muted/60')}>
      <span className={clsx('h-2 w-2 rounded-full', active ? 'bg-primary-light' : 'bg-muted/40')} />
      <span>{label}</span>
    </div>
  )
}
