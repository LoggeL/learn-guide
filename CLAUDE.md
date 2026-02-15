# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Full i18n checks + Next.js build (fails on any i18n issues)
npm start            # Start production server
npm run lint         # Run ESLint
npm run check-translations  # Verify EN/DE translation key parity
npm run check-hardcoded     # Detect hardcoded English text in pages/components
npm run check-i18n          # Run both i18n checks (translations + hardcoded)
```

## Architecture

Next.js 14 App Router with locale-based routing (`/[locale]/...`). All pages are client components using `'use client'` directive.

### Key Directories
- `src/app/[locale]/ai/` - Topic pages organized by category (agents, llm, ml-fundamentals, prompting, safety)
- `src/components/interactive/` - Visualizers and demos (exported via barrel file `index.ts`)
- `src/components/layout/` - TopicLayout, Sidebar
- `src/lib/i18n/dictionaries/` - Translation files (en.ts, de.ts)

### URL Routing

Middleware auto-redirects `/ai/llm/tokenization` → `/en/ai/llm/tokenization` based on browser language. Links in code use paths without locale prefix (e.g., `/ai/llm/tokenization`); `TopicLayout.localizeHref()` adds the prefix.

### Topic Metadata Requirements

Every leaf topic in `topics.ts` **MUST** have:
- `difficulty: Difficulty` — one of `'beginner' | 'intermediate' | 'expert'` (NO `'advanced'`)
- `lastUpdated: string` — ISO date `'YYYY-MM-DD'` of the last content change

These are enforced by TypeScript (the `TopicLeaf` type). The build will fail if either is missing.

When modifying a topic page, **always update its `lastUpdated` date** in `topics.ts`.

### Adding New Topics - Five Files Must Stay In Sync

When adding new topics/pages, update ALL FIVE:

1. **`src/lib/topics.ts`** - Canonical topic registry (id, name, path)
2. **`src/components/layout/Sidebar.tsx`** - `topicTree` constant for navigation
3. **`src/app/[locale]/page.tsx`** - `topicData` constant for home page grid
4. **`src/lib/i18n/dictionaries/en.ts`** - English translations
5. **`src/lib/i18n/dictionaries/de.ts`** - German translations

### i18n Requirements

**STRICT: Build fails if any user-visible text is not translated.**

Every new topic needs translations in BOTH files:
- `src/lib/i18n/dictionaries/en.ts`
- `src/lib/i18n/dictionaries/de.ts`

Add entries to:
- `topicNames` - Sidebar/navigation display names
- `categories` - Category names (if new category)
- Topic-specific section (e.g., `evaluation: { title, description, ... }`)

**Build checks (run automatically on `npm run build`):**
- `check-translations` - Ensures all keys exist in both EN and DE

All text in pages and components MUST use the translation system:
```tsx
// ❌ WRONG - will fail build
<h2>Context Window</h2>
<p>Click to see example</p>

// ✅ CORRECT - uses translation system
<h2>{t.context.title}</h2>
<p>{t.context.clickToSee}</p>
```

## Git Commits

**Every commit MUST have a proper message with description and context.**

```bash
# ❌ WRONG - lazy one-liner
git commit -m "update world models page"

# ✅ CORRECT - title + body with what changed and why
git commit -m "feat: overhaul World Models page with rich SVGs and interactive toggle

- Add 3 SVG visualizations (Pipeline, Sim-to-Real, Training Loop)
- Add interactive Training Comparison toggle (real vs simulated)
- Expand examples to 6 cards (Cosmos, Genie 2, UniSim, GAIA-1, Genesis, DreamerV3)
- Add Future of World Models section with Yann LeCun quote
- Update EN and DE i18n dictionaries with all new keys
- Remove old emoji-based InfoBox/ExampleCard components"
```

Rules:
- **Title**: `type: short summary` (feat/fix/refactor/docs/chore)
- **Body**: bullet list of key changes (what + why)
- **Always run `npm run build`** before committing to catch i18n/type errors
- **Never force-push** to main

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
