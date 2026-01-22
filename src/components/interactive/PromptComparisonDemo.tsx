'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ArrowRight, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface PromptExample {
  id: string
  category: string
  weak: {
    prompt: string
    response: string
    issues: string[]
  }
  strong: {
    prompt: string
    response: string
    improvements: string[]
  }
}

const EXAMPLES: PromptExample[] = [
  {
    id: 'summarize',
    category: 'Summarization',
    weak: {
      prompt: 'Summarize this article',
      response: 'The article talks about various things related to the topic. It mentions some important points and has several sections covering different aspects. The author makes some arguments.',
      issues: ['No context provided', 'Unclear what format is expected', 'No length guidance'],
    },
    strong: {
      prompt: 'Summarize this article about climate change in 3 bullet points, focusing on the key policy recommendations for readers who are environmental policymakers.',
      response: '• Implement carbon pricing mechanisms to incentivize emission reductions\n• Invest in renewable energy infrastructure with 2030 targets\n• Establish international cooperation frameworks for technology sharing',
      improvements: ['Specific topic context', 'Clear format (bullets)', 'Defined audience and focus'],
    },
  },
  {
    id: 'code',
    category: 'Code Generation',
    weak: {
      prompt: 'Write a function to sort',
      response: 'def sort(arr):\n    return sorted(arr)\n\nThis function sorts an array using Python\'s built-in sorted function.',
      issues: ['Missing language specification', 'No algorithm preference', 'No input/output examples'],
    },
    strong: {
      prompt: 'Write a TypeScript function that implements quicksort to sort an array of numbers in ascending order. Include JSDoc comments and handle edge cases like empty arrays.',
      response: '/**\n * Sorts an array using quicksort algorithm\n * @param arr - Array of numbers to sort\n * @returns Sorted array in ascending order\n */\nfunction quickSort(arr: number[]): number[] {\n  if (arr.length <= 1) return arr;\n  \n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter(x => x < pivot);\n  const middle = arr.filter(x => x === pivot);\n  const right = arr.filter(x => x > pivot);\n  \n  return [...quickSort(left), ...middle, ...quickSort(right)];\n}',
      improvements: ['Language specified (TypeScript)', 'Algorithm specified (quicksort)', 'Documentation requested', 'Edge cases mentioned'],
    },
  },
  {
    id: 'explain',
    category: 'Explanation',
    weak: {
      prompt: 'Explain recursion',
      response: 'Recursion is when a function calls itself. It\'s used in programming to solve problems that can be broken down into smaller problems of the same type.',
      issues: ['No target audience level', 'No examples requested', 'No specific aspect to focus on'],
    },
    strong: {
      prompt: 'Explain recursion to a junior developer using a real-world analogy, then show a simple JavaScript example of calculating factorial. Highlight the importance of base cases.',
      response: 'Think of recursion like Russian nesting dolls - each doll contains a smaller version of itself until you reach the smallest doll (the base case).\n\n```javascript\nfunction factorial(n) {\n  // Base case: stop recursion\n  if (n <= 1) return 1;\n  \n  // Recursive case: multiply n by factorial of n-1\n  return n * factorial(n - 1);\n}\n```\n\n⚠️ Without the base case (n <= 1), the function would call itself forever, causing a stack overflow.',
      improvements: ['Target audience specified', 'Analogy requested', 'Concrete example required', 'Key concept (base cases) highlighted'],
    },
  },
]

export function PromptComparisonDemo() {
  const { t } = useTranslation()
  const [selectedExample, setSelectedExample] = useState<string>(EXAMPLES[0].id)
  const [showStrong, setShowStrong] = useState(false)

  const example = EXAMPLES.find((e) => e.id === selectedExample) || EXAMPLES[0]

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <MessageSquare size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">Select Example</h3>
            <p className="text-xs text-muted">Compare weak vs. strong prompts</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => {
                setSelectedExample(ex.id)
                setShowStrong(false)
              }}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedExample === ex.id
                  ? 'bg-primary/20 text-primary-light border border-primary/50'
                  : 'bg-surface-elevated text-muted border border-border hover:border-primary/30'
              }`}
            >
              {ex.category}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weak Prompt */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-surface border border-red-500/30 overflow-hidden"
        >
          <div className="p-4 bg-red-500/10 border-b border-red-500/30 flex items-center gap-2">
            <ThumbsDown size={18} className="text-red-400" />
            <span className="font-semibold text-red-400">{t.interactive.weakPrompt}</span>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs text-muted mb-2 block">Prompt</label>
              <div className="p-3 bg-background rounded-lg border border-border text-text text-sm">
                {example.weak.prompt}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted mb-2 block">Response</label>
              <div className="p-3 bg-background rounded-lg border border-border text-muted text-sm whitespace-pre-wrap">
                {example.weak.response}
              </div>
            </div>
            <div>
              <label className="text-xs text-red-400 mb-2 block">Issues</label>
              <ul className="space-y-1">
                {example.weak.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <span className="text-red-400">✗</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Strong Prompt */}
        <AnimatePresence mode="wait">
          {showStrong ? (
            <motion.div
              key="strong"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-2xl bg-surface border border-emerald-500/30 overflow-hidden"
            >
              <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/30 flex items-center gap-2">
                <ThumbsUp size={18} className="text-emerald-400" />
                <span className="font-semibold text-emerald-400">{t.interactive.strongPrompt}</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs text-muted mb-2 block">Prompt</label>
                  <div className="p-3 bg-background rounded-lg border border-border text-text text-sm">
                    {example.strong.prompt}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted mb-2 block">Response</label>
                  <div className="p-3 bg-background rounded-lg border border-border text-muted text-sm whitespace-pre-wrap font-mono">
                    {example.strong.response}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-emerald-400 mb-2 block">{t.interactive.improvements}</label>
                  <ul className="space-y-1">
                    {example.strong.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted">
                        <span className="text-emerald-400">✓</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-surface border border-dashed border-border flex flex-col items-center justify-center p-8"
            >
              <Sparkles size={40} className="text-muted mb-4" />
              <p className="text-muted text-center mb-4">Click to see the improved version</p>
              <button
                onClick={() => setShowStrong(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-xl transition-colors"
              >
                <span>Show Strong Prompt</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quality Score */}
      {showStrong && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-primary-light" />
              <span className="font-semibold text-text">Key Differences</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-red-400">Weak:</span>
                <span className="font-mono text-red-400">~{example.weak.prompt.length} chars</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">Strong:</span>
                <span className="font-mono text-emerald-400">~{example.strong.prompt.length} chars</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted mt-2">
            The strong prompt is {Math.round(example.strong.prompt.length / example.weak.prompt.length)}x longer but provides clarity that saves time and produces better results.
          </p>
        </motion.div>
      )}
    </div>
  )
}
