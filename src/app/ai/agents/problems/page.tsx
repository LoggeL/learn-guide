'use client'

import Link from 'next/link'
import { TopicLayout } from '@/components/layout/TopicLayout'
import { AlertTriangle, Wrench, Link2, Database, TrendingUp } from 'lucide-react'

export default function AgentProblemsPage() {
  return (
    <TopicLayout
      title="Agent Problems"
      description="Critical issues that emerge from the agent architecture: context bloat, long chains, and result explosion."
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'Agents', href: '/' },
        { label: 'Problems' },
      ]}
      prevTopic={{ label: 'Context Anatomy', href: '/ai/agents/context' }}
      nextTopic={{ label: 'Agent Security', href: '/ai/agents/security' }}
    >
      {/* Intro */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-gradient mb-4">The Dark Side of Simplicity</h2>
            <p className="text-muted leading-relaxed text-lg">
              The simple while-loop architecture that makes agents easy to understand also creates 
              <span className="text-red-400 font-semibold"> inherent limitations</span>. Most problems 
              stem from one root cause: the finite context window.
            </p>
          </div>
        </div>
      </section>

      {/* Problem 1: Giant Tool Definitions */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-orange-500/10 border-b border-orange-500/20 flex items-center gap-3">
          <Wrench size={20} className="text-orange-400" />
          <h3 className="font-semibold text-text font-heading">Problem #1: Giant Tool Definitions</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Tool definitions are included in <strong className="text-text">every single LLM call</strong>. 
            If you have 50 tools with detailed schemas and descriptions, that might be 
            <span className="text-orange-400 font-semibold"> 5,000+ tokens</span> consumed before you even start.
          </p>
          
          {/* Visual */}
          <div className="p-6 rounded-xl bg-background border border-border">
            <p className="text-sm text-muted mb-4">Context usage with 50 tools (16K window):</p>
            <div className="h-8 rounded-full bg-surface-elevated overflow-hidden flex">
              <div className="h-full w-[35%] bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-end pr-2">
                <span className="text-[10px] font-mono text-white">Tools 35%</span>
              </div>
              <div className="h-full w-[10%] bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center">
                <span className="text-[10px] font-mono text-white">Sys</span>
              </div>
              <div className="h-full flex-1 bg-surface-elevated flex items-center pl-4">
                <span className="text-[10px] font-mono text-muted">← Only 55% left for actual work</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <h4 className="text-sm font-semibold text-red-400 mb-2">The Problem</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• Less space for conversation history</li>
                <li>• Faster context rot</li>
                <li>• Higher API costs (pay per token)</li>
                <li>• Slower responses (more to process)</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="text-sm font-semibold text-emerald-400 mb-2">Mitigations</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• <strong className="text-text">Dynamic loading</strong> — only include relevant tools</li>
                <li>• <strong className="text-text">Tool categories</strong> — let agent request a category</li>
                <li>• <strong className="text-text">Brief descriptions</strong> — expand on demand</li>
                <li>• <strong className="text-text">Tool consolidation</strong> — combine related tools</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Problem 2: Long Agent Chains */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-purple-500/10 border-b border-purple-500/20 flex items-center gap-3">
          <Link2 size={20} className="text-purple-400" />
          <h3 className="font-semibold text-text font-heading">Problem #2: Long Agent Chains</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Every tool call adds to the context: the call itself, the result, and the LLM's interpretation.
            After 10-20 iterations, your context is <strong className="text-text">overflowing</strong> and early 
            instructions start getting pushed out or ignored.
          </p>
          
          {/* Visual */}
          <div className="p-4 rounded-xl bg-background border border-border font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 opacity-30">
              <span className="w-24 text-purple-400 shrink-0">System:</span>
              <span className="text-muted truncate">You are a careful analyst...</span>
              <span className="text-red-400/50 text-[10px] shrink-0">FORGOTTEN</span>
            </div>
            <div className="flex items-center gap-2 opacity-40">
              <span className="w-24 text-orange-400 shrink-0">Tools:</span>
              <span className="text-muted truncate">[50 tool definitions...]</span>
              <span className="text-red-400/50 text-[10px] shrink-0">FADING</span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-24 text-cyan-400 shrink-0">User #1:</span>
              <span className="text-muted truncate">Analyze this dataset...</span>
              <span className="text-yellow-400/50 text-[10px] shrink-0">WEAK</span>
            </div>
            <div className="text-muted/40 pl-24">... 12 tool calls and results ...</div>
            <div className="flex items-center gap-2 opacity-70">
              <span className="w-24 text-blue-400 shrink-0">Tool #13:</span>
              <span className="text-muted truncate">{"{ result: 'intermediate data' }"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 text-blue-400 shrink-0">Tool #14:</span>
              <span className="text-text truncate">{"{ result: 'latest data' }"}</span>
              <span className="text-emerald-400/50 text-[10px] shrink-0">← ATTENTION HERE</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <h4 className="text-sm font-semibold text-purple-400 mb-3">This is Context Rot in action</h4>
            <p className="text-sm text-muted mb-4">
              The LLM's attention naturally focuses on recent content. Early instructions lose influence 
              even before they're pushed out of the window entirely.
            </p>
            <Link 
              href="/ai/llm/context-rot" 
              className="inline-flex items-center gap-2 text-primary-light hover:text-primary text-sm font-medium"
            >
              Learn more about Context Rot →
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">Mitigations</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>• <strong className="text-text">Conversation summarization</strong> — compress old messages periodically</li>
              <li>• <strong className="text-text">Sliding window</strong> — keep last N messages, summarize the rest</li>
              <li>• <strong className="text-text">Task decomposition</strong> — break into sub-agents with fresh contexts</li>
              <li>• <strong className="text-text">Instruction anchoring</strong> — repeat critical instructions at the end</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Problem 3: Tool Result Explosion */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-blue-500/10 border-b border-blue-500/20 flex items-center gap-3">
          <Database size={20} className="text-blue-400" />
          <h3 className="font-semibold text-text font-heading">Problem #3: Tool Result Explosion</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Tool results can be <strong className="text-text">arbitrarily large</strong>. A database query might return 
            10,000 rows. A web search might return entire articles. An API might return deeply nested JSON.
            <span className="text-red-400"> All of this goes into the context.</span>
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-background border border-border text-center">
              <p className="text-3xl font-bold text-blue-400">10K</p>
              <p className="text-xs text-muted mt-1">tokens from one<br/>SQL query result</p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border text-center">
              <p className="text-3xl font-bold text-blue-400">8K</p>
              <p className="text-xs text-muted mt-1">tokens from one<br/>web page scrape</p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border text-center">
              <p className="text-3xl font-bold text-blue-400">5K</p>
              <p className="text-xs text-muted mt-1">tokens from one<br/>API response</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <h4 className="text-sm font-semibold text-red-400 mb-2">Worst Case Scenario</h4>
            <p className="text-sm text-muted">
              A single tool call returns more tokens than the entire context window can hold. 
              The result gets truncated, the agent loses critical information, and behavior becomes unpredictable.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">Mitigations</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>• <strong className="text-text">Hard truncation</strong> — limit results to first N items/characters</li>
              <li>• <strong className="text-text">Smart summarization</strong> — use another LLM call to compress results</li>
              <li>• <strong className="text-text">Pagination</strong> — return partial results, let agent request more</li>
              <li>• <strong className="text-text">Selective fields</strong> — only return fields the agent asked for</li>
              <li>• <strong className="text-text">Pre-filtering</strong> — filter at the data source level</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Problem 4: Cost Explosion */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center gap-3">
          <TrendingUp size={20} className="text-yellow-400" />
          <h3 className="font-semibold text-text font-heading">Problem #4: Compounding Costs</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Because the full context is sent on <strong className="text-text">every LLM call</strong>, costs grow 
            quadratically with conversation length. Each new message means re-sending everything that came before.
          </p>
          
          <div className="p-4 rounded-xl bg-background border border-border">
            <p className="text-sm text-muted mb-3">Token usage per call in a 10-step agent chain:</p>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted w-16">Call #{i}</span>
                  <div className="flex-1 h-4 rounded-full bg-surface-elevated overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                      style={{ width: `${i * 20}%` }}
                    />
                  </div>
                  <span className="text-xs text-yellow-400 font-mono w-16">{i * 2}K tok</span>
                </div>
              ))}
              <div className="text-xs text-muted text-center pt-2">
                Total: 2K + 4K + 6K + 8K + 10K = <span className="text-yellow-400 font-bold">30K tokens</span> (not 10K!)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <h4 className="text-sm font-semibold text-yellow-400 mb-2">Cost Implications</h4>
            <p className="text-sm text-muted">
              A 20-step agent chain might use 10x more tokens than you'd naively expect. 
              This is why aggressive context management isn't just about quality—it's about cost control.
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
              'Tool definitions consume context on every call—keep them lean',
              'Long agent chains cause context rot—early instructions fade',
              'Tool results can explode context—always truncate or summarize',
              'Costs compound quadratically—context management is cost management',
              'Most problems trace back to one root cause: finite context windows',
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
