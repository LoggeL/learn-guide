'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Clock, Database, Search, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface Memory {
  id: number
  content: string
  type: 'short' | 'long'
  timestamp: Date
  relevance: number
}

let memoryIdCounter = 0

export function MemorySystemVisualizer() {
  const { t } = useTranslation()
  const [shortTermMemory, setShortTermMemory] = useState<Memory[]>([
    { id: ++memoryIdCounter, content: 'User prefers dark mode', type: 'short', timestamp: new Date(), relevance: 0.9 },
    { id: ++memoryIdCounter, content: 'Current task: Write documentation', type: 'short', timestamp: new Date(), relevance: 0.95 },
    { id: ++memoryIdCounter, content: 'Project name is "learn-guide"', type: 'short', timestamp: new Date(), relevance: 0.85 },
  ])
  const [longTermMemory, setLongTermMemory] = useState<Memory[]>([
    { id: ++memoryIdCounter, content: 'User is a software developer', type: 'long', timestamp: new Date(Date.now() - 86400000), relevance: 0.8 },
    { id: ++memoryIdCounter, content: 'Preferred programming language: TypeScript', type: 'long', timestamp: new Date(Date.now() - 172800000), relevance: 0.75 },
  ])
  const [newMemory, setNewMemory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMemoryType, setSelectedMemoryType] = useState<'short' | 'long'>('short')

  const addMemory = () => {
    if (!newMemory.trim()) return

    const memory: Memory = {
      id: ++memoryIdCounter,
      content: newMemory,
      type: selectedMemoryType,
      timestamp: new Date(),
      relevance: 0.9 + Math.random() * 0.1,
    }

    if (selectedMemoryType === 'short') {
      // Short-term memory has limited capacity
      const updated = [memory, ...shortTermMemory].slice(0, 5)
      setShortTermMemory(updated)

      // Oldest short-term memories migrate to long-term
      if (shortTermMemory.length >= 5) {
        const oldest = shortTermMemory[shortTermMemory.length - 1]
        setLongTermMemory([{ ...oldest, type: 'long' }, ...longTermMemory])
      }
    } else {
      setLongTermMemory([memory, ...longTermMemory])
    }

    setNewMemory('')
  }

  const deleteMemory = (id: number, type: 'short' | 'long') => {
    if (type === 'short') {
      setShortTermMemory(shortTermMemory.filter(m => m.id !== id))
    } else {
      setLongTermMemory(longTermMemory.filter(m => m.id !== id))
    }
  }

  const getFilteredMemories = (memories: Memory[]) => {
    if (!searchQuery.trim()) return memories
    const query = searchQuery.toLowerCase()
    return memories.filter(m =>
      m.content.toLowerCase().includes(query)
    ).sort((a, b) => {
      // Boost relevance for search matches
      const aMatch = a.content.toLowerCase().indexOf(query)
      const bMatch = b.content.toLowerCase().indexOf(query)
      return aMatch - bMatch
    })
  }

  const shortTermCapacity = (shortTermMemory.length / 5) * 100
  const longTermCount = longTermMemory.length

  return (
    <div className="space-y-6">
      {/* Add Memory */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Plus size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.addMemory}</h3>
            <p className="text-xs text-muted">Store new information</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedMemoryType('short')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedMemoryType === 'short'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'bg-surface-elevated text-muted border border-border hover:border-cyan-500/30'
            }`}
          >
            {t.interactive.shortTermMemory}
          </button>
          <button
            onClick={() => setSelectedMemoryType('long')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedMemoryType === 'long'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                : 'bg-surface-elevated text-muted border border-border hover:border-purple-500/30'
            }`}
          >
            {t.interactive.longTermMemory}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addMemory()}
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="Enter a memory to store..."
          />
          <button
            onClick={addMemory}
            disabled={!newMemory.trim()}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-xl transition-colors disabled:opacity-50"
          >
            Store
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <Search size={18} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.recallMemory}</h3>
            <p className="text-xs text-muted">Search stored memories</p>
          </div>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary/50 transition-colors"
          placeholder="Search memories..."
        />
      </div>

      {/* Memory Visualization */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Short-Term Memory */}
        <div className="rounded-2xl bg-surface border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <Clock size={18} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">{t.interactive.shortTermMemory}</h3>
              <p className="text-xs text-muted">Current context</p>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">{t.interactive.memoryCapacity}</span>
              <span className={shortTermCapacity >= 80 ? 'text-yellow-400' : 'text-cyan-400'}>
                {shortTermMemory.length}/5 slots
              </span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${shortTermCapacity}%` }}
                className={`h-full rounded-full ${
                  shortTermCapacity >= 80
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                    : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
                }`}
              />
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {getFilteredMemories(shortTermMemory).map((memory) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-3 bg-background rounded-xl border border-border group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-text flex-1">{memory.content}</p>
                    <button
                      onClick={() => deleteMemory(memory.id, 'short')}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded text-muted hover:text-red-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${memory.relevance * 100}%` }}
                        className="h-full bg-cyan-500/50 rounded-full"
                      />
                    </div>
                    <span className="text-xs sm:text-[10px] text-muted font-mono">
                      {(memory.relevance * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {shortTermMemory.length === 0 && (
              <p className="text-sm text-muted text-center py-4">No short-term memories</p>
            )}
          </div>
        </div>

        {/* Long-Term Memory */}
        <div className="rounded-2xl bg-surface border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Database size={18} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">{t.interactive.longTermMemory}</h3>
              <p className="text-xs text-muted">Persistent storage</p>
            </div>
          </div>

          {/* Count */}
          <div className="mb-4 p-3 bg-background rounded-xl border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{t.interactive.memoriesStored}</span>
              <span className="text-lg font-mono font-bold text-purple-400">{longTermCount}</span>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {getFilteredMemories(longTermMemory).map((memory) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-3 bg-background rounded-xl border border-border group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-text flex-1">{memory.content}</p>
                    <button
                      onClick={() => deleteMemory(memory.id, 'long')}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded text-muted hover:text-red-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${memory.relevance * 100}%` }}
                        className="h-full bg-purple-500/50 rounded-full"
                      />
                    </div>
                    <span className="text-xs sm:text-[10px] text-muted font-mono">
                      {(memory.relevance * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {longTermMemory.length === 0 && (
              <p className="text-sm text-muted text-center py-4">No long-term memories</p>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <Brain size={18} className="text-primary-light shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p>Short-term memory has limited capacity (5 slots). When full, oldest memories migrate to long-term storage.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
