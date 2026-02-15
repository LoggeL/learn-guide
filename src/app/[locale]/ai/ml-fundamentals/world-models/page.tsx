'use client'

import { useState } from 'react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

/* ─── World Model Pipeline SVG ─── */
function WorldModelPipelineSVG() {
  return (
    <svg viewBox="0 0 900 220" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background glow */}
      <defs>
        <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Connecting arrows */}
      <line x1="170" y1="110" x2="230" y2="110" stroke="url(#pipeGrad)" strokeWidth="3" markerEnd="url(#arrowP)" filter="url(#glow)" />
      <line x1="370" y1="110" x2="430" y2="110" stroke="url(#pipeGrad)" strokeWidth="3" markerEnd="url(#arrowP)" filter="url(#glow)" />
      <line x1="570" y1="110" x2="630" y2="110" stroke="url(#pipeGrad)" strokeWidth="3" markerEnd="url(#arrowP)" filter="url(#glow)" />
      <line x1="770" y1="110" x2="830" y2="110" stroke="url(#pipeGrad)" strokeWidth="3" />
      <defs>
        <marker id="arrowP" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
        </marker>
      </defs>

      {/* Step 1: Input */}
      <rect x="20" y="50" width="150" height="120" rx="16" fill="#a855f7" fillOpacity="0.12" stroke="#a855f7" strokeWidth="2" />
      <text x="95" y="95" textAnchor="middle" fill="#c084fc" fontSize="14" fontWeight="bold">📷 Sensor</text>
      <text x="95" y="115" textAnchor="middle" fill="#c084fc" fontSize="14" fontWeight="bold">Input</text>
      <text x="95" y="145" textAnchor="middle" fill="#a78bfa" fontSize="11">Video, LiDAR,</text>
      <text x="95" y="160" textAnchor="middle" fill="#a78bfa" fontSize="11">Actions</text>

      {/* Step 2: Encoder */}
      <rect x="230" y="50" width="140" height="120" rx="16" fill="#06b6d4" fillOpacity="0.12" stroke="#06b6d4" strokeWidth="2" />
      <text x="300" y="95" textAnchor="middle" fill="#22d3ee" fontSize="14" fontWeight="bold">🔬 Encoder</text>
      <text x="300" y="125" textAnchor="middle" fill="#67e8f9" fontSize="11">Compress to</text>
      <text x="300" y="140" textAnchor="middle" fill="#67e8f9" fontSize="11">Latent Space</text>

      {/* Step 3: Latent World Model */}
      <rect x="430" y="30" width="140" height="160" rx="16" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="2.5" />
      <text x="500" y="75" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="bold">🌍 Latent</text>
      <text x="500" y="95" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="bold">World Model</text>
      <text x="500" y="125" textAnchor="middle" fill="#6ee7b7" fontSize="11">Predict next</text>
      <text x="500" y="140" textAnchor="middle" fill="#6ee7b7" fontSize="11">state, physics,</text>
      <text x="500" y="155" textAnchor="middle" fill="#6ee7b7" fontSize="11">interactions</text>

      {/* Step 4: Decoder */}
      <rect x="630" y="50" width="140" height="120" rx="16" fill="#f59e0b" fillOpacity="0.12" stroke="#f59e0b" strokeWidth="2" />
      <text x="700" y="95" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">📤 Decoder</text>
      <text x="700" y="125" textAnchor="middle" fill="#fcd34d" fontSize="11">Reconstruct</text>
      <text x="700" y="140" textAnchor="middle" fill="#fcd34d" fontSize="11">predictions</text>

      {/* Step 5: Output */}
      <rect x="810" y="60" width="80" height="100" rx="14" fill="#ef4444" fillOpacity="0.1" stroke="#ef4444" strokeWidth="2" />
      <text x="850" y="105" textAnchor="middle" fill="#f87171" fontSize="13" fontWeight="bold">🎯</text>
      <text x="850" y="125" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="bold">Output</text>
      <text x="850" y="145" textAnchor="middle" fill="#fca5a5" fontSize="10">Future</text>
    </svg>
  )
}

