'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Target, Layers } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

// Simulated embeddings for demonstration
// In reality these would come from an embedding model
const WORD_EMBEDDINGS: Record<string, [number, number]> = {
  // Animals
  'cat': [0.8, 0.3],
  'dog': [0.75, 0.35],
  'bird': [0.7, 0.5],
  'fish': [0.6, 0.6],
  'horse': [0.65, 0.25],
  // Royalty
  'king': [-0.7, 0.8],
  'queen': [-0.65, 0.85],
  'prince': [-0.6, 0.7],
  'princess': [-0.55, 0.75],
  // Technology
  'computer': [-0.3, -0.7],
  'software': [-0.35, -0.65],
  'algorithm': [-0.4, -0.6],
  'data': [-0.25, -0.55],
  'AI': [-0.2, -0.5],
  // Food
  'apple': [0.3, -0.3],
  'banana': [0.35, -0.35],
  'pizza': [0.2, -0.4],
  'bread': [0.25, -0.25],
  // Emotions
  'happy': [-0.8, -0.2],
  'sad': [-0.85, -0.15],
  'angry': [-0.75, -0.25],
  'love': [-0.7, -0.1],
}

const CATEGORY_COLORS: Record<string, string> = {
  animals: 'bg-emerald-500',
  royalty: 'bg-purple-500',
  technology: 'bg-cyan-500',
  food: 'bg-orange-500',
  emotions: 'bg-pink-500',
  default: 'bg-gray-500',
}

function getCategory(word: string): string {
  const lower = word.toLowerCase()
  if (['cat', 'dog', 'bird', 'fish', 'horse'].includes(lower)) return 'animals'
  if (['king', 'queen', 'prince', 'princess'].includes(lower)) return 'royalty'
  if (['computer', 'software', 'algorithm', 'data', 'ai'].includes(lower)) return 'technology'
  if (['apple', 'banana', 'pizza', 'bread'].includes(lower)) return 'food'
  if (['happy', 'sad', 'angry', 'love'].includes(lower)) return 'emotions'
  return 'default'
}

function cosineSimilarity(a: [number, number], b: [number, number]): number {
  const dotProduct = a[0] * b[0] + a[1] * b[1]
  const magnitudeA = Math.sqrt(a[0] * a[0] + a[1] * a[1])
  const magnitudeB = Math.sqrt(b[0] * b[0] + b[1] * b[1])
  return dotProduct / (magnitudeA * magnitudeB)
}

function getEmbedding(word: string): [number, number] {
  const lower = word.toLowerCase()
  if (WORD_EMBEDDINGS[lower]) {
    return WORD_EMBEDDINGS[lower]
  }
  // Generate pseudo-random but consistent position for unknown words
  const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return [
    ((hash * 13) % 200 - 100) / 100,
    ((hash * 17) % 200 - 100) / 100,
  ]
}

export function EmbeddingVisualizer() {
  const { t } = useTranslation()
  const [words, setWords] = useState<string[]>(['king', 'queen', 'cat', 'dog', 'computer'])
  const [newWord, setNewWord] = useState('')
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const addWord = () => {
    if (newWord.trim() && !words.includes(newWord.trim().toLowerCase())) {
      setWords([...words, newWord.trim().toLowerCase()])
      setNewWord('')
    }
  }

  const removeWord = (word: string) => {
    setWords(words.filter(w => w !== word))
    if (selectedWord === word) setSelectedWord(null)
  }

  const getSimilarities = () => {
    if (!selectedWord) return []
    const selectedEmb = getEmbedding(selectedWord)
    return words
      .filter(w => w !== selectedWord)
      .map(w => ({
        word: w,
        similarity: cosineSimilarity(selectedEmb, getEmbedding(w)),
      }))
      .sort((a, b) => b.similarity - a.similarity)
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Plus size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.enterWords}</h3>
            <p className="text-xs text-muted">Try: king, queen, cat, dog, computer, apple</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addWord()}
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="Enter a word..."
          />
          <button
            onClick={addWord}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-xl transition-colors"
          >
            {t.interactive.addWord}
          </button>
        </div>

        {/* Word chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {words.map((word) => (
            <motion.button
              key={word}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedWord(selectedWord === word ? null : word)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                selectedWord === word
                  ? 'bg-primary/20 border-primary/50 text-primary-light'
                  : 'bg-surface-elevated border-border text-text hover:border-primary/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[getCategory(word)]}`} />
              <span className="font-medium">{word}</span>
              <X
                size={14}
                className="opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  removeWord(word)
                }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* 2D Visualization */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <Layers size={18} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.vectorSpace}</h3>
            <p className="text-xs text-muted">2D projection of embedding space</p>
          </div>
        </div>

        <div className="relative w-full h-80 bg-background rounded-xl border border-border overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
          </div>

          {/* Words */}
          {words.map((word) => {
            const [x, y] = getEmbedding(word)
            const posX = 50 + x * 40 // Convert to percentage
            const posY = 50 - y * 40 // Invert Y for screen coordinates
            const isSelected = selectedWord === word

            return (
              <motion.div
                key={word}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: isSelected ? 1.2 : 1,
                  left: `${posX}%`,
                  top: `${posY}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setSelectedWord(isSelected ? null : word)}
              >
                <div
                  className={`relative w-4 h-4 rounded-full ${CATEGORY_COLORS[getCategory(word)]} ${
                    isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''
                  }`}
                >
                  <motion.div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-surface border border-border rounded text-xs font-medium text-text whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {word}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}

          {/* Draw lines to selected word */}
          {selectedWord && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {words.filter(w => w !== selectedWord).map((word) => {
                const [x1, y1] = getEmbedding(selectedWord)
                const [x2, y2] = getEmbedding(word)
                const similarity = cosineSimilarity([x1, y1], [x2, y2])

                return (
                  <motion.line
                    key={word}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: Math.max(0.1, (similarity + 1) / 2) }}
                    x1={`${50 + x1 * 40}%`}
                    y1={`${50 - y1 * 40}%`}
                    x2={`${50 + x2 * 40}%`}
                    y2={`${50 - y2 * 40}%`}
                    stroke={similarity > 0.5 ? '#22c55e' : similarity > 0 ? '#eab308' : '#ef4444'}
                    strokeWidth={Math.max(1, Math.abs(similarity) * 3)}
                    strokeDasharray={similarity < 0 ? '4 4' : undefined}
                  />
                )
              })}
            </svg>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== 'default').map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-muted capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Similarity Scores */}
      {selectedWord && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-surface border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <Target size={18} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">
                {t.interactive.similarityScore}: {selectedWord}
              </h3>
              <p className="text-xs text-muted">Cosine similarity to other words</p>
            </div>
          </div>

          <div className="space-y-3">
            {getSimilarities().map(({ word, similarity }) => (
              <div key={word} className="flex items-center gap-4">
                <span className="w-20 text-sm font-medium text-text">{word}</span>
                <div className="flex-1 h-3 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((similarity + 1) / 2) * 100}%` }}
                    className={`h-full rounded-full ${
                      similarity > 0.5
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        : similarity > 0
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                        : 'bg-gradient-to-r from-red-600 to-red-400'
                    }`}
                  />
                </div>
                <span className={`w-16 text-right text-sm font-mono ${
                  similarity > 0.5 ? 'text-emerald-400' : similarity > 0 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {similarity.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
