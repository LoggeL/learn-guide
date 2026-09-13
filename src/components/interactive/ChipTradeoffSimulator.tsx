'use client'
import { useTranslation } from '@/lib/i18n/context'
export function ChipTradeoffSimulator() {
  const { t } = useTranslation(),
    c = t.vramCalc.audit
  return (
    <div className="space-y-5">
      <h3 className="text-xl text-gradient">{c.chipTitle}</h3>
      <p className="text-muted text-sm">{c.chipNote}</p>
      <ol className="grid gap-3 sm:grid-cols-2">
        {[
          c.chipMemory,
          c.chipOperators,
          c.chipLatency,
          c.chipEnergy,
          c.chipCosts,
        ].map((question, i) => (
          <li key={question} className="rounded-xl border border-border p-4">
            <span className="text-primary-light">{i + 1}. </span>
            {question}
          </li>
        ))}
      </ol>
      <div className="space-y-3">
        {[
          ['GPU', c.chipGpu],
          ['TPU', c.chipTpu],
          ['NPU', c.chipNpu],
          ['ASIC', c.chipAsic],
          ['FPGA', c.chipFpga],
        ].map(([name, note]) => (
          <details
            key={name}
            className="rounded-lg border border-border bg-background p-4"
          >
            <summary className="cursor-pointer font-semibold">{name}</summary>
            <p className="mt-3 text-sm text-muted">{note}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
