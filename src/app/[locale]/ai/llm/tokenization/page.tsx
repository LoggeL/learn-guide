'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { TokenizerDemo } from '@/components/interactive'
import { MiniBpeDemo } from '@/components/interactive/MiniBpeDemo'
import { useTranslation } from '@/lib/i18n/context'

// All splits and IDs below were produced with o200k_base (js-tiktoken / tiktoken).
type Tok = [string, number]

const PIPELINE_EXAMPLE = 'costs 1234567 dollars'
const PIPELINE_CHUNKS = ['costs', ' ', '123', '456', '7', ' dollars']
const PIPELINE_TOKENS: Tok[] = [['cost', 33457], ['s', 82], [' ', 220], ['123', 7633], ['456', 19354], ['7', 22], [' dollars', 16713]]

const BYTE_EXAMPLES: { char: string; bytes: string; tokens: string[] }[] = [
  { char: 'ä', bytes: 'c3 a4', tokens: ['c3 a4'] },
  { char: '🙂', bytes: 'f0 9f 99 82', tokens: ['f0 9f 99 82'] },
  { char: '🦩', bytes: 'f0 9f a6 a9', tokens: ['f0 9f', 'a6', 'a9'] },
]

const UNHAPPY: { input: string; tokens: Tok[] }[] = [
  { input: 'unhappiness', tokens: [['un', 373], ['h', 71], ['appiness', 117779]] },
  { input: ' unhappiness', tokens: [[' unh', 137500], ['appiness', 117779]] },
]
const CASE_TOKENS: Tok[] = [['the', 3086], [' the', 290], ['The', 976], [' The', 623]]
const COMPOUND: Tok[] = [
  [' Dona', 189253], ['ud', 527], ['amp', 1515], ['fsch', 188805], ['if', 366],
  ['ff', 608], ['ahr', 6907], ['ts', 1561], ['gesellschaft', 113975],
]
const SPECIAL_AS_TEXT: Tok[] = [['<', 27], ['|', 91], ['end', 419], ['of', 1440], ['text', 919], ['|', 91], ['>', 29]]

// Token counts measured with cl100k_base and o200k_base on the translations below.
const TAX_ROWS: { key: 'langEn' | 'langDe' | 'langEs' | 'langJa' | 'langHi' | 'langEl'; text: string; bytes: number; cl100k: number; o200k: number }[] = [
  { key: 'langEn', text: 'The weather is nice today, so we are going for a walk in the park.', bytes: 66, cl100k: 17, o200k: 17 },
  { key: 'langDe', text: 'Das Wetter ist heute schön, deshalb gehen wir im Park spazieren.', bytes: 65, cl100k: 17, o200k: 14 },
  { key: 'langEs', text: 'Hoy hace buen tiempo, así que vamos a dar un paseo por el parque.', bytes: 66, cl100k: 20, o200k: 16 },
  { key: 'langJa', text: '今日は天気がいいので、公園を散歩します。', bytes: 60, cl100k: 21, o200k: 13 },
  { key: 'langHi', text: 'आज मौसम अच्छा है, इसलिए हम पार्क में टहलने जा रहे हैं।', bytes: 138, cl100k: 55, o200k: 16 },
  { key: 'langEl', text: 'Ο καιρός είναι ωραίος σήμερα, οπότε θα πάμε βόλτα στο πάρκο.', bytes: 108, cl100k: 52, o200k: 23 },
]

const LLAMA3_TEMPLATE = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a helpful assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>

What is BPE?<|eot_id|><|start_header_id|>assistant<|end_header_id|>

