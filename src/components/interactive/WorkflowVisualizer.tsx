'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Bot, Wrench, GitBranch, ArrowRight, Check } from 'lucide-react'

type NodeType = 'agent' | 'tool' | 'condition'
type WorkflowPattern = 'sequential' | 'parallel' | 'hierarchical'
type NodeStatus = 'pending' | 'running' | 'completed' | 'error'

interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  status: NodeStatus
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
      { id: '1', type: 'agent', label: 'Planner', status: 'pending', x: 12, y: 50 },
      { id: '2', type: 'tool', label: 'Search', status: 'pending', x: 37, y: 50 },
      { id: '3', type: 'agent', label: 'Analyzer', status: 'pending', x: 63, y: 50 },
      { id: '4', type: 'tool', label: 'Summarize', status: 'pending', x: 88, y: 50 },
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
    ],
  },
  parallel: {
    nodes: [
      { id: '1', type: 'agent', label: 'Coordinator', status: 'pending', x: 50, y: 14 },
      { id: '2', type: 'tool', label: 'Task A', status: 'pending', x: 20, y: 44 },
      { id: '3', type: 'tool', label: 'Task B', status: 'pending', x: 50, y: 44 },
      { id: '4', type: 'tool', label: 'Task C', status: 'pending', x: 80, y: 44 },
      { id: '5', type: 'agent', label: 'Aggregator', status: 'pending', x: 50, y: 78 },
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
      { id: '1', type: 'agent', label: 'Supervisor', status: 'pending', x: 50, y: 12 },
      { id: '2', type: 'agent', label: 'Worker A', status: 'pending', x: 32, y: 38 },
      { id: '3', type: 'agent', label: 'Worker B', status: 'pending', x: 68, y: 38 },
      { id: '4', type: 'tool', label: 'Tool 1', status: 'pending', x: 14, y: 72 },
      { id: '5', type: 'tool', label: 'Tool 2', status: 'pending', x: 36, y: 72 },
      { id: '6', type: 'tool', label: 'Tool 3', status: 'pending', x: 64, y: 72 },
      { id: '7', type: 'tool', label: 'Tool 4', status: 'pending', x: 86, y: 72 },
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

const EXECUTION_STEPS: Record<WorkflowPattern, string[][]> = {
  sequential: [['1'], ['2'], ['3'], ['4']],
  parallel: [['1'], ['2', '3', '4'], ['5']],
  hierarchical: [['1'], ['2', '3'], ['4', '5', '6', '7']],
}

const PATTERN_META: Record<WorkflowPattern, { label: string; summary: string; details: string }> = {
  sequential: {
    label: 'Sequential',
    summary: 'One step at a time',
    details: 'Each node depends on the previous result, which improves control and traceability.',
  },
  parallel: {
    label: 'Parallel',
    summary: 'Fan out then merge',
    details: 'A coordinator distributes independent tasks, then an aggregator combines results.',
  },
  hierarchical: {
    label: 'Hierarchical',
    summary: 'Delegate by layers',
    details: 'A supervisor routes work to sub-agents, which orchestrate specialist tools beneath them.',
  },
}

const NODE_ICONS: Record<NodeType, typeof Bot> = {
  agent: Bot,
  tool: Wrench,
  condition: GitBranch,
}

const NODE_COLORS: Record<NodeType, { shell: string; icon: string }> = {
  agent: {
    shell: 'from-purple-500/15 to-pink-500/20 border-purple-400/40',
    icon: 'text-purple-300 bg-purple-500/20',
  },
  tool: {
    shell: 'from-cyan-500/15 to-blue-500/20 border-cyan-400/40',
    icon: 'text-cyan-300 bg-cyan-500/20',
  },
  condition: {
    shell: 'from-orange-500/15 to-yellow-500/20 border-orange-400/40',
    icon: 'text-orange-300 bg-orange-500/20',
  },
}

const STATUS_COLORS: Record<NodeStatus, string> = {
  pending: 'bg-zinc-500/20 text-zinc-400',
  running: 'bg-blue-500/20 text-blue-300',
  completed: 'bg-emerald-500/20 text-emerald-300',
  error: 'bg-red-500/20 text-red-300',
}

export function WorkflowVisualizer() {
  const [pattern, setPattern] = useState<WorkflowPattern>('sequential')
  const [nodes, setNodes] = useState(PATTERNS.sequential.nodes)
  const [isRunning, setIsRunning] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)

  useEffect(() => {
    const newPattern = PATTERNS[pattern]
    setNodes(newPattern.nodes.map(n => ({ ...n, status: 'pending' as const })))
    setCurrentFrame(0)
    setIsRunning(false)
  }, [pattern])

  useEffect(() => {
    if (!isRunning) return

    const steps = EXECUTION_STEPS[pattern]
    const totalFrames = steps.length + 1

    const timer = setTimeout(() => {
      if (currentFrame >= totalFrames) {
        setIsRunning(false)
        return
      }

      const activeNodeIds = currentFrame < steps.length ? steps[currentFrame] : []
      const completedNodeIds = new Set(steps.slice(0, currentFrame).flat())

      setNodes(
        PATTERNS[pattern].nodes.map((node) => ({
          ...node,
          status: activeNodeIds.includes(node.id) ? 'running' : completedNodeIds.has(node.id) ? 'completed' : 'pending',
        })),
      )
      setCurrentFrame(prev => prev + 1)
    }, 900)

    return () => clearTimeout(timer)
  }, [currentFrame, isRunning, pattern])

  const handleReset = () => {
    setIsRunning(false)
    setCurrentFrame(0)
    setNodes(PATTERNS[pattern].nodes.map(n => ({ ...n, status: 'pending' as const })))
  }

  const steps = EXECUTION_STEPS[pattern]
  const totalFrames = steps.length + 1
  const isComplete = nodes.every(n => n.status === 'completed')
  const progress = Math.min((currentFrame / totalFrames) * 100, 100)

  return (
    <div className="space-y-5">
      {/* Pattern Selection */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <h3 className="font-semibold text-text font-heading mb-4">Workflow Pattern</h3>
        <div className="grid gap-2 md:grid-cols-3">
          {(['sequential', 'parallel', 'hierarchical'] as WorkflowPattern[]).map((p) => (
            <button
              key={p}
              onClick={() => setPattern(p)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                pattern === p
                  ? 'bg-primary/15 text-primary-light border-primary/40'
                  : 'bg-surface-elevated text-muted border-border hover:border-primary/25 hover:text-text'
              }`}
            >
              <p className="text-sm font-medium">{PATTERN_META[p].label}</p>
              <p className="text-xs mt-1 opacity-80">{PATTERN_META[p].summary}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-text font-heading">Workflow Execution</h3>
            <p className="text-xs text-muted mt-0.5">{PATTERN_META[pattern].summary}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setIsRunning(!isRunning)}
              disabled={isComplete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors border ${
                isRunning
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
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

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted">Progress</span>
            <span className="text-muted">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-elevated border border-border overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25 }}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="relative w-full min-h-[320px] md:min-h-[360px] bg-background rounded-xl border border-border overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />

          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {PATTERNS[pattern].connections.map((conn, i) => {
              const fromNode = nodes.find(n => n.id === conn.from)
              const toNode = nodes.find(n => n.id === conn.to)
              if (!fromNode || !toNode) return null

              const fromX = fromNode.x
              const fromY = fromNode.y
              const toX = toNode.x
              const toY = toNode.y
              const midY = fromY + (toY - fromY) / 2

              const isActive =
                fromNode.status === 'completed' || fromNode.status === 'running' || toNode.status === 'running'
              const path = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`

              return (
                <motion.path
                  key={i}
                  d={path}
                  fill="none"
                  stroke={isActive ? '#34d399' : '#3f3f46'}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  strokeDasharray={isActive ? undefined : '4 3'}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, opacity: isActive ? 1 : 0.7 }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
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
                    scale: node.status === 'running' ? 1.06 : 1,
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                  transition={{ duration: 0.25 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    className={`w-[74px] md:w-[110px] rounded-xl px-2.5 py-2 bg-gradient-to-br border shadow-sm backdrop-blur-sm transition-all ${
                      NODE_COLORS[node.type].shell
                    } ${
                      node.status === 'running'
                        ? 'ring-2 ring-blue-400/60 ring-offset-1 ring-offset-background shadow-[0_0_20px_-8px_rgba(56,189,248,0.8)]'
                        : node.status === 'completed'
                          ? 'shadow-[0_0_18px_-10px_rgba(16,185,129,0.7)]'
                          : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center ${NODE_COLORS[node.type].icon}`}>
                        {node.status === 'completed' ? <Check size={11} className="text-emerald-300" /> : <Icon size={11} />}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] ${STATUS_COLORS[node.status]}`}>
                        {node.status}
                      </span>
                    </div>
                    <p className="text-[9px] md:text-xs font-medium text-text mt-1 truncate">{node.label}</p>
                  </div>
                  {node.status === 'running' && (
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-blue-300"
                    >
                      active
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <Bot size={14} className="text-purple-400" />
            <span className="text-muted">Agent</span>
          </div>
          <div className="flex items-center gap-2">
            <Wrench size={14} className="text-cyan-400" />
            <span className="text-muted">Tool</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-muted">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-muted">Running</span>
          </div>
        </div>
      </div>

      {/* Pattern Description */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <ArrowRight size={18} className="text-primary-light shrink-0 mt-0.5" />
          <div className="text-sm text-muted leading-relaxed">
            <p>{PATTERN_META[pattern].details}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
