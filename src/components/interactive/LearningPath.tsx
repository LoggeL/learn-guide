'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Rocket } from 'lucide-react'
import { useTranslation, useLocale } from '@/lib/i18n/context'
import { flattenTopics, learningPathGroups, type Topic } from '@/lib/topics'
import { DIFFICULTY_STYLES, type Difficulty } from '@/lib/difficulty'
import { COMPLETED_LEARNING_PATH_STORAGE_KEY, normalizeTopicIds } from '@/lib/progress/schema'

interface StageStyle {
  gradient: string
  accent: string
  activeBox: string
  hoverBorder: string
}

// Literal class strings so Tailwind keeps them. Cycled if the number of lectures grows.
const STAGE_STYLES: StageStyle[] = [
  { gradient: 'from-emerald-500 to-green-500', accent: 'text-emerald-400', activeBox: 'bg-emerald-500/10 border-emerald-500/30', hoverBorder: 'hover:border-emerald-500/30' },
  { gradient: 'from-cyan-500 to-sky-500', accent: 'text-cyan-400', activeBox: 'bg-cyan-500/10 border-cyan-500/30', hoverBorder: 'hover:border-cyan-500/30' },
  { gradient: 'from-violet-500 to-purple-500', accent: 'text-violet-400', activeBox: 'bg-violet-500/10 border-violet-500/30', hoverBorder: 'hover:border-violet-500/30' },
  { gradient: 'from-amber-500 to-yellow-500', accent: 'text-amber-400', activeBox: 'bg-amber-500/10 border-amber-500/30', hoverBorder: 'hover:border-amber-500/30' },
  { gradient: 'from-orange-500 to-red-500', accent: 'text-orange-400', activeBox: 'bg-orange-500/10 border-orange-500/30', hoverBorder: 'hover:border-orange-500/30' },
  { gradient: 'from-fuchsia-500 to-pink-500', accent: 'text-fuchsia-400', activeBox: 'bg-fuchsia-500/10 border-fuchsia-500/30', hoverBorder: 'hover:border-fuchsia-500/30' },
  { gradient: 'from-rose-500 to-red-500', accent: 'text-rose-400', activeBox: 'bg-rose-500/10 border-rose-500/30', hoverBorder: 'hover:border-rose-500/30' },
]

interface Stage {
  id: string
  style: StageStyle
  topics: Topic[]
}

/** The lecture blocks of the sequential course, read from topics.ts (optional groups excluded). */
function buildStages(): Stage[] {
  const byId = new Map(flattenTopics().map(topic => [topic.id, topic]))
  return learningPathGroups
    .filter(group => !group.optional)
    .map((group, idx) => ({
      id: group.id,
      style: STAGE_STYLES[idx % STAGE_STYLES.length],
      topics: group.topicIds
        .map(id => byId.get(id))
        .filter((topic): topic is Topic => !!topic?.path),
    }))
    .filter(stage => stage.topics.length > 0)
}

