'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface ModelEntry {
  name: string
  desc: string
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
        { name: tl.claudeOpus46, desc: tl.claudeOpus46Desc },
        { name: tl.kimi, desc: tl.kimiDesc },
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
        { name: tl.claudeSonnet46, desc: tl.claudeSonnet46Desc },
        { name: tl.deepseekV32, desc: tl.deepseekV32Desc },
        { name: tl.minimax25, desc: tl.minimax25Desc },
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
        { name: tl.glm5, desc: tl.glm5Desc },
        { name: tl.qwen35, desc: tl.qwen35Desc },
        { name: tl.llama4Maverick, desc: tl.llama4MaverickDesc },
        { name: tl.claudeHaiku45, desc: tl.claudeHaiku45Desc },
        { name: tl.gpt5Mini, desc: tl.gpt5MiniDesc },
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
        { name: tl.gpt52, desc: tl.gpt52Desc },
        { name: tl.gemini31Pro, desc: tl.gemini31ProDesc },
        { name: tl.grok4, desc: tl.grok4Desc },
      ],
    },
    {
      label: tl.dTier,
      desc: tl.dTierDesc,
      color: 'text-red-400',
      bgGradient: 'from-red-500/10 to-rose-500/10',
      borderColor: 'border-red-500/30',
      badgeBg: 'bg-red-500/20',
      models: [
        { name: tl.grok4Heavy, desc: tl.grok4HeavyDesc },
        { name: tl.claudeOpus45, desc: tl.claudeOpus45Desc },
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
        { label: t.categories.llm, href: '/ai/llm' },
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
              {tier.models.map((model) => (
                <div
                  key={model.name}
                  className="p-4 rounded-xl bg-background/50 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <h4 className={`font-semibold font-heading ${tier.color} mb-1`}>
                    {model.name}
                  </h4>
                  <p className="text-sm text-muted leading-relaxed">
                    {model.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>
    </TopicLayout>
  )
}
