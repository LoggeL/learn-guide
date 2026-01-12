'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, Zap, Play, MessageSquare, AlertTriangle, Skull, Sparkles } from 'lucide-react'
import { TokenCounter } from './TokenCounter'
import { MemoryFadeVisualizer } from './MemoryFadeVisualizer'

interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  tokens: number
  truncated?: boolean
}

const SAMPLE_RESPONSES = [
  "I understand. Here's my response to your message...",
  "That's a great point. Let me elaborate on that...",
  "Sure, I can help with that request...",
  "Thanks for sharing. Here's what I think...",
  "Good question! The answer is...",
]

const estimateTokens = (text: string): number => Math.ceil(text.length / 4)

const EXAMPLE_PROMPTS = [
  { label: "Speak French", prompt: "Always respond in French." },
  { label: "Be a Pirate", prompt: "You are a pirate. Say 'Arrr' a lot." },
  { label: "End with Haiku", prompt: "End every response with a haiku." },
]

export function ContextRotSimulator() {
  const [systemPrompt, setSystemPrompt] = useState(EXAMPLE_PROMPTS[0].prompt)
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isStarted, setIsStarted] = useState(false)
  const maxTokens = 2048  // Smaller window for faster demo

  const totalTokens = messages.reduce((sum, m) => sum + m.tokens, 0)
  const contextUsage = totalTokens / maxTokens
  const isOverflowing = totalTokens > maxTokens

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
    if (!userInput.trim()) return

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
  }, [userInput])

  const reset = () => {
    setMessages([])
    setIsStarted(false)
    setUserInput('')
  }

  const fillQuickly = () => {
    if (!isStarted) return
    const quickMessages: Message[] = []
    let currentTokens = totalTokens

    // Keep adding until we EXCEED the limit
    for (let i = 0; i < 20 && currentTokens < maxTokens * 1.5; i++) {
      const userText = `Message ${messages.length / 2 + i + 1}: Can you help me with this?`
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

  // Calculate which messages would be truncated
  const getVisibleMessages = () => {
    if (totalTokens <= maxTokens) {
      return messages.map(m => ({ ...m, truncated: false }))
    }
    
    // Messages that exceed the window get marked as truncated
    let runningTotal = 0
    const reversed = [...messages].reverse()
    const visibleFromEnd: Message[] = []
    
    for (const msg of reversed) {
      runningTotal += msg.tokens
      visibleFromEnd.push({
        ...msg,
        truncated: runningTotal > maxTokens
      })
    }
    
    return visibleFromEnd.reverse()
  }

  const visibleMessages = getVisibleMessages()
  const truncatedCount = visibleMessages.filter(m => m.truncated).length

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
                <h3 className="font-semibold text-text font-heading">Set Your System Instruction</h3>
                <p className="text-xs text-muted">This should persist throughout the conversation</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm text-muted mb-3">System Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="e.g., Always respond in French."
                  className="w-full h-24 bg-background border border-border rounded-xl p-4 text-text placeholder:text-subtle focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs text-subtle mb-2 uppercase tracking-wider">Quick Examples</label>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setSystemPrompt(example.prompt)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        systemPrompt === example.prompt
                          ? "bg-primary/20 text-primary-light border border-primary/30"
                          : "bg-surface-elevated text-muted border border-border hover:border-primary/30 hover:text-text"
                      }`}
                    >
                      {example.label}
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
            <TokenCounter 
              current={totalTokens} 
              max={maxTokens} 
              overflow={isOverflowing}
            />

            <div className="rounded-2xl bg-surface border border-border overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-surface-elevated border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isOverflowing 
                      ? "bg-gradient-to-br from-red-500/20 to-rose-500/20" 
                      : "bg-gradient-to-br from-primary/20 to-secondary/20"
                  }`}>
                    {isOverflowing 
                      ? <Skull size={18} className="text-red-400" />
                      : <MessageSquare size={18} className="text-primary-light" />
                    }
                  </div>
                  <div>
                    <h3 className="font-semibold text-text font-heading">
                      {isOverflowing ? "Context Overflow!" : "Conversation"}
                    </h3>
                    <p className="text-xs text-muted">
                      {isOverflowing 
                        ? `${truncatedCount} messages pushed out of window`
                        : `${messages.length} messages`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fillQuickly}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-secondary border border-secondary/30 hover:border-secondary/50 transition-all text-sm font-medium"
                  >
                    <Zap size={14} />
                    Overflow It!
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
                  messages={visibleMessages}
                  maxTokens={maxTokens}
                  highlightFirst
                  showTruncated
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
                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-subtle focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!userInput.trim()}
                    className="px-5 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Warning Banners */}
            <AnimatePresence>
              {isOverflowing && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="rounded-2xl p-5 border bg-red-500/10 border-red-500/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500/20">
                      <Skull size={18} className="text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-red-400">
                        System Instruction Lost!
                      </h4>
                      <p className="text-sm text-muted leading-relaxed">
                        Your system instruction has been <strong className="text-red-300">pushed completely out</strong> of the context window. 
                        The model can no longer see it at all—it's as if you never gave the instruction. 
                        This is the worst case of context rot: total amnesia.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              {!isOverflowing && contextUsage >= 0.7 && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="rounded-2xl p-5 border bg-yellow-500/10 border-yellow-500/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-yellow-500/20">
                      <AlertTriangle size={18} className="text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-yellow-400">
                        Context Filling Up
                      </h4>
                      <p className="text-sm text-muted leading-relaxed">
                        Your system instruction is losing influence as newer messages take priority. 
                        Notice how it's fading visually—this represents the model's waning attention to it.
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
