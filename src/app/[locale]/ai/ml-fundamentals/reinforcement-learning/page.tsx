'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { ReinforcementLearningPlayground } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'

const concepts = [
  ['Agent', 'The learner or decision-maker. In a game it is the player; in robotics it is the robot controller; in LLM post-training it is the model policy.'],
  ['Environment', 'The world the agent acts in. It receives actions and returns observations plus rewards.'],
  ['State / observation', 'What the agent can currently see. It may be the full state of the world or only a partial view.'],
  ['Action', 'A choice the agent can make: move left, buy/sell, choose a token, call a tool, adjust a motor.'],
  ['Reward', 'A scalar training signal. It tells the agent whether the outcome was good, but not exactly what code or rule to write.'],
  ['Policy', 'The strategy mapping observations to actions. RL optimizes this policy to maximize expected return.'],
]

const methods = [
  { name: 'Q-learning', desc: 'Learns the value of state-action pairs, then chooses actions with high expected future reward.', color: 'cyan' },
  { name: 'Policy gradients', desc: 'Directly adjusts the policy in the direction that made high-reward trajectories more likely.', color: 'purple' },
  { name: 'Actor-critic', desc: 'Combines a policy actor with a value critic that estimates how good states or actions are.', color: 'emerald' },
  { name: 'PPO / GRPO style methods', desc: 'Policy-optimization families used when updates must be stable, especially in large models and RLHF-style post-training.', color: 'orange' },
]

export default function ReinforcementLearningPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout topicId="reinforcement-learning"
      title={t.reinforcementLearning.title}
      description={t.reinforcementLearning.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: t.reinforcementLearning.title },
      ]}
      prevTopic={{ label: t.topicNames['training'], href: '/ai/ml-fundamentals/training' }}
      nextTopic={{ label: t.topicNames['world-models'], href: '/ai/ml-fundamentals/world-models' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.reinforcementLearning.consequencesTitle}</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">
          {t.reinforcementLearning.consequencesDesc}
        </p>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 text-sm text-muted leading-relaxed">
          {t.reinforcementLearning.creditAssignmentNote}
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <ReinforcementLearningPlayground />
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.reinforcementLearning.loopTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {concepts.map(([title, desc], i) => (
            <div key={title} className="rounded-xl bg-surface/70 border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light text-xs font-bold">{i + 1}</span>
                <h3 className="font-bold font-heading text-text">{title}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.reinforcementLearning.methodsTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {methods.map((method) => (
            <div key={method.name} className={`rounded-xl bg-surface/70 border border-border p-5`}>
              <h3 className={`text-lg font-bold font-heading text-primary-light mb-2`}>{method.name}</h3>
              <p className="text-sm text-muted leading-relaxed">{method.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{t.reinforcementLearning.whyMattersTitle}</h2>
        <p className="text-muted leading-relaxed mb-4">
          {t.reinforcementLearning.whyMattersDesc1}
        </p>
        <p className="text-muted leading-relaxed">
          {t.reinforcementLearning.whyMattersDesc2}
        </p>
      </section>
    </TopicLayout>
  )
}
