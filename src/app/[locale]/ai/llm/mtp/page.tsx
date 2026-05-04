'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { useTranslation } from '@/lib/i18n/context'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'
import type { LucideIcon } from 'lucide-react'
import { BrainCircuit, Check, GitBranch, Gauge, Layers3, Route, Sparkles, Split, Target, TriangleAlert, Zap } from 'lucide-react'

type Tone = 'primary' | 'cyan' | 'emerald' | 'orange' | 'purple'
type MtpCopy = Dictionary['mtp']

type ConceptCardItem = {
  title: string
  body: string
  icon: LucideIcon
  tone?: Tone
}

type StepItem = {
  title: string
  body: string
  icon: LucideIcon
}

const toneClasses: Record<Tone, string> = {
  primary: 'from-primary/15 to-secondary/10 border-primary/25 text-primary-light',
  cyan: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/20 text-cyan-300',
  emerald: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-300',
  orange: 'from-orange-500/10 to-red-500/5 border-orange-500/20 text-orange-300',
  purple: 'from-purple-500/10 to-fuchsia-500/5 border-purple-500/20 text-purple-300',
}

function ConceptCard({ title, body, icon: Icon, tone = 'primary' }: ConceptCardItem) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${toneClasses[tone]} border p-5`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-background/60">
        <Icon size={21} />
      </div>
      <h3 className="mb-2 font-heading text-lg font-bold text-text">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{body}</p>
    </div>
  )
}

function NumberedStepList({ items }: { items: StepItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const Icon = item.icon
        return (
          <div key={item.title} className="flex gap-4 rounded-xl border border-border bg-surface p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
              <span className="font-mono font-bold">{i + 1}</span>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Icon size={18} className="text-primary-light" />
                <h3 className="font-heading font-semibold text-text">{item.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BulletPanel({ title, items, kind }: { title: string; items: string[]; kind: 'benefit' | 'caveat' }) {
  const isBenefit = kind === 'benefit'
  const Icon = isBenefit ? Check : TriangleAlert
  const colors = isBenefit
    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
    : 'border-orange-500/20 bg-orange-500/5 text-orange-300'

  return (
    <div className={`rounded-2xl border p-6 ${colors}`}>
      <h2 className="mb-4 font-heading text-xl font-bold">{title}</h2>
      <ul className="space-y-3 text-sm text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <Icon size={15} className="mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TokenBlock({ label, input, output, active = false }: { label: string; input: string; output: string; active?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${active ? 'border-primary/25 bg-primary/5' : 'border-border bg-background'}`}>
      <p className={`mb-2 text-xs font-bold uppercase tracking-[0.2em] ${active ? 'text-primary-light' : 'text-muted'}`}>{label}</p>
      <div className="space-y-2 font-mono text-sm text-text">
        <p>{input}</p>
        <p className="text-primary-light">→ {output}</p>
      </div>
    </div>
  )
}

