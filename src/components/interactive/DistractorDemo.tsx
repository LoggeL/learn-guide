'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Accuracy model based on Chroma 2025 findings
// Coherent docs degrade faster than shuffled (counterintuitive finding)
const getAccuracy = (distractors: number, mode: 'shuffled' | 'coherent'): number => {
  const base = 92
  if (mode === 'shuffled') {
    return Math.max(22, Math.round(base - distractors * 7.5 - distractors * distractors * 0.4))
  } else {
    return Math.max(10, Math.round(base - distractors * 10 - distractors * distractors * 0.9))
  }
}

interface DistractorDemoProps {
  title: string
  desc: string
  sliderLabel: string
  shuffledLabel: string
  coherentLabel: string
  modeLabel: string
  accuracyLabel: string
  paradoxNote: string
}

export function DistractorDemo({
  title, desc, sliderLabel, shuffledLabel, coherentLabel,
  modeLabel, accuracyLabel, paradoxNote,
}: DistractorDemoProps) {
  const [distractors, setDistractors] = useState(0)
  const [mode, setMode] = useState<'shuffled' | 'coherent'>('shuffled')

  const accuracy = getAccuracy(distractors, mode)
  const accuracyColor = accuracy >= 70 ? 'text-emerald-400' : accuracy >= 45 ? 'text-yellow-400' : 'text-red-400'
  const barGradient = accuracy >= 70
    ? 'from-emerald-500 to-emerald-400'
    : accuracy >= 45
    ? 'from-yellow-500 to-yellow-400'
    : 'from-red-500 to-red-400'

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border">
      <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{title}</h3>
      <p className="text-muted text-sm mb-5">{desc}</p>

      {/* Mode toggle */}
      <div className="mb-5">
        <p className="text-xs text-muted mb-2">{modeLabel}</p>
        <div className="inline-flex rounded-xl border border-border overflow-hidden">
          {(['shuffled', 'coherent'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-cyan-500/20 text-cyan-300 border-r border-cyan-500/30'
                  : 'text-muted hover:text-text hover:bg-surface-elevated'
              }`}
            >
              {m === 'shuffled' ? shuffledLabel : coherentLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-muted">{sliderLabel}</p>
          <span className="text-sm font-bold text-text tabular-nums w-4 text-right">{distractors}</span>
        </div>
        <input
          type="range"
          min={0}
          max={8}
          value={distractors}
          onChange={(e) => setDistractors(Number(e.target.value))}
          className="w-full accent-cyan-400"
        />
        <div className="flex justify-between mt-0.5">
          <span className="text-xs text-muted">0</span>
          <span className="text-xs text-muted">8</span>
        </div>
      </div>

      {/* Accuracy bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-xs text-muted">{accuracyLabel}</p>
          <motion.span
            key={`${accuracy}-${mode}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`text-sm font-bold tabular-nums ${accuracyColor}`}
          >
            {accuracy}%
          </motion.span>
        </div>
        <div className="relative h-3 rounded-full bg-surface-elevated border border-border overflow-hidden">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${barGradient}`}
            animate={{ width: `${accuracy}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Mini bar chart for both modes */}
      <div className="flex items-end gap-0.5 h-14 mb-1">
        {Array.from({ length: 9 }, (_, i) => {
          const shuffledAcc = getAccuracy(i, 'shuffled')
          const coherentAcc = getAccuracy(i, 'coherent')
          const acc = mode === 'shuffled' ? shuffledAcc : coherentAcc
          const height = Math.max(4, ((acc - 8) / 84) * 100)
          const isActive = i === distractors
          const barColor = acc >= 70 ? 'bg-emerald-500' : acc >= 45 ? 'bg-yellow-500' : 'bg-red-500'
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer" onClick={() => setDistractors(i)}>
              <motion.div
                className={`w-full rounded-t-sm ${barColor}`}
                animate={{ height: `${height}%`, opacity: isActive ? 1 : 0.3 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
              <span className="text-[10px] text-muted">{i}</span>
            </div>
          )
        })}
      </div>

      {/* Coherent paradox note */}
      <AnimatePresence>
        {mode === 'coherent' && distractors >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="mt-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20"
          >
            <p className="text-sm text-orange-300">{paradoxNote}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
