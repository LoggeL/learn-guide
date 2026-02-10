'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Brain, Zap, BookOpen, ArrowRight, Cpu, MessageSquare, Layers, Github, Newspaper, Clock } from 'lucide-react'
import { useBrainPacman } from '@/components/interactive/BrainPacman'
import { TOPIC_DIFFICULTY, DIFFICULTY_STYLES } from '@/lib/difficulty'
import { TOPIC_DATES, formatTopicDate } from '@/lib/dates'
import { useTranslation, useLocale } from '@/lib/i18n/context'
import { flattenTopics } from '@/lib/topics'

// Type definitions for topic structure
interface TopicItem {
  id: string
  path: string
}

interface TopicSubcategory {
  id: string
  nameKey: string
  children: TopicItem[]
}

interface TopicCategory {
  id: string
  nameKey: string
  children: (TopicItem | TopicSubcategory)[]
}

interface TopicRoot {
  id: string
  categoryKey: string
  children: TopicCategory[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  },
}

// Type guard to check if item has a path (is a TopicItem)
function hasPath(item: TopicItem | TopicSubcategory): item is TopicItem {
  return 'path' in item
}

// Topic structure with paths
const topicData: TopicRoot[] = [
  {
    id: 'ai',
    categoryKey: 'ai',
    children: [
      {
        id: 'agents',
        nameKey: 'agents',
        children: [
          {
            id: 'agents-core',
            nameKey: 'agents-core',
            children: [
              { id: 'agent-loop', path: '/ai/agents/loop' },
              { id: 'agent-context', path: '/ai/agents/context' },
            ],
          },
          {
            id: 'agents-building',
            nameKey: 'agents-building',
            children: [
              { id: 'tool-design', path: '/ai/agents/tool-design' },
              { id: 'memory', path: '/ai/agents/memory' },
              { id: 'skills', path: '/ai/agents/skills' },
              { id: 'mcp', path: '/ai/agents/mcp' },
            ],
          },
          {
            id: 'agents-patterns',
            nameKey: 'agents-patterns',
            children: [
              { id: 'agentic-patterns', path: '/ai/agents/patterns' },
              { id: 'orchestration', path: '/ai/agents/orchestration' },
            ],
          },
          {
            id: 'agents-quality',
            nameKey: 'agents-quality',
            children: [
              { id: 'agent-problems', path: '/ai/agents/problems' },
              { id: 'agent-security', path: '/ai/agents/security' },
              { id: 'evaluation', path: '/ai/agents/evaluation' },
            ],
          },
        ],
      },
      {
        id: 'llm',
        nameKey: 'llm',
        children: [
          {
            id: 'llm-fundamentals',
            nameKey: 'llm-fundamentals',
            children: [
              { id: 'tokenization', path: '/ai/llm/tokenization' },
              { id: 'embeddings', path: '/ai/llm/embeddings' },
              { id: 'attention', path: '/ai/llm/attention' },
            ],
          },
          {
            id: 'llm-behavior',
            nameKey: 'llm-behavior',
            children: [
              { id: 'temperature', path: '/ai/llm/temperature' },
              { id: 'context-rot', path: '/ai/llm/context-rot' },
            ],
          },
          {
            id: 'llm-capabilities',
            nameKey: 'llm-capabilities',
            children: [
              { id: 'rag', path: '/ai/llm/rag' },
              { id: 'vision', path: '/ai/llm/vision' },
              { id: 'visual-challenges', path: '/ai/llm/visual-challenges' },
              { id: 'agentic-vision', path: '/ai/llm/agentic-vision' },
              { id: 'multimodality', path: '/ai/llm/multimodality' },
            ],
          },
          {
            id: 'llm-architecture',
            nameKey: 'llm-architecture',
            children: [
              { id: 'transformer-architecture', path: '/ai/llm/transformer-architecture' },
              { id: 'llm-training', path: '/ai/llm/training' },
              { id: 'moe', path: '/ai/llm/moe' },
              { id: 'quantization', path: '/ai/llm/quantization' },
              { id: 'nested-learning', path: '/ai/llm/nested-learning' },
              { id: 'distillation', path: '/ai/llm/distillation' },
              { id: 'lora', path: '/ai/llm/lora' },
              { id: 'speculative-decoding', path: '/ai/llm/speculative-decoding' },
            ],
          },
        ],
      },
      {
        id: 'llm-inference',
        nameKey: 'llm-inference',
        children: [
          { id: 'kv-cache', path: '/ai/llm-inference/kv-cache' },
          { id: 'batching', path: '/ai/llm-inference/batching' },
          { id: 'local-inference', path: '/ai/llm-inference/local-inference' },
        ],
      },
      {
        id: 'ml-fundamentals',
        nameKey: 'ml-fundamentals',
        children: [
          { id: 'neural-networks', path: '/ai/ml-fundamentals/neural-networks' },
          { id: 'gradient-descent', path: '/ai/ml-fundamentals/gradient-descent' },
          { id: 'training', path: '/ai/ml-fundamentals/training' },
        ],
      },
      {
        id: 'prompting',
        nameKey: 'prompting',
        children: [
          { id: 'prompt-basics', path: '/ai/prompting/basics' },
          { id: 'advanced-prompting', path: '/ai/prompting/advanced' },
          { id: 'system-prompts', path: '/ai/prompting/system-prompts' },
        ],
      },
      {
        id: 'safety',
        nameKey: 'safety',
        children: [
          { id: 'bias', path: '/ai/safety/bias' },
          { id: 'responsible-ai', path: '/ai/safety/responsible-ai' },
        ],
      },
      {
        id: 'industry',
        nameKey: 'industry',
        children: [
          { id: 'european-ai', path: '/ai/industry/european-ai' },
          { id: 'open-source', path: '/ai/industry/open-source' },
          { id: 'logges-favourite-model', path: '/ai/industry/logges-favourite-model' },
        ],
      },
    ],
  },
]

