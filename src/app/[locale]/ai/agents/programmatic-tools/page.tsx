'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function ProgrammaticToolCallingPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="programmatic-tools"
      title={t.programmaticTools.title}
      description={t.programmaticTools.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.programmaticTools.title },
      ]}
      prevTopic={{ label: t.topicNames['tool-design'], href: '/ai/agents/tool-design' }}
      nextTopic={{ label: t.topicNames.memory, href: '/ai/agents/memory' }}
    >
      {/* What is Programmatic Tool Calling */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.programmaticTools.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.programmaticTools.whatIsDesc}
        </p>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.programmaticTools.whyMatters}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.programmaticTools.whyMattersDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.programmaticTools.benefit1}</h3>
            <p className="text-sm text-muted">{t.programmaticTools.benefit1Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.programmaticTools.benefit2}</h3>
            <p className="text-sm text-muted">{t.programmaticTools.benefit2Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.programmaticTools.benefit3}</h3>
            <p className="text-sm text-muted">{t.programmaticTools.benefit3Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.programmaticTools.benefit4}</h3>
            <p className="text-sm text-muted">{t.programmaticTools.benefit4Desc}</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.programmaticTools.howWorks}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.programmaticTools.howWorksDesc}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: '1', title: t.programmaticTools.step1, desc: t.programmaticTools.step1Desc, color: 'cyan' },
            { num: '2', title: t.programmaticTools.step2, desc: t.programmaticTools.step2Desc, color: 'purple' },
            { num: '3', title: t.programmaticTools.step3, desc: t.programmaticTools.step3Desc, color: 'emerald' },
            { num: '4', title: t.programmaticTools.step4, desc: t.programmaticTools.step4Desc, color: 'orange' },
          ].map((step) => (
            <div key={step.num} className="relative p-4 bg-background rounded-xl border border-border">
              <div className={`w-8 h-8 rounded-lg bg-${step.color}-500/20 flex items-center justify-center mb-3`}>
                <span className={`text-sm font-bold font-mono text-${step.color}-400`}>{step.num}</span>
              </div>
              <h3 className="text-sm font-bold text-text mb-1">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Traditional vs Programmatic */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.programmaticTools.comparisonTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.programmaticTools.comparisonDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <h3 className="text-lg font-bold font-heading text-red-400">{t.programmaticTools.traditional}</h3>
            </div>
            <p className="text-sm text-muted mb-4">{t.programmaticTools.traditionalFlow}</p>
            <div className="p-3 bg-background rounded-lg border border-border">
              <p className="text-xs text-muted font-mono leading-relaxed">{t.programmaticTools.traditionalSteps}</p>
              <p className="text-xs font-bold text-red-400 mt-2">{t.programmaticTools.traditionalLabel}</p>
            </div>
          </div>
          <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <h3 className="text-lg font-bold font-heading text-emerald-400">{t.programmaticTools.programmatic}</h3>
            </div>
            <p className="text-sm text-muted mb-4">{t.programmaticTools.programmaticFlow}</p>
            <div className="p-3 bg-background rounded-lg border border-border">
              <p className="text-xs text-muted font-mono leading-relaxed">{t.programmaticTools.programmaticSteps}</p>
              <p className="text-xs font-bold text-emerald-400 mt-2">{t.programmaticTools.programmaticLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.programmaticTools.codeExample}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.programmaticTools.codeExampleDesc}
        </p>
        <pre className="p-4 bg-background rounded-xl border border-border text-sm text-muted font-mono overflow-x-auto leading-relaxed">
{`regions = ["West", "East", "Central", "North", "South"]
results = {}

for region in regions:
    data = await query_database(
        f"SELECT SUM(revenue) as total FROM sales WHERE region='{region}'"
    )
    results[region] = data[0]["total"]

# Aggregate in code — only the summary reaches the model
top_region = max(results, key=results.get)
print(f"Top region: {top_region} ({results[top_region]:,.0f})")
print(f"All regions total: {sum(results.values()):,.0f}")`}
        </pre>
      </section>

      {/* Use Cases */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.programmaticTools.useCases}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.programmaticTools.useCasesDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: t.programmaticTools.useCase1, desc: t.programmaticTools.useCase1Desc, gradient: 'from-cyan-500/10 to-blue-500/10', border: 'border-cyan-500/20', color: 'text-cyan-400' },
            { title: t.programmaticTools.useCase2, desc: t.programmaticTools.useCase2Desc, gradient: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/20', color: 'text-purple-400' },
            { title: t.programmaticTools.useCase3, desc: t.programmaticTools.useCase3Desc, gradient: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/20', color: 'text-emerald-400' },
            { title: t.programmaticTools.useCase4, desc: t.programmaticTools.useCase4Desc, gradient: 'from-orange-500/10 to-red-500/10', border: 'border-orange-500/20', color: 'text-orange-400' },
          ].map((item, i) => (
            <div key={i} className={`p-5 bg-gradient-to-br ${item.gradient} border ${item.border} rounded-xl`}>
              <h3 className={`text-lg font-bold font-heading ${item.color} mb-2`}>{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* allowed_callers Concept */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.programmaticTools.allowedCallers}</h2>
        <p className="text-muted leading-relaxed mb-4">
          {t.programmaticTools.allowedCallersDesc}
        </p>
        <p className="text-sm text-muted/80 italic mb-6">
          {t.programmaticTools.allowedCallersNote}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h3 className="text-sm font-bold text-text">{t.programmaticTools.directOnly}</h3>
            </div>
            <p className="text-xs text-muted mb-3">{t.programmaticTools.directOnlyDesc}</p>
            <pre className="text-[11px] text-muted font-mono bg-surface rounded-lg p-2 overflow-x-auto">
{`"allowed_callers": ["direct"]`}
            </pre>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-text">{t.programmaticTools.codeOnly}</h3>
            </div>
            <p className="text-xs text-muted mb-3">{t.programmaticTools.codeOnlyDesc}</p>
            <pre className="text-[11px] text-muted font-mono bg-surface rounded-lg p-2 overflow-x-auto">
{`"allowed_callers":
  ["code_execution"]`}
            </pre>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <h3 className="text-sm font-bold text-text">{t.programmaticTools.bothModes}</h3>
            </div>
            <p className="text-xs text-muted mb-3">{t.programmaticTools.bothModesDesc}</p>
            <pre className="text-[11px] text-muted font-mono bg-surface rounded-lg p-2 overflow-x-auto">
{`"allowed_callers":
  ["direct", "code_execution"]`}
            </pre>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.programmaticTools.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.programmaticTools.takeaway1,
              t.programmaticTools.takeaway2,
              t.programmaticTools.takeaway3,
              t.programmaticTools.takeaway4,
              t.programmaticTools.takeaway5,
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
