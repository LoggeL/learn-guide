'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Search, Sparkles, X, Command } from 'lucide-react'
import { topics, searchTopics, type Topic } from '@/lib/topics'
import clsx from 'clsx'

function TopicNode({ topic, level = 0 }: { topic: Topic; level?: number }) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)
  const hasChildren = topic.children && topic.children.length > 0
  const isActive = topic.path === pathname

  return (
    <div>
      <div
        className={clsx(
          'flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200',
          isActive
            ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary-light border-l-2 border-primary'
            : 'hover:bg-surface-elevated text-muted hover:text-text'
        )}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="text-subtle"
          >
            <ChevronRight size={12} />
          </motion.div>
        )}
        {!hasChildren && <span className="w-3" />}
        {topic.path ? (
          <Link href={topic.path} className="flex-1 text-sm font-medium">
            {topic.name}
          </Link>
        ) : (
          <span className="flex-1 text-sm font-semibold">{topic.name}</span>
        )}
      </div>
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {topic.children!.map((child) => (
              <TopicNode key={child.id} topic={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed')
    } else {
      document.body.classList.remove('sidebar-collapsed')
    }
  }, [isCollapsed])

  const searchResults = useMemo(
    () => (searchQuery ? searchTopics(searchQuery) : []),
    [searchQuery]
  )

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
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-300',
          'bg-surface/80 backdrop-blur-xl border-r border-border',
          isCollapsed ? 'w-16' : 'w-72'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
                <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                  <Sparkles size={16} className="text-primary-light" />
                </div>
              </div>
              <div>
                <span className="font-bold text-text font-heading group-hover:text-primary-light transition-colors">
                  Learn AI
                </span>
                <p className="text-[10px] text-subtle">Interactive Guide</p>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="mx-auto">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
                <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                  <Sparkles size={16} className="text-primary-light" />
                </div>
              </div>
            </Link>
          )}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-surface-elevated rounded-lg text-subtle hover:text-text transition-all"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <div className={clsx('p-3', isCollapsed && 'flex justify-center')}>
          <button
            onClick={() => setSearchOpen(true)}
            className={clsx(
              'flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-200',
              'bg-background border border-border hover:border-primary/40 hover:bg-surface-elevated',
              isCollapsed ? 'w-10 h-10 justify-center p-0' : 'w-full'
            )}
          >
            <Search size={15} className="text-subtle" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left text-muted">Search...</span>
                <div className="flex items-center gap-1 text-subtle">
                  <Command size={11} />
                  <span className="text-[10px]">K</span>
                </div>
              </>
            )}
          </button>
        </div>

        {/* Collapse button when collapsed */}
        {isCollapsed && (
          <div className="px-3 mb-2">
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full p-2 hover:bg-surface-elevated rounded-lg text-subtle hover:text-text transition-all flex justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className={clsx('flex-1 overflow-auto px-3 pb-4', isCollapsed && 'hidden')}>
          <div className="text-[10px] uppercase tracking-widest text-subtle font-semibold px-3 mb-2">
            Topics
          </div>
          {topics.map((topic) => (
            <TopicNode key={topic.id} topic={topic} />
          ))}
        </nav>

        {/* Footer */}
        <div
          className={clsx(
            'p-4 border-t border-border text-xs',
            isCollapsed ? 'text-center' : ''
          )}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-subtle">v0.1.0</span>
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-success animate-pulse mx-auto" />
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
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <p className="text-muted text-sm">Start typing to search topics...</p>
                    <p className="text-subtle text-xs mt-2">Try "temperature" or "attention"</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted text-sm">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  searchResults.map((topic) => (
                    <Link
                      key={topic.id}
                      href={topic.path!}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-elevated text-text transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Sparkles size={14} className="text-primary-light" />
                      </div>
                      <span className="font-medium">{topic.name}</span>
                    </Link>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-border flex items-center justify-between text-xs text-subtle">
                <span>Press ESC to close</span>
                <span>Enter to select</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
