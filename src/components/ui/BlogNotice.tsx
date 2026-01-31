'use client'

import { Clock, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export function BlogNotice() {
  const { t } = useTranslation()

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
      <div className="flex items-start gap-3">
        <Clock size={18} className="text-purple-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-muted">
            {t.common.timeSensitiveNotice}
          </p>
          <a
            href="https://blog.logge.top"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 mt-2 transition-colors"
          >
            {t.common.latestUpdates}
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
