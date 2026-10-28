'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Plus, Minus, Layers } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { neuralNetFormat } from './NeuralNetShared'

interface Neuron {
  id: string
  layer: number
  index: number
  bias: number
  value: number
}

interface Connection {
  from: string
  to: string
  weight: number
}

interface Network {
  neurons: Neuron[]
  connections: Connection[]
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

/**
 * Builds a fully connected network and computes its forward pass:
 * hidden layers use ReLU, the output layer uses sigmoid.
 * `deterministic` produces fixed values (used for the initial render so server
 * and client markup match); the mount effect replaces them with random ones.
 */
function generateNetwork(layers: number[], deterministic = false): Network {
  const rand = (seed: number) => (deterministic ? (((seed * 7919) % 101) / 100) : Math.random())
  const neurons: Neuron[] = []
  const connections: Connection[] = []

  layers.forEach((count, layerIndex) => {
    for (let i = 0; i < count; i++) {
      const seed = layerIndex * 13 + i * 5 + 3
      neurons.push({
        id: `${layerIndex}-${i}`,
        layer: layerIndex,
        index: i,
        bias: layerIndex === 0 ? 0 : (rand(seed + 1) * 2 - 1) * 0.5,
        value: layerIndex === 0 ? rand(seed) : 0,
      })
    }
  })

  for (let l = 0; l < layers.length - 1; l++) {
    for (let i = 0; i < layers[l]; i++) {
      for (let j = 0; j < layers[l + 1]; j++) {
        connections.push({
          from: `${l}-${i}`,
          to: `${l + 1}-${j}`,
          weight: rand(l * 31 + i * 17 + j * 11 + 2) * 2 - 1,
        })
      }
    }
  }

  // Forward pass, layer by layer
  const byId = new Map(neurons.map((n) => [n.id, n]))
  for (let l = 1; l < layers.length; l++) {
    const isOutput = l === layers.length - 1
    neurons
      .filter((n) => n.layer === l)
      .forEach((neuron) => {
        let z = neuron.bias
        connections
          .filter((c) => c.to === neuron.id)
          .forEach((conn) => {
            z += (byId.get(conn.from)?.value ?? 0) * conn.weight
          })
        neuron.value = isOutput ? sigmoid(z) : Math.max(0, z)
      })
  }

  return { neurons, connections }
}

function countParams(layers: number[]) {
  let total = 0
  for (let l = 1; l < layers.length; l++) total += layers[l - 1] * layers[l] + layers[l]
  return total
}

export function NeuralNetworkVisualizer() {
  const { t, locale } = useTranslation()
  const c = t.neuralNetworks.visualizer
  const [layers, setLayers] = useState([3, 4, 4, 2])
  const [network, setNetwork] = useState(() => generateNetwork([3, 4, 4, 2], true))
  const [isRunning, setIsRunning] = useState(false)
  // Highest layer whose values are visible. Input layer (0) is always visible.
  const [revealed, setRevealed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsRunning(false)
  }

  // Randomize after mount (and whenever the architecture changes)
  useEffect(() => {
    setNetwork(generateNetwork(layers))
    setRevealed(0)
  }, [layers])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const addLayer = () => {
    if (layers.length < 6) setLayers([...layers.slice(0, -1), 3, layers[layers.length - 1]])
  }

  const removeLayer = () => {
    if (layers.length > 3) setLayers([...layers.slice(0, -2), layers[layers.length - 1]])
  }

  const runForwardPass = () => {
    if (isRunning) return
    setIsRunning(true)
    setRevealed(0)
    let layer = 0
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      layer++
      setRevealed(layer)
      if (layer >= layers.length - 1) stopAnimation()
    }, 600)
  }

  const getLayerLabel = (index: number) => {
    if (index === 0) return t.interactive.inputLayer
    if (index === layers.length - 1) return t.interactive.outputLayer
    return `${t.interactive.hiddenLayer} ${index}`
  }

  const canvasWidth = 600
  const canvasHeight = 300
  const layerSpacing = canvasWidth / (layers.length + 1)
  const neuronPos = (n: Neuron) => ({
    x: (n.layer + 1) * layerSpacing,
    y: (n.index + 1) * ((canvasHeight - 20) / (layers[n.layer] + 1)),
  })
  const byId = new Map(network.neurons.map((n) => [n.id, n]))

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Layers size={18} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text font-heading">{c.title}</h3>
              <p className="text-xs text-muted">
                {layers.length} {c.layers}, {network.neurons.length} {c.neurons}, {countParams(layers)} {c.params}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={removeLayer}
              aria-label={c.removeLayer}
              title={c.removeLayer}
              disabled={layers.length <= 3 || isRunning}
              className="p-2 bg-surface-elevated border border-border rounded-lg text-muted hover:text-text transition-colors disabled:opacity-50"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={addLayer}
              aria-label={c.addLayer}
              title={c.addLayer}
              disabled={layers.length >= 6 || isRunning}
              className="p-2 bg-surface-elevated border border-border rounded-lg text-muted hover:text-text transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => {
                if (isRunning) return
                setNetwork(generateNetwork(layers))
                setRevealed(0)
              }}
              disabled={isRunning}
              className="px-4 py-2 bg-surface-elevated border border-border rounded-lg text-muted hover:text-text transition-colors disabled:opacity-50"
            >
              {c.reroll}
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
          <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} className="w-full min-w-[480px] max-w-3xl mx-auto">
            {network.connections.map((conn, i) => {
              const fromNeuron = byId.get(conn.from)
              const toNeuron = byId.get(conn.to)
              if (!fromNeuron || !toNeuron) return null
              const a = neuronPos(fromNeuron)
              const b = neuronPos(toNeuron)
              const isActive = revealed >= toNeuron.layer
              return (
                <motion.line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={isActive ? (conn.weight > 0 ? '#22c55e' : '#ef4444') : '#334155'}
                  strokeWidth={Math.abs(conn.weight) * 2.5 + 0.5}
                  initial={false}
                  animate={{ strokeOpacity: isActive ? 0.8 : 0.35 }}
                  transition={{ duration: 0.4 }}
                />
              )
            })}

            {network.neurons.map((neuron) => {
              const { x, y } = neuronPos(neuron)
              const visible = revealed >= neuron.layer
              const intensity = visible ? Math.min(1, neuron.value) : 0
              return (
                <g key={neuron.id}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={18}
                    fill="#8b5cf6"
                    stroke={visible ? '#a78bfa' : '#475569'}
                    strokeWidth={2}
                    initial={false}
                    animate={{ fillOpacity: 0.15 + intensity * 0.65, scale: visible && neuron.layer === revealed && neuron.layer > 0 ? 1.12 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <text x={x} y={y + 4} textAnchor="middle" className="text-[10px] fill-text font-mono">
                    {visible ? neuralNetFormat(neuron.value, locale, 2, 2) : '·'}
                  </text>
                </g>
              )
            })}

            {layers.map((_, i) => (
              <text
                key={i}
                x={(i + 1) * layerSpacing}
                y={canvasHeight - 6}
                textAnchor="middle"
                className="text-[10px] fill-subtle"
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
            <p>{c.info}</p>
            <p className="mt-2">{c.replayNote}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
