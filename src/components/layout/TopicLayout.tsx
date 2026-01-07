import { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TopicLayoutProps {
  title: string
  description: string
  breadcrumbs: { label: string; href?: string }[]
  prevTopic?: { label: string; href: string }
  nextTopic?: { label: string; href: string }
  children: ReactNode
}

export function TopicLayout({
  title,
  description,
  breadcrumbs,
  prevTopic,
  nextTopic,
  children,
}: TopicLayoutProps) {
  return (
    <div className="max-w-4xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-border">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-text">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-primary text-glow mb-3">{title}</h1>
        <p className="text-muted text-lg leading-relaxed">{description}</p>
      </header>

      {/* Content */}
      <article className="space-y-10">{children}</article>

      {/* Navigation */}
      <footer className="mt-16 pt-8 border-t border-border flex justify-between">
        {prevTopic ? (
          <Link
            href={prevTopic.href}
            className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
          >
            <ChevronLeft size={18} />
            <span>{prevTopic.label}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextTopic && (
          <Link
            href={nextTopic.href}
            className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
          >
            <span>{nextTopic.label}</span>
            <ChevronRight size={18} />
          </Link>
        )}
      </footer>
    </div>
  )
}
