'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { softmax, nucleus, sampleIndex } from '@/lib/learning/decoding'

const colors = ['#a78bfa', '#22d3ee', '#34d399', '#fbbf24', '#fb7185']
const logitsByStep = [[3.2, 2.5, 1.8, 1.1, 0.3], [3.5, 1.3, 0.8, 0.3, -0.5]]

export function NextTokenPredictionVisualizer() {
  const { locale } = useTranslation()
  const de = locale === 'de'
  const [temperature, setTemperature] = useState(1)
  const [topP, setTopP] = useState(0.9)
  const [draw, setDraw] = useState(0.58)
  const [appended, setAppended] = useState<number[]>([])
  const tokens = de ? [' Matte', ' Decke', ' Wiese', ' Treppe', ' Couch'] : [' mat', ' blanket', ' lawn', ' staircase', ' couch']
  const punctuation = ['.', '!', '?', '…', ':']
  const step = Math.min(appended.length, 1)
  const candidates = step === 0 ? tokens : punctuation
  const logits = logitsByStep[step]
  const probabilities = softmax(logits, temperature)
  const filtered = nucleus(probabilities, topP)
  const selected = sampleIndex(filtered, draw)
  const prefix = (de ? 'Die Katze schläft auf der' : 'The cat sleeps on the') +
    (appended.length ? tokens[appended[0]] : '') + (appended.length > 1 ? punctuation[appended[1]] : '')
  let cumulative = 0
  const intervals = filtered.map(p => { const start = cumulative; cumulative += p; return [start, cumulative] })
  const pct = (p: number) => (p * 100).toLocaleString(locale, { maximumFractionDigits: 1 }) + '%'

  return <section className="rounded-2xl border border-border bg-surface/60 p-4 sm:p-6 space-y-6">
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold">{de ? 'Vom Score zum nächsten Token' : 'From score to next token'}</h2>
      <p className="mt-2 text-sm text-muted leading-relaxed">{de
        ? 'Zwei Schritte mit je fünf lesbaren Beispiel-Token und frei gesetzten Logits. Die Wahrscheinlichkeiten werden tatsächlich berechnet. Es läuft kein trainiertes Sprachmodell; die zweite Verteilung ist ebenfalls vorgegeben.'
        : 'Two steps with five readable example tokens and hand-set logits each. Probabilities are calculated here. No trained language model runs; the second distribution is also supplied.'}</p>
    </div>
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs text-muted mb-2">{de ? 'Bisheriger Kontext' : 'Context so far'}</p>
      <p className="text-lg break-words" aria-live="polite">{prefix}<span className="text-primary-light">{appended.length < 2 ? ' ▌' : ''}</span></p>
    </div>
    <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))' }}>
      <label className="text-sm">Temperature T <output className="float-right font-mono">{temperature.toFixed(2)}</output>
        <input aria-label="Temperature T" className="mt-3 w-full" type="range" min="0" max="2" step="0.05" value={temperature} onChange={e => setTemperature(+e.target.value)} />
      </label>
      <label className="text-sm">Top-p <output className="float-right font-mono">{topP.toFixed(2)}</output>
        <input aria-label="Top-p" className="mt-3 w-full" type="range" min="0.05" max="1" step="0.05" value={topP} onChange={e => setTopP(+e.target.value)} />
      </label>
    </div>
    <p className="text-xs text-muted">{temperature === 0
      ? (de ? 'T = 0: Greedy-Auswahl des höchsten Logits.' : 'T = 0: greedy selection of the highest logit.')
      : (de ? 'Softmax: exp(logit / T), geteilt durch die Summe. Top-p behält die wahrscheinlichsten Token bis mindestens p und normiert erneut.' : 'Softmax: exp(logit / T), divided by the sum. Top-p retains the most likely tokens until at least p is reached, then renormalizes.')}</p>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right tabular-nums">
        <caption className="text-left text-muted mb-3">{de ? `Schritt ${step + 1}: Logits → Softmax → Top-p` : `Step ${step + 1}: logits → softmax → top-p`}</caption>
        <thead className="text-muted"><tr><th className="py-2 text-left">Token</th><th>Logit</th><th className="px-2">Softmax</th><th>Top-p</th></tr></thead>
        <tbody>{candidates.map((token, i) => <tr key={token} className="border-t border-border">
          <th className="py-3 text-left font-medium"><span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: colors[i] }} />{token}</th>
          <td>{logits[i].toFixed(1)}</td><td className="px-2">{pct(probabilities[i])}</td><td className={filtered[i] ? 'text-text' : 'text-muted'}>{pct(filtered[i])}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <div className="space-y-3">
      <h3 className="font-semibold">{de ? 'Aus einer gemeinsamen Verteilung ziehen' : 'Draw from one cumulative distribution'}</h3>
      <p className="text-sm text-muted">{de ? 'u ist eine Zahl zwischen 0 und 1. Das Intervall, in das u fällt, bestimmt das Token. Du kannst dieselbe Zahl für Vergleiche behalten oder neu ziehen.' : 'u is a number between 0 and 1. The interval containing u determines the token. Keep the same draw for comparisons or draw again.'}</p>
      <div className="relative pt-5 pb-6" aria-label={de ? 'Kumulative Wahrscheinlichkeiten' : 'Cumulative probabilities'}>
        <div className="flex h-10 overflow-hidden rounded-lg">{filtered.map((p, i) => <div key={i} style={{ width: `${p * 100}%`, background: colors[i] }} title={`${candidates[i]}: [${intervals[i][0].toFixed(3)}, ${intervals[i][1].toFixed(3)})`} />)}</div>
        <div className="absolute top-3 bottom-5 border-l-2 border-white" style={{ left: `${draw * 100}%` }}><span className="absolute -top-4 -translate-x-1/2 text-xs">u</span></div>
        <span className="absolute bottom-0 left-0 text-xs text-muted">0</span><span className="absolute bottom-0 right-0 text-xs text-muted">1</span>
      </div>
      <label className="block text-sm">{de ? 'Zufallszahl u' : 'Random draw u'}: <output className="font-mono">{draw.toFixed(3)}</output>
        <input aria-label={de ? 'Zufallszahl u' : 'Random draw u'} className="w-full mt-2" type="range" min="0" max="0.999" step="0.001" value={draw} onChange={e => setDraw(+e.target.value)} />
      </label>
      <p className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm" aria-live="polite">{de ? 'Auswahl' : 'Selection'}: <strong>{candidates[selected]}</strong> · {de ? 'Intervall (Grenzen gerundet)' : 'Interval (rounded endpoints)'} ≈ [{intervals[selected][0].toFixed(3)}, {intervals[selected][1].toFixed(3)})</p>
    </div>
    <div className="flex flex-wrap gap-3">
      <button type="button" className="rounded-lg border border-border px-4 py-2 min-h-11" onClick={() => setDraw(Math.floor(Math.random() * 1000) / 1000)}>{de ? 'Neu ziehen' : 'Draw again'}</button>
      <button type="button" disabled={appended.length === 2} className="rounded-lg bg-primary/20 border border-primary/40 px-4 py-2 min-h-11 disabled:opacity-40" onClick={() => setAppended([...appended, selected])}>{de ? 'Token anhängen' : 'Append token'}</button>
      <button type="button" className="rounded-lg border border-border px-4 py-2 min-h-11" onClick={() => { setAppended([]); setDraw(0.58) }}>{de ? 'Von vorn' : 'Restart'}</button>
    </div>
  </section>
}
