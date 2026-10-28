'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

// Toy corpus from Sennrich et al. (2016), without the end-of-word marker.
// Word boundaries play the role of pre-tokenization: merges never cross words.
const CORPUS: [string, number][] = [
  ['low', 5],
  ['lower', 2],
  ['newest', 6],
  ['widest', 3],
]

const MAX_STEPS = 12

type Word = { word: string; seg: string[]; freq: number }
type Pair = { a: string; b: string; count: number }
type TrainState = { words: Word[]; pairs: Pair[]; merges: [string, string][] }

function countPairs(words: Word[]): Pair[] {
  const counts = new Map<string, Pair>()
  for (const { seg, freq } of words) {
    for (let i = 0; i < seg.length - 1; i++) {
      const key = `${seg[i]}\u0000${seg[i + 1]}`
      const prev = counts.get(key)
      if (prev) prev.count += freq
      else counts.set(key, { a: seg[i], b: seg[i + 1], count: freq })
    }
  }
  // Stable sort: on ties the pair seen first in the corpus wins.
  return Array.from(counts.values()).sort((x, y) => y.count - x.count)
}

function applyMerge(seg: string[], a: string, b: string): string[] {
  const out: string[] = []
  for (let i = 0; i < seg.length; i++) {
    if (i < seg.length - 1 && seg[i] === a && seg[i + 1] === b) {
      out.push(a + b)
      i++
    } else {
      out.push(seg[i])
    }
  }
  return out
}

function train(): TrainState[] {
  let words: Word[] = CORPUS.map(([word, freq]) => ({ word, seg: word.split(''), freq }))
  const merges: [string, string][] = []
  const states: TrainState[] = [{ words, pairs: countPairs(words), merges: [] }]
  for (let step = 0; step < MAX_STEPS; step++) {
    const pairs = countPairs(words)
    if (pairs.length === 0 || pairs[0].count < 2) break
    const best = pairs[0]
    merges.push([best.a, best.b])
    words = words.map((w) => ({ ...w, seg: applyMerge(w.seg, best.a, best.b) }))
    states.push({ words, pairs: countPairs(words), merges: [...merges] })
  }
  return states
}

// Encoding: repeatedly apply the applicable merge with the lowest rank.
function encode(word: string, merges: [string, string][]): { seg: string[]; used: number[] } {
  let seg = word.split('')
  const used: number[] = []
  for (;;) {
    let bestRank = Infinity
    for (let i = 0; i < seg.length - 1; i++) {
      const rank = merges.findIndex(([a, b]) => a === seg[i] && b === seg[i + 1])
      if (rank >= 0 && rank < bestRank) bestRank = rank
    }
    if (bestRank === Infinity) return { seg, used }
    used.push(bestRank)
    seg = applyMerge(seg, merges[bestRank][0], merges[bestRank][1])
  }
}

const BASE_VOCAB = Array.from(new Set(CORPUS.flatMap(([w]) => w.split('')))).sort()

