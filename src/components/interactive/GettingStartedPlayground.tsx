'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Copy, Check, ChevronDown, ChevronUp, Key, Globe, Loader2, ShieldCheck,
  Eye, EyeOff, RotateCcw, Brain, AlertTriangle, Zap, MessageSquare,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const codeStyle = {
  ...vscDarkPlus,
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    background: 'transparent',
    margin: 0,
    padding: 0,
    fontSize: '0.75rem',
    lineHeight: '1.6',
  },
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    background: 'transparent',
    fontSize: '0.75rem',
  },
}

// Single, beginner-friendly path: OpenRouter's Free Models Router.
// Docs: https://openrouter.ai/docs/guides/routing/routers/free-router
const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'openrouter/free'
const KEY_PREFIX = 'sk-or-'
// Reasoning models spend part of max_tokens on hidden reasoning before the
// visible answer starts. 256 regularly produced empty answers, so start higher.
// https://openrouter.ai/docs/guides/best-practices/reasoning-tokens
const DEFAULT_MAX_TOKENS = 2048

type Role = 'system' | 'user' | 'assistant'

interface ChatMessage {
  role: Role
  content: string
}

interface ResponseMeta {
  model?: string
  finishReason?: string
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
  reasoningTokens?: number
}

/** The API is stateless: every request carries the system message and the whole history. */
function buildRequestMessages(system: string, history: ChatMessage[], next: string): ChatMessage[] {
  const messages: ChatMessage[] = []
  if (system.trim()) messages.push({ role: 'system', content: system.trim() })
  messages.push(...history)
  messages.push({ role: 'user', content: next })
  return messages
}

/** Indent every line except the first, so a JSON block can be embedded in code. */
function indentTail(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return text.split('\n').map((line, i) => (i === 0 ? line : pad + line)).join('\n')
}

const ROLE_STYLES: Record<Role, string> = {
  system: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  user: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  assistant: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
}

function CodeTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
        active ? 'bg-surface/80 text-text border-b-2 border-primary' : 'text-muted hover:text-text'
      }`}
    >
      {label}
    </button>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-muted" />}
    </button>
  )
}

export function GettingStartedPlayground() {
  const { t } = useTranslation()
  const gs = t.gettingStarted

  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState('')
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(DEFAULT_MAX_TOKENS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorStatus, setErrorStatus] = useState<number | null>(null)
  // null = no response yet; '' = response arrived without visible text
  const [lastContent, setLastContent] = useState<string | null>(null)
  const [reasoning, setReasoning] = useState('')
  const [showReasoning, setShowReasoning] = useState(false)
  const [responseMeta, setResponseMeta] = useState<ResponseMeta | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [rawJson, setRawJson] = useState('')
  const [showRaw, setShowRaw] = useState(false)
  const [codeTab, setCodeTab] = useState<'python' | 'javascript' | 'curl'>('curl')
  const abortRef = useRef<AbortController | null>(null)

  const resetResponse = () => {
    setError('')
    setErrorStatus(null)
    setLastContent(null)
    setReasoning('')
    setShowReasoning(false)
    setResponseMeta(null)
    setResponseTime(null)
    setRawJson('')
  }

  const sendMessage = async () => {
    const userText = message.trim()
    if (loading || !apiKey || !userText) return
    setLoading(true)
    resetResponse()

    const outgoing = buildRequestMessages(systemPrompt, history, userText)
    abortRef.current = new AbortController()
    const startTime = performance.now()

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          // Optional attribution headers, see https://openrouter.ai/docs/api/reference/overview
          'HTTP-Referer': window.location.origin,
          'X-OpenRouter-Title': 'Learn AI Guide',
        },
        body: JSON.stringify({ model: MODEL, messages: outgoing, temperature, max_tokens: maxTokens }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const errBody = await res.text()
        let msg = `HTTP ${res.status}`
        try {
          const parsed = JSON.parse(errBody)
          msg = parsed.error?.message || parsed.message || msg
        } catch { /* keep status */ }
        setError(msg)
        setErrorStatus(res.status)
        setLoading(false)
        return
      }

      const data = await res.json()
      const elapsed = Math.round(performance.now() - startTime)
      const choice = data.choices?.[0]
      setRawJson(JSON.stringify(data, null, 2))
      setResponseTime(elapsed)

      if (!choice) {
        setError(data.error?.message || gs.requestFailed)
        setLoading(false)
        return
      }

      // content is `string | null`; reasoning models can return it empty
      const content = typeof choice.message?.content === 'string' ? choice.message.content : ''
      const reasoningText = typeof choice.message?.reasoning === 'string' ? choice.message.reasoning : ''
      setLastContent(content)
      setReasoning(reasoningText)
      setResponseMeta({
        model: data.model,
        finishReason: choice.finish_reason ?? undefined,
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
        reasoningTokens: data.usage?.completion_tokens_details?.reasoning_tokens,
      })

      // Only a visible answer becomes part of the conversation. Otherwise the
      // user turn stays in the input so it can be retried (e.g. with more max_tokens).
      if (content.trim()) {
        setHistory([...outgoing.filter(m => m.role !== 'system'), { role: 'assistant', content }])
        setMessage('')
      }
    } catch (err: unknown) {
      if (!(err instanceof Error && err.name === 'AbortError')) {
        setError(err instanceof Error && err.message ? `${gs.requestFailed} (${err.message})` : gs.requestFailed)
      }
    }
    setLoading(false)
  }

  const stop = () => { abortRef.current?.abort(); setLoading(false) }

  const newConversation = () => {
    if (loading) stop()
    setHistory([])
    resetResponse()
  }

  const finishText = (reason?: string) => {
    switch (reason) {
      case 'stop': return gs.finishStop
      case 'length': return gs.finishLength
      case 'tool_calls': return gs.finishToolCalls
      case 'content_filter': return gs.finishContentFilter
      case 'error': return gs.finishError
      default: return gs.finishOther
    }
  }

  const roleLabel: Record<Role, string> = { system: gs.roleSystem, user: gs.roleUser, assistant: gs.roleAssistant }

  // What the next request would contain (the example question stands in for an empty input)
  const previewMessages = useMemo(
    () => buildRequestMessages(systemPrompt, history, message.trim() || gs.exampleUser1),
    [systemPrompt, history, message, gs.exampleUser1],
  )

  const bodyJson = JSON.stringify(
    { model: MODEL, messages: previewMessages, temperature, max_tokens: maxTokens },
    null,
    2,
  )

  const curlCode = `curl ${ENDPOINT} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '${bodyJson.replace(/'/g, `'\\''`)}'`

  // The body only contains strings and numbers, so the JSON is also a valid Python dict.
  const pythonCode = `import requests

response = requests.post(
    "${ENDPOINT}",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json=${indentTail(bodyJson, 4)},
)

data = response.json()
print(data["choices"][0]["message"]["content"])`

  const jsCode = `const response = await fetch("${ENDPOINT}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${indentTail(bodyJson, 2)}),
});

const data = await response.json();
console.log(data.choices[0].message.content);`

  const codeSnippets = { curl: curlCode, python: pythonCode, javascript: jsCode }

  return (
    <div className="space-y-6">
      {/* Model notice */}
      <div className="rounded-xl border border-violet-500/25 bg-violet-500/10 p-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Globe className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-semibold text-violet-300">{gs.routerName}</span>
        <span className="text-xs text-muted">{gs.modelLabel}:</span>
        <code className="text-xs font-mono text-violet-200 bg-background/60 px-2 py-0.5 rounded">{MODEL}</code>
      </div>

      {/* API Key Input */}
      <div className="rounded-xl bg-surface/50 border border-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-4 h-4 text-primary-light" />
          <span className="text-sm font-medium text-text">{gs.apiKeyLabel}</span>
        </div>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder={`${KEY_PREFIX}...`}
            aria-label={gs.apiKeyLabel}
            autoComplete="off"
            spellCheck={false}
            className="w-full px-3 py-2 pr-10 rounded-lg bg-background border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:border-primary/50"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            aria-label={showKey ? gs.hideKey : gs.showKey}
            title={showKey ? gs.hideKey : gs.showKey}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-text"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="mt-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3 py-2.5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div className="text-xs text-emerald-300/80 leading-relaxed">
            <p>{gs.keyPrivacyNote}</p>
            <a
              href="https://github.com/LoggeL/learn-guide/blob/main/src/components/interactive/GettingStartedPlayground.tsx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1 text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
            >
              {gs.keyPrivacyVerify} ↗
            </a>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-surface/30 border border-border p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted">{gs.temperatureLabel}</span>
            <span className="text-sm font-mono text-primary-light">{temperature.toFixed(1)}</span>
          </div>
          <input
            type="range" min="0" max="2" step="0.1"
            value={temperature}
            onChange={e => setTemperature(parseFloat(e.target.value))}
            aria-label={gs.temperatureLabel}
            className="w-full accent-primary"
          />
        </div>
        <div className="rounded-xl bg-surface/30 border border-border p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted font-mono">{gs.maxTokensLabel}</span>
            <span className="text-sm font-mono text-primary-light">{maxTokens}</span>
          </div>
          <input
            type="range" min="256" max="8192" step="256"
            value={maxTokens}
            onChange={e => setMaxTokens(parseInt(e.target.value, 10))}
            aria-label={gs.maxTokensLabel}
            className="w-full accent-primary"
          />
          <p className="text-xs text-muted/70 mt-2 leading-relaxed">{gs.maxTokensHint}</p>
        </div>
      </div>

      {/* System message */}
      <div className="rounded-xl bg-surface/30 border border-border p-4">
        <label htmlFor="gs-system" className="flex items-center gap-2 mb-2 text-sm font-medium text-text">
          <span className={`px-2 py-0.5 rounded-full border text-[11px] font-mono ${ROLE_STYLES.system}`}>{gs.roleSystem}</span>
          {gs.systemLabel}
        </label>
        <textarea
          id="gs-system"
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
          placeholder={gs.systemPlaceholder}
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:border-primary/50 resize-y"
        />
      </div>

      {/* Conversation */}
      <div className="rounded-xl bg-surface/50 border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-text">{gs.conversationLabel}</span>
          {history.length > 0 && (
            <button
              type="button"
              onClick={newConversation}
              className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-muted border border-border hover:text-text hover:border-primary/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {gs.newConversation}
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-muted/70 mb-3">{gs.conversationEmpty}</p>
        ) : (
          <div className="space-y-2 mb-3 max-h-96 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {history.map((m, i) => (
                <motion.div
                  key={`${i}-${m.role}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-lg border p-3 ${m.role === 'user' ? 'bg-cyan-500/5 border-cyan-500/20 ml-6' : 'bg-purple-500/5 border-purple-500/20 mr-6'}`}
                >
                  <span className={`inline-block mb-1 px-2 py-0.5 rounded-full border text-[11px] font-mono ${ROLE_STYLES[m.role]}`}>
                    {roleLabel[m.role]}
                  </span>
                  <p className="text-sm text-text/90 leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder={gs.messagePlaceholder}
          aria-label={gs.messagePlaceholder}
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:border-primary/50 resize-none"
        />

        {/* What the next request sends */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted font-mono mr-1">{gs.requestPreviewLabel}:</span>
          <AnimatePresence initial={false}>
            {previewMessages.map((m, i) => (
              <motion.span
                key={`${i}-${m.role}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`px-2 py-0.5 rounded-full border text-[11px] font-mono ${ROLE_STYLES[m.role]}`}
              >
                {roleLabel[m.role]}
              </motion.span>
            ))}
          </AnimatePresence>
          <span className="text-xs text-muted/70 ml-1">
            ({gs.requestPreviewCount.replace('{count}', String(previewMessages.length))})
          </span>
        </div>

        <div className="flex justify-end mt-3 gap-2">
          {loading && (
            <button onClick={stop} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors">
              {gs.stopButton}
            </button>
          )}
          <button
            onClick={sendMessage}
            disabled={loading || !apiKey || !message.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary-light text-sm font-medium hover:bg-primary/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {gs.sendButton}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm space-y-1">
          <p><strong>{gs.errorLabel}:</strong> {error}</p>
          {errorStatus === 429 && <p className="text-red-300/80 text-xs">{gs.rateLimitHint}</p>}
        </div>
      )}

      {/* Response Breakdown */}
      {lastContent !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Main Response */}
          <div className="rounded-xl bg-surface/50 border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-text">{gs.responseLabel}</span>
              <span className="text-[11px] font-mono text-muted">choices[0].message.content</span>
            </div>
            {lastContent.trim() ? (
              <div className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{lastContent}</div>
            ) : (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-300">{gs.emptyContentTitle}</p>
                  <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                    {responseMeta?.finishReason === 'length' ? gs.emptyContentLength : gs.emptyContentOther}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Reasoning (only some models return it) */}
          {reasoning && (
            <div className="rounded-xl bg-surface/30 border border-border overflow-hidden">
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-muted hover:text-text transition-colors"
              >
                <Brain className="w-4 h-4 text-fuchsia-400" />
                <span>{gs.reasoningLabel}</span>
                <span className="text-[11px] font-mono text-muted/70">choices[0].message.reasoning</span>
                {showReasoning ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
              </button>
              <AnimatePresence initial={false}>
                {showReasoning && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-xs text-muted leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">{reasoning}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Metadata Breakdown */}
          {responseMeta && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {responseMeta.model && (
                <div className="rounded-xl bg-surface/30 border border-border p-3">
                  <div className="text-xs text-muted mb-1">{gs.modelUsed}</div>
                  <div className="text-sm font-mono text-primary-light truncate" title={responseMeta.model}>
                    {responseMeta.model}
                  </div>
                  <div className="text-xs text-muted/60 mt-1">{gs.modelUsedHint}</div>
                </div>
              )}

              {responseMeta.finishReason && (
                <div className="rounded-xl bg-surface/30 border border-border p-3">
                  <div className="text-xs text-muted mb-1 font-mono">{gs.finishReason}</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    responseMeta.finishReason === 'stop'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : responseMeta.finishReason === 'length'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-blue-500/15 text-blue-400'
                  }`}>
                    {responseMeta.finishReason}
                  </span>
                  <div className="text-xs text-muted/60 mt-1">{finishText(responseMeta.finishReason)}</div>
                </div>
              )}

              {responseTime !== null && (
                <div className="rounded-xl bg-surface/30 border border-border p-3">
                  <div className="text-xs text-muted mb-1">{gs.responseTime}</div>
                  <div className="text-sm font-mono text-primary-light">
                    {responseTime < 1000 ? `${responseTime} ms` : `${(responseTime / 1000).toFixed(2)} s`}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Token Usage */}
          {responseMeta?.totalTokens != null && (
            <div className="rounded-xl bg-surface/30 border border-border p-4">
              <div className="text-xs text-muted mb-3">{gs.tokenUsage}</div>
              <div className="space-y-2.5">
                {[
                  { label: gs.promptTokens, value: responseMeta.promptTokens, bar: 'bg-blue-500/60', text: 'text-blue-400' },
                  { label: gs.completionTokens, value: responseMeta.completionTokens, bar: 'bg-purple-500/60', text: 'text-purple-400' },
                  ...(responseMeta.reasoningTokens
                    ? [{ label: gs.reasoningTokens, value: responseMeta.reasoningTokens, bar: 'bg-fuchsia-500/60', text: 'text-fuchsia-400' }]
                    : []),
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">{row.label}</span>
                      <span className={`font-mono ${row.text}`}>{row.value?.toLocaleString() ?? '—'}</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${row.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(2, ((row.value || 0) / (responseMeta.totalTokens || 1)) * 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-xs pt-1 border-t border-border">
                  <span className="text-muted font-medium">{gs.totalTokens}</span>
                  <span className="font-mono text-text">{responseMeta.totalTokens.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-xs text-muted/60 mt-2">{gs.tokenExplain}</div>
            </div>
          )}
        </motion.div>
      )}

      {/* Raw JSON (collapsible) */}
      {rawJson && (
        <div className="rounded-xl bg-surface/30 border border-border overflow-hidden">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-muted hover:text-text transition-colors"
          >
            <span>{gs.rawJsonLabel}</span>
            {showRaw ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showRaw && (
            <div className="relative px-4 pb-4">
              <CopyButton text={rawJson} />
              <div className="overflow-x-auto max-h-80 rounded-lg bg-[#1e1e1e] p-3">
                <SyntaxHighlighter
                  language="json"
                  style={codeStyle}
                  customStyle={{ background: 'transparent', padding: 0, margin: 0, maxHeight: '20rem' }}
                  wrapLongLines={false}
                >
                  {rawJson}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Code Snippets: the exact request the next Send would make */}
      <div className="rounded-xl bg-surface/30 border border-border overflow-hidden">
        <div className="flex border-b border-border">
          <CodeTab label="curl" active={codeTab === 'curl'} onClick={() => setCodeTab('curl')} />
          <CodeTab label="Python" active={codeTab === 'python'} onClick={() => setCodeTab('python')} />
          <CodeTab label="JavaScript" active={codeTab === 'javascript'} onClick={() => setCodeTab('javascript')} />
        </div>
        <div className="relative p-4">
          <CopyButton text={codeSnippets[codeTab]} />
          <div className="overflow-x-auto max-h-[28rem] rounded-lg bg-[#1e1e1e] p-3">
            <SyntaxHighlighter
              language={codeTab === 'python' ? 'python' : codeTab === 'javascript' ? 'javascript' : 'bash'}
              style={codeStyle}
              customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
              wrapLongLines={false}
            >
              {codeSnippets[codeTab]}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  )
}
