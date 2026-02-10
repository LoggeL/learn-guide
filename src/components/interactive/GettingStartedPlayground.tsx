'use client'

import { useState, useRef } from 'react'
import { Send, Copy, Check, ChevronDown, ChevronUp, Key, Zap, Globe, AlertTriangle, Loader2, ShieldCheck, Clock, Cpu, MessageSquare, Hash } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type Provider = 'openrouter' | 'groq' | 'cerebras'

interface ProviderConfig {
  name: string
  endpoint: string
  models: { id: string; name: string }[]
  keyPrefix: string
}

const PROVIDERS: Record<Provider, ProviderConfig> = {
  openrouter: {
    name: 'OpenRouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    models: [
      { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B' },
      { id: 'google/gemma-3-12b-it:free', name: 'Gemma 3 12B' },
      { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1 24B' },
    ],
    keyPrefix: 'sk-or-',
  },
  groq: {
    name: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
    ],
    keyPrefix: 'gsk_',
  },
  cerebras: {
    name: 'Cerebras',
    endpoint: 'https://api.cerebras.ai/v1/chat/completions',
    models: [
      { id: 'llama3.1-8b', name: 'Llama 3.1 8B' },
      { id: 'llama-3.3-70b', name: 'Llama 3.3 70B' },
      { id: 'gpt-oss-120b', name: 'GPT-OSS 120B' },
    ],
    keyPrefix: 'csk-',
  },
}

