'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import {
  trainingSet,
  validationSet,
  predictLine,
  mseLine,
  trainLine,
} from '@/lib/learning-math'

export function TrainingProgressVisualizer() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [weights, setWeights] = useState<[number, number]>([-0.5, -0.3]),
    [epoch, setEpoch] = useState(0),
    [rate, setRate] = useState(0.1),
    [decay, setDecay] = useState(0)
  const [history, setHistory] = useState<{ train: number; val: number }[]>([])
  const step = (count: number) => {
    let w = weights
    const next: { train: number; val: number }[] = []
    for (let i = 0; i < count; i++) {
      w = trainLine(w, rate, decay)
      next.push({
        train: mseLine(trainingSet, w),
        val: mseLine(validationSet, w),
      })
    }
    setWeights(w)
    setEpoch((e) => e + count)
    setHistory((h) => [...h, ...next].slice(-100))
  }
  const reset = () => {
    setWeights([-0.5, -0.3])
    setEpoch(0)
    setHistory([])
  }
  const sx = (x: number) => 40 + (x + 1) * 250,
    sy = (y: number) => 230 - (y + 1) * 90
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <h3 className="text-xl text-gradient">{c.trainingTitle}</h3>
      <p className="text-muted text-sm">{c.trainingNote}</p>
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-lg border border-primary px-4 py-2"
          onClick={() => step(1)}
        >
          {c.step}
        </button>
        <button
          className="rounded-lg border border-border px-4 py-2"
          onClick={() => step(10)}
        >
          {c.step} × 10
        </button>
        <button
          className="rounded-lg border border-border px-4 py-2"
          onClick={reset}
        >
          {c.reset}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          {c.rate}: {rate.toFixed(2)}
          <input
            className="w-full"
            aria-label={c.rate}
            type="range"
            min={0.01}
            max={0.3}
            step={0.01}
            value={rate}
            onChange={(e) => {
              setRate(+e.target.value)
              reset()
            }}
          />
        </label>
        <label>
          {c.decay}: {decay.toFixed(2)}
          <input
            className="w-full"
            aria-label={c.decay}
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={decay}
            onChange={(e) => {
              setDecay(+e.target.value)
              reset()
            }}
          />
        </label>
      </div>
      <svg
        viewBox="0 0 580 280"
        className="w-full rounded-xl bg-background"
        role="img"
        aria-label={c.trainingTitle}
      >
        <line x1="40" x2="540" y1={sy(0)} y2={sy(0)} stroke="#64748b" />
        <line x1={sx(0)} x2={sx(0)} y1="25" y2="250" stroke="#64748b" />
        {trainingSet.map((p, i) => (
          <circle
            key={'t' + i}
            cx={sx(p.x)}
            cy={sy(p.y)}
            r="5"
            fill="#38bdf8"
          />
        ))}
        {validationSet.map((p, i) => (
          <rect
            key={'v' + i}
            x={sx(p.x) - 4}
            y={sy(p.y) - 4}
            width="8"
            height="8"
            fill="#fb923c"
          />
        ))}
        <line
          x1={sx(-1)}
          x2={sx(1)}
          y1={sy(predictLine(-1, weights))}
          y2={sy(predictLine(1, weights))}
          stroke="#a78bfa"
          strokeWidth="3"
        />
      </svg>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          {c.epoch}: {epoch}
        </div>
        <div className="font-mono">
          w={weights[0].toFixed(4)}, b={weights[1].toFixed(4)}
        </div>
        <div className="text-sky-400">
          {c.trainLoss}: {mseLine(trainingSet, weights).toFixed(5)}
        </div>
        <div className="text-orange-400">
          {c.valLoss}: {mseLine(validationSet, weights).toFixed(5)}
        </div>
      </dl>
      {history.length > 1 && (
        <svg
          viewBox="0 0 580 150"
          className="w-full bg-background rounded-lg"
          role="img"
          aria-label={c.loss}
        >
          {['train', 'val'].map((key) => (
            <polyline
              key={key}
              fill="none"
              stroke={key === 'train' ? '#38bdf8' : '#fb923c'}
              strokeWidth="2"
              points={history
                .map(
                  (p, i) =>
                    `${20 + (i / (history.length - 1)) * 540},${130 - (p[key as 'train' | 'val'] / Math.max(0.001, ...history.flatMap((v) => [v.train, v.val]))) * 110}`,
                )
                .join(' ')}
            />
          ))}
        </svg>
      )}
      <p className="text-sm text-muted">{c.trainingLimits}</p>
    </div>
  )
}
