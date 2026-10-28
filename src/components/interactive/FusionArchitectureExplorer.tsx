'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Image as ImageIcon, Type } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type Mode = 'adapter' | 'cross' | 'early'

const MODES: Mode[] = ['adapter', 'cross', 'early']
const BLOCKS = 3

function TokenChip({ variant, index }: { variant: 'text' | 'image' | 'imageId'; index: number }) {
  const reduceMotion = useReducedMotion()
  const style = {
    // Continuous image embeddings are rounded; discrete image IDs (VQ codebook entries) are square.
    text: 'rounded-md bg-orange-400/80 border-orange-300/60',
    image: 'rounded-md bg-cyan-400/80 border-cyan-300/60',
    imageId: 'rounded-none bg-cyan-400/80 border-cyan-300/60',
  }[variant]
  return (
    <motion.span
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.05, duration: 0.25 }}
      className={`inline-block w-5 h-5 border ${style}`}
    />
  )
}

function Box({ children, tone }: { children: ReactNode; tone: 'cyan' | 'orange' | 'neutral' | 'violet' }) {
  const tones = {
    cyan: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    orange: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
    violet: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    neutral: 'border-border bg-surface text-text',
  }
  return <span className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${tones[tone]}`}>{children}</span>
}

export function FusionArchitectureExplorer() {
  const { t } = useTranslation()
  const c = t.multimodality
  const reduceMotion = useReducedMotion()
  const [mode, setMode] = useState<Mode>('adapter')

  const tabs: Record<Mode, string> = { adapter: c.fusionTabAdapter, cross: c.fusionTabCross, early: c.fusionTabEarly }
  const facts: Record<Mode, { how: string; training: string; example: string; output: string }> = {
    adapter: { how: c.fusionAdapterHow, training: c.fusionAdapterTraining, example: c.fusionAdapterExample, output: c.fusionAdapterOutput },
    cross: { how: c.fusionCrossHow, training: c.fusionCrossTraining, example: c.fusionCrossExample, output: c.fusionCrossOutput },
    early: { how: c.fusionEarlyHow, training: c.fusionEarlyTraining, example: c.fusionEarlyExample, output: c.fusionEarlyOutput },
  }

  // Input sequence: which tokens enter the first transformer layer.
  const sequence: Array<'text' | 'image' | 'imageId'> =
    mode === 'adapter'
      ? ['image', 'image', 'image', 'image', 'text', 'text', 'text', 'text']
      : mode === 'cross'
        ? ['text', 'text', 'text', 'text']
        : ['text', 'text', 'imageId', 'imageId', 'imageId', 'imageId', 'text', 'text']
  const outputs: Array<'text' | 'imageId'> = mode === 'early' ? ['text', 'text', 'imageId', 'imageId', 'imageId'] : ['text', 'text', 'text']

  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-5 md:p-6 space-y-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={c.fusionTitle}>
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${mode === m ? 'border-primary/60 bg-primary/15 text-text' : 'border-border bg-background text-muted hover:text-text'}`}
          >
            {tabs[m]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid lg:grid-cols-[1fr_1.1fr] gap-6"
        >
          {/* Diagram */}
          <div className="p-4 rounded-xl bg-background border border-border flex flex-col items-center gap-3" aria-hidden="true">
            {/* Inputs */}
            <div className="flex flex-wrap justify-center gap-4 w-full">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="flex items-center gap-1 text-xs text-cyan-300"><ImageIcon className="w-4 h-4" />{c.fusionImage}</span>
                <span className="text-muted">→</span>
                {mode === 'early' ? <Box tone="cyan">{c.fusionTokenizer}</Box> : <Box tone="cyan">{c.fusionEncoder}</Box>}
                {mode === 'adapter' && (<><span className="text-muted">→</span><Box tone="cyan">{c.fusionProjector}</Box></>)}
              </div>
              <span className="flex items-center gap-1 text-xs text-orange-300"><Type className="w-4 h-4" />{c.fusionText}</span>
            </div>

            <ArrowDown className="w-4 h-4 text-muted" />

            {/* Input sequence */}
            <div className="w-full p-3 rounded-lg border border-dashed border-border">
              <div className="text-[10px] uppercase tracking-wide text-muted mb-2 text-center">{c.fusionSequence}</div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {sequence.map((variant, i) => <TokenChip key={`${mode}-in-${i}`} variant={variant} index={i} />)}
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-muted" />

            {/* Transformer stack */}
            <div className="w-full flex gap-3">
              <div className="flex-1 flex flex-col gap-2">
                {Array.from({ length: BLOCKS }, (_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="px-3 py-2 rounded-lg border border-border bg-surface text-xs text-text flex justify-between">
                      <span>{c.fusionBlock} {i + 1}</span>
                      {mode === 'cross' && <span className="text-muted">{c.fusionFrozen}</span>}
                    </div>
                    {mode === 'cross' && i < BLOCKS - 1 && (
                      <motion.div
                        initial={reduceMotion ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: reduceMotion ? 0 : 0.15 + i * 0.1, duration: 0.3 }}
                        className="px-3 py-1.5 rounded-lg border border-violet-500/40 bg-violet-500/10 text-xs text-violet-300 origin-left"
                      >
                        {c.fusionCrossLayer} ←
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
              {mode === 'cross' && (
                <div className="w-28 shrink-0 flex items-center">
                  <div className="w-full p-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-[11px] text-cyan-300 text-center">
                    {c.fusionFeatures}
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {[0, 1, 2, 3].map((i) => <span key={i} className="w-3 h-3 rounded-sm bg-cyan-400/80" />)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <ArrowDown className="w-4 h-4 text-muted" />

            {/* Output */}
            <div className="w-full p-3 rounded-lg border border-dashed border-border">
              <div className="text-[10px] uppercase tracking-wide text-muted mb-2 text-center">{c.fusionOutput}</div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {outputs.map((variant, i) => <TokenChip key={`${mode}-out-${i}`} variant={variant} index={i + sequence.length} />)}
                {mode === 'early' && (<><span className="text-muted ml-1">→</span><Box tone="cyan">{c.fusionDetokenizer}</Box></>)}
              </div>
            </div>
          </div>

          {/* Facts */}
          <dl className="space-y-4">
            {([
              [c.fusionHow, facts[mode].how],
              [c.fusionTraining, facts[mode].training],
              [c.fusionExample, facts[mode].example],
              [c.fusionCanOutput, facts[mode].output],
            ] as const).map(([term, desc]) => (
              <div key={term} className="p-4 rounded-xl bg-background border border-border">
                <dt className="text-xs font-semibold uppercase tracking-wide text-primary-light mb-1">{term}</dt>
                <dd className="text-sm text-muted leading-relaxed">{desc}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
