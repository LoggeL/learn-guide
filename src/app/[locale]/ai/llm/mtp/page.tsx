'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, BrainCircuit, Cpu, GitBranch, Layers3, Scale, Sparkles, Target, TriangleAlert } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { LatexBlock } from '@/components/ui/Latex'
import { MtpArchitectureDiagram } from '@/components/interactive/MtpArchitectureDiagram'
import { MtpDepthCalculator, MtpSelfSpeculationDemo } from '@/components/interactive/MtpSelfSpeculationDemo'
import { useTranslation } from '@/lib/i18n/context'

type Tone = 'cyan' | 'emerald' | 'orange' | 'purple'

const toneClasses: Record<Tone, string> = {
  cyan: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/20 text-cyan-300',
  emerald: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-300',
  orange: 'from-orange-500/10 to-red-500/5 border-orange-500/20 text-orange-300',
  purple: 'from-purple-500/10 to-fuchsia-500/5 border-purple-500/20 text-purple-300',
}

function ConceptCard({ title, body, icon: Icon, tone }: { title: string; body: string; icon: LucideIcon; tone: Tone }) {
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${toneClasses[tone]}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-background/60">
        <Icon size={21} />
      </div>
      <h3 className="mb-2 font-heading text-lg font-bold text-text">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{body}</p>
    </div>
  )
}

const LOSS_NTP = '\\mathcal{L}_{\\text{NTP}} = -\\sum_{t} \\log P_\\theta\\!\\left(x_{t+1} \\mid x_{1:t}\\right)'
const LOSS_MTP = '\\mathcal{L}_{\\text{MTP}} = -\\sum_{t} \\sum_{i=1}^{n} \\log P_\\theta\\!\\left(x_{t+i} \\mid x_{1:t}\\right)'
const DS_COMBINE = "h_i^{\\prime\\,k} = M_k\\big[\\operatorname{RMSNorm}(h_i^{k-1});\\; \\operatorname{RMSNorm}(\\operatorname{Emb}(t_{i+k}))\\big]"
const DS_BLOCK = "h_{1:T-k}^{k} = \\operatorname{TRM}_k\\big(h_{1:T-k}^{\\prime\\,k}\\big), \\qquad P_{i+k+1}^{k} = \\operatorname{OutHead}\\big(h_i^{k}\\big)"
const DS_LOSS = '\\mathcal{L}_{\\text{MTP}}^{k} = -\\frac{1}{T}\\sum_{i=2+k}^{T+1} \\log P_i^{k}[t_i], \\qquad \\mathcal{L} = \\mathcal{L}_{\\text{main}} + \\frac{\\lambda}{D}\\sum_{k=1}^{D}\\mathcal{L}_{\\text{MTP}}^{k}'

export default function MTPPage() {
  const { t, locale } = useTranslation()
  const mtp = t.mtp

  const why = [
    { title: mtp.why1Title, body: mtp.why1Desc, icon: Target, tone: 'cyan' as Tone },
    { title: mtp.why2Title, body: mtp.why2Desc, icon: BrainCircuit, tone: 'purple' as Tone },
    { title: mtp.why3Title, body: mtp.why3Desc, icon: Scale, tone: 'orange' as Tone },
  ]
  const specSteps = [
    { title: mtp.specStep1Title, body: mtp.specStep1Desc, icon: Cpu },
    { title: mtp.specStep2Title, body: mtp.specStep2Desc, icon: GitBranch },
    { title: mtp.specStep3Title, body: mtp.specStep3Desc, icon: Layers3 },
  ]
  const caveats = [mtp.caveat1, mtp.caveat2, mtp.caveat3]
  const takeaways = [mtp.takeaway1, mtp.takeaway2, mtp.takeaway3, mtp.takeaway4]

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
    >
      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{mtp.whatIs}</h2>
        <p className="mb-6 text-lg leading-relaxed text-muted">{mtp.whatIsDesc}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">{mtp.lossNextLabel}</p>
            <LatexBlock className="overflow-x-auto text-text">{LOSS_NTP}</LatexBlock>
          </div>
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light">{mtp.lossMtpLabel}</p>
            <LatexBlock className="overflow-x-auto text-text">{LOSS_MTP}</LatexBlock>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">{mtp.lossNote}</p>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="mb-3 font-heading text-2xl font-bold text-gradient">{mtp.designsTitle}</h2>
          <p className="leading-relaxed text-muted">{mtp.designsDesc}</p>
        </div>
        <MtpArchitectureDiagram />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-2 font-heading font-bold text-text">{mtp.parallelTitle}</h3>
            <p className="text-sm leading-relaxed text-muted">{mtp.parallelDesc}</p>
          </div>
          <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-5">
            <h3 className="mb-2 font-heading font-bold text-text">{mtp.sequentialTitle}</h3>
            <p className="text-sm leading-relaxed text-muted">{mtp.sequentialDesc}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">{mtp.sequentialEqTitle}</p>
          <div className="space-y-1 overflow-x-auto text-text">
            <LatexBlock>{DS_COMBINE}</LatexBlock>
            <LatexBlock>{DS_BLOCK}</LatexBlock>
            <LatexBlock>{DS_LOSS}</LatexBlock>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{mtp.sequentialNote}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{mtp.whyTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {why.map((item) => (
            <ConceptCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/50 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gradient">{mtp.specTitle}</h2>
        <p className="mb-6 leading-relaxed text-muted">{mtp.specDesc}</p>
        <div className="space-y-3">
          {specSteps.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex gap-4 rounded-xl border border-border bg-background p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono font-bold text-primary-light">{i + 1}</div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Icon size={16} className="text-primary-light" />
                    <h3 className="font-semibold text-text">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted">{mtp.specGloeckle}</p>
        <Link
          href={`/${locale}/ai/llm/speculative-decoding`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
        >
          {t.topicNames['speculative-decoding']}
          <ArrowRight size={16} />
        </Link>
      </section>

      <MtpSelfSpeculationDemo key={`sim-${locale}`} />

      <MtpDepthCalculator />

      <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <Sparkles className="text-cyan-300" size={24} />
          <h2 className="font-heading text-2xl font-bold text-cyan-300">{mtp.modelsTitle}</h2>
        </div>
        <p className="mb-5 leading-relaxed text-muted">{mtp.modelsDesc}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {mtp.models.map((model) => (
            <div key={model.name} className="rounded-xl border border-border bg-background/70 p-4">
              <h3 className="mb-1 font-heading font-semibold text-text">{model.name}</h3>
              <p className="text-sm leading-relaxed text-muted">{model.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
        <h2 className="mb-4 font-heading text-xl font-bold text-orange-300">{mtp.caveatsTitle}</h2>
        <ul className="space-y-3 text-sm text-muted">
          {caveats.map((item) => (
            <li key={item} className="flex gap-2">
              <TriangleAlert size={15} className="mt-0.5 shrink-0 text-orange-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-gradient">{mtp.keyTakeaways}</h2>
        <ul className="space-y-4 text-text">
          {takeaways.map((item, i) => (
            <li key={item} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary-light">{i + 1}</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-xl font-semibold text-text">{mtp.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {mtp.sources.map((source) => (
            <li key={source.url}>
              <a className="text-cyan-300 underline hover:text-cyan-200" href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
