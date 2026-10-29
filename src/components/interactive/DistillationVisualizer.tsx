'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { learningSoftmax, distributionKL, distillationStep } from '@/lib/llmLearningMath'

// Fixed teacher logits for "The capital of France is …" over a four-token toy vocabulary.
const teacherLogits = [3, 1.5, 0.5, -0.5]
const initialStudent = [0, 0.5, 1, -0.5]
const tokens = ['Paris', 'Lyon', 'London', 'Rome']

export function DistillationVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.distillation
  const [temperature, setTemperature] = useState(2)
  const [student, setStudent] = useState(initialStudent)
  const [steps, setSteps] = useState(0)
  const p = learningSoftmax(teacherLogits, temperature)
  const q = learningSoftmax(student, temperature)
  const loss = temperature ** 2 * distributionKL(p, q)
  // ∂(T² · KL(p_T ‖ q_T)) / ∂z_student = T · (q − p)
  const grad = q.map((value, i) => temperature * (value - p[i]))
  const fmt = (value: number, digits = 3) => value.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const train = (n: number) => {
    setStudent(previous => {
      let next = previous
      for (let i = 0; i < n; i++) next = distillationStep(next, teacherLogits, temperature, 1)
      return next
    })
    setSteps(previous => previous + n)
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{c.demoTitle}</h3>
        <p className="text-sm leading-relaxed text-muted">{c.demoNote}</p>
      </div>
      <label className="block text-sm text-muted">
        {c.demoTemp}: <span className="font-mono text-cyan-400">T = {fmt(temperature, 1)}</span>
        <input className="mt-2 w-full accent-cyan-400" type="range" min={1} max={5} step={0.5} value={temperature} onChange={e => setTemperature(Number(e.target.value))} />
      </label>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-right text-sm">
          <thead>
            <tr className="text-muted">
              {[c.demoToken, c.demoHard, c.demoTeacher, c.demoStudent, c.demoGrad].map(label => <th key={label} className="p-2 font-medium">{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, i) => (
              <tr key={token} className="border-t border-border">
                <th className="p-2 text-left font-mono font-normal text-text">{token}</th>
                <td className="p-2 font-mono text-muted">{fmt(i === 0 ? 1 : 0)}</td>
                <td className="p-2 font-mono text-purple-300">
                  {fmt(p[i])}
                  <motion.div className="mt-1 ml-auto h-1 rounded bg-purple-400" initial={false} animate={{ width: `${p[i] * 100}%` }} transition={{ duration: 0.3 }} />
                </td>
                <td className="p-2 font-mono text-cyan-300">
                  {fmt(q[i])}
                  <motion.div className="mt-1 ml-auto h-1 rounded bg-cyan-400" initial={false} animate={{ width: `${q[i] * 100}%` }} transition={{ duration: 0.3 }} />
                </td>
                <td className={`p-2 font-mono ${grad[i] > 0.0005 ? 'text-orange-300' : grad[i] < -0.0005 ? 'text-emerald-300' : 'text-muted'}`}>
                  {grad[i] > 0 ? '+' : ''}{fmt(grad[i])} {grad[i] > 0.0005 ? '↓' : grad[i] < -0.0005 ? '↑' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">{c.demoGradHint}</p>
      <p aria-live="polite" className="font-mono text-sm text-text">{c.demoLoss}: {fmt(Math.max(0, loss), 5)} · {c.demoSteps}: {steps}</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-200 hover:bg-cyan-500/30" onClick={() => train(1)}>{c.demoTrain}</button>
        <button type="button" className="rounded-lg bg-cyan-500/10 px-4 py-2 text-cyan-200 hover:bg-cyan-500/20" onClick={() => train(10)}>{c.demoTrain10}</button>
        <button type="button" className="rounded-lg border border-border px-4 py-2 text-muted hover:text-text" onClick={() => { setStudent(initialStudent); setSteps(0) }}>{c.demoReset}</button>
      </div>
      <p className="text-sm text-muted">{c.demoLimit}</p>
    </div>
  )
}
