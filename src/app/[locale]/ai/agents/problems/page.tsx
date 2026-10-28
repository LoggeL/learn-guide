'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { ErrorCompoundingDemo } from '@/components/interactive/ErrorCompoundingDemo'
import { useTranslation } from '@/lib/i18n/context'
import { Clock, Compass, FlaskConical, Flag, Hourglass, Repeat, Wrench, Zap, type LucideIcon } from 'lucide-react'

type ModeKey = 'toolMisuse' | 'loops' | 'goalDrift' | 'prematureDone' | 'rewardHacking' | 'contextRot' | 'overeager'

const MODES: { key: ModeKey; Icon: LucideIcon; box: string; icon: string }[] = [
  { key: 'toolMisuse', Icon: Wrench, box: 'bg-red-500/5 border-red-500/20', icon: 'bg-red-500/20 text-red-400' },
  { key: 'loops', Icon: Repeat, box: 'bg-orange-500/5 border-orange-500/20', icon: 'bg-orange-500/20 text-orange-400' },
  { key: 'goalDrift', Icon: Compass, box: 'bg-yellow-500/5 border-yellow-500/20', icon: 'bg-yellow-500/20 text-yellow-400' },
  { key: 'prematureDone', Icon: Flag, box: 'bg-purple-500/5 border-purple-500/20', icon: 'bg-purple-500/20 text-purple-400' },
  { key: 'rewardHacking', Icon: FlaskConical, box: 'bg-pink-500/5 border-pink-500/20', icon: 'bg-pink-500/20 text-pink-400' },
  { key: 'contextRot', Icon: Hourglass, box: 'bg-cyan-500/5 border-cyan-500/20', icon: 'bg-cyan-500/20 text-cyan-400' },
  { key: 'overeager', Icon: Zap, box: 'bg-rose-500/5 border-rose-500/20', icon: 'bg-rose-500/20 text-rose-400' },
]

// Teaching assumptions for the cost example: system prompt + task, per-call output, tool result appended after each call.
const BASE_INPUT = 1000
const AGENT_OUTPUTS = [100, 200, 300]
const TOOL_RESULTS = [700, 1000]
const MODEL_SECONDS = [1.5, 2, 3]
const TOOL_SECONDS = [0.4, 0.6]
const CHAT = { input: 1000, output: 200, seconds: 2 }
const PRICE_INPUT = 1
const PRICE_OUTPUT = 4

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}

