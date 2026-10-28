'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { groupQuantize, type QuantScheme } from '@/lib/llmLearningMath'

/** One fixed example row of a weight matrix (roughly bell-shaped, no randomness). */
const BASE_WEIGHTS = [0.12, -0.31, 0.05, 0.44, -0.18, 0.27, -0.52, 0.09, 0.36, -0.07, -0.41, 0.21, 0.58, -0.24, 0.03, -0.15]
const OUTLIER_INDEX = 5
const OUTLIER_VALUE = 3.2
const GROUP_SIZES = [16, 8, 4]
const BIT_OPTIONS = [2, 3, 4, 8]
const GROUP_TINTS = ['rgba(34,211,238,0.07)', 'rgba(168,85,247,0.07)']

const W = 640
const H = 260
const PAD_X = 8
const PAD_Y = 14
const COL = (W - 2 * PAD_X) / BASE_WEIGHTS.length

function formatNumber(locale: string, value: number, digits: number) {
  const clean = Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value
  return clean.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function QuantizationVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.quantization
  const fmt = (value: number, digits = 3) => formatNumber(locale, value, digits)
  const [bits, setBits] = useState(4)
  const [scheme, setScheme] = useState<QuantScheme>('symmetric')
  const [groupSize, setGroupSize] = useState(16)
  const [outlier, setOutlier] = useState(true)
  const [keep, setKeep] = useState(false)

  const weights = useMemo(() => BASE_WEIGHTS.map((w, i) => (outlier && i === OUTLIER_INDEX ? OUTLIER_VALUE : w)), [outlier])
  const keptIdx = outlier && keep ? [OUTLIER_INDEX] : []
  const q = groupQuantize(weights, bits, groupSize, scheme, keptIdx)

  const normalIdx = weights.map((_, i) => i).filter(i => !(outlier && i === OUTLIER_INDEX))
  const mseNormal = normalIdx.reduce((sum, i) => sum + q.errors[i] ** 2, 0) / normalIdx.length
  const zeroed = normalIdx.filter(i => weights[i] !== 0 && Math.abs(q.reconstructed[i]) < 1e-12).length

  const yMax = outlier ? 3.5 : 0.65
  const y = (v: number) => PAD_Y + ((yMax - v) / (2 * yMax)) * (H - 2 * PAD_Y)
  const zeroY = y(0)

  const select = 'mt-2 block w-full rounded-lg border border-border bg-background p-2 text-sm'
  const toggle = (active: boolean) => `rounded-lg border px-3 py-2 text-sm transition-colors ${active ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-300' : 'border-border bg-background text-muted hover:text-text'}`

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold">{c.vizTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{c.vizIntro}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">{c.vizBits}
          <select value={bits} onChange={e => setBits(Number(e.target.value))} className={select}>
            {BIT_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label className="text-sm">{c.vizScheme}
          <select value={scheme} onChange={e => setScheme(e.target.value as QuantScheme)} className={select}>
            <option value="symmetric">{c.vizSymmetric}</option>
            <option value="asymmetric">{c.vizAsymmetric}</option>
          </select>
        </label>
        <label className="text-sm">{c.vizGroup}
          <select value={groupSize} onChange={e => setGroupSize(Number(e.target.value))} className={select}>
            {GROUP_SIZES.map(g => <option key={g} value={g}>{g === 16 ? c.vizGroupRow : c.vizGroupN.replace('{n}', String(g))}</option>)}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={outlier} className={toggle(outlier)} onClick={() => setOutlier(v => !v)}>{c.vizOutlier} (w₆ = {fmt(OUTLIER_VALUE, 1)})</button>
        <button type="button" aria-pressed={keep} disabled={!outlier} className={`${toggle(keep && outlier)} disabled:opacity-40`} onClick={() => setKeep(v => !v)}>{c.vizKeep}</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-background/60 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[480px]" role="img" aria-label={c.vizTitle}>
          {q.groups.map((g, gi) => {
            const x0 = PAD_X + g.start * COL
            const width = (g.end - g.start) * COL
            const lines = g.grid.length <= 16 ? g.grid.filter(v => Math.abs(v) <= yMax) : []
            return (
              <g key={`${g.start}-${groupSize}`}>
                <rect x={x0} y={PAD_Y} width={width} height={H - 2 * PAD_Y} fill={GROUP_TINTS[gi % 2]} />
                {lines.map((level, li) => (
                  <motion.line key={li} x1={x0 + 2} x2={x0 + width - 2} initial={false} animate={{ y1: y(level), y2: y(level) }} transition={{ duration: 0.35 }} stroke="currentColor" strokeOpacity={0.22} strokeWidth={1} className="text-cyan-300" />
                ))}
              </g>
            )
          })}
          <line x1={PAD_X} x2={W - PAD_X} y1={zeroY} y2={zeroY} stroke="currentColor" strokeOpacity={0.45} className="text-muted" />
          {weights.map((w, i) => {
            const cx = PAD_X + i * COL
            const r = q.reconstructed[i]
            const kept = q.codes[i] === null
            return (
              <g key={i}>
                <motion.rect x={cx + COL * 0.2} width={COL * 0.6} initial={false} animate={{ y: Math.min(y(w), zeroY), height: Math.max(1, Math.abs(y(w) - zeroY)) }} transition={{ duration: 0.35 }} fill="none" stroke="currentColor" strokeWidth={1.5} className="text-muted" />
                <motion.rect x={cx + COL * 0.32} width={COL * 0.36} initial={false} animate={{ y: Math.min(y(r), zeroY), height: Math.max(1, Math.abs(y(r) - zeroY)) }} transition={{ duration: 0.35 }} className={kept ? 'fill-emerald-400' : 'fill-orange-400'} />
              </g>
            )
          })}
        </svg>
        <div className="flex flex-wrap gap-4 px-2 pb-1 pt-2 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 border-2 border-muted" />{c.vizOriginal}</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 bg-orange-400" />{c.vizReconstructed}</span>
          {outlier && keep && <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 bg-emerald-400" />{c.vizKept}</span>}
          <span className="flex items-center gap-1.5"><span className="inline-block h-px w-4 bg-cyan-300" />{bits === 8 ? c.vizGridDense : c.vizGrid}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-4"><p className="text-sm text-muted">{c.vizMse}</p><p className="font-mono text-2xl text-orange-300">{locale === 'de' ? mseNormal.toExponential(2).replace('.', ',') : mseNormal.toExponential(2)}</p></div>
        <div className="rounded-xl border border-border p-4"><p className="text-sm text-muted">{c.vizZeroed}</p><p className="font-mono text-2xl text-orange-300">{zeroed} / {normalIdx.length}</p></div>
        <div className="rounded-xl border border-border p-4"><p className="text-sm text-muted">{c.vizScales}</p><p className="font-mono text-2xl text-cyan-300">{q.groups.length}</p></div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right font-mono text-sm">
          <thead><tr className="text-muted">{[c.vizGroupHeader, c.vizScaleHeader, c.vizZeroHeader].map(h => <th key={h} className="p-2 font-sans font-medium">{h}</th>)}</tr></thead>
          <tbody>{q.groups.map((g, gi) => (
            <tr key={g.start} className="border-t border-border">
              <td className="p-2">{gi + 1} (w{g.start + 1}–w{g.end})</td>
              <td className="p-2 text-cyan-300">{fmt(g.scale, 4)}</td>
              <td className="p-2">{scheme === 'asymmetric' ? g.zeroPoint : '–'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <details className="rounded-xl border border-border p-4">
        <summary className="cursor-pointer text-sm font-medium">{c.vizWeight} · {c.vizCode} · {c.vizRecon} · {c.vizError}</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-right font-mono text-sm">
            <thead><tr className="text-muted">{['#', c.vizWeight, c.vizCode, c.vizRecon, c.vizError].map(h => <th key={h} className="p-2 font-sans font-medium">{h}</th>)}</tr></thead>
            <tbody>{weights.map((w, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-2 text-muted">w{i + 1}</td>
                <td className="p-2">{fmt(w)}</td>
                <td className="p-2 text-cyan-300">{q.codes[i] ?? c.vizKept}</td>
                <td className="p-2">{fmt(q.reconstructed[i])}</td>
                <td className="p-2 text-orange-300">{fmt(q.errors[i])}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </details>

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <p className="mb-2 text-sm font-semibold text-cyan-300">{c.vizTry}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">{[c.vizTry1, c.vizTry2, c.vizTry3].map(item => <li key={item}>{item}</li>)}</ul>
      </div>
      <p className="text-xs leading-relaxed text-muted">{c.vizNote}</p>
    </div>
  )
}

const MEMORY_FORMATS = [
  { key: 'memFp16', bpw: 16 },
  { key: 'memInt8', bpw: 8 },
  { key: 'memInt4', bpw: 4 + (16 + 4) / 128 },
  { key: 'memQ4km', bpw: 4.89 },
  { key: 'memMxfp4', bpw: 4.25 },
  { key: 'memNvfp4', bpw: 4.5 },
  { key: 'memTernary', bpw: Math.log2(3) },
] as const

export function QuantizationMemoryCalculator() {
  const { t, locale } = useTranslation()
  const c = t.quantization
  const [billions, setBillions] = useState(70)
  const maxGb = billions * 16 / 8
  return (
    <div className="space-y-4">
      <label className="block text-sm">{c.memParams}: <span className="font-mono text-cyan-300">{billions}B</span>
        <input className="mt-2 block w-full" type="range" min={1} max={400} value={billions} onChange={e => setBillions(Number(e.target.value))} />
      </label>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted"><th className="p-2 font-medium">{c.memFormat}</th><th className="p-2 text-right font-medium">{c.memBpw}</th><th className="p-2 text-right font-medium">{c.memGb}</th><th className="w-1/3 p-2" /></tr></thead>
          <tbody>{MEMORY_FORMATS.map(f => {
            const gb = billions * f.bpw / 8
            return (
              <tr key={f.key} className="border-t border-border">
                <td className="p-2">{c[f.key]}</td>
                <td className="p-2 text-right font-mono">{formatNumber(locale, f.bpw, 2)}</td>
                <td className="p-2 text-right font-mono text-cyan-300">{formatNumber(locale, gb, 1)}</td>
                <td className="p-2"><div className="h-2 rounded bg-background"><motion.div className="h-2 rounded bg-gradient-to-r from-cyan-400 to-purple-400" initial={false} animate={{ width: `${(gb / maxGb) * 100}%` }} transition={{ duration: 0.3 }} /></div></td>
              </tr>
            )
          })}</tbody>
        </table>
      </div>
      <p className="text-xs leading-relaxed text-muted">{c.memNote}</p>
    </div>
  )
}
