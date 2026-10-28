'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Lightbulb, Table2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type TaskId = 'inside' | 'outside'
type Guess = 'helps' | 'hurts'

// Share of correct answers on the outside-frontier task (Dell'Acqua et al. 2023): no AI, GPT-4, GPT-4 + overview
const OUTSIDE_CORRECT = [84.5, 70.6, 60]

const TRUTH: Record<TaskId, Guess> = { inside: 'helps', outside: 'hurts' }

// Schematic frontier: x in [0, 1] along the task axis, y = difficulty a model can still handle.
const FRONTIER: [number, number][] = [
  [0, 0.55], [0.08, 0.7], [0.14, 0.45], [0.22, 0.82], [0.3, 0.88], [0.36, 0.5], [0.44, 0.62],
  [0.52, 0.3], [0.58, 0.34], [0.64, 0.74], [0.72, 0.58], [0.8, 0.8], [0.88, 0.4], [1, 0.66],
]
const TASK_POINTS: Record<TaskId, { x: number; y: number }> = {
  inside: { x: 0.28, y: 0.72 },
  outside: { x: 0.55, y: 0.46 },
}

const VIEW = { width: 520, height: 220, left: 28, right: 12, top: 12, bottom: 28 }
const px = (x: number) => VIEW.left + x * (VIEW.width - VIEW.left - VIEW.right)
const py = (y: number) => VIEW.top + (1 - y) * (VIEW.height - VIEW.top - VIEW.bottom)

