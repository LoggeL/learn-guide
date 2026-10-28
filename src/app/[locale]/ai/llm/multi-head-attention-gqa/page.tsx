'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { MultiHeadGqaVisualizer } from '@/components/interactive/MultiHeadGqaVisualizer'
import { LatexBlock } from '@/components/ui/Latex'
import { useTranslation } from '@/lib/i18n/context'

const FORMULAS = {
  heads: '\\mathrm{head}_i = \\mathrm{softmax}\\!\\left(\\frac{(XW_i^Q)(XW_i^K)^{\\top}}{\\sqrt{d_h}} + M\\right) XW_i^V, \\qquad \\mathrm{MHA}(X) = \\big[\\mathrm{head}_1; \\dots; \\mathrm{head}_h\\big]\\, W^O',
  cache: '\\mathrm{KV}_{\\text{token}} = 2 \\cdot L \\cdot n_{kv} \\cdot d_h \\cdot b',
  gqa: '\\mathrm{kv}(i) = \\left\\lfloor \\frac{i \\cdot G}{h} \\right\\rfloor, \\qquad n_{kv} = G \\qquad (\\text{MHA: } G = h, \\;\\; \\text{MQA: } G = 1)',
  mla: 'c_t^{KV} = W^{DKV} h_t \\in \\mathbb{R}^{d_c}, \\qquad k_{t,i}^{C} = W_i^{UK} c_t^{KV}, \\qquad v_{t,i} = W_i^{UV} c_t^{KV}, \\qquad k_t^{R} = \\mathrm{RoPE}\\big(W^{KR} h_t\\big) \\in \\mathbb{R}^{d_h^R}',
  absorb: 'q_{t,i}^{\\top}\\, k_{s,i}^{C} = \\big(W_i^{UK\\top} q_{t,i}\\big)^{\\top} c_s^{KV}, \\qquad \\mathrm{KV}_{\\text{token}} = L \\cdot \\big(d_c + d_h^R\\big) \\cdot b',
  window: '\\mathrm{KV}_{\\text{layer}}(T) \\propto \\min(T, W)',
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

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 font-semibold text-cyan-300 hover:text-cyan-200">
      {children} <ArrowRight size={16} />
    </Link>
  )
}

export default function MultiHeadAttentionGqaPage() {
  const { t, locale } = useTranslation()
  const c = t.multiHeadAttentionGqa

  return (
    <TopicLayout
      topicId="multi-head-attention-gqa"
      title={c.title}
      description={c.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: c.crumb },
      ]}
    >
      <Card title={c.headsTitle}>
        <p>{c.headsBody}</p>
        <Formula>{FORMULAS.heads}</Formula>
        <p>{c.headsWhy}</p>
        <p>{c.headsSlice}</p>
        <p>{c.headsMix}</p>
      </Card>

      <Card title={c.rolesTitle}>
        <p>{c.rolesBody}</p>
        <InlineLink href={`/${locale}/ai/llm/attention`}>{c.attentionLink}</InlineLink>
      </Card>

      <Card title={c.cacheTitle}>
        <p>{c.cacheBody}</p>
        <Formula>{FORMULAS.cache}</Formula>
        <p>{c.cacheExample}</p>
        <InlineLink href={`/${locale}/ai/llm-inference/kv-cache`}>{c.kvCacheLink}</InlineLink>
      </Card>

      <Card title={c.sharingTitle}>
        <p>{c.sharingBody}</p>
        <Formula>{FORMULAS.gqa}</Formula>
        <p>{c.sharingSaves}</p>
      </Card>

      <MultiHeadGqaVisualizer />

      <Card title={c.tradeoffTitle}>
        <p>{c.tradeoffBody}</p>
      </Card>

      <Card title={c.mlaTitle}>
        <p>{c.mlaBody}</p>
        <Formula>{FORMULAS.mla}</Formula>
        <p>{c.mlaAbsorb}</p>
        <Formula>{FORMULAS.absorb}</Formula>
        <p>{c.mlaNumbers}</p>
        <p className="text-sm text-subtle">{c.mlaCaveat}</p>
        <InlineLink href={`/${locale}/ai/llm/positional-encoding`}>{c.ropeLink}</InlineLink>
      </Card>

      <Card title={c.windowTitle}>
        <p>{c.windowBody}</p>
        <Formula>{FORMULAS.window}</Formula>
        <p>{c.windowHybrid}</p>
        <p>{c.windowCaveat}</p>
      </Card>

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
