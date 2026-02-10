'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Hash, Zap, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { getEncoding, Tiktoken } from 'js-tiktoken'

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

// Helper to format token display with whitespace visualization
function formatToken(token: string): { display: string; isWhitespace: boolean; wsType?: string } {
  if (token === ' ') return { display: '·', isWhitespace: true, wsType: 'space' }
  if (token === '\n') return { display: '↵', isWhitespace: true, wsType: 'newline' }
  if (token === '\t') return { display: '→', isWhitespace: true, wsType: 'tab' }
  if (token === '\r') return { display: '←', isWhitespace: true, wsType: 'return' }
  // Leading space tokens (like " the")
  if (token.startsWith(' ')) {
    return { display: '·' + token.slice(1), isWhitespace: false, wsType: 'leading' }
  }
  return { display: token, isWhitespace: false }
}

export function TokenizerDemo() {
  const { t } = useTranslation()
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.')
  const [tokens, setTokens] = useState<{ token: string; id: number }[]>([])
  const [encoding, setEncoding] = useState<Tiktoken | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showIdsOnly, setShowIdsOnly] = useState(false)

  // Initialize the tokenizer (o200k_base is used by GPT-4o, GPT-4.1)
  useEffect(() => {
    const initEncoder = async () => {
      try {
        const enc = getEncoding('o200k_base')
        setEncoding(enc)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load tokenizer:', error)
        setIsLoading(false)
      }
    }
    initEncoder()
  }, [])

  // Tokenize text when it changes
  useEffect(() => {
    if (!encoding || !text) {
      setTokens([])
      return
    }

    try {
      const tokenIds = encoding.encode(text)
      const tokenData = tokenIds.map((id) => {
        // Decode each token individually to get its text representation
        const tokenBytes = encoding.decode([id])
        return {
          token: tokenBytes,
          id: id,
        }
      })
      setTokens(tokenData)
    } catch (error) {
      console.error('Tokenization error:', error)
      setTokens([])
    }
  }, [text, encoding])

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

        {/* Tokenizer Info Badge */}
        <div className="mt-3 flex items-center gap-2">
          <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            o200k_base
          </span>
          <span className="text-xs text-muted">
            GPT-4o / GPT-4.1 tokenizer
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          {isLoading ? (
            <Loader2 size={24} className="animate-spin mx-auto text-muted" />
          ) : (
            <motion.div
              key={tokenCount}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-mono font-bold text-gradient"
            >
              {tokenCount}
            </motion.div>
          )}
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
          {isLoading ? (
            <Loader2 size={24} className="animate-spin mx-auto text-muted" />
          ) : (
            <motion.div
              key={ratio}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-mono font-bold text-emerald-400"
            >
              {ratio}
            </motion.div>
          )}
          <p className="text-xs text-muted mt-1">{t.interactive.tokensPerChar}</p>
        </div>
      </div>

      {/* Token Visualization */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <Hash size={18} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">{t.interactive.tokenBreakdown}</h3>
              <p className="text-xs text-muted">{t.interactive.commonTokens}</p>
            </div>
          </div>
          <button
            onClick={() => setShowIdsOnly(!showIdsOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showIdsOnly
                ? 'bg-primary/20 text-primary-light border border-primary/30'
                : 'bg-surface-elevated text-muted border border-border hover:text-text'
            }`}
          >
            {showIdsOnly ? 'IDs Only' : 'Show Text'}
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[100px]">
            <Loader2 size={32} className="animate-spin text-muted" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 min-h-[100px]">
            <AnimatePresence mode="popLayout">
              {tokens.map((token, index) => {
                const formatted = formatToken(token.token)
                return (
                  <motion.span
                    key={`${index}-${token.id}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.02 }}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border font-mono text-sm ${TOKEN_COLORS[index % TOKEN_COLORS.length]} ${
                      formatted.isWhitespace ? 'ring-1 ring-white/20' : ''
                    } ${formatted.wsType === 'leading' ? 'pl-1' : ''}`}
                    title={`"${token.token}" → ${token.id}`}
                  >
                    {!showIdsOnly && (
                      <span className="font-medium whitespace-pre">
                        {formatted.wsType === 'leading' && (
                          <span className="text-white/40 mr-0.5">·</span>
                        )}
                        {formatted.wsType === 'leading' ? token.token.slice(1) : formatted.display}
                      </span>
                    )}
                    <span className={`${showIdsOnly ? 'text-sm' : 'text-xs sm:text-[10px] opacity-60'}`}>
                      {token.id}
                    </span>
                  </motion.span>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Whitespace Legend */}
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">·</span>
            <span>space</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">↵</span>
            <span>newline</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">→</span>
            <span>tab</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/40">·</span><span className="font-mono">word</span>
            <span>leading space</span>
          </span>
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
