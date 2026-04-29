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
      title="Custom Chips for AI"
      description="Why GPUs, TPUs, NPUs, FPGAs, and custom ASICs matter for modern AI — and how to pick the right accelerator for a workload."
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.industry, href: '/ai/industry' },
        { label: 'Custom Chips' },
      ]}
      prevTopic={{ label: t.topicNames['open-source'], href: '/ai/industry/open-source' }}
      nextTopic={{ label: t.topicNames['logges-favourite-model'], href: '/ai/industry/logges-favourite-model' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">Why AI is a hardware story now</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">
          Modern AI is mostly enormous linear algebra under brutal constraints: power, memory bandwidth, latency, interconnect, and cost. GPUs won because they are programmable and massively parallel. Custom chips exist because hyperscalers can save huge money when a workload is predictable enough to harden into silicon.
        </p>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 text-sm text-muted leading-relaxed">
          The key trade-off is specialization versus flexibility. A custom ASIC can be far more efficient than a general GPU, but only if the models, operators, compiler, and deployment scale justify the loss of flexibility.
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The accelerator zoo</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {chipTypes.map((chip) => (
            <div key={chip.name} className={`rounded-xl bg-surface/70 border border-border p-5`}>
              <h3 className={`text-lg font-bold font-heading text-primary-light mb-2`}>{chip.name}</h3>
              <p className="text-sm text-muted leading-relaxed mb-3">{chip.role}</p>
              <p className="text-xs text-muted/80"><span className="text-text font-medium">Examples:</span> {chip.examples}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <ChipTradeoffSimulator />
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">What actually limits performance?</h2>
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
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">The strategic reason companies build their own chips</h2>
        <p className="text-muted leading-relaxed mb-4">
          Custom silicon is not just about peak speed. It is about supply, margin, roadmap control, and avoiding total dependence on one vendor. Google TPUs, AWS Trainium and Inferentia, Microsoft Maia, and Meta MTIA all reflect the same pressure: AI demand is so large that hardware becomes product strategy.
        </p>
        <p className="text-muted leading-relaxed">
          But the risk is real: if the software stack is weak or model architecture shifts, a specialized chip can become an expensive dead end. The winning platform is usually chip plus compiler plus kernels plus networking plus developer experience.
        </p>
      </section>
    </TopicLayout>
  )
}
