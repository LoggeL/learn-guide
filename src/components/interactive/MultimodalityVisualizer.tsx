'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Music, Video, MessageSquare, ArrowRight, Sparkles, Layers } from 'lucide-react'

interface Modality {
  id: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
}

const modalities: Modality[] = [
  { id: 'image', icon: Image, color: 'text-blue-400', bgColor: 'from-blue-500/20 to-indigo-500/20', borderColor: 'border-blue-500/30' },
  { id: 'audio', icon: Music, color: 'text-purple-400', bgColor: 'from-purple-500/20 to-pink-500/20', borderColor: 'border-purple-500/30' },
  { id: 'video', icon: Video, color: 'text-emerald-400', bgColor: 'from-emerald-500/20 to-teal-500/20', borderColor: 'border-emerald-500/30' },
  { id: 'text', icon: MessageSquare, color: 'text-orange-400', bgColor: 'from-orange-500/20 to-red-500/20', borderColor: 'border-orange-500/30' },
]

interface MultimodalityVisualizerProps {
  labels: {
    selectModalities: string
    image: string
    audio: string
    video: string
    text: string
    fusionResult: string
    selectToSee: string
    understanding: string
    imageDesc: string
    audioDesc: string
    videoDesc: string
    textDesc: string
    combinedUnderstanding: string
  }
}

export function MultimodalityVisualizer({ labels }: MultimodalityVisualizerProps) {
  const [activeModalities, setActiveModalities] = useState<string[]>(['image', 'text'])

  const toggleModality = (id: string) => {
    setActiveModalities(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    )
  }

  const getModalityLabel = (id: string) => {
    switch(id) {
      case 'image': return labels.image
      case 'audio': return labels.audio
      case 'video': return labels.video
      case 'text': return labels.text
      default: return id
    }
  }

  const getModalityDescription = (id: string) => {
    switch(id) {
      case 'image': return labels.imageDesc
      case 'audio': return labels.audioDesc
      case 'video': return labels.videoDesc
      case 'text': return labels.textDesc
      default: return ''
    }
  }

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border">
      <h3 className="text-lg font-bold font-heading text-text mb-6">{labels.selectModalities}</h3>

      {/* Modality Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {modalities.map((modality) => {
          const Icon = modality.icon
          const isActive = activeModalities.includes(modality.id)
          return (
            <motion.button
              key={modality.id}
              onClick={() => toggleModality(modality.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${isActive
                  ? `bg-gradient-to-br ${modality.bgColor} ${modality.borderColor}`
                  : 'bg-background border-border hover:border-primary/30'
                }
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className={`w-8 h-8 ${isActive ? modality.color : 'text-muted'}`} />
                <span className={`text-sm font-medium ${isActive ? 'text-text' : 'text-muted'}`}>
                  {getModalityLabel(modality.id)}
                </span>
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                  initial={false}
                >
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Fusion Visualization */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Active Modalities */}
        <div className="flex-1 w-full">
          <AnimatePresence mode="popLayout">
            {activeModalities.length > 0 ? (
              <div className="grid gap-3">
                {activeModalities.map((id) => {
                  const modality = modalities.find(m => m.id === id)!
                  const Icon = modality.icon
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-4 rounded-xl bg-gradient-to-r ${modality.bgColor} border ${modality.borderColor}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${modality.color}`} />
                        <div>
                          <span className={`font-medium ${modality.color}`}>
                            {getModalityLabel(id)}
                          </span>
                          <p className="text-xs text-muted mt-0.5">
                            {getModalityDescription(id)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center text-muted rounded-xl border border-dashed border-border"
              >
                {labels.selectToSee}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Arrow */}
        {activeModalities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-primary-light" />
            </div>
          </motion.div>
        )}

        {/* Fusion Result */}
        {activeModalities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 w-full"
          >
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/30">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="w-6 h-6 text-primary-light" />
                <h4 className="font-bold text-text">{labels.fusionResult}</h4>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {activeModalities.map((id) => {
                  const modality = modalities.find(m => m.id === id)!
                  return (
                    <span
                      key={id}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${modality.color} bg-background/50`}
                    >
                      {getModalityLabel(id)}
                    </span>
                  )
                })}
              </div>
              <p className="text-sm text-muted">
                {activeModalities.length === 1
                  ? labels.understanding
                  : labels.combinedUnderstanding
                }
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
