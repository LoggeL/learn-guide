'use client'

import { useId, useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'

export type EvaluationRating = 'unrated' | 'pass' | 'fail'
export interface EvaluationAttempt {
  answer: string
  ratings: [EvaluationRating, EvaluationRating, EvaluationRating]
  note: string
}

export function summarizeEvaluation(attempts: readonly EvaluationAttempt[]) {
  const evaluated = attempts.filter(attempt =>
    attempt.answer.trim().length > 0 && attempt.ratings.length === 3 &&
    attempt.ratings.every(rating => rating === 'pass' || rating === 'fail')
  )
  const successful = evaluated.filter(attempt => attempt.ratings.every(rating => rating === 'pass')).length
  return {
    evaluated: evaluated.length,
    successful,
    open: attempts.length - evaluated.length,
    successRate: evaluated.length === 0 ? null : successful / evaluated.length,
  }
}

export function replaceEvaluationAnswer(attempt: EvaluationAttempt, answer: string): EvaluationAttempt {
  return { ...attempt, answer, ratings: ['unrated', 'unrated', 'unrated'], note: '' }
}

function emptyAttempt(): EvaluationAttempt {
  return { answer: '', ratings: ['unrated', 'unrated', 'unrated'], note: '' }
}

export function MiniEvaluationDemo() {
  const { locale } = useTranslation()
  const id = useId()
  const [model, setModel] = useState('')
  const [settings, setSettings] = useState('')
  const [attempts, setAttempts] = useState<EvaluationAttempt[]>(() => Array.from({ length: 3 }, emptyAttempt))
  const c = locale === 'de' ? {
    title: 'Mini-Evaluation: drei Versuche mit derselben Rubrik',
    intro: 'Führe die unten stehende Aufgabe dreimal selbst mit einem Modell aus, füge die Antworten ein und bewerte jedes Kriterium. Hier werden keine Modellaufrufe ausgeführt oder Antworten vorgegeben.',
    protocol: 'Nutze dieselbe Modellversion, denselben Prompt und dieselben Einstellungen, jeweils in einem neuen Gespräch ohne frühere Antworten. Halte auch Systemanweisungen, verfügbare Tools, Temperatur und gegebenenfalls Seed fest. Wähle nicht nur die besten Antworten aus. Für einen Modellvergleich beginnst du eine neue Versuchsreihe.',
    model: 'Modell und genaue Version',
    settings: 'Testdatum und gemeinsame Einstellungen',
    settingsHint: 'Unbekannte Einstellungen als unbekannt notieren. Die drei Wiederholungen zeigen nur Schwankungen bei dieser einen Aufgabe; sie messen keine allgemeine Modellqualität.',
    prompt: 'Identischer Prompt für jeden Versuch',
    source: 'Fiktiver Quelltext für diese Übung:',
    sourceOne: '[Q1] Der Workshop Orion beginnt am Dienstag um 09:30 Uhr, dauert 90 Minuten und hat sechs Teilnehmende.',
    sourceTwo: '[Q2] Raum B12 hat acht Sitzplätze und einen Beamer. Raum C4 hat vier Sitzplätze und keinen Beamer.',
    task: 'Wähle einen Raum mit Beamer, der alle Teilnehmenden aufnehmen kann. Antworte mit genau zwei Stichpunkten: (1) Raum und Begründung mit Quellenkürzel; (2) Wochentag, Beginn und berechnetes Ende mit Quellenkürzel. Verwende nur den Quelltext.',
    rubric: 'Vor dem Test festgelegte Rubrik',
    criteria: [
      'Raum: B12 wird gewählt; acht Plätze für sechs Personen und der Beamer werden korrekt als Begründung genannt.',
      'Zeit: Dienstag, Beginn 09:30 Uhr und berechnetes Ende 11:00 Uhr sind korrekt.',
      'Quellentreue und Format: genau zwei Stichpunkte, passende Belege [Q1] und [Q2] bei den Aussagen und keine unbelegten Zusatzbehauptungen.',
    ],
    rule: 'Ein Versuch ist erfolgreich, wenn alle drei Kriterien erfüllt sind. Die Bewertung erfolgt durch dich; gleichbedeutende Formulierungen sind erlaubt. Erst mit einer Antwort und drei Bewertungen zählt ein Versuch in der Erfolgsquote.',
    attempt: 'Versuch',
    answer: 'Tatsächliche Modellantwort',
    changes: 'Eine Änderung der Antwort setzt ihre Bewertungen und Bewertungsnotiz zurück.',
    pass: 'Erfüllt',
    fail: 'Nicht erfüllt',
    unrated: 'Noch nicht bewertet',
    note: 'Begründung der Bewertung (optional)',
    empty: 'Antwort fehlt',
    pending: 'Bewertung offen',
    success: 'Erfolgreich',
    failed: 'Nicht erfolgreich',
    evaluated: 'Vollständig bewertet',
    successful: 'Erfolgreiche Versuche',
    rate: 'Erfolgsquote',
    noRate: 'Noch nicht berechenbar',
    denominator: 'Erfolgreiche / vollständig bewertete Versuche',
    open: 'Offene Versuche',
    excluded: 'Offene Versuche werden nicht als Misserfolge gezählt.',
    storage: 'Dieses Bewertungsblatt bleibt nur in der geöffneten Ansicht erhalten. Sichere deine Antworten und Notizen, bevor du die Seite verlässt oder neu lädst.',
  } : {
    title: 'Mini evaluation: three attempts with the same rubric',
    intro: 'Run the task below with a model three times yourself, paste the answers and assess each criterion. This worksheet does not call a model or provide model answers.',
    protocol: 'Use the same model version, prompt and settings, starting a fresh conversation without earlier answers each time. Record system instructions, available tools, temperature and a seed if applicable. Do not select only the best answers. Start a separate series when comparing another model.',
    model: 'Model and exact version',
    settings: 'Test date and shared settings',
    settingsHint: 'Mark unknown settings as unknown. These three repetitions only show variation on this one task; they do not measure general model quality.',
    prompt: 'Identical prompt for each attempt',
    source: 'Fictional source text for this exercise:',
    sourceOne: '[Q1] Workshop Orion starts on Tuesday at 09:30, lasts 90 minutes and has six participants.',
    sourceTwo: '[Q2] Room B12 has eight seats and a projector. Room C4 has four seats and no projector.',
    task: 'Choose a room with a projector that can accommodate everyone. Respond with exactly two bullet points: (1) the room and justification with source labels; (2) the weekday, start and calculated end time with source labels. Use only the source text.',
    rubric: 'Rubric defined before the test',
    criteria: [
      'Room: B12 is selected, correctly justified by eight seats for six participants and the projector.',
      'Time: Tuesday, a 09:30 start and the calculated 11:00 end are correct.',
      'Sources and format: exactly two bullet points, appropriate [Q1] and [Q2] references alongside the claims, and no unsupported additions.',
    ],
    rule: 'An attempt succeeds when all three criteria are met. You provide the judgments; equivalent wording is allowed. Only an answer with all three criteria rated enters the success rate.',
    attempt: 'Attempt',
    answer: 'Actual model answer',
    changes: 'Changing an answer clears its ratings and evaluation note.',
    pass: 'Met',
    fail: 'Not met',
    unrated: 'Not yet rated',
    note: 'Reason for your judgment (optional)',
    empty: 'Answer missing',
    pending: 'Evaluation open',
    success: 'Successful',
    failed: 'Unsuccessful',
    evaluated: 'Fully evaluated',
    successful: 'Successful attempts',
    rate: 'Success rate',
    noRate: 'Not yet available',
    denominator: 'Successful / fully evaluated attempts',
    open: 'Open attempts',
    excluded: 'Open attempts do not count as failures.',
    storage: 'This worksheet is kept only in the current view. Save your answers and notes before leaving or reloading the page.',
  }
  const summary = summarizeEvaluation(attempts)
  const prompt = [c.source, c.sourceOne, c.sourceTwo, '', c.task].join('\n')

  function updateAttempt(index: number, update: (attempt: EvaluationAttempt) => EvaluationAttempt) {
    setAttempts(previous => previous.map((attempt, current) => current === index ? update(attempt) : attempt))
  }

  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-5 md:p-8 space-y-6" aria-labelledby={`${id}-title`}>
      <div className="space-y-3">
        <h2 id={`${id}-title`} className="text-2xl font-bold font-heading text-gradient">{c.title}</h2>
        <p className="text-muted">{c.intro}</p>
        <p className="text-sm text-muted">{c.protocol}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor={`${id}-model`} className="block font-medium mb-2">{c.model}</label>
          <input id={`${id}-model`} value={model} onChange={event => setModel(event.target.value)} className="w-full rounded-lg border border-border bg-background p-3 text-text" />
        </div>
        <div>
          <label htmlFor={`${id}-settings`} className="block font-medium mb-2">{c.settings}</label>
          <textarea id={`${id}-settings`} value={settings} onChange={event => setSettings(event.target.value)} rows={3} aria-describedby={`${id}-settings-hint`} className="w-full rounded-lg border border-border bg-background p-3 text-text" />
          <p id={`${id}-settings-hint`} className="text-sm text-muted mt-2">{c.settingsHint}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">{c.prompt}</h3>
        <pre className="whitespace-pre-wrap break-words rounded-xl border border-border bg-background p-4 text-sm leading-relaxed">{prompt}</pre>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{c.rubric}</h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-muted">
          {c.criteria.map(criterion => <li key={criterion}>{criterion}</li>)}
        </ol>
        <p className="text-sm text-muted">{c.rule}</p>
      </div>

      <div className="space-y-5">
        {attempts.map((attempt, index) => {
          const result = summarizeEvaluation([attempt])
          const status = !attempt.answer.trim() ? c.empty : result.evaluated === 0 ? c.pending : result.successful ? c.success : c.failed
          return (
            <fieldset key={index} className="min-w-0 rounded-xl border border-border bg-background p-4 space-y-4">
              <legend className="px-2 font-semibold">{c.attempt} {index + 1}</legend>
              <p className="text-sm font-medium" aria-live="polite">{status}</p>
              <div>
                <label htmlFor={`${id}-answer-${index}`} className="block text-sm font-medium mb-2">{c.answer}</label>
                <textarea id={`${id}-answer-${index}`} rows={5} value={attempt.answer} onChange={event => updateAttempt(index, current => replaceEvaluationAnswer(current, event.target.value))} aria-describedby={`${id}-changes-${index}`} className="w-full rounded-lg border border-border bg-surface p-3 text-text" />
                <p id={`${id}-changes-${index}`} className="text-xs text-muted mt-2">{c.changes}</p>
              </div>
              {c.criteria.map((criterion, criterionIndex) => (
                <div key={criterion}>
                  <label htmlFor={`${id}-rating-${index}-${criterionIndex}`} className="block text-sm mb-2">{criterion}</label>
                  <select id={`${id}-rating-${index}-${criterionIndex}`} value={attempt.ratings[criterionIndex]} disabled={!attempt.answer.trim()} onChange={event => {
                    const rating = event.target.value as EvaluationRating
                    updateAttempt(index, current => {
                      const ratings: EvaluationAttempt['ratings'] = [...current.ratings]
                      ratings[criterionIndex] = rating
                      return { ...current, ratings }
                    })
                  }} className="w-full sm:w-auto rounded-lg border border-border bg-surface p-2 text-text disabled:opacity-50">
                    <option value="unrated">{c.unrated}</option>
                    <option value="pass">{c.pass}</option>
                    <option value="fail">{c.fail}</option>
                  </select>
                </div>
              ))}
              <div>
                <label htmlFor={`${id}-note-${index}`} className="block text-sm mb-2">{c.note}</label>
                <textarea id={`${id}-note-${index}`} value={attempt.note} rows={2} onChange={event => updateAttempt(index, current => ({ ...current, note: event.target.value }))} className="w-full rounded-lg border border-border bg-surface p-3 text-text" />
              </div>
            </fieldset>
          )
        })}
      </div>

      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-3" aria-live="polite" aria-atomic="true">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div><dt className="text-sm text-muted">{c.evaluated}</dt><dd className="text-2xl font-semibold">{summary.evaluated} / {attempts.length}</dd></div>
          <div><dt className="text-sm text-muted">{c.successful}</dt><dd className="text-2xl font-semibold">{summary.successful}</dd></div>
          <div><dt className="text-sm text-muted">{c.rate}</dt><dd className="text-2xl font-semibold">{summary.successRate === null ? c.noRate : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(summary.successRate)}</dd></div>
        </dl>
        <p className="text-sm text-muted">{c.denominator}: {summary.successful} / {summary.evaluated}. {c.open}: {summary.open}. {c.excluded}</p>
      </div>
      <p className="text-xs text-muted">{c.storage}</p>
    </section>
  )
}
