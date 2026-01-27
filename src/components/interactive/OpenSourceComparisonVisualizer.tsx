'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Building2,
  GitBranch,
  Lock,
  Unlock,
  ArrowRight,
  ArrowLeftRight,
  Code,
  Server,
  Shield,
  Zap,
  DollarSign,
  Eye
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type ViewMode = 'open' | 'closed' | 'compare'

interface FlowNode {
  id: string
  labelKey: string
  descKey: string
  icon: typeof Users
  color: string
}

const openSourceNodes: FlowNode[] = [
  { id: 'community', labelKey: 'openCommunity', descKey: 'openCommunityDesc', icon: Users, color: 'emerald' },
  { id: 'models', labelKey: 'openModels', descKey: 'openModelsDesc', icon: Code, color: 'cyan' },
  { id: 'tools', labelKey: 'openTools', descKey: 'openToolsDesc', icon: GitBranch, color: 'purple' },
  { id: 'benefits', labelKey: 'openBenefits', descKey: 'openBenefitsDesc', icon: Unlock, color: 'emerald' },
]

const closedSourceNodes: FlowNode[] = [
  { id: 'provider', labelKey: 'closedProvider', descKey: 'closedProviderDesc', icon: Building2, color: 'orange' },
  { id: 'models', labelKey: 'closedModels', descKey: 'closedModelsDesc', icon: Lock, color: 'red' },
  { id: 'access', labelKey: 'closedAccess', descKey: 'closedAccessDesc', icon: Server, color: 'amber' },
  { id: 'tradeoffs', labelKey: 'closedTradeoffs', descKey: 'closedTradeoffsDesc', icon: ArrowLeftRight, color: 'orange' },
]

function FlowDiagram({
  nodes,
  side,
  t
}: {
  nodes: FlowNode[]
  side: 'open' | 'closed'
  t: ReturnType<typeof useTranslation>['t']
}) {
  const isOpen = side === 'open'
  const bgGradient = isOpen
    ? 'from-emerald-500/10 to-cyan-500/10'
    : 'from-orange-500/10 to-red-500/10'
  const borderColor = isOpen ? 'border-emerald-500/30' : 'border-orange-500/30'

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${bgGradient} border ${borderColor}`}>
      <h3 className={`text-xl font-bold font-heading mb-6 ${isOpen ? 'text-emerald-400' : 'text-orange-400'}`}>
        {isOpen ? t.openSource.openSideTitle : t.openSource.closedSideTitle}
      </h3>

      <div className="space-y-4">
        {nodes.map((node, idx) => {
          const Icon = node.icon
          const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
            emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
            cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
            purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
            orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
            red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
            amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
          }
          const colors = colorClasses[node.color]

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: isOpen ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {idx > 0 && (
                <div className="flex justify-center py-2">
                  <ArrowRight size={16} className="text-muted rotate-90" />
                </div>
              )}
              <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={20} className={colors.text} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${colors.text}`}>
                      {t.openSource[node.labelKey as keyof typeof t.openSource]}
                    </h4>
                    <p className="text-sm text-muted mt-1">
                      {t.openSource[node.descKey as keyof typeof t.openSource]}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function ComparisonView({ t }: { t: ReturnType<typeof useTranslation>['t'] }) {
  const comparisons = [
    {
      aspect: 'Transparency',
      openIcon: Eye,
      closedIcon: Lock,
      openColor: 'emerald',
      closedColor: 'red'
    },
    {
      aspect: 'Cost',
      openIcon: DollarSign,
      closedIcon: DollarSign,
      openColor: 'emerald',
      closedColor: 'orange'
    },
    {
      aspect: 'Control',
      openIcon: Unlock,
      closedIcon: Building2,
      openColor: 'cyan',
      closedColor: 'orange'
    },
    {
      aspect: 'Innovation',
      openIcon: Zap,
      closedIcon: Zap,
      openColor: 'purple',
      closedColor: 'amber'
    },
    {
      aspect: 'Security',
      openIcon: Shield,
      closedIcon: Shield,
      openColor: 'emerald',
      closedColor: 'red'
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <FlowDiagram nodes={openSourceNodes} side="open" t={t} />
      <FlowDiagram nodes={closedSourceNodes} side="closed" t={t} />
    </div>
  )
}

function CommunityFlowAnimation({ t }: { t: ReturnType<typeof useTranslation>['t'] }) {
  const [activePhase, setActivePhase] = useState(0)

  const phases = [
    { labelKey: 'cycleFork', icon: GitBranch, color: 'cyan' },
    { labelKey: 'cycleCustomize', icon: Code, color: 'purple' },
    { labelKey: 'cycleContribute', icon: Users, color: 'emerald' },
  ]

  return (
    <div className="mt-8 p-6 rounded-2xl bg-surface border border-border">
      <h4 className="text-lg font-semibold text-text mb-4">{t.openSource.communityCycleTitle}</h4>

      <div className="flex items-center justify-center gap-4 md:gap-8">
        {phases.map((phase, idx) => {
          const Icon = phase.icon
          const isActive = activePhase === idx
          const colorClasses: Record<string, string> = {
            cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          }

          return (
            <motion.button
              key={phase.labelKey}
              onClick={() => setActivePhase(idx)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                isActive
                  ? colorClasses[phase.color]
                  : 'bg-surface-elevated border-border text-muted hover:text-text'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={24} />
              <span className="text-sm font-medium">{t.openSource[phase.labelKey as keyof typeof t.openSource]}</span>
              {isActive && (
                <motion.div
                  layoutId="activePhase"
                  className="absolute -bottom-1 w-2 h-2 rounded-full bg-current"
                />
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 text-muted">
          <ArrowRight size={16} className="rotate-180" />
          <span className="text-xs">{t.openSource.communityCycleDesc}</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  )
}

export function OpenSourceComparisonVisualizer() {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<ViewMode>('compare')

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex justify-center gap-2">
        {(['open', 'compare', 'closed'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === mode
                ? mode === 'open'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : mode === 'closed'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-primary/20 text-primary-light border border-primary/30'
                : 'bg-surface-elevated text-muted hover:text-text border border-border'
            }`}
          >
            {mode === 'open' && t.openSource.openSideTitle}
            {mode === 'closed' && t.openSource.closedSideTitle}
            {mode === 'compare' && 'Compare'}
          </button>
        ))}
      </div>

      {/* Content based on view mode */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'compare' && <ComparisonView t={t} />}
          {viewMode === 'open' && (
            <div className="max-w-xl mx-auto">
              <FlowDiagram nodes={openSourceNodes} side="open" t={t} />
            </div>
          )}
          {viewMode === 'closed' && (
            <div className="max-w-xl mx-auto">
              <FlowDiagram nodes={closedSourceNodes} side="closed" t={t} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Community Flow Animation - only show in open or compare mode */}
      {(viewMode === 'open' || viewMode === 'compare') && (
        <CommunityFlowAnimation t={t} />
      )}
    </div>
  )
}
