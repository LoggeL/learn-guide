'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  tokens: number
}

interface MemoryFadeVisualizerProps {
  messages: Message[]
  maxTokens: number
  highlightFirst?: boolean
}

export function MemoryFadeVisualizer({
  messages,
  maxTokens,
  highlightFirst = false,
}: MemoryFadeVisualizerProps) {
  const totalTokens = messages.reduce((sum, m) => sum + m.tokens, 0)

  // Calculate visibility/opacity based on position and total context usage
  const getMessageStyle = (index: number, message: Message) => {
    const position = index / messages.length
    const contextUsage = totalTokens / maxTokens

    // Earlier messages fade more as context fills up
    let opacity = 1
    let scale = 1

    if (contextUsage > 0.5) {
      // Start fading early messages when context is half full
      const fadeStart = contextUsage - 0.5
      const fadeAmount = position < 0.3 ? (0.3 - position) * fadeStart * 2 : 0
      opacity = Math.max(0.2, 1 - fadeAmount)
      scale = Math.max(0.95, 1 - fadeAmount * 0.1)
    }

    return { opacity, scale }
  }

  const roleColors = {
    system: 'border-l-purple-500 bg-purple-500/10',
    user: 'border-l-secondary bg-secondary/10',
    assistant: 'border-l-primary bg-primary/10',
  }

  const roleLabels = {
    system: 'SYSTEM',
    user: 'USER',
    assistant: 'ASSISTANT',
  }

  return (
    <div className="space-y-2">
      {messages.map((message, index) => {
        const style = getMessageStyle(index, message)
        const isFirst = index === 0 && highlightFirst

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: style.opacity,
              scale: style.scale,
              x: 0,
            }}
            transition={{ duration: 0.3 }}
            className={clsx(
              'border-l-4 rounded-r-lg p-3 relative',
              roleColors[message.role],
              isFirst && 'ring-2 ring-purple-500/50'
            )}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-muted">
                {roleLabels[message.role]}
                {isFirst && (
                  <span className="ml-2 text-purple-400">← Your instruction</span>
                )}
              </span>
              <span className="text-xs text-muted font-mono">{message.tokens} tokens</span>
            </div>
            <p className="text-sm text-text line-clamp-2">{message.content}</p>

            {/* Fade overlay for "forgotten" messages */}
            {style.opacity < 0.5 && (
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent rounded-r-lg flex items-center justify-center">
                <span className="text-xs text-muted/50 italic">fading from context...</span>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
