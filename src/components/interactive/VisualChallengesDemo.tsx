'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Hash,
  MapPin,
  Type,
  Ghost,
  Search,
  Images,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface Challenge {
  id: string
  icon: React.ReactNode
  color: string
  bgGradient: string
}

const challenges: Challenge[] = [
  {
    id: 'counting',
    icon: <Hash size={20} />,
    color: 'text-red-400',
    bgGradient: 'from-red-500/20 to-orange-500/20'
  },
  {
    id: 'spatial',
    icon: <MapPin size={20} />,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 'text',
    icon: <Type size={20} />,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    id: 'hallucination',
    icon: <Ghost size={20} />,
    color: 'text-amber-400',
    bgGradient: 'from-amber-500/20 to-yellow-500/20'
  },
  {
    id: 'detail',
    icon: <Search size={20} />,
    color: 'text-teal-400',
    bgGradient: 'from-teal-500/20 to-emerald-500/20'
  },
  {
    id: 'multiImage',
    icon: <Images size={20} />,
    color: 'text-indigo-400',
    bgGradient: 'from-indigo-500/20 to-violet-500/20'
  },
]

// Simulated visual scenario for each challenge
interface Scenario {
  description: string
  vlmResponse: string
  actualAnswer: string
  isCorrect: boolean
}

