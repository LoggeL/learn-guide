'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, RotateCcw, ChevronRight, Settings, Wrench, MessageSquare,
  Terminal, CheckCircle, Loader2, AlertTriangle, Zap, ArrowRight
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type MessageType = 'system' | 'tools' | 'user' | 'assistant' | 'tool_call' | 'tool_result' | 'error'

interface ContextMessage {
  id: string
  type: MessageType
  label: string
  content: string
  tokens: number
  phase?: 'observe' | 'think' | 'act' | 'learn'
  loopIteration?: number
  isHighlight?: boolean
}

interface LoopIteration {
  iteration: number
  phase: string
  description: string
}

const typeConfig: Record<MessageType, { color: string; bg: string; icon: typeof Settings }> = {
  system: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', icon: Settings },
  tools: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', icon: Wrench },
  user: { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', icon: MessageSquare },
  assistant: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: MessageSquare },
  tool_call: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Terminal },
  tool_result: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: CheckCircle },
  error: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: AlertTriangle },
}

// A complex multi-loop demo: Travel planning agent
function buildDemoFlow(t: Record<string, string>): ContextMessage[] {
  return [
    // SETUP
    {
      id: 'sys', type: 'system', label: t.system || 'System',
      content: 'You are a travel planning assistant. You have access to weather, flight search, and hotel booking tools. Always verify information before making recommendations.',
      tokens: 32, phase: 'observe'
    },
    {
      id: 'tools', type: 'tools', label: t.tool || 'Tool',
      content: 'get_weather(city, date) → {temp, condition}\nsearch_flights(from, to, date) → [{airline, price, time}]\nbook_hotel(city, check_in, check_out) → {name, price, confirmed}\ncalculate_budget(items[]) → {total, breakdown}',
      tokens: 85, phase: 'observe'
    },
    {
      id: 'user1', type: 'user', label: t.user || 'User',
      content: 'Plan a 3-day trip to Tokyo from Berlin, departing April 20. Budget: €2000 total.',
      tokens: 18, phase: 'observe'
    },

    // LOOP 1 — Weather check
    {
      id: 'asst1', type: 'tool_call', label: t.toolExecution || 'Tool Call',
      content: 'get_weather("Tokyo", "2026-04-20")',
      tokens: 14, loopIteration: 1, phase: 'act'
    },
    {
      id: 'tool1', type: 'tool_result', label: t.tool || 'Tool Result',
      content: '{"temp": 18, "condition": "Partly cloudy, light rain expected", "humidity": 65}',
      tokens: 22, loopIteration: 1, phase: 'learn'
    },

    // LOOP 2 — Flight search
    {
      id: 'asst2', type: 'tool_call', label: t.toolExecution || 'Tool Call',
      content: 'search_flights("Berlin", "Tokyo", "2026-04-20")',
      tokens: 16, loopIteration: 2, phase: 'act'
    },
    {
      id: 'tool2', type: 'tool_result', label: t.tool || 'Tool Result',
      content: '[{"airline":"Lufthansa","price":"€890","time":"11:30-07:00+1"},{"airline":"Turkish Airlines","price":"€620","time":"14:00-10:30+1"}]',
      tokens: 38, loopIteration: 2, phase: 'learn'
    },

    // LOOP 3 — Hotel search (ERROR!)
    {
      id: 'asst3', type: 'tool_call', label: t.toolExecution || 'Tool Call',
      content: 'book_hotel("Tokyo", "2026-04-21", "2026-04-24")',
      tokens: 16, loopIteration: 3, phase: 'act'
    },
    {
      id: 'tool3', type: 'error', label: 'Error',
      content: 'Error: No availability for those dates (hotel may be full). Try different dates or area.',
      tokens: 20, loopIteration: 3, phase: 'learn', isHighlight: true
    },

    // LOOP 4 — Retry with different area
    {
      id: 'asst4', type: 'assistant', label: t.assistant || 'Assistant',
      content: 'The central hotels are booked out. Let me try searching in a different district...',
      tokens: 18, loopIteration: 4, phase: 'think', isHighlight: true
    },
    {
      id: 'asst4b', type: 'tool_call', label: t.toolExecution || 'Tool Call',
      content: 'book_hotel("Tokyo-Shinjuku", "2026-04-21", "2026-04-24")',
      tokens: 16, loopIteration: 4, phase: 'act'
    },
    {
      id: 'tool4', type: 'tool_result', label: t.tool || 'Tool Result',
      content: '{"name":"Shinjuku Granbell Hotel","price":"€85/night","total":"€255","confirmed":true}',
      tokens: 28, loopIteration: 4, phase: 'learn'
    },

    // LOOP 5 — Budget calculation
    {
      id: 'asst5', type: 'tool_call', label: t.toolExecution || 'Tool Call',
      content: 'calculate_budget(["flight: €620", "hotel: €255", "food: €180", "activities: €120"])',
      tokens: 24, loopIteration: 5, phase: 'act'
    },
    {
      id: 'tool5', type: 'tool_result', label: t.tool || 'Tool Result',
      content: '{"total": "€1,175", "remaining": "€825", "breakdown": {"flight": 620, "hotel": 255, "food": 180, "activities": 120}}',
      tokens: 35, loopIteration: 5, phase: 'learn'
    },

    // FINAL — No tool call, return answer
    {
      id: 'asst_final', type: 'assistant', label: t.assistant || 'Assistant',
      content: 'Here\'s your Tokyo trip plan ✈️\n\n🛫 Flight: Turkish Airlines, Berlin→Tokyo, Apr 20, €620\n🏨 Hotel: Shinjuku Granbell, 3 nights, €255\n🌤 Weather: ~18°C, pack a light rain jacket\n💰 Total: €1,175 (€825 under budget!)\n\nYou\'ll have plenty left for shopping in Shibuya and a day trip to Hakone! 🗻',
      tokens: 65, phase: 'think', isHighlight: true
    },
  ]
}

