'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { LatexBlock } from '@/components/ui/Latex'

const PROMPT_LENGTH = 5
const VISIBLE_CHIPS = 48

type ChipKind = 'prompt' | 'main' | 'accepted' | 'rejected'

interface Chip {
  id: number
  word: string
  kind: ChipKind
}

interface Draft {
  word: string
  willAccept: boolean
}

interface SimState {
  chips: Chip[]
  pointer: number // index of the next word of the reference sentence
  draft: Draft | null
  passes: number
  generated: number
  wrongIndex: number
  serial: number
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const chipStyles: Record<ChipKind, string> = {
  prompt: 'border-border text-muted',
  main: 'border-purple-400/50 bg-purple-500/10 text-purple-200',
  accepted: 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200',
  rejected: 'border-red-400/40 text-red-300/80 line-through',
}

/**
 * Step-through of self-speculative decoding with one MTP module (D = 1).
 * Each forward pass of the main model resolves the pending draft (accepted with probability α),
 * emits one token from the main head and lets the MTP module draft the token after it.
 */
export function MtpSelfSpeculationDemo() {
  const { t, locale } = useTranslation()
  const c = t.mtp
  const sentence = c.demoSentence
  const wrong = c.demoWrong
  const nf = (value: number, digits = 2) =>
    value.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const [alpha, setAlpha] = useState(0.87)
  const rng = useRef(mulberry32(42))

  const initial = (): SimState => ({
    chips: sentence.slice(0, PROMPT_LENGTH).map((word, i) => ({ id: i, word, kind: 'prompt' as const })),
    pointer: PROMPT_LENGTH,
    draft: null,
    passes: 0,
    generated: 0,
    wrongIndex: 0,
    serial: PROMPT_LENGTH,
  })
  const [sim, setSim] = useState<SimState>(initial)

  const wordAt = (i: number) => sentence[i % sentence.length]

  const forwardPass = (state: SimState, a: number): SimState => {
    const chips = [...state.chips]
    let pointer = state.pointer
    let generated = state.generated
    let wrongIndex = state.wrongIndex
    let serial = state.serial
    if (state.draft) {
      if (state.draft.willAccept) {
        chips.push({ id: serial++, word: state.draft.word, kind: 'accepted' })
        pointer += 1
        generated += 1
      } else {
        chips.push({ id: serial++, word: state.draft.word, kind: 'rejected' })
      }
    }
    // The main head always contributes one token per pass (correction or bonus token).
    chips.push({ id: serial++, word: wordAt(pointer), kind: 'main' })
    pointer += 1
    generated += 1
    // The MTP module drafts the token after it. Acceptance is decided here with probability α;
    // drawing it now or at verification time gives the same distribution.
    const willAccept = rng.current() < a
    let draftWord = wordAt(pointer)
    if (!willAccept) {
      draftWord = wrong[wrongIndex % wrong.length]
      if (draftWord === wordAt(pointer)) draftWord = wrong[(wrongIndex + 1) % wrong.length]
      wrongIndex += 1
    }
    return { chips: chips.slice(-VISIBLE_CHIPS), pointer, draft: { word: draftWord, willAccept }, passes: state.passes + 1, generated, wrongIndex, serial }
  }

  const step = (n: number) => {
    let next = sim
    for (let i = 0; i < n; i++) next = forwardPass(next, alpha)
    setSim(next)
  }

  const reset = () => {
    rng.current = mulberry32(42)
    setSim(initial())
  }

  const visible = sim.chips.slice(-VISIBLE_CHIPS)
  const ratio = sim.passes ? sim.generated / sim.passes : 0

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-6">
      <div>
        <h3 className="font-heading text-xl font-semibold text-text">{c.demoTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{c.demoDesc}</p>
      </div>

      <label className="block text-sm text-text">
        {c.demoAlpha}: <span className="font-mono text-cyan-300">{nf(alpha)}</span>
        <input type="range" min={0.1} max={0.99} step={0.01} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} className="mt-2 w-full" />
      </label>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => step(1)} className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20">
          {c.demoStep}
        </button>
        <button type="button" onClick={() => step(50)} className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted transition-colors hover:text-text">
          {c.demoRun}
        </button>
        <button type="button" onClick={reset} className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted transition-colors hover:text-text">
          {c.demoReset}
        </button>
      </div>

