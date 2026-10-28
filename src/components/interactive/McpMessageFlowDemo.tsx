'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type Actor = 'model' | 'host' | 'server' | 'user'

interface Message {
  from: Actor
  to: Actor
  body: unknown
  note?: 'provider' | 'ui'
}

const META = { 'io.modelcontextprotocol/protocolVersion': '2026-07-28' }
const ACTOR_STYLE: Record<Actor, string> = {
  model: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
  host: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
  server: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
  user: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
}

export function McpMessageFlowDemo() {
  const { t } = useTranslation()
  const c = t.mcp.flow
  const [step, setStep] = useState(0)

  const inputSchema = {
    type: 'object',
    properties: { title: { type: 'string' } },
    required: ['title'],
  }
  const elicitation = {
    method: 'elicitation/create',
    params: {
      mode: 'form',
      message: c.elicitMessage,
      requestedSchema: {
        type: 'object',
        properties: { repo: { type: 'string', enum: ['acme/web', 'acme/api'] } },
        required: ['repo'],
      },
    },
  }
  const requestState = 'eyJ0b29sIjoiY3JlYXRlX2lzc3VlIn0.hmac…'

  const steps: Message[][] = [
    [
      { from: 'host', to: 'server', body: { jsonrpc: '2.0', id: 1, method: 'tools/list', params: { _meta: META } } },
      {
        from: 'server', to: 'host', body: {
          jsonrpc: '2.0', id: 1, result: {
            resultType: 'complete',
            tools: [{ name: 'create_issue', description: c.toolDescription, inputSchema }],
            ttlMs: 300000, cacheScope: 'private',
          },
        },
      },
    ],
    [{ from: 'host', to: 'model', note: 'provider', body: { tools: [{ name: 'github__create_issue', description: c.toolDescription, input_schema: inputSchema }] } }],
    [{ from: 'model', to: 'host', note: 'provider', body: { type: 'tool_use', name: 'github__create_issue', input: { title: c.issueTitle } } }],
    [{ from: 'host', to: 'server', body: { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { _meta: META, name: 'create_issue', arguments: { title: c.issueTitle } } } }],
    [{ from: 'server', to: 'host', body: { jsonrpc: '2.0', id: 2, result: { resultType: 'input_required', inputRequests: { repo_choice: elicitation }, requestState } } }],
    [
      { from: 'user', to: 'host', note: 'ui', body: { action: 'accept', content: { repo: 'acme/web' } } },
      {
        from: 'host', to: 'server', body: {
          jsonrpc: '2.0', id: 3, method: 'tools/call', params: {
            _meta: META, name: 'create_issue', arguments: { title: c.issueTitle },
            inputResponses: { repo_choice: { action: 'accept', content: { repo: 'acme/web' } } },
            requestState,
          },
        },
      },
    ],
    [
      { from: 'server', to: 'host', body: { jsonrpc: '2.0', id: 3, result: { resultType: 'complete', content: [{ type: 'text', text: c.resultText }], isError: false } } },
      { from: 'host', to: 'model', note: 'provider', body: { type: 'tool_result', content: c.resultText } },
    ],
  ]

  const actorLabel: Record<Actor, string> = { model: c.model, host: c.host, server: c.server, user: c.user }
  const current = c.steps[step]
  const total = steps.length

  return (
    <div className="rounded-xl bg-surface border border-border p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-wider text-muted font-heading">
          {c.stepOf.replace('{current}', String(step + 1)).replace('{total}', String(total))}
        </span>
        <div className="flex gap-2">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm text-muted hover:text-text disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" />{c.back}
          </button>
          {step < total - 1 ? (
            <button onClick={() => setStep(s => Math.min(total - 1, s + 1))} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/20 text-primary-light text-sm">
              {c.next}<ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => setStep(0)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/20 text-primary-light text-sm">
              <RotateCcw className="w-4 h-4" />{c.restart}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1" aria-hidden>
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-3">
          <div>
            <h4 className="text-text font-semibold">{step + 1}. {current.title}</h4>
            <p className="text-sm text-muted mt-1">{current.desc}</p>
          </div>
          {steps[step].map((message, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }} className="rounded-lg border border-border bg-background overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-border">
                <span className={`px-2 py-0.5 rounded border text-xs font-medium ${ACTOR_STYLE[message.from]}`}>{actorLabel[message.from]}</span>
                <ArrowRight className="w-4 h-4 text-muted" />
                <span className={`px-2 py-0.5 rounded border text-xs font-medium ${ACTOR_STYLE[message.to]}`}>{actorLabel[message.to]}</span>
                {message.note && <span className="ml-auto text-xs text-orange-300">{message.note === 'ui' ? c.notMcpUi : c.notMcp}</span>}
              </div>
              <pre className="p-3 text-xs font-mono text-muted overflow-x-auto">{JSON.stringify(message.body, null, 2)}</pre>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <p className="text-xs text-muted">{c.note}</p>
    </div>
  )
}
