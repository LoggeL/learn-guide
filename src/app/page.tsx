'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Brain, Zap, BookOpen, ArrowRight, Cpu, MessageSquare, Layers } from 'lucide-react'
import { topics } from '@/lib/topics'

const features = [
  {
    icon: Brain,
    title: 'Interactive Demos',
    description: 'Hands-on explorations that make abstract concepts tangible and intuitive.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Layers,
    title: 'Visual Learning',
    description: 'Beautiful visualizations that reveal how AI systems actually work under the hood.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Zap,
    title: 'Build Intuition',
    description: 'Go beyond memorization—develop deep understanding through experimentation.',
    gradient: 'from-orange-500 to-red-500',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  },
}

export default function Home() {
  return (
    <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative">
      {/* Ambient background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl pointer-events-none" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative"
      >
        {/* Hero Section */}
        <motion.header variants={itemVariants} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-border mb-8">
            <Sparkles size={14} className="text-primary" />
            <span className="text-sm text-muted">Interactive AI Learning</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 leading-[1.1] tracking-tight">
            <span className="text-gradient">Master AI Concepts</span>
            <br />
            <span className="text-text">Through Experience</span>
          </h1>
          
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed mb-10">
            Explore artificial intelligence and large language models through 
            beautiful, interactive demonstrations. Learn by doing, not just reading.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/ai/llm/temperature" 
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              Start Learning
              <ArrowRight size={18} />
            </Link>
            <Link 
              href="#topics" 
              className="btn-secondary inline-flex items-center gap-2"
            >
              Browse Topics
            </Link>
          </div>
        </motion.header>

        {/* Feature Cards */}
        <motion.section variants={itemVariants} className="mb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                    <feature.icon size={22} className="text-text" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2 font-heading">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Topic Cards */}
        <motion.section variants={itemVariants} id="topics" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5">
              <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                <BookOpen size={18} className="text-primary-light" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading text-text">Explore Topics</h2>
              <p className="text-sm text-muted">Dive into interactive lessons</p>
            </div>
          </div>

          <div className="space-y-6">
            {topics.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + categoryIndex * 0.1 }}
                className="rounded-2xl bg-surface/50 border border-border overflow-hidden"
              >
                {/* Category Header */}
                <div className="px-6 py-4 bg-surface-elevated border-b border-border flex items-center gap-3">
                  <Cpu size={18} className="text-primary" />
                  <h3 className="font-semibold text-text font-heading">{category.name}</h3>
                </div>
                
                {/* Topics Grid */}
                <div className="p-4">
                  {category.children?.map((topic) => (
                    <div key={topic.id} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 px-3 py-2 text-muted text-sm">
                        <MessageSquare size={14} />
                        <span>{topic.name}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-3">
                        {topic.children?.map((subtopic, idx) => (
                          <Link
                            key={subtopic.id}
                            href={subtopic.path || '#'}
                            className="group relative flex items-center gap-3 p-4 rounded-xl bg-background border border-border hover:border-primary/40 hover:bg-surface-elevated transition-all duration-200"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                              <span className="text-xs font-mono text-primary-light font-medium">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-text group-hover:text-primary-light transition-colors">
                                {subtopic.name}
                              </span>
                            </div>
                            <ArrowRight size={14} className="text-muted group-hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Keyboard Shortcut Hint */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-surface border border-border text-sm text-muted">
            <span>Pro tip: Press</span>
            <kbd className="px-2 py-1 bg-background rounded-md text-xs font-mono text-text border border-border">
              Ctrl+K
            </kbd>
            <span>to search topics</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
