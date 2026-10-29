'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Lightbulb, Target, Compass, ListChecks, LayoutList, FileText } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type SectionId = 'role' | 'context' | 'rules' | 'output'

const SECTION_IDS: SectionId[] = ['role', 'context', 'rules', 'output']

interface PromptSection {
  id: SectionId
  content: string
  enabled: boolean
}

function countCharacters(text: string): number { return Array.from(text).length }

const SECTION_ICONS = {
  role: Target,
  context: Compass,
  rules: ListChecks,
  output: LayoutList,
}

const SECTION_COLORS = {
  role: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/20', text: 'text-purple-400' },
  context: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/20', text: 'text-cyan-400' },
  rules: { bg: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/20', text: 'text-orange-400' },
  output: { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/20', text: 'text-emerald-400' },
}

const emptySections = (): PromptSection[] => SECTION_IDS.map(id => ({ id, content: '', enabled: true }))

export function SystemPromptBuilder() {
  const { t } = useTranslation()
  const b = t.systemPrompts.builder

  const [sections, setSections] = useState<PromptSection[]>(emptySections)
  const [copied, setCopied] = useState(false)
  const [activePreset, setActivePreset] = useState<number | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear pending copy-feedback timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const assembledPrompt = useMemo(() => sections
    .filter(section => section.enabled && section.content.trim())
    .map(section => `# ${b.sections[section.id].name}\n${section.content}`)
    .join('\n\n'), [sections, b.sections])

  const updateSection = (id: SectionId, updates: Partial<PromptSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    setActivePreset(null)
  }

  const applyPreset = (index: number) => {
    const preset = b.presets[index]
    setSections(SECTION_IDS.map(id => ({ id, content: preset[id], enabled: true })))
    setActivePreset(index)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(assembledPrompt)
    } catch {
      return
    }
    setCopied(true)
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setSections(emptySections())
    setActivePreset(null)
  }

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
            <FileText size={18} className="text-orange-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{b.presetsTitle}</h3>
            <p className="text-xs text-muted">{b.presetsDesc}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {b.presets.map((preset, index) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(index)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activePreset === index
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
            {b.clearAll}
          </button>
        </div>
      </div>

      {/* Section editors */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = SECTION_ICONS[section.id]
          const colors = SECTION_COLORS[section.id]
          const meta = b.sections[section.id]

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
                    <h3 className="font-semibold text-text font-heading">{meta.name}</h3>
                    <p className="text-xs text-muted">
                      {section.content ? `${countCharacters(section.content)} ${b.characters}` : b.notConfigured}
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-muted">{b.enabled}</span>
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
                      placeholder={meta.placeholder}
                      aria-label={meta.name}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary/50 transition-colors resize-none h-28 mb-3"
                    />
                    <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg border border-border">
                      <Lightbulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted">{meta.tip}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Live preview */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <FileText size={18} className="text-primary-light" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">{b.livePreview}</h3>
              <p className="text-xs text-muted">
                {countCharacters(assembledPrompt)} {b.characters}
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
            {copied ? b.copied : b.copyPrompt}
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
            <p className="text-muted">{b.startBuilding}</p>
          </div>
        )}

        {assembledPrompt && (
          <p className="mt-3 text-xs text-muted text-center">{b.countNote}</p>
        )}
      </div>
    </div>
  )
}
