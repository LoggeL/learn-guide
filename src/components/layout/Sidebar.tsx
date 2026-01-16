'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Search, Sparkles, X, Command } from 'lucide-react'
import { topics, searchTopics, type Topic } from '@/lib/topics'
import clsx from 'clsx'

function TopicNode({ topic, level = 0, onNavigate }: { topic: Topic; level?: number; onNavigate?: () => void }) {
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
          <Link href={topic.path} className="flex-1 text-sm font-medium" onClick={onNavigate}>
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
              <TopicNode key={child.id} topic={child} level={level + 1} onNavigate={onNavigate} />
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
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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
          {isCollapsed && !isMobileOpen && (
            <Link href="/" className="mx-auto">
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
                <span className="flex-1 text-left text-muted">Search...</span>
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
            Topics
          </div>
          {topics.map((topic) => (
            <TopicNode key={topic.id} topic={topic} onNavigate={() => setIsMobileOpen(false)} />
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
                  A project by
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
