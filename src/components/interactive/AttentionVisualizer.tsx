'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Eye, Grid3X3, Type } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export function AttentionVisualizer() {
  const { t } = useTranslation()
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null)
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'matrix' | 'words'>('matrix')

  // Sentence definitions with hardcoded attention matrices
  // These represent realistic attention patterns from a transformer model
  const SENTENCES = useMemo(() => [
    {
      text: "The cat sat on the mat because it was warm.",
      focus: "pronoun 'it' → cat or mat?",
      words: ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'warm.'],
      // 10x10 attention matrix: rows = source (attending), cols = target (attended to)
      // Row i shows what token i attends to
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

  // Get heatmap color based on attention weight
  const getHeatmapColor = (weight: number) => {
    // Purple gradient: low = dark, high = bright purple/pink
    const intensity = Math.pow(weight, 0.7) // Gamma correction for better visibility
    if (intensity > 0.6) {
      return `rgba(168, 85, 247, ${0.4 + intensity * 0.6})` // purple-500
    } else if (intensity > 0.3) {
      return `rgba(59, 130, 246, ${0.3 + intensity * 0.5})` // blue-500
    } else if (intensity > 0.1) {
      return `rgba(34, 197, 94, ${0.2 + intensity * 0.4})` // green-500
    }
    return `rgba(100, 116, 139, ${0.05 + intensity * 0.2})` // slate-500
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
            <h3 className="font-semibold text-text font-heading">Attention Matrix</h3>
            <p className="text-xs text-muted">{viewMode === 'matrix' ? 'Full attention heatmap' : t.interactive.hoverToSee}</p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-background rounded-lg p-1">
          <button
            onClick={() => setViewMode('matrix')}
            className={clsx(
              "p-2 rounded-md transition-all",
              viewMode === 'matrix'
                ? "bg-primary/20 text-primary-light"
                : "text-muted hover:text-text"
            )}
            title="Matrix view"
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('words')}
            className={clsx(
              "p-2 rounded-md transition-all",
              viewMode === 'words'
                ? "bg-primary/20 text-primary-light"
                : "text-muted hover:text-text"
            )}
            title="Word view"
          >
            <Type size={16} />
          </button>
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
              setHoveredCell(null)
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

      {viewMode === 'matrix' ? (
        /* Matrix View */
        <div className="p-6 overflow-x-auto">
          {/* Matrix container */}
          <div className="inline-block min-w-full">
            {/* Column headers (target tokens) */}
            <div className="flex">
              <div className="w-20 shrink-0" /> {/* Empty corner */}
              {words.map((w, j) => (
                <div
                  key={j}
                  className={clsx(
                    "w-12 h-16 flex items-end justify-center pb-1 text-[10px] text-muted transition-colors",
                    hoveredCell?.col === j && "text-primary-light font-medium"
                  )}
                >
                  <span className="writing-mode-vertical transform -rotate-45 origin-bottom-left whitespace-nowrap">
                    {w.replace(/[.,]$/, '')}
                  </span>
                </div>
              ))}
            </div>

            {/* Matrix rows */}
            {attentionMatrix.map((row, i) => (
              <div key={i} className="flex items-center">
                {/* Row label (source token) */}
                <div
                  className={clsx(
                    "w-20 shrink-0 pr-2 text-right text-xs truncate transition-colors",
                    hoveredCell?.row === i ? "text-primary-light font-medium" : "text-muted"
                  )}
                  title={words[i]}
                >
                  {words[i].replace(/[.,]$/, '')}
                </div>

                {/* Attention cells */}
                {row.map((weight, j) => (
                  <motion.div
                    key={j}
                    className={clsx(
                      "w-12 h-10 border border-border/30 flex items-center justify-center cursor-default relative",
                      "transition-all duration-150",
                      (hoveredCell?.row === i || hoveredCell?.col === j) && "ring-1 ring-primary/30"
                    )}
                    style={{ backgroundColor: getHeatmapColor(weight) }}
                    onMouseEnter={() => setHoveredCell({ row: i, col: j })}
                    onMouseLeave={() => setHoveredCell(null)}
                    initial={false}
                    animate={{
                      scale: hoveredCell?.row === i && hoveredCell?.col === j ? 1.1 : 1,
                      zIndex: hoveredCell?.row === i && hoveredCell?.col === j ? 10 : 0,
                    }}
                  >
                    <span className={clsx(
                      "text-[10px] font-mono",
                      weight > 0.4 ? "text-white" : weight > 0.2 ? "text-white/80" : "text-muted"
                    )}>
                      {(weight * 100).toFixed(0)}
                    </span>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          {/* Axis labels */}
          <div className="mt-4 flex items-center justify-center gap-8 text-xs text-muted">
            <span>← Target tokens (columns) →</span>
          </div>
          <div className="mt-1 text-center text-xs text-muted">
            ↑ Source tokens (rows) ↓
          </div>

          {/* Hover info */}
          <div className="mt-6 p-4 rounded-xl bg-surface-elevated border border-border">
            {hoveredCell ? (
              <p className="text-sm text-center">
                <span className="text-primary-light font-medium">&quot;{words[hoveredCell.row]}&quot;</span>
                <span className="text-muted mx-2">→</span>
                <span className="text-primary-light font-medium">&quot;{words[hoveredCell.col]}&quot;</span>
                <span className="text-muted mx-2">=</span>
                <span className="font-mono text-cyan-400">{(attentionMatrix[hoveredCell.row][hoveredCell.col] * 100).toFixed(1)}%</span>
              </p>
            ) : (
              <p className="text-sm text-muted text-center">Hover over cells to see attention scores</p>
            )}
          </div>
        </div>
      ) : (
        /* Words View */
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
      )}

      {/* Legend */}
      <div className="px-6 py-4 border-t border-border bg-background/50">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(168, 85, 247, 0.9)' }} />
            <span className="text-xs text-muted">{t.interactive.strongConnection} (40%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.6)' }} />
            <span className="text-xs text-muted">Medium (20-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.4)' }} />
            <span className="text-xs text-muted">{t.interactive.weakConnection} (10-20%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(100, 116, 139, 0.2)' }} />
            <span className="text-xs text-muted">Minimal (&lt;10%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
