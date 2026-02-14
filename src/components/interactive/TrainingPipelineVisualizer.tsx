'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database, 
  Sparkles, 
  Filter, 
  Grid3x3, 
  Cpu, 
  Users, 
  Target, 
  Shield, 
  Gauge, 
  Box,
  ArrowRight,
  DollarSign,
  HardDrive,
  Zap
} from 'lucide-react'

const PIPELINE_STAGES = [
  {
    id: 'data-collection',
    title: 'Data Collection',
    icon: Database,
    color: 'slate',
    description: 'Gather massive text corpora from diverse sources',
    data: 'Common Crawl, The Pile, Books, Code, Wikipedia',
    volume: '1-15 trillion tokens',
    compute: 'Minimal (storage & network)',
    cost: '$50K-500K',
    duration: '1-3 months',
    details: 'Scrape web data, curate datasets from multiple sources including Common Crawl snapshots (petabytes), code repositories, books, scientific papers.',
  },
  {
    id: 'data-cleaning',
    title: 'Data Cleaning & Deduplication',
    icon: Filter,
    color: 'blue',
    description: 'Remove duplicates, filter quality, normalize formatting',
    data: 'Filtered & deduplicated text',
    volume: '30-70% of original',
    compute: 'CPU clusters (thousands of cores)',
    cost: '$100K-1M',
    duration: '2-6 weeks',
    details: 'Exact and fuzzy deduplication (MinHash LSH), quality filtering (perplexity scoring), language detection, PII removal, toxicity filtering.',
  },
  {
    id: 'tokenization',
    title: 'Tokenization',
    icon: Grid3x3,
    color: 'cyan',
    description: 'Convert text into numerical tokens using BPE/SentencePiece',
    data: 'Token sequences (vocab ~100K)',
    volume: 'Same token count',
    compute: 'CPU (fast, parallel)',
    cost: '$10K-100K',
    duration: '1-2 weeks',
    details: 'Train tokenizer on cleaned data (BPE, Unigram), tokenize entire dataset, pack sequences to context length (e.g., 4K, 8K, 128K tokens).',
  },
  {
    id: 'pretraining',
    title: 'Pre-training',
    icon: Cpu,
    color: 'purple',
    description: 'Train base model with next-token prediction objective',
    data: '1-15T tokens, auto-regressive',
    volume: 'Full dataset, multi-epoch possible',
    compute: '10K-30K GPUs, weeks-months',
    cost: '$2M-$200M (70B model: ~$20M)',
    duration: '1-6 months',
    details: 'Transformer training on GPU clusters (A100/H100), gradient accumulation, ZeRO optimizer, checkpoint every N steps. Llama 3: 15T tokens, ~$20M. GPT-4: rumored $100M+.',
  },
  {
    id: 'sft',
    title: 'Supervised Fine-Tuning',
    icon: Users,
    color: 'emerald',
    description: 'Teach instruction-following with curated examples',
    data: '10K-100K instruction-response pairs',
    volume: '~10M-1B tokens',
    compute: '100-1000 GPUs, days-weeks',
    cost: '$50K-2M',
    duration: '1-4 weeks',
    details: 'Fine-tune on high-quality (prompt, completion) pairs. Human-written or synthetic. Smaller LR, fewer steps than pretraining.',
  },
  {
    id: 'rlhf',
    title: 'RLHF / Preference Tuning',
    icon: Target,
    color: 'orange',
    description: 'Align outputs with human preferences using RL or DPO',
    data: '10K-100K preference comparisons',
    volume: '~10M-500M tokens',
    compute: '500-5000 GPUs (PPO) or 100-1000 (DPO)',
    cost: '$200K-10M',
    duration: '2-8 weeks',
    details: 'PPO: Train reward model, then RL policy optimization. DPO: Direct preference optimization (simpler). Multiple iterations.',
  },
  {
    id: 'safety',
    title: 'Safety & Evaluation',
    icon: Shield,
    color: 'red',
    description: 'Red-teaming, Constitutional AI, adversarial testing',
    data: 'Adversarial prompts, test suites',
    volume: 'Ongoing',
    compute: '50-500 GPUs',
    cost: '$100K-5M',
    duration: 'Ongoing',
    details: 'Red-team adversarial attacks, train safety classifiers, constitutional AI self-critique, benchmark evaluation (MMLU, HumanEval, etc.).',
  },
  {
    id: 'deployment',
    title: 'Deployment Optimization',
    icon: Gauge,
    color: 'teal',
    description: 'Quantization, distillation, inference optimization',
    data: 'Optimized model variants',
    volume: 'FP16 → INT8/INT4',
    compute: '10-100 GPUs',
    cost: '$50K-1M',
    duration: '1-4 weeks',
    details: 'Quantization (GPTQ, AWQ), distillation to smaller models, KV cache optimization, serving infrastructure setup.',
  },
]

type StageId = typeof PIPELINE_STAGES[number]['id']

