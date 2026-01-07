'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Dice5, Thermometer } from 'lucide-react'
import { TemperatureVisualizer } from './TemperatureVisualizer'

export function TemperatureDemo() {
  const [temperature, setTemperature] = useState(0.7)

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Controls */}
        <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2 text-secondary mb-2">
            <Thermometer size={18} />
            <h3 className="font-semibold">Control Panel</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-text">Temperature</label>
              <span className="text-xl font-mono font-bold text-primary">
                {temperature.toFixed(1)}
              </span>
            </div>
            
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
            />
            
            <div className="flex justify-between text-[10px] text-muted font-mono uppercase tracking-tighter">
              <span>Deterministic</span>
              <span>Balanced</span>
              <span>Creative</span>
              <span>Chaotic</span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <div className="p-3 bg-background rounded border border-border/50 text-sm">
              <p className="text-muted mb-2">Sample Prompt:</p>
              <p className="text-text italic font-serif">"Once upon a time, there was..."</p>
            </div>
            
            <div className="flex gap-2 text-xs">
              <button 
                onClick={() => setTemperature(0)}
                className="flex-1 py-1.5 rounded border border-border hover:border-primary/50 transition-colors"
              >
                Zero (T=0)
              </button>
              <button 
                onClick={() => setTemperature(0.7)}
                className="flex-1 py-1.5 rounded border border-border hover:border-primary/50 transition-colors"
              >
                Standard (0.7)
              </button>
              <button 
                onClick={() => setTemperature(1.5)}
                className="flex-1 py-1.5 rounded border border-border hover:border-primary/50 transition-colors"
              >
                High (1.5)
              </button>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <TemperatureVisualizer temperature={temperature} />
      </div>

      {/* Outcome Simulation */}
      <div className="bg-surface/30 border border-border rounded-lg p-6">
        <h4 className="text-sm font-semibold text-muted mb-4 flex items-center gap-2">
          {temperature > 1.2 ? <Dice5 size={14} className="text-yellow-400" /> : <Sparkles size={14} className="text-primary" />}
          Simulated Completion Output
        </h4>
        
        <div className="bg-background rounded p-4 border border-border/50 min-h-[80px] flex items-center justify-center text-center">
          <motion.p 
            key={temperature}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-text italic leading-relaxed"
          >
            {temperature === 0 && (
              <span>"Once upon a time, there was <strong>the</strong> king of the..."</span>
            )}
            {temperature > 0 && temperature <= 0.8 && (
              <span>"Once upon a time, there was <strong>a</strong> small village in..."</span>
            )}
            {temperature > 0.8 && temperature <= 1.3 && (
              <span>"Once upon a time, there was <strong>one</strong> peculiar cloud that..."</span>
            )}
            {temperature > 1.3 && temperature <= 1.7 && (
              <span>"Once upon a time, there was <strong>every</strong> shadow dancing across..."</span>
            )}
            {temperature > 1.7 && (
              <span>"Once upon a time, there was <strong>some</strong> banana philosophy purple..."</span>
            )}
          </motion.p>
        </div>
      </div>
    </div>
  )
}
