'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Bot, Wrench, GitBranch, ArrowRight, Check } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type NodeType = 'agent' | 'tool' | 'condition'
type WorkflowPattern = 'sequential' | 'parallel' | 'hierarchical'

interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  status: 'pending' | 'running' | 'completed' | 'error'
  x: number
  y: number
}

interface Connection {
  from: string
  to: string
}

const PATTERNS: Record<WorkflowPattern, { nodes: WorkflowNode[]; connections: Connection[] }> = {
  sequential: {
    nodes: [
      { id: '1', type: 'agent', label: 'Planner', status: 'pending', x: 50, y: 50 },
      { id: '2', type: 'tool', label: 'Search', status: 'pending', x: 200, y: 50 },
      { id: '3', type: 'agent', label: 'Analyzer', status: 'pending', x: 350, y: 50 },
      { id: '4', type: 'tool', label: 'Summarize', status: 'pending', x: 500, y: 50 },
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
    ],
  },
  parallel: {
    nodes: [
      { id: '1', type: 'agent', label: 'Coordinator', status: 'pending', x: 275, y: 30 },
      { id: '2', type: 'tool', label: 'Task A', status: 'pending', x: 100, y: 120 },
      { id: '3', type: 'tool', label: 'Task B', status: 'pending', x: 275, y: 120 },
      { id: '4', type: 'tool', label: 'Task C', status: 'pending', x: 450, y: 120 },
      { id: '5', type: 'agent', label: 'Aggregator', status: 'pending', x: 275, y: 210 },
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '1', to: '3' },
      { from: '1', to: '4' },
      { from: '2', to: '5' },
      { from: '3', to: '5' },
      { from: '4', to: '5' },
    ],
  },
  hierarchical: {
    nodes: [
      { id: '1', type: 'agent', label: 'Supervisor', status: 'pending', x: 275, y: 30 },
      { id: '2', type: 'agent', label: 'Worker A', status: 'pending', x: 125, y: 120 },
      { id: '3', type: 'agent', label: 'Worker B', status: 'pending', x: 425, y: 120 },
      { id: '4', type: 'tool', label: 'Tool 1', status: 'pending', x: 50, y: 210 },
      { id: '5', type: 'tool', label: 'Tool 2', status: 'pending', x: 200, y: 210 },
      { id: '6', type: 'tool', label: 'Tool 3', status: 'pending', x: 350, y: 210 },
      { id: '7', type: 'tool', label: 'Tool 4', status: 'pending', x: 500, y: 210 },
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '1', to: '3' },
      { from: '2', to: '4' },
      { from: '2', to: '5' },
      { from: '3', to: '6' },
      { from: '3', to: '7' },
    ],
  },
}

const NODE_ICONS: Record<NodeType, typeof Bot> = {
  agent: Bot,
  tool: Wrench,
  condition: GitBranch,
}

const NODE_COLORS: Record<NodeType, string> = {
  agent: 'from-purple-500/20 to-pink-500/20 border-purple-500/50',
  tool: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50',
  condition: 'from-orange-500/20 to-yellow-500/20 border-orange-500/50',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-gray-500/20 text-gray-400',
  running: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-emerald-500/20 text-emerald-400',
  error: 'bg-red-500/20 text-red-400',
}

