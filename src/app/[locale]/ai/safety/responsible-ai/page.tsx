'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { AiActObligationsExplorer } from '@/components/interactive/AiActObligationsExplorer'
import { useTranslation } from '@/lib/i18n/context'

const AS_OF = '2026-10-28'

export default function ResponsibleAIPage() {
  const { t, locale } = useTranslation()
  const r = t.responsibleAi
  const formatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
  const fmt = (iso: string) => formatter.format(new Date(`${iso}T00:00:00Z`))

  return (
    <TopicLayout topicId="responsible-ai"
      title={r.title}
      description={r.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.safety, href: '/ai/safety' },
        { label: r.title },
      ]}
    >
      {/* From principles to processes */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{r.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">{r.whatIsDesc}</p>
        <Link href={`/${locale}/ai/safety/bias`} className="inline-block mt-4 text-sm text-primary-light underline">{r.biasLink}</Link>
      </section>

      {/* EU AI Act timeline */}
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
          <h2 className="text-2xl font-bold font-heading text-gradient">{r.actTitle}</h2>
          <span className="text-xs px-2 py-1 rounded-full border border-border text-muted">{r.asOf}</span>
        </div>
        <p className="text-muted leading-relaxed mb-6">{r.actIntro}</p>
        <ol className="relative border-l border-border ml-2 space-y-5">
          {r.milestones.map((m, i) => {
            const past = m.date <= AS_OF
            return (
              <motion.li
                key={m.date}
                className="ml-5"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.2) }}
              >
                <span className={`absolute -left-[7px] mt-1.5 w-3.5 h-3.5 rounded-full border-2 ${past ? 'bg-primary border-primary' : 'bg-background border-muted'}`} />
                <div className={`text-sm font-mono ${past ? 'text-primary-light' : 'text-muted'}`}>{fmt(m.date)}</div>
                <h3 className="font-bold text-text">{m.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{m.desc}</p>
              </motion.li>
            )
          })}
        </ol>

        <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/20">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <h3 className="text-lg font-bold font-heading text-orange-400">{r.omnibusTitle}</h3>
            <span className="text-xs text-muted">{r.asOf}</span>
          </div>
          <ul className="space-y-2 text-sm text-muted mb-3">
            {r.omnibusSteps.map(step => (
              <li key={step} className="flex gap-2"><span className="text-orange-400">•</span><span>{step}</span></li>
            ))}
          </ul>
          <p className="text-sm text-text leading-relaxed">{r.omnibusNote}</p>
        </div>
      </section>

      {/* Interactive tool */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{r.toolTitle}</h2>
        <p className="text-sm text-muted mb-6">{r.toolDesc}</p>
        <AiActObligationsExplorer />
      </section>

      {/* GPAI */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{r.gpaiTitle}</h2>
        <p className="text-muted leading-relaxed">{r.gpaiP1}</p>
        <p className="text-muted leading-relaxed">{r.gpaiP2}</p>
      </section>

      {/* Other frameworks */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{r.frameworksTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.frameworksDesc}</p>
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-3">{r.nistTitle}</h3>
            <p className="text-sm text-muted mb-4">{r.nistDesc}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                [r.nistGovern, r.nistGovernDesc],
                [r.nistMap, r.nistMapDesc],
                [r.nistMeasure, r.nistMeasureDesc],
                [r.nistManage, r.nistManageDesc],
              ].map(([name, desc]) => (
                <div key={name} className="p-3 bg-background/50 rounded-lg text-center">
                  <div className="font-bold text-blue-400 mb-1">{name}</div>
                  <div className="text-xs text-muted">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-3">{r.isoTitle}</h3>
            <p className="text-sm text-muted mb-4">{r.isoDesc}</p>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                [r.isoPolicy, r.isoPolicyDesc],
                [r.isoRisk, r.isoRiskDesc],
                [r.isoImprovement, r.isoImprovementDesc],
              ].map(([name, desc]) => (
                <div key={name} className="p-3 bg-background/50 rounded-lg">
                  <div className="font-bold text-purple-400 text-sm mb-1">{name}</div>
                  <div className="text-xs text-muted">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-3">{r.oecdTitle}</h3>
            <p className="text-sm text-muted mb-4">{r.oecdDesc}</p>
            <div className="flex flex-wrap gap-2">
              {[r.oecdInclusive, r.oecdHuman, r.oecdTransparency, r.oecdRobust, r.oecdAccountability].map(p => (
                <span key={p} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Governance in practice */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{r.practices}</h2>
        <p className="text-muted leading-relaxed mb-6">{r.practicesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {r.practiceItems.map((item, i) => (
            <div key={item.title} className="p-4 bg-background rounded-xl border border-border">
              <h3 className="font-bold text-text mb-2"><span className="text-primary-light mr-2">{i + 1}.</span>{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Energy */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{r.energyTitle}</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {r.energyStats.map(stat => (
            <div key={stat.value} className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
              <div className="text-2xl font-bold font-heading text-green-400">{stat.value}</div>
              <div className="text-xs text-muted mt-1 leading-relaxed">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">{r.energyP1}</p>
          <p className="text-muted leading-relaxed">{r.energyP2}</p>
          <p className="text-muted leading-relaxed">{r.energyP3}</p>
          <p className="text-muted leading-relaxed">{r.energyP4}</p>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{r.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {r.takeaways.map((item, i) => (
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
      <section className="border-t border-border pt-6">
        <h2 className="text-xl font-bold font-heading text-text mb-4">{r.references}</h2>
        <ul className="space-y-2 text-sm">
          {r.referenceList.map(ref => (
            <li key={ref.href}>
              <a className="text-primary-light underline" href={ref.href} target="_blank" rel="noopener noreferrer">{ref.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
