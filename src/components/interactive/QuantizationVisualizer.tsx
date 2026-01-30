'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HardDrive, Cpu, Zap } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface QuantLevel {
  id: string
  bits: number
  sizePercent: number
  accuracyPercent: number
  perplexityIncrease: number
  discreteLevels: number | null
  color: string
}

const QUANT_LEVELS: QuantLevel[] = [
  { id: 'fp32', bits: 32, sizePercent: 100, accuracyPercent: 100, perplexityIncrease: 0, discreteLevels: null, color: '#a855f7' },
  { id: 'fp16', bits: 16, sizePercent: 50, accuracyPercent: 99, perplexityIncrease: 0.01, discreteLevels: null, color: '#06b6d4' },
  { id: 'int8', bits: 8, sizePercent: 25, accuracyPercent: 97, perplexityIncrease: 0.1, discreteLevels: 256, color: '#10b981' },
  { id: 'int4', bits: 4, sizePercent: 12.5, accuracyPercent: 92, perplexityIncrease: 0.3, discreteLevels: 16, color: '#f97316' },
  { id: 'int2', bits: 2, sizePercent: 6.25, accuracyPercent: 75, perplexityIncrease: 1.5, discreteLevels: 4, color: '#ef4444' },
]

// Generate a bell curve distribution for weights
function generateWeightDistribution(numPoints: number = 100): number[] {
  const weights: number[] = []
  for (let i = 0; i < numPoints; i++) {
    const x = (i / numPoints) * 6 - 3 // Range from -3 to 3
    const y = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
    weights.push(y)
  }
  return weights
}

// Quantize the distribution to discrete levels
function quantizeDistribution(distribution: number[], levels: number): number[] {
  if (levels === 0) return distribution

  const max = Math.max(...distribution)
  const step = max / levels

  return distribution.map(val => {
    const quantized = Math.round(val / step) * step
    return Math.min(quantized, max)
  })
}

