'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { WorldModelPipeline, SimToRealToggle, TrainingLoopViz } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

// ─── Latent Space Interactive Viz ─────────────────────────────────────────────
// Shows how 4 latent dimensions each control a complex visual concept
function LatentSpaceViz() {
  const { t } = useTranslation()
  const [z, setZ] = useState([0.65, 0.3, 0.5, 0.1])

  const updateZ = (i: number, v: number) => {
    setZ(prev => {
      const next = [...prev]
      next[i] = v
      return next
    })
  }

  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t)

  // ── z₁: Time of Day (sky color, sun/moon, stars) ──
  const time = z[0]
  let stR: number, stG: number, stB: number // sky top
  let sbR: number, sbG: number, sbB: number // sky bottom
  if (time < 0.5) {
    const p = time * 2
    stR = lerp(15, 30, p); stG = lerp(23, 64, p); stB = lerp(42, 175, p)
    sbR = lerp(30, 56, p); sbG = lerp(41, 189, p); sbB = lerp(59, 248, p)
  } else {
    const p = (time - 0.5) * 2
    stR = lerp(30, 124, p); stG = lerp(64, 45, p); stB = lerp(175, 18, p)
    sbR = lerp(56, 251, p); sbG = lerp(189, 146, p); sbB = lerp(248, 60, p)
  }
  const starsOpacity = Math.max(0, 1 - time * 4)
  const sunY = 95 - Math.sin(time * Math.PI) * 55
  const sunOpacity = time > 0.1 ? Math.min(1, (time - 0.1) * 4) : 0
  const sunColor = time > 0.7 ? '#fb923c' : '#facc15'
  const moonOpacity = time < 0.15 ? 1 : Math.max(0, 1 - (time - 0.15) * 8)
  const groundLight = lerp(15, 26, Math.min(1, time * 2))

  // ── z₂: Road Curvature ──
  const curveOffset = (z[1] - 0.5) * 120

  // ── z₃: Traffic Density ──
  const carCount = Math.round(z[2] * 4)
  const carDefs = [
    { xBase: 120, color: '#ef4444' },
    { xBase: 245, color: '#3b82f6' },
    { xBase: 75, color: '#f59e0b' },
    { xBase: 320, color: '#10b981' },
  ]

  // ── z₄: Weather ──
  const rainCount = Math.round(z[3] * 30)
  const cloudOpacity = Math.min(1, z[3] * 1.5)
  const rainDrops = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 143 + 37) % 400,
    y: (i * 97 + 13) % 160,
  }))

  const stars = [
    { x: 45, y: 18 }, { x: 95, y: 32 }, { x: 150, y: 12 },
    { x: 210, y: 28 }, { x: 270, y: 15 }, { x: 320, y: 38 },
    { x: 365, y: 20 }, { x: 55, y: 50 }, { x: 175, y: 42 },
    { x: 295, y: 48 }, { x: 130, y: 55 }, { x: 340, y: 55 },
  ]

  const dims = [
    { label: t.worldModels.latentZ1, color: '#fbbf24' },
    { label: t.worldModels.latentZ2, color: '#22d3ee' },
    { label: t.worldModels.latentZ3, color: '#a78bfa' },
    { label: t.worldModels.latentZ4, color: '#34d399' },
  ]

  // Road bezier helper: compute y for a given x
  const roadCpY = 120 + Math.abs(curveOffset) * 0.12
  const roadYAt = (x: number) => {
    const p = x / 400
    return (1 - p) * (1 - p) * 160 + 2 * (1 - p) * p * roadCpY + p * p * 155
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted italic">
        {t.worldModels.latentDimInstruction}
      </p>

      {/* ── Generated Scene ── */}
      <div className="rounded-xl overflow-hidden border border-purple-500/20">
        <svg viewBox="0 0 400 180" className="w-full h-auto block" style={{ background: '#0a0a0f' }}>
          <defs>
            <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`rgb(${stR},${stG},${stB})`} />
              <stop offset="100%" stopColor={`rgb(${sbR},${sbG},${sbB})`} />
            </linearGradient>
            <linearGradient id="ls-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`rgb(${groundLight},${groundLight + 20},${groundLight})`} />
              <stop offset="100%" stopColor={`rgb(${groundLight - 5},${groundLight + 8},${groundLight - 5})`} />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="400" height="120" fill="url(#ls-sky)" />

          {/* Stars */}
          {starsOpacity > 0 && (
            <g opacity={starsOpacity}>
              {stars.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={i % 3 === 0 ? 1.5 : 1} fill="white" opacity={0.8} />
              ))}
            </g>
          )}

          {/* Moon */}
          {moonOpacity > 0 && (
            <g opacity={moonOpacity}>
              <circle cx="330" cy="30" r="14" fill="#e2e8f0" />
              <circle cx="337" cy="25" r="12" fill={`rgb(${stR},${stG},${stB})`} />
            </g>
          )}

          {/* Sun + glow */}
          {sunOpacity > 0 && (
            <g opacity={sunOpacity}>
              <circle cx="300" cy={sunY} r="28" fill={sunColor} opacity={0.12} />
              <circle cx="300" cy={sunY} r="18" fill={sunColor} />
            </g>
          )}

          {/* Clouds */}
          {cloudOpacity > 0 && (
            <g opacity={cloudOpacity}>
              <ellipse cx="80" cy="40" rx="55" ry="18" fill="#374151" />
              <ellipse cx="115" cy="32" rx="40" ry="14" fill="#374151" />
              <ellipse cx="230" cy="35" rx="65" ry="22" fill="#374151" />
              <ellipse cx="275" cy="28" rx="45" ry="15" fill="#374151" />
              <ellipse cx="360" cy="45" rx="45" ry="16" fill="#374151" />
            </g>
          )}

          {/* Distant hills */}
          <path
            d="M0,115 Q40,95 80,108 Q120,88 160,102 Q200,85 240,98 Q280,80 320,95 Q360,85 400,105 L400,125 L0,125Z"
            fill={`rgb(${groundLight - 3},${groundLight + 10},${groundLight - 3})`}
            opacity={0.8}
          />

          {/* Ground */}
          <rect x="0" y="120" width="400" height="60" fill="url(#ls-ground)" />

          {/* Road surface */}
          <path
            d={`M -10,160 Q ${200 + curveOffset},${roadCpY} 410,155`}
            stroke="#2a2a30"
            strokeWidth="40"
            fill="none"
            strokeLinecap="round"
          />

          {/* Road center dashes */}
          <path
            d={`M -10,160 Q ${200 + curveOffset},${roadCpY} 410,155`}
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeDasharray="10 7"
            fill="none"
            opacity={0.4}
          />

          {/* Road edges */}
          <path
            d={`M -10,142 Q ${200 + curveOffset},${roadCpY - 18} 410,137`}
            stroke="#4a4a50" strokeWidth="1" fill="none" opacity={0.3}
          />
          <path
            d={`M -10,178 Q ${200 + curveOffset},${roadCpY + 18} 410,173`}
            stroke="#4a4a50" strokeWidth="1" fill="none" opacity={0.3}
          />

          {/* Cars */}
          {carDefs.slice(0, carCount).map((car, i) => {
            const cy = roadYAt(car.xBase)
            const yOff = i % 2 === 0 ? -5 : 5
            return (
              <g key={i}>
                <rect
                  x={car.xBase - 12} y={cy + yOff - 5}
                  width={24} height={10} rx={3}
                  fill={car.color} opacity={0.85}
                />
                <rect
                  x={car.xBase + 4} y={cy + yOff - 3}
                  width={6} height={6} rx={1}
                  fill="white" opacity={0.15}
                />
              </g>
            )
          })}

          {/* Rain */}
          {rainCount > 0 && (
            <g>
              {rainDrops.slice(0, rainCount).map((d, i) => (
                <line
                  key={i}
                  x1={d.x} y1={d.y}
                  x2={d.x - 4} y2={d.y + 10}
                  stroke="#60a5fa" strokeWidth={1}
                  opacity={0.35 + z[3] * 0.3}
                />
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* ── Latent Vector Display ── */}
      <div className="flex items-center justify-center gap-1.5 py-1">
        <span className="text-xs font-mono font-bold text-purple-400">z</span>
        <span className="text-xs text-muted">=</span>
        <code className="px-2.5 py-1 rounded-lg bg-background border border-border font-mono text-[11px] tracking-wide">
          [{z.map((v, i) => (
            <span key={i}>
              <span style={{ color: dims[i].color }}>{v.toFixed(2)}</span>
              {i < 3 && <span className="text-zinc-600">, </span>}
            </span>
          ))}]
        </code>
        <span className="text-muted text-xs mx-0.5">&rarr;</span>
        <span className="text-xs text-muted">{t.worldModels.latentSceneLabel}</span>
      </div>

      {/* ── Dimension Sliders ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {dims.map((dim, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold" style={{ color: dim.color }}>
                z<sub className="text-[9px]">{i + 1}</sub>
                <span className="text-muted font-normal ml-1.5">{dim.label}</span>
              </label>
              <span className="text-[10px] font-mono text-muted tabular-nums">{z[i].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={z[i]}
              onChange={(e) => updateZ(i, parseFloat(e.target.value))}
              className="w-full"
              style={{
                background: `linear-gradient(to right, ${dim.color} 0%, ${dim.color} ${z[i] * 100}%, var(--surface-elevated) ${z[i] * 100}%, var(--surface-elevated) 100%)`,
              }}
            />
          </div>
        ))}
      </div>
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
