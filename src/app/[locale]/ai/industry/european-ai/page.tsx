'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { motion } from 'framer-motion'
import {
  Building2,
  Globe,
  Shield,
  Sparkles,
  Code,
  Mic,
  Image,
  Brain,
  ExternalLink,
  Languages,
} from 'lucide-react'

interface Company {
  nameKey: string
  countryKey: string
  focusKey: string
  descKey: string
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
    icon: Brain,
    gradient: 'from-orange-500 to-red-500',
    website: 'https://mistral.ai',
  },
  {
    nameKey: 'alephAlpha',
    countryKey: 'germany',
    focusKey: 'alephAlphaFocus',
    descKey: 'alephAlphaDesc',
    icon: Shield,
    gradient: 'from-blue-500 to-cyan-500',
    website: 'https://aleph-alpha.com',
  },
  {
    nameKey: 'kyutai',
    countryKey: 'france',
    focusKey: 'kyutaiFocus',
    descKey: 'kyutaiDesc',
    icon: Mic,
    gradient: 'from-purple-500 to-pink-500',
    website: 'https://kyutai.org',
  },
  {
    nameKey: 'poolside',
    countryKey: 'franceParis',
    focusKey: 'poolsideFocus',
    descKey: 'poolsideDesc',
    icon: Code,
    gradient: 'from-emerald-500 to-teal-500',
    website: 'https://poolside.ai',
  },
  {
    nameKey: 'elevenLabs',
    countryKey: 'ukPoland',
    focusKey: 'elevenLabsFocus',
    descKey: 'elevenLabsDesc',
    icon: Mic,
    gradient: 'from-indigo-500 to-purple-500',
    website: 'https://elevenlabs.io',
  },
  {
    nameKey: 'photoroom',
    countryKey: 'france',
    focusKey: 'photoroomFocus',
    descKey: 'photoroomDesc',
    icon: Image,
    gradient: 'from-pink-500 to-rose-500',
    website: 'https://photoroom.com',
  },
  {
    nameKey: 'lightOn',
    countryKey: 'france',
    focusKey: 'lightOnFocus',
    descKey: 'lightOnDesc',
    icon: Building2,
    gradient: 'from-amber-500 to-orange-500',
    website: 'https://lighton.ai',
  },
  {
    nameKey: 'sana',
    countryKey: 'sweden',
    focusKey: 'sanaFocus',
    descKey: 'sanaDesc',
    icon: Sparkles,
    gradient: 'from-cyan-500 to-blue-500',
    website: 'https://sanalabs.com',
  },
  {
    nameKey: 'deepL',
    countryKey: 'germany',
    focusKey: 'deepLFocus',
    descKey: 'deepLDesc',
    icon: Languages,
    gradient: 'from-sky-500 to-blue-600',
    website: 'https://deepl.com',
  },
]

function CompanyCard({
  company,
  t,
}: {
  company: Company
  t: ReturnType<typeof useTranslation>['t']
}) {
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
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${company.gradient} p-0.5`}
        >
          <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
            <Icon size={22} className="text-text" />
          </div>
        </div>
        <ExternalLink
          size={16}
          className="text-muted opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <h3 className="text-lg font-semibold text-text mb-1 font-heading group-hover:text-primary-light transition-colors">
        {
          t.europeanAi.companies[
            company.nameKey as keyof typeof t.europeanAi.companies
          ]
        }
      </h3>
      <p className="text-xs text-primary-light mb-3">
        {
          t.europeanAi.countries[
            company.countryKey as keyof typeof t.europeanAi.countries
          ]
        }
      </p>

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-muted font-medium">{t.europeanAi.focus}: </span>
          <span className="text-text">
            {
              t.europeanAi.focuses[
                company.focusKey as keyof typeof t.europeanAi.focuses
              ]
            }
          </span>
        </div>
        <p className="text-muted leading-relaxed">
          {
            t.europeanAi.descriptions[
              company.descKey as keyof typeof t.europeanAi.descriptions
            ]
          }
        </p>
      </div>

      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${company.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />
    </motion.a>
  )
}

export default function EuropeanAiPage() {
  const { t } = useTranslation(),
    e = t.europeanAi
  return (
    <TopicLayout
      topicId="european-ai"
      title={e.title}
      description={e.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: e.title },
      ]}
    >
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{e.intro}</h2>
        <p className="text-muted">{e.introDesc}</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl text-gradient">{e.keyCompanies}</h2>
        <p className="text-sm text-muted">{e.keyCompaniesDesc}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {companies.map((company) => (
            <CompanyCard company={company} t={t} key={company.nameKey} />
          ))}
        </div>
      </section>
      <section className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl text-gradient">{e.euAiAct}</h2>
        <p className="text-muted">{e.euAiActDesc}</p>
        <h3 className="font-semibold">{e.openSource}</h3>
        <p className="text-muted">{e.openSourceDesc}</p>
      </section>
    </TopicLayout>
  )
}
