import { flattenTopics } from './topics'

/**
 * Topic id → last-updated ISO date.
 * Derived from the canonical `lastUpdated` metadata in topics.ts — do not edit by hand.
 */
export const TOPIC_DATES: Record<string, string> = Object.fromEntries(
  flattenTopics()
    .filter((topic) => topic.path && topic.lastUpdated)
    .map((topic) => [topic.id, topic.lastUpdated as string])
)

export function formatTopicDate(dateStr: string, locale: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(
    locale === 'de' ? 'de-DE' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  )
}
