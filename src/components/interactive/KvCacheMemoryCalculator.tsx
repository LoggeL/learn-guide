'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

type LayerGroup =
  /** standard attention; window = null means full context */
  | { kind: 'kv'; count: number; kvHeads: number; headDim: number; window: number | null }
  /** multi-head latent attention: one compressed vector of `dim` values per token */
  | { kind: 'mla'; count: number; dim: number }
  /** linear attention: fixed-size state of `stateValues` values per layer, stored in BF16 */
  | { kind: 'linear'; count: number; stateValues: number }

interface Preset {
  id: string
  name: string
  descKey:
    | 'presetLlama8b'
    | 'presetLlama8bMha'
    | 'presetLlama70b'
    | 'presetGemma3'
    | 'presetGptOss'
    | 'presetLlama4'
    | 'presetDeepseek'
    | 'presetQwenNext'
  paramsB: number
  groups: LayerGroup[]
}

// Values from the published model configs (config.json on Hugging Face / technical reports).
const PRESETS: Preset[] = [
  {
    id: 'llama31-8b',
    name: 'Llama 3.1 8B',
    descKey: 'presetLlama8b',
    paramsB: 8.03,
    groups: [{ kind: 'kv', count: 32, kvHeads: 8, headDim: 128, window: null }],
  },
  {
    id: 'llama31-8b-mha',
    name: 'Llama 3.1 8B (MHA)',
    descKey: 'presetLlama8bMha',
    paramsB: 8.03,
    groups: [{ kind: 'kv', count: 32, kvHeads: 32, headDim: 128, window: null }],
  },
  {
    id: 'llama31-70b',
    name: 'Llama 3.1 70B',
    descKey: 'presetLlama70b',
    paramsB: 70.6,
    groups: [{ kind: 'kv', count: 80, kvHeads: 8, headDim: 128, window: null }],
  },
  {
    id: 'gemma3-27b',
    name: 'Gemma 3 27B',
    descKey: 'presetGemma3',
    paramsB: 27,
    groups: [
      { kind: 'kv', count: 10, kvHeads: 16, headDim: 128, window: null },
      { kind: 'kv', count: 52, kvHeads: 16, headDim: 128, window: 1024 },
    ],
  },
  {
    id: 'gpt-oss-120b',
    name: 'gpt-oss-120b',
    descKey: 'presetGptOss',
    paramsB: 117,
    groups: [
      { kind: 'kv', count: 18, kvHeads: 8, headDim: 64, window: null },
      { kind: 'kv', count: 18, kvHeads: 8, headDim: 64, window: 128 },
    ],
  },
  {
    id: 'llama4-scout',
    name: 'Llama 4 Scout',
    descKey: 'presetLlama4',
    paramsB: 109,
    groups: [
      { kind: 'kv', count: 12, kvHeads: 8, headDim: 128, window: null },
      { kind: 'kv', count: 36, kvHeads: 8, headDim: 128, window: 8192 },
    ],
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    descKey: 'presetDeepseek',
    paramsB: 671,
    groups: [{ kind: 'mla', count: 61, dim: 512 + 64 }],
  },
  {
    id: 'qwen3-next',
    name: 'Qwen3-Next-80B-A3B',
    descKey: 'presetQwenNext',
    paramsB: 80,
    groups: [
      { kind: 'kv', count: 12, kvHeads: 2, headDim: 256, window: null },
      { kind: 'linear', count: 36, stateValues: 32 * 128 * 128 },
    ],
  },
]

export function kvCacheBytes(groups: LayerGroup[], tokens: number, bytes: number) {
  let full = 0,
    windowed = 0,
    linear = 0,
    perToken = 0
  for (const g of groups) {
    if (g.kind === 'kv') {
      const perLayerToken = 2 * g.kvHeads * g.headDim * bytes
      if (g.window === null) {
        full += g.count * perLayerToken * tokens
        perToken += g.count * perLayerToken
      } else {
        windowed += g.count * perLayerToken * Math.min(tokens, g.window)
        if (tokens < g.window) perToken += g.count * perLayerToken
      }
    } else if (g.kind === 'mla') {
      full += g.count * g.dim * bytes * tokens
      perToken += g.count * g.dim * bytes
    } else {
      linear += g.count * g.stateValues * 2
    }
  }
  return { full, windowed, linear, total: full + windowed + linear, perToken }
}

