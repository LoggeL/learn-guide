'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Brain,
  Image as ImageIcon,
  Boxes,
  Languages,
  Mic,
  Shield,
  Building2,
  AudioLines,
  ExternalLink,
  CalendarClock,
  Check,
  Minus,
} from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { OpennessLadder } from '@/components/interactive/OpennessLadder'
import { OpenLicenseChecker } from '@/components/interactive/OpenLicenseChecker'
import { SelfHostDecision } from '@/components/interactive/SelfHostDecision'

const SOURCES = {
  osaid: 'https://opensource.org/ai/open-source-ai-definition',
  osaidRelease: 'https://www.infoworld.com/article/3593266/osi-unveils-open-source-ai-definition-1-0.html',
  llamaLicense: 'https://github.com/meta-llama/llama-models/blob/main/models/llama4/LICENSE',
  llamaAup: 'https://github.com/meta-llama/llama-models/blob/main/models/llama4/USE_POLICY.md',
  llama4Blog: 'https://ai.meta.com/blog/llama-4-multimodal-intelligence/',
  gemmaTerms: 'https://ai.google.dev/gemma/terms',
  gemma4: 'https://opensource.googleblog.com/2026/03/gemma-4-expanding-the-gemmaverse-with-apache-20.html',
  deepseekV4: 'https://api-docs.deepseek.com/news/news260424',
  qwen36: 'https://huggingface.co/Qwen/Qwen3.6-27B',
  mistral3: 'https://mistral.ai/news/mistral-3',
  mistralSmall4: 'https://mistral.ai/news/mistral-small-4',
  mistralLarge4: 'https://mistral.ai/news/mistral-large-4',
  gptOss: 'https://openai.com/index/introducing-gpt-oss/',
  museSpark: 'https://www.theregister.com/2026/04/08/meta_muse_spark/',
  museOpen: 'https://www.deeplearning.ai/the-batch/meta-releases-wonder-opens-spark/',
  deepseekV3: 'https://arxiv.org/html/2412.19437v2',
  mistralRound: 'https://www.orrick.com/en/News/2026/09/Orrick-Advises-Mistral-in-its-3B-Series-D-at-21B-Post-Money-Valuation',
  bflRound: 'https://techcrunch.com/2025/12/01/black-forest-labs-raises-300m-at-3-25b-valuation/',
  flux2: 'https://bfl.ai/blog/flux-2',
  deeplRound: 'https://the-decoder.com/deepl-translates-rising-demand-for-ai-into-a-300-million-investment/',
  elevenRound: 'https://www.thestar.com.my/tech/tech-news/2026/02/04/elevenlabs-raises-500-million-at-11-billion-valuation-wsj-reports',
  helsingRound: 'https://helsing.ai/newsroom/helsing-raises-1-8bn-in-series-e',
  alephPivot: 'https://techcrunch.com/2024/09/05/german-llm-maker-aleph-alpha-pivots-to-ai-support/',
  cohereAleph: 'https://www.prnewswire.com/news-releases/cohere-and-aleph-alpha-sign-agreement-to-become-the-first-transatlantic-sovereign-ai-solution-302880732.html',
  moshi: 'https://github.com/kyutai-labs/moshi',
  openEuroLlm: 'https://openeurollm.eu/blog/first-year-progress-and-next-steps',
  apertus: 'https://ethz.ch/en/news-and-events/eth-news/news/2025/09/press-release-apertus-a-fully-open-transparent-multilingual-language-model.html',
  teuken: 'https://www.iais.fraunhofer.de/en/industries_and_cross-sector_solutions/cross-sector_solutions/generative-ai/opengpt-x.html',
} as const

type SourceKey = keyof typeof SOURCES