export function TrainingPipelineVisualizer() {
  const [selectedStage, setSelectedStage] = useState<StageId | null>(null)
  const [animateFlow, setAnimateFlow] = useState(false)

  const handleAnimate = () => {
    setAnimateFlow(true)
    setTimeout(() => setAnimateFlow(false), PIPELINE_STAGES.length * 800 + 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-heading text-gradient mb-1">
            Modern LLM Training Pipeline
          </h3>
          <p className="text-sm text-muted">
            Click any stage to see details · Total pipeline: 3-12 months, $5M-$300M+
          </p>
        </div>
        <button
          onClick={handleAnimate}
          disabled={animateFlow}
          className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <Zap size={14} className="inline mr-1.5" />
          Animate Flow
        </button>
      </div>

      {/* Pipeline Visualization */}
      <div className="relative">
        {/* Connecting lines */}
        <div className="absolute top-10 left-0 right-0 h-0.5 bg-border -z-10" />

        {/* Stages */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PIPELINE_STAGES.map((stage, index) => {
            const Icon = stage.icon
            const isSelected = selectedStage === stage.id
            const colorClasses = {
              slate: 'from-slate-500/20 to-gray-500/20 border-slate-500/30 text-slate-400',
              blue: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
              cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
              purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
              emerald: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
              orange: 'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400',
              red: 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400',
              teal: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30 text-teal-400',
            }

            return (
              <motion.div
                key={stage.id}
                className="relative"
                initial={false}
                animate={animateFlow ? {
                  scale: [1, 1.05, 1],
                  transition: { delay: index * 0.3, duration: 0.5 }
                } : {}}
              >
                <button
                  onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                  className={`
                    relative w-full p-4 rounded-xl transition-all text-left
                    bg-gradient-to-br border
                    ${colorClasses[stage.color as keyof typeof colorClasses]}
                    ${isSelected ? 'ring-2 ring-primary scale-105' : 'hover:scale-102'}
                  `}
                >
                  {/* Stage number badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                    <span className="text-xs font-bold text-muted">{index + 1}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-3">
                    <Icon size={20} />
                  </div>

                  {/* Title */}
                  <h4 className="font-semibold text-text text-sm font-heading mb-1">
                    {stage.title}
                  </h4>

                  {/* Brief description */}
                  <p className="text-xs text-muted leading-snug line-clamp-2">
                    {stage.description}
                  </p>

                  {/* Arrow indicator for next stage */}
                  {index < PIPELINE_STAGES.length - 1 && (
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2 hidden md:block">
                      <motion.div
                        animate={animateFlow ? {
                          x: [0, 4, 0],
                          opacity: [0.3, 1, 0.3],
                          transition: { delay: index * 0.3 + 0.2, duration: 0.6 }
                        } : {}}
                      >
                        <ArrowRight size={16} className="text-border" />
                      </motion.div>
                    </div>
                  )}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Stage Details Panel */}
      <AnimatePresence mode="wait">
        {selectedStage && (() => {
          const stage = PIPELINE_STAGES.find(s => s.id === selectedStage)!
          const Icon = stage.icon

          return (
            <motion.div
              key={selectedStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-surface border border-border p-6 md:p-8"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br border flex items-center justify-center shrink-0 ${stage.color === 'slate' ? 'from-slate-500/20 to-gray-500/20 border-slate-500/30' :
                  stage.color === 'blue' ? 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' :
                  stage.color === 'cyan' ? 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30' :
                  stage.color === 'purple' ? 'from-purple-500/20 to-pink-500/20 border-purple-500/30' :
                  stage.color === 'emerald' ? 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30' :
                  stage.color === 'orange' ? 'from-orange-500/20 to-amber-500/20 border-orange-500/30' :
                  stage.color === 'red' ? 'from-red-500/20 to-rose-500/20 border-red-500/30' :
                  'from-teal-500/20 to-cyan-500/20 border-teal-500/30'}`}>
                  <Icon size={24} className={
                    stage.color === 'slate' ? 'text-slate-400' :
                    stage.color === 'blue' ? 'text-blue-400' :
                    stage.color === 'cyan' ? 'text-cyan-400' :
                    stage.color === 'purple' ? 'text-purple-400' :
                    stage.color === 'emerald' ? 'text-emerald-400' :
                    stage.color === 'orange' ? 'text-orange-400' :
                    stage.color === 'red' ? 'text-red-400' :
                    'text-teal-400'
                  } />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold font-heading text-gradient mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {stage.details}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Database size={16} className="text-primary" />
                    <h4 className="font-semibold text-sm text-text">Data</h4>
                  </div>
                  <p className="text-sm text-muted mb-1">{stage.data}</p>
                  <p className="text-xs text-muted/70">Volume: {stage.volume}</p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={16} className="text-cyan-400" />
                    <h4 className="font-semibold text-sm text-text">Compute</h4>
                  </div>
                  <p className="text-sm text-muted">{stage.compute}</p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} className="text-emerald-400" />
                    <h4 className="font-semibold text-sm text-text">Estimated Cost</h4>
                  </div>
                  <p className="text-sm text-muted">{stage.cost}</p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge size={16} className="text-orange-400" />
                    <h4 className="font-semibold text-sm text-text">Duration</h4>
                  </div>
                  <p className="text-sm text-muted">{stage.duration}</p>
                </div>
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* Summary Stats */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-6">
        <h4 className="font-semibold text-text mb-4 font-heading">Real-World Examples</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
            <div>
              <span className="font-semibold text-purple-300">Llama 3 (70B):</span>
              <span className="text-muted ml-1">15 trillion tokens, 24K GPUs (max 16K concurrent), ~$20M pre-training cost</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
            <div>
              <span className="font-semibold text-cyan-300">GPT-4:</span>
              <span className="text-muted ml-1">Rumored $100M+ total training cost (pre-training + alignment + infrastructure)</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <div>
              <span className="font-semibold text-emerald-300">Open-source models:</span>
              <span className="text-muted ml-1">Often skip expensive RLHF, use DPO or synthetic data for alignment (10-100x cheaper)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
