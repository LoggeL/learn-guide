'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { Eye, ChevronDown, Sparkles } from 'lucide-react'

interface WordWeight {
  word: string
  weight: number
}

const SENTENCES = [
  { text: "The cat sat on the mat because it was warm.", focus: "pronoun resolution" },
  { text: "The robot picked up the ball and put it in the box.", focus: "object tracking" },
  { text: "She gave him the book because he needed it for class.", focus: "multi-reference" },
]

export function AttentionVisualizer() {
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
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
            <p className="text-xs text-muted">Hover to see attention patterns</p>
          </div>
        </div>
        
        {/* Sentence Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border hover:border-primary/40 transition-colors"
          >
            <span className="text-sm text-text">Sentence {sentenceIndex + 1}</span>
            <ChevronDown size={14} className={clsx("text-muted transition-transform", isDropdownOpen && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-64 bg-surface-elevated border border-border rounded-xl shadow-xl overflow-hidden z-10"
              >
                {SENTENCES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSentenceIndex(i)
                      setSelectedWordIndex(null)
                      setIsDropdownOpen(false)
                    }}
                    className={clsx(
                      "w-full px-4 py-3 text-left hover:bg-surface transition-colors border-b border-border last:border-0",
                      i === sentenceIndex && "bg-primary/10"
                    )}
                  >
                    <span className={clsx("text-sm", i === sentenceIndex ? "text-primary-light" : "text-text")}>
                      Sentence {i + 1}
                    </span>
                    <span className="block text-xs text-subtle mt-0.5">{s.focus}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sentence Display */}
      <div className="p-8">
        <div className="flex flex-wrap gap-3 leading-loose justify-center">
          {words.map((word, i) => {
            const weight = selectedWordIndex !== null ? getAttentionWeight(selectedWordIndex, i) : 0.05
            const isSelected = selectedWordIndex === i
            const isHighAttention = weight > 0.5
            
            return (
              <motion.span
                key={i}
                onMouseEnter={() => setSelectedWordIndex(i)}
                onMouseLeave={() => setSelectedWordIndex(null)}
                className={clsx(
                  "relative px-3 py-2 rounded-xl cursor-default transition-all duration-200",
                  "text-lg font-medium",
                  isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-surface"
                )}
                animate={{
                  scale: isHighAttention ? 1.05 : 1,
                }}
              >
                {/* Attention glow background */}
                <motion.div 
                  className={clsx(
                    "absolute inset-0 rounded-xl bg-gradient-to-r opacity-0",
                    getWeightColor(weight)
                  )}
                  animate={{ opacity: weight * 0.6 }}
                  transition={{ duration: 0.2 }}
                />
                
                <span className={clsx(
                  "relative z-10 transition-colors duration-200",
                  isHighAttention ? "text-white" : "text-text"
                )}>
                  {word}
                </span>
                
                {/* Attention score badge */}
                <AnimatePresence>
                  {selectedWordIndex !== null && weight > 0.1 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 5 }}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-primary-light whitespace-nowrap"
                    >
                      {(weight * 100).toFixed(0)}%
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
            )
          })}
        </div>
      </div>

      {/* Legend and Info */}
      <div className="px-6 py-4 border-t border-border bg-background/50">
        <div className="flex flex-wrap items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-xs text-muted">High Attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-cyan-500 to-blue-500" />
            <span className="text-xs text-muted">Medium Attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-surface-elevated border border-border" />
            <span className="text-xs text-muted">Low Attention</span>
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
              ? <>Hover over any word to see which other words the model <span className="text-primary-light">attends to</span> when processing it. Watch how pronouns link back to their referents!</>
              : <>When processing "<span className="text-primary-light font-medium">{words[selectedWordIndex]}</span>", the model focuses on highlighted words to understand context—resolving pronouns, linking actions to subjects, and maintaining coherence.</>
            }
          </p>
        </motion.div>
      </div>
    </div>
  )
}
