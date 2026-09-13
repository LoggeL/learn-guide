'use client'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { maskCandidates, unmaskStep } from '@/lib/learning-math'

export function TextDiffusionDemo() {
  const { t, locale } = useTranslation(),
    c = t.vramCalc.audit
  const words =
    locale === 'de'
      ? [
          'Die',
          'Katze',
          'sitzt',
          'auf',
          'der',
          'warmen',
          'Fensterbank',
          'still',
        ]
      : ['The', 'cat', 'sits', 'on', 'the', 'warm', 'windowsill', 'quietly']
  const [visible, setVisible] = useState<boolean[]>(Array(10).fill(false)),
    [step, setStep] = useState(0)
  const candidates = maskCandidates(visible, words.length)
  const finished = visible.slice(0, words.length).every(Boolean)
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
      <h3 className="text-xl text-gradient">{c.textTitle}</h3>
      <p className="text-sm text-muted">{c.textNote}</p>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`min-w-24 flex-1 rounded-lg border p-3 text-center ${i >= words.length ? 'border-border text-muted' : visible[i] ? 'border-emerald-500 text-emerald-400' : 'border-violet-500 text-violet-300'}`}
          >
            <div className="font-mono">
              {i >= words.length ? '[PAD]' : visible[i] ? words[i] : '[MASK]'}
            </div>
            <div className="mt-2 text-xs">
              {i >= words.length
                ? c.textPad
                : visible[i]
                  ? c.textCommitted
                  : c.textMasked}
            </div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>{c.position}</th>
              <th>{c.textChoice}</th>
              <th>{c.textConfidence}</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((v) => (
              <tr key={v.index} className="border-t border-border">
                <td className="p-2">{v.index + 1}</td>
                <td>{words[v.index]}</td>
                <td className="font-mono">
                  {(v.probability * 100).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button
          disabled={finished}
          className="rounded-lg border border-primary px-4 py-2 disabled:opacity-50"
          onClick={() => {
            setVisible((v) => unmaskStep(v, words.length))
            setStep((s) => s + 1)
          }}
        >
          {c.step} {step + 1}
        </button>
        <button
          className="rounded-lg border border-border px-4 py-2"
          onClick={() => {
            setVisible(Array(10).fill(false))
            setStep(0)
          }}
        >
          {c.reset}
        </button>
      </div>
      <p className="text-sm text-muted">{c.textSampler}</p>
      <a
        href="https://arxiv.org/abs/2406.07524"
        target="_blank"
        rel="noreferrer"
        className="text-primary-light text-sm underline"
      >
        Masked Diffusion Language Models (2024)
      </a>
    </div>
  )
}
