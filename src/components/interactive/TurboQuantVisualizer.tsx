'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { rotatePair, quantizeVector } from '@/lib/learning-math'

export function TurboQuantVisualizer() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  const [angle, setAngle] = useState(30),
    [bits, setBits] = useState(4)
  const original = [0.82, -0.41, 0.67, -0.23]
  const rotated = rotatePair(original, (angle * Math.PI) / 180)
  const q = quantizeVector(rotated, bits)
  const restored = rotatePair(q.restored, (-angle * Math.PI) / 180)
  const norm = (v: number[]) => v.reduce((s, x) => s + x * x, 0)
  const mse = restored.reduce((s, x, i) => s + (x - original[i]) ** 2, 0) / 4
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <h3 className="text-xl text-gradient">{c.quantTitle}</h3>
      <p className="text-sm text-muted">{c.quantToy}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          {c.angle}: {angle}°
          <input
            aria-label={c.angle}
            className="w-full"
            type="range"
            min={0}
            max={90}
            value={angle}
            onChange={(e) => setAngle(+e.target.value)}
          />
        </label>
        <label>
          {c.bits}: {bits}
          <input
            aria-label={c.bits}
            className="w-full"
            type="range"
            min={2}
            max={8}
            value={bits}
            onChange={(e) => setBits(+e.target.value)}
          />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">{c.example}</th>
              <th className="text-right">{c.norm}</th>
            </tr>
          </thead>
          <tbody>
            {[
              [c.original, original],
              [c.angle, rotated],
              [c.reconstructed, restored],
            ].map(([label, v]) => (
              <tr key={String(label)} className="border-t border-border">
                <td className="p-3">
                  <div>{String(label)}</div>
                  <code>
                    {(v as number[]).map((n) => n.toFixed(4)).join(', ')}
                  </code>
                </td>
                <td className="p-3 text-right font-mono">
                  {norm(v as number[]).toFixed(6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          {c.baseline}: <strong>64 bits</strong>
        </div>
        <div>
          {c.quantStorage}: <strong>{q.storageBits} bits</strong> (4 × {bits} +
          32)
        </div>
        <div>
          {c.scale}: {q.scale.toFixed(4)}
        </div>
        <div>
          {c.error} (MSE): <strong>{mse.toExponential(3)}</strong>
        </div>
      </div>
      <p className="font-mono">
        64 / {q.storageBits} = {(64 / q.storageBits).toFixed(2)}×
      </p>
      <p className="text-sm text-muted">{c.quantLimit}</p>
      <a
        className="text-sm text-primary-light underline"
        href="https://arxiv.org/abs/2504.19874"
        target="_blank"
        rel="noreferrer"
      >
        TurboQuant (2025)
      </a>
    </div>
  )
}
