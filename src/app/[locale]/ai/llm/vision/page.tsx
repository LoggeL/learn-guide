'use client'

import { motion } from 'framer-motion'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { PatchGridVisualizer } from '@/components/interactive/PatchGridVisualizer'
import { VisualChallengesDemo } from '@/components/interactive/VisualChallengesDemo'
import { AgenticVisionDemo } from '@/components/interactive/AgenticVisionDemo'
import { useTranslation } from '@/lib/i18n/context'

function Sources({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div className="pt-4 border-t border-border/60">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{title}</h4>
      <ul className="space-y-1 text-sm">
        {items.map(item => (
          <li key={item.href}>
            <a className="text-primary-light underline underline-offset-2" href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function VisionPage() {
  const { t } = useTranslation()
  const v = t.vision

  const vitSteps = [
    { title: v.vitStep1, desc: v.vitStep1Desc },
    { title: v.vitStep2, desc: v.vitStep2Desc },
    { title: v.vitStep3, desc: v.vitStep3Desc },
    { title: v.vitStep4, desc: v.vitStep4Desc },
  ]

  const pipeline = [
    { title: v.pipe1, desc: v.pipe1Desc, color: 'border-slate-500/40' },
    { title: v.pipe2, desc: v.pipe2Desc, color: 'border-cyan-500/40' },
    { title: v.pipe3, desc: v.pipe3Desc, color: 'border-purple-500/40' },
    { title: v.pipe4, desc: v.pipe4Desc, color: 'border-emerald-500/40' },
  ]

  const fusions = [
    { title: v.fusionProjectorTitle, how: v.fusionProjectorHow, examples: v.fusionProjectorExamples, tradeoff: v.fusionProjectorTradeoff, accent: 'text-purple-400 border-purple-500/30' },
    { title: v.fusionCrossTitle, how: v.fusionCrossHow, examples: v.fusionCrossExamples, tradeoff: v.fusionCrossTradeoff, accent: 'text-cyan-400 border-cyan-500/30' },
    { title: v.fusionEarlyTitle, how: v.fusionEarlyHow, examples: v.fusionEarlyExamples, tradeoff: v.fusionEarlyTradeoff, accent: 'text-emerald-400 border-emerald-500/30' },
  ]

  const resolutions = [
    { title: v.resFixedTitle, desc: v.resFixedDesc },
    { title: v.resTilingTitle, desc: v.resTilingDesc },
    { title: v.resNativeTitle, desc: v.resNativeDesc },
  ]

  const apiRows = [
    { provider: 'Anthropic Claude', rule: v.apiClaudeRule, limit: v.apiClaudeLimit },
    { provider: 'OpenAI GPT-5.x', rule: v.apiOpenAiRule, limit: v.apiOpenAiLimit },
    { provider: 'OpenAI GPT-4o / GPT-4.1', rule: v.apiOpenAiLegacyRule, limit: v.apiOpenAiLegacyLimit },
  ]

  const evidence = [
    { title: v.blindTitle, desc: v.blindDesc },
    { title: v.blinkTitle, desc: v.blinkDesc },
    { title: v.countTitle, desc: v.countDesc },
  ]

  const modes = [
    { title: v.modeCountingTitle, mechanism: v.modeCountingMechanism, helps: v.modeCountingHelps },
    { title: v.modeSpatialTitle, mechanism: v.modeSpatialMechanism, helps: v.modeSpatialHelps },
    { title: v.modeTextTitle, mechanism: v.modeTextMechanism, helps: v.modeTextHelps },
    { title: v.modeHallucinationTitle, mechanism: v.modeHallucinationMechanism, helps: v.modeHallucinationHelps },
    { title: v.modeMultiTitle, mechanism: v.modeMultiMechanism, helps: v.modeMultiHelps },
  ]

  const lineage = [
    { title: v.lineage1Title, desc: v.lineage1Desc },
    { title: v.lineage2Title, desc: v.lineage2Desc },
    { title: v.lineage3Title, desc: v.lineage3Desc },
  ]

  const roadmap = [
    { id: 'encoding', label: v.roadmap1 },
    { id: 'failures', label: v.roadmap2 },
    { id: 'tool-inspection', label: v.roadmap3 },
  ]

  return (
    <TopicLayout
      topicId="vision"
      title={v.title}
      description={v.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: v.title },
      ]}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{v.whatIs}</h2>
          <p className="text-muted leading-relaxed text-lg">{v.whatIsDesc}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">{v.roadmapTitle}</h3>
          <ol className="grid gap-3 sm:grid-cols-3">
            {roadmap.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="flex h-full gap-3 items-start p-4 rounded-xl bg-background border border-border hover:border-primary/40 transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 text-primary-light text-sm font-bold">{i + 1}</span>
                  <span className="text-sm text-text">{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Part 1: Encoding */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-8">
        <div>
          <h2 id="encoding" className="scroll-mt-24 text-2xl font-bold font-heading text-gradient mb-4">{v.partEncoding}</h2>
          <p className="text-muted leading-relaxed text-lg">{v.partEncodingIntro}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold font-heading text-text">{v.vitTitle}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {vitSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl bg-background border border-border"
              >
                <h4 className="font-semibold text-text mb-1">{i + 1}. {step.title}</h4>
                <p className="text-sm text-muted">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-sm font-mono text-cyan-300">{v.vitExample}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold font-heading text-text">{v.pipelineTitle}</h3>
          <p className="text-muted leading-relaxed">{v.pipelineDesc}</p>
          <div className="flex flex-col md:flex-row md:items-stretch gap-2">
            {pipeline.map((stage, i) => (
              <div key={stage.title} className="flex flex-col md:flex-row md:items-center gap-2 md:flex-1">
                {i > 0 && <span className="text-primary-light font-bold text-center md:px-1" aria-hidden="true">→</span>}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className={`flex-1 p-3 rounded-xl bg-background border ${stage.color}`}
                >
                  <div className="font-semibold text-text text-sm">{stage.title}</div>
                  <div className="text-xs text-muted mt-0.5">{stage.desc}</div>
                </motion.div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted">{v.projectorTraining}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold font-heading text-text">{v.fusionTitle}</h3>
          <p className="text-muted leading-relaxed">{v.fusionIntro}</p>
          <div className="grid gap-4 lg:grid-cols-3">
            {fusions.map(f => (
              <div key={f.title} className={`p-5 rounded-xl bg-background border ${f.accent.split(' ')[1]} space-y-3`}>
                <h4 className={`font-bold font-heading ${f.accent.split(' ')[0]}`}>{f.title}</h4>
                <div className="text-sm"><span className="font-semibold text-text">{v.fusionHowLabel}: </span><span className="text-muted">{f.how}</span></div>
                <div className="text-sm"><span className="font-semibold text-text">{v.fusionExamplesLabel}: </span><span className="text-muted">{f.examples}</span></div>
                <div className="text-sm"><span className="font-semibold text-text">{v.fusionTradeoffLabel}: </span><span className="text-muted">{f.tradeoff}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold font-heading text-text">{v.resolutionTitle}</h3>
          <p className="text-muted leading-relaxed">{v.resolutionIntro}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {resolutions.map(r => (
              <div key={r.title} className="p-4 rounded-xl bg-background border border-border">
                <h4 className="font-semibold text-text mb-1">{r.title}</h4>
                <p className="text-sm text-muted">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <PatchGridVisualizer />

        <div className="space-y-4">
          <h3 className="text-xl font-bold font-heading text-text">{v.apiTitle}</h3>
          <p className="text-muted leading-relaxed">{v.apiIntro}</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-background/60">
                <tr>
                  <th className="p-3 font-semibold text-muted">{v.apiColProvider}</th>
                  <th className="p-3 font-semibold text-muted">{v.apiColRule}</th>
                  <th className="p-3 font-semibold text-muted">{v.apiColLimit}</th>
                </tr>
              </thead>
              <tbody>
                {apiRows.map(row => (
                  <tr key={row.provider} className="border-t border-border align-top">
                    <th className="p-3 font-medium text-text whitespace-nowrap">{row.provider}</th>
                    <td className="p-3 text-muted font-mono text-xs">{row.rule}</td>
                    <td className="p-3 text-muted">{row.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-text/90">{v.apiExample}</p>
          <p className="text-sm text-muted">{v.apiCaveat}</p>
        </div>

        <Sources
          title={v.sourcesTitle}
          items={[
            { label: v.srcVit, href: 'https://arxiv.org/abs/2010.11929' },
            { label: v.srcLlava, href: 'https://arxiv.org/abs/2304.08485' },
            { label: v.srcLlava15, href: 'https://arxiv.org/abs/2310.03744' },
            { label: v.srcLlavaNext, href: 'https://llava-vl.github.io/blog/2024-01-30-llava-next/' },
            { label: v.srcFlamingo, href: 'https://arxiv.org/abs/2204.14198' },
            { label: v.srcLlama32, href: 'https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/' },
            { label: v.srcChameleon, href: 'https://arxiv.org/abs/2405.09818' },
            { label: v.srcFuyu, href: 'https://www.adept.ai/blog/fuyu-8b' },
            { label: v.srcLlama4, href: 'https://ai.meta.com/blog/llama-4-multimodal-intelligence/' },
            { label: v.srcQwen2vl, href: 'https://arxiv.org/abs/2409.12191' },
            { label: v.srcClaudeDocs, href: 'https://platform.claude.com/docs/en/build-with-claude/vision' },
            { label: v.srcOpenAiDocs, href: 'https://developers.openai.com/api/docs/guides/images-vision' },
          ]}
        />
      </section>

      {/* Part 2: Failures */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-8">
        <div>
          <h2 id="failures" className="scroll-mt-24 text-2xl font-bold font-heading text-gradient mb-4">{v.partFailures}</h2>
          <p className="text-muted leading-relaxed text-lg">{v.failuresIntro}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {evidence.map(e => (
            <div key={e.title} className="p-5 rounded-xl bg-background border border-orange-500/20">
              <h3 className="font-bold font-heading text-orange-400 mb-2">{e.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>

        <VisualChallengesDemo />

        <div className="space-y-4">
          <h3 className="text-xl font-bold font-heading text-text">{v.modesTitle}</h3>
          <div className="space-y-3">
            {modes.map(m => (
              <div key={m.title} className="p-4 rounded-xl bg-background border border-border grid gap-3 md:grid-cols-[12rem_1fr_1fr]">
                <h4 className="font-semibold text-text">{m.title}</h4>
                <p className="text-sm text-muted"><span className="block text-xs font-semibold uppercase tracking-wide text-orange-400 mb-1">{v.modeMechanism}</span>{m.mechanism}</p>
                <p className="text-sm text-muted"><span className="block text-xs font-semibold uppercase tracking-wide text-emerald-400 mb-1">{v.modeHelps}</span>{m.helps}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted">{v.failuresCaveat}</p>
        </div>

        <Sources
          title={v.sourcesTitle}
          items={[
            { label: v.srcBlind, href: 'https://arxiv.org/abs/2407.06581' },
            { label: v.srcBlink, href: 'https://arxiv.org/abs/2404.12390' },
            { label: v.srcCountBench, href: 'https://arxiv.org/abs/2302.12066' },
            { label: v.srcCountQa, href: 'https://arxiv.org/abs/2508.06585' },
            { label: v.srcPope, href: 'https://arxiv.org/abs/2305.10355' },
            { label: v.srcThinkingImages, href: 'https://openai.com/index/thinking-with-images/' },
          ]}
        />
      </section>

      {/* Part 3: Tool-assisted inspection */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-8">
        <div>
          <h2 id="tool-inspection" className="scroll-mt-24 text-2xl font-bold font-heading text-gradient mb-4">{v.partTools}</h2>
          <p className="text-muted leading-relaxed text-lg">{v.toolsIntro}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold font-heading text-text">{v.lineageTitle}</h3>
          <ol className="relative border-l border-primary/30 ml-3 space-y-5">
            {lineage.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="pl-6 relative"
              >
                <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-primary" aria-hidden="true" />
                <h4 className="font-semibold text-text">{item.title}</h4>
                <p className="text-sm text-muted">{item.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="p-5 rounded-xl bg-background border border-cyan-500/20">
          <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{v.groundingTitle}</h3>
          <p className="text-sm text-muted leading-relaxed">{v.groundingDesc}</p>
        </div>

        <AgenticVisionDemo />

        <div className="p-5 rounded-xl bg-background border border-border">
          <h3 className="text-lg font-bold font-heading text-text mb-2">{v.toolsLimitsTitle}</h3>
          <p className="text-sm text-muted leading-relaxed">{v.toolsLimitsDesc}</p>
        </div>

        <Sources
          title={v.sourcesTitle}
          items={[
            { label: v.srcVstar, href: 'https://arxiv.org/abs/2312.14135' },
            { label: v.srcThinkingImages, href: 'https://openai.com/index/thinking-with-images/' },
            { label: v.srcGeminiAgentic, href: 'https://blog.google/innovation-and-ai/technology/developers-tools/agentic-vision-gemini-3-flash/' },
            { label: v.srcGeminiBoxes, href: 'https://cloud.google.com/vertex-ai/generative-ai/docs/bounding-box-detection' },
            { label: v.srcClaudeCoords, href: 'https://platform.claude.com/docs/en/build-with-claude/vision-coordinates' },
          ]}
        />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{v.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[v.takeaway1, v.takeaway2, v.takeaway3, v.takeaway4, v.takeaway5].map((item, i) => (
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
