'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { ContextRotSimulator, AttentionHeatmap, DistractorDemo, ScaleCalculator } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'
import { motion } from 'framer-motion'
import { AlertTriangle, Target, Layers, Users, Brain, CheckCircle, BarChart3, Cpu } from 'lucide-react'

export default function ContextRotPage() {
  const { t } = useTranslation()

  const heroStats = [
    { value: t.contextRot.heroStat1Value, label: t.contextRot.heroStat1Label, color: 'purple' },
    { value: t.contextRot.heroStat2Value, label: t.contextRot.heroStat2Label, color: 'orange' },
    { value: t.contextRot.heroStat3Value, label: t.contextRot.heroStat3Label, color: 'cyan' },
    { value: t.contextRot.heroStat4Value, label: t.contextRot.heroStat4Label, color: 'emerald' },
  ]

  const chromaFindings = [
    { title: t.contextRot.chromaFinding1Title, desc: t.contextRot.chromaFinding1Desc, color: 'red' },
    { title: t.contextRot.chromaFinding2Title, desc: t.contextRot.chromaFinding2Desc, color: 'orange' },
    { title: t.contextRot.chromaFinding3Title, desc: t.contextRot.chromaFinding3Desc, color: 'yellow' },
    { title: t.contextRot.chromaFinding4Title, desc: t.contextRot.chromaFinding4Desc, color: 'cyan' },
  ]

  const mitigations = [
    { title: t.contextRot.mitigation1Title, desc: t.contextRot.mitigation1, icon: Target },
    { title: t.contextRot.mitigation2Title, desc: t.contextRot.mitigation2, icon: Layers },
    { title: t.contextRot.mitigation3Title, desc: t.contextRot.mitigation3, icon: BarChart3 },
    { title: t.contextRot.mitigation4Title, desc: t.contextRot.mitigation4, icon: Users },
    { title: t.contextRot.mitigation5Title, desc: t.contextRot.mitigation5, icon: Brain },
  ]

  const checklistItems = [
    t.contextRot.checklist1,
    t.contextRot.checklist2,
    t.contextRot.checklist3,
    t.contextRot.checklist4,
    t.contextRot.checklist5,
    t.contextRot.checklist6,
  ]

  const takeaways = [
    t.contextRot.takeaway1,
    t.contextRot.takeaway2,
    t.contextRot.takeaway3,
    t.contextRot.takeaway4,
    t.contextRot.takeaway5,
    t.contextRot.takeaway6,
  ]

  return (
    <TopicLayout
      topicId="context-rot"
      title={t.contextRot.title}
      description={t.contextRot.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.contextRot.title },
      ]}
      prevTopic={{ label: t.topicNames.rag, href: '/ai/llm/rag' }}
      nextTopic={{ label: t.topicNames.temperature, href: '/ai/llm/temperature' }}
    >

      {/* ── 1. Hero / Intro ─────────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-surface/50 border border-red-500/20 p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{t.contextRot.whatIs}</h2>
            <p className="text-muted leading-relaxed">
              <span className="text-primary-light font-semibold">Context rot</span>{' '}
              {t.contextRot.whatIsDesc}
            </p>
          </div>
        </div>

        <p className="text-muted leading-relaxed mb-8 pl-16">{t.contextRot.heroIntro}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {heroStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-4 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/25 text-center`}
            >
              <div className={`text-2xl md:text-3xl font-bold font-heading text-${stat.color}-400 mb-1 tabular-nums`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 2. The Science: Lost in the Middle + AttentionHeatmap ───────────── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.contextRot.scienceTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.contextRot.scienceDesc}</p>

        {/* U-curve explainer */}
        <div className="grid md:grid-cols-3 gap-3 mb-6">
          {[
            { pos: 'Start', acc: '~75%', color: 'emerald', note: t.contextRot.attentionStartLabel },
            { pos: 'Middle', acc: '~45%', color: 'red', note: t.contextRot.attentionMiddleLabel },
            { pos: 'End', acc: '~72%', color: 'emerald', note: t.contextRot.attentionEndLabel },
          ].map((item) => (
            <div key={item.pos} className={`p-4 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20 text-center`}>
              <div className={`text-3xl font-bold font-heading text-${item.color}-400 mb-1`}>{item.acc}</div>
              <div className="text-sm text-muted">{item.note}</div>
            </div>
          ))}
        </div>

        <AttentionHeatmap
          title={t.contextRot.attentionHeatmapTitle}
          desc={t.contextRot.attentionHeatmapDesc}
          clickHint={t.contextRot.attentionClickHint}
          accuracyLabel={t.contextRot.attentionAccuracyLabel}
          startLabel={t.contextRot.attentionStartLabel}
          middleLabel={t.contextRot.attentionMiddleLabel}
          endLabel={t.contextRot.attentionEndLabel}
          positionLabel={t.contextRot.attentionPositionLabel}
        />
      </section>

      {/* ── 3. Chroma 2025 Findings + DistractorDemo ────────────────────────── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.contextRot.chromaTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.contextRot.chromaDesc}</p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {chromaFindings.map((item, i) => (
            <div key={i} className={`p-4 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
              <h3 className={`text-text font-semibold font-heading mb-2 text-${item.color}-300`}>{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <DistractorDemo
          title={t.contextRot.distractorTitle}
          desc={t.contextRot.distractorDesc}
          sliderLabel={t.contextRot.distractorSliderLabel}
          shuffledLabel={t.contextRot.distractorShuffledLabel}
          coherentLabel={t.contextRot.distractorCoherentLabel}
          modeLabel={t.contextRot.distractorModeLabel}
          accuracyLabel={t.contextRot.distractorAccuracyLabel}
          paradoxNote={t.contextRot.distractorParadoxNote}
        />
      </section>

      {/* ── 4. The Scale Problem + ScaleCalculator ──────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.contextRot.scaleTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.contextRot.scaleDesc}</p>

        {/* Visual comparison */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { tokens: '10K', pairs: '100M', width: '20%' },
            { tokens: '100K', pairs: '10B', width: '50%' },
            { tokens: '1M', pairs: '1T', width: '100%' },
          ].map((item) => (
            <div key={item.tokens} className="p-4 rounded-xl bg-surface border border-border">
              <div className="text-sm font-mono font-bold text-purple-400 mb-1">{item.tokens}</div>
              <div className="text-xs text-muted mb-2">= {item.pairs} pairs</div>
              <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: item.width }}
                />
              </div>
            </div>
          ))}
        </div>

        <ScaleCalculator
          title={t.contextRot.scaleCalculatorTitle}
          inputLabel={t.contextRot.scaleInputLabel}
          pairwiseLabel={t.contextRot.scalePairwiseLabel}
          attentionLabel={t.contextRot.scaleAttentionLabel}
          referenceTitle={t.contextRot.scaleReferenceTitle}
        />
      </section>

      {/* ── 5. ContextRotSimulator (existing) ───────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary-light" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.contextRot.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.contextRot.demoDesc}</p>
          </div>
        </div>
        <ContextRotSimulator />
      </section>

      {/* ── 6. Evidence-Based Mitigations ───────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.contextRot.mitigation}</h2>
        <div className="space-y-3">
          {mitigations.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={i}
                className="flex gap-5 p-5 rounded-xl bg-surface border border-border hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary-light" />
                </div>
                <div>
                  <h3 className="text-text font-semibold font-heading mb-1">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 7. Practical Checklist ──────────────────────────────────────────── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.contextRot.checklistTitle}</h2>
        <div className="space-y-3">
          {checklistItems.map((item, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-surface transition-colors">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-text leading-relaxed text-sm">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Key Takeaways ────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.contextRot.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {takeaways.map((item, i) => (
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
    </TopicLayout>
  )
}