function Chip({ text, highlight }: { text: string; highlight?: boolean }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-block px-1.5 py-0.5 rounded-md border font-mono text-sm ${
        highlight
          ? 'bg-purple-500/30 border-purple-500/60 text-purple-100'
          : 'bg-surface-elevated border-border text-text'
      }`}
    >
      {text}
    </motion.span>
  )
}

export function MiniBpeDemo() {
  const { t } = useTranslation()
  const d = t.tokenization.bpeDemo
  const states = useMemo(() => train(), [])
  const [step, setStep] = useState(0)
  const [testWord, setTestWord] = useState('lowest')

  const state = states[step]
  const nextPair = state.pairs[0] && state.pairs[0].count >= 2 ? state.pairs[0] : null
  const lastMerge = step > 0 ? state.merges[step - 1] : null
  const lastToken = lastMerge ? lastMerge[0] + lastMerge[1] : null
  const finished = step === states.length - 1
  const cleanWord = testWord.toLowerCase().replace(/[^a-z]/g, '').slice(0, 16)
  const encoded = encode(cleanWord, state.merges)

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted">
          {d.stepOf.replace('{step}', String(step)).replace('{total}', String(states.length - 1))}
          {' · '}
          {d.vocabSize}: <span className="font-mono text-text">{BASE_VOCAB.length + step}</span>
          <span className="text-xs"> ({BASE_VOCAB.length} {d.baseSymbols} + {step} {d.mergedSymbols})</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep(0)}
            className="px-3 py-1.5 rounded-lg text-xs border border-border bg-surface-elevated text-muted hover:text-text inline-flex items-center gap-1"
          >
            <RotateCcw size={12} /> {d.reset}
          </button>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-3 py-1.5 rounded-lg text-xs border border-border bg-surface-elevated text-muted hover:text-text disabled:opacity-40 inline-flex items-center gap-1"
          >
            <ChevronLeft size={12} /> {d.back}
          </button>
          <button
            onClick={() => setStep((s) => Math.min(states.length - 1, s + 1))}
            disabled={finished}
            className="px-3 py-1.5 rounded-lg text-xs border border-primary/30 bg-primary/20 text-primary-light disabled:opacity-40 inline-flex items-center gap-1"
          >
            {d.step} <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Corpus with current segmentation */}
        <div>
          <h4 className="text-sm font-semibold text-text mb-3">{d.corpus}</h4>
          <div className="space-y-2">
            {state.words.map((w) => (
              <div key={w.word} className="flex items-center gap-3">
                <span className="w-10 text-right text-xs font-mono text-muted">
                  {d.freq.replace('{n}', String(w.freq))}
                </span>
                <div className="flex flex-wrap gap-1">
                  <AnimatePresence mode="popLayout">
                    {w.seg.map((s, i) => (
                      <Chip key={`${w.word}-${step}-${i}`} text={s} highlight={s === lastToken} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pair counts */}
        <div>
          <h4 className="text-sm font-semibold text-text mb-3">{d.pairCounts}</h4>
          {nextPair ? (
            <div className="space-y-1.5">
              {state.pairs.slice(0, 6).map((p, i) => {
                const max = state.pairs[0].count
                return (
                  <div key={`${p.a}|${p.b}`} className="flex items-center gap-3 text-sm">
                    <span className={`w-24 font-mono ${i === 0 ? 'text-purple-300 font-bold' : 'text-muted'}`}>
                      {p.a} + {p.b}
                    </span>
                    <div className="flex-1 h-2.5 bg-background rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.count / max) * 100}%` }}
                        className={`h-full rounded-full ${i === 0 ? 'bg-purple-400' : 'bg-cyan-500/50'}`}
                      />
                    </div>
                    <span className="w-6 text-right font-mono text-xs text-muted">{p.count}</span>
                  </div>
                )
              })}
              <p className="text-xs text-muted pt-2">
                {d.winner.replace('{pair}', `${nextPair.a} + ${nextPair.b}`).replace('{count}', String(nextPair.count))}
              </p>
              <p className="text-xs text-muted">{d.tieNote}</p>
            </div>
          ) : (
            <p className="text-sm text-muted">{d.done}</p>
          )}
        </div>
      </div>

      {/* Learned merges */}
      <div>
        <h4 className="text-sm font-semibold text-text mb-3">{d.merges}</h4>
        {state.merges.length === 0 ? (
          <p className="text-sm text-muted">{d.noMerges}</p>
        ) : (
          <ol className="flex flex-wrap gap-2">
            {state.merges.map(([a, b], i) => (
              <motion.li
                key={`${a}|${b}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`px-2 py-1 rounded-lg border text-xs font-mono ${
                  encoded.used.includes(i)
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
                    : 'border-border bg-background text-muted'
                }`}
              >
                #{i + 1} {a} + {b} → {a + b}
              </motion.li>
            ))}
          </ol>
        )}
      </div>

      {/* Encode a new word */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-semibold text-text mb-1">{d.encodeTitle}</h4>
        <p className="text-xs text-muted mb-3">{d.encodeDesc}</p>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={testWord}
            onChange={(e) => setTestWord(e.target.value)}
            maxLength={16}
            aria-label={d.encodeTitle}
            className="w-40 bg-background border border-border rounded-lg px-3 py-1.5 font-mono text-sm text-text focus:outline-none focus:border-primary/50"
          />
          <div className="flex gap-1.5">
            {['lowest', 'newer', 'wider', 'slow'].map((w) => (
              <button
                key={w}
                onClick={() => setTestWord(w)}
                className="px-2 py-1 rounded-md text-xs font-mono border border-border bg-surface-elevated text-muted hover:text-text"
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">→</span>
          {encoded.seg.map((s, i) => (
            <Chip key={`${cleanWord}-${step}-${i}`} text={s} highlight={s.length > 1} />
          ))}
          <span className="text-xs text-muted ml-2">
            {encoded.used.length > 0
              ? d.appliedMerges.replace('{list}', encoded.used.map((r) => `#${r + 1}`).join(', '))
              : d.noneApplied}
          </span>
        </div>
      </div>
    </div>
  )
}
