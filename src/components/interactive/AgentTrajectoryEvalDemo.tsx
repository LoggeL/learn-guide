'use client'

import { useId, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import {
  graderIds,
  grade,
  passAtK,
  passHatK,
  runTrial,
  summarize,
  trialScripts,
  type GraderId,
} from '@/lib/agent-eval-math'

const runs = trialScripts.map(runTrial)

export function AgentTrajectoryEvalDemo() {
  const { t, locale } = useTranslation()
  const d = t.evaluation.demo
  const id = useId()
  const [enabled, setEnabled] = useState<GraderId[]>(['claim'])
  const [selected, setSelected] = useState(0)
  const [k, setK] = useState(2)

  const summary = useMemo(() => summarize(runs, enabled), [enabled])
  const n = runs.length
  const percent = (value: number) => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(value)
  const money = (value: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(value)
  const run = runs[selected]
  const refunded = run.finalState.refunds.reduce((sum, r) => sum + r.amount, 0)

  function toggle(grader: GraderId) {
    setEnabled(current => current.includes(grader) ? current.filter(g => g !== grader) : graderIds.filter(g => g === grader || current.includes(g)))
  }

  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-5 md:p-8 space-y-6" aria-labelledby={`${id}-title`}>
      <div className="space-y-3">
        <h2 id={`${id}-title`} className="text-2xl font-bold font-heading text-gradient">{d.title}</h2>
        <p className="text-muted leading-relaxed">{d.intro}</p>
      </div>

      {/* Task definition */}
      <div className="grid md:grid-cols-3 gap-3 text-sm">
        <div className="p-4 rounded-xl bg-background border border-border">
          <p className="font-semibold text-cyan-400 mb-1">{d.taskLabel}</p>
          <p className="text-muted">{d.task}</p>
        </div>
        <div className="p-4 rounded-xl bg-background border border-border">
          <p className="font-semibold text-purple-400 mb-1">{d.policyLabel}</p>
          <p className="text-muted">{d.policy}</p>
        </div>
        <div className="p-4 rounded-xl bg-background border border-border">
          <p className="font-semibold text-emerald-400 mb-1">{d.referenceLabel}</p>
          <p className="text-muted">{d.reference}</p>
        </div>
      </div>
      <p className="text-xs text-muted">{d.resetNote}</p>

      {/* Trial picker + transcript */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{d.trialsTitle}</h3>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={d.trialsTitle}>
          {runs.map((r, i) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={selected === i}
              onClick={() => setSelected(i)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${selected === i ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300' : 'border-border bg-background text-muted hover:text-text'}`}
            >
              {d.trial} {i + 1}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={run.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-background p-4 space-y-3"
            role="tabpanel"
          >
            <p className="text-xs uppercase tracking-wide text-muted">{d.transcriptTitle}</p>
            <ol className="space-y-2">
              {run.transcript.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="font-mono text-xs leading-relaxed break-words"
                >
                  <div className="text-text">
                    <span className="text-cyan-400">→ </span>{step.call.tool}({JSON.stringify(step.call.args)})
                  </div>
                  <div className={step.ok ? 'text-muted' : 'text-red-400'}>
                    <span>← </span>{JSON.stringify(step.result)}
                  </div>
                </motion.li>
              ))}
            </ol>
            <div className="text-sm">
              <span className="font-semibold text-text">{d.finalMessage}: </span>
              <q className="text-muted italic">{d.messages[run.id as keyof typeof d.messages]}</q>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div className="p-3 rounded-lg bg-surface border border-border">
                <span className="text-muted">{d.statusLabel}: </span>
                <span className="font-mono text-text">{run.finalState.order.status}</span>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-border">
                <span className="text-muted">{d.refundedLabel}: </span>
                <span className="font-mono text-text">{money(refunded)}</span>
              </div>
            </div>
            <p className={`text-sm ${run.reviewerPass ? 'text-emerald-400' : 'text-red-400'}`}>
              <span className="font-semibold">{d.reviewer}: {run.reviewerPass ? d.reviewerPass : d.reviewerFail}.</span>{' '}
              <span className="text-muted">{d.reviewerNotes[run.id as keyof typeof d.reviewerNotes]}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grader toggles */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{d.gradersTitle}</h3>
        <p className="text-sm text-muted">{d.gradersHint}</p>
        <div className="grid md:grid-cols-2 gap-3">
          {graderIds.map(grader => {
            const active = enabled.includes(grader)
            return (
              <label
                key={grader}
                className={`flex gap-3 items-start p-4 rounded-xl border cursor-pointer transition-colors ${active ? 'border-purple-500/50 bg-purple-500/10' : 'border-border bg-background'}`}
              >
                <input type="checkbox" checked={active} onChange={() => toggle(grader)} className="mt-1 accent-purple-500" />
                <span>
                  <span className="block font-semibold text-text text-sm">{d.graders[grader].name}</span>
                  <span className="block text-xs text-muted">{d.graders[grader].desc}</span>
                </span>
              </label>
            )
          })}
        </div>
        <p className="text-xs text-muted">{d.tryThis}</p>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{d.resultsTitle}</h3>
        {enabled.length === 0 && <p className="text-sm text-amber-400">{d.noGrader}</p>}
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-background text-muted">
              <tr>
                <th className="text-left p-3 font-medium">{d.colTrial}</th>
                {enabled.map(grader => <th key={grader} className="text-center p-3 font-medium">{d.graders[grader].short}</th>)}
                <th className="text-center p-3 font-medium">{d.colVerdict}</th>
                <th className="text-center p-3 font-medium">{d.colReviewer}</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r, i) => {
                const verdict = summary.verdicts[i]
                const mismatch = verdict !== r.reviewerPass
                return (
                  <tr key={r.id} className={`border-t border-border ${selected === i ? 'bg-cyan-500/5' : ''}`}>
                    <td className="p-3">
                      <button onClick={() => setSelected(i)} className="text-left text-text hover:text-cyan-300">{d.trial} {i + 1}</button>
                    </td>
                    {enabled.map(grader => (
                      <td key={grader} className={`text-center p-3 ${grade(r, grader) ? 'text-emerald-400' : 'text-red-400'}`}>
                        {grade(r, grader) ? '✓' : '✗'}
                      </td>
                    ))}
                    <td className="text-center p-3">
                      <motion.span
                        key={`${r.id}-${verdict}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${verdict ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}
                      >
                        {verdict ? d.pass : d.fail}
                      </motion.span>
                      {mismatch && <span className="block text-[11px] text-amber-400 mt-1">{verdict ? d.falsePass : d.falseFail}</span>}
                    </td>
                    <td className={`text-center p-3 ${r.reviewerPass ? 'text-emerald-400' : 'text-red-400'}`}>{r.reviewerPass ? '✓' : '✗'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metrics */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-4" aria-live="polite">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted">{d.agreement}</dt>
            <dd className="text-2xl font-semibold">{n - summary.falsePasses - summary.falseFails} / {n}</dd>
            <dd className="text-xs text-muted">{d.falsePasses}: {summary.falsePasses} · {d.falseFails}: {summary.falseFails}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{d.passAt.replace('{k}', String(k))}</dt>
            <dd className="text-2xl font-semibold text-cyan-300">{percent(passAtK(n, summary.passed, k))}</dd>
            <dd className="text-xs text-muted">{d.passAtDesc}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{d.passHat.replace('{k}', String(k))}</dt>
            <dd className="text-2xl font-semibold text-purple-300">{percent(passHatK(n, summary.passed, k))}</dd>
            <dd className="text-xs text-muted">{d.passHatDesc}</dd>
          </div>
        </dl>
        <div>
          <label htmlFor={`${id}-k`} className="block text-sm text-muted mb-1">{d.kLabel}: <span className="font-mono text-text">k = {k}</span></label>
          <input id={`${id}-k`} type="range" min={1} max={n} value={k} onChange={e => setK(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
        <p className="text-xs text-muted">
          {d.estimatorNote.replace('{n}', String(n)).replace('{c}', String(summary.passed))}
        </p>
      </div>
    </section>
  )
}
