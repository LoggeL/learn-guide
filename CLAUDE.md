# Learn Guide - Claude Code Notes

## Important: Topic Navigation Sync

When adding new topics/pages to this project, you must update **three** files to keep navigation in sync:

1. **`src/lib/topics.ts`** - The canonical source of truth for all topics
2. **`src/components/layout/Sidebar.tsx`** - The `topicTree` constant for sidebar navigation and search
3. **`src/app/[locale]/page.tsx`** - The `topicData` constant for the home page topic grid

All three files have their own topic structure that must be kept synchronized. Failing to update all three will result in new pages being accessible via direct URL but not appearing in navigation.

## i18n

When adding new topics, also add translation keys to:
- `src/lib/i18n/dictionaries/en.ts`
- `src/lib/i18n/dictionaries/de.ts`

Add entries to both `topicNames` and `categories` as appropriate.

## Project Structure

- Next.js app with locale-based routing (`/[locale]/...`)
- Interactive components in `src/components/interactive/`
- Topic pages in `src/app/[locale]/ai/...`
