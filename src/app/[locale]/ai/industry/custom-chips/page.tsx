'use client'
import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { ChipRooflineCalculator } from '@/components/interactive/ChipRooflineCalculator'
import { ChipSpecTable } from '@/components/interactive/ChipSpecTable'
import { chipSpecs, rooflineModels } from '@/lib/chip-specs'

const spec = (id: string) => chipSpecs.find((chip) => chip.id === id)!

export default function CustomChipsPage() {
  const { t, locale } = useTranslation()
  const c = t.customChips
  const nf = (v: number, digits = 1) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(v)

  // Generation comparison computed from the datasheet table (dense FP8).
  const h100 = spec('h100')
  const rubin = spec('rubin')
  const groq = spec('groq')
  const memoryWall = c.memoryWallP2
    .replace('{compute}', nf(rubin.fp8DenseTF! / h100.fp8DenseTF!))
    .replace('{bandwidth}', nf(rubin.bandwidthTBs / h100.bandwidthTBs))
    .replace('{capacity}', nf(rubin.memoryGB / h100.memoryGB))
  // FP8: 1 byte per weight, so GB of weights = billions of parameters
  const llama70 = rooflineModels.find((model) => model.id === '70b')!
  const groqChips = Math.ceil(llama70.paramsB / groq.memoryGB)

  const families = [
    { title: c.familyGpuTitle, desc: c.familyGpu, color: 'text-emerald-400' },
    { title: c.familyTpuTitle, desc: c.familyTpu, color: 'text-cyan-400' },
    { title: c.familyHyperTitle, desc: c.familyHyper, color: 'text-purple-400' },
    { title: c.familySramTitle, desc: c.familySram, color: 'text-orange-400' },
    { title: c.familyAsicTitle, desc: c.familyAsic, color: 'text-pink-400' },
    { title: c.familyNpuTitle, desc: c.familyNpu, color: 'text-yellow-400' },
    { title: c.familyFpgaTitle, desc: c.familyFpga, color: 'text-blue-400' },
  ]

  const checklist = [
    c.checkMemory,
    c.checkBound,
    c.checkOperators,
    c.checkScale,
    c.checkCost,
  ]

  const sources = [
    [c.srcRoofline, 'https://doi.org/10.1145/1498765.1498785'],
    [c.srcScalingBook, 'https://jax-ml.github.io/scaling-book/roofline/'],
    [c.srcMemoryWall, 'https://arxiv.org/abs/2403.14123'],
    [
      c.srcHbm4,
      'https://www.businesswire.com/news/home/20250416843598/en',
    ],
    [
      c.srcGroqNvidia,
      'https://groq.com/newsroom/groq-and-nvidia-enter-non-exclusive-inference-technology-licensing-agreement-to-accelerate-ai-inference-at-global-scale',
    ],
    [c.srcEtched, 'https://www.theregister.com/2024/06/26/etched_asic_ai/'],
  ]

  return (
    <TopicLayout
      topicId="custom-chips"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: c.title },
      ]}
    >
      {/* Two numbers */}
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient">
          {c.introTitle}
        </h2>
        <p className="text-muted leading-relaxed">{c.introP1}</p>
        <p className="text-muted leading-relaxed">{c.introP2}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="text-xs font-semibold text-cyan-400 mb-1">
              {c.formulaTimeLabel}
            </div>
            <code className="text-sm text-text">{c.formulaTime}</code>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <div className="text-xs font-semibold text-purple-400 mb-1">
              {c.formulaIntensityLabel}
            </div>
            <code className="text-sm text-text">{c.formulaIntensity}</code>
          </div>
        </div>
      </section>

      {/* Decode vs prefill */}
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient">
          {c.decodeTitle}
        </h2>
        <p className="text-muted leading-relaxed">{c.decodeP1}</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
            <h3 className="font-bold text-orange-400 mb-1">{c.decodeCardTitle}</h3>
            <p className="text-sm text-muted">{c.decodeCard}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <h3 className="font-bold text-emerald-400 mb-1">{c.batchCardTitle}</h3>
            <p className="text-sm text-muted">{c.batchCard}</p>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <h3 className="font-bold text-purple-400 mb-1">{c.kvCardTitle}</h3>
            <p className="text-sm text-muted">{c.kvCard}</p>
          </div>
        </div>
        <p className="text-muted leading-relaxed">{c.prefillP}</p>
      </section>

      {/* Calculator */}
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <ChipRooflineCalculator />
      </section>

      {/* Memory wall & HBM */}
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient">
          {c.memoryWallTitle}
        </h2>
        <p className="text-muted leading-relaxed">{c.memoryWallP1}</p>
        <p className="text-muted leading-relaxed">{memoryWall}</p>
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 space-y-3">
          <h3 className="text-lg font-bold font-heading text-cyan-400">
            {c.hbmTitle}
          </h3>
          <p className="text-sm text-muted leading-relaxed">{c.hbmP1}</p>
          <code className="block text-sm text-text">{c.hbmFormula}</code>
          <p className="text-sm text-muted leading-relaxed">{c.hbmP2}</p>
        </div>
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 space-y-3">
          <h3 className="text-lg font-bold font-heading text-orange-400">
            {c.sramTitle}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            {c.sramP.replace('{chips}', String(groqChips))}
          </p>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          {c.memoryWallMegaKernels}{' '}
          <Link
            href="/ai/llm-inference/mega-kernels"
            className="text-primary-light hover:underline"
          >
            {t.topicNames['mega-kernels']}
          </Link>
        </p>
      </section>

      {/* Datasheet table */}
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <ChipSpecTable />
      </section>

      {/* Families */}
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient">
          {c.familiesTitle}
        </h2>
        <p className="text-muted leading-relaxed">{c.familiesIntro}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {families.map((family) => (
            <div
              key={family.title}
              className="rounded-xl border border-border bg-background/60 p-5"
            >
              <h3 className={`font-bold font-heading mb-2 ${family.color}`}>
                {family.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{family.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient">
          {c.checklistTitle}
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {checklist.map((question, i) => (
            <li
              key={question}
              className="flex gap-3 rounded-xl border border-border bg-background/60 p-4 text-sm text-text"
            >
              <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 text-primary-light font-bold">
                {i + 1}
              </span>
              <span className="leading-relaxed">{question}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Strategy */}
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient">
          {c.strategicTitle}
        </h2>
        <p className="text-muted leading-relaxed">{c.strategicDesc1}</p>
        <p className="text-muted leading-relaxed">{c.strategicDesc2}</p>
        <p className="text-muted leading-relaxed">{c.strategicDesc3}</p>
      </section>

      {/* Sources */}
      <section className="space-y-3 rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="text-xl font-bold font-heading text-gradient">
          {c.sourcesTitle}
        </h2>
        <ul className="space-y-2 text-sm">
          {sources.map(([label, url]) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-primary-light hover:underline"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">{c.sourcesNote}</p>
      </section>
    </TopicLayout>
  )
}
