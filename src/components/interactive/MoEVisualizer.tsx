'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Cpu, HardDrive } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface Expert {
  id: number
  name: string
  color: string
  specialization: string
}

interface Token {
  id: number
  text: string
  selectedExperts: number[]
  weights: number[]
}

const EXPERT_COLORS = [
  'purple',
  'cyan',
  'emerald',
  'orange',
  'pink',
  'yellow',
  'blue',
  'red',
]

const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', glow: 'shadow-purple-500/30' },
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400', glow: 'shadow-cyan-500/30' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' },
  orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400', glow: 'shadow-orange-500/30' },
  pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-400', glow: 'shadow-pink-500/30' },
  yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', glow: 'shadow-yellow-500/30' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', glow: 'shadow-blue-500/30' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', glow: 'shadow-red-500/30' },
}

export function MoEVisualizer() {
  const { t } = useTranslation()
  const [experts] = useState<Expert[]>(() =>
    EXPERT_COLORS.map((color, i) => ({
      id: i,
      name: `Expert ${i + 1}`,
      color,
      specialization: [
        t.moe.vizMath,
        t.moe.vizCode,
        t.moe.vizLanguage,
        t.moe.vizReasoning,
        t.moe.vizCreative,
        t.moe.vizFactual,
        t.moe.vizScience,
        t.moe.vizGeneral,
      ][i],
    }))
  )

  const [tokens] = useState<Token[]>([
    { id: 0, text: t.moe.vizToken1, selectedExperts: [1, 3], weights: [0.7, 0.3] },
    { id: 1, text: t.moe.vizToken2, selectedExperts: [0, 6], weights: [0.6, 0.4] },
    { id: 2, text: t.moe.vizToken3, selectedExperts: [2, 4], weights: [0.8, 0.2] },
  ])

  const [currentTokenIndex, setCurrentTokenIndex] = useState(-1)
  const [phase, setPhase] = useState<'idle' | 'routing' | 'processing' | 'done'>('idle')
  const [activeExperts, setActiveExperts] = useState<number[]>([])

  const runDemo = () => {
    if (phase !== 'idle' && phase !== 'done') return
    setCurrentTokenIndex(0)
    setPhase('routing')
    setActiveExperts([])
  }

  const reset = () => {
    setCurrentTokenIndex(-1)
    setPhase('idle')
    setActiveExperts([])
  }

  useEffect(() => {
    if (phase === 'idle' || currentTokenIndex < 0) return

    const token = tokens[currentTokenIndex]
    if (!token) {
      setPhase('done')
      return
    }

    if (phase === 'routing') {
      const timer = setTimeout(() => {
        setActiveExperts(token.selectedExperts)
        setPhase('processing')
      }, 800)
      return () => clearTimeout(timer)
    }

    if (phase === 'processing') {
      const timer = setTimeout(() => {
        if (currentTokenIndex < tokens.length - 1) {
          setCurrentTokenIndex(currentTokenIndex + 1)
          setActiveExperts([])
          setPhase('routing')
        } else {
          setPhase('done')
        }
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [phase, currentTokenIndex, tokens])

  const currentToken = currentTokenIndex >= 0 ? tokens[currentTokenIndex] : null

  // Calculate VRAM usage - all experts always loaded
  const totalVRAM = 46.7 // Mixtral example: 46.7B total params
  const activeVRAM = 12.9 // Only ~12.9B active per token

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
            disabled={phase === 'routing' || phase === 'processing'}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
          >
            <Play size={14} />
            {t.moe.vizRun}
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

      {/* VRAM Usage Bar */}
      <div className="rounded-xl bg-surface border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text">{t.moe.vizVramUsage}</span>
          <span className="text-sm text-muted">
            {totalVRAM}B {t.moe.vizLoaded} / {activeVRAM}B {t.moe.vizActive}
          </span>
        </div>
        <div className="h-8 rounded-lg bg-background overflow-hidden relative">
          {/* All experts always in VRAM */}
          <div className="absolute inset-0 flex">
            {experts.map((expert, i) => (
              <motion.div
                key={expert.id}
                className={`h-full flex-1 ${colorClasses[expert.color].bg} border-r border-background/50 last:border-r-0`}
                animate={{
                  opacity: activeExperts.includes(i) ? 1 : 0.4,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          {/* Active indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono text-text/80 bg-background/60 px-2 py-0.5 rounded">
              {t.moe.vizAllExperts}
            </span>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted">
          <span>{t.moe.vizMemoryFootprint}</span>
          <span className="text-orange-400">{t.moe.vizCannotOffload}</span>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="rounded-xl bg-surface border border-border p-6">
        {/* Token Input */}
        <div className="mb-6">
          <div className="text-xs text-muted mb-2 uppercase tracking-wider">{t.moe.vizInputTokens}</div>
          <div className="flex gap-2 flex-wrap">
            {tokens.map((token, i) => (
              <motion.div
                key={token.id}
                className={`px-3 py-1.5 rounded-lg border text-sm font-mono ${
                  currentTokenIndex === i
                    ? 'bg-primary/20 border-primary/50 text-primary-light'
                    : currentTokenIndex > i
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-surface-elevated border-border text-muted'
                }`}
                animate={{
                  scale: currentTokenIndex === i ? 1.05 : 1,
                }}
              >
                {token.text}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Router */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30"
            animate={{
              boxShadow: phase === 'routing' ? '0 0 20px rgba(168, 85, 247, 0.4)' : '0 0 0px transparent',
            }}
          >
            <div className="text-center">
              <div className="text-sm font-semibold text-text">{t.moe.vizRouter}</div>
              <div className="text-xs text-muted">{t.moe.vizSelectsTop2}</div>
            </div>
          </motion.div>
        </div>

        {/* Routing Lines (animated) */}
        <AnimatePresence>
          {phase === 'processing' && currentToken && (
            <div className="flex justify-center mb-4">
              <div className="flex gap-8">
                {currentToken.selectedExperts.map((expertId, i) => (
                  <motion.div
                    key={expertId}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-xs ${colorClasses[experts[expertId].color].text}`}
                  >
                    ↓ {(currentToken.weights[i] * 100).toFixed(0)}%
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Experts Grid */}
        <div className="grid grid-cols-4 gap-3">
          {experts.map((expert, i) => {
            const isActive = activeExperts.includes(i)
            const colors = colorClasses[expert.color]
            const weight = currentToken?.selectedExperts.includes(i)
              ? currentToken.weights[currentToken.selectedExperts.indexOf(i)]
              : 0

            return (
              <motion.div
                key={expert.id}
                className={`p-3 rounded-xl border ${colors.border} ${colors.bg} relative overflow-hidden`}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  boxShadow: isActive ? `0 0 20px var(--tw-shadow-color)` : 'none',
                }}
                style={{
                  '--tw-shadow-color': isActive ? colors.glow.replace('shadow-', '').replace('/30', '') : 'transparent',
                } as React.CSSProperties}
              >
                {/* Always in VRAM indicator */}
                <div className="absolute top-1 right-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
                    }`}
                    title={isActive ? t.moe.vizActiveNow : t.moe.vizLoadedIdle}
                  />
                </div>

                <div className={`text-xs font-bold ${colors.text} mb-1`}>
                  {expert.name}
                </div>
                <div className="text-[10px] text-muted truncate">{expert.specialization}</div>

                {/* Activity indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${weight * 100}%` }}
                      exit={{ width: 0 }}
                      className={`absolute bottom-0 left-0 h-1 ${colors.bg.replace('/20', '/60')}`}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Status */}
        <div className="mt-6 text-center">
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-muted"
              >
                {t.moe.vizClickRun}
              </motion.p>
            )}
            {phase === 'routing' && currentToken && (
              <motion.p
                key="routing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-purple-400"
              >
                {t.moe.vizRouting} &quot;{currentToken.text}&quot;...
              </motion.p>
            )}
            {phase === 'processing' && currentToken && (
              <motion.p
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-emerald-400"
              >
                {t.moe.vizProcessing} {currentToken.selectedExperts.map(i => experts[i].name).join(' + ')}
              </motion.p>
            )}
            {phase === 'done' && (
              <motion.p
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-cyan-400"
              >
                {t.moe.vizComplete}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Key Insight */}
      <div className="rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-4">
        <div className="flex items-start gap-3">
          <HardDrive size={18} className="text-orange-400 shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p className="font-semibold text-orange-400 mb-1">{t.moe.vizKeyInsight}</p>
            <p>{t.moe.vizKeyInsightDesc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