export function LearningPath() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const lp = t.learningPath
  const lpText = lp as Record<string, string>
  const stages = useMemo(buildStages, [])
  const totalCount = stages.reduce((sum, stage) => sum + stage.topics.length, 0)
  const [expandedStage, setExpandedStage] = useState<number>(0)

  // Completed topics, loaded after mount to avoid a hydration mismatch
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPLETED_LEARNING_PATH_STORAGE_KEY)
      if (stored) setCompleted(new Set(normalizeTopicIds(JSON.parse(stored)).ids))
    } catch { /* ignore */ }
  }, [])

  const toggleCompleted = (id: string) => {
    const next = new Set(completed)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    // Stored ids outside the current path (e.g. renamed topics) are kept untouched.
    try { localStorage.setItem(COMPLETED_LEARNING_PATH_STORAGE_KEY, JSON.stringify(Array.from(next))) } catch { /* ignore */ }
    setCompleted(next)
  }

  const difficultyLabel: Record<Difficulty, string> = {
    beginner: t.common.difficultyBeginner,
    intermediate: t.common.difficultyIntermediate,
    expert: t.common.difficultyExpert,
  }

  const doneCount = stages.reduce((sum, stage) => sum + stage.topics.filter(topic => completed.has(topic.id)).length, 0)
  let runningIndex = 0

  return (
    <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-gradient">{lp.title}</h2>
      </div>
      <p className="text-muted mb-6 md:ml-[52px]">{lp.subtitle}</p>

      <div className="relative space-y-3">
        {/* Vertical connector line */}
        <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-500/40 via-violet-500/40 to-rose-500/40 hidden md:block" />

        {stages.map((stage, idx) => {
          const isExpanded = expandedStage === idx
          const stageDone = stage.topics.filter(topic => completed.has(topic.id)).length
          const allDone = stageDone === stage.topics.length
          const firstIndex = runningIndex
          runningIndex += stage.topics.length
          const hint = lpText[`hint-${stage.id}`]

          return (
            <div key={stage.id} className="relative">
              <button
                type="button"
                onClick={() => setExpandedStage(isExpanded ? -1 : idx)}
                aria-expanded={isExpanded}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  isExpanded ? stage.style.activeBox : 'bg-surface/30 border-border hover:border-border/80'
                }`}
              >
                <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${stage.style.gradient} flex items-center justify-center shrink-0`}>
                  {allDone
                    ? <CheckCircle2 className="w-5 h-5 text-white" />
                    : <span className="text-sm font-bold font-mono text-white">{idx + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span className={`text-lg font-bold font-heading ${stage.style.accent}`}>
                      {lpText[stage.id] ?? stage.id}
                    </span>
                    <span className="text-xs text-muted font-mono">
                      {stageDone}/{stage.topics.length}
                    </span>
                  </div>
                  {hint && <p className="text-sm text-muted line-clamp-2 md:truncate">{hint}</p>}
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-muted shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted shrink-0" />}
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 md:ml-14 grid gap-2">
                      {stage.topics.map((topic, tIdx) => {
                        const isDone = completed.has(topic.id)
                        const difficulty = topic.difficulty
                        return (
                          <div
                            key={topic.id}
                            className={`group flex items-start gap-3 p-3 rounded-lg border transition-all hover:bg-surface/50 ${
                              isDone ? 'border-border/50 opacity-75' : `border-border ${stage.style.hoverBorder}`
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleCompleted(topic.id)}
                              aria-pressed={isDone}
                              aria-label={`${isDone ? lp.markIncomplete : lp.markComplete}: ${t.topicNames[topic.id as keyof typeof t.topicNames] ?? topic.name}`}
                              title={isDone ? lp.markIncomplete : lp.markComplete}
                              className={`mt-0.5 shrink-0 transition-colors ${isDone ? stage.style.accent : 'text-muted hover:text-text'}`}
                            >
                              {isDone ? <CheckCircle2 className="w-[18px] h-[18px]" /> : <Circle className="w-[18px] h-[18px]" />}
                            </button>
                            <Link href={`/${locale}${topic.path}`} className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted font-mono">{String(firstIndex + tIdx + 1).padStart(2, '0')}</span>
                                <span className={`text-sm font-semibold ${isDone ? 'line-through text-muted' : 'text-text group-hover:text-primary-light'} transition-colors`}>
                                  {t.topicNames[topic.id as keyof typeof t.topicNames] ?? topic.name}
                                </span>
                                {difficulty && (
                                  <span
                                    title={difficultyLabel[difficulty]}
                                    className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none shrink-0 ${DIFFICULTY_STYLES[difficulty].color} ${DIFFICULTY_STYLES[difficulty].bg} ${DIFFICULTY_STYLES[difficulty].border}`}
                                  >
                                    {difficultyLabel[difficulty]}
                                  </span>
                                )}
                              </div>
                              {t.topicDescriptions?.[topic.id as keyof typeof t.topicDescriptions] && (
                                <p className="text-xs text-muted mt-0.5 line-clamp-1">
                                  {t.topicDescriptions[topic.id as keyof typeof t.topicDescriptions]}
                                </p>
                              )}
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>{lp.progress}</span>
          <span className="font-mono">{doneCount}/{totalCount}</span>
        </div>
        <div className="h-2 rounded-full bg-surface/50 border border-border overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-violet-500 to-rose-500"
            initial={false}
            animate={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </section>
  )
}
