'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { Terminal, Brain, Wrench, Database, ArrowRight, Sparkles, AlertTriangle, Eye, ShieldAlert, Users, Zap } from 'lucide-react'

export default function PowerfulAgentsPage() {
  const { t } = useTranslation()

  const ingredients = [
    { icon: Terminal, color: 'purple', titleKey: 'ingredientShell', descKey: 'ingredientShellDesc' },
    { icon: Brain, color: 'cyan', titleKey: 'ingredientIdentity', descKey: 'ingredientIdentityDesc' },
    { icon: Database, color: 'emerald', titleKey: 'ingredientMemory', descKey: 'ingredientMemoryDesc' },
    { icon: Wrench, color: 'orange', titleKey: 'ingredientTools', descKey: 'ingredientToolsDesc' },
  ] as const

  const shifts = [
    { fromKey: 'shift1From', toKey: 'shift1To', descKey: 'shift1Desc', color: 'purple' },
    { fromKey: 'shift2From', toKey: 'shift2To', descKey: 'shift2Desc', color: 'cyan' },
    { fromKey: 'shift3From', toKey: 'shift3To', descKey: 'shift3Desc', color: 'emerald' },
    { fromKey: 'shift4From', toKey: 'shift4To', descKey: 'shift4Desc', color: 'orange' },
    { fromKey: 'shift5From', toKey: 'shift5To', descKey: 'shift5Desc', color: 'rose' },
  ] as const

  const colorMap = {
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'from-purple-500/20 to-purple-600/20' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: 'from-cyan-500/20 to-cyan-600/20' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'from-emerald-500/20 to-emerald-600/20' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: 'from-orange-500/20 to-orange-600/20' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', icon: 'from-rose-500/20 to-rose-600/20' },
  }

  const possibilities = [
    { titleKey: 'pos1Title', descKey: 'pos1Desc', icon: Brain },
    { titleKey: 'pos2Title', descKey: 'pos2Desc', icon: Sparkles },
    { titleKey: 'pos3Title', descKey: 'pos3Desc', icon: Zap },
    { titleKey: 'pos4Title', descKey: 'pos4Desc', icon: Terminal },
  ] as const

  const dangers = [
    { titleKey: 'dan1Title', descKey: 'dan1Desc', icon: Eye },
    { titleKey: 'dan2Title', descKey: 'dan2Desc', icon: Terminal },
    { titleKey: 'dan3Title', descKey: 'dan3Desc', icon: Users },
    { titleKey: 'dan4Title', descKey: 'dan4Desc', icon: ShieldAlert },
  ] as const

  return (
    <TopicLayout
      topicId="powerful-agents"
      title={t.powerfulAgents.title}
      description={t.powerfulAgents.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.powerfulAgents.title },
      ]}
      prevTopic={{ label: t.topicNames['evaluation'], href: '/ai/agents/evaluation' }}
      nextTopic={{ label: t.topicNames['visual-challenges'], href: '/ai/llm/visual-challenges' }}
    >
      {/* Intro */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
            <Sparkles size={24} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-gradient mb-3">{t.powerfulAgents.introTitle}</h2>
            <p className="text-muted leading-relaxed text-lg">
              {t.powerfulAgents.introDesc}
            </p>
          </div>
        </div>

        {/* The Pattern */}
        <div className="mt-6">
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">{t.powerfulAgents.patternLabel}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ingredients.map(({ icon: Icon, color, titleKey, descKey }) => {
              const c = colorMap[color]
              return (
                <div key={titleKey} className={`p-4 rounded-xl ${c.bg} border ${c.border}`}>
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c.icon} flex items-center justify-center mb-3`}>
                    <Icon size={18} className={c.text} />
                  </div>
                  <h3 className={`font-semibold text-sm ${c.text} mb-1`}>{t.powerfulAgents[titleKey]}</h3>
                  <p className="text-xs text-muted leading-relaxed">{t.powerfulAgents[descKey]}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* The Five Shifts */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-b border-border flex items-center gap-3">
          <ArrowRight size={20} className="text-purple-400" />
          <h2 className="text-xl font-bold font-heading text-text">{t.powerfulAgents.shiftsTitle}</h2>
        </div>
        <div className="p-6">
          <p className="text-muted leading-relaxed mb-6">{t.powerfulAgents.shiftsDesc}</p>
          <div className="space-y-3">
            {shifts.map(({ fromKey, toKey, descKey, color }, i) => {
              const c = colorMap[color]
              return (
                <div key={fromKey} className={`p-4 rounded-xl ${c.bg} border ${c.border} flex flex-col sm:flex-row sm:items-center gap-3`}>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`w-6 h-6 rounded-full ${c.bg} border ${c.border} flex items-center justify-center text-xs font-bold ${c.text}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-mono text-muted line-through">{t.powerfulAgents[fromKey]}</span>
                    <ArrowRight size={14} className={c.text} />
                    <span className={`text-sm font-semibold ${c.text}`}>{t.powerfulAgents[toKey]}</span>
                  </div>
                  <p className="text-sm text-muted sm:ml-auto sm:text-right max-w-xs">{t.powerfulAgents[descKey]}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Possibilities */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-3">
          <Sparkles size={20} className="text-emerald-400" />
          <div>
            <h2 className="text-xl font-bold font-heading text-text">{t.powerfulAgents.possibilitiesTitle}</h2>
            <p className="text-xs text-muted mt-0.5">{t.powerfulAgents.possibilitiesSubtitle}</p>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-4">
          {possibilities.map(({ titleKey, descKey, icon: Icon }, i) => (
            <div key={titleKey} className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Icon size={16} className="text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{i + 1}</span>
              </div>
              <h3 className="font-semibold text-text mb-2">{t.powerfulAgents[titleKey]}</h3>
              <p className="text-sm text-muted leading-relaxed">{t.powerfulAgents[descKey]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dangers */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-red-500/10 border-b border-red-500/20 flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-400" />
          <div>
            <h2 className="text-xl font-bold font-heading text-text">{t.powerfulAgents.dangersTitle}</h2>
            <p className="text-xs text-muted mt-0.5">{t.powerfulAgents.dangersSubtitle}</p>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-4">
          {dangers.map(({ titleKey, descKey, icon: Icon }, i) => (
            <div key={titleKey} className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Icon size={16} className="text-red-400" />
                </div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{i + 1}</span>
              </div>
              <h3 className="font-semibold text-text mb-2">{t.powerfulAgents[titleKey]}</h3>
              <p className="text-sm text-muted leading-relaxed">{t.powerfulAgents[descKey]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Core Tension */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-red-500/10 to-emerald-500/10 border-b border-border flex items-center gap-3">
          <Zap size={20} className="text-orange-400" />
          <h2 className="text-xl font-bold font-heading text-text">{t.powerfulAgents.tensionTitle}</h2>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">{t.powerfulAgents.tensionDesc}</p>

          {/* Tension diagram */}
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <h3 className="font-semibold text-red-400 mb-2 text-sm">{t.powerfulAgents.tensionLeft}</h3>
              <p className="text-xs text-muted">{t.powerfulAgents.tensionLeftDesc}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center mx-auto mb-2">
                <Sparkles size={16} className="text-purple-400" />
              </div>
              <h3 className="font-semibold text-gradient mb-2 text-sm">{t.powerfulAgents.tensionCenter}</h3>
              <p className="text-xs text-muted">{t.powerfulAgents.tensionCenterDesc}</p>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
              <h3 className="font-semibold text-orange-400 mb-2 text-sm">{t.powerfulAgents.tensionRight}</h3>
              <p className="text-xs text-muted">{t.powerfulAgents.tensionRightDesc}</p>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="relative pl-6 border-l-2 border-purple-500/40">
            <p className="text-text italic leading-relaxed">
              &ldquo;{t.powerfulAgents.tensionQuote}&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.powerfulAgents.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.powerfulAgents.takeaway1,
              t.powerfulAgents.takeaway2,
              t.powerfulAgents.takeaway3,
              t.powerfulAgents.takeaway4,
              t.powerfulAgents.takeaway5,
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
