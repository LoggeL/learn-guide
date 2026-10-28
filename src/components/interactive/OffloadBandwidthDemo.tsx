'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { decodeCeiling } from '@/lib/inference-math'
import { DDR5_DUAL_CHANNEL_GBS } from '@/lib/local-hardware'

interface OffloadBandwidthDemoProps {
  /** Weight bytes read per generated token (active parameters). */
  activeWeightBytes: number
  /** KV-cache bytes read per generated token; assumed to stay on the GPU. */
  kvBytes: number
}

/**
 * Computes the decode-time lower bound when a share of the per-token weight
 * reads is served from system RAM: GPU time and RAM time add up.
 */
export function OffloadBandwidthDemo({ activeWeightBytes, kvBytes }: OffloadBandwidthDemoProps) {
  const { t, locale } = useTranslation()
  const v = t.vramCalc
  const [sharePct, setSharePct] = useState(10)
  const [gpuGBs, setGpuGBs] = useState(1792)
  const [cpuGBs, setCpuGBs] = useState(DDR5_DUAL_CHANNEL_GBS)
  const fmt = (value: number, digits = 1) =>
    value.toLocaleString(locale, { maximumFractionDigits: digits })

  const cpuBytes = activeWeightBytes * (sharePct / 100)
  const gpuBytes = activeWeightBytes - cpuBytes + kvBytes
  const split = decodeCeiling({ gpuBytes, cpuBytes, gpuGBs, cpuGBs })
  const allGpu = decodeCeiling({ gpuBytes: activeWeightBytes + kvBytes, cpuBytes: 0, gpuGBs, cpuGBs })
  const timeShare = split.stepMs > 0 ? (100 * split.cpuMs) / split.stepMs : 0
  const byteShare = (100 * cpuBytes) / (activeWeightBytes + kvBytes || 1)

  const numberField = (label: string, value: number, set: (n: number) => void) => (
    <label className="space-y-2 text-sm">
      <span className="block text-muted">{label}</span>
      <input
        type="number"
        min={1}
        max={20000}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (Number.isFinite(n) && n > 0) set(n)
        }}
        className="w-full rounded-lg border border-border bg-background p-2 font-mono"
      />
    </label>
  )

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2 text-sm sm:col-span-3">
          <span className="block text-muted">
            {v.offloadShare}: <span className="font-mono text-text">{sharePct} %</span>
          </span>
          <input
            aria-label={v.offloadShare}
            type="range"
            min={0}
            max={100}
            step={1}
            value={sharePct}
            onChange={(e) => setSharePct(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </label>
        {numberField(v.offloadGpuBw, gpuGBs, setGpuGBs)}
        {numberField(v.offloadCpuBw, cpuGBs, setCpuGBs)}
        <div className="space-y-2 text-sm">
          <span className="block text-muted">{v.offloadBytes}</span>
          <span className="block rounded-lg border border-border bg-background p-2 font-mono">
            {fmt((activeWeightBytes + kvBytes) / 1e9, 2)} GB
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex h-8 overflow-hidden rounded-lg bg-surface-elevated text-xs font-mono">
          <motion.div
            className="flex items-center justify-center bg-cyan-500/60 text-white"
            initial={false}
            animate={{ width: `${100 - timeShare}%` }}
            transition={{ duration: 0.3 }}
          >
            {100 - timeShare > 12 && `${v.offloadGpuTime} ${fmt(split.gpuMs, 1)} ms`}
          </motion.div>
          <motion.div
            className="flex items-center justify-center bg-orange-500/70 text-white"
            initial={false}
            animate={{ width: `${timeShare}%` }}
            transition={{ duration: 0.3 }}
          >
            {timeShare > 12 && `${v.offloadCpuTime} ${fmt(split.cpuMs, 1)} ms`}
          </motion.div>
        </div>
        <p className="text-sm text-muted" role="status">
          {v.offloadInsight.replace('{ram}', fmt(byteShare, 0)).replace('{time}', fmt(timeShare, 0))}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
          <p className="text-sm text-muted">{v.offloadRate}</p>
          <p className="mt-1 font-mono text-2xl text-orange-400">
            ≤ {fmt(split.tokensPerSecond, 1)} {v.offloadUnit}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">{v.offloadAllGpu}</p>
          <p className="mt-1 font-mono text-2xl text-text">
            ≤ {fmt(allGpu.tokensPerSecond, 1)} {v.offloadUnit}
          </p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted">{v.offloadNote}</p>
    </div>
  )
}
