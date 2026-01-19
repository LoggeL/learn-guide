import { en, type Dictionary } from './dictionaries/en'
import { de } from './dictionaries/de'
import { type Locale } from './config'

const dictionaries: Record<Locale, Dictionary> = {
  en,
  de,
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en
}

export type { Dictionary }
export * from './config'
