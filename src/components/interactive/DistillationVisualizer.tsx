'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, BookOpen, Thermometer, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const TEACHER_LOGITS = [5.2, 3.8, 2.1, 0.9, 0.3]

function softmax(logits: number[], temp: number): number[] {
  const scaled = logits.map((l) => Math.exp(l / temp))
  const sum = scaled.reduce((a, b) => a + b, 0)
  return scaled.map((s) => (s / sum) * 100)
}

// KL divergence approximation for display
function klDivergence(p: number[], q: number[]): number {
  let kl = 0
  for (let i = 0; i < p.length; i++) {
    const pNorm = p[i] / 100
    const qNorm = q[i] / 100
    if (pNorm > 0.0001 && qNorm > 0.0001) {
      kl += pNorm * Math.log(pNorm / qNorm)
    }
  }
  return kl
}

// Entropy for display
function entropy(probs: number[]): number {
  let h = 0
  for (const p of probs) {
    const pNorm = p / 100
    if (pNorm > 0.0001) {
      h -= pNorm * Math.log2(pNorm)
    }
  }
  return h
}

interface BarProps {
  label: string
  value: number
  maxValue: number
  color: string
  gradient: string
  delay: number
}

function AnimatedBar({ label, value, maxValue, color, gradient, delay }: BarProps) {
  const width = Math.max((value / maxValue) * 100, 1)
  return (
    <div className="flex items-center gap-2">
      <span className={`w-14 text-xs font-mono font-medium ${color} text-right`}>{label}</span>
      <div className="flex-1 h-7 bg-background rounded-lg overflow-hidden border border-border/30">
        <motion.div
          className={`h-full rounded-lg bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25, delay }}
        />
      </div>
      <motion.span
        key={value.toFixed(1)}
        initial={{ scale: 1.15, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-14 text-xs font-mono font-semibold tabular-nums text-right ${color}`}
      >
        {value.toFixed(1)}%
      </motion.span>
    </div>
  )
}

