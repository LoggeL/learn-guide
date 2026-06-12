'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { ChipTradeoffSimulator } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

const chipTypes = [
  { name: 'GPU', role: 'The default AI workhorse: programmable, mature, and excellent at massively parallel tensor math.', examples: 'NVIDIA H100/B200, AMD MI300', color: 'cyan' },
  { name: 'TPU', role: 'A domain-specific ASIC for tensor workloads, optimized around matrix multiplication and Google-scale pods.', examples: 'Google TPU v4/v5/Trillium', color: 'purple' },
  { name: 'NPU', role: 'A low-power neural accelerator built into phones, laptops, cars, and edge devices for local inference.', examples: 'Apple Neural Engine, Qualcomm Hexagon, Intel/AMD NPUs', color: 'emerald' },
  { name: 'Custom ASIC', role: 'Purpose-built silicon for a narrower workload. Expensive to design, but efficient at scale.', examples: 'AWS Trainium/Inferentia, Azure Maia, Meta MTIA', color: 'orange' },
  { name: 'FPGA', role: 'Reconfigurable hardware: slower than hardened ASICs, but useful when models and operators are changing.', examples: 'Xilinx/AMD Alveo, Intel Agilex', color: 'pink' },
]

const bottlenecks = [
  ['Matrix throughput', 'How many low-precision multiply-accumulate operations the chip can sustain.'],
  ['Memory bandwidth', 'How quickly weights, activations, and KV cache can move to compute units.'],
  ['Interconnect', 'How efficiently thousands of chips communicate during distributed training.'],
  ['Software stack', 'Compilers, kernels, frameworks, debugging tools, and model support. Bad software can waste good silicon.'],
]

export default function CustomChipsPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="custom-chips"
      title={t.customChips.title}
      description={t.customChips.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: t.customChips.title },
      ]}
      prevTopic={{ label: t.topicNames['open-source'], href: '/ai/industry/open-source' }}
      nextTopic={{ label: t.topicNames['logges-favourite-model'], href: '/ai/industry/logges-favourite-model' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.customChips.hardwareStoryTitle}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">
          {t.customChips.hardwareStoryDesc}
        </p>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 text-sm text-muted leading-relaxed">
          {t.customChips.tradeoffNote}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.customChips.zooTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {chipTypes.map((chip) => (
            <div key={chip.name} className={`rounded-xl bg-surface/70 border border-border p-5`}>
              <h3 className={`text-lg font-bold font-heading text-primary-light mb-2`}>{chip.name}</h3>
              <p className="text-sm text-muted leading-relaxed mb-3">{chip.role}</p>
              <p className="text-xs text-muted/80"><span className="text-text font-medium">{t.customChips.examplesLabel}</span> {chip.examples}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <ChipTradeoffSimulator />
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.customChips.limitsTitle}</h2>
        <div className="space-y-4">
          {bottlenecks.map(([title, desc], i) => (
            <div key={title} className="flex gap-4 rounded-xl bg-surface/70 border border-border p-5">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 text-primary-light font-bold">{i + 1}</div>
              <div>
                <h3 className="font-bold font-heading text-text mb-1">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.customChips.strategicTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">
          {t.customChips.strategicDesc1}
        </p>
        <p className="text-muted leading-relaxed">
          {t.customChips.strategicDesc2}
        </p>
      </section>
    </TopicLayout>
  )
}
