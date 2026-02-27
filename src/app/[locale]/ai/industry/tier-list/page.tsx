'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { motion } from 'framer-motion'
import { AlertTriangle, Cloud, Monitor, Globe } from 'lucide-react'

type HostingType = 'api' | 'open-weight' | 'local'

interface ModelEntry {
  name: string
  desc: string
  hosting: HostingType
  params?: string
}

interface TierConfig {
  label: string
  desc: string
  color: string
  bgGradient: string
  borderColor: string
  badgeBg: string
  models: ModelEntry[]
}

const hostingConfig: Record<HostingType, { icon: typeof Cloud; label: string; color: string; bg: string }> = {
  api: { icon: Cloud, label: 'API only', color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/30' },
  'open-weight': { icon: Globe, label: 'Open Weight', color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/30' },
  local: { icon: Monitor, label: 'Consumer GPU', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
}

export default function TierListPage() {
  const { t } = useTranslation()
  const tl = t.tierList

  const tiers: TierConfig[] = [
    {
      label: tl.sTier,
      desc: tl.sTierDesc,
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/10 to-violet-500/10',
      borderColor: 'border-purple-500/30',
      badgeBg: 'bg-purple-500/20',
      models: [
        { name: tl.gpt53Codex, desc: tl.gpt53CodexDesc, hosting: 'api' },
        { name: tl.claudeOpus46, desc: tl.claudeOpus46Desc, hosting: 'api' },
      ],
    },
    {
      label: tl.aTier,
      desc: tl.aTierDesc,
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      badgeBg: 'bg-blue-500/20',
      models: [
        { name: tl.gemini3Flash, desc: tl.gemini3FlashDesc, hosting: 'api' },
        { name: tl.deepseekV32, desc: tl.deepseekV32Desc, hosting: 'open-weight', params: '685B MoE \u2192 37B active' },
        { name: tl.minimax25, desc: tl.minimax25Desc, hosting: 'open-weight', params: '230B MoE \u2192 10B active' },
        { name: tl.kimiK25, desc: tl.kimiK25Desc, hosting: 'api' },
        { name: tl.claudeSonnet46, desc: tl.claudeSonnet46Desc, hosting: 'api' },
        { name: tl.qwen35_35bA3b, desc: tl.qwen35_35bA3bDesc, hosting: 'local', params: '35B MoE \u2192 3B active' },
        { name: tl.qwen35_27b, desc: tl.qwen35_27bDesc, hosting: 'local', params: '27B dense' },
      ],
    },
    {
      label: tl.bTier,
      desc: tl.bTierDesc,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/20',
      models: [
        { name: tl.qwen3CoderNext, desc: tl.qwen3CoderNextDesc, hosting: 'local', params: '~32B' },
        { name: tl.gptOss20b, desc: tl.gptOss20bDesc, hosting: 'local', params: '20B dense' },
        { name: tl.glm5, desc: tl.glm5Desc, hosting: 'open-weight', params: '744B MoE \u2192 40B active' },
        { name: tl.qwen35, desc: tl.qwen35Desc, hosting: 'open-weight', params: '397B MoE \u2192 17B active' },
      ],
    },
    {
      label: tl.cTier,
      desc: tl.cTierDesc,
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-500/10 to-amber-500/10',
      borderColor: 'border-yellow-500/30',
      badgeBg: 'bg-yellow-500/20',
      models: [
        { name: tl.gemini31Pro, desc: tl.gemini31ProDesc, hosting: 'api' },
        { name: tl.grok41, desc: tl.grok41Desc, hosting: 'api' },
      ],
    },
    {
      label: tl.fTier,
      desc: tl.fTierDesc,
      color: 'text-red-400',
      bgGradient: 'from-red-500/10 to-rose-500/10',
      borderColor: 'border-red-500/30',
      badgeBg: 'bg-red-500/20',
      models: [
        { name: tl.llamaMaverick, desc: tl.llamaMaverickDesc, hosting: 'open-weight', params: '400B MoE \u2192 17B active' },
        { name: tl.amazonNova, desc: tl.amazonNovaDesc, hosting: 'api' },
      ],
    },
  ]

  return (
    <TopicLayout
      topicId="tier-list"
      title={tl.title}
      description={tl.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: tl.title },
      ]}
      prevTopic={{ label: t.topicNames['logges-favourite-model'], href: '/ai/industry/logges-favourite-model' }}
      nextTopic={{ label: t.topicNames.tokenization, href: '/ai/llm/tokenization' }}
    >
      {/* Intro */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <p className="text-muted leading-relaxed text-lg">
          {tl.intro}
        </p>
      </section>

      {/* Disclaimer */}
      <section className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-5 flex gap-4 items-start">
        <AlertTriangle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-yellow-400 mb-1">{tl.disclaimer}</h3>
          <p className="text-sm text-muted leading-relaxed">{tl.disclaimerText}</p>
        </div>
      </section>

      {/* Hosting Legend */}
      <section className="rounded-xl bg-surface/50 border border-border p-4">
        <div className="flex flex-wrap gap-4 items-center justify-center text-xs">
          {(Object.entries(hostingConfig) as [HostingType, typeof hostingConfig[HostingType]][]).map(([key, cfg]) => {
            const Icon = cfg.icon
            return (
              <div key={key} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.bg}`}>
                <Icon size={12} className={cfg.color} />
                <span className={cfg.color}>{cfg.label}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Tier Rows */}
      <section className="space-y-6">
        {tiers.map((tier, tierIdx) => (
          <motion.div
            key={tier.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: tierIdx * 0.1, duration: 0.4 }}
            className={`rounded-2xl bg-gradient-to-br ${tier.bgGradient} border ${tier.borderColor} overflow-hidden`}
          >
            {/* Tier Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
              <span className={`text-2xl font-bold font-heading ${tier.color}`}>
                {tier.label}
              </span>
              <span className="text-sm text-muted">{tier.desc}</span>
            </div>

            {/* Model Cards */}
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tier.models.map((model) => {
                const hcfg = hostingConfig[model.hosting]
                const HIcon = hcfg.icon
                return (
                  <div
                    key={model.name}
                    className="p-4 rounded-xl bg-background/50 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-semibold font-heading ${tier.color}`}>
                        {model.name}
                      </h4>
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] shrink-0 ${hcfg.bg}`} title={hcfg.label}>
                        <HIcon size={10} className={hcfg.color} />
                        <span className={hcfg.color}>{hcfg.label}</span>
                      </div>
                    </div>
                    {model.params && (
                      <p className="text-[10px] text-subtle font-mono mb-1.5">{model.params}</p>
                    )}
                    <p className="text-sm text-muted leading-relaxed">
                      {model.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </section>
    </TopicLayout>
  )
}