function DifficultyBadge({ topicId }: { topicId: string }) {
  const d = TOPIC_DIFFICULTY[topicId]
  if (!d) return null
  const s = DIFFICULTY_STYLES[d]
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none shrink-0 ${s.color} ${s.bg} ${s.border}`}>
      {s.label}
    </span>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { overlay: brainPacmanOverlay, handleTriggerClick: handleBrainClick } = useBrainPacman()

  const features = [
    {
      icon: Brain,
      titleKey: 'interactiveDemos' as const,
      descKey: 'interactiveDemosDesc' as const,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Layers,
      titleKey: 'visualLearning' as const,
      descKey: 'visualLearningDesc' as const,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Zap,
      titleKey: 'buildIntuition' as const,
      descKey: 'buildIntuitionDesc' as const,
      gradient: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative px-4 md:px-0 overflow-x-clip">
      {brainPacmanOverlay}
      {/* Ambient background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl pointer-events-none" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative"
      >
        {/* Hero Section */}
        <motion.header variants={itemVariants} className="text-center mb-20">
          <div className="relative inline-flex items-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-border cursor-pointer select-none transition-all duration-300 animate-[glow-pulse_2s_ease-in-out_infinite]"
              onClick={handleBrainClick}
              style={{
                animationName: 'glow-pulse',
              }}
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-sm text-muted">{t.common.interactiveAiLearning}</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 leading-[1.1] tracking-tight">
            <span className="text-gradient">{t.home.heroTitle1}</span>
            <br />
            <span className="text-text">{t.home.heroTitle2}</span>
          </h1>
          
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed mb-10">
            {t.home.heroDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href={`/${locale}/ai/llm/temperature`}
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              {t.home.startLearning}
              <ArrowRight size={18} />
            </Link>
            <Link 
              href="#topics" 
              className="btn-secondary inline-flex items-center gap-2"
            >
              {t.home.browseTopics}
            </Link>
          </div>
        </motion.header>

        {/* Blog Banner */}
        <motion.section variants={itemVariants} className="mb-12">
          <a
            href="https://blog.logge.top"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#d90429]/10 via-surface to-[#d90429]/5 border border-[#d90429]/20 hover:border-[#d90429]/40 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d90429] to-[#d90429]/70 p-0.5 shrink-0">
              <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                <Newspaper size={20} className="text-[#d90429]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-text group-hover:text-[#d90429] transition-colors font-heading">LMF Blog</h3>
              <p className="text-sm text-muted">Latest AI news, model analysis, and deep dives</p>
            </div>
            <ArrowRight size={18} className="text-muted group-hover:text-[#d90429] transition-colors shrink-0 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.section>

        {/* Feature Cards */}
        <motion.section variants={itemVariants} className="mb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.titleKey}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                    <feature.icon size={22} className="text-text" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2 font-heading">{t.features[feature.titleKey]}</h3>
                <p className="text-sm text-muted leading-relaxed">{t.features[feature.descKey]}</p>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recently Updated */}
        <motion.section variants={itemVariants} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5">
              <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                <Clock size={18} className="text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading text-text">{t.common.recentlyUpdated}</h2>
              <p className="text-sm text-muted">{t.common.whatsNew}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {(() => {
              // Build a flat lookup of id → path from canonical topics
              const pathMap: Record<string, string> = {}
              for (const topic of flattenTopics()) {
                if (topic.path) pathMap[topic.id] = topic.path
              }
              const recent = Object.entries(TOPIC_DATES)
                .sort(([, a], [, b]) => b.localeCompare(a))
                .slice(0, 5)
              return recent.map(([id, date]) => (
                <Link
                  key={id}
                  href={`/${locale}${pathMap[id] || ''}`}
                  className="group p-3 md:p-4 rounded-xl bg-gradient-to-br from-surface to-surface-elevated border border-border hover:border-primary/40 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <DifficultyBadge topicId={id} />
                    <span className="text-[10px] text-subtle">{formatTopicDate(date, locale)}</span>
                  </div>
                  <span className="text-sm font-medium text-text group-hover:text-primary-light transition-colors block mb-1">
                    {t.topicNames[id as keyof typeof t.topicNames] || id}
                  </span>
                  {t.topicDescriptions?.[id as keyof typeof t.topicDescriptions] && (
                    <span className="text-xs text-muted block line-clamp-2">
                      {t.topicDescriptions[id as keyof typeof t.topicDescriptions]}
                    </span>
                  )}
                </Link>
              ))
            })()}
          </div>
        </motion.section>

        {/* Topic Cards */}
        <motion.section variants={itemVariants} id="topics" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5">
              <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                <BookOpen size={18} className="text-primary-light" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading text-text">{t.home.exploreTopics}</h2>
              <p className="text-sm text-muted">{t.home.diveIntoLessons}</p>
            </div>
          </div>

          <div className="space-y-6">
            {topicData.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + categoryIndex * 0.1 }}
                className="rounded-2xl bg-surface/50 border border-border overflow-hidden"
              >
                {/* Category Header */}
                <div className="px-6 py-4 bg-surface-elevated border-b border-border flex items-center gap-3">
                  <Cpu size={18} className="text-primary" />
                  <h3 className="font-semibold text-text font-heading">{t.categories[category.categoryKey as keyof typeof t.categories]}</h3>
                </div>
                
                {/* Topics Grid */}
                <div className="p-4">
                  {category.children?.map((topic) => (
                    <div key={topic.id} className="mb-6 last:mb-0">
                      <div className="flex items-center gap-2 px-3 py-2 text-muted text-sm font-semibold">
                        <MessageSquare size={14} />
                        <span>{t.categories[topic.nameKey as keyof typeof t.categories]}</span>
                      </div>
                      {/* Check if children have paths (flat) or more children (nested) */}
                      {topic.children?.[0] && hasPath(topic.children[0]) ? (
                        // Flat structure - render directly
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-3">
                          {topic.children?.filter(hasPath).map((subtopic, idx) => (
                            <Link
                              key={subtopic.id}
                              href={`/${locale}${subtopic.path}`}
                              className="group relative flex items-center gap-3 p-4 rounded-xl bg-background border border-border hover:border-primary/40 hover:bg-surface-elevated transition-all duration-200"
                            >
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                                <span className="text-xs font-mono text-primary-light font-medium">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-text group-hover:text-primary-light transition-colors block">
                                  {t.topicNames[subtopic.id as keyof typeof t.topicNames]}
                                </span>
                                {t.topicDescriptions?.[subtopic.id as keyof typeof t.topicDescriptions] && (
                                  <span className="text-xs text-muted block mt-0.5 line-clamp-1">
                                    {t.topicDescriptions[subtopic.id as keyof typeof t.topicDescriptions]}
                                  </span>
                                )}
                                {TOPIC_DATES[subtopic.id] && (
                                  <span className="text-[10px] text-subtle block mt-0.5">
                                    {formatTopicDate(TOPIC_DATES[subtopic.id], locale)}
                                  </span>
                                )}
                              </div>
                              <DifficultyBadge topicId={subtopic.id} />
                              <ArrowRight size={14} className="text-muted group-hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all" />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        // Nested structure - render subcategories
                        <div className="space-y-4 pl-3">
                          {(topic.children as TopicSubcategory[])?.map((subcategory) => (
                            <div key={subcategory.id}>
                              <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-subtle uppercase tracking-wide">
                                <span>{t.topicNames[subcategory.nameKey as keyof typeof t.topicNames]}</span>
                              </div>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {subcategory.children?.map((item, idx) => (
                                  <Link
                                    key={item.id}
                                    href={`/${locale}${item.path}`}
                                    className="group relative flex items-center gap-3 p-4 rounded-xl bg-background border border-border hover:border-primary/40 hover:bg-surface-elevated transition-all duration-200"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                                      <span className="text-xs font-mono text-primary-light font-medium">
                                        {String(idx + 1).padStart(2, '0')}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm font-medium text-text group-hover:text-primary-light transition-colors block">
                                        {t.topicNames[item.id as keyof typeof t.topicNames]}
                                      </span>
                                      {t.topicDescriptions?.[item.id as keyof typeof t.topicDescriptions] && (
                                        <span className="text-xs text-muted block mt-0.5 line-clamp-1">
                                          {t.topicDescriptions[item.id as keyof typeof t.topicDescriptions]}
                                        </span>
                                      )}
                                      {TOPIC_DATES[item.id] && (
                                        <span className="text-[10px] text-subtle block mt-0.5">
                                          {formatTopicDate(TOPIC_DATES[item.id], locale)}
                                        </span>
                                      )}
                                    </div>
                                    <DifficultyBadge topicId={item.id} />
                                    <ArrowRight size={14} className="text-muted group-hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contribute CTA */}
        <motion.section variants={itemVariants} className="mt-16">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-secondary/10 border border-primary/20 p-8 md:p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 mx-auto mb-5">
              <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                <Github size={24} className="text-primary-light" />
              </div>
            </div>
            <h2 className="text-2xl font-bold font-heading text-text mb-3">{t.common.helpMakeThisBetter}</h2>
            <p className="text-muted max-w-lg mx-auto mb-6 leading-relaxed">
              {t.common.helpMakeThisBetterDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://github.com/LoggeL/learn-guide/issues/new?template=topic_request.md&title=%5BTopic%5D+"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <MessageSquare size={16} />
                {t.common.requestATopic}
              </a>
              <a
                href="https://github.com/LoggeL/learn-guide/issues/new?template=bug_report.md&title=%5BBug%5D+"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                {t.common.reportABug}
              </a>
              <a
                href="https://github.com/LoggeL/learn-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-text transition-colors"
              >
                <Github size={16} />
                {t.common.starOnGithub}
              </a>
            </div>
          </div>
        </motion.section>

        {/* Keyboard Shortcut Hint */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-surface border border-border text-sm text-muted">
            <span>{t.common.proTip}</span>
            <kbd className="px-2 py-1 bg-background rounded-md text-xs font-mono text-text border border-border">
              Ctrl+K
            </kbd>
            <span>{t.common.toSearchTopics}</span>
          </div>
        </motion.div>

        {/* LMF Branding Footer */}
        <motion.footer 
          variants={itemVariants}
          className="mt-20 pt-8 border-t border-border"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <a 
              href="https://lmf.logge.top" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <svg 
                viewBox="0 0 2510 1500" 
                className="w-10 h-6 text-[#d90429] group-hover:text-primary-light transition-colors"
                fill="currentColor"
              >
                <path d="M60 1387c0-4 174-779 210-932l51-222 21-93h129c71 0 129 1 129 3l-49 218c-144 634-172 756-177 772l-5 17h121v13c0 6-12 60-27 120l-28 107H248c-104 0-188-1-188-3zM622 858l139-625 21-93h288l2 238 3 237 141-235 140-235 163-3 163-3-4 13c-3 7-49 212-103 456l-98 442h-275l4-17c38-164 74-327 72-329-2-1-43 76-93 172l-90 174H900l-2-166-3-166-74 336-74 336H503l119-532z"/>
                <path d="M810 1381c0-16 48-210 55-221l6-10h1280l-5 18-27 120-22 102H810v-9zM1550 1048l69-308 68-305 328-3 327-2-5 13c-2 7-15 59-27 115l-23 102h-414l-37 173-43 195-5 22h-119c-65 0-119-1-119-2zM1714 318l22-105 16-73h650l-5 23-23 105-17 82h-649l6-32z"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-xs text-subtle group-hover:text-muted transition-colors">
                  {t.common.projectBy}
                </span>
                <span className="text-sm font-semibold text-muted group-hover:text-text transition-colors">
                  LMF
                </span>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/LoggeL/learn-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-subtle hover:text-text transition-colors"
              >
                <Github size={14} />
                <span className="text-xs">GitHub</span>
              </a>
              <a
                href="https://t.me/LMFUpdates"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-subtle hover:text-[#26A5E4] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                <span className="text-xs">Updates</span>
              </a>
            </div>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  )
}
