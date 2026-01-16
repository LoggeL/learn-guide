'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { AgenticPatternsVisualizer } from '@/components/interactive/AgenticPatternsVisualizer'
import { Lightbulb, Zap, GitBranch, Users, Route, ArrowRight } from 'lucide-react'

const patternCards = [
  {
    id: 'react',
    name: 'ReAct',
    tagline: 'Reasoning + Acting',
    description: 'Interleave thinking and action in a tight loop. The foundational pattern.',
    icon: Zap,
    color: 'emerald',
    useCases: ['General-purpose agents', 'Tool-using assistants', 'Research tasks'],
  },
  {
    id: 'reflection',
    name: 'Reflection',
    tagline: 'Self-Critique Loop',
    description: 'Generate, analyze, and iteratively improve output quality.',
    icon: Lightbulb,
    color: 'purple',
    useCases: ['Code review', 'Writing improvement', 'Quality assurance'],
  },
  {
    id: 'plan-execute',
    name: 'Plan-and-Execute',
    tagline: 'Think First, Act Later',
    description: 'Create a complete plan before taking any action.',
    icon: GitBranch,
    color: 'cyan',
    useCases: ['Complex workflows', 'Multi-step procedures', 'Project planning'],
  },
  {
    id: 'multi-agent',
    name: 'Multi-Agent',
    tagline: 'Specialized Collaboration',
    description: 'Multiple expert agents work together on subtasks.',
    icon: Users,
    color: 'orange',
    useCases: ['Software teams', 'Research collaboration', 'Complex analysis'],
  },
  {
    id: 'router',
    name: 'Router',
    tagline: 'Classify and Delegate',
    description: 'Route requests to the most appropriate specialist.',
    icon: Route,
    color: 'pink',
    useCases: ['Customer support', 'API gateways', 'Intent classification'],
  },
]

const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  emerald: { bg: 'from-emerald-500/5 to-teal-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', iconBg: 'from-emerald-500/20 to-teal-500/20' },
  purple: { bg: 'from-purple-500/5 to-pink-500/5', border: 'border-purple-500/20', text: 'text-purple-400', iconBg: 'from-purple-500/20 to-pink-500/20' },
  cyan: { bg: 'from-cyan-500/5 to-blue-500/5', border: 'border-cyan-500/20', text: 'text-cyan-400', iconBg: 'from-cyan-500/20 to-blue-500/20' },
  orange: { bg: 'from-orange-500/5 to-amber-500/5', border: 'border-orange-500/20', text: 'text-orange-400', iconBg: 'from-orange-500/20 to-amber-500/20' },
  pink: { bg: 'from-pink-500/5 to-rose-500/5', border: 'border-pink-500/20', text: 'text-pink-400', iconBg: 'from-pink-500/20 to-rose-500/20' },
}