      <div className="min-h-[96px] rounded-xl border border-border bg-background p-4">
        <div className="flex flex-wrap gap-1.5">
          {visible.map((chip) => (
            <motion.span
              key={chip.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`rounded-md border px-2 py-1 font-mono text-xs ${chipStyles[chip.kind]}`}
            >
              {chip.word}
            </motion.span>
          ))}
          {sim.draft && (
            <motion.span
              key={`draft-${sim.passes}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="rounded-md border border-dashed border-cyan-400/60 px-2 py-1 font-mono text-xs text-cyan-300"
            >
              {sim.draft.word}?
            </motion.span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-purple-400/50 bg-purple-500/20" />{c.demoLegendMain}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-cyan-400/50 bg-cyan-500/20" />{c.demoLegendAccepted}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-red-400/40" />{c.demoLegendRejected}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-dashed border-cyan-400/60" />{c.demoLegendPending}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">{c.demoPasses}</p>
          <p className="mt-2 font-mono text-2xl text-text">{sim.passes}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">{c.demoTokens}</p>
          <p className="mt-2 font-mono text-2xl text-text">{sim.generated}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">{c.demoRatio}</p>
          <p className="mt-2 font-mono text-2xl text-cyan-300">{sim.passes ? nf(ratio) : '–'}</p>
          <p className="mt-1 text-xs text-muted">{c.demoTheory.replace('{value}', nf(1 + alpha))}</p>
        </div>
      </div>
    </div>
  )
}

const DEFAULT_ALPHAS = [0.87, 0.8, 0.75, 0.7]

/** Expected tokens per main forward pass for a chain of D MTP modules with conditional acceptances α_k. */
export function MtpDepthCalculator() {
  const { t, locale } = useTranslation()
  const c = t.mtp
  const nf = (value: number, digits = 2) =>
    value.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const [depth, setDepth] = useState(1)
  const [alphas, setAlphas] = useState(DEFAULT_ALPHAS)
  const [cost, setCost] = useState(0.03)

  const result = useMemo(() => {
    const reach: number[] = []
    let product = 1
    for (let k = 0; k < depth; k++) {
      product *= alphas[k]
      reach.push(product)
    }
    const tokens = 1 + reach.reduce((s, v) => s + v, 0)
    return { reach, tokens, speed: tokens / (1 + depth * cost) }
  }, [depth, alphas, cost])

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-6">
      <div>
        <h3 className="font-heading text-xl font-semibold text-text">{c.depthTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{c.depthDesc}</p>
        <LatexBlock className="my-3 overflow-x-auto text-text">
          {'\\mathbb{E}[N] = 1 + \\sum_{k=1}^{D} \\prod_{j=1}^{k} \\alpha_j, \\qquad S = \\frac{\\mathbb{E}[N]}{1 + D\\,c}'}
        </LatexBlock>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-text">
          {c.depthD}: <span className="font-mono text-cyan-300">{depth}</span>
          <input type="range" min={1} max={4} step={1} value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="mt-2 block w-full" />
        </label>
        <label className="text-sm text-text">
          {c.depthCost}: <span className="font-mono text-cyan-300">{nf(cost, 3)}</span>
          <input type="range" min={0} max={0.2} step={0.005} value={cost} onChange={(e) => setCost(Number(e.target.value))} className="mt-2 block w-full" />
        </label>
      </div>

      <div className="space-y-3">
        {Array.from({ length: depth }, (_, k) => (
          <div key={k} className="rounded-xl border border-border bg-background p-4">
            <label className="block text-sm text-text">
              {c.depthAlpha.replace('{k}', String(k + 1))}: <span className="font-mono text-cyan-300">{nf(alphas[k])}</span>
              <input
                type="range"
                min={0.3}
                max={0.99}
                step={0.01}
                value={alphas[k]}
                onChange={(e) => setAlphas((prev) => prev.map((v, j) => (j === k ? Number(e.target.value) : v)))}
                className="mt-2 block w-full"
              />
            </label>
            <p className="mt-2 text-xs text-muted">
              {c.depthReach.replace('{k}', String(k + 1))}: <span className="font-mono text-text">{nf(result.reach[k], 3)}</span>
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded bg-surface">
              <motion.div className="h-full rounded bg-cyan-400" initial={false} animate={{ width: `${result.reach[k] * 100}%` }} transition={{ duration: 0.35 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">{c.depthExpected}</p>
          <p className="mt-2 font-mono text-2xl text-cyan-300">{nf(result.tokens)}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">{c.depthSpeedup}</p>
          <p className="mt-2 font-mono text-2xl text-cyan-300">{nf(result.speed)}×</p>
        </div>
      </div>

      <p className="border-l-2 border-cyan-500 pl-4 text-sm leading-relaxed text-muted">{c.depthNote}</p>
    </div>
  )
}
