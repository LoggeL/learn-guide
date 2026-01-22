'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Hash, Zap } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

// Simplified tokenizer simulation - approximates BPE behavior
function tokenize(text: string): { token: string; id: number }[] {
  if (!text) return []

  // Common tokens that would be in a real vocabulary
  const vocabulary: Record<string, number> = {
    'the': 1, 'The': 2, 'a': 3, 'A': 4, 'is': 5, 'are': 6, 'was': 7,
    'an': 8, 'and': 9, 'or': 10, 'but': 11, 'in': 12, 'on': 13,
    'at': 14, 'to': 15, 'for': 16, 'of': 17, 'with': 18, 'as': 19,
    'by': 20, 'this': 21, 'that': 22, 'it': 23, 'be': 24, 'have': 25,
    'from': 26, 'not': 27, 'you': 28, 'we': 29, 'they': 30,
    ' ': 31, '.': 32, ',': 33, '!': 34, '?': 35, ':': 36, ';': 37,
    "'": 38, '"': 39, '-': 40, '(': 41, ')': 42, '\n': 43,
    'ing': 44, 'ed': 45, 'er': 46, 'est': 47, 'ly': 48, 'tion': 49,
    'ness': 50, 'ment': 51, 'able': 52, 'ful': 53, 'less': 54,
    'quick': 100, 'brown': 101, 'fox': 102, 'jump': 103, 'over': 104,
    'lazy': 105, 'dog': 106, 'Hello': 107, 'World': 108, 'AI': 109,
    'token': 110, 'model': 111, 'learn': 112, 'neural': 113, 'network': 114,
  }

  const tokens: { token: string; id: number }[] = []
  let remaining = text
  let tokenId = 1000

  while (remaining.length > 0) {
    let matched = false

    // Try to match longest tokens first (greedy)
    for (let len = Math.min(remaining.length, 10); len >= 1; len--) {
      const substr = remaining.slice(0, len)
      if (vocabulary[substr] !== undefined) {
        tokens.push({ token: substr, id: vocabulary[substr] })
        remaining = remaining.slice(len)
        matched = true
        break
      }
    }

    // If no match, treat single character as token
    if (!matched) {
      const char = remaining[0]
      tokens.push({ token: char, id: char.charCodeAt(0) + 500 })
      remaining = remaining.slice(1)
    }
  }

  return tokens
}

const TOKEN_COLORS = [
  'bg-purple-500/30 border-purple-500/50 text-purple-200',
  'bg-cyan-500/30 border-cyan-500/50 text-cyan-200',
  'bg-emerald-500/30 border-emerald-500/50 text-emerald-200',
  'bg-orange-500/30 border-orange-500/50 text-orange-200',
  'bg-pink-500/30 border-pink-500/50 text-pink-200',
  'bg-blue-500/30 border-blue-500/50 text-blue-200',
  'bg-yellow-500/30 border-yellow-500/50 text-yellow-200',
  'bg-red-500/30 border-red-500/50 text-red-200',
]

export function TokenizerDemo() {
  const { t } = useTranslation()
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.')
  const [tokens, setTokens] = useState<{ token: string; id: number }[]>([])

  useEffect(() => {
    setTokens(tokenize(text))
  }, [text])

  const tokenCount = tokens.length
  const charCount = text.length
  const ratio = charCount > 0 ? (tokenCount / charCount).toFixed(2) : '0.00'

  return (
    <div className="space-y-6">
      {/* Input Area */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Type size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.enterText}</h3>
            <p className="text-xs text-muted">{t.interactive.sampleText}</p>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 bg-background border border-border rounded-xl p-4 text-text font-mono text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
          placeholder={t.interactive.enterText}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={tokenCount}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-bold text-gradient"
          >
            {tokenCount}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.tokens}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={charCount}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-bold text-cyan-400"
          >
            {charCount}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.characters}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={ratio}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-bold text-emerald-400"
          >
            {ratio}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.tokensPerChar}</p>
        </div>
      </div>

      {/* Token Visualization */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <Hash size={18} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.tokenBreakdown}</h3>
            <p className="text-xs text-muted">{t.interactive.commonTokens}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {tokens.map((token, index) => (
              <motion.span
                key={`${index}-${token.token}-${token.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.02 }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border font-mono text-sm ${TOKEN_COLORS[index % TOKEN_COLORS.length]}`}
              >
                <span className="font-medium">
                  {token.token === ' ' ? '␣' : token.token === '\n' ? '↵' : token.token}
                </span>
                <span className="text-[10px] opacity-60">{token.id}</span>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <Zap size={18} className="text-primary-light shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p className="mb-2">{t.interactive.commonTokens}</p>
            <p>{t.interactive.rareTokens}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