export function DistillationVisualizer() {
  const { t } = useTranslation()
  const [temperature, setTemperature] = useState(3)
  const [studentTemp, setStudentTemp] = useState(3)
  const [showStudent, setShowStudent] = useState(true)

  const tokens = useMemo(() => [
    t.distillation.vizToken1,
    t.distillation.vizToken2,
    t.distillation.vizToken3,
    t.distillation.vizToken4,
    t.distillation.vizToken5,
  ], [t])

  const hardProbs = useMemo(() => softmax(TEACHER_LOGITS, 1), [])
  const softProbs = useMemo(() => softmax(TEACHER_LOGITS, temperature), [temperature])
  const studentProbs = useMemo(() => softmax(TEACHER_LOGITS, studentTemp), [studentTemp])

  const klDiv = useMemo(() => klDivergence(softProbs, studentProbs), [softProbs, studentProbs])
  const teacherEntropy = useMemo(() => entropy(softProbs), [softProbs])
  const studentEntropy = useMemo(() => entropy(studentProbs), [studentProbs])

  const maxProb = Math.max(...hardProbs, ...softProbs, ...studentProbs)

  const teacherGradients = [
    'from-purple-500 to-purple-400',
    'from-purple-500/80 to-purple-400/80',
    'from-purple-500/60 to-purple-400/60',
    'from-purple-500/40 to-purple-400/40',
    'from-purple-500/30 to-purple-400/30',
  ]

  const softGradients = [
    'from-cyan-500 to-cyan-400',
    'from-cyan-500/80 to-cyan-400/80',
    'from-cyan-500/60 to-cyan-400/60',
    'from-cyan-500/40 to-cyan-400/40',
    'from-cyan-500/30 to-cyan-400/30',
  ]

  const studentGradients = [
    'from-emerald-500 to-emerald-400',
    'from-emerald-500/80 to-emerald-400/80',
    'from-emerald-500/60 to-emerald-400/60',
    'from-emerald-500/40 to-emerald-400/40',
    'from-emerald-500/30 to-emerald-400/30',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
          <Thermometer size={18} className="text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-text font-heading">{t.distillation.vizTitle}</h3>
          <p className="text-xs text-muted">{t.distillation.vizSubtitle}</p>
        </div>
      </div>

      {/* Pipeline Flow */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 py-4">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <GraduationCap size={16} className="text-purple-400" />
          <span className="text-sm font-semibold text-purple-400">{t.distillation.vizTeacherLabel}</span>
        </div>
        <ArrowRight size={16} className="text-muted hidden md:block" />
        <div className="text-muted md:hidden">&#x2193;</div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <Thermometer size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-400">T={temperature}</span>
        </div>
        <ArrowRight size={16} className="text-muted hidden md:block" />
        <div className="text-muted md:hidden">&#x2193;</div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <BookOpen size={16} className="text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-400">{t.distillation.vizStudentLabel}</span>
        </div>
      </div>

      {/* Distribution Panels */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Hard Distribution (T=1) */}
        <div className="p-5 rounded-xl bg-background border border-purple-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <h4 className="text-sm font-semibold text-purple-400">{t.distillation.hardLabels}</h4>
            <span className="text-xs text-muted ml-auto">T=1</span>
          </div>
          <div className="space-y-2">
            {tokens.map((token, i) => (
              <AnimatedBar
                key={token}
                label={token}
                value={hardProbs[i]}
                maxValue={maxProb}
                color="text-purple-400"
                gradient={teacherGradients[i]}
                delay={i * 0.05}
              />
            ))}
          </div>
          <p className="text-xs text-muted mt-3 leading-relaxed">{t.distillation.hardLabelsDesc}</p>
        </div>

        {/* Soft Distribution (T=variable) */}
        <div className="p-5 rounded-xl bg-background border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <h4 className="text-sm font-semibold text-cyan-400">{t.distillation.softLabels}</h4>
            <span className="text-xs text-muted ml-auto">T={temperature}</span>
          </div>
          <div className="space-y-2">
            {tokens.map((token, i) => (
              <AnimatedBar
                key={token}
                label={token}
                value={softProbs[i]}
                maxValue={maxProb}
                color="text-cyan-400"
                gradient={softGradients[i]}
                delay={i * 0.05}
              />
            ))}
          </div>
          <p className="text-xs text-muted mt-3 leading-relaxed">{t.distillation.softLabelsDesc}</p>
        </div>

        {/* Student Distribution */}
        <div className={`p-5 rounded-xl bg-background border transition-colors ${showStudent ? 'border-emerald-500/30' : 'border-border'}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${showStudent ? 'bg-emerald-500' : 'bg-gray-500'}`} />
            <h4 className={`text-sm font-semibold transition-colors ${showStudent ? 'text-emerald-400' : 'text-muted'}`}>{t.distillation.vizStudentDist}</h4>
            <button
              onClick={() => setShowStudent(!showStudent)}
              className={`text-xs ml-auto px-2 py-0.5 rounded-md transition-colors ${showStudent ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface text-muted'}`}
            >
              {showStudent ? 'ON' : 'OFF'}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {showStudent ? (
              <motion.div
                key="student-bars"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {tokens.map((token, i) => (
                  <AnimatedBar
                    key={token}
                    label={token}
                    value={studentProbs[i]}
                    maxValue={maxProb}
                    color="text-emerald-400"
                    gradient={studentGradients[i]}
                    delay={i * 0.05}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="student-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-[188px] text-muted text-sm"
              >
                {t.distillation.vizStudentOff}
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-xs text-muted mt-3 leading-relaxed">{t.distillation.vizStudentDesc}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Teacher Temperature */}
        <div className="p-5 rounded-xl bg-surface border border-border">
          <label className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
            <Thermometer size={14} className="text-cyan-400" />
            {t.distillation.distillTemp}: <span className="text-cyan-400">T = {temperature}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>T=1 ({t.distillation.tempSharp})</span>
            <span>T=10 ({t.distillation.tempSmooth})</span>
          </div>
        </div>

        {/* Student Temperature */}
        <div className={`p-5 rounded-xl bg-surface border transition-colors ${showStudent ? 'border-emerald-500/20' : 'border-border'}`}>
          <label className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
            <BookOpen size={14} className="text-emerald-400" />
            {t.distillation.vizStudentTemp}: <span className="text-emerald-400">T = {studentTemp}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={studentTemp}
            onChange={(e) => setStudentTemp(parseFloat(e.target.value))}
            disabled={!showStudent}
            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-40"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>T=1 ({t.distillation.tempSharp})</span>
            <span>T=10 ({t.distillation.tempSmooth})</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {showStudent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="p-4 rounded-xl bg-surface border border-border text-center">
            <div className="text-xs text-muted mb-1">{t.distillation.vizKLDiv}</div>
            <motion.div
              key={klDiv.toFixed(3)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className={`text-xl font-bold font-mono tabular-nums ${klDiv < 0.01 ? 'text-emerald-400' : klDiv < 0.1 ? 'text-cyan-400' : 'text-orange-400'}`}
            >
              {klDiv.toFixed(3)}
            </motion.div>
            <div className="text-xs text-muted mt-1">
              {klDiv < 0.01 ? t.distillation.vizKLExcellent : klDiv < 0.1 ? t.distillation.vizKLGood : t.distillation.vizKLPoor}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border text-center">
            <div className="text-xs text-muted mb-1">{t.distillation.vizTeacherEntropy}</div>
            <div className="text-xl font-bold font-mono tabular-nums text-cyan-400">
              {teacherEntropy.toFixed(2)}
            </div>
            <div className="text-xs text-muted mt-1">bits</div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border text-center">
            <div className="text-xs text-muted mb-1">{t.distillation.vizStudentEntropy}</div>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-400">
              {studentEntropy.toFixed(2)}
            </div>
            <div className="text-xs text-muted mt-1">bits</div>
          </div>
        </motion.div>
      )}

      {/* Temperature Explanation */}
      <motion.div
        key={`${temperature}-${studentTemp}-${showStudent}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-5 rounded-xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-purple-500/20"
      >
        <p className="text-sm text-muted leading-relaxed">
          {temperature <= 2
            ? t.distillation.tempExplainLow
            : temperature <= 5
              ? t.distillation.tempExplainMid
              : t.distillation.tempExplainHigh}
        </p>
        {showStudent && (
          <p className="text-sm text-muted leading-relaxed mt-2">
            {Math.abs(temperature - studentTemp) <= 0.5
              ? t.distillation.vizMatchExplain
              : studentTemp < temperature
                ? t.distillation.vizStudentSharper
                : t.distillation.vizStudentSmoother}
          </p>
        )}
      </motion.div>
    </div>
  )
}
