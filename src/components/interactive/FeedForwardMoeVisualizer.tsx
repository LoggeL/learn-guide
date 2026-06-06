'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { GitBranch, Layers3, Network, SlidersHorizontal } from 'lucide-react'

type Locale = 'en' | 'de'
type ScenarioId = 'code' | 'math' | 'story'
type TopK = 1 | 2 | 3

interface FeedForwardMoeVisualizerProps {
  locale?: Locale
}

const expertColors = ['#22d3ee', '#a78bfa', '#34d399', '#f59e0b', '#f472b6', '#60a5fa']

const copy = {
  en: {
    title: 'Sparse FFN routing: dense path vs MoE experts',
    subtitle: 'Attention mixes context first. The FFN then transforms each token; in MoE, a small router picks only a few expert MLPs per token.',
    tokenType: 'Token stream',
    topK: 'Experts per token (top-k)',
    dense: 'Dense FFN: one shared MLP runs for every token',
    moe: 'MoE FFN: router activates a sparse subset of expert MLPs',
    attention: 'Attention output',
    router: 'Router',
    combine: 'Weighted combine',
    utilization: 'Expert utilization for this mini-batch',
    activeParams: 'active expert compute',
    totalParams: 'expert pool loaded',
    note: 'MoE is not several full models voting. It is one transformer layer with many FFN experts; each token visits only top-k experts, then their outputs are combined back into the same residual stream.',
    scenarios: {
      code: 'Code + syntax tokens',
      math: 'Math reasoning tokens',
      story: 'Narrative text tokens',
    },
  },
  de: {
    title: 'Sparse FFN-Routing: dichter Pfad vs. MoE-Experts',
    subtitle: 'Attention mischt zuerst Kontext. Danach transformiert das FFN jedes Token; bei MoE wählt ein kleiner Router nur wenige Expert-MLPs pro Token.',
    tokenType: 'Token-Strom',
    topK: 'Experts pro Token (top-k)',
    dense: 'Dichtes FFN: ein gemeinsames MLP läuft für jedes Token',
    moe: 'MoE-FFN: Router aktiviert eine sparse Teilmenge von Expert-MLPs',
    attention: 'Attention-Ausgabe',
    router: 'Router',
    combine: 'Gewichtet kombinieren',
    utilization: 'Expert-Auslastung für diesen Mini-Batch',
    activeParams: 'aktive Expert-Rechnung',
    totalParams: 'geladener Expert-Pool',
    note: 'MoE sind nicht mehrere vollständige Modelle, die abstimmen. Es ist eine Transformer-Schicht mit vielen FFN-Experts; jedes Token besucht nur top-k Experts, dann werden die Ausgaben zurück in denselben Residual Stream kombiniert.',
    scenarios: {
      code: 'Code- und Syntax-Tokens',
      math: 'Mathe-Reasoning-Tokens',
      story: 'Erzähltext-Tokens',
    },
  },
}

const expertNames = ['Syntax', 'Facts', 'Logic', 'Style', 'Entities', 'Patterns']

const scenarios: Record<ScenarioId, { tokens: string[]; scores: number[][] }> = {
  code: {
    tokens: ['function', 'user', '.', 'map', '=>'],
    scores: [
      [0.91, 0.12, 0.48, 0.18, 0.22, 0.66],
      [0.42, 0.23, 0.28, 0.18, 0.87, 0.54],
      [0.86, 0.08, 0.31, 0.11, 0.17, 0.72],
      [0.63, 0.16, 0.49, 0.20, 0.25, 0.82],
      [0.94, 0.10, 0.57, 0.16, 0.13, 0.68],
    ],
  },
  math: {
    tokens: ['If', 'x²', '+', '2x', '='],
    scores: [
      [0.30, 0.24, 0.73, 0.45, 0.17, 0.39],
      [0.26, 0.18, 0.95, 0.31, 0.09, 0.62],
      [0.52, 0.12, 0.88, 0.24, 0.11, 0.67],
      [0.22, 0.14, 0.91, 0.28, 0.10, 0.58],
      [0.61, 0.16, 0.82, 0.20, 0.13, 0.49],
    ],
  },
  story: {
    tokens: ['The', 'dragon', 'whispered', 'her', 'name'],
    scores: [
      [0.40, 0.30, 0.20, 0.70, 0.36, 0.26],
      [0.18, 0.74, 0.24, 0.63, 0.88, 0.31],
      [0.23, 0.42, 0.35, 0.91, 0.54, 0.37],
      [0.14, 0.39, 0.29, 0.64, 0.93, 0.21],
      [0.20, 0.51, 0.22, 0.78, 0.89, 0.27],
    ],
  },
}

