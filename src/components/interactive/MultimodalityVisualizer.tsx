'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Music, Video, MessageSquare, ArrowRight, Sparkles, Layers, Lightbulb } from 'lucide-react'

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

interface UseCase {
  title: string
  description: string
  example: string
}

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
    useCases: string
    examplePrompt: string
    // Use case labels
    useCaseImageText: string
    useCaseImageTextDesc: string
    useCaseImageTextExample: string
    useCaseAudioText: string
    useCaseAudioTextDesc: string
    useCaseAudioTextExample: string
    useCaseVideoText: string
    useCaseVideoTextDesc: string
    useCaseVideoTextExample: string
    useCaseImageAudio: string
    useCaseImageAudioDesc: string
    useCaseImageAudioExample: string
    useCaseVideoAudio: string
    useCaseVideoAudioDesc: string
    useCaseVideoAudioExample: string
    useCaseImageVideo: string
    useCaseImageVideoDesc: string
    useCaseImageVideoExample: string
    useCaseImageAudioText: string
    useCaseImageAudioTextDesc: string
    useCaseImageAudioTextExample: string
    useCaseVideoAudioText: string
    useCaseVideoAudioTextDesc: string
    useCaseVideoAudioTextExample: string
    useCaseImageVideoText: string
    useCaseImageVideoTextDesc: string
    useCaseImageVideoTextExample: string
    useCaseImageAudioVideo: string
    useCaseImageAudioVideoDesc: string
    useCaseImageAudioVideoExample: string
    useCaseAll: string
    useCaseAllDesc: string
    useCaseAllExample: string
    useCaseImageOnly: string
    useCaseImageOnlyDesc: string
    useCaseImageOnlyExample: string
    useCaseAudioOnly: string
    useCaseAudioOnlyDesc: string
    useCaseAudioOnlyExample: string
    useCaseVideoOnly: string
    useCaseVideoOnlyDesc: string
    useCaseVideoOnlyExample: string
    useCaseTextOnly: string
    useCaseTextOnlyDesc: string
    useCaseTextOnlyExample: string
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

  const getUseCases = (): UseCase[] => {
    const sorted = [...activeModalities].sort()
    const key = sorted.join('+')

    // Define use cases for each combination
    const useCaseMap: Record<string, UseCase[]> = {
      // Single modalities
      'image': [{
        title: labels.useCaseImageOnly,
        description: labels.useCaseImageOnlyDesc,
        example: labels.useCaseImageOnlyExample
      }],
      'audio': [{
        title: labels.useCaseAudioOnly,
        description: labels.useCaseAudioOnlyDesc,
        example: labels.useCaseAudioOnlyExample
      }],
      'video': [{
        title: labels.useCaseVideoOnly,
        description: labels.useCaseVideoOnlyDesc,
        example: labels.useCaseVideoOnlyExample
      }],
      'text': [{
        title: labels.useCaseTextOnly,
        description: labels.useCaseTextOnlyDesc,
        example: labels.useCaseTextOnlyExample
      }],
      // Two modality combinations
      'image+text': [{
        title: labels.useCaseImageText,
        description: labels.useCaseImageTextDesc,
        example: labels.useCaseImageTextExample
      }],
      'audio+text': [{
        title: labels.useCaseAudioText,
        description: labels.useCaseAudioTextDesc,
        example: labels.useCaseAudioTextExample
      }],
      'text+video': [{
        title: labels.useCaseVideoText,
        description: labels.useCaseVideoTextDesc,
        example: labels.useCaseVideoTextExample
      }],
      'audio+image': [{
        title: labels.useCaseImageAudio,
        description: labels.useCaseImageAudioDesc,
        example: labels.useCaseImageAudioExample
      }],
      'audio+video': [{
        title: labels.useCaseVideoAudio,
        description: labels.useCaseVideoAudioDesc,
        example: labels.useCaseVideoAudioExample
      }],
      'image+video': [{
        title: labels.useCaseImageVideo,
        description: labels.useCaseImageVideoDesc,
        example: labels.useCaseImageVideoExample
      }],
      // Three modality combinations
      'audio+image+text': [{
        title: labels.useCaseImageAudioText,
        description: labels.useCaseImageAudioTextDesc,
        example: labels.useCaseImageAudioTextExample
      }],
      'audio+text+video': [{
        title: labels.useCaseVideoAudioText,
        description: labels.useCaseVideoAudioTextDesc,
        example: labels.useCaseVideoAudioTextExample
      }],
      'image+text+video': [{
        title: labels.useCaseImageVideoText,
        description: labels.useCaseImageVideoTextDesc,
        example: labels.useCaseImageVideoTextExample
      }],
      'audio+image+video': [{
        title: labels.useCaseImageAudioVideo,
        description: labels.useCaseImageAudioVideoDesc,
        example: labels.useCaseImageAudioVideoExample
      }],
      // All four modalities
      'audio+image+text+video': [{
        title: labels.useCaseAll,
        description: labels.useCaseAllDesc,
        example: labels.useCaseAllExample
      }],
    }

    return useCaseMap[key] || []
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

      {/* Use Cases Section */}
      {activeModalities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h4 className="font-bold text-text">{labels.useCases}</h4>
          </div>
          <AnimatePresence mode="popLayout">
            <div className="grid gap-4">
              {getUseCases().map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5 border border-yellow-500/20"
                >
                  <h5 className="font-bold text-text mb-2">{useCase.title}</h5>
                  <p className="text-sm text-muted mb-3">{useCase.description}</p>
                  <div className="p-3 rounded-lg bg-background/50 border border-border">
                    <span className="text-xs font-medium text-primary-light block mb-1">{labels.examplePrompt}</span>
                    <p className="text-sm text-text italic">&ldquo;{useCase.example}&rdquo;</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
