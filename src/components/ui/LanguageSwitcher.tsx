'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from '@/lib/i18n/context'
import { locales, type Locale } from '@/lib/i18n/config'
import { Globe } from 'lucide-react'

const localeNames: Record<Locale, string> = {
  en: 'EN',
  de: 'DE',
}

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { locale: currentLocale } = useLocale()

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return
    
    // Replace the locale segment in the pathname
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-surface border border-border">
      <Globe size={14} className="text-muted ml-2" />
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-3 py-1.5 text-sm rounded-md transition-all ${
            locale === currentLocale
              ? 'bg-primary/20 text-primary-light font-medium'
              : 'text-muted hover:text-text hover:bg-surface-elevated'
          }`}
        >
          {localeNames[locale]}
        </button>
      ))}
    </div>
  )
}
