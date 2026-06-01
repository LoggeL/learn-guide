'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle2,
  Gauge,
  LineChart,
  Puzzle,
  Sparkles,
  Target,
  TestTube2,
} from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useLocale } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Jagged Frontier',
    description:
      'Why frontier models can solve olympiad-level problems and still fail simple-looking tasks at the edge of their capability.',
    crumb: 'Jagged Frontier',
    introTitle: 'AI capability is not a smooth curve',
    intro:
      'A stronger model is not simply a model that is a little better at everything. The frontier is jagged: huge peaks appear in domains with clear feedback, abundant practice data, and verifiable rewards, while nearby-looking tasks can remain surprisingly brittle.',
    thesis:
      'That is why a model can solve hard math, write useful code, or pass a benchmark, then stumble on a tiny exactness task such as counting the letters in "strawberry". The mistake feels absurd because humans expect intelligence to transfer smoothly. LLMs do not always transfer that way.',
    peaksTitle: 'Where the peaks come from',
    peaks: [
      {
        title: 'Verifiable rewards',
        body: 'Math answers, unit tests, compiler errors, game scores, and benchmark checks create objective signals. If the model can try many attempts and receive reliable feedback, training can push hard on the behavior.',
      },
      {
        title: 'Synthetic practice loops',
        body: 'Once a task has a verifier, systems can generate new problems, sample many solutions, score them, and train on the winners. That makes coding and math unusually scalable compared with vague knowledge work.',
      },
      {
        title: 'Tool-shaped environments',
        body: 'Coding agents, browser agents, and office agents can be placed in realistic sandboxes. The model acts, the environment changes, and a verifier decides whether the goal was actually reached.',
      },
    ],
    valleysTitle: 'Why the valleys remain',
    valleys: [
      {
        title: 'Hidden exactness',
        body: 'Some tasks look semantic but depend on exact characters, positions, files, cells, or UI state. Token-based models can miss that structure unless tools expose it explicitly.',
      },
      {
        title: 'Weak verifiers',
        body: 'Many useful office, research, and planning tasks do not have a clean yes/no checker. Without a reliable target metric, reinforcement learning can optimize the wrong proxy.',
      },
      {
        title: 'Distribution shift',
        body: 'A model may be excellent on a benchmark-shaped version of a problem and fragile when the same skill appears in a messy real workflow with missing context and ambiguous goals.',
      },
    ],
    examplesTitle: 'The contrast that confuses people',
    examples: [
      {
        label: 'High peak',
        title: 'Olympiad-style math',
        body: 'The final answer can often be checked. Training can reward correct derivations, reject wrong attempts, and build strong reasoning traces around the task format.',
      },
      {
        label: 'High peak',
        title: 'Coding with tests',
        body: 'A coding agent can edit files, run tests, inspect failures, and improve. The feedback loop is expensive, but the success signal can be very concrete.',
      },
      {
        label: 'Sharp valley',
        title: 'Strawberry-style letter counting',
        body: 'The task is easy for humans, but it asks the model to reason over character structure hidden inside tokens. This is closer to string inspection than language understanding.',
      },
      {
        label: 'Messy frontier',
        title: 'Office and browser work',
        body: 'The model may understand the goal, but realistic environments need accounts, documents, state reset, permissions, UI recovery, and verifiers that know what success means.',
      },
    ],
    adoptionTitle: 'Why this hurts adoption',
    adoption:
      'Jagged capability makes AI feel unreliable in a very specific way. People see a system solve a hard problem, infer broad competence, then lose trust when it fails a simple-looking task. The visible failure is not just a bug; it breaks the user\'s mental model of what the system is.',
    useTitle: 'How to work with the jagged frontier',
    useItems: [
      'Ask whether the task has an objective success signal, not whether it feels easy to a human.',
      'Prefer workflows with tests, validators, scripts, checklists, or reviewable artifacts.',
      'Use tools for exact operations: counting, arithmetic, file inspection, spreadsheet logic, and browser state.',
      'Benchmark your actual workflow instead of trusting demos from a nearby but cleaner task.',
      'Treat impressive peaks and embarrassing valleys as the same phenomenon: uneven trainability.',
    ],
    relatedTitle: 'Related concepts',
    related: [
      ['Verifiable Rewards', '/ai/agents/verifiable-rewards'],
      ['Reinforcement Learning', '/ai/ml-fundamentals/reinforcement-learning'],
      ['Subtoken Blindness', '/ai/llm/subtoken-blindness'],
      ['Agent Evaluation', '/ai/agents/evaluation'],
    ],
  },
  de: {
    title: 'Jagged Frontier',
    description:
      'Warum Frontier-Modelle Olympiade-Aufgaben lösen und trotzdem an simpel wirkenden Aufgaben an ihrer Fähigkeitsgrenze scheitern.',
    crumb: 'Jagged Frontier',
    introTitle: 'KI-Fähigkeit ist keine glatte Kurve',
    intro:
      'Ein stärkeres Modell ist nicht einfach ein Modell, das überall ein bisschen besser ist. Die Frontier ist gezackt: enorme Spitzen entstehen in Bereichen mit klarem Feedback, vielen Übungsdaten und verifizierbaren Rewards, während nahe wirkende Aufgaben überraschend brüchig bleiben.',
    thesis:
      'Deshalb kann ein Modell schwere Mathematik lösen, nützlichen Code schreiben oder Benchmarks bestehen und dann bei einer winzigen Exaktheitsfrage wie den Buchstaben in "strawberry" stolpern. Der Fehler wirkt absurd, weil Menschen erwarten, dass Intelligenz glatt überträgt. LLMs übertragen nicht immer so.',
    peaksTitle: 'Woher die Spitzen kommen',
    peaks: [
      {
        title: 'Verifizierbare Rewards',
        body: 'Mathe-Antworten, Unit-Tests, Compilerfehler, Game Scores und Benchmark-Checks liefern objektive Signale. Wenn das Modell viele Versuche machen und verlässliches Feedback bekommen kann, lässt sich Training stark auf dieses Verhalten drücken.',
      },
      {
        title: 'Synthetische Übungsschleifen',
        body: 'Sobald es einen Verifier gibt, können Systeme neue Aufgaben erzeugen, viele Lösungen sampeln, sie bewerten und auf den Gewinnern trainieren. Das macht Coding und Mathe ungewöhnlich gut skalierbar.',
      },
      {
        title: 'Tool-förmige Umgebungen',
        body: 'Coding Agents, Browser Agents und Office Agents können in realistische Sandboxen gesetzt werden. Das Modell handelt, die Umgebung verändert sich, und ein Verifier entscheidet, ob das Ziel wirklich erreicht wurde.',
      },
    ],
    valleysTitle: 'Warum die Täler bleiben',
    valleys: [
      {
        title: 'Versteckte Exaktheit',
        body: 'Manche Aufgaben wirken semantisch, hängen aber an exakten Zeichen, Positionen, Dateien, Zellen oder UI-Zuständen. Tokenbasierte Modelle übersehen diese Struktur, wenn Tools sie nicht explizit sichtbar machen.',
      },
      {
        title: 'Schwache Verifier',
        body: 'Viele nützliche Office-, Research- und Planungsaufgaben haben keinen sauberen Ja/Nein-Checker. Ohne verlässliche Zielmetrik optimiert Reinforcement Learning leicht den falschen Proxy.',
      },
      {
        title: 'Distribution Shift',
        body: 'Ein Modell kann auf der benchmarkförmigen Version eines Problems stark sein und in einem messy Real-Workflow mit fehlendem Kontext und uneindeutigen Zielen fragil werden.',
      },
    ],
    examplesTitle: 'Der Kontrast, der Menschen verwirrt',
    examples: [
      {
        label: 'Hohe Spitze',
        title: 'Olympiade-Mathematik',
        body: 'Die finale Antwort lässt sich oft prüfen. Training kann korrekte Ableitungen belohnen, falsche Versuche verwerfen und starke Reasoning-Spuren rund um das Aufgabenformat aufbauen.',
      },
      {
        label: 'Hohe Spitze',
        title: 'Coding mit Tests',
        body: 'Ein Coding Agent kann Dateien ändern, Tests ausführen, Fehler inspizieren und nachbessern. Der Feedback-Loop ist teuer, aber das Erfolgssignal kann sehr konkret sein.',
      },
      {
        label: 'Scharfes Tal',
        title: 'Strawberry-artiges Buchstabenzählen',
        body: 'Die Aufgabe ist für Menschen leicht, verlangt vom Modell aber Character-Struktur innerhalb von Tokens. Das ist eher String-Inspektion als Sprachverständnis.',
      },
      {
        label: 'Messy Frontier',
        title: 'Office- und Browser-Arbeit',
        body: 'Das Modell kann das Ziel verstehen, aber realistische Umgebungen brauchen Accounts, Dokumente, State Reset, Berechtigungen, UI-Recovery und Verifier, die Erfolg erkennen.',
      },
    ],
    adoptionTitle: 'Warum das Adoption bremst',
    adoption:
      'Gezackte Fähigkeit lässt KI auf eine sehr bestimmte Art unzuverlässig wirken. Menschen sehen ein System ein schweres Problem lösen, schließen auf breite Kompetenz und verlieren dann Vertrauen, wenn es an etwas scheinbar Einfachem scheitert. Der sichtbare Fehler ist nicht nur ein Bug; er bricht das mentale Modell des Nutzers.',
    useTitle: 'Wie man mit der jagged frontier arbeitet',
    useItems: [
      'Frage, ob die Aufgabe ein objektives Erfolgssignal hat, nicht ob sie sich für Menschen leicht anfühlt.',
      'Bevorzuge Workflows mit Tests, Validatoren, Skripten, Checklisten oder prüfbaren Artefakten.',
      'Nutze Tools für exakte Operationen: Zählen, Arithmetik, Dateiinspektion, Tabellenlogik und Browser-State.',
      'Benchmarke den echten Workflow, statt Demos aus einer nahen, aber saubereren Aufgabe zu vertrauen.',
      'Behandle beeindruckende Spitzen und peinliche Täler als dasselbe Phänomen: ungleichmäßige Trainierbarkeit.',
    ],
    relatedTitle: 'Verwandte Konzepte',
    related: [
      ['Verifizierbare Rewards', '/ai/agents/verifiable-rewards'],
      ['Reinforcement Learning', '/ai/ml-fundamentals/reinforcement-learning'],
      ['Subtoken-Blindheit', '/ai/llm/subtoken-blindness'],
      ['Agenten-Evaluierung', '/ai/agents/evaluation'],
    ],
  },
}

