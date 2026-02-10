'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Plus, Minus, Layers } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface Neuron {
  id: string
  layer: number
  index: number
  value: number
  activated: boolean
}

interface Connection {
  from: string
  to: string
  weight: number
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

function generateNetwork(layers: number[]): { neurons: Neuron[]; connections: Connection[] } {
  const neurons: Neuron[] = []
  const connections: Connection[] = []

  // Create neurons
  layers.forEach((count, layerIndex) => {
    for (let i = 0; i < count; i++) {
      neurons.push({
        id: `${layerIndex}-${i}`,
        layer: layerIndex,
        index: i,
        value: layerIndex === 0 ? Math.random() : 0,
        activated: false,
      })
    }
  })

  // Create connections between adjacent layers
  for (let l = 0; l < layers.length - 1; l++) {
    for (let i = 0; i < layers[l]; i++) {
      for (let j = 0; j < layers[l + 1]; j++) {
        connections.push({
          from: `${l}-${i}`,
          to: `${l + 1}-${j}`,
          weight: (Math.random() * 2 - 1) * 0.5,
        })
      }
    }
  }

  return { neurons, connections }
}

export function NeuralNetworkVisualizer() {
  const { t } = useTranslation()
  const [layers, setLayers] = useState([3, 4, 4, 2])
  const [network, setNetwork] = useState(() => generateNetwork([3, 4, 4, 2]))
  const [isRunning, setIsRunning] = useState(false)
  const [currentLayer, setCurrentLayer] = useState(0)

  useEffect(() => {
    setNetwork(generateNetwork(layers))
    setCurrentLayer(0)
  }, [layers])

  const addLayer = () => {
    if (layers.length < 6) {
      const newLayers = [...layers.slice(0, -1), 3, layers[layers.length - 1]]
      setLayers(newLayers)
    }
  }

  const removeLayer = () => {
    if (layers.length > 3) {
      const newLayers = [...layers.slice(0, -2), layers[layers.length - 1]]
      setLayers(newLayers)
    }
  }

  const runForwardPass = () => {
    if (isRunning) return
    setIsRunning(true)
    setCurrentLayer(0)

    // Reset network with random inputs
    const newNetwork = generateNetwork(layers)
    setNetwork(newNetwork)

    // Animate forward pass
    let layer = 0
    const interval = setInterval(() => {
      layer++
      setCurrentLayer(layer)

      if (layer >= layers.length) {
        clearInterval(interval)
        setIsRunning(false)

        // Compute final values
        setNetwork((prev) => {
          const updated = { ...prev, neurons: [...prev.neurons] }

          // For each layer after input
          for (let l = 1; l < layers.length; l++) {
            const layerNeurons = updated.neurons.filter((n) => n.layer === l)

            layerNeurons.forEach((neuron) => {
              // Sum weighted inputs
              const incomingConns = prev.connections.filter((c) => c.to === neuron.id)
              let sum = 0
              incomingConns.forEach((conn) => {
                const fromNeuron = updated.neurons.find((n) => n.id === conn.from)
                if (fromNeuron) {
                  sum += fromNeuron.value * conn.weight
                }
              })

              // Apply activation
              const idx = updated.neurons.findIndex((n) => n.id === neuron.id)
              updated.neurons[idx] = {
                ...neuron,
                value: sigmoid(sum),
                activated: true,
              }
            })
          }

          return updated
        })
      }
    }, 500)
  }

  const getLayerLabel = (index: number) => {
    if (index === 0) return t.interactive.inputLayer
    if (index === layers.length - 1) return t.interactive.outputLayer
    return `${t.interactive.hiddenLayer} ${index}`
  }

  const canvasWidth = 600
  const canvasHeight = 300
  const layerSpacing = canvasWidth / (layers.length + 1)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Layers size={18} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">Network Architecture</h3>
              <p className="text-xs text-muted">{layers.length} layers, {network.neurons.length} neurons</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={removeLayer}
              disabled={layers.length <= 3 || isRunning}
              className="p-2 bg-surface-elevated border border-border rounded-lg text-muted hover:text-text transition-colors disabled:opacity-50"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={addLayer}
              disabled={layers.length >= 6 || isRunning}
              className="p-2 bg-surface-elevated border border-border rounded-lg text-muted hover:text-text transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={runForwardPass}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
            >
              <Play size={14} />
              {t.interactive.forward}
            </button>
          </div>
        </div>

        {/* Layer Config */}
        <div className="flex gap-2 flex-wrap">
          {layers.map((count, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-border">
              <span className="text-xs text-muted">{getLayerLabel(i)}:</span>
              <span className="text-sm font-mono font-bold text-text">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Network Visualization */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="relative w-full overflow-x-auto">
          <svg width={canvasWidth} height={canvasHeight} className="mx-auto">
            {/* Connections */}
            {network.connections.map((conn, i) => {
              const fromNeuron = network.neurons.find((n) => n.id === conn.from)
              const toNeuron = network.neurons.find((n) => n.id === conn.to)
              if (!fromNeuron || !toNeuron) return null

              const fromX = (fromNeuron.layer + 1) * layerSpacing
              const toX = (toNeuron.layer + 1) * layerSpacing
              const layerHeight = canvasHeight / (layers[fromNeuron.layer] + 1)
              const nextLayerHeight = canvasHeight / (layers[toNeuron.layer] + 1)
              const fromY = (fromNeuron.index + 1) * layerHeight
              const toY = (toNeuron.index + 1) * nextLayerHeight

              const isActive = currentLayer > toNeuron.layer

              return (
                <motion.line
                  key={i}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={isActive ? (conn.weight > 0 ? '#22c55e' : '#ef4444') : '#333'}
                  strokeWidth={Math.abs(conn.weight) * 3 + 0.5}
                  strokeOpacity={isActive ? 0.8 : 0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                />
              )
            })}

            {/* Neurons */}
            {network.neurons.map((neuron) => {
              const x = (neuron.layer + 1) * layerSpacing
              const layerHeight = canvasHeight / (layers[neuron.layer] + 1)
              const y = (neuron.index + 1) * layerHeight

              const isActive = currentLayer >= neuron.layer
              const intensity = neuron.layer === 0 ? neuron.value : (neuron.activated ? neuron.value : 0)

              return (
                <motion.g key={neuron.id}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={isActive ? 18 : 15}
                    fill={`rgba(139, 92, 246, ${0.2 + intensity * 0.6})`}
                    stroke={isActive ? '#a78bfa' : '#666'}
                    strokeWidth={2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: neuron.layer * 0.1 + neuron.index * 0.05 }}
                  />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    className="text-xs sm:text-[10px] fill-white font-mono"
                  >
                    {intensity.toFixed(2)}
                  </text>
                </motion.g>
              )
            })}

            {/* Layer Labels */}
            {layers.map((_, i) => (
              <text
                key={i}
                x={(i + 1) * layerSpacing}
                y={canvasHeight - 10}
                textAnchor="middle"
                className="text-xs sm:text-[10px] fill-gray-400"
              >
                {getLayerLabel(i)}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <Layers size={18} className="text-primary-light shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p>Each neuron computes a weighted sum of inputs and applies an activation function (sigmoid). Connection thickness represents weight magnitude; color indicates positive (green) or negative (red) weights.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
