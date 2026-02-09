'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Search, Sparkles, X, Command, Heart } from 'lucide-react'
import clsx from 'clsx'
import { useTranslation, useLocale } from '@/lib/i18n/context'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

interface Topic {
  id: string
  nameKey: string
  path?: string
  children?: Topic[]
}

// Topic structure with translation keys
const topicTree: Topic[] = [
      {
        id: 'agents',
        nameKey: 'agents',
        children: [
          {
            id: 'agents-core',
            nameKey: 'agents-core',
            children: [
              { id: 'agent-loop', nameKey: 'agent-loop', path: '/ai/agents/loop' },
              { id: 'agent-context', nameKey: 'agent-context', path: '/ai/agents/context' },
            ],
          },
          {
            id: 'agents-building',
            nameKey: 'agents-building',
            children: [
              { id: 'tool-design', nameKey: 'tool-design', path: '/ai/agents/tool-design' },
              { id: 'memory', nameKey: 'memory', path: '/ai/agents/memory' },
              { id: 'skills', nameKey: 'skills', path: '/ai/agents/skills' },
              { id: 'mcp', nameKey: 'mcp', path: '/ai/agents/mcp' },
            ],
          },
          {
            id: 'agents-patterns',
            nameKey: 'agents-patterns',
            children: [
              { id: 'agentic-patterns', nameKey: 'agentic-patterns', path: '/ai/agents/patterns' },
              { id: 'orchestration', nameKey: 'orchestration', path: '/ai/agents/orchestration' },
            ],
          },
          {
            id: 'agents-quality',
            nameKey: 'agents-quality',
            children: [
              { id: 'agent-problems', nameKey: 'agent-problems', path: '/ai/agents/problems' },
              { id: 'agent-security', nameKey: 'agent-security', path: '/ai/agents/security' },
              { id: 'evaluation', nameKey: 'evaluation', path: '/ai/agents/evaluation' },
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
              { id: 'tokenization', nameKey: 'tokenization', path: '/ai/llm/tokenization' },
              { id: 'embeddings', nameKey: 'embeddings', path: '/ai/llm/embeddings' },
              { id: 'attention', nameKey: 'attention', path: '/ai/llm/attention' },
            ],
          },
          {
            id: 'llm-behavior',
            nameKey: 'llm-behavior',
            children: [
              { id: 'temperature', nameKey: 'temperature', path: '/ai/llm/temperature' },
              { id: 'context-rot', nameKey: 'context-rot', path: '/ai/llm/context-rot' },
            ],
          },
          {
            id: 'llm-capabilities',
            nameKey: 'llm-capabilities',
            children: [
              { id: 'rag', nameKey: 'rag', path: '/ai/llm/rag' },
              { id: 'vision', nameKey: 'vision', path: '/ai/llm/vision' },
              { id: 'visual-challenges', nameKey: 'visual-challenges', path: '/ai/llm/visual-challenges' },
              { id: 'agentic-vision', nameKey: 'agentic-vision', path: '/ai/llm/agentic-vision' },
              { id: 'multimodality', nameKey: 'multimodality', path: '/ai/llm/multimodality' },
            ],
          },
          {
            id: 'llm-architecture',
            nameKey: 'llm-architecture',
            children: [
              { id: 'llm-training', nameKey: 'llm-training', path: '/ai/llm/training' },
              { id: 'moe', nameKey: 'moe', path: '/ai/llm/moe' },
              { id: 'quantization', nameKey: 'quantization', path: '/ai/llm/quantization' },
              { id: 'nested-learning', nameKey: 'nested-learning', path: '/ai/llm/nested-learning' },
              { id: 'distillation', nameKey: 'distillation', path: '/ai/llm/distillation' },
              { id: 'speculative-decoding', nameKey: 'speculative-decoding', path: '/ai/llm/speculative-decoding' },
            ],
          },
        ],
      },
      {
        id: 'llm-inference',
        nameKey: 'llm-inference',
        children: [
          { id: 'kv-cache', nameKey: 'kv-cache', path: '/ai/llm-inference/kv-cache' },
          { id: 'batching', nameKey: 'batching', path: '/ai/llm-inference/batching' },
        ],
      },
      {
        id: 'ml-fundamentals',
        nameKey: 'ml-fundamentals',
        children: [
          { id: 'neural-networks', nameKey: 'neural-networks', path: '/ai/ml-fundamentals/neural-networks' },
          { id: 'gradient-descent', nameKey: 'gradient-descent', path: '/ai/ml-fundamentals/gradient-descent' },
          { id: 'training', nameKey: 'training', path: '/ai/ml-fundamentals/training' },
        ],
      },
      {
        id: 'prompting',
        nameKey: 'prompting',
        children: [
          { id: 'prompt-basics', nameKey: 'prompt-basics', path: '/ai/prompting/basics' },
          { id: 'advanced-prompting', nameKey: 'advanced-prompting', path: '/ai/prompting/advanced' },
          { id: 'system-prompts', nameKey: 'system-prompts', path: '/ai/prompting/system-prompts' },
        ],
      },
      {
        id: 'safety',
        nameKey: 'safety',
        children: [
          { id: 'bias', nameKey: 'bias', path: '/ai/safety/bias' },
          { id: 'responsible-ai', nameKey: 'responsible-ai', path: '/ai/safety/responsible-ai' },
        ],
      },
      {
        id: 'industry',
        nameKey: 'industry',
        children: [
          { id: 'european-ai', nameKey: 'european-ai', path: '/ai/industry/european-ai' },
          { id: 'open-source', nameKey: 'open-source', path: '/ai/industry/open-source' },
          { id: 'logges-favourite-model', nameKey: 'logges-favourite-model', path: '/ai/industry/logges-favourite-model' },
        ],
      },
]

