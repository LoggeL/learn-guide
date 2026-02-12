'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { GettingStartedPlayground, LearningPath } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'
import { Globe, Zap, Cpu, ExternalLink, Clock, Code, Lightbulb, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function GettingStartedPage() {
  const { t } = useTranslation()
  const gs = t.gettingStarted

  return (
    <TopicLayout
      topicId="getting-started"
      title={gs.title}
      description={gs.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: gs.title },
      ]}
      nextTopic={{ label: t.topicNames.temperature, href: '/ai/llm/temperature' }}
    >
      {/* Why Start Here */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-gradient">{gs.whyTitle}</h2>
        </div>
        <p className="text-muted leading-relaxed text-lg">{gs.whyDesc}</p>
        <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-emerald-400 text-sm font-medium">{gs.whyPromise}</p>
        </div>
      </section>

      {/* Get a Free API Key */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{gs.getKeyTitle}</h2>
        <p className="text-muted leading-relaxed mb-6">{gs.getKeyDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {/* OpenRouter */}
          <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-bold font-heading text-violet-400">OpenRouter</h3>
            </div>
            <p className="text-sm text-muted mb-4">{gs.openrouterDesc}</p>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              {gs.getKey} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Groq */}
          <div className="rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold font-heading text-orange-400">Groq</h3>
            </div>
            <p className="text-sm text-muted mb-4">{gs.groqDesc}</p>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              {gs.getKey} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Cerebras */}
          <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold font-heading text-cyan-400">Cerebras</h3>
            </div>
            <p className="text-sm text-muted mb-4">{gs.cerebrasDesc}</p>
            <a
              href="https://cloud.cerebras.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {gs.getKey} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Your First LLM Call — Interactive Playground */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🚀</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{gs.playgroundTitle}</h2>
            <p className="text-sm text-muted">{gs.playgroundDesc}</p>
          </div>
        </div>
        <GettingStartedPlayground />
      </section>

      {/* Understanding the Response */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold font-heading text-gradient">{gs.understandTitle}</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface/30 border border-border">
            <h3 className="text-sm font-bold text-primary-light mb-1">choices[0].message.content</h3>
            <p className="text-sm text-muted">{gs.understandContent}</p>
          </div>
          <div className="p-4 rounded-xl bg-surface/30 border border-border">
            <h3 className="text-sm font-bold text-primary-light mb-1">usage.prompt_tokens / completion_tokens</h3>
            <p className="text-sm text-muted">{gs.understandTokens}</p>
          </div>
          <div className="p-4 rounded-xl bg-surface/30 border border-border">
            <h3 className="text-sm font-bold text-primary-light mb-1">finish_reason</h3>
            <p className="text-sm text-muted">{gs.understandFinish}</p>
          </div>
          <div className="p-4 rounded-xl bg-surface/30 border border-border">
            <h3 className="text-sm font-bold text-primary-light mb-1">model</h3>
            <p className="text-sm text-muted">{gs.understandModel}</p>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <LearningPath />

      {/* Next Steps */}
      <section className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-4">{gs.nextStepsTitle}</h2>
        <p className="text-muted mb-6">{gs.nextStepsDesc}</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/ai/llm/temperature" className="group p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/40 transition-all">
            <h3 className="text-sm font-bold text-text group-hover:text-primary-light transition-colors mb-1">{t.topicNames.temperature}</h3>
            <p className="text-xs text-muted">{gs.nextTemperature}</p>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary-light mt-2 transition-colors" />
          </Link>
          <Link href="/ai/prompting/system-prompts" className="group p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/40 transition-all">
            <h3 className="text-sm font-bold text-text group-hover:text-primary-light transition-colors mb-1">{t.topicNames['system-prompts']}</h3>
            <p className="text-xs text-muted">{gs.nextSystemPrompts}</p>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary-light mt-2 transition-colors" />
          </Link>
          <Link href="/ai/llm/tokenization" className="group p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/40 transition-all">
            <h3 className="text-sm font-bold text-text group-hover:text-primary-light transition-colors mb-1">{t.topicNames.tokenization}</h3>
            <p className="text-xs text-muted">{gs.nextTokenization}</p>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary-light mt-2 transition-colors" />
          </Link>
        </div>
      </section>
    </TopicLayout>
  )
}
