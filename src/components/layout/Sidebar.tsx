'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Search, BookOpen, X } from 'lucide-react'
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
          'flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors',
          isActive
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-surface text-muted hover:text-text'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronRight size={14} />
          </motion.div>
        )}
        {!hasChildren && <span className="w-3.5" />}
        {topic.path ? (
          <Link href={topic.path} className="flex-1 text-sm">
            {topic.name}
          </Link>
        ) : (
          <span className="flex-1 text-sm font-medium">{topic.name}</span>
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
      <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col z-40">
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <BookOpen size={20} />
            <span className="font-bold">Learn AI</span>
          </Link>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 text-sm text-muted bg-background rounded border border-border hover:border-primary/50 transition-colors"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="text-xs bg-surface px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>

        <nav className="flex-1 overflow-auto p-3">
          {topics.map((topic) => (
            <TopicNode key={topic.id} topic={topic} />
          ))}
        </nav>

        <div className="p-3 border-t border-border text-xs text-muted">
          <span className="text-primary">v0.1.0</span> • Interactive Guide
        </div>
      </aside>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24"
            onClick={() => {
              setSearchOpen(false)
              setSearchQuery('')
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-surface border border-border rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search size={18} className="text-muted" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-text placeholder:text-muted"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="p-1 hover:bg-background rounded"
                >
                  <X size={16} className="text-muted" />
                </button>
              </div>
              <div className="max-h-80 overflow-auto p-2">
                {searchQuery === '' ? (
                  <p className="text-muted text-sm p-3">Start typing to search...</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-muted text-sm p-3">No results found</p>
                ) : (
                  searchResults.map((topic) => (
                    <Link
                      key={topic.id}
                      href={topic.path!}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="block px-3 py-2 rounded hover:bg-background text-text"
                    >
                      {topic.name}
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
