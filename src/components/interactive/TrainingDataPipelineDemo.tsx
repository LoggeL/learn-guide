'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

const STEP_IDS = ['raw', 'exact', 'fuzzy', 'heuristic', 'quality', 'decontam'] as const
type StepId = (typeof STEP_IDS)[number]

const DOC_IDS = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9'] as const
type DocId = (typeof DOC_IDS)[number]

// Hand-assigned educational-value scores (0–5), standing in for a FineWeb-Edu-style classifier.
const QUALITY: Record<DocId, number> = { d1: 4, d2: 4, d3: 3, d4: 0, d5: 0, d6: 1, d7: 4, d8: 3, d9: 2 }

const SHINGLE = 3
const NUM_HASHES = 64
const FUZZY_THRESHOLD = 0.5
const MIN_WORDS = 20
const MIN_ALPHA = 0.7
const MAX_REPEAT = 0.15
const CONTAM_N = 8

// Words: runs of Latin letters (incl. umlauts) and digits; keeps decimals such as 1.5 or 1,5 together.
function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9À-ɏ]+(?:[.,][0-9]+)*/g) ?? []
}

function fnv1a(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function mix(x: number): number {
  let h = x >>> 0
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return h >>> 0
}

const SEEDS = Array.from({ length: NUM_HASHES }, (_, i) => mix(Math.imul(i + 1, 0x9e3779b9)))

function ngrams(words: string[], n: number): Set<string> {
  const out = new Set<string>()
  for (let i = 0; i + n <= words.length; i++) out.add(words.slice(i, i + n).join(' '))
  return out
}

function minhash(shingles: Set<string>): number[] {
  const sig = new Array<number>(NUM_HASHES).fill(0xffffffff)
  shingles.forEach((s) => {
    const base = fnv1a(s)
    for (let i = 0; i < NUM_HASHES; i++) {
      const h = mix(base ^ SEEDS[i])
      if (h < sig[i]) sig[i] = h
    }
  })
  return sig
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0
  a.forEach((x) => {
    if (b.has(x)) inter++
  })
  const union = a.size + b.size - inter
  return union === 0 ? 0 : inter / union
}

function repeatShare(words: string[]): number {
  const counts = new Map<string, number>()
  let total = 0
  for (let i = 0; i + 3 <= words.length; i++) {
    const g = words.slice(i, i + 3).join(' ')
    counts.set(g, (counts.get(g) ?? 0) + 1)
    total++
  }
  if (total === 0) return 0
  return Math.max(...Array.from(counts.values())) / total
}

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`))
}

interface Outcome {
  removedAt: number | null
  reason: string
}

export function TrainingDataPipelineDemo() {
  const { t, locale } = useTranslation()
  const d = t.trainingData
  const [step, setStep] = useState(0)
  const [threshold, setThreshold] = useState(3)

  const prepared = useMemo(
    () =>
      DOC_IDS.map((id) => {
        const words = tokenize(d.docs[id].text)
        const shingles = ngrams(words, SHINGLE)
        return {
          id,
          title: d.docs[id].title,
          text: d.docs[id].text,
          words,
          hash: fnv1a(words.join(' ')),
          shingles,
          signature: minhash(shingles),
          alpha: words.length === 0 ? 0 : words.filter((w) => /^[a-zÀ-ɏ]+$/.test(w)).length / words.length,
          repeat: repeatShare(words),
        }
      }),
    [d.docs],
  )

  const benchmarkGrams = useMemo(() => ngrams(tokenize(d.benchmarkText), CONTAM_N), [d.benchmarkText])

  const outcomes = useMemo(() => {
    const fmt = (x: number) => x.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const result: Record<string, Outcome> = {}
    prepared.forEach((doc) => {
      result[doc.id] = { removedAt: null, reason: '' }
    })
    const alive = () => prepared.filter((doc) => result[doc.id].removedAt === null)
    const remove = (id: string, at: number, reason: string) => {
      result[id] = { removedAt: at, reason }
    }

    if (step >= 1) {
      const seen = new Map<number, string>()
      alive().forEach((doc) => {
        const first = seen.get(doc.hash)
        if (first) remove(doc.id, 1, fill(d.reasons.exact, { doc: first }))
        else seen.set(doc.hash, doc.title)
      })
    }
    if (step >= 2) {
      const kept: typeof prepared = []
      alive().forEach((doc) => {
        const match = kept
          .map((other) => {
            const same = doc.signature.filter((v, i) => v === other.signature[i]).length
            return { other, estimate: same / NUM_HASHES }
          })
          .find((m) => m.estimate >= FUZZY_THRESHOLD)
        if (match) {
          remove(doc.id, 2, fill(d.reasons.fuzzy, { doc: match.other.title, j: fmt(jaccard(doc.shingles, match.other.shingles)), m: fmt(match.estimate) }))
        } else kept.push(doc)
      })
    }
    if (step >= 3) {
      alive().forEach((doc) => {
        if (doc.words.length < MIN_WORDS) remove(doc.id, 3, fill(d.reasons.short, { n: doc.words.length, min: MIN_WORDS }))
        else if (doc.alpha < MIN_ALPHA) remove(doc.id, 3, fill(d.reasons.alpha, { p: Math.round(doc.alpha * 100), min: Math.round(MIN_ALPHA * 100) }))
        else if (doc.repeat > MAX_REPEAT) remove(doc.id, 3, fill(d.reasons.repeat, { p: Math.round(doc.repeat * 100), max: Math.round(MAX_REPEAT * 100) }))
      })
    }
    if (step >= 4) {
      alive().forEach((doc) => {
        if (QUALITY[doc.id] < threshold) remove(doc.id, 4, fill(d.reasons.quality, { s: QUALITY[doc.id], t: threshold }))
      })
    }
    if (step >= 5) {
      alive().forEach((doc) => {
        const grams = ngrams(doc.words, CONTAM_N)
        let hit = false
        benchmarkGrams.forEach((g) => {
          if (grams.has(g)) hit = true
        })
        if (hit) remove(doc.id, 5, d.reasons.contam)
      })
    }
    return result
  }, [prepared, step, threshold, benchmarkGrams, d.reasons, locale])

  const aliveDocs = prepared.filter((doc) => outcomes[doc.id].removedAt === null)
  const totalWords = prepared.reduce((sum, doc) => sum + doc.words.length, 0)
  const aliveWords = aliveDocs.reduce((sum, doc) => sum + doc.words.length, 0)
  const stepId: StepId = STEP_IDS[step]

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STEP_IDS.map((id, i) => (
          <button
            key={id}
            type="button"
            aria-pressed={step === i}
            onClick={() => setStep(i)}
            className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
              step === i
                ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                : i < step
                  ? 'border-cyan-500/30 bg-surface text-text'
                  : 'border-border bg-surface text-muted'
            }`}
          >
            <span className="block font-mono text-[11px] text-muted">
              {d.stepLabel} {i}
            </span>
            {d.steps[id].name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepId}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-5"
        >
          <h3 className="font-heading text-lg font-bold text-cyan-300 mb-2">{d.steps[stepId].name}</h3>
          <p className="text-sm leading-relaxed text-muted">{d.steps[stepId].desc}</p>
          {step === 4 && (
            <label className="mt-4 flex flex-wrap items-center gap-3 text-sm text-text">
              <span>
                {d.threshold}: <span className="font-mono text-cyan-300">{threshold}</span>
              </span>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-48 accent-cyan-400"
              />
            </label>
          )}
          {step === 5 && (
            <div className="mt-4 rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
              <div className="text-xs font-bold text-orange-300 mb-1">{d.benchmarkLabel}</div>
              <p className="text-sm text-text">{d.benchmarkText}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Counters */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: d.docsLeft, value: aliveDocs.length, total: prepared.length },
          { label: d.wordsLeft, value: aliveWords, total: totalWords },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs text-muted">{c.label}</div>
            <div className="mt-1 font-mono text-xl text-text">
              {c.value} <span className="text-sm text-muted">/ {c.total}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-cyan-400"
                animate={{ width: `${(c.value / c.total) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Documents */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {prepared.map((doc) => {
          const outcome = outcomes[doc.id]
          const removedNow = outcome.removedAt !== null
          return (
            <motion.article
              key={doc.id}
              layout
              animate={{ opacity: removedNow ? 0.45 : 1, scale: removedNow ? 0.98 : 1 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl border p-4 ${
                removedNow ? 'border-red-500/30 bg-red-500/5' : 'border-border bg-surface'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-text">{doc.title}</h4>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${
                    removedNow ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'
                  }`}
                >
                  {removedNow ? d.removed : d.kept}
                </span>
              </div>
              <p className={`mt-2 text-xs leading-relaxed text-muted ${removedNow ? 'line-through decoration-red-400/40' : ''}`}>{doc.text}</p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-muted">
                {step >= 1 && (
                  <span>
                    {d.hashLabel} {doc.hash.toString(16).padStart(8, '0')}
                  </span>
                )}
                {step >= 4 && (
                  <span title={d.scoreNote}>
                    {d.scoreLabel} {QUALITY[doc.id]}
                  </span>
                )}
              </div>
              {removedNow && <p className="mt-2 text-xs text-red-300">{outcome.reason}</p>}
            </motion.article>
          )
        })}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted disabled:opacity-40"
        >
          {d.prev}
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(STEP_IDS.length - 1, s + 1))}
          disabled={step === STEP_IDS.length - 1}
          className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 disabled:opacity-40"
        >
          {d.next}
        </button>
      </div>
    </div>
  )
}
