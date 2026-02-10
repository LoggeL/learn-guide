'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Ghost, Crown, User, Bot, Sparkles, X } from 'lucide-react'

interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  tokens: number
  truncated?: boolean
}

interface MemoryFadeVisualizerProps {
  messages: Message[]
  maxTokens: number
  highlightFirst?: boolean
  showTruncated?: boolean
}

export function MemoryFadeVisualizer({
  messages,
  maxTokens,
  highlightFirst = false,
  showTruncated = false,
}: MemoryFadeVisualizerProps) {
  const totalTokens = messages.reduce((sum, m) => sum + m.tokens, 0)

  const getMessageStyle = (index: number, message: Message) => {
    // If message is truncated (outside window), show it differently
    if (message.truncated) {
      return { opacity: 0.3, scale: 0.95, blur: 2 }
    }
    
    const position = index / messages.length
    const contextUsage = totalTokens / maxTokens

    let opacity = 1
    let scale = 1
    let blur = 0

    if (contextUsage > 0.5) {
      const fadeStart = contextUsage - 0.5
      const fadeAmount = position < 0.3 ? (0.3 - position) * fadeStart * 2.5 : 0
      opacity = Math.max(0.15, 1 - fadeAmount)
      scale = Math.max(0.96, 1 - fadeAmount * 0.08)
      blur = fadeAmount * 3
    }

    return { opacity, scale, blur }
  }

  const roleConfig = {
    system: { 
      color: 'from-purple-500 to-pink-500', 
      bg: 'bg-purple-500/10', 
      border: 'border-purple-500/30',
      icon: Crown,
      label: 'SYSTEM'
    },
    user: { 
      color: 'from-cyan-500 to-blue-500', 
      bg: 'bg-cyan-500/10', 
      border: 'border-cyan-500/30',
      icon: User,
      label: 'USER'
    },
    assistant: { 
      color: 'from-emerald-500 to-teal-500', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/30',
      icon: Bot,
      label: 'ASSISTANT'
    },
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {messages.map((message, index) => {
          const style = getMessageStyle(index, message)
          const isFirst = index === 0 && highlightFirst
          const config = roleConfig[message.role]
          const Icon = config.icon
          const isFading = style.opacity < 0.5 && !message.truncated
          const isTruncated = message.truncated

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{
                opacity: style.opacity,
                scale: style.scale,
                x: 0,
                filter: `blur(${style.blur}px)`,
              }}
              exit={{ opacity: 0, x: 30, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={`relative rounded-xl p-4 border ${
                isTruncated 
                  ? 'bg-red-500/5 border-red-500/20' 
                  : `${config.bg} ${config.border}`
              } ${
                isFirst && !isTruncated && 'ring-2 ring-purple-500/50 ring-offset-2 ring-offset-surface'
              }`}
            >
              {/* Gradient accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b ${
                isTruncated ? 'from-red-500 to-red-700' : config.color
              }`} />
              
              {/* Truncated X overlay */}
              {isTruncated && showTruncated && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-red-500/5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
                    <X size={14} className="text-red-400" />
                    <span className="text-xs font-medium text-red-400">Outside context window</span>
                  </div>
                </div>
              )}
              
              <div className={`flex items-start gap-3 pl-2 ${isTruncated ? 'opacity-30' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${
                  isTruncated ? 'from-red-500/20 to-red-500/10' : config.color + '/20'
                }`}>
                  <Icon size={14} className="text-text" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted uppercase tracking-wider">
                        {config.label}
                      </span>
                      {isFirst && !isTruncated && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs sm:text-[10px] font-medium">
                          <Sparkles size={10} />
                          Your instruction
                        </span>
                      )}
                      {isTruncated && isFirst && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs sm:text-[10px] font-medium">
                          <X size={10} />
                          LOST!
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-subtle font-mono">{message.tokens} tok</span>
                  </div>
                  <p className="text-sm text-text leading-relaxed line-clamp-2">
                    {message.content}
                  </p>
                </div>
              </div>

              {/* Fade overlay for "forgotten" messages */}
              <AnimatePresence>
                {isFading && !isTruncated && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent rounded-xl flex items-center"
                  >
                    <div className="flex items-center gap-2 px-4 text-muted/60">
                      <Ghost size={16} className="animate-pulse" />
                      <span className="text-xs italic">Fading from attention...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </AnimatePresence>
      
      {messages.length === 0 && (
        <div className="text-center py-8 text-muted">
          <p className="text-sm">No messages yet. Start the conversation!</p>
        </div>
      )}
    </div>
  )
}
