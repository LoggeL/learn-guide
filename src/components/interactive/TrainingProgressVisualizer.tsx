'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import {
  fitPolynomial,
  msePoly,
  polyTrainSet,
  polyValidationSet,
  predictPoly,
  trueFunction,
} from '@/lib/learning-math'

const MAX_DEGREE = 9
const LAMBDAS = [0, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 1]
const W = 600,
  H = 300
const Y_RANGE: [number, number] = [-2, 2]
const sx = (x: number) => 30 + ((x + 1) / 2) * (W - 60)
const sy = (y: number) => H - 20 - ((y - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * (H - 40)
const XS = Array.from({ length: 201 }, (_, i) => -1 + i / 100)
// Error chart (log axis)
const CW = 600,
  CH = 200,
  LOG_MIN = -4,
  LOG_MAX = 1
const cx = (d: number) => 50 + (d / MAX_DEGREE) * (CW - 80)
const cy = (v: number) => {
  const l = Math.min(LOG_MAX, Math.max(LOG_MIN, Math.log10(Math.max(v, 1e-12))))
  return CH - 30 - ((l - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (CH - 50)
}

/** Polynomial fit demo for the loss & generalization article (exact ridge regression). */
export function TrainingProgressVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.training.demo
  const [degree, setDegree] = useState(3)
  const [lambdaIndex, setLambdaIndex] = useState(0)
  const lambda = LAMBDAS[lambdaIndex]

  const curve = useMemo(
    () =>
      Array.from({ length: MAX_DEGREE + 1 }, (_, d) => {
        const w = fitPolynomial(polyTrainSet, d, lambda)
        return { d, w, train: msePoly(polyTrainSet, w), val: msePoly(polyValidationSet, w) }
      }),
    [lambda],
  )
  const current = curve[degree]
  const bestVal = Math.min(...curve.map((p) => p.val))
  const bestDegree = curve.findIndex((p) => p.val === bestVal)
  const maxWeight = Math.max(...current.w.slice(1).map(Math.abs), 0)

  const fitPath =
    'M' +
    XS.map((x) => {
      const y = Math.min(6, Math.max(-6, predictPoly(current.w, x)))
      return `${sx(x).toFixed(2)},${sy(y).toFixed(2)}`
    }).join(' L')
  const truthPath = XS.map((x) => `${sx(x)},${sy(trueFunction(x))}`).join(' ')

  const verdict =
    degree === MAX_DEGREE && lambda === 0
      ? c.interpolation
      : current.val <= 1.25 * bestVal
        ? c.goodFit
        : degree < bestDegree
          ? c.underfit
          : c.overfit

  const fmt = (v: number) =>
    v < 1e-3
      ? v.toExponential(1)
      : v.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 4 })
  const lambdaLabel = lambda === 0 ? c.lambdaOff : lambda.toExponential(0)

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient">{c.title}</h3>
        <p className="mt-2 text-sm text-muted">{c.note}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-text">
          {c.degree}: <span className="font-mono">{degree}</span>
          <input
            aria-label={c.degree}
            className="mt-1 w-full"
            type="range"
            min={0}
            max={MAX_DEGREE}
            step={1}
            value={degree}
            onChange={(e) => setDegree(+e.target.value)}
          />
        </label>
        <label className="text-sm text-text">
          {c.lambda}: <span className="font-mono">{lambdaLabel}</span>
          <input
            aria-label={c.lambda}
            className="mt-1 w-full"
            type="range"
            min={0}
            max={LAMBDAS.length - 1}
            step={1}
            value={lambdaIndex}
            onChange={(e) => setLambdaIndex(+e.target.value)}
          />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl bg-background" role="img" aria-label={c.ariaFit}>
        <defs>
          <clipPath id="poly-plot-area">
            <rect x={sx(-1) - 10} y={10} width={sx(1) - sx(-1) + 20} height={H - 20} />
          </clipPath>
        </defs>
        <line x1={sx(-1)} x2={sx(1)} y1={sy(0)} y2={sy(0)} stroke="#64748b" strokeOpacity={0.5} />
        <line x1={sx(0)} x2={sx(0)} y1={10} y2={H - 10} stroke="#64748b" strokeOpacity={0.5} />
        <polyline points={truthPath} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" />
        <g clipPath="url(#poly-plot-area)">
          <motion.path
            fill="none"
            stroke="#a78bfa"
            strokeWidth={3}
            initial={false}
            animate={{ d: fitPath }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </g>
        {polyValidationSet.map((p, i) => (
          <rect key={`v${i}`} x={sx(p.x) - 3} y={sy(p.y) - 3} width={6} height={6} fill="#fb923c" fillOpacity={0.8} />
        ))}
        {polyTrainSet.map((p, i) => (
          <circle key={`t${i}`} cx={sx(p.x)} cy={sy(p.y)} r={5.5} fill="#38bdf8" stroke="#0f172a" strokeWidth={1.5} />
        ))}
      </svg>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-sky-400" />
          {c.legendTrain}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 bg-orange-400" />
          {c.legendVal}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-5 border-t-2 border-dashed border-slate-400" />
          {c.legendTruth}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-5 border-t-[3px] border-purple-400" />
          {c.legendFit}
        </span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-3">
          <dt className="text-muted">{c.trainMse}</dt>
          <dd className="font-mono text-sky-400">{fmt(current.train)}</dd>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <dt className="text-muted">{c.valMse}</dt>
          <dd className="font-mono text-orange-400">{fmt(current.val)}</dd>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <dt className="text-muted">{c.maxWeight}</dt>
          <dd className="font-mono text-purple-400">{fmt(maxWeight)}</dd>
        </div>
      </dl>
      <p className="text-xs text-muted">{c.noiseFloor}</p>

      <motion.p
        key={verdict}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-text"
        role="status"
      >
        {verdict}
      </motion.p>

      <div>
        <p className="mb-2 text-sm text-muted">{c.curveTitle}</p>
        <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full rounded-xl bg-background" role="img" aria-label={c.ariaCurve}>
          {[-4, -3, -2, -1, 0, 1].map((l) => (
            <g key={l}>
              <line x1={45} x2={CW - 25} y1={cy(10 ** l)} y2={cy(10 ** l)} stroke="#64748b" strokeOpacity={0.2} />
              <text x={40} y={cy(10 ** l) + 4} textAnchor="end" fill="#94a3b8" fontSize={11}>
                {`10${l < 0 ? '⁻' : ''}${'⁰¹²³⁴'[Math.abs(l)]}`}
              </text>
            </g>
          ))}
          <line x1={45} x2={CW - 25} y1={cy(0.04)} y2={cy(0.04)} stroke="#94a3b8" strokeDasharray="3 4" />
          {curve.map((p) => (
            <text key={p.d} x={cx(p.d)} y={CH - 10} textAnchor="middle" fill={p.d === degree ? '#e2e8f0' : '#94a3b8'} fontSize={11}>
              {p.d}
            </text>
          ))}
          <rect x={cx(degree) - 12} y={10} width={24} height={CH - 40} fill="#a78bfa" fillOpacity={0.12} rx={4} />
          {(['train', 'val'] as const).map((key) => (
            <g key={key}>
              <polyline
                fill="none"
                stroke={key === 'train' ? '#38bdf8' : '#fb923c'}
                strokeWidth={2}
                points={curve.map((p) => `${cx(p.d)},${cy(p[key])}`).join(' ')}
              />
              {curve.map((p) => (
                <circle key={p.d} cx={cx(p.d)} cy={cy(p[key])} r={3} fill={key === 'train' ? '#38bdf8' : '#fb923c'} />
              ))}
            </g>
          ))}
        </svg>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="inline-block w-5 border-t-2 border-sky-400" />
            {c.curveTrain}
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-5 border-t-2 border-orange-400" />
            {c.curveVal}
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-5 border-t-2 border-dashed border-slate-400" />
            σ²
          </span>
        </div>
      </div>
    </div>
  )
}
