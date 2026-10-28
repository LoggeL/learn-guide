'use client'

import { useTranslation } from '@/lib/i18n/context'
import {
  chipSpecs,
  CHIP_SPECS_AS_OF,
  ridgePoint,
  type ChipSpec,
} from '@/lib/chip-specs'

export function ChipSpecTable() {
  const { t, locale } = useTranslation()
  const c = t.customChips
  const nf = (v: number, digits = 0) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(v)
  const notes = c.chipNotes as Partial<Record<ChipSpec['id'], string>>

  const memory = (chip: ChipSpec) =>
    chip.memoryGB < 1
      ? `${nf(chip.memoryGB * 1000)} MB ${chip.memoryType}`
      : `${nf(chip.memoryGB)} ${chip.gib ? 'GiB' : 'GB'} ${chip.memoryType}`
  const bandwidth = (chip: ChipSpec) =>
    chip.bandwidthTBs >= 1000
      ? `${nf(chip.bandwidthTBs / 1000)} PB/s`
      : `${nf(chip.bandwidthTBs, 2)} TB/s`
  const flops = (chip: ChipSpec, v: number | null) =>
    v === null
      ? c.notDisclosed
      : `${chip.atLeast ? '> ' : ''}${nf(v)}${chip.derived ? '*' : ''}`

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">
          {c.tableTitle}
        </h2>
        <p className="text-muted leading-relaxed">
          {c.tableDesc.replace('{date}', CHIP_SPECS_AS_OF)}
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[56rem] text-sm">
          <thead className="bg-background/60 text-left">
            <tr className="text-muted">
              <th className="p-3 font-semibold">{c.colChip}</th>
              <th className="p-3 font-semibold">{c.colAnnounced}</th>
              <th className="p-3 font-semibold">{c.colMemory}</th>
              <th className="p-3 font-semibold text-right">{c.colBandwidth}</th>
              <th className="p-3 font-semibold text-right">{c.colFp8}</th>
              <th className="p-3 font-semibold text-right">{c.colBf16}</th>
              <th className="p-3 font-semibold text-right">{c.colRidge}</th>
              <th className="p-3 font-semibold">{c.colSource}</th>
            </tr>
          </thead>
          <tbody>
            {chipSpecs.map((chip, i) => (
              <tr
                key={chip.id}
                className={`border-t border-border align-top ${i % 2 ? 'bg-background/30' : ''}`}
              >
                <td className="p-3">
                  <div className="font-semibold text-text">{chip.name}</div>
                  <div className="text-xs text-muted">{chip.vendor}</div>
                  {notes[chip.id] && (
                    <div className="text-xs text-muted mt-1 max-w-[16rem]">
                      {notes[chip.id]}
                    </div>
                  )}
                </td>
                <td className="p-3 text-muted font-mono">
                  {chip.announced ?? c.notDisclosed}
                </td>
                <td className="p-3 text-text whitespace-nowrap">
                  {memory(chip)}
                </td>
                <td className="p-3 text-right font-mono text-text whitespace-nowrap">
                  {bandwidth(chip)}
                </td>
                <td className="p-3 text-right font-mono text-text">
                  {flops(chip, chip.fp8DenseTF)}
                </td>
                <td className="p-3 text-right font-mono text-text">
                  {flops(chip, chip.bf16DenseTF)}
                </td>
                <td className="p-3 text-right font-mono text-cyan-400">
                  {chip.fp8DenseTF !== null && chip.memoryType !== 'SRAM'
                    ? nf(ridgePoint(chip.fp8DenseTF, chip.bandwidthTBs))
                    : c.notDisclosed}
                </td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    {chip.sources.map((url, n) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-light hover:underline text-xs"
                      >
                        {c.sourceLink.replace('{n}', String(n + 1))}
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="text-xs text-muted space-y-1">
        <li>{c.footDerived}</li>
        <li>{c.footSparsity}</li>
        <li>{c.footSram}</li>
      </ul>
    </div>
  )
}