export default function AgentProblemsPage() {
  const { t, locale } = useTranslation()
  const p = t.agentProblems
  const href = (path: string) => `/${locale}${path}`

  const num = new Intl.NumberFormat(locale)
  const money = (value: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', minimumFractionDigits: 4 }).format(value)
  const price = (input: number, output: number) => (input * PRICE_INPUT + output * PRICE_OUTPUT) / 1e6
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

  // Each call re-sends everything before it: input(k+1) = input(k) + output(k) + toolResult(k)
  const agentInputs = AGENT_OUTPUTS.map((_, index) =>
    BASE_INPUT + sum(AGENT_OUTPUTS.slice(0, index)) + sum(TOOL_RESULTS.slice(0, index)))
  const agentCalls = agentInputs.map((input, index) => ({
    label: fill(p.cost.agent, { n: String(index + 1) }),
    input,
    output: AGENT_OUTPUTS[index],
    seconds: MODEL_SECONDS[index],
    growth: index === 0
      ? p.cost.growthStart
      : fill(p.cost.growthNext, { output: num.format(AGENT_OUTPUTS[index - 1]), tool: num.format(TOOL_RESULTS[index - 1]) }),
  }))
  const rows = [{ label: p.cost.chat, input: CHAT.input, output: CHAT.output, seconds: CHAT.seconds, growth: p.cost.growthStart }, ...agentCalls]
  const inputTotal = sum(agentInputs)
  const outputTotal = sum(AGENT_OUTPUTS)
  const agentCost = price(inputTotal, outputTotal)
  const agentSeconds = sum(MODEL_SECONDS) + sum(TOOL_SECONDS)

  const formula = fill(p.cost.formula, {
    inputs: agentInputs.map(value => num.format(value)).join(' + '),
    inputTotal: num.format(inputTotal),
    outputs: AGENT_OUTPUTS.map(value => num.format(value)).join(' + '),
    outputTotal: num.format(outputTotal),
    cost: money(agentCost),
  })
  const timing = fill(p.cost.timing, {
    modelTimes: `(${MODEL_SECONDS.map(value => num.format(value)).join(' + ')})`,
    toolTimes: `(${TOOL_SECONDS.map(value => num.format(value)).join(' + ')})`,
    total: num.format(agentSeconds),
  })

  return (
    <TopicLayout topicId="agent-problems"
      title={p.title}
      description={p.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: p.title },
      ]}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{p.overview}</h2>
        <p className="text-muted leading-relaxed text-lg">{p.overviewDesc}</p>
      </section>

      {/* Compounding errors */}
      <section>
        <ErrorCompoundingDemo />
      </section>

      {/* Failure modes */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{p.modes.title}</h2>
        <p className="text-muted leading-relaxed mb-6">{p.modes.intro}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {MODES.map(({ key, Icon, box, icon }) => {
            const mode = p.modes[key]
            const example = 'example' in mode ? mode.example : null
            return (
              <article key={key} className={`flex flex-col gap-4 p-6 rounded-xl border ${box}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${icon}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg text-text font-semibold font-heading">{mode.title}</h3>
                </div>
                <dl className="space-y-3 text-sm leading-relaxed">
                  <div>
                    <dt className="font-semibold text-text">{p.modes.symptom}</dt>
                    <dd className="text-muted">{mode.symptom}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-text">{p.modes.cause}</dt>
                    <dd className="text-muted">{mode.cause}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-emerald-400">{p.modes.fix}</dt>
                    <dd className="text-muted">{mode.fix}</dd>
                  </div>
                </dl>
                {example && (
                  <div className="p-3 rounded-lg bg-background/60 border border-border text-xs font-mono text-muted">
                    <span className="text-text font-sans font-semibold">{p.modes.example}: </span>{example}
                  </div>
                )}
                {key === 'contextRot' && (
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Link href={href('/ai/llm/context-rot')} className="text-primary-light underline">{p.modes.contextRot.linkContextRot}</Link>
                    <Link href={href('/ai/agents/compaction')} className="text-primary-light underline">{p.modes.contextRot.linkCompaction}</Link>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* Cost & latency */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="p-6 md:p-8 bg-gradient-to-r from-surface to-surface-elevated space-y-4">
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-purple-400" />
            <h2 className="text-2xl font-bold font-heading text-text">{p.cost.title}</h2>
          </div>
          <p className="text-muted leading-relaxed">{p.cost.intro}</p>
          <h3 className="font-semibold text-purple-300">{p.cost.exampleTitle}</h3>
          <p className="text-sm text-muted">{p.cost.assumptions}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr>
                  <th className="p-2 font-medium text-left">{p.cost.colCall}</th>
                  <th className="p-2 font-medium">{p.cost.colInput}</th>
                  <th className="p-2 font-medium text-left">{p.cost.colGrowth}</th>
                  <th className="p-2 font-medium">{p.cost.colOutput}</th>
                  <th className="p-2 font-medium">{p.cost.colSeconds}</th>
                  <th className="p-2 font-medium">{p.cost.colCost}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.label} className={`border-t border-border ${index === 0 ? 'text-muted' : ''}`}>
                    <th scope="row" className="p-2 text-left font-normal whitespace-nowrap">{row.label}</th>
                    <td className="p-2 font-mono">{num.format(row.input)}</td>
                    <td className="p-2 text-left text-xs text-muted">{row.growth}</td>
                    <td className="p-2 font-mono">{num.format(row.output)}</td>
                    <td className="p-2 font-mono">{num.format(row.seconds)}</td>
                    <td className="p-2 font-mono">{money(price(row.input, row.output))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted">{formula}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <p className="rounded-lg border border-border p-4">{p.cost.chatTotal}: <strong>{money(price(CHAT.input, CHAT.output))} · {num.format(CHAT.seconds)} s</strong></p>
            <p className="rounded-lg border border-purple-500/30 p-4">{p.cost.agentTotal}: <strong>{money(agentCost)} · {num.format(agentSeconds)} s</strong></p>
          </div>
          <p className="text-sm text-muted">{timing}</p>
          <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 text-sm text-muted leading-relaxed space-y-2">
            <p>{p.cost.quadratic}</p>
            <p className="flex flex-wrap gap-3">
              <Link href={href('/ai/llm-inference/prompt-caching')} className="text-primary-light underline">{p.cost.linkCaching}</Link>
              <Link href={href('/ai/agents/compaction')} className="text-primary-light underline">{p.cost.linkCompaction}</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{p.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[p.takeaway1, p.takeaway2, p.takeaway3, p.takeaway4, p.takeaway5].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary-light text-sm font-bold">{i + 1}</span>
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sources */}
      <section className="border-t border-border pt-5">
        <h2 className="font-semibold mb-3">{p.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {p.sources.map(source => (
            <li key={source.href}>
              <a className="text-primary-light underline" href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
