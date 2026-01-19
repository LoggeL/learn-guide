'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Dictionary } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'

interface LocaleContextValue {
  locale: Locale
  dictionary: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale
  dictionary: Dictionary
  children: ReactNode
}) {
  return (
    <LocaleContext.Provider value={{ locale, dictionary }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

export function useTranslation() {
  const { dictionary, locale } = useLocale()
  return { t: dictionary, locale }
}
