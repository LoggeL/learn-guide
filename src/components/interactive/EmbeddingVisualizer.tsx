'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Target, Layers } from 'lucide-react'
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
  'data': [-0.25, -0.7],
  'AI': [-0.35, -0.75],
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

// All available words grouped by category
const AVAILABLE_WORDS = {
  animals: ['cat', 'dog', 'bird', 'fish', 'horse'],
  royalty: ['king', 'queen', 'prince', 'princess'],
  technology: ['computer', 'software', 'algorithm', 'data', 'AI'],
  food: ['apple', 'banana', 'pizza', 'bread'],
  emotions: ['happy', 'sad', 'angry', 'love'],
}

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

  const words = activeWords

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

        {/* Word selection by category */}
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

        {/* Active words count */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
          <span className="text-muted">{activeWords.length} {t.interactive.wordsActive}</span>
          {selectedWord && (
            <span className="text-primary-light">
              {t.interactive.comparing}: <strong>{selectedWord}</strong>
            </span>
          )}
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
          <svg className="absolute inset-0 w-full h-full">
            {/* Defs for arrow markers */}
            <defs>
              {words.map((word) => {
                const category = getCategory(word)
                const colorMap: Record<string, string> = {
                  animals: '#10b981',
                  royalty: '#a855f7',
                  technology: '#06b6d4',
                  food: '#f97316',
                  emotions: '#ec4899',
                  default: '#6b7280',
                }
                return (
                  <marker
                    key={`arrow-${word}`}
                    id={`arrow-${word}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,6 L9,3 z" fill={colorMap[category]} />
                  </marker>
                )
              })}
            </defs>

            {/* Grid lines */}
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#333" strokeWidth="1" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#333" strokeWidth="1" />

            {/* Axis labels */}
            <text x="96%" y="52%" className="fill-muted text-[10px]">+x</text>
            <text x="2%" y="52%" className="fill-muted text-[10px]">-x</text>
            <text x="51%" y="4%" className="fill-muted text-[10px]">+y</text>
            <text x="51%" y="98%" className="fill-muted text-[10px]">-y</text>

            {/* Origin dot */}
            <circle cx="50%" cy="50%" r="4" className="fill-gray-500" />
            <text x="52%" y="54%" className="fill-muted text-[10px]">0</text>

            {/* Similarity lines (when word selected) */}
            {selectedWord && words.filter(w => w !== selectedWord).map((word) => {
              const [x1, y1] = getEmbedding(selectedWord)
              const [x2, y2] = getEmbedding(word)
              const similarity = cosineSimilarity([x1, y1], [x2, y2])

              return (
                <motion.line
                  key={`sim-${word}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: Math.max(0.1, (similarity + 1) / 2) * 0.5 }}
                  x1={`${50 + x1 * 40}%`}
                  y1={`${50 - y1 * 40}%`}
                  x2={`${50 + x2 * 40}%`}
                  y2={`${50 - y2 * 40}%`}
                  stroke={similarity > 0.5 ? '#22c55e' : similarity > 0 ? '#eab308' : '#ef4444'}
                  strokeWidth={Math.max(1, Math.abs(similarity) * 2)}
                  strokeDasharray="4 4"
                />
              )
            })}

            {/* Vector arrows from origin */}
            {words.map((word) => {
              const [x, y] = getEmbedding(word)
              const posX = 50 + x * 40
              const posY = 50 - y * 40
              const isSelected = selectedWord === word
              const category = getCategory(word)
              const colorMap: Record<string, string> = {
                animals: '#10b981',
                royalty: '#a855f7',
                technology: '#06b6d4',
                food: '#f97316',
                emotions: '#ec4899',
                default: '#6b7280',
              }

              return (
                <g key={word}>
                  {/* Vector line */}
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: isSelected ? 1 : 0.7,
                      strokeWidth: isSelected ? 3 : 2
                    }}
                    transition={{ duration: 0.5 }}
                    x1="50%"
                    y1="50%"
                    x2={`${posX}%`}
                    y2={`${posY}%`}
                    stroke={colorMap[category]}
                    markerEnd={`url(#arrow-${word})`}
                  />
                </g>
              )
            })}

            {/* Word labels at vector endpoints */}
            {words.map((word) => {
              const [x, y] = getEmbedding(word)
              const posX = 50 + x * 40
              const posY = 50 - y * 40
              const isSelected = selectedWord === word

              // Offset label based on quadrant
              const labelOffsetX = x > 0 ? 12 : -12
              const labelOffsetY = y > 0 ? -12 : 12
              const textAnchor = x > 0 ? 'start' : 'end'

              return (
                <g key={`label-${word}`} className="cursor-pointer" onClick={() => setSelectedWord(isSelected ? null : word)}>
                  {/* Endpoint dot */}
                  <motion.circle
                    cx={`${posX}%`}
                    cy={`${posY}%`}
                    r={isSelected ? 8 : 6}
                    className={`${isSelected ? 'fill-white' : 'fill-current'}`}
                    style={{ color: isSelected ? undefined : (getCategory(word) === 'animals' ? '#10b981' : getCategory(word) === 'royalty' ? '#a855f7' : getCategory(word) === 'technology' ? '#06b6d4' : getCategory(word) === 'food' ? '#f97316' : getCategory(word) === 'emotions' ? '#ec4899' : '#6b7280') }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                  {isSelected && (
                    <motion.circle
                      cx={`${posX}%`}
                      cy={`${posY}%`}
                      r="12"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.5 }}
                    />
                  )}
                  {/* Word label */}
                  <text
                    x={`${posX}%`}
                    y={`${posY}%`}
                    dx={labelOffsetX}
                    dy={labelOffsetY}
                    textAnchor={textAnchor}
                    className={`text-xs font-medium ${isSelected ? 'fill-white' : 'fill-text'}`}
                  >
                    {word}
                  </text>
                </g>
              )
            })}
          </svg>
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
