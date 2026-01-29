'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Cpu, HardDrive, AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const EXPERT_COLORS = [
  '#a855f7', // purple
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f97316', // orange
  '#ec4899', // pink
  '#eab308', // yellow
  '#3b82f6', // blue
  '#ef4444', // red
]

interface GenerationStep {
  context: string
  nextToken: string
  selectedExperts: [number, number]
  weights: [number, number]
}

export function MoEVisualizer() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const generationSteps: GenerationStep[] = [
    { context: 'The capital of France is', nextToken: ' Paris', selectedExperts: [2, 5], weights: [0.72, 0.28] },
    { context: 'The capital of France is Paris', nextToken: '.', selectedExperts: [7, 3], weights: [0.65, 0.35] },
    { context: 'The capital of France is Paris.', nextToken: ' It', selectedExperts: [0, 4], weights: [0.58, 0.42] },
    { context: 'The capital of France is Paris. It', nextToken: ' is', selectedExperts: [3, 1], weights: [0.81, 0.19] },
  ]

  const [currentStep, setCurrentStep] = useState(-1)
  const [phase, setPhase] = useState<'idle' | 'routing' | 'processing' | 'output' | 'done'>('idle')
  const [generatedText, setGeneratedText] = useState('The capital of France is')
  const [expertUsage, setExpertUsage] = useState<number[]>(Array(8).fill(0))

  const runDemo = () => {
    if (phase !== 'idle' && phase !== 'done') return
    setCurrentStep(0)
    setPhase('routing')
    setGeneratedText('The capital of France is')
    setExpertUsage(Array(8).fill(0))
  }

  const reset = () => {
    setCurrentStep(-1)
    setPhase('idle')
    setGeneratedText('The capital of France is')
    setExpertUsage(Array(8).fill(0))
  }

  useEffect(() => {
    if (phase === 'idle' || currentStep < 0) return

    const step = generationSteps[currentStep]
    if (!step) {
      setPhase('done')
      return
    }

    if (phase === 'routing') {
      const timer = setTimeout(() => setPhase('processing'), 600)
      return () => clearTimeout(timer)
    }

    if (phase === 'processing') {
      const timer = setTimeout(() => {
        // Update expert usage stats
        setExpertUsage(prev => {
          const next = [...prev]
          next[step.selectedExperts[0]] += step.weights[0]
          next[step.selectedExperts[1]] += step.weights[1]
          return next
        })
        setPhase('output')
      }, 800)
      return () => clearTimeout(timer)
    }

    if (phase === 'output') {
      const timer = setTimeout(() => {
        setGeneratedText(prev => prev + step.nextToken)
        if (currentStep < generationSteps.length - 1) {
          setCurrentStep(currentStep + 1)
          setPhase('routing')
        } else {
          setPhase('done')
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [phase, currentStep, generationSteps])

  const currentStepData = currentStep >= 0 ? generationSteps[currentStep] : null

  // SVG Layout constants
  const width = 700
  const height = 340
  const tokenY = 50
  const routerY = 130
  const expertsY = 250
  const expertSpacing = width / 9
  const routerX = width / 2

  // Calculate expert positions
  const getExpertX = (i: number) => expertSpacing * (i + 1)

  // Calculate max usage for scaling
  const maxUsage = Math.max(...expertUsage, 0.1)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
            <Cpu size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.moe.vizTitle}</h3>
            <p className="text-xs text-muted">{t.moe.vizSubtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={reset}
            disabled={phase === 'idle'}
            className="p-2 bg-surface-elevated border border-border rounded-lg text-muted hover:text-text transition-colors disabled:opacity-50"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={runDemo}
            disabled={phase !== 'idle' && phase !== 'done'}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
          >
            <Play size={14} />
            {t.moe.vizGenerate}
          </button>
        </div>
      </div>

      {/* VRAM Warning Banner */}
      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
        <div className="flex items-start gap-3">
          <HardDrive size={20} className="text-orange-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-orange-400 mb-1">{t.moe.vizVramWarning}</h4>
            <p className="text-sm text-muted">{t.moe.vizVramExplain}</p>
          </div>
        </div>
      </div>

      {/* Main SVG Visualization - Fixed Size */}
      <div className="rounded-xl bg-surface border border-border p-4 overflow-x-auto">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="mx-auto"
          style={{ minWidth: width }}
        >
          {/* Background grid hint */}
          <defs>
            <linearGradient id="routerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Labels */}
          <text x={width / 2} y={20} textAnchor="middle" className="fill-muted text-xs uppercase tracking-wider">
            {t.moe.vizNextToken}
          </text>
          <text x={width / 2} y={routerY - 25} textAnchor="middle" className="fill-muted text-xs uppercase tracking-wider">
            {t.moe.vizRouterLabel}
          </text>
          <text x={width / 2} y={expertsY - 35} textAnchor="middle" className="fill-muted text-xs uppercase tracking-wider">
            {t.moe.vizExpertsLabel}
          </text>

          {/* Current Token being generated */}
          <g>
            <rect
              x={routerX - 60}
              y={tokenY - 15}
              width={120}
              height={30}
              rx={8}
              className={`transition-all duration-300 ${
                phase === 'routing' ? 'fill-purple-500/30 stroke-purple-400' : 'fill-surface-elevated stroke-border'
              }`}
              strokeWidth={phase === 'routing' ? 2 : 1}
            />
            <text
              x={routerX}
              y={tokenY + 5}
              textAnchor="middle"
              className="fill-text text-sm font-mono"
            >
              {currentStepData?.nextToken || '?'}
            </text>
          </g>

          {/* Line from Token to Router */}
          <motion.line
            x1={routerX}
            y1={tokenY + 15}
            x2={routerX}
            y2={routerY - 20}
            stroke={phase === 'routing' ? '#a855f7' : '#444'}
            strokeWidth={2}
            strokeDasharray={phase === 'routing' ? '0' : '4'}
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: phase !== 'idle' ? 1 : 0,
              opacity: phase === 'routing' ? 1 : 0.3
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Router */}
          <g>
            <motion.rect
              x={routerX - 80}
              y={routerY - 20}
              width={160}
              height={40}
              rx={12}
              fill="url(#routerGradient)"
              stroke={phase === 'routing' ? '#a855f7' : '#555'}
              strokeWidth={phase === 'routing' ? 2 : 1}
              animate={{
                filter: phase === 'routing' ? 'url(#glow)' : 'none'
              }}
            />
            <text x={routerX} y={routerY + 5} textAnchor="middle" className="fill-text text-sm font-semibold">
              {t.moe.vizRouter}
            </text>
          </g>

          {/* Lines from Router to Experts */}
          {Array(8).fill(0).map((_, i) => {
            const expertX = getExpertX(i)
            const isSelected = currentStepData?.selectedExperts.includes(i)
            const weight = isSelected
              ? currentStepData?.weights[currentStepData.selectedExperts.indexOf(i)] || 0
              : 0

            return (
              <g key={i}>
                {/* Connection line */}
                <motion.path
                  d={`M ${routerX} ${routerY + 20} Q ${routerX} ${(routerY + expertsY) / 2} ${expertX} ${expertsY - 30}`}
                  fill="none"
                  stroke={EXPERT_COLORS[i]}
                  strokeWidth={isSelected && phase === 'processing' ? 3 : 1}
                  strokeOpacity={isSelected && phase === 'processing' ? 1 : 0.2}
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: 1,
                    strokeOpacity: isSelected && phase === 'processing' ? 1 : 0.2
                  }}
                  transition={{ duration: 0.4, delay: isSelected ? 0.1 : 0 }}
                />

                {/* Weight label */}
                {isSelected && phase === 'processing' && (
                  <motion.text
                    x={(routerX + expertX) / 2}
                    y={(routerY + expertsY) / 2 - 10}
                    textAnchor="middle"
                    className="text-xs font-mono"
                    fill={EXPERT_COLORS[i]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {(weight * 100).toFixed(0)}%
                  </motion.text>
                )}
              </g>
            )
          })}

          {/* Experts */}
          {Array(8).fill(0).map((_, i) => {
            const expertX = getExpertX(i)
            const isSelected = currentStepData?.selectedExperts.includes(i) && phase === 'processing'
            const usage = expertUsage[i]

            return (
              <g key={i}>
                {/* Expert box */}
                <motion.rect
                  x={expertX - 32}
                  y={expertsY - 25}
                  width={64}
                  height={50}
                  rx={8}
                  fill={`${EXPERT_COLORS[i]}20`}
                  stroke={EXPERT_COLORS[i]}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeOpacity={isSelected ? 1 : 0.5}
                  animate={{
                    scale: isSelected ? 1.1 : 1,
                    filter: isSelected ? 'url(#glow)' : 'none'
                  }}
                  style={{ transformOrigin: `${expertX}px ${expertsY}px` }}
                />

                {/* Expert number */}
                <text
                  x={expertX}
                  y={expertsY - 5}
                  textAnchor="middle"
                  className="text-xs font-bold"
                  fill={EXPERT_COLORS[i]}
                >
                  E{i + 1}
                </text>

                {/* VRAM indicator (always loaded) */}
                <circle
                  cx={expertX + 22}
                  cy={expertsY - 18}
                  r={4}
                  fill={isSelected ? '#10b981' : '#666'}
                  className={isSelected ? 'animate-pulse' : ''}
                />

                {/* Usage bar */}
                <rect
                  x={expertX - 25}
                  y={expertsY + 30}
                  width={50}
                  height={6}
                  rx={3}
                  fill="#333"
                />
                <motion.rect
                  x={expertX - 25}
                  y={expertsY + 30}
                  width={50 * (usage / maxUsage)}
                  height={6}
                  rx={3}
                  fill={EXPERT_COLORS[i]}
                  animate={{ width: 50 * (usage / maxUsage) }}
                />
              </g>
            )
          })}

          {/* Output indicator */}
          {phase === 'output' && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <text
                x={width / 2}
                y={height - 20}
                textAnchor="middle"
                className="fill-emerald-400 text-sm"
              >
                → {currentStepData?.nextToken}
              </text>
            </motion.g>
          )}
        </svg>
      </div>

      {/* Generated Text Display */}
      <div className="rounded-xl bg-surface border border-border p-4">
        <div className="text-xs text-muted mb-2 uppercase tracking-wider">{t.moe.vizGeneratedText}</div>
        <div className="font-mono text-text bg-background rounded-lg p-3 min-h-[48px]">
          {generatedText}
          {phase !== 'idle' && phase !== 'done' && (
            <span className="inline-block w-2 h-4 bg-purple-400 ml-0.5 animate-pulse" />
          )}
        </div>
      </div>

      {/* VRAM Usage Bar */}
      <div className="rounded-xl bg-surface border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text">{t.moe.vizVramUsage}</span>
          <span className="text-sm text-muted">
            46.7B {t.moe.vizLoaded} / ~12.9B {t.moe.vizActive}
          </span>
        </div>
        <div className="h-8 rounded-lg bg-background overflow-hidden relative flex">
          {EXPERT_COLORS.map((color, i) => {
            const isActive = currentStepData?.selectedExperts.includes(i) && phase === 'processing'
            return (
              <motion.div
                key={i}
                className="h-full flex-1 border-r border-background/50 last:border-r-0"
                style={{ backgroundColor: `${color}${isActive ? '60' : '30'}` }}
                animate={{ opacity: isActive ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
              />
            )
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted">
          <span>{t.moe.vizMemoryFootprint}</span>
          <span className="text-orange-400">{t.moe.vizCannotOffload}</span>
        </div>
      </div>

      {/* Training Complexity Warning */}
      <div className="rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-yellow-400 mb-2">{t.moe.vizTrainingTitle}</p>
            <p className="text-muted mb-3">{t.moe.vizTrainingDesc}</p>
            <ul className="space-y-1.5 text-muted">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>{t.moe.vizTraining1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>{t.moe.vizTraining2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>{t.moe.vizTraining3}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 p-4">
        <div className="flex items-start gap-3">
          <HardDrive size={18} className="text-purple-400 shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p className="font-semibold text-purple-400 mb-1">{t.moe.vizKeyInsight}</p>
            <p>{t.moe.vizKeyInsightDesc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
