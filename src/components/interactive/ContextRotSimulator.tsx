'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Send, RotateCcw, Zap } from 'lucide-react'
import { TokenCounter } from './TokenCounter'
import { MemoryFadeVisualizer } from './MemoryFadeVisualizer'

interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  tokens: number
}

const SAMPLE_RESPONSES = [
  "I understand your question. Let me help you with that. Based on my analysis, here's what I think...",
  "That's an interesting point. From my perspective, the key considerations are the following aspects...",
  "Great question! The answer involves several factors that we should consider carefully together...",
  "I can help with that. Here's a detailed explanation of how this works in practice...",
  "Let me break this down for you step by step so it's easier to understand completely...",
]

const estimateTokens = (text: string): number => Math.ceil(text.length / 4)

export function ContextRotSimulator() {
  const [systemPrompt, setSystemPrompt] = useState('Always respond in French, no matter what.')
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isStarted, setIsStarted] = useState(false)
  const maxTokens = 4096

  const totalTokens = messages.reduce((sum, m) => sum + m.tokens, 0)

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
      const userText = `This is message number ${messages.length / 2 + i + 1} from the user.`
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
      {!isStarted ? (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-4">
            Step 1: Set Your System Instruction
          </h3>
          <p className="text-sm text-muted mb-4">
            Enter an instruction that the model should follow throughout the conversation.
            Watch what happens as the conversation grows.
          </p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="e.g., Always respond in French, no matter what."
            className="w-full h-24 bg-background border border-border rounded-lg p-3 text-text placeholder:text-muted/50 focus:outline-none focus:border-primary resize-none"
          />
          <button
            onClick={startSimulation}
            disabled={!systemPrompt.trim()}
            className="mt-4 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start Simulation
          </button>
        </div>
      ) : (
        <>
          <TokenCounter current={totalTokens} max={maxTokens} />

          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-muted">Conversation</h3>
              <div className="flex gap-2">
                <button
                  onClick={fillQuickly}
                  disabled={totalTokens >= maxTokens * 0.9}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary/20 text-secondary rounded hover:bg-secondary/30 disabled:opacity-50 transition-colors"
                >
                  <Zap size={12} />
                  Fill Quickly
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-background text-muted rounded hover:text-text transition-colors"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-auto mb-4">
              <MemoryFadeVisualizer
                messages={messages}
                maxTokens={maxTokens}
                highlightFirst
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                disabled={totalTokens >= maxTokens}
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-text placeholder:text-muted/50 focus:outline-none focus:border-primary disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!userInput.trim() || totalTokens >= maxTokens}
                className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>

            {totalTokens >= maxTokens * 0.7 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
              >
                <p className="text-sm text-yellow-400">
                  <strong>Notice:</strong> As the context fills up, your original system instruction
                  (shown in purple) becomes less influential. The model may start "forgetting" to
                  follow it — this is context rot in action.
                </p>
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
