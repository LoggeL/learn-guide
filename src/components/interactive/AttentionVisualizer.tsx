'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { Eye, Sparkles } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export function AttentionVisualizer() {
  const { t } = useTranslation()
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  
  const SENTENCES = [
    { 
      text: "The cat sat on the mat because it was warm.",
      focus: "pronoun 'it' → cat or mat?" 
    },
    { 
      text: "The robot picked up the ball and put it in the box.",
      focus: "tracking 'it' → ball" 
    },
    { 
      text: "She gave him the book because he needed it.",
      focus: "multiple references" 
    },
  ]
  
  const currentSentence = SENTENCES[sentenceIndex]
  const words = currentSentence.text.split(' ')

  const getAttentionWeight = (targetIdx: number, currentIdx: number) => {
    if (targetIdx === null) return 0.05
    
    const targetWord = words[targetIdx].toLowerCase().replace(/[.,]/g, '')
    const currentWord = words[currentIdx].toLowerCase().replace(/[.,]/g, '')

    if (targetIdx === currentIdx) return 1.0
    
    // "it" refers to preceding nouns
    if (targetWord === 'it') {
      if (sentenceIndex === 0 && (currentWord === 'cat' || currentWord === 'mat')) return 0.85
      if (sentenceIndex === 1 && (currentWord === 'ball' || currentWord === 'box')) return 0.85
      if (sentenceIndex === 2 && currentWord === 'book') return 0.85
    }

    // "he"/"him" relationships
    if ((targetWord === 'he' || targetWord === 'him') && currentWord === 'she') return 0.6
    if (targetWord === 'she' && (currentWord === 'he' || currentWord === 'him')) return 0.6

    // Verbs attend to subjects
    if (targetWord === 'sat' && currentWord === 'cat') return 0.75
    if (targetWord === 'picked' && currentWord === 'robot') return 0.75
    if (targetWord === 'gave' && currentWord === 'she') return 0.75

    // Slight attention to nearby words
    const distance = Math.abs(targetIdx - currentIdx)
    if (distance === 1) return 0.2
    if (distance === 2) return 0.1

    return 0.03 + Math.random() * 0.05
  }

  const getWeightColor = (weight: number) => {
    if (weight >= 0.8) return 'from-purple-500 to-pink-500'
    if (weight >= 0.5) return 'from-cyan-500 to-blue-500'
    if (weight >= 0.2) return 'from-emerald-500/50 to-teal-500/50'
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
      <div className="px-6 py-3 border-b border-border bg-background/50 flex gap-2">
        {SENTENCES.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setSentenceIndex(i)
              setSelectedWordIndex(null)
            }}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              i === sentenceIndex
                ? "bg-primary/20 text-primary-light border border-primary/30"
                : "bg-surface text-muted border border-border hover:border-primary/30 hover:text-text"
            )}
          >
            Example {i + 1}
          </button>
        ))}
      </div>

      {/* Words Display - Spread Out */}
      <div className="p-8 md:p-12">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {words.map((word, i) => {
            const weight = selectedWordIndex !== null ? getAttentionWeight(selectedWordIndex, i) : 0.05
            const isSelected = selectedWordIndex === i
            const isHighAttention = weight > 0.5
            
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
                    animate={{ opacity: weight * 0.7 }}
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
                <AnimatePresence>
                  {selectedWordIndex !== null && weight > 0.15 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 5 }}
                      className={clsx(
                        "absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-mono whitespace-nowrap",
                        weight >= 0.8 ? "bg-purple-500/20 text-purple-300" :
                        weight >= 0.5 ? "bg-cyan-500/20 text-cyan-300" :
                        "bg-surface-elevated text-muted"
                      )}
                    >
                      {(weight * 100).toFixed(0)}%
                    </motion.span>
                  )}
                </AnimatePresence>
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

      {/* Legend and Info */}
      <div className="px-6 py-4 border-t border-border bg-background/50">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-xs text-muted">{t.interactive.strongConnection} (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-cyan-500 to-blue-500" />
            <span className="text-xs text-muted">Medium (50%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-emerald-500/50 to-teal-500/50" />
            <span className="text-xs text-muted">{t.interactive.weakConnection} (20%+)</span>
          </div>
        </div>
        
        <motion.div 
          key={selectedWordIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border"
        >
          <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted">
            {selectedWordIndex === null 
              ? <>{t.interactive.hoverToSee}</>
              : <>{t.interactive.token} "<span className="text-primary-light font-medium">{words[selectedWordIndex]}</span>"</>
            }
          </p>
        </motion.div>
      </div>
    </div>
  )
}
