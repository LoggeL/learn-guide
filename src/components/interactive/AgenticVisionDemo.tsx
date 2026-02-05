'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Brain, Code, Eye, CheckCircle, Search, RotateCw, ScanLine } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type Step = 'idle' | 'thinking' | 'zooming' | 'rotating' | 'scanning' | 'complete'

interface LogEntry {
  step: Step
  action: 'think' | 'act' | 'observe'
  message: string
  code?: string
}

// Typewriter text helper
function TypewriterText({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-1.5 h-3.5 bg-current ml-0.5 align-middle"
        />
      )}
    </span>
  )
}

export function AgenticVisionDemo() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState<Step>('idle')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(15)
  const [scanProgress, setScanProgress] = useState(0)
  const [detectedNumber, setDetectedNumber] = useState('')
  const logContainerRef = useRef<HTMLDivElement>(null)

  const serialNumber = 'SN-4827-XK'

  // Auto-scroll agent log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  const resetDemo = () => {
    setCurrentStep('idle')
    setLogs([])
    setZoomLevel(1)
    setRotation(15)
    setScanProgress(0)
    setDetectedNumber('')
  }

  const startDemo = () => {
    setCurrentStep('thinking')
    setLogs([])
  }

  // State machine for the demo
  useEffect(() => {
    if (currentStep === 'idle') return

    const timers: NodeJS.Timeout[] = []

    if (currentStep === 'thinking') {
      timers.push(setTimeout(() => {
        setLogs(prev => [...prev, {
          step: 'thinking',
          action: 'think',
          message: t.agenticVisionDemo.thinkMessage,
        }])
      }, 500))

      timers.push(setTimeout(() => {
        setCurrentStep('zooming')
      }, 2000))
    }

    if (currentStep === 'zooming') {
      timers.push(setTimeout(() => {
        setLogs(prev => [...prev, {
          step: 'zooming',
          action: 'act',
          message: t.agenticVisionDemo.zoomMessage,
          code: 'crop_region(x=480, y=780, w=220, h=72)\nupscale(factor=3)',
        }])
      }, 300))

      let zoom = 1
      const zoomInterval = setInterval(() => {
        zoom += 0.1
        setZoomLevel(zoom)
        if (zoom >= 2.5) {
          clearInterval(zoomInterval)
          timers.push(setTimeout(() => {
            setLogs(prev => [...prev, {
              step: 'zooming',
              action: 'observe',
              message: t.agenticVisionDemo.zoomObserve,
            }])
            setCurrentStep('rotating')
          }, 800))
        }
      }, 80)
      timers.push(zoomInterval as unknown as NodeJS.Timeout)
    }

    if (currentStep === 'rotating') {
      timers.push(setTimeout(() => {
        setLogs(prev => [...prev, {
          step: 'rotating',
          action: 'think',
          message: t.agenticVisionDemo.rotateThink,
        }])
      }, 300))

      timers.push(setTimeout(() => {
        setLogs(prev => [...prev, {
          step: 'rotating',
          action: 'act',
          message: t.agenticVisionDemo.rotateMessage,
          code: 'rotate(angle=-15)',
        }])
      }, 1200))

      timers.push(setTimeout(() => {
        let rot = 15
        const rotInterval = setInterval(() => {
          rot -= 1.5
          setRotation(rot)
          if (rot <= 0) {
            clearInterval(rotInterval)
            timers.push(setTimeout(() => {
              setLogs(prev => [...prev, {
                step: 'rotating',
                action: 'observe',
                message: t.agenticVisionDemo.rotateObserve,
              }])
              setCurrentStep('scanning')
            }, 600))
          }
        }, 50)
        timers.push(rotInterval as unknown as NodeJS.Timeout)
      }, 1800))
    }

    if (currentStep === 'scanning') {
      timers.push(setTimeout(() => {
        setLogs(prev => [...prev, {
          step: 'scanning',
          action: 'act',
          message: t.agenticVisionDemo.scanMessage,
          code: 'text = ocr_extract(region)\nconfidence = 0.97',
        }])
      }, 300))

      timers.push(setTimeout(() => {
        let progress = 0
        const scanInterval = setInterval(() => {
          progress += 5
          setScanProgress(progress)
          if (progress >= 100) {
            clearInterval(scanInterval)
            timers.push(setTimeout(() => {
              setDetectedNumber(serialNumber)
              setLogs(prev => [...prev, {
                step: 'scanning',
                action: 'observe',
                message: `${t.agenticVisionDemo.scanObserve} "${serialNumber}"`,
              }])
              setCurrentStep('complete')
            }, 400))
          }
        }, 40)
        timers.push(scanInterval as unknown as NodeJS.Timeout)
      }, 1000))
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [currentStep, t])

  const getActionIcon = (action: 'think' | 'act' | 'observe') => {
    switch (action) {
      case 'think': return <Brain size={14} className="text-purple-400" />
      case 'act': return <Code size={14} className="text-cyan-400" />
      case 'observe': return <Eye size={14} className="text-emerald-400" />
    }
  }

  const getBorderColor = (action: 'think' | 'act' | 'observe') => {
    switch (action) {
      case 'think': return 'border-l-purple-500'
      case 'act': return 'border-l-cyan-500'
      case 'observe': return 'border-l-emerald-500'
    }
  }

  // Step progress bar data
  const stepDefs: { key: Step; icon: React.ReactNode; label: string; color: string }[] = [
    { key: 'thinking', icon: <Brain size={16} />, label: t.agenticVisionDemo.stepThink, color: 'purple' },
    { key: 'zooming', icon: <Search size={16} />, label: t.agenticVisionDemo.stepZoom, color: 'cyan' },
    { key: 'rotating', icon: <RotateCw size={16} />, label: t.agenticVisionDemo.stepRotate, color: 'orange' },
    { key: 'scanning', icon: <ScanLine size={16} />, label: t.agenticVisionDemo.stepScan, color: 'cyan' },
    { key: 'complete', icon: <CheckCircle size={16} />, label: t.agenticVisionDemo.stepDone, color: 'emerald' },
  ]

  const steps: Step[] = ['thinking', 'zooming', 'rotating', 'scanning', 'complete']
  const currentIndex = steps.indexOf(currentStep)

  const colorMap: Record<string, { bg: string; text: string; ring: string; label: string }> = {
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', ring: 'ring-2 ring-purple-500/40', label: 'text-purple-400' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', ring: 'ring-2 ring-cyan-500/40', label: 'text-cyan-400' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', ring: 'ring-2 ring-orange-500/40', label: 'text-orange-400' },
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', ring: 'ring-2 ring-emerald-500/40', label: 'text-emerald-400' },
  }

  const getStepColor = (stepIndex: number, color: string) => {
    const isComplete = stepIndex < currentIndex || (currentStep === 'complete' && stepIndex === 4)
    const isActive = stepIndex === currentIndex && currentStep !== 'idle'
    if (isComplete) return { bg: 'bg-emerald-500', text: 'text-white', ring: '' }
    if (isActive) {
      const c = colorMap[color]
      return { bg: c.bg, text: c.text, ring: c.ring }
    }
    return { bg: 'bg-surface', text: 'text-muted', ring: 'ring-1 ring-border' }
  }

  return (
    <div className="rounded-2xl bg-background border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text">{t.agenticVisionDemo.title}</h3>
          <p className="text-xs text-muted">{t.agenticVisionDemo.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {currentStep === 'idle' ? (
            <button
              onClick={startDemo}
              className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary-light hover:bg-primary/30 transition-all flex items-center gap-2"
            >
              <Play size={16} />
              {t.agenticVisionDemo.start}
            </button>
          ) : (
            <button
              onClick={resetDemo}
              className="px-4 py-2 rounded-lg bg-surface border border-border text-muted hover:text-text transition-all flex items-center gap-2"
            >
              <RotateCcw size={16} />
              {t.agenticVisionDemo.reset}
            </button>
          )}
        </div>
      </div>

      {/* Step Progress Bar */}
      {currentStep !== 'idle' && (
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-center justify-between">
            {stepDefs.map((step, i) => {
              const isComplete = i < currentIndex || (currentStep === 'complete' && i === 4)
              const isActive = i === currentIndex
              const colors = getStepColor(i, step.color)

              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${colors.bg} ${colors.text} ${colors.ring}`}
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                    >
                      {isComplete ? <CheckCircle size={16} /> : step.icon}
                    </motion.div>
                    <span className={`text-[10px] font-medium ${
                      isComplete ? 'text-emerald-400' : isActive ? colorMap[step.color].label : 'text-muted/50'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < stepDefs.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 mb-5 relative overflow-hidden rounded-full bg-border/50">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: i < currentIndex || currentStep === 'complete' ? '100%' : '0%' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="p-6 pt-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Document Visualization */}
          <div className="relative">
            <h4 className="text-sm font-semibold text-muted mb-3">{t.agenticVisionDemo.documentView}</h4>
            <div className="relative bg-surface rounded-xl border border-border p-4 h-80 overflow-hidden flex items-center justify-center">
              {/* Document SVG */}
              <motion.div
                animate={{
                  scale: zoomLevel,
                  rotate: rotation,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="relative"
                style={{ transformOrigin: '74% 80%' }}
              >
                <svg width="200" height="260" viewBox="0 0 200 260" className="drop-shadow-lg">
                  {/* Document background */}
                  <rect x="10" y="10" width="180" height="240" rx="4" fill="#0f0f1e" stroke="#2a2a4a" strokeWidth="1.5" />

                  {/* Gradient header bar */}
                  <defs>
                    <linearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4338ca" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="serialGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4444ff" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#4444ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Header with gradient */}
                  <rect x="10" y="10" width="180" height="34" rx="4" fill="url(#headerGrad)" />
                  <rect x="10" y="40" width="180" height="4" fill="#0f0f1e" />
                  <text x="22" y="32" fill="#c4b5fd" fontSize="10" fontFamily="monospace" fontWeight="bold">INVOICE #2024-0847</text>
                  <text x="158" y="32" fill="#8b7fd4" fontSize="7" fontFamily="monospace">DUE</text>

                  {/* Separator line */}
                  <line x1="20" y1="52" x2="180" y2="52" stroke="#222244" strokeWidth="0.5" />

                  {/* Address block - variable width lines */}
                  <rect x="20" y="58" width="90" height="6" rx="1" fill="#1a1a32" />
                  <rect x="20" y="68" width="72" height="6" rx="1" fill="#1a1a32" />
                  <rect x="20" y="78" width="85" height="6" rx="1" fill="#1a1a32" />

                  {/* Right side details */}
                  <rect x="130" y="58" width="50" height="6" rx="1" fill="#1a1a32" />
                  <rect x="140" y="68" width="40" height="6" rx="1" fill="#1a1a32" />

                  {/* Separator */}
                  <line x1="20" y1="92" x2="180" y2="92" stroke="#222244" strokeWidth="0.5" />

                  {/* Line items - multi-column table */}
                  {/* Table header */}
                  <rect x="20" y="98" width="160" height="12" rx="1" fill="#151530" />
                  <text x="24" y="107" fill="#555577" fontSize="5" fontFamily="monospace">ITEM</text>
                  <text x="90" y="107" fill="#555577" fontSize="5" fontFamily="monospace">QTY</text>
                  <text x="115" y="107" fill="#555577" fontSize="5" fontFamily="monospace">RATE</text>
                  <text x="150" y="107" fill="#555577" fontSize="5" fontFamily="monospace">TOTAL</text>

                  {/* Grid lines */}
                  <line x1="85" y1="98" x2="85" y2="162" stroke="#1c1c3a" strokeWidth="0.5" />
                  <line x1="110" y1="98" x2="110" y2="162" stroke="#1c1c3a" strokeWidth="0.5" />
                  <line x1="145" y1="98" x2="145" y2="162" stroke="#1c1c3a" strokeWidth="0.5" />

                  {/* Table rows */}
                  {[0, 1, 2, 3].map(i => (
                    <g key={`row-${i}`}>
                      <line x1="20" y1={114 + i * 12} x2="180" y2={114 + i * 12} stroke="#1c1c3a" strokeWidth="0.5" />
                      <rect x="24" y={117 + i * 12} width={50 - i * 8} height="5" rx="1" fill="#1a1a32" />
                      <rect x="90" y={117 + i * 12} width="12" height="5" rx="1" fill="#1a1a32" />
                      <rect x="118" y={117 + i * 12} width="18" height="5" rx="1" fill="#1a1a32" />
                      <rect x="152" y={117 + i * 12} width="22" height="5" rx="1" fill="#1a1a32" />
                    </g>
                  ))}

                  {/* Bottom line of table */}
                  <line x1="20" y1="162" x2="180" y2="162" stroke="#1c1c3a" strokeWidth="0.5" />

                  {/* Total area */}
                  <rect x="110" y="168" width="70" height="18" rx="2" fill="#151530" />
                  <rect x="114" y="172" width="25" height="5" rx="1" fill="#1a1a32" />
                  <rect x="150" y="172" width="26" height="5" rx="1" fill="#252548" />
                  <rect x="114" y="180" width="20" height="4" rx="1" fill="#1a1a32" />
                  <rect x="152" y="180" width="22" height="4" rx="1" fill="#1a1a32" />

                  {/* Pre-existing subtle glow behind serial area */}
                  <rect x="115" y="192" width="68" height="26" rx="3" fill="url(#serialGlow)" />

                  {/* Serial number area */}
                  <g>
                    <rect x="118" y="196" width="60" height="18" rx="2" fill="#0e0e22" stroke="#3b3bbd" strokeWidth="1" strokeDasharray="3 1" />
                    <text x="124" y="209" fill="#a5a5ff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      {serialNumber}
                    </text>
                    <text x="120" y="193" fill="#555577" fontSize="4" fontFamily="monospace">S/N</text>
                  </g>

                  {/* Footer line */}
                  <line x1="20" y1="228" x2="180" y2="228" stroke="#222244" strokeWidth="0.5" />
                  <rect x="20" y="234" width="60" height="5" rx="1" fill="#1a1a32" />
                  <rect x="140" y="234" width="40" height="5" rx="1" fill="#1a1a32" />
                </svg>

                {/* Think phase: Analysis grid overlay */}
                <AnimatePresence>
                  {currentStep === 'thinking' && (
                    <motion.svg
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 pointer-events-none"
                      width="200"
                      height="260"
                      viewBox="0 0 200 260"
                    >
                      {/* Dashed analysis grid */}
                      {[60, 100, 140, 180, 220].map(y => (
                        <motion.line
                          key={`h-${y}`}
                          x1="15" y1={y} x2="185" y2={y}
                          stroke="#7c3aed"
                          strokeWidth="0.5"
                          strokeDasharray="4 4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.4, 0.2] }}
                          transition={{ duration: 1, delay: y * 0.002 }}
                        />
                      ))}
                      {[40, 70, 100, 130, 160].map(x => (
                        <motion.line
                          key={`v-${x}`}
                          x1={x} y1="15" x2={x} y2="245"
                          stroke="#7c3aed"
                          strokeWidth="0.5"
                          strokeDasharray="4 4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.4, 0.2] }}
                          transition={{ duration: 1, delay: x * 0.002 }}
                        />
                      ))}
                      {/* Pulsing reticle moving to serial number */}
                      <motion.g
                        initial={{ x: 100, y: 130, opacity: 0 }}
                        animate={{ x: 148, y: 205, opacity: [0, 1, 1] }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                      >
                        <motion.circle
                          cx="0" cy="0" r="12"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="1.5"
                          animate={{ r: [10, 14, 10], opacity: [0.8, 0.3, 0.8] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <line x1="-6" y1="0" x2="6" y2="0" stroke="#a855f7" strokeWidth="0.8" />
                        <line x1="0" y1="-6" x2="0" y2="6" stroke="#a855f7" strokeWidth="0.8" />
                      </motion.g>
                    </motion.svg>
                  )}
                </AnimatePresence>

                {/* Zoom phase: Focus rectangle with corner brackets */}
                <AnimatePresence>
                  {currentStep === 'zooming' && zoomLevel < 1.8 && (
                    <motion.svg
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none"
                      width="200"
                      height="260"
                      viewBox="0 0 200 260"
                    >
                      {/* Corner brackets around serial number */}
                      <motion.path
                        d="M112,190 L112,194 L116,194"
                        fill="none" stroke="#22d3ee" strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                      <motion.path
                        d="M184,190 L184,194 L180,194"
                        fill="none" stroke="#22d3ee" strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      />
                      <motion.path
                        d="M112,220 L112,216 L116,216"
                        fill="none" stroke="#22d3ee" strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      />
                      <motion.path
                        d="M184,220 L184,216 L180,216"
                        fill="none" stroke="#22d3ee" strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      />
                      {/* Glow rect */}
                      <motion.rect
                        x="112" y="190" width="72" height="30" rx="2"
                        fill="none" stroke="#22d3ee" strokeWidth="0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.6, 0.3] }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        filter="url(#cyanGlow)"
                      />
                      <defs>
                        <filter id="cyanGlow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                    </motion.svg>
                  )}
                </AnimatePresence>

                {/* Scan phase: Glowing scan bar */}
                <AnimatePresence>
                  {currentStep === 'scanning' && (
                    <motion.svg
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none"
                      width="200"
                      height="260"
                      viewBox="0 0 200 260"
                    >
                      <defs>
                        <linearGradient id="scanBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                          <stop offset="40%" stopColor="#22d3ee" stopOpacity="0.8" />
                          <stop offset="60%" stopColor="#22d3ee" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                        </linearGradient>
                        <filter id="scanGlow">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      {/* Translucent fill-in behind scan bar */}
                      <motion.rect
                        x="118" y="196"
                        width="60" height={18 * (scanProgress / 100)}
                        fill="#22d3ee"
                        opacity="0.08"
                        rx="1"
                      />
                      {/* Wide glowing scan bar */}
                      <motion.rect
                        x="116"
                        y={196 + (scanProgress / 100) * 16}
                        width="64"
                        height="4"
                        rx="2"
                        fill="url(#scanBarGrad)"
                        filter="url(#scanGlow)"
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>

                {/* Complete phase: Green highlight with checkmark */}
                <AnimatePresence>
                  {currentStep === 'complete' && (
                    <motion.svg
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none"
                      width="200"
                      height="260"
                      viewBox="0 0 200 260"
                    >
                      <defs>
                        <filter id="greenGlow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <motion.rect
                        x="115" y="193" width="66" height="24" rx="3"
                        fill="#10b981" fillOpacity="0.12"
                        stroke="#10b981" strokeWidth="1.5"
                        filter="url(#greenGlow)"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                      <motion.g
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                      >
                        <circle cx="187" cy="193" r="7" fill="#10b981" />
                        <path d="M183.5,193 L186,195.5 L190.5,190.5" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.g>
                    </motion.svg>
                  )}
                </AnimatePresence>

                {/* Zoom indicator box (during zoom/rotate/scan at high zoom) */}
                <AnimatePresence>
                  {(currentStep === 'zooming' || currentStep === 'rotating' || currentStep === 'scanning') && zoomLevel > 1.8 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute border-2 border-cyan-400 rounded pointer-events-none"
                      style={{
                        top: '76%',
                        left: '60%',
                        width: '28%',
                        height: '8%',
                        boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Zoom level indicator */}
              {zoomLevel > 1 && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-400 font-mono">
                  {zoomLevel.toFixed(1)}x
                </div>
              )}

              {/* Rotation indicator */}
              {rotation !== 0 && currentStep !== 'idle' && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-xs text-orange-400 font-mono">
                  {rotation > 0 ? '+' : ''}{rotation.toFixed(0)}°
                </div>
              )}
            </div>
          </div>

          {/* Agent Log - Terminal Style */}
          <div>
            <h4 className="text-sm font-semibold text-muted mb-3">{t.agenticVisionDemo.agentLog}</h4>
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Terminal chrome */}
              <div className="bg-[#0a0a14] px-4 py-2 flex items-center gap-1.5 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-[10px] text-muted/40 font-mono">agent-vision.log</span>
              </div>
              <div
                ref={logContainerRef}
                className="bg-[#0a0a14] p-4 h-[272px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
              >
                {currentStep === 'idle' ? (
                  <div className="h-full flex items-center justify-center text-muted/50 text-sm font-mono">
                    {t.agenticVisionDemo.clickStart}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <AnimatePresence>
                      {logs.map((log, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className={`pl-3 pr-3 py-2.5 border-l-2 ${getBorderColor(log.action)} rounded-r-md bg-white/[0.02]`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {getActionIcon(log.action)}
                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                              log.action === 'think' ? 'text-purple-400/70' :
                              log.action === 'act' ? 'text-cyan-400/70' :
                              'text-emerald-400/70'
                            }`}>
                              {log.action}
                            </span>
                          </div>
                          <p className="text-sm text-text/90 leading-relaxed">
                            <TypewriterText text={log.message} speed={15} />
                          </p>
                          {log.code && (
                            <pre className="mt-2 p-2 rounded bg-black/30 text-xs font-mono text-cyan-400/80 overflow-x-auto border border-white/5">
                              {log.code}
                            </pre>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Current action indicator */}
                    {currentStep !== 'complete' && (
                      <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-center gap-2 pl-3 py-1 text-muted/50"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-mono">{t.agenticVisionDemo.processing}</span>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Result Card */}
        <AnimatePresence>
          {currentStep === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-emerald-400 font-semibold">{t.agenticVisionDemo.resultTitle}</span>
                    <p className="text-xs text-muted mt-0.5">{t.agenticVisionDemo.resultConfidence}</p>
                  </div>
                </div>
                <div className="px-5 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="font-mono text-xl text-emerald-300 tracking-wider">{detectedNumber}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
