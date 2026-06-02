'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, FlaskConical, Play, RotateCcw, ShieldAlert, Target, TestTube2 } from 'lucide-react'

const taskPresets = [
  {
    id: 'code',
    title: 'Coding agent',
    target: 'Patch bug and pass hidden tests',
    verifier: 88,
    realism: 74,
    cost: 46,
    hackRisk: 28,
  },
  {
    id: 'browser',
    title: 'Browser agent',
    target: 'Complete checkout in seeded account',
    verifier: 70,
    realism: 82,
    cost: 64,
    hackRisk: 44,
  },
  {
    id: 'office',
    title: 'Office agent',
    target: 'Fix spreadsheet and regenerate summary',
    verifier: 58,
    realism: 78,
    cost: 54,
    hackRisk: 56,
  },
  {
    id: 'research',
    title: 'Research task',
    target: 'Produce useful market brief',
    verifier: 32,
    realism: 68,
    cost: 38,
    hackRisk: 72,
  },
]

const stages = [
  { icon: Target, title: 'Target', desc: 'Define measurable outcome' },
  { icon: Play, title: 'Rollout', desc: 'Run attempts in sandbox' },
  { icon: TestTube2, title: 'Verifier', desc: 'Score the final state' },
  { icon: CheckCircle2, title: 'Training signal', desc: 'Keep winners, reject failures' },
]

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

function formatCost(value: number) {
  return `${Math.round(value).toLocaleString()} env-min`
}

export function VerifiableRewardsSimulator() {
  const [taskId, setTaskId] = useState('code')
  const [rollouts, setRollouts] = useState(40)
  const [verifierStrictness, setVerifierStrictness] = useState(70)
  const [sandboxRealism, setSandboxRealism] = useState(70)
  const [activeStage, setActiveStage] = useState(0)

  const task = taskPresets.find((preset) => preset.id === taskId) ?? taskPresets[0]

  const metrics = useMemo(() => {
    const verifierFit = (task.verifier + verifierStrictness) / 2
    const environmentFit = (task.realism + sandboxRealism) / 2
    const coverage = clamp(20 + Math.sqrt(rollouts) * 10)
    const rewardQuality = clamp(verifierFit * 0.42 + environmentFit * 0.32 + coverage * 0.26 - task.hackRisk * 0.22)
    const hackPressure = clamp(task.hackRisk + verifierStrictness * 0.28 - sandboxRealism * 0.22 - task.verifier * 0.18)
    const usefulData = Math.round((rollouts * rewardQuality) / 100)
    const envCost = rollouts * (task.cost + sandboxRealism * 0.55)

    return { rewardQuality, hackPressure, usefulData, envCost }
  }, [rollouts, sandboxRealism, task, verifierStrictness])

  const verdict =
    metrics.rewardQuality >= 72 && metrics.hackPressure < 45
      ? 'Strong verifiable training signal'
      : metrics.rewardQuality >= 55
        ? 'Usable, but needs reviewer or hidden checks'
        : 'Weak signal: likely optimizes a proxy'

  return (
    <section className="interactive-surface p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <FlaskConical size={20} className="text-emerald-300" />
            <h2 className="font-heading text-2xl font-bold text-gradient">Reward loop simulator</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Tune the environment and verifier. The goal is not a pretty answer; it is many attempts that produce useful training data.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setTaskId('code')
            setRollouts(40)
            setVerifierStrictness(70)
            setSandboxRealism(70)
            setActiveStage(0)
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background/60 px-3 text-sm font-semibold text-text transition hover:border-primary/40"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {taskPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setTaskId(preset.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  task.id === preset.id
                    ? 'border-primary/60 bg-primary/10'
                    : 'border-border bg-background/50 hover:border-primary/35'
                }`}
              >
                <div className="font-heading text-base font-bold text-text">{preset.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-muted">{preset.target}</div>
              </button>
            ))}
          </div>

          {[
            ['Rollouts', rollouts, setRollouts, 5, 120],
            ['Verifier strictness', verifierStrictness, setVerifierStrictness, 0, 100],
            ['Sandbox realism', sandboxRealism, setSandboxRealism, 0, 100],
          ].map(([label, value, setter, min, max]) => (
            <label key={label as string} className="block rounded-xl border border-border bg-background/50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-text">{label as string}</span>
                <span className="text-sm tabular-nums text-primary-light">{value as number}</span>
              </div>
              <input
                type="range"
                min={min as number}
                max={max as number}
                value={value as number}
                onChange={(event) => (setter as (next: number) => void)(Number(event.target.value))}
                className="w-full"
              />
            </label>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            {stages.map(({ icon: Icon, title, desc }, index) => (
              <button
                key={title}
                type="button"
                onClick={() => setActiveStage(index)}
                className={`rounded-xl border p-3 text-left transition ${
                  activeStage === index
                    ? 'border-emerald-400/60 bg-emerald-500/10'
                    : 'border-border bg-background/45 hover:border-emerald-400/35'
                }`}
              >
                <Icon size={18} className={activeStage === index ? 'mb-2 text-emerald-300' : 'mb-2 text-muted'} />
                <div className="text-sm font-bold text-text">{title}</div>
                <div className="mt-1 text-xs leading-snug text-muted">{desc}</div>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-background/50 p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-muted">Current scenario</p>
                <h3 className="font-heading text-xl font-bold text-text">{task.title}</h3>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase text-emerald-300">
                {metrics.usefulData} useful
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Reward quality', metrics.rewardQuality, 'bg-emerald-400'],
                ['Reward-hacking pressure', metrics.hackPressure, 'bg-amber-400'],
              ].map(([label, value, color]) => (
                <div key={label as string}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-text">{label as string}</span>
                    <span className="tabular-nums text-muted">{Math.round(value as number)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-surface">
                    <div className={`h-full ${color as string}`} style={{ width: `${value as number}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <p className="text-xs text-muted">Attempts</p>
                <p className="text-lg font-bold text-text">{rollouts}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <p className="text-xs text-muted">Environment cost</p>
                <p className="text-lg font-bold text-text">{formatCost(metrics.envCost)}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <p className="text-xs text-muted">Verifier</p>
                <p className="text-lg font-bold text-text">{task.verifier}% fit</p>
              </div>
            </div>

            <div className="mt-5 flex gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed text-muted">
              {metrics.hackPressure > 55 ? (
                <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-300" />
              ) : (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
              )}
              <p>{verdict}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
