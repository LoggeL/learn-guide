'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

const FULL_DIM = 3072
const DIMS = [64, 128, 256, 512, 1024, 1536, 3072]
const BYTES_PER_FLOAT32 = 4
const VECTORS = 1_000_000

// Illustrative 8-dimensional vector (roughly unit length) to show truncate-and-renormalize.
const SAMPLE = [0.62, -0.48, 0.41, 0.29, -0.22, 0.18, -0.15, 0.12]

function norm(v: number[]) {
  return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0))
}

export function MatryoshkaDemo() {
  const { t, locale } = useTranslation()
  const d = t.embeddings.matryoshkaDemo
  const [index, setIndex] = useState(2)
  const dim = DIMS[index]
  const bytes = dim * BYTES_PER_FLOAT32
  const gb = (bytes * VECTORS) / 1e9
  const share = dim / FULL_DIM

  const sampleKeep = 4
  const truncated = SAMPLE.slice(0, sampleKeep)
  const truncatedNorm = norm(truncated)
  const renormalized = truncated.map((x) => x / truncatedNorm)
  const fmt = (x: number, digits = 2) => x.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-6">
      <div>
        <label className="text-sm text-text font-semibold" htmlFor="matryoshka-dim">
          {d.sliderLabel}: <span className="font-mono text-primary-light">{dim}</span>
        </label>
        <input
          id="matryoshka-dim"
          type="range"
          min={0}
          max={DIMS.length - 1}
          step={1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          className="mt-3 w-full accent-purple-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
          {DIMS.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      </div>

      {/* Nested prefixes */}
      <div>
        <p className="text-xs text-muted mb-2">{d.prefixHint}</p>
        <div className="relative h-10 rounded-lg bg-background border border-border overflow-hidden">
          {DIMS.slice(0, -1).map((x) => (
            <div
              key={x}
              className="absolute top-0 bottom-0 border-r border-white/10"
              style={{ left: `${(x / FULL_DIM) * 100}%` }}
            />
          ))}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500/60 to-cyan-500/40"
            animate={{ width: `${share * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          />
          <div className="absolute inset-0 flex items-center justify-end pr-3 text-xs font-mono text-muted">
            {FULL_DIM}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-background border border-border p-4 text-center">
          <div className="text-2xl font-mono font-bold text-gradient">{bytes.toLocaleString(locale)} B</div>
          <p className="text-xs text-muted mt-1">{d.perVector}</p>
        </div>
        <div className="rounded-xl bg-background border border-border p-4 text-center">
          <div className="text-2xl font-mono font-bold text-cyan-400">{fmt(gb, gb < 1 ? 2 : 1)} GB</div>
          <p className="text-xs text-muted mt-1">{d.perMillion}</p>
        </div>
        <div className="rounded-xl bg-background border border-border p-4 text-center">
          <div className="text-2xl font-mono font-bold text-emerald-400">{fmt(share * 100, share < 0.1 ? 1 : 0)} %</div>
          <p className="text-xs text-muted mt-1">{d.ofFull}</p>
        </div>
      </div>

      {/* Truncate + renormalize, computed */}
      <div className="rounded-xl bg-background border border-border p-4 space-y-2 text-xs font-mono overflow-x-auto">
        <p className="font-sans text-muted">{d.renormHint}</p>
        <div className="text-muted">
          v = [{SAMPLE.map((x) => fmt(x)).join(', ')}] · ‖v‖ = {fmt(norm(SAMPLE), 3)}
        </div>
        <div className="text-text">
          {d.cut.replace('{n}', String(sampleKeep))}: [{truncated.map((x) => fmt(x)).join(', ')}] · ‖·‖ = {fmt(truncatedNorm, 3)}
        </div>
        <div className="text-emerald-300">
          {d.renormalized}: [{renormalized.map((x) => fmt(x)).join(', ')}] · ‖·‖ = {fmt(norm(renormalized), 3)}
        </div>
      </div>
      <p className="text-xs text-muted">{d.note}</p>
    </div>
  )
}
