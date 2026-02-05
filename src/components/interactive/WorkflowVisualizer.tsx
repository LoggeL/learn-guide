'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Bot, Wrench, ArrowRight, Check, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type NodeType = 'agent' | 'tool'
type WorkflowPattern = 'sequential' | 'parallel' | 'hierarchical' | 'handoff'
type NodeStatus = 'pending' | 'running' | 'completed'

interface WorkflowNode {
  id: string
  type: NodeType
  labelKey: string
  status: NodeStatus
  col: number   // grid column (0-based)
  row: number   // grid row (0-based)
}

interface Connection {
  from: string
  to: string
}

interface PatternDef {
  nodes: WorkflowNode[]
  connections: Connection[]
  cols: number
  rows: number
}

/* ------------------------------------------------------------------ */
/*  Pattern definitions — grid-based layout                           */
/* ------------------------------------------------------------------ */

const PATTERNS: Record<WorkflowPattern, PatternDef> = {
  sequential: {
    cols: 4, rows: 1,
    nodes: [
      { id: '1', type: 'agent', labelKey: 'vizNodePlanner',   status: 'pending', col: 0, row: 0 },
      { id: '2', type: 'tool',  labelKey: 'vizNodeSearch',    status: 'pending', col: 1, row: 0 },
      { id: '3', type: 'agent', labelKey: 'vizNodeAnalyzer',  status: 'pending', col: 2, row: 0 },
      { id: '4', type: 'tool',  labelKey: 'vizNodeSummarize', status: 'pending', col: 3, row: 0 },
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
    ],
  },

  parallel: {
    cols: 3, rows: 3,
    nodes: [
      { id: '1', type: 'agent', labelKey: 'vizNodeCoordinator', status: 'pending', col: 1, row: 0 },
      { id: '2', type: 'tool',  labelKey: 'vizNodeTaskA',       status: 'pending', col: 0, row: 1 },
      { id: '3', type: 'tool',  labelKey: 'vizNodeTaskB',       status: 'pending', col: 1, row: 1 },
      { id: '4', type: 'tool',  labelKey: 'vizNodeTaskC',       status: 'pending', col: 2, row: 1 },
      { id: '5', type: 'agent', labelKey: 'vizNodeAggregator',  status: 'pending', col: 1, row: 2 },
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
    cols: 4, rows: 3,
    nodes: [
      { id: '1', type: 'agent', labelKey: 'vizNodeSupervisor', status: 'pending', col: 1.5, row: 0 },
      { id: '2', type: 'agent', labelKey: 'vizNodeWorkerA',    status: 'pending', col: 0.5, row: 1 },
      { id: '3', type: 'agent', labelKey: 'vizNodeWorkerB',    status: 'pending', col: 2.5, row: 1 },
      { id: '4', type: 'tool',  labelKey: 'vizNodeTool1',      status: 'pending', col: 0, row: 2 },
      { id: '5', type: 'tool',  labelKey: 'vizNodeTool2',      status: 'pending', col: 1, row: 2 },
      { id: '6', type: 'tool',  labelKey: 'vizNodeTool3',      status: 'pending', col: 2, row: 2 },
      { id: '7', type: 'tool',  labelKey: 'vizNodeTool4',      status: 'pending', col: 3, row: 2 },
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

  handoff: {
    cols: 4, rows: 1,
    nodes: [
      { id: '1', type: 'agent', labelKey: 'vizNodeTriage',  status: 'pending', col: 0, row: 0 },
      { id: '2', type: 'agent', labelKey: 'vizNodeBilling', status: 'pending', col: 1, row: 0 },
      { id: '3', type: 'agent', labelKey: 'vizNodeSupport', status: 'pending', col: 2, row: 0 },
      { id: '4', type: 'agent', labelKey: 'vizNodeResolve', status: 'pending', col: 3, row: 0 },
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
    ],
  },
}

const EXECUTION_STEPS: Record<WorkflowPattern, string[][]> = {
  sequential:    [['1'], ['2'], ['3'], ['4']],
  parallel:      [['1'], ['2', '3', '4'], ['5']],
  hierarchical:  [['1'], ['2', '3'], ['4', '5', '6', '7']],
  handoff:       [['1'], ['2'], ['3'], ['4']],
}

/* ------------------------------------------------------------------ */
/*  Styling maps                                                       */
/* ------------------------------------------------------------------ */

const TYPE_STYLES: Record<NodeType, {
  gradient: string
  border: string
  iconBg: string
  iconColor: string
  glow: string
}> = {
  agent: {
    gradient: 'from-purple-500/10 to-violet-500/10',
    border: 'border-purple-500/30',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-300',
    glow: 'rgba(168,85,247,0.4)',
  },
  tool: {
    gradient: 'from-cyan-500/10 to-blue-500/10',
    border: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-300',
    glow: 'rgba(34,211,238,0.4)',
  },
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Convert grid col/row to pixel centre within the canvas */
function nodePos(
  node: WorkflowNode,
  def: PatternDef,
  canvasW: number,
  canvasH: number,
) {
  const padX = 70
  const padY = 52
  const usableW = canvasW - padX * 2
  const usableH = canvasH - padY * 2
  const stepX = def.cols > 1 ? usableW / (def.cols - 1) : 0
  const stepY = def.rows > 1 ? usableH / (def.rows - 1) : 0
  return {
    x: padX + node.col * stepX,
    y: padY + node.row * stepY,
  }
}

/** Curved SVG path between two points */
function connectionPath(
  x1: number, y1: number,
  x2: number, y2: number,
) {
  const dx = x2 - x1
  const dy = y2 - y1
  // For mostly-horizontal connections use gentle horizontal curves
  if (Math.abs(dx) > Math.abs(dy) * 1.5) {
    const cpOff = Math.abs(dx) * 0.35
    return `M ${x1} ${y1} C ${x1 + cpOff} ${y1}, ${x2 - cpOff} ${y2}, ${x2} ${y2}`
  }
  // For mostly-vertical connections use vertical bezier
  const cpOff = Math.abs(dy) * 0.45
  return `M ${x1} ${y1} C ${x1} ${y1 + cpOff}, ${x2} ${y2 - cpOff}, ${x2} ${y2}`
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

// Canvas dimensions
const CW = 680
const CH = 380

export function WorkflowVisualizer() {
  const { t } = useTranslation()
  const orch = t.orchestration as Record<string, string>

  const [pattern, setPattern] = useState<WorkflowPattern>('sequential')
  const [nodes, setNodes] = useState<WorkflowNode[]>(PATTERNS.sequential.nodes)
  const [isRunning, setIsRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(-1) // -1 = not started

  const patternDef = PATTERNS[pattern]
  const steps = EXECUTION_STEPS[pattern]

  // ------ pattern switch (synchronous reset to avoid stale renders) ------
  useEffect(() => {
    setNodes(PATTERNS[pattern].nodes.map(n => ({ ...n, status: 'pending' as const })))
    setStepIndex(-1)
    setIsRunning(false)
  }, [pattern])

  // Build a lookup of current node statuses keyed by id
  const nodeStatusMap = useMemo(() => {
    const map: Record<string, NodeStatus> = {}
    for (const n of nodes) map[n.id] = n.status
    return map
  }, [nodes])

  // Render nodes always come from the pattern definition, enriched with current status
  const renderNodes = useMemo(() =>
    patternDef.nodes.map(n => ({
      ...n,
      status: nodeStatusMap[n.id] ?? ('pending' as NodeStatus),
    })),
  [patternDef, nodeStatusMap])

  // ------ animation tick ------
  useEffect(() => {
    if (!isRunning) return

    const timer = setTimeout(() => {
      const next = stepIndex + 1
      if (next >= steps.length) {
        // Final tick — mark last batch completed
        setNodes(prev => prev.map(n => ({ ...n, status: 'completed' as const })))
        setIsRunning(false)
        return
      }
      const activeIds = new Set(steps[next])
      const completedIds = new Set(steps.slice(0, next + 1).flat())
      // nodes in the current batch are running, prior batches completed
      setNodes(
        PATTERNS[pattern].nodes.map(node => ({
          ...node,
          status: activeIds.has(node.id) ? 'running' as const
            : completedIds.has(node.id) && !activeIds.has(node.id)
              ? // check if it's from a prior batch
                steps.slice(0, next).flat().includes(node.id) ? 'completed' as const : 'running' as const
              : 'pending' as const,
        })),
      )
      setStepIndex(next)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isRunning, stepIndex, pattern, steps])

  // ------ derived state ------
  const isComplete = renderNodes.every(n => n.status === 'completed')
  const progressPct = isComplete ? 100 : stepIndex < 0 ? 0 : ((stepIndex + 1) / steps.length) * 100

  const handlePlayPause = useCallback(() => {
    if (isComplete) return
    setIsRunning(r => !r)
    if (stepIndex < 0) setStepIndex(-1) // will advance on next tick
  }, [isComplete, stepIndex])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setStepIndex(-1)
    setNodes(PATTERNS[pattern].nodes.map(n => ({ ...n, status: 'pending' as const })))
  }, [pattern])

  // Pattern tab metadata
  const tabs: { key: WorkflowPattern; label: string; summary: string; detail: string }[] = useMemo(() => [
    { key: 'sequential',   label: orch.vizSequentialLabel,    summary: orch.vizSequentialSummary,    detail: orch.vizSequentialDetail },
    { key: 'parallel',     label: orch.vizParallelLabel,      summary: orch.vizParallelSummary,      detail: orch.vizParallelDetail },
    { key: 'hierarchical', label: orch.vizHierarchicalLabel,  summary: orch.vizHierarchicalSummary,  detail: orch.vizHierarchicalDetail },
    { key: 'handoff',      label: orch.vizHandoffLabel,       summary: orch.vizHandoffSummary,       detail: orch.vizHandoffDetail },
  ], [orch])

  const activeTab = tabs.find(t => t.key === pattern)!

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-4">
      {/* ---- Pattern tabs ---- */}
      <div className="rounded-2xl bg-surface border border-border p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setPattern(tab.key)}
              className={`relative rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                pattern === tab.key
                  ? 'bg-primary/10 border-primary/40 shadow-[0_0_20px_-6px] shadow-primary/20'
                  : 'bg-surface-elevated border-border hover:border-primary/25 hover:bg-surface-elevated/80'
              }`}
            >
              <p className={`text-sm font-semibold ${pattern === tab.key ? 'text-primary-light' : 'text-text'}`}>
                {tab.label}
              </p>
              <p className="text-xs text-muted mt-0.5 leading-snug">{tab.summary}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ---- Canvas card ---- */}
      <div className="rounded-2xl bg-surface border border-border p-5">
        {/* Header + controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="font-semibold text-text font-heading">{activeTab.label}</h3>
            <p className="text-xs text-muted mt-0.5">{activeTab.summary}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePlayPause}
              disabled={isComplete}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                isRunning
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                  : isComplete
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 cursor-default'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRunning ? <Pause size={14} /> : isComplete ? <Check size={14} /> : <Play size={14} />}
              {isRunning ? orch.vizPause : isComplete ? orch.vizComplete : orch.vizRun}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-muted hover:text-text transition-colors"
            >
              <RotateCcw size={14} />
              {orch.vizReset}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted">{orch.vizProgress}</span>
            <span className="text-muted tabular-nums">
              {stepIndex < 0 ? 0 : Math.min(stepIndex + 1, steps.length)} {orch.vizStepOf} {steps.length}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-elevated border border-border overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="relative w-full rounded-xl border border-border overflow-hidden bg-background">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-cyan-500/[0.03]" />

          <svg
            viewBox={`0 0 ${CW} ${CH}`}
            className="relative w-full"
            style={{ aspectRatio: `${CW}/${CH}` }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Connections */}
            {patternDef.connections.map((conn, i) => {
              const fromNode = renderNodes.find(n => n.id === conn.from)!
              const toNode = renderNodes.find(n => n.id === conn.to)!
              const from = nodePos(fromNode, patternDef, CW, CH)
              const to = nodePos(toNode, patternDef, CW, CH)
              const isActive = fromNode.status === 'completed' || fromNode.status === 'running' || toNode.status === 'running'
              const isCompleted = fromNode.status === 'completed' && (toNode.status === 'completed' || toNode.status === 'running')
              const d = connectionPath(from.x, from.y, to.x, to.y)

              return (
                <g key={`${pattern}-conn-${i}`}>
                  {/* Track */}
                  <path
                    d={d}
                    fill="none"
                    stroke="rgba(63,63,70,0.5)"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                  {/* Active overlay */}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={isCompleted ? '#34d399' : isActive ? '#60a5fa' : 'transparent'}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                  {/* Arrowhead */}
                  {isCompleted && (
                    <motion.circle
                      cx={to.x}
                      cy={to.y}
                      r={4}
                      fill="#34d399"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.2 }}
                    />
                  )}
                </g>
              )
            })}

            {/* Nodes */}
            {renderNodes.map(node => {
              const pos = nodePos(node, patternDef, CW, CH)
              const style = TYPE_STYLES[node.type]
              const isActive = node.status === 'running'
              const isDone = node.status === 'completed'
              const Icon = node.type === 'agent' ? Bot : Wrench
              const label = orch[node.labelKey] ?? node.labelKey

              return (
                <motion.g
                  key={`${pattern}-${node.id}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.08 : 1,
                    x: pos.x,
                    y: pos.y,
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {/* Glow */}
                  {(isActive || isDone) && (
                    <motion.circle
                      r={40}
                      fill="none"
                      stroke={isDone ? 'rgba(52,211,153,0.25)' : style.glow}
                      strokeWidth={isDone ? 2 : 2.5}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={isActive ? {
                        scale: [0.8, 1.1, 0.8],
                        opacity: [0.3, 0.6, 0.3],
                      } : {
                        scale: 1,
                        opacity: 0.4,
                      }}
                      transition={isActive ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                    />
                  )}

                  {/* Card background */}
                  <rect
                    x={-54}
                    y={-30}
                    width={108}
                    height={60}
                    rx={12}
                    fill={isDone ? 'rgba(16,185,129,0.08)' : isActive ? 'rgba(96,165,250,0.08)' : 'rgba(39,39,42,0.6)'}
                    stroke={isDone ? 'rgba(52,211,153,0.4)' : isActive ? 'rgba(96,165,250,0.4)' : 'rgba(63,63,70,0.5)'}
                    strokeWidth={isDone ? 1.5 : isActive ? 1.5 : 1}
                  />

                  {/* Icon circle */}
                  <circle
                    cx={0}
                    cy={-6}
                    r={13}
                    fill={isDone ? 'rgba(52,211,153,0.15)' : isActive ? 'rgba(96,165,250,0.15)' : node.type === 'agent' ? 'rgba(168,85,247,0.15)' : 'rgba(34,211,238,0.15)'}
                  />
                  <foreignObject x={-10} y={-16} width={20} height={20}>
                    <div className="flex items-center justify-center w-full h-full">
                      {isDone
                        ? <Check size={13} className="text-emerald-400" />
                        : <Icon size={13} className={isActive ? 'text-blue-300' : node.type === 'agent' ? 'text-purple-300' : 'text-cyan-300'} />
                      }
                    </div>
                  </foreignObject>

                  {/* Label */}
                  <text
                    y={20}
                    textAnchor="middle"
                    className={`text-[11px] font-medium ${isDone ? 'fill-emerald-300' : isActive ? 'fill-blue-200' : 'fill-zinc-300'}`}
                  >
                    {label}
                  </text>

                  {/* Status pill */}
                  {(isActive || isDone) && (
                    <motion.g
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <rect
                        x={-18}
                        y={-44}
                        width={36}
                        height={16}
                        rx={8}
                        fill={isDone ? 'rgba(52,211,153,0.2)' : 'rgba(96,165,250,0.2)'}
                      />
                      <text
                        y={-33}
                        textAnchor="middle"
                        className={`text-[8px] font-semibold ${isDone ? 'fill-emerald-300' : 'fill-blue-300'}`}
                      >
                        {isDone ? orch.vizCompleted : orch.vizRunning}
                      </text>
                    </motion.g>
                  )}
                </motion.g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-purple-500/15 flex items-center justify-center">
              <Bot size={11} className="text-purple-300" />
            </div>
            <span className="text-muted">{orch.vizAgent}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-cyan-500/15 flex items-center justify-center">
              <Wrench size={11} className="text-cyan-300" />
            </div>
            <span className="text-muted">{orch.vizTool}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-muted">{orch.vizRunning}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-muted">{orch.vizCompleted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Pattern description ---- */}
      <div className="rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 px-5 py-4">
        <div className="flex items-start gap-3">
          <ChevronRight size={18} className="text-primary-light shrink-0 mt-0.5" />
          <p className="text-sm text-muted leading-relaxed">{activeTab.detail}</p>
        </div>
      </div>
    </div>
  )
}
