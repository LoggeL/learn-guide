'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const POSITIONS = 20

// U-shaped accuracy curve based on Liu et al. (Stanford "Lost in the Middle")
// ~75% at start, ~45% in middle, ~72% at end
const ACCURACY_DATA: number[] = Array.from({ length: POSITIONS + 1 }, (_, i) => {
  const t = i / POSITIONS
  const distFromMiddle = Math.abs(t - 0.5) * 2
  const primacy = t < 0.5 ? 0.04 * (1 - t * 2) : 0
  return Math.round((0.44 + 0.33 * Math.pow(distFromMiddle, 0.6) + primacy) * 100)
})

interface AttentionHeatmapProps {
  title: string
  desc: string
  clickHint: string
  accuracyLabel: string
  startLabel: string
  middleLabel: string
  endLabel: string
  positionLabel: string
}

export function AttentionHeatmap({
  title, desc, clickHint, accuracyLabel,
  startLabel, middleLabel, endLabel, positionLabel,
}: AttentionHeatmapProps) {
  const [selectedPos, setSelectedPos] = useState(10)

  const accuracy = ACCURACY_DATA[selectedPos]
  const accuracyColor = accuracy >= 65 ? 'text-emerald-400' : accuracy >= 55 ? 'text-yellow-400' : 'text-red-400'
  const bgBorder = accuracy >= 65
    ? 'bg-emerald-500/10 border-emerald-500/30'
    : accuracy >= 55
    ? 'bg-yellow-500/10 border-yellow-500/30'
    : 'bg-red-500/10 border-red-500/30'

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pos = Math.round((x / rect.width) * POSITIONS)
    setSelectedPos(Math.max(0, Math.min(POSITIONS, pos)))
  }

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border">
      <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{title}</h3>
      <p className="text-muted text-sm mb-5">{desc}</p>

      <p className="text-xs text-muted mb-2">{clickHint}</p>

      {/* Interactive bar chart */}
      <div
        className="relative h-24 rounded-xl border border-border bg-surface-elevated cursor-pointer overflow-hidden mb-1"
        onClick={handleBarClick}
      >
        {/* Gradient overlay hint */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-red-500/20 to-emerald-500/10 pointer-events-none" />

        {/* Accuracy bars */}
        <div className="absolute inset-x-2 bottom-0 flex items-end gap-0.5 h-full">
          {ACCURACY_DATA.map((acc, i) => {
            const heightPct = Math.max(8, ((acc - 40) / 40) * 100)
            const isSelected = i === selectedPos
            const barColor = acc >= 65 ? 'bg-emerald-500' : acc >= 55 ? 'bg-yellow-500' : 'bg-red-500'
            return (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all duration-150 ${barColor} cursor-pointer`}
                style={{
                  height: `${heightPct}%`,
                  opacity: isSelected ? 1 : 0.35,
                  transform: isSelected ? 'scaleX(1.4)' : 'scaleX(1)',
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedPos(i) }}
              />
            )
          })}
        </div>

        {/* Needle */}
        <motion.div
          className="absolute top-0 bottom-0 pointer-events-none"
          animate={{ left: `${(selectedPos / POSITIONS) * 100}%` }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="relative w-px h-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            <div className="absolute -top-0.5 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
          </div>
        </motion.div>
      </div>

      {/* Axis labels */}
      <div className="flex justify-between mb-5">
        <span className="text-xs font-medium text-emerald-400">{startLabel}</span>
        <span className="text-xs font-medium text-red-400">{middleLabel}</span>
        <span className="text-xs font-medium text-emerald-400">{endLabel}</span>
      </div>

      {/* Accuracy readout */}
      <motion.div
        className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${bgBorder}`}
        layout
      >
        <div className="flex-1">
          <p className="text-xs text-muted tabular-nums">
            {positionLabel} {selectedPos + 1}/{POSITIONS + 1}
          </p>
          <p className="text-sm text-text mt-0.5">{accuracyLabel}</p>
        </div>
        <motion.div
          key={accuracy}
          initial={{ scale: 0.75, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`text-4xl font-bold font-heading tabular-nums ${accuracyColor}`}
        >
          {accuracy}%
        </motion.div>
      </motion.div>
    </div>
  )
}
