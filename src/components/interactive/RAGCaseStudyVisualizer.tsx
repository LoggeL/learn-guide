'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileSearch,
  Brain,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Database,
  Sparkles,
  Play,
  ChevronDown,
  Zap
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type CaseId = 'traditional-wins' | 'agentic-wins' | 'both-fail'
type Outcome = 'success' | 'partial' | 'failure'

interface CaseStep {
  id: string
  icon: typeof FileSearch
  color: string
  delay: number
}

interface Case {
  id: CaseId
  traditionalSteps: CaseStep[]
  agenticSteps: CaseStep[]
  traditionalOutcome: Outcome
  agenticOutcome: Outcome
}

const cases: Case[] = [
  {
    id: 'traditional-wins',
    traditionalSteps: [
      { id: 'query', icon: FileSearch, color: 'blue', delay: 0 },
      { id: 'retrieve', icon: Database, color: 'emerald', delay: 400 },
      { id: 'generate', icon: Sparkles, color: 'purple', delay: 800 },
    ],
    agenticSteps: [
      { id: 'query', icon: FileSearch, color: 'blue', delay: 0 },
      { id: 'think1', icon: Brain, color: 'purple', delay: 400 },
      { id: 'retrieve1', icon: Database, color: 'emerald', delay: 800 },
      { id: 'think2', icon: Brain, color: 'purple', delay: 1200 },
      { id: 'generate', icon: Sparkles, color: 'orange', delay: 1600 },
    ],
    traditionalOutcome: 'success',
    agenticOutcome: 'success',
  },
  {
    id: 'agentic-wins',
    traditionalSteps: [
      { id: 'query', icon: FileSearch, color: 'blue', delay: 0 },
      { id: 'retrieve', icon: Database, color: 'amber', delay: 400 },
      { id: 'generate', icon: Sparkles, color: 'red', delay: 800 },
    ],
    agenticSteps: [
      { id: 'query', icon: FileSearch, color: 'blue', delay: 0 },
      { id: 'think1', icon: Brain, color: 'purple', delay: 300 },
      { id: 'decompose', icon: Zap, color: 'cyan', delay: 600 },
      { id: 'retrieve1', icon: Database, color: 'emerald', delay: 900 },
      { id: 'think2', icon: Brain, color: 'purple', delay: 1200 },
      { id: 'retrieve2', icon: Database, color: 'emerald', delay: 1500 },
      { id: 'synthesize', icon: Brain, color: 'purple', delay: 1800 },
      { id: 'generate', icon: Sparkles, color: 'emerald', delay: 2100 },
    ],
    traditionalOutcome: 'partial',
    agenticOutcome: 'success',
  },
  {
    id: 'both-fail',
    traditionalSteps: [
      { id: 'query', icon: FileSearch, color: 'blue', delay: 0 },
      { id: 'retrieve', icon: Database, color: 'red', delay: 400 },
      { id: 'generate', icon: Sparkles, color: 'red', delay: 800 },
    ],
    agenticSteps: [
      { id: 'query', icon: FileSearch, color: 'blue', delay: 0 },
      { id: 'think1', icon: Brain, color: 'purple', delay: 300 },
      { id: 'retrieve1', icon: Database, color: 'amber', delay: 600 },
      { id: 'think2', icon: Brain, color: 'purple', delay: 900 },
      { id: 'retrieve2', icon: Database, color: 'red', delay: 1200 },
      { id: 'think3', icon: Brain, color: 'amber', delay: 1500 },
      { id: 'generate', icon: Sparkles, color: 'red', delay: 1800 },
    ],
    traditionalOutcome: 'failure',
    agenticOutcome: 'failure',
  },
]

