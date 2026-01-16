'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, ZoomIn, Grid3X3 } from 'lucide-react'

interface Patch {
  id: number
  x: number
  y: number
  color: string
  tokenIndex: number
}

const GRID_SIZES = [4, 8, 14, 16] as const
type GridSize = (typeof GRID_SIZES)[number]

// Generate a simple gradient/pattern to represent an "image"
function generateImagePatches(gridSize: number): Patch[] {
  const patches: Patch[] = []
  let tokenIndex = 0

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // Create a gradient effect with some variation
      const hue = (x / gridSize) * 60 + (y / gridSize) * 180 + 180
      const saturation = 60 + Math.sin(x * 0.5) * 20
      const lightness = 35 + Math.cos(y * 0.3) * 15

      patches.push({
        id: tokenIndex,
        x,
        y,
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        tokenIndex,
      })
      tokenIndex++
    }
  }
  return patches
}

export function PatchGridVisualizer() {
  const [gridSize, setGridSize] = useState<GridSize>(8)
  const [patches, setPatches] = useState<Patch[]>([])
  const [highlightedPatch, setHighlightedPatch] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationIndex, setAnimationIndex] = useState(0)
  const [showTokens, setShowTokens] = useState(false)

  useEffect(() => {
    setPatches(generateImagePatches(gridSize))
    setAnimationIndex(0)
    setIsAnimating(false)
  }, [gridSize])

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setAnimationIndex((prev) => {
        if (prev >= patches.length - 1) {
          setIsAnimating(false)
          return prev
        }
        return prev + 1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isAnimating, patches.length])

  const totalTokens = gridSize * gridSize
  const patchSizePixels = Math.floor(224 / gridSize) // Assuming 224x224 image

  return (
    <div className="rounded-2xl bg-background border border-border overflow-hidden">
      {/* Controls */}
      <div className="p-4 border-b border-border bg-surface/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">Grid Size:</span>
          {GRID_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
                gridSize === size
                  ? 'bg-primary/20 text-primary-light border border-primary/30'
                  : 'bg-surface border border-border text-muted hover:text-text'
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTokens(!showTokens)}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all ${
              showTokens
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-surface border border-border text-muted hover:text-text'
            }`}
          >
            <Grid3X3 size={14} />
            Show Tokens
          </button>
          <button
            onClick={() => {
              setAnimationIndex(0)
              setIsAnimating(true)
            }}
            className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-primary-light hover:bg-primary/30 transition-all"
          >
            {isAnimating ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => {
              setAnimationIndex(0)
              setIsAnimating(false)
            }}
            className="p-2 rounded-lg bg-surface border border-border text-muted hover:text-text transition-all"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Grid */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
              <ZoomIn size={16} className="text-cyan-400" />
              Image Patches ({gridSize}x{gridSize} = {totalTokens} tokens)
            </h3>
            <div
              className="relative mx-auto border border-border rounded-lg overflow-hidden"
              style={{ width: 'fit-content' }}
            >
              <div
                className="grid gap-0"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  width: `${Math.min(320, gridSize * 24)}px`,
                  height: `${Math.min(320, gridSize * 24)}px`,
                }}
              >
                {patches.map((patch) => {
                  const isHighlighted = highlightedPatch === patch.id
                  const isAnimated = patch.id <= animationIndex

                  return (
                    <motion.div
                      key={patch.id}
                      className="relative cursor-pointer transition-all duration-150"
                      style={{
                        backgroundColor: patch.color,
                        opacity: isAnimated ? 1 : 0.3,
                      }}
                      onMouseEnter={() => setHighlightedPatch(patch.id)}
                      onMouseLeave={() => setHighlightedPatch(null)}
                      animate={{
                        scale: isHighlighted ? 1.1 : 1,
                        zIndex: isHighlighted ? 10 : 1,
                      }}
                    >
                      {showTokens && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-white/80 font-mono drop-shadow-lg"
                            style={{ fontSize: gridSize > 8 ? '6px' : '10px' }}
                          >
                            {patch.tokenIndex}
                          </span>
                        </div>
                      )}
                      {isHighlighted && (
                        <div className="absolute inset-0 border-2 border-white/50 rounded-sm" />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
            <p className="text-xs text-muted mt-2 text-center">
              Each {patchSizePixels}x{patchSizePixels}px patch becomes one token
            </p>
          </div>

          {/* Token Sequence */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-3">Linearized Token Sequence</h3>
            <div className="p-4 rounded-xl bg-surface border border-border max-h-80 overflow-y-auto">
              <div className="flex flex-wrap gap-1">
                {patches.slice(0, animationIndex + 1).map((patch) => (
                  <motion.div
                    key={patch.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`w-6 h-6 rounded cursor-pointer transition-all ${
                      highlightedPatch === patch.id ? 'ring-2 ring-white/50 scale-110' : ''
                    }`}
                    style={{ backgroundColor: patch.color }}
                    onMouseEnter={() => setHighlightedPatch(patch.id)}
                    onMouseLeave={() => setHighlightedPatch(null)}
                  />
                ))}
                {animationIndex < patches.length - 1 && (
                  <span className="text-muted text-sm self-center ml-2">
                    ...{patches.length - animationIndex - 1} more
                  </span>
                )}
              </div>
            </div>

            {/* Info Box */}
            <AnimatePresence mode="wait">
              {highlightedPatch !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                >
                  <div className="text-sm">
                    <span className="text-cyan-400 font-semibold">Patch {highlightedPatch}</span>
                    <span className="text-muted">
                      {' '}
                      at position ({patches[highlightedPatch]?.x}, {patches[highlightedPatch]?.y})
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    This {patchSizePixels}x{patchSizePixels}px region is projected to a{' '}
                    <span className="text-text">768-dimensional vector</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Key Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Patch Size', value: `${patchSizePixels}x${patchSizePixels}px`, color: 'cyan' },
            { label: 'Total Patches', value: totalTokens.toString(), color: 'purple' },
            { label: 'Image Tokens', value: `${totalTokens}`, color: 'emerald' },
            {
              label: 'vs Text',
              value: `~${Math.round(totalTokens / 4)} words`,
              color: 'orange',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`p-3 rounded-lg bg-${stat.color}-500/10 border border-${stat.color}-500/20 text-center`}
            >
              <div className={`text-lg font-mono font-bold text-${stat.color}-400`}>{stat.value}</div>
              <div className="text-xs text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
