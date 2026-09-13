'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { DataSourceExplorer } from '@/components/interactive/DataSourceExplorer'
import { useTranslation } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Training data', description: 'Where training examples come from, how they are processed, and what a useful dataset description must disclose.',
    quality: 'Quality is a pipeline decision', qualityBody: 'Deduplication, language coverage, filtering and sampling change what a model learns. Keep a held-out evaluation set, check overlap with training data and evaluate target tasks. A larger corpus is not automatically a better corpus. Aggressive filters can also remove useful dialects, languages or minority viewpoints.',
    synthetic: 'Synthetic data needs its own provenance', syntheticBody: 'Model-generated data can expand instruction, code and reasoning examples. Preserve the generator version, prompts, source material and acceptance criteria. Validate answers with task-specific checks where possible and evaluate diversity and contamination. Repeatedly training on unchecked model outputs can amplify errors or lose coverage; the outcome depends on selection, fresh data and the training setup.',
    rights: 'Access, licences and personal data are separate fields', rightsBody: 'Do not treat public, open, licensed and lawful as interchangeable labels. A dataset can combine components with different conditions. Document acquisition, original licences, opt-outs and personal-data handling. A lawsuit or allegation needs a source and procedural date; it is not itself a final ruling on every training use.',
    regulation: 'EU general-purpose model documentation', regulationBody: 'The AI Act includes obligations for providers of general-purpose AI models, including technical documentation, a copyright-compliance policy and a sufficiently detailed public summary of training content. Scope, exceptions and transition rules depend on the provider and model. This is not limited to high-risk downstream systems. Use the Commission guidelines for the current requirements.',
    checklist: 'What to record before comparing datasets', fields: ['Publisher and exact release or revision', 'Source domains, acquisition and transformations', 'Size, unit, tokenizer and filtering stage', 'Licence conditions and known provenance gaps', 'Split construction, benchmark overlap and evaluation results'],
    source: 'European Commission: guidelines for GPAI providers',
  },
  de: {
    title: 'Trainingsdaten', description: 'Woher Trainingsbeispiele kommen, wie sie verarbeitet werden und was eine brauchbare Datensatzbeschreibung offenlegt.',
    quality: 'Qualität entsteht in der Verarbeitung', qualityBody: 'Deduplizierung, Sprachabdeckung, Filter und Sampling verändern, was ein Modell lernt. Einen getrennten Evaluationssatz halten, Überschneidungen mit Trainingsdaten prüfen und die Zielaufgaben messen. Ein größerer Korpus ist nicht automatisch besser. Strenge Filter können auch nützliche Dialekte, Sprachen oder Minderheitenperspektiven entfernen.',
    synthetic: 'Synthetische Daten brauchen eine Herkunft', syntheticBody: 'Modellerzeugte Daten können Instruktions-, Code- und Reasoning-Beispiele ergänzen. Generatorversion, Prompts, Ausgangsmaterial und Auswahlkriterien festhalten. Antworten möglichst mit aufgabenspezifischen Prüfungen validieren; Vielfalt und Kontamination evaluieren. Wiederholtes Training auf ungeprüften Modellausgaben kann Fehler verstärken oder Abdeckung verlieren. Das Ergebnis hängt von Auswahl, frischen Daten und Trainingsaufbau ab.',
    rights: 'Zugang, Lizenzen und personenbezogene Daten getrennt erfassen', rightsBody: 'Öffentlich, offen, lizenziert und rechtmäßig sind keine austauschbaren Labels. Ein Datensatz kann Komponenten mit unterschiedlichen Bedingungen enthalten. Beschaffung, ursprüngliche Lizenzen, Opt-outs und Umgang mit personenbezogenen Daten dokumentieren. Eine Klage oder Behauptung braucht Quelle und Verfahrensstand; sie ist kein abschließendes Urteil über jede Trainingsnutzung.',
    regulation: 'Dokumentation allgemeiner KI-Modelle in der EU', regulationBody: 'Der AI Act enthält Pflichten für Anbieter von KI-Modellen mit allgemeinem Verwendungszweck (GPAI), darunter technische Dokumentation, eine Strategie zur Einhaltung des Urheberrechts und eine hinreichend detaillierte öffentliche Zusammenfassung der Trainingsinhalte. Anwendungsbereich, Ausnahmen und Übergangsregeln hängen von Anbieter und Modell ab. Die Pflichten betreffen nicht nur nachgelagerte Hochrisikosysteme. Maßgeblich für die aktuelle Einordnung sind die Leitlinien der Kommission.',
    checklist: 'Was ein Datensatzvergleich festhalten sollte', fields: ['Herausgeber und genaue Veröffentlichung oder Revision', 'Quelldomains, Beschaffung und Verarbeitungsschritte', 'Größe, Einheit, Tokenizer und Filterstufe', 'Lizenzbedingungen und bekannte Herkunftslücken', 'Aufteilung, Benchmark-Überschneidung und Evaluationsergebnisse'],
    source: 'Europäische Kommission: Leitlinien für GPAI-Anbieter',
  },
}
export default function TrainingDataPage() {
  const { t, locale } = useTranslation()
  const c = copy[locale === 'de' ? 'de' : 'en']
  return <TopicLayout topicId="training-data" title={c.title} description={c.description} breadcrumbs={[{ label: t.categories.ai, href: '/' }, { label: t.categories.llm, href: '/ai/llm' }, { label: c.title }]}>
    <DataSourceExplorer />
    {[[c.quality, c.qualityBody], [c.synthetic, c.syntheticBody], [c.rights, c.rightsBody]].map(([title, body]) => <section key={title} className="rounded-xl border border-border bg-surface p-6"><h2 className="mb-3 text-xl font-semibold">{title}</h2><p className="leading-relaxed text-muted">{body}</p></section>)}
    <section className="rounded-xl border border-border bg-surface p-6"><h2 className="mb-3 text-xl font-semibold">{c.regulation}</h2><p className="leading-relaxed text-muted">{c.regulationBody}</p><a className="mt-4 inline-block text-cyan-300 underline" href="https://digital-strategy.ec.europa.eu/en/policies/guidelines-gpai-providers">{c.source}</a></section>
    <section><h2 className="mb-3 text-xl font-semibold">{c.checklist}</h2><ul className="list-disc space-y-2 pl-5 text-muted">{c.fields.map(field => <li key={field}>{field}</li>)}</ul></section>
  </TopicLayout>
}