function flattenTopics(topicList: Topic[]): Topic[] {
  const result: Topic[] = []
  for (const topic of topicList) {
    if (topic.path) {
      result.push(topic)
    }
    if (topic.children) {
      result.push(...flattenTopics(topic.children))
    }
  }
  return result
}

function hasActivePath(topic: Topic, pathname: string, locale: string): boolean {
  const localePath = topic.path ? `/${locale}${topic.path}` : undefined
  if (localePath === pathname) return true
  if (topic.children) {
    return topic.children.some(child => hasActivePath(child, pathname, locale))
  }
  return false
}

function TopicNode({ 
  topic, 
  level = 0, 
  onNavigate,
  getTopicName,
  locale,
}: { 
  topic: Topic
  level?: number
  onNavigate?: () => void
  getTopicName: (key: string) => string
  locale: string
}) {
  const pathname = usePathname()
  const containsActive = useMemo(() => hasActivePath(topic, pathname, locale), [topic, pathname, locale])
  const [expanded, setExpanded] = useState(containsActive)
  const hasChildren = topic.children && topic.children.length > 0
  const localePath = topic.path ? `/${locale}${topic.path}` : undefined
  const isActive = localePath === pathname
  const isFavourite = topic.id === 'logges-favourite-model'

  // Update expanded state when active path changes (e.g. navigation)
  useEffect(() => {
    if (containsActive) setExpanded(true)
  }, [containsActive])

  const rowClasses = clsx(
    'flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200',
    isActive
      ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary-light border-l-2 border-primary'
      : isFavourite
        ? 'bg-gradient-to-r from-pink-500/10 to-rose-500/5 text-pink-300 hover:from-pink-500/15 hover:to-rose-500/10 border-l-2 border-pink-500/40'
        : 'hover:bg-surface-elevated text-muted hover:text-text'
  )
  const rowStyle = { paddingLeft: `${level * 12 + 12}px` }

  const rowContent = (
    <>
      {hasChildren && (
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-subtle"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setExpanded(!expanded)
          }}
        >
          <ChevronRight size={12} />
        </motion.div>
      )}
      {!hasChildren && !isFavourite && <span className="w-3" />}
      {!hasChildren && isFavourite && <Heart size={12} className="text-pink-400" fill="currentColor" />}
      <span className={clsx('flex-1 text-sm', localePath ? 'font-medium' : 'font-semibold')}>
        {getTopicName(topic.nameKey)}
      </span>
    </>
  )

  return (
    <div>
      {localePath ? (
        <Link
          href={localePath}
          className={rowClasses}
          style={rowStyle}
          onClick={onNavigate}
        >
          {rowContent}
        </Link>
      ) : (
        <div
          className={rowClasses}
          style={rowStyle}
          onClick={() => hasChildren && setExpanded(!expanded)}
        >
          {rowContent}
        </div>
      )}
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {topic.children!.map((child) => (
              <TopicNode 
                key={child.id} 
                topic={child} 
                level={level + 1} 
                onNavigate={onNavigate}
                getTopicName={getTopicName}
                locale={locale}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const getTopicName = (key: string): string => {
    // First check topicNames, then categories
    if (key in t.topicNames) {
      return t.topicNames[key as keyof typeof t.topicNames]
    }
    if (key in t.categories) {
      return t.categories[key as keyof typeof t.categories]
    }
    return key
  }

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed')
    } else {
      document.body.classList.remove('sidebar-collapsed')
    }
  }, [isCollapsed])

  const allTopics = useMemo(() => flattenTopics(topicTree), [])
  
  const searchResults = useMemo(() => {
    if (!searchQuery) return []
    const q = searchQuery.toLowerCase()
    return allTopics.filter((topic) => {
      const name = getTopicName(topic.nameKey).toLowerCase()
      return name.includes(q) || topic.id.includes(q)
    })
  }, [searchQuery, allTopics, t])

  // Reset selected index when search results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchResults])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface border border-border text-muted hover:text-text transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-300',
          'bg-surface/80 backdrop-blur-xl border-r border-border',
          // Desktop behavior
          'hidden md:flex',
          isCollapsed ? 'md:w-16' : 'md:w-72',
          // Mobile behavior - show when open
          isMobileOpen && '!flex w-72'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {(!isCollapsed || isMobileOpen) && (
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
                <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                  <Sparkles size={16} className="text-primary-light" />
                </div>
              </div>
              <div>
                <span className="font-bold text-text font-heading group-hover:text-primary-light transition-colors">
                  {t.common.learnAi}
                </span>
                <p className="text-[10px] text-subtle">{t.common.interactiveGuide}</p>
              </div>
            </Link>
          )}
          {isCollapsed && !isMobileOpen && (
            <Link href={`/${locale}`} className="mx-auto">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
                <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                  <Sparkles size={16} className="text-primary-light" />
                </div>
              </div>
            </Link>
          )}
          {/* Collapse/Expand toggle - desktop only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 hover:bg-surface-elevated rounded-lg text-subtle hover:text-text transition-all"
          >
            <ChevronRight size={16} className={clsx('transition-transform', !isCollapsed && 'rotate-180')} />
          </button>
          {/* Close button - mobile only */}
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-2 hover:bg-surface-elevated rounded-lg text-subtle hover:text-text transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Language Switcher */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="px-3 pt-3">
            <LanguageSwitcher />
          </div>
        )}

        {/* Search Button */}
        <div className={clsx('p-3', isCollapsed && !isMobileOpen && 'flex justify-center')}>
          <button
            onClick={() => setSearchOpen(true)}
            className={clsx(
              'flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-200',
              'bg-background border border-border hover:border-primary/40 hover:bg-surface-elevated',
              isCollapsed && !isMobileOpen ? 'w-10 h-10 justify-center p-0' : 'w-full'
            )}
          >
            <Search size={15} className="text-subtle" />
            {(!isCollapsed || isMobileOpen) && (
              <>
                <span className="flex-1 text-left text-muted">{t.common.search}</span>
                <div className="flex items-center gap-1 text-subtle">
                  <Command size={11} />
                  <span className="text-[10px]">K</span>
                </div>
              </>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={clsx('flex-1 overflow-auto px-3 pb-4', isCollapsed && !isMobileOpen && 'hidden')}>
          <div className="text-[10px] uppercase tracking-widest text-subtle font-semibold px-3 mb-2">
            {t.common.topics}
          </div>
          {topicTree.map((topic) => (
            <TopicNode 
              key={topic.id} 
              topic={topic} 
              onNavigate={() => setIsMobileOpen(false)}
              getTopicName={getTopicName}
              locale={locale}
            />
          ))}
        </nav>

        {/* Footer with LMF branding */}
        <div
          className={clsx(
            'p-4 border-t border-border',
            isCollapsed && !isMobileOpen ? 'text-center' : ''
          )}
        >
          {(!isCollapsed || isMobileOpen) ? (
            <a 
              href="https://lmf.logge.top" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <svg 
                viewBox="0 0 2510 1500" 
                className="w-8 h-5 text-[#d90429] group-hover:text-primary-light transition-colors"
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
          ) : (
            <a 
              href="https://lmf.logge.top" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <svg 
                viewBox="0 0 2510 1500" 
                className="w-8 h-5 mx-auto text-[#d90429] hover:text-primary-light transition-colors"
                fill="currentColor"
              >
                <path d="M60 1387c0-4 174-779 210-932l51-222 21-93h129c71 0 129 1 129 3l-49 218c-144 634-172 756-177 772l-5 17h121v13c0 6-12 60-27 120l-28 107H248c-104 0-188-1-188-3zM622 858l139-625 21-93h288l2 238 3 237 141-235 140-235 163-3 163-3-4 13c-3 7-49 212-103 456l-98 442h-275l4-17c38-164 74-327 72-329-2-1-43 76-93 172l-90 174H900l-2-166-3-166-74 336-74 336H503l119-532z"/>
                <path d="M810 1381c0-16 48-210 55-221l6-10h1280l-5 18-27 120-22 102H810v-9zM1550 1048l69-308 68-305 328-3 327-2-5 13c-2 7-15 59-27 115l-23 102h-414l-37 173-43 195-5 22h-119c-65 0-119-1-119-2zM1714 318l22-105 16-73h650l-5 23-23 105-17 82h-649l6-32z"/>
              </svg>
            </a>
          )}
        </div>
      </aside>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-start justify-center pt-24"
            onClick={() => {
              setSearchOpen(false)
              setSearchQuery('')
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 p-5 border-b border-border">
                <Search size={20} className="text-muted shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder={t.common.searchTopics}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      setSelectedIndex((i) => Math.min(i + 1, searchResults.length - 1))
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      setSelectedIndex((i) => Math.max(i - 1, 0))
                    } else if (e.key === 'Enter' && searchResults.length > 0) {
                      e.preventDefault()
                      const topic = searchResults[selectedIndex]
                      if (topic?.path) {
                        router.push(`/${locale}${topic.path}`)
                        setSearchOpen(false)
                        setSearchQuery('')
                      }
                    }
                  }}
                  className="flex-1 bg-transparent outline-none text-text text-lg placeholder:text-subtle"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="p-2 hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  <X size={18} className="text-muted" />
                </button>
              </div>
              <div className="max-h-80 overflow-auto p-2">
                {searchQuery === '' ? (
                  <div className="p-6 text-center">
                    <p className="text-muted text-sm">{t.common.startTyping}</p>
                    <p className="text-subtle text-xs mt-2">{t.common.trySearching}</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted text-sm">{t.common.noResults} "{searchQuery}"</p>
                  </div>
                ) : (
                  searchResults.map((topic, index) => (
                    <Link
                      key={topic.id}
                      href={`/${locale}${topic.path}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-text transition-colors",
                        index === selectedIndex ? "bg-surface-elevated" : "hover:bg-surface-elevated"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Sparkles size={14} className="text-primary-light" />
                      </div>
                      <span className="font-medium">{getTopicName(topic.nameKey)}</span>
                    </Link>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-border flex items-center justify-between text-xs text-subtle">
                <span>{t.common.pressEsc}</span>
                <span>{t.common.enterToSelect}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
