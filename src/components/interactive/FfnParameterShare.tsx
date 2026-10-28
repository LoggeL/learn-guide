'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

interface BlockConfig {
  /** Model width d */
  d: number
  /** FFN hidden width d_ff */
  dff: number
  /** Number of FFN matrices: 2 (classic) or 3 (gated, e.g. SwiGLU) */
  m: 2 | 3
  /** KV heads / query heads (1 = full multi-head attention) */
  r: number
  heads: string
}

// Published configurations: Vaswani et al. 2017 (base), Touvron et al. 2023 (LLaMA 7B), Llama 3 8B config.
const presets: { key: 'original' | 'swiglu' | 'llama'; config: BlockConfig }[] = [
  { key: 'original', config: { d: 512, dff: 2048, m: 2, r: 1, heads: '8 / 8' } },
  { key: 'swiglu', config: { d: 4096, dff: 11008, m: 3, r: 1, heads: '32 / 32' } },
  { key: 'llama', config: { d: 4096, dff: 14336, m: 3, r: 8 / 32, heads: '32 / 8' } },
]

const formatParams = (n: number, locale: string) =>
  `${(n / 1e6).toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 1 })} M`

export function FfnParameterShare() {
  const { t, locale } = useTranslation()
  const c = t.ffnMoe
  const [active, setActive] = useState(0)
  const { d, dff, m, r, heads } = presets[active].config

  // W_Q and W_O are d × d; W_K and W_V shrink with the KV/query head ratio r.
  const attention = 2 * d * d * (1 + r)
  const ffn = m * d * dff
  const share = ffn / (attention + ffn)
  const labels = { original: c.sharePresetOriginal, swiglu: c.sharePresetSwiglu, llama: c.sharePresetLlama }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 md:p-6">
      <h3 className="text-xl font-semibold text-text">{c.shareDemoTitle}</h3>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset, i) => (
          <button
            key={preset.key}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${i === active ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-200' : 'border-border text-muted hover:text-text'}`}
          >
            {labels[preset.key]}
          </button>
        ))}
      </div>

      <p className="font-mono text-xs text-muted">
        {c.shareConfig}: d = {d} · d_ff = {dff} ({(dff / d).toFixed(2)}d, {m === 3 ? c.shareGated : c.shareClassic}) · Q / KV = {heads}
      </p>

      <div className="flex h-10 overflow-hidden rounded-xl border border-border">
        <motion.div className="flex items-center justify-center bg-orange-500/30 text-xs font-semibold text-orange-200" animate={{ width: `${(1 - share) * 100}%` }} transition={{ type: 'spring', stiffness: 160, damping: 24 }}>
          {c.shareAttention}
        </motion.div>
        <motion.div className="flex items-center justify-center bg-cyan-500/30 text-xs font-semibold text-cyan-100" animate={{ width: `${share * 100}%` }} transition={{ type: 'spring', stiffness: 160, damping: 24 }}>
          {c.shareFfn} {(share * 100).toFixed(1)} %
        </motion.div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-orange-500/25 bg-orange-500/5 p-3">
          <p className="text-sm text-orange-300">{c.shareAttention}</p>
          <p className="font-mono text-sm text-text">2 · {d}² · (1 + {r.toFixed(2)}) = {formatParams(attention, locale)} {c.shareParams}</p>
        </div>
        <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/5 p-3">
          <p className="text-sm text-cyan-300">{c.shareFfn}</p>
          <p className="font-mono text-sm text-text">{m} · {d} · {dff} = {formatParams(ffn, locale)} {c.shareParams}</p>
        </div>
      </div>
      <p className="text-xs text-muted">{c.shareFormula} {c.shareNote}</p>
    </div>
  )
}
