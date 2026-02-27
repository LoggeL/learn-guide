'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

interface PrefixMatchingDemoProps {
  t: Record<string, string>
}

const ORIGINAL_PROMPT = `You are a helpful AI assistant specializing in code review.
Always provide constructive feedback.
Focus on security, performance, and readability.
Use markdown formatting in your responses.

---

Review the following Python function:

def calculate_total(items):
    total = 0
    for item in items:
        total += item.price * item.quantity
    return total`

const CHARS_PER_TOKEN = 4

export function PrefixMatchingDemo({ t }: PrefixMatchingDemoProps) {
  const [editedPrompt, setEditedPrompt] = useState(ORIGINAL_PROMPT)

  const { matchLength, originalLen, editedLen } = useMemo(() => {
    let matchLen = 0
    const minLen = Math.min(ORIGINAL_PROMPT.length, editedPrompt.length)
    for (let i = 0; i < minLen; i++) {
      if (ORIGINAL_PROMPT[i] === editedPrompt[i]) {
        matchLen = i + 1
      } else {
        break
      }
    }
    return {
      matchLength: matchLen,
      originalLen: ORIGINAL_PROMPT.length,
      editedLen: editedPrompt.length,
    }
  }, [editedPrompt])

  const cachedTokens = Math.floor(matchLength / CHARS_PER_TOKEN)
  const totalTokens = Math.ceil(editedLen / CHARS_PER_TOKEN)
  const newTokens = totalTokens - cachedTokens
  const savings = totalTokens > 0 ? Math.round((cachedTokens / totalTokens) * 100) : 0

  const handleReset = () => {
    setEditedPrompt(ORIGINAL_PROMPT)
  }

  // Build highlighted display of the edited text
  const cachedPart = editedPrompt.slice(0, matchLength)
  const newPart = editedPrompt.slice(matchLength)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-xs text-muted uppercase tracking-wider font-heading">
        {t.prefixTitle}
      </div>
      <p className="text-sm text-muted">{t.prefixDesc}</p>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Original (read-only) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted uppercase tracking-wider font-medium">
              {t.prefixOriginal}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface-elevated border border-border font-mono text-xs leading-relaxed h-64 overflow-auto whitespace-pre-wrap text-muted">
            {ORIGINAL_PROMPT}
          </div>
        </div>

        {/* Editable */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted uppercase tracking-wider font-medium">
              {t.prefixEdited}
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {t.prefixReset}
            </button>
          </div>
          <textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs leading-relaxed h-64 resize-none text-text focus:outline-none focus:border-violet-500/50 transition-colors"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Cache boundary visualization */}
      <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
        <div className="text-xs text-muted uppercase tracking-wider font-medium">
          {t.prefixEditHint}
        </div>
        <div className="p-3 rounded-xl bg-surface-elevated border border-border font-mono text-xs leading-relaxed max-h-40 overflow-auto whitespace-pre-wrap">
          {cachedPart.length > 0 && (
            <span className="bg-green-500/15 text-green-300 rounded-sm">{cachedPart}</span>
          )}
          {cachedPart.length > 0 && newPart.length > 0 && (
            <span className="inline-block w-0.5 h-4 bg-violet-500 mx-0.5 align-middle rounded-full" />
          )}
          {newPart.length > 0 && (
            <span className="text-text">{newPart}</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
          key={cachedTokens}
        >
          <div className="text-[10px] text-muted uppercase tracking-wider mb-1">
            {t.prefixCachedTokens}
          </div>
          <div className="text-2xl font-bold font-mono text-green-400">
            {cachedTokens.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
          key={newTokens}
        >
          <div className="text-[10px] text-muted uppercase tracking-wider mb-1">
            {t.prefixNewTokens}
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {newTokens.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
          key={savings}
        >
          <div className="text-[10px] text-muted uppercase tracking-wider mb-1">
            {t.prefixSavings}
          </div>
          <div className="text-2xl font-bold font-mono text-violet-400">
            {savings}%
          </div>
        </motion.div>
      </div>

      {/* Visual savings bar */}
      <div className="space-y-2">
        <div className="h-4 rounded-full bg-surface-elevated overflow-hidden border border-border flex">
          <motion.div
            className="h-full bg-green-500"
            style={{ borderRadius: newTokens > 0 ? '9999px 0 0 9999px' : '9999px' }}
            initial={{ width: 0 }}
            animate={{ width: totalTokens > 0 ? `${(cachedTokens / totalTokens) * 100}%` : '0%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          <motion.div
            className="h-full bg-cyan-500"
            style={{ borderRadius: '0 9999px 9999px 0' }}
            initial={{ width: 0 }}
            animate={{ width: totalTokens > 0 ? `${(newTokens / totalTokens) * 100}%` : '0%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {t.prefixCachedTokens}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            {t.prefixNewTokens}
          </span>
        </div>
      </div>
    </div>
  )
}
