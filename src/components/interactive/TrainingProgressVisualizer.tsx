'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Square, RotateCcw, Activity, AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface DataPoint {
  epoch: number
  trainLoss: number
  valLoss: number
  accuracy: number
}

export function TrainingProgressVisualizer() {
  const { t } = useTranslation()
  const [isTraining, setIsTraining] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [data, setData] = useState<DataPoint[]>([])
  const [overfitting, setOverfitting] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const maxEpochs = 50
  const currentData = data[data.length - 1]

  useEffect(() => {
    if (isTraining && epoch < maxEpochs) {
      intervalRef.current = setInterval(() => {
        setEpoch((e) => {
          const newEpoch = e + 1

          // Simulate training dynamics
          const trainLoss = 2 * Math.exp(-0.1 * newEpoch) + 0.1 + Math.random() * 0.05
          const valLoss =
            newEpoch < 25
              ? 2 * Math.exp(-0.08 * newEpoch) + 0.15 + Math.random() * 0.08
              : 0.4 + 0.02 * (newEpoch - 25) + Math.random() * 0.1 // Starts increasing (overfitting)
          const accuracy = Math.min(0.95, 0.5 + 0.4 * (1 - Math.exp(-0.1 * newEpoch)) + Math.random() * 0.02)

          const newPoint: DataPoint = {
            epoch: newEpoch,
            trainLoss,
            valLoss,
            accuracy,
          }

          setData((prev) => [...prev, newPoint])

          // Detect overfitting
          if (newEpoch > 25 && valLoss > trainLoss * 1.5) {
            setOverfitting(true)
          }

          if (newEpoch >= maxEpochs) {
            setIsTraining(false)
          }

          return newEpoch
        })
      }, 200)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTraining, epoch])

  const reset = () => {
    setIsTraining(false)
    setEpoch(0)
    setData([])
    setOverfitting(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const toggleTraining = () => {
    if (epoch >= maxEpochs) {
      reset()
    } else {
      setIsTraining(!isTraining)
    }
  }

  // SVG dimensions
  const width = 500
  const height = 200
  const padding = 40

  const xScale = (e: number) => padding + (e / maxEpochs) * (width - 2 * padding)
  const yScaleLoss = (loss: number) => height - padding - (loss / 2.5) * (height - 2 * padding)
  const yScaleAcc = (acc: number) => height - padding - acc * (height - 2 * padding)

  // Generate paths
  const trainPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.epoch)} ${yScaleLoss(d.trainLoss)}`).join(' ')
  const valPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.epoch)} ${yScaleLoss(d.valLoss)}`).join(' ')
  const accPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.epoch)} ${yScaleAcc(d.accuracy)}`).join(' ')

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
              <Activity size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">Training Progress</h3>
              <p className="text-xs text-muted">Watch a neural network learn</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-muted hover:text-text transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={toggleTraining}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isTraining
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              }`}
            >
              {isTraining ? <Square size={14} /> : <Play size={14} />}
              {isTraining ? t.interactive.stopTraining : t.interactive.startTraining}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">{t.interactive.epoch}</span>
            <span className="font-mono font-bold text-text">{epoch} / {maxEpochs}</span>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(epoch / maxEpochs) * 100}%` }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={epoch}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-mono font-bold text-gradient"
          >
            {epoch}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.epoch}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={currentData?.trainLoss?.toFixed(3)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-mono font-bold text-cyan-400"
          >
            {currentData?.trainLoss?.toFixed(3) || '—'}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.trainingLoss}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={currentData?.valLoss?.toFixed(3)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-mono font-bold ${overfitting ? 'text-red-400' : 'text-purple-400'}`}
          >
            {currentData?.valLoss?.toFixed(3) || '—'}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.validationLoss}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={currentData?.accuracy?.toFixed(1)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-mono font-bold text-emerald-400"
          >
            {currentData ? `${(currentData.accuracy * 100).toFixed(1)}%` : '—'}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.accuracy}</p>
        </div>
      </div>

      {/* Overfitting Warning */}
      {overfitting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex items-center gap-3"
        >
          <AlertTriangle size={20} className="text-red-400 shrink-0" />
          <div>
            <p className="font-semibold text-red-400">{t.interactive.overfitting}</p>
            <p className="text-sm text-muted">Validation loss is increasing while training loss decreases.</p>
          </div>
        </motion.div>
      )}

      {/* Loss Chart */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <h4 className="text-sm font-semibold text-text mb-4">Loss Over Time</h4>
        <div className="relative w-full overflow-x-auto">
          <svg width={width} height={height} className="mx-auto bg-background rounded-xl">
            {/* Grid */}
            <defs>
              <pattern id="traingrid" width="50" height="40" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 40" fill="none" stroke="#333" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#traingrid)" />

            {/* Axes */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#666" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#666" strokeWidth="1" />

            {/* Training loss */}
            {trainPath && <path d={trainPath} fill="none" stroke="#22d3ee" strokeWidth="2" />}

            {/* Validation loss */}
            {valPath && (
              <path
                d={valPath}
                fill="none"
                stroke={overfitting ? '#ef4444' : '#a78bfa'}
                strokeWidth="2"
                strokeDasharray={overfitting ? '4 4' : undefined}
              />
            )}

            {/* Legend */}
            <circle cx={width - 120} cy={20} r={4} fill="#22d3ee" />
            <text x={width - 110} y={24} className="text-xs sm:text-[10px] fill-gray-400">Train Loss</text>
            <circle cx={width - 120} cy={38} r={4} fill={overfitting ? '#ef4444' : '#a78bfa'} />
            <text x={width - 110} y={42} className="text-xs sm:text-[10px] fill-gray-400">Val Loss</text>
          </svg>
        </div>
      </div>

      {/* Accuracy Chart */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <h4 className="text-sm font-semibold text-text mb-4">Accuracy Over Time</h4>
        <div className="relative w-full overflow-x-auto">
          <svg width={width} height={height} className="mx-auto bg-background rounded-xl">
            <rect width={width} height={height} fill="url(#traingrid)" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#666" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#666" strokeWidth="1" />

            {/* Accuracy */}
            {accPath && <path d={accPath} fill="none" stroke="#22c55e" strokeWidth="2" />}

            {/* Y-axis labels */}
            <text x={padding - 5} y={height - padding + 4} textAnchor="end" className="text-xs sm:text-[10px] fill-gray-400">0%</text>
            <text x={padding - 5} y={padding + 4} textAnchor="end" className="text-xs sm:text-[10px] fill-gray-400">100%</text>
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <Activity size={18} className="text-primary-light shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p>Watch for the gap between training and validation loss. When validation loss starts increasing while training loss decreases, the model is overfitting—memorizing training data instead of learning generalizable patterns.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
