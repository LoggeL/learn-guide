'use client'

import { useEffect, useState, useRef } from 'react'
import { List, ChevronDown } from 'lucide-react'

interface TocEntry {
  id: string
  text: string
}

interface TableOfContentsProps {
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

export function TableOfContents({ articleRef }: TableOfContentsProps) {
  const [entries, setEntries] = useState<TocEntry[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Scan h2s and assign ids after mount
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

  // Intersection observer for active section
  useEffect(() => {
    if (entries.length === 0) return

    observerRef.current?.disconnect()

    const observer = new IntersectionObserver(
      (obs) => {
        // Find the topmost visible heading
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

  if (entries.length < 3) return null

  return (
    <nav className="mb-10 rounded-xl border border-border bg-surface/50 overflow-hidden">
      {/* Header row — toggle on mobile */}
      <button
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-muted hover:text-text transition-colors md:cursor-default"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <List size={15} className="shrink-0 text-subtle" />
          <span className="text-gradient font-semibold">Contents</span>
        </span>
        <ChevronDown
          size={15}
          className={`text-subtle transition-transform md:hidden ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Entry list */}
      <ul
        className={`px-4 pb-3 flex flex-col gap-1 ${open ? 'block' : 'hidden'} md:flex`}
      >
        {entries.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                setOpen(false)
              }}
              className={`block text-sm py-0.5 pl-3 border-l-2 transition-colors ${
                activeId === id
                  ? 'border-primary text-primary-light font-medium'
                  : 'border-transparent text-muted hover:text-text hover:border-border'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
