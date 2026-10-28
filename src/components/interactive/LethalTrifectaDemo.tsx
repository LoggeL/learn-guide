'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Globe, Send, ShieldAlert, ShieldCheck, ShieldHalf } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export type TrifectaLeg = 'private' | 'untrusted' | 'exfil'
export type TrifectaStatus = 'statusAll' | 'statusNoExfil' | 'statusNoPrivate' | 'statusNoUntrusted' | 'statusSafe'

/** Which attack path is open for a given combination of agent capabilities. */
export function trifectaStatus(legs: Record<TrifectaLeg, boolean>): TrifectaStatus {
  const active = Object.values(legs).filter(Boolean).length
  if (active === 3) return 'statusAll'
  if (active <= 1) return 'statusSafe'
  if (!legs.exfil) return 'statusNoExfil'
  if (!legs.private) return 'statusNoPrivate'
  return 'statusNoUntrusted'
}

const NODES: Record<TrifectaLeg, { x: number; y: number }> = {
  untrusted: { x: 160, y: 30 },
  private: { x: 40, y: 220 },
  exfil: { x: 280, y: 220 },
}

const EDGES: [TrifectaLeg, TrifectaLeg][] = [
  ['untrusted', 'private'],
  ['private', 'exfil'],
  ['untrusted', 'exfil'],
]

export function LethalTrifectaDemo() {
  const { t } = useTranslation()
  const c = t.agentSecurity.trifecta
  const [legs, setLegs] = useState<Record<TrifectaLeg, boolean>>({ private: true, untrusted: true, exfil: true })
  const status = trifectaStatus(legs)
  const open = status === 'statusAll'
  const partial = status !== 'statusAll' && status !== 'statusSafe'

  const controls: { leg: TrifectaLeg; title: string; desc: string; Icon: typeof Database }[] = [
    { leg: 'private', title: c.legPrivate, desc: c.legPrivateDesc, Icon: Database },
    { leg: 'untrusted', title: c.legUntrusted, desc: c.legUntrustedDesc, Icon: Globe },
    { leg: 'exfil', title: c.legExfil, desc: c.legExfilDesc, Icon: Send },
  ]

  const StatusIcon = open ? ShieldAlert : partial ? ShieldHalf : ShieldCheck
  const statusStyle = open
    ? { box: 'bg-red-500/10 border-red-500/30', icon: 'text-red-400' }
    : partial
      ? { box: 'bg-orange-500/10 border-orange-500/30', icon: 'text-orange-400' }
      : { box: 'bg-emerald-500/10 border-emerald-500/30', icon: 'text-emerald-400' }

  return (
    <div className="p-4 rounded-xl bg-background border border-border space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-text">{c.demoTitle}</h4>
        <p className="text-sm text-muted">{c.demoHint}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_1.1fr] items-center">
        <div className="space-y-3">
          {controls.map(({ leg, title, desc, Icon }) => (
            <button
              key={leg}
              type="button"
              aria-pressed={legs[leg]}
              onClick={() => setLegs(prev => ({ ...prev, [leg]: !prev[leg] }))}
              className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${legs[leg] ? 'bg-red-500/10 border-red-500/40' : 'bg-surface-elevated border-border'}`}
            >
              <Icon size={18} className={legs[leg] ? 'text-red-400 mt-0.5 shrink-0' : 'text-muted mt-0.5 shrink-0'} />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-text">{title}</span>
                <span className="block text-xs text-muted">{desc}</span>
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${legs[leg] ? 'bg-red-500/20 text-red-400' : 'bg-border text-muted'}`}>
                {legs[leg] ? c.on : c.off}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <svg viewBox="0 0 320 260" className="w-full max-w-sm mx-auto h-auto" aria-hidden="true">
            {EDGES.map(([a, b]) => {
              const active = legs[a] && legs[b]
              return (
                <motion.line
                  key={`${a}-${b}`}
                  x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
                  strokeWidth={open ? 4 : 2}
                  className={open ? 'stroke-red-400' : active ? 'stroke-orange-400/70' : 'stroke-border'}
                  strokeDasharray={active ? undefined : '5 5'}
                  animate={{ opacity: active ? 1 : 0.5 }}
                />
              )
            })}
            {open && (
              <motion.circle
                r={6}
                className="fill-red-400"
                initial={{ cx: NODES.untrusted.x, cy: NODES.untrusted.y }}
                animate={{
                  cx: [NODES.untrusted.x, NODES.private.x, NODES.exfil.x],
                  cy: [NODES.untrusted.y, NODES.private.y, NODES.exfil.y],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {controls.map(({ leg, Icon }) => (
              <g key={leg}>
                <motion.circle
                  cx={NODES[leg].x} cy={NODES[leg].y} r={22}
                  className={legs[leg] ? 'fill-red-500/30 stroke-red-400' : 'fill-surface-elevated stroke-border'}
                  strokeWidth={2}
                  animate={{ scale: legs[leg] ? 1 : 0.85 }}
                  style={{ transformOrigin: `${NODES[leg].x}px ${NODES[leg].y}px` }}
                />
                <Icon x={NODES[leg].x - 10} y={NODES[leg].y - 10} width={20} height={20} className={legs[leg] ? 'text-red-400' : 'text-muted'} />
              </g>
            ))}
          </svg>

          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 p-3 rounded-lg border ${statusStyle.box}`}
              role="status"
            >
              <StatusIcon size={20} className={`${statusStyle.icon} shrink-0 mt-0.5`} />
              <p className="text-sm text-text leading-relaxed">{c[status]}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
