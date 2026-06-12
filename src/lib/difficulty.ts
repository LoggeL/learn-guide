import { flattenTopics } from './topics'

export type Difficulty = 'beginner' | 'intermediate' | 'expert'

export const DIFFICULTY_STYLES: Record<Difficulty, { label: string; color: string; bg: string; border: string }> = {
  beginner:     { label: 'B', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  intermediate: { label: 'I', color: 'text-amber-400',   bg: 'bg-amber-500/15',   border: 'border-amber-500/30' },
  expert:       { label: 'E', color: 'text-red-400',     bg: 'bg-red-500/15',     border: 'border-red-500/30' },
}

/**
 * Topic id → difficulty rating.
 * Derived from the canonical `difficulty` metadata in topics.ts — do not edit by hand.
 */
export const TOPIC_DIFFICULTY: Record<string, Difficulty> = Object.fromEntries(
  flattenTopics()
    .filter((topic) => topic.path && topic.difficulty)
    .map((topic) => [topic.id, topic.difficulty as Difficulty])
)
