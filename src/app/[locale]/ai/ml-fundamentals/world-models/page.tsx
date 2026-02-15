'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { WorldModelPipeline, SimToRealToggle, TrainingLoopViz } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

// ─── Latent Space Mini Viz (inline SVG) ─────────────────────────────────────
function LatentSpaceViz() {
  const [compressed, setCompressed] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          {compressed ? 'Compact latent representation (z)' : 'Raw high-dimensional input'}
        </p>
        <button
          onClick={() => setCompressed(!compressed)}
          className="px-3 py-1 rounded-lg text-xs font-medium border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors"
        >
          {compressed ? 'Show Input' : 'Compress →'}
        </button>
      </div>
      <svg viewBox="0 0 400 100" className="w-full h-auto">
        <AnimatePresence mode="wait">
          {!compressed ? (
            <motion.g key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: 16 }).map((_, row) =>
                Array.from({ length: 20 }).map((_, col) => {
                  const hue = (row * 20 + col * 13) % 360
                  return (
                    <motion.rect
                      key={`p-${row}-${col}`}
                      x={col * 20 + 2}
                      y={row * 6 + 2}
                      width={18}
                      height={4.5}
                      rx={1}
                      fill={`hsla(${hue}, 60%, 50%, 0.4)`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (row * 20 + col) * 0.003 }}
                    />
                  )
                })
              )}
              <text x="200" y="96" textAnchor="middle" fill="#9ca3af" className="text-[9px]">
                320 dimensions
              </text>
            </motion.g>
          ) : (
            <motion.g key="latent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.circle
                  key={`z-${i}`}
                  cx={120 + i * 22}
                  cy={50}
                  r={8}
                  fill={`hsla(${270 + i * 12}, 70%, 60%, 0.6)`}
                  stroke={`hsla(${270 + i * 12}, 70%, 60%, 0.9)`}
                  strokeWidth={1}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.06, type: 'spring' }}
                />
              ))}
              <text x="200" y="80" textAnchor="middle" fill="#a78bfa" className="text-[10px] font-semibold">
                8 latent dimensions
              </text>
              <text x="200" y="92" textAnchor="middle" fill="#6b7280" className="text-[8px]">
                40× compression — essential features preserved
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function WorldModelsPage() {
  const { t } = useTranslation()
  const [expandedExample, setExpandedExample] = useState<string | null>(null)

  const examples = [
    {
      id: 'cosmos',
      name: t.worldModels.nvidiaCosmos,
      desc: t.worldModels.nvidiaCosmosDesc,
      detail: t.worldModels.nvidiaCosmosDetail,
      company: 'NVIDIA',
      color: '#34d399',
      gradient: 'from-emerald-500/15 to-teal-500/10',
      border: 'border-emerald-500/25',
      tag: t.worldModels.tagAutonomous,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      id: 'genie',
      name: t.worldModels.googleGenie,
      desc: t.worldModels.googleGenieDesc,
      detail: t.worldModels.googleGenieDetail,
      company: 'Google DeepMind',
      color: '#a78bfa',
      gradient: 'from-purple-500/15 to-violet-500/10',
      border: 'border-purple-500/25',
      tag: t.worldModels.tag3DWorlds,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'genesis',
      name: t.worldModels.genesis,
      desc: t.worldModels.genesisDesc,
      detail: t.worldModels.genesisDetail,
      company: 'Open Source',
      color: '#22d3ee',
      gradient: 'from-cyan-500/15 to-blue-500/10',
      border: 'border-cyan-500/25',
      tag: t.worldModels.tagPhysics,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="9" ry="4" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      id: 'unisim',
      name: t.worldModels.uniSim,
      desc: t.worldModels.uniSimDesc,
      detail: t.worldModels.uniSimDetail,
      company: 'Google Research',
      color: '#fbbf24',
      gradient: 'from-yellow-500/15 to-amber-500/10',
      border: 'border-yellow-500/25',
      tag: t.worldModels.tagUniversal,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12a4 4 0 018 0" />
          <circle cx="12" cy="8" r="1.5" fill="#fbbf24" />
        </svg>
      ),
    },
    {
      id: 'gaia',
      name: t.worldModels.gaia1,
      desc: t.worldModels.gaia1Desc,
      detail: t.worldModels.gaia1Detail,
      company: 'Wayve',
      color: '#f472b6',
      gradient: 'from-pink-500/15 to-rose-500/10',
      border: 'border-pink-500/25',
      tag: t.worldModels.tagDriving,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.5">
          <path d="M5 17h14M7 17l1-8h8l1 8" />
          <circle cx="9" cy="17" r="2" />
          <circle cx="15" cy="17" r="2" />
        </svg>
      ),
    },
  ]

  return (
    <TopicLayout
      topicId="world-models"
      title={t.worldModels.title}
      description={t.worldModels.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: t.worldModels.title },
      ]}
      prevTopic={{ label: t.topicNames['training'], href: '/ai/ml-fundamentals/training' }}
    >
      {/* ── Hero: What are World Models ── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.worldModels.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">
          {t.worldModels.whatIsDesc}
        </p>
        <p className="text-muted leading-relaxed mb-6">
          {t.worldModels.whatIsDesc2}
        </p>

        {/* Key insight box */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <path d="M12 2a7 7 0 017 7c0 3-2 5.5-4 7.5L12 22l-3-5.5C7 14.5 5 12 5 9a7 7 0 017-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-400 mb-1">{t.worldModels.keyInsight}</p>
              <p className="text-sm text-muted leading-relaxed italic">
                {t.worldModels.keyInsightDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Pipeline ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                <circle cx="5" cy="12" r="3" />
                <circle cx="19" cy="12" r="3" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.worldModels.pipelineTitle}</h2>
            <p className="text-sm text-muted">{t.worldModels.pipelineDesc}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <WorldModelPipeline />
        </div>
      </section>

      {/* ── How They Work: Core Techniques ── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.worldModels.howTheyWork}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.worldModels.howTheyWorkDesc}
        </p>

        {/* Latent Space with inline visualizer */}
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.worldModels.latentSpace}</h3>
            <p className="text-sm text-muted mb-4">{t.worldModels.latentSpaceDesc}</p>
            <LatentSpaceViz />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="3" />
                  <path d="M7 8h10M7 12h6M7 16h8" />
                </svg>
                <h3 className="text-base font-bold font-heading text-cyan-400">{t.worldModels.videoPrediction}</h3>
              </div>
              <p className="text-sm text-muted">{t.worldModels.videoPredictionDesc}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4l3 3" />
                </svg>
                <h3 className="text-base font-bold font-heading text-emerald-400">{t.worldModels.physicsAware}</h3>
              </div>
              <p className="text-sm text-muted">{t.worldModels.physicsAwareDesc}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
                  <path d="M12 3v18M3 12h18" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <h3 className="text-base font-bold font-heading text-orange-400">{t.worldModels.diffusion}</h3>
              </div>
              <p className="text-sm text-muted">{t.worldModels.diffusionDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Needed: Sim vs Real ── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.worldModels.whyNeeded}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.worldModels.whyNeededIntro}</p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              ),
              title: t.worldModels.slowExpensive,
              desc: t.worldModels.slowExpensiveDesc,
              color: '#fb923c',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              ),
              title: t.worldModels.parallelTraining,
              desc: t.worldModels.parallelTrainingDesc,
              color: '#22d3ee',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                  <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" />
                  <circle cx="12" cy="9" r="2" />
                </svg>
              ),
              title: t.worldModels.physicsUnderstanding,
              desc: t.worldModels.physicsUnderstandingDesc,
              color: '#a78bfa',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 bg-background rounded-xl border border-border"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-text text-sm">{item.title}</h4>
              </div>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive comparison */}
        <div>
          <h3 className="text-lg font-bold font-heading text-text mb-4">{t.worldModels.simVsRealTitle}</h3>
          <SimToRealToggle />
        </div>
      </section>

      {/* ── Training Loop Interactive ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.2-8.6" />
                <path d="M21 3v5h-5" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.worldModels.trainingLoopTitle}</h2>
            <p className="text-sm text-muted">{t.worldModels.trainingLoopDesc}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <TrainingLoopViz />
        </div>
      </section>

      {/* ── Examples: Model Cards ── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-2">{t.worldModels.examples}</h2>
        <p className="text-muted mb-6">{t.worldModels.examplesIntro}</p>

        <div className="space-y-3">
          {examples.map((ex) => {
            const isExpanded = expandedExample === ex.id
            return (
              <motion.div
                key={ex.id}
                layout
                className={`rounded-xl border bg-gradient-to-r ${ex.gradient} ${ex.border} overflow-hidden cursor-pointer transition-colors`}
                onClick={() => setExpandedExample(isExpanded ? null : ex.id)}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${ex.color}15` }}
                    >
                      {ex.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold font-heading" style={{ color: ex.color }}>{ex.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ backgroundColor: `${ex.color}20`, color: ex.color }}
                        >
                          {ex.tag}
                        </span>
                      </div>
                      <p className="text-xs text-muted mb-1">{ex.company}</p>
                      <p className="text-sm text-muted leading-relaxed">{ex.desc}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="shrink-0 mt-1"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <div className="p-4 rounded-lg bg-background/50 border border-border">
                          <p className="text-sm text-muted leading-relaxed">{ex.detail}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.worldModels.useCases}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5">
                  <path d="M5 17h14M7 17l1-8h8l1 8" />
                  <circle cx="9" cy="17" r="2" />
                  <circle cx="15" cy="17" r="2" />
                  <path d="M10 9h4" />
                </svg>
              ),
              title: t.worldModels.autonomousDriving,
              desc: t.worldModels.autonomousDrivingDesc,
              color: '#34d399',
              stat: t.worldModels.autonomousDrivingStat,
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M8 14l-2 8M16 14l2 8M10 14v8M14 14v8" />
                  <path d="M8 18h8" />
                </svg>
              ),
              title: t.worldModels.robotics,
              desc: t.worldModels.roboticsDesc,
              color: '#a78bfa',
              stat: t.worldModels.roboticsStat,
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="14" rx="2" />
                  <path d="M10 10l4-3v6l-4-3z" fill="#22d3ee" opacity="0.3" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              ),
              title: t.worldModels.videoGeneration,
              desc: t.worldModels.videoGenerationDesc,
              color: '#22d3ee',
              stat: t.worldModels.videoGenerationStat,
            },
          ].map((uc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 bg-background rounded-xl border border-border hover:border-opacity-60 transition-colors group"
              style={{ borderColor: `${uc.color}20` }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${uc.color}15` }}
              >
                {uc.icon}
              </div>
              <h4 className="font-bold text-text mb-2">{uc.title}</h4>
              <p className="text-sm text-muted leading-relaxed mb-3">{uc.desc}</p>
              <div className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ backgroundColor: `${uc.color}10`, color: uc.color }}
              >
                {uc.stat}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Challenges ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <circle cx="12" cy="17" r="0.5" fill="#ef4444" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.worldModels.challenges}</h2>
            <p className="text-sm text-muted">{t.worldModels.challengesDesc}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: t.worldModels.computeIntensive,
              desc: t.worldModels.computeIntensiveDesc,
              color: '#ef4444',
              gradient: 'from-red-500/5 to-orange-500/5',
              border: 'border-red-500/20',
              severity: t.worldModels.severityHigh,
            },
            {
              title: t.worldModels.simToReal,
              desc: t.worldModels.simToRealDesc,
              color: '#fbbf24',
              gradient: 'from-yellow-500/5 to-orange-500/5',
              border: 'border-yellow-500/20',
              severity: t.worldModels.severityMedium,
            },
            {
              title: t.worldModels.generalization,
              desc: t.worldModels.generalizationDesc,
              color: '#a78bfa',
              gradient: 'from-purple-500/5 to-pink-500/5',
              border: 'border-purple-500/20',
              severity: t.worldModels.severityOpen,
            },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 bg-gradient-to-br ${c.gradient} border ${c.border} rounded-xl`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold font-heading" style={{ color: c.color }}>{c.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ backgroundColor: `${c.color}20`, color: c.color }}
                >
                  {c.severity}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Key Takeaways ── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.worldModels.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.worldModels.takeaway1,
              t.worldModels.takeaway2,
              t.worldModels.takeaway3,
              t.worldModels.takeaway4,
              t.worldModels.takeaway5,
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
