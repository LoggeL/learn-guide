'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface SequenceState {
  tokens: string[]
  phaseLabel: string
}

function normalizeTokens(value: string): string[] {
  return value
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean)
}

export function TextDiffusionDemo() {
  const { t } = useTranslation()
  const [isRunning, setIsRunning] = useState(false)
  const [step, setStep] = useState(0)

  const draftTokens = useMemo(() => normalizeTokens(t.interactive.textDiffusionDraft), [t])
  const targetTokens = useMemo(() => normalizeTokens(t.interactive.textDiffusionTarget), [t])
  const tokenCount = Math.max(draftTokens.length, targetTokens.length)

  const safeDraft = useMemo(() => {
    const arr = [...draftTokens]
    while (arr.length < tokenCount) arr.push('[MASK]')
    return arr
  }, [draftTokens, tokenCount])

  const safeTarget = useMemo(() => {
    const arr = [...targetTokens]
    while (arr.length < tokenCount) arr.push('[MASK]')
    return arr
  }, [targetTokens, tokenCount])

  const maxSteps = tokenCount * 2
  const fixedLength = Math.max(tokenCount + 2, 10)

  useEffect(() => {
    if (!isRunning) return

    const intervalId = window.setInterval(() => {
      setStep((current) => {
        if (current >= maxSteps) {
          setIsRunning(false)
          return maxSteps
        }
        return current + 1
      })
    }, 650)

    return () => window.clearInterval(intervalId)
  }, [isRunning, maxSteps])

  const sequenceState: SequenceState = useMemo(() => {
    if (step <= tokenCount) {
      const revealCount = step
      const revealed = safeDraft.map((token, index) => (index < revealCount ? token : '[MASK]'))
      return {
        tokens: revealed,
        phaseLabel: t.interactive.textDiffusionPhaseReveal,
      }
    }

    const refineCount = step - tokenCount
    const refined = safeDraft.map((token, index) => (index < refineCount ? safeTarget[index] : token))

    if (step < maxSteps) {
      return {
        tokens: refined,
        phaseLabel: t.interactive.textDiffusionPhaseRefine,
      }
    }

    return {
      tokens: safeTarget,
      phaseLabel: t.interactive.textDiffusionPhaseDone,
    }
  }, [step, tokenCount, safeDraft, safeTarget, maxSteps, t])

  const paddedSequence = useMemo(() => {
    const tokens = [...sequenceState.tokens]
    while (tokens.length < fixedLength) tokens.push('[PAD]')
    return tokens
  }, [sequenceState.tokens, fixedLength])

  const restart = () => {
    setStep(0)
    setIsRunning(true)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-semibold font-heading text-text">{t.interactive.textDiffusionDemoTitle}</h3>
            <p className="text-xs text-muted">{t.interactive.textDiffusionDemoDesc}</p>
          </div>

          <button
            onClick={restart}
            className="px-3 py-2 rounded-lg border border-border bg-surface-elevated text-text hover:border-violet-400/40 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            {step === 0 ? <Play size={14} /> : <RotateCcw size={14} />}
            {step === 0 ? t.interactive.textDiffusionStart : t.interactive.textDiffusionReplay}
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between text-xs text-muted">
          <span>{sequenceState.phaseLabel}</span>
          <span>
            {t.interactive.textDiffusionStepLabel} {Math.min(step, maxSteps)} / {maxSteps}
          </span>
        </div>

        <div className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4">
          <div className="flex flex-wrap gap-2">
            {paddedSequence.map((token, index) => {
              const isPad = token === '[PAD]'
              const isMask = token === '[MASK]'

              return (
                <motion.span
                  key={`${index}-${token}-${step}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`px-2.5 py-1.5 rounded-lg border font-mono text-sm ${
                    isPad
                      ? 'bg-surface border-border text-subtle'
                      : isMask
                        ? 'bg-fuchsia-500/15 border-fuchsia-500/35 text-fuchsia-200'
                        : 'bg-violet-500/20 border-violet-400/45 text-violet-100'
                  }`}
                >
                  {token}
                </motion.span>
              )
            })}
          </div>
        </div>

        <div className="mt-3 text-xs text-muted flex flex-wrap gap-4">
          <span>{t.interactive.textDiffusionLegendMask}</span>
          <span>{t.interactive.textDiffusionLegendPad}</span>
          <span>{t.interactive.textDiffusionLegendToken}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-border p-6">
        <h4 className="text-sm font-semibold text-text font-heading mb-2">{t.interactive.textDiffusionPaddingTitle}</h4>
        <p className="text-sm text-muted leading-relaxed mb-3">{t.interactive.textDiffusionPaddingDesc}</p>
        <ul className="space-y-2 text-sm text-muted">
          <li>{t.interactive.textDiffusionPaddingPoint1}</li>
          <li>{t.interactive.textDiffusionPaddingPoint2}</li>
          <li>{t.interactive.textDiffusionPaddingPoint3}</li>
        </ul>
      </div>
    </div>
  )
}
