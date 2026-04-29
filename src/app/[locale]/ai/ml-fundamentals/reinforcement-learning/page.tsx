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
      title="Reinforcement Learning"
      description="How agents learn by acting, receiving rewards, and improving a policy over repeated experience."
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.mlFundamentals, href: '/ai/ml-fundamentals' },
        { label: 'Reinforcement Learning' },
      ]}
      prevTopic={{ label: t.topicNames['training'], href: '/ai/ml-fundamentals/training' }}
      nextTopic={{ label: t.topicNames['world-models'], href: '/ai/ml-fundamentals/world-models' }}
    >
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">Learning from consequences</h2>
        <p className="text-muted leading-relaxed text-lg mb-4">
          Reinforcement learning trains an agent through interaction. Instead of being shown the correct answer for every example, the agent tries actions, receives rewards, and gradually learns a policy that produces better long-term outcomes.
        </p>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 text-sm text-muted leading-relaxed">
          The hard part is credit assignment: if a reward arrives after 200 steps, which earlier decisions deserve credit or blame? That is why RL is powerful, unstable, and often expensive.
        </div>
      </section>

      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <ReinforcementLearningPlayground />
      </section>

      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The RL loop</h2>
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
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Major method families</h2>
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
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">Why RL matters for modern AI</h2>
        <p className="text-muted leading-relaxed mb-4">
          RL is the conceptual bridge between passive prediction and agentic behavior. Robots, game-playing systems, recommender systems, tool-using agents, and LLM post-training all use the same idea: optimize choices based on feedback from the world or a reward model.
        </p>
        <p className="text-muted leading-relaxed">
          In LLMs, RLHF and newer verifiable-reward training methods use RL-style optimization to make models more helpful, safer, or better at reasoning. The model is not merely imitating text; it is being pushed toward behavior that earns higher reward.
        </p>
      </section>
    </TopicLayout>
  )
}
