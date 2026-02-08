'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [phase, setPhase] = useState<'idle' | 'trainA' | 'doneA' | 'trainB' | 'doneB'>('idle')
  const [taskAKnowledge, setTaskAKnowledge] = useState(0)
  const [taskBKnowledge, setTaskBKnowledge] = useState(0)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (phase === 'trainA') {
      const interval = setInterval(() => {
        setTaskAKnowledge(prev => {
          if (prev >= 95) { setPhase('doneA'); clearInterval(interval); return 95 }
          return prev + 5
        })
        setStep(s => s + 1)
      }, 80)
      return () => clearInterval(interval)
    }
    if (phase === 'trainB') {
      const interval = setInterval(() => {
        setTaskBKnowledge(prev => {
          if (prev >= 95) { setPhase('doneB'); clearInterval(interval); return 95 }
          return prev + 5
        })
        setTaskAKnowledge(prev => Math.max(0, prev - 4))
        setStep(s => s + 1)
      }, 80)
      return () => clearInterval(interval)
    }
  }, [phase])

  const reset = () => { setPhase('idle'); setTaskAKnowledge(0); setTaskBKnowledge(0); setStep(0) }

  const barColor = (val: number, good: string, bad: string) =>
    val > 60 ? good : val > 30 ? 'bg-yellow-500' : bad

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-lg font-bold text-text mb-4">{labels.title}</h3>
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-cyan-400">{labels.taskA}</span>
            <span className="text-muted">{taskAKnowledge}%</span>
          </div>
          <div className="h-4 bg-surface-elevated rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${barColor(taskAKnowledge, 'bg-cyan-500', 'bg-red-500')}`}
              animate={{ width: `${taskAKnowledge}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-emerald-400">{labels.taskB}</span>
            <span className="text-muted">{taskBKnowledge}%</span>
          </div>
          <div className="h-4 bg-surface-elevated rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${barColor(taskBKnowledge, 'bg-emerald-500', 'bg-red-500')}`}
              animate={{ width: `${taskBKnowledge}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {phase === 'doneB' && taskAKnowledge < 30 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            ⚠️ {labels.forgettingWarning}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => { reset(); setTimeout(() => setPhase('trainA'), 50) }}
          disabled={phase === 'trainA' || phase === 'trainB'}
          className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-40 text-sm font-medium transition-colors"
        >
          {labels.trainA}
        </button>
        <button
          onClick={() => setPhase('trainB')}
          disabled={phase !== 'doneA'}
          className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-40 text-sm font-medium transition-colors"
        >
          {labels.trainB}
        </button>
        <button onClick={reset} className="px-4 py-2 rounded-lg bg-surface-elevated text-muted hover:text-text text-sm transition-colors">
          {labels.reset}
        </button>
        <span className="text-xs text-muted self-center ml-auto">{labels.step}: {step}</span>
      </div>
    </div>
  )
}

/* ─── 2. Animated Nested Loops ─── */
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

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setInnerProgress(prev => {
        if (prev >= 100) {
          setMiddleProgress(mp => {
            if (mp >= 100) {
              setOuterProgress(op => {
                if (op >= 100) {
                  setRunning(false)
                  return 100
                }
                return op + 10
              })
              return 0
            }
            return mp + 10
          })
          return 0
        }
        return prev + 5
      })
    }, 60)
    return () => clearInterval(interval)
  }, [running])

  const restart = () => {
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

export function ComparisonDemo({ labels }: ComparisonDemoProps) {
  const [phase, setPhase] = useState(0) // 0=idle, 1=taskA, 2=taskB, 3=taskC, 4=done
  const [trad, setTrad] = useState([0, 0, 0])
  const [nested, setNested] = useState([0, 0, 0])
  const tradRef = useRef([0, 0, 0])
  const nestedRef = useRef([0, 0, 0])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (phase === 0 || phase === 4) return
    const taskIdx = phase - 1
    const interval = setInterval(() => {
      const t = [...tradRef.current]
      t[taskIdx] = Math.min(90, t[taskIdx] + 5)
      for (let i = 0; i < taskIdx; i++) t[i] = Math.max(5, t[i] - 3)
      tradRef.current = t
      setTrad(t)

      const n = [...nestedRef.current]
      n[taskIdx] = Math.min(85, n[taskIdx] + 5)
      for (let i = 0; i < taskIdx; i++) n[i] = Math.max(n[i] - 0.5, 60)
      nestedRef.current = n
      setNested(n)

      if (t[taskIdx] >= 90 && n[taskIdx] >= 85) {
        clearInterval(interval)
        timeoutRef.current = setTimeout(() => setPhase(p => p === 0 ? 0 : p < 3 ? p + 1 : 4), 400)
      }
    }, 80)
    return () => {
      clearInterval(interval)
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    }
  }, [phase])

  const reset = () => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    setPhase(0)
    tradRef.current = [0, 0, 0]
    nestedRef.current = [0, 0, 0]
    setTrad([0, 0, 0])
    setNested([0, 0, 0])
  }
  const taskLabels = [labels.taskA, labels.taskB, labels.taskC]
  const taskColors = ['#22d3ee', '#a78bfa', '#f59e0b']

  const renderBars = (values: number[], label: string, bad: boolean) => (
    <div className="flex-1">
      <p className={`text-sm font-semibold mb-3 ${bad ? 'text-red-400' : 'text-emerald-400'}`}>{label}</p>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: taskColors[i] }}>{taskLabels[i]}</span>
              <span className="text-muted">{Math.round(v)}%</span>
            </div>
            <div className="h-3 bg-surface-elevated rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: bad && v < 30 ? '#ef4444' : taskColors[i] }}
                animate={{ width: `${v}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-lg font-bold text-text mb-4">{labels.title}</h3>
      <div className="flex gap-6 flex-col sm:flex-row">
        {renderBars(trad, labels.traditional, true)}
        {renderBars(nested, labels.nested, false)}
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => { reset(); setTimeout(() => setPhase(1), 50) }}
          disabled={phase > 0 && phase < 4}
          className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 disabled:opacity-40 text-sm font-medium transition-colors"
        >
          {labels.runDemo}
        </button>
        <button onClick={reset} className="px-4 py-2 rounded-lg bg-surface-elevated text-muted hover:text-text text-sm transition-colors">
          {labels.reset}
        </button>
      </div>
    </div>
  )
}

/* ─── 4. Hope Architecture Diagram ─── */
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
