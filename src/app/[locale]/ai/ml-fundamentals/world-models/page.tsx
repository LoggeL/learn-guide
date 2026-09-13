'use client'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import {
  WorldModelPipeline,
  SimToRealToggle,
} from '@/components/interactive/WorldModelVisualizer'

export default function WorldModelsPage() {
  const { t } = useTranslation(),
    w = t.worldModels,
    c = t.vramCalc.audit
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
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{w.howTheyWork}</h2>
        <p className="text-muted">{w.howTheyWorkDesc}</p>
        <p className="text-muted">{c.worldDistinction}</p>
        <WorldModelPipeline />
      </section>
      <SimToRealToggle />
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{c.worldExamples}</h2>
        <p className="text-sm text-muted">{c.worldHistorical}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-lg border border-border p-4">
            <h3 className="mb-2 font-semibold">Genie 3 / Project Genie</h3>
            <p className="text-sm text-muted">{c.worldGenie}</p>
            <a
              href="https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/"
              className="text-sm text-primary-light underline"
              target="_blank"
              rel="noreferrer"
            >
              DeepMind (2025)
            </a>
          </article>
          <article className="rounded-lg border border-border p-4">
            <h3 className="mb-2 font-semibold">Genesis</h3>
            <p className="text-sm text-muted">{c.worldGenesis}</p>
            <a
              href="https://genesis-world.readthedocs.io/en/latest/"
              className="text-sm text-primary-light underline"
              target="_blank"
              rel="noreferrer"
            >
              Genesis
            </a>
          </article>
        </div>
        <a
          href="https://arxiv.org/abs/1803.10122"
          className="block text-sm text-primary-light underline"
          target="_blank"
          rel="noreferrer"
        >
          Ha &amp; Schmidhuber: World Models (2018)
        </a>
        <a
          href="https://deepmind.google/models/genie/"
          className="block text-sm text-primary-light underline"
          target="_blank"
          rel="noreferrer"
        >
          Genie
        </a>
      </section>
    </TopicLayout>
  )
}
