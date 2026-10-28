'use client'

import React from 'react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { McpIntegrationMathDemo } from '@/components/interactive/McpIntegrationMathDemo'
import { McpMessageFlowDemo } from '@/components/interactive/McpMessageFlowDemo'
import { useTranslation } from '@/lib/i18n/context'
import { AlertTriangle, Check, X, Server, Wrench, Database, FileText, Terminal, Zap, Globe, KeyRound, Monitor, Plug, ShieldAlert } from 'lucide-react'

const SPEC = 'https://modelcontextprotocol.io/specification/2026-07-28'

const SOURCES = [
  { key: 'spec', href: SPEC },
  { key: 'changelog', href: `${SPEC}/changelog` },
  { key: 'architecture', href: `${SPEC}/architecture` },
  { key: 'server', href: `${SPEC}/server` },
  { key: 'tools', href: `${SPEC}/server/tools` },
  { key: 'mrtr', href: `${SPEC}/basic/patterns/mrtr` },
  { key: 'elicitation', href: `${SPEC}/client/elicitation` },
  { key: 'transports', href: `${SPEC}/basic/transports` },
  { key: 'authorization', href: `${SPEC}/basic/authorization` },
  { key: 'security', href: 'https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices' },
  { key: 'invariant', href: 'https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks' },
  { key: 'servers', href: 'https://github.com/modelcontextprotocol/servers' },
  { key: 'announcement', href: 'https://www.anthropic.com/news/model-context-protocol' },
  { key: 'foundation', href: 'https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation' },
] as const

