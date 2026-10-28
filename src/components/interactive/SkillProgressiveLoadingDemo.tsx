'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, FileText, RotateCcw, Terminal } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const CHARS_PER_TOKEN = 4
const SKILL_NAMES = ['code-review', 'release-notes', 'sql-reporting'] as const
const RESOURCES = [
  { path: 'scripts/run_checks.sh', isScript: true },
  { path: 'assets/template.md', isScript: false },
  { path: 'references/schema.md', isScript: false },
] as const

const estimate = (text: string) => Math.ceil(text.length / CHARS_PER_TOKEN)

export function SkillProgressiveLoadingDemo() {
  const { t } = useTranslation()
  const c = t.agentSkills.demo
  const [task, setTask] = useState(0)
  const [level, setLevel] = useState(0)

  const catalogText = (i: number) => `- ${SKILL_NAMES[i]}: ${c.skills[i].description}`
  const catalogTokens = c.skills.reduce((sum, _, i) => sum + estimate(catalogText(i)), 0)
  const bodyTokens = level >= 1 ? estimate(c.skills[task].body) : 0
  const resourceTokens = level >= 2 ? estimate(c.skills[task].resourceContent) : 0
  const used = catalogTokens + bodyTokens + resourceTokens
  const everything = c.skills.reduce((sum, skill, i) => sum + estimate(catalogText(i)) + estimate(skill.body) + estimate(skill.resourceContent), 0)
  const pct = Math.round((used / everything) * 100)
  const resource = RESOURCES[task]

  const segments = [
    { label: c.segCatalog, value: catalogTokens, color: 'bg-purple-500' },
    { label: c.segBody, value: bodyTokens, color: 'bg-cyan-500' },
    { label: c.segResource, value: resourceTokens, color: 'bg-emerald-500' },
  ]

  const chooseTask = (index: number) => { setTask(index); setLevel(0) }

  return (
    <div className="rounded-xl bg-surface border border-border p-5 space-y-5">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted font-heading mb-2">{c.taskLabel}</div>
        <div className="flex flex-wrap gap-2">
          {c.tasks.map((text, i) => (
            <button key={i} onClick={() => chooseTask(i)} aria-pressed={task === i} className={`px-3 py-2 rounded-lg border text-sm text-left transition-colors ${task === i ? 'border-primary bg-primary/10 text-text' : 'border-border text-muted hover:text-text'}`}>
              {text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {c.stepLabels.map((label, i) => (
          <span key={i} className={`px-2.5 py-1 rounded-full text-xs border ${i <= level ? 'border-primary/50 bg-primary/15 text-primary-light' : 'border-border text-muted'}`}>
            {i + 1} · {label}
          </span>
        ))}
        <span className="flex-1" />
        {level < 2 ? (
          <button onClick={() => setLevel(l => l + 1)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/20 text-primary-light text-sm">
            {c.next}<ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => setLevel(0)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm text-muted hover:text-text">
            <RotateCcw className="w-4 h-4" />{c.restart}
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-3">
          <div className="text-xs font-semibold text-purple-300 mb-2">{c.catalogHeading}</div>
          <ul className="space-y-1.5 text-xs font-mono">
            {c.skills.map((skill, i) => (
              <li key={i} className={`transition-colors ${level >= 1 && i === task ? 'text-text' : 'text-muted'}`}>
                <span className="text-purple-300">{SKILL_NAMES[i]}</span>: {skill.description}
                {level >= 1 && i === task && <span className="ml-2 px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-sans">{c.activated}</span>}
              </li>
            ))}
          </ul>
        </div>

        <AnimatePresence>
          {level >= 1 && (
            <motion.div key={`body-${task}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-2">
                  <FileText className="w-4 h-4" />{c.bodyHeading} <code className="font-normal text-muted">{SKILL_NAMES[task]}/SKILL.md</code>
                </div>
                <pre className="text-xs font-mono text-muted whitespace-pre-wrap">{c.skills[task].body}</pre>
              </div>
            </motion.div>
          )}
          {level >= 2 && (
            <motion.div key={`res-${task}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-2">
                  {resource.isScript ? <Terminal className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  {resource.isScript ? c.scriptHeading : c.resourceHeading} <code className="font-normal text-muted">{resource.path}</code>
                </div>
                <pre className="text-xs font-mono text-muted whitespace-pre-wrap">{c.skills[task].resourceContent}</pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>{c.contextLabel}</span>
            <span className="font-mono">{c.tokens.replace('{n}', String(used))}</span>
          </div>
          <div className="h-4 rounded-full bg-background border border-border overflow-hidden flex">
            {segments.map(segment => (
              <motion.div key={segment.label} className={segment.color} initial={false} animate={{ width: `${(segment.value / everything) * 100}%` }} transition={{ duration: 0.4 }} title={`${segment.label}: ${segment.value}`} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
            {segments.map(segment => (
              <span key={segment.label} className="inline-flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${segment.color}`} />{segment.label} {c.tokens.replace('{n}', String(segment.value))}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>{c.allInPromptLabel}</span>
            <span className="font-mono">{c.tokens.replace('{n}', String(everything))}</span>
          </div>
          <div className="h-4 rounded-full bg-orange-500/60 border border-border" />
        </div>
        <p className="text-sm text-text">{c.ratio.replace('{pct}', String(pct))}</p>
        <p className="text-xs text-muted">{c.smallNote}</p>
      </div>
    </div>
  )
}
