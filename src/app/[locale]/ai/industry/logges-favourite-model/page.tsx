'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { motion } from 'framer-motion'
import {
  Heart,
  Brain,
  Zap,
  Shield,
  Sparkles,
  AlertTriangle,
  Server,
  Code,
  Cpu,
  Trophy,
  ExternalLink,
  ChevronRight,
  Gauge,
  Layers,
  Terminal,
  Calendar,
  Lock,
  Eye,
  GitBranch,
  Flame,
} from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SectionIcon({
  icon: Icon,
  gradient,
}: {
  icon: any
  gradient: string
}) {
  return (
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} p-0.5 shrink-0`}
    >
      <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
        <Icon size={18} className="text-text" />
      </div>
    </div>
  )
}

export default function FavouriteModelsPage() {
  const { t } = useTranslation()
  const f = t.favModels

  const strengths = [
    {
      title: f.strength1Title,
      desc: f.strength1Desc,
      icon: Brain,
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      title: f.strength2Title,
      desc: f.strength2Desc,
      icon: Terminal,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      title: f.strength3Title,
      desc: f.strength3Desc,
      icon: Layers,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: f.strength4Title,
      desc: f.strength4Desc,
      icon: Shield,
      gradient: 'from-purple-500 to-violet-500',
    },
  ]

  const benchmarks = [
    { name: f.benchSWE, score: f.benchSWEScore, note: f.benchSWENote },
    { name: f.benchSWEPro, score: f.benchSWEProScore, note: f.benchSWEProNote },
    { name: f.benchTerminal, score: f.benchTerminalScore, note: f.benchTerminalNote },
    { name: f.benchOSWorld, score: f.benchOSWorldScore, note: f.benchOSWorldNote },
    { name: f.benchHLE, score: f.benchHLEScore, note: f.benchHLENote },
    { name: f.benchHLETools, score: f.benchHLEToolsScore, note: f.benchHLEToolsNote },
  ]

  const useCases = [
    f.useCase1,
    f.useCase2,
    f.useCase3,
    f.useCase4,
    f.useCase5,
  ]

  return (
    <TopicLayout
      topicId="logges-favourite-model"
      title={f.title}
      description={f.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: f.title },
      ]}
      prevTopic={{
        label: t.topicNames['open-source'],
        href: '/ai/industry/open-source',
      }}
      nextTopic={{
        label: t.topicNames['tier-list'],
        href: '/ai/industry/tier-list',
      }}
    >
      {/* Availability Warning */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">
              {f.availabilityTitle}
            </h3>
            <p className="text-muted leading-relaxed">{f.availabilityText}</p>
            <p className="text-xs text-muted mt-2">{f.lastUpdated}</p>
          </div>
        </div>
      </motion.section>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-2xl bg-surface flex items-center justify-center">
              <Flame size={32} className="text-orange-400" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold font-heading text-gradient mb-4">
          {f.heroTitle}
        </h2>
        <p className="text-muted leading-relaxed max-w-3xl mx-auto text-lg">
          {f.heroSubtitle}
        </p>
      </motion.section>

      {/* Model Card */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-surface border border-orange-500/30 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-pink-500/10 p-6 border-b border-orange-500/20">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-0.5">
                <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                  <Brain size={24} className="text-orange-400" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading text-text">
                  {f.modelName}
                </h3>
                <p className="text-sm text-orange-400">{f.modelMaker}</p>
              </div>
            </div>
            <p className="text-sm text-muted italic">{f.modelTagline}</p>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <span className="text-muted text-xs block">Model ID</span>
                <code className="text-orange-400 text-xs">{f.modelId}</code>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <span className="text-muted text-xs block">{f.releasedLabel}</span>
                <span className="text-text text-xs">{f.modelReleaseDate}</span>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <span className="text-muted text-xs block">Context</span>
                <span className="text-text text-xs">{f.modelContext}</span>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <span className="text-muted text-xs block">Max Output</span>
                <span className="text-text text-xs">{f.modelOutput}</span>
              </div>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              {f.modelDescription}
            </p>

            <a
              href={f.modelSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              <ExternalLink size={14} />
              {f.modelSourceLabel}
            </a>
          </div>
        </motion.div>
      </section>

      {/* Why It's The Favorite */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <SectionIcon icon={Trophy} gradient="from-yellow-500 to-orange-500" />
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">
              {f.strengthsTitle}
            </h2>
            <p className="text-sm text-muted">{f.strengthsSubtitle}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-6">
          {strengths.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex gap-4 items-start p-5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} p-0.5 shrink-0`}
              >
                <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                  <s.icon size={18} className="text-text" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-semibold text-text mb-1">
                  {s.title}
                </h4>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Mythos 5 Connection */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <SectionIcon icon={Lock} gradient="from-red-500 to-purple-500" />
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">
              {f.mythosTitle}
            </h2>
            <p className="text-sm text-muted">{f.mythosSubtitle}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-base font-semibold text-text mb-2 flex items-center gap-2">
              <Eye size={16} className="text-purple-400" />
              {f.mythosWhatTitle}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {f.mythosWhatDesc}
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text mb-2 flex items-center gap-2">
              <GitBranch size={16} className="text-orange-400" />
              {f.mythosGuardrailsTitle}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {f.mythosGuardrailsDesc}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Benchmarks */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <SectionIcon icon={Zap} gradient="from-yellow-500 to-orange-500" />
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">
              {f.benchmarkTitle}
            </h2>
            <p className="text-sm text-muted">{f.benchmarkSubtitle}</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-muted font-medium">
                  {f.benchColBenchmark}
                </th>
                <th className="text-center py-3 px-3 text-orange-400 font-medium">
                  {f.benchColScore}
                </th>
                <th className="text-left py-3 px-3 text-muted font-medium hidden md:table-cell">
                  {f.benchColNote}
                </th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="border-b border-border/50 hover:bg-surface/80 transition-colors"
                >
                  <td className="py-3 px-3 font-medium text-text">{b.name}</td>
                  <td className="py-3 px-3 text-center font-mono text-orange-400 font-bold">
                    {b.score}
                  </td>
                  <td className="py-3 px-3 text-xs text-muted hidden md:table-cell">
                    {b.note}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted mt-4">{f.benchDisclaimer}</p>
      </section>

      {/* When I Use It */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <SectionIcon icon={Sparkles} gradient="from-primary to-accent" />
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">
              {f.whenTitle}
            </h2>
            <p className="text-sm text-muted">{f.whenSubtitle}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-surface border border-orange-500/20 p-6"
        >
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Terminal size={14} className="text-orange-400" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                {f.toolLabel}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">{f.toolDesc}</p>
          </div>
          <ul className="space-y-3">
            {useCases.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted"
              >
                <ChevronRight
                  size={14}
                  className="text-orange-400 mt-0.5 shrink-0"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Pricing Reality */}
      <section className="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-red-400">
            {f.pricingTitle}
          </h2>
        </div>
        <p className="text-sm text-muted mb-6">{f.pricingSubtitle}</p>

        <div className="bg-background/40 rounded-xl p-4 border border-orange-500/20 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-orange-400" />
            <h3 className="font-bold text-text text-sm">
              {f.pricingModelTitle}
            </h3>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            {f.pricingModelDetail}
          </p>
        </div>
        <p className="text-text/90 leading-relaxed text-sm italic">
          {f.pricingVerdict}
        </p>
      </section>

      {/* Personal Verdict */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 p-0.5">
            <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
              <Heart size={22} className="text-pink-400" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-heading text-gradient">
            {f.verdictTitle}
          </h2>
        </div>
        <p className="text-text/90 leading-relaxed text-lg">{f.verdictText}</p>
      </motion.section>

      {/* Quick Reference */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">
          {f.quickRefTitle}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {[
                [f.quickRefMaker, f.modelMaker],
                [f.quickRefReleased, f.modelReleaseDate],
                [f.quickRefContext, f.modelContext],
                [f.quickRefOutput, f.modelOutput],
                [f.quickRefPrice, f.modelPricing],
                [f.quickRefBestFor, f.quickRefBestForValue],
                [f.quickRefPlatforms, f.quickRefPlatformsValue],
                [f.quickRefKnowledge, f.modelKnowledge],
              ].map(([label, value], i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-3 px-3 text-muted font-medium w-1/3">
                    {label}
                  </td>
                  <td className="py-3 px-3 text-text">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </TopicLayout>
  )
}
