'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'

type Role = 'provider' | 'deployer'
type CategoryId = keyof Dictionary['responsibleAi']['categories']
type ObligationId = keyof Dictionary['responsibleAi']['obligations']

interface Item {
  id: ObligationId
  /** ISO date from which the obligation applies (Regulation (EU) 2024/1689 as amended by 2026/1744). */
  date: string
  roles: Role[]
}

const BOTH: Role[] = ['provider', 'deployer']
const LITERACY: Item = { id: 'literacy', date: '2025-02-02', roles: BOTH }
const HR_PROVIDER: ObligationId[] = ['hrRiskMgmt', 'hrData', 'hrDocs', 'hrOversight', 'hrAccuracy', 'hrConformity', 'hrPostMarket']
const HR_DEPLOYER: ObligationId[] = ['depUse', 'depFria', 'depInform']

function highRisk(date: string): Item[] {
  return [
    LITERACY,
    ...HR_PROVIDER.map(id => ({ id, date, roles: ['provider'] as Role[] })),
    ...HR_DEPLOYER.map(id => ({ id, date, roles: ['deployer'] as Role[] })),
  ]
}

const GPAI_ITEMS: Item[] = [
  { id: 'gpaiDocs', date: '2025-08-02', roles: ['provider'] },
  { id: 'gpaiCopyright', date: '2025-08-02', roles: ['provider'] },
  { id: 'gpaiSummary', date: '2025-08-02', roles: ['provider'] },
  { id: 'gpaiEnforcement', date: '2026-08-02', roles: ['provider'] },
  { id: 'gpaiLegacy', date: '2027-08-02', roles: ['provider'] },
]

const CATEGORY_ITEMS: Record<CategoryId, Item[]> = {
  prohibited: [
    LITERACY,
    { id: 'prohibitedPractices', date: '2025-02-02', roles: BOTH },
    { id: 'prohibitedDeepfakes', date: '2026-12-02', roles: BOTH },
  ],
  highRiskAnnexIII: highRisk('2027-12-02'),
  highRiskAnnexI: highRisk('2028-08-02'),
  transparency: [
    LITERACY,
    { id: 'trChatbot', date: '2026-08-02', roles: ['provider'] },
    { id: 'trMarking', date: '2026-08-02', roles: ['provider'] },
    { id: 'trMarkingLegacy', date: '2026-12-02', roles: ['provider'] },
    { id: 'trEmotion', date: '2026-08-02', roles: ['deployer'] },
    { id: 'trDeepfake', date: '2026-08-02', roles: ['deployer'] },
  ],
  gpai: GPAI_ITEMS,
  gpaiSystemic: [
    ...GPAI_ITEMS,
    { id: 'sysNotify', date: '2025-08-02', roles: ['provider'] },
    { id: 'sysEval', date: '2025-08-02', roles: ['provider'] },
    { id: 'sysRisk', date: '2025-08-02', roles: ['provider'] },
    { id: 'sysIncidents', date: '2025-08-02', roles: ['provider'] },
    { id: 'sysCyber', date: '2025-08-02', roles: ['provider'] },
  ],
  minimal: [LITERACY, { id: 'minimalVoluntary', date: '2024-08-01', roles: BOTH }],
}

const CATEGORY_ORDER: CategoryId[] = ['prohibited', 'highRiskAnnexIII', 'highRiskAnnexI', 'transparency', 'gpai', 'gpaiSystemic', 'minimal']
const CATEGORY_ACCENT: Record<CategoryId, string> = {
  prohibited: 'border-red-500/40 bg-red-500/10 text-red-300',
  highRiskAnnexIII: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  highRiskAnnexI: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  transparency: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
  gpai: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
  gpaiSystemic: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
  minimal: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
}

const DAY = 86_400_000
const START = Date.UTC(2024, 7, 1)
const END = Date.UTC(2028, 11, 31)
const TOTAL_DAYS = Math.round((END - START) / DAY)
const AS_OF = '2026-10-28'

const isoToDays = (iso: string) => Math.round((Date.parse(`${iso}T00:00:00Z`) - START) / DAY)
const daysToIso = (days: number) => new Date(START + days * DAY).toISOString().slice(0, 10)

