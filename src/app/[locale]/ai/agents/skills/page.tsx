'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { SkillProgressiveLoadingDemo } from '@/components/interactive/SkillProgressiveLoadingDemo'
import { useTranslation } from '@/lib/i18n/context'
import { AlertTriangle, Check, X } from 'lucide-react'

const SOURCES = [
  { key: 'spec', href: 'https://agentskills.io/specification' },
  { key: 'client', href: 'https://agentskills.io/client-implementation/adding-skills-support' },
  { key: 'overview', href: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview' },
  { key: 'claudeCode', href: 'https://code.claude.com/docs/en/skills' },
  { key: 'unit42', href: 'https://unit42.paloaltonetworks.com/openclaw-ai-supply-chain-risk/' },
] as const

const COLORS = {
  purple: { box: 'bg-purple-500/5 border-purple-500/20', badge: 'bg-purple-500/20 text-purple-400', text: 'text-purple-400', card: 'from-purple-500/10 to-purple-500/5 border-purple-500/20' },
  cyan: { box: 'bg-cyan-500/5 border-cyan-500/20', badge: 'bg-cyan-500/20 text-cyan-400', text: 'text-cyan-400', card: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20' },
  emerald: { box: 'bg-emerald-500/5 border-emerald-500/20', badge: 'bg-emerald-500/20 text-emerald-400', text: 'text-emerald-400', card: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20' },
  orange: { box: 'bg-orange-500/5 border-orange-500/20', badge: 'bg-orange-500/20 text-orange-400', text: 'text-orange-400', card: 'from-orange-500/10 to-orange-500/5 border-orange-500/20' },
} as const

const LEVEL_COLORS = ['purple', 'cyan', 'emerald'] as const

export default function AgentSkillsPage() {
  const { t } = useTranslation()
  const s = t.agentSkills

  const skillTypes = [
    { num: 1, title: s.skillType1Title, desc: s.skillType1Desc, color: COLORS.purple },
    { num: 2, title: s.skillType2Title, desc: s.skillType2Desc, color: COLORS.cyan },
    { num: 3, title: s.skillType3Title, desc: s.skillType3Desc, color: COLORS.emerald },
    { num: 4, title: s.skillType4Title, desc: s.skillType4Desc, color: COLORS.orange },
  ]

  const tree = [
    { name: 'SKILL.md', desc: s.treeSkillMd, color: 'text-emerald-400' },
    { name: 'scripts/', desc: s.treeScripts, color: 'text-purple-400' },
    { name: 'references/', desc: s.treeReferences, color: 'text-purple-400' },
    { name: 'assets/', desc: s.treeAssets, color: 'text-purple-400' },
  ]

  return (
    <TopicLayout topicId="skills"
      title={s.title}
      description={s.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: s.title },
      ]}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{s.whatIs}</h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed text-lg">{s.whatIsP1}</p>
          <p className="text-muted leading-relaxed">{s.whatIsP2}</p>
        </div>
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <h3 className="text-text font-semibold font-heading mb-2">{s.coreIdea}</h3>
          <p className="text-sm text-muted leading-relaxed">{s.coreIdeaDesc}</p>
        </div>
      </section>

      {/* Progressive disclosure */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{s.howItWorks}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {s.levels.map((level, i) => {
            const color = COLORS[LEVEL_COLORS[i]]
            return (
              <div key={i} className={`p-5 rounded-xl border ${color.box}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${color.badge}`}>{i + 1}</span>
                  <h3 className={`text-lg font-bold font-heading ${color.text}`}>{level.title}</h3>
                </div>
                <dl className="text-xs space-y-1 mb-3">
                  <div className="flex gap-2"><dt className="text-subtle">{s.levelWhen}:</dt><dd className="text-text">{level.when}</dd></div>
                  <div className="flex gap-2"><dt className="text-subtle">{s.levelCost}:</dt><dd className="text-text">{level.cost}</dd></div>
                </dl>
                <p className="text-sm text-muted leading-relaxed">{level.desc}</p>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-muted mt-3">{s.levelsNote}</p>
      </section>

      {/* Interactive Demo */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{s.interactiveDemo}</h2>
        <p className="text-muted mb-6">{s.interactiveDemoDesc}</p>
        <SkillProgressiveLoadingDemo />
      </section>

      {/* Skill Structure */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-1">{s.structureTitle}</h2>
        <p className="text-sm text-muted mb-6">{s.structureSubtitle}</p>
        <div className="p-6 rounded-xl bg-surface/50 border border-border font-mono text-sm space-y-1">
          <div className="text-cyan-400">code-review/</div>
          {tree.map(entry => (
            <div key={entry.name} className="pl-4 flex flex-wrap gap-x-3">
              <span className={entry.color}>{entry.name}</span>
              <span className="text-subtle"># {entry.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted mt-4">{s.structureNote}</p>

        <h3 className="text-lg font-semibold font-heading text-text mt-8 mb-3">{s.frontmatterTitle}</h3>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background">
              <tr>
                <th className="text-left p-3 text-text">{s.fieldCol}</th>
                <th className="text-left p-3 text-text">{s.requiredCol}</th>
                <th className="text-left p-3 text-text">{s.ruleCol}</th>
              </tr>
            </thead>
            <tbody>
              {s.fields.map((field, i) => (
                <tr key={field.field} className={i % 2 === 0 ? 'bg-surface' : 'bg-background/50'}>
                  <td className="p-3 font-mono text-emerald-400 whitespace-nowrap">{field.field}</td>
                  <td className="p-3 text-muted">{field.required}</td>
                  <td className="p-3 text-muted">{field.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted mt-3">{s.fieldsNote}</p>
      </section>

      {/* Selection via description */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{s.selectionTitle}</h2>
        <div className="space-y-4 mb-6">
          <p className="text-muted leading-relaxed">{s.selectionP1}</p>
          <p className="text-muted leading-relaxed">{s.selectionP2}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-sm"><Check className="w-4 h-4" />{s.goodLabel}</div>
            <code className="text-xs text-muted font-mono leading-relaxed">description: {s.goodExample}</code>
          </div>
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2 text-orange-400 font-semibold text-sm"><X className="w-4 h-4" />{s.poorLabel}</div>
            <code className="text-xs text-muted font-mono">description: {s.poorExample}</code>
          </div>
        </div>
        <p className="text-sm text-muted mt-4">{s.selectionNote}</p>
      </section>

      {/* Comparison */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{s.compareTitle}</h2>
        <p className="text-muted mb-6">{s.compareDesc}</p>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-background">
              <tr>
                <th className="text-left p-3 text-text">{s.colConcept}</th>
                <th className="text-left p-3 text-text">{s.colWhat}</th>
                <th className="text-left p-3 text-text">{s.colContext}</th>
                <th className="text-left p-3 text-text">{s.colRuns}</th>
              </tr>
            </thead>
            <tbody>
              {s.compareRows.map((row, i) => (
                <tr key={row.concept} className={i === 0 ? 'bg-primary/10' : i % 2 === 0 ? 'bg-surface' : 'bg-background/50'}>
                  <td className="p-3 font-semibold text-text whitespace-nowrap">{row.concept}</td>
                  <td className="p-3 text-muted">{row.what}</td>
                  <td className="p-3 text-muted">{row.context}</td>
                  <td className="p-3 text-muted">{row.runs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-sm text-muted">{s.compareNote}</p>
        </div>
      </section>

      {/* Types of Skills */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{s.typesTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {skillTypes.map((skill) => (
            <div key={skill.num} className={`p-6 rounded-xl bg-gradient-to-br border ${skill.color.card}`}>
              <h3 className={`text-lg font-bold font-heading mb-2 ${skill.color.text}`}>{skill.title}</h3>
              <p className="text-sm text-muted">{skill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example Skill */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{s.exampleTitle}</h2>
        <div className="p-6 rounded-xl bg-surface/50 border border-border">
          <div className="mb-4 pb-4 border-b border-border">
            <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono">code-review/SKILL.md</span>
          </div>
          <pre className="text-sm text-muted overflow-x-auto whitespace-pre-wrap font-mono">
{`---
name: code-review
description: ${s.exampleDesc}
---

${s.exampleBody}`}
          </pre>
        </div>
        <p className="text-sm text-muted mt-3">{s.exampleTreeNote}</p>
      </section>

      {/* Security */}
      <section>
        <div className="p-6 md:p-8 rounded-2xl bg-orange-500/5 border border-orange-500/30">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-400 shrink-0" />
            <h2 className="text-2xl font-bold font-heading text-orange-400">{s.securityTitle}</h2>
          </div>
          <div className="space-y-4 mb-6">
            <p className="text-muted leading-relaxed">{s.securityP1}</p>
            <p className="text-muted leading-relaxed">{s.securityP2}</p>
          </div>
          <h3 className="text-text font-semibold mb-3">{s.securityChecksTitle}</h3>
          <ul className="space-y-2">
            {s.securityChecks.map((check, i) => (
              <li key={i} className="flex gap-3 items-start p-3 rounded-lg bg-background/50 border border-border text-sm text-muted">
                <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{s.practicesTitle}</h2>
        <div className="space-y-4">
          {s.practices.map((practice, i) => (
            <div key={i} className="flex gap-5 p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-purple-400">{i + 1}</span>
              </div>
              <div>
                <h3 className="text-text font-semibold font-heading mb-1">{practice.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{practice.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{s.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[s.takeaway1, s.takeaway2, s.takeaway3, s.takeaway4].map((item, i) => (
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
          {SOURCES.map(source => (
            <li key={source.key}>
              <a className="text-primary-light underline" href={source.href} target="_blank" rel="noopener noreferrer">{s.sources[source.key]}</a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
