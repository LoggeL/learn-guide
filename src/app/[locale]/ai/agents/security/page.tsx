'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { LethalTrifectaDemo } from '@/components/interactive/LethalTrifectaDemo'
import { useTranslation } from '@/lib/i18n/context'
import { AlertOctagon, BookOpen, Box, Eye, Filter, GitBranch, Lock, Mail, Plug, Triangle, UserCheck, Users, Workflow, XCircle, type LucideIcon } from 'lucide-react'

function Panel({ Icon, title, tone, children }: { Icon: LucideIcon; title: string; tone: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-surface border border-border overflow-hidden">
      <div className={`px-6 py-4 border-b flex items-center gap-3 ${tone}`}>
        <Icon size={20} />
        <h2 className="font-semibold text-text font-heading text-lg">{title}</h2>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </section>
  )
}

function Flow({ steps }: { steps: { title: string; desc: string; tone: string }[] }) {
  return (
    <div className="flex flex-col md:flex-row items-stretch gap-3 text-sm">
      {steps.map((step, index) => (
        <div key={step.title} className="flex flex-col md:flex-row items-center gap-3 flex-1">
          <div className={`w-full p-3 rounded-lg border text-center flex-1 ${step.tone}`}>
            <div className="font-semibold">{step.title}</div>
            <div className="text-muted text-xs mt-1">{step.desc}</div>
          </div>
          {index < steps.length - 1 && <div className="text-muted" aria-hidden="true">→</div>}
        </div>
      ))}
    </div>
  )
}

