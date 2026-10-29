'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

type Provider = 'openai' | 'anthropic' | 'gemini'

const PROVIDERS: Provider[] = ['openai', 'anthropic', 'gemini']

function buildRequest(provider: Provider, system: string, user: string): object {
  switch (provider) {
    case 'openai':
      // POST /v1/responses – developer messages rank above user messages
      return {
        model: '<model-id>',
        input: [
          { role: 'developer', content: system },
          { role: 'user', content: user },
        ],
      }
    case 'anthropic':
      // POST /v1/messages – the system prompt is a top-level field
      return {
        model: '<model-id>',
        max_tokens: 1024,
        system,
        messages: [{ role: 'user', content: user }],
      }
    case 'gemini':
      // POST /v1beta/interactions – system_instruction is a top-level field
      return {
        model: '<model-id>',
        system_instruction: system,
        input: user,
      }
  }
}

export function PromptApiRolesExample() {
  const { t } = useTranslation()
  const c = t.systemPrompts
  const [provider, setProvider] = useState<Provider>('openai')

  return (
    <div>
      <div role="tablist" aria-label={c.apiExample} className="flex flex-wrap gap-2">
        {PROVIDERS.map(p => (
          <button
            key={p}
            role="tab"
            aria-selected={provider === p}
            onClick={() => setProvider(p)}
            className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors ${
              provider === p
                ? 'border-primary/40 bg-primary/20 text-primary-light'
                : 'border-border bg-background text-muted hover:text-text'
            }`}
          >
            {c.apiProviders[p]}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.pre
          key={provider}
          role="tabpanel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="mt-3 overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-sm text-muted"
        >
          {JSON.stringify(buildRequest(provider, c.apiSystemText, c.apiUserText), null, 2)}
        </motion.pre>
      </AnimatePresence>
      <p className="mt-3 text-xs leading-relaxed text-muted">{c.apiNote}</p>
    </div>
  )
}
