'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { ScaleCalculator } from '@/components/interactive/ScaleCalculator'
import { useTranslation } from '@/lib/i18n/context'

const measured = [['LongChat-13B (16K)',35,83.4],['MPT-30B-Instruct',31.5,81.9],['GPT-3.5-Turbo (0613)',56.1,88.3],['Claude-1.3',48.3,76.1]] as const

export default function ContextRotPage() {
  const { t,locale }=useTranslation()
  const de=locale==='de'
  const title='Context Rot'
  return <TopicLayout topicId="context-rot" title={title} description={de ? 'Wie Länge, Position und Ablenkungen die Nutzung von Kontext beeinflussen können.' : 'How length, position and distractors can affect the use of context.'} breadcrumbs={[{label:t.categories.ai,href:'/'},{label:t.categories.llm,href:'/ai/llm'},{label:title}]}>
    <section className="rounded-2xl border border-border p-5 sm:p-7 space-y-4">
      <h2 className="text-2xl font-semibold">{de ? 'Was mit Context Rot gemeint ist' : 'What context rot means'}</h2>
      <p className="text-muted">{de ? 'Ein großes Kontextfenster sagt, wie viel Eingabe ein Modell annehmen kann. Es garantiert nicht, dass jedes Detail zuverlässig genutzt wird. Je nach Modell und Aufgabe können zusätzliche Dokumente helfen, ablenken oder den Zugriff auf relevante Informationen erschweren. Das ist ein empirisches Verhalten und keine Regel, nach der Qualität mit jedem Token sinken muss.' : 'A large context window describes how much input a model can accept. It does not guarantee reliable use of every detail. Depending on the model and task, extra documents may help, distract or make relevant information harder to use. This is empirical behavior, not a rule that quality must decline with every token.'}</p>
    </section>
    <section className="rounded-2xl border border-border p-5 sm:p-7 space-y-4">
      <h2 className="text-2xl font-semibold">Lost in the Middle: {de ? 'ein konkretes Experiment' : 'a concrete experiment'}</h2>
      <p className="text-muted">{de ? 'Liu et al. (2023, revidiert 2024) prüften Fragen aus NaturalQuestions-Open. In der Multi-Dokument-Aufgabe enthielt ein Wikipedia-Text die Antwort, weitere Texte dienten als Ablenkung. Die Autoren variierten die Position der Antwortquelle und nutzten Greedy Decoding. Gemessen wurde, ob eine akzeptierte Antwort im Modelloutput vorkam.' : 'Liu et al. (2023, revised 2024) tested NaturalQuestions-Open questions. In the multi-document task, one Wikipedia passage contained the answer and other passages served as distractors. They varied the answer passage position and used greedy decoding. Accuracy checked whether an accepted answer appeared in the output.'}</p>
      <p className="text-muted">{de ? 'Mehrere damals geprüfte Modelle schnitten bei Antwortquellen am Anfang oder Ende besser ab als in der Mitte. Die Kurven messen Aufgabenerfolg, keine Attentiongewichte. Andere Aufgaben und Modelle zeigten andere Verläufe.' : 'Several models tested then did better when the answer passage was near the start or end than in the middle. These curves measure task accuracy, not attention weights. Other tasks and models showed different patterns.'}</p>
      <div className="overflow-x-auto"><table className="w-full text-sm text-left"><caption className="text-left text-muted mb-3">{de ? 'Originalwerte aus Tabelle 1: Kontrollbedingungen, keine Positionskurve' : 'Original values from Table 1: control conditions, not a position curve'}</caption><thead><tr><th className="py-3">{de?'Modell':'Model'}</th><th className="px-3">{de?'Ohne Dokument':'Closed-book'}</th><th>{de?'Nur Antwortdokument':'Oracle'}</th></tr></thead><tbody>{measured.map(([model,closed,oracle])=><tr key={model} className="border-t border-border"><th className="py-3 font-medium">{model}</th><td className="px-3">{closed}%</td><td>{oracle}%</td></tr>)}</tbody></table></div>
      <p className="text-xs text-muted">{de ? 'Historische Messwerte für diese Aufgabe und Modellversionen. Daraus folgt keine Erfolgsquote für heutige Modelle oder eigene Dokumente.' : 'Historical measurements for these model versions and task. They do not predict current models or your own documents.'}</p>
      <a className="text-primary-light underline" href="https://arxiv.org/html/2307.03172v3" target="_blank" rel="noopener noreferrer">Liu et al., §2, {de?'Tabelle':'Table'} 1, {de?'Abbildung':'Figure'} 5</a>
    </section>
    <section className="rounded-2xl border border-border p-5 sm:p-7 space-y-4">
      <h2 className="text-2xl font-semibold">{de ? 'Länge und Ablenkung getrennt testen' : 'Test length and distraction separately'}</h2>
      <p className="text-muted">{de ? 'Chromas Context-Rot-Untersuchung (2025) verglich 18 Modelle und variierte unter anderem Eingabelänge und Distraktoren. Die Ergebnisse hängen von Modell und Versuchsaufbau ab. Eine synthetische Suchaufgabe bildet nicht automatisch den Umgang mit widersprüchlichen Quellen oder langen Gesprächen ab.' : 'Chroma’s Context Rot study (2025) compared 18 models while varying input length and distractors. Results depend on model and setup. A synthetic retrieval task does not automatically represent contradictory sources or long conversations.'}</p>
      <a className="text-primary-light underline" href="https://www.trychroma.com/research/context-rot" target="_blank" rel="noopener noreferrer">Chroma: Context Rot</a>
    </section>
    <ScaleCalculator />
    <section className="rounded-2xl border border-border p-5 sm:p-7 space-y-4">
      <h2 className="text-2xl font-semibold">{de ? 'So prüfst du deinen eigenen Workflow' : 'How to test your own workflow'}</h2>
      <ol className="list-decimal pl-5 space-y-3 text-muted">{(de ? [
        'Lege Fragen, Referenzantworten und relevante Quellen fest. Friere Modellversion, Prompt und Decoding-Einstellungen ein.',
        'Vergleiche nur die Antwortquelle, dieselbe Quelle plus Distraktoren und unterschiedliche Positionen bei gleicher Gesamtlänge.',
        'Miss Antwortkorrektheit und Quellenbelege getrennt. Wiederhole stochastische Läufe und dokumentiere Streuung, Kosten und Latenz.',
        'Teste Retrieval, strukturierte Notizen oder Compaction gegen dieselben Fälle. Prüfe auch, ob dabei wichtige Einschränkungen verloren gehen.'
      ] : [
        'Define questions, reference answers and relevant sources. Fix model version, prompt and decoding settings.',
        'Compare the answer source alone, the same source with distractors, and different positions at equal total length.',
        'Measure answer correctness and source support separately. Repeat stochastic runs and record variation, cost and latency.',
        'Test retrieval, structured notes or compaction on the same cases. Check whether important qualifications are lost.'
      ]).map(item=><li key={item}>{item}</li>)}</ol>
    </section>
  </TopicLayout>
}
