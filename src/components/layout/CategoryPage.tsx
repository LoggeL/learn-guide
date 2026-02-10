'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ChevronRight, Github, MessageSquare } from 'lucide-react'
import { useTranslation, useLocale } from '@/lib/i18n/context'
import { findCategory, flattenTopics, type Topic } from '@/lib/topics'
import { TOPIC_DIFFICULTY, DIFFICULTY_STYLES } from '@/lib/difficulty'
import { TOPIC_DATES, formatTopicDate } from '@/lib/dates'

interface CategoryPageProps {
  categoryId: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
}

function hasNestedChildren(topic: Topic): boolean {
  return !!(topic.children?.[0]?.children)
}

export function CategoryPage({ categoryId }: CategoryPageProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const category = findCategory(categoryId)
  if (!category) return null

  const categoryName = t.categories[categoryId as keyof typeof t.categories] || category.name
  const categoryDesc = t.categoryDescriptions?.[categoryId as keyof typeof t.categoryDescriptions] || ''
  const allTopics = flattenTopics(category.children)

  return (
    <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative px-4 md:px-0">
      {/* Ambient background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl pointer-events-none overflow-hidden" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative"
      >
        {/* Breadcrumbs */}
        <motion.nav variants={itemVariants} className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link href={`/${locale}`} className="hover:text-text transition-colors">
            {t.categories.ai}
          </Link>
          <ChevronRight size={14} className="text-subtle" />
          <span className="text-text font-medium">{categoryName}</span>
        </motion.nav>

        {/* Header */}
        <motion.header variants={itemVariants} className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-border mb-6">
            <Sparkles size={14} className="text-primary" />
            <span className="text-sm text-muted">{allTopics.length} {t.common.topics}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-gradient">
            {categoryName}
          </h1>

          {categoryDesc && (
            <p className="text-xl text-muted max-w-2xl leading-relaxed">
              {categoryDesc}
            </p>
          )}
        </motion.header>

        {/* Contribute CTA */}
        <motion.section variants={itemVariants} className="mb-10">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-secondary/10 border border-primary/20 p-6 md:p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 mx-auto mb-4">
              <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                <Github size={20} className="text-primary-light" />
              </div>
            </div>
            <h2 className="text-xl font-bold font-heading text-text mb-2">{t.common.helpMakeThisBetter}</h2>
            <p className="text-sm text-muted max-w-lg mx-auto mb-4 leading-relaxed">
              {t.common.helpMakeThisBetterDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://github.com/LoggeL/learn-guide/issues/new?template=topic_request.md&title=%5BTopic%5D+"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 text-sm"
              >
                <MessageSquare size={14} />
                {t.common.requestATopic}
              </a>
              <a
                href="https://github.com/LoggeL/learn-guide/issues/new?template=bug_report.md&title=%5BBug%5D+"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                {t.common.reportABug}
              </a>
              <a
                href="https://github.com/LoggeL/learn-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted hover:text-text transition-colors"
              >
                <Github size={14} />
                {t.common.starOnGithub}
              </a>
            </div>
          </div>
        </motion.section>

        {/* Topics Grid */}
        <motion.section variants={itemVariants}>
          {hasNestedChildren(category) ? (
            // Nested structure (like agents, llm)
            <div className="space-y-8">
              {category.children?.map((subcategory) => (
                <div key={subcategory.id}>
                  <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    {t.topicNames[subcategory.id as keyof typeof t.topicNames] || subcategory.name}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subcategory.children?.filter(item => item.path).map((topic, idx) => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        index={idx}
                        locale={locale}
                        t={t}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Flat structure (like ml-fundamentals, prompting)
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.children?.filter(item => item.path).map((topic, idx) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  index={idx}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* Back to home link */}
        <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-border">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-muted hover:text-text transition-colors"
          >
            <ChevronRight size={16} className="rotate-180" />
            {t.common.backToAllTopics || 'Back to all topics'}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

function TopicCard({
  topic,
  index,
  locale,
  t
}: {
  topic: Topic
  index: number
  locale: string
  t: ReturnType<typeof useTranslation>['t']
}) {
  return (
    <Link
      href={`/${locale}${topic.path}`}
      className="group relative flex items-center gap-3 p-4 rounded-xl bg-surface border border-border hover:border-primary/40 hover:bg-surface-elevated transition-all duration-200"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
        <span className="text-sm font-mono text-primary-light font-medium">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-text group-hover:text-primary-light transition-colors block">
          {t.topicNames[topic.id as keyof typeof t.topicNames] || topic.name}
        </span>
        {t.topicDescriptions?.[topic.id as keyof typeof t.topicDescriptions] && (
          <span className="text-xs text-muted block mt-0.5 line-clamp-1">
            {t.topicDescriptions[topic.id as keyof typeof t.topicDescriptions]}
          </span>
        )}
        {TOPIC_DATES[topic.id] && (
          <span className="text-[10px] text-subtle block mt-0.5">
            {formatTopicDate(TOPIC_DATES[topic.id], locale)}
          </span>
        )}
      </div>
      {TOPIC_DIFFICULTY[topic.id] && (() => {
        const s = DIFFICULTY_STYLES[TOPIC_DIFFICULTY[topic.id]]
        return (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none shrink-0 ${s.color} ${s.bg} ${s.border}`}>
            {s.label}
          </span>
        )
      })()}
      <ArrowRight size={14} className="text-muted group-hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all" />
    </Link>
  )
}