export function VisualChallengesDemo() {
  const { t } = useTranslation()
  const [activeChallenge, setActiveChallenge] = useState('counting')
  const [showAnswer, setShowAnswer] = useState(false)

  const getChallengeData = (id: string) => {
    switch (id) {
      case 'counting':
        return {
          title: t.visualChallengesDemo.countingTitle,
          scenario: t.visualChallengesDemo.countingScenario,
          vlmResponse: t.visualChallengesDemo.countingVlmResponse,
          actualAnswer: t.visualChallengesDemo.countingActual,
          isCorrect: false,
          whyFails: t.visualChallengesDemo.countingWhy,
          tip: t.visualChallengesDemo.countingTip,
        }
      case 'spatial':
        return {
          title: t.visualChallengesDemo.spatialTitle,
          scenario: t.visualChallengesDemo.spatialScenario,
          vlmResponse: t.visualChallengesDemo.spatialVlmResponse,
          actualAnswer: t.visualChallengesDemo.spatialActual,
          isCorrect: false,
          whyFails: t.visualChallengesDemo.spatialWhy,
          tip: t.visualChallengesDemo.spatialTip,
        }
      case 'text':
        return {
          title: t.visualChallengesDemo.textTitle,
          scenario: t.visualChallengesDemo.textScenario,
          vlmResponse: t.visualChallengesDemo.textVlmResponse,
          actualAnswer: t.visualChallengesDemo.textActual,
          isCorrect: false,
          whyFails: t.visualChallengesDemo.textWhy,
          tip: t.visualChallengesDemo.textTip,
        }
      case 'hallucination':
        return {
          title: t.visualChallengesDemo.hallucinationTitle,
          scenario: t.visualChallengesDemo.hallucinationScenario,
          vlmResponse: t.visualChallengesDemo.hallucinationVlmResponse,
          actualAnswer: t.visualChallengesDemo.hallucinationActual,
          isCorrect: false,
          whyFails: t.visualChallengesDemo.hallucinationWhy,
          tip: t.visualChallengesDemo.hallucinationTip,
        }
      case 'detail':
        return {
          title: t.visualChallengesDemo.detailTitle,
          scenario: t.visualChallengesDemo.detailScenario,
          vlmResponse: t.visualChallengesDemo.detailVlmResponse,
          actualAnswer: t.visualChallengesDemo.detailActual,
          isCorrect: false,
          whyFails: t.visualChallengesDemo.detailWhy,
          tip: t.visualChallengesDemo.detailTip,
        }
      case 'multiImage':
        return {
          title: t.visualChallengesDemo.multiImageTitle,
          scenario: t.visualChallengesDemo.multiImageScenario,
          vlmResponse: t.visualChallengesDemo.multiImageVlmResponse,
          actualAnswer: t.visualChallengesDemo.multiImageActual,
          isCorrect: false,
          whyFails: t.visualChallengesDemo.multiImageWhy,
          tip: t.visualChallengesDemo.multiImageTip,
        }
      default:
        return {
          title: '',
          scenario: '',
          vlmResponse: '',
          actualAnswer: '',
          isCorrect: false,
          whyFails: '',
          tip: '',
        }
    }
  }

  const currentChallenge = challenges.find(c => c.id === activeChallenge)!
  const challengeData = getChallengeData(activeChallenge)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
          <Eye size={18} className="text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-text font-heading">{t.visualChallengesDemo.title}</h3>
          <p className="text-xs text-muted">{t.visualChallengesDemo.subtitle}</p>
        </div>
      </div>

      {/* Challenge Tabs */}
      <div className="flex flex-wrap gap-2">
        {challenges.map((challenge) => (
          <button
            key={challenge.id}
            onClick={() => {
              setActiveChallenge(challenge.id)
              setShowAnswer(false)
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
              activeChallenge === challenge.id
                ? `bg-gradient-to-r ${challenge.bgGradient} border-transparent ${challenge.color}`
                : 'bg-surface border-border text-muted hover:text-text hover:border-border/80'
            }`}
          >
            {challenge.icon}
            <span className="text-sm font-medium hidden sm:inline">
              {t.visualChallengesDemo[`${challenge.id}Tab` as keyof typeof t.visualChallengesDemo]}
            </span>
          </button>
        ))}
      </div>

      {/* Challenge Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChallenge}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Scenario Card */}
          <div className={`rounded-xl bg-gradient-to-br ${currentChallenge.bgGradient} border border-border p-5`}>
            <h4 className={`font-semibold ${currentChallenge.color} mb-3 flex items-center gap-2`}>
              {currentChallenge.icon}
              {challengeData.title}
            </h4>

            {/* Image Description (simulated) */}
            <div className="bg-background/50 rounded-lg p-4 mb-4">
              <div className="text-xs text-muted uppercase tracking-wider mb-2">{t.visualChallengesDemo.imageScenario}</div>
              <p className="text-text">{challengeData.scenario}</p>
            </div>

            {/* VLM Response */}
            <div className="bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-xs text-purple-400">AI</span>
                </div>
                <span className="text-xs text-muted uppercase tracking-wider">{t.visualChallengesDemo.vlmResponse}</span>
              </div>
              <p className="text-text font-mono text-sm">{challengeData.vlmResponse}</p>
            </div>
          </div>

          {/* Reveal Answer Button */}
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`w-full py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
              showAnswer
                ? 'bg-surface-elevated border-border text-text'
                : `bg-gradient-to-r ${currentChallenge.bgGradient} border-transparent ${currentChallenge.color} hover:opacity-90`
            }`}
          >
            {showAnswer ? t.visualChallengesDemo.hideAnalysis : t.visualChallengesDemo.revealAnalysis}
          </button>

          {/* Analysis */}
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Correct vs VLM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* VLM Answer */}
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle size={16} className="text-red-400" />
                      <span className="text-sm font-semibold text-red-400">{t.visualChallengesDemo.vlmSaid}</span>
                    </div>
                    <p className="text-sm text-muted">{challengeData.vlmResponse}</p>
                  </div>

                  {/* Actual Answer */}
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span className="text-sm font-semibold text-emerald-400">{t.visualChallengesDemo.actualAnswer}</span>
                    </div>
                    <p className="text-sm text-muted">{challengeData.actualAnswer}</p>
                  </div>
                </div>

                {/* Why This Fails */}
                <div className="rounded-lg bg-surface border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">{t.visualChallengesDemo.whyFails}</span>
                  </div>
                  <p className="text-sm text-muted">{challengeData.whyFails}</p>
                </div>

                {/* Pro Tip */}
                <div className={`rounded-lg bg-gradient-to-r ${currentChallenge.bgGradient} p-4`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center shrink-0 ${currentChallenge.color}`}>
                      {currentChallenge.icon}
                    </div>
                    <div>
                      <span className={`text-sm font-semibold ${currentChallenge.color}`}>{t.visualChallengesDemo.proTip}</span>
                      <p className="text-sm text-muted mt-1">{challengeData.tip}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Summary Stats */}
      <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 p-4">
        <div className="flex items-start gap-3">
          <Eye size={18} className="text-purple-400 shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p className="font-semibold text-purple-400 mb-1">{t.visualChallengesDemo.keyInsight}</p>
            <p>{t.visualChallengesDemo.keyInsightDesc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
