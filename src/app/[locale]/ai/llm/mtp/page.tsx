'use client'

import { useState } from 'react'
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
  const { locale } = useTranslation()
  const de = locale === 'de'
  const [probabilities, setProbabilities] = useState([0.7, 0.4, 0.2])
  const [weighted, setWeighted] = useState(false)
  const weights = weighted ? [1, 0.5, 0.25] : [1, 1, 1]
  const contributions = probabilities.map((p, i) => -Math.log(p) * weights[i])
  const total = contributions.reduce((sum, value) => sum + value, 0)
  return <section className="space-y-5 rounded-2xl border border-border bg-surface p-6">
    <h2 className="text-xl font-semibold">{copy.demoTitle}</h2><p className="text-sm text-muted">{copy.demoDesc}</p>
    <p className="text-sm text-muted">{de ? 'Spielmodell: Die Regler setzen die Wahrscheinlichkeit des richtigen Tokens an drei zukünftigen Positionen. Berechnet wird die Summe ihrer gewichteten Cross-Entropy-Terme in Nats. Kein Sprachmodell wird ausgeführt.' : 'Toy model: the sliders set the probability of the correct token at three future positions. We calculate the sum of their weighted cross-entropy terms in nats. No language model is run.'}</p>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={weighted} onChange={e => setWeighted(e.target.checked)} />{de ? 'Alternative Beispielgewichte 1 / 0,5 / 0,25 verwenden' : 'Use alternative example weights 1 / 0.5 / 0.25'}</label>
    {probabilities.map((p, i) => <div key={i} className="rounded-lg border border-border p-4"><label className="block text-sm">t+{i + 1}: p = {p.toFixed(2)}, λ = {weights[i]}<input type="range" className="mt-2 w-full" min={0.01} max={1} step={0.01} value={p} onChange={e => setProbabilities(previous => previous.map((v, j) => i === j ? Number(e.target.value) : v))} /></label><p className="mt-2 font-mono text-sm">−λ log(p) = {contributions[i].toFixed(3)}</p><div className="mt-2 h-2 rounded bg-background"><div className="h-full rounded bg-cyan-400" style={{ width: `${contributions[i] / Math.log(100) * 100}%` }} /></div></div>)}
    <p aria-live="polite" className="font-mono text-lg text-cyan-300">L = {total.toFixed(3)} nats</p>
    <p className="text-sm text-muted">{de ? 'Balkenskala: 0 bis −log(0,01), für alle Positionen gleich. Das MTP-Paper von Gloeckle et al. summiert die Kopfverluste gleichgewichtet. Andere Architekturen wie DeepSeek-V3 verwenden eigene MTP-Module und Lossgewichte.' : 'Bar scale: 0 to −log(0.01), shared across positions. Gloeckle et al. sum head losses with equal weights. Other architectures such as DeepSeek-V3 use their own MTP modules and loss weights.'}</p>
    <div className="flex flex-wrap gap-4 text-sm text-cyan-300"><a href="https://arxiv.org/html/2404.19737v1" className="underline">Gloeckle et al. (2024)</a><a href="https://arxiv.org/abs/2412.19437" className="underline">DeepSeek-V3</a></div>
  </section>
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
