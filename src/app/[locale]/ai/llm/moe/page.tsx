'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { MoEVisualizer } from '@/components/interactive'

export default function MoEPage() {
  const { t } = useTranslation()

  const experts = [
    { num: 1, title: t.moe.expert1Title, desc: t.moe.expert1Desc, color: 'purple' },
    { num: 2, title: t.moe.expert2Title, desc: t.moe.expert2Desc, color: 'cyan' },
    { num: 3, title: t.moe.expert3Title, desc: t.moe.expert3Desc, color: 'emerald' },
  ]

  const advantages = [
    { num: 1, title: t.moe.advantage1Title, desc: t.moe.advantage1Desc, color: 'purple' },
    { num: 2, title: t.moe.advantage2Title, desc: t.moe.advantage2Desc, color: 'cyan' },
    { num: 3, title: t.moe.advantage3Title, desc: t.moe.advantage3Desc, color: 'emerald' },
    { num: 4, title: t.moe.advantage4Title, desc: t.moe.advantage4Desc, color: 'orange' },
  ]

  const challenges = [
    { title: t.moe.challenge1Title, desc: t.moe.challenge1Desc },
    { title: t.moe.challenge2Title, desc: t.moe.challenge2Desc },
    { title: t.moe.challenge3Title, desc: t.moe.challenge3Desc },
  ]

  return (
    <TopicLayout
      title={t.moe.title}
      description={t.moe.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.moe.title },
      ]}
      prevTopic={{ label: t.topicNames['llm-training'], href: '/ai/llm/training' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.moe.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            <span className="text-primary-light font-semibold">Mixture of Experts (MoE)</span> {t.moe.whatIsDesc}
          </p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-lg text-text italic font-heading">
              {t.moe.brainAnalogy}
            </p>
            <p className="text-sm text-muted mt-2">
              {t.moe.brainAnalogyDesc}
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.moe.howItWorks}</h2>
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-surface border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <span className="text-xl">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text mb-2">{t.moe.step1Title}</h3>
                <p className="text-muted">{t.moe.step1Desc}</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-surface border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <span className="text-xl">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text mb-2">{t.moe.step2Title}</h3>
                <p className="text-muted">{t.moe.step2Desc}</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-surface border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <span className="text-xl">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text mb-2">{t.moe.step3Title}</h3>
                <p className="text-muted">{t.moe.step3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Visualizer */}
      <section>
        <MoEVisualizer />
      </section>

      {/* Router/Gating Network */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.moe.routerTitle}</h2>
            <p className="text-sm text-muted">{t.moe.routerSubtitle}</p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-surface/50 border border-border">
          <p className="text-muted leading-relaxed mb-6">{t.moe.routerDesc}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-2">{t.moe.topKRouting}</h4>
              <p className="text-sm text-muted">{t.moe.topKRoutingDesc}</p>
            </div>
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <h4 className="font-semibold text-cyan-400 mb-2">{t.moe.loadBalancing}</h4>
              <p className="text-sm text-muted">{t.moe.loadBalancingDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Specialization */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.moe.expertSpecialization}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {experts.map((expert) => (
            <div key={expert.num} className={`p-6 rounded-xl bg-gradient-to-br from-${expert.color}-500/10 to-${expert.color}-500/5 border border-${expert.color}-500/20`}>
              <div className={`w-12 h-12 rounded-xl bg-${expert.color}-500/20 flex items-center justify-center mb-4`}>
                <span className={`text-2xl font-bold text-${expert.color}-400`}>{expert.num}</span>
              </div>
              <h3 className={`text-lg font-bold font-heading text-${expert.color}-400 mb-2`}>{expert.title}</h3>
              <p className="text-sm text-muted">{expert.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 rounded-xl bg-surface border border-border">
          <p className="text-muted text-center">{t.moe.expertNote}</p>
        </div>
      </section>

      {/* Scale Examples */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.moe.scaleTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted font-medium">{t.moe.modelColumn}</th>
                <th className="text-left py-3 px-4 text-muted font-medium">{t.moe.totalParams}</th>
                <th className="text-left py-3 px-4 text-muted font-medium">{t.moe.activeParams}</th>
                <th className="text-left py-3 px-4 text-muted font-medium">{t.moe.expertsColumn}</th>
              </tr>
            </thead>
            <tbody className="text-text">
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium">Mixtral 8x7B</td>
                <td className="py-3 px-4">46.7B</td>
                <td className="py-3 px-4 text-emerald-400">12.9B</td>
                <td className="py-3 px-4">8 (top-2)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium">DeepSeek-V3</td>
                <td className="py-3 px-4">671B</td>
                <td className="py-3 px-4 text-emerald-400">37B</td>
                <td className="py-3 px-4">256 (top-8)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium">Qwen3-235B</td>
                <td className="py-3 px-4">235B</td>
                <td className="py-3 px-4 text-emerald-400">22B</td>
                <td className="py-3 px-4">128 (top-8)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Kimi K2</td>
                <td className="py-3 px-4">1T</td>
                <td className="py-3 px-4 text-emerald-400">32B</td>
                <td className="py-3 px-4">Large pool</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted mt-4 text-center">{t.moe.scaleNote}</p>
      </section>

      {/* Advantages */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.moe.advantagesTitle}</h2>
        <div className="space-y-4">
          {advantages.map((item) => (
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

      {/* Challenges */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.moe.challengesTitle}</h2>
        <div className="space-y-4">
          {challenges.map((challenge, i) => (
            <div key={i} className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/20">
              <h3 className="text-orange-400 font-semibold font-heading mb-2">{challenge.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{challenge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dense vs Sparse Comparison */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.moe.comparisonTitle}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-lg font-bold text-text mb-4">{t.moe.denseModel}</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-muted mt-1">•</span>
                <span>{t.moe.dense1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted mt-1">•</span>
                <span>{t.moe.dense2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted mt-1">•</span>
                <span>{t.moe.dense3}</span>
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <h3 className="text-lg font-bold text-primary-light mb-4">{t.moe.sparseModel}</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-primary-light mt-1">•</span>
                <span>{t.moe.sparse1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light mt-1">•</span>
                <span>{t.moe.sparse2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light mt-1">•</span>
                <span>{t.moe.sparse3}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.moe.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.moe.takeaway1,
              t.moe.takeaway2,
              t.moe.takeaway3,
              t.moe.takeaway4,
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