export function RAGCaseStudyVisualizer() {
  const { t } = useTranslation()
  const [selectedCase, setSelectedCase] = useState<CaseId>('traditional-wins')
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'traditional' | 'agentic' | 'complete'>('idle')
  const [traditionalProgress, setTraditionalProgress] = useState(-1)
  const [agenticProgress, setAgenticProgress] = useState(-1)
  const [showDropdown, setShowDropdown] = useState(false)

  const currentCase = cases.find(c => c.id === selectedCase)!

  const getCaseLabel = (id: CaseId) => {
    const labels: Record<CaseId, string> = {
      'traditional-wins': t.rag.caseTraditionalWins,
      'agentic-wins': t.rag.caseAgenticWins,
      'both-fail': t.rag.caseBothFail,
    }
    return labels[id]
  }

  const getCaseQuery = (id: CaseId) => {
    const queries: Record<CaseId, string> = {
      'traditional-wins': t.rag.caseQuery1,
      'agentic-wins': t.rag.caseQuery2,
      'both-fail': t.rag.caseQuery3,
    }
    return queries[id]
  }

  const getCaseExplanation = (id: CaseId) => {
    const explanations: Record<CaseId, string> = {
      'traditional-wins': t.rag.caseExplanation1,
      'agentic-wins': t.rag.caseExplanation2,
      'both-fail': t.rag.caseExplanation3,
    }
    return explanations[id]
  }

  const getTraditionalResult = (id: CaseId) => {
    const results: Record<CaseId, string> = {
      'traditional-wins': t.rag.caseResult1Traditional,
      'agentic-wins': t.rag.caseResult2Traditional,
      'both-fail': t.rag.caseResult3Traditional,
    }
    return results[id]
  }

  const getAgenticResult = (id: CaseId) => {
    const results: Record<CaseId, string> = {
      'traditional-wins': t.rag.caseResult1Agentic,
      'agentic-wins': t.rag.caseResult2Agentic,
      'both-fail': t.rag.caseResult3Agentic,
    }
    return results[id]
  }

  const getOutcomeStyles = (outcome: Outcome) => {
    switch (outcome) {
      case 'success':
        return {
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/50',
          text: 'text-emerald-400',
          icon: CheckCircle2,
          label: t.rag.outcomeSuccess
        }
      case 'partial':
        return {
          bg: 'bg-amber-500/20',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
          icon: AlertCircle,
          label: t.rag.outcomePartial
        }
      case 'failure':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500/50',
          text: 'text-red-400',
          icon: XCircle,
          label: t.rag.outcomeFailure
        }
    }
  }

  const runAnimation = async () => {
    setIsAnimating(true)
    setAnimationPhase('traditional')
    setTraditionalProgress(-1)
    setAgenticProgress(-1)

    // Run traditional animation
    for (let i = 0; i < currentCase.traditionalSteps.length; i++) {
      setTraditionalProgress(i)
      await new Promise(r => setTimeout(r, 500))
    }

    await new Promise(r => setTimeout(r, 400))
    setAnimationPhase('agentic')

    // Run agentic animation
    for (let i = 0; i < currentCase.agenticSteps.length; i++) {
      setAgenticProgress(i)
      await new Promise(r => setTimeout(r, 400))
    }

    await new Promise(r => setTimeout(r, 300))
    setAnimationPhase('complete')
    setIsAnimating(false)
  }

  const reset = () => {
    setAnimationPhase('idle')
    setTraditionalProgress(-1)
    setAgenticProgress(-1)
    setIsAnimating(false)
  }

  const getStepColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      purple: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
      emerald: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
      orange: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
      amber: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
      red: 'bg-red-500/20 border-red-500/50 text-red-400',
      cyan: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Case Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-3 bg-surface border border-border rounded-xl hover:border-primary/50 transition-colors"
          >
            <span className="text-text font-medium">{getCaseLabel(selectedCase)}</span>
            <ChevronDown size={18} className={`text-muted transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-border rounded-xl overflow-hidden z-10 shadow-lg"
              >
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCase(c.id); setShowDropdown(false); reset(); }}
                    className={`w-full px-4 py-3 text-left hover:bg-surface transition-colors ${
                      selectedCase === c.id ? 'bg-primary/10 text-primary-light' : 'text-text'
                    }`}
                  >
                    {getCaseLabel(c.id)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          <button
            onClick={runAnimation}
            disabled={isAnimating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Play size={16} />
            {t.rag.caseRun}
          </button>
          <button
            onClick={reset}
            disabled={animationPhase === 'idle'}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-muted hover:text-text transition-colors disabled:opacity-50"
          >
            <RotateCcw size={16} />
            {t.rag.caseReset}
          </button>
        </div>
      </div>

      {/* Query Display */}
      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
            <FileSearch size={16} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-blue-400 font-medium mb-1">{t.rag.caseUserQuery}</p>
            <p className="text-text font-medium">&quot;{getCaseQuery(selectedCase)}&quot;</p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Traditional RAG Column */}
        <div className={`rounded-xl border p-5 transition-all ${
          animationPhase === 'traditional'
            ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30'
            : 'bg-surface/50 border-border'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <ArrowRight size={16} className="text-blue-400" />
            </div>
            <h3 className="font-bold font-heading text-text">{t.rag.traditionalRag}</h3>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {currentCase.traditionalSteps.map((step, i) => {
              const Icon = step.icon
              const isActive = traditionalProgress === i
              const isDone = traditionalProgress > i

              return (
                <div key={`trad-${i}`} className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      opacity: traditionalProgress >= i || animationPhase === 'idle' ? 1 : 0.3
                    }}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                      isDone || isActive ? getStepColor(step.color) : 'bg-surface border-border text-muted'
                    }`}
                  >
                    <Icon size={18} />
                  </motion.div>
                  {i < currentCase.traditionalSteps.length - 1 && (
                    <ArrowRight size={14} className={isDone ? 'text-emerald-400' : 'text-border'} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {(animationPhase === 'complete' || animationPhase === 'agentic') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {(() => {
                  const outcome = getOutcomeStyles(currentCase.traditionalOutcome)
                  const OutcomeIcon = outcome.icon
                  return (
                    <>
                      <div className={`flex items-center gap-2 px-3 py-2 ${outcome.bg} ${outcome.border} border rounded-lg`}>
                        <OutcomeIcon size={16} className={outcome.text} />
                        <span className={`text-sm font-medium ${outcome.text}`}>{outcome.label}</span>
                      </div>
                      <p className="text-sm text-muted">{getTraditionalResult(selectedCase)}</p>
                    </>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Agentic RAG Column */}
        <div className={`rounded-xl border p-5 transition-all ${
          animationPhase === 'agentic'
            ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30'
            : 'bg-surface/50 border-border'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <RotateCcw size={16} className="text-purple-400" />
            </div>
            <h3 className="font-bold font-heading text-text">{t.rag.agenticRag}</h3>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            {currentCase.agenticSteps.map((step, i) => {
              const Icon = step.icon
              const isActive = agenticProgress === i
              const isDone = agenticProgress > i

              return (
                <div key={`agent-${i}`} className="flex items-center gap-1.5">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      opacity: agenticProgress >= i || animationPhase === 'idle' || animationPhase === 'traditional' ? 1 : 0.3
                    }}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                      isDone || isActive ? getStepColor(step.color) : 'bg-surface border-border text-muted'
                    }`}
                  >
                    <Icon size={14} />
                  </motion.div>
                  {i < currentCase.agenticSteps.length - 1 && (
                    <ArrowRight size={12} className={isDone ? 'text-emerald-400' : 'text-border'} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {animationPhase === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {(() => {
                  const outcome = getOutcomeStyles(currentCase.agenticOutcome)
                  const OutcomeIcon = outcome.icon
                  return (
                    <>
                      <div className={`flex items-center gap-2 px-3 py-2 ${outcome.bg} ${outcome.border} border rounded-lg`}>
                        <OutcomeIcon size={16} className={outcome.text} />
                        <span className={`text-sm font-medium ${outcome.text}`}>{outcome.label}</span>
                      </div>
                      <p className="text-sm text-muted">{getAgenticResult(selectedCase)}</p>
                    </>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Explanation */}
      <AnimatePresence mode="wait">
        {animationPhase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 bg-gradient-to-br from-slate-500/10 to-gray-500/10 border border-slate-500/20 rounded-xl"
          >
            <h4 className="font-bold font-heading text-text mb-2">{t.rag.caseWhy}</h4>
            <p className="text-sm text-muted leading-relaxed">{getCaseExplanation(selectedCase)}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
          <span>{t.rag.legendSuccess}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/50"></div>
          <span>{t.rag.legendPartial}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/50"></div>
          <span>{t.rag.legendFailure}</span>
        </div>
      </div>
    </div>
  )
}
