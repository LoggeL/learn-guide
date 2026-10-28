'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { chipRoofline } from '@/lib/inference-math'
import { chipSpecs, rooflineModels, type ChipSpec } from '@/lib/chip-specs'

const BATCHES = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]
const CONTEXTS = [512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072]

// Log-log chart frame
const W = 640
const H = 340
const PAD = { left: 56, right: 16, top: 16, bottom: 44 }
const X_MIN = 0.5
const X_MAX = 1e6
const Y_MIN = 1
const Y_MAX = 30000

const xPos = (v: number) =>
  PAD.left +
  ((Math.log10(Math.min(Math.max(v, X_MIN), X_MAX)) - Math.log10(X_MIN)) /
    (Math.log10(X_MAX) - Math.log10(X_MIN))) *
    (W - PAD.left - PAD.right)
const yPos = (v: number) =>
  H -
  PAD.bottom -
  ((Math.log10(Math.min(Math.max(v, Y_MIN), Y_MAX)) - Math.log10(Y_MIN)) /
    (Math.log10(Y_MAX) - Math.log10(Y_MIN))) *
    (H - PAD.top - PAD.bottom)

function roofPath(bandwidthTBs: number, peakTFLOPS: number) {
  const ridge = peakTFLOPS / bandwidthTBs
  const startY = bandwidthTBs * X_MIN
  return `M ${xPos(X_MIN)} ${yPos(startY)} L ${xPos(ridge)} ${yPos(peakTFLOPS)} L ${xPos(X_MAX)} ${yPos(peakTFLOPS)}`
}

const calculatorChips = chipSpecs.filter((chip) => chip.calculator)

function peakFor(chip: ChipSpec, bytes: number) {
  return (bytes === 1 ? chip.fp8DenseTF : chip.bf16DenseTF) ?? 0
}

