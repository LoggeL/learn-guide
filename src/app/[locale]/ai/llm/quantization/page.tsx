'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { QuantizationVisualizer } from '@/components/interactive/QuantizationVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Quantization', description: 'Represent weights with fewer bits, inspect the resulting error, and separate storage savings from model quality.',
    what: 'Precision changes representation', body: 'Quantization maps continuous or high-precision values to a finite set of representable values. It can reduce weight storage and memory traffic. Speed depends on kernels, hardware, batch size and whether weights or activations are quantized. Fewer bits do not imply a fixed speedup or quality loss.',
    techniques: 'Different methods, different assumptions', methods: [
      ['Post-training quantization (PTQ)', 'Convert a trained model. Some methods use calibration data to choose scales or reduce output error. Results depend on the method and calibration distribution.'],
      ['Quantization-aware training (QAT)', 'Expose the model to quantization effects during training or fine-tuning. Full training from scratch is not required by the definition; gradient handling and the quantizer depend on the recipe.'],
      ['QLoRA', 'Keep the base model quantized and frozen while training low-rank adapters. This is a fine-tuning method, not a guarantee that every quantized inference model keeps its original quality.'],
      ['GGUF formats', 'GGUF is a storage format. Names such as Q4_K_M refer to particular quantization recipes; nominal bit width is not an exact total-memory calculation. Inspect the actual artifact and runtime.'],
    ],
    memory: 'What fits in memory?', memoryBody: 'A 70B model requires 140 GB for raw 16-bit weights or 35 GB for raw 4-bit weights, before scales and runtime overhead. Thus 70B at 4 bits does not fit entirely in 24 GB of GPU memory. CPU offloading or a different compression scheme may make execution possible, with different latency and quality tradeoffs.',
    evaluate: 'Measure quality for the intended task', evaluateBody: 'Compare a specified base checkpoint and quantized artifact using the same prompts, decoding settings and evaluation data. Report task scores, failure cases and latency. A small change in weight error or perplexity cannot certify unchanged coding, reasoning or factual performance. There is no universal percentage of retained accuracy for INT4.',
    links: 'Sources and next steps', qat: 'Quantization-aware fine-tuning research', qlora: 'QLoRA paper', offload: 'llama.cpp: CPU/GPU placement options', next: 'Continue to LoRA and adapter training →',
  },
  de: {
    title: 'Quantisierung', description: 'Gewichte mit weniger Bits darstellen, den entstehenden Fehler prüfen und Speicherersparnis von Modellqualität unterscheiden.',
    what: 'Präzision verändert die Darstellung', body: 'Quantisierung bildet kontinuierliche oder hochpräzise Werte auf eine endliche Menge darstellbarer Werte ab. Das kann Gewichtsspeicher und Speicherverkehr reduzieren. Die Geschwindigkeit hängt von Kernels, Hardware, Batchgröße sowie Gewichts- und Aktivierungspräzision ab. Weniger Bits bedeuten keinen festen Geschwindigkeitsgewinn oder Qualitätsverlust.',
    techniques: 'Verschiedene Verfahren, verschiedene Annahmen', methods: [
      ['Post-Training Quantization (PTQ)', 'Ein trainiertes Modell umwandeln. Manche Verfahren nutzen Kalibrierungsdaten, um Skalen zu bestimmen oder Ausgabefehler zu verringern. Ergebnisse hängen von Methode und Kalibrierungsverteilung ab.'],
      ['Quantization-Aware Training (QAT)', 'Das Modell während Training oder Fine-Tuning mit Quantisierungseffekten konfrontieren. Die Definition verlangt kein vollständiges Training von Grund auf; Gradientenbehandlung und Quantisierer hängen vom Verfahren ab.'],
      ['QLoRA', 'Die Basis bleibt quantisiert und eingefroren, während kleine Adapter trainiert werden. Das ist eine Fine-Tuning-Methode, keine Garantie für unveränderte Qualität jedes quantisierten Inferenzmodells.'],
      ['GGUF-Formate', 'GGUF ist ein Speicherformat. Namen wie Q4_K_M bezeichnen konkrete Quantisierungsrezepte; die nominelle Bitbreite ist keine exakte Gesamtspeicherrechnung. Das konkrete Artefakt und die Laufzeit prüfen.'],
    ],
    memory: 'Was passt in den Speicher?', memoryBody: 'Ein 70B-Modell benötigt 140 GB für rohe 16-Bit-Gewichte oder 35 GB für rohe 4-Bit-Gewichte, noch ohne Skalen und Laufzeitbedarf. 70B mit 4 Bit passt daher nicht vollständig in 24 GB GPU-Speicher. CPU-Offloading oder ein anderes Kompressionsverfahren kann die Ausführung ermöglichen, mit anderen Latenz- und Qualitätsabwägungen.',
    evaluate: 'Qualität für die vorgesehene Aufgabe messen', evaluateBody: 'Einen benannten Basis-Checkpoint und ein quantisiertes Artefakt mit gleichen Prompts, Decoding-Einstellungen und Evaluationsdaten vergleichen. Aufgabenwerte, Fehlerfälle und Latenz berichten. Ein kleiner Unterschied bei Gewichtsfehler oder Perplexität belegt keine unveränderte Code-, Reasoning- oder Faktenleistung. Für INT4 gibt es keinen universellen Anteil erhaltener Genauigkeit.',
    links: 'Quellen und Vertiefung', qat: 'Forschung zu quantisierungsbewusstem Fine-Tuning', qlora: 'QLoRA-Paper', offload: 'llama.cpp: CPU-/GPU-Verteilung', next: 'Weiter zu LoRA und Adaptertraining →',
  },
}
export default function QuantizationPage() {
  const { t, locale } = useTranslation()
  const c = copy[locale === 'de' ? 'de' : 'en']
  return <TopicLayout topicId="quantization" title={c.title} description={c.description} breadcrumbs={[{ label: t.categories.ai, href: '/' }, { label: t.categories.llm, href: '/ai/llm' }, { label: c.title }]}>
    <section><h2 className="mb-3 text-xl font-semibold">{c.what}</h2><p className="leading-relaxed text-muted">{c.body}</p></section>
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6"><QuantizationVisualizer /></section>
    <section><h2 className="mb-4 text-xl font-semibold">{c.techniques}</h2><div className="grid gap-4 md:grid-cols-2">{c.methods.map(([name, body]) => <article key={name} className="rounded-xl border border-border bg-surface p-5"><h3 className="mb-2 font-semibold">{name}</h3><p className="text-sm leading-relaxed text-muted">{body}</p></article>)}</div></section>
    {[[c.memory, c.memoryBody], [c.evaluate, c.evaluateBody]].map(([title, body]) => <section key={title}><h2 className="mb-3 text-xl font-semibold">{title}</h2><p className="leading-relaxed text-muted">{body}</p></section>)}
    <section><h2 className="mb-3 text-xl font-semibold">{c.links}</h2><ul className="space-y-2 text-cyan-300">{[[c.qlora, 'https://arxiv.org/abs/2305.14314'], [c.qat, 'https://aclanthology.org/2025.acl-long.99/'], [c.offload, 'https://github.com/ggml-org/llama.cpp/blob/master/tools/cli/README.md']].map(([label, url]) => <li key={url}><a href={url} className="underline">{label}</a></li>)}</ul><Link href={`/${locale}/ai/llm/lora`} className="mt-4 inline-block text-cyan-300">{c.next}</Link></section>
  </TopicLayout>
}