/* ─── Sim-to-Real Gap SVG ─── */
function SimToRealSVG() {
  return (
    <svg viewBox="0 0 700 200" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gapGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Simulation side */}
      <rect x="20" y="20" width="260" height="160" rx="20" fill="#06b6d4" fillOpacity="0.08" stroke="#06b6d4" strokeWidth="2" />
      <text x="150" y="55" textAnchor="middle" fill="#22d3ee" fontSize="16" fontWeight="bold">🖥️ Simulation</text>
      <text x="150" y="85" textAnchor="middle" fill="#67e8f9" fontSize="12">✓ Fast (1000x realtime)</text>
      <text x="150" y="105" textAnchor="middle" fill="#67e8f9" fontSize="12">✓ Safe (no damage)</text>
      <text x="150" y="125" textAnchor="middle" fill="#67e8f9" fontSize="12">✓ Parallelizable</text>
      <text x="150" y="150" textAnchor="middle" fill="#67e8f9" fontSize="12">✗ Simplified physics</text>

      {/* Gap */}
      <rect x="310" y="55" width="80" height="90" rx="12" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" />
      <text x="350" y="95" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="bold">GAP</text>
      <text x="350" y="115" textAnchor="middle" fill="#fca5a5" fontSize="10">Transfer</text>
      <text x="350" y="130" textAnchor="middle" fill="#fca5a5" fontSize="10">Challenge</text>

      {/* Arrows */}
      <line x1="280" y1="100" x2="310" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
      <line x1="390" y1="100" x2="420" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />

      {/* Real World side */}
      <rect x="420" y="20" width="260" height="160" rx="20" fill="#f59e0b" fillOpacity="0.08" stroke="#f59e0b" strokeWidth="2" />
      <text x="550" y="55" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">🌎 Real World</text>
      <text x="550" y="85" textAnchor="middle" fill="#fcd34d" fontSize="12">✓ True physics</text>
      <text x="550" y="105" textAnchor="middle" fill="#fcd34d" fontSize="12">✓ Real sensor noise</text>
      <text x="550" y="125" textAnchor="middle" fill="#fcd34d" fontSize="12">✗ Slow (1x realtime)</text>
      <text x="550" y="150" textAnchor="middle" fill="#fcd34d" fontSize="12">✗ Expensive & risky</text>
    </svg>
  )
}

