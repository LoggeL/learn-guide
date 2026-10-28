'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

type TaskId = 'lines' | 'circles' | 'olympic'

// Published per-task accuracies (%) from Rahmanzadehgervi et al. (2024),
// "Vision language models are blind", https://vlmsareblind.github.io/
const MODELS = ['GPT-4o', 'Gemini-1.5 Pro', 'Claude 3 Sonnet', 'Claude 3.5 Sonnet'] as const
const PUBLISHED: Record<TaskId, readonly number[]> = {
  lines: [41.61, 66.94, 43.41, 75.36],
  circles: [72.69, 92.78, 84.52, 91.66],
  olympic: [42.5, 20.83, 31.66, 44.16],
}

const W = 320
const H = 240

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let r = Math.imul(a ^ (a >>> 15), 1 | a)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

interface Stimulus {
  shapes: React.ReactNode
  answer: number | boolean
  options: readonly (number | boolean)[]
}

/** Two 3-point polylines on shared x positions; each segment pair crosses iff the vertical gap changes sign. */
function makeLines(rand: () => number): Stimulus {
  const xs = [24, 160, 296]
  let a: number[] = []
  let b: number[] = []
  for (let attempt = 0; attempt < 100; attempt++) {
    a = xs.map(() => 24 + rand() * 192)
    b = xs.map(() => 24 + rand() * 192)
    if (a.every((y, i) => Math.abs(y - b[i]) >= 24)) break
  }
  const d = a.map((y, i) => y - b[i])
  const answer = (Math.sign(d[0]) !== Math.sign(d[1]) ? 1 : 0) + (Math.sign(d[1]) !== Math.sign(d[2]) ? 1 : 0)
  const pts = (ys: number[]) => xs.map((x, i) => `${x},${ys[i].toFixed(1)}`).join(' ')
  return {
    shapes: (
      <>
        <polyline points={pts(a)} fill="none" stroke="#2563eb" strokeWidth={4} strokeLinejoin="round" />
        <polyline points={pts(b)} fill="none" stroke="#dc2626" strokeWidth={4} strokeLinejoin="round" />
      </>
    ),
    answer,
    options: [0, 1, 2],
  }
}

/** Two equal circles; visible outlines touch when the centre distance is at most twice the outer radius. */
function makeCircles(rand: () => number): Stimulus {
  const stroke = 3
  const r = 30 + rand() * 18
  const outer = r + stroke / 2
  const kind = Math.floor(rand() * 3) // 0 overlap, 1 tangent, 2 apart
  const gap = kind === 0 ? -(6 + rand() * 0.5 * r) : kind === 1 ? 0 : 6 + rand() * 0.7 * r
  const dist = 2 * outer + gap
  const angle = (rand() - 0.5) * Math.PI * 0.6
  const cx = W / 2
  const cy = H / 2
  const dx = (Math.cos(angle) * dist) / 2
  const dy = (Math.sin(angle) * dist) / 2
  return {
    shapes: (
      <>
        <circle cx={cx - dx} cy={cy - dy} r={r} fill="none" stroke="#16a34a" strokeWidth={stroke} />
        <circle cx={cx + dx} cy={cy + dy} r={r} fill="none" stroke="#9333ea" strokeWidth={stroke} />
      </>
    ),
    answer: gap <= 0,
    options: [true, false],
  }
}

/** Olympic-style rings: 5 to 9 circles in two staggered rows, neighbours across rows overlap. */
function makeOlympic(rand: () => number): Stimulus {
  const n = 5 + Math.floor(rand() * 5)
  const top = Math.ceil(n / 2)
  const r = 26
  const step = 2.3 * r
  const width = (top - 1) * step
  const x0 = (W - width) / 2
  const colors = ['#2563eb', '#111827', '#dc2626', '#eab308', '#16a34a']
  const circles: React.ReactNode[] = []
  for (let i = 0; i < n; i++) {
    const row = i % 2
    const col = Math.floor(i / 2)
    const cx = x0 + col * step + (row ? step / 2 : 0)
    const cy = H / 2 - 18 + row * r
    circles.push(<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={colors[i % colors.length]} strokeWidth={5} />)
  }
  return { shapes: <>{circles}</>, answer: n, options: [5, 6, 7, 8, 9] }
}

