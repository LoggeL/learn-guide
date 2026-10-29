'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

/**
 * Real gradient descent on a toy LoRA problem:
 *   L(A, B) = ½ ‖s·B·A − T‖²_F,   s = α/r,   B ∈ ℝ^(n×r), A ∈ ℝ^(r×n)
 * with the paper's initialisation (A random, B = 0) and LoRA+ learning rates η_B = λ·η_A.
 * The target T = Σ σᵢ uᵢvᵢᵀ is built from orthonormal Walsh vectors, so its singular values are exact.
 */
const N = 8
const SIGMAS = [3, 1.5, 0.5]
const STEPS = 120
const ETA_A = 0.05
const RANK_OPTIONS = [1, 2, 3, 4]
const LAMBDA_OPTIONS = [1, 2, 4, 8, 16]

const WALSH = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, -1, 1, -1, 1, -1, 1, -1],
  [1, 1, -1, -1, 1, 1, -1, -1],
  [1, -1, -1, 1, 1, -1, -1, 1],
  [1, 1, 1, 1, -1, -1, -1, -1],
].map(row => row.map(x => x / Math.sqrt(N)))

const TARGET: number[][] = (() => {
  const m = Array.from({ length: N }, () => Array(N).fill(0))
  SIGMAS.forEach((sigma, i) => {
    const u = WALSH[i]
    const v = WALSH[i + 2]
    for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) m[a][b] += sigma * u[a] * v[b]
  })
  return m
})()

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function gaussian(random: () => number) {
  const u = Math.max(1e-9, random())
  const v = random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

const frob = (m: number[][]) => Math.sqrt(m.reduce((sum, row) => sum + row.reduce((s, x) => s + x * x, 0), 0))

interface Snapshot {
  loss: number
  normA: number
  normB: number
  gradA: number
  delta: number[][]
}

function simulate(rank: number, lambda: number): Snapshot[] {
  const random = seededRandom(7)
  const alpha = rank
  const s = alpha / rank
  const A = Array.from({ length: rank }, () => Array.from({ length: N }, () => gaussian(random) / Math.sqrt(N)))
  const B = Array.from({ length: N }, () => Array(rank).fill(0))
  const out: Snapshot[] = []
  for (let step = 0; step <= STEPS; step++) {
    const delta = Array.from({ length: N }, (_, a) => Array.from({ length: N }, (_, b) => {
      let x = 0
      for (let k = 0; k < rank; k++) x += B[a][k] * A[k][b]
      return s * x
    }))
    const G = delta.map((row, a) => row.map((x, b) => x - TARGET[a][b]))
    const dB = B.map((row, a) => row.map((_, k) => {
      let x = 0
      for (let b = 0; b < N; b++) x += G[a][b] * A[k][b]
      return s * x
    }))
    const dA = A.map((row, k) => row.map((_, b) => {
      let x = 0
      for (let a = 0; a < N; a++) x += B[a][k] * G[a][b]
      return s * x
    }))
    out.push({ loss: 0.5 * frob(G) ** 2, normA: frob(A), normB: frob(B), gradA: frob(dA), delta })
    for (let a = 0; a < N; a++) for (let k = 0; k < rank; k++) B[a][k] -= lambda * ETA_A * dB[a][k]
    for (let k = 0; k < rank; k++) for (let b = 0; b < N; b++) A[k][b] -= ETA_A * dA[k][b]
  }
  return out
}

// Chart geometry (log-scale loss axis)
const W = 520
const H = 200
const PAD = { left: 44, right: 12, top: 10, bottom: 26 }
const LOG_MIN = -3
const LOG_MAX = 1
const xOf = (step: number) => PAD.left + (step / STEPS) * (W - PAD.left - PAD.right)
const yOf = (loss: number) => {
  const l = Math.min(LOG_MAX, Math.max(LOG_MIN, Math.log10(Math.max(loss, 1e-6))))
  return PAD.top + ((LOG_MAX - l) / (LOG_MAX - LOG_MIN)) * (H - PAD.top - PAD.bottom)
}
const pathOf = (snapshots: Snapshot[]) => snapshots.map((snap, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(snap.loss).toFixed(1)}`).join(' ')

function Heatmap({ matrix, label }: { matrix: number[][]; label: string }) {
  const max = 1.2
  return (
    <figure className="flex flex-col items-center gap-2">
      <div className="grid grid-cols-8 gap-px rounded-md border border-border bg-border p-px" aria-hidden="true">
        {matrix.flat().map((value, i) => (
          <motion.div
            key={i}
            className={`h-4 w-4 sm:h-5 sm:w-5 ${value >= 0 ? 'bg-cyan-400' : 'bg-orange-400'}`}
            initial={false}
            animate={{ opacity: Math.min(1, Math.abs(value) / max) }}
            transition={{ duration: 0.15 }}
          />
        ))}
      </div>
      <figcaption className="font-mono text-xs text-muted">{label}</figcaption>
    </figure>
  )
}

export function LoraTrainingDynamicsDemo() {
  const { t, locale } = useTranslation()
  const c = t.lora
  const [rank, setRank] = useState(2)
  const [lambda, setLambda] = useState(16)
  const [step, setStep] = useState(0)

  const baseline = useMemo(() => simulate(rank, 1), [rank])
  const selected = useMemo(() => simulate(rank, lambda), [rank, lambda])
  const floor = 0.5 * SIGMAS.slice(rank).reduce((sum, sigma) => sum + sigma * sigma, 0)
  const snap = selected[step]
  const fmt = (value: number) => value.toLocaleString(locale, { maximumFractionDigits: 3, minimumFractionDigits: 3 })

  const buttonClass = (active: boolean) =>
    `rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors ${active ? 'border-cyan-500/60 bg-cyan-500/20 text-cyan-300' : 'border-border text-muted hover:text-text'}`

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{c.dynTitle}</h3>
        <p className="text-sm text-muted leading-relaxed">{c.dynDesc}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-sm text-muted">{c.dynRank}</div>
          <div className="flex flex-wrap gap-2">
            {RANK_OPTIONS.map(r => (
              <button key={r} type="button" className={buttonClass(r === rank)} onClick={() => setRank(r)}>r = {r}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm text-muted">{c.dynRatio}</div>
          <div className="flex flex-wrap gap-2">
            {LAMBDA_OPTIONS.map(l => (
              <button key={l} type="button" className={buttonClass(l === lambda)} onClick={() => setLambda(l)}>λ = {l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 text-xs text-muted">{c.dynLoss}</div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={c.dynLoss}>
          {[1, 0, -1, -2, -3].map(exp => (
            <g key={exp}>
              <line x1={PAD.left} x2={W - PAD.right} y1={yOf(10 ** exp)} y2={yOf(10 ** exp)} className="stroke-border" strokeWidth={1} />
              <text x={PAD.left - 6} y={yOf(10 ** exp) + 4} textAnchor="end" className="fill-muted" fontSize={10}>{(10 ** exp).toLocaleString(locale)}</text>
            </g>
          ))}
          {[0, 30, 60, 90, 120].map(s => (
            <text key={s} x={xOf(s)} y={H - 8} textAnchor="middle" className="fill-muted" fontSize={10}>{s}</text>
          ))}
          {floor > 0 && (
            <line x1={PAD.left} x2={W - PAD.right} y1={yOf(floor)} y2={yOf(floor)} stroke="#f472b6" strokeWidth={1.5} strokeDasharray="5 4" />
          )}
          <path d={pathOf(baseline)} fill="none" stroke="#a78bfa" strokeWidth={2} opacity={0.8} />
          <motion.path key={`${rank}-${lambda}`} d={pathOf(selected)} fill="none" stroke="#22d3ee" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
          <line x1={xOf(step)} x2={xOf(step)} y1={PAD.top} y2={H - PAD.bottom} stroke="currentColor" className="text-muted" strokeWidth={1} />
          <circle cx={xOf(step)} cy={yOf(snap.loss)} r={4} fill="#22d3ee" />
        </svg>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-2"><span className="inline-block h-0.5 w-5 bg-purple-400" />{c.dynBaseline}</span>
          <span className="flex items-center gap-2"><span className="inline-block h-0.5 w-5 bg-cyan-400" />{c.dynSelected} (λ = {lambda})</span>
          {floor > 0 && <span className="flex items-center gap-2"><span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-pink-400" />{c.dynFloor}: {floor.toLocaleString(locale)}</span>}
        </div>
      </div>

      <label className="block text-sm text-muted">
        {c.dynStep}: <span className="font-mono text-cyan-400">t = {step}</span>
        <input type="range" min={0} max={STEPS} value={step} onChange={e => setStep(Number(e.target.value))} className="mt-2 block w-full accent-cyan-400" />
      </label>

      <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        {[
          [c.dynLossNow, snap.loss],
          [c.dynNormA, snap.normA],
          [c.dynNormB, snap.normB],
          [c.dynGradA, snap.gradA],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-border bg-surface p-3">
            <dt className="text-muted">{String(label)}</dt>
            <dd className="mt-1 font-mono text-cyan-300">{fmt(Number(value))}</dd>
          </div>
        ))}
      </dl>

      {step === 0 && (
        <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
          {c.dynZeroGrad}
        </motion.p>
      )}

      <div className="flex flex-wrap items-start justify-center gap-8">
        <Heatmap matrix={TARGET} label={c.dynTarget} />
        <Heatmap matrix={snap.delta} label={`${c.dynLearned} · t = ${step}`} />
      </div>

      <p className="text-sm text-muted leading-relaxed">{c.dynFloorNote}</p>
      <p className="text-xs text-muted leading-relaxed">{c.dynCaveat}</p>
    </div>
  )
}
