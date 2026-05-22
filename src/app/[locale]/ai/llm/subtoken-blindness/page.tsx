'use client'

import Link from 'next/link'
import { AlertTriangle, Brain, Calculator, CheckCircle2, SplitSquareHorizontal } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { SubtokenBlindnessDemo } from '@/components/interactive'
import { useLocale } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Subtoken Blindness',
    description:
      'Why models can sound brilliant and still miss tiny letter, digit, and counting tasks that humans solve instantly.',
    crumb: 'Subtoken Blindness',
    introTitle: 'The strawberry problem is a symptom',
    intro:
      'The famous question "how many r letters are in strawberry?" is not interesting because the answer is hard. It is interesting because the error feels alien. A model can summarize a paper, write code, and reason through a plan, then stumble on a small character-level task.',
    termTitle: 'A better name: subtoken blindness',
    term:
      'Subtoken blindness is the tendency of token-based language models to lose reliability when the task depends on structure inside tokens: individual letters, repeated characters, exact digit positions, separators, or column-by-column arithmetic.',
    notJustTokenizerTitle: 'Not just tokenization',
    notJustTokenizer:
      'Tokenization is the entry point, but not the whole explanation. Research on letter counting finds that models can often recognize letters yet fail to count them consistently, especially when counts exceed two or when the task requires stable step-by-step state.',
    currentTitle: 'Current examples',
    examples: [
      {
        title: 'Strawberry and cranberry',
        body: 'Recent public tests show models may pass the meme case after tuning, then fail a nearby word such as cranberry. That suggests memorized or patched behavior is different from robust character handling.',
      },
      {
        title: 'Long digit addition',
        body: 'Multi-digit addition looks simple to humans because we use a strict algorithm. A base LLM sees a string of tokens and predicts text. Without tool use or a learned reliable procedure, it may produce plausible-looking arithmetic.',
      },
      {
        title: 'IDs, filenames, and weird strings',
        body: 'The same pattern appears in hashes, SKUs, coupon codes, exact casing, invisible whitespace, and off-by-one character positions. The content has little semantic meaning, so fluency is the wrong capability.',
      },
    ],
    demoTitle: 'Try the tokenizer view',
    whyTitle: 'Why this matters',
    why:
      'These failures are useful because they reveal the boundary between language fluency and exact symbolic manipulation. The model is not a database, not a calculator, and not a character array unless the system gives it tools or forces the structure into the context.',
    mitigationsTitle: 'What works in practice',
    mitigations: [
      'Ask the model to spell out the string before counting.',
      'Use code, a calculator, or validation logic for arithmetic and exact string work.',
      'Treat viral benchmark fixes cautiously; nearby variants often expose the same weakness.',
      'Design agent tools so exact operations happen outside the language model.',
    ],
    sourcesTitle: 'Sources and further reading',
    sources: [
      ['Why Do Large Language Models Struggle to Count Letters?', 'https://arxiv.org/abs/2412.18626'],
      ['The Strawberry Problem: Emergence of Character-level Understanding in Tokenized Language Models', 'https://arxiv.org/abs/2505.14172'],
      ['TechRadar on the cranberry follow-up to the strawberry test', 'https://www.techradar.com/ai-platforms-assistants/chatgpt-just-announced-it-can-finally-pass-the-simple-how-many-rs-in-strawberry-test-but-users-are-still-tripping-it-up-by-switching-to-cranberry'],
    ],
  },
  de: {
    title: 'Subtoken-Blindheit',
    description:
      'Warum Modelle brillant klingen können und trotzdem bei kleinen Buchstaben-, Ziffern- und Zählaufgaben scheitern, die für Menschen trivial wirken.',
    crumb: 'Subtoken-Blindheit',
    introTitle: 'Das Strawberry-Problem ist ein Symptom',
    intro:
      'Die berühmte Frage "wie viele r stecken in strawberry?" ist nicht spannend, weil die Antwort schwierig wäre. Sie ist spannend, weil der Fehler unnatürlich wirkt. Ein Modell kann Paper zusammenfassen, Code schreiben und Pläne durchdenken, stolpert dann aber über eine kleine Aufgabe auf Zeichenebene.',
    termTitle: 'Besserer Begriff: Subtoken-Blindheit',
    term:
      'Subtoken-Blindheit beschreibt die Schwäche tokenbasierter Sprachmodelle bei Aufgaben, die Struktur innerhalb von Tokens brauchen: einzelne Buchstaben, wiederholte Zeichen, exakte Ziffernpositionen, Trennzeichen oder spaltenweise Addition.',
    notJustTokenizerTitle: 'Nicht nur Tokenisierung',
    notJustTokenizer:
      'Tokenisierung ist der Einstieg, aber nicht die ganze Erklärung. Forschung zu Letter Counting zeigt: Modelle erkennen Buchstaben oft, zählen sie aber nicht stabil, besonders wenn ein Buchstabe mehr als zweimal vorkommt oder die Aufgabe zuverlässigen Schritt-für-Schritt-Zustand verlangt.',
    currentTitle: 'Aktuelle Beispiele',
    examples: [
      {
        title: 'Strawberry und Cranberry',
        body: 'Öffentliche Tests zeigen: Modelle können den Meme-Fall nach Tuning bestehen und dann bei einem nahen Wort wie cranberry wieder scheitern. Das wirkt eher wie ein Patch als wie robustes Zeichenverständnis.',
      },
      {
        title: 'Mehrstellige Addition',
        body: 'Mehrstellige Addition ist für Menschen einfach, weil wir einen festen Algorithmus benutzen. Ein Basis-LLM sieht eine Tokenfolge und sagt Text voraus. Ohne Tool oder zuverlässig gelernte Prozedur kann plausible, aber falsche Arithmetik entstehen.',
      },
      {
        title: 'IDs, Dateinamen und komische Strings',
        body: 'Dasselbe Muster taucht bei Hashes, SKUs, Gutschein-Codes, Groß-/Kleinschreibung, unsichtbaren Leerzeichen und Off-by-one-Zeichenpositionen auf. Der Inhalt hat wenig Semantik, deshalb ist Sprachgefühl die falsche Fähigkeit.',
      },
    ],
    demoTitle: 'Tokenizer-Ansicht ausprobieren',
    whyTitle: 'Warum das wichtig ist',
    why:
      'Diese Fehler sind nützlich, weil sie die Grenze zwischen Sprachflüssigkeit und exakter symbolischer Manipulation sichtbar machen. Das Modell ist keine Datenbank, kein Taschenrechner und kein Zeichenarray, außer das System gibt ihm Tools oder zwingt die Struktur sichtbar in den Kontext.',
    mitigationsTitle: 'Was praktisch hilft',
    mitigations: [
      'Das Modell die Zeichenfolge zuerst Buchstabe für Buchstabe ausschreiben lassen.',
      'Für Arithmetik und exakte String-Arbeit Code, Rechner oder Validierungslogik nutzen.',
      'Virale Benchmark-Fixes vorsichtig bewerten; nahe Varianten zeigen oft dieselbe Schwäche.',
      'Agenten-Tools so bauen, dass exakte Operationen außerhalb des Sprachmodells passieren.',
    ],
    sourcesTitle: 'Quellen und weiterführend',
    sources: [
      ['Why Do Large Language Models Struggle to Count Letters?', 'https://arxiv.org/abs/2412.18626'],
      ['The Strawberry Problem: Emergence of Character-level Understanding in Tokenized Language Models', 'https://arxiv.org/abs/2505.14172'],
      ['TechRadar zum Cranberry-Follow-up des Strawberry-Tests', 'https://www.techradar.com/ai-platforms-assistants/chatgpt-just-announced-it-can-finally-pass-the-simple-how-many-rs-in-strawberry-test-but-users-are-still-tripping-it-up-by-switching-to-cranberry'],
    ],
  },
}