export default function JaggedFrontierPage() {
  const { locale } = useLocale()
  const c = locale === 'de' ? copy.de : copy.en

  return (
    <TopicLayout
      topicId="jagged-frontier"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'Large Language Models', href: '/ai/llm' },
        { label: c.crumb },
      ]}
      prevTopic={{ label: locale === 'de' ? 'Temperatur' : 'Temperature', href: '/ai/llm/temperature' }}
      nextTopic={{ label: locale === 'de' ? 'Kontextverfall' : 'Context Rot', href: '/ai/llm/context-rot' }}
    >
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/15">
            <LineChart size={21} className="text-cyan-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.introTitle}</h2>
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-muted">
          <p>{c.intro}</p>
          <p>{c.thesis}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {c.peaks.map((peak, index) => {
          const icons = [Target, TestTube2, Gauge]
          const Icon = icons[index]
          return (
            <article key={peak.title} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <Icon size={24} className="mb-4 text-emerald-300" />
              <h2 className="mb-3 font-heading text-lg font-bold text-emerald-200">{peak.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{peak.body}</p>
            </article>
          )
        })}
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <AlertTriangle size={24} className="text-amber-300" />
          <h2 className="font-heading text-2xl font-bold text-text">{c.valleysTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {c.valleys.map((valley) => (
            <article key={valley.title} className="rounded-2xl border border-border bg-surface/55 p-5">
              <h3 className="mb-3 font-heading text-lg font-bold text-text">{valley.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{valley.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <Puzzle size={24} className="text-violet-300" />
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.examplesTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {c.examples.map((example) => (
            <article key={example.title} className="rounded-2xl border border-border bg-surface/50 p-5">
              <span className="mb-3 inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-light">
                {example.label}
              </span>
              <h3 className="mb-3 font-heading text-xl font-bold text-text">{example.title}</h3>
              <p className="leading-relaxed text-muted">{example.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <Sparkles size={24} className="text-amber-300" />
          <h2 className="font-heading text-2xl font-bold text-amber-200">{c.adoptionTitle}</h2>
        </div>
        <p className="text-lg leading-relaxed text-muted">{c.adoption}</p>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-emerald-200">{c.useTitle}</h2>
        <ul className="space-y-3">
          {c.useItems.map((item) => (
            <li key={item} className="flex gap-3 text-muted">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{c.relatedTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {c.related.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-border bg-background/40 px-4 py-3 text-primary-light transition hover:border-primary/40 hover:bg-primary/10"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </TopicLayout>
  )
}