`

const CHIP_COLORS = [
  'bg-purple-500/20 border-purple-500/40',
  'bg-cyan-500/20 border-cyan-500/40',
  'bg-emerald-500/20 border-emerald-500/40',
  'bg-orange-500/20 border-orange-500/40',
]

function TokenChips({ tokens }: { tokens: Tok[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tokens.map(([text, id], i) => (
        <span
          key={`${i}-${id}`}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border font-mono text-sm text-text ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
        >
          <span className="whitespace-pre">{text.startsWith(' ') ? `·${text.slice(1)}` : text}</span>
          <span className="text-[10px] text-muted">{id}</span>
        </span>
      ))}
    </div>
  )
}

export default function TokenizationPage() {
  const { t, locale } = useTranslation()
  const k = t.tokenization
  const enTax = TAX_ROWS[0]
  const ratio = (value: number, base: number) =>
    `${(value / base).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}×`

  const pipeline = [
    { name: k.pipelineStep1, desc: k.pipelineStep1Desc, value: `"${PIPELINE_EXAMPLE}"` },
    { name: k.pipelineStep2, desc: k.pipelineStep2Desc, value: '63 6f 73 74 73 20 31 32 …' },
    { name: k.pipelineStep3, desc: k.pipelineStep3Desc, value: PIPELINE_CHUNKS.map((c) => c.replace(/ /g, '·')).join(' | ') },
    { name: k.pipelineStep4, desc: k.pipelineStep4Desc, value: PIPELINE_TOKENS.map(([s]) => s.replace(/ /g, '·')).join(' | ') },
    { name: k.pipelineStep5, desc: k.pipelineStep5Desc, value: PIPELINE_TOKENS.map(([, id]) => id).join(', ') },
  ]

  return (
    <TopicLayout topicId="tokenization"
      title={k.title}
      description={k.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: k.title },
      ]}
    >
      {/* What is Tokenization + pipeline */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{k.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-8">{k.whatIsDesc}</p>
        <h3 className="text-lg font-bold font-heading text-text mb-1">{k.pipelineTitle}</h3>
        <p className="text-xs text-muted mb-4">{k.pipelineExample}</p>
        <ol className="space-y-2">
          {pipeline.map((step, i) => (
            <li key={step.name} className="grid md:grid-cols-[12rem_1fr] gap-2 items-center p-3 rounded-xl bg-background border border-border">
              <div>
                <div className="text-sm font-bold text-primary-light">{i + 1}. {step.name}</div>
                <div className="text-[11px] text-muted">{step.desc}</div>
              </div>
              <div className="font-mono text-sm text-text whitespace-pre-wrap break-all">{step.value}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* Byte-level + pre-tokenization */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{k.byteLevelTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{k.byteLevelDesc}</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {BYTE_EXAMPLES.map((ex) => (
            <div key={ex.char} className="p-4 rounded-xl bg-background border border-border">
              <div className="text-3xl mb-2">{ex.char}</div>
              <div className="text-xs font-mono text-muted mb-2">UTF-8: {ex.bytes}</div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {ex.tokens.map((tok, i) => (
                  <span key={i} className={`px-1.5 py-0.5 rounded-md border font-mono text-xs text-text ${CHIP_COLORS[i % CHIP_COLORS.length]}`}>
                    {tok}
                  </span>
                ))}
              </div>
              <div className={`text-xs ${ex.tokens.length === 1 ? 'text-emerald-400' : 'text-orange-400'}`}>
                {ex.tokens.length === 1 ? k.byteFrequent : k.byteRare}
              </div>
            </div>
          ))}
        </div>
        <h3 className="text-lg font-bold font-heading text-text mb-2">{k.preTokTitle}</h3>
        <p className="text-muted leading-relaxed">{k.preTokDesc}</p>
      </section>

      {/* Training vs encoding */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{k.trainVsEncodeTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{k.trainTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{k.trainDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{k.encodeTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{k.encodeDesc}</p>
          </div>
        </div>
      </section>

      {/* Mini-BPE demo */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-heading text-text">{k.bpeDemoTitle}</h2>
          <p className="text-sm text-muted">{k.bpeDemoDesc}</p>
        </div>
        <MiniBpeDemo />
      </section>

      {/* Real o200k examples */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{k.realExamplesTitle}</h2>
        <p className="text-muted mb-6">{k.realExamplesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-background border border-border space-y-3">
            <h3 className="text-lg font-bold font-heading text-purple-400">{k.exUnhappyTitle}</h3>
            {UNHAPPY.map((ex) => (
              <div key={ex.input} className="space-y-1">
                <div className="text-xs font-mono text-muted whitespace-pre">&quot;{ex.input}&quot;</div>
                <TokenChips tokens={ex.tokens} />
              </div>
            ))}
            <p className="text-sm text-muted">{k.exUnhappyDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-background border border-border space-y-3">
            <h3 className="text-lg font-bold font-heading text-cyan-400">{k.exCaseTitle}</h3>
            <TokenChips tokens={CASE_TOKENS} />
            <p className="text-sm text-muted">{k.exCaseDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-background border border-border space-y-3">
            <h3 className="text-lg font-bold font-heading text-emerald-400">{k.exNumbersTitle}</h3>
            <div className="text-xs font-mono text-muted">&quot;{PIPELINE_EXAMPLE}&quot;</div>
            <TokenChips tokens={PIPELINE_TOKENS} />
            <p className="text-sm text-muted">{k.exNumbersDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-background border border-border space-y-3">
            <h3 className="text-lg font-bold font-heading text-orange-400">{k.exCompoundTitle}</h3>
            <div className="text-xs font-mono text-muted">
              &quot; Donaudampfschifffahrtsgesellschaft&quot; · {k.tokensLabel.replace('{n}', String(COMPOUND.length))}
            </div>
            <TokenChips tokens={COMPOUND} />
            <p className="text-sm text-muted">{k.exCompoundDesc}</p>
          </div>
        </div>
      </section>

      {/* Multilingual token tax */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{k.multilingualTitle}</h2>
        <p className="text-muted leading-relaxed mb-2">{k.multilingualDesc}</p>
        <p className="text-xs text-muted mb-4">{k.multilingualSentence}</p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-background/60 text-muted">
              <tr>
                <th className="p-3 text-left font-bold">{k.colLanguage}</th>
                <th className="p-3 text-right font-bold">{k.colBytes}</th>
                <th className="p-3 text-right font-bold">{k.colCl100k}</th>
                <th className="p-3 text-right font-bold">{k.colO200k}</th>
              </tr>
            </thead>
            <tbody>
              {TAX_ROWS.map((row) => (
                <tr key={row.key} className="border-t border-border" title={row.text}>
                  <td className="p-3 text-text">{k[row.key]}</td>
                  <td className="p-3 text-right font-mono text-muted">{row.bytes}</td>
                  <td className="p-3 text-right font-mono">
                    <span className="text-text">{row.cl100k}</span>{' '}
                    <span className={row.cl100k / enTax.cl100k > 1.5 ? 'text-red-400' : 'text-muted'}>
                      ({ratio(row.cl100k, enTax.cl100k)})
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono">
                    <span className="text-text">{row.o200k}</span>{' '}
                    <span className={row.o200k / enTax.o200k > 1.2 ? 'text-orange-400' : 'text-emerald-400'}>
                      ({ratio(row.o200k, enTax.o200k)})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted mt-4 leading-relaxed">{k.multilingualNote}</p>
      </section>

      {/* Special tokens & chat templates */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{k.specialTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{k.specialDesc}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <div className="text-xs text-muted">{k.specialAsText}</div>
            <TokenChips tokens={SPECIAL_AS_TEXT} />
          </div>
          <div className="p-4 rounded-xl bg-background border border-orange-500/30 space-y-2">
            <div className="text-xs text-orange-400">{k.specialAsControl}</div>
            <TokenChips tokens={[['<|endoftext|>', 199999]]} />
          </div>
        </div>
        <h3 className="text-lg font-bold font-heading text-text mb-2">{k.templateTitle}</h3>
        <p className="text-sm text-muted mb-3">{k.templateDesc}</p>
        <pre className="p-4 rounded-xl bg-background border border-border text-xs font-mono text-text overflow-x-auto whitespace-pre-wrap">
          {LLAMA3_TEMPLATE.split(/(<\|[a-z_]+\|>)/).map((part, i) =>
            part.startsWith('<|') ? (
              <span key={i} className="text-orange-400">{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </pre>
        <p className="text-xs text-muted mt-3">{k.templateNote}</p>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-heading text-text">{k.interactiveDemo}</h2>
          <p className="text-sm text-muted">{k.demoDesc}</p>
        </div>
        <TokenizerDemo />
      </section>

      {/* Cost Implications */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{k.costImplications}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{k.costInputTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{k.costInputDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{k.costCacheTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{k.costCacheDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{k.costTokenizerTitle}</h3>
            <p className="text-sm text-muted leading-relaxed">{k.costTokenizerDesc}</p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{k.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[k.takeaway1, k.takeaway2, k.takeaway3, k.takeaway4].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary-light text-sm font-bold">{i + 1}</span>
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sources */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-5">{k.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {k.sources.map(({ label, href }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
