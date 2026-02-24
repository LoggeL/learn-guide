'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { DataSourceExplorer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function TrainingDataPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="training-data"
      title={t.trainingData.title}
      description={t.trainingData.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.trainingData.title },
      ]}
      prevTopic={{ label: t.topicNames['llm-training'], href: '/ai/llm/training' }}
      nextTopic={{ label: t.topicNames['moe'], href: '/ai/llm/moe' }}
    >
      {/* Overview */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.trainingData.overview}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">
          {t.trainingData.overviewDesc}
        </p>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <p className="text-muted leading-relaxed text-sm">
            {t.trainingData.overviewWhy}
          </p>
        </div>
      </section>

      {/* Interactive Data Source Explorer */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.trainingData.interactiveTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.trainingData.interactiveDesc}
        </p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <DataSourceExplorer />
        </div>
      </section>

      {/* Legitimate Sources */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.trainingData.legitimateSources}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.trainingData.legitimateSourcesDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { color: 'emerald', title: t.trainingData.sourceCommonCrawl, desc: t.trainingData.sourceCommonCrawlDesc, scale: t.trainingData.sourceCommonCrawlScale },
            { color: 'blue', title: t.trainingData.sourceWikipedia, desc: t.trainingData.sourceWikipediaDesc, scale: t.trainingData.sourceWikipediaScale },
            { color: 'amber', title: t.trainingData.sourceBooks, desc: t.trainingData.sourceBooks3Desc, scale: t.trainingData.sourceBooksScale },
            { color: 'cyan', title: t.trainingData.sourceGitHub, desc: t.trainingData.sourceGitHubDesc, scale: t.trainingData.sourceGitHubScale },
            { color: 'purple', title: t.trainingData.sourceAcademic, desc: t.trainingData.sourceAcademicDesc, scale: t.trainingData.sourceAcademicScale },
            { color: 'teal', title: t.trainingData.sourcePile, desc: t.trainingData.sourcePileDesc, scale: t.trainingData.sourcePileScale },
            { color: 'indigo', title: t.trainingData.sourceRedPajama, desc: t.trainingData.sourceRedPajamaDesc, scale: t.trainingData.sourceRedPajamaScale },
            { color: 'orange', title: t.trainingData.sourceFineWeb, desc: t.trainingData.sourceFineWebDesc, scale: t.trainingData.sourceFineWebScale },
          ].map(({ color, title, desc, scale }) => (
            <div key={title} className={`p-5 bg-gradient-to-br from-${color}-500/10 to-${color}-500/5 border border-${color}-500/20 rounded-xl`}>
              <h3 className={`text-base font-bold font-heading text-${color}-300 mb-2`}>{title}</h3>
              <p className="text-sm text-muted mb-3">{desc}</p>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>
                <span className={`text-xs font-mono font-bold text-${color}-400`}>{scale}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Controversial & Illegal Sources */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.trainingData.controversialSources}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.trainingData.controversialSourcesDesc}
        </p>
        <div className="space-y-4">
          {[
            { title: t.trainingData.controvBooks3, desc: t.trainingData.controvBooks3Desc },
            { title: t.trainingData.controvNYT, desc: t.trainingData.controvNYTDesc },
            { title: t.trainingData.controvReddit, desc: t.trainingData.controvRedditDesc },
            { title: t.trainingData.controvGDPR, desc: t.trainingData.controvGDPRDesc },
            { title: t.trainingData.controvArt, desc: t.trainingData.controvArtDesc },
            { title: t.trainingData.controvLicense, desc: t.trainingData.controvLicenseDesc },
          ].map(({ title, desc }) => (
            <div key={title} className="p-5 bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-xl">
              <h3 className="text-base font-bold font-heading text-red-300 mb-2">{title}</h3>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Quality Problem */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.trainingData.dataQuality}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.trainingData.dataQualityDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { color: 'slate', title: t.trainingData.qualityGIGO, desc: t.trainingData.qualityGIGODesc },
            { color: 'blue', title: t.trainingData.qualityDedup, desc: t.trainingData.qualityDedupDesc },
            { color: 'red', title: t.trainingData.qualityToxic, desc: t.trainingData.qualityToxicDesc },
            { color: 'amber', title: t.trainingData.qualityLanguage, desc: t.trainingData.qualityLanguageDesc },
            { color: 'purple', title: t.trainingData.qualityContamination, desc: t.trainingData.qualityContaminationDesc },
          ].map(({ color, title, desc }) => (
            <div key={title} className={`p-5 bg-gradient-to-br from-${color}-500/10 to-${color}-500/5 border border-${color}-500/20 rounded-xl`}>
              <h3 className={`text-base font-bold font-heading text-${color}-300 mb-2`}>{title}</h3>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Synthetic Data Deep Dive */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.trainingData.syntheticData}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.trainingData.syntheticDataDesc}
        </p>

        {/* What is synthetic data */}
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 mb-6">
          <h3 className="text-lg font-bold font-heading text-purple-400 mb-3">{t.trainingData.syntheticWhat}</h3>
          <p className="text-muted leading-relaxed">{t.trainingData.syntheticWhatDesc}</p>
        </div>

        {/* Synthetic techniques grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-xl">
            <h3 className="text-base font-bold font-heading text-purple-300 mb-2">{t.trainingData.syntheticSelfPlay}</h3>
            <p className="text-sm text-muted mb-3">{t.trainingData.syntheticSelfPlayDesc}</p>
            <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <p className="text-xs text-purple-300/80 italic">{t.trainingData.syntheticSelfPlayExample}</p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-xl">
            <h3 className="text-base font-bold font-heading text-cyan-300 mb-2">{t.trainingData.syntheticDistillation}</h3>
            <p className="text-sm text-muted mb-3">{t.trainingData.syntheticDistillationDesc}</p>
            <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
              <p className="text-xs text-cyan-300/80 italic">{t.trainingData.syntheticDistillationExamples}</p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl">
            <h3 className="text-base font-bold font-heading text-emerald-300 mb-2">{t.trainingData.syntheticConstitutional}</h3>
            <p className="text-sm text-muted mb-3">{t.trainingData.syntheticConstitutionalDesc}</p>
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-xs text-emerald-300/80 italic">{t.trainingData.syntheticConstitutionalHow}</p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-xl">
            <h3 className="text-base font-bold font-heading text-orange-300 mb-2">{t.trainingData.syntheticRejection}</h3>
            <p className="text-sm text-muted mb-3">{t.trainingData.syntheticRejectionDesc}</p>
            <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
              <p className="text-xs text-orange-300/80 italic">{t.trainingData.syntheticRejectionHow}</p>
            </div>
          </div>
        </div>

        {/* RLHF/DPO synthetic data */}
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 mb-6">
          <h3 className="text-lg font-bold font-heading text-indigo-400 mb-3">{t.trainingData.syntheticRLHF}</h3>
          <p className="text-muted leading-relaxed mb-3">{t.trainingData.syntheticRLHFDesc}</p>
          <p className="text-sm text-muted/80">{t.trainingData.syntheticRLHFScale}</p>
        </div>

        {/* Model Collapse */}
        <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 p-6 md:p-8 mb-6">
          <h3 className="text-lg font-bold font-heading text-red-400 mb-3">{t.trainingData.syntheticCollapse}</h3>
          <p className="text-muted leading-relaxed mb-4">{t.trainingData.syntheticCollapseDesc}</p>
          <p className="text-sm text-muted/80 mb-4">{t.trainingData.syntheticCollapseWhy}</p>
          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
            <p className="text-xs text-red-300/80">{t.trainingData.syntheticCollapseResearch}</p>
          </div>
        </div>

        {/* Scaling Laws */}
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 mb-6">
          <h3 className="text-lg font-bold font-heading text-gradient mb-3">{t.trainingData.syntheticScaling}</h3>
          <p className="text-muted leading-relaxed mb-4">{t.trainingData.syntheticScalingDesc}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-sm text-emerald-300">{t.trainingData.syntheticScalingWhen}</p>
            </div>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <p className="text-sm text-red-300">{t.trainingData.syntheticScalingNot}</p>
            </div>
          </div>
        </div>

        {/* Real-World Examples */}
        <h3 className="text-xl font-bold font-heading text-gradient mb-4">{t.trainingData.syntheticExamples}</h3>
        <p className="text-muted leading-relaxed mb-4">{t.trainingData.syntheticExamplesDesc}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { color: 'blue', title: t.trainingData.syntheticPhi, desc: t.trainingData.syntheticPhiDesc },
            { color: 'cyan', title: t.trainingData.syntheticOrca, desc: t.trainingData.syntheticOrcaDesc },
            { color: 'purple', title: t.trainingData.syntheticWizard, desc: t.trainingData.syntheticWizardDesc },
            { color: 'emerald', title: t.trainingData.syntheticNemotron, desc: t.trainingData.syntheticNemotronDesc },
            { color: 'orange', title: t.trainingData.syntheticCosmopedia, desc: t.trainingData.syntheticCosmopediaDesc },
          ].map(({ color, title, desc }) => (
            <div key={title} className={`p-5 bg-gradient-to-br from-${color}-500/10 to-${color}-500/5 border border-${color}-500/20 rounded-xl`}>
              <h4 className={`text-sm font-bold font-heading text-${color}-300 mb-2`}>{title}</h4>
              <p className="text-xs text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Future */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.trainingData.future}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.trainingData.futureDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { color: 'slate', title: t.trainingData.futureWall, desc: t.trainingData.futureWallDesc },
            { color: 'cyan', title: t.trainingData.futureMultimodal, desc: t.trainingData.futureMultimodalDesc },
            { color: 'purple', title: t.trainingData.futureRegulation, desc: t.trainingData.futureRegulationDesc },
            { color: 'emerald', title: t.trainingData.futureLicensing, desc: t.trainingData.futureLicensingDesc },
          ].map(({ color, title, desc }) => (
            <div key={title} className={`p-5 bg-gradient-to-br from-${color}-500/10 to-${color}-500/5 border border-${color}-500/20 rounded-xl`}>
              <h3 className={`text-base font-bold font-heading text-${color}-300 mb-2`}>{title}</h3>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.trainingData.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.trainingData.takeaway1,
              t.trainingData.takeaway2,
              t.trainingData.takeaway3,
              t.trainingData.takeaway4,
              t.trainingData.takeaway5,
              t.trainingData.takeaway6,
              t.trainingData.takeaway7,
              t.trainingData.takeaway8,
            ].map((item, i) => (
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
