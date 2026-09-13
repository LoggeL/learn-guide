'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { modelComparisons, modelLandscape, dominates, paretoFront } from '@/lib/model-landscape'

const front = paretoFront(modelComparisons)
const frontIds = new Set(front.map((model) => model.id))
const shortlist = ['gpt-5-6-luna', 'glm-5-3-flash', 'claude-fable-5-1']
const y = (score: number) => 290 - ((score - 34) / 22) * 260
const pointLabels: Record<string, { text: string; dx: number; dy: number }> = {
  'gpt-5-6-luna': { text: 'Luna max', dx: 12, dy: 18 },
  'glm-5-3-flash': { text: 'GLM Flash', dx: 12, dy: 18 },
  'gpt-6-astra': { text: 'Astra max', dx: -15, dy: 25 },
  'claude-fable-5-1': { text: 'Fable max', dx: -70, dy: -15 },
}

export function ModelLandscape() {
  const { t, locale } = useTranslation()
  const c = t.modelNotes
  const [selectedId, setSelectedId] = useState('gpt-6-astra')
  const chartRef = useRef<SVGSVGElement>(null)
  const [chartWidth, setChartWidth] = useState(660)
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setChartWidth(entry.contentRect.width)
    })
    observer.observe(chart)
    return () => observer.disconnect()
  }, [])
  // Match SVG units to CSS pixels so labels stay readable on narrow screens.
  const x = (cost: number) => 36 + ((Math.log10(cost) + 1) / 2) * (chartWidth - 60)
  const costTicks = chartWidth < 440 ? [0.1, 0.25, 1, 5, 10] : [0.1, 0.25, 0.5, 1, 2, 5, 10]
  const selected = modelComparisons.find((model) => model.id === selectedId)!
  const dominators = modelComparisons.filter((model) => dominates(model, selected))
  const number = (value: number, digits = 2) => value.toLocaleString(locale, {
    minimumFractionDigits: digits, maximumFractionDigits: digits,
  })
  const dollars = (value: number) => new Intl.NumberFormat(locale, {
    style: 'currency', currency: 'USD', maximumFractionDigits: 2,
  }).format(value)
  const date = new Intl.DateTimeFormat(locale, {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${modelLandscape.snapshotDate}T00:00:00Z`))

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 via-surface to-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <h2 className="font-semibold text-primary-light">{c.mainDriverLabel}</h2>
          <time dateTime={modelLandscape.snapshotDate} className="text-muted">{date}</time>
        </div>
        <p className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">{modelLandscape.mainDriver}</p>
        <p className="mt-4 max-w-2xl text-lg">{c.mainDriverText}</p>
        <p className="mt-3 max-w-2xl text-sm text-muted">{c.mainDriverNote}</p>
      </section>

      <section aria-labelledby="model-shortlist-heading" className="space-y-5">
        <div>
          <h2 id="model-shortlist-heading" className="text-2xl font-semibold">{c.shortlistHeading}</h2>
          <p className="mt-2 text-muted">{c.shortlistIntro}</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {shortlist.map((id, index) => {
            const model = modelComparisons.find((entry) => entry.id === id)!
            const labels = [c.budgetLabel, c.valueLabel, c.qualityLabel]
            const notes = [c.budgetNote, c.valueNote, c.qualityNote]
            return (
              <article key={id} className="flex flex-col rounded-xl border border-border bg-surface/40 p-5">
                <p className="text-sm text-primary-light">{labels[index]}</p>
                <h3 className="mt-2 text-lg font-semibold">{model.name}</h3>
                <p className="mt-4 text-sm tabular-nums">
                  {number(model.intelligence)} {c.indexPoints} · {dollars(model.costUsd)} {c.perTask}
                </p>
                <p className="mt-3 text-sm text-muted">{notes[index]}</p>
                <a className="mt-auto pt-4 text-sm text-primary-light underline underline-offset-4"
                  href={`https://artificialanalysis.ai/models/${id}`} target="_blank" rel="noreferrer">
                  {c.sourceModel}
                </a>
              </article>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="pareto-heading" className="space-y-5 rounded-2xl border border-border bg-surface/30 p-5 sm:p-7">
        <div>
          <h2 id="pareto-heading" className="text-2xl font-semibold">{c.paretoHeading}</h2>
          <p className="mt-2 text-sm text-muted">{c.paretoIntro}</p>
        </div>
        <figure aria-describedby="pareto-caption">
          <div className="mb-2 text-sm font-medium">{c.yAxis}</div>
          <svg ref={chartRef} viewBox={`0 0 ${chartWidth} 330`} className="block h-auto w-full" role="img" aria-labelledby="pareto-title pareto-description">
            <title id="pareto-title">{c.chartTitle}</title>
            <desc id="pareto-description">{c.chartDescription}</desc>
            {[35, 40, 45, 50, 55].map((score) => (
              <g key={score}>
                <line x1={36} x2={chartWidth - 24} y1={y(score)} y2={y(score)} stroke="currentColor" opacity={0.12} />
                <text x={24} y={y(score) + 5} textAnchor="end" fill="currentColor" className="text-[13px]">{score}</text>
              </g>
            ))}
            {costTicks.map((cost) => (
              <g key={cost}>
                <line x1={x(cost)} x2={x(cost)} y1={30} y2={290} stroke="currentColor" opacity={0.08} />
                <text x={x(cost)} y={315} textAnchor="middle" fill="currentColor" className="text-[13px]">{number(cost, cost < 1 ? 2 : 0)}</text>
              </g>
            ))}
            {modelComparisons.map((model) => {
              const cx = x(model.costUsd), cy = y(model.intelligence)
              const label = pointLabels[model.id]
              return (
                <g key={model.id}>
                  {frontIds.has(model.id) ? (
                    <path d={`M ${cx} ${cy - 6} l 6 6 l -6 6 l -6 -6 Z`} fill="#2dd4bf" />
                  ) : (
                    <circle cx={cx} cy={cy} r={5} fill="#94a3b8" />
                  )}
                  {label && <text x={cx + label.dx} y={cy + label.dy} fill="currentColor" className="text-[13px]">{label.text}</text>}
                </g>
              )
            })}
            <circle cx={x(selected.costUsd)} cy={y(selected.intelligence)} r={11} fill="none" stroke="currentColor" strokeWidth={2} />
          </svg>
          <p className="text-center text-sm font-medium">{c.xAxis}</p>
          <figcaption id="pareto-caption" className="mt-4 space-y-2 text-xs text-muted">
            <p className="flex flex-wrap gap-x-5 gap-y-2">
              <span><span aria-hidden="true" className="text-teal-400">◆</span> {c.frontLegend}</span>
              <span><span aria-hidden="true" className="text-slate-400">●</span> {c.otherLegend}</span>
              <span><span aria-hidden="true">◎</span> {c.selectedLegend}</span>
            </p>
            <p>{c.axisNote}</p>
          </figcaption>
        </figure>

        <div className="rounded-xl border border-border bg-background/50 p-4 sm:p-5">
          <label htmlFor="pareto-model" className="block text-sm font-medium">{c.selectLabel}</label>
          <select id="pareto-model" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-surface p-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            {modelComparisons.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}
          </select>
          <div aria-live="polite" aria-atomic="true" className="mt-5 space-y-3">
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className="text-xs text-muted">{c.yAxis}</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">{number(selected.intelligence)}</dd></div>
              <div><dt className="text-xs text-muted">{c.costLabel}</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">{dollars(selected.costUsd)}</dd></div>
            </dl>
            <p className="text-sm font-medium">{frontIds.has(selectedId) ? c.onFront : c.offFront}</p>
            <p className="text-sm text-muted">{dominators.length ? `${c.dominatedBy} ${dominators.map((model) => model.name).join(', ')}.` : c.frontExplanation}</p>
          </div>
        </div>

        <details className="rounded-xl border border-border p-4">
          <summary className="cursor-pointer font-medium">{c.tableHeading}</summary>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm tabular-nums">
              <caption className="mb-3 text-left text-xs text-muted">{c.roundingNote}</caption>
              <thead><tr className="border-b border-border">
                <th scope="col" className="py-3 pr-4">{c.modelLabel}</th>
                <th scope="col" className="px-3 py-3 text-right">{c.indexShort}</th>
                <th scope="col" className="px-3 py-3 text-right">{c.costShort}</th>
                <th scope="col" className="py-3 pl-3">{c.frontShort}</th>
              </tr></thead>
              <tbody>{modelComparisons.map((model) => <tr key={model.id} className="border-b border-border/60 last:border-0">
                <th scope="row" className="min-w-48 py-3 pr-4 font-normal"><a href={`https://artificialanalysis.ai/models/${model.id}`} target="_blank" rel="noreferrer" className="underline decoration-muted/40 underline-offset-4">{model.name}</a></th>
                <td className="px-3 py-3 text-right">{number(model.intelligence)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right">{dollars(model.costUsd)}</td>
                <td className="py-3 pl-3">{frontIds.has(model.id) ? c.yes : c.no}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </details>
      </section>

      <section className="space-y-3 text-sm text-muted" aria-labelledby="model-sources-heading">
        <h2 id="model-sources-heading" className="text-lg font-semibold text-foreground">{c.methodHeading}</h2>
        <p>{c.methodText}</p>
        <p>{c.limitsText}</p>
        <p>{c.astraEvidence} <a className="text-primary-light underline" href={modelLandscape.sources.astraArticle} target="_blank" rel="noreferrer">{c.astraSource}</a></p>
        <p>{c.snapshotLabel} <time dateTime={modelLandscape.snapshotDate}>{date}</time>. {c.snapshotNote}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a className="text-primary-light underline" href={modelLandscape.sources.leaderboard} target="_blank" rel="noreferrer">{c.leaderboardSource}</a>
          <a className="text-primary-light underline" href={modelLandscape.sources.methodology} target="_blank" rel="noreferrer">{c.methodSource}</a>
        </div>
      </section>
    </div>
  )
}
