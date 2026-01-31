'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown, RotateCcw, Database, Cpu, FileText, Sparkles, Brain, Wrench, CheckCircle, XCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type Mode = 'traditional' | 'agentic'

const traditionalSteps = [
  { id: 'query', icon: FileText, color: 'blue' },
  { id: 'embed', icon: Cpu, color: 'purple' },
  { id: 'retrieve', icon: Database, color: 'emerald' },
  { id: 'generate', icon: Sparkles, color: 'orange' },
]

const agenticSteps = [
  { id: 'query', icon: FileText, color: 'blue' },
  { id: 'think', icon: Brain, color: 'purple' },
  { id: 'tool', icon: Wrench, color: 'emerald' },
  { id: 'evaluate', icon: CheckCircle, color: 'amber' },
  { id: 'generate', icon: Sparkles, color: 'orange' },
]

export function RAGComparisonVisualizer() {
  const { t } = useTranslation()
  const [activeMode, setActiveMode] = useState<Mode>('traditional')
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [iteration, setIteration] = useState(0)

  const runAnimation = async (mode: Mode) => {
    setIsAnimating(true)
    setCurrentStep(0)
    setIteration(0)

    const steps = mode === 'traditional' ? traditionalSteps : agenticSteps

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i)
      await new Promise(r => setTimeout(r, 600))

      // For agentic mode, simulate a loop back from evaluate to think
      if (mode === 'agentic' && steps[i].id === 'evaluate' && iteration === 0) {
        setIteration(1)
        // Loop back to think
        for (let j = 1; j <= 3; j++) {
          setCurrentStep(j)
          await new Promise(r => setTimeout(r, 500))
        }
      }
    }

    setIsAnimating(false)
  }

  const getStepLabel = (id: string) => {
    const labels: Record<string, string> = {
      query: t.rag.compQuery,
      embed: t.rag.compEmbed,
      retrieve: t.rag.compRetrieve,
      generate: t.rag.compGenerate,
      think: t.rag.compThink,
      tool: t.rag.compTool,
      evaluate: t.rag.compEvaluate,
    }
    return labels[id] || id
  }

  const getColorClasses = (color: string, isActive: boolean, isComplete: boolean) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
      emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
      orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
      amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400' },
    }

    if (isActive) {
      return `${colors[color].bg} ${colors[color].border} border-2 ${colors[color].text} scale-110`
    }
    if (isComplete) {
      return `${colors[color].bg} border ${colors[color].border} ${colors[color].text}`
    }
    return 'bg-surface-elevated border border-border text-muted'
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-surface border border-border p-1">
          <button
            onClick={() => { setActiveMode('traditional'); setCurrentStep(-1); setIsAnimating(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeMode === 'traditional'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-muted hover:text-text'
            }`}
          >
            {t.rag.traditionalRag}
          </button>
          <button
            onClick={() => { setActiveMode('agentic'); setCurrentStep(-1); setIsAnimating(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeMode === 'agentic'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-muted hover:text-text'
            }`}
          >
            {t.rag.agenticRag}
          </button>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Traditional RAG */}
        <div className={`rounded-2xl border p-6 transition-all ${
          activeMode === 'traditional'
            ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30'
            : 'bg-surface/50 border-border opacity-60'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ArrowRight size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-text">{t.rag.traditionalRag}</h3>
              <p className="text-xs text-muted">{t.rag.traditionalTagline}</p>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="flex items-center justify-between gap-2 mb-6">
            {traditionalSteps.map((step, i) => {
              const Icon = step.icon
              const isActive = activeMode === 'traditional' && currentStep === i
              const isComplete = activeMode === 'traditional' && currentStep > i

              return (
                <div key={step.id} className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      getColorClasses(step.color, isActive, isComplete)
                    }`}
                  >
                    <Icon size={20} />
                  </motion.div>
                  {i < traditionalSteps.length - 1 && (
                    <ArrowRight size={16} className={isComplete ? 'text-emerald-400' : 'text-border'} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Characteristics */}
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2 items-start text-muted">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{t.rag.traditionalChar1}</span>
            </li>
            <li className="flex gap-2 items-start text-muted">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{t.rag.traditionalChar2}</span>
            </li>
            <li className="flex gap-2 items-start text-muted">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{t.rag.traditionalChar3}</span>
            </li>
          </ul>
        </div>

        {/* Agentic RAG */}
        <div className={`rounded-2xl border p-6 transition-all ${
          activeMode === 'agentic'
            ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30'
            : 'bg-surface/50 border-border opacity-60'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <RotateCcw size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-text">{t.rag.agenticRag}</h3>
              <p className="text-xs text-muted">{t.rag.agenticTagline}</p>
            </div>
          </div>

          {/* Flow Diagram with Loop */}
          <div className="relative mb-6">
            <div className="flex items-center justify-between gap-1">
              {agenticSteps.map((step, i) => {
                const Icon = step.icon
                const isActive = activeMode === 'agentic' && currentStep === i
                const isComplete = activeMode === 'agentic' && currentStep > i

                return (
                  <div key={step.id} className="flex items-center gap-1">
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        getColorClasses(step.color, isActive, isComplete)
                      }`}
                    >
                      <Icon size={16} />
                    </motion.div>
                    {i < agenticSteps.length - 1 && (
                      <ArrowRight size={14} className={isComplete ? 'text-emerald-400' : 'text-border'} />
                    )}
                  </div>
                )
              })}
            </div>
            {/* Loop arrow */}
            <div className="absolute -bottom-4 left-[25%] right-[35%] flex justify-center">
              <svg className="w-full h-6" viewBox="0 0 100 24">
                <path
                  d="M 85 4 C 85 18, 15 18, 15 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={iteration > 0 ? 'text-amber-400' : 'text-border'}
                  strokeDasharray="4 2"
                />
                <polygon
                  points="12,4 18,4 15,0"
                  fill="currentColor"
                  className={iteration > 0 ? 'text-amber-400' : 'text-border'}
                />
              </svg>
            </div>
          </div>

          {/* Characteristics */}
          <ul className="space-y-2 text-sm mt-6">
            <li className="flex gap-2 items-start text-muted">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{t.rag.agenticChar1}</span>
            </li>
            <li className="flex gap-2 items-start text-muted">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{t.rag.agenticChar2}</span>
            </li>
            <li className="flex gap-2 items-start text-muted">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{t.rag.agenticChar3}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Animate Button */}
      <div className="flex justify-center">
        <button
          onClick={() => runAnimation(activeMode)}
          disabled={isAnimating}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isAnimating ? t.rag.compAnimating : t.rag.compAnimate}
        </button>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated">
              <th className="text-left p-4 font-semibold text-text">{t.rag.compAspect}</th>
              <th className="text-left p-4 font-semibold text-blue-400">{t.rag.traditionalRag}</th>
              <th className="text-left p-4 font-semibold text-purple-400">{t.rag.agenticRag}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 text-muted">{t.rag.compRowControl}</td>
              <td className="p-4 text-text">{t.rag.compControlTraditional}</td>
              <td className="p-4 text-text">{t.rag.compControlAgentic}</td>
            </tr>
            <tr>
              <td className="p-4 text-muted">{t.rag.compRowRetrieval}</td>
              <td className="p-4 text-text">{t.rag.compRetrievalTraditional}</td>
              <td className="p-4 text-text">{t.rag.compRetrievalAgentic}</td>
            </tr>
            <tr>
              <td className="p-4 text-muted">{t.rag.compRowQuery}</td>
              <td className="p-4 text-text">{t.rag.compQueryTraditional}</td>
              <td className="p-4 text-text">{t.rag.compQueryAgentic}</td>
            </tr>
            <tr>
              <td className="p-4 text-muted">{t.rag.compRowLatency}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">{t.rag.compLatencyTraditional}</span>
              </td>
              <td className="p-4">
                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">{t.rag.compLatencyAgentic}</span>
              </td>
            </tr>
            <tr>
              <td className="p-4 text-muted">{t.rag.compRowBestFor}</td>
              <td className="p-4 text-text">{t.rag.compBestForTraditional}</td>
              <td className="p-4 text-text">{t.rag.compBestForAgentic}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
