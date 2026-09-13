'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from '@/lib/i18n/context'

/* ─── 1. Catastrophic Forgetting Demo ─── */
interface ForgettingDemoProps {
  labels: {
    title: string
    taskA: string
    taskB: string
    trainA: string
    trainB: string
    reset: string
    knowledge: string
    step: string
    forgettingWarning: string
  }
}

export function ForgettingDemo({ labels }: ForgettingDemoProps) {
  const { locale } = useLocale()
  const de = locale === 'de'
  const [weight, setWeight] = useState(0)
  const [step, setStep] = useState(0)
  const update = (target: number) => { setWeight(w => w - 0.25 * (w - target)); setStep(s => s + 1) }
  return <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
    <h3 className="font-semibold">{de ? 'Zwei widersprüchliche Aufgaben, ein Parameter' : 'Two conflicting tasks, one parameter'}</h3>
    <p className="text-sm text-muted">{de ? 'Echte Gradientenrechnung im Spielmodell: Aufgabe A möchte w = 1, Aufgabe B möchte w = −1. Loss = ½(w − Ziel)², Lernrate = 0,25. Das erklärt Interferenz in einem gemeinsamen Parameter, bildet aber weder ein LLM noch HOPE ab.' : 'Actual gradient updates in a toy model: task A wants w = 1, task B wants w = −1. Loss = ½(w − target)², learning rate = 0.25. This explains interference in one shared parameter, but models neither an LLM nor HOPE.'}</p>
    <p className="font-mono">w = {weight.toFixed(3)} · {labels.step}: {step}</p>
    <div className="grid grid-cols-2 gap-3"><p className="rounded-lg border border-border p-3 font-mono">Loss A: {(0.5 * (weight - 1) ** 2).toFixed(4)}</p><p className="rounded-lg border border-border p-3 font-mono">Loss B: {(0.5 * (weight + 1) ** 2).toFixed(4)}</p></div>
    <div className="flex flex-wrap gap-2"><button type="button" className="rounded-lg border border-cyan-500/30 px-3 py-2" onClick={() => update(1)}>{de ? 'Schritt für A' : 'Step on A'}</button><button type="button" className="rounded-lg border border-purple-500/30 px-3 py-2" onClick={() => update(-1)}>{de ? 'Schritt für B' : 'Step on B'}</button><button type="button" className="rounded-lg border border-border px-3 py-2" onClick={() => { setWeight(0); setStep(0) }}>{labels.reset}</button></div>
  </div>
}

interface NestedLoopsProps {
  labels: {
    title: string
    outer: string
    middle: string
    inner: string
    outerDesc: string
    middleDesc: string
    innerDesc: string
    running: string
    paused: string
    play: string
    pause: string
  }
}

export function NestedLoopsDemo({ labels }: NestedLoopsProps) {
  const [running, setRunning] = useState(false)
  const [outerProgress, setOuterProgress] = useState(0)
  const [middleProgress, setMiddleProgress] = useState(0)
  const [innerProgress, setInnerProgress] = useState(0)
  const outerRef = useRef(0)
  const middleRef = useRef(0)
  const innerRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      let inner = innerRef.current
      let middle = middleRef.current
      let outer = outerRef.current

      if (inner >= 100) {
        inner = 0
        if (middle >= 100) {
          middle = 0
          if (outer >= 100) {
            setRunning(false)
          } else {
            outer += 10
          }
        } else {
          middle += 10
        }
      } else {
        inner += 5
      }

      innerRef.current = inner
      middleRef.current = middle
      outerRef.current = outer
      setInnerProgress(inner)
      setMiddleProgress(middle)
      setOuterProgress(outer)
    }, 60)
    return () => clearInterval(interval)
  }, [running])

  const restart = () => {
    outerRef.current = 0; middleRef.current = 0; innerRef.current = 0
    setOuterProgress(0); setMiddleProgress(0); setInnerProgress(0)
    setRunning(true)
  }

  const loopRing = (progress: number, color: string, radius: number, label: string, desc: string) => (
    <g>
      <circle cx="150" cy="150" r={radius} fill="none" stroke="currentColor" className="text-border" strokeWidth="8" />
      <motion.circle
        cx="150" cy="150" r={radius} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={2 * Math.PI * radius}
        animate={{ strokeDashoffset: 2 * Math.PI * radius * (1 - progress / 100) }}
        transition={{ duration: 0.1 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '150px 150px' }}
      />
      <text x="150" y={150 - radius - 12} textAnchor="middle" fill={color} fontSize="11" fontWeight="600">{label}</text>
      <text x="150" y={150 + radius + 18} textAnchor="middle" fill="#94a3b8" fontSize="9">{desc}</text>
    </g>
  )

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-lg font-bold text-text mb-4">{labels.title}</h3>
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 300 300" className="w-full max-w-[280px]">
          {loopRing(outerProgress, '#a78bfa', 120, labels.outer, labels.outerDesc)}
          {loopRing(middleProgress, '#22d3ee', 85, labels.middle, labels.middleDesc)}
          {loopRing(innerProgress, '#34d399', 50, labels.inner, labels.innerDesc)}
        </svg>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => running ? setRunning(false) : outerProgress >= 100 ? restart() : setRunning(true)}
            className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-sm font-medium transition-colors"
          >
            {running ? labels.pause : labels.play}
          </button>
          <span className={`text-xs self-center ${running ? 'text-emerald-400' : 'text-muted'}`}>
            {running ? labels.running : labels.paused}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── 3. Before/After Comparison (Nested vs Traditional) ─── */
