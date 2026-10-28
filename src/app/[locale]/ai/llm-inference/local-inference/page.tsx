'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { LocalInferenceVisualizer } from '@/components/interactive/LocalInferenceVisualizer'
import { useTranslation } from '@/lib/i18n/context'

const QUICKSTART = [
  { cmd: 'ollama run gpt-oss:20b', key: 'qsCmdRun' },
  { cmd: 'ollama run gpt-oss:20b --verbose', key: 'qsCmdVerbose' },
  { cmd: 'ollama ps', key: 'qsCmdPs' },
  {
    cmd: `curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"model": "gpt-oss:20b", "messages": [{"role": "user", "content": "Hi"}]}'`,
    key: 'qsCmdApi',
  },
] as const

export default function LocalInferencePage() {
  const { t } = useTranslation()
  const li = t.localInference

  const tools = [
    { name: 'Ollama', desc: li.toolOllama, goodFor: li.toolOllamaFor, url: 'https://docs.ollama.com/', color: 'cyan' },
    { name: 'LM Studio', desc: li.toolLmStudio, goodFor: li.toolLmStudioFor, url: 'https://lmstudio.ai/docs', color: 'purple' },
    { name: 'llama.cpp', desc: li.toolLlamaCpp, goodFor: li.toolLlamaCppFor, url: 'https://github.com/ggml-org/llama.cpp', color: 'emerald' },
    { name: 'MLX / mlx-lm', desc: li.toolMlx, goodFor: li.toolMlxFor, url: 'https://github.com/ml-explore/mlx-lm', color: 'orange' },
    { name: 'vLLM', desc: li.toolVllm, goodFor: li.toolVllmFor, url: 'https://docs.vllm.ai/', color: 'pink' },
  ]

  return (
    <TopicLayout
      topicId="local-inference"
      title={li.title}
      description={li.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llmInference, href: '/ai/llm-inference' },
        { label: li.title },
      ]}
    >
      {/* 1. Why run locally, and the trade-off */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.whyTitle}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">{li.whyDesc}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: li.whyPrivacy, desc: li.whyPrivacyDesc, color: 'emerald' },
            { title: li.whyCost, desc: li.whyCostDesc, color: 'cyan' },
            { title: li.whyOffline, desc: li.whyOfflineDesc, color: 'purple' },
            { title: li.whyControl, desc: li.whyControlDesc, color: 'amber' },
            { title: li.whyLimits, desc: li.whyLimitsDesc, color: 'orange' },
          ].map((item) => (
            <div key={item.title} className={`p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
              <h3 className={`text-${item.color}-400 font-semibold font-heading mb-2`}>{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Capacity and bandwidth */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.coreTitle}</h2>
        <div className="space-y-4 text-muted leading-relaxed">
          <p>{li.coreCapacity}</p>
          <p>{li.coreBandwidth}</p>
        </div>
        <div className="my-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5 text-center font-mono text-cyan-300">
          {li.coreFormula}
        </div>
        <p className="text-muted leading-relaxed">{li.coreExample}</p>
        <h3 className="mt-8 mb-3 font-semibold font-heading text-text">{li.unifiedTitle}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface/50 p-5">
            <p className="text-sm leading-relaxed text-muted">{li.unifiedGpu}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface/50 p-5">
            <p className="text-sm leading-relaxed text-muted">{li.unifiedShared}</p>
          </div>
        </div>
      </section>

      {/* 3. Hardware × model demo, using the VRAM calculator's formulas */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.hwDemoTitle}</h2>
        <p className="text-muted mb-6">{li.hwDemoDesc}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LocalInferenceVisualizer section="hardware" />
        </div>
        <Link
          href="/ai/llm-inference/vram-calc"
          className="mt-4 block p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-colors group"
        >
          <h3 className="text-violet-400 font-semibold font-heading group-hover:text-violet-300">{li.vramCalcLink} &rarr;</h3>
          <p className="text-muted text-sm">{li.vramCalcLinkDesc}</p>
        </Link>
      </section>

      {/* 4. MoE */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.moeTitle}</h2>
        <p className="text-muted mb-4 leading-relaxed text-lg">{li.moeDesc}</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { title: li.moeBenefit1, desc: li.moeBenefit1Desc, color: 'cyan' },
            { title: li.moeBenefit2, desc: li.moeBenefit2Desc, color: 'purple' },
            { title: li.moeBenefit3, desc: li.moeBenefit3Desc, color: 'emerald' },
          ].map((item) => (
            <div key={item.title} className={`p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
              <h3 className={`text-${item.color}-400 font-semibold font-heading mb-2`}>{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LocalInferenceVisualizer section="moe" />
        </div>
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
          <p className="text-text leading-relaxed mb-3">{li.moeLinkDesc}</p>
          <Link href="/ai/llm/moe" className="text-primary-light hover:underline font-medium">
            {li.moeLinkText} &rarr;
          </Link>
        </div>
      </section>

      {/* 5. Quantization */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.quantTitle}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">{li.quantDesc}</p>
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
          <p className="text-text leading-relaxed mb-3">{li.quantSummary}</p>
          <Link href="/ai/llm/quantization" className="text-primary-light hover:underline font-medium">
            {li.quantLink} &rarr;
          </Link>
        </div>
      </section>

      {/* 6. Runtimes */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.toolsTitle}</h2>
        <p className="text-muted mb-6">{li.toolsDesc}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <div key={tool.name} className={`flex flex-col rounded-xl border border-${tool.color}-500/20 bg-${tool.color}-500/5 p-5`}>
              <h3 className={`mb-2 font-semibold font-heading text-${tool.color}-400`}>{tool.name}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted">{tool.desc}</p>
              <p className="mt-3 text-sm text-text">
                <span className="text-muted">{li.toolGoodFor}:</span> {tool.goodFor}
              </p>
              <a href={tool.url} target="_blank" rel="noreferrer" className="mt-2 text-sm text-primary-light hover:underline">
                {li.toolDocs} &rarr;
              </a>
            </div>
          ))}
        </div>
        <Link href="/ai/llm-inference/batching" className="mt-4 inline-block text-sm text-primary-light hover:underline">
          {li.toolBatchingLink} &rarr;
        </Link>
      </section>

      {/* 7. Getting started */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.startTitle}</h2>
        <p className="text-muted mb-6">{li.startDesc}</p>
        <div className="space-y-4">
          {[
            { num: 1, title: li.step1Title, desc: li.step1Desc, color: 'cyan' },
            { num: 2, title: li.step2Title, desc: li.step2Desc, color: 'purple' },
            { num: 3, title: li.step3Title, desc: li.step3Desc, color: 'emerald' },
            { num: 4, title: li.step4Title, desc: li.step4Desc, color: 'orange' },
            { num: 5, title: li.step5Title, desc: li.step5Desc, color: 'pink' },
          ].map((step) => (
            <div key={step.num} className={`flex gap-5 p-5 rounded-xl bg-${step.color}-500/5 border border-${step.color}-500/20`}>
              <div className={`w-12 h-12 rounded-xl bg-${step.color}-500/20 flex items-center justify-center shrink-0`}>
                <span className={`text-xl font-bold text-${step.color}-400`}>{step.num}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Commands */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.quickstartTitle}</h2>
        <p className="text-muted mb-6">{li.quickstartDesc}</p>
        <div className="space-y-3 rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          {QUICKSTART.map((item) => (
            <div key={item.key}>
              <p className="mb-1 font-mono text-xs text-muted"># {li[item.key]}</p>
              <pre className="overflow-x-auto rounded-xl bg-background p-4 text-sm text-text">{item.cmd}</pre>
            </div>
          ))}
          <a
            href="https://docs.ollama.com/quickstart"
            target="_blank"
            rel="noreferrer"
            className="inline-block text-sm text-primary-light hover:underline"
          >
            {li.qsDocs} &rarr;
          </a>
        </div>
      </section>

      {/* 9. Practical rules */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.tipsTitle}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[li.tip1, li.tip2, li.tip3, li.tip4, li.tip5].map((item, i) => (
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