function topExpertIndexes(scores: number[], topK: TopK) {
  return scores
    .map((score, index) => ({ score, index }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.index)
}

export function FeedForwardMoeVisualizer({ locale = 'en' }: FeedForwardMoeVisualizerProps) {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('code')
  const [topK, setTopK] = useState<TopK>(2)
  const [selectedToken, setSelectedToken] = useState(0)
  const c = locale === 'de' ? copy.de : copy.en
  const scenario = scenarios[scenarioId]

  const routes = useMemo(
    () => scenario.scores.map((scores) => topExpertIndexes(scores, topK)),
    [scenario, topK]
  )

  const utilization = useMemo(() => {
    const counts = Array(expertNames.length).fill(0) as number[]
    routes.forEach((route) => route.forEach((expert) => counts[expert] += 1))
    return counts
  }, [routes])

  const activeRoute = routes[selectedToken]
  const maxUtilization = Math.max(...utilization, 1)
  const activePercent = Math.round((topK / expertNames.length) * 100)

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface/60 shadow-2xl shadow-cyan-950/10">
      <div className="border-b border-border bg-surface-elevated/70 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10">
              <Network size={20} className="text-cyan-300" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-gradient md:text-2xl">{c.title}</h2>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">{c.subtitle}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:min-w-[340px]">
            <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-muted">
              {c.tokenType}
              <select
                value={scenarioId}
                onChange={(event) => {
                  setScenarioId(event.target.value as ScenarioId)
                  setSelectedToken(0)
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm normal-case tracking-normal text-text outline-none transition-colors hover:border-cyan-400/40 focus:border-cyan-300"
              >
                <option value="code">{c.scenarios.code}</option>
                <option value="math">{c.scenarios.math}</option>
                <option value="story">{c.scenarios.story}</option>
              </select>
            </label>
            <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-muted">
              {c.topK}
              <select
                value={topK}
                onChange={(event) => setTopK(Number(event.target.value) as TopK)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm normal-case tracking-normal text-text outline-none transition-colors hover:border-violet-400/40 focus:border-violet-300"
              >
                <option value={1}>top-1</option>
                <option value={2}>top-2</option>
                <option value={3}>top-3</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.25fr_0.9fr] md:p-6">
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <Layers3 size={16} />
              {c.dense}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              {scenario.tokens.map((token) => (
                <span key={token} className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-text">{token}</span>
              ))}
              <span className="text-muted">→</span>
              <span className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 font-semibold text-emerald-200">Shared FFN</span>
              <span className="text-muted">→</span>
              <span className="text-muted">residual stream</span>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-400/20 bg-background/60 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-cyan-200">
              <GitBranch size={16} />
              {c.moe}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_auto_1.25fr] xl:items-center">
              <div>
                <div className="mb-2 text-xs uppercase tracking-wide text-muted">{c.attention}</div>
                <div className="flex flex-wrap gap-2">
                  {scenario.tokens.map((token, index) => (
                    <button
                      key={`${scenarioId}-${token}-${index}`}
                      onClick={() => setSelectedToken(index)}
                      className={clsx(
                        'rounded-lg border px-3 py-2 font-mono text-sm transition-all',
                        selectedToken === index
                          ? 'border-cyan-300 bg-cyan-400/15 text-cyan-100 shadow-lg shadow-cyan-950/25'
                          : 'border-border bg-surface text-muted hover:border-cyan-400/40 hover:text-text'
                      )}
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-muted xl:flex-col">
                <motion.div
                  key={`${scenarioId}-${topK}-${selectedToken}-a`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  className="h-0.5 w-16 origin-left rounded bg-cyan-300 xl:h-12 xl:w-0.5 xl:origin-top"
                />
                <div className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">{c.router}</div>
                <motion.div
                  key={`${scenarioId}-${topK}-${selectedToken}-b`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  className="h-0.5 w-16 origin-left rounded bg-violet-300 xl:h-12 xl:w-0.5 xl:origin-top"
                />
              </div>

              <div>
                <div className="mb-2 text-xs uppercase tracking-wide text-muted">{c.combine}</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {expertNames.map((name, index) => {
                    const score = scenario.scores[selectedToken][index]
                    const isActive = activeRoute.includes(index)
                    return (
                      <motion.div
                        key={name}
                        layout
                        className={clsx(
                          'relative overflow-hidden rounded-xl border p-3 transition-colors',
                          isActive ? 'border-white/30 bg-white/10' : 'border-border bg-surface/70 opacity-65'
                        )}
                      >
                        <div
                          className="absolute inset-x-0 bottom-0 opacity-25"
                          style={{ height: `${score * 100}%`, backgroundColor: expertColors[index] }}
                        />
                        <div className="relative z-10 flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-text">E{index + 1}</span>
                          <span className="text-xs font-mono text-muted">{Math.round(score * 100)}%</span>
                        </div>
                        <div className="relative z-10 mt-1 text-xs text-muted">{name}</div>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative z-10 mt-2 rounded-full px-2 py-0.5 text-center text-[11px] font-bold text-background"
                            style={{ backgroundColor: expertColors[index] }}
                          >
                            routed
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="mb-4 flex items-center gap-2 font-semibold text-text">
              <SlidersHorizontal size={16} className="text-violet-300" />
              {c.utilization}
            </div>
            <div className="space-y-3">
              {expertNames.map((name, index) => {
                const count = utilization[index]
                return (
                  <div key={name}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted">E{index + 1} · {name}</span>
                      <span className="font-mono text-text">{count}/{scenario.tokens.length * topK}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: expertColors[index] }}
                        animate={{ width: `${(count / maxUtilization) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
              <div className="text-2xl font-bold text-cyan-200">{activePercent}%</div>
              <div className="text-xs text-muted">{c.activeParams}</div>
            </div>
            <div className="rounded-xl border border-violet-400/20 bg-violet-400/5 p-4">
              <div className="text-2xl font-bold text-violet-200">100%</div>
              <div className="text-xs text-muted">{c.totalParams}</div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-relaxed text-muted">
            <span className="font-semibold text-amber-200">Key idea: </span>
            {c.note}
          </div>
        </aside>
      </div>
    </section>
  )
}
