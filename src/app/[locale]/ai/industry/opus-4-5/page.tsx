'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { motion } from 'framer-motion'
import { Heart, Brain, Zap, Clock, Shield, Sparkles, AlertTriangle, Server, Code, MessageSquare, Cpu, Trophy } from 'lucide-react'

export default function Opus45Page() {
  const { t } = useTranslation()

  const stats = [
    {
      title: t.opus45.stat1Title,
      value: t.opus45.stat1Value,
      desc: t.opus45.stat1Desc,
      icon: Trophy,
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      title: t.opus45.stat2Title,
      value: t.opus45.stat2Value,
      desc: t.opus45.stat2Desc,
      icon: Brain,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: t.opus45.stat3Title,
      value: t.opus45.stat3Value,
      desc: t.opus45.stat3Desc,
      icon: Code,
      gradient: 'from-cyan-500 to-blue-500',
    },
  ]

  const reasons = [
    {
      title: t.opus45.reason1Title,
      desc: t.opus45.reason1Desc,
      icon: Code,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: t.opus45.reason2Title,
      desc: t.opus45.reason2Desc,
      icon: Brain,
      gradient: 'from-purple-500 to-violet-500',
    },
    {
      title: t.opus45.reason3Title,
      desc: t.opus45.reason3Desc,
      icon: Clock,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: t.opus45.reason4Title,
      desc: t.opus45.reason4Desc,
      icon: Server,
      gradient: 'from-orange-500 to-red-500',
    },
  ]

  const specs = [
    { title: t.opus45.spec1, desc: t.opus45.spec1Desc },
    { title: t.opus45.spec2, desc: t.opus45.spec2Desc },
    { title: t.opus45.spec3, desc: t.opus45.spec3Desc },
    { title: t.opus45.spec4, desc: t.opus45.spec4Desc },
  ]

  const funFacts = [
    t.opus45.funFact1,
    t.opus45.funFact2,
    t.opus45.funFact3,
    t.opus45.funFact4,
  ]

  return (
    <TopicLayout
      title={t.opus45.title}
      description={t.opus45.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: t.opus45.title },
      ]}
      prevTopic={{ label: t.topicNames['open-source'], href: '/ai/industry/open-source' }}
    >
      {/* Disclaimer */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">{t.opus45.disclaimer}</h3>
            <p className="text-muted leading-relaxed">{t.opus45.disclaimerText}</p>
          </div>
        </div>
      </motion.section>

      {/* Introduction with heart */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 p-0.5">
            <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
              <Heart size={24} className="text-pink-400" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-heading text-gradient">{t.opus45.intro}</h2>
        </div>
        <p className="text-muted leading-relaxed text-lg">{t.opus45.introDesc}</p>

        {/* Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 bg-gradient-to-br ${stat.gradient.replace('from-', 'from-').replace('to-', 'to-')}/10 border border-${stat.gradient.split(' ')[0].replace('from-', '')}/20 rounded-xl`}
            >
              <stat.icon className={`w-8 h-8 text-${stat.gradient.split(' ')[0].replace('from-', '')} mb-3`} />
              <h3 className="text-lg font-bold font-heading text-text mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gradient mb-1">{stat.value}</p>
              <p className="text-sm text-muted">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why It's Great */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <Sparkles size={18} className="text-primary-light" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.opus45.whyGreat}</h2>
            <p className="text-sm text-muted">{t.opus45.whyGreatDesc}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${reason.gradient} p-0.5 mb-4`}>
                <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                  <reason.icon size={22} className="text-text" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2 font-heading group-hover:text-primary-light transition-colors">
                {reason.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{reason.desc}</p>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technical Specs */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{t.opus45.specs}</h2>
        <p className="text-muted mb-6">{t.opus45.specsDesc}</p>

        <div className="grid md:grid-cols-2 gap-4">
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-3 items-start p-4 bg-background/50 rounded-xl border border-border/50">
              <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Zap size={14} className="text-primary-light" />
              </div>
              <div>
                <span className="font-medium text-text">{spec.title}</span>
                <p className="text-sm text-muted mt-1">{spec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Honest Moments */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.opus45.honestMoments}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
          <MessageSquare className="w-8 h-8 text-purple-400 mb-4" />
          <p className="text-muted leading-relaxed text-lg italic">{t.opus45.honestMomentsDesc}</p>
        </div>
      </section>

      {/* Endless Chat */}
      <section className="rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold font-heading text-cyan-400">{t.opus45.endlessChat}</h2>
        </div>
        <p className="text-muted leading-relaxed">{t.opus45.endlessChatDesc}</p>
      </section>

      {/* Safety */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.opus45.safety}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20">
          <Shield className="w-8 h-8 text-emerald-400 mb-4" />
          <p className="text-muted leading-relaxed">{t.opus45.safetyDesc}</p>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.opus45.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.opus45.takeaway1,
              t.opus45.takeaway2,
              t.opus45.takeaway3,
              t.opus45.takeaway4,
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

      {/* Closing */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 text-center">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.opus45.closing}</h2>
        <p className="text-muted leading-relaxed max-w-3xl mx-auto">{t.opus45.closingDesc}</p>
      </section>

      {/* Fun Facts */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.opus45.funFacts}</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {funFacts.map((fact, i) => (
            <div key={i} className="flex gap-3 items-center p-4 bg-surface rounded-xl border border-border">
              <Cpu size={16} className="text-primary-light shrink-0" />
              <code className="text-sm text-muted">{fact}</code>
            </div>
          ))}
        </div>
      </section>
    </TopicLayout>
  )
}
