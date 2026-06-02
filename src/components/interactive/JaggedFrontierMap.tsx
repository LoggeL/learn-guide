'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, RotateCcw, SlidersHorizontal } from 'lucide-react'

type Locale = 'en' | 'de'

type Task = {
  id: string
  label: string
  verifier: number
  practice: number
  exactness: number
  transferRisk: number
  x: number
  y: number
}

const tasks: Task[] = [
  { id: 'math', label: 'Olympiad math', verifier: 92, practice: 86, exactness: 44, transferRisk: 28, x: 74, y: 18 },
  { id: 'code', label: 'Coding with tests', verifier: 88, practice: 82, exactness: 58, transferRisk: 34, x: 82, y: 34 },
  { id: 'browser', label: 'Browser workflow', verifier: 56, practice: 48, exactness: 70, transferRisk: 68, x: 55, y: 58 },
  { id: 'office', label: 'Office task', verifier: 48, practice: 44, exactness: 74, transferRisk: 72, x: 43, y: 64 },
  { id: 'letters', label: 'Letter counting', verifier: 72, practice: 32, exactness: 94, transferRisk: 82, x: 22, y: 76 },
  { id: 'planning', label: 'Open-ended plan', verifier: 24, practice: 50, exactness: 38, transferRisk: 76, x: 30, y: 46 },
]

const copy = {
  en: {
    title: 'Capability map simulator',
    desc: 'Move the training conditions and watch nearby-looking tasks split into peaks and valleys.',
    verifier: 'Verifier strength',
    practice: 'Synthetic practice',
    exact: 'Exactness penalty',
    reset: 'Reset',
    peak: 'peak',
    ridge: 'ridge',
    valley: 'valley',
    score: 'capability',
    selected: 'Selected task',
    lesson:
      'More verifier and practice lift tasks with clean feedback first. Hidden exactness and transfer risk keep some simple-looking tasks low.',
  },
  de: {
    title: 'Capability-Map Simulator',
    desc: 'Verschiebe die Trainingsbedingungen und sieh, wie nahe wirkende Aufgaben in Spitzen und Täler zerfallen.',
    verifier: 'Verifier-Stärke',
    practice: 'Synthetische Übung',
    exact: 'Exaktheits-Strafe',
    reset: 'Reset',
    peak: 'Spitze',
    ridge: 'Rücken',
    valley: 'Tal',
    score: 'Fähigkeit',
    selected: 'Ausgewählte Aufgabe',
    lesson:
      'Mehr Verifier und Übung heben zuerst Aufgaben mit sauberem Feedback. Versteckte Exaktheit und Transfer-Risiko halten manche einfach wirkenden Aufgaben niedrig.',
  },
} as const

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

function classify(score: number, c: { peak: string; ridge: string; valley: string }) {
  if (score >= 72) return { label: c.peak, color: 'bg-emerald-400', text: 'text-emerald-300', ring: 'border-emerald-300/60' }
  if (score >= 48) return { label: c.ridge, color: 'bg-cyan-400', text: 'text-cyan-300', ring: 'border-cyan-300/60' }
  return { label: c.valley, color: 'bg-amber-400', text: 'text-amber-300', ring: 'border-amber-300/60' }
}

export function JaggedFrontierMap({ locale = 'en' }: { locale?: Locale }) {
  const c = locale === 'de' ? copy.de : copy.en
  const [verifierBoost, setVerifierBoost] = useState(55)
  const [practiceBoost, setPracticeBoost] = useState(52)
  const [exactnessPenalty, setExactnessPenalty] = useState(64)
  const [selectedId, setSelectedId] = useState('letters')

  const scoredTasks = useMemo(
    () =>
      tasks
        .map((task) => {
          const score = clamp(
            18 +
              task.verifier * (verifierBoost / 130) +
              task.practice * (practiceBoost / 155) -
              task.exactness * (exactnessPenalty / 190) -
              task.transferRisk * 0.18,
          )
          return { ...task, score }
        })
        .sort((a, b) => b.score - a.score),
    [exactnessPenalty, practiceBoost, verifierBoost],
  )

  const selected = scoredTasks.find((task) => task.id === selectedId) ?? scoredTasks[0]
  const selectedClass = classify(selected.score, c)

  return (
    <section className="interactive-surface p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-cyan-300" />
            <h2 className="font-heading text-2xl font-bold text-gradient">{c.title}</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">{c.desc}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setVerifierBoost(55)
            setPracticeBoost(52)
            setExactnessPenalty(64)
            setSelectedId('letters')
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background/60 px-3 text-sm font-semibold text-text transition hover:border-primary/40"
        >
          <RotateCcw size={16} />
          {c.reset}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="rounded-xl border border-border bg-background/50 p-4">
          <div className="relative h-[300px] overflow-hidden rounded-lg border border-border bg-[radial-gradient(circle_at_75%_20%,rgba(16,185,129,0.22),transparent_26%),radial-gradient(circle_at_25%_78%,rgba(245,158,11,0.18),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,13,24,0.96))]">
            <div className="absolute inset-x-5 top-5 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
            <div className="absolute bottom-5 left-5 top-5 w-px bg-gradient-to-b from-emerald-300/40 via-cyan-300/30 to-amber-300/40" />
            {scoredTasks.map((task) => {
              const tone = classify(task.score, c)
              const isSelected = task.id === selected.id
              const size = 18 + task.score / 4
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setSelectedId(task.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${tone.ring} ${tone.color}/20 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary ${isSelected ? 'scale-110 shadow-[0_0_28px_rgba(34,211,238,0.35)]' : ''}`}
                  style={{ left: `${task.x}%`, top: `${task.y}%`, width: size, height: size }}
                  aria-label={task.label}
                >
                  <span className={`absolute inset-1 rounded-full ${tone.color}`} />
                </button>
              )
            })}
            <span className="absolute right-4 top-3 text-xs font-semibold uppercase text-emerald-200">clean feedback</span>
            <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase text-amber-200">hidden exactness</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            [c.verifier, verifierBoost, setVerifierBoost],
            [c.practice, practiceBoost, setPracticeBoost],
            [c.exact, exactnessPenalty, setExactnessPenalty],
          ].map(([label, value, setter]) => (
            <label key={label as string} className="block rounded-xl border border-border bg-background/50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-text">{label as string}</span>
                <span className="text-sm tabular-nums text-primary-light">{value as number}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={value as number}
                onChange={(event) => (setter as (next: number) => void)(Number(event.target.value))}
                className="w-full"
              />
            </label>
          ))}

          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase text-muted">{c.selected}</p>
              <span className={`rounded-full border border-current px-2 py-1 text-xs font-bold uppercase ${selectedClass.text}`}>
                {selectedClass.label}
              </span>
            </div>
            <h3 className="mb-3 font-heading text-xl font-bold text-text">{selected.label}</h3>
            <div className="mb-3 h-3 overflow-hidden rounded-full bg-surface">
              <div className={`h-full ${selectedClass.color}`} style={{ width: `${selected.score}%` }} />
            </div>
            <p className="mb-4 text-sm text-muted">
              {c.score}: <span className="font-semibold text-text">{Math.round(selected.score)}%</span>
            </p>
            <div className="flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm leading-relaxed text-muted">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-300" />
              <p>{c.lesson}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
