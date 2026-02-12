'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, BookOpen, Rocket, GraduationCap } from 'lucide-react'

interface PathTopic {
  id: string
  href: string
  nameKey: string
  descKey: string
}

interface PathStage {
  level: 'beginner' | 'intermediate' | 'advanced'
  icon: React.ReactNode
  colorFrom: string
  colorTo: string
  accent: string
  accentBorder: string
  accentBg: string
  topics: PathTopic[]
}

const stages: PathStage[] = [
  {
    level: 'beginner',
    icon: <Sparkles className="w-5 h-5" />,
    colorFrom: 'from-emerald-500',
    colorTo: 'to-green-500',
    accent: 'text-emerald-400',
    accentBorder: 'border-emerald-500/30',
    accentBg: 'bg-emerald-500/10',
    topics: [
      { id: 'prompt-basics', href: '/ai/prompting/basics', nameKey: 'prompt-basics', descKey: 'lpPromptBasics' },
      { id: 'temperature', href: '/ai/llm/temperature', nameKey: 'temperature', descKey: 'lpTemperature' },
      { id: 'tokenization', href: '/ai/llm/tokenization', nameKey: 'tokenization', descKey: 'lpTokenization' },
      { id: 'neural-networks', href: '/ai/ml-fundamentals/neural-networks', nameKey: 'neural-networks', descKey: 'lpNeuralNetworks' },
      { id: 'vision', href: '/ai/llm/vision', nameKey: 'vision', descKey: 'lpVision' },
      { id: 'local-inference', href: '/ai/llm-inference/local-inference', nameKey: 'local-inference', descKey: 'lpLocalInference' },
    ],
  },
  {
    level: 'intermediate',
    icon: <BookOpen className="w-5 h-5" />,
    colorFrom: 'from-amber-500',
    colorTo: 'to-orange-500',
    accent: 'text-amber-400',
    accentBorder: 'border-amber-500/30',
    accentBg: 'bg-amber-500/10',
    topics: [
      { id: 'system-prompts', href: '/ai/prompting/system-prompts', nameKey: 'system-prompts', descKey: 'lpSystemPrompts' },
      { id: 'embeddings', href: '/ai/llm/embeddings', nameKey: 'embeddings', descKey: 'lpEmbeddings' },
      { id: 'attention', href: '/ai/llm/attention', nameKey: 'attention', descKey: 'lpAttention' },
      { id: 'agent-loop', href: '/ai/agents/loop', nameKey: 'agent-loop', descKey: 'lpAgentLoop' },
      { id: 'tool-design', href: '/ai/agents/tool-design', nameKey: 'tool-design', descKey: 'lpToolDesign' },
      { id: 'rag', href: '/ai/llm/rag', nameKey: 'rag', descKey: 'lpRag' },
      { id: 'memory', href: '/ai/agents/memory', nameKey: 'memory', descKey: 'lpMemory' },
    ],
  },
  {
    level: 'advanced',
    icon: <GraduationCap className="w-5 h-5" />,
    colorFrom: 'from-red-500',
    colorTo: 'to-rose-500',
    accent: 'text-red-400',
    accentBorder: 'border-red-500/30',
    accentBg: 'bg-red-500/10',
    topics: [
      { id: 'agentic-patterns', href: '/ai/agents/patterns', nameKey: 'agentic-patterns', descKey: 'lpAgenticPatterns' },
      { id: 'orchestration', href: '/ai/agents/orchestration', nameKey: 'orchestration', descKey: 'lpOrchestration' },
      { id: 'moe', href: '/ai/llm/moe', nameKey: 'moe', descKey: 'lpMoe' },
      { id: 'quantization', href: '/ai/llm/quantization', nameKey: 'quantization', descKey: 'lpQuantization' },
      { id: 'agent-security', href: '/ai/agents/security', nameKey: 'agent-security', descKey: 'lpAgentSecurity' },
    ],
  },
]

export function LearningPath() {
  const { t } = useTranslation()
  const lp = t.learningPath
  const [expandedStage, setExpandedStage] = useState<number>(0)

  // Read completed topics from localStorage
  const [completed, setCompleted] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = localStorage.getItem('learning-path-completed')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  const toggleCompleted = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try { localStorage.setItem('learning-path-completed', JSON.stringify(Array.from(next))) } catch {}
      return next
    })
  }

  const levelLabels: Record<string, string> = {
    beginner: lp.beginner,
    intermediate: lp.intermediate,
    advanced: lp.advanced,
  }

  return (
    <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-gradient">{lp.title}</h2>
      </div>
      <p className="text-muted mb-6 ml-[52px]">{lp.subtitle}</p>

      <div className="relative space-y-4">
        {/* Vertical connector line */}
        <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-500/40 via-amber-500/40 to-red-500/40 hidden md:block" />

        {stages.map((stage, idx) => {
          const isExpanded = expandedStage === idx
          const completedCount = stage.topics.filter(t => completed.has(t.id)).length
          const totalCount = stage.topics.length
          const allDone = completedCount === totalCount

          return (
            <div key={stage.level} className="relative">
              {/* Stage header */}
              <button
                onClick={() => setExpandedStage(isExpanded ? -1 : idx)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  isExpanded
                    ? `${stage.accentBg} ${stage.accentBorder}`
                    : 'bg-surface/30 border-border hover:border-border/80'
                }`}
              >
                <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${stage.colorFrom} ${stage.colorTo} flex items-center justify-center shrink-0`}>
                  {allDone ? <CheckCircle2 className="w-5 h-5 text-white" /> : stage.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold font-heading ${stage.accent}`}>
                      {levelLabels[stage.level]}
                    </span>
                    <span className="text-xs text-muted">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                  <p className="text-sm text-muted truncate">{(lp as Record<string, string>)[`${stage.level}Hint`]}</p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted shrink-0" />
                )}
              </button>

              {/* Expanded topic list */}
              {isExpanded && (
                <div className="mt-2 ml-0 md:ml-14 grid gap-2">
                  {stage.topics.map((topic, tIdx) => {
                    const isDone = completed.has(topic.id)
                    return (
                      <Link
                        key={topic.id}
                        href={topic.href}
                        className={`group flex items-start gap-3 p-3 rounded-lg border transition-all hover:bg-surface/50 ${
                          isDone ? 'border-border/50 opacity-75' : `border-border hover:${stage.accentBorder}`
                        }`}
                      >
                        <button
                          onClick={(e) => toggleCompleted(topic.id, e)}
                          className={`mt-0.5 shrink-0 transition-colors ${isDone ? stage.accent : 'text-muted hover:text-text'}`}
                          aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {isDone ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Circle className="w-4.5 h-4.5" />}
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted font-mono">{String(tIdx + 1).padStart(2, '0')}</span>
                            <span className={`text-sm font-semibold ${isDone ? 'line-through text-muted' : 'text-text group-hover:text-primary-light'} transition-colors`}>
                              {(t.topicNames as Record<string, string>)[topic.nameKey] ?? topic.nameKey}
                            </span>
                          </div>
                          <p className="text-xs text-muted mt-0.5 line-clamp-1">
                            {(lp as Record<string, string>)[topic.descKey] ?? ''}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>{lp.progress}</span>
          <span>{completed.size}/{stages.reduce((a, s) => a + s.topics.length, 0)}</span>
        </div>
        <div className="h-2 rounded-full bg-surface/50 border border-border overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-500"
            style={{ width: `${(completed.size / stages.reduce((a, s) => a + s.topics.length, 0)) * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}
