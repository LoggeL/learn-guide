/**
 * Translation validation script
 * Ensures all translation keys in English exist in German and vice versa
 * Run with: npx tsx scripts/check-translations.ts
 */

import { en } from '../src/lib/i18n/dictionaries/en'
import { de } from '../src/lib/i18n/dictionaries/de'

type NestedObject = { [key: string]: string | NestedObject }

function getAllKeys(obj: NestedObject, prefix = ''): string[] {
  const keys: string[] = []

  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllKeys(value as NestedObject, fullKey))
    } else {
      keys.push(fullKey)
    }
  }

  return keys
}

function checkTranslations() {
  const enKeys = new Set(getAllKeys(en as unknown as NestedObject))
  const deKeys = new Set(getAllKeys(de as unknown as NestedObject))

  const missingInDe: string[] = []
  const missingInEn: string[] = []

  // Check for keys missing in German
  for (const key of enKeys) {
    if (!deKeys.has(key)) {
      missingInDe.push(key)
    }
  }

  // Check for keys missing in English (extra keys in German)
  for (const key of deKeys) {
    if (!enKeys.has(key)) {
      missingInEn.push(key)
    }
  }

  let hasErrors = false

  if (missingInDe.length > 0) {
    hasErrors = true
    console.error('\n❌ Missing translations in German (de.ts):')
    console.error('─'.repeat(50))
    for (const key of missingInDe.sort()) {
      console.error(`  • ${key}`)
    }
  }

  if (missingInEn.length > 0) {
    hasErrors = true
    console.error('\n❌ Extra keys in German not in English (de.ts):')
    console.error('─'.repeat(50))
    for (const key of missingInEn.sort()) {
      console.error(`  • ${key}`)
    }
  }

  if (hasErrors) {
    console.error('\n')
    console.error('═'.repeat(50))
    console.error('Translation check FAILED')
    console.error(`  • ${missingInDe.length} key(s) missing in German`)
    console.error(`  • ${missingInEn.length} extra key(s) in German`)
    console.error('═'.repeat(50))
    console.error('\nPlease ensure all translations are synchronized.')
    console.error('See CLAUDE.md for instructions on adding translations.\n')
    process.exit(1)
  }

  console.log('\n✅ Translation check passed!')
  console.log(`   ${enKeys.size} keys verified in both languages.\n`)
}

checkTranslations()
