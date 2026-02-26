'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Shuffle, Eye } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface TokenState {
  text: string
  confidence: number
  revealed: boolean
  revealOrder: number
  justRevealed: boolean
  justRemasked: boolean
}

interface DiffusionStep {
  tokens: TokenState[]
  label: string
  stepNum: number
}

// Sentences for demo — each shows non-sequential token reveal
const SENTENCES = [
  ['The', 'cat', 'sat', 'on', 'the', 'warm', 'windowsill', 'quietly'],
  ['A', 'bright', 'star', 'shines', 'in', 'the', 'dark', 'sky'],
  ['She', 'wrote', 'a', 'beautiful', 'poem', 'about', 'the', 'ocean'],
]

// Pre-compute a shuffled reveal order that is clearly NON-sequential
// This is the key teaching point: diffusion reveals tokens in parallel/random order
function computeRevealOrder(length: number, seed: number): number[] {
  const indices = Array.from({ length }, (_, i) => i)
  // Fisher-Yates shuffle with seed
  let s = seed
  for (let i = indices.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = ((s >>> 16) % (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

// Simulate confidence scores that increase over steps
function getConfidence(step: number, totalSteps: number, revealStep: number): number {
  if (step < revealStep) return 0
  // Confidence grows from ~0.3 to ~1.0 after reveal
  const progress = (step - revealStep) / Math.max(1, totalSteps - revealStep)
  return Math.min(0.99, 0.25 + progress * 0.74)
}

// Intermediate wrong guesses for re-masking demo
const WRONG_GUESSES: Record<string, string> = {
  'beautiful': 'long',
  'quietly': 'slowly',
  'bright': 'small',
  'shines': 'hangs',
  'windowsill': 'rooftop',
  'ocean': 'forest',
  'dark': 'clear',
  'warm': 'cold',
}

export function TextDiffusionDemo() {
  const { t } = useTranslation()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [sentenceIdx, setSentenceIdx] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  const sentence = SENTENCES[sentenceIdx]
  const totalSteps = 8 // Total denoising steps
  const revealOrder = useMemo(() => computeRevealOrder(sentence.length, sentenceIdx * 7 + 13), [sentence.length, sentenceIdx])

  // Map from step number → which token indices get revealed at that step
  // Some tokens get revealed, then re-masked (low confidence), then re-revealed
  const stepPlan = useMemo(() => {
    const plan: { reveals: number[], remasks: number[] }[] = []
    const tokensPerStep = Math.ceil(sentence.length / (totalSteps - 2)) // Leave room for re-mask steps

    for (let s = 0; s < totalSteps; s++) {
      plan.push({ reveals: [], remasks: [] })
    }

    // Assign reveals across steps (non-sequential order)
    revealOrder.forEach((tokenIdx, i) => {
      const stepForReveal = Math.min(Math.floor(i / tokensPerStep) + 1, totalSteps - 2)
      plan[stepForReveal].reveals.push(tokenIdx)
    })

    // Add re-masking: tokens with wrong guesses get re-masked at step after reveal, then corrected
    revealOrder.forEach((tokenIdx) => {
      const word = sentence[tokenIdx]
      if (WRONG_GUESSES[word]) {
        // Find which step this was revealed at
        const revealStep = plan.findIndex(p => p.reveals.includes(tokenIdx))
        if (revealStep >= 0 && revealStep + 1 < totalSteps - 1) {
          plan[revealStep + 1].remasks.push(tokenIdx)
          // Re-reveal it two steps later (or at final step)
          const reRevealStep = Math.min(revealStep + 2, totalSteps - 1)
          if (!plan[reRevealStep].reveals.includes(tokenIdx)) {
            plan[reRevealStep].reveals.push(tokenIdx)
          }
        }
      }
    })

    return plan
  }, [sentence, revealOrder, totalSteps])

  // Compute token states for current step
  const tokens: TokenState[] = useMemo(() => {
    const states: TokenState[] = sentence.map((text, i) => ({
      text,
      confidence: 0,
      revealed: false,
      revealOrder: revealOrder.indexOf(i),
      justRevealed: false,
      justRemasked: false,
    }))

    // Track which tokens are currently revealed
    const isRevealed = new Set<number>()
    const wasRemasked = new Set<number>()

    for (let s = 0; s <= currentStep; s++) {
      const step = stepPlan[s]
      if (!step) continue

      // Re-mask tokens
      for (const idx of step.remasks) {
        isRevealed.delete(idx)
        if (s === currentStep) wasRemasked.add(idx)
      }

      // Reveal tokens
      for (const idx of step.reveals) {
        isRevealed.add(idx)
      }
    }

    for (let i = 0; i < states.length; i++) {
      states[i].revealed = isRevealed.has(i)
      states[i].justRemasked = wasRemasked.has(i)

      if (isRevealed.has(i)) {
        // Check if this was JUST revealed this step
        const justNow = stepPlan[currentStep]?.reveals.includes(i) ?? false
        states[i].justRevealed = justNow

        // Show wrong guess if it was revealed but will be re-masked later
        const willBeRemasked = stepPlan.slice(currentStep + 1).some(s => s.remasks.includes(i))
        const wasAlreadyRemasked = stepPlan.slice(0, currentStep + 1).some(s => s.remasks.includes(i))

        if (willBeRemasked && !wasAlreadyRemasked && WRONG_GUESSES[sentence[i]]) {
          states[i].text = WRONG_GUESSES[sentence[i]]
          states[i].confidence = 0.3 + Math.random() * 0.2
        } else {
          states[i].text = sentence[i]
          // Confidence increases the longer it's been revealed
          const firstRevealStep = stepPlan.findIndex(s => s.reveals.includes(i))
          states[i].confidence = getConfidence(currentStep, totalSteps, firstRevealStep)
        }
      } else {
        states[i].confidence = 0
      }
    }

    return states
  }, [sentence, currentStep, revealOrder, stepPlan, totalSteps])

  // Count revealed vs masked
  const revealedCount = tokens.filter(t => t.revealed).length
  const maskedCount = tokens.length - revealedCount

  // Autoplay
  useEffect(() => {
    if (!isRunning) return
    const intervalId = window.setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps) {
          setIsRunning(false)
          return totalSteps
        }
        return prev + 1
      })
    }, 900)
    return () => window.clearInterval(intervalId)
  }, [isRunning, totalSteps])

  const restart = useCallback(() => {
    setCurrentStep(0)
    setIsRunning(true)
  }, [])

  const nextSentence = useCallback(() => {
    setSentenceIdx((prev) => (prev + 1) % SENTENCES.length)
    setCurrentStep(0)
    setIsRunning(false)
  }, [])

  const getPhaseLabel = () => {
    if (currentStep === 0) return t.interactive.textDiffusionPhaseInit
    if (currentStep >= totalSteps) return t.interactive.textDiffusionPhaseDone
    if (stepPlan[currentStep]?.remasks.length > 0) return t.interactive.textDiffusionPhaseRemask
    return t.interactive.textDiffusionPhaseReveal
  }

  // Confidence color
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-emerald-400'
    if (conf >= 0.5) return 'text-amber-400'
    return 'text-red-400'
  }

  const getConfidenceBg = (conf: number) => {
    if (conf >= 0.8) return 'bg-emerald-500/15 border-emerald-500/35'
    if (conf >= 0.5) return 'bg-amber-500/15 border-amber-500/35'
    return 'bg-red-500/15 border-red-500/35'
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface border border-border p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 flex items-center justify-center">
              <Shuffle size={18} className="text-fuchsia-400" />
            </div>
            <div>
              <h3 className="font-semibold font-heading text-text">{t.interactive.textDiffusionDemoTitle}</h3>
              <p className="text-xs text-muted">{t.interactive.textDiffusionDemoDesc}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={restart}
              className="px-3 py-2 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-200 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
            >
              {currentStep === 0 ? <Play size={14} /> : <RotateCcw size={14} />}
              {currentStep === 0 ? t.interactive.textDiffusionStart : t.interactive.textDiffusionReplay}
            </button>
            <button
              onClick={nextSentence}
              className="px-3 py-2 rounded-lg border border-border bg-surface-elevated text-text hover:border-fuchsia-400/40 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <Shuffle size={14} />
              {t.interactive.textDiffusionNextSentence}
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="mb-4 flex items-center justify-between">
          <motion.span
            key={getPhaseLabel()}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-medium text-violet-300 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20"
          >
            {getPhaseLabel()}
          </motion.span>
          <span className="text-xs text-muted font-mono">
            {t.interactive.textDiffusionStepLabel} {Math.min(currentStep, totalSteps)} / {totalSteps}
          </span>
        </div>

        {/* Step progress bar */}
        <div className="mb-5 flex gap-1">
          {Array.from({ length: totalSteps + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => { setIsRunning(false); setCurrentStep(i) }}
              className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                i <= currentStep
                  ? i === currentStep ? 'bg-violet-400' : 'bg-violet-500/50'
                  : 'bg-white/5'
              }`}
            />
          ))}
        </div>

        {/* Token grid */}
        <div className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 p-5">
          {/* Reveal order indicator */}
          <div className="mb-3 text-[10px] text-muted uppercase tracking-wider font-medium">
            {t.interactive.textDiffusionRevealOrder}: {revealOrder.map((idx) => (
              <span key={idx} className={`inline-block mx-0.5 ${tokens[idx].revealed ? 'text-violet-400' : 'text-muted/50'}`}>
                {idx + 1}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <AnimatePresence mode="popLayout">
              {tokens.map((token, index) => (
                <motion.div
                  key={`${sentenceIdx}-${index}`}
                  layout
                  className="relative"
                >
                  {/* Token card */}
                  <motion.div
                    animate={{
                      scale: token.justRevealed ? [1, 1.08, 1] : token.justRemasked ? [1, 0.95, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`px-3 py-2 rounded-lg border font-mono text-sm min-w-[60px] text-center transition-all ${
                      !token.revealed
                        ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300/70'
                        : getConfidenceBg(token.confidence)
                    }`}
                  >
                    {/* Position indicator */}
                    <div className="text-[9px] text-muted/50 mb-1 font-sans">#{index + 1}</div>

                    {/* Token text or mask */}
                    <div className={`font-semibold ${!token.revealed ? 'text-fuchsia-400/60' : 'text-text'}`}>
                      {token.revealed ? token.text : '[MASK]'}
                    </div>

                    {/* Confidence bar */}
                    {token.revealed && (
                      <div className="mt-1.5">
                        <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${token.confidence * 100}%` }}
                            transition={{ duration: 0.4 }}
                            className={`h-full rounded-full ${
                              token.confidence >= 0.8 ? 'bg-emerald-400' :
                              token.confidence >= 0.5 ? 'bg-amber-400' : 'bg-red-400'
                            }`}
                          />
                        </div>
                        <div className={`text-[9px] mt-0.5 font-sans ${getConfidenceColor(token.confidence)}`}>
                          {(token.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="text-center p-2.5 rounded-lg bg-surface-elevated border border-border">
            <div className="text-lg font-bold text-fuchsia-400">{maskedCount}</div>
            <div className="text-[10px] text-muted">{t.interactive.textDiffusionMasked}</div>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-surface-elevated border border-border">
            <div className="text-lg font-bold text-violet-400">{revealedCount}</div>
            <div className="text-[10px] text-muted">{t.interactive.textDiffusionRevealed}</div>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-surface-elevated border border-border">
            <div className="text-lg font-bold text-emerald-400">
              {tokens.filter(t => t.revealed && t.confidence >= 0.8).length}
            </div>
            <div className="text-[10px] text-muted">{t.interactive.textDiffusionHighConf}</div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-fuchsia-500/20 border border-fuchsia-500/30 inline-block" />
            {t.interactive.textDiffusionLegendMask}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/15 border border-emerald-500/35 inline-block" />
            {t.interactive.textDiffusionLegendHigh}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/15 border border-amber-500/35 inline-block" />
            {t.interactive.textDiffusionLegendMedium}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/15 border border-red-500/35 inline-block" />
            {t.interactive.textDiffusionLegendLow}
          </span>
        </div>
      </div>

      {/* Key Insight */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-2 w-full text-left"
        >
          <Eye size={16} className="text-violet-400" />
          <h4 className="text-sm font-semibold text-text font-heading">{t.interactive.textDiffusionKeyInsight}</h4>
        </button>
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-muted leading-relaxed mt-3 mb-3">{t.interactive.textDiffusionInsightDesc}</p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">1.</span>
                  {t.interactive.textDiffusionInsightPoint1}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">2.</span>
                  {t.interactive.textDiffusionInsightPoint2}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">3.</span>
                  {t.interactive.textDiffusionInsightPoint3}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
