'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Eye } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export function AttentionVisualizer() {
  const { t } = useTranslation()
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null)
  const [sentenceIndex, setSentenceIndex] = useState(0)

  // Sentence definitions with hardcoded attention matrices
  // These represent realistic attention patterns from a transformer model
  const SENTENCES = useMemo(() => [
    {
      text: "The cat sat on the mat because it was warm.",
      focus: "pronoun 'it' → cat or mat?",
      words: ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'warm.'],
      // 10x10 attention matrix: rows = source (attending), cols = target (attended to)
      attention: [
        //      The   cat   sat   on    the   mat   bec   it    was   warm
        /*The*/   [0.35, 0.45, 0.08, 0.03, 0.02, 0.03, 0.01, 0.01, 0.01, 0.01],
        /*cat*/   [0.25, 0.40, 0.18, 0.05, 0.03, 0.04, 0.02, 0.01, 0.01, 0.01],
        /*sat*/   [0.08, 0.52, 0.22, 0.06, 0.03, 0.04, 0.02, 0.01, 0.01, 0.01],
        /*on*/    [0.04, 0.15, 0.35, 0.18, 0.08, 0.12, 0.03, 0.02, 0.02, 0.01],
        /*the*/   [0.03, 0.05, 0.08, 0.12, 0.28, 0.38, 0.02, 0.02, 0.01, 0.01],
        /*mat*/   [0.03, 0.08, 0.12, 0.18, 0.32, 0.22, 0.02, 0.01, 0.01, 0.01],
        /*bec*/   [0.02, 0.08, 0.15, 0.04, 0.03, 0.12, 0.25, 0.12, 0.10, 0.09],
        /*it*/    [0.03, 0.42, 0.06, 0.02, 0.03, 0.28, 0.04, 0.05, 0.04, 0.03], // "it" → cat (0.42) or mat (0.28)
        /*was*/   [0.02, 0.12, 0.08, 0.02, 0.02, 0.08, 0.06, 0.38, 0.18, 0.04],
        /*warm*/  [0.02, 0.15, 0.05, 0.02, 0.02, 0.22, 0.05, 0.18, 0.12, 0.17],
      ],
    },
    {
      text: "The robot picked up the ball and put it in the box.",
      focus: "tracking 'it' → ball",
      words: ['The', 'robot', 'picked', 'up', 'the', 'ball', 'and', 'put', 'it', 'in', 'the', 'box.'],
      // 12x12 attention matrix
      attention: [
        //       The   rob   pick  up    the   ball  and   put   it    in    the   box
        /*The*/   [0.32, 0.48, 0.06, 0.03, 0.02, 0.03, 0.01, 0.02, 0.01, 0.01, 0.00, 0.01],
        /*robot*/ [0.28, 0.38, 0.16, 0.05, 0.03, 0.04, 0.02, 0.02, 0.01, 0.00, 0.00, 0.01],
        /*picked*/[0.05, 0.48, 0.22, 0.12, 0.03, 0.05, 0.02, 0.01, 0.01, 0.00, 0.00, 0.01],
        /*up*/    [0.03, 0.18, 0.42, 0.18, 0.05, 0.08, 0.02, 0.02, 0.01, 0.00, 0.00, 0.01],
        /*the*/   [0.02, 0.04, 0.06, 0.05, 0.28, 0.45, 0.03, 0.03, 0.02, 0.01, 0.00, 0.01],
        /*ball*/  [0.02, 0.08, 0.15, 0.08, 0.35, 0.22, 0.04, 0.02, 0.02, 0.01, 0.00, 0.01],
        /*and*/   [0.02, 0.12, 0.18, 0.04, 0.04, 0.15, 0.18, 0.15, 0.04, 0.03, 0.02, 0.03],
        /*put*/   [0.02, 0.35, 0.22, 0.05, 0.03, 0.12, 0.06, 0.08, 0.03, 0.02, 0.01, 0.01],
        /*it*/    [0.01, 0.08, 0.06, 0.02, 0.04, 0.58, 0.03, 0.06, 0.05, 0.03, 0.02, 0.02], // "it" → ball (0.58)
        /*in*/    [0.01, 0.04, 0.05, 0.02, 0.02, 0.08, 0.03, 0.18, 0.12, 0.15, 0.12, 0.18],
        /*the*/   [0.01, 0.02, 0.03, 0.01, 0.02, 0.04, 0.02, 0.04, 0.05, 0.18, 0.25, 0.33],
        /*box*/   [0.01, 0.05, 0.08, 0.02, 0.02, 0.08, 0.02, 0.12, 0.08, 0.22, 0.15, 0.15],
      ],
    },
    {
      text: "She gave him the book because he needed it.",
      focus: "multiple references",
      words: ['She', 'gave', 'him', 'the', 'book', 'because', 'he', 'needed', 'it.'],
      // 9x9 attention matrix
      attention: [
        //       She   gave  him   the   book  bec   he    need  it
        /*She*/   [0.45, 0.28, 0.12, 0.04, 0.05, 0.02, 0.02, 0.01, 0.01],
        /*gave*/  [0.42, 0.25, 0.18, 0.04, 0.06, 0.02, 0.01, 0.01, 0.01],
        /*him*/   [0.18, 0.35, 0.28, 0.05, 0.08, 0.02, 0.02, 0.01, 0.01],
        /*the*/   [0.04, 0.08, 0.06, 0.32, 0.42, 0.03, 0.02, 0.02, 0.01],
        /*book*/  [0.05, 0.15, 0.12, 0.35, 0.25, 0.03, 0.02, 0.02, 0.01],
        /*bec*/   [0.08, 0.15, 0.08, 0.04, 0.12, 0.22, 0.12, 0.10, 0.09],
        /*he*/    [0.05, 0.08, 0.52, 0.03, 0.06, 0.06, 0.12, 0.05, 0.03], // "he" → him (0.52)
        /*needed*/[0.04, 0.12, 0.08, 0.03, 0.15, 0.05, 0.32, 0.15, 0.06],
        /*it*/    [0.03, 0.08, 0.05, 0.05, 0.55, 0.04, 0.06, 0.08, 0.06], // "it" → book (0.55)
      ],
    },
  ], [])

  const currentSentence = SENTENCES[sentenceIndex]
  const words = currentSentence.words
  const attentionMatrix = currentSentence.attention

  const getAttentionWeight = (sourceIdx: number, targetIdx: number): number => {
    if (sourceIdx === null || sourceIdx < 0 || sourceIdx >= words.length) return 0.05
    return attentionMatrix[sourceIdx][targetIdx]
  }

  const getWeightColor = (weight: number) => {
    if (weight >= 0.4) return 'from-purple-500 to-pink-500'
    if (weight >= 0.2) return 'from-cyan-500 to-blue-500'
    if (weight >= 0.1) return 'from-emerald-500/50 to-teal-500/50'
    return 'from-transparent to-transparent'
  }

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-surface-elevated border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Eye size={18} className="text-primary-light" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">Attention Map Simulator</h3>
            <p className="text-xs text-muted">{t.interactive.hoverToSee}</p>
          </div>
        </div>
      </div>

      {/* Sentence Tabs */}
      <div className="px-6 py-3 border-b border-border bg-background/50 flex gap-2 overflow-x-auto">
        {SENTENCES.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setSentenceIndex(i)
              setSelectedWordIndex(null)
            }}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              i === sentenceIndex
                ? "bg-primary/20 text-primary-light border border-primary/30"
                : "bg-surface text-muted border border-border hover:border-primary/30 hover:text-text"
            )}
          >
            Example {i + 1}
          </button>
        ))}
      </div>

      {/* Words Display */}
      <div className="p-8 md:p-12">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {words.map((word, i) => {
            const weight = selectedWordIndex !== null ? getAttentionWeight(selectedWordIndex, i) : 0.05
            const isSelected = selectedWordIndex === i
            const isHighAttention = weight > 0.3

            return (
              <motion.div
                key={i}
                className="relative"
                onMouseEnter={() => setSelectedWordIndex(i)}
                onMouseLeave={() => setSelectedWordIndex(null)}
              >
                <motion.span
                  className={clsx(
                    "relative block px-5 py-3 rounded-xl cursor-default transition-all duration-200",
                    "text-xl md:text-2xl font-medium",
                    isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-surface"
                  )}
                  animate={{
                    scale: isHighAttention ? 1.1 : 1,
                  }}
                >
                  {/* Attention glow background */}
                  <motion.div
                    className={clsx(
                      "absolute inset-0 rounded-xl bg-gradient-to-r",
                      getWeightColor(weight)
                    )}
                    animate={{ opacity: Math.min(weight * 2, 0.9) }}
                    transition={{ duration: 0.2 }}
                  />

                  <span className={clsx(
                    "relative z-10 transition-colors duration-200",
                    isHighAttention ? "text-white font-semibold" : "text-text"
                  )}>
                    {word}
                  </span>
                </motion.span>

                {/* Attention score badge */}
                {selectedWordIndex !== null && weight > 0.05 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={clsx(
                      "absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-mono whitespace-nowrap",
                      weight >= 0.4 ? "bg-purple-500/20 text-purple-300" :
                      weight >= 0.2 ? "bg-cyan-500/20 text-cyan-300" :
                      "bg-surface-elevated text-muted"
                    )}
                  >
                    {(weight * 100).toFixed(0)}%
                  </motion.span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Focus hint */}
        <div className="mt-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-border text-sm text-muted">
            <span className="text-primary">Focus:</span>
            {currentSentence.focus}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-border bg-background/50">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-xs text-muted">{t.interactive.strongConnection} (40%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-cyan-500 to-blue-500" />
            <span className="text-xs text-muted">Medium (20-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-emerald-500/50 to-teal-500/50" />
            <span className="text-xs text-muted">{t.interactive.weakConnection} (10-20%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
