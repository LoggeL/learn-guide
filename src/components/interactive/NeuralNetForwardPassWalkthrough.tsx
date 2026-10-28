'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import {
  NEURAL_NET_CASES,
  NEURAL_NET_THRESHOLD,
  NEURAL_NET_XOR_WEIGHTS,
  neuralNetForward221,
  neuralNetFormat,
  type NeuralNetParams221,
} from './NeuralNetShared'

interface NeuralNetDiagramProps {
  params: NeuralNetParams221
  x1: number
  x2: number
  h1: number
  h2: number
  y: number
  locale: string
}

const NODE = {
  x1: { x: 70, y: 70 },
  x2: { x: 70, y: 190 },
  h1: { x: 270, y: 70 },
  h2: { x: 270, y: 190 },
  y: { x: 450, y: 130 },
}

function edgeColor(weight: number) {
  if (Math.abs(weight) < 1e-9) return '#475569'
  return weight > 0 ? '#22c55e' : '#ef4444'
}

/** Static 2-2-1 diagram with weight labels on the edges and live values in the nodes. */
export function NeuralNetDiagram221({ params, x1, x2, h1, h2, y, locale }: NeuralNetDiagramProps) {
  const fmt = (v: number) => neuralNetFormat(v, locale, 2)
  const edges = [
    { from: NODE.x1, to: NODE.h1, w: params.w11, t: 0.3 },
    { from: NODE.x2, to: NODE.h1, w: params.w12, t: 0.22 },
    { from: NODE.x1, to: NODE.h2, w: params.w21, t: 0.22 },
    { from: NODE.x2, to: NODE.h2, w: params.w22, t: 0.3 },
    { from: NODE.h1, to: NODE.y, w: params.v1, t: 0.5 },
    { from: NODE.h2, to: NODE.y, w: params.v2, t: 0.5 },
  ]
  const nodes = [
    { id: 'x₁', pos: NODE.x1, value: x1, color: '#22d3ee' },
    { id: 'x₂', pos: NODE.x2, value: x2, color: '#22d3ee' },
    { id: 'h₁', pos: NODE.h1, value: h1, color: '#a855f7', bias: params.b1 },
    { id: 'h₂', pos: NODE.h2, value: h2, color: '#a855f7', bias: params.b2 },
    { id: 'y', pos: NODE.y, value: y, color: '#14b8a6', bias: params.c },
  ]

  return (
    <svg viewBox="0 0 520 260" className="w-full max-w-xl mx-auto" role="img" aria-label="2-2-1">
      {edges.map((e, i) => {
        const lx = e.from.x + (e.to.x - e.from.x) * e.t
        const ly = e.from.y + (e.to.y - e.from.y) * e.t
        return (
          <g key={i}>
            <line
              x1={e.from.x}
              y1={e.from.y}
              x2={e.to.x}
              y2={e.to.y}
              stroke={edgeColor(e.w)}
              strokeOpacity={0.7}
              strokeWidth={1 + Math.min(Math.abs(e.w), 3) * 1.3}
            />
            <rect x={lx - 20} y={ly - 11} width={40} height={20} rx={6} className="fill-background" stroke="#1e293b" />
            <text x={lx} y={ly + 4} textAnchor="middle" className="fill-text font-mono text-[11px]">
              {neuralNetFormat(e.w, locale, 1)}
            </text>
          </g>
        )
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          <motion.circle
            cx={n.pos.x}
            cy={n.pos.y}
            r={28}
            fill={n.color}
            fillOpacity={0.15}
            stroke={n.color}
            strokeWidth={2}
            initial={false}
            animate={{ fillOpacity: Math.abs(n.value) > 1e-9 ? 0.35 : 0.1 }}
          />
          <text x={n.pos.x} y={n.pos.y - 6} textAnchor="middle" className="fill-muted text-[11px]">
            {n.id}
          </text>
          <motion.text
            key={`${n.id}-${n.value}`}
            x={n.pos.x}
            y={n.pos.y + 11}
            textAnchor="middle"
            className="fill-text font-mono font-bold text-[13px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {fmt(n.value)}
          </motion.text>
          {n.bias !== undefined && (
            <text x={n.pos.x} y={n.pos.y + 46} textAnchor="middle" className="fill-subtle font-mono text-[11px]">
              b = {neuralNetFormat(n.bias, locale, 1)}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

export function NeuralNetForwardPassWalkthrough() {
  const { t, locale } = useTranslation()
  const w = t.neuralNetworks.walkthrough
  const p = NEURAL_NET_XOR_WEIGHTS
  const [caseIndex, setCaseIndex] = useState(3)
  const [x1, x2] = NEURAL_NET_CASES[caseIndex]
  const r = neuralNetForward221(p, x1, x2)
  const target = x1 !== x2 ? 1 : 0
  const fmt = (v: number) => neuralNetFormat(v, locale, 2)
  const paren = (v: number) => (v < 0 ? `(${fmt(v)})` : fmt(v))
  const threshold = fmt(NEURAL_NET_THRESHOLD)

  const steps = [
    {
      title: w.step1Title,
      lines: [
        `z₁ = 1·x₁ + 1·x₂ + 0 = 1·${x1} + 1·${x2} + 0 = ${fmt(r.z1)}`,
        `z₂ = 1·x₁ + 1·x₂ − 1 = 1·${x1} + 1·${x2} − 1 = ${fmt(r.z2)}`,
      ],
    },
    {
      title: w.step2Title,
      lines: [`h₁ = ReLU(${fmt(r.z1)}) = ${fmt(r.h1)}`, `h₂ = ReLU(${fmt(r.z2)}) = ${fmt(r.h2)}`],
      note: w.step2Note,
    },
    {
      title: w.step3Title,
      lines: [`y = 1·h₁ − 2·h₂ + 0 = 1·${paren(r.h1)} − 2·${paren(r.h2)} + 0 = ${fmt(r.y)}`],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-muted mr-2">{w.pickInput}:</span>
          {NEURAL_NET_CASES.map(([a, b], i) => (
            <button
              key={i}
              onClick={() => setCaseIndex(i)}
              aria-pressed={caseIndex === i}
              className={`px-3 py-1.5 rounded-lg border font-mono text-sm transition-colors ${
                caseIndex === i
                  ? 'bg-primary/20 border-primary/50 text-primary-light'
                  : 'bg-surface-elevated border-border text-muted hover:text-text'
              }`}
            >
              ({a}, {b})
            </button>
          ))}
        </div>
        <NeuralNetDiagram221 params={p} x1={x1} x2={x2} h1={r.h1} h2={r.h2} y={r.y} locale={locale} />
        <p className="text-xs text-muted mt-3 text-center">{w.weightsCaption}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={`${caseIndex}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="p-5 rounded-xl bg-background border border-border"
          >
            <h4 className="font-bold text-text mb-3">{step.title}</h4>
            <div className="space-y-1.5">
              {step.lines.map((line) => (
                <div key={line} className="font-mono text-sm text-cyan-300 break-words">
                  {line}
                </div>
              ))}
            </div>
            {step.note && <p className="text-xs text-muted mt-3">{step.note}</p>}
          </motion.div>
        ))}
        <motion.div
          key={`${caseIndex}-decision`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
        >
          <h4 className="font-bold text-text mb-3">{w.step4Title}</h4>
          <p className="text-xs text-muted mb-2">{w.decisionRule.replace('{threshold}', threshold)}</p>
          <div className="font-mono text-sm text-cyan-300">
            y = {fmt(r.y)} {r.prediction === 1 ? '≥' : '<'} {threshold} → {r.prediction}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
            <span className="text-muted">
              {w.predicted}: <span className="font-mono font-bold text-text">{r.prediction}</span>
            </span>
            <span className="text-muted">
              {w.target}: <span className="font-mono font-bold text-text">{target}</span>
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                r.prediction === target ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
              }`}
            >
              {r.prediction === target ? <Check size={12} /> : <X size={12} />}
              {r.prediction === target ? w.correct : w.wrong}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="rounded-2xl bg-surface border border-border p-6">
        <h4 className="font-bold text-text mb-4">{w.allInputsTitle}</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-left border-b border-border">
                <th className="py-2 pr-4 font-medium">{w.colInput}</th>
                <th className="py-2 pr-4 font-medium font-mono">h₁</th>
                <th className="py-2 pr-4 font-medium font-mono">h₂</th>
                <th className="py-2 pr-4 font-medium font-mono">y</th>
                <th className="py-2 pr-4 font-medium">{w.colPrediction}</th>
                <th className="py-2 font-medium">{w.colTarget}</th>
              </tr>
            </thead>
            <tbody>
              {NEURAL_NET_CASES.map(([a, b], i) => {
                const row = neuralNetForward221(p, a, b)
                return (
                  <tr
                    key={i}
                    onClick={() => setCaseIndex(i)}
                    className={`border-b border-border/50 cursor-pointer font-mono ${caseIndex === i ? 'bg-primary/10' : ''}`}
                  >
                    <td className="py-2 pr-4 text-text">({a}, {b})</td>
                    <td className="py-2 pr-4 text-muted">{fmt(row.h1)}</td>
                    <td className="py-2 pr-4 text-muted">{fmt(row.h2)}</td>
                    <td className="py-2 pr-4 text-muted">{fmt(row.y)}</td>
                    <td className="py-2 pr-4 text-text font-bold">{row.prediction}</td>
                    <td className="py-2 text-emerald-300">{a !== b ? 1 : 0}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted mt-4 leading-relaxed">{w.insight}</p>
      </div>
    </div>
  )
}
