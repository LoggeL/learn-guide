'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { motion } from 'framer-motion'
import { Building2, Globe, Shield, Sparkles, Code, Mic, Image, Brain, ExternalLink, Languages } from 'lucide-react'

interface Company {
  nameKey: string
  countryKey: string
  focusKey: string
  descKey: string
  fundingKey: string
  notableKey: string
  icon: typeof Building2
  gradient: string
  website: string
}

const companies: Company[] = [
  {
    nameKey: 'mistral',
    countryKey: 'france',
    focusKey: 'mistralFocus',
    descKey: 'mistralDesc',
    fundingKey: 'mistralFunding',
    notableKey: 'mistralNotable',
    icon: Brain,
    gradient: 'from-orange-500 to-red-500',
    website: 'https://mistral.ai',
  },
  {
    nameKey: 'alephAlpha',
    countryKey: 'germany',
    focusKey: 'alephAlphaFocus',
    descKey: 'alephAlphaDesc',
    fundingKey: 'alephAlphaFunding',
    notableKey: 'alephAlphaNotable',
    icon: Shield,
    gradient: 'from-blue-500 to-cyan-500',
    website: 'https://aleph-alpha.com',
  },
  {
    nameKey: 'kyutai',
    countryKey: 'france',
    focusKey: 'kyutaiFocus',
    descKey: 'kyutaiDesc',
    fundingKey: 'kyutaiFunding',
    notableKey: 'kyutaiNotable',
    icon: Mic,
    gradient: 'from-purple-500 to-pink-500',
    website: 'https://kyutai.org',
  },
  {
    nameKey: 'poolside',
    countryKey: 'franceParis',
    focusKey: 'poolsideFocus',
    descKey: 'poolsideDesc',
    fundingKey: 'poolsideFunding',
    notableKey: 'poolsideNotable',
    icon: Code,
    gradient: 'from-emerald-500 to-teal-500',
    website: 'https://poolside.ai',
  },
  {
    nameKey: 'elevenLabs',
    countryKey: 'ukPoland',
    focusKey: 'elevenLabsFocus',
    descKey: 'elevenLabsDesc',
    fundingKey: 'elevenLabsFunding',
    notableKey: 'elevenLabsNotable',
    icon: Mic,
    gradient: 'from-indigo-500 to-purple-500',
    website: 'https://elevenlabs.io',
  },
  {
    nameKey: 'photoroom',
    countryKey: 'france',
    focusKey: 'photoroomFocus',
    descKey: 'photoroomDesc',
    fundingKey: 'photoroomFunding',
    notableKey: 'photoroomNotable',
    icon: Image,
    gradient: 'from-pink-500 to-rose-500',
    website: 'https://photoroom.com',
  },
  {
    nameKey: 'lightOn',
    countryKey: 'france',
    focusKey: 'lightOnFocus',
    descKey: 'lightOnDesc',
    fundingKey: 'lightOnFunding',
    notableKey: 'lightOnNotable',
    icon: Building2,
    gradient: 'from-amber-500 to-orange-500',
    website: 'https://lighton.ai',
  },
  {
    nameKey: 'sana',
    countryKey: 'sweden',
    focusKey: 'sanaFocus',
    descKey: 'sanaDesc',
    fundingKey: 'sanaFunding',
    notableKey: 'sanaNotable',
    icon: Sparkles,
    gradient: 'from-cyan-500 to-blue-500',
    website: 'https://sanalabs.com',
  },
  {
    nameKey: 'deepL',
    countryKey: 'germany',
    focusKey: 'deepLFocus',
    descKey: 'deepLDesc',
    fundingKey: 'deepLFunding',
    notableKey: 'deepLNotable',
    icon: Languages,
    gradient: 'from-sky-500 to-blue-600',
    website: 'https://deepl.com',
  },
]

