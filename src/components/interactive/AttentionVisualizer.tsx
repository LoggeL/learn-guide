'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface WordWeight {
  word: string
  weight: number
}

const SENTENCES = [
  "The cat sat on the mat because it was warm.",
  "The robot picked up the ball and put it in the box.",
  "She gave him the book because he needed it for class.",
]

export function AttentionVisualizer() {
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  
  const words = SENTENCES[sentenceIndex].split(' ')

  // Simulated attention logic
  const getAttentionWeight = (targetIdx: number, currentIdx: number) => {
    if (targetIdx === null) return 0.1
    
    const targetWord = words[targetIdx].toLowerCase().replace(/[.,]/g, '')
    const currentWord = words[currentIdx].toLowerCase().replace(/[.,]/g, '')

    // Basic heuristic-based attention for demo
    if (targetIdx === currentIdx) return 1.0
    
    // "it" refers to preceding nouns
    if (targetWord === 'it') {
      if (sentenceIndex === 0 && (currentWord === 'cat' || currentWord === 'mat')) return 0.8
      if (sentenceIndex === 1 && (currentWord === 'ball' || currentWord === 'box')) return 0.8
      if (sentenceIndex === 2 && currentWord === 'book') return 0.8
    }

    // "he"/"him" refers to "She"
    if ((targetWord === 'he' || targetWord === 'him') && currentWord === 'she') return 0.6
    if (targetWord === 'she' && (currentWord === 'he' || currentWord === 'him')) return 0.6

    // Verbs attend to subjects
    if (targetWord === 'sat' && currentWord === 'cat') return 0.7
    if (targetWord === 'picked' && currentWord === 'robot') return 0.7
    if (targetWord === 'gave' && currentWord === 'she') return 0.7

    return 0.05 + Math.random() * 0.1
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Attention Map Simulator</h3>
        <select 
          value={sentenceIndex} 
          onChange={(e) => {
            setSentenceIndex(parseInt(e.target.value))
            setSelectedWordIndex(null)
          }}
          className="bg-background border border-border rounded px-2 py-1 text-xs text-text outline-none focus:border-primary"
        >
          {SENTENCES.map((s, i) => (
            <option key={i} value={i}>Sentence {i + 1}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 leading-loose">
        {words.map((word, i) => {
          const weight = selectedWordIndex !== null ? getAttentionWeight(selectedWordIndex, i) : 0.1
          
          return (
            <motion.span
              key={i}
              onMouseEnter={() => setSelectedWordIndex(i)}
              onMouseLeave={() => setSelectedWordIndex(null)}
              animate={{
                backgroundColor: `rgba(0, 255, 136, ${weight * 0.4})`,
                color: weight > 0.5 ? '#00ff88' : '#e4e4e7',
                scale: weight > 0.5 ? 1.05 : 1,
              }}
              className={clsx(
                "px-2 py-1 rounded cursor-default transition-all duration-200 border border-transparent",
                selectedWordIndex === i && "border-primary/50 shadow-[0_0_10px_rgba(0,255,136,0.2)]",
                "text-lg font-medium"
              )}
            >
              {word}
            </motion.span>
          )
        })}
      </div>

      <div className="pt-6 border-t border-border/50">
        <div className="flex items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/40 rounded"></div>
            <span>High Attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/10 rounded"></div>
            <span>Low Attention</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted italic">
          {selectedWordIndex === null 
            ? "Hover over a word to see which other words the model 'attends' to when processing it."
            : `When the model processes "${words[selectedWordIndex]}", it focuses its attention on the highlighted words to understand context (e.g., resolving pronouns or linking actions to subjects).`}
        </p>
      </div>
    </div>
  )
}
