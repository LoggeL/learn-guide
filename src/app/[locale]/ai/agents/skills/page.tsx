'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'

export default function AgentSkillsPage() {
  const { t } = useTranslation()

  const skillTypes = [
    { num: 1, title: t.agentSkills.skillType1Title, desc: t.agentSkills.skillType1Desc, color: 'purple' },
    { num: 2, title: t.agentSkills.skillType2Title, desc: t.agentSkills.skillType2Desc, color: 'cyan' },
    { num: 3, title: t.agentSkills.skillType3Title, desc: t.agentSkills.skillType3Desc, color: 'emerald' },
    { num: 4, title: t.agentSkills.skillType4Title, desc: t.agentSkills.skillType4Desc, color: 'orange' },
  ]

  const benefits = [
    { title: t.agentSkills.benefit1Title, desc: t.agentSkills.benefit1Desc },
    { title: t.agentSkills.benefit2Title, desc: t.agentSkills.benefit2Desc },
    { title: t.agentSkills.benefit3Title, desc: t.agentSkills.benefit3Desc },
    { title: t.agentSkills.benefit4Title, desc: t.agentSkills.benefit4Desc },
  ]

  const bestPractices = [
    { title: t.agentSkills.practice1Title, desc: t.agentSkills.practice1Desc },
    { title: t.agentSkills.practice2Title, desc: t.agentSkills.practice2Desc },
    { title: t.agentSkills.practice3Title, desc: t.agentSkills.practice3Desc },
  ]

  return (
    <TopicLayout
      title={t.agentSkills.title}
      description={t.agentSkills.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.agents, href: '/ai/agents' },
        { label: t.agentSkills.title },
      ]}
      prevTopic={{ label: t.topicNames.evaluation, href: '/ai/agents/evaluation' }}
      nextTopic={{ label: t.topicNames.tokenization, href: '/ai/llm/tokenization' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentSkills.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            <span className="text-primary-light font-semibold">Agent Skills</span> {t.agentSkills.whatIsDesc}
          </p>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-lg text-text italic font-heading">
              {t.agentSkills.metaphor}
            </p>
            <p className="text-sm text-muted mt-2">
              {t.agentSkills.metaphorDesc}
            </p>
          </div>
        </div>
      </section>

      {/* How Skills Work */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentSkills.howItWorks}</h2>
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-surface border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <span className="text-xl">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text mb-2">{t.agentSkills.step1Title}</h3>
                <p className="text-muted">{t.agentSkills.step1Desc}</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-surface border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <span className="text-xl">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text mb-2">{t.agentSkills.step2Title}</h3>
                <p className="text-muted">{t.agentSkills.step2Desc}</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-surface border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <span className="text-xl">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text mb-2">{t.agentSkills.step3Title}</h3>
                <p className="text-muted">{t.agentSkills.step3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Structure */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">📁</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.agentSkills.structureTitle}</h2>
            <p className="text-sm text-muted">{t.agentSkills.structureSubtitle}</p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-surface/50 border border-border font-mono text-sm">
          <div className="text-cyan-400">my-skill/</div>
          <div className="pl-4 text-muted">
            <div><span className="text-emerald-400">SKILL.md</span> <span className="text-subtle"># {t.agentSkills.skillMdDesc}</span></div>
            <div><span className="text-orange-400">instructions.md</span> <span className="text-subtle"># {t.agentSkills.instructionsDesc}</span></div>
            <div><span className="text-purple-400">examples/</span> <span className="text-subtle"># {t.agentSkills.examplesDesc}</span></div>
            <div><span className="text-purple-400">templates/</span> <span className="text-subtle"># {t.agentSkills.templatesDesc}</span></div>
            <div><span className="text-purple-400">scripts/</span> <span className="text-subtle"># {t.agentSkills.scriptsDesc}</span></div>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-sm text-muted">
            <span className="text-emerald-400 font-semibold">SKILL.md</span> {t.agentSkills.skillMdNote}
          </p>
        </div>
      </section>

      {/* Types of Skills */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentSkills.typesTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {skillTypes.map((skill) => (
            <div key={skill.num} className={`p-6 rounded-xl bg-gradient-to-br from-${skill.color}-500/10 to-${skill.color}-500/5 border border-${skill.color}-500/20`}>
              <div className={`w-12 h-12 rounded-xl bg-${skill.color}-500/20 flex items-center justify-center mb-4`}>
                <span className={`text-2xl font-bold text-${skill.color}-400`}>{skill.num}</span>
              </div>
              <h3 className={`text-lg font-bold font-heading text-${skill.color}-400 mb-2`}>{skill.title}</h3>
              <p className="text-sm text-muted">{skill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills vs Tools */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentSkills.vsToolsTitle}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-lg font-bold text-text mb-4">{t.agentSkills.tools}</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-muted mt-1">•</span>
                <span>{t.agentSkills.tool1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted mt-1">•</span>
                <span>{t.agentSkills.tool2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted mt-1">•</span>
                <span>{t.agentSkills.tool3}</span>
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <h3 className="text-lg font-bold text-primary-light mb-4">{t.agentSkills.skills}</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-primary-light mt-1">•</span>
                <span>{t.agentSkills.skill1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light mt-1">•</span>
                <span>{t.agentSkills.skill2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light mt-1">•</span>
                <span>{t.agentSkills.skill3}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-sm text-muted">{t.agentSkills.vsNote}</p>
        </div>
      </section>

      {/* Benefits */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentSkills.benefitsTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, i) => (
            <div key={i} className="p-5 rounded-xl bg-surface border border-border">
              <h3 className="text-text font-semibold font-heading mb-2">{benefit.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example Skill */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentSkills.exampleTitle}</h2>
        <div className="p-6 rounded-xl bg-surface/50 border border-border">
          <div className="mb-4 pb-4 border-b border-border">
            <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono">SKILL.md</span>
          </div>
          <pre className="text-sm text-muted overflow-x-auto whitespace-pre-wrap">
{`---
name: code-reviewer
description: ${t.agentSkills.exampleDesc}
triggers:
  - "review this code"
  - "check for bugs"
  - "code review"
---

# Code Reviewer Skill

${t.agentSkills.exampleInstructions}

## Checklist
- [ ] ${t.agentSkills.exampleCheck1}
- [ ] ${t.agentSkills.exampleCheck2}
- [ ] ${t.agentSkills.exampleCheck3}
- [ ] ${t.agentSkills.exampleCheck4}`}
          </pre>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentSkills.practicesTitle}</h2>
        <div className="space-y-4">
          {bestPractices.map((practice, i) => (
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
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.agentSkills.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.agentSkills.takeaway1,
              t.agentSkills.takeaway2,
              t.agentSkills.takeaway3,
              t.agentSkills.takeaway4,
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
