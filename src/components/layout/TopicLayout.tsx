'use client'

import { ReactNode, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, BookOpen, Sparkles } from 'lucide-react'
import { useTranslation, useLocale } from '@/lib/i18n/context'
import { TOPIC_DATES, formatTopicDate } from '@/lib/dates'
import { TOPIC_DIFFICULTY, DIFFICULTY_STYLES, type Difficulty } from '@/lib/difficulty'
import { RightTableOfContents } from './RightTableOfContents'

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  expert: 'Expert',
}

interface TopicLayoutProps {
  title: string
  description: string
  topicId?: string
  breadcrumbs: { label: string; href?: string }[]
  prevTopic?: { label: string; href: string }
  nextTopic?: { label: string; href: string }
  children: ReactNode
}

export function TopicLayout({
  title,
  description,
  topicId,
  breadcrumbs,
  prevTopic,
  nextTopic,
  children,
}: TopicLayoutProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const articleRef = useRef<HTMLElement>(null)

  const localizeHref = (href: string) => `/${locale}${href}`

  return (
    <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl relative">
      {/* Topic-local glow */}
      <div className="absolute -top-32 right-0 w-[520px] h-[520px] bg-gradient-radial from-primary/12 via-secondary/5 to-transparent blur-3xl pointer-events-none" />
      
      {/* Breadcrumbs */}
      <nav className="glass mb-5 flex w-fit max-w-full items-center gap-2 overflow-x-auto rounded-xl px-3 py-2 text-sm text-muted scrollbar-none">
        <BookOpen size={14} className="text-subtle shrink-0" />
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2 shrink-0">
            {i > 0 && <ChevronRight size={12} className="text-subtle" />}
            {crumb.href ? (
              <Link 
                href={localizeHref(crumb.href)} 
                className="hover:text-primary-light transition-colors max-w-[150px] sm:max-w-none truncate"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-text font-medium max-w-[150px] sm:max-w-none truncate">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Header */}
      <header className="border-gradient mb-8 overflow-hidden rounded-2xl p-5 shadow-card md:p-7">
        <div className="relative flex flex-col gap-5 md:flex-row md:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/45 bg-primary/15 text-primary-light shadow-[0_0_28px_rgba(168,85,247,0.25)]">
            <Sparkles size={25} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold font-heading leading-tight">
                <span className="text-gradient">{title}</span>
              </h1>
              {topicId && TOPIC_DIFFICULTY[topicId] && (() => {
                const d = TOPIC_DIFFICULTY[topicId]
                const s = DIFFICULTY_STYLES[d]
                return (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border shrink-0 ${s.color} ${s.bg} ${s.border}`}>
                    {DIFFICULTY_LABELS[d]}
                  </span>
                )
              })()}
            </div>
            <p className="max-w-4xl text-base md:text-lg text-muted leading-relaxed">
              {description}
            </p>
            {topicId && TOPIC_DATES[topicId] && (
              <p className="mt-4 inline-flex rounded-full border border-border bg-background/45 px-3 py-1 text-xs text-subtle">
                {t.common.lastUpdated}: {formatTopicDate(TOPIC_DATES[topicId], locale)}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Content grid: article + right sidebar TOC on desktop */}
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-7 xl:items-start">
        {/* Left column: article + nav */}
        <div>
          <article ref={articleRef} className="space-y-8 relative">
            {children}
          </article>

          {/* Navigation */}
          <footer className="mt-20 pt-8 border-t border-border">
            <div className="flex justify-between items-center">
              {prevTopic ? (
                <Link
                  href={localizeHref(prevTopic.href)}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-surface/70 px-5 py-3 transition-all hover:border-primary/45 hover:bg-surface-elevated/80"
                >
                  <ChevronLeft size={18} className="text-muted group-hover:text-primary transition-colors" />
                  <div className="text-left">
                    <span className="text-xs text-subtle block">{t.common.previous}</span>
                    <span className="text-text font-medium group-hover:text-primary-light transition-colors">
                      {prevTopic.label}
                    </span>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextTopic && (
                <Link
                  href={localizeHref(nextTopic.href)}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-surface/70 px-5 py-3 transition-all hover:border-primary/45 hover:bg-surface-elevated/80"
                >
                  <div className="text-right">
                    <span className="text-xs text-subtle block">{t.common.next}</span>
                    <span className="text-text font-medium group-hover:text-primary-light transition-colors">
                      {nextTopic.label}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-muted group-hover:text-primary transition-colors" />
                </Link>
              )}
            </div>
          </footer>
        </div>

        {/* Right sidebar TOC — only visible on xl+ */}
        <RightTableOfContents articleRef={articleRef} variant="desktop" />
      </div>
    </div>
  )
}
