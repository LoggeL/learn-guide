'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { motion } from 'framer-motion'
import { Heart, Brain, Zap, Shield, Sparkles, AlertTriangle, Server, Code, MessageSquare, Cpu, Trophy, ExternalLink, ChevronRight, Gauge, Users, Layers, Terminal, MousePointer, Calendar } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SectionIcon({ icon: Icon, gradient }: { icon: any; gradient: string }) {
  return (
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} p-0.5 shrink-0`}>
      <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
        <Icon size={18} className="text-text" />
      </div>
    </div>
  )
}

export default function FavouriteModelsPage() {
  const { t } = useTranslation()
  const f = t.favModels

  const opusStrengths = [
    { title: f.opusStrength1Title, desc: f.opusStrength1Desc, icon: Brain, gradient: 'from-purple-500 to-violet-500' },
    { title: f.opusStrength2Title, desc: f.opusStrength2Desc, icon: Users, gradient: 'from-blue-500 to-cyan-500' },
    { title: f.opusStrength3Title, desc: f.opusStrength3Desc, icon: Layers, gradient: 'from-orange-500 to-amber-500' },
    { title: f.opusStrength4Title, desc: f.opusStrength4Desc, icon: Code, gradient: 'from-emerald-500 to-teal-500' },
  ]

  const codexStrengths = [
    { title: f.codexStrength1Title, desc: f.codexStrength1Desc, icon: MousePointer, gradient: 'from-cyan-500 to-blue-500' },
    { title: f.codexStrength2Title, desc: f.codexStrength2Desc, icon: Cpu, gradient: 'from-green-500 to-emerald-500' },
    { title: f.codexStrength3Title, desc: f.codexStrength3Desc, icon: Gauge, gradient: 'from-yellow-500 to-orange-500' },
    { title: f.codexStrength4Title, desc: f.codexStrength4Desc, icon: MessageSquare, gradient: 'from-pink-500 to-rose-500' },
  ]

  const benchmarks = [
    { name: f.benchSWE, opus: f.benchSWEOpus, codex: f.benchSWECodex, note: f.benchSWENote },
    { name: f.benchTerminal, opus: f.benchTerminalOpus, codex: f.benchTerminalCodex, note: f.benchTerminalNote },
    { name: f.benchOSWorld, opus: f.benchOSWorldOpus, codex: f.benchOSWorldCodex, note: f.benchOSWorldNote },
    { name: f.benchGPQA, opus: f.benchGPQAOpus, codex: f.benchGPQACodex, note: f.benchGPQANote },
    { name: f.benchARC, opus: f.benchARCOpus, codex: f.benchARCCodex, note: f.benchARCNote },
    { name: f.benchHLE, opus: f.benchHLEOpus, codex: f.benchHLECodex, note: f.benchHLENote },
    { name: f.benchCyber, opus: f.benchCyberOpus, codex: f.benchCyberCodex, note: f.benchCyberNote },
  ]

  const commonTraits = [
    { title: f.common1Title, desc: f.common1Desc, icon: Server, gradient: 'from-purple-500 to-violet-500' },
    { title: f.common2Title, desc: f.common2Desc, icon: MousePointer, gradient: 'from-blue-500 to-cyan-500' },
    { title: f.common3Title, desc: f.common3Desc, icon: Code, gradient: 'from-emerald-500 to-teal-500' },
    { title: f.common4Title, desc: f.common4Desc, icon: Calendar, gradient: 'from-orange-500 to-red-500' },
  ]

  return (
    <TopicLayout
      title={f.title}
      description={f.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: f.title },
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
            <h3 className="text-lg font-bold font-heading text-amber-400 mb-2">{f.disclaimer}</h3>
            <p className="text-muted leading-relaxed">{f.disclaimerText}</p>
            <p className="text-xs text-muted mt-2">{f.lastUpdated}</p>
          </div>
        </div>
      </motion.section>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 text-center"
      >
        <div className="flex justify-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-0.5">
            <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
              <Brain size={28} className="text-orange-400" />
            </div>
          </div>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
            <Heart size={24} className="text-white" fill="currentColor" />
          </div>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5">
            <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
              <Terminal size={28} className="text-cyan-400" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold font-heading text-gradient mb-4">{f.heroTitle}</h2>
        <p className="text-muted leading-relaxed max-w-3xl mx-auto text-lg">{f.heroSubtitle}</p>
      </motion.section>

      {/* The Two Champions */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <SectionIcon icon={Trophy} gradient="from-yellow-500 to-orange-500" />
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{f.championsTitle}</h2>
            <p className="text-sm text-muted">{f.championsSubtitle}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Opus 4.6 Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-surface border border-orange-500/30 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-5 border-b border-orange-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Brain size={24} className="text-orange-400" />
                <div>
                  <h3 className="text-xl font-bold font-heading text-text">{f.opusName}</h3>
                  <p className="text-xs text-orange-400">{f.opusMaker}</p>
                </div>
              </div>
              <p className="text-sm text-muted italic">{f.opusTagline}</p>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                  <span className="text-muted text-xs block">Model ID</span>
                  <code className="text-orange-400 text-xs">{f.opusModelId}</code>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                  <span className="text-muted text-xs block">Released</span>
                  <span className="text-text text-xs">{f.opusReleaseDate}</span>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                  <span className="text-muted text-xs block">Context</span>
                  <span className="text-text text-xs">{f.opusContext}</span>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                  <span className="text-muted text-xs block">Output</span>
                  <span className="text-text text-xs">{f.opusOutput}</span>
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed">{f.opusDescription}</p>

              <div className="space-y-3">
                {opusStrengths.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex gap-3 items-start"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} p-0.5 shrink-0`}>
                      <div className="w-full h-full rounded-lg bg-surface flex items-center justify-center">
                        <s.icon size={14} className="text-text" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text">{s.title}</h4>
                      <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <a
                href={f.opusSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors mt-2"
              >
                <ExternalLink size={14} />
                {f.opusSourceLabel}
              </a>
            </div>
          </motion.div>

          {/* GPT-5.3-Codex Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-surface border border-cyan-500/30 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-5 border-b border-cyan-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Terminal size={24} className="text-cyan-400" />
                <div>
                  <h3 className="text-xl font-bold font-heading text-text">{f.codexName}</h3>
                  <p className="text-xs text-cyan-400">{f.codexMaker}</p>
                </div>
              </div>
              <p className="text-sm text-muted italic">{f.codexTagline}</p>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                  <span className="text-muted text-xs block">Model ID</span>
                  <code className="text-cyan-400 text-xs">{f.codexModelId}</code>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                  <span className="text-muted text-xs block">Released</span>
                  <span className="text-text text-xs">{f.codexReleaseDate}</span>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                  <span className="text-muted text-xs block">Context</span>
                  <span className="text-text text-xs">{f.codexContext}</span>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                  <span className="text-muted text-xs block">Output</span>
                  <span className="text-text text-xs">{f.codexOutput}</span>
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed">{f.codexDescription}</p>

              <div className="space-y-3">
                {codexStrengths.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex gap-3 items-start"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} p-0.5 shrink-0`}>
                      <div className="w-full h-full rounded-lg bg-surface flex items-center justify-center">
                        <s.icon size={14} className="text-text" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text">{s.title}</h4>
                      <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <a
                href={f.codexSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors mt-2"
              >
                <ExternalLink size={14} />
                {f.codexSourceLabel}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benchmark Showdown */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <SectionIcon icon={Zap} gradient="from-yellow-500 to-orange-500" />
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{f.benchmarkTitle}</h2>
            <p className="text-sm text-muted">{f.benchmarkSubtitle}</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-muted font-medium">Benchmark</th>
                <th className="text-center py-3 px-3 text-orange-400 font-medium">Opus 4.6</th>
                <th className="text-center py-3 px-3 text-cyan-400 font-medium">Codex 5.3</th>
                <th className="text-left py-3 px-3 text-muted font-medium hidden md:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b, i) => {
                const opusNum = parseFloat(b.opus.replace(',', '.'))
                const codexNum = parseFloat(b.codex.replace(',', '.'))
                const opusWins = !isNaN(opusNum) && !isNaN(codexNum) && opusNum > codexNum
                const codexWins = !isNaN(opusNum) && !isNaN(codexNum) && codexNum > opusNum

                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="border-b border-border/50 hover:bg-surface/80 transition-colors"
                  >
                    <td className="py-3 px-3 font-medium text-text">{b.name}</td>
                    <td className={`py-3 px-3 text-center font-mono ${opusWins ? 'text-orange-400 font-bold' : 'text-muted'}`}>
                      {b.opus}
                    </td>
                    <td className={`py-3 px-3 text-center font-mono ${codexWins ? 'text-cyan-400 font-bold' : 'text-muted'}`}>
                      {b.codex}
                    </td>
                    <td className="py-3 px-3 text-xs text-muted hidden md:table-cell">{b.note}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted mt-4">{f.benchDisclaimer}</p>
      </section>

      {/* When I Use Each */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <SectionIcon icon={Sparkles} gradient="from-primary to-accent" />
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{f.whenTitle}</h2>
            <p className="text-sm text-muted">{f.whenSubtitle}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Opus use cases */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-surface border border-orange-500/20 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain size={20} className="text-orange-400" />
              <h3 className="font-bold font-heading text-text">{f.whenOpusTitle}</h3>
            </div>
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Terminal size={14} className="text-orange-400" />
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">{f.whenOpusToolLabel}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{f.whenOpusToolDesc}</p>
            </div>
            <ul className="space-y-3">
              {[f.whenOpus1, f.whenOpus2, f.whenOpus3, f.whenOpus4, f.whenOpus5].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <ChevronRight size={14} className="text-orange-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Codex use cases */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl bg-surface border border-cyan-500/20 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={20} className="text-cyan-400" />
              <h3 className="font-bold font-heading text-text">{f.whenCodexTitle}</h3>
            </div>
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Code size={14} className="text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">{f.whenCodexToolLabel}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{f.whenCodexToolDesc}</p>
            </div>
            <ul className="space-y-3">
              {[f.whenCodex1, f.whenCodex2, f.whenCodex3, f.whenCodex4, f.whenCodex5].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <ChevronRight size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Pricing Reality */}
      <section className="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-red-400">{f.pricingTitle}</h2>
        </div>
        <p className="text-sm text-muted mb-6">{f.pricingSubtitle}</p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-background/40 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={16} className="text-orange-400" />
              <h3 className="font-bold text-text text-sm">{f.pricingOpusTitle}</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">{f.pricingOpusDetail}</p>
          </div>
          <div className="bg-background/40 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={16} className="text-cyan-400" />
              <h3 className="font-bold text-text text-sm">{f.pricingCodexTitle}</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">{f.pricingCodexDetail}</p>
          </div>
        </div>
        <p className="text-text/90 leading-relaxed text-sm italic">{f.pricingVerdict}</p>
      </section>

      {/* What They Share */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <SectionIcon icon={Shield} gradient="from-emerald-500 to-teal-500" />
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{f.commonTitle}</h2>
            <p className="text-sm text-muted">{f.commonSubtitle}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {commonTraits.map((trait, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="group relative p-5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${trait.gradient} p-0.5 mb-3`}>
                <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                  <trait.icon size={18} className="text-text" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-text mb-1 font-heading group-hover:text-primary-light transition-colors">
                {trait.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{trait.desc}</p>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${trait.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Personal Verdict */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 p-0.5">
            <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
              <Heart size={22} className="text-pink-400" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-heading text-gradient">{f.verdictTitle}</h2>
        </div>
        <p className="text-text/90 leading-relaxed text-lg">{f.verdictText}</p>
      </motion.section>

      {/* Quick Reference Table */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{f.quickRefTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-muted font-medium"></th>
                <th className="text-center py-3 px-3 text-orange-400 font-medium">{f.opusName}</th>
                <th className="text-center py-3 px-3 text-cyan-400 font-medium">{f.codexName}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                [f.quickRefMaker, f.opusMaker, f.codexMaker],
                [f.quickRefContext, f.opusContext, f.codexContext],
                [f.quickRefOutput, f.opusOutput, f.codexOutput],
                [f.quickRefPrice, f.opusPricing, f.codexPricing],
                [f.quickRefBestFor, f.quickRefOpusBest, f.quickRefCodexBest],
                [f.quickRefPlatforms, f.quickRefOpusPlatforms, f.quickRefCodexPlatforms],
              ].map(([label, opus, codex], i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-3 px-3 text-muted font-medium">{label}</td>
                  <td className="py-3 px-3 text-center text-text">{opus}</td>
                  <td className="py-3 px-3 text-center text-text">{codex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </TopicLayout>
  )
}