interface ComparisonDemoProps {
  labels: {
    title: string
    traditional: string
    nested: string
    taskA: string
    taskB: string
    taskC: string
    runDemo: string
    reset: string
  }
}

export function ComparisonDemo(_props: ComparisonDemoProps) {
  const { locale } = useLocale()
  const de = locale === 'de'
  return <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
    <h3 className="font-semibold">{de ? 'Was ein belastbarer Vergleich messen müsste' : 'What a useful comparison must measure'}</h3>
    <p className="text-sm text-muted">{de ? 'Die HOPE-Arbeit berichtet Experimente zu Sprachmodellierung, langem Kontext und fortlaufendem Lernen. Daraus folgt kein universeller Prozentsatz für erhaltenes Wissen. Für einen Vergleich braucht es dieselben Daten, Aufgabenfolgen und Rechenbudgets sowie eine Evaluation früherer Aufgaben nach jedem Update.' : 'The HOPE work reports experiments on language modeling, long context and continual learning. It does not establish a universal percentage of retained knowledge. A comparison needs matched data, task sequences and compute budgets, with earlier tasks evaluated again after each update.'}</p>
    <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">{(de ? ['Leistung auf A vor und nach Training auf B messen.', 'Leistung auf der neuen Aufgabe und Aufwand ebenfalls berichten.', 'Updatefrequenzen und Speicherbudget dokumentieren.', 'Mehrere Aufgabenfolgen und Seeds vergleichen.'] : ['Measure A before and after training on B.', 'Report performance on the new task and its cost as well.', 'Document update frequencies and memory budget.', 'Compare multiple task orders and random seeds.']).map(item => <li key={item}>{item}</li>)}</ol>
    <a className="inline-block text-sm text-cyan-300 underline" href="https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/">{de ? 'Primärquelle: Google Research zu Nested Learning und HOPE' : 'Primary source: Google Research on Nested Learning and HOPE'}</a>
  </div>
}

interface HopeDiagramProps {
  labels: {
    title: string
    input: string
    selfModifying: string
    memory: string
    output: string
    learnRules: string
    storeRecall: string
  }
}

export function HopeDiagram({ labels }: HopeDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const W = 110, H = 44
  const nodes = [
    { id: 'input', x: 80, y: 125, label: labels.input, color: '#94a3b8' },
    { id: 'self', x: 260, y: 65, label: labels.selfModifying, color: '#a78bfa' },
    { id: 'memory', x: 260, y: 185, label: labels.memory, color: '#22d3ee' },
    { id: 'output', x: 440, y: 125, label: labels.output, color: '#34d399' },
  ]

  const edges = [
    { from: 'input', to: 'self', label: '' },
    { from: 'input', to: 'memory', label: '' },
    { from: 'self', to: 'output', label: labels.learnRules },
    { from: 'memory', to: 'output', label: labels.storeRecall },
    { from: 'self', to: 'memory', label: '' },
  ]

  const getNode = (id: string) => nodes.find(n => n.id === id)!

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-lg font-bold text-text mb-4">{labels.title}</h3>
      <svg viewBox="0 0 520 250" className="w-full max-w-[580px] mx-auto">
        <defs>
          <marker id="hope-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const from = getNode(e.from)
          const to = getNode(e.to)
          const isVertical = from.x === to.x
          const x1 = isVertical ? from.x : from.x + W / 2
          const y1 = isVertical ? from.y + H / 2 : from.y
          const x2 = isVertical ? to.x : to.x - W / 2
          const y2 = isVertical ? to.y - H / 2 : to.y
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#475569" strokeWidth="1.5" markerEnd="url(#hope-arrow)" />
              {e.label && (
                <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 10}
                  textAnchor="middle" fill="#94a3b8" fontSize="10">{e.label}</text>
              )}
            </g>
          )
        })}
        {nodes.map(n => (
          <g key={n.id}
            onMouseEnter={() => setHoveredNode(n.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x={n.x - W / 2} y={n.y - H / 2} width={W} height={H} rx={12}
              fill={hoveredNode === n.id ? n.color + '30' : n.color + '15'}
              stroke={n.color} strokeWidth={hoveredNode === n.id ? 2 : 1.5}
              style={{ transition: 'fill 0.2s, stroke-width 0.2s' }}
            />
            <text x={n.x} y={n.y + 5} textAnchor="middle" fill={n.color} fontSize="12" fontWeight="600">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
