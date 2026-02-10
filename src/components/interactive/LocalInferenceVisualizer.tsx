'use client'

import { useState, useEffect } from 'react'

interface Props {
  section: 'hardware' | 'tools' | 'quickstart' | 'moe'
  t: Record<string, string>
}

// VRAM data in GB: [FP16, Q8, Q4, Q2]
const VRAM_DATA: Record<string, number[]> = {
  '7B':  [14,  7,   4,   2.5],
  '13B': [26, 13,   7,   4.5],
  '30B': [60, 30,  17,  10],
  '70B': [140, 70,  40,  24],
}

const QUANT_LABELS = ['FP16', 'Q8', 'Q4', 'Q2']
const MODEL_SIZES = ['7B', '13B', '30B', '70B']

// Estimated tokens/sec on a mid-range GPU
const SPEED_ESTIMATE: Record<string, number[]> = {
  '7B':  [25, 40, 55, 65],
  '13B': [15, 25, 35, 45],
  '30B': [5,  12, 20, 30],
  '70B': [2,   5, 10, 18],
}

const GPUS = [
  // Consumer - Previous Gen
  { name: 'RTX 3060',          vram: 12 },
  { name: 'RTX 3090',          vram: 24 },
  // Consumer - Current Gen
  { name: 'RTX 4070 Ti Super', vram: 16 },
  { name: 'RTX 4090',          vram: 24 },
  // Consumer - Next Gen
  { name: 'RTX 5070 Ti',       vram: 16 },
  { name: 'RTX 5080',          vram: 16 },
  { name: 'RTX 5090',          vram: 32 },
  // Pro / Workstation
  { name: 'RTX 6000 Pro',      vram: 96 },
  { name: 'RTX PRO 6000',      vram: 96 },
  // Apple Silicon
  { name: 'M3 Pro (18GB)',     vram: 18 },
  { name: 'M3 Max (36GB)',     vram: 36 },
  { name: 'M4 Pro (24GB)',     vram: 24 },
  { name: 'M4 Max (64GB)',     vram: 64 },
  { name: 'M4 Max (128GB)',    vram: 128 },
]

const TOOLS = [
  {
    id: 'ollama',
    name: 'Ollama',
    ease: 5, perf: 4, features: 3, gpu: 4, formats: 3,
    easeLabel: 'Very Easy', perfLabel: 'Good', featuresLabel: 'CLI + API', gpuLabel: 'CUDA, Metal', formatsLabel: 'GGUF',
  },
  {
    id: 'llama-cpp',
    name: 'llama.cpp',
    ease: 2, perf: 5, features: 3, gpu: 5, formats: 4,
    easeLabel: 'CLI / Build', perfLabel: 'Excellent', featuresLabel: 'CLI + Server', gpuLabel: 'CUDA, Metal, Vulkan, SYCL', formatsLabel: 'GGUF',
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    ease: 5, perf: 4, features: 4, gpu: 4, formats: 4,
    easeLabel: 'Very Easy', perfLabel: 'Good', featuresLabel: 'GUI + API Server', gpuLabel: 'CUDA, Metal', formatsLabel: 'GGUF, MLX',
  },
  {
    id: 'vllm',
    name: 'vLLM',
    ease: 2, perf: 5, features: 4, gpu: 3, formats: 3,
    easeLabel: 'Advanced', perfLabel: 'Excellent', featuresLabel: 'Server + Batching', gpuLabel: 'CUDA', formatsLabel: 'HF, GPTQ, AWQ',
  },
  {
    id: 'oobabooga',
    name: 'text-generation-webui',
    ease: 3, perf: 3, features: 5, gpu: 4, formats: 5,
    easeLabel: 'Moderate', perfLabel: 'Good', featuresLabel: 'Full Web UI', gpuLabel: 'CUDA, Metal', formatsLabel: 'GGUF, GPTQ, AWQ, EXL2',
  },
]