function formatBytes(n: number, locale: string) {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  let i = 0
  let v = n
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toLocaleString(locale, { maximumFractionDigits: v < 10 ? 2 : 1 })} ${units[i]}`
}

export function KvCacheMemoryCalculator() {
  const { t, locale } = useTranslation()
  const k = t.kvCache
  const [presetId, setPresetId] = useState('llama31-8b')
  const [tokens, setTokens] = useState(32768)
  const [batch, setBatch] = useState(1)
  const [bytes, setBytes] = useState(2)

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]
  const perSeq = kvCacheBytes(preset.groups, tokens, bytes)
  const total = perSeq.total * batch
  const weights = preset.paramsB * 1e9 * 2
  const max = Math.max(total, weights)
  const hasWindow = preset.groups.some((g) => g.kind === 'kv' && g.window !== null)
  const hasLinear = preset.groups.some((g) => g.kind === 'linear')

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <div>
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          {k.calcModel}
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPresetId(p.id)}
              aria-pressed={p.id === presetId}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                p.id === presetId
                  ? 'border-primary bg-primary/10 text-primary-light'
                  : 'border-border text-muted hover:text-text'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">{k[preset.descKey]}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="block text-sm">
          <span className="text-muted">{k.calcContext}</span>
          <span className="ml-2 font-mono text-text">{tokens.toLocaleString(locale)}</span>
          <input
            type="range"
            className="mt-2 w-full"
            min={10}
            max={17}
            step={1}
            value={Math.log2(tokens)}
            onChange={(e) => setTokens(2 ** Number(e.target.value))}
            aria-label={k.calcContext}
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">{k.calcBatch}</span>
          <span className="ml-2 font-mono text-text">{batch}</span>
          <input
            type="range"
            className="mt-2 w-full"
            min={0}
            max={6}
            step={1}
            value={Math.log2(batch)}
            onChange={(e) => setBatch(2 ** Number(e.target.value))}
            aria-label={k.calcBatch}
          />
        </label>
        <div className="text-sm">
          <span className="text-muted">{k.calcDtype}</span>
          <div className="mt-2 flex gap-2">
            {[
              [2, 'BF16'],
              [1, 'FP8'],
            ].map(([b, label]) => (
              <button
                key={label}
                onClick={() => setBytes(Number(b))}
                aria-pressed={bytes === b}
                className={`rounded-lg border px-3 py-1 font-mono text-xs ${
                  bytes === b ? 'border-primary text-primary-light' : 'border-border text-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-background/50 p-4">
          <div className="text-xs text-muted">{k.calcPerToken}</div>
          <div className="mt-1 font-mono text-xl text-text">
            {formatBytes(perSeq.perToken, locale)}
          </div>
        </div>
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
          <div className="text-xs text-muted">{k.calcTotal}</div>
          <div className="mt-1 font-mono text-xl text-cyan-300">{formatBytes(total, locale)}</div>
        </div>
        <div className="rounded-xl border border-border bg-background/50 p-4">
          <div className="text-xs text-muted">{k.calcWeights}</div>
          <div className="mt-1 font-mono text-xl text-text">≈ {formatBytes(weights, locale)}</div>
        </div>
      </div>

      <div className="space-y-2">
        {[
          { label: k.calcTotal, value: total, color: 'bg-cyan-500' },
          { label: k.calcWeights, value: weights, color: 'bg-purple-500' },
        ].map((bar) => (
          <div key={bar.label} className="flex items-center gap-3 text-xs">
            <span className="w-36 shrink-0 text-muted sm:w-48">{bar.label}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-background">
              <motion.div
                className={`h-full rounded-full ${bar.color}`}
                animate={{ width: `${Math.max((bar.value / max) * 100, 0.5)}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-2 text-xs text-muted sm:grid-cols-3">
        <div>
          {k.calcFullLayers}:{' '}
          <span className="font-mono text-text">{formatBytes(perSeq.full * batch, locale)}</span>
        </div>
        {hasWindow && (
          <div>
            {k.calcWindowLayers}:{' '}
            <span className="font-mono text-text">
              {formatBytes(perSeq.windowed * batch, locale)}
            </span>
          </div>
        )}
        {hasLinear && (
          <div>
            {k.calcLinearState}:{' '}
            <span className="font-mono text-text">
              {formatBytes(perSeq.linear * batch, locale)}
            </span>
          </div>
        )}
      </div>
      <p className="text-xs leading-relaxed text-muted">
        {k.calcWeightsNote}
        {hasLinear ? ` ${k.calcLinearNote}` : ''}
      </p>
    </div>
  )
}
