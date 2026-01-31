'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileSearch,
  Brain,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database,
  Sparkles,
  ChevronDown,
  MessageSquare,
  ArrowRight,
  Search,
  FileText,
  Zap
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type CaseId = 'traditional-wins' | 'agentic-wins' | 'both-fail'

interface ThoughtStep {
  type: 'thought' | 'search' | 'retrieve' | 'generate'
  content: string
}

interface CaseData {
  id: CaseId
  traditional: {
    steps: ThoughtStep[]
    retrieved: string[]
    response: string
    outcome: 'success' | 'partial' | 'failure'
  }
  agentic: {
    steps: ThoughtStep[]
    retrieved: string[]
    response: string
    outcome: 'success' | 'partial' | 'failure'
  }
}

export function RAGCaseStudyVisualizer() {
  const { t } = useTranslation()
  const [selectedCase, setSelectedCase] = useState<CaseId>('traditional-wins')
  const [showDropdown, setShowDropdown] = useState(false)
  const [expandedSection, setExpandedSection] = useState<'traditional' | 'agentic' | null>('traditional')

  const cases: CaseData[] = [
    {
      id: 'traditional-wins',
      traditional: {
        steps: [
          { type: 'search', content: t.rag.case1TradSearch },
          { type: 'retrieve', content: t.rag.case1TradRetrieve },
          { type: 'generate', content: t.rag.case1TradGenerate },
        ],
        retrieved: [
          t.rag.case1TradDoc1,
        ],
        response: t.rag.case1TradResponse,
        outcome: 'success',
      },
      agentic: {
        steps: [
          { type: 'thought', content: t.rag.case1AgentThought1 },
          { type: 'search', content: t.rag.case1AgentSearch },
          { type: 'retrieve', content: t.rag.case1AgentRetrieve },
          { type: 'thought', content: t.rag.case1AgentThought2 },
          { type: 'generate', content: t.rag.case1AgentGenerate },
        ],
        retrieved: [
          t.rag.case1TradDoc1,
        ],
        response: t.rag.case1AgentResponse,
        outcome: 'success',
      },
    },
    {
      id: 'agentic-wins',
      traditional: {
        steps: [
          { type: 'search', content: t.rag.case2TradSearch },
          { type: 'retrieve', content: t.rag.case2TradRetrieve },
          { type: 'generate', content: t.rag.case2TradGenerate },
        ],
        retrieved: [
          t.rag.case2TradDoc1,
        ],
        response: t.rag.case2TradResponse,
        outcome: 'partial',
      },
      agentic: {
        steps: [
          { type: 'thought', content: t.rag.case2AgentThought1 },
          { type: 'search', content: t.rag.case2AgentSearch1 },
          { type: 'retrieve', content: t.rag.case2AgentRetrieve1 },
          { type: 'thought', content: t.rag.case2AgentThought2 },
          { type: 'search', content: t.rag.case2AgentSearch2 },
          { type: 'retrieve', content: t.rag.case2AgentRetrieve2 },
          { type: 'thought', content: t.rag.case2AgentThought3 },
          { type: 'generate', content: t.rag.case2AgentGenerate },
        ],
        retrieved: [
          t.rag.case2AgentDoc1,
          t.rag.case2AgentDoc2,
        ],
        response: t.rag.case2AgentResponse,
        outcome: 'success',
      },
    },
    {
      id: 'both-fail',
      traditional: {
        steps: [
          { type: 'search', content: t.rag.case3TradSearch },
          { type: 'retrieve', content: t.rag.case3TradRetrieve },
          { type: 'generate', content: t.rag.case3TradGenerate },
        ],
        retrieved: [
          t.rag.case3TradDoc1,
        ],
        response: t.rag.case3TradResponse,
        outcome: 'failure',
      },
      agentic: {
        steps: [
          { type: 'thought', content: t.rag.case3AgentThought1 },
          { type: 'search', content: t.rag.case3AgentSearch1 },
          { type: 'retrieve', content: t.rag.case3AgentRetrieve1 },
          { type: 'thought', content: t.rag.case3AgentThought2 },
          { type: 'search', content: t.rag.case3AgentSearch2 },
          { type: 'retrieve', content: t.rag.case3AgentRetrieve2 },
          { type: 'thought', content: t.rag.case3AgentThought3 },
          { type: 'generate', content: t.rag.case3AgentGenerate },
        ],
        retrieved: [],
        response: t.rag.case3AgentResponse,
        outcome: 'failure',
      },
    },
  ]

  const currentCase = cases.find(c => c.id === selectedCase)!

  const getCaseLabel = (id: CaseId) => {
    const labels: Record<CaseId, string> = {
      'traditional-wins': t.rag.caseTraditionalWins,
      'agentic-wins': t.rag.caseAgenticWins,
      'both-fail': t.rag.caseBothFail,
    }
    return labels[id]
  }

  const getCaseQuery = (id: CaseId) => {
    const queries: Record<CaseId, string> = {
      'traditional-wins': t.rag.caseQuery1,
      'agentic-wins': t.rag.caseQuery2,
      'both-fail': t.rag.caseQuery3,
    }
    return queries[id]
  }

  const getOutcomeStyles = (outcome: 'success' | 'partial' | 'failure') => {
    switch (outcome) {
      case 'success':
        return {
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/50',
          text: 'text-emerald-400',
          icon: CheckCircle2,
          label: t.rag.outcomeSuccess
        }
      case 'partial':
        return {
          bg: 'bg-amber-500/20',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
          icon: AlertTriangle,
          label: t.rag.outcomePartial
        }
      case 'failure':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500/50',
          text: 'text-red-400',
          icon: XCircle,
          label: t.rag.outcomeFailure
        }
    }
  }

  const getStepIcon = (type: ThoughtStep['type']) => {
    switch (type) {
      case 'thought': return Brain
      case 'search': return Search
      case 'retrieve': return Database
      case 'generate': return Sparkles
    }
  }

  const getStepColor = (type: ThoughtStep['type']) => {
    switch (type) {
      case 'thought': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'search': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'retrieve': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
      case 'generate': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
    }
  }

  const getStepLabel = (type: ThoughtStep['type']) => {
    switch (type) {
      case 'thought': return t.rag.stepThinking
      case 'search': return t.rag.stepSearching
      case 'retrieve': return t.rag.stepRetrieved
      case 'generate': return t.rag.stepGenerating
    }
  }

  const renderApproach = (
    title: string,
    data: CaseData['traditional'] | CaseData['agentic'],
    isAgentic: boolean,
    isExpanded: boolean,
    onToggle: () => void
  ) => {
    const outcome = getOutcomeStyles(data.outcome)
    const OutcomeIcon = outcome.icon

    return (
      <div className={`rounded-xl border overflow-hidden transition-all ${
        isAgentic
          ? 'bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20'
          : 'bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20'
      }`}>
        {/* Header */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isAgentic ? 'bg-purple-500/20' : 'bg-blue-500/20'
            }`}>
              {isAgentic ? (
                <Zap size={16} className="text-purple-400" />
              ) : (
                <ArrowRight size={16} className="text-blue-400" />
              )}
            </div>
            <span className="font-bold font-heading text-text">{title}</span>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${outcome.bg} ${outcome.border} border`}>
              <OutcomeIcon size={14} className={outcome.text} />
              <span className={`text-xs font-medium ${outcome.text}`}>{outcome.label}</span>
            </div>
          </div>
          <ChevronDown size={18} className={`text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4">
                {/* Thought Chain */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted uppercase tracking-wide">{t.rag.processSteps}</h4>
                  <div className="space-y-2">
                    {data.steps.map((step, i) => {
                      const Icon = getStepIcon(step.type)
                      const colorClass = getStepColor(step.type)
                      return (
                        <div key={i} className="flex gap-3">
                          <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 border ${colorClass}`}>
                            <Icon size={12} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs font-medium ${colorClass.split(' ')[0]}`}>
                              {getStepLabel(step.type)}
                            </span>
                            <p className="text-sm text-muted mt-0.5">{step.content}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Retrieved Documents */}
                {data.retrieved.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted uppercase tracking-wide">{t.rag.retrievedDocs}</h4>
                    <div className="space-y-2">
                      {data.retrieved.map((doc, i) => (
                        <div key={i} className="flex gap-2 p-3 bg-surface rounded-lg border border-border">
                          <FileText size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-muted font-mono leading-relaxed">{doc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.retrieved.length === 0 && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-xs text-red-400">{t.rag.noRelevantDocs}</p>
                  </div>
                )}

                {/* Final Response */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted uppercase tracking-wide">{t.rag.finalResponse}</h4>
                  <div className={`p-3 rounded-lg border ${outcome.bg} ${outcome.border}`}>
                    <div className="flex gap-2">
                      <MessageSquare size={14} className={`${outcome.text} shrink-0 mt-0.5`} />
                      <p className={`text-sm ${data.outcome === 'success' ? 'text-text' : outcome.text}`}>
                        {data.response}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Case Selector */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-surface border border-border rounded-xl hover:border-primary/50 transition-colors"
        >
          <span className="text-text font-medium">{getCaseLabel(selectedCase)}</span>
          <ChevronDown size={18} className={`text-muted transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-border rounded-xl overflow-hidden z-10 shadow-lg"
            >
              {cases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCase(c.id); setShowDropdown(false); setExpandedSection('traditional'); }}
                  className={`w-full px-4 py-3 text-left hover:bg-surface transition-colors ${
                    selectedCase === c.id ? 'bg-primary/10 text-primary-light' : 'text-text'
                  }`}
                >
                  {getCaseLabel(c.id)}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Query Display */}
      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
            <FileSearch size={16} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-blue-400 font-medium mb-1">{t.rag.caseUserQuery}</p>
            <p className="text-text font-medium">&quot;{getCaseQuery(selectedCase)}&quot;</p>
          </div>
        </div>
      </div>

      {/* Approach Comparisons */}
      <div className="space-y-3">
        {renderApproach(
          t.rag.traditionalRag,
          currentCase.traditional,
          false,
          expandedSection === 'traditional',
          () => setExpandedSection(expandedSection === 'traditional' ? null : 'traditional')
        )}
        {renderApproach(
          t.rag.agenticRag,
          currentCase.agentic,
          true,
          expandedSection === 'agentic',
          () => setExpandedSection(expandedSection === 'agentic' ? null : 'agentic')
        )}
      </div>

      {/* Explanation */}
      <div className="p-4 bg-gradient-to-br from-slate-500/10 to-gray-500/10 border border-slate-500/20 rounded-xl">
        <h4 className="font-bold font-heading text-text mb-2">{t.rag.caseWhy}</h4>
        <p className="text-sm text-muted leading-relaxed">
          {selectedCase === 'traditional-wins' && t.rag.caseExplanation1}
          {selectedCase === 'agentic-wins' && t.rag.caseExplanation2}
          {selectedCase === 'both-fail' && t.rag.caseExplanation3}
        </p>
      </div>
    </div>
  )
}