const TOOL_DETAILS: Record<string, { desc: string; best: string }> = {
  'ollama': {
    desc: 'One-command install. Run `ollama pull llama3` and you are chatting. Exposes an OpenAI-compatible API. Best for getting started quickly.',
    best: 'Beginners, quick experiments, local API server',
  },
  'llama-cpp': {
    desc: 'The original C/C++ LLM runtime by Georgi Gerganov. Maximum performance, supports every backend, and powers most other tools under the hood.',
    best: 'Maximum performance, CPU inference, advanced users',
  },
  'lm-studio': {
    desc: 'Desktop app with a built-in model browser. Download, configure, and chat with models through a polished GUI. Also runs an OpenAI-compatible server.',
    best: 'GUI preference, model discovery, local development',
  },
  'vllm': {
    desc: 'Production-grade inference engine with PagedAttention for efficient memory use. Continuous batching for high throughput serving.',
    best: 'Production serving, high concurrency, power users',
  },
  'oobabooga': {
    desc: 'Feature-rich web UI supporting every model format. Extensions for training, speech, multimodal, and more. The Swiss army knife of local inference.',
    best: 'Experimentation, multiple formats, all-in-one UI',
  },
}

function HardwareSection({ t }: { t: Record<string, string> }) {
  const [modelSize, setModelSize] = useState('7B')
  const [quantIdx, setQuantIdx] = useState(2) // default Q4

  const vram = VRAM_DATA[modelSize][quantIdx]
  const speed = SPEED_ESTIMATE[modelSize][quantIdx]
  const maxVram = 140

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-muted mb-3">{t.hwModelSize || 'Model Size'}</label>
          <div className="flex gap-2">
            {MODEL_SIZES.map((s) => (
              <button key={s} onClick={() => setModelSize(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  modelSize === s
                    ? 'bg-primary/20 text-primary-light border border-primary/40'
                    : 'bg-surface/50 text-muted border border-border hover:border-primary/30'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-3">{t.hwQuantLevel || 'Quantization'}</label>
          <div className="flex gap-2">
            {QUANT_LABELS.map((q, i) => (
              <button key={q} onClick={() => setQuantIdx(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  quantIdx === i
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-surface/50 text-muted border border-border hover:border-cyan-500/30'
                }`}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
          <div className="text-sm text-muted mb-1">{t.hwVramNeeded || 'VRAM Required'}</div>
          <div className="text-3xl font-bold text-text">{vram} GB</div>
          <div className="mt-3 w-full h-3 rounded-full bg-surface/80 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min((vram / maxVram) * 100, 100)}%` }} />
          </div>
        </div>
        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
          <div className="text-sm text-muted mb-1">{t.hwSpeed || 'Estimated Speed'}</div>
          <div className="text-3xl font-bold text-text">~{speed} tok/s</div>
          <div className="text-xs text-muted mt-2">{t.hwSpeedNote || 'Approximate, varies by GPU and config'}</div>
        </div>
      </div>

      {/* GPU compatibility */}
      <div>
        <div className="text-sm font-medium text-muted mb-3">{t.hwGpuCompat || 'GPU Compatibility'}</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {GPUS.map((gpu) => {
            const fits = gpu.vram >= vram
            return (
              <div key={gpu.name}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  fits
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/5 border-red-500/20 text-red-400/60'
                }`}>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  {fits
                    ? <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                    : <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
                  }
                </svg>
                <span className="text-sm">{gpu.name} ({gpu.vram}GB)</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ToolsSection() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const ratingBar = (val: number) => (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((i) => (
        <div key={i} className={`w-4 h-2 rounded-sm ${i <= val ? 'bg-cyan-400' : 'bg-surface/60'}`} />
      ))}
    </div>
  )

  return (
    <div className="space-y-3">
      {TOOLS.map((tool) => {
        const isOpen = expanded === tool.id
        const details = TOOL_DETAILS[tool.id]
        return (
          <div key={tool.id}
            className={`rounded-xl border transition-all cursor-pointer ${
              isOpen ? 'bg-surface/80 border-cyan-500/30' : 'bg-surface/30 border-border hover:border-cyan-500/20'
            }`}
            onClick={() => setExpanded(isOpen ? null : tool.id)}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold font-heading text-text">{tool.name}</h3>
                <svg className={`w-5 h-5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="grid grid-cols-5 gap-4 text-xs">
                {[
                  { label: 'Ease', val: tool.ease },
                  { label: 'Perf', val: tool.perf },
                  { label: 'Features', val: tool.features },
                  { label: 'GPU', val: tool.gpu },
                  { label: 'Formats', val: tool.formats },
                ].map((col) => (
                  <div key={col.label}>
                    <div className="text-muted mb-1">{col.label}</div>
                    {ratingBar(col.val)}
                  </div>
                ))}
              </div>
            </div>
            {isOpen && details && (
              <div className="px-5 pb-5 border-t border-border/50 pt-4 space-y-3">
                <p className="text-muted text-sm leading-relaxed">{details.desc}</p>
                <div className="flex gap-2 flex-wrap text-xs">
                  <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    GPU: {tool.gpuLabel}
                  </span>
                  <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Formats: {tool.formatsLabel}
                  </span>
                </div>
                <div className="text-xs text-emerald-400">Best for: {details.best}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function QuickstartSection({ t }: { t: Record<string, string> }) {
  const [step, setStep] = useState(0)
  const [typing, setTyping] = useState(true)

  const lines = [
    { prompt: true, text: 'curl -fsSL https://ollama.com/install.sh | sh' },
    { prompt: false, text: '>>> Installing ollama...' },
    { prompt: false, text: '>>> Installation complete.' },
    { prompt: true, text: 'ollama pull llama3.2' },
    { prompt: false, text: 'pulling manifest...' },
    { prompt: false, text: 'pulling 8eeb52dfb3bb... 100% 2.0 GB' },
    { prompt: false, text: 'success' },
    { prompt: true, text: 'ollama run llama3.2' },
    { prompt: false, text: '>>> Send a message (/? for help)' },
    { prompt: true, text: 'What is quantization in simple terms?' },
    { prompt: false, text: 'Quantization means using fewer bits to store each number' },
    { prompt: false, text: 'in a model. Think of it like rounding: instead of keeping' },
    { prompt: false, text: 'every decimal place, you round to save space. The model' },
    { prompt: false, text: 'gets smaller and faster, with only a small loss in quality.' },
  ]

  useEffect(() => {
    if (step >= lines.length) {
      setTyping(false)
      return
    }
    const delay = lines[step].prompt ? 1200 : 600
    const timer = setTimeout(() => setStep((s) => s + 1), delay)
    return () => clearTimeout(timer)
  }, [step, lines.length])

  const restart = () => { setStep(0); setTyping(true) }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[#0d1117] border border-border overflow-hidden font-mono text-sm">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-muted ml-2">terminal</span>
        </div>
        <div className="p-4 space-y-0.5 min-h-[280px] max-h-[400px] overflow-y-auto">
          {lines.slice(0, step).map((line, i) => (
            <div key={i} className={`${line.prompt ? 'text-emerald-400' : 'text-gray-400'}`}>
              {line.prompt && <span className="text-cyan-400">$ </span>}
              {line.text}
            </div>
          ))}
          {typing && step < lines.length && (
            <div className="text-emerald-400">
              {lines[step]?.prompt && <span className="text-cyan-400">$ </span>}
              <span className="animate-pulse">|</span>
            </div>
          )}
        </div>
      </div>
      {!typing && (
        <button onClick={restart}
          className="px-4 py-2 rounded-lg bg-surface/50 border border-border text-muted text-sm hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
          {t.qsReplay || 'Replay'}
        </button>
      )}
    </div>
  )
}

const MOE_MODELS = [
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    type: 'MoE' as const,
    totalParams: 46.7,
    activeParams: 12.9,
    vram: 26,
    speed: 35,
    intelligence: 75,
    color: 'cyan',
  },
  {
    id: 'llama-70b',
    name: 'Llama 3.1 70B',
    type: 'Dense' as const,
    totalParams: 70,
    activeParams: 70,
    vram: 40,
    speed: 10,
    intelligence: 85,
    color: 'purple',
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    type: 'Dense' as const,
    totalParams: 7.2,
    activeParams: 7.2,
    vram: 5,
    speed: 100,
    intelligence: 45,
    color: 'orange',
  },
]

function MoESection({ t }: { t: Record<string, string> }) {
  const [highlighted, setHighlighted] = useState<string | null>('mixtral-8x7b')

  const maxVram = 48
  const maxSpeed = 130
  const maxIntel = 100

  return (
    <div className="space-y-6">
      {/* Model selector tabs */}
      <div className="flex flex-wrap gap-2">
        {MOE_MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => setHighlighted(m.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              highlighted === m.id
                ? `bg-${m.color}-500/20 text-${m.color}-400 border border-${m.color}-500/40`
                : 'bg-surface/50 text-muted border border-border hover:border-primary/30'
            }`}
          >
            {m.name}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
              m.type === 'MoE' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20 text-gray-400'
            }`}>{m.type}</span>
          </button>
        ))}
      </div>

      {/* Comparison bars */}
      <div className="space-y-5">
        {/* Intelligence */}
        <div>
          <div className="text-sm font-medium text-muted mb-2">{t.moeIntelligence || 'Intelligence'}</div>
          <div className="space-y-2">
            {MOE_MODELS.map((m) => (
              <div key={m.id} className={`flex items-center gap-3 transition-opacity ${highlighted && highlighted !== m.id ? 'opacity-40' : ''}`}>
                <span className="text-xs text-muted w-32 shrink-0 truncate">{m.name}</span>
                <div className="flex-1 h-6 rounded-lg bg-surface/60 overflow-hidden">
                  <div
                    className={`h-full rounded-lg bg-${m.color}-500/60 transition-all duration-500 flex items-center pl-2`}
                    style={{ width: `${(m.intelligence / maxIntel) * 100}%` }}
                  >
                    <span className="text-xs font-medium text-white/80">{m.intelligence}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Speed */}
        <div>
          <div className="text-sm font-medium text-muted mb-2">{t.moeSpeed || 'Speed (tokens/sec, RTX 4090)'}</div>
          <div className="space-y-2">
            {MOE_MODELS.map((m) => (
              <div key={m.id} className={`flex items-center gap-3 transition-opacity ${highlighted && highlighted !== m.id ? 'opacity-40' : ''}`}>
                <span className="text-xs text-muted w-32 shrink-0 truncate">{m.name}</span>
                <div className="flex-1 h-6 rounded-lg bg-surface/60 overflow-hidden">
                  <div
                    className={`h-full rounded-lg bg-${m.color}-500/60 transition-all duration-500 flex items-center pl-2`}
                    style={{ width: `${(m.speed / maxSpeed) * 100}%` }}
                  >
                    <span className="text-xs font-medium text-white/80">~{m.speed} tok/s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VRAM */}
        <div>
          <div className="text-sm font-medium text-muted mb-2">{t.moeVram || 'VRAM Usage (Q4)'}</div>
          <div className="space-y-2">
            {MOE_MODELS.map((m) => (
              <div key={m.id} className={`flex items-center gap-3 transition-opacity ${highlighted && highlighted !== m.id ? 'opacity-40' : ''}`}>
                <span className="text-xs text-muted w-32 shrink-0 truncate">{m.name}</span>
                <div className="flex-1 h-6 rounded-lg bg-surface/60 overflow-hidden">
                  <div
                    className={`h-full rounded-lg bg-${m.color}-500/60 transition-all duration-500 flex items-center pl-2`}
                    style={{ width: `${(m.vram / maxVram) * 100}%` }}
                  >
                    <span className="text-xs font-medium text-white/80">{m.vram} GB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active vs Total params insight */}
      <div className="grid sm:grid-cols-3 gap-3">
        {MOE_MODELS.map((m) => (
          <div key={m.id}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              highlighted === m.id
                ? `bg-${m.color}-500/10 border-${m.color}-500/30`
                : 'bg-surface/30 border-border'
            }`}
            onClick={() => setHighlighted(m.id)}
          >
            <div className={`text-sm font-semibold text-${m.color}-400 mb-2`}>{m.name}</div>
            <div className="text-xs text-muted space-y-1">
              <div>{t.moeTotalParams || 'Total'}: <span className="text-text font-medium">{m.totalParams}B</span></div>
              <div>{t.moeActiveParams || 'Active'}: <span className="text-text font-medium">{m.activeParams}B</span></div>
              <div>VRAM (Q4): <span className="text-text font-medium">{m.vram} GB</span></div>
            </div>
            {m.type === 'MoE' && (
              <div className="mt-2 text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 inline-block">
                {t.moeSweetSpot || '✨ Sweet spot'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key insight callout */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
        <p className="text-text text-sm leading-relaxed">
          <span className="font-semibold text-cyan-400">{t.moeInsightLabel || 'The insight:'}</span>{' '}
          {t.moeInsight || 'Qwen MoE activates only 3B of its 80B parameters per token — giving you 70B-class intelligence at 3B-class speed, fitting comfortably in 12 GB VRAM.'}
        </p>
      </div>
    </div>
  )
}

export function LocalInferenceVisualizer({ section, t }: Props) {
  switch (section) {
    case 'hardware':
      return <HardwareSection t={t} />
    case 'tools':
      return <ToolsSection />
    case 'quickstart':
      return <QuickstartSection t={t} />
    case 'moe':
      return <MoESection t={t} />
    default:
      return null
  }
}
