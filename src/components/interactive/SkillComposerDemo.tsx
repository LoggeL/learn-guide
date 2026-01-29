'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  FileText,
  Link2,
  Search,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Code,
  GitBranch,
  MessageSquare,
  Sparkles
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface Skill {
  id: string
  name: string
  description: string
  triggers: string[]
  icon: typeof Zap
  color: string
  chainsWith?: string[]
}

interface MatchResult {
  skill: Skill | null
  confidence: number
  matchedTrigger: string | null
  chainedSkills: Skill[]
}

export function SkillComposerDemo() {
  const { t } = useTranslation()
  const [userInput, setUserInput] = useState('')
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeTab, setActiveTab] = useState<'trigger' | 'manifest' | 'chaining'>('trigger')
  const [selectedSkillForManifest, setSelectedSkillForManifest] = useState<string>('code-review')

  const skills: Skill[] = [
    {
      id: 'code-review',
      name: t.skillComposer.codeReviewSkill,
      description: t.skillComposer.codeReviewDesc,
      triggers: ['review', 'code review', 'check code', 'bugs', 'review this'],
      icon: Code,
      color: 'purple',
      chainsWith: ['git-workflow']
    },
    {
      id: 'documentation',
      name: t.skillComposer.documentationSkill,
      description: t.skillComposer.documentationDesc,
      triggers: ['document', 'docs', 'readme', 'documentation', 'api docs'],
      icon: BookOpen,
      color: 'cyan',
      chainsWith: []
    },
    {
      id: 'git-workflow',
      name: t.skillComposer.gitWorkflowSkill,
      description: t.skillComposer.gitWorkflowDesc,
      triggers: ['commit', 'git', 'push', 'branch', 'merge', 'pr', 'pull request'],
      icon: GitBranch,
      color: 'emerald',
      chainsWith: ['code-review']
    },
    {
      id: 'explain',
      name: t.skillComposer.explainSkill,
      description: t.skillComposer.explainDesc,
      triggers: ['explain', 'how does', 'what is', 'understand', 'clarify'],
      icon: MessageSquare,
      color: 'orange',
      chainsWith: ['documentation']
    }
  ]

  const findMatchingSkill = (input: string): MatchResult => {
    const lowerInput = input.toLowerCase()
    let bestMatch: Skill | null = null
    let bestConfidence = 0
    let matchedTrigger: string | null = null

    for (const skill of skills) {
      for (const trigger of skill.triggers) {
        if (lowerInput.includes(trigger)) {
          const confidence = Math.min(0.95, 0.6 + (trigger.length / lowerInput.length) * 0.4)
          if (confidence > bestConfidence) {
            bestConfidence = confidence
            bestMatch = skill
            matchedTrigger = trigger
          }
        }
      }
    }

    // Find chained skills
    const chainedSkills: Skill[] = []
    if (bestMatch && bestMatch.chainsWith) {
      for (const chainId of bestMatch.chainsWith) {
        const chainedSkill = skills.find(s => s.id === chainId)
        if (chainedSkill) {
          chainedSkills.push(chainedSkill)
        }
      }
    }

    return {
      skill: bestMatch,
      confidence: bestConfidence,
      matchedTrigger,
      chainedSkills
    }
  }

  const handleInputChange = (value: string) => {
    setUserInput(value)
    if (value.length > 2) {
      setIsAnimating(true)
      setTimeout(() => {
        setMatchResult(findMatchingSkill(value))
        setIsAnimating(false)
      }, 300)
    } else {
      setMatchResult(null)
    }
  }

  const exampleInputs = [
    t.skillComposer.exampleReview,
    t.skillComposer.exampleDocs,
    t.skillComposer.exampleGit,
    t.skillComposer.exampleExplain
  ]

  const selectedSkill = skills.find(s => s.id === selectedSkillForManifest) || skills[0]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-surface rounded-xl border border-border">
        <button
          onClick={() => setActiveTab('trigger')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'trigger'
              ? 'bg-primary/20 text-primary-light border border-primary/30'
              : 'text-muted hover:text-text'
          }`}
        >
          <Search size={16} />
          {t.skillComposer.triggerTab}
        </button>
        <button
          onClick={() => setActiveTab('manifest')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'manifest'
              ? 'bg-primary/20 text-primary-light border border-primary/30'
              : 'text-muted hover:text-text'
          }`}
        >
          <FileText size={16} />
          {t.skillComposer.manifestTab}
        </button>
        <button
          onClick={() => setActiveTab('chaining')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'chaining'
              ? 'bg-primary/20 text-primary-light border border-primary/30'
              : 'text-muted hover:text-text'
          }`}
        >
          <Link2 size={16} />
          {t.skillComposer.chainingTab}
        </button>
      </div>

      {/* Trigger Matching Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'trigger' && (
          <motion.div
            key="trigger"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* User Input Section */}
            <div className="rounded-2xl bg-surface border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <MessageSquare size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text font-heading">{t.skillComposer.userInput}</h3>
                  <p className="text-xs text-muted">{t.skillComposer.userInputDesc}</p>
                </div>
              </div>

              <input
                type="text"
                value={userInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={t.skillComposer.inputPlaceholder}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary/50 transition-colors"
              />

              {/* Quick Examples */}
              <div className="mt-4">
                <p className="text-xs text-muted mb-2">{t.skillComposer.tryExamples}</p>
                <div className="flex flex-wrap gap-2">
                  {exampleInputs.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => handleInputChange(example)}
                      className="px-3 py-1.5 text-xs bg-surface-elevated border border-border rounded-lg text-muted hover:text-text hover:border-primary/30 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Match Result */}
            <div className="rounded-2xl bg-surface border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Zap size={18} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text font-heading">{t.skillComposer.matchResult}</h3>
                  <p className="text-xs text-muted">{t.skillComposer.matchResultDesc}</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isAnimating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-8"
                  >
                    <div className="flex items-center gap-3 text-muted">
                      <Sparkles size={18} className="animate-pulse" />
                      <span className="text-sm">{t.skillComposer.analyzing}</span>
                    </div>
                  </motion.div>
                ) : matchResult?.skill ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    {/* Matched Skill */}
                    <div className={`p-4 rounded-xl bg-${matchResult.skill.color}-500/10 border border-${matchResult.skill.color}-500/20`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-${matchResult.skill.color}-500/20 flex items-center justify-center shrink-0`}>
                          <matchResult.skill.icon size={18} className={`text-${matchResult.skill.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-semibold text-${matchResult.skill.color}-400`}>{matchResult.skill.name}</h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                              {Math.round(matchResult.confidence * 100)}% {t.skillComposer.confidence}
                            </span>
                          </div>
                          <p className="text-sm text-muted">{matchResult.skill.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-emerald-400" />
                        <span className="text-muted">{t.skillComposer.matchedTrigger}:</span>
                        <code className="px-2 py-0.5 bg-background rounded text-primary-light">
                          {matchResult.matchedTrigger}
                        </code>
                      </div>
                    </div>

                    {/* Chained Skills Preview */}
                    {matchResult.chainedSkills.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted mb-2 flex items-center gap-1">
                          <Link2 size={12} />
                          {t.skillComposer.canChainWith}
                        </p>
                        <div className="flex gap-2">
                          {matchResult.chainedSkills.map((chain) => (
                            <span
                              key={chain.id}
                              className={`px-3 py-1.5 text-xs rounded-lg bg-${chain.color}-500/10 text-${chain.color}-400 border border-${chain.color}-500/20`}
                            >
                              {chain.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-8 text-muted"
                  >
                    <p className="text-sm">{t.skillComposer.noMatch}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Available Skills */}
            <div className="rounded-2xl bg-surface border border-border p-6">
              <h3 className="font-semibold text-text font-heading mb-4">{t.skillComposer.availableSkills}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`p-3 rounded-xl bg-${skill.color}-500/5 border border-${skill.color}-500/10 ${
                      matchResult?.skill?.id === skill.id ? `ring-2 ring-${skill.color}-500/50` : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <skill.icon size={14} className={`text-${skill.color}-400`} />
                      <span className={`text-sm font-medium text-${skill.color}-400`}>{skill.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skill.triggers.slice(0, 3).map((trigger, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 bg-background rounded text-muted">
                          {trigger}
                        </span>
                      ))}
                      {skill.triggers.length > 3 && (
                        <span className="text-xs text-muted">+{skill.triggers.length - 3}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Manifest Structure Tab */}
        {activeTab === 'manifest' && (
          <motion.div
            key="manifest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Skill Selector */}
            <div className="rounded-2xl bg-surface border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                  <FileText size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text font-heading">{t.skillComposer.skillManifest}</h3>
                  <p className="text-xs text-muted">{t.skillComposer.skillManifestDesc}</p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {skills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkillForManifest(skill.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      selectedSkillForManifest === skill.id
                        ? `bg-${skill.color}-500/20 text-${skill.color}-400 border border-${skill.color}-500/30`
                        : 'bg-surface-elevated text-muted border border-border hover:text-text'
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>

              {/* SKILL.md Preview */}
              <div className="bg-background rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-2 bg-surface-elevated border-b border-border flex items-center gap-2">
                  <FileText size={14} className="text-emerald-400" />
                  <span className="text-sm font-mono text-muted">SKILL.md</span>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-text font-mono">
                    <span className="text-muted">---</span>{'\n'}
                    <span className="text-purple-400">name</span>: <span className="text-cyan-400">{selectedSkill.id}</span>{'\n'}
                    <span className="text-purple-400">description</span>: <span className="text-cyan-400">{selectedSkill.description}</span>{'\n'}
                    <span className="text-purple-400">triggers</span>:{'\n'}
                    {selectedSkill.triggers.map((trigger, i) => (
                      <span key={i}>  - <span className="text-emerald-400">&quot;{trigger}&quot;</span>{'\n'}</span>
                    ))}
                    {selectedSkill.chainsWith && selectedSkill.chainsWith.length > 0 && (
                      <>
                        <span className="text-purple-400">chains_with</span>:{'\n'}
                        {selectedSkill.chainsWith.map((chain, i) => (
                          <span key={i}>  - <span className="text-orange-400">{chain}</span>{'\n'}</span>
                        ))}
                      </>
                    )}
                    <span className="text-muted">---</span>{'\n\n'}
                    <span className="text-pink-400"># {selectedSkill.name}</span>{'\n\n'}
                    <span className="text-text">{t.skillComposer.manifestInstructions}</span>
                  </code>
                </pre>
              </div>

              {/* Manifest Fields Explanation */}
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                  <h4 className="text-sm font-medium text-purple-400 mb-1">{t.skillComposer.nameField}</h4>
                  <p className="text-xs text-muted">{t.skillComposer.nameFieldDesc}</p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                  <h4 className="text-sm font-medium text-cyan-400 mb-1">{t.skillComposer.triggersField}</h4>
                  <p className="text-xs text-muted">{t.skillComposer.triggersFieldDesc}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <h4 className="text-sm font-medium text-emerald-400 mb-1">{t.skillComposer.descriptionField}</h4>
                  <p className="text-xs text-muted">{t.skillComposer.descriptionFieldDesc}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                  <h4 className="text-sm font-medium text-orange-400 mb-1">{t.skillComposer.chainsWithField}</h4>
                  <p className="text-xs text-muted">{t.skillComposer.chainsWithFieldDesc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skill Chaining Tab */}
        {activeTab === 'chaining' && (
          <motion.div
            key="chaining"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-surface border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Link2 size={18} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text font-heading">{t.skillComposer.skillChaining}</h3>
                  <p className="text-xs text-muted">{t.skillComposer.skillChainingDesc}</p>
                </div>
              </div>

              {/* Chain Visualization */}
              <div className="p-4 bg-background rounded-xl border border-border">
                <ChainingVisualization skills={skills} t={t} />
              </div>

              {/* Chaining Example */}
              <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                <h4 className="text-sm font-medium text-text mb-2">{t.skillComposer.chainingExample}</h4>
                <div className="space-y-2 text-sm text-muted">
                  <p>1. {t.skillComposer.chainingStep1}</p>
                  <p>2. {t.skillComposer.chainingStep2}</p>
                  <p>3. {t.skillComposer.chainingStep3}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChainingVisualization({ skills, t }: { skills: Skill[], t: Record<string, unknown> }) {
  const [activeChain, setActiveChain] = useState<string | null>(null)
  const skillComposer = t.skillComposer as Record<string, string>

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{skillComposer.selectToSeeChain}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {skills.map((skill) => {
          const isActive = activeChain === skill.id
          const isChained = activeChain && skill.chainsWith?.includes(activeChain)
          const canChainTo = activeChain && skills.find(s => s.id === activeChain)?.chainsWith?.includes(skill.id)

          return (
            <motion.button
              key={skill.id}
              onClick={() => setActiveChain(isActive ? null : skill.id)}
              className={`relative p-4 rounded-xl border transition-all ${
                isActive
                  ? `bg-${skill.color}-500/20 border-${skill.color}-500/50 ring-2 ring-${skill.color}-500/30`
                  : isChained || canChainTo
                    ? `bg-${skill.color}-500/10 border-${skill.color}-500/30`
                    : 'bg-surface border-border hover:border-primary/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl bg-${skill.color}-500/20 flex items-center justify-center`}>
                  <skill.icon size={20} className={`text-${skill.color}-400`} />
                </div>
                <span className={`text-sm font-medium ${isActive ? `text-${skill.color}-400` : 'text-text'}`}>
                  {skill.name}
                </span>
              </div>

              {/* Chain indicator */}
              {canChainTo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                  <ArrowRight size={12} className="text-white" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Active chain info */}
      <AnimatePresence>
        {activeChain && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-border">
              {(() => {
                const skill = skills.find(s => s.id === activeChain)
                if (!skill) return null
                const chainedTo = skill.chainsWith?.map(id => skills.find(s => s.id === id)).filter(Boolean) || []

                return (
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className={`px-4 py-2 rounded-lg bg-${skill.color}-500/20 text-${skill.color}-400 font-medium`}>
                      {skill.name}
                    </div>
                    {chainedTo.length > 0 && (
                      <>
                        <ArrowRight size={16} className="text-muted" />
                        {chainedTo.map((chain) => (
                          <div
                            key={chain!.id}
                            className={`px-4 py-2 rounded-lg bg-${chain!.color}-500/10 text-${chain!.color}-400 border border-${chain!.color}-500/20`}
                          >
                            {chain!.name}
                          </div>
                        ))}
                      </>
                    )}
                    {chainedTo.length === 0 && (
                      <span className="text-sm text-muted italic">{skillComposer.noChains}</span>
                    )}
                  </div>
                )
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
