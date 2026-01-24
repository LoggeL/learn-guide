'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { ToolSchemaBuilder } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

export default function ToolDesignPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.toolDesign.title}
      description={t.toolDesign.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.toolDesign.title },
      ]}
      prevTopic={{ label: t.topicNames.mcp, href: '/ai/agents/mcp' }}
      nextTopic={{ label: t.topicNames.memory, href: '/ai/agents/memory' }}
    >
      {/* What Makes a Good Tool */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.toolDesign.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.toolDesign.whatIsDesc}
        </p>
      </section>

      {/* Design Principles */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.toolDesign.principles}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.toolDesign.principlesDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.toolDesign.principle1}</h3>
            <p className="text-sm text-muted">{t.toolDesign.principle1Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.toolDesign.principle2}</h3>
            <p className="text-sm text-muted">{t.toolDesign.principle2Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-emerald-400 mb-2">{t.toolDesign.principle3}</h3>
            <p className="text-sm text-muted">{t.toolDesign.principle3Desc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-orange-400 mb-2">{t.toolDesign.principle4}</h3>
            <p className="text-sm text-muted">{t.toolDesign.principle4Desc}</p>
          </div>
        </div>
      </section>

      {/* Schema Design */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.toolDesign.schemaDesign}</h2>
        <p className="text-muted leading-relaxed mb-6">
          {t.toolDesign.schemaDesignDesc}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <h4 className="text-sm font-bold text-emerald-400 mb-3">{t.toolDesign.goodSchema}</h4>
            <pre className="text-xs text-muted font-mono overflow-x-auto">
{`{
  "name": "search_web",
  "description": "Search the web for information",
  "parameters": {
    "query": {
      "type": "string",
      "description": "The search query",
      "required": true
    },
    "max_results": {
      "type": "integer",
      "description": "Maximum results (1-10)",
      "default": 5
    }
  }
}`}
            </pre>
          </div>
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <h4 className="text-sm font-bold text-red-400 mb-3">{t.toolDesign.badSchema}</h4>
            <pre className="text-xs text-muted font-mono overflow-x-auto">
{`{
  "name": "sw",
  "parameters": {
    "q": { "type": "string" },
    "n": { "type": "number" }
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Error Handling */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.toolDesign.errorHandling}</h2>
        <p className="text-muted leading-relaxed">
          {t.toolDesign.errorHandlingDesc}
        </p>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔧</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.toolDesign.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.toolDesign.demoDesc}</p>
          </div>
        </div>
        <ToolSchemaBuilder />
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.toolDesign.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.toolDesign.takeaway1,
              t.toolDesign.takeaway2,
              t.toolDesign.takeaway3,
              t.toolDesign.takeaway4,
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