export function WorkflowVisualizer() {
  const { t } = useTranslation()
  const [pattern, setPattern] = useState<WorkflowPattern>('sequential')
  const [nodes, setNodes] = useState(PATTERNS.sequential.nodes)
  const [connections] = useState(PATTERNS.sequential.connections)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const newPattern = PATTERNS[pattern]
    setNodes(newPattern.nodes.map(n => ({ ...n, status: 'pending' as const })))
    setCurrentStep(0)
    setIsRunning(false)
  }, [pattern])

  useEffect(() => {
    if (!isRunning) return

    const runStep = () => {
      const patternData = PATTERNS[pattern]
      const totalSteps = patternData.nodes.length

      if (currentStep >= totalSteps) {
        setIsRunning(false)
        return
      }

      setNodes(prev => {
        const updated = [...prev]

        // For sequential: one at a time
        if (pattern === 'sequential') {
          if (currentStep > 0) {
            updated[currentStep - 1] = { ...updated[currentStep - 1], status: 'completed' }
          }
          updated[currentStep] = { ...updated[currentStep], status: 'running' }
        }

        // For parallel: coordinator first, then all tasks, then aggregator
        if (pattern === 'parallel') {
          if (currentStep === 0) {
            updated[0] = { ...updated[0], status: 'running' }
          } else if (currentStep === 1) {
            updated[0] = { ...updated[0], status: 'completed' }
            updated[1] = { ...updated[1], status: 'running' }
            updated[2] = { ...updated[2], status: 'running' }
            updated[3] = { ...updated[3], status: 'running' }
          } else if (currentStep === 2) {
            updated[1] = { ...updated[1], status: 'completed' }
            updated[2] = { ...updated[2], status: 'completed' }
            updated[3] = { ...updated[3], status: 'completed' }
            updated[4] = { ...updated[4], status: 'running' }
          } else if (currentStep === 3) {
            updated[4] = { ...updated[4], status: 'completed' }
          }
        }

        // For hierarchical: supervisor, then workers, then tools
        if (pattern === 'hierarchical') {
          if (currentStep === 0) {
            updated[0] = { ...updated[0], status: 'running' }
          } else if (currentStep === 1) {
            updated[0] = { ...updated[0], status: 'completed' }
            updated[1] = { ...updated[1], status: 'running' }
            updated[2] = { ...updated[2], status: 'running' }
          } else if (currentStep === 2) {
            updated[1] = { ...updated[1], status: 'completed' }
            updated[2] = { ...updated[2], status: 'completed' }
            updated[3] = { ...updated[3], status: 'running' }
            updated[4] = { ...updated[4], status: 'running' }
            updated[5] = { ...updated[5], status: 'running' }
            updated[6] = { ...updated[6], status: 'running' }
          } else if (currentStep === 3) {
            updated[3] = { ...updated[3], status: 'completed' }
            updated[4] = { ...updated[4], status: 'completed' }
            updated[5] = { ...updated[5], status: 'completed' }
            updated[6] = { ...updated[6], status: 'completed' }
          }
        }

        return updated
      })

      setCurrentStep(prev => prev + 1)
    }

    const timer = setTimeout(runStep, 1000)
    return () => clearTimeout(timer)
  }, [isRunning, currentStep, pattern])

  const handleReset = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setNodes(PATTERNS[pattern].nodes.map(n => ({ ...n, status: 'pending' as const })))
  }

  const isComplete = nodes.every(n => n.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Pattern Selection */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <h3 className="font-semibold text-text font-heading mb-4">Workflow Pattern</h3>
        <div className="flex flex-wrap gap-2">
          {(['sequential', 'parallel', 'hierarchical'] as WorkflowPattern[]).map((p) => (
            <button
              key={p}
              onClick={() => setPattern(p)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                pattern === p
                  ? 'bg-primary/20 text-primary-light border border-primary/50'
                  : 'bg-surface-elevated text-muted border border-border hover:border-primary/30'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text font-heading">Workflow Execution</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              disabled={isComplete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                isRunning
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              } disabled:opacity-50`}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
              {isRunning ? 'Pause' : isComplete ? 'Complete' : 'Run'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-muted hover:text-text transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative w-full h-72 bg-background rounded-xl border border-border overflow-hidden">
          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {PATTERNS[pattern].connections.map((conn, i) => {
              const fromNode = nodes.find(n => n.id === conn.from)
              const toNode = nodes.find(n => n.id === conn.to)
              if (!fromNode || !toNode) return null

              const fromX = fromNode.x + 40
              const fromY = fromNode.y + 20
              const toX = toNode.x
              const toY = toNode.y + 20

              const isActive = fromNode.status === 'completed' || fromNode.status === 'running'

              return (
                <motion.line
                  key={i}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={isActive ? '#22c55e' : '#333'}
                  strokeWidth={2}
                  strokeDasharray={isActive ? undefined : '4 4'}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                />
              )
            })}
          </svg>

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map((node) => {
              const Icon = NODE_ICONS[node.type]

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: node.status === 'running' ? 1.1 : 1,
                    left: node.x,
                    top: node.y,
                  }}
                  className="absolute"
                >
                  <div
                    className={`w-20 h-10 rounded-xl bg-gradient-to-br ${NODE_COLORS[node.type]} border-2 flex items-center justify-center gap-2 transition-all ${
                      node.status === 'running' ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-background' : ''
                    }`}
                  >
                    {node.status === 'completed' ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Icon size={14} className={node.type === 'agent' ? 'text-purple-400' : 'text-cyan-400'} />
                    )}
                    <span className="text-[10px] font-medium text-text truncate max-w-[50px]">
                      {node.label}
                    </span>
                  </div>
                  {node.status === 'running' && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-blue-400"
                    >
                      Running...
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <Bot size={14} className="text-purple-400" />
            <span className="text-muted">Agent</span>
          </div>
          <div className="flex items-center gap-2">
            <Wrench size={14} className="text-cyan-400" />
            <span className="text-muted">Tool</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-muted">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-muted">Running</span>
          </div>
        </div>
      </div>

      {/* Pattern Description */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <ArrowRight size={18} className="text-primary-light shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            {pattern === 'sequential' && (
              <p>Sequential workflows execute steps one after another. Each step must complete before the next begins.</p>
            )}
            {pattern === 'parallel' && (
              <p>Parallel workflows run multiple tasks simultaneously. A coordinator distributes work, and an aggregator combines results.</p>
            )}
            {pattern === 'hierarchical' && (
              <p>Hierarchical workflows use supervisors to delegate to workers. Workers can use multiple tools independently.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
