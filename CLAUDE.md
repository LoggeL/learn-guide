# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Check translations + build (runs check-translations first)
npm run lint         # Run ESLint
npm run check-translations  # Verify EN/DE translation parity
```

## Architecture

Next.js 14 App Router with locale-based routing (`/[locale]/...`). All pages are client components using `'use client'` directive.

### Key Directories
- `src/app/[locale]/ai/` - Topic pages organized by category (agents, llm, ml-fundamentals, prompting, safety)
- `src/components/interactive/` - Visualizers and demos (exported via barrel file `index.ts`)
- `src/components/layout/` - TopicLayout, Sidebar
- `src/lib/i18n/dictionaries/` - Translation files (en.ts, de.ts)

### Adding New Topics - Three Files Must Stay In Sync

When adding new topics/pages, update ALL THREE:

1. **`src/lib/topics.ts`** - Canonical topic registry
2. **`src/components/layout/Sidebar.tsx`** - `topicTree` constant for navigation
3. **`src/app/[locale]/page.tsx`** - `topicData` constant for home page grid

### i18n Requirements

Every new topic needs translations in BOTH files:
- `src/lib/i18n/dictionaries/en.ts`
- `src/lib/i18n/dictionaries/de.ts`

Add entries to:
- `topicNames` - Sidebar/navigation display names
- `categories` - Category names (if new category)
- Topic-specific section (e.g., `evaluation: { title, description, ... }`)

The build will fail if translations are missing or out of sync.

## Styling

Tailwind CSS with custom theme. Key classes:
- `text-gradient` - Primary gradient text
- `bg-surface` / `bg-surface-elevated` - Card backgrounds
- `bg-background` - Page background
- `text-text` / `text-muted` - Text colors
- `border-border` - Subtle borders
- Color accents: `purple-400`, `cyan-400`, `emerald-400`, `orange-400`

## Interactive Components

All components use:
- `'use client'` directive
- Framer Motion for animations
- TypeScript with proper interfaces
- Export from `src/components/interactive/index.ts`

Pattern for topic pages:
```tsx
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function MyTopicPage() {
  const { t } = useTranslation()
  return (
    <TopicLayout
      title={t.myTopic.title}
      description={t.myTopic.description}
      breadcrumbs={[...]}
      prevTopic={{ label: t.topicNames['prev'], href: '...' }}
      nextTopic={{ label: t.topicNames['next'], href: '...' }}
    >
      {/* sections */}
    </TopicLayout>
  )
}
```