export function ChipRooflineCalculator() {
  const { t, locale } = useTranslation()
  const c = t.customChips
  const [chipId, setChipId] = useState<ChipSpec['id']>('h100')
  const [modelId, setModelId] = useState('70b')
  const [bytesPerValue, setBytes] = useState<1 | 2>(1)
  const [phase, setPhase] = useState<'decode' | 'prefill'>('decode')
  const [batchIdx, setBatchIdx] = useState(0)
  const [contextIdx, setContextIdx] = useState(3)

  const chip = calculatorChips.find((x) => x.id === chipId)!
  const model = rooflineModels.find((m) => m.id === modelId)!
  const batch = BATCHES[batchIdx]
  const context = CONTEXTS[contextIdx]
  const peak = peakFor(chip, bytesPerValue)

  const r = useMemo(
    () =>
      chipRoofline({
        ...model,
        bytesPerValue,
        batch,
        context,
        phase,
        bandwidthTBs: chip.bandwidthTBs,
        peakTFLOPS: peak,
        capacityGB: chip.gib ? (chip.memoryGB * 2 ** 30) / 1e9 : chip.memoryGB,
      }),
    [model, bytesPerValue, batch, context, phase, chip, peak],
  )

  const nf = (v: number, digits = 0) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(v)
  const ms = (v: number) =>
    v >= 100 ? nf(v, 0) : v >= 1 ? nf(v, 1) : nf(v, 3)
  const gb = (bytes: number) => nf(bytes / 1e9, bytes < 1e10 ? 1 : 0)

  const memoryBound = r.bound === 'memory'
  const maxMs = Math.max(r.memoryMs, r.computeMs)
  const precisionLabel = bytesPerValue === 1 ? 'FP8' : 'BF16'

  const pill = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm border transition-colors ${
      active
        ? 'bg-primary/20 border-primary/50 text-text'
        : 'bg-background border-border text-muted hover:text-text'
    }`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">
          {c.calcTitle}
        </h2>
        <p className="text-muted leading-relaxed">{c.calcDesc}</p>
      </div>

      {/* Controls */}
      <div className="grid gap-5 lg:grid-cols-2">
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text mb-2">
            {c.chipLabel}
          </legend>
          <div className="flex flex-wrap gap-2">
            {calculatorChips.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setChipId(x.id)}
                className={pill(x.id === chipId)}
                aria-pressed={x.id === chipId}
              >
                {x.name}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text mb-2">
            {c.modelLabel}
          </legend>
          <div className="flex flex-wrap gap-2">
            {rooflineModels.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setModelId(m.id)}
                className={pill(m.id === modelId)}
                aria-pressed={m.id === modelId}
              >
                {m.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">{c.modelNote}</p>
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text mb-2">
            {c.precisionLabel}
          </legend>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBytes(1)}
              className={pill(bytesPerValue === 1)}
              aria-pressed={bytesPerValue === 1}
            >
              {c.precisionFp8}
            </button>
            <button
              type="button"
              onClick={() => setBytes(2)}
              className={pill(bytesPerValue === 2)}
              aria-pressed={bytesPerValue === 2}
            >
              {c.precisionBf16}
            </button>
          </div>
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text mb-2">
            {c.phaseLabel}
          </legend>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPhase('decode')}
              className={pill(phase === 'decode')}
              aria-pressed={phase === 'decode'}
            >
              {c.phaseDecode}
            </button>
            <button
              type="button"
              onClick={() => setPhase('prefill')}
              className={pill(phase === 'prefill')}
              aria-pressed={phase === 'prefill'}
            >
              {c.phasePrefill}
            </button>
          </div>
        </fieldset>
        <label className="block text-sm text-text">
          <span className="font-semibold">{c.batchLabel}</span>:{' '}
          <span className="font-mono">{batch}</span>
          <input
            aria-label={c.batchLabel}
            type="range"
            min={0}
            max={BATCHES.length - 1}
            value={batchIdx}
            onChange={(e) => setBatchIdx(+e.target.value)}
            className="w-full mt-2"
          />
        </label>
        <label className="block text-sm text-text">
          <span className="font-semibold">
            {phase === 'decode' ? c.contextLabel : c.promptLabel}
          </span>
          : <span className="font-mono">{nf(context)}</span>
          <input
            aria-label={phase === 'decode' ? c.contextLabel : c.promptLabel}
            type="range"
            min={0}
            max={CONTEXTS.length - 1}
            value={contextIdx}
            onChange={(e) => setContextIdx(+e.target.value)}
            className="w-full mt-2"
          />
        </label>
      </div>

      {/* Roofline chart */}
      <div className="rounded-xl border border-border bg-background/60 p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label={c.chartAria}
        >
          {/* grid */}
          {[1, 10, 100, 1000, 10000].map((v) => (
            <g key={`y${v}`}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={yPos(v)}
                y2={yPos(v)}
                className="stroke-border"
                strokeDasharray="2 4"
              />
              <text
                x={PAD.left - 6}
                y={yPos(v) + 4}
                textAnchor="end"
                className="fill-muted text-[10px]"
              >
                {nf(v)}
              </text>
            </g>
          ))}
          {[1, 10, 100, 1000, 10000, 100000, 1000000].map((v) => (
            <g key={`x${v}`}>
              <line
                x1={xPos(v)}
                x2={xPos(v)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                className="stroke-border"
                strokeDasharray="2 4"
              />
              <text
                x={xPos(v)}
                y={H - PAD.bottom + 16}
                textAnchor="middle"
                className="fill-muted text-[10px]"
              >
                {v >= 1000 ? `${nf(v / 1000)}k` : nf(v)}
              </text>
            </g>
          ))}
          <text
            x={(W + PAD.left) / 2}
            y={H - 6}
            textAnchor="middle"
            className="fill-muted text-[11px]"
          >
            {c.chartX}
          </text>
          <text
            x={14}
            y={(H - PAD.bottom + PAD.top) / 2}
            textAnchor="middle"
            transform={`rotate(-90 14 ${(H - PAD.bottom + PAD.top) / 2})`}
            className="fill-muted text-[11px]"
          >
            {c.chartY.replace('{precision}', precisionLabel)}
          </text>

          {/* other chips, faint */}
          {calculatorChips
            .filter((x) => x.id !== chip.id)
            .map((x) => (
              <path
                key={x.id}
                d={roofPath(x.bandwidthTBs, peakFor(x, bytesPerValue))}
                fill="none"
                className="stroke-muted"
                strokeOpacity={0.25}
                strokeWidth={1}
              />
            ))}

          {/* selected chip roof */}
          <motion.path
            d={roofPath(chip.bandwidthTBs, peak)}
            fill="none"
            stroke="#22d3ee"
            strokeWidth={2.5}
            initial={false}
            animate={{ d: roofPath(chip.bandwidthTBs, peak) }}
            transition={{ duration: 0.4 }}
          />
          {/* ridge marker */}
          <motion.line
            initial={false}
            animate={{ x1: xPos(r.ridge), x2: xPos(r.ridge) }}
            y1={yPos(peak)}
            y2={H - PAD.bottom}
            stroke="#22d3ee"
            strokeOpacity={0.5}
            strokeDasharray="4 3"
          />
          <motion.text
            initial={false}
            animate={{ x: xPos(r.ridge) + 4 }}
            y={H - PAD.bottom - 6}
            className="fill-cyan-400 text-[10px]"
          >
            {c.ridgeShort} {nf(r.ridge)}
          </motion.text>

          {/* workload point */}
          <motion.circle
            initial={false}
            animate={{
              cx: xPos(r.intensity),
              cy: yPos(r.attainableTFLOPS),
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            r={7}
            fill={memoryBound ? '#fb923c' : '#34d399'}
            stroke="white"
            strokeWidth={1.5}
          />
        </svg>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-0.5 bg-cyan-400" />
            {chip.name} ({precisionLabel})
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-0.5 bg-muted/40" />
            {c.chartOthers}
          </span>
          <span className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${memoryBound ? 'bg-orange-400' : 'bg-emerald-400'}`}
            />
            {c.chartPoint}
          </span>
        </div>
      </div>

      {/* Verdict */}
      <motion.div
        key={r.bound}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border p-5 ${
          memoryBound
            ? 'border-orange-500/30 bg-orange-500/5'
            : 'border-emerald-500/30 bg-emerald-500/5'
        }`}
      >
        <div
          className={`text-lg font-bold font-heading mb-1 ${memoryBound ? 'text-orange-400' : 'text-emerald-400'}`}
        >
          {memoryBound ? c.memoryBound : c.computeBound}
        </div>
        <p className="text-sm text-muted leading-relaxed">
          {(memoryBound ? c.boundExplainMemory : c.boundExplainCompute)
            .replace('{intensity}', nf(r.intensity, 1))
            .replace('{ridge}', nf(r.ridge))
            .replace('{util}', nf(r.utilization * 100, 1))}
        </p>
        {phase === 'decode' && (
          <p className="text-sm text-muted leading-relaxed mt-2">
            {c.criticalBatch.replace(
              '{b}',
              nf(Math.ceil(r.weightOnlyCriticalBatch)),
            )}
          </p>
        )}
      </motion.div>

      {/* Numbers */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-background/60 p-5 space-y-3">
          {[
            { label: c.timeMemory, v: r.memoryMs, color: 'bg-orange-400' },
            { label: c.timeCompute, v: r.computeMs, color: 'bg-emerald-400' },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{row.label}</span>
                <span className="font-mono text-text">{ms(row.v)} ms</span>
              </div>
              <div className="h-2 rounded bg-surface mt-1 overflow-hidden">
                <motion.div
                  className={`h-full ${row.color}`}
                  initial={false}
                  animate={{ width: `${Math.max(1, (row.v / maxMs) * 100)}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-between text-sm border-t border-border pt-3">
            <span className="text-text font-semibold">
              {phase === 'decode' ? c.stepTime : c.ttft}
            </span>
            <span className="font-mono text-text">{ms(r.stepMs)} ms</span>
          </div>
          {phase === 'decode' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{c.tokensPerSeq}</span>
                <span className="font-mono text-text">
                  {nf(r.perSequence, 1)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{c.tokensTotal}</span>
                <span className="font-mono text-text">{nf(r.total)}</span>
              </div>
            </>
          )}
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-5 space-y-2 text-sm">
          {[
            [c.weightsLabel, `${gb(r.weightBytes)} GB`],
            [
              phase === 'decode' ? c.kvReadLabel : c.kvWriteLabel,
              `${gb(r.kvBytes)} GB`,
            ],
            [c.flopsLabel, `${nf(r.flops / 1e12, 2)} TFLOP`],
            [c.intensityLabel, `${nf(r.intensity, 1)} ${c.unitFlopByte}`],
            [c.ridgeLabel, `${nf(r.ridge)} ${c.unitFlopByte}`],
            [c.chipsLabel, nf(r.chips)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3">
              <span className="text-muted">{label}</span>
              <span className="font-mono text-text text-right">{value}</span>
            </div>
          ))}
          {r.chips > 1 && (
            <p className="text-xs text-muted pt-2">
              {c.chipsSplit.replace('{n}', nf(r.chips))}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed">{c.calcCaveat}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <span className="text-muted">{c.relatedLabel}</span>
        <Link
          href="/ai/llm-inference/batching"
          className="text-primary-light hover:underline"
        >
          {t.topicNames['batching']}
        </Link>
        <Link
          href="/ai/llm-inference/kv-cache"
          className="text-primary-light hover:underline"
        >
          {t.topicNames['kv-cache']}
        </Link>
        <Link
          href="/ai/llm-inference/vram-calc"
          className="text-primary-light hover:underline"
        >
          {t.topicNames['vram-calc']}
        </Link>
        <Link
          href="/ai/llm/quantization"
          className="text-primary-light hover:underline"
        >
          {t.topicNames['quantization']}
        </Link>
      </div>
    </div>
  )
}
