'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Lightbulb, RotateCcw, Sparkles, X } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import {
  NEURAL_NET_CASES,
  NEURAL_NET_THRESHOLD,
  NEURAL_NET_XOR_WEIGHTS,
  neuralNetForward221,
  neuralNetFormat,
  type NeuralNetActivation,
  type NeuralNetParams221,
} from './NeuralNetShared'
import { NeuralNetDiagram221 } from './NeuralNetForwardPassWalkthrough'

type NeuralNetTask = 'and' | 'or' | 'xor'

const TARGETS: Record<NeuralNetTask, number[]> = {
  and: [0, 0, 0, 1],
  or: [0, 1, 1, 1],
  xor: [0, 1, 1, 0],
}

/** Hand-picked solutions with ReLU (AND and OR also work without activation). */
const SOLUTIONS: Record<NeuralNetTask, NeuralNetParams221> = {
  and: { w11: 1, w12: 1, b1: -1, w21: 0, w22: 0, b2: 0, v1: 1, v2: 0, c: 0 },
  or: { w11: 1, w12: 1, b1: 0, w21: 0, w22: 0, b2: 0, v1: 1, v2: 0, c: 0 },
  xor: NEURAL_NET_XOR_WEIGHTS,
}

// Starting point that solves none of the tasks: every case is answered with 0.
const START: NeuralNetParams221 = { w11: 0.8, w12: 0.4, b1: -0.2, w21: 0.3, w22: 0.9, b2: -0.5, v1: 0.6, v2: -0.4, c: 0 }

const MAP_MIN = -0.5
const MAP_MAX = 1.5
const MAP_CELLS = 40
const MAP_SIZE = 240

function toMap(v: number) {
  return ((v - MAP_MIN) / (MAP_MAX - MAP_MIN)) * MAP_SIZE
}

