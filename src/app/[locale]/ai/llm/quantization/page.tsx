'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { QuantizationVisualizer } from '@/components/interactive'
import Link from 'next/link'

export default function QuantizationPage() {
  const { t } = useTranslation()

  const benefits = [
    { num: 1, title: t.quantization.benefit1Title, desc: t.quantization.benefit1Desc, color: 'purple' },
    { num: 2, title: t.quantization.benefit2Title, desc: t.quantization.benefit2Desc, color: 'cyan' },
    { num: 3, title: t.quantization.benefit3Title, desc: t.quantization.benefit3Desc, color: 'emerald' },
    { num: 4, title: t.quantization.benefit4Title, desc: t.quantization.benefit4Desc, color: 'orange' },
  ]

  const techniques = [
    { id: 'ptq', title: t.quantization.techPtq, desc: t.quantization.techPtqDesc, color: 'purple' },
    { id: 'qat', title: t.quantization.techQat, desc: t.quantization.techQatDesc, color: 'cyan' },
    { id: 'gptq', title: t.quantization.techGptq, desc: t.quantization.techGptqDesc, color: 'emerald' },
    { id: 'awq', title: t.quantization.techAwq, desc: t.quantization.techAwqDesc, color: 'orange' },
    { id: 'gguf', title: t.quantization.techGguf, desc: t.quantization.techGgufDesc, color: 'pink' },
  ]

  const ggufMethods = [
    { method: t.quantization.ggufQ2K, quality: t.quantization.ggufQ2KQuality, size: t.quantization.ggufQ2KSize, use: t.quantization.ggufQ2KUse, color: 'red' },
    { method: t.quantization.ggufQ3KS, quality: t.quantization.ggufQ3KSQuality, size: t.quantization.ggufQ3KSSize, use: t.quantization.ggufQ3KSUse, color: 'orange' },
    { method: t.quantization.ggufQ3KM, quality: t.quantization.ggufQ3KMQuality, size: t.quantization.ggufQ3KMSize, use: t.quantization.ggufQ3KMUse, color: 'orange' },
    { method: t.quantization.ggufQ3KL, quality: t.quantization.ggufQ3KLQuality, size: t.quantization.ggufQ3KLSize, use: t.quantization.ggufQ3KLUse, color: 'yellow' },
    { method: t.quantization.ggufQ4KS, quality: t.quantization.ggufQ4KSQuality, size: t.quantization.ggufQ4KSSize, use: t.quantization.ggufQ4KSUse, color: 'emerald' },
    { method: t.quantization.ggufQ4KM, quality: t.quantization.ggufQ4KMQuality, size: t.quantization.ggufQ4KMSize, use: t.quantization.ggufQ4KMUse, color: 'emerald' },
    { method: t.quantization.ggufQ5KS, quality: t.quantization.ggufQ5KSQuality, size: t.quantization.ggufQ5KSSize, use: t.quantization.ggufQ5KSUse, color: 'cyan' },
    { method: t.quantization.ggufQ5KM, quality: t.quantization.ggufQ5KMQuality, size: t.quantization.ggufQ5KMSize, use: t.quantization.ggufQ5KMUse, color: 'cyan' },
    { method: t.quantization.ggufQ6K, quality: t.quantization.ggufQ6KQuality, size: t.quantization.ggufQ6KSize, use: t.quantization.ggufQ6KUse, color: 'purple' },
    { method: t.quantization.ggufQ8, quality: t.quantization.ggufQ8Quality, size: t.quantization.ggufQ8Size, use: t.quantization.ggufQ8Use, color: 'purple' },
  ]

  return (
    <TopicLayout topicId="quantization"
      title={t.quantization.title}
      description={t.quantization.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.quantization.title },
      ]}
      prevTopic={{ label: t.topicNames['moe'], href: '/ai/llm/moe' }}
      nextTopic={{ label: t.topicNames['nested-learning'], href: '/ai/llm/nested-learning' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.quantization.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            <span className="text-primary-light font-semibold">Quantization</span> {t.quantization.whatIsDesc}
          </p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <p className="text-lg text-text italic font-heading">
              {t.quantization.analogy}
            </p>
            <p className="text-sm text-muted mt-2">
              {t.quantization.analogyDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Why Quantize */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.quantization.whyQuantize}</h2>
        <p className="text-muted mb-6">{t.quantization.whyQuantizeDesc}</p>
        <div className="space-y-4">
          {benefits.map((item) => (
            <div key={item.num} className={`flex gap-5 p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center shrink-0`}>
                <span className={`text-xl font-bold text-${item.color}-400`}>{item.num}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Visualizer */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <QuantizationVisualizer />
      </section>

      {/* Quantization Levels Table */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.quantization.levelsTitle}</h2>
        <p className="text-muted mb-6">{t.quantization.levelsDesc}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted font-medium">Level</th>
                <th className="text-left py-3 px-4 text-muted font-medium">{t.quantization.levelBits}</th>
                <th className="text-left py-3 px-4 text-muted font-medium">{t.quantization.levelSize}</th>
                <th className="text-left py-3 px-4 text-muted font-medium">{t.quantization.levelAccuracy}</th>
                <th className="text-left py-3 px-4 text-muted font-medium">{t.quantization.levelUseCase}</th>
              </tr>
            </thead>
            <tbody className="text-text">
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium">{t.quantization.levelFp32}</td>
                <td className="py-3 px-4">32</td>
                <td className="py-3 px-4">{t.quantization.levelFp32Size}</td>
                <td className="py-3 px-4 text-purple-400">{t.quantization.levelFp32Accuracy}</td>
                <td className="py-3 px-4 text-muted">{t.quantization.levelFp32Use}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium">{t.quantization.levelFp16}</td>
                <td className="py-3 px-4">16</td>
                <td className="py-3 px-4">{t.quantization.levelFp16Size}</td>
                <td className="py-3 px-4 text-cyan-400">{t.quantization.levelFp16Accuracy}</td>
                <td className="py-3 px-4 text-muted">{t.quantization.levelFp16Use}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium">{t.quantization.levelInt8}</td>
                <td className="py-3 px-4">8</td>
                <td className="py-3 px-4">{t.quantization.levelInt8Size}</td>
                <td className="py-3 px-4 text-emerald-400">{t.quantization.levelInt8Accuracy}</td>
                <td className="py-3 px-4 text-muted">{t.quantization.levelInt8Use}</td>
              </tr>
              <tr className="border-b border-border/50 bg-emerald-500/5">
                <td className="py-3 px-4 font-medium text-emerald-400">{t.quantization.levelInt4}</td>
                <td className="py-3 px-4">4</td>
                <td className="py-3 px-4">{t.quantization.levelInt4Size}</td>
                <td className="py-3 px-4 text-emerald-400">{t.quantization.levelInt4Accuracy}</td>
                <td className="py-3 px-4 text-muted">{t.quantization.levelInt4Use}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">{t.quantization.levelInt2}</td>
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4">{t.quantization.levelInt2Size}</td>
                <td className="py-3 px-4 text-red-400">{t.quantization.levelInt2Accuracy}</td>
                <td className="py-3 px-4 text-muted">{t.quantization.levelInt2Use}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Recommendation Box */}
      <section>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-2 border-emerald-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-3">{t.quantization.recommendTitle}</h3>
              <p className="text-muted mb-4">{t.quantization.recommendDesc}</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span className="text-text">{t.quantization.recommend1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span className="text-text">{t.quantization.recommend2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span className="text-text">{t.quantization.recommend3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span className="text-text font-mono text-sm">{t.quantization.recommend4}</span>
                </li>
              </ul>
              <p className="text-sm text-muted italic">{t.quantization.recommendNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* VRAM Calculator Link */}
      <section>
        <Link href="/ai/llm-inference/vram-calc" className="block p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-colors group">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧮</span>
            <div>
              <h3 className="text-violet-400 font-semibold font-heading group-hover:text-violet-300">{t.quantization.vramCalcLink} &rarr;</h3>
              <p className="text-muted text-sm">{t.quantization.vramCalcLinkDesc}</p>
            </div>
          </div>
        </Link>
      </section>

      {/* Techniques */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.quantization.techniquesTitle}</h2>
        <p className="text-muted mb-6">{t.quantization.techniquesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {techniques.map((tech) => (
            <div key={tech.id} className={`p-5 rounded-xl bg-${tech.color}-500/5 border border-${tech.color}-500/20`}>
              <h3 className={`text-${tech.color}-400 font-semibold font-heading mb-2`}>{tech.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GGUF K-quants */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.quantization.ggufTitle}</h2>
        <p className="text-muted mb-6">{t.quantization.ggufDesc}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted font-medium">{t.quantization.ggufMethod}</th>
                <th className="text-left py-3 px-4 text-muted font-medium">{t.quantization.ggufQuality}</th>
                <th className="text-left py-3 px-4 text-muted font-medium">{t.quantization.ggufSize}</th>
                <th className="text-left py-3 px-4 text-muted font-medium">{t.quantization.ggufUseCase}</th>
              </tr>
            </thead>
            <tbody className="text-text">
              {ggufMethods.map((method, i) => (
                <tr key={i} className={`border-b border-border/50 ${method.method.includes('Q4_K') ? 'bg-emerald-500/5' : ''}`}>
                  <td className={`py-3 px-4 font-mono font-medium ${method.method.includes('Q4_K') ? 'text-emerald-400' : ''}`}>{method.method}</td>
                  <td className={`py-3 px-4 text-${method.color}-400`}>{method.quality}</td>
                  <td className="py-3 px-4 text-muted">{method.size}</td>
                  <td className="py-3 px-4 text-muted">{method.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* K-quant naming explanation */}
        <div className="mt-6 p-6 rounded-xl bg-surface border border-border">
          <h4 className="font-semibold text-text mb-4">{t.quantization.ggufExplainTitle}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-mono font-bold">K</span>
              <span className="text-muted">{t.quantization.ggufExplainK}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-mono font-bold">S</span>
              <span className="text-muted">{t.quantization.ggufExplainS}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-mono font-bold">M</span>
              <span className="text-muted">{t.quantization.ggufExplainM}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-400 font-mono font-bold">L</span>
              <span className="text-muted">{t.quantization.ggufExplainL}</span>
            </li>
          </ul>
          <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm text-muted">{t.quantization.ggufKeyInsight}</p>
          </div>
        </div>
      </section>

      {/* Real-World Impact */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.quantization.impactTitle}</h2>
        <p className="text-muted mb-6">{t.quantization.impactDesc}</p>
        <div className="space-y-6">
          {/* Example 1: Llama at different quants */}
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text mb-3">{t.quantization.impactExample1Title}</h3>
            <p className="text-muted mb-4">{t.quantization.impactExample1Desc}</p>
            <ul className="space-y-2 text-sm font-mono">
              <li className="flex items-center gap-2">
                <span className="w-20 text-purple-400">Q8:</span>
                <span className="text-muted">{t.quantization.impactExample1Q8}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-20 text-emerald-400">Q4_K_M:</span>
                <span className="text-muted">{t.quantization.impactExample1Q4}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-20 text-orange-400">Q3_K_M:</span>
                <span className="text-muted">{t.quantization.impactExample1Q3}</span>
              </li>
            </ul>
          </div>

          {/* Example 2: Quality comparison */}
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text mb-3">{t.quantization.impactExample2Title}</h3>
            <p className="text-muted mb-4">{t.quantization.impactExample2Desc}</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span className="text-text">{t.quantization.impactExample2Stat1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span className="text-text">{t.quantization.impactExample2Stat2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span className="text-text">{t.quantization.impactExample2Stat3}</span>
              </li>
            </ul>
          </div>

          {/* Example 3: Cost savings */}
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text mb-3">{t.quantization.impactExample3Title}</h3>
            <p className="text-muted mb-4">{t.quantization.impactExample3Desc}</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-xs text-red-400 mb-1">FP16</div>
                <div className="text-sm text-muted">{t.quantization.impactExample3Fp16}</div>
              </div>
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs text-emerald-400 mb-1">Q4</div>
                <div className="text-sm text-muted">{t.quantization.impactExample3Q4}</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="text-xs text-purple-400 mb-1">Local</div>
                <div className="text-sm text-muted">{t.quantization.impactExample3Local}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.quantization.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.quantization.takeaway1,
              t.quantization.takeaway2,
              t.quantization.takeaway3,
              t.quantization.takeaway4,
              t.quantization.takeaway5,
              t.quantization.takeaway6,
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