/* ─── Robotics Training Loop SVG ─── */
function RoboticsTrainingLoopSVG() {
  return (
    <svg viewBox="0 0 500 340" className="w-full max-w-lg mx-auto h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrowLoop" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#a855f7" />
        </marker>
      </defs>

      {/* Center label */}
      <circle cx="250" cy="170" r="50" fill="#a855f7" fillOpacity="0.1" stroke="#a855f7" strokeWidth="2" />
      <text x="250" y="165" textAnchor="middle" fill="#c084fc" fontSize="13" fontWeight="bold">Training</text>
      <text x="250" y="182" textAnchor="middle" fill="#c084fc" fontSize="13" fontWeight="bold">Loop</text>

      {/* Node 1: World Model */}
      <rect x="170" y="10" width="160" height="50" rx="12" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeWidth="2" />
      <text x="250" y="40" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="bold">🌍 World Model</text>

      {/* Node 2: Generate Scenarios */}
      <rect x="350" y="90" width="140" height="50" rx="12" fill="#06b6d4" fillOpacity="0.12" stroke="#06b6d4" strokeWidth="2" />
      <text x="420" y="120" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold">🎬 Simulate</text>

      {/* Node 3: Train Policy */}
      <rect x="350" y="200" width="140" height="50" rx="12" fill="#f59e0b" fillOpacity="0.12" stroke="#f59e0b" strokeWidth="2" />
      <text x="420" y="230" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">🧠 Train Policy</text>

      {/* Node 4: Evaluate */}
      <rect x="170" y="280" width="160" height="50" rx="12" fill="#ef4444" fillOpacity="0.12" stroke="#ef4444" strokeWidth="2" />
      <text x="250" y="310" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="bold">📊 Evaluate</text>

      {/* Node 5: Refine Model */}
      <rect x="10" y="200" width="140" height="50" rx="12" fill="#8b5cf6" fillOpacity="0.12" stroke="#8b5cf6" strokeWidth="2" />
      <text x="80" y="230" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="bold">🔧 Refine</text>

      {/* Node 6: Collect Data */}
      <rect x="10" y="90" width="140" height="50" rx="12" fill="#ec4899" fillOpacity="0.12" stroke="#ec4899" strokeWidth="2" />
      <text x="80" y="120" textAnchor="middle" fill="#f472b6" fontSize="12" fontWeight="bold">📦 Collect Data</text>

      {/* Arrows connecting the loop */}
      <line x1="330" y1="45" x2="365" y2="90" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowLoop)" />
      <line x1="430" y1="140" x2="430" y2="200" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowLoop)" />
      <line x1="365" y1="240" x2="330" y2="285" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowLoop)" />
      <line x1="170" y1="300" x2="135" y2="250" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowLoop)" />
      <line x1="70" y1="200" x2="70" y2="140" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowLoop)" />
      <line x1="135" y1="100" x2="170" y2="55" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowLoop)" />
    </svg>
  )
}

/* ─── Training Comparison Interactive Toggle ─── */
function TrainingComparisonToggle({ t }: { t: Record<string, string> }) {
  const [mode, setMode] = useState<'real' | 'world'>('real')

  const realData = [
    { label: t.compSpeed || 'Speed', value: '1x realtime', icon: '🐌', color: 'red' },
    { label: t.compCost || 'Cost', value: t.compCostReal || '$100k+ per robot', icon: '💸', color: 'red' },
    { label: t.compParallel || 'Parallelization', value: t.compParallelReal || '1 robot = 1 instance', icon: '1️⃣', color: 'red' },
    { label: t.compSafety || 'Safety', value: t.compSafetyReal || 'Risk of damage', icon: '⚠️', color: 'red' },
    { label: t.compDiversity || 'Scenario Diversity', value: t.compDiversityReal || 'Limited by reality', icon: '📉', color: 'yellow' },
  ]
  const worldData = [
    { label: t.compSpeed || 'Speed', value: t.compSpeedWorld || '1000x+ realtime', icon: '⚡', color: 'emerald' },
    { label: t.compCost || 'Cost', value: t.compCostWorld || 'GPU compute only', icon: '💰', color: 'emerald' },
    { label: t.compParallel || 'Parallelization', value: t.compParallelWorld || '1000s of instances', icon: '🚀', color: 'emerald' },
    { label: t.compSafety || 'Safety', value: t.compSafetyWorld || 'Zero risk', icon: '✅', color: 'emerald' },
    { label: t.compDiversity || 'Scenario Diversity', value: t.compDiversityWorld || 'Unlimited generation', icon: '📈', color: 'emerald' },
  ]

  const data = mode === 'real' ? realData : worldData

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-2 p-1 bg-background rounded-xl border border-border max-w-md mx-auto">
        <button
          onClick={() => setMode('real')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
            mode === 'real'
              ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30'
              : 'text-muted hover:text-text'
          }`}
        >
          🏭 {t.realWorldTraining || 'Real World Training'}
        </button>
        <button
          onClick={() => setMode('world')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
            mode === 'world'
              ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-muted hover:text-text'
          }`}
        >
          🌍 {t.worldModelTraining || 'World Model Training'}
        </button>
      </div>

      {/* Comparison items */}
      <div className="grid gap-3 transition-all duration-300">
        {data.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
              mode === 'real'
                ? 'bg-gradient-to-r from-red-500/5 to-orange-500/5 border-red-500/20'
                : 'bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border-emerald-500/20'
            }`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-text">{item.label}</div>
              <div className={`text-sm ${mode === 'real' ? 'text-red-400' : 'text-emerald-400'}`}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Example Card Component ─── */
function ExampleCard({ emoji, name, desc, tags, gradient, borderColor }: {
  emoji: string; name: string; desc: string; tags: string[]; gradient: string; borderColor: string
}) {
  return (
    <div className={`p-6 rounded-xl ${gradient} border ${borderColor} hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start gap-4">
        <span className="text-3xl">{emoji}</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold font-heading text-text mb-2">{name}</h3>
          <p className="text-sm text-muted leading-relaxed mb-3">{desc}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-muted border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Info Box Component ─── */
