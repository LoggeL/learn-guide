'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { models, tierConfig, hostingConfig, type TierLevel, type HostingType } from '@/lib/models'
import { motion } from 'framer-motion'
import { AlertTriangle, Cloud, Monitor, Globe } from 'lucide-react'
import Link from 'next/link'

const hostingIcons: Record<HostingType, typeof Cloud> = {
  api: Cloud,
  'open-weight': Globe,
  local: Monitor,
}

const tierOrder: TierLevel[] = ['S', 'A', 'B', 'C', 'D', 'F']

export default function TierListPage() {
  const { t } = useTranslation()
  const tl = t.tierList

  const tierLabels: Record<TierLevel, { label: string; desc: string }> = {
    S: { label: tl.sTier, desc: tl.sTierDesc },
    A: { label: tl.aTier, desc: tl.aTierDesc },
    B: { label: tl.bTier, desc: tl.bTierDesc },
    C: { label: tl.cTier, desc: tl.cTierDesc },
    D: { label: tl.dTier, desc: tl.dTierDesc },
    F: { label: tl.fTier, desc: tl.fTierDesc },
  }

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
        <p className="text-muted leading-relaxed text-lg">{tl.intro}</p>
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
            const Icon = hostingIcons[key]
            return (
              <div key={key} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.bg}`}>
                <Icon size={12} className={cfg.color} />
                <span className={cfg.color}>{cfg.label}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-3 text-center">
          <Link href="/ai/llm-inference/vram-calc" className="text-xs text-violet-400 hover:text-violet-300 hover:underline">
            {tl.vramCalcNote} &rarr;
          </Link>
        </div>
      </section>

      {/* Tier Rows */}
      <section className="space-y-6">
        {tierOrder.map((tier, tierIdx) => {
          const tcfg = tierConfig[tier]
          const tlab = tierLabels[tier]
          const tierModels = models.filter(m => m.tier === tier)

          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tierIdx * 0.1, duration: 0.4 }}
              className={`rounded-2xl bg-gradient-to-br ${tcfg.bgGradient} border ${tcfg.borderColor} overflow-hidden`}
            >
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                <span className={`text-2xl font-bold font-heading ${tcfg.color}`}>{tlab.label}</span>
                <span className="text-sm text-muted">{tlab.desc}</span>
              </div>

              <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tierModels.map((model) => {
                  const hcfg = hostingConfig[model.hosting]
                  const HIcon = hostingIcons[model.hosting]
                  const name = (tl as Record<string, string>)[model.nameKey] || model.id
                  const desc = (tl as Record<string, string>)[model.descKey] || ''

                  return (
                    <div
                      key={model.id}
                      className="p-4 rounded-xl bg-background/50 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`font-semibold font-heading ${tcfg.color}`}>{name}</h4>
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] shrink-0 ${hcfg.bg}`} title={hcfg.label}>
                          <HIcon size={10} className={hcfg.color} />
                          <span className={hcfg.color}>{hcfg.label}</span>
                        </div>
                      </div>
                      {model.params && (
                        <p className="text-[10px] text-subtle font-mono mb-1.5">{model.params}</p>
                      )}
                      <p className="text-sm text-muted leading-relaxed">{desc}</p>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </section>
    </TopicLayout>
  )
}