export default function SubtokenBlindnessPage() {
  const { locale } = useLocale()
  const c = locale === 'de' ? copy.de : copy.en

  return (
    <TopicLayout
      topicId="subtoken-blindness"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'Large Language Models', href: '/ai/llm' },
        { label: c.crumb },
      ]}
      prevTopic={{ label: locale === 'de' ? 'Tokenisierung' : 'Tokenization', href: '/ai/llm/tokenization' }}
      nextTopic={{ label: locale === 'de' ? 'Einbettungen' : 'Embeddings', href: '/ai/llm/embeddings' }}
    >
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15">
            <AlertTriangle size={21} className="text-amber-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{c.introTitle}</h2>
        </div>
        <p className="text-lg leading-relaxed text-muted">{c.intro}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <SplitSquareHorizontal size={24} className="mb-4 text-cyan-300" />
          <h2 className="mb-3 font-heading text-xl font-bold text-cyan-200">{c.termTitle}</h2>
          <p className="leading-relaxed text-muted">{c.term}</p>
        </div>
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <Brain size={24} className="mb-4 text-violet-300" />
          <h2 className="mb-3 font-heading text-xl font-bold text-violet-200">{c.notJustTokenizerTitle}</h2>
          <p className="leading-relaxed text-muted">{c.notJustTokenizer}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{c.currentTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {c.examples.map((example) => (
            <article key={example.title} className="rounded-2xl border border-border bg-surface/55 p-5">
              <h3 className="mb-3 font-heading text-lg font-bold text-text">{example.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{example.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <Calculator size={24} className="text-emerald-300" />
          <h2 className="font-heading text-2xl font-bold text-text">{c.demoTitle}</h2>
        </div>
        <SubtokenBlindnessDemo />
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{c.whyTitle}</h2>
        <p className="text-lg leading-relaxed text-muted">{c.why}</p>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-emerald-200">{c.mitigationsTitle}</h2>
        <ul className="space-y-3">
          {c.mitigations.map((item) => (
            <li key={item} className="flex gap-3 text-muted">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{c.sourcesTitle}</h2>
        <ul className="space-y-3">
          {c.sources.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="text-primary-light underline-offset-4 hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
