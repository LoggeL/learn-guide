'use client'

import { useEffect, useState, useRef } from 'react'
import { List } from 'lucide-react'

interface TocEntry {
  id: string
  text: string
}

interface RightTableOfContentsProps {
  articleRef: React.RefObject<HTMLElement | null>
  variant?: 'mobile' | 'desktop'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

export function RightTableOfContents({ articleRef, variant }: RightTableOfContentsProps) {
  const [entries, setEntries] = useState<TocEntry[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const activePillRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const article = articleRef.current
    if (!article) return

    const headings = Array.from(article.querySelectorAll('h2'))
    const collected: TocEntry[] = []

    headings.forEach((el) => {
      let id = el.id
      if (!id) {
        id = slugify(el.textContent ?? '')
        el.id = id
      }
      if (id) collected.push({ id, text: el.textContent ?? '' })
    })

    setEntries(collected)
  }, [articleRef])

  useEffect(() => {
    if (entries.length === 0) return
    observerRef.current?.disconnect()

    const observer = new IntersectionObserver(
      (obs) => {
        const visible = obs
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )

    entries.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    observerRef.current = observer
    return () => observer.disconnect()
  }, [entries])

  // Scroll active pill into view on mobile
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeId])

  if (entries.length < 2) return null

  if (variant === 'mobile') {
    return (
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-2 mb-8 bg-background/90 backdrop-blur-sm border-b border-border/50">
        <nav aria-label="Table of contents" className="overflow-x-auto scrollbar-none">
          <ul className="flex gap-1.5 w-max">
            {entries.map(({ id, text }) => {
              const isActive = activeId === id
              return (
                <li key={id} className="shrink-0">
                  <a
                    ref={isActive ? activePillRef : null}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`block text-xs px-3 py-1.5 rounded-full border transition-all duration-150 whitespace-nowrap ${
                      isActive
                        ? 'border-primary/60 text-primary-light bg-primary/10 font-medium'
                        : 'border-border text-muted hover:text-text hover:border-border/80 hover:bg-surface/50'
                    }`}
                  >
                    {text}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    )
  }

  return (
    <aside className="hidden xl:block xl:col-start-2">
      <div className="fixed top-8 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 w-[200px]">
        <div className="flex items-center gap-2 mb-3 px-1">
          <List size={13} className="text-subtle shrink-0" />
          <span className="text-xs font-semibold text-gradient uppercase tracking-widest">On this page</span>
        </div>
        <nav aria-label="Table of contents">
          <ul className="flex flex-col gap-0.5">
            {entries.map(({ id, text }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`block text-xs py-1.5 px-2 rounded-r border-l-2 transition-all duration-150 leading-snug ${
                    activeId === id
                      ? 'border-primary text-primary-light font-medium bg-primary/5'
                      : 'border-transparent text-muted hover:text-text hover:border-border hover:bg-surface/50'
                  }`}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