const MAKERS: Record<TaskId, (rand: () => number) => Stimulus> = { lines: makeLines, circles: makeCircles, olympic: makeOlympic }

export function VisualChallengesDemo() {
  const { t } = useTranslation()
  const v = t.vision
  const [task, setTask] = useState<TaskId>('lines')
  const [seed, setSeed] = useState(7)
  const [choice, setChoice] = useState<number | boolean | null>(null)

  const stimulus = useMemo(() => MAKERS[task](mulberry32(seed * 7919 + task.length)), [task, seed])

  const tasks: { id: TaskId; label: string; question: string }[] = [
    { id: 'lines', label: v.blindTaskLines, question: v.blindQuestionLines },
    { id: 'circles', label: v.blindTaskCircles, question: v.blindQuestionCircles },
    { id: 'olympic', label: v.blindTaskOlympic, question: v.blindQuestionOlympic },
  ]
  const current = tasks.find(x => x.id === task) ?? tasks[0]
  const show = (o: number | boolean) => (typeof o === 'boolean' ? (o ? v.blindYes : v.blindNo) : String(o))
  const answered = choice !== null
  const correct = choice === stimulus.answer

  return (
    <section className="rounded-2xl bg-surface border border-border p-4 sm:p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold font-heading text-text">{v.blindDemoTitle}</h3>
        <p className="text-sm text-muted mt-1">{v.blindDemoDesc}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tasks.map(x => (
          <button
            key={x.id}
            aria-pressed={task === x.id}
            onClick={() => { setTask(x.id); setChoice(null) }}
            className={`min-h-11 px-4 rounded-lg border text-sm transition-colors ${task === x.id ? 'border-primary bg-primary/15 text-text' : 'border-border text-muted hover:text-text'}`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 items-start">
        <div className="space-y-3">
          <svg role="img" aria-label={v.blindStimulusAlt} viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg border border-border" style={{ background: '#ffffff' }}>
            {stimulus.shapes}
          </svg>
          <button
            onClick={() => { setSeed(s => s + 1); setChoice(null) }}
            className="min-h-11 px-4 rounded-lg border border-border text-sm text-muted hover:text-text"
          >
            {v.blindNewExample}
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-text">{current.question}</h4>
          <div className="flex flex-wrap gap-2">
            {stimulus.options.map(o => (
              <button
                key={String(o)}
                onClick={() => setChoice(o)}
                aria-pressed={choice === o}
                className={`min-h-11 min-w-11 px-4 rounded-lg border font-mono ${choice === o ? (correct ? 'border-emerald-500 bg-emerald-500/15' : 'border-red-500 bg-red-500/15') : 'border-border hover:border-primary/50'}`}
              >
                {show(o)}
              </button>
            ))}
          </div>

          {answered && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" role="status">
              <p className={`rounded-lg border p-3 text-sm ${correct ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-red-500/30 bg-red-500/5 text-red-300'}`}>
                {(correct ? v.blindCorrect : v.blindWrong).replace('{answer}', show(stimulus.answer))}
              </p>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{v.blindPublished}</div>
                <div className="space-y-2">
                  {MODELS.map((m, i) => {
                    const pct = PUBLISHED[task][i]
                    return (
                      <div key={m} className="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-2 text-xs">
                        <span className="text-muted truncate">{m}</span>
                        <div className="h-3 rounded bg-background border border-border overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-cyan-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                          />
                        </div>
                        <span className="font-mono text-text text-right">{pct.toFixed(1)} %</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
