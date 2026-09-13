'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { MoEVisualizer } from '@/components/interactive/MoEVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const copy = {
  en: {
    title: 'Mixture of Experts', description: 'Learned routing among multiple feed-forward networks: what is active per token, what must be stored, and where the costs move.',
    intro: 'A sparse MoE layer replaces one dense feed-forward block with several expert blocks and a router. The router consumes the current token representation at that layer and selects a subset of experts. Their weighted outputs return an update to the residual stream. Routing can change at the next layer or position; it does not choose a whole model for the entire prompt.',
    routing: 'Routing and specialization', routingBody: 'Top-k selection keeps only a few experts active for each token. A router can be trained with auxiliary balancing losses or other strategies, such as bias-based balancing in DeepSeek-V3. Experts may develop patterns of specialization, but they are not reliably labelled code, facts or grammar modules. Inspect measured routing before making such claims.',
    memory: 'Available weights are not the same as GPU-resident weights', memoryBody: 'All experts must be available somewhere. They do not all have to reside in GPU memory: implementations can keep some expert weights on the CPU or move data between devices. Full GPU residency can avoid transfers, while offloading trades memory placement against bandwidth and latency. Active parameters alone therefore do not determine either total memory or end-to-end speed.',
    compute: 'Top-k does not make every cost constant', computeBody: 'With fixed expert size and k, the selected expert arithmetic can stay similar as the number of experts grows. Router work, weight storage, device communication and load imbalance can still grow. Batch size and token distribution matter because different tokens can activate different experts.',
    example: 'A concrete reference: Mixtral 8x7B', exampleBody: 'The Mixtral paper (2024) describes eight feed-forward experts per layer, with two selected per token. It reports 46.7B total parameters and 12.9B active parameters per token. These are properties of that architecture, not a general formula for every model with eight experts.',
    sources: 'Primary sources', ffn: 'Review the dense feed-forward calculation →',
  },
  de: {
    title: 'Mixture of Experts', description: 'Gelerntes Routing zwischen mehreren Feed-Forward-Netzen: Welche Parameter aktiv sind, welche gespeichert werden müssen und wo Aufwand entsteht.',
    intro: 'Ein sparsamer MoE-Layer ersetzt einen dichten Feed-Forward-Block durch mehrere Expertenblöcke und einen Router. Der Router verarbeitet die aktuelle Token-Repräsentation dieses Layers und wählt eine Teilmenge aus. Ihre gewichteten Ausgaben liefern ein Update für den Residual Stream. Routing kann sich am nächsten Layer oder an der nächsten Position ändern; es wählt kein vollständiges Modell für den gesamten Prompt.',
    routing: 'Routing und Spezialisierung', routingBody: 'Top-k aktiviert pro Token nur wenige Experten. Ein Router kann mit zusätzlichen Balancing-Losses oder anderen Strategien trainiert werden, etwa dem biasbasierten Balancing von DeepSeek-V3. Experten können Spezialisierungsmuster entwickeln, sind aber keine zuverlässig beschrifteten Code-, Fakten- oder Grammatikmodule. Solche Zuordnungen brauchen gemessenes Routing.',
    memory: 'Verfügbare Gewichte sind nicht gleich GPU-residente Gewichte', memoryBody: 'Alle Experten müssen irgendwo verfügbar sein. Sie müssen nicht vollständig im GPU-Speicher liegen: Implementierungen können Gewichte auf der CPU halten oder Daten zwischen Geräten bewegen. Vollständige GPU-Residenz kann Transfers vermeiden. Offloading tauscht Speicherplatzierung gegen Bandbreite und Latenz. Aktive Parameter allein bestimmen daher weder Gesamtspeicher noch End-to-End-Geschwindigkeit.',
    compute: 'Top-k hält nicht jeden Aufwand konstant', computeBody: 'Bei gleicher Expertengröße und gleichem k kann die ausgewählte Expertenrechnung ähnlich bleiben, wenn die Expertenzahl wächst. Routerarbeit, Gewichtsspeicher, Gerätekommunikation und ungleiche Auslastung können trotzdem zunehmen. Batchgröße und Token-Verteilung zählen mit, weil unterschiedliche Tokens verschiedene Experten aktivieren können.',
    example: 'Eine konkrete Referenz: Mixtral 8x7B', exampleBody: 'Das Mixtral-Paper (2024) beschreibt acht Feed-Forward-Experten pro Layer, von denen pro Token zwei ausgewählt werden. Es nennt 46,7B Gesamtparameter und 12,9B aktive Parameter pro Token. Das sind Eigenschaften dieser Architektur, keine allgemeine Formel für jedes Modell mit acht Experten.',
    sources: 'Primärquellen', ffn: 'Zur dichten Feed-Forward-Rechnung →',
  },
}
export default function MoePage() {
  const { t, locale } = useTranslation()
  const c = copy[locale === 'de' ? 'de' : 'en']
  return <TopicLayout topicId="moe" title={c.title} description={c.description} breadcrumbs={[{ label: t.categories.ai, href: '/' }, { label: t.categories.llm, href: '/ai/llm' }, { label: c.title }]}>
    <p className="text-lg leading-relaxed text-muted">{c.intro}</p><MoEVisualizer />
    {[[c.routing, c.routingBody], [c.memory, c.memoryBody], [c.compute, c.computeBody], [c.example, c.exampleBody]].map(([title, body]) => <section key={title} className="rounded-xl border border-border bg-surface p-6"><h2 className="mb-3 text-xl font-semibold">{title}</h2><p className="leading-relaxed text-muted">{body}</p></section>)}
    <section><h2 className="mb-3 text-xl font-semibold">{c.sources}</h2><ul className="space-y-2 text-cyan-300">{[['Mixtral', 'https://arxiv.org/abs/2401.04088'], ['DeepSeek-V3', 'https://arxiv.org/abs/2412.19437'], ['llama.cpp CPU-MoE', 'https://github.com/ggml-org/llama.cpp/blob/master/tools/cli/README.md']].map(([name, href]) => <li key={href}><a href={href} className="underline">{name}</a></li>)}</ul><Link href={`/${locale}/ai/llm/feed-forward-networks-moe`} className="mt-4 inline-block text-cyan-300">{c.ffn}</Link></section>
  </TopicLayout>
}