export default function MCPPage() {
  const { t } = useTranslation()
  const m = t.mcp

  const roles = [
    { title: m.archHost, desc: m.archHostDesc, icon: Monitor, box: 'bg-purple-500/5 border-purple-500/20', text: 'text-purple-400' },
    { title: m.archClient, desc: m.archClientDesc, icon: Plug, box: 'bg-pink-500/5 border-pink-500/20', text: 'text-pink-400' },
    { title: m.archServer, desc: m.archServerDesc, icon: Server, box: 'bg-cyan-500/5 border-cyan-500/20', text: 'text-cyan-400' },
  ]

  const primitives = [
    { title: m.primTools, control: m.primToolsControl, desc: m.primToolsDesc, example: m.primToolsExample, icon: Wrench, box: 'bg-purple-500/5 border-purple-500/20', text: 'text-purple-400' },
    { title: m.primResources, control: m.primResourcesControl, desc: m.primResourcesDesc, example: m.primResourcesExample, icon: Database, box: 'bg-emerald-500/5 border-emerald-500/20', text: 'text-emerald-400' },
    { title: m.primPrompts, control: m.primPromptsControl, desc: m.primPromptsDesc, example: m.primPromptsExample, icon: FileText, box: 'bg-cyan-500/5 border-cyan-500/20', text: 'text-cyan-400' },
  ]

  const clientFeatures = [
    { title: m.elicitationTitle, desc: m.elicitationDesc, deprecated: false },
    { title: m.samplingTitle, desc: m.samplingDesc, deprecated: true },
    { title: m.rootsTitle, desc: m.rootsDesc, deprecated: true },
  ]

  const config = { mcpServers: { filesystem: { command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', '/path/to/approved-folder'] } } }

  return (
    <TopicLayout topicId="mcp"
      title={m.title}
      description={m.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: m.title },
      ]}
    >
      {/* What is MCP */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <span className="inline-block text-xs px-2 py-1 rounded bg-primary/15 text-primary-light mb-4">{m.specBadge}</span>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.whatIs}</h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed text-lg">{m.whatIsP1}</p>
          <p className="text-muted leading-relaxed">{m.whatIsP2}</p>
          <p className="text-muted leading-relaxed">{m.whatIsP3}</p>
        </div>
      </section>

      {/* M×N problem */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.problemTitle}</h2>
        <div className="space-y-4 mb-6">
          <p className="text-muted leading-relaxed">{m.problemP1}</p>
          <p className="text-muted leading-relaxed">{m.problemP2}</p>
        </div>
        <McpIntegrationMathDemo />
        <p className="text-sm text-muted mt-4">{m.problemCaveat}</p>
      </section>

      {/* Architecture */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.archTitle}</h2>
        <p className="text-muted mb-6">{m.archDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {roles.map(role => (
            <div key={role.title} className={`p-5 rounded-xl border ${role.box}`}>
              <div className="flex items-center gap-3 mb-3">
                <role.icon className={`w-6 h-6 ${role.text}`} />
                <h3 className={`text-lg font-bold font-heading ${role.text}`}>{role.title}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">{role.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted mt-4">{m.archNote}</p>
      </section>

      {/* Primitives */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.primitivesTitle}</h2>
        <p className="text-muted mb-6">{m.primitivesDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {primitives.map(primitive => (
            <div key={primitive.title} className={`p-5 rounded-xl border ${primitive.box}`}>
              <div className="flex items-center gap-3 mb-2">
                <primitive.icon className={`w-6 h-6 ${primitive.text}`} />
                <h3 className={`text-lg font-bold font-heading ${primitive.text}`}>{primitive.title}</h3>
              </div>
              <p className="text-xs text-subtle mb-3">{m.controlLabel} <span className="text-text font-semibold">{primitive.control}</span></p>
              <p className="text-sm text-muted mb-3 leading-relaxed">{primitive.desc}</p>
              <div className="rounded-lg bg-background/50 border border-border p-3">
                <div className="text-[10px] uppercase tracking-wider text-subtle mb-1">{m.exampleLabel}</div>
                <code className="text-xs text-cyan-400 font-mono">{primitive.example}</code>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted mt-4">{m.primitivesNote}</p>
      </section>

      {/* Client features / MRTR */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.clientTitle}</h2>
        <div className="space-y-4 mb-6">
          <p className="text-muted leading-relaxed">{m.clientP1}</p>
          <p className="text-muted leading-relaxed">{m.clientP2}</p>
        </div>
        <div className="space-y-3">
          {clientFeatures.map(feature => (
            <div key={feature.title} className={`p-4 rounded-xl border ${feature.deprecated ? 'bg-background/50 border-border' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-text font-semibold">{feature.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${feature.deprecated ? 'bg-orange-500/15 text-orange-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                  {feature.deprecated ? m.deprecatedBadge : m.activeBadge}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">{m.deprecationNote}</p>
      </section>

      {/* Wire demo */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.wireTitle}</h2>
        <p className="text-muted mb-6">{m.wireDesc}</p>
        <McpMessageFlowDemo />
      </section>

      {/* Transports */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.transportTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Terminal className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold font-heading text-emerald-400">{m.transportStdio}</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">{m.transportStdioDesc}</p>
          </div>
          <div className="p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-bold font-heading text-cyan-400">{m.transportHttp}</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">{m.transportHttpDesc}</p>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-surface border border-border">
          <h3 className="text-lg font-semibold font-heading text-text mb-2">{m.statelessTitle}</h3>
          <p className="text-sm text-muted leading-relaxed mb-4">{m.statelessDesc}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: m.statelessOld, steps: m.statelessOldSteps, style: 'border-border text-muted' },
              { label: m.statelessNew, steps: m.statelessNewSteps, style: 'border-primary/30 text-text' },
            ].map(column => (
              <div key={column.label} className={`rounded-lg border bg-background p-4 ${column.style}`}>
                <div className="text-xs uppercase tracking-wider text-subtle mb-2">{column.label}</div>
                <ol className="space-y-1.5 font-mono text-xs">
                  {column.steps.map((step, i) => <li key={i}>{i + 1}. {step}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authorization */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.authTitle}</h2>
        <p className="text-muted mb-6">{m.authDesc}</p>
        <ol className="space-y-3">
          {m.authSteps.map((step, i) => (
            <li key={i} className="flex gap-4 p-4 bg-surface border border-border rounded-lg">
              <span className="text-primary font-mono text-lg font-bold">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-text font-semibold mb-1">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex gap-3 items-start p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <KeyRound className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <p className="text-sm text-muted">{m.authNoPassthrough}</p>
        </div>
      </section>

      {/* Security */}
      <section>
        <div className="p-6 md:p-8 rounded-2xl bg-orange-500/5 border border-orange-500/30">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-8 h-8 text-orange-400 shrink-0" />
            <h2 className="text-2xl font-bold font-heading text-orange-400">{m.securityTitle}</h2>
          </div>
          <p className="text-muted mb-6">{m.securityDesc}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {m.threats.map(threat => (
              <div key={threat.name} className="p-4 rounded-xl bg-background/50 border border-border">
                <h3 className="text-text font-semibold mb-2">{threat.name}</h3>
                <p className="text-sm text-muted mb-2"><span className="text-orange-300 font-medium">{m.attackLabel}: </span>{threat.how}</p>
                <p className="text-sm text-muted"><span className="text-emerald-300 font-medium">{m.defenseLabel}: </span>{threat.defense}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4">{m.securityNote}</p>
        </div>
      </section>

      {/* Servers */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.serversTitle}</h2>
        <p className="text-muted mb-6">{m.serversDesc}</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {m.servers.map(server => (
            <div key={server.name} className="p-4 rounded-xl bg-surface border border-border">
              <h3 className="text-sm font-bold font-heading text-text mb-1">{server.name}</h3>
              <p className="text-xs text-muted">{server.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted mb-6">{m.serversArchived}</p>
        <div className="rounded-xl bg-surface border border-border p-5">
          <h3 className="text-sm font-bold font-heading text-text mb-3">{m.configTitle}</h3>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-muted">{JSON.stringify(config, null, 2)}</pre>
          </div>
          <p className="text-xs text-muted mt-3">{m.configNote}</p>
        </div>
      </section>

      {/* When MCP pays off */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.whenTitle}</h2>
        <p className="text-muted mb-6">{m.whenDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {m.whenCases.map(item => (
            <div key={item.title} className="flex gap-3 items-start p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-text font-semibold">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* When MCP is overkill */}
      <section>
        <div className="p-6 md:p-8 rounded-2xl bg-orange-500/5 border border-orange-500/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-400 shrink-0" />
            <h2 className="text-2xl font-bold font-heading text-orange-400">{m.overkillTitle}</h2>
          </div>
          <p className="text-muted mb-6">{m.overkillDesc}</p>
          <div className="space-y-3">
            {m.overkillCases.map(item => (
              <div key={item.title} className="flex gap-3 items-start p-4 rounded-xl bg-background/50 border border-border">
                <X className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-text font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MCP vs CLI Tools */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{m.vsCli}</h2>
        <p className="text-muted mb-6">{m.vsCliDesc}</p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold font-heading text-purple-400">{m.vsCliMcp}</h3>
            </div>
            <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs overflow-x-auto mb-4">
              <pre className="text-muted">{JSON.stringify({ jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'list_issues', arguments: { repo: 'org/app' } } }, null, 2)}</pre>
            </div>
            <ul className="space-y-2">
              {[m.vsCliMcpPro1, m.vsCliMcpPro2, m.vsCliMcpPro3].map((pro, i) => (
                <li key={i} className="flex gap-2 items-start text-sm">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span className="text-muted">{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold font-heading text-emerald-400">{m.vsCliCli}</h3>
            </div>
            <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs overflow-x-auto mb-4">
              <pre className="text-muted">{['$ gh issue list --repo org/app', '$ git log --oneline -10', '$ curl -s api.example.com/data', '$ psql -c "SELECT count(*) FROM users"'].join('\n')}</pre>
            </div>
            <ul className="space-y-2">
              {[m.vsCliCliPro1, m.vsCliCliPro2, m.vsCliCliPro3].map((pro, i) => (
                <li key={i} className="flex gap-2 items-start text-sm">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-muted">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <div className="grid grid-cols-3 text-sm">
            <div className="p-3 bg-background border-b border-border font-bold text-text"></div>
            <div className="p-3 bg-purple-500/10 border-b border-border font-bold text-purple-400 text-center">MCP</div>
            <div className="p-3 bg-emerald-500/10 border-b border-border font-bold text-emerald-400 text-center">CLI</div>
            {[
              { label: m.vsCliRowSetup, mcp: m.vsCliRowSetupMcp, cli: m.vsCliRowSetupCli },
              { label: m.vsCliRowSpeed, mcp: m.vsCliRowSpeedMcp, cli: m.vsCliRowSpeedCli },
              { label: m.vsCliRowSecurity, mcp: m.vsCliRowSecurityMcp, cli: m.vsCliRowSecurityCli },
              { label: m.vsCliRowEcosystem, mcp: m.vsCliRowEcosystemMcp, cli: m.vsCliRowEcosystemCli },
              { label: m.vsCliRowDebug, mcp: m.vsCliRowDebugMcp, cli: m.vsCliRowDebugCli },
            ].map((row, i) => (
              <React.Fragment key={i}>
                <div className={`p-3 ${i % 2 === 0 ? 'bg-surface' : 'bg-background/50'} border-b border-border font-medium text-text text-sm`}>{row.label}</div>
                <div className={`p-3 ${i % 2 === 0 ? 'bg-surface' : 'bg-background/50'} border-b border-border text-muted text-sm text-center`}>{row.mcp}</div>
                <div className={`p-3 ${i % 2 === 0 ? 'bg-surface' : 'bg-background/50'} border-b border-border text-muted text-sm text-center`}>{row.cli}</div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-6 p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-bold font-heading text-cyan-400">{m.vsCliVerdict}</h3>
          </div>
          <p className="text-muted text-sm leading-relaxed">{m.vsCliVerdictDesc}</p>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{m.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[m.takeaway1, m.takeaway2, m.takeaway3, m.takeaway4].map((item, i) => (
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

      {/* Sources */}
      <section className="border-t border-border pt-5">
        <h2 className="font-semibold mb-3">{m.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {SOURCES.map(source => (
            <li key={source.key}>
              <a className="text-primary-light underline" href={source.href} target="_blank" rel="noopener noreferrer">{m.sources[source.key]}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