// Release facts as of 2026-10-28; every row links to its primary source.
// "{dense}" is replaced by the localized label.
const FAMILIES: {
  model: string
  provider: string
  released: string
  params: string
  license: string
  source: SourceKey
}[] = [
  { model: 'Muse Spark Open', provider: 'Meta', released: '2026-10', params: '816B / 42B', license: 'Muse Model License', source: 'museOpen' },
  { model: 'DeepSeek V4 Pro · Flash', provider: 'DeepSeek', released: '2026-04-24', params: '1.6T / 49B · 284B / 13B', license: 'MIT', source: 'deepseekV4' },
  { model: 'Qwen3.6-27B · 35B-A3B', provider: 'Alibaba', released: '2026-04-22', params: '27B {dense} · 35B / 3B', license: 'Apache-2.0', source: 'qwen36' },
  { model: 'Gemma 4', provider: 'Google', released: '2026-04-02', params: 'E2B, E4B, 26B (MoE), 31B ({dense})', license: 'Apache-2.0', source: 'gemma4' },
  { model: 'Mistral Small 4', provider: 'Mistral AI', released: '2026-03-16', params: '119B / 6B', license: 'Apache-2.0', source: 'mistralSmall4' },
  { model: 'Mistral Large 3', provider: 'Mistral AI', released: '2025-12-02', params: '675B / 41B', license: 'Apache-2.0', source: 'mistral3' },
  { model: 'Apertus 8B · 70B', provider: 'Swiss AI (ETH, EPFL, CSCS)', released: '2025-09-02', params: '8B · 70B {dense}', license: 'Apache-2.0', source: 'apertus' },
  { model: 'gpt-oss-120b · 20b', provider: 'OpenAI', released: '2025-08-05', params: '117B / 5.1B · 21B / 3.6B', license: 'Apache-2.0', source: 'gptOss' },
  { model: 'Llama 4 Scout · Maverick', provider: 'Meta', released: '2025-04-05', params: '109B / 17B · 400B / 17B', license: 'Llama 4 Community License', source: 'llama4Blog' },
]

type ActorKey = 'mistral' | 'bfl' | 'huggingface' | 'deepl' | 'elevenlabs' | 'helsing' | 'alephAlpha' | 'kyutai'

const ACTORS: {
  key: ActorKey
  name: string
  icon: typeof Brain
  gradient: string
  website: string
  sources: SourceKey[]
}[] = [
  { key: 'mistral', name: 'Mistral AI', icon: Brain, gradient: 'from-orange-500 to-red-500', website: 'https://mistral.ai', sources: ['mistralRound', 'mistral3'] },
  { key: 'bfl', name: 'Black Forest Labs', icon: ImageIcon, gradient: 'from-pink-500 to-rose-500', website: 'https://bfl.ai', sources: ['bflRound', 'flux2'] },
  { key: 'huggingface', name: 'Hugging Face', icon: Boxes, gradient: 'from-amber-400 to-yellow-500', website: 'https://huggingface.co', sources: [] },
  { key: 'deepl', name: 'DeepL', icon: Languages, gradient: 'from-sky-500 to-blue-600', website: 'https://www.deepl.com', sources: ['deeplRound'] },
  { key: 'elevenlabs', name: 'ElevenLabs', icon: Mic, gradient: 'from-indigo-500 to-purple-500', website: 'https://elevenlabs.io', sources: ['elevenRound'] },
  { key: 'helsing', name: 'Helsing', icon: Shield, gradient: 'from-slate-400 to-zinc-600', website: 'https://helsing.ai', sources: ['helsingRound'] },
  { key: 'alephAlpha', name: 'Aleph Alpha', icon: Building2, gradient: 'from-blue-500 to-cyan-500', website: 'https://aleph-alpha.com', sources: ['alephPivot', 'cohereAleph'] },
  { key: 'kyutai', name: 'Kyutai', icon: AudioLines, gradient: 'from-purple-500 to-pink-500', website: 'https://kyutai.org', sources: ['moshi'] },
]

const INITIATIVES: { key: 'openEuroLlm' | 'apertus' | 'teuken'; name: string; source: SourceKey }[] = [
  { key: 'openEuroLlm', name: 'OpenEuroLLM', source: 'openEuroLlm' },
  { key: 'apertus', name: 'Apertus', source: 'apertus' },
  { key: 'teuken', name: 'Teuken-7B (OpenGPT-X)', source: 'teuken' },
]

const sectionCls = 'rounded-2xl border border-border bg-surface/50 p-6 md:p-8'
const h2Cls = 'mb-4 text-2xl font-bold font-heading text-gradient'
const linkCls = 'text-primary-light underline decoration-primary/30 underline-offset-4 hover:decoration-primary-light'

