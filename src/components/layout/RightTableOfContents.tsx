'use client'

import { useEffect, useState, useRef } from 'react'
import { List } from 'lucide-react'

interface TocEntry {
  id: string
  text: string
}

interface RightTableOfContentsProps {
  articleRef: React.RefObject<HTMLElement | null>
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

export function RightTableOfContents({ articleRef }: RightTableOfContentsProps) {
  const [entries, setEntries] = useState<TocEntry[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

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

  if (entries.length < 2) return null

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-8 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
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
