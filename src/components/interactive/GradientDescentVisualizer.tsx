'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, TrendingDown } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

// Simple 2D loss function: f(x) = x^4 - 2x^2 + x (has local and global minima)
function lossFunction(x: number): number {
  return Math.pow(x, 4) - 2 * Math.pow(x, 2) + 0.5 * x + 2
}

// Derivative of loss function
function gradientFunction(x: number): number {
  return 4 * Math.pow(x, 3) - 4 * x + 0.5
}

export function GradientDescentVisualizer() {
  const { t } = useTranslation()
  const [position, setPosition] = useState(1.8)
  const [learningRate, setLearningRate] = useState(0.1)
  const [isRunning, setIsRunning] = useState(false)
  const [history, setHistory] = useState<{ x: number; y: number }[]>([])
  const [iterations, setIterations] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentLoss = lossFunction(position)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setPosition((prev) => {
          const gradient = gradientFunction(prev)
          const newPos = prev - learningRate * gradient

          // Clamp to visible range
          const clampedPos = Math.max(-2, Math.min(2, newPos))

          setHistory((h) => [...h, { x: clampedPos, y: lossFunction(clampedPos) }])
          setIterations((i) => i + 1)

          // Stop if gradient is very small (converged)
          if (Math.abs(gradient) < 0.01 || iterations > 100) {
            setIsRunning(false)
          }

          return clampedPos
        })
      }, 200)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, learningRate, iterations])

  const reset = () => {
    setIsRunning(false)
    setPosition(1.8)
    setHistory([])
    setIterations(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const toggleRun = () => {
    setIsRunning(!isRunning)
  }

  // Generate points for the loss curve
  const curvePoints: { x: number; y: number }[] = []
  for (let x = -2; x <= 2; x += 0.1) {
    curvePoints.push({ x, y: lossFunction(x) })
  }

  // SVG dimensions and scaling
  const width = 500
  const height = 300
  const padding = 40

  const xScale = (x: number) => padding + ((x + 2) / 4) * (width - 2 * padding)
  const yScale = (y: number) => height - padding - ((y - 0) / 5) * (height - 2 * padding)

  // Generate path for the curve
  const pathD = curvePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`)
    .join(' ')

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <TrendingDown size={18} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">Gradient Descent</h3>
              <p className="text-xs text-muted">Optimizing a 2D loss function</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-muted hover:text-text transition-colors"
            >
              <RotateCcw size={14} />
              {t.interactive.resetDescent}
            </button>
            <button
              onClick={toggleRun}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isRunning
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              }`}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
              {isRunning ? t.interactive.pauseDescent : t.interactive.startDescent}
            </button>
          </div>
        </div>

        {/* Learning Rate Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm text-muted">{t.interactive.learningRate}</label>
            <span className="text-sm font-mono font-bold text-primary-light">{learningRate.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.3"
            step="0.01"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            disabled={isRunning}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted">
            <span>0.01 (slow)</span>
            <span>0.3 (fast)</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={iterations}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-bold text-gradient"
          >
            {iterations}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.iterations}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={currentLoss.toFixed(2)}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-bold text-cyan-400"
          >
            {currentLoss.toFixed(2)}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.currentLoss}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={position.toFixed(2)}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-bold text-purple-400"
          >
            {position.toFixed(2)}
          </motion.div>
          <p className="text-xs text-muted mt-1">Position (x)</p>
        </div>
      </div>

      {/* Visualization */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="relative w-full overflow-x-auto">
          <svg width={width} height={height} className="mx-auto bg-background rounded-xl">
            {/* Grid */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#333" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#grid)" />

            {/* Axes */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#666" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#666" strokeWidth="1" />

            {/* Loss curve */}
            <path d={pathD} fill="none" stroke="#a78bfa" strokeWidth="2" />

            {/* History trail */}
            {history.map((point, i) => (
              <motion.circle
                key={i}
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                r={3}
                fill="#22c55e"
                opacity={0.3 + (i / history.length) * 0.5}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            ))}

            {/* Current position */}
            <motion.circle
              cx={xScale(position)}
              cy={yScale(currentLoss)}
              r={10}
              fill="#ef4444"
              stroke="#fff"
              strokeWidth="2"
              animate={{
                cx: xScale(position),
                cy: yScale(currentLoss),
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            />

            {/* Global minimum marker */}
            <circle cx={xScale(-1.1)} cy={yScale(lossFunction(-1.1))} r={5} fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4" />
            <text x={xScale(-1.1)} y={yScale(lossFunction(-1.1)) - 15} textAnchor="middle" className="text-[10px] fill-green-400">
              {t.interactive.globalMinimum}
            </text>

            {/* Local minimum marker */}
            <circle cx={xScale(1.0)} cy={yScale(lossFunction(1.0))} r={5} fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="4" />
            <text x={xScale(1.0)} y={yScale(lossFunction(1.0)) - 15} textAnchor="middle" className="text-[10px] fill-yellow-400">
              {t.interactive.localMinimum}
            </text>
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <TrendingDown size={18} className="text-primary-light shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p>The red ball follows the gradient (slope) downhill. A higher learning rate takes bigger steps but may overshoot. Starting position determines whether you reach the global or local minimum.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
