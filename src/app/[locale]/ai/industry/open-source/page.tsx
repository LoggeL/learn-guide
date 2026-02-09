'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { motion } from 'framer-motion'
import {
  Eye,
  Users,
  DollarSign,
  Zap,
  Shield,
  Unlock,
  Code,
  Wifi,
  ExternalLink,
  TrendingUp,
  Cpu,
  Globe,
  Smartphone
} from 'lucide-react'

interface Advantage {
  titleKey: string
  descKey: string
  icon: typeof Eye
  gradient: string
}

const advantages: Advantage[] = [
  {
    titleKey: 'advantage1Title',
    descKey: 'advantage1Desc',
    icon: Eye,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    titleKey: 'advantage2Title',
    descKey: 'advantage2Desc',
    icon: Users,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    titleKey: 'advantage3Title',
    descKey: 'advantage3Desc',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    titleKey: 'advantage4Title',
    descKey: 'advantage4Desc',
    icon: Zap,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    titleKey: 'advantage5Title',
    descKey: 'advantage5Desc',
    icon: Unlock,
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    titleKey: 'advantage6Title',
    descKey: 'advantage6Desc',
    icon: Shield,
    gradient: 'from-rose-500 to-red-500',
  },
]

interface Project {
  nameKey: string
  orgKey: string
  descKey: string
  icon: typeof Code
  gradient: string
  website: string
}

const projects: Project[] = [
  {
    nameKey: 'project1Name',
    orgKey: 'project1Org',
    descKey: 'project1Desc',
    icon: Code,
    gradient: 'from-red-500 to-rose-500',
    website: 'https://github.com/deepseek-ai/DeepSeek-R1',
  },
  {
    nameKey: 'project2Name',
    orgKey: 'project2Org',
    descKey: 'project2Desc',
    icon: Code,
    gradient: 'from-violet-500 to-purple-500',
    website: 'https://qwenlm.github.io',
  },
  {
    nameKey: 'project3Name',
    orgKey: 'project3Org',
    descKey: 'project3Desc',
    icon: Code,
    gradient: 'from-blue-500 to-indigo-500',
    website: 'https://llama.meta.com',
  },
  {
    nameKey: 'project4Name',
    orgKey: 'project4Org',
    descKey: 'project4Desc',
    icon: Code,
    gradient: 'from-orange-500 to-red-500',
    website: 'https://mistral.ai',
  },
  {
    nameKey: 'project5Name',
    orgKey: 'project5Org',
    descKey: 'project5Desc',
    icon: Code,
    gradient: 'from-amber-500 to-yellow-500',
    website: 'https://huggingface.co',
  },
  {
    nameKey: 'project6Name',
    orgKey: 'project6Org',
    descKey: 'project6Desc',
    icon: Code,
    gradient: 'from-cyan-500 to-blue-500',
    website: 'https://ollama.ai',
  },
]

interface Trend {
  titleKey: string
  descKey: string
  icon: typeof TrendingUp
  color: string
}

const trends: Trend[] = [
  { titleKey: 'trend1Title', descKey: 'trend1Desc', icon: TrendingUp, color: 'cyan' },
  { titleKey: 'trend2Title', descKey: 'trend2Desc', icon: Globe, color: 'purple' },
  { titleKey: 'trend3Title', descKey: 'trend3Desc', icon: Cpu, color: 'emerald' },
  { titleKey: 'trend4Title', descKey: 'trend4Desc', icon: Smartphone, color: 'orange' },
]

interface BusinessCase {
  titleKey: string
  descKey: string
  icon: typeof Shield
  color: string
}

const businessCases: BusinessCase[] = [
  { titleKey: 'businessCase1Title', descKey: 'businessCase1Desc', icon: Shield, color: 'cyan' },
  { titleKey: 'businessCase2Title', descKey: 'businessCase2Desc', icon: Code, color: 'purple' },
  { titleKey: 'businessCase3Title', descKey: 'businessCase3Desc', icon: DollarSign, color: 'emerald' },
  { titleKey: 'businessCase4Title', descKey: 'businessCase4Desc', icon: Wifi, color: 'orange' },
]

