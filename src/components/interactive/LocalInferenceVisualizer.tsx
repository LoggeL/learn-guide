'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { models, quantPresets } from '@/lib/models'
import { localHardware } from '@/lib/local-hardware'
import { memoryEstimate, memoryPreset, type MemoryInput } from '@/lib/inference-math'

const HW_QUANTS = quantPresets.filter((q) => ['bf16', 'q8', 'q4'].includes(q.key))
const CONTEXTS = [8192, 32768, 131072]
/** Bandwidth used by the MoE demo (DGX Spark, 273 GB/s). */
const MOE_DEMO_BANDWIDTH = 273
/** Q4 preset: 4 bits × 1.15 overhead. */
const MOE_DEMO_BITS = 4.6

function useFormat() {
  const { locale } = useTranslation()
  return (value: number, digits = 1) =>
    value.toLocaleString(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 })
}

/** Capacity check plus bandwidth ceiling for each example machine. */
function HardwareFit() {
  const { t } = useTranslation()
  const li = t.localInference
  const vc = t.vramCalc
  const fmt = useFormat()
  const [modelId, setModelId] = useState('qwen36-27b')
  const [quantKey, setQuantKey] = useState<string>('q4')
  const [tokens, setTokens] = useState(32768)

  const model = models.find((m) => m.id === modelId) ?? models[0]
  const quant = HW_QUANTS.find((q) => q.key === quantKey) ?? HW_QUANTS[2]
  const input: MemoryInput = {
    bits: quant.bitsPerParam,
    quantOverhead: quant.overhead,
    tokens,
    batch: 1,
    kvBytes: 2,
    reserveGiB: 1,
    ...memoryPreset(model),
  }
  const est = memoryEstimate(input)
  const needGB = est.total === null ? null : est.total / 1e9
  const readPerToken = est.activeWeights + (est.kv ?? 0)
  const rows = localHardware.map((hw) => {
    const fits = needGB !== null && needGB <= hw.usableGB
    return { hw, fits, ceiling: (hw.bandwidthGBs * 1e9) / readPerToken }
  })
  const maxCeiling = Math.max(...rows.filter((r) => r.fits).map((r) => r.ceiling), 1)
  const names = vc.presetNames as Record<string, string>

  const chip = (active: boolean) =>
    `rounded-lg border px-3 py-1.5 text-sm transition-colors ${
      active ? 'border-primary bg-primary/10 text-primary-light' : 'border-border text-muted hover:text-text'
    }`

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-sm text-muted">{li.hwModel}</p>
          <div className="flex flex-wrap gap-2">
            {models.map((m) => (
              <button key={m.id} aria-pressed={m.id === modelId} className={chip(m.id === modelId)} onClick={() => setModelId(m.id)}>
                {names[m.nameKey] ?? m.id}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="mb-2 text-sm text-muted">{li.hwQuant}</p>
            <div className="flex flex-wrap gap-2">
              {HW_QUANTS.map((q) => (
                <button key={q.key} aria-pressed={q.key === quantKey} className={chip(q.key === quantKey)} onClick={() => setQuantKey(q.key)}>
                  {q.label} · {fmt(q.bitsPerParam * q.overhead, 2)} {vc.bitsUnit}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted">{li.hwContext}</p>
            <div className="flex flex-wrap gap-2">
              {CONTEXTS.map((c) => (
                <button key={c} aria-pressed={c === tokens} className={chip(c === tokens)} onClick={() => setTokens(c)}>
                  {c / 1024}K
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">{li.hwNeeds}</p>
          <p className="mt-1 font-mono text-2xl text-text">{needGB === null ? vc.unknown : `${fmt(needGB)} GB`}</p>
          <p className="mt-1 text-xs text-muted">
            {vc.weights} {fmt(est.weights / 1e9)} GB · {vc.kv} {fmt((est.kv ?? 0) / 1e9, 2)} GB · {vc.reserveResult} {fmt(est.reserve / 1e9, 2)} GB
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">{li.hwPerToken}</p>
          <p className="mt-1 font-mono text-2xl text-text">{fmt(readPerToken / 1e9, 2)} GB</p>
          <p className="mt-1 text-xs text-muted">{vc.presetNotes[model.descKey as keyof typeof vc.presetNotes]}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-2 pr-3 font-medium">{li.hwHardware}</th>
              <th className="py-2 pr-3 font-medium">{li.hwUsable}</th>
              <th className="py-2 pr-3 font-medium">{li.hwBandwidth}</th>
              <th className="py-2 font-medium">{li.hwCeiling}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ hw, fits, ceiling }) => (
              <tr key={hw.id} className="border-b border-border/50">
                <td className="py-3 pr-3">
                  <a href={hw.sourceUrl} target="_blank" rel="noreferrer" className="text-text hover:text-primary-light">
                    {hw.name}
                  </a>
                </td>
                <td className="py-3 pr-3 font-mono">
                  {fmt(hw.usableGB, 0)} GB
                  <span className={`ml-2 text-xs ${fits ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {fits ? li.hwFits : li.hwNoFit}
                  </span>
                </td>
                <td className="py-3 pr-3 font-mono">{fmt(hw.bandwidthGBs, 0)} GB/s</td>
                <td className="py-3">
                  {fits ? (
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-surface-elevated">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                          initial={false}
                          animate={{ width: `${Math.max(2, (100 * ceiling) / maxCeiling)}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <span className="font-mono">
                        ≤ {fmt(ceiling, 0)} {li.hwTokS}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted">{li.hwNeedsOffload}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs leading-relaxed text-muted">{li.hwAssumption}</p>
    </div>
  )
}

/** Stored weights follow total parameters, per-token reads follow active parameters. */
function MoeStorageVsReads() {
  const { t } = useTranslation()
  const li = t.localInference
  const fmt = useFormat()
  const [total, setTotal] = useState(35)
  const [active, setActive] = useState(3)
  const stored = (total * MOE_DEMO_BITS) / 8
  const read = (active * MOE_DEMO_BITS) / 8
  const moeCeiling = MOE_DEMO_BANDWIDTH / read
  const denseCeiling = MOE_DEMO_BANDWIDTH / stored

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="block text-muted">
            {li.moeDemoTotal}: <span className="font-mono text-text">{total}</span>
          </span>
          <input
            aria-label={li.moeDemoTotal}
            className="w-full accent-cyan-500"
            type="range"
            min={5}
            max={1000}
            step={5}
            value={total}
            onChange={(e) => {
              const n = Number(e.target.value)
              setTotal(n)
              setActive((a) => Math.min(a, n))
            }}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="block text-muted">
            {li.moeDemoActive}: <span className="font-mono text-text">{active}</span>
          </span>
          <input
            aria-label={li.moeDemoActive}
            className="w-full accent-purple-500"
            type="range"
            min={1}
            max={Math.min(total, 100)}
            step={1}
            value={active}
            onChange={(e) => setActive(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">{li.moeDemoStored}</span>
          <span className="font-mono text-cyan-400">{fmt(stored)} GB</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-elevated">
          <motion.div className="h-full bg-cyan-500/70" initial={false} animate={{ width: '100%' }} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">{li.moeDemoRead}</span>
          <span className="font-mono text-purple-400">{fmt(read, 2)} GB</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-elevated">
          <motion.div
            className="h-full bg-purple-500/70"
            initial={false}
            animate={{ width: `${Math.max(0.5, (100 * active) / total)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
          <p className="text-sm text-muted">{li.moeDemoCeilingMoe}</p>
          <p className="mt-1 font-mono text-2xl text-purple-400">
            ≤ {fmt(moeCeiling, 0)} {li.hwTokS}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">{li.moeDemoCeilingDense}</p>
          <p className="mt-1 font-mono text-2xl text-text">
            ≤ {fmt(denseCeiling, 1)} {li.hwTokS}
          </p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted">{li.moeDemoNote}</p>
    </div>
  )
}

export function LocalInferenceVisualizer({ section }: { section: 'hardware' | 'moe' }) {
  return section === 'hardware' ? <HardwareFit /> : <MoeStorageVsReads />
}
