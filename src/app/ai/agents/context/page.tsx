'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { Settings, Wrench, MessageSquare, Terminal, CheckCircle } from 'lucide-react'

export default function AgentContextPage() {
  const contextParts = [
    {
      type: 'System Prompt',
      icon: Settings,
      color: 'purple',
      desc: 'Instructions that define the agent\'s behavior, personality, and constraints. Always stays at the top of context.',
      example: '"You are a helpful assistant. Be concise and accurate."',
      tips: [
        'Keep it focused—long system prompts consume valuable tokens',
        'Include critical constraints (what NOT to do)',
        'Consider putting the most important rules at the end too (anchoring)',
      ],
    },
    {
      type: 'Tool Definitions',
      icon: Wrench,
      color: 'orange',
      desc: 'JSON schemas describing available tools—their names, parameters, and what they do. The LLM uses these to decide when and how to call tools.',
      example: '{ "name": "get_weather", "description": "Get current weather", "parameters": { "city": "string" } }',
      tips: [
        'Good descriptions help the LLM choose the right tool',
        'Parameter descriptions reduce misuse',
        'More tools = more tokens consumed on every call',
      ],
    },
    {
      type: 'User Messages',
      icon: MessageSquare,
      color: 'cyan',
      desc: 'The human\'s input. Each user message gets appended to the context before calling the LLM.',
      example: '"What\'s the weather in Tokyo?"',
      tips: [
        'Users can inadvertently inject prompts (security risk)',
        'Long user inputs consume context space',
        'Consider summarizing very long user inputs',
      ],
    },
    {
      type: 'Tool Calls',
      icon: Terminal,
      color: 'yellow',
      desc: 'When the LLM wants to use a tool, it outputs a structured tool call instead of plain text. This triggers another loop iteration.',
      example: '{ "tool": "get_weather", "arguments": { "city": "Tokyo" } }',
      tips: [
        'Tool calls are part of the context history',
        'The LLM can see what tools it previously called',
        'Parallel tool calls are possible in some APIs',
      ],
    },
    {
      type: 'Tool Results',
      icon: CheckCircle,
      color: 'blue',
      desc: 'The output from executing a tool. This gets added to context so the LLM can use the information in its response.',
      example: '{ "temperature": 22, "condition": "sunny", "humidity": 65 }',
      tips: [
        'Results can be arbitrarily large (dangerous!)',
        'Always truncate or summarize large results',
        'Include only fields the agent needs',
      ],
    },
    {
      type: 'Assistant Messages',
      icon: MessageSquare,
      color: 'emerald',
      desc: 'The LLM\'s final responses (when not calling tools). These complete the conversation turn.',
      example: '"The weather in Tokyo is 22°C and sunny with 65% humidity!"',
      tips: [
        'Previous responses influence future ones',
        'Long response history causes context rot',
        'Consider summarizing old exchanges',
      ],
    },
  ]

  return (
    <TopicLayout
      title="Context Anatomy"
      description="Understanding what goes into an agent's context window and how each component affects behavior."
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'Agents', href: '/' },
        { label: 'Context Anatomy' },
      ]}
      prevTopic={{ label: 'The Agent Loop', href: '/ai/agents/loop' }}
      nextTopic={{ label: 'Agent Problems', href: '/ai/agents/problems' }}
    >
      {/* Intro */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The Context is the Agent's World</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            The LLM has <span className="text-primary-light font-semibold">no memory</span> between API calls. 
            Everything it knows, everything it can reference, everything that shapes its behavior—it all comes 
            from the <strong className="text-text">context window</strong>.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            Understanding what goes into the context and how each piece influences the model is essential 
            for building reliable agents.
          </p>
        </div>
      </section>

      {/* Visual Stack */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Context Stack Visualization</h2>
        <div className="rounded-2xl bg-background border border-border p-6 overflow-hidden">
          <div className="space-y-2">
            {contextParts.map((part, i) => {
              const Icon = part.icon
              return (
                <div 
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl bg-${part.color}-500/10 border border-${part.color}-500/20`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-${part.color}-500/20 flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={`text-${part.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`font-semibold text-${part.color}-400`}>{part.type}</span>
                  </div>
                  <div className="text-xs text-muted font-mono">
                    {i === 0 && '← always first'}
                    {i === 1 && '← included every call'}
                    {i >= 2 && '← grows over time'}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted">Context grows ↓ with each interaction</span>
            <span className="text-orange-400 font-mono">Until it hits the limit...</span>
          </div>
        </div>
      </section>

      {/* Detailed Breakdown */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Component Deep Dive</h2>
        <div className="space-y-6">
          {contextParts.map((part, i) => {
            const Icon = part.icon
            return (
              <div 
                key={i}
                className="rounded-2xl bg-surface border border-border overflow-hidden"
              >
                <div className={`px-6 py-4 bg-${part.color}-500/10 border-b border-${part.color}-500/20 flex items-center gap-3`}>
                  <div className={`w-10 h-10 rounded-xl bg-${part.color}-500/20 flex items-center justify-center`}>
                    <Icon size={18} className={`text-${part.color}-400`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text font-heading">{part.type}</h3>
                    <p className="text-xs text-muted">Component #{i + 1}</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-muted leading-relaxed">{part.desc}</p>
                  
                  <div className="p-4 rounded-xl bg-background border border-border">
                    <p className="text-xs text-subtle mb-2 uppercase tracking-wider">Example</p>
                    <code className="text-sm text-text font-mono">{part.example}</code>
                  </div>
                  
                  <div className={`p-4 rounded-xl bg-${part.color}-500/5 border border-${part.color}-500/20`}>
                    <p className={`text-sm font-semibold text-${part.color}-400 mb-2`}>Tips</p>
                    <ul className="text-sm text-muted space-y-1">
                      {part.tips.map((tip, j) => (
                        <li key={j} className="flex gap-2">
                          <span className={`text-${part.color}-400`}>•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Token Budget */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Typical Token Budget</h2>
        <p className="text-muted mb-6">
          Here's how context space is typically consumed in a real agent (assuming 16K token window):
        </p>
        
        <div className="space-y-4">
          {[
            { label: 'System Prompt', tokens: '500-1000', percent: 6, color: 'purple' },
            { label: 'Tool Definitions', tokens: '2000-5000', percent: 25, color: 'orange' },
            { label: 'Conversation History', tokens: '5000-8000', percent: 44, color: 'cyan' },
            { label: 'Current Request + Response', tokens: '2000-4000', percent: 19, color: 'emerald' },
            { label: 'Safety Margin', tokens: '1000', percent: 6, color: 'muted' },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={`text-${item.color}-400 font-medium`}>{item.label}</span>
                <span className="text-muted font-mono">{item.tokens} tokens</span>
              </div>
              <div className="h-3 rounded-full bg-background border border-border overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-${item.color}-500`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-400">
            <strong>Notice:</strong> Tool definitions alone can consume 25%+ of your context! 
            This is why dynamic tool loading matters for complex agents.
          </p>
        </div>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Key Takeaways</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              'The context is the LLM\'s entire world—it has no other memory',
              'System prompts and tool definitions are included on every single LLM call',
              'Context grows with each tool call and response, eventually hitting limits',
              'Tool results are the most dangerous—they can be arbitrarily large',
              'Budget your context space carefully, especially for long-running agents',
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