export function AiActObligationsExplorer() {
  const { t, locale } = useTranslation()
  const r = t.responsibleAi
  const [category, setCategory] = useState<CategoryId>('highRiskAnnexIII')
  const [role, setRole] = useState<Role>('provider')
  const [days, setDays] = useState(isoToDays(AS_OF))

  const selectedIso = daysToIso(days)
  const formatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
    [locale],
  )
  const fmt = (iso: string) => formatter.format(new Date(`${iso}T00:00:00Z`))

  const items = CATEGORY_ITEMS[category].filter(item => item.roles.includes(role))
  const specific = items.filter(item => item.id !== 'literacy')
  const applying = items.filter(item => item.date <= selectedIso).length

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 space-y-6">
      {/* Category */}
      <div>
        <div className="text-xs uppercase tracking-wide text-muted mb-2">{r.toolCategory}</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_ORDER.map(id => (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${category === id ? CATEGORY_ACCENT[id] : 'border-border text-muted hover:text-text'}`}
            >
              {r.categories[id].name}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted mt-3">{r.categories[category].desc}</p>
      </div>

      {/* Role */}
      <div>
        <div className="text-xs uppercase tracking-wide text-muted mb-2">{r.toolRole}</div>
        <div className="flex flex-wrap gap-2">
          {(['provider', 'deployer'] as Role[]).map(id => (
            <button
              key={id}
              type="button"
              onClick={() => setRole(id)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${role === id ? 'bg-primary/20 border-primary/40 text-text' : 'border-border text-muted hover:text-text'}`}
            >
              {id === 'provider' ? r.roleProvider : r.roleDeployer}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <span className="text-xs uppercase tracking-wide text-muted">{r.toolDate}</span>
          <span className="font-mono text-text">{fmt(selectedIso)}</span>
        </div>
        <div className="relative h-8">
          <div className="absolute left-0 right-0 top-1/2 h-1 -mt-0.5 rounded bg-border" />
          {r.milestones.map(m => {
            const left = (isoToDays(m.date) / TOTAL_DAYS) * 100
            const reached = m.date <= selectedIso
            return (
              <button
                key={m.date}
                type="button"
                title={`${fmt(m.date)}: ${m.title}`}
                aria-label={`${fmt(m.date)}: ${m.title}`}
                onClick={() => setDays(isoToDays(m.date))}
                className={`absolute top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full border-2 ${reached ? 'bg-primary border-primary' : 'bg-background border-muted'}`}
                style={{ left: `${left}%` }}
              />
            )
          })}
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 pointer-events-none"
            initial={false}
            animate={{ left: `${(days / TOTAL_DAYS) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          />
        </div>
        <input
          className="block w-full mt-2 accent-primary"
          type="range" min={0} max={TOTAL_DAYS} step={1}
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          aria-label={r.toolDate}
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>{fmt(daysToIso(0))}</span>
          <button type="button" onClick={() => setDays(isoToDays(AS_OF))} className="underline hover:text-text">{r.toolReset}</button>
          <span>{fmt(daysToIso(TOTAL_DAYS))}</span>
        </div>
      </div>

      {/* Obligations */}
      <div>
        <div className="text-sm text-text mb-3">
          {r.toolCount.replace('{n}', String(applying)).replace('{total}', String(items.length)).replace('{date}', fmt(selectedIso))}
        </div>
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map(item => {
              const applies = item.date <= selectedIso
              return (
                <motion.li
                  key={`${category}-${role}-${item.id}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: applies ? 1 : 0.55, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-lg border text-sm ${applies ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-background'}`}
                >
                  <div className={`text-xs font-semibold mb-1 ${applies ? 'text-emerald-400' : 'text-muted'}`}>
                    {(applies ? r.toolApplies : r.toolPending).replace('{date}', fmt(item.date))}
                  </div>
                  <div className="text-muted leading-relaxed">{r.obligations[item.id]}</div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
        {specific.length === 0 && <p className="text-sm text-muted mt-3">{r.toolNoneForRole}</p>}
      </div>

      <div className="text-sm border-t border-border pt-4">
        <span className="text-muted">{r.toolFine}: </span>
        <span className="text-text">{r.categories[category].fine}</span>
      </div>
    </div>
  )
}
