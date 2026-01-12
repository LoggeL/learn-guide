'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, Zap, Play, MessageSquare, AlertTriangle, Sparkles } from 'lucide-react'
import { TokenCounter } from './TokenCounter'
import { MemoryFadeVisualizer } from './MemoryFadeVisualizer'

interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  tokens: number
}

const SAMPLE_RESPONSES = [
  "I understand your question. Let me help you with that. Based on my analysis, here's what I think about this topic...",
  "That's an interesting point. From my perspective, the key considerations are the following aspects we should explore...",
  "Great question! The answer involves several factors that we should consider carefully together to reach understanding...",
  "I can help with that. Here's a detailed explanation of how this works in practice and why it matters...",
  "Let me break this down for you step by step so it's easier to understand completely and apply...",
]

const estimateTokens = (text: string): number => Math.ceil(text.length / 4)

const EXAMPLE_PROMPTS = [
  "Always respond in French, no matter what language I use.",
  "You are a pirate. Speak like one at all times, matey!",
  "End every response with a haiku about the topic.",
  "Never use the letter 'e' in your responses.",
]

export function ContextRotSimulator() {
  const [systemPrompt, setSystemPrompt] = useState(EXAMPLE_PROMPTS[0])
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isStarted, setIsStarted] = useState(false)
  const maxTokens = 4096

  const totalTokens = messages.reduce((sum, m) => sum + m.tokens, 0)
  const contextUsage = totalTokens / maxTokens

  const startSimulation = useCallback(() => {
    if (!systemPrompt.trim()) return
    setMessages([
      {
        id: 'system-1',
        role: 'system',
        content: systemPrompt,
        tokens: estimateTokens(systemPrompt),
      },
    ])
    setIsStarted(true)
  }, [systemPrompt])

  const sendMessage = useCallback(() => {
    if (!userInput.trim() || totalTokens >= maxTokens) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput,
      tokens: estimateTokens(userInput),
    }

    const responseText = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)]
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: responseText,
      tokens: estimateTokens(responseText),
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setUserInput('')
  }, [userInput, totalTokens, maxTokens])

  const reset = () => {
    setMessages([])
    setIsStarted(false)
    setUserInput('')
  }

  const fillQuickly = () => {
    if (!isStarted) return
    const quickMessages: Message[] = []
    let currentTokens = totalTokens

    for (let i = 0; i < 10 && currentTokens < maxTokens * 0.9; i++) {
      const userText = `This is test message number ${messages.length / 2 + i + 1} from the user asking about various topics.`
      const assistantText = SAMPLE_RESPONSES[i % SAMPLE_RESPONSES.length]

      quickMessages.push({
        id: `user-quick-${Date.now()}-${i}`,
        role: 'user',
        content: userText,
        tokens: estimateTokens(userText),
      })
      quickMessages.push({
        id: `assistant-quick-${Date.now()}-${i}`,
        role: 'assistant',
        content: assistantText,
        tokens: estimateTokens(assistantText),
      })
      currentTokens += estimateTokens(userText) + estimateTokens(assistantText)
    }

    setMessages((prev) => [...prev, ...quickMessages])
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl bg-surface border border-border overflow-hidden"
          >
            <div className="px-6 py-4 bg-surface-elevated border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Sparkles size={18} className="text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-text font-heading">Step 1: Set Your System Instruction</h3>
                <p className="text-xs text-muted">This instruction should persist throughout the conversation</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm text-muted mb-3">System Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="e.g., Always respond in French, no matter what."
                  className="w-full h-28 bg-background border border-border rounded-xl p-4 text-text placeholder:text-subtle focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs text-subtle mb-2 uppercase tracking-wider">Quick Examples</label>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setSystemPrompt(prompt)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs transition-all",
                        systemPrompt === prompt
                          ? "bg-primary/20 text-primary-light border border-primary/30"
                          : "bg-surface-elevated text-muted border border-border hover:border-primary/30 hover:text-text"
                      )}
                    >
                      {prompt.slice(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={startSimulation}
                disabled={!systemPrompt.trim()}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4"
              >
                <Play size={18} />
                Start Simulation
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="simulation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <TokenCounter current={totalTokens} max={maxTokens} />

            <div className="rounded-2xl bg-surface border border-border overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-surface-elevated border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <MessageSquare size={18} className="text-primary-light" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text font-heading">Conversation</h3>
                    <p className="text-xs text-muted">{messages.length} messages</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fillQuickly}
                    disabled={totalTokens >= maxTokens * 0.9}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-secondary border border-secondary/30 hover:border-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                  >
                    <Zap size={14} />
                    Fill Quickly
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated text-muted border border-border hover:border-primary/30 hover:text-text transition-all text-sm"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="max-h-96 overflow-auto p-4">
                <MemoryFadeVisualizer
                  messages={messages}
                  maxTokens={maxTokens}
                  highlightFirst
                />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-background/50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    disabled={totalTokens >= maxTokens}
                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-subtle focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!userInput.trim() || totalTokens >= maxTokens}
                    className="px-5 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
                  >
                    <Send size={16} />
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Warning Banner */}
            <AnimatePresence>
              {contextUsage >= 0.7 && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className={clsx(
                    "rounded-2xl p-5 border",
                    contextUsage >= 0.9
                      ? "bg-red-500/10 border-red-500/30"
                      : "bg-yellow-500/10 border-yellow-500/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      contextUsage >= 0.9 ? "bg-red-500/20" : "bg-yellow-500/20"
                    )}>
                      <AlertTriangle size={18} className={contextUsage >= 0.9 ? "text-red-400" : "text-yellow-400"} />
                    </div>
                    <div>
                      <h4 className={clsx(
                        "font-semibold mb-1",
                        contextUsage >= 0.9 ? "text-red-400" : "text-yellow-400"
                      )}>
                        {contextUsage >= 0.9 ? "Critical: Context Nearly Full!" : "Warning: Context Filling Up"}
                      </h4>
                      <p className="text-sm text-muted leading-relaxed">
                        {contextUsage >= 0.9 
                          ? "Your system instruction (shown in purple) is now being pushed out of the model's attention. The model may completely ignore your original instruction!"
                          : "As the context fills up, your original system instruction becomes less influential. Notice how it's starting to fade—this is context rot in action."
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
