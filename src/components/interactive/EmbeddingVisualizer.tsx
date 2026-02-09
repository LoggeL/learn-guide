'use client'

import { useState, useRef, useCallback, useMemo, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Plus, Target, Layers } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import dynamic from 'next/dynamic'

// Lazily import the 3D scene to avoid SSR issues
const Scene3D = dynamic(() => import('./EmbeddingScene3D'), { ssr: false })

// Simulated 3D embeddings
const WORD_EMBEDDINGS: Record<string, [number, number, number]> = {
  // Animals - cluster in +x region
  'cat': [0.8, 0.3, 0.2],
  'dog': [0.75, 0.35, 0.15],
  'bird': [0.7, 0.5, 0.4],
  'fish': [0.6, 0.6, 0.5],
  'horse': [0.65, 0.25, 0.1],
  // Royalty - cluster in -x, +y
  'king': [-0.7, 0.8, 0.3],
  'queen': [-0.65, 0.85, 0.35],
  'prince': [-0.6, 0.7, 0.15],
  'princess': [-0.55, 0.75, 0.25],
  // Technology - cluster in -x, -y, -z
  'computer': [-0.3, -0.7, -0.5],
  'software': [-0.35, -0.65, -0.45],
  'algorithm': [-0.4, -0.6, -0.55],
  'data': [-0.25, -0.7, -0.4],
  'AI': [-0.35, -0.75, -0.6],
  // Food - cluster in +x, -y
  'apple': [0.3, -0.3, -0.1],
  'banana': [0.35, -0.35, -0.15],
  'pizza': [0.2, -0.4, 0.0],
  'bread': [0.25, -0.25, -0.05],
  // Emotions - cluster in -x, -y, +z
  'happy': [-0.8, -0.2, 0.6],
  'sad': [-0.85, -0.15, 0.55],
  'angry': [-0.75, -0.25, 0.65],
  'love': [-0.7, -0.1, 0.7],
}

const CATEGORY_COLORS: Record<string, string> = {
  animals: 'bg-emerald-500',
  royalty: 'bg-purple-500',
  technology: 'bg-cyan-500',
  food: 'bg-orange-500',
  emotions: 'bg-pink-500',
  default: 'bg-gray-500',
}

const CATEGORY_HEX: Record<string, string> = {
  animals: '#10b981',
  royalty: '#a855f7',
  technology: '#06b6d4',
  food: '#f97316',
  emotions: '#ec4899',
  default: '#6b7280',
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

function cosineSimilarity3D(a: [number, number, number], b: [number, number, number]): number {
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const magA = Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2)
  const magB = Math.sqrt(b[0] ** 2 + b[1] ** 2 + b[2] ** 2)
  if (magA === 0 || magB === 0) return 0
  return dot / (magA * magB)
}

function getEmbedding(word: string): [number, number, number] {
  const lower = word.toLowerCase()
  if (WORD_EMBEDDINGS[word]) return WORD_EMBEDDINGS[word]
  if (WORD_EMBEDDINGS[lower]) return WORD_EMBEDDINGS[lower]
  const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return [
    ((hash * 13) % 200 - 100) / 100,
    ((hash * 17) % 200 - 100) / 100,
    ((hash * 23) % 200 - 100) / 100,
  ]
}

const AVAILABLE_WORDS = {
  animals: ['cat', 'dog', 'bird', 'fish', 'horse'],
  royalty: ['king', 'queen', 'prince', 'princess'],
  technology: ['computer', 'software', 'algorithm', 'data', 'AI'],
  food: ['apple', 'banana', 'pizza', 'bread'],
  emotions: ['happy', 'sad', 'angry', 'love'],
}

export type WordData = {
  word: string
  position: [number, number, number]
  category: string
  color: string
}

export { getCategory, getEmbedding, cosineSimilarity3D, CATEGORY_HEX, AVAILABLE_WORDS, CATEGORY_COLORS }

export function EmbeddingVisualizer() {
  const { t } = useTranslation()
  const [activeWords, setActiveWords] = useState<string[]>(['king', 'queen', 'cat', 'dog', 'computer'])
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const toggleWord = (word: string) => {
    if (activeWords.includes(word)) {
      setActiveWords(activeWords.filter(w => w !== word))
      if (selectedWord === word) setSelectedWord(null)
    } else {
      setActiveWords([...activeWords, word])
    }
  }

  const wordData: WordData[] = useMemo(() =>
    activeWords.map(word => ({
      word,
      position: getEmbedding(word),
      category: getCategory(word),
      color: CATEGORY_HEX[getCategory(word)] || CATEGORY_HEX.default,
    })),
    [activeWords]
  )

  const getSimilarities = () => {
    if (!selectedWord) return []
    const selectedEmb = getEmbedding(selectedWord)
    return activeWords
      .filter(w => w !== selectedWord)
      .map(w => ({
        word: w,
        similarity: cosineSimilarity3D(selectedEmb, getEmbedding(w)),
      }))
      .sort((a, b) => b.similarity - a.similarity)
  }

  return (
    <div className="space-y-6">
      {/* Word Selection */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Plus size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.selectWords}</h3>
            <p className="text-xs text-muted">{t.interactive.clickToToggle}</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(AVAILABLE_WORDS).map(([category, categoryWords]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[category]}`} />
                <span className="text-xs text-muted uppercase tracking-wider">{category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryWords.map((word) => {
                  const isActive = activeWords.includes(word)
                  const isSelected = selectedWord === word
                  return (
                    <motion.button
                      key={word}
                      onClick={() => toggleWord(word)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                        isActive
                          ? isSelected
                            ? 'bg-primary/30 border-primary/50 text-primary-light ring-2 ring-primary/30'
                            : 'bg-surface-elevated border-border text-text'
                          : 'bg-background border-border/50 text-muted opacity-50 hover:opacity-75'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {word}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
          <span className="text-muted">{activeWords.length} {t.interactive.wordsActive}</span>
          {selectedWord && (
            <span className="text-primary-light">
              {t.interactive.comparing}: <strong>{selectedWord}</strong>
            </span>
          )}
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <Layers size={18} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.vectorSpace}</h3>
            <p className="text-xs text-muted">3D interactive embedding space — drag to rotate, scroll to zoom</p>
          </div>
        </div>

        <div className="relative w-full h-[500px] bg-[#0a0a14] rounded-xl border border-border overflow-hidden">
          <Scene3D
            wordData={wordData}
            selectedWord={selectedWord}
            onSelectWord={setSelectedWord}
          />
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
