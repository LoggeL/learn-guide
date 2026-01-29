'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Lightbulb, Sparkles, User, Shield, BookOpen, FileText } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface PromptSection {
  id: 'identity' | 'capabilities' | 'limitations' | 'guidelines'
  content: string
  enabled: boolean
}

interface PromptPreset {
  id: string
  name: string
  sections: {
    identity: string
    capabilities: string
    limitations: string
    guidelines: string
  }
}

// Approximate token count (rough estimate: ~4 chars per token for English)
function estimateTokenCount(text: string): number {
  if (!text.trim()) return 0
  // More accurate estimation considering whitespace and punctuation
  const words = text.trim().split(/\s+/).length
  const chars = text.length
  // Average: words * 1.3 + special chars
  return Math.ceil(words * 1.3 + (chars - words) * 0.1)
}

const SECTION_ICONS = {
  identity: User,
  capabilities: Sparkles,
  limitations: Shield,
  guidelines: BookOpen,
}

const SECTION_COLORS = {
  identity: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/20', text: 'text-purple-400' },
  capabilities: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/20', text: 'text-cyan-400' },
  limitations: { bg: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/20', text: 'text-red-400' },
  guidelines: { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/20', text: 'text-emerald-400' },
}

export function SystemPromptBuilder() {
  const { t } = useTranslation()

  const PRESETS: PromptPreset[] = [
    {
      id: 'coding',
      name: t.interactive.presetCoding,
      sections: {
        identity: 'You are an expert software developer specializing in TypeScript, React, and Node.js. You write clean, maintainable code following industry best practices.',
        capabilities: '- Code review and refactoring suggestions\n- Debugging assistance\n- Architecture design advice\n- Writing tests and documentation\n- Explaining complex technical concepts',
        limitations: '- Do not execute code or access external systems\n- Do not provide solutions that bypass security measures\n- Always recommend testing before deploying\n- Avoid providing outdated or deprecated patterns',
        guidelines: '- Use TypeScript strict mode conventions\n- Prefer functional and declarative patterns\n- Include type annotations in all examples\n- Explain trade-offs when multiple approaches exist\n- Format code with consistent 2-space indentation',
      },
    },
    {
      id: 'support',
      name: t.interactive.presetSupport,
      sections: {
        identity: 'You are a friendly and professional customer support agent for TechCorp. You help users with product issues, billing questions, and general inquiries.',
        capabilities: '- Answer product-related questions\n- Guide users through troubleshooting steps\n- Explain billing and subscription details\n- Escalate complex issues to human agents\n- Provide information about features and updates',
        limitations: '- Cannot access or modify user accounts directly\n- Cannot process refunds without human approval\n- Cannot share internal company information\n- Do not make promises about future features\n- Cannot diagnose hardware issues remotely',
        guidelines: '- Maintain a warm, empathetic tone\n- Use the customer\'s name when provided\n- Apologize for any inconvenience sincerely\n- Provide step-by-step instructions clearly\n- Always offer additional help before closing',
      },
    },
    {
      id: 'research',
      name: t.interactive.presetResearch,
      sections: {
        identity: 'You are an academic research assistant with expertise in literature review, data analysis, and scientific writing. You help researchers and students with their work.',
        capabilities: '- Summarize and analyze academic papers\n- Suggest relevant research methodologies\n- Help structure research arguments\n- Identify gaps in existing literature\n- Assist with citation formatting',
        limitations: '- Cannot access paywalled content or databases\n- Do not fabricate citations or statistics\n- Cannot conduct original experiments\n- Avoid making definitive claims without evidence\n- Do not write entire papers for users',
        guidelines: '- Cite sources when referencing specific claims\n- Use formal academic language\n- Present multiple viewpoints on contested topics\n- Distinguish between established facts and hypotheses\n- Encourage critical thinking and verification',
      },
    },
  ]

  const TIPS: Record<string, string> = {
    identity: t.interactive.tipIdentity,
    capabilities: t.interactive.tipCapabilities,
    limitations: t.interactive.tipLimitations,
    guidelines: t.interactive.tipGuidelines,
  }

  const [sections, setSections] = useState<PromptSection[]>([
    { id: 'identity', content: '', enabled: true },
    { id: 'capabilities', content: '', enabled: true },
    { id: 'limitations', content: '', enabled: true },
    { id: 'guidelines', content: '', enabled: true },
  ])

  const [copied, setCopied] = useState(false)
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const assembledPrompt = useMemo(() => {
    const parts: string[] = []

    sections.forEach((section) => {
      if (section.enabled && section.content.trim()) {
        const sectionTitle = t.systemPrompts[section.id] as string
        parts.push(`## ${sectionTitle}\n${section.content}`)
      }
    })

    return parts.join('\n\n')
  }, [sections, t.systemPrompts])

  const tokenCount = useMemo(() => estimateTokenCount(assembledPrompt), [assembledPrompt])

  const updateSection = (id: string, updates: Partial<PromptSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    setActivePreset(null)
  }

  const applyPreset = (preset: PromptPreset) => {
    setSections([
      { id: 'identity', content: preset.sections.identity, enabled: true },
      { id: 'capabilities', content: preset.sections.capabilities, enabled: true },
      { id: 'limitations', content: preset.sections.limitations, enabled: true },
      { id: 'guidelines', content: preset.sections.guidelines, enabled: true },
    ])
    setActivePreset(preset.id)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(assembledPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setSections([
      { id: 'identity', content: '', enabled: true },
      { id: 'capabilities', content: '', enabled: true },
      { id: 'limitations', content: '', enabled: true },
      { id: 'guidelines', content: '', enabled: true },
    ])
    setActivePreset(null)
  }

  return (
    <div className="space-y-6">
      {/* Preset Templates */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
            <FileText size={18} className="text-orange-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.templatePresets}</h3>
            <p className="text-xs text-muted">{t.interactive.chooseTemplate}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activePreset === preset.id
                  ? 'bg-primary/30 text-primary-light border border-primary/40'
                  : 'bg-background hover:bg-surface-elevated border border-border text-text'
              }`}
            >
              {preset.name}
            </button>
          ))}
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-background hover:bg-red-500/10 border border-border text-muted hover:text-red-400 transition-all"
          >
            {t.interactive.clearAll}
          </button>
        </div>
      </div>

      {/* Section Editors */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = SECTION_ICONS[section.id]
          const colors = SECTION_COLORS[section.id]
          const sectionName = t.systemPrompts[section.id] as string

          return (
            <motion.div
              key={section.id}
              layout
              className={`rounded-2xl bg-surface border ${section.enabled ? colors.border : 'border-border'} p-6 transition-colors`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                    <Icon size={18} className={colors.text} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text font-heading">{sectionName}</h3>
                    <p className="text-xs text-muted">
                      {section.content ? `~${estimateTokenCount(section.content)} ${t.interactive.tokens}` : t.interactive.notConfigured}
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-muted">{t.interactive.enabled}</span>
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={(e) => updateSection(section.id, { enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary/50"
                  />
                </label>
              </div>

              <AnimatePresence>
                {section.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, { content: e.target.value })}
                      placeholder={t.interactive[`placeholder${section.id.charAt(0).toUpperCase() + section.id.slice(1)}` as keyof typeof t.interactive] as string}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary/50 transition-colors resize-none h-32 mb-3"
                    />

                    {/* Tip */}
                    <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg border border-border">
                      <Lightbulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted">{TIPS[section.id]}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Live Preview */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <FileText size={18} className="text-primary-light" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">{t.interactive.livePreview}</h3>
              <p className="text-xs text-muted">
                ~{tokenCount} {t.interactive.tokens} {t.interactive.estimated}
              </p>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            disabled={!assembledPrompt}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              assembledPrompt
                ? 'bg-primary/20 hover:bg-primary/30 text-primary-light'
                : 'bg-background text-muted cursor-not-allowed'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? t.interactive.copied : t.interactive.copyPrompt}
          </button>
        </div>

        {assembledPrompt ? (
          <pre className="p-4 bg-background rounded-xl border border-border overflow-x-auto max-h-96 overflow-y-auto">
            <code className="text-sm text-text font-mono whitespace-pre-wrap">
              {assembledPrompt}
            </code>
          </pre>
        ) : (
          <div className="p-8 bg-background rounded-xl border border-border text-center">
            <p className="text-muted">{t.interactive.startBuilding}</p>
          </div>
        )}

        {/* Token estimation info */}
        {assembledPrompt && (
          <p className="mt-3 text-xs text-muted text-center">
            {t.interactive.tokenEstimateNote}
          </p>
        )}
      </div>
    </div>
  )
}
