'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { AgenticVisionDemo } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'
import { motion } from 'framer-motion'
import { Eye, Brain, Play, RotateCcw, Scan, Calculator, PenTool, RefreshCw, Cpu, Sparkles, FileText, CheckCircle, MapPin, Receipt, ArrowRight } from 'lucide-react'

export default function AgenticVisionPage() {
  const { t } = useTranslation()

  const loopSteps = [
    {
      title: t.agenticVision.thinkTitle,
      desc: t.agenticVision.thinkDesc,
      icon: Brain,
      color: 'purple',
    },
    {
      title: t.agenticVision.actTitle,
      desc: t.agenticVision.actDesc,
      icon: Play,
      color: 'cyan',
    },
    {
      title: t.agenticVision.observeTitle,
      desc: t.agenticVision.observeDesc,
      icon: Eye,
      color: 'emerald',
    },
  ]

  const capabilities = [
    {
      title: t.agenticVision.capability1Title,
      desc: t.agenticVision.capability1Desc,
      icon: Scan,
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      title: t.agenticVision.capability2Title,
      desc: t.agenticVision.capability2Desc,
      icon: Calculator,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: t.agenticVision.capability3Title,
      desc: t.agenticVision.capability3Desc,
      icon: PenTool,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: t.agenticVision.capability4Title,
      desc: t.agenticVision.capability4Desc,
      icon: RefreshCw,
      gradient: 'from-orange-500 to-red-500',
    },
  ]

  const processSteps = [
    { title: t.agenticVision.step1, desc: t.agenticVision.step1Desc },
    { title: t.agenticVision.step2, desc: t.agenticVision.step2Desc },
    { title: t.agenticVision.step3, desc: t.agenticVision.step3Desc },
    { title: t.agenticVision.step4, desc: t.agenticVision.step4Desc },
    { title: t.agenticVision.step5, desc: t.agenticVision.step5Desc },
  ]

  const models = [
    {
      name: t.agenticVision.model1,
      desc: t.agenticVision.model1Desc,
      color: 'blue',
    },
    {
      name: t.agenticVision.model2,
      desc: t.agenticVision.model2Desc,
      color: 'emerald',
    },
    {
      name: t.agenticVision.model3,
      desc: t.agenticVision.model3Desc,
      color: 'purple',
    },
  ]

  const applications = [
    {
      title: t.agenticVision.app1Title,
      desc: t.agenticVision.app1Desc,
      icon: FileText,
    },
    {
      title: t.agenticVision.app2Title,
      desc: t.agenticVision.app2Desc,
      icon: CheckCircle,
    },
    {
      title: t.agenticVision.app3Title,
      desc: t.agenticVision.app3Desc,
      icon: MapPin,
    },
    {
      title: t.agenticVision.app4Title,
      desc: t.agenticVision.app4Desc,
      icon: Receipt,
    },
  ]

  return (
    <TopicLayout
      title={t.agenticVision.title}
      description={t.agenticVision.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.agenticVision.title },
      ]}
      prevTopic={{ label: t.topicNames['visual-challenges'], href: '/ai/llm/visual-challenges' }}
      nextTopic={{ label: t.topicNames['llm-training'], href: '/ai/llm/training' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agenticVision.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.agenticVision.whatIsDesc}
        </p>
      </section>

      {/* Interactive Demo */}
      <section>
        <AgenticVisionDemo />
      </section>

      {/* The Think-Act-Observe Loop */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <RotateCcw size={18} className="text-primary-light" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.agenticVision.loopTitle}</h2>
            <p className="text-sm text-muted">{t.agenticVision.loopDesc}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {loopSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl bg-surface border border-${step.color}-500/20`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-${step.color}-500/20 flex items-center justify-center`}>
                  <step.icon size={20} className={`text-${step.color}-400`} />
                </div>
                <div className={`w-8 h-8 rounded-full bg-${step.color}-500/20 flex items-center justify-center`}>
                  <span className={`text-${step.color}-400 font-bold`}>{i + 1}</span>
                </div>
              </div>
              <h3 className={`text-lg font-bold font-heading text-${step.color}-400 mb-2`}>{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              {i < loopSteps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight size={16} className="text-muted" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Capabilities */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{t.agenticVision.capabilitiesTitle}</h2>
        <p className="text-muted mb-6">{t.agenticVision.capabilitiesDesc}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cap.gradient} p-0.5 mb-4`}>
                <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                  <cap.icon size={22} className="text-text" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2 font-heading group-hover:text-primary-light transition-colors">
                {cap.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{cap.desc}</p>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cap.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{t.agenticVision.howItWorks}</h2>
        <p className="text-muted mb-6">{t.agenticVision.howItWorksDesc}</p>

        <div className="space-y-3">
          {processSteps.map((step, i) => (
            <div key={i} className="flex gap-4 items-start p-4 bg-background/50 rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary-light font-bold text-sm">{i + 1}</span>
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">{step.title}</h4>
                <p className="text-sm text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Example */}
      <section className="rounded-2xl bg-surface border border-cyan-500/30 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Scan className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold font-heading text-cyan-400">{t.agenticVision.exampleTitle}</h2>
        </div>
        <p className="text-text/90 mb-6">{t.agenticVision.exampleDesc}</p>

        <div className="space-y-3">
          {[
            t.agenticVision.exampleStep1,
            t.agenticVision.exampleStep2,
            t.agenticVision.exampleStep3,
            t.agenticVision.exampleStep4,
          ].map((step, i) => (
            <div key={i} className="flex gap-3 items-center p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 text-xs font-bold">{i + 1}</span>
              </div>
              <span className="text-sm text-text/90">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Models */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{t.agenticVision.modelsTitle}</h2>
        <p className="text-muted mb-6">{t.agenticVision.modelsDesc}</p>

        <div className="space-y-4">
          {models.map((model, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl bg-surface border border-${model.color}-500/20`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Cpu size={18} className={`text-${model.color}-400`} />
                <h3 className={`text-lg font-bold font-heading text-${model.color}-400`}>{model.name}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">{model.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Applications */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{t.agenticVision.applicationsTitle}</h2>
        <p className="text-muted mb-6">{t.agenticVision.applicationsDesc}</p>

        <div className="grid md:grid-cols-2 gap-4">
          {applications.map((app, i) => (
            <div key={i} className="flex gap-4 items-start p-4 bg-background/50 rounded-xl border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <app.icon size={18} className="text-primary-light" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">{app.title}</h4>
                <p className="text-sm text-muted">{app.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{t.agenticVision.comparisonTitle}</h2>
        <p className="text-muted mb-6">{t.agenticVision.comparisonDesc}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-500/20 flex items-center justify-center">
                <Eye size={20} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold font-heading text-gray-400">{t.agenticVision.passiveTitle}</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">{t.agenticVision.passiveDesc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles size={20} className="text-primary-light" />
              </div>
              <h3 className="text-lg font-bold font-heading text-primary-light">{t.agenticVision.agenticTitle}</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">{t.agenticVision.agenticDesc}</p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agenticVision.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-surface border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.agenticVision.takeaway1,
              t.agenticVision.takeaway2,
              t.agenticVision.takeaway3,
              t.agenticVision.takeaway4,
              t.agenticVision.takeaway5,
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
