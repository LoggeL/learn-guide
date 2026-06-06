'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Factory, GitBranch, Layers3, Network, SlidersHorizontal } from 'lucide-react'

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
    denseMachine: 'Monolithic transform press',
    expertWorkshop: 'Expert workshop lanes',
    selectedToken: 'selected token',
    routed: 'routed',
    idle: 'idle',
    workload: 'workload',
    keyIdea: 'Key idea:',
    residual: 'residual stream',
    allTokensShared: '100% tokens · 100% shared MLP',
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
    denseMachine: 'Monolithische Transformationspresse',
    expertWorkshop: 'Expert-Werkstattspuren',
    selectedToken: 'ausgewähltes Token',
    routed: 'geroutet',
    idle: 'inaktiv',
    workload: 'Auslastung',
    keyIdea: 'Kernidee:',
    residual: 'Residual Stream',
    allTokensShared: '100% Tokens · 100% gemeinsames MLP',
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
    <section className="overflow-hidden rounded-[2rem] border border-amber-400/20 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.82))] shadow-2xl shadow-slate-950/25">
      <div className="border-b border-amber-400/15 bg-black/15 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10 shadow-inner shadow-amber-950/40">
              <Factory size={22} className="text-amber-200" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-amber-100 md:text-2xl">{c.title}</h2>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-300">{c.subtitle}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:min-w-[340px]">
            <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
              {c.tokenType}
              <select
                value={scenarioId}
                onChange={(event) => {
                  setScenarioId(event.target.value as ScenarioId)
                  setSelectedToken(0)
                }}
                className="w-full rounded-xl border border-amber-300/20 bg-slate-950/70 px-3 py-2 text-sm normal-case tracking-normal text-slate-100 outline-none transition-colors hover:border-amber-300/45 focus:border-amber-200"
              >
                <option value="code">{c.scenarios.code}</option>
                <option value="math">{c.scenarios.math}</option>
                <option value="story">{c.scenarios.story}</option>
              </select>
            </label>
            <label className="space-y-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
              {c.topK}
              <select
                value={topK}
                onChange={(event) => setTopK(Number(event.target.value) as TopK)}
                className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/70 px-3 py-2 text-sm normal-case tracking-normal text-slate-100 outline-none transition-colors hover:border-cyan-300/45 focus:border-cyan-200"
              >
                <option value={1}>top-1</option>
                <option value={2}>top-2</option>
                <option value={3}>top-3</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.3fr_0.8fr] md:p-6">
        <div className="space-y-5">
          <div className="rounded-3xl border border-emerald-300/20 bg-slate-950/45 p-4 shadow-inner shadow-black/30">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <Layers3 size={16} />
              {c.dense}
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr_1fr] lg:items-center">
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">{c.attention}</div>
                <div className="flex flex-wrap gap-2">
                  {scenario.tokens.map((token) => (
                    <span key={token} className="rounded-full border border-emerald-200/20 bg-emerald-200/8 px-3 py-1.5 font-mono text-sm text-emerald-50">
                      {token}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[130px] overflow-hidden rounded-2xl border border-emerald-300/30 bg-[linear-gradient(90deg,rgba(16,185,129,0.08),rgba(16,185,129,0.18),rgba(16,185,129,0.08))] p-4">
                <div className="absolute inset-y-4 left-4 right-4 rounded-full border border-emerald-200/15" />
                <div className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-emerald-300/10 blur-xl" />
                <div className="relative z-10 flex h-full min-h-[96px] flex-col items-center justify-center text-center">
                  <Network size={24} className="mb-2 text-emerald-200" />
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">{c.denseMachine}</div>
                  <div className="mt-1 text-xs text-emerald-100/70">{c.allTokensShared}</div>
                </div>
                {scenario.tokens.map((token, index) => (
                  <motion.span
                    key={`dense-${scenarioId}-${token}-${index}`}
                    className="absolute top-1/2 h-2 w-5 rounded-full bg-emerald-200/80 shadow-[0_0_16px_rgba(110,231,183,0.8)]"
                    initial={{ left: '-12%', opacity: 0 }}
                    animate={{ left: '104%', opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 3.6, repeat: Infinity, delay: index * 0.28, ease: 'linear' }}
                    style={{ marginTop: `${(index - 2) * 10}px` }}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center lg:justify-start">
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/8 px-4 py-3 text-sm font-semibold text-emerald-100">
                  → {c.residual}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-300/20 bg-slate-950/55 p-4 shadow-inner shadow-black/30">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
                <GitBranch size={16} />
                {c.moe}
              </div>
              <div className="rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-xs text-cyan-100">
                {c.selectedToken}: <span className="font-mono font-bold">{scenario.tokens[selectedToken]}</span>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.9fr_150px_1.45fr] xl:items-center">
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">{c.attention}</div>
                <div className="flex flex-wrap gap-2">
                  {scenario.tokens.map((token, index) => (
                    <button
                      key={`${scenarioId}-${token}-${index}`}
                      type="button"
                      onClick={() => setSelectedToken(index)}
                      aria-pressed={selectedToken === index}
                      className={clsx(
                        'rounded-full border px-3 py-2 font-mono text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-200/70',
                        selectedToken === index
                          ? 'border-cyan-200 bg-cyan-300/20 text-cyan-50 shadow-lg shadow-cyan-950/40'
                          : 'border-slate-600 bg-slate-900/70 text-slate-300 hover:border-cyan-300/45 hover:text-cyan-50'
                      )}
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto flex min-h-[135px] w-full max-w-[180px] items-center justify-center rounded-[1.5rem] border border-violet-300/25 bg-violet-300/10 p-3">
                <div className="absolute inset-2 rounded-[1.2rem] border border-dashed border-violet-200/20" />
                <SlidersHorizontal size={28} className="relative z-10 text-violet-100" />
                <div className="absolute bottom-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-100">{c.router}</div>
                {activeRoute.map((expert, routeIndex) => (
                  <motion.div
                    key={`router-pulse-${scenarioId}-${selectedToken}-${topK}-${expert}`}
                    className="absolute right-[-18px] h-2 w-8 rounded-full"
                    style={{ backgroundColor: expertColors[expert], top: `${30 + routeIndex * 22}%` }}
                    initial={{ x: -95, opacity: 0 }}
                    animate={{ x: 12, opacity: [0, 1, 0] }}
                    transition={{ duration: 1.35, repeat: Infinity, delay: routeIndex * 0.18 }}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">{c.expertWorkshop}</div>
                <div className="space-y-2">
                  {expertNames.map((name, index) => {
                    const score = scenario.scores[selectedToken][index]
                    const isActive = activeRoute.includes(index)
                    const routeOrder = Math.max(activeRoute.indexOf(index), 0)
                    return (
                      <motion.div
                        key={name}
                        layout
                        className={clsx(
                          'relative grid min-h-[58px] w-full grid-cols-[54px_1fr_auto] items-center gap-3 overflow-hidden rounded-2xl border p-2 text-left transition-colors',
                          isActive ? 'border-white/25 bg-white/10' : 'border-slate-700/80 bg-slate-900/45 opacity-65'
                        )}
                        aria-label={`E${index + 1} ${name}: ${Math.round(score * 100)}% ${isActive ? c.routed : c.idle}`}
                      >
                        <div className="relative z-10 flex h-10 w-12 items-center justify-center rounded-xl border border-white/10 font-mono text-sm font-bold text-slate-50" style={{ backgroundColor: `${expertColors[index]}33` }}>
                          E{index + 1}
                        </div>
                        <div className="relative z-10 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-100">{name}</span>
                            <span className={clsx('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', isActive ? 'bg-cyan-200 text-slate-950' : 'bg-slate-700 text-slate-300')}>
                              {isActive ? c.routed : c.idle}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: expertColors[index] }}
                              animate={{ width: `${score * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="relative z-10 font-mono text-xs text-slate-300">{Math.round(score * 100)}%</div>
                        {isActive && (
                          <motion.div
                            className="absolute left-[60px] right-14 top-1/2 h-2 -translate-y-1/2 rounded-full opacity-90"
                            style={{ backgroundColor: expertColors[index] }}
                            initial={{ x: '-110%', opacity: 0 }}
                            animate={{ x: '115%', opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.7, repeat: Infinity, delay: routeOrder * 0.22 }}
                            aria-hidden="true"
                          />
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
          <div className="rounded-3xl border border-amber-300/20 bg-slate-950/55 p-4 shadow-inner shadow-black/30">
            <div className="mb-4 flex items-center gap-2 font-semibold text-amber-100">
              <Factory size={16} className="text-amber-200" />
              {c.utilization}
            </div>
            <div className="space-y-3">
              {expertNames.map((name, index) => {
                const count = utilization[index]
                const lanes = Math.max(1, Math.round((count / maxUtilization) * 5))
                return (
                  <div key={name} className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-3">
                    <div className="mb-2 flex justify-between gap-3 text-xs">
                      <span className="text-slate-300">E{index + 1} · {name}</span>
                      <span className="font-mono text-slate-100">{count}/{scenario.tokens.length * topK}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1" aria-label={`${name} ${c.workload}: ${count}`}>
                      {Array.from({ length: 5 }).map((_, laneIndex) => (
                        <motion.div
                          key={laneIndex}
                          className="h-7 rounded-md border border-white/5"
                          style={{ backgroundColor: laneIndex < lanes ? expertColors[index] : 'rgba(51,65,85,0.55)' }}
                          animate={{ opacity: laneIndex < lanes ? [0.55, 1, 0.55] : 0.35 }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: laneIndex * 0.08 }}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-4">
              <div className="text-2xl font-bold text-cyan-100">{activePercent}%</div>
              <div className="text-xs text-slate-400">{c.activeParams}</div>
            </div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/8 p-4">
              <div className="text-2xl font-bold text-amber-100">100%</div>
              <div className="text-xs text-slate-400">{c.totalParams}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/8 p-4 text-sm leading-relaxed text-slate-300">
            <span className="font-semibold text-amber-100">{c.keyIdea} </span>
            {c.note}
          </div>
        </aside>
      </div>
    </section>
  )

}
