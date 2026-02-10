'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, ChevronRight, Settings, Wrench, MessageSquare, Terminal, CheckCircle, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type MessageType = 'system' | 'tools' | 'user' | 'assistant' | 'tool_call' | 'tool_result'

interface ContextMessage {
  id: string
  type: MessageType
  label: string
  content: string
  tokens: number
}

const typeConfig: Record<MessageType, { color: string, bg: string, icon: typeof Settings }> = {
  system: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', icon: Settings },
  tools: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', icon: Wrench },
  user: { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', icon: MessageSquare },
  assistant: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: MessageSquare },
  tool_call: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Terminal },
  tool_result: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: CheckCircle },
}

export function AgentLoopVisualizer() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loopCount, setLoopCount] = useState(1)

  const DEMO_FLOW: ContextMessage[] = [
    { id: 'sys', type: 'system', label: t.interactive.system, content: 'You are a helpful assistant with access to tools.', tokens: 15 },
    { id: 'tools', type: 'tools', label: t.interactive.tool, content: 'get_weather(city: string), search_web(query: string)', tokens: 45 },
    { id: 'user1', type: 'user', label: t.interactive.user, content: 'What\'s the weather in Tokyo?', tokens: 8 },
    { id: 'asst1', type: 'tool_call', label: t.interactive.toolExecution, content: 'get_weather("Tokyo")', tokens: 12 },
    { id: 'tool1', type: 'tool_result', label: t.interactive.tool, content: '{"temp": 22, "condition": "Sunny"}', tokens: 18 },
    { id: 'asst2', type: 'assistant', label: t.interactive.assistant, content: 'The weather in Tokyo is 22°C and sunny!', tokens: 14 },
  ]

  const visibleMessages = DEMO_FLOW.slice(0, currentStep)
  const isComplete = currentStep >= DEMO_FLOW.length
  const currentPhase = currentStep <= 2 ? 'setup' : currentStep <= 4 ? 'tool_use' : 'response'

  useEffect(() => {
    if (isPlaying && currentStep < DEMO_FLOW.length) {
      const timer = setTimeout(() => {
        setCurrentStep(s => s + 1)
      }, 1200)
      return () => clearTimeout(timer)
    } else if (isPlaying && isComplete) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, isComplete, DEMO_FLOW.length])

  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setLoopCount(1)
  }

  const nextLoop = () => {
    setCurrentStep(2) // Back to user message
    setLoopCount(l => l + 1)
    setIsPlaying(true)
  }

  return (
    <div className="space-y-6">
      {/* While Loop Code Visualization */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-surface-elevated border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Terminal size={18} className="text-primary-light" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">{t.interactive.startLoop}</h3>
              <p className="text-xs text-muted">{t.interactive.step} #{currentStep}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Loop #{loopCount}</span>
          </div>
        </div>

        <div className="p-6 font-mono text-sm">
          <div className={`transition-opacity ${currentPhase === 'setup' ? 'opacity-100' : 'opacity-40'}`}>
            <span className="text-purple-400">context</span> <span className="text-muted">=</span> <span className="text-cyan-400">[</span>
            <span className="text-yellow-400">system_prompt</span><span className="text-muted">,</span> <span className="text-orange-400">tool_defs</span>
            <span className="text-cyan-400">]</span>
          </div>
          
          <div className="mt-4">
            <span className="text-pink-400">while</span> <span className="text-cyan-400">True</span><span className="text-muted">:</span>
          </div>
          
          <div className={`ml-6 mt-2 transition-opacity ${currentPhase !== 'setup' ? 'opacity-100' : 'opacity-40'}`}>
            <div className={currentStep === 3 ? 'text-primary-light' : 'text-muted'}>
              <span className="text-purple-400">response</span> = <span className="text-yellow-400">llm</span>(<span className="text-purple-400">context</span>)
              {currentStep === 3 && <Loader2 size={14} className="inline ml-2 animate-spin text-primary" />}
            </div>
            
            <div className={`mt-2 ${currentStep === 4 ? 'text-primary-light' : 'text-muted'}`}>
              <span className="text-pink-400">if</span> response.<span className="text-cyan-400">has_tool_call</span>:
            </div>
            
            <div className={`ml-6 ${currentStep === 5 ? 'text-primary-light' : 'text-muted'}`}>
              <span className="text-purple-400">result</span> = <span className="text-yellow-400">execute_tool</span>(response.<span className="text-cyan-400">tool_call</span>)
            </div>
            
            <div className={`ml-6 ${currentStep === 5 ? 'text-primary-light' : 'text-muted'}`}>
              context.<span className="text-yellow-400">append</span>(<span className="text-purple-400">result</span>)
            </div>
            
            <div className={`mt-2 ${currentStep === 6 ? 'text-primary-light' : 'text-muted'}`}>
              <span className="text-pink-400">else</span>:
            </div>
            
            <div className={`ml-6 ${currentStep >= 6 ? 'text-emerald-400' : 'text-muted'}`}>
              <span className="text-pink-400">return</span> response.<span className="text-cyan-400">content</span>
              {isComplete && <CheckCircle size={14} className="inline ml-2 text-emerald-400" />}
            </div>
          </div>
        </div>
      </div>

      {/* Context Window Visualization */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-surface-elevated border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.context}</h3>
            <p className="text-xs text-muted">{visibleMessages.reduce((s, m) => s + m.tokens, 0)} tokens</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isComplete}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary-light border border-primary/30 hover:bg-primary/30 disabled:opacity-50 transition-all text-sm font-medium"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated text-muted border border-border hover:text-text transition-all text-sm"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        <div className="p-4 min-h-[300px]">
          <AnimatePresence>
            {visibleMessages.map((msg, i) => {
              const config = typeConfig[msg.type]
              const Icon = config.icon
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`mb-3 p-4 rounded-xl border ${config.bg}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                      <Icon size={14} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
                          {msg.label}
                        </span>
                        <span className="text-xs text-subtle font-mono">{msg.tokens} tok</span>
                      </div>
                      <p className="text-sm text-text font-mono">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {visibleMessages.length === 0 && (
            <div className="flex items-center justify-center h-[200px]">
              <button
                onClick={() => { setCurrentStep(1); setIsPlaying(true) }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/40 text-primary-light hover:bg-primary/30 cursor-pointer transition-all font-medium"
              >
                <Play size={16} />
                {t.interactive.startLoop}
              </button>
            </div>
          )}
        </div>

        {isComplete && (
          <div className="px-6 py-4 border-t border-border bg-emerald-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">{t.interactive.finalAnswer}</span>
            </div>
            <button
              onClick={nextLoop}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary-light border border-primary/30 hover:bg-primary/30 transition-all text-sm font-medium"
            >
              {t.common.next}
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
