'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Code, CheckCircle, AlertCircle, Wrench } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface Parameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array'
  description: string
  required: boolean
}

interface ToolSchema {
  name: string
  description: string
  parameters: Parameter[]
}

const PARAM_TYPES = ['string', 'number', 'boolean', 'array'] as const

function validateSchema(schema: ToolSchema): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!schema.name || schema.name.length < 2) {
    errors.push('Tool name must be at least 2 characters')
  }
  if (!/^[a-z_][a-z0-9_]*$/i.test(schema.name)) {
    errors.push('Tool name should use snake_case (e.g., search_web)')
  }
  if (!schema.description || schema.description.length < 10) {
    errors.push('Description should be at least 10 characters')
  }
  if (schema.parameters.length === 0) {
    errors.push('Tool should have at least one parameter')
  }

  schema.parameters.forEach((param, i) => {
    if (!param.name) {
      errors.push(`Parameter ${i + 1}: Name is required`)
    }
    if (!param.description) {
      errors.push(`Parameter ${i + 1}: Description is required`)
    }
  })

  return { valid: errors.length === 0, errors }
}

function generateJSONSchema(schema: ToolSchema): string {
  const jsonSchema = {
    name: schema.name,
    description: schema.description,
    parameters: {
      type: 'object',
      properties: Object.fromEntries(
        schema.parameters.map(p => [
          p.name,
          {
            type: p.type,
            description: p.description,
          },
        ])
      ),
      required: schema.parameters.filter(p => p.required).map(p => p.name),
    },
  }

  return JSON.stringify(jsonSchema, null, 2)
}

export function ToolSchemaBuilder() {
  const { t } = useTranslation()
  const [schema, setSchema] = useState<ToolSchema>({
    name: 'search_web',
    description: 'Search the web for information on a given query',
    parameters: [
      { name: 'query', type: 'string', description: 'The search query', required: true },
      { name: 'max_results', type: 'number', description: 'Maximum number of results to return (1-10)', required: false },
    ],
  })
  const [showValidation, setShowValidation] = useState(false)

  const validation = validateSchema(schema)

  const addParameter = () => {
    setSchema({
      ...schema,
      parameters: [
        ...schema.parameters,
        { name: '', type: 'string', description: '', required: false },
      ],
    })
  }

  const removeParameter = (index: number) => {
    setSchema({
      ...schema,
      parameters: schema.parameters.filter((_, i) => i !== index),
    })
  }

  const updateParameter = (index: number, updates: Partial<Parameter>) => {
    setSchema({
      ...schema,
      parameters: schema.parameters.map((p, i) =>
        i === index ? { ...p, ...updates } : p
      ),
    })
  }

  return (
    <div className="space-y-6">
      {/* Tool Info */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Wrench size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.toolName}</h3>
            <p className="text-xs text-muted">Define your tool&apos;s identity</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">{t.interactive.toolName}</label>
            <input
              type="text"
              value={schema.name}
              onChange={(e) => setSchema({ ...schema, name: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-text font-mono focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="search_web"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">{t.interactive.toolDescription}</label>
            <textarea
              value={schema.description}
              onChange={(e) => setSchema({ ...schema, description: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary/50 transition-colors resize-none h-20"
              placeholder="Describe what this tool does..."
            />
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <Code size={18} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">Parameters</h3>
              <p className="text-xs text-muted">{schema.parameters.length} parameters defined</p>
            </div>
          </div>
          <button
            onClick={addParameter}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-lg transition-colors text-sm"
          >
            <Plus size={14} />
            {t.interactive.addParameter}
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {schema.parameters.map((param, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-background rounded-xl border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted">Parameter {index + 1}</span>
                  <button
                    onClick={() => removeParameter(index)}
                    className="p-1 hover:bg-red-500/20 rounded text-muted hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted mb-1">{t.interactive.paramName}</label>
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => updateParameter(index, { name: e.target.value })}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text font-mono focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="param_name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1">{t.interactive.paramType}</label>
                    <select
                      value={param.type}
                      onChange={(e) => updateParameter(index, { type: e.target.value as Parameter['type'] })}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      {PARAM_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-muted mb-1">Description</label>
                    <input
                      type="text"
                      value={param.description}
                      onChange={(e) => updateParameter(index, { description: e.target.value })}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Describe this parameter..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={param.required}
                        onChange={(e) => updateParameter(index, { required: e.target.checked })}
                        className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary/50"
                      />
                      <span className="text-sm text-text">{t.interactive.paramRequired}</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Generated Schema */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <Code size={18} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">{t.interactive.generatedSchema}</h3>
              <p className="text-xs text-muted">JSON Schema output</p>
            </div>
          </div>
          <button
            onClick={() => setShowValidation(!showValidation)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
              validation.valid
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {validation.valid ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {t.interactive.validateSchema}
          </button>
        </div>

        {/* Validation Errors */}
        <AnimatePresence>
          {showValidation && !validation.valid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <ul className="space-y-1">
                {validation.errors.map((error, i) => (
                  <li key={i} className="text-sm text-red-400 flex items-start gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    {error}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <pre className="p-4 bg-background rounded-xl border border-border overflow-x-auto">
          <code className="text-sm text-text font-mono whitespace-pre">
            {generateJSONSchema(schema)}
          </code>
        </pre>
      </div>
    </div>
  )
}
