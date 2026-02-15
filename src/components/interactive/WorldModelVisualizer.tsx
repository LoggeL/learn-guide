'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── World Model Pipeline SVG ───────────────────────────────────────────────
export function WorldModelPipeline() {
  const [activeStage, setActiveStage] = useState<number | null>(null)

  const stages = [
    {
      id: 'observe',
      label: 'Observe',
      sublabel: 'Sensor Data',
      color: '#a78bfa', // purple-400
      icon: (
        <g>
          <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
          <path d="M20 8v4M20 28v4M8 20h4M28 20h4" stroke="currentColor" strokeWidth="1.5" />
        </g>
      ),
      desc: 'Cameras, LiDAR, and other sensors capture raw observations from the real or simulated world.',
    },
    {
      id: 'encode',
      label: 'Encode',
      sublabel: 'Latent Space',
      color: '#22d3ee', // cyan-400
      icon: (
        <g>
          <rect x="10" y="10" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="17" cy="17" r="2" fill="currentColor" />
          <circle cx="23" cy="23" r="2" fill="currentColor" />
          <circle cx="23" cy="17" r="1.5" fill="currentColor" opacity="0.5" />
          <circle cx="17" cy="23" r="1.5" fill="currentColor" opacity="0.5" />
        </g>
      ),
      desc: 'An encoder compresses high-dimensional input into a compact latent representation that captures essential features.',
    },
    {
      id: 'predict',
      label: 'Predict',
      sublabel: 'Next State',
      color: '#34d399', // emerald-400
      icon: (
        <g>
          <path d="M12 20h16" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 14l8 6-8 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="28" cy="20" r="3" fill="currentColor" opacity="0.4" />
        </g>
      ),
      desc: 'The dynamics model predicts the next latent state given the current state and a planned action.',
    },
    {
      id: 'decode',
      label: 'Decode',
      sublabel: 'Reconstruct',
      color: '#fb923c', // orange-400
      icon: (
        <g>
          <rect x="10" y="10" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 22l4-4 3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </g>
      ),
      desc: 'A decoder reconstructs the predicted latent state back into observable outputs (images, physics states).',
    },
    {
      id: 'act',
      label: 'Act',
      sublabel: 'Policy',
      color: '#f472b6', // pink-400
      icon: (
        <g>
          <circle cx="20" cy="16" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15 24c0-3 2-5 5-5s5 2 5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 29v-3M16 28l2-2M24 28l-2-2" stroke="currentColor" strokeWidth="1.5" />
        </g>
      ),
      desc: 'A policy network selects the best action based on the predicted future states, then the loop repeats.',
    },
  ]

  return (
    <div className="space-y-4">
      {/* SVG Pipeline */}
      <div className="overflow-x-auto">
        <svg viewBox="0 0 720 120" className="w-full min-w-[600px] h-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Connection arrows */}
          {stages.slice(0, -1).map((_, i) => {
            const x1 = i * 145 + 100
            const x2 = (i + 1) * 145 + 25
            return (
              <g key={`arrow-${i}`}>
                <motion.line
                  x1={x1} y1={60} x2={x2} y2={60}
                  stroke={activeStage === i || activeStage === i + 1 ? stages[i].color : '#374151'}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                />
                <motion.polygon
                  points={`${x2 - 2},54 ${x2 + 6},60 ${x2 - 2},66`}
                  fill={activeStage === i || activeStage === i + 1 ? stages[i].color : '#374151'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 + 0.4 }}
                />
              </g>
            )
          })}

          {/* Feedback loop arrow (from Act back to Observe) */}
          <motion.path
            d="M695 85 Q700 110 360 112 Q20 110 25 85"
            fill="none"
            stroke={activeStage === 4 || activeStage === 0 ? '#f472b6' : '#374151'}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          <motion.polygon
            points="22,88 28,88 25,80"
            fill={activeStage === 4 || activeStage === 0 ? '#f472b6' : '#374151'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          />
          <motion.text
            x="360" y="108"
            textAnchor="middle"
            className="text-[10px] fill-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.8 }}
          >
            feedback loop
          </motion.text>

          {/* Stage nodes */}
          {stages.map((stage, i) => {
            const cx = i * 145 + 62
            const isActive = activeStage === i
            return (
              <g
                key={stage.id}
                className="cursor-pointer"
                onClick={() => setActiveStage(isActive ? null : i)}
              >
                <motion.rect
                  x={cx - 38} y={20} width={76} height={76} rx={16}
                  fill={isActive ? `${stage.color}22` : '#1a1a2e'}
                  stroke={isActive ? stage.color : '#374151'}
                  strokeWidth={isActive ? 2 : 1}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.06 }}
                />
                <g style={{ color: stage.color }} transform={`translate(${cx - 20}, ${i === 4 ? 24 : 28})`}>
                  {stage.icon}
                </g>
                <text x={cx} y={74} textAnchor="middle" fill={isActive ? stage.color : '#e2e8f0'} className="text-[11px] font-semibold">
                  {stage.label}
                </text>
                <text x={cx} y={88} textAnchor="middle" fill="#6b7280" className="text-[9px]">
                  {stage.sublabel}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {activeStage !== null && (
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-xl border"
            style={{
              borderColor: `${stages[activeStage].color}40`,
              background: `linear-gradient(135deg, ${stages[activeStage].color}08, ${stages[activeStage].color}04)`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stages[activeStage].color }}
              />
              <span className="font-bold text-text">{stages[activeStage].label}</span>
              <span className="text-xs text-muted">— {stages[activeStage].sublabel}</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">{stages[activeStage].desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted text-center">Click on any stage to learn more</p>
    </div>
  )
}

// ─── Sim-to-Real Comparison Toggle ──────────────────────────────────────────
export function SimToRealToggle() {
  const [showReal, setShowReal] = useState(false)

  const simData = {
    label: 'Simulated World',
    color: '#22d3ee',
    items: [
      { metric: 'Training Speed', value: '1,000,000×', detail: 'Faster than real-time' },
      { metric: 'Cost per Hour', value: '~$0.10', detail: 'GPU compute only' },
      { metric: 'Safety Risk', value: 'None', detail: 'Virtual environment' },
      { metric: 'Parallelism', value: '10,000+', detail: 'Simultaneous agents' },
      { metric: 'Scenario Control', value: 'Perfect', detail: 'Any edge case on demand' },
      { metric: 'Physics Accuracy', value: '~90-95%', detail: 'Sim-to-real gap' },
    ],
  }

  const realData = {
    label: 'Real World',
    color: '#fb923c',
    items: [
      { metric: 'Training Speed', value: '1×', detail: 'Real-time only' },
      { metric: 'Cost per Hour', value: '$500+', detail: 'Hardware, staff, space' },
      { metric: 'Safety Risk', value: 'High', detail: 'Physical damage possible' },
      { metric: 'Parallelism', value: '1-10', detail: 'Physical robots needed' },
      { metric: 'Scenario Control', value: 'Limited', detail: 'Can\'t force rare events' },
      { metric: 'Physics Accuracy', value: '100%', detail: 'Ground truth' },
    ],
  }

  const current = showReal ? realData : simData

  return (
    <div className="space-y-5">
      {/* Toggle button */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium transition-colors ${!showReal ? 'text-cyan-400' : 'text-muted'}`}>
          Simulation
        </span>
        <button
          onClick={() => setShowReal(!showReal)}
          className="relative w-14 h-7 rounded-full transition-colors duration-300"
          style={{ backgroundColor: showReal ? '#fb923c40' : '#22d3ee40' }}
        >
          <motion.div
            className="absolute top-1 w-5 h-5 rounded-full"
            style={{ backgroundColor: current.color }}
            animate={{ left: showReal ? 32 : 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        </button>
        <span className={`text-sm font-medium transition-colors ${showReal ? 'text-orange-400' : 'text-muted'}`}>
          Real World
        </span>
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <AnimatePresence mode="wait">
          {current.items.map((item, i) => (
            <motion.div
              key={`${showReal ? 'real' : 'sim'}-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl border"
              style={{
                borderColor: `${current.color}30`,
                background: `linear-gradient(135deg, ${current.color}08, transparent)`,
              }}
            >
              <p className="text-xs text-muted mb-1">{item.metric}</p>
              <p className="text-lg font-bold" style={{ color: current.color }}>{item.value}</p>
              <p className="text-xs text-muted mt-0.5">{item.detail}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Insight box */}
      <motion.div
        key={showReal ? 'real-insight' : 'sim-insight'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 rounded-lg text-sm text-center"
        style={{
          backgroundColor: `${current.color}10`,
          borderLeft: `3px solid ${current.color}`,
          color: current.color,
        }}
      >
        {showReal
          ? 'Real-world training is the gold standard for accuracy, but prohibitively slow and expensive for complex tasks like autonomous driving.'
          : 'Simulation enables millions of training hours in days — but the sim-to-real gap means models must be carefully validated in the real world.'}
      </motion.div>
    </div>
  )
}

// ─── Training Loop Visualization ────────────────────────────────────────────
export function TrainingLoopViz() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    {
      label: 'Generate Scenario',
      desc: 'The world model generates a simulated environment: a rainy highway with merging traffic.',
      color: '#a78bfa',
      visual: (
        <g>
          {/* Road */}
          <rect x="40" y="55" width="200" height="30" rx="2" fill="#374151" />
          <line x1="140" y1="55" x2="140" y2="85" stroke="#6b7280" strokeWidth="1" strokeDasharray="8 6" />
          {/* Rain drops */}
          {[60, 100, 150, 190, 80, 130, 170, 210].map((x, i) => (
            <motion.line
              key={i}
              x1={x} y1={15 + (i % 3) * 8} x2={x - 3} y2={25 + (i % 3) * 8}
              stroke="#60a5fa"
              strokeWidth="1"
              opacity="0.5"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
          {/* Cars */}
          <rect x="80" y="60" width="30" height="16" rx="4" fill="#a78bfa" />
          <rect x="170" y="64" width="30" height="16" rx="4" fill="#fb923c" />
          <motion.rect
            x="130" y="60" width="26" height="16" rx="4" fill="#34d399"
            animate={{ x: [120, 135, 120] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </g>
      ),
    },
    {
      label: 'Agent Acts',
      desc: 'The AI agent decides: brake gently and move to the right lane to let the merging car in.',
      color: '#22d3ee',
      visual: (
        <g>
          <rect x="40" y="55" width="200" height="30" rx="2" fill="#374151" />
          <line x1="140" y1="55" x2="140" y2="85" stroke="#6b7280" strokeWidth="1" strokeDasharray="8 6" />
          {/* Decision arrow */}
          <motion.path
            d="M95 68 Q120 50 145 72"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeDasharray="4 3"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <rect x="80" y="60" width="30" height="16" rx="4" fill="#a78bfa" />
          <motion.rect
            x="145" y="64" width="30" height="16" rx="4" fill="#22d3ee"
            animate={{ x: [140, 160] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          />
          <rect x="190" y="60" width="26" height="16" rx="4" fill="#34d399" />
        </g>
      ),
    },
    {
      label: 'World Model Predicts',
      desc: 'The model predicts the outcome: safe merge, no collision, smooth traffic flow.',
      color: '#34d399',
      visual: (
        <g>
          <rect x="40" y="55" width="200" height="30" rx="2" fill="#374151" />
          <line x1="140" y1="55" x2="140" y2="85" stroke="#6b7280" strokeWidth="1" strokeDasharray="8 6" />
          {/* Prediction glow */}
          <motion.rect
            x="38" y="53" width="204" height="34" rx="4"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.5"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Cars in predicted positions */}
          <rect x="70" y="60" width="30" height="16" rx="4" fill="#a78bfa" opacity="0.6" />
          <rect x="160" y="64" width="30" height="16" rx="4" fill="#22d3ee" opacity="0.6" />
          <rect x="210" y="60" width="26" height="16" rx="4" fill="#34d399" opacity="0.6" />
          {/* Checkmark */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <circle cx="140" cy="35" r="10" fill="#34d39930" stroke="#34d399" strokeWidth="1.5" />
            <path d="M134 35l4 4 8-8" stroke="#34d399" strokeWidth="2" fill="none" />
          </motion.g>
        </g>
      ),
    },
    {
      label: 'Compute Reward',
      desc: 'Reward signal: +10 for safe merge, +5 for maintaining speed, -0 for no collision.',
      color: '#fbbf24',
      visual: (
        <g>
          {/* Reward bars */}
          {[
            { label: 'Safety', value: 85, color: '#34d399' },
            { label: 'Speed', value: 60, color: '#22d3ee' },
            { label: 'Comfort', value: 70, color: '#a78bfa' },
          ].map((bar, i) => (
            <g key={i}>
              <text x="55" y={38 + i * 28} textAnchor="end" fill="#9ca3af" className="text-[10px]">
                {bar.label}
              </text>
              <rect x="60" y={28 + i * 28} width="160" height="14" rx="3" fill="#1f2937" />
              <motion.rect
                x="60" y={28 + i * 28} width={0} height="14" rx="3"
                fill={bar.color}
                animate={{ width: bar.value * 1.6 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              />
              <text x={68 + bar.value * 1.6} y={39 + i * 28} fill="white" className="text-[9px] font-bold">
                +{bar.value / 10}
              </text>
            </g>
          ))}
          {/* Total */}
          <text x="140" y={105} textAnchor="middle" fill="#fbbf24" className="text-[12px] font-bold">
            Total Reward: +21.5
          </text>
        </g>
      ),
    },
    {
      label: 'Update Policy',
      desc: 'The agent\'s neural network weights are updated via gradient descent to reinforce this good behavior.',
      color: '#f472b6',
      visual: (
        <g>
          {/* Neural network schematic */}
          {/* Input layer */}
          {[30, 50, 70, 90].map((y, i) => (
            <circle key={`in-${i}`} cx="60" cy={y} r="6" fill="#374151" stroke="#6b7280" strokeWidth="1" />
          ))}
          {/* Hidden layer */}
          {[40, 60, 80].map((y, i) => (
            <circle key={`h-${i}`} cx="140" cy={y} r="6" fill="#374151" stroke="#a78bfa" strokeWidth="1" />
          ))}
          {/* Output */}
          {[50, 70].map((y, i) => (
            <circle key={`out-${i}`} cx="220" cy={y} r="6" fill="#374151" stroke="#f472b6" strokeWidth="1" />
          ))}
          {/* Connections with animation */}
          {[30, 50, 70, 90].map((y1, i) =>
            [40, 60, 80].map((y2, j) => (
              <motion.line
                key={`c1-${i}-${j}`}
                x1="66" y1={y1} x2="134" y2={y2}
                stroke="#a78bfa"
                strokeWidth="0.5"
                animate={{ opacity: [0.1, 0.6, 0.1] }}
                transition={{ duration: 1.5, delay: (i + j) * 0.1, repeat: Infinity }}
              />
            ))
          )}
          {[40, 60, 80].map((y1, i) =>
            [50, 70].map((y2, j) => (
              <motion.line
                key={`c2-${i}-${j}`}
                x1="146" y1={y1} x2="214" y2={y2}
                stroke="#f472b6"
                strokeWidth="0.5"
                animate={{ opacity: [0.1, 0.6, 0.1] }}
                transition={{ duration: 1.5, delay: (i + j) * 0.15, repeat: Infinity }}
              />
            ))
          )}
          {/* Gradient arrows */}
          <motion.g
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path d="M220 95l-15 0" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowYellow)" />
            <path d="M145 95l-15 0" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="140" y="108" textAnchor="middle" fill="#fbbf24" className="text-[9px]">
              ∇ gradient update
            </text>
          </motion.g>
        </g>
      ),
    },
  ]

  const currentStep = steps[step]

  // Auto-play logic
  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    setIsPlaying(true)
    let current = step
    const interval = setInterval(() => {
      current = (current + 1) % steps.length
      setStep(current)
      if (current === 0) {
        clearInterval(interval)
        setIsPlaying(false)
      }
    }, 2500)
  }

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => { setStep(i); setIsPlaying(false) }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: step === i ? `${s.color}20` : 'transparent',
                color: step === i ? s.color : '#6b7280',
                border: `1px solid ${step === i ? `${s.color}40` : 'transparent'}`,
              }}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                style={{
                  backgroundColor: step >= i ? s.color : '#374151',
                  color: step >= i ? '#000' : '#6b7280',
                }}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={handlePlay}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary/40 text-muted hover:text-text transition-colors"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      {/* Visualization */}
      <div className="rounded-xl bg-background border border-border p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <svg viewBox="0 0 280 120" className="w-full max-w-lg mx-auto h-auto">
              {currentStep.visual}
            </svg>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl border"
          style={{
            borderColor: `${currentStep.color}30`,
            background: `linear-gradient(135deg, ${currentStep.color}08, transparent)`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentStep.color }} />
            <span className="text-sm font-bold text-text">
              Step {step + 1}: {currentStep.label}
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed">{currentStep.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
