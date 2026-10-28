'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { WorldModelPlanningDemo } from '@/components/interactive/WorldModelPlanningDemo'
import { Latex } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const SOURCES = {
  ha: { title: 'Ha & Schmidhuber: World Models (2018)', url: 'https://arxiv.org/abs/1803.10122' },
  dreamerV3: { title: 'Hafner et al.: Mastering diverse control tasks through world models (DreamerV3, Nature 2025)', url: 'https://www.nature.com/articles/s41586-025-08744-2' },
  dreamer4: { title: 'Hafner, Yan & Lillicrap: Training Agents Inside of Scalable World Models (Dreamer 4, 2025)', url: 'https://arxiv.org/abs/2509.24527' },
  muzero: { title: 'Schrittwieser et al.: Mastering Atari, Go, chess and shogi by planning with a learned model (MuZero, Nature 2020)', url: 'https://www.nature.com/articles/s41586-020-03051-4' },
  lecun: { title: 'LeCun: A Path Towards Autonomous Machine Intelligence (2022)', url: 'https://openreview.net/forum?id=BZ5a1r-kVsf' },
  vjepa2: { title: 'Assran et al.: V-JEPA 2 – Self-Supervised Video Models Enable Understanding, Prediction and Planning (2025)', url: 'https://arxiv.org/abs/2506.09985' },
  genie: { title: 'Bruce et al.: Genie – Generative Interactive Environments (ICML 2024)', url: 'https://arxiv.org/abs/2402.15391' },
  genie3: { title: 'Google DeepMind: Genie 3 – a new frontier for world models (2025)', url: 'https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/' },
  projectGenie: { title: 'Google: Project Genie (2026)', url: 'https://blog.google/innovation-and-ai/models-and-research/google-deepmind/project-genie/' },
  cosmos: { title: 'NVIDIA: Cosmos World Foundation Model Platform for Physical AI (2025)', url: 'https://arxiv.org/abs/2501.03575' },
  gaia: { title: 'Hu et al.: GAIA-1 – A Generative World Model for Autonomous Driving (2023)', url: 'https://arxiv.org/abs/2309.17080' },
  genesis: { title: 'Genesis documentation', url: 'https://genesis-world.readthedocs.io/en/latest/' },
} as const

const FAMILY_SOURCES = {
  dreamer: [SOURCES.dreamerV3, SOURCES.dreamer4],
  muzero: [SOURCES.muzero],
  jepa: [SOURCES.lecun, SOURCES.vjepa2],
  genie: [SOURCES.genie, SOURCES.genie3, SOURCES.projectGenie],
} as const

const APPLIED_SOURCES = [SOURCES.cosmos, SOURCES.gaia, SOURCES.genesis]
const FAMILY_ORDER = ['dreamer', 'muzero', 'jepa', 'genie'] as const
const FAMILY_ACCENT = {
  dreamer: 'text-purple-400',
  muzero: 'text-cyan-400',
  jepa: 'text-emerald-400',
  genie: 'text-orange-400',
} as const

const DYNAMICS = 'z_t = \\text{enc}_\\theta(o_t), \\qquad \\hat z_{t+1} = f_\\theta(z_t, a_t), \\qquad \\hat r_{t+1} = g_\\theta(z_t, a_t)'
const ENV = 'p(s_{t+1},\\, r_{t+1} \\mid s_t,\\, a_t)'

const RELATED = [
  { id: 'reinforcement-learning', path: '/ai/ml-fundamentals/reinforcement-learning' },
  { id: 'multimodality', path: '/ai/llm/multimodality' },
] as const

