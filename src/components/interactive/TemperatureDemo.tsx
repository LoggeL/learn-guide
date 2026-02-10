'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Shuffle, Thermometer, Flame, Snowflake, Wind } from 'lucide-react'
import { TemperatureVisualizer } from './TemperatureVisualizer'
import { useTranslation } from '@/lib/i18n/context'

interface CompletionSample {
  text: string
  bold: string
}

interface CompletionSamples {
  [key: number]: CompletionSample[]
}

export function TemperatureDemo() {
  const { t } = useTranslation()
  const [temperature, setTemperature] = useState(0.7)
  const [completionIndex, setCompletionIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  // Get completion samples from translations
  const getCompletionSamples = useCallback((): CompletionSamples => ({
    0: [
      { text: t.interactive.completion0_0, bold: t.interactive.completionBold0_0 },
    ],
    0.4: [
      { text: t.interactive.completion04_0, bold: t.interactive.completionBold04_0 },
      { text: t.interactive.completion04_1, bold: t.interactive.completionBold04_1 },
    ],
    0.8: [
      { text: t.interactive.completion08_0, bold: t.interactive.completionBold08_0 },
      { text: t.interactive.completion08_1, bold: t.interactive.completionBold08_1 },
      { text: t.interactive.completion08_2, bold: t.interactive.completionBold08_2 },
    ],
    1.2: [
      { text: t.interactive.completion12_0, bold: t.interactive.completionBold12_0 },
      { text: t.interactive.completion12_1, bold: t.interactive.completionBold12_1 },
      { text: t.interactive.completion12_2, bold: t.interactive.completionBold12_2 },
    ],
    1.6: [
      { text: t.interactive.completion16_0, bold: t.interactive.completionBold16_0 },
      { text: t.interactive.completion16_1, bold: t.interactive.completionBold16_1 },
      { text: t.interactive.completion16_2, bold: t.interactive.completionBold16_2 },
    ],
    2.0: [
      { text: t.interactive.completion20_0, bold: t.interactive.completionBold20_0 },
      { text: t.interactive.completion20_1, bold: t.interactive.completionBold20_1 },
    ],
  }), [t])

  const getCompletion = useCallback((temp: number) => {
    let key = 0
    if (temp <= 0.2) key = 0
    else if (temp <= 0.5) key = 0.4
    else if (temp <= 1.0) key = 0.8
    else if (temp <= 1.4) key = 1.2
    else if (temp <= 1.8) key = 1.6
    else key = 2.0

    const samples = getCompletionSamples()[key]
    return samples[Math.floor(Math.random() * samples.length)]
  }, [getCompletionSamples])

  const [completion, setCompletion] = useState<CompletionSample>({ text: '', bold: '' })

  // Initialize completion on mount and when translations change
  useEffect(() => {
    setCompletion(getCompletion(temperature))
  }, [t]) // eslint-disable-line react-hooks/exhaustive-deps

  const getTemperatureState = (temp: number) => {
    if (temp === 0) return { label: t.interactive.frozen, icon: Snowflake, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/20' }
    if (temp <= 0.5) return { label: t.interactive.focused, icon: Snowflake, color: 'text-blue-400', bg: 'from-blue-500/20 to-indigo-500/20' }
    if (temp <= 1.0) return { label: t.interactive.balanced, icon: Wind, color: 'text-purple-400', bg: 'from-purple-500/20 to-pink-500/20' }
    if (temp <= 1.5) return { label: t.interactive.creative, icon: Flame, color: 'text-orange-400', bg: 'from-orange-500/20 to-red-500/20' }
    return { label: t.interactive.chaotic, icon: Flame, color: 'text-red-400', bg: 'from-red-500/20 to-rose-500/20' }
  }

  const state = getTemperatureState(temperature)
  const StateIcon = state.icon

  const regenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setCompletion(getCompletion(temperature))
      setIsGenerating(false)
    }, 300)
  }

  useEffect(() => {
    setCompletion(getCompletion(temperature))
  }, [temperature, getCompletion])

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Control Panel */}
        <div className="rounded-2xl bg-surface border border-border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${state.bg} flex items-center justify-center`}>
                <Thermometer size={18} className={state.color} />
              </div>
              <div>
                <h3 className="font-semibold text-text font-heading">{t.interactive.controlPanel}</h3>
                <p className="text-xs text-muted">{t.interactive.adjustTemperature}</p>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${state.bg} border border-border flex items-center gap-2`}>
              <StateIcon size={14} className={state.color} />
              <span className={`text-xs font-medium ${state.color}`}>{state.label}</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-muted">{t.interactive.temperature}</label>
              <motion.span 
                key={temperature}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-mono font-bold text-gradient"
              >
                {temperature.toFixed(1)}
              </motion.span>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-red-500 opacity-30" />
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="relative w-full"
              />
            </div>
            
            <div className="flex justify-between text-xs sm:text-[10px] text-subtle font-mono uppercase">
              <span>{t.interactive.deterministic}</span>
              <span>{t.interactive.balanced}</span>
              <span>{t.interactive.creative}</span>
              <span>{t.interactive.chaotic}</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 0, label: 'T=0', desc: t.interactive.greedyMode.split(':')[0] },
              { value: 0.7, label: '0.7', desc: t.interactive.balanced },
              { value: 1.0, label: '1.0', desc: t.interactive.creative },
              { value: 1.5, label: '1.5', desc: t.interactive.wild },
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => setTemperature(preset.value)}
                className={`py-2 px-3 rounded-xl border text-center transition-all duration-200 ${
                  temperature === preset.value
                    ? 'bg-primary/20 border-primary/50 text-primary-light'
                    : 'bg-surface-elevated border-border hover:border-primary/30 text-text'
                }`}
              >
                <span className="block text-sm font-mono font-medium">{preset.label}</span>
                <span className="block text-xs sm:text-[10px] text-subtle truncate px-1">{preset.desc}</span>
              </button>
            ))}
          </div>

          {/* Prompt Display */}
          <div className="p-4 rounded-xl bg-background border border-border">
            <p className="text-xs text-subtle mb-2">{t.interactive.samplePrompt}</p>
            <p className="text-text font-medium italic">
              {t.interactive.onceUponATime}
            </p>
          </div>
        </div>

        {/* Visualizer */}
        <TemperatureVisualizer temperature={temperature} />
      </div>

      {/* Live Completion Preview */}
      <motion.div 
        layout
        className="rounded-2xl bg-gradient-to-br from-surface via-surface to-surface-elevated border border-border overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-elevated/50">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isGenerating ? 360 : 0 }}
              transition={{ duration: 0.5, repeat: isGenerating ? Infinity : 0 }}
            >
              <Sparkles size={16} className="text-primary" />
            </motion.div>
            <h4 className="text-sm font-semibold text-text">{t.interactive.liveCompletion}</h4>
          </div>
          <button
            onClick={regenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-primary/40 text-sm text-muted hover:text-text transition-all disabled:opacity-50"
          >
            <Shuffle size={14} />
            <span>{t.interactive.regenerate}</span>
          </button>
        </div>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={completion.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg text-text leading-relaxed"
            >
              <span className="text-muted">{t.interactive.onceUponATime.replace('...', '')} </span>
              <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary-light font-semibold">
                {completion.bold}
              </span>
              <span className="text-muted"> {completion.text.replace(completion.bold + ' ', '').replace(completion.bold, '')}"</span>
            </motion.div>
          </AnimatePresence>
          
          <motion.p
            key={state.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-sm ${state.color} italic`}
          >
            {temperature === 0 && t.interactive.greedyMode}
            {temperature > 0 && temperature <= 0.5 && t.interactive.lowTemp}
            {temperature > 0.5 && temperature <= 1.0 && t.interactive.balancedTemp}
            {temperature > 1.0 && temperature <= 1.5 && t.interactive.highTemp}
            {temperature > 1.5 && t.interactive.veryHighTemp}
          </motion.p>

          {/* Sampling explanation */}
          {temperature > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-surface-elevated border border-border">
              <p className="text-xs text-muted">
                <span className="text-primary-light font-semibold">{t.interactive.whySamplingMatters}</span>{' '}
                {t.interactive.samplingExplanation}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
