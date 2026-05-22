'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Binary, Hash, SplitSquareHorizontal } from 'lucide-react'
import { getEncoding } from 'js-tiktoken'

const TOKEN_COLORS = [
  'border-cyan-500/40 bg-cyan-500/15 text-cyan-100',
  'border-emerald-500/40 bg-emerald-500/15 text-emerald-100',
  'border-amber-500/40 bg-amber-500/15 text-amber-100',
  'border-pink-500/40 bg-pink-500/15 text-pink-100',
  'border-violet-500/40 bg-violet-500/15 text-violet-100',
]

const examples = [
  {
    label: 'strawberry',
    text: 'strawberry',
    task: 'Count the letter r',
    expected: '3',
    trap: 'The model may treat chunks like opaque parts, not as a visible row of letters.',
  },
  {
    label: 'cranberry',
    text: 'cranberry',
    task: 'Count the letter r',
    expected: '3',
    trap: 'A patched model can know the famous strawberry answer and still miss a nearby word.',
  },
  {
    label: 'multi-digit addition',
    text: '847293 + 618759',
    task: 'Add exactly',
    expected: '1,466,052',
    trap: 'Digits arrive as text tokens; exact arithmetic needs a reliable algorithm, not a fluent guess.',
  },
]

function countLetters(value: string, letter: string) {
  return Array.from(value.toLowerCase()).filter((char) => char === letter).length
}

function decodeTokens(text: string) {
  const encoding = getEncoding('o200k_base')
  const ids = encoding.encode(text)
  return ids.map((id) => ({
    id,
    text: encoding.decode([id]),
  }))
}

export function SubtokenBlindnessDemo() {
  const [selected, setSelected] = useState(examples[0])
  const [customText, setCustomText] = useState('strawberry')

  const tokens = useMemo(() => decodeTokens(customText), [customText])
  const rCount = useMemo(() => countLetters(customText, 'r'), [customText])

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-300">
            <AlertTriangle size={16} />
            <span>Interactive failure mode</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-text">Token view vs. character task</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            The tokenizer sees reusable chunks. The human task often asks for letters, digits, or exact positions inside those chunks.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3">
          {examples.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => {
                setSelected(example)
                setCustomText(example.text)
              }}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                selected.label === example.label
                  ? 'border-primary/60 bg-primary/20 text-primary-light'
                  : 'border-border bg-background/60 text-muted hover:border-primary/40 hover:text-text'
              }`}
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-border bg-background/70 p-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-subtle">
            Try text
          </label>
          <input
            value={customText}
            onChange={(event) => setCustomText(event.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-3 font-mono text-sm text-text outline-none transition-colors focus:border-primary/60"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {tokens.map((token, index) => (
              <motion.span
                key={`${token.id}-${index}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg border px-3 py-2 font-mono text-sm ${TOKEN_COLORS[index % TOKEN_COLORS.length]}`}
                title={`token id ${token.id}`}
              >
                {token.text.replaceAll(' ', '·')}
              </motion.span>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface/70 p-3">
              <div className="mb-1 flex items-center gap-2 text-xs text-subtle">
                <SplitSquareHorizontal size={14} />
                Tokens
              </div>
              <div className="font-mono text-2xl font-bold text-cyan-300">{tokens.length}</div>
            </div>
            <div className="rounded-lg border border-border bg-surface/70 p-3">
              <div className="mb-1 flex items-center gap-2 text-xs text-subtle">
                <Hash size={14} />
                Characters
              </div>
              <div className="font-mono text-2xl font-bold text-emerald-300">{Array.from(customText).length}</div>
            </div>
            <div className="rounded-lg border border-border bg-surface/70 p-3">
              <div className="mb-1 flex items-center gap-2 text-xs text-subtle">
                <Binary size={14} />
                Letter r
              </div>
              <div className="font-mono text-2xl font-bold text-amber-300">{rCount}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <h3 className="mb-2 font-heading text-lg font-bold text-amber-300">{selected.task}</h3>
          <div className="mb-4 rounded-lg border border-border bg-background/70 p-3">
            <div className="text-xs text-subtle">Expected deterministic answer</div>
            <div className="mt-1 font-mono text-xl font-bold text-text">{selected.expected}</div>
          </div>
          <p className="text-sm leading-relaxed text-muted">{selected.trap}</p>
          <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm leading-relaxed text-muted">
            Reliable workaround: externalize the hidden structure. Spell characters one by one, or route arithmetic to code/a calculator.
          </div>
        </div>
      </div>
    </div>
  )
}
