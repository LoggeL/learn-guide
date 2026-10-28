'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

type ResponseFormat = 'concise' | 'detailed'
type Limit = 5 | 10 | null

const TOTAL = 24
const customers = ['Lena Vogt', 'Omar Haddad', 'Mei Tanaka', 'Jonas Berg', 'Ana Ruiz', 'Tomasz Nowak', 'Priya Nair', 'Elif Kaya']
const statuses = ['open', 'pending', 'closed'] as const
const priorities = ['low', 'normal', 'high'] as const
const channels = ['email', 'chat', 'phone'] as const

/** Deterministic UUID-shaped string, so the demo shows the same IDs on every render. */
function pseudoUuid(seed: number) {
  let x = ((seed + 1) * 2654435761) % 2147483648
  let hex = ''
  for (let i = 0; i < 32; i++) {
    x = (x * 1103515245 + 12345) % 2147483648
    hex += (x % 16).toString(16)
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function buildResponse(titles: readonly string[], format: ResponseFormat, limit: Limit, truncationNote: string) {
  const all = Array.from({ length: TOTAL }, (_, i) => {
    const day = String(28 - Math.floor(i / 2)).padStart(2, '0')
    const base = { number: `#${4801 + i}`, title: titles[i % titles.length], status: statuses[i % statuses.length] }
    if (format === 'concise') return { ...base, customer: customers[i % customers.length] }
    return {
      ticket_uuid: pseudoUuid(i),
      ...base,
      priority: priorities[(i * 7) % priorities.length],
      channel: channels[(i * 5) % channels.length],
      customer_name: customers[i % customers.length],
      customer_uuid: pseudoUuid(100 + (i % customers.length)),
      assignee_uuid: pseudoUuid(200 + (i % 3)),
      created_at: `2026-10-${day}T08:${String((i * 13) % 60).padStart(2, '0')}:00Z`,
      updated_at: `2026-10-${day}T16:${String((i * 17) % 60).padStart(2, '0')}:00Z`,
      tags: i % 2 ? ['billing'] : ['account', 'priority-review'],
    }
  })
  const shown = limit === null ? all : all.slice(0, limit)
  const hasMore = shown.length < TOTAL
  return {
    results: shown,
    total: TOTAL,
    has_more: hasMore,
    ...(hasMore ? {
      next_cursor: `c_${shown.length}`,
      note: truncationNote.replace('{shown}', String(shown.length)).replace('{total}', String(TOTAL)),
    } : {}),
  }
}

export function ToolOutputShaper() {
  const { t } = useTranslation()
  const d = t.toolDesign.outputDemo
  const [format, setFormat] = useState<ResponseFormat>('detailed')
  const [limit, setLimit] = useState<Limit>(null)

  const { pretty, chars, maxChars } = useMemo(() => {
    const response = buildResponse(d.ticketTitles, format, limit, d.truncationNote)
    const largest = buildResponse(d.ticketTitles, 'detailed', null, d.truncationNote)
    return {
      pretty: JSON.stringify(response, null, 2),
      chars: JSON.stringify(response).length,
      maxChars: JSON.stringify(largest).length,
    }
  }, [d.ticketTitles, d.truncationNote, format, limit])

  const share = chars / maxChars
  const button = (active: boolean) =>
    `px-3 py-1.5 text-sm font-mono transition-colors ${active ? 'bg-primary/20 text-primary-light' : 'text-muted hover:text-text'}`

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
      <div>
        <h3 className="text-xl font-semibold">{d.title}</h3>
        <p className="text-sm text-muted">{d.desc}</p>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="space-y-2">
          <span className="block text-sm font-mono text-muted">{d.formatLabel}</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(['concise', 'detailed'] as const).map(id => (
              <button key={id} onClick={() => setFormat(id)} aria-pressed={format === id} className={button(format === id)}>{id}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <span className="block text-sm font-mono text-muted">{d.limitLabel}</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {([5, 10, null] as const).map(id => (
              <button key={String(id)} onClick={() => setLimit(id)} aria-pressed={limit === id} className={button(limit === id)}>
                {id === null ? d.limitAll : id}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted">{format === 'concise' ? d.conciseDesc : d.detailedDesc}</p>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-6 text-sm">
          <span><span className="text-muted">{d.charsLabel}: </span><span className="font-mono text-text">{chars.toLocaleString()}</span></span>
          <span><span className="text-muted">{d.tokensLabel}: </span><span className="font-mono text-text">{Math.round(chars / 4).toLocaleString()}</span></span>
          <span className="text-muted"><span className="font-mono text-text">{Math.round(share * 100)} %</span> {d.relativeLabel}</span>
        </div>
        <div className="h-3 rounded-full bg-background border border-border overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-orange-400"
            initial={false}
            animate={{ width: `${Math.max(share * 100, 2)}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <p className="text-xs text-muted">{d.measureNote}</p>
      </div>

      <pre className="max-h-80 overflow-auto rounded bg-background p-3 text-xs font-mono text-muted">{pretty}</pre>
    </div>
  )
}
