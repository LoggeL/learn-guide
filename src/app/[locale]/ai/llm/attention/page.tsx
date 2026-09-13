'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { AttentionVisualizer } from '@/components/interactive/AttentionVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Attention', description: 'Calculate how a token combines information from other positions using queries, keys, values and a causal mask.',
    what: 'A weighted combination of vectors', body: 'Self-attention transforms each input representation into a query, key and value using learned projections. For one position, its query is compared with the keys. The resulting scores are scaled, masked where needed and normalized with softmax. Those weights combine the values into a contextual vector for that position.',
    parts: [['Query (Q)', 'The projected vector used to score keys for the selected position.'], ['Key (K)', 'The projected vector at each candidate position, compared with the query by a dot product.'], ['Value (V)', 'The projected information combined according to the attention weights. A key determines a weight; a value contributes to the output.']],
    formula: 'One head, in matrix notation', formulaBody: 'Q and K have width dₖ. The dot products form a score for each query-key pair. Scaling by √dₖ controls score magnitude; softmax runs across the allowed keys in each row. M contains 0 for allowed positions and −∞ for masked positions.',
    causal: 'Visibility depends on the task', causalBody: 'A causal decoder masks future tokens so training cannot reveal the answer it must predict. A bidirectional encoder can use positions on both sides. Padding masks and other attention patterns impose additional restrictions. The mask changes which positions are available; it does not assign linguistic roles to heads.',
    cost: 'What scales quadratically?', costBody: 'Dense full attention computes n² query-key scores per head during prefill. The table counts scores, not total operations. Dot products also depend on head width, and models have multiple heads and layers. The displayed storage is only one materialized score matrix at two bytes per element.',
    length: 'Sequence length', pairs: 'Score entries per head', storage: 'Naive score storage', tokens: 'tokens',
    flash: 'Memory-efficient attention', flashBody: 'FlashAttention reorganizes exact attention into blocks to reduce transfers between GPU memory levels and avoid storing the full n × n score matrix. It does not turn dense attention into a linear-arithmetic algorithm. Speed and memory savings depend on shapes, precision, kernels and hardware. Cached single-token decoding has a different workload: one query reads the existing keys and values.',
    interpretation: 'Attention weights are not an explanation by themselves', interpretationBody: 'Weights describe one operation in one head and layer. Other heads, value vectors, residual paths and later computation also affect the answer. A prominent link does not prove that a word caused the final decision, and heads do not have permanently assigned grammar or facts jobs.',
    sources: 'Primary sources', next: 'Continue to multi-head attention and GQA →',
  },
  de: {
    title: 'Attention', description: 'Nachrechnen, wie ein Token Informationen anderer Positionen mit Queries, Keys, Values und einer kausalen Maske kombiniert.',
    what: 'Eine gewichtete Kombination von Vektoren', body: 'Self-Attention bildet jede Eingangsrepräsentation mit gelernten Projektionen auf Query, Key und Value ab. Für eine Position wird ihre Query mit den Keys verglichen. Die Scores werden skaliert, gegebenenfalls maskiert und mit Softmax normiert. Diese Gewichte kombinieren die Values zu einem kontextuellen Vektor dieser Position.',
    parts: [['Query (Q)', 'Der projizierte Vektor, der für die gewählte Position die Keys bewertet.'], ['Key (K)', 'Der projizierte Vektor jeder möglichen Bezugsposition. Ein Skalarprodukt vergleicht ihn mit der Query.'], ['Value (V)', 'Die projizierte Information, die entsprechend dem Attention-Gewicht kombiniert wird. Der Key bestimmt ein Gewicht; der Value trägt zur Ausgabe bei.']],
    formula: 'Ein Head in Matrixschreibweise', formulaBody: 'Q und K haben die Breite dₖ. Ihre Skalarprodukte ergeben einen Score pro Query-Key-Paar. Die Skalierung mit √dₖ kontrolliert die Scoregröße. Softmax wird zeilenweise über erlaubte Keys berechnet. M enthält 0 für erlaubte und −∞ für maskierte Positionen.',
    causal: 'Die Sichtbarkeit hängt von der Aufgabe ab', causalBody: 'Ein kausaler Decoder maskiert zukünftige Tokens, damit das Training die vorherzusagende Antwort nicht vorab verrät. Ein bidirektionaler Encoder kann Positionen auf beiden Seiten nutzen. Padding-Masken und andere Attention-Muster schränken die Sicht zusätzlich ein. Die Maske entscheidet über verfügbare Positionen; sie weist Heads keine sprachlichen Aufgaben zu.',
    cost: 'Was wächst quadratisch?', costBody: 'Vollständige dichte Attention berechnet beim Prefill n² Query-Key-Scores pro Head. Die Tabelle zählt Scores, keine gesamten Rechenoperationen. Skalarprodukte hängen zusätzlich von der Head-Breite ab; Modelle besitzen mehrere Heads und Layer. Der gezeigte Speicher betrifft nur eine vollständig gespeicherte Scorematrix mit zwei Bytes pro Element.',
    length: 'Sequenzlänge', pairs: 'Score-Einträge pro Head', storage: 'Naiver Score-Speicher', tokens: 'Tokens',
    flash: 'Speichereffiziente Attention', flashBody: 'FlashAttention organisiert exakte Attention in Blöcken. Dadurch sinken Transfers zwischen GPU-Speicherebenen, und die vollständige n × n-Scorematrix muss nicht gespeichert werden. Die dichte Attention-Rechnung wird dadurch nicht linear. Geschwindigkeits- und Speichergewinne hängen von Dimensionen, Präzision, Kernels und Hardware ab. Decoding eines einzelnen Tokens mit Cache hat eine andere Arbeitslast: Eine Query liest die vorhandenen Keys und Values.',
    interpretation: 'Attention-Gewichte allein erklären keine Antwort', interpretationBody: 'Die Gewichte beschreiben eine Operation in einem Head und Layer. Andere Heads, Value-Vektoren, Residualpfade und spätere Rechnungen beeinflussen die Antwort ebenfalls. Eine auffällige Verbindung belegt nicht, dass ein Wort die finale Entscheidung verursacht. Heads haben auch keine dauerhaft festgelegten Grammatik- oder Faktenaufgaben.',
    sources: 'Primärquellen', next: 'Weiter zu Multi-Head Attention und GQA →',
  },
}
export default function AttentionPage() {
  const { t, locale } = useTranslation()
  const c = copy[locale === 'de' ? 'de' : 'en']
  return <TopicLayout topicId="attention" title={c.title} description={c.description} breadcrumbs={[{ label: t.categories.ai, href: '/' }, { label: t.categories.llm, href: '/ai/llm' }, { label: c.title }]}>
    <section><h2 className="mb-3 text-xl font-semibold">{c.what}</h2><p className="leading-relaxed text-muted">{c.body}</p><div className="mt-5 grid gap-3 md:grid-cols-3">{c.parts.map(([title, body]) => <article className="rounded-xl border border-border bg-surface p-4" key={title}><h3 className="mb-2 font-semibold text-cyan-300">{title}</h3><p className="text-sm leading-relaxed text-muted">{body}</p></article>)}</div></section>
    <AttentionVisualizer />
    <section className="rounded-xl border border-border bg-surface p-6"><h2 className="mb-3 text-xl font-semibold">{c.formula}</h2><p className="mb-4 overflow-x-auto font-mono text-sm text-cyan-300">Attention(Q,K,V) = softmax(QKᵀ / √dₖ + M) V</p><p className="leading-relaxed text-muted">{c.formulaBody}</p></section>
    <section><h2 className="mb-3 text-xl font-semibold">{c.causal}</h2><p className="leading-relaxed text-muted">{c.causalBody}</p></section>
    <section><h2 className="mb-3 text-xl font-semibold">{c.cost}</h2><p className="leading-relaxed text-muted">{c.costBody}</p><div className="mt-4 overflow-x-auto"><table className="w-full text-right text-sm"><thead><tr>{[c.length, c.pairs, c.storage].map(label => <th className="p-3" key={label}>{label}</th>)}</tr></thead><tbody>{[4096, 8192, 16384].map(n => <tr key={n} className="border-t border-border"><td className="p-3">{n.toLocaleString(locale)} {c.tokens}</td><td className="p-3 font-mono">{(n * n).toLocaleString(locale)}</td><td className="p-3 font-mono">{n * n * 2 / 2 ** 20} MiB</td></tr>)}</tbody></table></div></section>
    {[[c.flash, c.flashBody], [c.interpretation, c.interpretationBody]].map(([title, body]) => <section key={title}><h2 className="mb-3 text-xl font-semibold">{title}</h2><p className="leading-relaxed text-muted">{body}</p></section>)}
    <section><h2 className="mb-3 text-xl font-semibold">{c.sources}</h2><ul className="space-y-2 text-cyan-300">{[['Attention Is All You Need (2017)', 'https://arxiv.org/abs/1706.03762'], ['FlashAttention (2022)', 'https://arxiv.org/abs/2205.14135'], ['Attention is not Explanation (2019)', 'https://arxiv.org/abs/1902.10186']].map(([name, href]) => <li key={href}><a className="underline" href={href}>{name}</a></li>)}</ul><Link href={`/${locale}/ai/llm/multi-head-attention-gqa`} className="mt-4 inline-block text-cyan-300">{c.next}</Link></section>
  </TopicLayout>
}