function CompanyCard({ company, t }: { company: Company; t: ReturnType<typeof useTranslation>['t'] }) {
  const Icon = company.icon

  return (
    <motion.a
      href={company.website}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${company.gradient} p-0.5`}>
          <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
            <Icon size={22} className="text-text" />
          </div>
        </div>
        <ExternalLink size={16} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <h3 className="text-lg font-semibold text-text mb-1 font-heading group-hover:text-primary-light transition-colors">
        {t.europeanAi.companies[company.nameKey as keyof typeof t.europeanAi.companies]}
      </h3>
      <p className="text-xs text-primary-light mb-3">
        {t.europeanAi.countries[company.countryKey as keyof typeof t.europeanAi.countries]}
      </p>

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-muted font-medium">{t.europeanAi.focus}: </span>
          <span className="text-text">{t.europeanAi.focuses[company.focusKey as keyof typeof t.europeanAi.focuses]}</span>
        </div>
        <p className="text-muted leading-relaxed">
          {t.europeanAi.descriptions[company.descKey as keyof typeof t.europeanAi.descriptions]}
        </p>
        <div className="pt-2 border-t border-border/50">
          <span className="text-xs text-subtle">{t.europeanAi.funding}: </span>
          <span className="text-xs text-emerald-400">
            {t.europeanAi.fundings[company.fundingKey as keyof typeof t.europeanAi.fundings]}
          </span>
        </div>
      </div>

      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${company.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    </motion.a>
  )
}

export default function EuropeanAiPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.europeanAi.title}
      description={t.europeanAi.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/' },
        { label: t.europeanAi.title },
      ]}
      prevTopic={{ label: t.topicNames['responsible-ai'], href: '/ai/safety/responsible-ai' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.europeanAi.intro}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.europeanAi.introDesc}
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
              <Globe className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.europeanAi.stat1Title}</h3>
              <p className="text-2xl font-bold text-text mb-1">{t.europeanAi.stat1Value}</p>
              <p className="text-sm text-muted">{t.europeanAi.stat1Desc}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
              <Building2 className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.europeanAi.stat2Title}</h3>
              <p className="text-2xl font-bold text-text mb-1">{t.europeanAi.stat2Value}</p>
              <p className="text-sm text-muted">{t.europeanAi.stat2Desc}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
              <Shield className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.europeanAi.stat3Title}</h3>
              <p className="text-2xl font-bold text-text mb-1">{t.europeanAi.stat3Value}</p>
              <p className="text-sm text-muted">{t.europeanAi.stat3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Companies */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <Building2 size={18} className="text-primary-light" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.europeanAi.keyCompanies}</h2>
            <p className="text-sm text-muted">{t.europeanAi.keyCompaniesDesc}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.nameKey} company={company} t={t} />
          ))}
        </div>
      </section>

      {/* EU AI Act */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.europeanAi.euAiAct}</h2>
        <div className="space-y-6">
          <p className="text-muted leading-relaxed">
            {t.europeanAi.euAiActDesc}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
              <h3 className="text-cyan-400 font-bold mb-3">{t.europeanAi.advantage1Title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.europeanAi.advantage1Desc}</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
              <h3 className="text-purple-400 font-bold mb-3">{t.europeanAi.advantage2Title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.europeanAi.advantage2Desc}</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20">
              <h3 className="text-emerald-400 font-bold mb-3">{t.europeanAi.advantage3Title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.europeanAi.advantage3Desc}</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
              <h3 className="text-orange-400 font-bold mb-3">{t.europeanAi.advantage4Title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.europeanAi.advantage4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Focus */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.europeanAi.openSource}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <p className="text-muted leading-relaxed mb-6">
            {t.europeanAi.openSourceDesc}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Mistral 7B / Mixtral', desc: t.europeanAi.model1Desc },
              { name: 'Moshi (Kyutai)', desc: t.europeanAi.model2Desc },
              { name: 'ModernBERT (LightOn)', desc: t.europeanAi.model3Desc },
              { name: 'TildeOpen LLM', desc: t.europeanAi.model4Desc },
            ].map((model, i) => (
              <div key={i} className="flex gap-3 items-start p-4 bg-background/50 rounded-xl border border-border/50">
                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Code size={14} className="text-primary-light" />
                </div>
                <div>
                  <span className="font-medium text-text">{model.name}</span>
                  <p className="text-sm text-muted mt-1">{model.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.europeanAi.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.europeanAi.takeaway1,
              t.europeanAi.takeaway2,
              t.europeanAi.takeaway3,
              t.europeanAi.takeaway4,
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