function InfoBox({ icon, title, children, color }: {
  icon: string; title: string; children: React.ReactNode; color: 'purple' | 'cyan' | 'emerald' | 'orange' | 'red' | 'blue'
}) {
  const colors = {
    purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/20',
    cyan: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20',
    emerald: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
    orange: 'from-orange-500/10 to-red-500/10 border-orange-500/20',
    red: 'from-red-500/10 to-pink-500/10 border-red-500/20',
    blue: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
  }
  const titleColors = {
    purple: 'text-purple-400', cyan: 'text-cyan-400', emerald: 'text-emerald-400',
    orange: 'text-orange-400', red: 'text-red-400', blue: 'text-blue-400',
  }

  return (
    <div className={`p-5 bg-gradient-to-br ${colors[color]} border rounded-xl`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <h3 className={`text-lg font-bold font-heading ${titleColors[color]}`}>{title}</h3>
      </div>
      <div className="text-sm text-muted leading-relaxed">{children}</div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function WorldModelsPage() {
  const { t } = useTranslation()
  const wm = t.worldModels

  return (
    <TopicLayout topicId="world-models"
      title={wm.title}
      description={wm.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: wm.title },
      ]}
      prevTopic={{ label: t.topicNames['training'], href: '/ai/ml-fundamentals/training' }}
    >
      {/* ─── Hero: What are World Models? ─── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{wm.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">{wm.whatIsDesc}</p>
        <p className="text-muted leading-relaxed mb-6">{wm.whatIsDesc2}</p>

        {/* Key insight box */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <p className="text-lg text-text italic font-heading">
            &ldquo;{wm.keyInsightQuote}&rdquo;
          </p>
          <p className="text-sm text-muted mt-2">{wm.keyInsightAttribution}</p>
        </div>
      </section>

      {/* ─── The Big Picture: Why World Models? ─── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{wm.whyNeeded}</h2>
        <p className="text-muted leading-relaxed mb-6">{wm.whyNeededIntro}</p>

        <div className="grid md:grid-cols-3 gap-4">
          <InfoBox icon="🐢" title={wm.slowExpensive} color="red">
            {wm.slowExpensiveDesc}
          </InfoBox>
          <InfoBox icon="🚀" title={wm.parallelTraining} color="emerald">
            {wm.parallelTrainingDesc}
          </InfoBox>
          <InfoBox icon="🧠" title={wm.physicsUnderstanding} color="purple">
            {wm.physicsUnderstandingDesc}
          </InfoBox>
        </div>
      </section>

      {/* ─── How World Models Work ─── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{wm.howTheyWork}</h2>
        <p className="text-muted leading-relaxed mb-6">{wm.howTheyWorkDesc}</p>

        {/* Pipeline Visualization */}
        <div className="mb-8 p-4 rounded-xl bg-background border border-border overflow-x-auto">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wide mb-4 text-center">{wm.pipelineTitle}</h3>
          <WorldModelPipelineSVG />
        </div>

        {/* Technique cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <InfoBox icon="🗜️" title={wm.latentSpace} color="purple">{wm.latentSpaceDesc}</InfoBox>
          <InfoBox icon="🎬" title={wm.videoPrediction} color="cyan">{wm.videoPredictionDesc}</InfoBox>
          <InfoBox icon="⚛️" title={wm.physicsAware} color="emerald">{wm.physicsAwareDesc}</InfoBox>
          <InfoBox icon="🌊" title={wm.diffusion} color="orange">{wm.diffusionDesc}</InfoBox>
        </div>
      </section>

      {/* ─── Interactive: Training Comparison ─── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{wm.comparisonTitle}</h2>
            <p className="text-sm text-muted">{wm.comparisonSubtitle}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <TrainingComparisonToggle t={wm as unknown as Record<string, string>} />
        </div>
      </section>

      {/* ─── Robotics Training Loop ─── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{wm.trainingLoopTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{wm.trainingLoopDesc}</p>
        <div className="p-4 rounded-xl bg-background border border-border">
          <RoboticsTrainingLoopSVG />
        </div>
      </section>

      {/* ─── Sim-to-Real Gap Visualization ─── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{wm.simToRealTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{wm.simToRealIntro}</p>
        <div className="p-4 rounded-xl bg-surface/50 border border-border overflow-x-auto">
          <SimToRealSVG />
        </div>
      </section>

      {/* ─── Notable Examples ─── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{wm.examples}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ExampleCard
            emoji="🚗"
            name={wm.nvidiaCosmos}
            desc={wm.nvidiaCosmosDesc}
            tags={['NVIDIA', 'Autonomous Driving', 'Robotics', 'Open Source']}
            gradient="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10"
            borderColor="border-emerald-500/20"
          />
          <ExampleCard
            emoji="🎮"
            name={wm.googleGenie}
            desc={wm.googleGenieDesc}
            tags={['Google DeepMind', '3D Worlds', 'Interactive', 'Text-to-World']}
            gradient="bg-gradient-to-br from-purple-500/10 to-pink-500/10"
            borderColor="border-purple-500/20"
          />
          <ExampleCard
            emoji="🌐"
            name={wm.uniSim}
            desc={wm.uniSimDesc}
            tags={['Google Research', 'Universal Simulator', 'Multi-Domain']}
            gradient="bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
            borderColor="border-blue-500/20"
          />
          <ExampleCard
            emoji="🚙"
            name={wm.gaia1}
            desc={wm.gaia1Desc}
            tags={['Wayve', 'Autonomous Driving', 'London Streets']}
            gradient="bg-gradient-to-br from-orange-500/10 to-yellow-500/10"
            borderColor="border-orange-500/20"
          />
          <ExampleCard
            emoji="⚡"
            name={wm.genesis}
            desc={wm.genesisDesc}
            tags={['Physics Engine', 'Generative AI', 'Ultra-Fast Sim']}
            gradient="bg-gradient-to-br from-cyan-500/10 to-teal-500/10"
            borderColor="border-cyan-500/20"
          />
          <ExampleCard
            emoji="🤖"
            name={wm.dreamerV3}
            desc={wm.dreamerV3Desc}
            tags={['Reinforcement Learning', 'General Purpose', 'Dream-Based']}
            gradient="bg-gradient-to-br from-pink-500/10 to-rose-500/10"
            borderColor="border-pink-500/20"
          />
        </div>
      </section>

      {/* ─── Use Cases ─── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{wm.useCases}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 bg-background rounded-xl border border-border text-center hover:border-cyan-500/30 transition-colors">
            <span className="text-4xl mb-3 block">🚙</span>
            <h4 className="font-bold text-text mb-2">{wm.autonomousDriving}</h4>
            <p className="text-sm text-muted">{wm.autonomousDrivingDesc}</p>
          </div>
          <div className="p-6 bg-background rounded-xl border border-border text-center hover:border-purple-500/30 transition-colors">
            <span className="text-4xl mb-3 block">🦾</span>
            <h4 className="font-bold text-text mb-2">{wm.robotics}</h4>
            <p className="text-sm text-muted">{wm.roboticsDesc}</p>
          </div>
          <div className="p-6 bg-background rounded-xl border border-border text-center hover:border-emerald-500/30 transition-colors">
            <span className="text-4xl mb-3 block">🎬</span>
            <h4 className="font-bold text-text mb-2">{wm.videoGeneration}</h4>
            <p className="text-sm text-muted">{wm.videoGenerationDesc}</p>
          </div>
        </div>

        {/* Additional use cases */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-background rounded-xl border border-border flex items-center gap-3 hover:border-orange-500/30 transition-colors">
            <span className="text-2xl">🏭</span>
            <div>
              <h4 className="font-bold text-text text-sm">{wm.industrialSim}</h4>
              <p className="text-xs text-muted">{wm.industrialSimDesc}</p>
            </div>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border flex items-center gap-3 hover:border-blue-500/30 transition-colors">
            <span className="text-2xl">🎮</span>
            <div>
              <h4 className="font-bold text-text text-sm">{wm.gameWorlds}</h4>
              <p className="text-xs text-muted">{wm.gameWorldsDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Challenges ─── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{wm.challenges}</h2>
            <p className="text-sm text-muted">{wm.challengesDesc}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl">
            <span className="text-2xl mb-2 block">💻</span>
            <h3 className="text-lg font-bold font-heading text-red-400 mb-2">{wm.computeIntensive}</h3>
            <p className="text-sm text-muted">{wm.computeIntensiveDesc}</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-xl">
            <span className="text-2xl mb-2 block">🔀</span>
            <h3 className="text-lg font-bold font-heading text-yellow-400 mb-2">{wm.simToReal}</h3>
            <p className="text-sm text-muted">{wm.simToRealDesc}</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl">
            <span className="text-2xl mb-2 block">🌐</span>
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{wm.generalization}</h3>
            <p className="text-sm text-muted">{wm.generalizationDesc}</p>
          </div>
        </div>

        {/* Additional challenges */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20 rounded-xl">
            <span className="text-xl mb-1 block">📊</span>
            <h3 className="font-bold text-blue-400 mb-1">{wm.dataHunger}</h3>
            <p className="text-sm text-muted">{wm.dataHungerDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-xl">
            <span className="text-xl mb-1 block">📏</span>
            <h3 className="font-bold text-emerald-400 mb-1">{wm.evaluation}</h3>
            <p className="text-sm text-muted">{wm.evaluationDesc}</p>
          </div>
        </div>
      </section>

      {/* ─── The Future of World Models ─── */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{wm.futureTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{wm.futureDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-background rounded-xl border border-border flex items-start gap-3">
            <span className="text-xl">🔮</span>
            <div>
              <h4 className="font-bold text-text mb-1">{wm.futureMultimodal}</h4>
              <p className="text-xs text-muted">{wm.futureMultimodalDesc}</p>
            </div>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border flex items-start gap-3">
            <span className="text-xl">🧩</span>
            <div>
              <h4 className="font-bold text-text mb-1">{wm.futureComposable}</h4>
              <p className="text-xs text-muted">{wm.futureComposableDesc}</p>
            </div>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border flex items-start gap-3">
            <span className="text-xl">🌍</span>
            <div>
              <h4 className="font-bold text-text mb-1">{wm.futureFoundation}</h4>
              <p className="text-xs text-muted">{wm.futureFoundationDesc}</p>
            </div>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border flex items-start gap-3">
            <span className="text-xl">🤝</span>
            <div>
              <h4 className="font-bold text-text mb-1">{wm.futureLLMIntegration}</h4>
              <p className="text-xs text-muted">{wm.futureLLMIntegrationDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Key Takeaways ─── */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{wm.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[wm.takeaway1, wm.takeaway2, wm.takeaway3, wm.takeaway4, wm.takeaway5, wm.takeaway6].map((item, i) => (
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
