'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type PatternId = 'react' | 'reflection' | 'plan-execute' | 'multi-agent' | 'router'

interface PatternStep {
  id: string
  label: string
  description: string
  color: string
}

interface Pattern {
  id: PatternId
  name: string
  tagline: string
  color: string
  steps: PatternStep[]
  pseudocode: string
}

const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', glow: 'shadow-red-500/20' },
}

export function AgenticPatternsVisualizer() {
  const { t } = useTranslation()
  const [activePattern, setActivePattern] = useState<PatternId>('react')
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const patterns: Pattern[] = [
    {
      id: 'react',
      name: t.interactive.react,
      tagline: 'Reasoning + Acting',
      color: 'emerald',
      steps: [
        { id: 'observe', label: t.agentLoop.observe, description: 'Receive input or tool result', color: 'cyan' },
        { id: 'think', label: t.agentLoop.think, description: 'Reason about current state', color: 'purple' },
        { id: 'act', label: t.agentLoop.act, description: 'Choose and execute action', color: 'emerald' },
        { id: 'loop', label: 'Loop', description: 'Repeat until task complete', color: 'orange' },
      ],
      pseudocode: `while not done:
  observation = get_current_state()
  thought = llm.reason(observation)
  action = llm.decide_action(thought)
  result = execute(action)
  if is_final_answer(result):
    return result`,
    },
    {
      id: 'reflection',
      name: t.interactive.reflection,
      tagline: 'Self-Critique Loop',
      color: 'purple',
      steps: [
        { id: 'generate', label: 'Generate', description: 'Produce initial output', color: 'cyan' },
        { id: 'critique', label: 'Critique', description: 'Analyze output for issues', color: 'red' },
        { id: 'refine', label: 'Refine', description: 'Improve based on feedback', color: 'purple' },
        { id: 'check', label: 'Check', description: 'Verify quality threshold met', color: 'emerald' },
      ],
      pseudocode: `output = llm.generate(task)

for i in range(max_iterations):
  critique = llm.analyze(output)
  if critique.is_satisfactory:
    return output
  output = llm.refine(output, critique)

return output`,
    },
    {
      id: 'plan-execute',
      name: t.interactive.planExecute,
      tagline: 'Think First, Act Later',
      color: 'cyan',
      steps: [
        { id: 'analyze', label: 'Analyze', description: 'Understand the full task', color: 'purple' },
        { id: 'plan', label: 'Plan', description: 'Create step-by-step plan', color: 'cyan' },
        { id: 'execute', label: 'Execute', description: 'Run each step in order', color: 'emerald' },
        { id: 'adapt', label: 'Adapt', description: 'Replan if needed', color: 'orange' },
      ],
      pseudocode: `plan = llm.create_plan(task)

for step in plan.steps:
  result = execute(step)
  if result.requires_replan:
    plan = llm.revise_plan(plan, result)
  if result.is_complete:
    return result.output

return synthesize(results)`,
    },
    {
      id: 'multi-agent',
      name: t.interactive.multiAgent,
      tagline: 'Specialized Collaboration',
      color: 'orange',
      steps: [
        { id: 'decompose', label: 'Decompose', description: 'Split task into subtasks', color: 'purple' },
        { id: 'delegate', label: 'Delegate', description: 'Assign to specialist agents', color: 'cyan' },
        { id: 'collaborate', label: 'Collaborate', description: 'Agents work and communicate', color: 'orange' },
        { id: 'synthesize', label: 'Synthesize', description: 'Combine all results', color: 'emerald' },
      ],
      pseudocode: `subtasks = orchestrator.decompose(task)

results = []
for subtask in subtasks:
  agent = select_specialist(subtask)
  result = agent.execute(subtask)
  results.append(result)

return orchestrator.synthesize(results)`,
    },
  ]

  const pattern = patterns.find((p) => p.id === activePattern)!
  const colors = colorClasses[pattern.color]

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % pattern.steps.length)
  }

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + pattern.steps.length) % pattern.steps.length)
  }

  const reset = () => {
    setActiveStep(0)
    setIsPlaying(false)
  }

  // Auto-advance when playing
  useState(() => {
    if (!isPlaying) return
    const interval = setInterval(nextStep, 1500)
    return () => clearInterval(interval)
  })

  return (
    <div className="rounded-2xl bg-background border border-border overflow-hidden">
      {/* Pattern Tabs */}
      <div className="flex flex-wrap border-b border-border bg-surface/50">
        {patterns.map((p) => {
          const c = colorClasses[p.color]
          const isActive = p.id === activePattern
          return (
            <button
              key={p.id}
              onClick={() => {
                setActivePattern(p.id)
                setActiveStep(0)
                setIsPlaying(false)
              }}
              className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive ? c.text : 'text-muted hover:text-text'
              }`}
            >
              {p.name}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${c.bg.replace('/20', '')}`}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="p-6 space-y-6">
        {/* Pattern Header */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
            <span className={`text-xl font-bold ${colors.text}`}>{pattern.name[0]}</span>
          </div>
          <div>
            <h3 className={`text-xl font-bold font-heading ${colors.text}`}>{pattern.name}</h3>
            <p className="text-sm text-muted">{pattern.tagline}</p>
          </div>
        </div>

        {/* Flow Visualization */}
        <div className="relative">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {pattern.steps.map((step, index) => {
              const stepColors = colorClasses[step.color]
              const isActive = index === activeStep
              const isPast = index < activeStep

              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <motion.div
                    className={`relative flex-1 p-3 md:p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? `${stepColors.bg} ${stepColors.border} shadow-lg ${stepColors.glow}`
                        : isPast
                          ? `${stepColors.bg} ${stepColors.border} opacity-60`
                          : 'bg-surface border-border opacity-40'
                    }`}
                    onClick={() => setActiveStep(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div
                        className={`text-xs font-mono mb-1 ${isActive ? stepColors.text : 'text-muted'}`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className={`font-semibold text-sm ${isActive ? 'text-text' : 'text-muted'}`}>
                        {step.label}
                      </div>
                    </div>

                    {/* Active indicator pulse */}
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 rounded-xl ${stepColors.border} border`}
                        animate={{ opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Arrow connector */}
                  {index < pattern.steps.length - 1 && (
                    <div className="w-4 md:w-8 flex items-center justify-center text-muted shrink-0">
                      <motion.span
                        animate={isActive ? { x: [0, 4, 0] } : {}}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Step Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 rounded-xl bg-surface border border-border"
            >
              <p className="text-muted text-sm">
                <span className={`font-semibold ${colorClasses[pattern.steps[activeStep].color].text}`}>
                  {pattern.steps[activeStep].label}:
                </span>{' '}
                {pattern.steps[activeStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={prevStep}
            className="p-2 rounded-lg bg-surface border border-border text-muted hover:text-text transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-3 rounded-xl ${colors.bg} ${colors.border} border ${colors.text} transition-all hover:scale-105`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={reset}
            className="p-2 rounded-lg bg-surface border border-border text-muted hover:text-text transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={nextStep}
            className="p-2 rounded-lg bg-surface border border-border text-muted hover:text-text transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Pseudocode */}
        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-surface-elevated">
            <span className="text-xs font-mono text-muted">pseudocode</span>
          </div>
          <pre className="p-4 text-sm font-mono text-muted overflow-x-auto">
            <code>{pattern.pseudocode}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