function AdvantageCard({ advantage, t, index }: { advantage: Advantage; t: ReturnType<typeof useTranslation>['t']; index: number }) {
  const Icon = advantage.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${advantage.gradient} p-0.5 mb-4`}>
        <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
          <Icon size={22} className="text-text" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-text mb-2 font-heading group-hover:text-primary-light transition-colors">
        {t.openSource[advantage.titleKey as keyof typeof t.openSource]}
      </h3>
      <p className="text-muted text-sm leading-relaxed">
        {t.openSource[advantage.descKey as keyof typeof t.openSource]}
      </p>

      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${advantage.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    </motion.div>
  )
}

function ProjectCard({ project, t }: { project: Project; t: ReturnType<typeof useTranslation>['t'] }) {
  const Icon = project.icon

  return (
    <motion.a
      href={project.website}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient} p-0.5`}>
          <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
            <Icon size={22} className="text-text" />
          </div>
        </div>
        <ExternalLink size={16} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <h3 className="text-lg font-semibold text-text mb-1 font-heading group-hover:text-primary-light transition-colors">
        {t.openSource[project.nameKey as keyof typeof t.openSource]}
      </h3>
      <p className="text-xs text-primary-light mb-3">
        {t.openSource[project.orgKey as keyof typeof t.openSource]}
      </p>

      <p className="text-muted text-sm leading-relaxed">
        {t.openSource[project.descKey as keyof typeof t.openSource]}
      </p>

      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    </motion.a>
  )
}

export default function OpenSourcePage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="open-source"
      title={t.openSource.title}
      description={t.openSource.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: t.openSource.title },
      ]}
      prevTopic={{ label: t.topicNames['european-ai'], href: '/ai/industry/european-ai' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.openSource.intro}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.openSource.introDesc}
          </p>
        </div>
      </section>

      {/* Key Advantages Grid */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <Unlock size={18} className="text-primary-light" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.openSource.advantagesTitle}</h2>
            <p className="text-sm text-muted">{t.openSource.advantagesDesc}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, idx) => (
            <AdvantageCard key={advantage.titleKey} advantage={advantage} t={t} index={idx} />
          ))}
        </div>
      </section>

      {/* Notable Projects */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <Code size={18} className="text-purple-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.openSource.projectsTitle}</h2>
            <p className="text-sm text-muted">{t.openSource.projectsDesc}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.nameKey} project={project} t={t} />
          ))}
        </div>
      </section>

      {/* 2025 Trends */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.openSource.trendsTitle}</h2>
        <p className="text-muted leading-relaxed mb-8">
          {t.openSource.trendsDesc}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {trends.map((trend) => {
            const Icon = trend.icon
            const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
              cyan: { bg: 'from-cyan-500/10 to-blue-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
              purple: { bg: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
              emerald: { bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
              orange: { bg: 'from-orange-500/10 to-red-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
            }
            const colors = colorClasses[trend.color]

            return (
              <div
                key={trend.titleKey}
                className={`p-5 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}
              >
                <Icon className={`w-8 h-8 ${colors.text} mb-3`} />
                <h3 className={`text-lg font-bold font-heading ${colors.text} mb-2`}>
                  {t.openSource[trend.titleKey as keyof typeof t.openSource]}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t.openSource[trend.descKey as keyof typeof t.openSource]}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Business Perspective */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.openSource.businessTitle}</h2>
        <p className="text-muted leading-relaxed mb-8">
          {t.openSource.businessDesc}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {businessCases.map((businessCase) => {
            const Icon = businessCase.icon
            const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
              cyan: { bg: 'from-cyan-500/10 to-blue-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
              purple: { bg: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
              emerald: { bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
              orange: { bg: 'from-orange-500/10 to-red-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
            }
            const colors = colorClasses[businessCase.color]

            return (
              <div
                key={businessCase.titleKey}
                className={`p-5 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}
              >
                <Icon className={`w-8 h-8 ${colors.text} mb-3`} />
                <h3 className={`text-lg font-bold font-heading ${colors.text} mb-2`}>
                  {t.openSource[businessCase.titleKey as keyof typeof t.openSource]}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t.openSource[businessCase.descKey as keyof typeof t.openSource]}
                </p>
              </div>
            )
          })}
        </div>

        {/* Considerations */}
        <div className="p-5 rounded-xl bg-background/50 border border-border/50">
          <h3 className="text-lg font-semibold text-text mb-4">{t.openSource.considerTitle}</h3>
          <ul className="space-y-3">
            {['consider1', 'consider2', 'consider3', 'consider4'].map((key, idx) => (
              <li key={key} className="flex gap-3 items-start text-muted">
                <span className="w-6 h-6 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-subtle text-sm">{idx + 1}</span>
                </span>
                <span className="text-sm leading-relaxed">
                  {t.openSource[key as keyof typeof t.openSource]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.openSource.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {['takeaway1', 'takeaway2', 'takeaway3', 'takeaway4', 'takeaway5'].map((key, i) => (
              <li key={key} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary-light text-sm font-bold">{i + 1}</span>
                </span>
                <span className="leading-relaxed">
                  {t.openSource[key as keyof typeof t.openSource]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </TopicLayout>
  )
}
