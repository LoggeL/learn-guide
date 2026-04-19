'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Play, ChevronRight, ChevronDown, Lightbulb, AlertTriangle, FlaskConical, ArrowRight } from 'lucide-react'

type Phase = 'collect' | 'direction' | 'ablate' | 'heal'

const phases: { id: Phase; num: number; emoji: string }[] = [
  { id: 'collect', num: 1, emoji: '📊' },
  { id: 'direction', num: 2, emoji: '🧭' },
  { id: 'ablate', num: 3, emoji: '✂️' },
  { id: 'heal', num: 4, emoji: '💊' },
]

function AbliterationVisualizer() {
  const [phase, setPhase] = useState<Phase>('collect')
  const phaseIdx = phases.findIndex(p => p.id === phase)

  const phaseContent: Record<Phase, { title: string; lines: string[]; color: string }> = {
    collect: {
      title: 'Step 1: Collect Activations',
      color: 'text-cyan-400',
      lines: [
        '# Run model on harmful + harmless instructions',
        'harmful_activations = model.run_with_cache(harmful_prompts)',
        'harmless_activations = model.run_with_cache(harmless_prompts)',
        '',
        '# Shape: [num_samples, num_layers, hidden_dim]',
        '>>> harmful_act.shape  # (128, 32, 4096)',
        '>>> harmless_act.shape  # (128, 32, 4096)',
      ],
    },
    direction: {
      title: 'Step 2: Find Refusal Direction',
      color: 'text-yellow-400',
      lines: [
        '# Mean difference = refusal direction per layer',
        'refusal_dir = mean(harmful_act) - mean(harmless_act)',
        'refusal_dir = normalize(refusal_dir)',
        '',
        '# Score each layer\'s direction by how well it separates',
        'scores = [cosine_sim(harmful, dir) - cosine_sim(harmless, dir)]',
        'best_layer = argmax(scores)  # e.g. layer 14',
        '>>> refusal_direction.shape  # (4096,)',
      ],
    },
    ablate: {
      title: 'Step 3: Ablate the Direction',
      color: 'text-red-400',
      lines: [
        '# Weight orthogonalization — permanent removal',
        '# For every weight matrix W that writes to residual stream:',
        'W_new = W - W @ r^T @ r  # where r is the refusal direction',
        '',
        '# This ensures the model CANNOT represent the refusal direction',
        '# Applied to all attention heads and MLP outputs',
        'model.save("model-abliterated")',
      ],
    },
    heal: {
      title: 'Step 4: Heal with DPO (Optional)',
      color: 'text-emerald-400',
      lines: [
        '# Abliteration may degrade quality — heal it!',
        '# Use Direct Preference Optimization to recover performance',
        '',
        'from trl import DPOTrainer',
        'trainer = DPOTrainer(',
        '  model=abliterated_model,',
        '  train_dataset=preference_data,',
        '  # chosen=good responses, rejected=bad responses',
        ')',
        'trainer.train()  # Recovers quality while staying uncensored',
      ],
    },
  }

  const current = phaseContent[phase]

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      <div className="px-6 py-4 bg-surface-elevated border-b border-border">
        <h3 className="font-semibold text-text font-heading">Abliteration Pipeline</h3>
        <p className="text-xs text-muted mt-1">Click through each phase to see the code</p>
      </div>

      {/* Phase tabs */}
      <div className="flex border-b border-border">
        {phases.map((p) => (
          <button
            key={p.id}
            onClick={() => setPhase(p.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${phase === p.id
              ? 'bg-primary/10 text-primary-light border-b-2 border-primary'
              : 'text-muted hover:text-text'
              }`}
          >
            <span>{p.emoji}</span>
            <span className="hidden sm:inline">{p.num}.</span>
          </button>
        ))}
      </div>

      {/* Code display */}
      <div className="p-6">
        <h4 className={`text-sm font-bold mb-3 ${current.color}`}>{current.title}</h4>
        <div className="bg-background rounded-xl p-4 font-mono text-xs md:text-sm overflow-x-auto">
          {current.lines.map((line, i) => (
            <motion.div
              key={`${phase}-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`${line.startsWith('#') ? 'text-muted' : line.startsWith('>>>') ? 'text-primary-light' : 'text-text'
                }`}
            >
              {line || '\u00A0'}
            </motion.div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {phases.map((p, i) => (
            <button key={p.id} onClick={() => setPhase(p.id)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${phase === p.id ? 'bg-primary scale-125' : i < phaseIdx ? 'bg-primary/40' : 'bg-border'
                }`}
            />
          ))}
        </div>

        {/* Next button */}
        {phase !== 'heal' && (
          <div className="flex justify-end mt-3">
            <button
              onClick={() => setPhase(phases[phaseIdx + 1].id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/20 text-primary-light border border-primary/30 hover:bg-primary/30 text-sm transition-all"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function NeuralDiagram() {
  const [showRefusal, setShowRefusal] = useState(false)
  const [ablated, setAblated] = useState(false)

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      <div className="px-6 py-4 bg-surface-elevated border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text font-heading">Refusal Direction in the Residual Stream</h3>
          <p className="text-xs text-muted mt-1">Toggle to see how abliteration removes the refusal direction</p>
        </div>
        <button
          onClick={() => { setShowRefusal(!showRefusal); if (!showRefusal) setAblated(false) }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${showRefusal
            ? 'bg-red-500/20 border-red-500/30 text-red-400'
            : 'bg-surface-elevated border-border text-muted'
            }`}
        >
          {showRefusal ? 'Show Refusal Direction' : 'Show Refusal Direction'}
        </button>
      </div>

      <div className="p-6 flex flex-col items-center gap-4">
        {/* Simplified residual stream visualization */}
        <div className="w-full max-w-lg flex items-center gap-2">
          {['Layer 0', 'Layer 8', 'Layer 16', 'Layer 24', 'Layer 31'].map((name, i) => (
            <div key={name} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-12 rounded-lg border-2 flex items-center justify-center text-xs font-mono transition-all ${showRefusal && i === 2 && !ablated
                ? 'border-red-500 bg-red-500/20 text-red-400'
                : showRefusal && i === 2 && ablated
                  ? 'border-border bg-surface-elevated text-muted line-through'
                  : 'border-border bg-surface-elevated text-muted'
                }`}>
                {name}
              </div>
              {showRefusal && i === 2 && !ablated && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-400 font-mono">
                  ← refusal dir
                </motion.span>
              )}
            </div>
          ))}
        </div>

        {showRefusal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
            <button
              onClick={() => setAblated(!ablated)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${ablated
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}
            >
              {ablated ? '✂️ Direction Ablated!' : '✂️ Ablate Refusal Direction'}
            </button>
            <p className="text-xs text-muted text-center max-w-sm">
              {ablated
                ? 'The model can no longer represent the refusal direction — it won\'t refuse any request.'
                : 'Layer 16 has the strongest refusal direction. This single vector controls whether the model says "I cannot help with that."'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function AbliterationPage() {
  const { t } = useTranslation()

  const resources = [
    {
      title: 'Unsloth Fine-Tuning Notebooks',
      desc: '250+ free Colab notebooks for fine-tuning text, vision, and audio models. The easiest way to start.',
      url: 'https://github.com/unslothai/notebooks',
      emoji: '📓',
    },
    {
      title: 'Unsloth Fine-Tuning Guide',
      desc: 'Step-by-step guide covering SFT, LoRA, QLoRA, RL (GRPO) — with code examples.',
      url: 'https://unsloth.ai/docs/get-started/fine-tuning-llms-guide',
      emoji: '📚',
    },
    {
      title: 'Abliteration Colab Notebook',
      desc: 'mlabonne\'s interactive notebook — uncensor any LLM with weight orthogonalization.',
      url: 'https://colab.research.google.com/drive/1VYm3hOcvCpbGiqKZb141gJwjdmmCcVpR',
      emoji: '🔬',
    },
    {
      title: 'TransformerLens Library',
      desc: 'Mechanistic interpretability toolkit used to hook into and modify model internals.',
      url: 'https://github.com/TransformerLensOrg/TransformerLens',
      emoji: '🔍',
    },
    {
      title: 'FailSpy\'s Abliterator Library',
      desc: 'Simplified abliteration tool — less code, same result.',
      url: 'https://github.com/FailSpy/abliterator',
      emoji: '🛠️',
    },
  ]

  return (
    <TopicLayout
      topicId="abliteration"
      title={t.abliteration.title}
      description={t.abliteration.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.abliteration.title },
      ]}
      prevTopic={{ label: t.topicNames['lora'], href: '/ai/llm/lora' }}
      nextTopic={{ label: t.topicNames['speculative-decoding'], href: '/ai/llm/speculative-decoding' }}
    >
      {/* What is Abliteration */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.abliteration.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">
          {t.abliteration.whatIsDesc}
        </p>
        <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-400 shrink-0 mt-1" />
            <div>
              <p className="text-sm text-text font-semibold mb-1">{t.abliteration.ethicalNote}</p>
              <p className="text-sm text-muted">{t.abliteration.ethicalNoteDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — The Key Insight */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb size={20} className="text-yellow-400" />
          <h2 className="text-2xl font-bold font-heading text-gradient">{t.abliteration.keyInsight}</h2>
        </div>
        <p className="text-muted leading-relaxed mb-4">
          {t.abliteration.keyInsightDesc}
        </p>
        <p className="text-muted leading-relaxed">
          {t.abliteration.keyInsightDesc2}
        </p>
      </section>

      {/* Neural Diagram Interactive */}
      <NeuralDiagram />

      {/* The Pipeline — Interactive */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.abliteration.pipeline}</h2>
        <AbliterationVisualizer />
      </section>

      {/* Healing with DPO */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical size={20} className="text-emerald-400" />
          <h2 className="text-2xl font-bold font-heading text-gradient">{t.abliteration.healingTitle}</h2>
        </div>
        <p className="text-muted leading-relaxed mb-4">
          {t.abliteration.healingDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <h3 className="text-red-400 font-bold text-sm mb-2">❌ {t.abliteration.beforeHeal}</h3>
            <p className="text-sm text-muted">{t.abliteration.beforeHealDesc}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-emerald-400 font-bold text-sm mb-2">✅ {t.abliteration.afterHeal}</h3>
            <p className="text-sm text-muted">{t.abliteration.afterHealDesc}</p>
          </div>
        </div>
      </section>

      {/* Hands-On Resources */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.abliteration.resources}</h2>
        <div className="space-y-3">
          {resources.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl bg-surface border border-border hover:border-primary/40 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{r.emoji}</span>
                    <span className="font-semibold text-text text-sm group-hover:text-primary-light transition-colors">{r.title}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{r.desc}</p>
                </div>
                <ExternalLink size={14} className="text-muted shrink-0 mt-1 group-hover:text-primary-light transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.abliteration.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.abliteration.takeaway1,
              t.abliteration.takeaway2,
              t.abliteration.takeaway3,
              t.abliteration.takeaway4,
              t.abliteration.takeaway5,
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary-light text-sm font-bold">{i + 1}</span>
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </TopicLayout>
  )
}
