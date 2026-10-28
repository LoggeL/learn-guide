'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

const WIDTH = 600
const HEIGHT = 280
const APP_X = 70
const SYS_X = 530
const HUB_X = WIDTH / 2
const MAX = 8

function positions(count: number) {
  const gap = HEIGHT / (count + 1)
  return Array.from({ length: count }, (_, i) => gap * (i + 1))
}

function fill(template: string, values: Record<string, number>) {
  return Object.entries(values).reduce((text, [key, value]) => text.split(`{${key}}`).join(String(value)), template)
}

export function McpIntegrationMathDemo() {
  const { t } = useTranslation()
  const c = t.mcp.mathDemo
  const [apps, setApps] = useState(3)
  const [systems, setSystems] = useState(5)
  const [viaMcp, setViaMcp] = useState(false)

  const appY = positions(apps)
  const sysY = positions(systems)
  const direct = apps * systems
  const withMcp = apps + systems

  const lines = viaMcp
    ? [
        ...appY.map((y, i) => ({ key: `a${i}`, x1: APP_X, y1: y, x2: HUB_X, y2: HEIGHT / 2 })),
        ...sysY.map((y, i) => ({ key: `s${i}`, x1: HUB_X, y1: HEIGHT / 2, x2: SYS_X, y2: y })),
      ]
    : appY.flatMap((ay, i) => sysY.map((sy, j) => ({ key: `${i}-${j}`, x1: APP_X, y1: ay, x2: SYS_X, y2: sy })))

  return (
    <div className="rounded-xl bg-surface border border-border p-5 space-y-5">
      <h3 className="text-lg font-bold font-heading text-text">{c.title}</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm text-muted">
          <span className="flex justify-between"><span>{c.apps}</span><span className="font-mono text-text">{apps}</span></span>
          <input type="range" min={1} max={MAX} value={apps} onChange={e => setApps(Number(e.target.value))} className="w-full mt-2 accent-purple-400" />
        </label>
        <label className="block text-sm text-muted">
          <span className="flex justify-between"><span>{c.systems}</span><span className="font-mono text-text">{systems}</span></span>
          <input type="range" min={1} max={MAX} value={systems} onChange={e => setSystems(Number(e.target.value))} className="w-full mt-2 accent-cyan-400" />
        </label>
      </div>

      <div className="inline-flex rounded-lg border border-border p-1 bg-background" role="group">
        {[false, true].map(mode => (
          <button
            key={String(mode)}
            onClick={() => setViaMcp(mode)}
            aria-pressed={viaMcp === mode}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${viaMcp === mode ? 'bg-primary/20 text-primary-light' : 'text-muted hover:text-text'}`}
          >
            {mode ? c.modeMcp : c.modeDirect}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto rounded-lg bg-background border border-border" role="img" aria-label={viaMcp ? c.modeMcp : c.modeDirect}>
        {lines.map((line, index) => (
          <motion.line
            key={`${viaMcp}-${apps}-${systems}-${line.key}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={viaMcp ? '#a78bfa' : '#fb923c'}
            strokeOpacity={0.55}
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.01, 0.4) }}
          />
        ))}
        {appY.map((y, i) => (
          <g key={`app-${i}`}>
            <rect x={APP_X - 52} y={y - 12} width={52} height={24} rx={6} fill="#1e1b4b" stroke="#a78bfa" />
            <text x={APP_X - 26} y={y + 4} textAnchor="middle" fontSize={11} fill="#ddd6fe">{c.appShort} {i + 1}</text>
          </g>
        ))}
        {sysY.map((y, i) => (
          <g key={`sys-${i}`}>
            <rect x={SYS_X} y={y - 12} width={52} height={24} rx={6} fill="#083344" stroke="#22d3ee" />
            <text x={SYS_X + 26} y={y + 4} textAnchor="middle" fontSize={11} fill="#cffafe">{c.systemShort} {i + 1}</text>
          </g>
        ))}
        {viaMcp && (
          <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: `${HUB_X}px ${HEIGHT / 2}px` }}>
            <rect x={HUB_X - 34} y={HEIGHT / 2 - 16} width={68} height={32} rx={8} fill="#2e1065" stroke="#c4b5fd" />
            <text x={HUB_X} y={HEIGHT / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ede9fe">{c.hub}</text>
          </motion.g>
        )}
      </svg>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className={`p-4 rounded-lg border ${viaMcp ? 'border-border bg-background/50' : 'border-orange-500/40 bg-orange-500/10'}`}>
          <div className="text-xs uppercase tracking-wider text-muted mb-1">{c.withoutLabel}</div>
          <div className="text-lg font-semibold text-orange-400">{fill(c.adapters, { count: direct })}</div>
        </div>
        <div className={`p-4 rounded-lg border ${viaMcp ? 'border-purple-500/40 bg-purple-500/10' : 'border-border bg-background/50'}`}>
          <div className="text-xs uppercase tracking-wider text-muted mb-1">{c.withLabel}</div>
          <div className="text-lg font-semibold text-purple-400">{fill(c.implementations, { count: withMcp, m: apps, n: systems })}</div>
        </div>
      </div>
      <p className="text-sm text-muted">{fill(c.marginal, { m: apps })}</p>
    </div>
  )
}
