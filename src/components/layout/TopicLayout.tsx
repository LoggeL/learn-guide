import { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'

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
    <div className="max-w-4xl relative">
      {/* Ambient background glow */}
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-8">
        <BookOpen size={14} className="text-subtle" />
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={12} className="text-subtle" />}
            {crumb.href ? (
              <Link 
                href={crumb.href} 
                className="hover:text-primary-light transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-text font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight">
          <span className="text-gradient">{title}</span>
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-3xl">
          {description}
        </p>
      </header>

      {/* Content */}
      <article className="space-y-12 relative">
        {children}
      </article>

      {/* Navigation */}
      <footer className="mt-20 pt-8 border-t border-border">
        <div className="flex justify-between items-center">
          {prevTopic ? (
            <Link
              href={prevTopic.href}
              className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-surface border border-border hover:border-primary/40 hover:bg-surface-elevated transition-all"
            >
              <ChevronLeft size={18} className="text-muted group-hover:text-primary transition-colors" />
              <div className="text-left">
                <span className="text-xs text-subtle block">Previous</span>
                <span className="text-text font-medium group-hover:text-primary-light transition-colors">
                  {prevTopic.label}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextTopic && (
            <Link
              href={nextTopic.href}
              className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-surface border border-border hover:border-primary/40 hover:bg-surface-elevated transition-all"
            >
              <div className="text-right">
                <span className="text-xs text-subtle block">Next</span>
                <span className="text-text font-medium group-hover:text-primary-light transition-colors">
                  {nextTopic.label}
                </span>
              </div>
              <ChevronRight size={18} className="text-muted group-hover:text-primary transition-colors" />
            </Link>
          )}
        </div>
      </footer>
    </div>
  )
}
