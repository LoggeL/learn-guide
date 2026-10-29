'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { quantizeVector } from '@/lib/learning-math'

// Constructed example: a key vector with one outlier channel (index 3).
const KEY = [0.21, -0.35, 0.12, 3.8, -0.18, 0.27, -0.09, 0.31]
// Fixed sign pattern (stands in for the random diagonal of a randomized Hadamard transform).
const SIGNS = [1, -1, 1, 1, -1, 1, -1, -1]

/** Normalized 8×8 Walsh–Hadamard transform (orthogonal and self-inverse). */
function hadamard8(x: number[]) {
  const y = [...x]
  for (let len = 1; len < 8; len <<= 1) {
    for (let i = 0; i < 8; i += len << 1) {
      for (let j = i; j < i + len; j++) {
        const a = y[j],
          b = y[j + len]
        y[j] = a + b
        y[j + len] = a - b
      }
    }
  }
  return y.map((v) => v / Math.sqrt(8))
}

export function kvQuantRoundTrip(x: number[], bits: number, rotate: boolean) {
  const forward = rotate ? hadamard8(x.map((v, i) => v * SIGNS[i])) : x
  const q = quantizeVector(forward, bits)
  const restored = rotate ? hadamard8(q.restored).map((v, i) => v * SIGNS[i]) : q.restored
  const mse = restored.reduce((s, v, i) => s + (v - x[i]) ** 2, 0) / x.length
  const step = (2 * q.scale) / (2 ** bits - 1)
  return { forward, restored, mse, scale: q.scale, step, storageBits: q.storageBits }
}

export function KvCacheQuantDemo() {
  const { t, locale } = useTranslation()
  const k = t.kvCache
  const [rotate, setRotate] = useState(false)
  const [bits, setBits] = useState(4)
  const r = kvQuantRoundTrip(KEY, bits, rotate)
  const plain = kvQuantRoundTrip(KEY, bits, false)
  const rotated = kvQuantRoundTrip(KEY, bits, true)
  const range = 4
  const fmt = (n: number, d = 3) => n.toLocaleString(locale, { maximumFractionDigits: d, minimumFractionDigits: d })

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <p className="text-sm leading-relaxed text-muted">{k.quantDemoDesc}</p>
      <div className="flex flex-wrap items-end gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={rotate}
            onChange={(e) => setRotate(e.target.checked)}
            className="h-4 w-4 accent-emerald-500"
          />
          {k.quantDemoRotate}
        </label>
        <label className="block min-w-[12rem] text-sm">
          <span className="text-muted">{k.quantDemoBits}</span>
          <span className="ml-2 font-mono">{bits}</span>
          <input
            type="range"
            min={2}
            max={8}
            value={bits}
            onChange={(e) => setBits(Number(e.target.value))}
            className="mt-2 w-full"
            aria-label={k.quantDemoBits}
          />
        </label>
      </div>

      {/* Per-coordinate bars */}
      <div className="grid grid-cols-8 gap-2">
        {KEY.map((orig, i) => {
          const rest = r.restored[i]
          const h = (v: number) => `${(Math.min(Math.abs(v), range) / range) * 100}%`
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="relative flex h-32 w-full items-end justify-center gap-0.5 rounded-md bg-background/60 sm:h-40">
                <div
                  className={`w-1/3 rounded-t ${orig < 0 ? 'bg-cyan-500/40' : 'bg-cyan-500/70'}`}
                  style={{ height: h(orig) }}
                />
                <motion.div
                  className={`w-1/3 rounded-t ${rest < 0 ? 'bg-emerald-500/40' : 'bg-emerald-500/80'}`}
                  animate={{ height: h(rest) }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="font-mono text-[10px] text-muted">{fmt(orig, 2)}</div>
              <div className="font-mono text-[10px] text-emerald-300">{fmt(rest, 2)}</div>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-cyan-500/70" />
          {k.quantDemoOriginal}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500/80" />
          {k.quantDemoRestored}
        </span>
        <span>{k.quantDemoBarsNote}</span>
      </div>

      {rotate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-emerald-500/20 bg-background/50 p-3 font-mono text-xs text-muted"
        >
          {k.quantDemoRotated}: [{r.forward.map((v) => fmt(v, 2)).join(', ')}]
        </motion.div>
      )}

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          [k.quantDemoMaxAbs, fmt(r.scale)],
          [k.quantDemoStep, fmt(r.step)],
          [k.quantDemoMse, r.mse.toExponential(2)],
          [k.quantDemoStorage, `${r.storageBits} / 128 bit`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-background/50 p-3">
            <div className="text-xs text-muted">{label}</div>
            <div className="mt-1 font-mono text-lg text-text">{value}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted">
        {k.quantDemoCompare
          .replace('{bits}', String(bits))
          .replace('{plain}', plain.mse.toExponential(2))
          .replace('{rotated}', rotated.mse.toExponential(2))}
      </p>
      <p className="text-xs leading-relaxed text-muted">{k.quantDemoNote}</p>
    </div>
  )
}