function SourceLink({ title, url, small = false }: { title: string; url: string; small?: boolean }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 text-primary-light hover:underline ${small ? 'text-xs' : 'text-sm'}`}>
      {title}
      <ExternalLink size={small ? 12 : 14} className="shrink-0" aria-hidden="true" />
    </a>
  )
}

export default function WorldModelsPage() {
  const { t, locale } = useTranslation()
  const w = t.worldModels

  return (
    <TopicLayout
      topicId="world-models"
      title={w.title}
      description={w.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: w.title },
      ]}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{w.whatIsTitle}</h2>
        <p className="text-muted leading-relaxed text-lg">{w.whatIsDesc}</p>
        <div className="overflow-x-auto text-text">
          <Latex block>{ENV}</Latex>
        </div>
        <div className="overflow-x-auto rounded-xl border border-primary/25 bg-primary/5 p-4 text-text">
          <Latex block>{DYNAMICS}</Latex>
          <p className="mt-2 text-xs text-muted">{w.formulaNote}</p>
        </div>
        <p className="text-muted leading-relaxed">{w.whatIsDesc2}</p>
        <SourceLink {...SOURCES.ha} small />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{w.modelBasedTitle}</h2>
        <p className="text-muted leading-relaxed">{w.modelBasedDesc}</p>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 text-sm text-muted leading-relaxed">
          {w.modelBasedTradeoff}
        </div>
      </section>

      <WorldModelPlanningDemo />

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{w.partsTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{w.partsIntro}</p>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {w.parts.map((part, i) => (
            <li key={part.name} className="rounded-xl bg-surface/70 border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light text-xs font-bold">{i + 1}</span>
                <h3 className="font-bold font-heading text-text">{part.name}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">{part.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{w.familiesTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{w.familiesIntro}</p>
        <div className="space-y-5">
          {FAMILY_ORDER.map((id) => {
            const f = w.families[id]
            return (
              <article key={id} className="rounded-2xl border border-border bg-surface/50 p-6">
                <h3 className={`text-xl font-bold font-heading ${FAMILY_ACCENT[id]}`}>{f.name}</h3>
                <p className="text-sm font-semibold text-text mt-1 mb-3">{f.tagline}</p>
                <p className="text-sm text-muted leading-relaxed mb-3">{f.how}</p>
                <p className="text-sm text-muted leading-relaxed mb-4">{f.result}</p>
                <div className="flex flex-col gap-2">
                  {FAMILY_SOURCES[id].map((source) => (
                    <SourceLink key={source.url} {...source} small />
                  ))}
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface-elevated text-text">
              <tr>
                <th className="p-3" />
                <th className="p-3">{w.predictsLabel}</th>
                <th className="p-3">{w.actionsLabel}</th>
                <th className="p-3">{w.useLabel}</th>
              </tr>
            </thead>
            <tbody>
              {FAMILY_ORDER.map((id) => (
                <tr key={id} className="border-t border-border">
                  <th className={`p-3 font-heading ${FAMILY_ACCENT[id]}`}>{w.families[id].name}</th>
                  <td className="p-3 text-muted">{w.families[id].predicts}</td>
                  <td className="p-3 text-muted">{w.families[id].actions}</td>
                  <td className="p-3 text-muted">{w.families[id].use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{w.distinctionTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {w.distinction.map((item) => (
            <div key={item.title} className="rounded-xl bg-surface/70 border border-border p-5">
              <h3 className="font-bold font-heading text-text mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{w.appliedTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {w.applied.map((item, i) => (
            <div key={item.name} className="rounded-xl bg-background border border-border p-5">
              <h3 className="font-bold font-heading text-text mb-2">{item.name}</h3>
              <p className="text-sm text-muted leading-relaxed mb-3">{item.desc}</p>
              <SourceLink {...APPLIED_SOURCES[i]} small />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{w.limitsTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {w.limits.map((item) => (
            <div key={item.title} className="rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20 p-5">
              <h3 className="font-bold font-heading text-orange-400 mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{w.takeawaysTitle}</h2>
        <ul className="space-y-3">
          {w.takeaways.map((item) => (
            <li key={item} className="flex gap-3 text-muted leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-gradient">{w.relatedTitle}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {RELATED.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${item.path}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/55 p-4 hover:border-primary/45"
            >
              <span className="font-heading font-bold text-text group-hover:text-primary-light">{t.topicNames[item.id]}</span>
              <ArrowRight size={18} className="shrink-0 text-primary-light" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-xl font-bold text-text">{w.sourcesTitle}</h2>
        <ul className="mt-4 space-y-3">
          {Object.values(SOURCES).map((source) => (
            <li key={source.url}>
              <SourceLink {...source} />
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
