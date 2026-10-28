'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import {
  fairnessGroups,
  groupMetrics,
  criterionGap,
  bestThresholds,
  THRESHOLD_STEP,
  type FairnessCriterion,
  type GroupMetrics,
} from '@/lib/fairness-demo'

const CRITERIA: FairnessCriterion[] = ['selection', 'tpr', 'ppv', 'odds']
const TOLERANCE = 0.05
const GROUP_COLORS = ['text-cyan-400', 'text-orange-400']
const GROUP_BG = ['bg-cyan-400', 'bg-orange-400']
const GROUP_BORDER = ['border-cyan-400', 'border-orange-400']

function pct(value: number | null) {
  return value === null ? '–' : `${Math.round(value * 100)} %`
}

export function BiasDetectionDemo() {
  const { t } = useTranslation()
  const c = t.bias.demo
  const [separate, setSeparate] = useState(false)
  const [thresholds, setThresholds] = useState<[number, number]>([50, 50])
  const [activePreset, setActivePreset] = useState<FairnessCriterion | null>(null)

  const groupNames = [c.groupA, c.groupB]
  const metrics = useMemo(
    () => [groupMetrics(fairnessGroups[0], thresholds[0]), groupMetrics(fairnessGroups[1], thresholds[1])] as [GroupMetrics, GroupMetrics],
    [thresholds],
  )

  const setShared = (value: number) => {
    setThresholds([value, value])
    setActivePreset(null)
  }
  const setOne = (index: 0 | 1, value: number) => {
    setThresholds(prev => (index === 0 ? [value, prev[1]] : [prev[0], value]))
    setActivePreset(null)
  }
  const applyPreset = (criterion: FairnessCriterion) => {
    setSeparate(true)
    setThresholds(bestThresholds(fairnessGroups, criterion))
    setActivePreset(criterion)
  }

  const criterionLabel: Record<FairnessCriterion, string> = {
    selection: c.critSelection,
    tpr: c.critTpr,
    ppv: c.critPpv,
    odds: c.critOdds,
  }

  const rows: { label: string; get: (m: GroupMetrics) => number | null }[] = [
    { label: c.baseRate, get: m => m.baseRate },
    { label: c.selectionRate, get: m => m.selectionRate },
    { label: c.tpr, get: m => m.tpr },
    { label: c.fpr, get: m => m.fpr },
    { label: c.ppv, get: m => m.ppv },
    { label: c.accuracy, get: m => m.accuracy },
  ]

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold font-heading text-text">{c.title}</h3>
        <p className="text-sm text-muted mt-2 leading-relaxed">{c.note}</p>
      </div>

      {/* Mode + presets */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setSeparate(false); setShared(thresholds[0]) }}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${!separate ? 'bg-primary/20 border-primary/40 text-text' : 'border-border text-muted hover:text-text'}`}
          >
            {c.sharedMode}
          </button>
          <button
            type="button"
            onClick={() => setSeparate(true)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${separate ? 'bg-primary/20 border-primary/40 text-text' : 'border-border text-muted hover:text-text'}`}
          >
            {c.separateMode}
          </button>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted mb-2">{c.presetsLabel}</div>
          <div className="flex flex-wrap gap-2">
            {CRITERIA.map(criterion => (
              <button
                key={criterion}
                type="button"
                onClick={() => applyPreset(criterion)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${activePreset === criterion ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'border-border text-muted hover:text-text'}`}
              >
                {criterionLabel[criterion]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid md:grid-cols-2 gap-4">
        {separate ? (
          ([0, 1] as const).map(index => (
            <label key={index} className="block text-sm">
              <span className={GROUP_COLORS[index]}>{c.thresholdFor.replace('{group}', groupNames[index])}</span>
              <span className="text-text font-mono ml-2">{thresholds[index]}</span>
              <input
                className="block w-full mt-2 accent-primary"
                type="range" min={0} max={100} step={THRESHOLD_STEP}
                value={thresholds[index]}
                onChange={e => setOne(index, Number(e.target.value))}
              />
            </label>
          ))
        ) : (
          <label className="block text-sm md:col-span-2">
            <span className="text-muted">{c.thresholdShared}</span>
            <span className="text-text font-mono ml-2">{thresholds[0]}</span>
            <input
              className="block w-full mt-2 accent-primary"
              type="range" min={0} max={100} step={THRESHOLD_STEP}
              value={thresholds[0]}
              onChange={e => setShared(Number(e.target.value))}
            />
          </label>
        )}
      </div>

      {/* Score strips */}
      <div className="space-y-5">
        {fairnessGroups.map((group, gi) => (
          <div key={gi}>
            <div className={`text-sm font-semibold mb-2 ${GROUP_COLORS[gi]}`}>{groupNames[gi]}</div>
            <div className="relative h-12 rounded-lg bg-background border border-border">
              <motion.div
                className="absolute top-0 bottom-0 right-0 bg-emerald-500/10 border-l-2 border-emerald-400"
                initial={false}
                animate={{ left: `${thresholds[gi]}%` }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              />
              {group.map((row, ri) => {
                const selected = row.score >= thresholds[gi]
                return (
                  <motion.div
                    key={ri}
                    className={`absolute top-1/2 w-4 h-4 -ml-2 -mt-2 rounded-full border-2 ${GROUP_BORDER[gi]} ${row.positive ? GROUP_BG[gi] : 'bg-background'}`}
                    style={{ left: `${row.score}%` }}
                    initial={false}
                    animate={{ scale: selected ? 1.15 : 0.85, opacity: selected ? 1 : 0.55 }}
                    title={`${c.score} ${row.score} · ${row.positive ? c.legendPositive : c.legendNegative}`}
                  />
                )
              })}
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-muted inline-block" />{c.legendPositive}</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border-2 border-muted inline-block" />{c.legendNegative}</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500/30 border-l-2 border-emerald-400 inline-block" />{c.legendSelected}</span>
        </div>
      </div>

      {/* Metrics table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-2 pr-3 font-medium">{c.metric}</th>
              <th className={`py-2 px-3 font-medium ${GROUP_COLORS[0]}`}>{c.groupA}</th>
              <th className={`py-2 px-3 font-medium ${GROUP_COLORS[1]}`}>{c.groupB}</th>
              <th className="py-2 pl-3 font-medium">{c.gap}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const a = row.get(metrics[0])
              const b = row.get(metrics[1])
              const gap = a === null || b === null ? null : Math.abs(a - b)
              return (
                <tr key={row.label} className="border-b border-border/50">
                  <td className="py-2 pr-3 text-text">{row.label}</td>
                  <td className="py-2 px-3 font-mono">{pct(a)}</td>
                  <td className="py-2 px-3 font-mono">{pct(b)}</td>
                  <td className={`py-2 pl-3 font-mono ${gap !== null && gap <= TOLERANCE ? 'text-emerald-400' : 'text-orange-400'}`}>{gap === null ? '–' : `${Math.round(gap * 100)} ${c.ppUnit}`}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Criteria status */}
      <div>
        <div className="text-xs uppercase tracking-wide text-muted mb-2">{c.criteriaStatus}</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {CRITERIA.map(criterion => {
            const gap = criterionGap(metrics[0], metrics[1], criterion)
            const ok = gap <= TOLERANCE
            return (
              <motion.div
                key={criterion}
                layout
                className={`p-3 rounded-lg border text-sm ${ok ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-orange-500/30 bg-orange-500/5'}`}
              >
                <div className={`font-semibold ${ok ? 'text-emerald-400' : 'text-orange-400'}`}>{ok ? c.met : c.violated}</div>
                <div className="text-text">{criterionLabel[criterion]}</div>
                <div className="text-xs text-muted font-mono mt-1">{Number.isFinite(gap) ? `Δ ${Math.round(gap * 100)} ${c.ppUnit}` : '–'}</div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Chouldechova identity */}
      <div className="p-4 rounded-xl bg-background border border-border space-y-2">
        <div className="text-sm font-semibold text-text">{c.identityTitle}</div>
        <div className="font-mono text-sm text-text">{t.bias.compasFormula}</div>
        {metrics.map((m, gi) => (
          <div key={gi} className={`font-mono text-xs ${GROUP_COLORS[gi]}`}>
            {groupNames[gi]}: {m.ppv === null || m.ppv === 0
              ? c.identityUndefined
              : `${m.baseRate.toFixed(2)} / ${(1 - m.baseRate).toFixed(2)} · ${(1 - m.ppv).toFixed(2)} / ${m.ppv.toFixed(2)} · ${m.tpr.toFixed(2)} = ${((m.baseRate / (1 - m.baseRate)) * ((1 - m.ppv) / m.ppv) * m.tpr).toFixed(2)}`}
          </div>
        ))}
        <p className="text-xs text-muted leading-relaxed">{c.identityNote}</p>
      </div>

      <p className="text-sm text-muted leading-relaxed">{c.lesson}</p>
    </div>
  )
}
