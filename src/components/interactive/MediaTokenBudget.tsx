'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AudioLines, Film } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type Kind = 'text' | 'discrete' | 'continuous' | null

interface Representation {
  id: 'transcript' | 'whisper' | 'mimi' | 'encodec' | 'gemini' | 'geminiLow' | 'qwen'
  group: 'audio' | 'video'
  perSecond: number
  kind: Kind
}

// Rates follow the published frame rates (sources listed on the multimodality page).
const REPRESENTATIONS: Representation[] = [
  // Assumption: 150 words/min speech, ~1.3 BPE tokens per English word.
  { id: 'transcript', group: 'audio', perSecond: (150 / 60) * 1.3, kind: 'text' },
  // Whisper: 10 ms hop -> 100 frames/s, stride-2 conv stem -> 50 vectors/s.
  { id: 'whisper', group: 'audio', perSecond: 50, kind: 'continuous' },
  // Mimi: 12.5 Hz x 8 codebooks.
  { id: 'mimi', group: 'audio', perSecond: 12.5 * 8, kind: 'discrete' },
  // EnCodec 24 kHz at 6 kbps: 75 Hz x 8 codebooks.
  { id: 'encodec', group: 'audio', perSecond: 75 * 8, kind: 'discrete' },
  // Gemini API: 1 fps, 258 tokens/frame (66 at low resolution) + 32 audio tokens/s.
  { id: 'gemini', group: 'video', perSecond: 258 + 32, kind: null },
  { id: 'geminiLow', group: 'video', perSecond: 66 + 32, kind: null },
  // Qwen2-VL: 2 fps, temporal patch of 2 frames, 28x28 px per merged token -> (448/28)^2 per second.
  { id: 'qwen', group: 'video', perSecond: (448 / 28) ** 2, kind: 'continuous' },
]

const DURATIONS = [10, 60, 600, 3600]
const CONTEXTS = [128_000, 1_000_000]
const LOG_MAX = 7 // axis spans 1 to 10^7 tokens

function axisPercent(value: number) {
  return Math.min(100, (Math.log10(Math.max(value, 1)) / LOG_MAX) * 100)
}

export function MediaTokenBudget() {
  const { t, locale } = useTranslation()
  const c = t.multimodality
  const reduceMotion = useReducedMotion()
  const [duration, setDuration] = useState(60)
  const [context, setContext] = useState(CONTEXTS[0])
  const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${numberFormat.format(Math.round(seconds))} ${c.unitSeconds}`
    if (seconds < 3600) return `${numberFormat.format(Math.round(seconds / 60))} ${c.unitMinutes}`
    return `${numberFormat.format(Math.round((seconds / 3600) * 10) / 10)} ${c.unitHours}`
  }

  const labels: Record<Representation['id'], { name: string; note: string }> = {
    transcript: { name: c.budgetTranscript, note: c.budgetTranscriptNote },
    whisper: { name: c.budgetWhisper, note: c.budgetWhisperNote },
    mimi: { name: c.budgetMimi, note: c.budgetMimiNote },
    encodec: { name: c.budgetEncodec, note: c.budgetEncodecNote },
    gemini: { name: c.budgetGemini, note: c.budgetGeminiNote },
    geminiLow: { name: c.budgetGeminiLow, note: c.budgetGeminiLowNote },
    qwen: { name: c.budgetQwen, note: c.budgetQwenNote },
  }
  const kindLabel: Record<Exclude<Kind, null>, string> = {
    text: c.budgetKindText,
    discrete: c.budgetKindDiscrete,
    continuous: c.budgetKindContinuous,
  }
  const groups = [
    { id: 'audio' as const, title: c.budgetGroupAudio, icon: AudioLines, color: 'text-purple-400', bar: 'bg-purple-400' },
    { id: 'video' as const, title: c.budgetGroupVideo, icon: Film, color: 'text-emerald-400', bar: 'bg-emerald-400' },
  ]
  const contextPercent = axisPercent(context)

  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-5 md:p-6 space-y-6">
      <div className="flex flex-wrap gap-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{c.budgetDuration}</div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={c.budgetDuration}>
            {DURATIONS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDuration(value)}
                aria-pressed={duration === value}
                className={`px-3 py-1.5 rounded-lg border text-sm font-mono transition-colors ${duration === value ? 'border-primary/60 bg-primary/15 text-text' : 'border-border bg-background text-muted hover:text-text'}`}
              >
                {formatDuration(value)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{c.budgetContext}</div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={c.budgetContext}>
            {CONTEXTS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setContext(value)}
                aria-pressed={context === value}
                className={`px-3 py-1.5 rounded-lg border text-sm font-mono transition-colors ${context === value ? 'border-primary/60 bg-primary/15 text-text' : 'border-border bg-background text-muted hover:text-text'}`}
              >
                {numberFormat.format(value)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {groups.map((group) => {
        const Icon = group.icon
        return (
          <div key={group.id} className="space-y-3">
            <div className={`flex items-center gap-2 text-sm font-bold ${group.color}`}>
              <Icon className="w-4 h-4" aria-hidden="true" />
              {group.title}
            </div>
            {REPRESENTATIONS.filter((rep) => rep.group === group.id).map((rep) => {
              const total = rep.perSecond * duration
              const exceeds = total > context
              return (
                <div key={rep.id} className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-text">{labels[rep.id].name}</span>
                      {rep.kind && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted">{kindLabel[rep.kind]}</span>
                      )}
                    </div>
                    <div className="text-sm font-mono text-muted">
                      {numberFormat.format(rep.perSecond)} {c.budgetPerSecond}
                    </div>
                  </div>
                  <div className="relative mt-3 h-3 rounded-full bg-surface overflow-hidden" aria-hidden="true">
                    <motion.div
                      className={`absolute inset-y-0 left-0 rounded-full ${exceeds ? 'bg-red-400' : group.bar}`}
                      initial={false}
                      animate={{ width: `${axisPercent(total)}%` }}
                      transition={{ duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' }}
                    />
                    <div className="absolute inset-y-0 w-0.5 bg-text/70" style={{ left: `${contextPercent}%` }} />
                  </div>
                  <div className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs">
                    <span className={`font-mono ${exceeds ? 'text-red-400' : 'text-text'}`}>
                      {numberFormat.format(Math.round(total))} {c.budgetTokens}
                      {exceeds && ` · ${c.budgetExceeds}`}
                    </span>
                    <span className="text-muted">
                      {c.budgetFullAfter} <span className="font-mono text-text">{formatDuration(context / rep.perSecond)}</span>
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted leading-relaxed">{labels[rep.id].note}</p>
                </div>
              )
            })}
          </div>
        )
      })}

      <p className="text-xs text-muted">{c.budgetAxis}</p>
      <p className="text-sm text-text leading-relaxed p-4 rounded-xl bg-primary/5 border border-primary/20">{c.budgetInsight}</p>
    </div>
  )
}
