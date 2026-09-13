'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Abliteration and refusal directions', description: 'A model-specific interpretability result: how a direction in hidden activations can influence refusal behavior, and what the experiment does not establish.',
    sections: [
      ['The published observation', 'Arditi and colleagues studied 13 open chat models up to 72B parameters. In their experiments, a dominant direction in residual-stream activations mediated much of the tested refusal behavior. Intervening on that direction changed refusal rates. This is an empirical finding for the evaluated models and prompts, not a universal switch shared by all LLMs.'],
      ['A direction is not a neuron or a fixed layer', 'The direction is a vector in an activation space. Its location, extraction and effect depend on the model and experimental setup. There is no universal Layer 16 at which every model decides to refuse. A two-dimensional picture can illustrate a projection, but cannot show the whole learned mechanism.'],
      ['What changes and what remains uncertain', 'Removing one measured direction can suppress a class of refusals. Other representations, training effects, system instructions or external checks can still affect behavior. A low refusal rate on one test set does not establish that every future request will be answered or that all other capabilities remain unchanged.'],
      ['How to assess the evidence', 'Keep model, prompts, baseline and intervention fixed and report refusal rates together with unrelated capability evaluations. Include different prompt types and repeated trials. Inspect examples as well as aggregate scores. Compare the unmodified checkpoint and the modified checkpoint under identical inference settings.'],
      ['Recovery is an additional training experiment', 'Fine-tuning may change side effects of an intervention, but DPO is not a universal healing step with guaranteed recovery. Any follow-up training needs its own data, objective and evaluation. Being able to reload the original checkpoint is different from demonstrating that an edited model retained the original behavior.'],
    ],
    sketch: 'Conceptual projection, not a model execution', sketchBody: 'An activation vector has a component along a chosen direction and a component perpendicular to it. A projection can change the first component. This geometric description says nothing by itself about which behavior the direction represents.',
    source: 'Primary study: Refusal in Language Models Is Mediated by a Single Direction (2024)',
  },
  de: {
    title: 'Abliteration und Weigerungsrichtungen', description: 'Ein modellabhängiges Ergebnis der Interpretierbarkeitsforschung: Wie eine Richtung in Hidden-Aktivierungen Weigerungen beeinflussen kann und was das Experiment nicht belegt.',
    sections: [
      ['Die veröffentlichte Beobachtung', 'Arditi und Kollegen untersuchten 13 offene Chatmodelle mit bis zu 72B Parametern. In ihren Experimenten vermittelte eine dominante Richtung in Residual-Stream-Aktivierungen einen großen Teil der getesteten Weigerungen. Eingriffe in diese Richtung veränderten die Weigerungsrate. Das ist ein empirischer Befund für die untersuchten Modelle und Prompts, kein gemeinsamer universeller Schalter aller LLMs.'],
      ['Eine Richtung ist kein Neuron und kein festes Layer', 'Die Richtung ist ein Vektor in einem Aktivierungsraum. Ort, Bestimmung und Wirkung hängen von Modell und Versuchsaufbau ab. Es gibt kein universelles Layer 16, in dem jedes Modell über eine Weigerung entscheidet. Eine zweidimensionale Zeichnung kann eine Projektion veranschaulichen, aber nicht den vollständigen gelernten Mechanismus zeigen.'],
      ['Was sich verändert und was offenbleibt', 'Das Entfernen einer gemessenen Richtung kann eine Klasse von Weigerungen unterdrücken. Andere Repräsentationen, Trainingseffekte, Systeminstruktionen oder externe Prüfungen können das Verhalten weiterhin beeinflussen. Eine niedrige Weigerungsrate auf einem Testset belegt weder eine Antwort auf jede künftige Anfrage noch unveränderte übrige Fähigkeiten.'],
      ['Wie sich die Evidenz prüfen lässt', 'Modell, Prompts, Vergleichsbasis und Eingriff festhalten. Weigerungsraten zusammen mit unabhängigen Fähigkeitstests berichten. Unterschiedliche Prompttypen und Wiederholungen einbeziehen. Neben Gesamtwerten auch Beispiele prüfen. Ursprünglichen und veränderten Checkpoint unter gleichen Inferenzbedingungen vergleichen.'],
      ['Nachtraining ist ein weiteres Experiment', 'Fine-Tuning kann Nebenwirkungen eines Eingriffs verändern. DPO ist aber kein universeller Heilungsschritt mit garantierter Wiederherstellung. Nachtraining braucht eigene Daten, ein definiertes Ziel und eine Evaluation. Den ursprünglichen Checkpoint laden zu können ist etwas anderes als nachzuweisen, dass ein verändertes Modell seine ursprünglichen Fähigkeiten behält.'],
    ],
    sketch: 'Konzeptuelle Projektion, keine Modellausführung', sketchBody: 'Ein Aktivierungsvektor hat eine Komponente entlang einer gewählten Richtung und eine dazu senkrechte Komponente. Eine Projektion kann die erste Komponente verändern. Diese Geometrie allein sagt noch nichts darüber, welches Verhalten die Richtung repräsentiert.',
    source: 'Primärstudie: Refusal in Language Models Is Mediated by a Single Direction (2024)',
  },
}
export default function AbliterationPage() {
  const { t, locale } = useTranslation()
  const c = copy[locale === 'de' ? 'de' : 'en']
  return <TopicLayout topicId="abliteration" title={c.title} description={c.description} breadcrumbs={[{ label: t.categories.ai, href: '/' }, { label: t.categories.llm, href: '/ai/llm' }, { label: c.title }]}>
    {c.sections.map(([title, body]) => <section key={title} className="rounded-xl border border-border bg-surface p-6"><h2 className="mb-3 text-xl font-semibold">{title}</h2><p className="leading-relaxed text-muted">{body}</p></section>)}
    <section className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6"><h2 className="mb-3 text-xl font-semibold">{c.sketch}</h2><p className="leading-relaxed text-muted">{c.sketchBody}</p><p className="mt-4 font-mono text-lg text-cyan-200">h = h∥ + h⊥</p></section>
    <a href="https://arxiv.org/abs/2406.11717" className="text-cyan-300 underline">{c.source}</a>
  </TopicLayout>
}
