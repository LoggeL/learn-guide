'use client'

import { useMemo, useState } from 'react'
import { useLocale } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Chip trade-off simulator',
    subtitle: 'Pick a workload and watch the ranking change. The bars show chip strengths; the small percentage next to each metric shows how much that workload cares about it.',
  },
  de: {
    title: 'Chip-Trade-off-Simulator',
    subtitle: 'Wähle einen Workload und beobachte, wie sich das Ranking ändert. Die Balken zeigen die Stärken der Chips; die kleine Prozentzahl neben jeder Metrik zeigt, wie wichtig sie für diesen Workload ist.',
  },
} as const

const metrics = [
  { id: 'throughput', label: 'Throughput', help: 'Raw tensor compute for training or high-volume serving.' },
  { id: 'efficiency', label: 'Efficiency', help: 'Performance per watt. Crucial when power or thermals dominate.' },
  { id: 'latency', label: 'Latency', help: 'How quickly one request can finish.' },
  { id: 'flexibility', label: 'Flexibility', help: 'How easily the chip adapts to new operators and model designs.' },
  { id: 'ecosystem', label: 'Software', help: 'Compilers, kernels, debugging tools, framework support, and hiring pool.' },
  { id: 'cost', label: 'Low cost', help: 'Lower hardware and operational cost scores higher here.' },
] as const

type MetricId = (typeof metrics)[number]['id']
type Chip = { id: string; name: string; tag: string; notes: string; values: Record<MetricId, number> }

const chips: Chip[] = [
  { id: 'gpu', name: 'GPU', tag: 'Flexible parallelism', notes: 'Best default when models change quickly and the software ecosystem matters.', values: { throughput: 88, efficiency: 58, latency: 64, flexibility: 95, ecosystem: 98, cost: 42 } },
  { id: 'tpu', name: 'TPU', tag: 'Datacenter tensor ASIC', notes: 'Great at scale when your stack fits the compiler and pod architecture.', values: { throughput: 92, efficiency: 86, latency: 76, flexibility: 60, ecosystem: 72, cost: 62 } },
  { id: 'npu', name: 'NPU', tag: 'On-device neural engine', notes: 'Designed for private, cheap, low-latency inference under tiny power budgets.', values: { throughput: 45, efficiency: 96, latency: 90, flexibility: 52, ecosystem: 60, cost: 82 } },
  { id: 'asic', name: 'Custom ASIC', tag: 'Purpose-built accelerator', notes: 'Can dominate one workload, but only after massive design and software investment.', values: { throughput: 96, efficiency: 98, latency: 88, flexibility: 30, ecosystem: 45, cost: 30 } },
  { id: 'fpga', name: 'FPGA', tag: 'Reconfigurable hardware', notes: 'Useful for low-latency niches and changing pipelines, but rarely the easiest path.', values: { throughput: 62, efficiency: 72, latency: 84, flexibility: 78, ecosystem: 50, cost: 55 } },
]

const workloads: Record<string, { label: string; description: string; weights: Record<MetricId, number> }> = {
  training: { label: 'Frontier training', description: 'Huge batches, long runs, and expensive distributed clusters.', weights: { throughput: 32, efficiency: 20, latency: 4, flexibility: 10, ecosystem: 18, cost: 16 } },
  inference: { label: 'Cloud inference', description: 'Millions of requests where latency, utilization, and cost all matter.', weights: { throughput: 20, efficiency: 24, latency: 24, flexibility: 8, ecosystem: 12, cost: 12 } },
  edge: { label: 'Phone / edge AI', description: 'Private local inference under tight battery and thermal limits.', weights: { throughput: 8, efficiency: 34, latency: 26, flexibility: 8, ecosystem: 8, cost: 16 } },
  research: { label: 'Research lab', description: 'Model architecture changes faster than hardware can specialize.', weights: { throughput: 18, efficiency: 8, latency: 4, flexibility: 34, ecosystem: 26, cost: 10 } },
}

type Workload = keyof typeof workloads

function scoreChip(chip: Chip, workload: Workload) {
  const weights = workloads[workload].weights
  const score = metrics.reduce((sum, metric) => sum + chip.values[metric.id] * weights[metric.id], 0) / 100
  return Math.round(score)
}

function MetricBar({ metric, value, weight }: { metric: (typeof metrics)[number]; value: number; weight: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs mb-1">
        <span className="text-muted" title={metric.help}>{metric.label}</span>
        <span className="font-mono text-text">{value}<span className="text-muted/70"> · {weight}%</span></span>
      </div>
      <div className="h-2 rounded-full bg-background border border-border overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${value}%`, opacity: 0.35 + weight / 100 }} />
      </div>
    </div>
  )
}

export function ChipTradeoffSimulator() {
  const { locale } = useLocale()
  const c = copy[locale]
  const [workload, setWorkload] = useState<Workload>('inference')
  const ranked = useMemo(
    () => [...chips].sort((a, b) => scoreChip(b, workload) - scoreChip(a, workload)),
    [workload],
  )
  const winner = ranked[0]
  const weights = workloads[workload].weights

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-heading text-gradient mb-2">{c.title}</h3>
        <p className="text-muted text-sm">{c.subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(workloads) as Workload[]).map((key) => (
          <button
            key={key}
            onClick={() => setWorkload(key)}
            className={`rounded-xl border p-4 text-left transition-colors ${workload === key ? 'border-primary bg-primary/10 shadow-glow' : 'border-border bg-surface hover:border-primary/40'}`}
          >
            <div className="font-semibold text-text">{workloads[key].label}</div>
            <div className="text-xs text-muted mt-1 leading-relaxed">{workloads[key].description}</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.3fr] gap-5">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 sticky top-4 self-start">
          <div className="text-sm text-muted mb-2">Best fit for {workloads[workload].label}</div>
          <div className="text-4xl font-bold font-heading text-text mb-2">{winner.name}</div>
          <div className="text-primary-light font-medium mb-4">{winner.tag}</div>
          <p className="text-sm text-muted leading-relaxed mb-4">{winner.notes}</p>
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="text-xs uppercase tracking-wide text-muted mb-2">Workload priorities</div>
            <div className="space-y-2">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-center gap-2 text-xs">
                  <span className="w-24 text-muted">{metric.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden"><div className="h-full bg-secondary" style={{ width: `${weights[metric.id]}%` }} /></div>
                  <span className="w-8 text-right font-mono text-text">{weights[metric.id]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {ranked.map((chip, index) => (
            <div key={chip.id} className={`rounded-xl border p-4 ${index === 0 ? 'border-primary/50 bg-primary/5' : 'border-border bg-surface/70'}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs rounded-full bg-background border border-border px-2 py-0.5 text-muted">#{index + 1}</span>
                    <div className="font-bold text-text">{chip.name}</div>
                  </div>
                  <div className="text-xs text-muted mt-1">{chip.tag}</div>
                </div>
                <div className="text-2xl font-bold font-mono text-primary-light">{scoreChip(chip, workload)}</div>
              </div>
              <p className="text-xs text-muted leading-relaxed mb-4">{chip.notes}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {metrics.map((metric) => (
                  <MetricBar key={metric.id} metric={metric} value={chip.values[metric.id]} weight={weights[metric.id]} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
