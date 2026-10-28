'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { ToolSchemaBuilder } from '@/components/interactive/ToolSchemaBuilder'
import { ToolOutputShaper } from '@/components/interactive/ToolOutputShaper'
import { useTranslation } from '@/lib/i18n/context'

const stepColors = [
  { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  { bg: 'bg-orange-500/20', text: 'text-orange-400' },
]

const badSchema = `{
  "name": "sw",
  "description": "{description}",
  "input_schema": {
    "type": "object",
    "properties": {
      "q": { "type": "string" },
      "n": { "type": "number" }
    }
  }
}`

export default function ToolDesignPage() {
  const { t } = useTranslation()
  const td = t.toolDesign

  const goodSchema = {
    name: 'search_web',
    description: td.goodSchemaDescription,
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: td.goodSchemaQuery },
        max_results: { type: 'integer', description: td.goodSchemaMax, minimum: 1, maximum: 10, default: 5 },
      },
      required: ['query'],
      additionalProperties: false,
    },
  }

  const opaqueError = { type: 'tool_result', tool_use_id: 'toolu_01', is_error: true, content: 'Error 400: Bad Request' }
  const actionableError = { type: 'tool_result', tool_use_id: 'toolu_01', is_error: true, content: td.errorGoodMessage }
  const policyError = { type: 'tool_result', tool_use_id: 'toolu_02', is_error: true, content: td.errorPolicyMessage }

  const toolSearchSnippet = `"tools": [
  { "type": "tool_search_tool_bm25_20251119",
    "name": "tool_search_tool_bm25" },
  { "name": "github_create_issue", "defer_loading": true, … },
  { "name": "slack_post_message", "defer_loading": true, … },
  …
]`

  return (
    <TopicLayout topicId="tool-design"
      title={td.title}
      description={td.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: td.title },
      ]}
    >
      {/* What a tool looks like to the model */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{td.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">{td.whatIsDesc}</p>
        <h3 className="text-lg font-bold font-heading text-text mb-4">{td.loopTitle}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {td.loopSteps.map((step, i) => (
            <div key={step.title} className="p-4 bg-background rounded-xl border border-border">
              <div className={`w-8 h-8 rounded-lg ${stepColors[i].bg} flex items-center justify-center mb-3`}>
                <span className={`text-sm font-bold font-mono ${stepColors[i].text}`}>{i + 1}</span>
              </div>
              <h4 className="text-sm font-bold text-text mb-1">{step.title}</h4>
              <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Design Principles */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{td.principles}</h2>
        <p className="text-muted leading-relaxed mb-6">{td.principlesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{td.principle1}</h3>
            <p className="text-sm text-muted">{td.principle1Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{td.principle2}</h3>
            <p className="text-sm text-muted">{td.principle2Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{td.principle3}</h3>
            <p className="text-sm text-muted">{td.principle3Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{td.principle4}</h3>
            <p className="text-sm text-muted">{td.principle4Desc}</p>
          </div>
        </div>
      </section>

      {/* Schema Design */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{td.schemaDesign}</h2>
        <p className="text-muted leading-relaxed mb-6">{td.schemaDesignDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <h3 className="text-sm font-bold text-emerald-400 mb-3">{td.goodSchema}</h3>
            <pre className="text-xs text-muted font-mono overflow-x-auto">{JSON.stringify(goodSchema, null, 2)}</pre>
          </div>
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <h3 className="text-sm font-bold text-red-400 mb-3">{td.badSchema}</h3>
            <pre className="text-xs text-muted font-mono overflow-x-auto">{badSchema.replace('{description}', td.badSchemaDescription)}</pre>
          </div>
        </div>
        <h3 className="text-lg font-bold font-heading text-text mt-6 mb-3">{td.badIssuesTitle}</h3>
        <ul className="space-y-2 text-sm text-muted list-disc pl-5">
          {td.badIssues.map(issue => <li key={issue}>{issue}</li>)}
        </ul>
      </section>

      {/* Tool outputs */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{td.outputs}</h2>
        <p className="text-muted leading-relaxed mb-6">{td.outputsDesc}</p>
        <ToolOutputShaper />
      </section>

      {/* Error Handling */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{td.errorHandling}</h2>
        <p className="text-muted leading-relaxed mb-6">{td.errorHandlingDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <h3 className="text-sm font-bold text-red-400 mb-3">{td.errorBadLabel}</h3>
            <pre className="text-xs text-muted font-mono whitespace-pre-wrap break-words">{JSON.stringify(opaqueError, null, 2)}</pre>
          </div>
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-emerald-400">{td.errorGoodLabel}</h3>
            <pre className="text-xs text-muted font-mono whitespace-pre-wrap break-words">{JSON.stringify(actionableError, null, 2)}</pre>
            <pre className="text-xs text-muted font-mono whitespace-pre-wrap break-words">{JSON.stringify(policyError, null, 2)}</pre>
          </div>
        </div>
        <ul className="mt-6 space-y-2 text-sm text-muted list-disc pl-5">
          {td.errorPoints.map(point => <li key={point}>{point}</li>)}
        </ul>
      </section>

      {/* Strict mode */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{td.strict}</h2>
        <p className="text-muted leading-relaxed mb-6">{td.strictDesc}</p>
        <ul className="space-y-3 mb-6">
          {td.strictRules.map((rule, i) => (
            <li key={rule} className="flex gap-3 items-start p-4 bg-surface rounded-xl border border-border">
              <span className={`w-6 h-6 rounded-lg ${stepColors[i].bg} flex items-center justify-center shrink-0 text-sm font-bold ${stepColors[i].text}`}>{i + 1}</span>
              <span className="text-sm text-muted leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-text p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">{td.strictLimit}</p>
      </section>

      {/* Tool search */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{td.toolSearch}</h2>
        <p className="text-muted leading-relaxed mb-6">{td.toolSearchDesc}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <pre className="p-4 bg-background rounded-xl border border-border text-xs text-muted font-mono overflow-x-auto">{toolSearchSnippet}</pre>
          <div className="space-y-3">
            {td.toolSearchStats.map(stat => (
              <div key={stat.value} className="p-3 bg-background rounded-xl border border-border">
                <div className="text-lg font-bold font-mono text-cyan-400">{stat.value}</div>
                <div className="text-xs text-muted">{stat.label}</div>
              </div>
            ))}
            <p className="text-xs text-muted">{td.toolSearchStatsNote}</p>
          </div>
        </div>
        <p className="text-muted leading-relaxed">{td.toolSearchWhen}</p>
      </section>

      {/* Evals */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{td.evals}</h2>
        <p className="text-muted leading-relaxed mb-6">{td.evalsDesc}</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {td.evalSteps.map((step, i) => (
            <div key={step.title} className="p-4 bg-surface rounded-xl border border-border">
              <div className={`w-8 h-8 rounded-lg ${stepColors[i].bg} flex items-center justify-center mb-3`}>
                <span className={`text-sm font-bold font-mono ${stepColors[i].text}`}>{i + 1}</span>
              </div>
              <h3 className="text-sm font-bold text-text mb-1">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted italic">{td.evalsExample}</p>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-heading text-text">{td.interactiveDemo}</h2>
          <p className="text-sm text-muted">{td.demoDesc}</p>
        </div>
        <ToolSchemaBuilder />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{td.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {td.takeaways.map((item, i) => (
              <li key={item} className="flex gap-3 items-start">
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
      <section className="rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold font-heading text-text mb-3">{td.sources}</h2>
        <ul className="space-y-1 text-sm">
          {td.sourceLinks.map(link => (
            <li key={link.href}>
              <a className="text-primary-light underline" href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