export default function AgentSecurityPage() {
  const { t, locale } = useTranslation()
  const s = t.agentSecurity
  const d = s.defenses
  const href = (path: string) => `/${locale}${path}`

  const injectionExample = `${s.injection.exampleGreeting}

${s.injection.exampleBody}

<!-- ${s.injection.exampleHidden} -->

${s.injection.exampleClosing}`

  const vulnerableCode = `// ${s.exfil.codeComment1}
const sendEmailTool = {
  name: "send_email",
  description: "${s.exfil.codeDescription}",
  input_schema: {
    type: "object",
    properties: {
      to: { type: "string" },   // ${s.exfil.codeComment2}
      subject: { type: "string" },
      body: { type: "string" }
    }
  }
}

// ${s.exfil.codeComment3}`

  const markerCode = `// ${d.filters.codeComment}
const context = \`
${d.filters.codeUser}
\${userMessage}

${d.filters.codeExternal}
\${documentContent}
\``

  const runtimeCode = `// ${d.runtime.codeComment1}
const ALLOWED_RECIPIENTS = new Set(["support@company.com", "team@company.com"])

function sendEmail(args, session) {
  // ${d.runtime.codeComment2}
  if (!ALLOWED_RECIPIENTS.has(args.to)) {
    return { error: "${d.runtime.codeError}" }
  }
  // ${d.runtime.codeComment3}
  if (session.readUntrustedContent) {
    return requestHumanApproval("send_email", args)
  }
  return mailer.send(args)
}`

  const vectors = [
    { title: s.injection.vectorEmail, desc: s.injection.vectorEmailDesc },
    { title: s.injection.vectorRag, desc: s.injection.vectorRagDesc },
    { title: s.injection.vectorWeb, desc: s.injection.vectorWebDesc },
    { title: s.injection.vectorApi, desc: s.injection.vectorApiDesc },
  ]
  const exfilVectors = [
    { label: s.exfil.vectorHttpLabel, desc: s.exfil.vectorHttp },
    { label: s.exfil.vectorImageLabel, desc: s.exfil.vectorImage },
    { label: s.exfil.vectorWebhookLabel, desc: s.exfil.vectorWebhook },
    { label: s.exfil.vectorCloudLabel, desc: s.exfil.vectorCloud },
    { label: s.exfil.vectorDnsLabel, desc: s.exfil.vectorDns },
  ]
  const mcpAttacks = [
    { title: s.mcp.poisoning, desc: s.mcp.poisoningDesc },
    { title: s.mcp.rugPull, desc: s.mcp.rugPullDesc },
    { title: s.mcp.shadowing, desc: s.mcp.shadowingDesc },
    { title: s.mcp.deputy, desc: s.mcp.deputyDesc },
  ]
  const a2aTypes = [
    { title: s.a2a.type1, desc: s.a2a.type1Desc },
    { title: s.a2a.type2, desc: s.a2a.type2Desc },
    { title: s.a2a.type3, desc: s.a2a.type3Desc },
    { title: s.a2a.type4, desc: s.a2a.type4Desc },
  ]
  const patterns = [
    { title: d.patterns.planTitle, desc: d.patterns.planDesc },
    { title: d.patterns.dualTitle, desc: d.patterns.dualDesc },
    { title: d.patterns.camelTitle, desc: d.patterns.camelDesc },
  ]
  const frameworks = [
    { tag: s.frameworks.nistTag, tone: 'bg-indigo-500/20 text-indigo-400', title: s.frameworks.nistTitle, desc: s.frameworks.nistDesc, points: [s.frameworks.nist1, s.frameworks.nist2, s.frameworks.nist3, s.frameworks.nist4] },
    { tag: s.frameworks.owaspLlmTag, tone: 'bg-orange-500/20 text-orange-400', title: s.frameworks.owaspLlmTitle, desc: s.frameworks.owaspLlmDesc, points: [s.frameworks.owaspLlm1, s.frameworks.owaspLlm2, s.frameworks.owaspLlm3] },
    { tag: s.frameworks.owaspAgenticTag, tone: 'bg-orange-500/20 text-orange-400', title: s.frameworks.owaspAgenticTitle, desc: s.frameworks.owaspAgenticDesc, points: [s.frameworks.owaspAgentic1, s.frameworks.owaspAgentic2, s.frameworks.owaspAgentic3] },
    { tag: s.frameworks.isoTag, tone: 'bg-emerald-500/20 text-emerald-400', title: s.frameworks.isoTitle, desc: s.frameworks.isoDesc, points: [s.frameworks.iso1, s.frameworks.iso2, s.frameworks.iso3] },
  ]
  const layerLabel = (n: number) => d.layer.replace('{n}', String(n))

  return (
    <TopicLayout topicId="agent-security"
      title={s.title}
      description={s.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: s.title },
      ]}
    >
      {/* Intro */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold font-heading text-gradient">{s.intro}</h2>
        <p className="text-muted leading-relaxed text-lg">{s.introDesc}</p>
        <p className="text-muted leading-relaxed">{s.introCompare}</p>
        <p className="text-sm text-muted">
          {s.problemsLinkText}{' '}
          <Link href={href('/ai/agents/problems')} className="text-primary-light underline">{s.problemsLink}</Link>.
        </p>
      </section>

      {/* Prompt injection */}
      <Panel Icon={AlertOctagon} title={s.injection.title} tone="bg-red-500/10 border-red-500/20 text-red-400">
        <p className="text-muted leading-relaxed">{s.injection.desc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-elevated border border-border">
            <h3 className="text-sm font-semibold text-orange-400 mb-2">{s.injection.directTitle}</h3>
            <p className="text-sm text-muted">{s.injection.directDesc}</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-elevated border border-red-500/30">
            <h3 className="text-sm font-semibold text-red-400 mb-2">{s.injection.indirectTitle}</h3>
            <p className="text-sm text-muted">{s.injection.indirectDesc}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-background border border-border">
          <h3 className="text-sm font-semibold text-text mb-4">{s.injection.flowTitle}</h3>
          <Flow steps={[
            { title: s.injection.step1, desc: s.injection.step1Desc, tone: 'bg-red-500/10 border-red-500/20 text-red-400' },
            { title: s.injection.step2, desc: s.injection.step2Desc, tone: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
            { title: s.injection.step3, desc: s.injection.step3Desc, tone: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
            { title: s.injection.step4, desc: s.injection.step4Desc, tone: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
          ]} />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
              <XCircle size={16} />
              {s.injection.exampleTitle}
            </h3>
            <p className="text-sm text-muted mb-4">{s.injection.exampleDesc}</p>
            <pre className="p-4 rounded-lg bg-background border border-border font-mono text-sm text-muted whitespace-pre-wrap overflow-x-auto">{injectionExample}</pre>
          </div>
          <div className="p-4 rounded-xl bg-background border border-border">
            <h3 className="text-sm font-semibold text-text mb-3">{s.injection.whyTitle}</h3>
            <ol className="text-sm text-muted space-y-2">
              {[s.injection.why1, s.injection.why2, s.injection.why3, s.injection.why4].map((item, index) => (
                <li key={item} className="flex gap-2">
                  <span className="text-red-400">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text mb-3">{s.injection.vectorsTitle}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {vectors.map(vector => (
              <div key={vector.title} className="p-3 rounded-lg bg-surface-elevated border border-border">
                <div className="text-sm font-semibold text-orange-400">{vector.title}</div>
                <div className="text-xs text-muted mt-1">{vector.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted mt-3">{s.injection.persistence}</p>
        </div>
      </Panel>

      {/* Lethal trifecta */}
      <Panel Icon={Triangle} title={s.trifecta.title} tone="bg-rose-500/10 border-rose-500/20 text-rose-400">
        <p className="text-muted leading-relaxed">{s.trifecta.desc}</p>
        <LethalTrifectaDemo />
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">{s.trifecta.cutTitle}</h3>
          <ul className="text-sm text-muted space-y-2">
            {[s.trifecta.cut1, s.trifecta.cut2, s.trifecta.cut3].map(item => (
              <li key={item} className="flex gap-2"><span className="text-emerald-400">•</span><span>{item}</span></li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-muted">{s.trifecta.caveat}</p>
      </Panel>

      {/* Data exfiltration */}
      <Panel Icon={Mail} title={s.exfil.title} tone="bg-orange-500/10 border-orange-500/20 text-orange-400">
        <p className="text-muted leading-relaxed">{s.exfil.desc}</p>
        <div className="p-4 rounded-xl bg-background border border-border">
          <h3 className="text-sm font-semibold text-text mb-4">{s.exfil.flowTitle}</h3>
          <Flow steps={[
            { title: s.exfil.step1, desc: s.exfil.step1Desc, tone: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
            { title: s.exfil.step2, desc: s.exfil.step2Desc, tone: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
            { title: s.exfil.step3, desc: s.exfil.step3Desc, tone: 'bg-red-500/10 border-red-500/20 text-red-400' },
          ]} />
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
              <XCircle size={16} />
              {s.exfil.vulnerableTitle}
            </h3>
            <pre className="p-4 rounded-lg bg-background border border-border font-mono text-xs text-muted whitespace-pre-wrap overflow-x-auto">{vulnerableCode}</pre>
          </div>
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <h3 className="text-sm font-semibold text-orange-400 mb-3">{s.exfil.vectorsTitle}</h3>
            <ul className="text-sm text-muted space-y-2">
              {exfilVectors.map(vector => (
                <li key={vector.label}><strong className="text-text">{vector.label}</strong> – {vector.desc}</li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      {/* MCP and supply chain */}
      <Panel Icon={Plug} title={s.mcp.title} tone="bg-amber-500/10 border-amber-500/20 text-amber-400">
        <p className="text-muted leading-relaxed">{s.mcp.desc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {mcpAttacks.map(attack => (
            <div key={attack.title} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <h3 className="text-sm font-semibold text-amber-400 mb-2">{attack.title}</h3>
              <p className="text-sm text-muted">{attack.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">
          {s.mcp.defense}{' '}
          <Link href={href('/ai/agents/mcp')} className="text-primary-light underline">{s.mcp.link}</Link>
        </p>
      </Panel>

      {/* Agent-to-agent */}
      <Panel Icon={Users} title={s.a2a.title} tone="bg-cyan-500/10 border-cyan-500/20 text-cyan-400">
        <p className="text-muted leading-relaxed">{s.a2a.desc}</p>
        <div className="p-4 rounded-xl bg-background border border-border">
          <h3 className="text-sm font-semibold text-text mb-6">{s.a2a.scenario}</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="text-emerald-400 font-semibold mb-1">{s.a2a.agent1}</div>
              <div className="text-muted text-xs">{s.a2a.agent1Desc}</div>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">{s.a2a.compromised}</div>
              <div className="text-red-400 font-semibold mb-1 mt-2">{s.a2a.agent2}</div>
              <div className="text-muted text-xs">{s.a2a.agent2Desc}</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
              <div className="text-purple-400 font-semibold mb-1">{s.a2a.agent3}</div>
              <div className="text-muted text-xs">{s.a2a.agent3Desc}</div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <p className="text-xs text-muted">
              <span className="text-red-400 font-semibold">{s.a2a.attackLabel}</span> {s.a2a.attackDesc}
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {a2aTypes.map(type => (
            <div key={type.title} className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">{type.title}</h3>
              <p className="text-sm text-muted">{type.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">{s.a2a.defense}</p>
      </Panel>

      {/* Defence as architecture */}
      <Panel Icon={Lock} title={d.title} tone="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
        <p className="text-muted leading-relaxed">{d.desc}</p>

        <ol className="space-y-4">
          {/* Layer 1: filters */}
          <li className="p-4 rounded-xl bg-background border border-border border-l-4 border-l-yellow-500/60">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={18} className="text-yellow-400" />
              <span className="text-xs font-mono text-muted">{layerLabel(1)}</span>
              <h3 className="font-semibold text-text">{d.filters.title}</h3>
            </div>
            <dl className="grid md:grid-cols-3 gap-3 text-sm">
              <div><dt className="font-semibold text-text">{d.measuresLabel}</dt><dd className="text-muted">{d.filters.measures}</dd></div>
              <div><dt className="font-semibold text-emerald-400">{d.stopsLabel}</dt><dd className="text-muted">{d.filters.stops}</dd></div>
              <div><dt className="font-semibold text-red-400">{d.notStopsLabel}</dt><dd className="text-muted">{d.filters.notStops}</dd></div>
            </dl>
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
              <p className="text-xs font-semibold text-yellow-400 mb-2">{d.filters.codeTitle}</p>
              <pre className="font-mono text-xs text-muted whitespace-pre-wrap overflow-x-auto">{markerCode}</pre>
            </div>
          </li>

          {/* Layer 2: architecture patterns */}
          <li className="p-4 rounded-xl bg-background border border-border border-l-4 border-l-cyan-500/60">
            <div className="flex items-center gap-2 mb-3">
              <Workflow size={18} className="text-cyan-400" />
              <span className="text-xs font-mono text-muted">{layerLabel(2)}</span>
              <h3 className="font-semibold text-text">{d.patterns.title}</h3>
            </div>
            <p className="text-sm text-muted mb-4">{d.patterns.desc}</p>
            <div className="grid md:grid-cols-3 gap-3">
              {patterns.map(pattern => (
                <div key={pattern.title} className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-1">{pattern.title}</h4>
                  <p className="text-xs text-muted leading-relaxed">{pattern.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted mt-3">{d.patterns.tradeoff}</p>
          </li>

          {/* Layer 3: runtime enforcement */}
          <li className="p-4 rounded-xl bg-background border border-border border-l-4 border-l-emerald-500/60">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch size={18} className="text-emerald-400" />
              <span className="text-xs font-mono text-muted">{layerLabel(3)}</span>
              <h3 className="font-semibold text-text">{d.runtime.title}</h3>
            </div>
            <p className="text-sm text-muted mb-4">{d.runtime.desc}</p>
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-400 mb-2">{d.runtime.codeTitle}</p>
              <pre className="font-mono text-xs text-muted whitespace-pre-wrap overflow-x-auto">{runtimeCode}</pre>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-text mb-1">{d.runtime.privilegeTitle}</h4>
              <p className="text-sm text-muted mb-3">{d.runtime.privilegeDesc}</p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="text-xs font-semibold text-red-400 mb-2">{d.runtime.bad}</p>
                  <code className="text-xs text-muted">tools: [read, write, delete, email, http, sql, exec]</code>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-xs font-semibold text-emerald-400 mb-2">{d.runtime.good}</p>
                  <code className="text-xs text-muted">tools: [search_docs, answer_question]</code>
                </div>
              </div>
            </div>
          </li>

          {/* Layer 4: sandbox */}
          <li className="p-4 rounded-xl bg-background border border-border border-l-4 border-l-blue-500/60">
            <div className="flex items-center gap-2 mb-3">
              <Box size={18} className="text-blue-400" />
              <span className="text-xs font-mono text-muted">{layerLabel(4)}</span>
              <h3 className="font-semibold text-text">{d.sandbox.title}</h3>
            </div>
            <p className="text-sm text-muted">{d.sandbox.desc}</p>
          </li>

          {/* Layer 5: human approval */}
          <li className="p-4 rounded-xl bg-background border border-border border-l-4 border-l-purple-500/60">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck size={18} className="text-purple-400" />
              <span className="text-xs font-mono text-muted">{layerLabel(5)}</span>
              <h3 className="font-semibold text-text">{d.human.title}</h3>
            </div>
            <p className="text-sm text-muted mb-4">{d.human.desc}</p>
            <div className="p-4 rounded-lg bg-surface-elevated border border-border">
              <p className="text-sm text-muted mb-3">{d.human.exampleTitle}</p>
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="w-20 text-purple-400 shrink-0">{d.human.agent}</span>
                  <code className="text-xs text-text break-all">send_email(to=&quot;team@company.com&quot;, subject=&quot;Q3&quot;, attachment=&quot;q3.pdf&quot;)</code>
                  <span className="text-muted">{d.human.exampleAsk}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-cyan-400 shrink-0">{d.human.humanLabel}</span>
                  <span className="text-muted">{d.human.exampleYes}</span>
                </div>
                <p className="text-xs text-muted">{d.human.exampleRun}</p>
              </div>
            </div>
          </li>

          {/* Layer 6: monitoring */}
          <li className="p-4 rounded-xl bg-background border border-border border-l-4 border-l-slate-500/60">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={18} className="text-slate-400" />
              <span className="text-xs font-mono text-muted">{layerLabel(6)}</span>
              <h3 className="font-semibold text-text">{d.monitoring.title}</h3>
            </div>
            <p className="text-sm text-muted">{d.monitoring.desc}</p>
          </li>
        </ol>
      </Panel>

      {/* Frameworks */}
      <Panel Icon={BookOpen} title={s.frameworks.title} tone="bg-indigo-500/10 border-indigo-500/20 text-indigo-400">
        <p className="text-muted leading-relaxed">{s.frameworks.desc}</p>
        <div className="grid gap-4">
          {frameworks.map(framework => (
            <div key={framework.title} className="p-4 rounded-xl bg-background border border-border">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-xs font-mono rounded ${framework.tone}`}>{framework.tag}</span>
                <h3 className="font-semibold text-text">{framework.title}</h3>
              </div>
              <p className="text-sm text-muted mb-3">{framework.desc}</p>
              <ul className="text-sm text-muted space-y-1">
                {framework.points.map(point => (
                  <li key={point} className="flex gap-2"><span className="text-indigo-400">•</span><span>{point}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{s.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[s.takeaway1, s.takeaway2, s.takeaway3, s.takeaway4, s.takeaway5, s.takeaway6].map((item, i) => (
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
        <h2 className="font-semibold mb-3">{s.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {s.sources.map(source => (
            <li key={source.href}>
              <a className="text-primary-light underline" href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
