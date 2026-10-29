'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

type View = 'parallel' | 'sequential'

const SUB = ['₀', '₁', '₂', '₃']

const C = {
  text: '#f8fafc',
  muted: '#a7b3c7',
  border: '#334155',
  cyan: '#22d3ee',
  purple: '#c084fc',
  emerald: '#34d399',
  orange: '#fb923c',
}

function Box({ x, y, w, h, label, color, sub }: { x: number; y: number; w: number; h: number; label: string; color: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={color} fillOpacity={0.12} stroke={color} strokeOpacity={0.7} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 4)} textAnchor="middle" fontSize={12} fill={C.text}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={10} fill={C.muted}>{sub}</text>}
    </g>
  )
}

function Arrow({ d, color = C.muted, dashed = false }: { d: string; color?: string; dashed?: boolean }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray={dashed ? '4 4' : undefined} markerEnd="url(#mtp-arrow)" />
}

function Parallel({ c }: { c: ReturnType<typeof useTranslation>['t']['mtp'] }) {
  const heads = [1, 2, 3, 4]
  return (
    <g>
      <Box x={40} y={262} w={560} h={34} label="x₁ … x_t" color={C.muted} />
      <Arrow d="M320 262 L320 236" />
      <Box x={40} y={190} w={560} h={44} label={c.diagramTrunk} sub="z_t" color={C.purple} />
      {heads.map((k, i) => {
        const x = 52 + i * 140
        return (
          <g key={k}>
            <Arrow d={`M${x + 58} 190 L${x + 58} 160`} />
            <Box x={x} y={120} w={116} h={38} label={c.diagramHead.replace('{k}', String(k))} color={C.cyan} />
            <Arrow d={`M${x + 58} 120 L${x + 58} 98`} />
          </g>
        )
      })}
      <Box x={40} y={62} w={560} h={34} label={c.diagramUnembed} color={C.emerald} />
      {heads.map((k, i) => (
        <g key={k}>
          <Arrow d={`M${110 + i * 140} 62 L${110 + i * 140} 40`} color={C.emerald} />
          <text x={110 + i * 140} y={28} textAnchor="middle" fontSize={12} fill={C.emerald}>
            {c.diagramPredicts.replace('{offset}', `+${k}`)}
          </text>
        </g>
      ))}
    </g>
  )
}

function Sequential({ c }: { c: ReturnType<typeof useTranslation>['t']['mtp'] }) {
  const cols = [
    { x: 20, label: c.diagramMain, offset: 1 },
    { x: 230, label: c.diagramModule.replace('{k}', '1'), offset: 2 },
    { x: 440, label: c.diagramModule.replace('{k}', '2'), offset: 3 },
  ]
  return (
    <g>
      {cols.map((col, i) => {
        const faded = i === 2
        return (
          <g key={col.label} opacity={faded ? 0.55 : 1}>
            <text x={col.x + 90} y={302} textAnchor="middle" fontSize={11} fill={C.muted}>{col.label}</text>
            {i === 0 ? (
              <>
                <Box x={col.x} y={240} w={180} h={40} label="x₁ … x_i" color={C.muted} />
                <Arrow d={`M${col.x + 90} 240 L${col.x + 90} 196`} />
                <Box x={col.x} y={150} w={180} h={44} label={c.diagramBlock} sub="× L" color={C.purple} />
              </>
            ) : (
              <>
                <Box x={col.x + 96} y={240} w={84} h={40} label={c.diagramEmb.replace('{offset}', `ᵢ₊${SUB[i]}`)} color={C.orange} />
                <Box x={col.x} y={192} w={180} h={36} label={c.diagramProj} sub="RMSNorm(h) ⊕ RMSNorm(Emb)" color={C.cyan} />
                <Arrow d={`M${col.x + 138} 240 L${col.x + 138} 230`} color={C.orange} />
                <Arrow d={`M${col.x + 90} 192 L${col.x + 90} 182`} />
                <Box x={col.x} y={140} w={180} h={40} label={c.diagramBlock} sub="TRM_k" color={C.purple} />
              </>
            )}
            <Arrow d={`M${col.x + 90} ${i === 0 ? 150 : 140} L${col.x + 90} 108`} />
            <Box x={col.x} y={70} w={180} h={36} label={c.diagramOutHead} color={C.emerald} />
            <Arrow d={`M${col.x + 90} 70 L${col.x + 90} 44`} color={C.emerald} />
            <text x={col.x + 90} y={32} textAnchor="middle" fontSize={12} fill={C.emerald}>
              {c.diagramPredicts.replace('{offset}', `ᵢ₊${SUB[col.offset]}`)}
            </text>
          </g>
        )
      })}
      {/* hidden state handed to the next depth */}
      <Arrow d="M200 168 C 215 168, 215 211, 228 211" color={C.cyan} dashed />
      <text x={214} y={160} textAnchor="middle" fontSize={10} fill={C.cyan}>h⁰ᵢ</text>
      <g opacity={0.55}>
        <Arrow d="M410 158 C 425 158, 425 211, 438 211" color={C.cyan} dashed />
        <text x={424} y={150} textAnchor="middle" fontSize={10} fill={C.cyan}>h¹ᵢ</text>
      </g>
    </g>
  )
}

export function MtpArchitectureDiagram() {
  const { t } = useTranslation()
  const c = t.mtp
  const [view, setView] = useState<View>('sequential')

  return (
    <div className="rounded-2xl border border-border bg-background p-4 md:p-6">
      <div className="mb-4 flex flex-wrap gap-2" role="tablist">
        {(['parallel', 'sequential'] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              view === v ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' : 'border-border text-muted hover:text-text'
            }`}
          >
            {v === 'parallel' ? c.diagramParallel : c.diagramSequential}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 640 310" className="h-auto w-full" role="img" aria-label={view === 'parallel' ? c.diagramParallel : c.diagramSequential}>
        <defs>
          <marker id="mtp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={C.muted} />
          </marker>
        </defs>
        <AnimatePresence mode="wait">
          <motion.g key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {view === 'parallel' ? <Parallel c={c} /> : <Sequential c={c} />}
          </motion.g>
        </AnimatePresence>
      </svg>
    </div>
  )
}