function MtpLossDemo({ copy }: { copy: MtpCopy }) {
  const offsets = [
    { label: 't+1', weight: '1.00', width: '100%', tone: 'bg-primary' },
    { label: 't+2', weight: '0.50', width: '62%', tone: 'bg-cyan-400' },
    { label: 't+3', weight: '0.25', width: '38%', tone: 'bg-purple-400' },
  ]

  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
          <Route size={24} />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold text-gradient">{copy.demoTitle}</h2>
          <p className="mt-2 leading-relaxed text-muted">{copy.demoDesc}</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-xl border border-border bg-background p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">{copy.demoPrefix}</p>
          <div className="flex flex-wrap gap-2 font-mono text-sm">
            {['The', 'model', 'learns', 'to'].map((token) => (
              <span key={token} className="rounded-lg border border-border bg-surface px-3 py-2 text-text">{token}</span>
            ))}
            <span className="rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-primary-light">?</span>
            <span className="rounded-lg border border-dashed border-cyan-400/40 bg-cyan-500/5 px-3 py-2 text-cyan-300">?</span>
            <span className="rounded-lg border border-dashed border-purple-400/40 bg-purple-500/5 px-3 py-2 text-purple-300">?</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">{copy.demoLoss}</p>
          <div className="space-y-3">
            {offsets.map((item) => (
              <div key={item.label} className="grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-3 text-sm">
                <span className="font-mono text-text">{item.label}</span>
                <div className="h-3 overflow-hidden rounded-full bg-border">
                  <div className={`h-full rounded-full ${item.tone}`} style={{ width: item.width }} />
                </div>
                <span className="font-mono text-muted">×{item.weight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ComparisonBox({ copy }: { copy: MtpCopy }) {
  return (
    <section className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <Split className="text-purple-300" size={24} />
        <h2 className="font-heading text-2xl font-bold text-purple-300">{copy.compareTitle}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-background/70 p-5">
          <h3 className="mb-2 font-heading font-bold text-text">{copy.compareSpecTitle}</h3>
          <p className="text-sm leading-relaxed text-muted">{copy.compareSpecDesc}</p>
        </div>
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
          <h3 className="mb-2 font-heading font-bold text-text">{copy.compareMtpTitle}</h3>
          <p className="text-sm leading-relaxed text-muted">{copy.compareMtpDesc}</p>
        </div>
      </div>
    </section>
  )
}

function Takeaways({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 md:p-8">
      <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{title}</h2>
      <ul className="space-y-4 text-text">
        {items.map((item, i) => (
          <li key={item} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary-light">{i + 1}</span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function getPageData(mtp: MtpCopy) {
  return {
    why: [
      { title: mtp.why1Title, body: mtp.why1Desc, icon: Target, tone: 'cyan' as Tone },
      { title: mtp.why2Title, body: mtp.why2Desc, icon: BrainCircuit, tone: 'purple' as Tone },
      { title: mtp.why3Title, body: mtp.why3Desc, icon: Zap, tone: 'emerald' as Tone },
    ],
    training: [
      { title: mtp.training1Title, body: mtp.training1Desc, icon: Layers3 },
      { title: mtp.training2Title, body: mtp.training2Desc, icon: GitBranch },
      { title: mtp.training3Title, body: mtp.training3Desc, icon: Gauge },
    ],
    benefits: [mtp.benefit1, mtp.benefit2, mtp.benefit3],
    caveats: [mtp.caveat1, mtp.caveat2, mtp.caveat3],
    takeaways: [mtp.takeaway1, mtp.takeaway2, mtp.takeaway3, mtp.takeaway4],
  }
}

export default function MTPPage() {
  const { t } = useTranslation()
  const mtp = t.mtp
  const page = getPageData(mtp)

  return (
    <TopicLayout
      topicId="mtp"
      title={mtp.title}
      description={mtp.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: mtp.title },
      ]}
      prevTopic={{ label: t.topicNames['nested-learning'], href: '/ai/llm/nested-learning' }}
      nextTopic={{ label: t.topicNames['distillation'], href: '/ai/llm/distillation' }}
    >
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{mtp.whatIs}</h2>
        <p className="mb-4 text-lg leading-relaxed text-muted">{mtp.whatIsDesc}</p>
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
          <p className="font-mono text-sm text-primary-light">{mtp.coreFormula}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{mtp.whyTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {page.why.map((item) => <ConceptCard key={item.title} {...item} />)}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{mtp.howTitle}</h2>
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <TokenBlock label={mtp.nextTokenLabel} input={mtp.inputExample} output={mtp.nextTokenExample} />
          <div className="hidden text-3xl text-muted md:block">→</div>
          <TokenBlock label={mtp.mtpLabel} input={mtp.inputExample} output={mtp.mtpExample} active />
        </div>
        <p className="mt-5 leading-relaxed text-muted">{mtp.howDesc}</p>
      </section>

      <MtpLossDemo copy={mtp} />

      <section>
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{mtp.trainingTitle}</h2>
        <NumberedStepList items={page.training} />
      </section>

      <ComparisonBox copy={mtp} />

      <section className="grid gap-4 md:grid-cols-2">
        <BulletPanel title={mtp.benefitsTitle} items={page.benefits} kind="benefit" />
        <BulletPanel title={mtp.caveatsTitle} items={page.caveats} kind="caveat" />
      </section>

      <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <Sparkles className="text-cyan-300" size={24} />
          <h2 className="font-heading text-2xl font-bold text-cyan-300">{mtp.seenTitle}</h2>
        </div>
        <p className="leading-relaxed text-muted">{mtp.seenDesc}</p>
      </section>

      <Takeaways title={mtp.keyTakeaways} items={page.takeaways} />
    </TopicLayout>
  )
}