function CodeTab({ label, code, active, onClick }: { label: string; code: string; active: boolean; onClick: () => void }) {
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
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  const [provider, setProvider] = useState<Provider>('groq')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState(PROVIDERS.groq.models[0].id)
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [rawJson, setRawJson] = useState('')
  const [showRaw, setShowRaw] = useState(false)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [responseMeta, setResponseMeta] = useState<{
    model?: string
    finishReason?: string
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(256)
  const [codeTab, setCodeTab] = useState<'python' | 'javascript' | 'curl'>('curl')
  const [showKey, setShowKey] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const responseRef = useRef<HTMLDivElement>(null)

  // Switch provider
  const switchProvider = (p: Provider) => {
    setProvider(p)
    setModel(PROVIDERS[p].models[0].id)
    setError('')
    setApiKey('')
  }

  const config = PROVIDERS[provider]

  const sendMessage = async () => {
    if (!apiKey || !message.trim()) return
    setLoading(true)
    setError('')
    setResponse('')
    setRawJson('')
    setResponseTime(null)
    setResponseMeta(null)

    abortRef.current = new AbortController()
    const startTime = performance.now()

    const body = {
      model,
      messages: [{ role: 'user' as const, content: message }],
      temperature,
      max_tokens: maxTokens,
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }
    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = window.location.origin
      headers['X-Title'] = 'Learn AI Guide'
    }

    try {
      const res = await fetch(config.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const errBody = await res.text()
        let msg = `HTTP ${res.status}`
        try {
          const parsed = JSON.parse(errBody)
          msg = parsed.error?.message || parsed.message || msg
        } catch { /* use status */ }
        setError(msg)
        setLoading(false)
        return
      }

      const data = await res.json()
      const elapsed = Math.round(performance.now() - startTime)
      const content = data.choices?.[0]?.message?.content || ''
      setResponse(content)
      setRawJson(JSON.stringify(data, null, 2))
      setResponseTime(elapsed)
      setResponseMeta({
        model: data.model,
        finishReason: data.choices?.[0]?.finish_reason,
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      })
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message || 'Request failed')
      }
    }
    setLoading(false)
  }

  const stop = () => { abortRef.current?.abort(); setLoading(false) }

  // Generate code snippets
  const curlCode = `curl ${config.endpoint} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "${model}",
    "messages": [{"role": "user", "content": "${message || 'Hello, who are you?'}"}],
    "temperature": ${temperature},
    "max_tokens": ${maxTokens}
  }'`

  const pythonCode = `import requests

response = requests.post(
    "${config.endpoint}",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "model": "${model}",
        "messages": [{"role": "user", "content": "${message || 'Hello, who are you?'}"}],
        "temperature": ${temperature},
        "max_tokens": ${maxTokens},
    },
)

data = response.json()
print(data["choices"][0]["message"]["content"])`

  const jsCode = `const response = await fetch("${config.endpoint}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "${model}",
    messages: [{ role: "user", content: "${message || 'Hello, who are you?'}" }],
    temperature: ${temperature},
    max_tokens: ${maxTokens},
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);`

  const codeSnippets = { curl: curlCode, python: pythonCode, javascript: jsCode }

  return (
    <div className="space-y-6">
      {/* Provider Selector */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(PROVIDERS) as Provider[]).map(p => (
          <button
            key={p}
            onClick={() => switchProvider(p)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              provider === p
                ? 'bg-primary/20 text-primary-light border border-primary/40'
                : 'bg-surface/50 text-muted border border-border hover:border-primary/30 hover:text-text'
            }`}
          >
            {PROVIDERS[p].name}
          </button>
        ))}
      </div>

      {/* API Key Input */}
      <div className="rounded-xl bg-surface/50 border border-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-4 h-4 text-primary-light" />
          <span className="text-sm font-medium text-text">{gs.apiKeyLabel}</span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder={`${config.keyPrefix}...`}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-text"
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3 py-2.5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div className="text-xs text-emerald-300/80 leading-relaxed">
            <p>{gs.keyPrivacyNote}</p>
            <a
              href="https://github.com/LoggeL/learn-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1 text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
            >
              {gs.keyPrivacyVerify} ↗
            </a>
          </div>
        </div>
      </div>

      {/* Model Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted">{gs.modelLabel}:</span>
        {config.models.map(m => (
          <button
            key={m.id}
            onClick={() => setModel(m.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              model === m.id
                ? 'bg-accent/20 text-accent border border-accent/40'
                : 'bg-surface/30 text-muted border border-border hover:text-text'
            }`}
          >
            {m.name}
          </button>
        ))}
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
            className="w-full accent-primary"
          />
        </div>
        <div className="rounded-xl bg-surface/30 border border-border p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted">{gs.maxTokensLabel}</span>
            <span className="text-sm font-mono text-primary-light">{maxTokens}</span>
          </div>
          <input
            type="range" min="32" max="1024" step="32"
            value={maxTokens}
            onChange={e => setMaxTokens(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Message Input & Send */}
      <div className="rounded-xl bg-surface/50 border border-border p-4">
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder={gs.messagePlaceholder}
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:border-primary/50 resize-none"
        />
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
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Response Breakdown */}
      {response && (
        <div ref={responseRef} className="space-y-4">
          {/* Main Response */}
          <div className="rounded-xl bg-surface/50 border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-text">{gs.responseLabel}</span>
              {responseTime !== null && (
                <span className="ml-auto text-xs font-mono text-muted bg-surface/50 px-2 py-0.5 rounded-full">
                  {responseTime.toLocaleString()}ms
                </span>
              )}
            </div>
            <div className="prose prose-invert max-w-none text-sm text-muted leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          </div>

          {/* Metadata Breakdown */}
          {responseMeta && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Model */}
              {responseMeta.model && (
                <div className="rounded-xl bg-surface/30 border border-border p-3">
                  <div className="text-xs text-muted mb-1">{gs.modelUsed}</div>
                  <div className="text-sm font-mono text-primary-light truncate" title={responseMeta.model}>
                    {responseMeta.model}
                  </div>
                  <div className="text-xs text-muted/60 mt-1">{gs.understandModel}</div>
                </div>
              )}

              {/* Finish Reason */}
              {responseMeta.finishReason && (
                <div className="rounded-xl bg-surface/30 border border-border p-3">
                  <div className="text-xs text-muted mb-1">{gs.finishReason}</div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      responseMeta.finishReason === 'stop'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : responseMeta.finishReason === 'length'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-blue-500/15 text-blue-400'
                    }`}>
                      {responseMeta.finishReason}
                    </span>
                  </div>
                  <div className="text-xs text-muted/60 mt-1">
                    {responseMeta.finishReason === 'stop' ? gs.finishStop
                      : responseMeta.finishReason === 'length' ? gs.finishLength
                      : responseMeta.finishReason}
                  </div>
                </div>
              )}

              {/* Response Time */}
              {responseTime !== null && (
                <div className="rounded-xl bg-surface/30 border border-border p-3">
                  <div className="text-xs text-muted mb-1">{gs.responseTime}</div>
                  <div className="text-sm font-mono text-primary-light">
                    {responseTime < 1000 ? `${responseTime}ms` : `${(responseTime / 1000).toFixed(2)}s`}
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
                {/* Prompt Tokens */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">{gs.promptTokens}</span>
                    <span className="font-mono text-blue-400">{responseMeta.promptTokens?.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500/60 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, ((responseMeta.promptTokens || 0) / (responseMeta.totalTokens || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                {/* Completion Tokens */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">{gs.completionTokens}</span>
                    <span className="font-mono text-purple-400">{responseMeta.completionTokens?.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500/60 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, ((responseMeta.completionTokens || 0) / (responseMeta.totalTokens || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                {/* Total */}
                <div className="flex justify-between text-xs pt-1 border-t border-border">
                  <span className="text-muted font-medium">{gs.totalTokens}</span>
                  <span className="font-mono text-text">{responseMeta.totalTokens?.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-xs text-muted/60 mt-2">{gs.tokenExplain}</div>
            </div>
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
                  <pre className="text-xs text-muted/80 overflow-x-auto max-h-80 font-mono bg-background rounded-lg p-3">
                    {rawJson}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Code Snippets */}
      <div className="rounded-xl bg-surface/30 border border-border overflow-hidden">
        <div className="flex border-b border-border">
          <CodeTab label="curl" code="" active={codeTab === 'curl'} onClick={() => setCodeTab('curl')} />
          <CodeTab label="Python" code="" active={codeTab === 'python'} onClick={() => setCodeTab('python')} />
          <CodeTab label="JavaScript" code="" active={codeTab === 'javascript'} onClick={() => setCodeTab('javascript')} />
        </div>
        <div className="relative p-4">
          <CopyButton text={codeSnippets[codeTab]} />
          <pre className="text-xs text-muted/80 overflow-x-auto font-mono leading-relaxed">
            {codeSnippets[codeTab]}
          </pre>
        </div>
      </div>
    </div>
  )
}
