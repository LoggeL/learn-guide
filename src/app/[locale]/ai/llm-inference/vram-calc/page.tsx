'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { OffloadBandwidthDemo } from '@/components/interactive/OffloadBandwidthDemo'
import { useTranslation } from '@/lib/i18n/context'
import { models, quantPresets } from '@/lib/models'
import {
  memoryEstimate,
  memoryPreset,
  type KvFormat,
  type MemoryInput,
} from '@/lib/inference-math'

const DEFAULT_PRESET = models.find((m) => m.id === 'qwen36-27b') ?? models[0]
const INITIAL: MemoryInput = {
  bits: 4,
  quantOverhead: 1.15,
  tokens: 32768,
  batch: 1,
  kvBytes: 2,
  reserveGiB: 1,
  ...memoryPreset(DEFAULT_PRESET),
}
const MANUAL: Partial<MemoryInput> = {
  paramsB: 8,
  activeParamsB: 8,
  kvFormat: 'heads',
  layers: 32,
  kvHeads: 8,
  headDim: 128,
  latentDim: null,
  windowLayers: 0,
  window: 0,
}

type NumericKey = Exclude<keyof MemoryInput, 'kvFormat'>

export default function VramCalcPage() {
  const { t, locale } = useTranslation()
  const v = t.vramCalc
  const [input, setInput] = useState<MemoryInput>(INITIAL)
  const [selected, setSelected] = useState(DEFAULT_PRESET.id)
  const [capacity, setCapacity] = useState(24)
  const result = memoryEstimate(input)
  const latent = input.kvFormat === 'latent'
  const selectedModel = models.find((m) => m.id === selected)
  const names = v.presetNames as Record<string, string>
  const notes = v.presetNotes as Record<string, string>

  const gib = (value: number) =>
    (value / 2 ** 30).toLocaleString(locale, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const kib = (value: number) => (value / 1024).toLocaleString(locale, { maximumFractionDigits: 1 })
  const edit = (key: NumericKey, value: number) => {
    setSelected('')
    setInput((s) => ({ ...s, [key]: value }))
  }

  const fields: [NumericKey, string, number, number, number][] = [
    ['paramsB', v.paramLabel, 0.1, 2000, 0.1],
    ['activeParamsB', v.activeParamLabel, 0.1, 2000, 0.1],
    ['layers', v.kvLayersLabel, 0, 256, 1],
    ...(latent
      ? ([['latentDim', v.latentDim, 1, 8192, 1]] as [NumericKey, string, number, number, number][])
      : ([
          ['kvHeads', v.kvHeads, 1, 256, 1],
          ['headDim', v.headDim, 1, 1024, 1],
        ] as [NumericKey, string, number, number, number][])),
    ['windowLayers', v.windowLayersLabel, 0, 256, 1],
    ['window', v.windowLabel, 0, 1048576, 1],
    ['tokens', v.ctxLabel, 1, 1048576, 1],
    ['batch', v.batch, 1, 1024, 1],
    ['kvBytes', v.kvBytes, 0.5, 4, 0.5],
    ['reserveGiB', v.reserve, 0, 128, 0.5],
  ]

  const chip = (active: boolean) =>
    `rounded-lg border px-3 py-2 text-sm transition-colors ${
      active ? 'border-primary bg-primary/10 text-primary-light' : 'border-border text-muted hover:text-text'
    }`
  const fits = result.total !== null && result.total <= capacity * 2 ** 30
  const segments =
    result.total === null
      ? []
      : [
          { label: v.weights, value: result.weights, color: 'bg-cyan-500/70' },
          { label: v.kv, value: result.kv ?? 0, color: 'bg-purple-500/70' },
          { label: v.reserveResult, value: result.reserve, color: 'bg-slate-500/60' },
        ]
  const scale = Math.max(result.total ?? 0, capacity * 2 ** 30)

  return (
    <TopicLayout
      topicId="vram-calc"
      title={v.title}
      description={v.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: v.title },
      ]}
    >
      {/* 1. What takes memory */}
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 text-2xl font-bold font-heading text-gradient">{v.introTitle}</h2>
        <p className="mb-6 text-lg leading-relaxed text-muted">{v.introDesc}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: v.partWeightsTitle, desc: v.partWeightsDesc, color: 'cyan' },
            { title: v.partKvTitle, desc: v.partKvDesc, color: 'purple' },
            { title: v.partReserveTitle, desc: v.partReserveDesc, color: 'emerald' },
          ].map((item) => (
            <div key={item.title} className={`rounded-xl border border-${item.color}-500/20 bg-${item.color}-500/5 p-5`}>
              <h3 className={`mb-2 font-semibold font-heading text-${item.color}-400`}>{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Calculator */}
      <section className="space-y-6 rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient">{v.calcTitle}</h2>
        <div>
          <p className="mb-2 text-sm text-muted">{v.presetsLabel}</p>
          <div className="flex flex-wrap gap-2">
            <button
              aria-pressed={selected === ''}
              className={chip(selected === '')}
              onClick={() => {
                setSelected('')
                setInput((s) => ({ ...s, ...MANUAL }))
              }}
            >
              {v.manual}
            </button>
            {models.map((model) => (
              <button
                key={model.id}
                aria-pressed={selected === model.id}
                className={chip(selected === model.id)}
                onClick={() => {
                  setSelected(model.id)
                  setInput((s) => ({ ...s, ...memoryPreset(model) }))
                }}
              >
                {names[model.nameKey] ?? model.id}
              </button>
            ))}
          </div>
          {selectedModel && (
            <p className="mt-3 rounded-lg border border-border bg-background p-3 text-sm leading-relaxed text-muted">
              {notes[selectedModel.descKey]}{' '}
              {selectedModel.sourceUrl && (
                <a href={selectedModel.sourceUrl} target="_blank" rel="noreferrer" className="text-primary-light hover:underline">
                  {v.presetSource}
                </a>
              )}
            </p>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm text-muted">{v.layoutLabel}</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['heads', v.layoutHeads],
                ['latent', v.layoutLatent],
              ] as [KvFormat, string][]
            ).map(([format, label]) => (
              <button
                key={format}
                aria-pressed={(input.kvFormat ?? 'heads') === format}
                className={chip((input.kvFormat ?? 'heads') === format)}
                onClick={() => {
                  setSelected('')
                  setInput((s) => ({
                    ...s,
                    kvFormat: format,
                    latentDim: format === 'latent' ? (s.latentDim ?? 576) : null,
                    kvHeads: format === 'heads' ? (s.kvHeads ?? 8) : null,
                    headDim: format === 'heads' ? (s.headDim ?? 128) : null,
                  }))
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map(([key, label, min, max, step]) => (
            <label className="space-y-2 text-sm" key={key}>
              <span className="block text-muted">{label}</span>
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={input[key] ?? ''}
                placeholder={v.unknown}
                onChange={(e) => {
                  const n = Number(e.target.value)
                  if (e.target.value !== '' && Number.isFinite(n) && n >= min && n <= max) edit(key, n)
                }}
                className="w-full rounded-lg border border-border bg-background p-2 font-mono"
              />
            </label>
          ))}
          <label className="space-y-2 text-sm">
            <span className="block text-muted">{v.capacity}</span>
            <input
              type="number"
              min={1}
              max={2048}
              value={capacity}
              onChange={(e) => {
                const n = Number(e.target.value)
                if (n > 0) setCapacity(n)
              }}
              className="w-full rounded-lg border border-border bg-background p-2 font-mono"
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-sm text-muted">{v.quantLabel}</p>
          <div className="flex flex-wrap gap-2">
            {quantPresets.map((q) => (
              <button
                key={q.key}
                aria-pressed={input.bits === q.bitsPerParam && input.quantOverhead === q.overhead}
                className={`${chip(input.bits === q.bitsPerParam && input.quantOverhead === q.overhead)} font-mono`}
                onClick={() => setInput((s) => ({ ...s, bits: q.bitsPerParam, quantOverhead: q.overhead }))}
              >
                {q.label} · {(q.bitsPerParam * q.overhead).toLocaleString(locale, { maximumFractionDigits: 2 })} {v.bitsUnit}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">{v.quantNote}</p>
        </div>

        {result.kv === null && (
          <p role="status" className="rounded-lg border border-amber-500/40 p-4 text-amber-300">
            {v.memoryUnknown}
          </p>
        )}

        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [v.weights, result.weights],
            [v.kv, result.kv],
            [v.reserveResult, result.reserve],
            [v.total, result.total],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-border bg-background p-4">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="mt-2 font-mono text-2xl">{value === null ? v.unknown : `${gib(Number(value))} GiB`}</dd>
            </div>
          ))}
        </dl>

        {result.total !== null && (
          <div className="space-y-2">
            <div className="relative flex h-6 overflow-hidden rounded-lg bg-surface-elevated">
              {segments.map((seg) => (
                <motion.div
                  key={seg.label}
                  title={seg.label}
                  className={seg.color}
                  initial={false}
                  animate={{ width: `${(100 * seg.value) / scale}%` }}
                  transition={{ duration: 0.3 }}
                />
              ))}
              <div
                className="absolute inset-y-0 border-r-2 border-dashed border-text"
                style={{ left: `${Math.min(100, (100 * capacity * 2 ** 30) / scale)}%` }}
              />
            </div>
            <p role="status" className={fits ? 'text-emerald-400' : 'text-orange-400'}>
              {fits ? v.fits : v.over} ({capacity} GiB)
              {result.kvPerToken !== null && (
                <span className="ml-3 text-sm text-muted">
                  {v.kvPerToken}: {kib(result.kvPerToken)} KiB
                </span>
              )}
            </p>
          </div>
        )}

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="mb-2 text-sm font-semibold text-text">{v.formulaTitle}</p>
          <code className="block overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-muted">
            {v.formulaWeights}
            {'\n'}
            {latent ? v.formulaKvLatent : v.formulaKvHeads}
          </code>
          <p className="mt-2 text-xs text-muted">{v.unitNote}</p>
        </div>
      </section>

      {/* 3. KV heads, head dimension, MLA, windows */}
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 text-2xl font-bold font-heading text-gradient">{v.kvExplainTitle}</h2>
        <div className="space-y-4 leading-relaxed text-muted">
          <p>{v.kvExplainQkv}</p>
          <p>{v.kvExplainHeads}</p>
          <p>{v.kvExplainMla}</p>
          <p>{v.kvExplainWindow}</p>
        </div>
        <div className="mt-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
          <h3 className="mb-3 font-semibold font-heading text-purple-400">{v.workedTitle}</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text">
            {[v.worked1, v.worked2, v.worked3, v.worked4].map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <Link href="/ai/llm/multi-head-attention-gqa" className="mt-4 inline-block text-sm text-primary-light hover:underline">
          {v.gqaLink} &rarr;
        </Link>
      </section>

      {/* 4. Speed and offloading */}
      <section className="space-y-5 rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient">{v.speedTitle}</h2>
        <p className="leading-relaxed text-muted">{v.speedDesc}</p>
        <OffloadBandwidthDemo activeWeightBytes={result.activeWeights} kvBytes={result.kv ?? 0} />
      </section>

      {/* 5. MoE expert placement */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold font-heading text-gradient">{v.moeOffloadTitle}</h2>
        <p className="leading-relaxed text-muted">{v.moeOffloadDesc}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: v.moeStrategy1Title, desc: v.moeStrategy1Desc, color: 'cyan' },
            { title: v.moeStrategy2Title, desc: v.moeStrategy2Desc, color: 'purple' },
            { title: v.moeStrategy3Title, desc: v.moeStrategy3Desc, color: 'emerald' },
          ].map((item) => (
            <div key={item.title} className={`rounded-xl border border-${item.color}-500/20 bg-${item.color}-500/5 p-5`}>
              <h3 className={`mb-2 font-semibold font-heading text-${item.color}-400`}>{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Caveats and sources */}
      <section className="space-y-4 rounded-2xl border border-border p-6 md:p-8">
        <h2 className="text-xl font-bold font-heading text-gradient">{v.caveatsTitle}</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
          {[v.caveat1, v.caveat2, v.caveat3].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3 className="pt-2 font-semibold text-text">{v.sourcesTitle}</h3>
        <ul className="space-y-1 text-sm">
          {[
            [v.srcKvCache, 'https://huggingface.co/docs/transformers/en/cache_explanation'],
            [v.srcGqa, 'https://arxiv.org/abs/2305.13245'],
            [v.srcMla, 'https://arxiv.org/abs/2405.04434'],
            [v.srcLlamaCpp, 'https://github.com/ggml-org/llama.cpp/blob/master/tools/cli/README.md'],
            [v.srcVllm, 'https://docs.vllm.ai/en/latest/configuration/engine_args.html'],
            [v.srcScaling, 'https://jax-ml.github.io/scaling-book/inference/'],
          ].map(([label, url]) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer" className="text-primary-light hover:underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
