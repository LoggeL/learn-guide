'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Database, FileText, Cpu, ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

// Simulated document store
const DOCUMENTS = [
  { id: 1, title: 'Geography: France', content: 'Paris is the capital of France. It is known for the Eiffel Tower and the Louvre Museum.', relevance: 0 },
  { id: 2, title: 'Geography: Germany', content: 'Berlin is the capital of Germany. It is known for its history and the Brandenburg Gate.', relevance: 0 },
  { id: 3, title: 'Geography: Italy', content: 'Rome is the capital of Italy. It features ancient ruins like the Colosseum.', relevance: 0 },
  { id: 4, title: 'Geography: Spain', content: 'Madrid is the capital of Spain. It is famous for its royal palace and art museums.', relevance: 0 },
  { id: 5, title: 'Science: Physics', content: 'Albert Einstein developed the theory of relativity. E=mc² is his famous equation.', relevance: 0 },
  { id: 6, title: 'Science: Chemistry', content: 'The periodic table organizes chemical elements by atomic number and properties.', relevance: 0 },
  { id: 7, title: 'History: World War II', content: 'World War II lasted from 1939 to 1945. It involved most of the world\'s nations.', relevance: 0 },
  { id: 8, title: 'Technology: AI', content: 'Artificial Intelligence enables machines to learn from data and make decisions.', relevance: 0 },
]

const SAMPLE_QUERIES = [
  'What is the capital of France?',
  'Tell me about Einstein',
  'What is AI?',
  'History of WWII',
]

type Stage = 'idle' | 'embedding' | 'retrieving' | 'augmenting' | 'generating' | 'complete'

function calculateRelevance(query: string, content: string): number {
  const queryWords = query.toLowerCase().split(/\s+/)
  const contentLower = content.toLowerCase()
  let score = 0

  for (const word of queryWords) {
    if (word.length < 3) continue
    if (contentLower.includes(word)) {
      score += 1
    }
  }

  // Boost for title match
  return Math.min(score / queryWords.length, 1)
}

