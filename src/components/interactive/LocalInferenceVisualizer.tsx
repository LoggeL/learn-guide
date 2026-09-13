'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import Link from 'next/link'

export function LocalInferenceVisualizer({
  section,
  t: li,
}: {
  section: 'hardware' | 'tools' | 'quickstart' | 'moe'
  t: Record<string, string>
}) {
  const { t, locale } = useTranslation(),
    c = t.vramCalc.audit
  const [total, setTotal] = useState(70),
    [active, setActive] = useState(10)
  if (section === 'hardware')
    return (
      <div className="space-y-4">
        <p className="text-muted">{c.localHardware}</p>
        <Link
          className="text-primary-light underline"
          href={`/${locale}/ai/llm-inference/vram-calc`}
        >
          {t.vramCalc.title}
        </Link>
      </div>
    )
  if (section === 'tools')
    return (
      <div className="space-y-4">
        <p className="text-muted">{c.localTools}</p>
        {[
          [c.localOllama, 'https://docs.ollama.com/'],
          [c.localLlama, 'https://github.com/ggml-org/llama.cpp'],
          [c.localLm, 'https://lmstudio.ai/docs'],
        ].map(([text, url]) => (
          <div key={url} className="rounded-xl border border-border p-4">
            <p className="text-sm text-muted">{text}</p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-sm text-primary-light underline"
            >
              {c.sources}
            </a>
          </div>
        ))}
      </div>
    )
  if (section === 'quickstart')
    return (
      <div className="space-y-4">
        <p className="text-muted">{c.localQuick}</p>
        <pre className="overflow-x-auto rounded-xl bg-background p-4 text-sm">
          {'ollama --help\nollama list\nollama ps\n\nllama-cli --help'}
        </pre>
        <a
          href="https://docs.ollama.com/quickstart"
          className="text-primary-light underline"
          target="_blank"
          rel="noreferrer"
        >
          Ollama
        </a>
      </div>
    )
  return (
    <div className="space-y-5">
      <p className="text-muted">{c.localMoe}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          {c.localTotal}: {total}
          <input
            aria-label={c.localTotal}
            className="w-full"
            type="range"
            min={10}
            max={400}
            step={10}
            value={total}
            onChange={(e) => {
              const n = +e.target.value
              setTotal(n)
              setActive((a) => Math.min(a, n))
            }}
          />
        </label>
        <label>
          {c.localActive}: {active}
          <input
            aria-label={c.localActive}
            className="w-full"
            type="range"
            min={1}
            max={total}
            step={1}
            value={active}
            onChange={(e) => setActive(+e.target.value)}
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          {c.localStored}
          <div className="text-2xl font-mono">{(total / 2).toFixed(1)} GB</div>
        </div>
        <div className="rounded-lg border border-border p-4">
          {c.localActiveRead}
          <div className="text-2xl font-mono">{(active / 2).toFixed(1)} GB</div>
        </div>
      </div>
      <p className="text-sm text-muted">{li.moeInsight}</p>
    </div>
  )
}