export default function AgenticPatternsPage() {
  return (
    <TopicLayout
      title="Agentic Patterns"
      description="Master the five fundamental design patterns for building AI agents: ReAct, Reflection, Plan-and-Execute, Multi-Agent, and Router."
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'Agents', href: '/' },
        { label: 'Agentic Patterns' },
      ]}
      prevTopic={{ label: 'Agent Security', href: '/ai/agents/security' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Why Patterns Matter</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            Just as software engineering has design patterns like MVC and Observer, 
            <span className="text-primary-light font-semibold"> agentic AI has its own patterns</span> for 
            organizing how agents think, plan, and act.
          </p>
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <p className="text-xl text-text font-heading font-semibold mb-0">
              Understanding these patterns helps you choose the right architecture for your use case 
              and avoid reinventing the wheel.
            </p>
          </div>
          <p className="text-muted leading-relaxed mt-6">
            Each pattern represents a different tradeoff between <strong className="text-text">latency</strong>, 
            <strong className="text-text"> accuracy</strong>, <strong className="text-text">complexity</strong>, and 
            <strong className="text-text"> cost</strong>. Let's explore the five most important ones.
          </p>
        </div>
      </section>

      {/* Pattern Cards Overview */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The Five Patterns</h2>
        <div className="grid gap-4">
          {patternCards.map((pattern) => {
            const colors = colorClasses[pattern.color]
            const Icon = pattern.icon
            return (
              <div
                key={pattern.id}
                className={`p-5 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} transition-all hover:scale-[1.01]`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={24} className={colors.text} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold font-heading ${colors.text}`}>{pattern.name}</h3>
                      <span className="text-xs text-muted">— {pattern.tagline}</span>
                    </div>
                    <p className="text-sm text-muted">{pattern.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pattern.useCases.map((useCase) => (
                      <span
                        key={useCase}
                        className="px-2 py-1 text-xs rounded-md bg-surface border border-border text-muted"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Interactive Visualizer */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔄</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">Interactive Comparison</h2>
            <p className="text-sm text-muted">Click through each pattern to see how it flows</p>
          </div>
        </div>
        <AgenticPatternsVisualizer />
      </section>

      {/* Pattern 1: ReAct */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-3">
          <Zap size={20} className="text-emerald-400" />
          <h3 className="font-semibold text-text font-heading">Pattern #1: ReAct (Reasoning + Acting)</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            <strong className="text-text">ReAct</strong> is the foundational agentic pattern. It interleaves 
            <span className="text-emerald-400 font-semibold"> reasoning</span> (thinking about what to do) with 
            <span className="text-cyan-400 font-semibold"> acting</span> (executing tools). The LLM explicitly 
            writes out its thought process before each action.
          </p>

          <div className="p-4 rounded-xl bg-background border border-border">
            <h4 className="text-sm font-semibold text-text mb-3">How It Works</h4>
            <div className="flex flex-col md:flex-row gap-4 text-sm">
              <div className="flex-1 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="text-purple-400 font-semibold mb-1">Thought</div>
                <p className="text-muted text-xs">"I need to find the user's order. Let me search the database..."</p>
              </div>
              <div className="flex items-center justify-center text-muted">
                <ArrowRight size={16} />
              </div>
              <div className="flex-1 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-emerald-400 font-semibold mb-1">Action</div>
                <p className="text-muted text-xs">search_orders(user_id="123")</p>
              </div>
              <div className="flex items-center justify-center text-muted">
                <ArrowRight size={16} />
              </div>
              <div className="flex-1 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <div className="text-cyan-400 font-semibold mb-1">Observation</div>
                <p className="text-muted text-xs">Found 3 orders: #001, #002, #003</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="text-sm font-semibold text-emerald-400 mb-2">Strengths</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• Simple to implement and debug</li>
                <li>• Transparent reasoning process</li>
                <li>• Works well for most use cases</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
              <h4 className="text-sm font-semibold text-orange-400 mb-2">Limitations</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• Can get stuck in loops</li>
                <li>• No upfront planning</li>
                <li>• Greedy decision making</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pattern 2: Reflection */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-purple-500/10 border-b border-purple-500/20 flex items-center gap-3">
          <Lightbulb size={20} className="text-purple-400" />
          <h3 className="font-semibold text-text font-heading">Pattern #2: Reflection</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            <strong className="text-text">Reflection</strong> adds a self-critique step. After generating output, 
            the agent (or a separate "critic" model) analyzes the result for errors, inconsistencies, or areas 
            for improvement. This creates an <span className="text-purple-400 font-semibold">iterative refinement loop</span>.
          </p>

          <div className="p-4 rounded-xl bg-background border border-border font-mono text-sm overflow-x-auto">
            <pre className="text-muted whitespace-pre-wrap">{`# Generate initial response
response = llm.generate(task)

# Reflection loop
for iteration in range(3):
    critique = llm.critique(response)  # "What's wrong with this?"
    
    if critique.score >= 0.9:
        break  # Good enough
    
    response = llm.improve(response, critique)  # Fix the issues

return response`}</pre>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <h4 className="text-sm font-semibold text-purple-400 mb-3">When to Use</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted">
              <div>
                <strong className="text-text">Code Generation</strong>
                <p className="text-xs mt-1">Self-review for bugs, style issues, edge cases</p>
              </div>
              <div>
                <strong className="text-text">Writing Tasks</strong>
                <p className="text-xs mt-1">Improve clarity, tone, and accuracy</p>
              </div>
              <div>
                <strong className="text-text">Math/Logic</strong>
                <p className="text-xs mt-1">Verify reasoning steps, catch errors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pattern 3: Plan-and-Execute */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-cyan-500/10 border-b border-cyan-500/20 flex items-center gap-3">
          <GitBranch size={20} className="text-cyan-400" />
          <h3 className="font-semibold text-text font-heading">Pattern #3: Plan-and-Execute</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Unlike ReAct's step-by-step approach, <strong className="text-text">Plan-and-Execute</strong> creates 
            a <span className="text-cyan-400 font-semibold">complete plan upfront</span> before taking any action. 
            This helps for complex tasks where you need to see the full picture.
          </p>

          <div className="p-4 rounded-xl bg-background border border-border">
            <h4 className="text-sm font-semibold text-text mb-3">Example Plan</h4>
            <div className="space-y-2 text-sm">
              {[
                { step: 1, task: 'Analyze requirements and identify dependencies', status: 'done' },
                { step: 2, task: 'Set up project structure and configuration', status: 'done' },
                { step: 3, task: 'Implement core data models', status: 'current' },
                { step: 4, task: 'Build API endpoints', status: 'pending' },
                { step: 5, task: 'Add authentication and authorization', status: 'pending' },
                { step: 6, task: 'Write tests and documentation', status: 'pending' },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    item.status === 'current'
                      ? 'bg-cyan-500/10 border border-cyan-500/20'
                      : item.status === 'done'
                        ? 'bg-emerald-500/5 opacity-60'
                        : 'bg-surface opacity-50'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono ${
                    item.status === 'current' ? 'bg-cyan-500/20 text-cyan-400' :
                    item.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-surface text-muted'
                  }`}>
                    {item.status === 'done' ? '✓' : item.step}
                  </span>
                  <span className={item.status === 'current' ? 'text-text' : 'text-muted'}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <h4 className="text-sm font-semibold text-cyan-400 mb-2">Key Insight</h4>
            <p className="text-sm text-muted">
              The plan can be <strong className="text-text">revised during execution</strong>. If step 3 reveals 
              new requirements, the planner can update steps 4-6 before continuing. This is called 
              <span className="text-cyan-400"> adaptive replanning</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Pattern 4: Multi-Agent */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-orange-500/10 border-b border-orange-500/20 flex items-center gap-3">
          <Users size={20} className="text-orange-400" />
          <h3 className="font-semibold text-text font-heading">Pattern #4: Multi-Agent</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            <strong className="text-text">Multi-Agent</strong> systems use 
            <span className="text-orange-400 font-semibold"> multiple specialized agents</span> that collaborate 
            on a task. Each agent has a specific role, persona, and set of tools. An orchestrator coordinates 
            their work.
          </p>

          <div className="p-4 rounded-xl bg-background border border-border">
            <h4 className="text-sm font-semibold text-text mb-4">Example: Software Development Team</h4>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { role: 'Architect', color: 'purple', task: 'Design system structure' },
                { role: 'Developer', color: 'emerald', task: 'Write the code' },
                { role: 'Reviewer', color: 'cyan', task: 'Check for issues' },
                { role: 'Tester', color: 'orange', task: 'Verify correctness' },
              ].map((agent) => (
                <div
                  key={agent.role}
                  className={`p-3 rounded-lg bg-${agent.color}-500/10 border border-${agent.color}-500/20 text-center`}
                >
                  <div className={`text-${agent.color}-400 font-semibold text-sm mb-1`}>{agent.role}</div>
                  <div className="text-xs text-muted">{agent.task}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
              <h4 className="text-sm font-semibold text-orange-400 mb-2">Benefits</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• Specialized expertise per agent</li>
                <li>• Parallel execution possible</li>
                <li>• Mimics real team dynamics</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <h4 className="text-sm font-semibold text-red-400 mb-2">Challenges</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• Complex coordination logic</li>
                <li>• Higher token costs</li>
                <li>• Potential for miscommunication</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pattern 5: Router */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-pink-500/10 border-b border-pink-500/20 flex items-center gap-3">
          <Route size={20} className="text-pink-400" />
          <h3 className="font-semibold text-text font-heading">Pattern #5: Router (Classifier)</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            The <strong className="text-text">Router</strong> pattern uses a classifier to 
            <span className="text-pink-400 font-semibold"> categorize incoming requests</span> and route them 
            to the appropriate specialist. It's simpler than multi-agent but highly effective for defined categories.
          </p>

          <div className="p-4 rounded-xl bg-background border border-border">
            <h4 className="text-sm font-semibold text-text mb-4">Routing Flow</h4>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <div className="p-3 rounded-lg bg-surface border border-border text-center w-full md:w-auto">
                <div className="text-muted text-xs mb-1">Input</div>
                <div className="text-text font-mono text-xs">"Track my order"</div>
              </div>
              <ArrowRight size={16} className="text-muted rotate-90 md:rotate-0" />
              <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20 text-center w-full md:w-auto">
                <div className="text-pink-400 font-semibold">Classifier</div>
                <div className="text-xs text-muted mt-1">→ ORDER_STATUS</div>
              </div>
              <ArrowRight size={16} className="text-muted rotate-90 md:rotate-0" />
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center w-full md:w-auto">
                <div className="text-emerald-400 font-semibold">Order Agent</div>
                <div className="text-xs text-muted mt-1">Specialized handler</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/20">
            <h4 className="text-sm font-semibold text-pink-400 mb-2">Common Routing Categories</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Billing', 'Technical Support', 'Sales', 'Returns', 'Account', 'General'].map((cat) => (
                <span key={cat} className="px-2 py-1 rounded bg-surface border border-border text-muted">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* When to Use Which */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Choosing the Right Pattern</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted font-normal">Pattern</th>
                <th className="text-left p-3 text-muted font-normal">Best For</th>
                <th className="text-left p-3 text-muted font-normal">Latency</th>
                <th className="text-left p-3 text-muted font-normal">Complexity</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 text-emerald-400 font-semibold">ReAct</td>
                <td className="p-3 text-muted">General tasks, simple workflows</td>
                <td className="p-3 text-muted">Medium</td>
                <td className="p-3 text-muted">Low</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 text-purple-400 font-semibold">Reflection</td>
                <td className="p-3 text-muted">Quality-critical outputs</td>
                <td className="p-3 text-muted">High</td>
                <td className="p-3 text-muted">Low</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 text-cyan-400 font-semibold">Plan-Execute</td>
                <td className="p-3 text-muted">Multi-step, dependent tasks</td>
                <td className="p-3 text-muted">High</td>
                <td className="p-3 text-muted">Medium</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 text-orange-400 font-semibold">Multi-Agent</td>
                <td className="p-3 text-muted">Complex, expert-requiring tasks</td>
                <td className="p-3 text-muted">Very High</td>
                <td className="p-3 text-muted">High</td>
              </tr>
              <tr>
                <td className="p-3 text-pink-400 font-semibold">Router</td>
                <td className="p-3 text-muted">Categorized request handling</td>
                <td className="p-3 text-muted">Low</td>
                <td className="p-3 text-muted">Low</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <p className="text-text font-medium">
            <span className="text-primary-light">Pro tip:</span> These patterns can be combined. A Router 
            can delegate to agents using ReAct. A Plan-and-Execute system can use Reflection on each step. 
            Start simple, then compose as needed.
          </p>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Key Takeaways</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              'ReAct is the default pattern—start here for most agent tasks',
              'Reflection improves quality at the cost of latency',
              'Plan-and-Execute shines for complex, multi-step workflows',
              'Multi-Agent systems mirror human team collaboration',
              'Router pattern efficiently categorizes and delegates requests',
              'Patterns can be combined and nested for sophisticated systems',
              'Choose based on your latency, accuracy, and cost constraints',
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
