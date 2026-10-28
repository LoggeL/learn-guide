'use client'

import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

const K_VALUES = [1, 2, 3, 5, 8]

/** Shows pass@k = 1 − (1 − p)^k and pass^k = p^k for independent trials with success rate p. */
export function PassKExplorer() {
  const { t, locale } = useTranslation()
  const c = t.evaluation.pk
  const id = useId()
  const [p, setP] = useState(0.75)
  const percent = (value: number) => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(value)

  return (
    <div className="rounded-xl bg-background border border-border p-5 space-y-4">
      <h3 className="text-lg font-bold font-heading text-text">{c.title}</h3>
      <div>
        <label htmlFor={`${id}-p`} className="block text-sm text-muted mb-1">
          {c.pLabel}: <span className="font-mono text-text">{percent(p)}</span>
        </label>
        <input id={`${id}-p`} type="range" min={0.05} max={0.99} step={0.01} value={p} onChange={e => setP(Number(e.target.value))} className="w-full accent-cyan-500" />
      </div>
      <div className="flex flex-wrap gap-4 text-xs font-mono">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-cyan-400/80" />{c.atLegend}</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-purple-400/80" />{c.hatLegend}</span>
      </div>
      <div className="space-y-3">
        {K_VALUES.map(k => {
          const at = 1 - Math.pow(1 - p, k)
          const hat = Math.pow(p, k)
          return (
            <div key={k} className="grid grid-cols-[3rem_1fr] gap-3 items-center">
              <span className="text-sm font-mono text-muted">{c.kCol} = {k}</span>
              <div className="space-y-1">
                {[{ value: at, color: 'bg-cyan-400/80' }, { value: hat, color: 'bg-purple-400/80' }].map((bar, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 h-3 rounded bg-surface overflow-hidden">
                      <motion.div className={`h-full ${bar.color}`} animate={{ width: `${bar.value * 100}%` }} transition={{ type: 'spring', stiffness: 160, damping: 24 }} />
                    </div>
                    <span className="w-12 text-right text-xs font-mono text-text">{percent(bar.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
