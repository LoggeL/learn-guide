'use client'

import { useState, useEffect, useCallback } from 'react'
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

  useEffect(() => {
    if (phase === 0 || phase === 4) return
    const taskIdx = phase - 1
    const interval = setInterval(() => {
      let tradDone = false, nestedDone = false

      setTrad(prev => {
        const next = [...prev]
        next[taskIdx] = Math.min(90, next[taskIdx] + 5)
        // Traditional: previous tasks decay
        for (let i = 0; i < taskIdx; i++) next[i] = Math.max(5, next[i] - 3)
        if (next[taskIdx] >= 90) tradDone = true
        return next
      })

      setNested(prev => {
        const next = [...prev]
        next[taskIdx] = Math.min(85, next[taskIdx] + 5)
        // Nested: previous tasks only slightly decay
        for (let i = 0; i < taskIdx; i++) next[i] = Math.max(next[i] - 0.5, 60)
        if (next[taskIdx] >= 85) nestedDone = true
        return next
      })

      if (tradDone && nestedDone) {
        setTimeout(() => setPhase(p => p < 3 ? p + 1 : 4), 400)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [phase])

  const reset = () => { setPhase(0); setTrad([0, 0, 0]); setNested([0, 0, 0]) }
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

  const nodes = [
    { id: 'input', x: 50, y: 100, label: labels.input, color: '#94a3b8' },
    { id: 'self', x: 200, y: 60, label: labels.selfModifying, color: '#a78bfa' },
    { id: 'memory', x: 200, y: 140, label: labels.memory, color: '#22d3ee' },
    { id: 'output', x: 350, y: 100, label: labels.output, color: '#34d399' },
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
      <svg viewBox="0 0 400 200" className="w-full max-w-[500px] mx-auto">
        {edges.map((e, i) => {
          const from = getNode(e.from)
          const to = getNode(e.to)
          return (
            <g key={i}>
              <line x1={from.x + 40} y1={from.y} x2={to.x - 40} y2={to.y}
                stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {e.label && (
                <text x={(from.x + to.x) / 2 + 20} y={(from.y + to.y) / 2 - 6}
                  textAnchor="middle" fill="#94a3b8" fontSize="7">{e.label}</text>
              )}
            </g>
          )
        })}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
          </marker>
        </defs>
        {nodes.map(n => (
          <g key={n.id} onMouseEnter={() => setHoveredNode(n.id)} onMouseLeave={() => setHoveredNode(null)}>
            <motion.rect
              x={n.x - 35} y={n.y - 18} width="70" height="36" rx="8"
              fill={hoveredNode === n.id ? n.color + '40' : n.color + '20'}
              stroke={n.color} strokeWidth="1.5"
              animate={{ scale: hoveredNode === n.id ? 1.05 : 1 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.color} fontSize="8" fontWeight="600">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
