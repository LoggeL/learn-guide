'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { DemoParameter, DemoTool, ToolProvider, validateTool, formatToolDefinition } from '@/lib/agent-demo-models'

const types = ['string', 'integer', 'number', 'boolean', 'array'] as const
const inputClass = 'block w-full p-2 mt-1 bg-background border border-border rounded'

export function ToolSchemaBuilder() {
  const { t } = useTranslation()
  const b = t.toolDesign.builder
  const [tool, setTool] = useState<DemoTool>(() => ({
    name: 'search_web',
    description: b.defaultDescription,
    parameters: [
      { id: 0, name: 'query', type: 'string', description: b.defaultQuery, required: true },
      { id: 1, name: 'max_results', type: 'integer', description: b.defaultMax, required: false },
    ],
  }))
  const [provider, setProvider] = useState<ToolProvider>('anthropic')
  const [strict, setStrict] = useState(true)
  const nextId = useRef(2)

  const validation = validateTool(tool)
  const generated = formatToolDefinition(tool, provider, strict)
  const update = (id: number, change: Partial<DemoParameter>) =>
    setTool({ ...tool, parameters: tool.parameters.map(p => (p.id === id ? { ...p, ...change } : p)) })

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
      <h3 className="text-xl font-semibold">{b.identity}</h3>
      <p className="text-sm text-muted">{b.note}</p>
      <label className="block">{b.toolName}
        <input value={tool.name} onChange={e => setTool({ ...tool, name: e.target.value })} className={inputClass} />
      </label>
      <label className="block">{b.description}
        <textarea value={tool.description} onChange={e => setTool({ ...tool, description: e.target.value })} className={inputClass} />
      </label>
      <div className="flex justify-between gap-3">
        <h4 className="font-semibold">{b.parameters}</h4>
        <button
          className="text-primary-light"
          onClick={() => setTool({ ...tool, parameters: [...tool.parameters, { id: nextId.current++, name: '', type: 'string', description: '', required: false }] })}
        >
          {b.addParameter}
        </button>
      </div>
      {!tool.parameters.length && <p className="text-sm text-muted">{b.empty}</p>}
      {tool.parameters.map(p => (
        <fieldset className="border border-border rounded p-3 space-y-3" key={p.id}>
          <div className="flex justify-end">
            <button className="text-sm text-orange-400" onClick={() => setTool({ ...tool, parameters: tool.parameters.filter(x => x.id !== p.id) })}>{b.remove}</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">{b.paramName}
              <input value={p.name} onChange={e => update(p.id, { name: e.target.value })} className={inputClass} />
            </label>
            <label className="block">{b.paramType}
              <select value={p.type} onChange={e => update(p.id, { type: e.target.value as DemoParameter['type'] })} className={inputClass}>
                {types.map(type => <option key={type}>{type}</option>)}
              </select>
            </label>
          </div>
          {p.type === 'array' && (
            <label className="block">{b.itemType}
              <select value={p.itemType ?? 'string'} onChange={e => update(p.id, { itemType: e.target.value as DemoParameter['itemType'] })} className={inputClass}>
                {types.filter(type => type !== 'array').map(type => <option key={type}>{type}</option>)}
              </select>
            </label>
          )}
          <label className="block">{b.description}
            <input value={p.description} onChange={e => update(p.id, { description: e.target.value })} className={inputClass} />
          </label>
          <label className="flex gap-2">
            <input type="checkbox" checked={p.required} onChange={e => update(p.id, { required: e.target.checked })} />
            {b.paramRequired}
          </label>
        </fieldset>
      ))}

      <div role="status">
        {validation.errors.map(error => <p className="text-orange-400" key={error}>{b[error]}</p>)}
      </div>
      {(!tool.description.trim() || tool.parameters.some(p => !p.description.trim())) && (
        <p className="text-sm text-muted">{b.descriptionHint}</p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
        <span className="text-sm font-semibold">{b.providerLabel}</span>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['anthropic', 'openai'] as const).map(id => (
            <button
              key={id}
              onClick={() => setProvider(id)}
              aria-pressed={provider === id}
              className={`px-3 py-1.5 text-sm transition-colors ${provider === id ? 'bg-primary/20 text-primary-light' : 'text-muted hover:text-text'}`}
            >
              {id === 'anthropic' ? b.providerAnthropic : b.providerOpenai}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={strict} onChange={e => setStrict(e.target.checked)} />
          {b.strictLabel}
        </label>
      </div>
      <motion.p
        key={`${provider}-${strict}`}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-muted"
      >
        {provider === 'openai' ? b.strictOpenai : b.strictAnthropic}
      </motion.p>

      <h4 className="font-semibold">{b.generated}</h4>
      <pre className="overflow-x-auto rounded bg-background p-3 text-sm font-mono">
        {generated ? JSON.stringify(generated, null, 2) : b.blocked}
      </pre>
    </div>
  )
}
