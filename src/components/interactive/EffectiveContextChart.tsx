'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

/**
 * Claimed vs. effective context length (in K tokens).
 * RULER: Hsieh et al., COLM 2024 (arXiv 2404.06654v3), Table 3. Threshold 85.6 (Llama-2-7B at 4K), tested up to 128K.
 * NoLiMa: Modarressi et al., ICML 2025 (arXiv 2502.05167v3), Table 3. Threshold 85 % of the model's base score, tested up to 32K.
 * `effectiveLabel` keeps the paper's notation; `effective` is where the bar ends.
 */
type Row = { model: string; claimed: number; claimedLabel: string; effective: number; effectiveLabel: string }

const DATA: Record<'ruler' | 'nolima', Row[]> = {
  ruler: [
    { model: 'Gemini-1.5-Pro', claimed: 1024, claimedLabel: '1M', effective: 128, effectiveLabel: '>128K' },
    { model: 'GPT-4', claimed: 128, claimedLabel: '128K', effective: 64, effectiveLabel: '64K' },
    { model: 'Llama-3.1-70B', claimed: 128, claimedLabel: '128K', effective: 64, effectiveLabel: '64K' },
    { model: 'Qwen2-72B', claimed: 128, claimedLabel: '128K', effective: 32, effectiveLabel: '32K' },
    { model: 'Yi-34B', claimed: 200, claimedLabel: '200K', effective: 32, effectiveLabel: '32K' },
    { model: 'Mistral-7B-v0.2', claimed: 32, claimedLabel: '32K', effective: 16, effectiveLabel: '16K' },
    { model: 'LWM-7B', claimed: 1024, claimedLabel: '1M', effective: 2, effectiveLabel: '<4K' },
  ],
  nolima: [
    { model: 'GPT-4o', claimed: 128, claimedLabel: '128K', effective: 8, effectiveLabel: '8K' },
    { model: 'Claude 3.5 Sonnet', claimed: 200, claimedLabel: '200K', effective: 4, effectiveLabel: '4K' },
    { model: 'Gemini 2.0 Flash', claimed: 1024, claimedLabel: '1M', effective: 4, effectiveLabel: '4K' },
    { model: 'Gemini 1.5 Pro', claimed: 2048, claimedLabel: '2M', effective: 2, effectiveLabel: '2K' },
    { model: 'Llama 3.3 70B', claimed: 128, claimedLabel: '128K', effective: 2, effectiveLabel: '2K' },
    { model: 'GPT-4o mini', claimed: 128, claimedLabel: '128K', effective: 0.5, effectiveLabel: '<1K' },
  ],
}

const MIN = 0.5
const MAX = 2048
const pct = (k: number) => (Math.log2(k / MIN) / Math.log2(MAX / MIN)) * 100
const TICKS = [{ k: 1, l: '1K' }, { k: 8, l: '8K' }, { k: 64, l: '64K' }, { k: 512, l: '512K' }, { k: 2048, l: '2M' }]

export function EffectiveContextChart() {
  const { t } = useTranslation()
  const c = t.contextRot
  const [bench, setBench] = useState<'ruler' | 'nolima'>('ruler')

  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {(['ruler', 'nolima'] as const).map(b => (
          <button
            key={b}
            role="tab"
            aria-selected={bench === b}
            onClick={() => setBench(b)}
            className={`min-h-11 px-4 rounded-lg border text-sm ${bench === b ? 'border-primary/60 bg-primary/10' : 'border-border text-muted'}`}
          >
            {b === 'ruler' ? 'RULER' : 'NoLiMa'}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">{bench === 'ruler' ? c.effRulerThreshold : c.effNolimaThreshold}</p>

      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-2"><span className="w-4 h-3 rounded bg-slate-500/30 border border-slate-400/40" />{c.effClaimed}</span>
        <span className="flex items-center gap-2"><span className="w-4 h-3 rounded bg-cyan-400" />{c.effEffective}</span>
      </div>

      <div className="space-y-3">
        {DATA[bench].map((row, i) => (
          <div key={`${bench}-${row.model}`} className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[10rem_1fr] items-center gap-3">
            <span className="text-xs sm:text-sm truncate" title={row.model}>{row.model}</span>
            <div className="relative h-7 rounded bg-background/60">
              <motion.div
                className="absolute inset-y-0 left-0 rounded bg-slate-500/30 border border-slate-400/40"
                initial={{ width: 0 }}
                animate={{ width: `${pct(row.claimed)}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              />
              <motion.div
                className="absolute inset-y-1 left-0 rounded bg-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${pct(row.effective)}%` }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
              />
              <span className="absolute inset-y-0 right-2 flex items-center text-[11px] font-mono text-muted">
                {row.effectiveLabel} / {row.claimedLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[10rem_1fr] gap-3">
        <span />
        <div className="relative h-4 text-[10px] text-muted font-mono">
          {TICKS.map(tick => (
            <span key={tick.k} className="absolute -translate-x-1/2" style={{ left: `${pct(tick.k)}%` }}>{tick.l}</span>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted">{c.effChartNote}</p>
    </div>
  )
}