export function AgentLoopVisualizer() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [isComplete, setIsComplete] = useState(false)

  const DEMO_FLOW = buildDemoFlow(t as unknown as Record<string, string>)
  const visibleMessages = DEMO_FLOW.slice(0, currentStep)
  const totalTokens = visibleMessages.reduce((s, m) => s + m.tokens, 0)

  const currentLoop = currentStep >= 4 ? visibleMessages[visibleMessages.length - 1]?.loopIteration ?? 0 : 0

  const speedMs = speed === 'slow' ? 2000 : speed === 'fast' ? 600 : 1200

  useEffect(() => {
    if (isPlaying && currentStep < DEMO_FLOW.length) {
      const timer = setTimeout(() => setCurrentStep(s => s + 1), speedMs)
      return () => clearTimeout(timer)
    }
    if (isPlaying && currentStep >= DEMO_FLOW.length) {
      setIsPlaying(false)
      setIsComplete(true)
    }
  }, [isPlaying, currentStep, DEMO_FLOW.length, speedMs])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
    setIsComplete(false)
  }, [])

  const togglePlay = () => {
    if (isComplete) {
      reset()
      setTimeout(() => setIsPlaying(true), 50)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const stepForward = () => {
    if (currentStep < DEMO_FLOW.length) {
      setCurrentStep(s => s + 1)
      if (currentStep + 1 >= DEMO_FLOW.length) setIsComplete(true)
    }
  }

  // Compute loop progress info
  const loopIterations: LoopIteration[] = []
  for (const msg of visibleMessages) {
    if (msg.loopIteration && !loopIterations.find(l => l.iteration === msg.loopIteration)) {
      const phases: Record<number, string> = {
        1: 'Weather check',
        2: 'Flight search',
        3: 'Hotel booking (failed)',
        4: 'Hotel retry (success)',
        5: 'Budget calculation',
      }
      loopIterations.push({
        iteration: msg.loopIteration,
        phase: phases[msg.loopIteration] || `Loop ${msg.loopIteration}`,
        description: '',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔄</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">Travel Planning Agent</h3>
            <p className="text-xs text-muted">
              {currentStep === 0 ? 'Press Play to watch the agent plan a trip' :
                isComplete ? `Done — ${DEMO_FLOW.length} steps, ${loopIterations.length} loops` :
                  `Step ${currentStep}/${DEMO_FLOW.length} · Loop ${currentLoop} · ${totalTokens} tokens`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed control */}
          <div className="flex items-center rounded-xl bg-surface-elevated border border-border overflow-hidden">
            {(['slow', 'normal', 'fast'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${speed === s
                  ? 'bg-primary/20 text-primary-light'
                  : 'text-muted hover:text-text'
                  }`}
              >
                {s === 'slow' ? '0.5×' : s === 'normal' ? '1×' : '2×'}
              </button>
            ))}
          </div>

          <button onClick={stepForward} disabled={isComplete}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated border border-border text-muted hover:text-text disabled:opacity-50 transition-all">
            <ChevronRight size={14} />
          </button>

          <button onClick={togglePlay}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary-light border border-primary/30 hover:bg-primary/30 transition-all text-sm font-medium">
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : isComplete ? 'Replay' : 'Play'}
          </button>

          <button onClick={reset}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated border border-border text-muted hover:text-text transition-all">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / DEMO_FLOW.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Loop iteration tracker */}
      {loopIterations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {loopIterations.map((loop) => {
            const hasError = loop.phase.includes('failed')
            const isSuccess = loop.phase.includes('success')
            return (
              <motion.div
                key={loop.iteration}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${hasError
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : isSuccess
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-primary/10 border-primary/30 text-primary-light'
                  }`}
              >
                {hasError ? <AlertTriangle size={12} /> : isSuccess ? <CheckCircle size={12} /> : <Zap size={12} />}
                Loop {loop.iteration}: {loop.phase}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Context Window */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-3 bg-surface-elevated border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-text">Context Window</span>
            <span className="text-xs text-muted font-mono">{totalTokens} tokens</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-400">{visibleMessages.filter(m => m.type === 'tool_result').length} results</span>
            <span className="text-red-400">{visibleMessages.filter(m => m.type === 'error').length} errors</span>
            <span className="text-yellow-400">{visibleMessages.filter(m => m.type === 'tool_call').length} calls</span>
          </div>
        </div>

        <div className="p-4 max-h-[520px] overflow-y-auto">
          <AnimatePresence>
            {visibleMessages.map((msg) => {
              const config = typeConfig[msg.type]
              const Icon = config.icon
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`mb-3 p-3 rounded-xl border ${config.bg} ${msg.isHighlight ? 'ring-1 ring-primary/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                      <Icon size={13} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                            {msg.label}
                          </span>
                          {msg.loopIteration && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-muted font-mono">
                              loop {msg.loopIteration}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-subtle font-mono">{msg.tokens} tok</span>
                      </div>
                      <p className="text-xs text-text font-mono whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {visibleMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[200px] gap-4">
              <div className="text-4xl">✈️</div>
              <p className="text-sm text-muted text-center max-w-sm">
                Watch an agent plan a Tokyo trip — searching flights, handling errors, and staying within budget.
              </p>
              <button
                onClick={() => { setCurrentStep(1); setIsPlaying(true) }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/40 text-primary-light hover:bg-primary/30 cursor-pointer transition-all font-medium"
              >
                <Play size={16} />
                Start Demo
              </button>
            </div>
          )}
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-4 border-t border-border bg-emerald-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">{'Final Answer'} — 5 loops, 1 error recovered</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>Total: {totalTokens} tokens</span>
                <ArrowRight size={12} />
                <span className="text-primary-light">Under budget!</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Code highlight: what&apos;s happening now */}
      {currentStep > 0 && currentStep < DEMO_FLOW.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl bg-surface border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap size={12} className="text-primary-light" />
            </div>
            <span className="text-xs font-bold text-primary-light uppercase tracking-wider">What&apos;s happening</span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            {currentStep <= 3 && '📝 Setting up context: system prompt, tool definitions, and the user\'s request are loaded into the context window.'}
            {currentStep === 4 && '🌤 Loop 1: The agent decides to check Tokyo\'s weather first — smart planning!'}
            {currentStep === 5 && '🌤 Weather data received. The agent now knows to pack for light rain.'}
            {currentStep === 6 && '✈️ Loop 2: Searching for flights from Berlin to Tokyo on April 20.'}
            {currentStep === 7 && '✈️ Found 2 options — Turkish Airlines at €620 looks great for the budget.'}
            {currentStep === 8 && '🏨 Loop 3: Trying to book a hotel...'}
            {currentStep === 9 && '❌ Error! Central Tokyo hotels are full. This is where error recovery matters.'}
            {currentStep === 10 && '🧠 Loop 4: The agent thinks aloud — decides to try a different district instead of giving up.'}
            {currentStep === 11 && '🏨 Retrying hotel search in Shinjuku district...'}
            {currentStep === 12 && '✅ Success! Found a hotel for €85/night. Error recovered!'}
            {currentStep === 13 && '💰 Loop 5: Calculating total budget to make sure everything fits.'}
            {currentStep === 14 && '💰 Great news — only €1,175 of the €2,000 budget used!'}
            {currentStep >= 15 && '✨ No more tool calls — the agent returns the final comprehensive trip plan.'}
          </p>
        </motion.div>
      )}
    </div>
  )
}
