import Link from 'next/link'
import { topics } from '@/lib/topics'

export default function Home() {
  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-primary text-glow mb-4">
          Learn AI Concepts
        </h1>
        <p className="text-muted text-lg">
          Interactive explorations of artificial intelligence and large language model concepts.
          Each topic features hands-on demos to build intuition.
        </p>
      </div>

      <div className="space-y-8">
        {topics.map((category) => (
          <div key={category.id} className="border border-border rounded-lg p-6 bg-surface">
            <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">&gt;</span>
              {category.name}
            </h2>
            <div className="grid gap-3">
              {category.children?.map((topic) => (
                <div key={topic.id} className="pl-4">
                  <h3 className="text-lg text-text mb-2">{topic.name}</h3>
                  {topic.children?.map((subtopic) => (
                    <Link
                      key={subtopic.id}
                      href={subtopic.path || '#'}
                      className="block pl-4 py-2 text-muted hover:text-primary hover:bg-background/50 rounded transition-colors"
                    >
                      <span className="text-border mr-2">├─</span>
                      {subtopic.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border border-border rounded-lg p-6 bg-surface/50">
        <p className="text-muted text-sm">
          <span className="text-primary">TIP:</span> Use the sidebar to navigate topics.
          Press <kbd className="px-2 py-1 bg-background rounded text-xs">Ctrl+K</kbd> to search.
        </p>
      </div>
    </div>
  )
}
