/**
 * Topic metadata validation script
 * Ensures every leaf topic in topics.ts has entries in:
 *   - TOPIC_DATES (dates.ts)
 *   - TOPIC_DIFFICULTY (difficulty.ts)
 *   - topicDescriptions in EN and DE translations
 * Run with: npx tsx scripts/check-topic-metadata.ts
 */

import { flattenTopics } from '../src/lib/topics'
import { TOPIC_DATES } from '../src/lib/dates'
import { TOPIC_DIFFICULTY } from '../src/lib/difficulty'
import { en } from '../src/lib/i18n/dictionaries/en'
import { de } from '../src/lib/i18n/dictionaries/de'

function checkTopicMetadata() {
  const leafTopics = flattenTopics()
  const errors: string[] = []

  for (const topic of leafTopics) {
    if (!TOPIC_DATES[topic.id]) {
      errors.push(`Missing in TOPIC_DATES (src/lib/dates.ts): '${topic.id}'`)
    }
    if (!TOPIC_DIFFICULTY[topic.id]) {
      errors.push(`Missing in TOPIC_DIFFICULTY (src/lib/difficulty.ts): '${topic.id}'`)
    }
    if (!(en.topicDescriptions as Record<string, string>)[topic.id]) {
      errors.push(`Missing in topicDescriptions (en.ts): '${topic.id}'`)
    }
    if (!(de.topicDescriptions as Record<string, string>)[topic.id]) {
      errors.push(`Missing in topicDescriptions (de.ts): '${topic.id}'`)
    }
  }

  if (errors.length > 0) {
    console.error('\n❌ Topic metadata check FAILED:')
    console.error('─'.repeat(60))
    for (const err of errors) {
      console.error(`  • ${err}`)
    }
    console.error('\n' + '═'.repeat(60))
    console.error(`${errors.length} missing entry/entries found.`)
    console.error('Every leaf topic needs: TOPIC_DATES, TOPIC_DIFFICULTY, and topicDescriptions (EN + DE).')
    console.error('═'.repeat(60) + '\n')
    process.exit(1)
  }

  console.log(`\n✅ Topic metadata check passed! ${leafTopics.length} topics verified.\n`)
}

checkTopicMetadata()
