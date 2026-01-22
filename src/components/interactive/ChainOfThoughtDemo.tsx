'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Zap, ChevronRight, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface Problem {
  id: string
  question: string
  directAnswer: {
    response: string
    correct: boolean
  }
  cotAnswer: {
    steps: string[]
    response: string
    correct: boolean
  }
}

const PROBLEMS: Problem[] = [
  {
    id: 'math',
    question: 'If a store has 847 apples and sells 3/7 of them, then receives a shipment of 156 more apples, how many apples does the store have?',
    directAnswer: {
      response: 'The store has 639 apples.',
      correct: false,
    },
    cotAnswer: {
      steps: [
        'First, let me find how many apples were sold: 847 × (3/7) = 363 apples',
        'Apples remaining after sale: 847 - 363 = 484 apples',
        'After receiving the shipment: 484 + 156 = 640 apples',
      ],
      response: 'The store has 640 apples.',
      correct: true,
    },
  },
  {
    id: 'logic',
    question: 'Alice is taller than Bob. Bob is taller than Charlie. Charlie is taller than Diana. Is Alice taller than Diana?',
    directAnswer: {
      response: 'Yes, Alice is taller than Diana.',
      correct: true,
    },
    cotAnswer: {
      steps: [
        'Let me trace the height relationships step by step.',
        'Alice > Bob (Alice is taller than Bob)',
        'Bob > Charlie (Bob is taller than Charlie)',
        'Charlie > Diana (Charlie is taller than Diana)',
        'By transitivity: Alice > Bob > Charlie > Diana',
      ],
      response: 'Yes, Alice is taller than Diana because the transitive property shows: Alice > Bob > Charlie > Diana.',
      correct: true,
    },
  },
  {
    id: 'word',
    question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    directAnswer: {
      response: 'The ball costs $0.10.',
      correct: false,
    },
    cotAnswer: {
      steps: [
        'Let me set up equations. Let the ball cost x dollars.',
        'The bat costs x + $1.00 (since it costs $1 more than the ball)',
        'Total: x + (x + $1.00) = $1.10',
        '2x + $1.00 = $1.10',
        '2x = $0.10',
        'x = $0.05',
      ],
      response: 'The ball costs $0.05 (5 cents). The bat costs $1.05, which is $1 more than the ball, and together they total $1.10.',
      correct: true,
    },
  },
]

export function ChainOfThoughtDemo() {
  const { t } = useTranslation()
  const [selectedProblem, setSelectedProblem] = useState<string>(PROBLEMS[0].id)
  const [showSteps, setShowSteps] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const problem = PROBLEMS.find((p) => p.id === selectedProblem) || PROBLEMS[0]

  useEffect(() => {
    if (showSteps && isAnimating && currentStep < problem.cotAnswer.steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (currentStep >= problem.cotAnswer.steps.length) {
      setIsAnimating(false)
    }
  }, [showSteps, isAnimating, currentStep, problem.cotAnswer.steps.length])

  const startAnimation = () => {
    setShowSteps(true)
    setCurrentStep(0)
    setIsAnimating(true)
  }

  const reset = () => {
    setShowSteps(false)
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const changeProblem = (id: string) => {
    setSelectedProblem(id)
    reset()
  }

  return (
    <div className="space-y-6">
      {/* Problem Selection */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Brain size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">Select Problem</h3>
            <p className="text-xs text-muted">See how chain-of-thought improves reasoning</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'math', label: 'Math Problem' },
            { id: 'logic', label: 'Logic Puzzle' },
            { id: 'word', label: 'Word Problem' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => changeProblem(p.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedProblem === p.id
                  ? 'bg-primary/20 text-primary-light border border-primary/50'
                  : 'bg-surface-elevated text-muted border border-border hover:border-primary/30'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <label className="text-sm font-semibold text-text mb-3 block">Question</label>
        <p className="text-muted leading-relaxed">{problem.question}</p>
      </div>

      {/* Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Direct Answer */}
        <div className="rounded-2xl bg-surface border border-border overflow-hidden">
          <div className="p-4 bg-surface-elevated border-b border-border flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            <span className="font-semibold text-text">{t.interactive.withoutCot}</span>
          </div>
          <div className="p-6">
            <div className={`p-4 rounded-xl border ${
              problem.directAnswer.correct
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <p className="text-text text-sm">{problem.directAnswer.response}</p>
              <div className="mt-2 flex items-center gap-2">
                {problem.directAnswer.correct ? (
                  <span className="text-xs text-emerald-400">✓ Correct</span>
                ) : (
                  <span className="text-xs text-red-400">✗ Incorrect</span>
                )}
              </div>
            </div>
            <p className="text-xs text-muted mt-4">
              Without reasoning steps, the model may jump to an intuitive but wrong answer.
            </p>
          </div>
        </div>

        {/* Chain of Thought */}
        <div className="rounded-2xl bg-surface border border-border overflow-hidden">
          <div className="p-4 bg-surface-elevated border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-purple-400" />
              <span className="font-semibold text-text">{t.interactive.withCot}</span>
            </div>
            {!showSteps ? (
              <button
                onClick={startAnimation}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-lg text-sm transition-colors"
              >
                {t.interactive.showSteps}
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={reset}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-sm text-muted hover:text-text transition-colors"
              >
                <RefreshCw size={14} />
                Reset
              </button>
            )}
          </div>
          <div className="p-6">
            {/* Reasoning Steps */}
            <AnimatePresence mode="popLayout">
              {showSteps && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 mb-4"
                >
                  <label className="text-xs text-purple-400">{t.interactive.reasoningSteps}</label>
                  {problem.cotAnswer.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: i < currentStep ? 1 : 0.3, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-3 rounded-lg border text-sm ${
                        i < currentStep
                          ? 'bg-purple-500/10 border-purple-500/30 text-text'
                          : 'bg-surface-elevated border-border text-muted'
                      }`}
                    >
                      <span className="text-purple-400 mr-2">Step {i + 1}:</span>
                      {step}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Final Answer */}
            <AnimatePresence>
              {showSteps && currentStep >= problem.cotAnswer.steps.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border ${
                    problem.cotAnswer.correct
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <label className="text-xs text-emerald-400 mb-2 block">{t.interactive.finalAnswer}</label>
                  <p className="text-text text-sm">{problem.cotAnswer.response}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {problem.cotAnswer.correct ? (
                      <span className="text-xs text-emerald-400">✓ Correct</span>
                    ) : (
                      <span className="text-xs text-red-400">✗ Incorrect</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showSteps && (
              <p className="text-xs text-muted">
                Click &quot;Show Steps&quot; to see how chain-of-thought reasoning leads to the correct answer.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <Brain size={18} className="text-primary-light shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p>Chain-of-thought prompting asks the model to &quot;think step by step.&quot; This explicit reasoning process helps catch errors that intuitive jumping would miss, especially in math, logic, and multi-step problems.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
