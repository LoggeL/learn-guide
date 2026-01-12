'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { AgentLoopVisualizer } from '@/components/interactive/AgentLoopVisualizer'

export default function AgentBasicsPage() {
  return (
    <TopicLayout
      title="Agent Basics"
      description="Demystifying AI agents: they're just LLMs in a while loop with tools. Learn the fundamental pattern that powers every AI agent."
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'Agents', href: '/' },
        { label: 'Basics' },
      ]}
      nextTopic={{ label: 'Context Rot', href: '/ai/llm/context-rot' }}
    >
      {/* The Big Reveal */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The Truth About AI Agents</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            There's a lot of mystique around <span className="text-primary-light font-semibold">AI agents</span>. 
            People imagine complex architectures, sophisticated reasoning engines, and elaborate state machines.
          </p>
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <p className="text-xl text-text font-heading font-semibold mb-0">
              The reality? An agent is just an LLM running in a <code className="px-2 py-1 rounded bg-surface-elevated text-primary-light">while</code> loop.
            </p>
          </div>
          <p className="text-muted leading-relaxed mt-6">
            That's it. The LLM generates a response, and if that response contains a <strong className="text-text">tool call</strong>, 
            we execute the tool, add the result to the context, and loop again. When there's no tool call, we return the final response.
          </p>
        </div>
      </section>

      {/* The Pseudocode */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The Core Pattern</h2>
        <div className="rounded-2xl bg-background border border-border p-6 md:p-8 font-mono text-sm md:text-base overflow-x-auto">
          <pre className="text-muted">
            <code>
              <span className="text-purple-400">context</span> = [<span className="text-yellow-400">system_prompt</span>, <span className="text-orange-400">tool_definitions</span>]{'\n'}
              <span className="text-purple-400">context</span>.<span className="text-cyan-400">append</span>(<span className="text-cyan-400">user_message</span>){'\n\n'}
              <span className="text-pink-400">while</span> <span className="text-cyan-400">True</span>:{'\n'}
              {'  '}<span className="text-purple-400">response</span> = <span className="text-yellow-400">llm</span>(<span className="text-purple-400">context</span>){'\n\n'}
              {'  '}<span className="text-pink-400">if</span> response.<span className="text-cyan-400">has_tool_call</span>:{'\n'}
              {'    '}<span className="text-muted">{'# Execute the tool and add result to context'}</span>{'\n'}
              {'    '}<span className="text-purple-400">result</span> = <span className="text-yellow-400">execute_tool</span>(response.<span className="text-cyan-400">tool_call</span>){'\n'}
              {'    '}<span className="text-purple-400">context</span>.<span className="text-cyan-400">append</span>(response){'\n'}
              {'    '}<span className="text-purple-400">context</span>.<span className="text-cyan-400">append</span>(<span className="text-purple-400">result</span>){'\n'}
              {'    '}<span className="text-pink-400">continue</span>  <span className="text-muted">{'# Loop again'}</span>{'\n\n'}
              {'  '}<span className="text-pink-400">else</span>:{'\n'}
              {'    '}<span className="text-muted">{'# No tool call = final answer'}</span>{'\n'}
              {'    '}<span className="text-pink-400">return</span> response.<span className="text-cyan-400">content</span>
            </code>
          </pre>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🔄</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">Watch It In Action</h2>
            <p className="text-sm text-muted">See how the context builds up through the loop</p>
          </div>
        </div>
        <p className="text-muted mb-8 leading-relaxed">
          Press <strong className="text-primary-light">Play</strong> to watch the agent loop execute step by step. 
          Notice how each piece gets added to the context, and how the LLM sees <em>everything</em> on each iteration.
        </p>
        <AgentLoopVisualizer />
      </section>

      {/* Anatomy of Context */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Anatomy of the Context</h2>
        <div className="grid gap-4">
          {[
            {
              type: 'System Prompt',
              color: 'purple',
              desc: 'Instructions that define the agent\'s behavior, personality, and constraints. Stays at the top of context.',
              example: '"You are a helpful assistant. Be concise."'
            },
            {
              type: 'Tool Definitions',
              color: 'orange',
              desc: 'JSON schemas describing available tools—their names, parameters, and what they do. The LLM uses these to decide when and how to call tools.',
              example: '{ "name": "get_weather", "params": { "city": "string" } }'
            },
            {
              type: 'User Messages',
              color: 'cyan',
              desc: 'The human\'s input. Each user message gets appended to the context before calling the LLM.',
              example: '"What\'s the weather in Tokyo?"'
            },
            {
              type: 'Assistant Messages',
              color: 'emerald',
              desc: 'The LLM\'s responses. These can be plain text OR contain tool calls.',
              example: '"The weather in Tokyo is sunny and 22°C!"'
            },
            {
              type: 'Tool Calls',
              color: 'yellow',
              desc: 'When the LLM wants to use a tool, it outputs a structured tool call instead of plain text.',
              example: '{ "tool": "get_weather", "args": { "city": "Tokyo" } }'
            },
            {
              type: 'Tool Results',
              color: 'blue',
              desc: 'The output from executing a tool. This gets added to context so the LLM can use the information.',
              example: '{ "temp": 22, "condition": "sunny" }'
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex gap-5 p-5 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center shrink-0`}>
                <span className={`text-lg font-bold text-${item.color}-400`}>{i + 1}</span>
              </div>
              <div>
                <h3 className={`text-${item.color}-400 font-semibold font-heading mb-1`}>{item.type}</h3>
                <p className="text-muted text-sm leading-relaxed mb-2">{item.desc}</p>
                <code className="text-xs px-2 py-1 rounded bg-surface-elevated text-text/80 font-mono">
                  {item.example}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why This Matters */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Why This Simplicity Matters</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20">
            <h3 className="text-emerald-400 font-semibold font-heading mb-2">Easy to Debug</h3>
            <p className="text-sm text-muted">
              Since everything is just messages in a list, you can log the entire context at any point 
              and see exactly what the LLM saw when it made its decision.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
            <h3 className="text-cyan-400 font-semibold font-heading mb-2">Easy to Extend</h3>
            <p className="text-sm text-muted">
              Want to add memory? Append past conversations. Want RAG? Append retrieved documents. 
              It's all just adding more messages to the context.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
            <h3 className="text-purple-400 font-semibold font-heading mb-2">Context is Everything</h3>
            <p className="text-sm text-muted">
              The LLM has no memory between calls. Its entire "understanding" comes from what's in the context. 
              This is why prompt engineering and context management are so critical.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
            <h3 className="text-orange-400 font-semibold font-heading mb-2">Limitations are Clear</h3>
            <p className="text-sm text-muted">
              Context windows are finite. Long conversations cause "context rot" where early instructions 
              lose influence. Understanding the loop helps you design around these limits.
            </p>
          </div>
        </div>
      </section>

      {/* Key takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Key Takeaways</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              'An AI agent is just an LLM in a while loop that can call tools',
              'The context (message list) is the LLM\'s entire world—it has no other memory',
              'Tool calls trigger another loop iteration; no tool call = final response',
              'All the "magic" comes from what you put in the context and how you structure it',
              'Understanding this pattern makes debugging, extending, and optimizing agents much easier',
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
