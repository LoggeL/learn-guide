'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import { AlertTriangle, Check, X, Server, Code, ArrowRight } from 'lucide-react'

export default function MCPPage() {
  const { t } = useTranslation()

  const useCases = [
    { title: t.mcp.useCase1, desc: t.mcp.useCase1Desc, icon: '🌐', color: 'emerald' },
    { title: t.mcp.useCase2, desc: t.mcp.useCase2Desc, icon: '🔗', color: 'cyan' },
    { title: t.mcp.useCase3, desc: t.mcp.useCase3Desc, icon: '🏢', color: 'purple' },
    { title: t.mcp.useCase4, desc: t.mcp.useCase4Desc, icon: '🛒', color: 'orange' },
  ]

  const overkillCases = [
    { title: t.mcp.overkillCase1, desc: t.mcp.overkillCase1Desc },
    { title: t.mcp.overkillCase2, desc: t.mcp.overkillCase2Desc },
    { title: t.mcp.overkillCase3, desc: t.mcp.overkillCase3Desc },
    { title: t.mcp.overkillCase4, desc: t.mcp.overkillCase4Desc },
  ]

  const steps = [
    { title: t.mcp.step1, desc: t.mcp.step1Desc, num: '01' },
    { title: t.mcp.step2, desc: t.mcp.step2Desc, num: '02' },
    { title: t.mcp.step3, desc: t.mcp.step3Desc, num: '03' },
    { title: t.mcp.step4, desc: t.mcp.step4Desc, num: '04' },
  ]

  return (
    <TopicLayout
      title={t.mcp.title}
      description={t.mcp.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/' },
        { label: t.mcp.title },
      ]}
      prevTopic={{ label: t.topicNames['agentic-patterns'], href: '/ai/agents/patterns' }}
    >
      {/* What is MCP */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.mcp.whatIs}</h2>
        <p className="text-muted leading-relaxed text-lg">
          {t.mcp.whatIsDesc}
        </p>
      </section>

      {/* MCP vs Regular Tool Calls - Side by Side */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.mcp.vsToolCalls}</h2>
        <p className="text-muted mb-6">{t.mcp.vsToolCallsDesc}</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Regular Tools */}
          <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold font-heading text-emerald-400">{t.mcp.regularTools}</h3>
            </div>
            <p className="text-sm text-muted mb-4">{t.mcp.regularToolsDesc}</p>
            <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-muted">
                <code>
                  <span className="text-pink-400">const</span> <span className="text-cyan-400">tools</span> = {'{'}{'\n'}
                  {'  '}<span className="text-yellow-400">get_weather</span>: (<span className="text-purple-400">location</span>) {'=> {'}{'\n'}
                  {'    '}<span className="text-pink-400">return</span> <span className="text-cyan-400">fetchWeather</span>(location){'\n'}
                  {'  }'}{'\n'}
                  {'}'}{'\n\n'}
                  <span className="text-muted">{'// Direct function call'}</span>{'\n'}
                  <span className="text-purple-400">result</span> = tools.<span className="text-yellow-400">get_weather</span>(<span className="text-green-400">"Tokyo"</span>)
                </code>
              </pre>
            </div>
          </div>

          {/* MCP Tools */}
          <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold font-heading text-purple-400">{t.mcp.mcpTools}</h3>
            </div>
            <p className="text-sm text-muted mb-4">{t.mcp.mcpToolsDesc}</p>
            <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-muted">
                <code>
                  <span className="text-muted">{'// Separate server process'}</span>{'\n'}
                  <span className="text-pink-400">const</span> <span className="text-cyan-400">client</span> = <span className="text-pink-400">new</span> <span className="text-yellow-400">MCPClient</span>(){'\n\n'}
                  <span className="text-muted">{'// Discover tools via protocol'}</span>{'\n'}
                  <span className="text-purple-400">tools</span> = <span className="text-pink-400">await</span> client.<span className="text-cyan-400">listTools</span>(){'\n\n'}
                  <span className="text-muted">{'// Call over network'}</span>{'\n'}
                  <span className="text-purple-400">result</span> = <span className="text-pink-400">await</span> client.<span className="text-cyan-400">invoke</span>({'\n'}
                  {'  '}<span className="text-green-400">"get_weather"</span>, {'{ '}<span className="text-purple-400">location</span>: <span className="text-green-400">"Tokyo"</span> {'}'}{'\n'}
                  )
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* When MCP Makes Sense */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.mcp.whenToUse}</h2>
        <p className="text-muted mb-6">{t.mcp.whenToUseDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {useCases.map((useCase, i) => (
            <div key={i} className={`p-5 rounded-xl bg-${useCase.color}-500/5 border border-${useCase.color}-500/20`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{useCase.icon}</span>
                <h3 className={`text-lg font-bold font-heading text-${useCase.color}-400`}>{useCase.title}</h3>
              </div>
              <p className="text-sm text-muted">{useCase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* When MCP is Overkill - Warning Box */}
      <section>
        <div className="p-6 md:p-8 rounded-2xl bg-orange-500/5 border border-orange-500/30">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
            <h2 className="text-2xl font-bold font-heading text-orange-400">{t.mcp.overkill}</h2>
          </div>
          <p className="text-muted mb-6">{t.mcp.overkillDesc}</p>
          <div className="space-y-3">
            {overkillCases.map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-4 rounded-xl bg-background/50 border border-border">
                <X className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-text font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How MCP Works */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.mcp.architecture}</h2>
        <p className="text-muted mb-6">{t.mcp.architectureDesc}</p>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 p-4 bg-surface border border-border rounded-lg">
              <span className="text-primary font-mono text-lg font-bold">{step.num}</span>
              <div className="flex-1">
                <h3 className="text-text font-semibold mb-1">{step.title}</h3>
                <p className="text-muted text-sm">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-muted self-center hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Practical Advice */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.mcp.practicalAdvice}</h2>
        <p className="text-muted mb-6">{t.mcp.adviceDesc}</p>
        <div className="space-y-3">
          {[t.mcp.advice1, t.mcp.advice2, t.mcp.advice3, t.mcp.advice4].map((advice, i) => (
            <div key={i} className="flex gap-3 items-start p-4 rounded-xl bg-surface border border-border">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-text">{advice}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.mcp.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.mcp.takeaway1,
              t.mcp.takeaway2,
              t.mcp.takeaway3,
              t.mcp.takeaway4,
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
