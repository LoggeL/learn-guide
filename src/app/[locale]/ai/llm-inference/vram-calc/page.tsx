'use client'

import { useState } from 'react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { models, quantPresets } from '@/lib/models'
import {
  memoryEstimate,
  memoryPreset,
  type MemoryInput,
} from '@/lib/inference-math'

export default function VramCalcPage() {
  const { t } = useTranslation()
  const c = t.vramCalc.audit
  const [input, setInput] = useState<MemoryInput>({
    paramsB: 7,
    bits: 4,
    quantOverhead: 1.15,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    tokens: 8192,
    batch: 1,
    kvBytes: 2,
    reserveGiB: 1,
  })
  const [selected, setSelected] = useState('')
  const [capacity, setCapacity] = useState(24)
  const result = memoryEstimate(input)
  const edit = (key: keyof MemoryInput, value: number) => {
    setSelected('')
    setInput((s) => ({ ...s, [key]: value }))
  }
  const fields: [keyof MemoryInput, string, number, number, number][] = [
    ['paramsB', t.vramCalc.paramLabel, 0.1, 2000, 0.1],
    ['layers', t.vramCalc.layersLabel, 1, 256, 1],
    ['kvHeads', c.kvHeads, 1, 256, 1],
    ['headDim', c.headDim, 1, 1024, 1],
    ['tokens', t.vramCalc.ctxLabel, 1, 1048576, 1],
    ['batch', c.batch, 1, 1024, 1],
    ['kvBytes', c.kvBytes, 0.5, 4, 0.5],
    ['reserveGiB', c.reserve, 0, 128, 0.5],
  ]
  const bytes = (value: number) => (value / 2 ** 30).toFixed(2)
  return (
    <TopicLayout
      topicId="vram-calc"
      title={t.vramCalc.title}
      description={t.vramCalc.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: t.vramCalc.title },
      ]}
    >
      <section className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-2xl font-heading text-gradient">{c.memoryTitle}</h2>
        <p className="text-muted">{c.memoryNote}</p>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg border border-border px-3 py-2 text-sm"
            onClick={() => {
              setSelected('')
              setInput((s) => ({
                ...s,
                paramsB: 7,
                layers: 32,
                kvHeads: 8,
                headDim: 128,
              }))
            }}
          >
            {c.memoryManual}
          </button>
          {models.map((model) => (
            <button
              key={model.id}
              aria-pressed={selected === model.id}
              className={`rounded-lg border px-3 py-2 text-sm ${selected === model.id ? 'border-primary text-primary-light' : 'border-border'}`}
              onClick={() => {
                setSelected(model.id)
                setInput((s) => ({ ...s, ...memoryPreset(model) }))
              }}
            >
              {(t.tierList as Record<string, string>)[model.nameKey] ||
                model.id}
            </button>
          ))}
        </div>
        {result.kv === null && (
          <p
            role="status"
            className="rounded-lg border border-amber-500/40 p-4 text-amber-300"
          >
            {c.memoryUnknown}
          </p>
        )}
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
                placeholder={c.unknown}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (
                    e.target.value !== '' &&
                    Number.isFinite(v) &&
                    v >= min &&
                    v <= max
                  )
                    edit(key, v)
                }}
                className="w-full rounded-lg border border-border bg-background p-2 font-mono"
              />
            </label>
          ))}
          <label className="space-y-2 text-sm">
            <span className="block text-muted">{c.capacity}</span>
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
        <div className="flex flex-wrap gap-2">
          {quantPresets.map((q) => (
            <button
              key={q.key}
              aria-pressed={
                input.bits === q.bitsPerParam &&
                input.quantOverhead === q.overhead
              }
              className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
              onClick={() =>
                setInput((s) => ({
                  ...s,
                  bits: q.bitsPerParam,
                  quantOverhead: q.overhead,
                }))
              }
            >
              {q.label} · {(q.bitsPerParam * q.overhead).toFixed(2)} b
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">{c.quantNote}</p>
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            [c.weights, result.weights],
            [c.kv, result.kv],
            [c.reserve, result.reserve],
            [c.total, result.total],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-xl border border-border bg-background p-4"
            >
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="mt-2 text-2xl font-mono">
                {value === null ? c.unknown : bytes(Number(value)) + ' GiB'}
              </dd>
            </div>
          ))}
        </dl>
        {result.total !== null && (
          <p
            role="status"
            className={
              result.total <= capacity * 2 ** 30
                ? 'text-emerald-400'
                : 'text-orange-400'
            }
          >
            {result.total <= capacity * 2 ** 30 ? c.fits : c.over} ({capacity}{' '}
            GiB)
          </p>
        )}
        <p className="text-sm text-muted">{c.unitNote}</p>
        <code className="block overflow-x-auto rounded-lg bg-background p-3 text-xs">
          KV bytes = 2 × layers × KV heads × head dimension × tokens × batch ×
          dtype bytes
        </code>
      </section>
      <section className="space-y-4 rounded-2xl border border-border p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{c.transferTitle}</h2>
        <p className="text-muted">{c.transferNote}</p>
        <h3 className="font-semibold">{t.vramCalc.moeOffloadTitle}</h3>
        <p className="text-muted">{t.vramCalc.moeStrategy2Desc}</p>
        <p className="text-muted">{t.vramCalc.moeStrategy3Desc}</p>
        <div className="flex flex-wrap gap-4 text-sm text-primary-light">
          <a
            href="https://huggingface.co/docs/transformers/en/cache_explanation"
            target="_blank"
            rel="noreferrer"
          >
            Transformers: KV cache
          </a>
          <a
            href="https://github.com/ggml-org/llama.cpp/blob/master/tools/cli/README.md"
            target="_blank"
            rel="noreferrer"
          >
            llama.cpp CLI
          </a>
          <a
            href="https://jax-ml.github.io/scaling-book/inference/"
            target="_blank"
            rel="noreferrer"
          >
            JAX Scaling Book
          </a>
        </div>
      </section>
    </TopicLayout>
  )
}