const frontierLine = FRONTIER.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${px(x)},${py(y)}`).join(' ')
const frontierArea = `${frontierLine} L${px(1)},${py(0)} L${px(0)},${py(0)} Z`

export function JaggedFrontierMap() {
  const { t, locale } = useTranslation()
  const c = t.jaggedFrontier
  const [selected, setSelected] = useState<TaskId>('inside')
  const [guesses, setGuesses] = useState<Partial<Record<TaskId, Guess>>>({})
  const [revealed, setRevealed] = useState<Partial<Record<TaskId, boolean>>>({})

  const tasks: { id: TaskId; name: string; desc: string; icon: typeof Lightbulb }[] = [
    { id: 'inside', name: c.taskInsideName, desc: c.taskInsideDesc, icon: Lightbulb },
    { id: 'outside', name: c.taskOutsideName, desc: c.taskOutsideDesc, icon: Table2 },
  ]
  const task = tasks.find((item) => item.id === selected) ?? tasks[0]
  const guess = guesses[selected]
  const isRevealed = !!revealed[selected]
  const percent = (value: number) => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(value / 100)

  return (
    <section className="interactive-surface space-y-5 p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-gradient">{c.mapTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{c.mapIntro}</p>
      </div>

      <figure className="rounded-xl border border-border bg-background/45 p-3">
        <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} className="h-auto w-full" role="img" aria-label={c.mapSchematic}>
          <path d={frontierArea} fill="rgba(34,211,238,0.10)" />
          <path d={frontierLine} fill="none" stroke="#22d3ee" strokeWidth={2} strokeLinejoin="round" />
          <text x={px(0.02)} y={py(0.08)} className="fill-cyan-200 text-[11px]">{c.mapInside}</text>
          <text x={px(0.86)} y={py(0.92)} className="fill-muted text-[11px]">{c.mapOutside}</text>
          <line x1={px(0)} x2={px(1)} y1={py(0)} y2={py(0)} className="stroke-border" />
          <line x1={px(0)} x2={px(0)} y1={py(0)} y2={py(1)} className="stroke-border" />
          <text x={px(1)} y={VIEW.height - 8} textAnchor="end" className="fill-muted text-[10px]">{c.mapAxisTasks}</text>
          <text x={12} y={py(0.5)} textAnchor="middle" transform={`rotate(-90 12 ${py(0.5)})`} className="fill-muted text-[10px]">{c.mapAxisDifficulty}</text>
          {tasks.map((item) => {
            const point = TASK_POINTS[item.id]
            const shown = !!revealed[item.id]
            const color = shown ? (item.id === 'inside' ? '#34d399' : '#fb923c') : '#c084fc'
            return (
              <g key={item.id} onClick={() => setSelected(item.id)} className="cursor-pointer">
                <motion.circle
                  cx={px(point.x)}
                  cy={py(point.y)}
                  animate={{ r: selected === item.id ? 9 : 6, fill: color }}
                  transition={{ duration: 0.25 }}
                  stroke="#0b1220"
                  strokeWidth={2}
                />
                <text x={px(point.x) + 12} y={py(point.y) + 4} className="fill-text text-[11px] font-semibold">{item.name}</text>
              </g>
            )
          })}
        </svg>
        <figcaption className="mt-2 text-xs leading-relaxed text-muted">{c.mapSchematic}</figcaption>
      </figure>

      <div className="flex flex-wrap gap-2">
        {tasks.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected === item.id}
            onClick={() => setSelected(item.id)}
            className={`min-h-11 rounded-lg border px-4 text-sm font-semibold transition-colors motion-reduce:transition-none ${
              selected === item.id ? 'border-primary bg-primary/10 text-text' : 'border-border text-muted hover:border-primary/40 hover:text-text'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface/55 p-5">
        <div className="flex items-start gap-3">
          <task.icon size={20} className="mt-0.5 shrink-0 text-primary-light" aria-hidden="true" />
          <div>
            <h3 className="font-heading text-lg font-bold text-text">{task.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{task.desc}</p>
          </div>
        </div>

        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-bold text-text">{c.guessQuestion}</legend>
          <div className="flex flex-wrap gap-2">
            {(['helps', 'hurts'] as Guess[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={guess === option}
                onClick={() => setGuesses((current) => ({ ...current, [selected]: option }))}
                className={`min-h-11 rounded-lg border px-4 text-sm font-semibold transition-colors motion-reduce:transition-none ${
                  guess === option ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-100' : 'border-border text-muted hover:border-cyan-400/35 hover:text-text'
                }`}
              >
                {option === 'helps' ? c.guessHelps : c.guessHurts}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setRevealed((current) => ({ ...current, [selected]: true }))}
              disabled={isRevealed}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 text-sm font-semibold text-primary-light transition-colors hover:bg-primary/20 disabled:opacity-50 motion-reduce:transition-none"
            >
              <Eye size={16} aria-hidden="true" />
              {c.reveal}
            </button>
          </div>
        </fieldset>

        <AnimatePresence mode="wait">
          {isRevealed && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-5 border-t border-border pt-5"
              aria-live="polite"
            >
              {guess && (
                <p className={`mb-3 text-sm font-semibold ${guess === TRUTH[selected] ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {guess === TRUTH[selected] ? c.guessRight : c.guessWrong}
                </p>
              )}
              {selected === 'inside' ? (
                <div>
                  <h4 className="font-heading font-bold text-emerald-200">{c.resultInsideTitle}</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {c.resultInsideStats.map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-3">
                        <div className="text-2xl font-bold tabular-nums text-text">{stat.value}</div>
                        <div className="mt-1 text-xs text-muted">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{c.resultInsideNote}</p>
                </div>
              ) : (
                <div>
                  <h4 className="font-heading font-bold text-orange-200">{c.resultOutsideTitle}</h4>
                  <p className="mt-1 text-xs text-muted">{c.resultOutsideLabel}</p>
                  <div className="mt-3 space-y-3" role="img" aria-label={c.resultAria}>
                    {c.resultOutsideBars.map((label, index) => (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-muted">{label}</span>
                          <span className="font-mono font-bold tabular-nums text-text">{percent(OUTSIDE_CORRECT[index])}</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-background">
                          <motion.div
                            className={`h-full rounded-full ${index === 0 ? 'bg-muted/60' : 'bg-orange-400'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${OUTSIDE_CORRECT[index]}%` }}
                            transition={{ duration: 0.6, delay: index * 0.12 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{c.resultOutsideNote}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
