'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Brain, Code, Eye, CheckCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type Step = 'idle' | 'thinking' | 'zooming' | 'rotating' | 'scanning' | 'complete'

interface LogEntry {
  step: Step
  action: 'think' | 'act' | 'observe'
  message: string
  code?: string
}

export function AgenticVisionDemo() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState<Step>('idle')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(15) // Document starts slightly rotated
  const [scanProgress, setScanProgress] = useState(0)
  const [detectedNumber, setDetectedNumber] = useState('')

  const serialNumber = 'SN-4827-XK'

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
      // Think phase
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
      // Act: Zoom
      timers.push(setTimeout(() => {
        setLogs(prev => [...prev, {
          step: 'zooming',
          action: 'act',
          message: t.agenticVisionDemo.zoomMessage,
          code: 'crop_region(x=480, y=780, w=220, h=72)\nupscale(factor=3)',
        }])
      }, 300))

      // Animate zoom
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
      // Act: Rotate
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

      // Animate rotation
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
      // Act: Scan/OCR
      timers.push(setTimeout(() => {
        setLogs(prev => [...prev, {
          step: 'scanning',
          action: 'act',
          message: t.agenticVisionDemo.scanMessage,
          code: 'text = ocr_extract(region)\nconfidence = 0.97',
        }])
      }, 300))

      // Animate scan
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

  const getActionColor = (action: 'think' | 'act' | 'observe') => {
    switch (action) {
      case 'think': return 'border-purple-500/30 bg-purple-500/5'
      case 'act': return 'border-cyan-500/30 bg-cyan-500/5'
      case 'observe': return 'border-emerald-500/30 bg-emerald-500/5'
    }
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

      <div className="p-6">
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
                  <rect x="10" y="10" width="180" height="240" rx="4" fill="#1a1a2e" stroke="#333355" strokeWidth="2" />

                  {/* Document header */}
                  <rect x="20" y="20" width="160" height="30" rx="2" fill="#252545" />
                  <text x="30" y="40" fill="#8888aa" fontSize="10" fontFamily="monospace">INVOICE #2024-0847</text>

                  {/* Document lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <rect key={i} x="20" y={60 + i * 20} width={140 - i * 15} height="8" rx="2" fill="#252545" />
                  ))}

                  {/* Table area */}
                  <rect x="20" y="170" width="160" height="50" rx="2" fill="#252545" />
                  <line x1="20" y1="185" x2="180" y2="185" stroke="#333355" />
                  <line x1="100" y1="170" x2="100" y2="220" stroke="#333355" />

                  {/* Serial number area - this is what we're zooming into */}
                  <g>
                    <rect x="120" y="195" width="55" height="18" rx="2" fill="#1e1e3a" stroke="#4444ff" strokeWidth="1" />
                    <text x="125" y="208" fill="#aaaaff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      {serialNumber}
                    </text>
                  </g>
                </svg>

                {/* Scan line animation */}
                <AnimatePresence>
                  {currentStep === 'scanning' && (
                    <motion.div
                      initial={{ top: '75%', opacity: 0 }}
                      animate={{
                        top: `${75 + (scanProgress / 100) * 8}%`,
                        opacity: [0, 1, 1, 0],
                      }}
                      className="absolute left-1/2 -translate-x-1/2 w-16 h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                      style={{
                        marginLeft: '10px',
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Zoom indicator box */}
                <AnimatePresence>
                  {(currentStep === 'zooming' || currentStep === 'rotating' || currentStep === 'scanning') && zoomLevel > 1.5 && (
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

            {/* Result */}
            <AnimatePresence>
              {currentStep === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={18} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">{t.agenticVisionDemo.resultTitle}</span>
                  </div>
                  <div className="font-mono text-xl text-text">{detectedNumber}</div>
                  <p className="text-xs text-muted mt-1">{t.agenticVisionDemo.resultConfidence}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Agent Log */}
          <div>
            <h4 className="text-sm font-semibold text-muted mb-3">{t.agenticVisionDemo.agentLog}</h4>
            <div className="bg-surface rounded-xl border border-border p-4 h-80 overflow-y-auto">
              {currentStep === 'idle' ? (
                <div className="h-full flex items-center justify-center text-muted text-sm">
                  {t.agenticVisionDemo.clickStart}
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {logs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`p-3 rounded-lg border ${getActionColor(log.action)}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getActionIcon(log.action)}
                          <span className="text-xs font-semibold uppercase text-muted">
                            {log.action}
                          </span>
                        </div>
                        <p className="text-sm text-text">{log.message}</p>
                        {log.code && (
                          <pre className="mt-2 p-2 rounded bg-background/50 text-xs font-mono text-cyan-400 overflow-x-auto">
                            {log.code}
                          </pre>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Current action indicator */}
                  {currentStep !== 'complete' && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-2 p-2 text-muted"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs">{t.agenticVisionDemo.processing}</span>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Step indicator */}
            <div className="mt-4 flex items-center justify-between">
              {['thinking', 'zooming', 'rotating', 'scanning', 'complete'].map((step, i) => {
                const steps: Step[] = ['thinking', 'zooming', 'rotating', 'scanning', 'complete']
                const currentIndex = steps.indexOf(currentStep)
                const stepIndex = i
                const isActive = currentStep === step && currentStep !== 'complete'
                const isComplete = stepIndex < currentIndex || (currentStep === 'complete' && step === 'complete')

                return (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full transition-all ${
                        isComplete
                          ? 'bg-emerald-500'
                          : isActive
                          ? 'bg-primary ring-2 ring-primary/30'
                          : 'bg-surface border border-border'
                      }`}
                    />
                    {i < 4 && (
                      <div
                        className={`w-8 md:w-12 h-0.5 transition-all ${
                          isComplete ? 'bg-emerald-500' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between text-[10px] text-muted mt-1">
              <span>{t.agenticVisionDemo.stepThink}</span>
              <span>{t.agenticVisionDemo.stepZoom}</span>
              <span>{t.agenticVisionDemo.stepRotate}</span>
              <span>{t.agenticVisionDemo.stepScan}</span>
              <span>{t.agenticVisionDemo.stepDone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
