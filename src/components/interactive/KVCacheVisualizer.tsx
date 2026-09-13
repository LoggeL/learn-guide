'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
export function KVCacheVisualizer() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [step, setStep] = useState(0),
    [tokens, setTokens] = useState(8192),
    [heads, setHeads] = useState(8)
  const vector = (seed: number) =>
    Array.from({ length: 4 }, (_, i) =>
      Math.sin(seed * (i + 1)).toFixed(2),
    ).join(', ')
  const memory = (2 * 32 * heads * 128 * tokens * 2) / 2 ** 30
  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-xl border border-border bg-surface/50 p-5">
        <p className="text-sm text-muted">{c.kvAttentionNote}</p>
        <div className="flex gap-3">
          <button
            disabled={step >= 8}
            onClick={() => setStep((s) => s + 1)}
            className="rounded-lg border border-primary px-4 py-2 disabled:opacity-50"
          >
            {c.step}
          </button>
          <button
            onClick={() => setStep(0)}
            className="rounded-lg border border-border px-4 py-2"
          >
            {c.reset}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Token</th>
                <th className="text-left">K</th>
                <th className="text-left">V</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: step }, (_, i) => (
                <tr key={i} className="border-t border-border font-mono">
                  <td className="p-2">x{i + 1}</td>
                  <td>[{vector(i + 1)}]</td>
                  <td>[{vector(i + 17)}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            {c.withoutCache}: <strong>{(step * (step + 1)) / 2}</strong>{' '}
            {c.kvProjection}
          </div>
          <div>
            {c.withCache}: <strong>{step}</strong> {c.kvProjection}
          </div>
        </div>
      </div>
      <div className="space-y-4 rounded-xl border border-border bg-surface/50 p-5">
        <h3 className="text-xl text-gradient">{c.memoryGrowth}</h3>
        <code className="block text-xs">
          2 × 32 × {heads} × 128 × {tokens} × 2 bytes
        </code>
        <label className="block">
          {c.sequence}: {tokens}
          <input
            className="w-full"
            aria-label={c.sequence}
            type="range"
            min={1024}
            max={131072}
            step={1024}
            value={tokens}
            onChange={(e) => setTokens(+e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          {[
            [32, 'MHA'],
            [8, 'GQA'],
            [1, 'MQA'],
          ].map(([n, label]) => (
            <button
              key={label}
              className={`rounded-lg border px-4 py-2 ${heads === n ? 'border-primary' : 'border-border'}`}
              onClick={() => setHeads(Number(n))}
              aria-pressed={heads === n}
            >
              {label}: {n} {c.heads}
            </button>
          ))}
        </div>
        <p className="text-xl font-mono">
          {c.memory}: {memory.toFixed(2)}
        </p>
        <p className="text-xs text-muted">
          {c.example}: 32 {t.vramCalc.layersLabel}, 128 {c.headDim}, FP16.
        </p>
      </div>
    </div>
  )
}