export function NeuralNetPlayground() {
  const { t, locale } = useTranslation()
  const c = t.neuralNetworks.playground
  const [task, setTask] = useState<NeuralNetTask>('xor')
  const [activation, setActivation] = useState<NeuralNetActivation>('relu')
  const [params, setParams] = useState<NeuralNetParams221>(START)
  const [selected, setSelected] = useState(1)

  const targets = TARGETS[task]
  const results = NEURAL_NET_CASES.map(([a, b]) => neuralNetForward221(params, a, b, activation))
  const correct = results.filter((r, i) => r.prediction === targets[i]).length
  const solved = correct === 4
  const sel = results[selected]
  const [sx1, sx2] = NEURAL_NET_CASES[selected]
  const fmt = (v: number, d = 2) => neuralNetFormat(v, locale, d)
  const threshold = fmt(NEURAL_NET_THRESHOLD)

  const cells = useMemo(() => {
    const step = (MAP_MAX - MAP_MIN) / MAP_CELLS
    const out: { x: number; y: number; on: boolean }[] = []
    for (let i = 0; i < MAP_CELLS; i++) {
      for (let j = 0; j < MAP_CELLS; j++) {
        const x1 = MAP_MIN + (i + 0.5) * step
        const x2 = MAP_MIN + (j + 0.5) * step
        out.push({ x: i, y: j, on: neuralNetForward221(params, x1, x2, activation).prediction === 1 })
      }
    }
    return out
  }, [params, activation])

  const cellSize = MAP_SIZE / MAP_CELLS

  const groups: { title: string; color: string; keys: { key: keyof NeuralNetParams221; label: string }[] }[] = [
    {
      title: c.neuronH1,
      color: 'text-purple-400',
      keys: [
        { key: 'w11', label: c.weightFrom.replace('{src}', 'x₁') },
        { key: 'w12', label: c.weightFrom.replace('{src}', 'x₂') },
        { key: 'b1', label: c.biasLabel },
      ],
    },
    {
      title: c.neuronH2,
      color: 'text-purple-400',
      keys: [
        { key: 'w21', label: c.weightFrom.replace('{src}', 'x₁') },
        { key: 'w22', label: c.weightFrom.replace('{src}', 'x₂') },
        { key: 'b2', label: c.biasLabel },
      ],
    },
    {
      title: c.neuronOut,
      color: 'text-emerald-400',
      keys: [
        { key: 'v1', label: c.weightFrom.replace('{src}', 'h₁') },
        { key: 'v2', label: c.weightFrom.replace('{src}', 'h₂') },
        { key: 'c', label: c.biasLabel },
      ],
    },
  ]

  const tasks: { id: NeuralNetTask; label: string; desc: string }[] = [
    { id: 'and', label: c.taskAnd, desc: c.taskAndDesc },
    { id: 'or', label: c.taskOr, desc: c.taskOrDesc },
    { id: 'xor', label: c.taskXor, desc: c.taskXorDesc },
  ]
  const currentTask = tasks.find((x) => x.id === task)!

  const toggleClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg border text-sm transition-colors ${
      active
        ? 'bg-primary/20 border-primary/50 text-primary-light'
        : 'bg-surface-elevated border-border text-muted hover:text-text'
    }`

  return (
    <div className="space-y-6">
      {/* Task and activation */}
      <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted mr-2 min-w-[5rem]">{c.taskLabel}:</span>
          {tasks.map((x) => (
            <button key={x.id} onClick={() => setTask(x.id)} aria-pressed={task === x.id} className={toggleClass(task === x.id)}>
              {x.label}
            </button>
          ))}
          <span className="text-sm text-muted ml-2">{currentTask.desc}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted mr-2 min-w-[5rem]">{c.activationLabel}:</span>
          <button onClick={() => setActivation('relu')} aria-pressed={activation === 'relu'} className={toggleClass(activation === 'relu')}>
            {c.activationRelu}
          </button>
          <button onClick={() => setActivation('linear')} aria-pressed={activation === 'linear'} className={toggleClass(activation === 'linear')}>
            {c.activationNone}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setParams(START)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-muted hover:text-text transition-colors"
          >
            <RotateCcw size={14} />
            {c.reset}
          </button>
          <button
            onClick={() => {
              setParams(SOLUTIONS[task])
              setActivation('relu')
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
          >
            <Sparkles size={14} />
            {c.showSolution}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Network + sliders */}
        <div className="rounded-2xl bg-surface border border-border p-6 space-y-5">
          <NeuralNetDiagram221 params={params} x1={sx1} x2={sx2} h1={sel.h1} h2={sel.h2} y={sel.y} locale={locale} />
          <div className="grid sm:grid-cols-3 gap-4">
            {groups.map((g) => (
              <div key={g.title} className="space-y-3">
                <div className={`text-sm font-bold ${g.color}`}>{g.title}</div>
                {g.keys.map(({ key, label }) => (
                  <label key={key} className="block">
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>{label}</span>
                      <span className="font-mono text-text">{fmt(params[key], 1)}</span>
                    </div>
                    <input
                      type="range"
                      min={-3}
                      max={3}
                      step={0.1}
                      value={params[key]}
                      onChange={(e) => setParams((prev) => ({ ...prev, [key]: Math.round(Number(e.target.value) * 10) / 10 }))}
                      aria-label={`${g.title}: ${label}`}
                      className="w-full accent-purple-500"
                    />
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Map + checks */}
        <div className="rounded-2xl bg-surface border border-border p-6 space-y-5">
          <div>
            <h4 className="font-bold text-text mb-1">{c.mapTitle}</h4>
            <p className="text-xs text-muted mb-3">{c.mapDesc.replace('{threshold}', threshold)}</p>
            <svg viewBox={`-28 -8 ${MAP_SIZE + 40} ${MAP_SIZE + 36}`} className="w-full max-w-xs mx-auto block">
              <rect x={0} y={0} width={MAP_SIZE} height={MAP_SIZE} className="fill-background" stroke="#1e293b" />
              {cells.map((cell) =>
                cell.on ? (
                  <rect
                    key={`${cell.x}-${cell.y}`}
                    x={cell.x * cellSize}
                    y={MAP_SIZE - (cell.y + 1) * cellSize}
                    width={cellSize + 0.3}
                    height={cellSize + 0.3}
                    fill="#22d3ee"
                    fillOpacity={0.22}
                  />
                ) : null,
              )}
              {[0, 1].map((v) => (
                <g key={v}>
                  <text x={toMap(v)} y={MAP_SIZE + 16} textAnchor="middle" className="fill-subtle text-[11px] font-mono">{v}</text>
                  <text x={-10} y={MAP_SIZE - toMap(v) + 4} textAnchor="middle" className="fill-subtle text-[11px] font-mono">{v}</text>
                </g>
              ))}
              <text x={MAP_SIZE - 4} y={MAP_SIZE + 26} textAnchor="end" className="fill-muted text-[11px] font-mono">x₁</text>
              <text x={-22} y={12} className="fill-muted text-[11px] font-mono">x₂</text>
              {NEURAL_NET_CASES.map(([a, b], i) => (
                <circle
                  key={i}
                  cx={toMap(a)}
                  cy={MAP_SIZE - toMap(b)}
                  r={selected === i ? 11 : 9}
                  fill={targets[i] === 1 ? '#22d3ee' : '#fb923c'}
                  stroke={selected === i ? '#f8fafc' : results[i].prediction === targets[i] ? '#0b1220' : '#ef4444'}
                  strokeWidth={selected === i ? 3 : 2}
                  className="cursor-pointer"
                  onClick={() => setSelected(i)}
                />
              ))}
            </svg>
            <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs text-muted">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-400" />{c.mapTarget1}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-400" />{c.mapTarget0}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-400/30" />{c.mapAnswer1}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-text">{c.casesTitle}</h4>
              <span className={`text-sm font-mono ${solved ? 'text-emerald-400' : 'text-muted'}`}>
                {c.score.replace('{n}', String(correct))}
              </span>
            </div>
            <p className="text-xs text-muted mb-3">{c.caseHint}</p>
            <div className="space-y-2">
              {NEURAL_NET_CASES.map(([a, b], i) => {
                const ok = results[i].prediction === targets[i]
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    aria-pressed={selected === i}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg border text-sm font-mono transition-colors ${
                      selected === i ? 'border-primary/50 bg-primary/10' : 'border-border bg-background hover:border-primary/30'
                    }`}
                  >
                    <span className="text-text">({a}, {b})</span>
                    <span className="text-muted">y = {fmt(results[i].y)}</span>
                    <span className="text-muted">{c.answer} {results[i].prediction}</span>
                    <span className="text-muted">{c.target} {targets[i]}</span>
                    <span className={ok ? 'text-emerald-400' : 'text-red-400'}>{ok ? <Check size={16} /> : <X size={16} />}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {solved ? (
              <motion.div
                key="solved"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm"
              >
                <Check size={16} />
                {c.solved}
              </motion.div>
            ) : task === 'xor' ? (
              <motion.div
                key={activation}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                  activation === 'linear'
                    ? 'bg-orange-500/10 border border-orange-500/30 text-orange-300'
                    : 'bg-primary/5 border border-primary/20 text-muted'
                }`}
              >
                <Lightbulb size={16} className="shrink-0 mt-0.5" />
                {activation === 'linear' ? c.linearXorHint : c.xorTip}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
