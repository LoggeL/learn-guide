'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, Flame, Compass } from 'lucide-react'
import { useLocale, useTranslation } from '@/lib/i18n/context'

export default function NotFoundPage() {
  const { locale } = useLocale()
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto min-h-[70vh] flex items-center">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-amber-500/10 p-6 md:p-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-300 mb-4">
          <AlertTriangle size={14} />
          <span>{t.notFound.badge}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-3">
          {t.notFound.title}
        </h1>
        <p className="text-muted leading-relaxed mb-6">
          {t.notFound.description}
        </p>

        <div className="grid md:grid-cols-3 gap-3 mb-6">
          {[t.notFound.joke1, t.notFound.joke2, t.notFound.joke3].map((joke, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface/70 p-4 text-sm text-text leading-relaxed">
              <div className="flex items-center gap-2 text-primary-light mb-2">
                <Flame size={14} />
                <span className="text-xs">Chaos Log #{i + 1}</span>
              </div>
              {joke}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/15 px-4 py-2 text-sm font-medium text-primary-light hover:bg-primary/20 transition-colors"
          >
            <Home size={16} />
            {t.notFound.goHome}
          </Link>
          <Link
            href={`/${locale}/ai/industry/logges-favourite-model`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-elevated transition-colors"
          >
            <Compass size={16} />
            {t.notFound.exploreFavorite}
          </Link>
          <Link
            href={`/${locale}/ai/llm/temperature`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-elevated transition-colors"
          >
            <Compass size={16} />
            {t.notFound.exploreTemperature}
          </Link>
        </div>

        <p className="text-xs text-muted">{t.notFound.hint}</p>
      </motion.section>
    </div>
  )
}