export function QuantizationVisualizer() {
  const { t } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState(3) // Default to INT4

  const selectedLevel = QUANT_LEVELS[selectedIndex]

  const originalDistribution = useMemo(() => generateWeightDistribution(100), [])

  const quantizedDistribution = useMemo(() => {
    if (!selectedLevel.discreteLevels) return originalDistribution
    return quantizeDistribution(originalDistribution, selectedLevel.discreteLevels)
  }, [selectedLevel, originalDistribution])

  const explanations: Record<string, string> = {
    fp32: t.quantization.vizFp32Explain,
    fp16: t.quantization.vizFp16Explain,
    int8: t.quantization.vizInt8Explain,
    int4: t.quantization.vizInt4Explain,
    int2: t.quantization.vizInt2Explain,
  }

  // SVG dimensions
  const width = 400
  const height = 150
  const padding = 20
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
          <Cpu size={18} className="text-orange-400" />
        </div>
        <div>
          <h3 className="font-semibold text-text font-heading">{t.quantization.vizTitle}</h3>
          <p className="text-xs text-muted">{t.quantization.vizSubtitle}</p>
        </div>
      </div>

      {/* Precision Slider */}
      <div className="p-6 rounded-xl bg-surface border border-border">
        <div className="text-sm text-muted mb-4">{t.quantization.vizPrecision}</div>
        <div className="relative">
          <input
            type="range"
            min={0}
            max={QUANT_LEVELS.length - 1}
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${QUANT_LEVELS.map((l, i) =>
                `${l.color} ${(i / (QUANT_LEVELS.length - 1)) * 100}%`
              ).join(', ')})`,
            }}
          />
          <div className="flex justify-between mt-2 text-xs">
            {QUANT_LEVELS.map((level) => (
              <span
                key={level.id}
                className={`transition-colors ${selectedLevel.id === level.id ? 'text-text font-semibold' : 'text-muted'}`}
              >
                {level.id.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Model Size */}
        <div className="p-4 rounded-xl bg-surface border border-border">
          <div className="flex items-center gap-2 text-sm text-muted mb-2">
            <HardDrive size={14} />
            <span>{t.quantization.vizModelSize}</span>
          </div>
          <div className="relative h-4 bg-background rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: selectedLevel.color }}
              initial={{ width: 0 }}
              animate={{ width: `${selectedLevel.sizePercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-2xl font-bold" style={{ color: selectedLevel.color }}>
            {selectedLevel.sizePercent}%
            <span className="text-sm font-normal text-muted ml-2">{t.quantization.vizOfOriginal}</span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-xl bg-surface border border-border">
          <div className="flex items-center gap-2 text-sm text-muted mb-2">
            <Zap size={14} />
            <span>{t.quantization.vizAccuracy}</span>
          </div>
          <div className="relative h-4 bg-background rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: selectedLevel.accuracyPercent > 90 ? '#10b981' : selectedLevel.accuracyPercent > 80 ? '#f97316' : '#ef4444' }}
              initial={{ width: 0 }}
              animate={{ width: `${selectedLevel.accuracyPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-2xl font-bold" style={{ color: selectedLevel.accuracyPercent > 90 ? '#10b981' : selectedLevel.accuracyPercent > 80 ? '#f97316' : '#ef4444' }}>
            {selectedLevel.accuracyPercent}%
            <span className="text-sm font-normal text-muted ml-2">{t.quantization.vizRetained}</span>
          </div>
        </div>

        {/* Perplexity */}
        <div className="p-4 rounded-xl bg-surface border border-border col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-sm text-muted mb-2">
            <span className="text-lg">~</span>
            <span>{t.quantization.vizPerplexity}</span>
          </div>
          <div className="text-2xl font-bold text-text">
            +{selectedLevel.perplexityIncrease.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Weight Distribution Visualization */}
      <div className="p-6 rounded-xl bg-surface border border-border">
        <div className="text-sm text-muted mb-4">{t.quantization.vizWeightDist}</div>
        <div className="flex justify-center">
          <svg width={width} height={height} className="overflow-visible">
            {/* Background grid */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#333" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#333" strokeWidth="1" />

            {/* Original distribution (faded) */}
            <motion.path
              d={`M ${originalDistribution.map((val, i) => {
                const x = padding + (i / (originalDistribution.length - 1)) * chartWidth
                const y = height - padding - (val / 0.4) * chartHeight
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')}`}
              fill="none"
              stroke="#555"
              strokeWidth="2"
              strokeDasharray="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Quantized distribution */}
            <motion.path
              d={`M ${quantizedDistribution.map((val, i) => {
                const x = padding + (i / (quantizedDistribution.length - 1)) * chartWidth
                const y = height - padding - (val / 0.4) * chartHeight
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')}`}
              fill="none"
              stroke={selectedLevel.color}
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* X-axis labels */}
            <text x={padding} y={height - 5} className="fill-muted text-xs" textAnchor="middle">-1.0</text>
            <text x={width / 2} y={height - 5} className="fill-muted text-xs" textAnchor="middle">0</text>
            <text x={width - padding} y={height - 5} className="fill-muted text-xs" textAnchor="middle">+1.0</text>
          </svg>
        </div>
        {selectedLevel.discreteLevels && (
          <motion.div
            className="text-center text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-muted">At {selectedLevel.id.toUpperCase()}: Weights quantized to </span>
            <span className="font-semibold" style={{ color: selectedLevel.color }}>
              {selectedLevel.discreteLevels} {t.quantization.vizDiscreteLevel}
            </span>
          </motion.div>
        )}
      </div>

      {/* Explanation Box */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-surface to-surface-elevated border border-border">
        <div className="text-sm text-muted mb-2">{t.quantization.vizExplanation}</div>
        <motion.p
          key={selectedLevel.id}
          className="text-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {explanations[selectedLevel.id]}
        </motion.p>
      </div>

      {/* Bits indicator */}
      <div className="flex justify-center gap-1">
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-6 rounded-sm"
            style={{
              backgroundColor: i < selectedLevel.bits ? selectedLevel.color : '#333',
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.02 }}
          />
        ))}
      </div>
      <div className="text-center text-sm text-muted">
        {selectedLevel.bits} bits per weight
      </div>
    </div>
  )
}
