'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Wrench, MessageSquare, Database, ChevronDown, Layers } from 'lucide-react'

type ContextLayer = 'system' | 'tools' | 'retrieved' | 'history'

interface LayerConfig {
  id: ContextLayer
  icon: typeof Settings
  color: string
  bg: string
  borderColor: string
}

const layers: LayerConfig[] = [
  { id: 'system', icon: Settings, color: 'text-purple-400', bg: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
  { id: 'tools', icon: Wrench, color: 'text-orange-400', bg: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
  { id: 'retrieved', icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
  { id: 'history', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
]

const layerData: Record<ContextLayer, { title: string; desc: string; tokens: number; example: string }> = {
  system: {
    title: 'System Prompt',
    desc: 'Defines identity, capabilities, and constraints. Always first in context.',
    tokens: 850,
    example: 'You are Claude, an AI assistant made by Anthropic.\nYou have access to tools for file operations.\nAlways be helpful, harmless, and honest.\nNever execute dangerous commands.',
  },
  tools: {
    title: 'Tool Definitions',
    desc: 'JSON schemas for available tools. Model uses these to decide when to call tools.',
    tokens: 1200,
    example: '{\n  "name": "read_file",\n  "description": "Read contents of a file",\n  "parameters": {\n    "path": { "type": "string" }\n  }\n}',
  },
  retrieved: {
    title: 'Retrieved Information',
    desc: 'External knowledge from RAG or previous tool results.',
    tokens: 2500,
    example: '[From documentation]\n# Rate Limits\n- Free: 100 req/day\n- Pro: 10,000 req/day\n\n[Tool result: search("tokyo weather")]\nTokyo: 22C, Sunny',
  },
  history: {
    title: 'Conversation History',
    desc: 'Previous messages and tool interactions. Recent messages prioritized.',
    tokens: 3200,
    example: 'User: Debug this Python script?\n\nAssistant: I\'ll take a look.\n[Tool call: read_file("script.py")]\n\nAssistant: Found the issue on line 42.',
  },
}

export function ContextAnatomyVisualizer() {
  const [expandedLayer, setExpandedLayer] = useState<ContextLayer | null>('system')
  const [showTokens, setShowTokens] = useState(true)
  const maxTokens = 8192

  const totalTokens = Object.values(layerData).reduce((sum, layer) => sum + layer.tokens, 0)
  const usagePercent = (totalTokens / maxTokens) * 100

  const toggleLayer = (id: ContextLayer) => {
    setExpandedLayer(expandedLayer === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Token Usage Bar */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Layers size={18} className="text-primary-light" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">Context Window</h3>
              <p className="text-xs text-muted">{totalTokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens</p>
            </div>
          </div>
          <button
            onClick={() => setShowTokens(!showTokens)}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-muted hover:text-text transition-colors"
          >
            {showTokens ? 'Hide' : 'Show'} breakdown
          </button>
        </div>

        {/* Stacked bar showing all layers */}
        <div className="h-8 rounded-lg overflow-hidden bg-background border border-border flex">
          {layers.map((layer) => {
            const data = layerData[layer.id]
            const widthPercent = (data.tokens / maxTokens) * 100
            return (
              <motion.div
                key={layer.id}
                className={`h-full ${layer.bg} cursor-pointer hover:brightness-125 transition-all relative group`}
                style={{ width: `${widthPercent}%` }}
                onClick={() => toggleLayer(layer.id)}
                whileHover={{ scale: 1.02 }}
              >
                {showTokens && widthPercent > 8 && (
                  <span className={`absolute inset-0 flex items-center justify-center text-xs font-mono ${layer.color}`}>
                    {data.tokens}
                  </span>
                )}
              </motion.div>
            )
          })}
          {/* Remaining space */}
          <div className="flex-1 bg-surface-elevated" />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`flex items-center gap-2 text-xs transition-opacity ${expandedLayer === layer.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className={`w-3 h-3 rounded ${layer.bg} border ${layer.borderColor}`} />
              <span className={layer.color}>{layerData[layer.id].title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layer Details */}
      <div className="space-y-3">
        {layers.map((layer, index) => {
          const data = layerData[layer.id]
          const Icon = layer.icon
          const isExpanded = expandedLayer === layer.id

          return (
            <motion.div
              key={layer.id}
              layout
              className={`rounded-xl border ${layer.borderColor} ${layer.bg} overflow-hidden`}
            >
              <button
                onClick={() => toggleLayer(layer.id)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted text-sm font-mono w-6">
                    #{index + 1}
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${layer.bg} border ${layer.borderColor} flex items-center justify-center`}>
                    <Icon size={18} className={layer.color} />
                  </div>
                  <div className="text-left">
                    <h4 className={`font-semibold font-heading ${layer.color}`}>{data.title}</h4>
                    <p className="text-xs text-muted">{data.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-muted">{data.tokens} tok</span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={18} className="text-muted" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-2 border-t border-white/5">
                      <div className="rounded-lg bg-background/50 border border-border p-4 font-mono text-sm">
                        <pre className="whitespace-pre-wrap text-muted overflow-x-auto">
                          {data.example}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Priority Info */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-5">
        <h4 className="font-semibold text-text font-heading mb-3 flex items-center gap-2">
          <span className="text-lg">Priority Order</span>
        </h4>
        <p className="text-sm text-muted leading-relaxed">
          When context exceeds the window limit, content is typically trimmed from the middle or oldest history first.
          System prompts and tool definitions have highest priority and are rarely truncated.
          Recent conversation turns are preserved to maintain coherence.
        </p>
      </div>
    </div>
  )
}
