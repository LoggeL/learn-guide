'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Zap, Clock, Target } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface Token {
  id: number
  text: string
  status: 'pending' | 'drafting' | 'verifying' | 'accepted' | 'rejected' | 'corrected'
}

interface SimulationState {
  phase: 'idle' | 'drafting' | 'verifying' | 'complete'
  draftTokens: Token[]
  finalTokens: Token[]
  currentDraftIndex: number
  currentVerifyIndex: number
  standardPasses: number
  speculativePasses: number
  acceptedCount: number
  rejectedCount: number
}

// Simulated tokens with predetermined acceptance (for demo purposes)
const DEMO_SEQUENCE = [
  { text: 'jumps', accept: true },
  { text: 'over', accept: true },
  { text: 'the', accept: true },
  { text: 'lazy', accept: false, correction: 'sleeping' },
  { text: 'dog', accept: true },
  { text: '.', accept: true },
]

const DRAFT_TOKENS_PER_BATCH = 4

export function SpeculativeDecodingVisualizer() {
  const { t } = useTranslation()
  const [isRunning, setIsRunning] = useState(false)
  const [acceptanceRate, setAcceptanceRate] = useState(75)
  const [draftSpeed, setDraftSpeed] = useState(5) // tokens per second (draft model)

  const [state, setState] = useState<SimulationState>({
    phase: 'idle',
    draftTokens: [],
    finalTokens: [],
    currentDraftIndex: 0,
    currentVerifyIndex: 0,
    standardPasses: 0,
    speculativePasses: 0,
    acceptedCount: 0,
    rejectedCount: 0,
  })

  const reset = useCallback(() => {
    setIsRunning(false)
    setState({
      phase: 'idle',
      draftTokens: [],
      finalTokens: [],
      currentDraftIndex: 0,
      currentVerifyIndex: 0,
      standardPasses: 0,
      speculativePasses: 0,
      acceptedCount: 0,
      rejectedCount: 0,
    })
  }, [])

  // Simulation logic
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setState(prev => {
        // Phase 1: Drafting
        if (prev.phase === 'idle' || prev.phase === 'drafting') {
          if (prev.draftTokens.length < DRAFT_TOKENS_PER_BATCH && prev.currentDraftIndex < DEMO_SEQUENCE.length) {
            const nextToken = DEMO_SEQUENCE[prev.currentDraftIndex]
            return {
              ...prev,
              phase: 'drafting',
              draftTokens: [
                ...prev.draftTokens,
                { id: prev.currentDraftIndex, text: nextToken.text, status: 'drafting' }
              ],
              currentDraftIndex: prev.currentDraftIndex + 1,
            }
          } else if (prev.draftTokens.length > 0) {
            // Start verification
            return {
              ...prev,
              phase: 'verifying',
              draftTokens: prev.draftTokens.map(t => ({ ...t, status: 'verifying' as const })),
              speculativePasses: prev.speculativePasses + 1,
            }
          }
        }

        // Phase 2: Verification (happens in one pass)
        if (prev.phase === 'verifying') {
          const newFinalTokens: Token[] = [...prev.finalTokens]
          let accepted = 0
          let rejected = 0
          let foundRejection = false

          for (const token of prev.draftTokens) {
            if (foundRejection) break

            const originalData = DEMO_SEQUENCE[token.id]
            // Use acceptance rate to determine if token is accepted (with some randomness based on slider)
            const shouldAccept = originalData.accept && Math.random() * 100 < acceptanceRate

            if (shouldAccept) {
              newFinalTokens.push({ ...token, status: 'accepted' })
              accepted++
            } else {
              // Rejection - add correction
              const correction = originalData.correction || token.text
              newFinalTokens.push({
                id: token.id,
                text: correction,
                status: 'corrected'
              })
              rejected++
              foundRejection = true
            }
          }

          // Check if we're done
          const lastToken = newFinalTokens[newFinalTokens.length - 1]
          const isComplete = lastToken && (lastToken.id >= DEMO_SEQUENCE.length - 1 || newFinalTokens.length >= DEMO_SEQUENCE.length)

          return {
            ...prev,
            phase: isComplete ? 'complete' : 'idle',
            draftTokens: [],
            finalTokens: newFinalTokens,
            currentDraftIndex: foundRejection ? (lastToken?.id ?? 0) + 1 : prev.currentDraftIndex,
            standardPasses: prev.standardPasses + accepted + (rejected > 0 ? 1 : 0),
            acceptedCount: prev.acceptedCount + accepted,
            rejectedCount: prev.rejectedCount + rejected,
          }
        }

        if (prev.phase === 'complete') {
          setIsRunning(false)
        }

        return prev
      })
    }, 1000 / draftSpeed)

    return () => clearInterval(interval)
  }, [isRunning, acceptanceRate, draftSpeed])

  const speedup = state.standardPasses > 0
    ? (state.standardPasses / Math.max(state.speculativePasses, 1)).toFixed(2)
    : '0.00'

  const actualAcceptanceRate = state.acceptedCount + state.rejectedCount > 0
    ? Math.round((state.acceptedCount / (state.acceptedCount + state.rejectedCount)) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <Zap size={18} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.speculativeDecoding.vizTitle}</h3>
            <p className="text-xs text-muted">{t.speculativeDecoding.vizSubtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={state.phase === 'complete'}
            className="px-4 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? t.speculativeDecoding.vizPause : t.speculativeDecoding.vizStart}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-elevated border border-border transition-colors flex items-center gap-2"
          >
            <RotateCcw size={16} />
            {t.speculativeDecoding.vizReset}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border">
          <label className="text-sm text-muted mb-2 block">{t.speculativeDecoding.vizAcceptanceRate}: {acceptanceRate}%</label>
          <input
            type="range"
            min={25}
            max={95}
            value={acceptanceRate}
            onChange={(e) => setAcceptanceRate(Number(e.target.value))}
            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>{t.speculativeDecoding.vizLowMatch}</span>
            <span>{t.speculativeDecoding.vizHighMatch}</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border">
          <label className="text-sm text-muted mb-2 block">{t.speculativeDecoding.vizDraftSpeed}: {draftSpeed}x</label>
          <input
            type="range"
            min={2}
            max={10}
            value={draftSpeed}
            onChange={(e) => setDraftSpeed(Number(e.target.value))}
            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>{t.speculativeDecoding.vizSlower}</span>
            <span>{t.speculativeDecoding.vizFaster}</span>
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="p-6 rounded-xl bg-surface border border-border">
        {/* Prompt */}
        <div className="mb-6">
          <div className="text-xs text-muted mb-2">{t.speculativeDecoding.vizPrompt}</div>
          <div className="font-mono text-text bg-background px-4 py-2 rounded-lg inline-block">
            "The quick brown fox"
          </div>
        </div>

        {/* Draft Model Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-muted">{t.speculativeDecoding.vizDraftModel}</span>
            {state.phase === 'drafting' && (
              <motion.span
                className="text-xs text-purple-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                {t.speculativeDecoding.vizGenerating}
              </motion.span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-background/50 rounded-lg border border-purple-500/20">
            <AnimatePresence mode="popLayout">
              {state.draftTokens.map((token) => (
                <motion.span
                  key={`draft-${token.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`px-3 py-1 rounded-lg font-mono text-sm ${
                    token.status === 'verifying'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  }`}
                >
                  {token.text}
                </motion.span>
              ))}
            </AnimatePresence>
            {state.draftTokens.length === 0 && state.phase !== 'complete' && (
              <span className="text-muted text-sm">{t.speculativeDecoding.vizWaiting}</span>
            )}
          </div>
        </div>

        {/* Target Model Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-sm text-muted">{t.speculativeDecoding.vizTargetModel}</span>
            {state.phase === 'verifying' && (
              <motion.span
                className="text-xs text-cyan-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.3 }}
              >
                {t.speculativeDecoding.vizVerifying}
              </motion.span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-background/50 rounded-lg border border-cyan-500/20">
            <AnimatePresence mode="popLayout">
              {state.finalTokens.map((token, i) => (
                <motion.span
                  key={`final-${i}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`px-3 py-1 rounded-lg font-mono text-sm ${
                    token.status === 'accepted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  }`}
                >
                  {token.status === 'corrected' && <span className="text-orange-400 mr-1">→</span>}
                  {token.text}
                </motion.span>
              ))}
            </AnimatePresence>
            {state.finalTokens.length === 0 && (
              <span className="text-muted text-sm">{t.speculativeDecoding.vizNoTokens}</span>
            )}
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="flex items-center gap-4 text-sm">
          <span className={`px-3 py-1 rounded-full ${state.phase === 'idle' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/10 text-gray-600'}`}>
            {t.speculativeDecoding.vizIdle}
          </span>
          <span className="text-muted">→</span>
          <span className={`px-3 py-1 rounded-full ${state.phase === 'drafting' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/10 text-gray-600'}`}>
            {t.speculativeDecoding.vizDrafting}
          </span>
          <span className="text-muted">→</span>
          <span className={`px-3 py-1 rounded-full ${state.phase === 'verifying' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/10 text-gray-600'}`}>
            {t.speculativeDecoding.vizVerifyPhase}
          </span>
          <span className="text-muted">→</span>
          <span className={`px-3 py-1 rounded-full ${state.phase === 'complete' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/10 text-gray-600'}`}>
            {t.speculativeDecoding.vizComplete}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted mb-1">
            <Target size={14} />
            {t.speculativeDecoding.vizAccepted}
          </div>
          <div className="text-2xl font-bold text-emerald-400">{state.acceptedCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted mb-1">
            <Target size={14} />
            {t.speculativeDecoding.vizRejected}
          </div>
          <div className="text-2xl font-bold text-orange-400">{state.rejectedCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted mb-1">
            <Clock size={14} />
            {t.speculativeDecoding.vizPasses}
          </div>
          <div className="text-2xl font-bold text-cyan-400">{state.speculativePasses}</div>
          <div className="text-xs text-muted">{t.speculativeDecoding.vizVsStandard} {state.standardPasses}</div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted mb-1">
            <Zap size={14} />
            {t.speculativeDecoding.vizSpeedup}
          </div>
          <div className="text-2xl font-bold text-purple-400">{speedup}x</div>
          <div className="text-xs text-muted">{t.speculativeDecoding.vizActualRate}: {actualAcceptanceRate}%</div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/20">
        <p className="text-sm text-muted">
          {t.speculativeDecoding.vizExplanation}
        </p>
      </div>
    </div>
  )
}
