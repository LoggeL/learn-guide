'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n/context'

const stages = {
  en: [
    ['Collect data', 'Record provenance, version, licences and intended use. Public accessibility alone is not permission for every use.', 'Output: an auditable source inventory.'],
    ['Clean and split', 'Remove exact and near duplicates, assess quality, handle personal data and prevent evaluation contamination.', 'Output: documented training and evaluation splits.'],
    ['Tokenize', 'Choose or train an encoding, tokenize text and pack sequences. BPE and Unigram are algorithms; SentencePiece is a toolkit that supports them.', 'Output: token sequences and a fixed tokenizer version.'],
    ['Pretrain', 'Optimize next-token loss, or a specified variant, on the training mixture. Save checkpoints and evaluate held-out performance.', 'Cost drivers: model architecture, training tokens, sequence length, hardware and utilization.'],
    ['Supervised fine-tuning', 'Train on curated instruction-response pairs. Human-written and synthetic examples both need quality checks.', 'Output: a model adapted to a defined interaction format and task distribution.'],
    ['Preference or reward optimization', 'DPO uses preference pairs directly. PPO and GRPO optimize rewards; GRPO removes a separate value model, not the need for a reward signal.', 'Cost drivers: rollout length and count, reward generation, policy updates and any auxiliary models.'],
    ['Evaluate and revise', 'Test capabilities, regressions and failure modes throughout the process. Keep evaluation data distinct from training.', 'Output: measured results with task definitions, baselines and uncertainty.'],
    ['Prepare deployment', 'Choose serving precision, batching and caching. Measure latency, throughput and quality on the intended workload.', 'Output: a deployable configuration with an evaluation report.'],
  ],
  de: [
    ['Daten sammeln', 'Herkunft, Version, Lizenzen und beabsichtigte Nutzung dokumentieren. Öffentliche Erreichbarkeit erlaubt nicht automatisch jede Nutzung.', 'Ergebnis: ein prüfbares Quelleninventar.'],
    ['Bereinigen und aufteilen', 'Exakte und ähnliche Duplikate entfernen, Qualität prüfen, personenbezogene Daten behandeln und Evaluation von Training trennen.', 'Ergebnis: dokumentierte Trainings- und Evaluationsaufteilungen.'],
    ['Tokenisieren', 'Ein Encoding wählen oder trainieren, Text tokenisieren und Sequenzen packen. BPE und Unigram sind Algorithmen; SentencePiece ist ein Toolkit, das sie unterstützt.', 'Ergebnis: Token-Sequenzen und eine feste Tokenizer-Version.'],
    ['Vortrainieren', 'Next-Token-Loss oder eine benannte Variante auf der Datenmischung optimieren. Checkpoints speichern und auf zurückgehaltenen Daten evaluieren.', 'Kostentreiber: Architektur, Trainings-Tokens, Sequenzlänge, Hardware und Auslastung.'],
    ['Supervised Fine-Tuning', 'Mit kuratierten Instruktions-Antwort-Paaren trainieren. Menschliche und synthetische Beispiele benötigen Qualitätskontrollen.', 'Ergebnis: Anpassung an ein definiertes Interaktionsformat und eine Aufgabenverteilung.'],
    ['Präferenzen oder Rewards optimieren', 'DPO nutzt Präferenzpaare direkt. PPO und GRPO optimieren Rewards; GRPO spart ein separates Value-Modell, nicht das Reward-Signal.', 'Kostentreiber: Länge und Zahl der Rollouts, Reward-Erzeugung, Policy-Updates und zusätzliche Modelle.'],
    ['Evaluieren und überarbeiten', 'Fähigkeiten, Regressionen und Fehlermuster während des gesamten Prozesses prüfen. Evaluationsdaten getrennt halten.', 'Ergebnis: Messwerte mit Aufgabendefinitionen, Vergleichsbasis und Unsicherheit.'],
    ['Deployment vorbereiten', 'Präzision, Batching und Caching wählen. Latenz, Durchsatz und Qualität auf der vorgesehenen Arbeitslast messen.', 'Ergebnis: eine ausführbare Konfiguration mit Evaluationsbericht.'],
  ],
}
export function TrainingPipelineVisualizer() {
  const { locale } = useLocale()
  const de = locale === 'de'
  const items = stages[de ? 'de' : 'en']
  const [selected, setSelected] = useState(0)
  return <div className="space-y-5">
    <h3 className="text-xl font-semibold">{de ? 'Eine mögliche Trainingspipeline' : 'One possible training pipeline'}</h3>
    <p className="text-sm text-muted">{de ? 'Stufe auswählen. Nicht jede Entwicklung nutzt alle Schritte oder dieselbe Reihenfolge. Kosten und Dauer lassen sich ohne konkretes Modell, Datenbudget und Hardware nicht seriös als pauschale Zahl angeben.' : 'Select a stage. Projects do not all use every stage or the same order. Cost and duration require a concrete model, data budget and hardware configuration.'}</p>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{items.map(([name], i) => <button key={name} type="button" aria-pressed={selected === i} className={`rounded-xl border p-4 text-left text-sm ${selected === i ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-border bg-surface'}`} onClick={() => setSelected(i)}><span className="mb-2 block font-mono text-muted">{i + 1}</span>{name}</button>)}</div>
    <div className="space-y-3 rounded-xl border border-border bg-surface p-5"><h4 className="font-semibold">{items[selected][0]}</h4><p className="text-sm leading-relaxed text-muted">{items[selected][1]}</p><p className="text-sm text-cyan-300">{items[selected][2]}</p></div>
  </div>
}