export default function OpenModelsSovereigntyPage() {
  const { t, locale } = useTranslation()
  const o = t.openSource

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    const date = new Date(Date.UTC(y, m - 1, d ?? 1))
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
      day: d ? 'numeric' : undefined,
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date)
  }
  const formatParams = (p: string) => {
    const withLabel = p.split('{dense}').join(o.dense)
    return locale === 'de' ? withLabel.replace(/(\d)\.(\d)/g, '$1,$2') : withLabel
  }

  const SourceLink = ({ k }: { k: SourceKey }) => (
    <a href={SOURCES[k]} target="_blank" rel="noopener noreferrer" className={linkCls}>
      {o.sources[k]}
    </a>
  )

  return (
    <TopicLayout
      topicId="open-source"
      title={o.title}
      description={o.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: o.title },
      ]}
    >
      {/* Intro */}
      <section className={sectionCls}>
        <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs text-muted">
          <CalendarClock size={14} />
          {o.asOf}
        </div>
        <h2 className={h2Cls}>{o.introTitle}</h2>
        <div className="space-y-4 text-lg leading-relaxed text-muted">
          <p>{o.introP1}</p>
          <p>{o.introP2}</p>
        </div>
      </section>

      {/* Openness ladder */}
      <section className={sectionCls}>
        <h2 className={h2Cls}>{o.ladderTitle}</h2>
        <p className="mb-6 text-muted">{o.ladderDesc}</p>
        <OpennessLadder />
      </section>

      {/* OSI definition */}
      <section className={sectionCls}>
        <h2 className={h2Cls}>{o.osiTitle}</h2>
        <p className="mb-6 leading-relaxed text-muted">{o.osiDesc}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-5">
            <h3 className="mb-3 text-lg font-bold font-heading text-cyan-400">{o.freedomsTitle}</h3>
            <ul className="space-y-2 text-sm text-muted">
              {[o.freedomUse, o.freedomStudy, o.freedomModify, o.freedomShare].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-cyan-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-5">
            <h3 className="mb-3 text-lg font-bold font-heading text-purple-400">{o.componentsTitle}</h3>
            <dl className="space-y-3 text-sm">
              {[
                [o.compData, o.compDataDesc],
                [o.compCode, o.compCodeDesc],
                [o.compParams, o.compParamsDesc],
              ].map(([term, desc]) => (
                <div key={term}>
                  <dt className="font-semibold text-text">{term}</dt>
                  <dd className="text-muted">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <p className="mt-5 rounded-xl border border-border bg-background/60 p-4 text-sm text-muted">{o.osiConsequence}</p>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <SourceLink k="osaid" />
          <SourceLink k="osaidRelease" />
        </p>
      </section>

      {/* Licenses */}
      <section className={sectionCls}>
        <h2 className={h2Cls}>{o.licenseTitle}</h2>
        <p className="mb-6 text-muted">{o.licenseDesc}</p>
        <OpenLicenseChecker />
        <p className="mt-5 text-sm text-muted">{o.licenseNote}</p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <SourceLink k="llamaLicense" />
          <SourceLink k="llamaAup" />
          <SourceLink k="gemmaTerms" />
          <SourceLink k="museOpen" />
        </p>
      </section>

      {/* Open-weight families */}
      <section className={sectionCls}>
        <h2 className={h2Cls}>{o.familiesTitle}</h2>
        <p className="mb-6 text-muted">{o.familiesDesc}</p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-background/60 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="p-3">{o.colModel}</th>
                <th className="p-3">{o.colProvider}</th>
                <th className="p-3">{o.colReleased}</th>
                <th className="p-3">{o.colParams}</th>
                <th className="p-3">{o.colFamilyLicense}</th>
              </tr>
            </thead>
            <tbody>
              {FAMILIES.map((f, i) => (
                <tr key={f.model} className={`border-t border-border ${i % 2 ? 'bg-background/30' : ''}`}>
                  <td className="p-3 font-semibold">
                    <a href={SOURCES[f.source]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-text hover:text-primary-light">
                      {f.model}
                      <ExternalLink size={12} className="text-muted" />
                    </a>
                  </td>
                  <td className="p-3 text-muted">{f.provider}</td>
                  <td className="whitespace-nowrap p-3 text-muted">{formatDate(f.released)}</td>
                  <td className="p-3 font-mono text-xs text-muted">{formatParams(f.params)}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-xs ${
                        f.license === 'Apache-2.0' || f.license === 'MIT'
                          ? 'border-emerald-500/30 text-emerald-400'
                          : 'border-amber-400/30 text-amber-300'
                      }`}
                    >
                      {f.license}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-5 space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <Minus size={16} className="mt-0.5 shrink-0" />
            <span>
              {o.familiesNoteMistral} <SourceLink k="mistralLarge4" />
            </span>
          </li>
          <li className="flex gap-2">
            <Minus size={16} className="mt-0.5 shrink-0" />
            <span>
              {o.familiesNoteMeta} <SourceLink k="museSpark" />
            </span>
          </li>
        </ul>
        <div className="mt-6 rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-red-500/5 p-5">
          <h3 className="mb-2 text-lg font-bold font-heading text-orange-400">{o.costTitle}</h3>
          <p className="text-sm leading-relaxed text-muted">{o.costDesc}</p>
          <p className="mt-2 text-sm">
            <SourceLink k="deepseekV3" />
          </p>
        </div>
      </section>

      {/* European players */}
      <section id="european-players" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{o.europeTitle}</h2>
        <p className="text-muted">{o.europeDesc}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {ACTORS.map((actor) => {
            const Icon = actor.icon
            const text = o.actors[actor.key] as { loc: string; work: string; figure?: string; lesson?: string }
            return (
              <motion.article
                key={actor.key}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
              >
                <div className="flex items-start gap-3">
                  <div className={`h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br ${actor.gradient} p-0.5`}>
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-surface">
                      <Icon size={20} className="text-text" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <a
                      href={actor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-lg font-semibold font-heading text-text hover:text-primary-light"
                    >
                      {actor.name}
                      <ExternalLink size={13} className="text-muted" />
                    </a>
                    <p className="text-xs text-primary-light">{text.loc}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted">{text.work}</p>
                {text.lesson && (
                  <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">{text.lesson}</p>
                )}
                {text.figure && (
                  <p className="rounded-lg border border-border bg-background/60 p-3 text-sm text-text">{text.figure}</p>
                )}
                {actor.sources.length > 0 && (
                  <p className="mt-auto text-xs text-muted">
                    {o.sourceLabel}:{' '}
                    {actor.sources.map((s, i) => (
                      <span key={s}>
                        {i > 0 && ' · '}
                        <SourceLink k={s} />
                      </span>
                    ))}
                  </p>
                )}
              </motion.article>
            )
          })}
        </div>
      </section>

      {/* Public initiatives */}
      <section className={sectionCls}>
        <h2 className={h2Cls}>{o.initiativesTitle}</h2>
        <p className="mb-6 text-muted">{o.initiativesDesc}</p>
        <div className="grid gap-4 lg:grid-cols-3">
          {INITIATIVES.map((ini) => (
            <article key={ini.key} className="flex flex-col gap-3 rounded-xl border border-border bg-background/60 p-5">
              <h3 className="text-lg font-bold font-heading text-text">{ini.name}</h3>
              <p className="text-sm leading-relaxed text-muted">{o.initiatives[ini.key].desc}</p>
              <p className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-sm text-muted">
                <span className="font-semibold text-cyan-400">{o.statusLabel}: </span>
                {o.initiatives[ini.key].status}
              </p>
              <p className="mt-auto text-xs">
                <SourceLink k={ini.source} />
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Sovereignty */}
      <section className={sectionCls}>
        <h2 className={h2Cls}>{o.sovereigntyTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5">
            <h3 className="mb-3 text-lg font-bold font-heading text-emerald-400">{o.sovGives}</h3>
            <ul className="space-y-2 text-sm text-muted">
              {[o.sovGives1, o.sovGives2, o.sovGives3, o.sovGives4].map((item) => (
                <li key={item} className="flex gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/5 p-5">
            <h3 className="mb-3 text-lg font-bold font-heading text-orange-400">{o.sovNot}</h3>
            <ul className="space-y-2 text-sm text-muted">
              {[o.sovNot1, o.sovNot2, o.sovNot3, o.sovNot4].map((item) => (
                <li key={item} className="flex gap-2">
                  <Minus size={16} className="mt-0.5 shrink-0 text-orange-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm text-muted">{o.sovNote}</p>
        <Link href={`/${locale}/ai/safety/responsible-ai`} className={`mt-3 inline-block text-sm ${linkCls}`}>
          {o.sovAiActLink}
        </Link>
      </section>

      {/* Decision aid */}
      <section className={sectionCls}>
        <h2 className={h2Cls}>{o.decisionTitle}</h2>
        <p className="mb-6 text-muted">{o.decisionDesc}</p>
        <SelfHostDecision />
        <div className="mt-6 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-6">
          <span className="font-semibold text-text">{o.nextSteps}:</span>
          <Link href={`/${locale}/ai/llm-inference/vram-calc`} className={linkCls}>
            {o.linkVram}
          </Link>
          <Link href={`/${locale}/ai/llm-inference/local-inference`} className={linkCls}>
            {o.linkLocal}
          </Link>
        </div>
      </section>

      {/* Sources */}
      <section className={sectionCls}>
        <h2 className={h2Cls}>{o.sourcesTitle}</h2>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {(Object.keys(SOURCES) as SourceKey[]).map((k) => (
            <li key={k}>
              <SourceLink k={k} />
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
