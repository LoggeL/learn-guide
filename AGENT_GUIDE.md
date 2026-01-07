# Agent Guide: Learn AI Concepts

This document helps AI agents manage and extend this interactive guide.

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with sidebar
│   ├── page.tsx                  # Home page
│   └── [category]/[subcategory]/[topic]/
│       └── page.tsx              # Topic pages
├── components/
│   ├── layout/                   # Layout components
│   │   ├── Sidebar.tsx           # Navigation sidebar with search
│   │   └── TopicLayout.tsx       # Wrapper for topic pages
│   └── interactive/              # Interactive demo components
│       ├── TokenCounter.tsx
│       ├── MemoryFadeVisualizer.tsx
│       ├── ContextRotSimulator.tsx
│       └── index.ts              # Barrel export
└── lib/
    └── topics.ts                 # Topic tree registry
```

## Adding a New Topic

### Step 1: Register the Topic

Edit `src/lib/topics.ts` to add your topic to the tree:

```typescript
export const topics: Topic[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    children: [
      {
        id: 'llm',
        name: 'Large Language Models',
        children: [
          { id: 'context-rot', name: 'Context Rot', path: '/ai/llm/context-rot' },
          { id: 'your-new-topic', name: 'Your New Topic', path: '/ai/llm/your-new-topic' },  // Add here
        ],
      },
    ],
  },
]
```

### Step 2: Create the Page

Create the corresponding page file:

```
src/app/ai/llm/your-new-topic/page.tsx
```

Use this template:

```tsx
import { TopicLayout } from '@/components/layout/TopicLayout'
// Import any interactive components you need

export const metadata = {
  title: 'Your Topic Title | Learn AI',
  description: 'Brief description for SEO',
}

export default function YourTopicPage() {
  return (
    <TopicLayout
      title="Your Topic Title"
      description="A longer description explaining what this topic covers."
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'LLM', href: '/' },
        { label: 'Your Topic Title' },
      ]}
      prevTopic={{ label: 'Context Rot', href: '/ai/llm/context-rot' }}
      nextTopic={{ label: 'Next Topic', href: '/ai/llm/next-topic' }}
    >
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Section Title</h2>
        {/* Content here */}
      </section>
    </TopicLayout>
  )
}
```

## Adding New Categories

To add a new top-level category (e.g., "Machine Learning"):

1. Add to `topics.ts`:
```typescript
{
  id: 'ml',
  name: 'Machine Learning',
  children: [
    {
      id: 'supervised',
      name: 'Supervised Learning',
      children: [
        { id: 'regression', name: 'Regression', path: '/ml/supervised/regression' },
      ],
    },
  ],
}
```

2. Create the folder structure:
```
src/app/ml/supervised/regression/page.tsx
```

## Styling Conventions

### Colors (Tailwind classes)
- `text-primary` / `bg-primary` - Green (#00ff88) - Primary accent, highlights
- `text-secondary` / `bg-secondary` - Cyan (#00d4ff) - Section headers
- `text-muted` - Gray - Body text, descriptions
- `text-text` - Light gray - Emphasized text
- `bg-surface` - Dark surface for cards
- `bg-background` - Darkest background
- `border-border` - Subtle borders

### Common Patterns

**Info Box:**
```tsx
<div className="p-4 bg-surface border border-border rounded-lg">
  <p className="text-muted">Your content</p>
</div>
```

**Highlighted Box:**
```tsx
<div className="p-4 bg-primary/5 border border-primary/30 rounded-lg">
  <p className="text-text">Important content</p>
</div>
```

**Numbered List:**
```tsx
{items.map((item, i) => (
  <div key={i} className="flex gap-4 p-4 bg-surface border border-border rounded-lg">
    <span className="text-primary font-mono">{String(i + 1).padStart(2, '0')}</span>
    <div>
      <h3 className="text-text font-semibold">{item.title}</h3>
      <p className="text-muted text-sm">{item.desc}</p>
    </div>
  </div>
))}
```

## Creating Interactive Components

1. Create component in `src/components/interactive/`
2. Export from `src/components/interactive/index.ts`
3. Use `'use client'` directive for client-side interactivity
4. See `COMPONENTS.md` for available components and examples

## Build & Deploy

```bash
# Local development (via Docker)
docker build -t learn-guide .
docker run -p 3000:3000 learn-guide

# Deploy via Dokploy
# Push to GitHub, then deploy via dokploy.logge.top
```

## Conventions

- Use TypeScript for all files
- Use Tailwind for styling (no CSS modules)
- Use Framer Motion for animations
- Use Lucide React for icons
- Keep components focused and reusable
- Write clear, educational content
