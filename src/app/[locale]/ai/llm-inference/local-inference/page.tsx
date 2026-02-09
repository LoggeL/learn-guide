'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { LocalInferenceVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'
import Link from 'next/link'

export default function LocalInferencePage() {
  const { t } = useTranslation()
  const li = t.localInference

  return (
    <TopicLayout topicId="local-inference"
      title={li.title}
      description={li.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories['llm-inference'], href: '/ai/llm-inference' },
        { label: li.title },
      ]}
      prevTopic={{ label: t.topicNames['batching'], href: '/ai/llm-inference/batching' }}
    >
      {/* 1. Why Run Locally? */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.whyTitle}</h2>
        <p className="text-muted leading-relaxed text-lg mb-6">{li.whyDesc}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: li.whyPrivacy, desc: li.whyPrivacyDesc, color: 'emerald' },
            { title: li.whyCost, desc: li.whyCostDesc, color: 'cyan' },
            { title: li.whyOffline, desc: li.whyOfflineDesc, color: 'purple' },
            { title: li.whyCustom, desc: li.whyCustomDesc, color: 'orange' },
            { title: li.whyLearning, desc: li.whyLearningDesc, color: 'pink' },
            { title: li.whyControl, desc: li.whyControlDesc, color: 'amber' },
          ].map((item) => (
            <div key={item.title} className={`p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
              <h3 className={`text-${item.color}-400 font-semibold font-heading mb-2`}>{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Hardware Requirements — Interactive Visualizer */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.hardwareTitle}</h2>
        <p className="text-muted mb-6">{li.hardwareDesc}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LocalInferenceVisualizer section="hardware" t={li as unknown as Record<string, string>} />
        </div>
      </section>

      {/* 3. Popular Tools */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.toolsTitle}</h2>
        <p className="text-muted mb-6">{li.toolsDesc}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LocalInferenceVisualizer section="tools" t={li as unknown as Record<string, string>} />
        </div>
      </section>

      {/* 4. Quantization Tradeoff */}
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

      {/* 5. Getting Started */}
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

      {/* 5.5 Quickstart Demo */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.quickstartTitle}</h2>
        <p className="text-muted mb-6">{li.quickstartDesc}</p>
        <div className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
          <LocalInferenceVisualizer section="quickstart" t={li as unknown as Record<string, string>} />
        </div>
      </section>

      {/* 6. Tips & Tricks */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{li.tipsTitle}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              li.tip1,
              li.tip2,
              li.tip3,
              li.tip4,
              li.tip5,
              li.tip6,
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
