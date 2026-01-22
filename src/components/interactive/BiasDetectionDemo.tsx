'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, AlertTriangle, CheckCircle, Scale, Lightbulb } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface AnalysisResult {
  score: number
  indicators: {
    type: string
    severity: 'low' | 'medium' | 'high'
    description: string
  }[]
  recommendations: string[]
}

const EXAMPLE_PROMPTS = [
  {
    text: 'Write a job description for a software engineer',
    label: 'Neutral prompt',
  },
  {
    text: 'Write a job description for a young, energetic developer',
    label: 'Age bias',
  },
  {
    text: 'The nurse entered the room. She checked the patient.',
    label: 'Gender assumption',
  },
  {
    text: 'Describe a typical scientist',
    label: 'Stereotype risk',
  },
]

function analyzeForBias(text: string): AnalysisResult {
  const indicators: AnalysisResult['indicators'] = []
  const recommendations: string[] = []
  let score = 85

  const lowerText = text.toLowerCase()

  // Age-related terms
  if (lowerText.includes('young') || lowerText.includes('energetic') || lowerText.includes('digital native')) {
    indicators.push({
      type: 'Age Bias',
      severity: 'high',
      description: 'Terms like "young" or "energetic" may exclude qualified older candidates.',
    })
    recommendations.push('Replace age-coded language with skill-based requirements.')
    score -= 25
  }

  // Gender assumptions
  if (lowerText.includes(' she ') || lowerText.includes(' he ') || lowerText.includes(' his ') || lowerText.includes(' her ')) {
    indicators.push({
      type: 'Gender Assumption',
      severity: 'medium',
      description: 'Using gendered pronouns assumes a particular gender for a role.',
    })
    recommendations.push('Use gender-neutral language (they/them) or avoid pronouns.')
    score -= 15
  }

  // Stereotype-prone words
  if (lowerText.includes('typical') || lowerText.includes('normal') || lowerText.includes('average')) {
    indicators.push({
      type: 'Stereotype Risk',
      severity: 'medium',
      description: 'Words like "typical" may elicit stereotypical associations.',
    })
    recommendations.push('Be specific about traits rather than asking for "typical" examples.')
    score -= 10
  }

  // "Culture fit" and similar
  if (lowerText.includes('culture fit') || lowerText.includes('fits in')) {
    indicators.push({
      type: 'Exclusionary Language',
      severity: 'high',
      description: '"Culture fit" can mask bias against diverse candidates.',
    })
    recommendations.push('Focus on specific skills and values instead of vague cultural fit.')
    score -= 20
  }

  // Ability assumptions
  if (lowerText.includes('able-bodied') || lowerText.includes('physically fit')) {
    indicators.push({
      type: 'Ability Bias',
      severity: 'high',
      description: 'Physical requirements may exclude people with disabilities unnecessarily.',
    })
    recommendations.push('Only include physical requirements if essential for the role.')
    score -= 25
  }

  if (indicators.length === 0) {
    indicators.push({
      type: 'No Major Issues',
      severity: 'low',
      description: 'No obvious bias indicators detected in the text.',
    })
    recommendations.push('Continue to test with diverse evaluators for hidden biases.')
  }

  return {
    score: Math.max(0, score),
    indicators,
    recommendations,
  }
}

export function BiasDetectionDemo() {
  const { t } = useTranslation()
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyze = async () => {
    if (!inputText.trim()) return
    setIsAnalyzing(true)

    // Simulate analysis delay
    await new Promise((r) => setTimeout(r, 800))

    const analysisResult = analyzeForBias(inputText)
    setResult(analysisResult)
    setIsAnalyzing(false)
  }

  const useExample = (text: string) => {
    setInputText(text)
    setResult(null)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 border-red-500/50 text-red-400'
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
      case 'low':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Area */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Search size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.testInput}</h3>
            <p className="text-xs text-muted">Enter text to analyze for potential bias</p>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-32 bg-background border border-border rounded-xl p-4 text-text focus:outline-none focus:border-primary/50 transition-colors resize-none"
          placeholder="Enter a prompt, job description, or any text to analyze..."
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((example, i) => (
              <button
                key={i}
                onClick={() => useExample(example.text)}
                className="px-3 py-1.5 text-xs bg-surface-elevated border border-border rounded-lg hover:border-primary/30 text-muted hover:text-text transition-colors"
              >
                {example.label}
              </button>
            ))}
          </div>
          <button
            onClick={analyze}
            disabled={!inputText.trim() || isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-xl transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Scale size={16} />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <Scale size={16} />
                {t.interactive.analyzeForBias}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Score */}
            <div className="rounded-2xl bg-surface border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      result.score >= 80
                        ? 'bg-emerald-500/20'
                        : result.score >= 50
                        ? 'bg-yellow-500/20'
                        : 'bg-red-500/20'
                    }`}
                  >
                    {result.score >= 80 ? (
                      <CheckCircle size={18} className="text-emerald-400" />
                    ) : (
                      <AlertTriangle size={18} className={result.score >= 50 ? 'text-yellow-400' : 'text-red-400'} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text font-heading">{t.interactive.fairnessScore}</h3>
                    <p className="text-xs text-muted">Based on detected bias indicators</p>
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`text-4xl font-mono font-bold ${
                    result.score >= 80 ? 'text-emerald-400' : result.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}
                >
                  {result.score}
                </motion.div>
              </div>

              <div className="h-3 bg-background rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    result.score >= 80
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                      : result.score >= 50
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                      : 'bg-gradient-to-r from-red-600 to-red-400'
                  }`}
                />
              </div>
            </div>

            {/* Indicators */}
            <div className="rounded-2xl bg-surface border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text font-heading">{t.interactive.biasIndicators}</h3>
                  <p className="text-xs text-muted">{result.indicators.length} indicator(s) detected</p>
                </div>
              </div>

              <div className="space-y-3">
                {result.indicators.map((indicator, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-xl border ${getSeverityColor(indicator.severity)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{indicator.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(indicator.severity)}`}>
                        {indicator.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm opacity-80">{indicator.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl bg-surface border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                  <Lightbulb size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text font-heading">{t.interactive.recommendations}</h3>
                  <p className="text-xs text-muted">Suggestions for improvement</p>
                </div>
              </div>

              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 text-muted"
                  >
                    <span className="text-emerald-400 mt-0.5">→</span>
                    <span className="text-sm">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <Scale size={18} className="text-primary-light shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p>This is a simplified demonstration. Real bias detection requires comprehensive testing across demographics, expert review, and continuous monitoring. AI systems can have subtle biases that simple heuristics won&apos;t catch.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
