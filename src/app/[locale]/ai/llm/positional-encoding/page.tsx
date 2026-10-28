'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { PositionalEncodingRopeVisualizer } from '@/components/interactive/PositionalEncodingRopeVisualizer'
import { RopeScalingVisualizer } from '@/components/interactive/RopeScalingVisualizer'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { LatexBlock } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const FORMULAS = {
  permutation: '\\mathrm{Attn}(PX) = P\\,\\mathrm{Attn}(X)',
  sinusoid: 'PE_{(pos,\\,2i)} = \\sin\\!\\left(\\frac{pos}{10000^{2i/d}}\\right), \\qquad PE_{(pos,\\,2i+1)} = \\cos\\!\\left(\\frac{pos}{10000^{2i/d}}\\right)',
  rope: '\\begin{pmatrix} q\'_{2i} \\\\ q\'_{2i+1} \\end{pmatrix} = \\begin{pmatrix} \\cos m\\theta_i & -\\sin m\\theta_i \\\\ \\sin m\\theta_i & \\cos m\\theta_i \\end{pmatrix} \\begin{pmatrix} q_{2i} \\\\ q_{2i+1} \\end{pmatrix}, \\qquad \\theta_i = b^{-2i/d},\\; i = 0, \\dots, \\tfrac{d}{2} - 1',
  relative: '(R_m\\, q)^{\\top} (R_n\\, k) = q^{\\top} R_m^{\\top} R_n\\, k = q^{\\top} R_{n-m}\\, k',
  complex: '\\mathrm{score}(m, n) = \\mathrm{Re}\\Big[\\sum_{i=0}^{d/2-1} q_i\\, \\overline{k_i}\\; e^{\\,\\mathrm{i}\\,(m-n)\\,\\theta_i}\\Big]',
  wavelength: '\\lambda_i = \\frac{2\\pi}{\\theta_i} = 2\\pi\\, b^{2i/d}',
  alibi: '\\mathrm{score}_h(i, j) = \\frac{q_i^{\\top} k_j}{\\sqrt{d_h}} - m_h\\,(i - j), \\qquad m_h = 2^{-8h/H},\\; h = 1, \\dots, H',
  pi: '\\theta_i\' = \\frac{\\theta_i}{s} \\quad\\Longleftrightarrow\\quad m \\mapsto \\frac{m}{s}',
  ntk: "b' = b \\cdot s^{\\,d/(d-2)}",
  yarn: "\\theta_i' = \\big(1 - \\gamma(r_i)\\big)\\,\\frac{\\theta_i}{s} + \\gamma(r_i)\\,\\theta_i, \\qquad r_i = \\frac{L}{\\lambda_i}, \\qquad \\sqrt{1/t} = 0.1 \\ln s + 1",
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface/55 p-6 md:p-8">
      <h2 className="mb-4 font-heading text-2xl font-bold text-text">{title}</h2>
      <div className="space-y-4 leading-relaxed text-muted">{children}</div>
    </section>
  )
}

function Formula({ children }: { children: string }) {
  return <LatexBlock className="overflow-x-auto rounded-xl border border-border bg-background/60 px-4 py-1 text-text">{children}</LatexBlock>
}

function Method({ title, formula, children }: { title: string; formula?: string; children: ReactNode }) {
  return (
    <article className="rounded-xl border border-border bg-background/40 p-5">
      <h3 className="mb-2 font-heading text-lg font-bold text-text">{title}</h3>
      {formula && <Formula>{formula}</Formula>}
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </article>
  )
}

export default function PositionalEncodingPage() {
  const { t, locale } = useTranslation()
  const c = t.positionalEncoding

  return (
    <TopicLayout
      topicId="positional-encoding"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.crumb },
      ]}
    >
      <Card title={c.orderTitle}>
        <p>{c.orderBody}</p>
        <Formula>{FORMULAS.permutation}</Formula>
        <p>{c.orderCausal}</p>
      </Card>

      <Card title={c.absoluteTitle}>
        <p>{c.absoluteBody}</p>
        <Formula>{FORMULAS.sinusoid}</Formula>
        <p>{c.absoluteLearned}</p>
      </Card>

      <Card title={c.ropeTitle}>
        <p>{c.ropeBody}</p>
        <Formula>{FORMULAS.rope}</Formula>
        <p>{c.ropeFreq}</p>
        <p className="text-sm text-subtle">{c.ropeImpl}</p>
      </Card>

      <Card title={c.relativeTitle}>
        <p>{c.relativeBody}</p>
        <Formula>{FORMULAS.relative}</Formula>
        <p>{c.relativeComplex}</p>
        <Formula>{FORMULAS.complex}</Formula>
        <p>{c.relativeConsequence}</p>
      </Card>

      <Card title={c.frequenciesTitle}>
        <p>{c.frequenciesBody}</p>
        <Formula>{FORMULAS.wavelength}</Formula>
        <p>{c.frequenciesNumbers}</p>
        <p>{c.frequenciesResearch}</p>
      </Card>

      <PositionalEncodingRopeVisualizer />

      <section className="grid gap-4 md:grid-cols-2">
        <Method title={c.alibiTitle} formula={FORMULAS.alibi}>
          <p>{c.alibiBody}</p>
          <p>{c.alibiSlopes}</p>
        </Method>
        <Method title={c.nopeTitle}>
          <p>{c.nopeBody}</p>
          <p>{c.nopeMixed}</p>
        </Method>
      </section>

      <Card title={c.extendTitle}>
        <p>{c.extendBody}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Method title={c.piTitle} formula={FORMULAS.pi}>
            <p>{c.piBody}</p>
          </Method>
          <Method title={c.ntkTitle} formula={FORMULAS.ntk}>
            <p>{c.ntkBody}</p>
          </Method>
          <Method title={c.yarnTitle} formula={FORMULAS.yarn}>
            <p>{c.yarnBody}</p>
            <p>{c.yarnUsage}</p>
          </Method>
          <Method title={c.baseTitle}>
            <p>{c.baseBody}</p>
          </Method>
        </div>
      </Card>

      <RopeScalingVisualizer />

      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
        <p className="leading-relaxed text-muted">{c.extendCaveat}</p>
        <Link href={`/${locale}/ai/llm/context-rot`} className="mt-3 inline-flex items-center gap-2 font-semibold text-cyan-300 hover:text-cyan-200">
          {c.contextRotLink} <ArrowRight size={16} />
        </Link>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
        <h2 className="mb-5 font-heading text-2xl font-bold text-emerald-200">{c.takeawaysTitle}</h2>
        <ul className="space-y-3">
          {c.takeaways.map((item) => (
            <li key={item} className="flex gap-3 text-muted">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-surface/55 p-6 md:p-8">
        <h2 className="mb-4 font-heading text-xl font-bold text-text">{c.sourcesTitle}</h2>
        <ul className="space-y-2 text-sm">
          {c.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-cyan-300 hover:text-cyan-200">
                <ExternalLink size={14} className="mt-0.5 shrink-0" />
                <span>{source.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TopicLayout>
  )
}
