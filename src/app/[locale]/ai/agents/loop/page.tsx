'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { AgentLoopVisualizer } from '@/components/interactive/AgentLoopVisualizer'
import { AgentLoopContextCost } from '@/components/interactive/AgentLoopContextCost'
import { useTranslation } from '@/lib/i18n/context'

const KEYWORDS = /("[^"]*"|\b(?:for|in|if|return|raise|try|except|as|continue|True)\b)/g

/** Minimal syntax colouring for the pseudocode block. */
function highlight(code: string) {
  return code.split(KEYWORDS).map((part, i) => {
    if (part.startsWith('"')) return <span key={i} className="text-emerald-400">{part}</span>
    if (/^(for|in|if|return|raise|try|except|as|continue|True)$/.test(part)) return <span key={i} className="text-pink-400">{part}</span>
    return <span key={i}>{part}</span>
  })
}

export default function AgentLoopPage() {
  const { t } = useTranslation()
  const a = t.agentLoop

  const phases = [
    { title: a.observe, desc: a.observeDesc, border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', text: 'text-emerald-400' },
    { title: a.think, desc: a.thinkDesc, border: 'border-cyan-500/20', bg: 'bg-cyan-500/5', text: 'text-cyan-400' },
    { title: a.act, desc: a.actDesc, border: 'border-purple-500/20', bg: 'bg-purple-500/5', text: 'text-purple-400' },
    { title: a.learn, desc: a.learnDesc, border: 'border-orange-500/20', bg: 'bg-orange-500/5', text: 'text-orange-400' },
  ]

  const codeLines: { code: string; comment?: string }[] = [
    { code: 'MAX_TURNS = 10', comment: a.codeCommentBudget },
    { code: 'messages = [user_message]' },
    { code: '' },
    { code: 'for turn in range(MAX_TURNS):' },
    { code: '    response = llm(system_prompt, tools, messages)' },
    { code: '    messages.append(response)', comment: a.codeCommentAppend },
    { code: '' },
    { code: '    if response.stop_reason == "end_turn":' },
    { code: '        return response.text', comment: a.codeCommentDone },
    { code: '' },
    { code: '    if response.stop_reason == "max_tokens":' },
    { code: '        raise Truncated(response)', comment: a.codeCommentTruncated },
    { code: '' },
    { code: '    if response.stop_reason == "tool_use":' },
    { code: '        results = []' },
    { code: '        for call in response.tool_calls:', comment: a.codeCommentParallel },
    { code: '            try:' },
    { code: '                output = run_tool(call.name, call.input)' },
    { code: '                results.append(tool_result(call.id, output))' },
    { code: '            except ToolError as err:', comment: a.codeCommentError },
    { code: '                results.append(tool_result(call.id, str(err), is_error=True))' },
    { code: '        messages.append(user(results))', comment: a.codeCommentOneMessage },
    { code: '        continue' },
    { code: '' },
    { code: '    handle(response.stop_reason)', comment: a.codeCommentOther },
    { code: '' },
    { code: 'raise BudgetExceeded(MAX_TURNS)', comment: a.codeCommentExhausted },
  ]

  const stopReasons = [
    { code: 'end_turn', desc: a.stopEndTurn },
    { code: 'tool_use', desc: a.stopToolUse },
    { code: 'max_tokens', desc: a.stopMaxTokens },
    { code: 'pause_turn', desc: a.stopPauseTurn },
    { code: 'refusal', desc: a.stopRefusal },
    { code: 'model_context_window_exceeded', desc: a.stopContextExceeded },
  ]

  const stopCriteria = [
    { title: a.stopModelTitle, desc: a.stopModelDesc },
    { title: a.stopBudgetTitle, desc: a.stopBudgetDesc },
    { title: a.stopCostTitle, desc: a.stopCostDesc },
    { title: a.stopVerifyTitle, desc: a.stopVerifyDesc },
    { title: a.stopHumanTitle, desc: a.stopHumanDesc },
    { title: a.stopProgressTitle, desc: a.stopProgressDesc },
  ]

  const compareRows = [
    { dim: a.rowSteps, workflow: a.rowStepsWorkflow, agent: a.rowStepsAgent },
    { dim: a.rowControl, workflow: a.rowControlWorkflow, agent: a.rowControlAgent },
    { dim: a.rowCost, workflow: a.rowCostWorkflow, agent: a.rowCostAgent },
    { dim: a.rowFit, workflow: a.rowFitWorkflow, agent: a.rowFitAgent },
  ]

  const sources = [
    { label: a.sourceEffectiveAgents, href: 'https://www.anthropic.com/engineering/building-effective-agents' },
    { label: a.sourceStopReasons, href: 'https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons' },
    { label: a.sourceToolCalls, href: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls' },
    { label: a.sourceParallel, href: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use' },
    { label: a.sourceCaching, href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching' },
    { label: a.sourceOpenAiRunner, href: 'https://openai.github.io/openai-agents-python/running_agents/' },
    { label: a.sourceReact, href: 'https://arxiv.org/abs/2210.03629' },
  ]

  return (
    <TopicLayout topicId="agent-loop"
      title={a.title}
      description={a.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: a.title },
      ]}
    >
      {/* What is the loop */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{a.whatIs}</h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed text-lg">{a.whatIsDesc}</p>
          <p className="text-muted leading-relaxed">{a.whatIsOrigin}</p>
          <div className="mt-2 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <p className="text-xl text-text font-heading font-semibold mb-0">
              {a.realityPrefix} <code className="px-2 py-1 rounded bg-surface-elevated text-primary-light">while</code>{a.realitySuffix}
            </p>
          </div>
        </div>
      </section>

      {/* The four steps of one iteration */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{a.phases}</h2>
        <p className="text-muted mb-6">{a.phasesIntro}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {phases.map((phase, i) => (
            <div key={phase.title} className={`p-5 rounded-xl ${phase.bg} border ${phase.border}`}>
              <h3 className={`text-lg font-bold font-heading ${phase.text} mb-2`}>{i + 1}. {phase.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{phase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pseudocode */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{a.corePattern}</h2>
        <p className="text-muted mb-6">{a.corePatternIntro}</p>
        <div className="rounded-2xl bg-background border border-border p-5 md:p-6 font-mono text-xs md:text-sm overflow-x-auto">
          <pre className="text-text">
            <code>
              {codeLines.map((line, i) => (
                <div key={i} className="whitespace-pre">
                  {highlight(line.code)}
                  {line.comment && <span className="text-muted">{'  '}{line.comment}</span>}
                  {line.code === '' && ' '}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </section>

      {/* Three details */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{a.detailsTitle}</h2>
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{a.detailStopTitle}</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">{a.detailStopDesc}</p>
            <div className="overflow-hidden rounded-xl border border-border">
              {stopReasons.map((row, i) => (
                <div key={row.code} className={`grid grid-cols-1 md:grid-cols-[minmax(0,16rem)_1fr] text-sm ${i % 2 ? 'bg-background/30' : 'bg-background/60'}`}>
                  <div className={`px-3 pt-3 md:py-3 font-mono text-text break-all ${i > 0 ? 'border-t border-border' : ''}`}>{row.code}</div>
                  <div className={`px-3 pb-3 md:py-3 text-muted ${i > 0 ? 'md:border-t border-border' : ''}`}>{row.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
              <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{a.detailParallelTitle}</h3>
              <p className="text-sm text-muted leading-relaxed">{a.detailParallelDesc}</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
              <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{a.detailErrorTitle}</h3>
              <p className="text-sm text-muted leading-relaxed">{a.detailErrorDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive demo */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-heading text-gradient">{a.watchInAction}</h2>
          <p className="text-sm text-muted mt-1">{a.watchInActionDesc}</p>
        </div>
        <AgentLoopVisualizer />
      </section>

      {/* Stopping criteria */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{a.stopTitle}</h2>
        <p className="text-muted mb-6">{a.stopIntro}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stopCriteria.map((item) => (
            <div key={item.title} className="p-5 rounded-xl bg-surface border border-border">
              <h3 className="text-base font-bold font-heading text-text mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Growing context cost */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{a.costTitle}</h2>
        <div className="space-y-4 mb-6">
          <p className="text-muted leading-relaxed text-lg">{a.costIntro}</p>
          <p className="text-muted leading-relaxed">{a.costWindowNote}</p>
        </div>
        <AgentLoopContextCost />
      </section>

      {/* Workflow vs agent */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{a.workflowTitle}</h2>
        <p className="text-muted mb-6">{a.workflowIntro}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{a.workflowName}</h3>
            <p className="text-sm text-muted leading-relaxed">{a.workflowDef}</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{a.agentName}</h3>
            <p className="text-sm text-muted leading-relaxed">{a.agentDef}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="hidden md:grid md:grid-cols-3 bg-background/60 text-sm font-bold">
            <div className="p-3 border-r border-border text-muted" />
            <div className="p-3 border-r border-border text-cyan-400">{a.workflowName}</div>
            <div className="p-3 text-purple-400">{a.agentName}</div>
          </div>
          {compareRows.map((row, i) => (
            <div key={row.dim} className={`grid grid-cols-1 md:grid-cols-3 text-sm ${i % 2 ? 'bg-background/30' : ''}`}>
              <div className="p-3 font-semibold text-text border-t border-border">{row.dim}</div>
              <div className="p-3 text-muted border-t border-border">
                <span className="md:hidden text-cyan-400 font-semibold">{a.workflowName}: </span>{row.workflow}
              </div>
              <div className="p-3 text-muted border-t border-border">
                <span className="md:hidden text-purple-400 font-semibold">{a.agentName}: </span>{row.agent}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted mt-4">{a.workflowAdvice}</p>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{a.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[a.takeaway1, a.takeaway2, a.takeaway3, a.takeaway4].map((item, i) => (
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
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{a.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {sources.map((s) => (
            <li key={s.href}>
              <a className="text-primary-light underline break-words" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