export function RAGPipelineVisualizer() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<Stage>('idle')
  const [documents, setDocuments] = useState(DOCUMENTS)
  const [retrievedDocs, setRetrievedDocs] = useState<typeof DOCUMENTS>([])
  const [response, setResponse] = useState('')

  const runPipeline = async (queryToUse?: string) => {
    const searchQuery = queryToUse || query
    if (!searchQuery.trim()) return

    // Reset state
    setResponse('')
    setRetrievedDocs([])

    // Stage 1: Embedding
    setStage('embedding')
    await new Promise(r => setTimeout(r, 800))

    // Stage 2: Retrieval
    setStage('retrieving')
    await new Promise(r => setTimeout(r, 600))

    // Calculate relevance scores
    const docsWithScores = DOCUMENTS.map(doc => ({
      ...doc,
      relevance: calculateRelevance(searchQuery, doc.title + ' ' + doc.content),
    }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3)
      .filter(d => d.relevance > 0)

    setDocuments(docsWithScores.length > 0 ? docsWithScores : DOCUMENTS.slice(0, 2).map(d => ({ ...d, relevance: 0.3 })))
    setRetrievedDocs(docsWithScores.length > 0 ? docsWithScores : DOCUMENTS.slice(0, 2).map(d => ({ ...d, relevance: 0.3 })))

    await new Promise(r => setTimeout(r, 800))

    // Stage 3: Augmenting
    setStage('augmenting')
    await new Promise(r => setTimeout(r, 600))

    // Stage 4: Generating
    setStage('generating')
    await new Promise(r => setTimeout(r, 1000))

    // Generate response based on retrieved docs
    const topDoc = docsWithScores[0]
    if (topDoc && topDoc.relevance > 0.3) {
      setResponse(`Based on the retrieved documents: ${topDoc.content}`)
    } else {
      setResponse('Based on the available documents, I found some related information but the match wasn\'t perfect. The retrieved context may help answer your question.')
    }

    setStage('complete')
  }

  const reset = () => {
    setStage('idle')
    setQuery('')
    setRetrievedDocs([])
    setResponse('')
    setDocuments(DOCUMENTS)
  }

  const getStageIndex = () => {
    const stages: Stage[] = ['idle', 'embedding', 'retrieving', 'augmenting', 'generating', 'complete']
    return stages.indexOf(stage)
  }

  return (
    <div className="space-y-6">
      {/* Query Input */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
              <Search size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">{t.interactive.enterQuery}</h3>
              <p className="text-xs text-muted">{t.interactive.sampleQuery}</p>
            </div>
          </div>
          {stage === 'complete' && (
            <button
              onClick={reset}
              className="px-4 py-2 bg-surface-elevated hover:bg-surface text-muted hover:text-text rounded-xl transition-colors text-sm"
            >
              Reset
            </button>
          )}
        </div>

        {/* Query buttons */}
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => {
                if (stage === 'idle' || stage === 'complete') {
                  setQuery(q)
                  runPipeline(q)
                }
              }}
              disabled={stage !== 'idle' && stage !== 'complete'}
              className={`px-4 py-2.5 text-sm rounded-xl transition-colors ${
                query === q && stage !== 'idle'
                  ? 'bg-primary/20 text-primary-light border border-primary/30'
                  : 'bg-surface-elevated border border-border hover:border-primary/30 text-muted hover:text-text'
              } disabled:opacity-50`}
            >
              {q}
            </button>
          ))}
        </div>

        {stage !== 'idle' && stage !== 'complete' && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={16} className="text-primary" />
            </motion.div>
            <span>Processing: &quot;{query}&quot;</span>
          </div>
        )}
      </div>

      {/* Pipeline Visualization */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <h3 className="font-semibold text-text font-heading mb-6">RAG Pipeline</h3>

        <div className="flex items-center justify-between gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { key: 'embedding', icon: Cpu, label: 'Embed Query' },
            { key: 'retrieving', icon: Database, label: 'Retrieve' },
            { key: 'augmenting', icon: FileText, label: 'Augment' },
            { key: 'generating', icon: Sparkles, label: 'Generate' },
          ].map((step, i) => {
            const isActive = stage === step.key
            const isComplete = getStageIndex() > ['embedding', 'retrieving', 'augmenting', 'generating'].indexOf(step.key as Stage) + 1
            const Icon = step.icon

            return (
              <div key={step.key} className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    opacity: isActive || isComplete ? 1 : 0.4,
                  }}
                  className={`flex flex-col items-center gap-2 min-w-[80px] ${
                    isActive ? 'text-primary-light' : isComplete ? 'text-emerald-400' : 'text-muted'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-primary/20 border-2 border-primary/50'
                        : isComplete
                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                        : 'bg-surface-elevated border border-border'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </motion.div>
                {i < 3 && (
                  <ArrowRight
                    size={20}
                    className={`shrink-0 transition-colors ${
                      getStageIndex() > i + 1 ? 'text-emerald-400' : 'text-border'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Retrieved Documents */}
        <AnimatePresence mode="wait">
          {(stage === 'retrieving' || stage === 'augmenting' || stage === 'generating' || stage === 'complete') && retrievedDocs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3 mb-6"
            >
              <h4 className="text-sm font-semibold text-text">{t.interactive.retrieved}</h4>
              {retrievedDocs.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-background rounded-xl border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-text text-sm">{doc.title}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      doc.relevance > 0.5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {(doc.relevance * 100).toFixed(0)}% {t.interactive.relevanceScore}
                    </span>
                  </div>
                  <p className="text-xs text-muted line-clamp-2">{doc.content}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated Response */}
        <AnimatePresence>
          {(stage === 'generating' || stage === 'complete') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-primary-light" />
                <span className="font-semibold text-text text-sm">Generated Response</span>
              </div>
              {stage === 'generating' ? (
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-muted text-sm"
                  >
                    {t.interactive.generating}
                  </motion.span>
                </div>
              ) : (
                <p className="text-text text-sm leading-relaxed">{response}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Document Store Preview */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <Database size={18} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">Vector Database</h3>
            <p className="text-xs text-muted">{DOCUMENTS.length} documents indexed</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {DOCUMENTS.slice(0, 8).map((doc) => (
            <div
              key={doc.id}
              className="p-3 bg-background rounded-lg border border-border text-xs"
            >
              <span className="font-medium text-text block truncate">{doc.title}</span>
              <span className="text-muted line-clamp-2">{doc.content.slice(0, 50)}...</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
