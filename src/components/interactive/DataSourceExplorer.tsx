'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, ChevronDown, Filter } from 'lucide-react'

type Category = 'legitimate' | 'controversial' | 'synthetic'
type FilterTab = 'all' | Category

interface DataSource {
  name: string
  category: Category
  scale: string
  description: string
  notableFor: string
}

const DATA_SOURCES: DataSource[] = [
  // Legitimate
  {
    name: 'Common Crawl',
    category: 'legitimate',
    scale: '~250B pages',
    description: 'Massive web crawl archive maintained since 2008. Provides petabytes of raw web data collected by crawling the public internet monthly.',
    notableFor: 'Foundation of nearly every large-scale training dataset. Used directly or as a base for C4, OSCAR, RefinedWeb, and FineWeb.',
  },
  {
    name: 'Wikipedia',
    category: 'legitimate',
    scale: '~4B tokens',
    description: 'Full dumps of Wikipedia across multiple languages. One of the highest quality freely available text sources with broad factual coverage.',
    notableFor: 'Included in virtually every LLM training mix. Its structured, encyclopedic style is valued for factual grounding.',
  },
  {
    name: 'Books (Public Domain)',
    category: 'legitimate',
    scale: '~100K+ books',
    description: 'Collections of public domain books, primarily from Project Gutenberg and similar archives. Includes literary classics and historical texts.',
    notableFor: 'Provides long-form, high-quality prose. Part of the original GPT training data via BookCorpus.',
  },
  {
    name: 'GitHub (Public Repos)',
    category: 'legitimate',
    scale: '~1TB code',
    description: 'Source code from millions of public GitHub repositories. Covers all major programming languages and includes documentation, READMEs, and issues.',
    notableFor: 'Core training data for Codex, StarCoder, and Code Llama. The Stack v2 curated 67.5TB from Software Heritage.',
  },
  {
    name: 'Academic Papers',
    category: 'legitimate',
    scale: '~100M papers',
    description: 'Open-access papers from sources like Semantic Scholar, arXiv, PubMed, and CORE. Covers scientific and technical knowledge.',
    notableFor: 'Key source for scientific reasoning abilities. peS2o (Semantic Scholar) contains 40M full-text papers.',
  },
  {
    name: 'The Pile',
    category: 'legitimate',
    scale: '825 GB',
    description: 'Curated dataset by EleutherAI combining 22 diverse sub-datasets. Designed for broad coverage of human knowledge.',
    notableFor: 'Used to train GPT-NeoX, Pythia, and many open-source models. Set the standard for diverse, curated training mixes.',
  },
  {
    name: 'RedPajama',
    category: 'legitimate',
    scale: '~30T tokens',
    description: 'Open reproduction of the LLaMA training dataset by Together AI. RedPajama-v2 is one of the largest open pre-training datasets.',
    notableFor: 'Enabled open-source model training at scale. Includes quality signals and deduplication metadata for filtering.',
  },
  {
    name: 'FineWeb',
    category: 'legitimate',
    scale: '15T tokens',
    description: 'High-quality web dataset by HuggingFace, derived from 96 Common Crawl snapshots with extensive filtering and deduplication.',
    notableFor: 'State-of-the-art data quality pipeline. FineWeb-Edu subset (1.3T tokens) specifically filtered for educational content.',
  },

  // Controversial
  {
    name: 'Books3 / Library Genesis',
    category: 'controversial',
    scale: '~196K books',
    description: 'Pirated book collection scraped from shadow libraries. Contains copyrighted novels, textbooks, and non-fiction works without permission.',
    notableFor: 'Part of The Pile. Sparked major lawsuits (Authors Guild v. OpenAI). Removed from some datasets after legal pressure.',
  },
  {
    name: 'NYT / News Content',
    category: 'controversial',
    scale: 'Millions of articles',
    description: 'News articles from major outlets found in web crawl data. The New York Times filed a landmark lawsuit against OpenAI and Microsoft.',
    notableFor: 'NYT v. OpenAI (Dec 2023) could set precedent for all copyrighted training data. Models shown to reproduce near-verbatim excerpts.',
  },
  {
    name: 'Reddit Scraping',
    category: 'controversial',
    scale: '~15B posts',
    description: 'Reddit conversations scraped before API restrictions. Used widely for conversational and instructional data.',
    notableFor: 'Reddit signed a $60M/year deal with Google for training data. Previously free via Pushshift, now restricted. Key source for RLHF.',
  },
  {
    name: 'GDPR-Affected Data',
    category: 'controversial',
    scale: 'Unknown',
    description: 'Personal data from EU citizens collected in web crawls, potentially violating GDPR right to erasure and consent requirements.',
    notableFor: 'Italy temporarily banned ChatGPT (2023). Multiple EU DPAs investigating. "Right to be forgotten" vs. model training tension.',
  },
  {
    name: 'Art & Creative Works',
    category: 'controversial',
    scale: '~5.8B images',
    description: 'Artwork, illustrations, and photos scraped from platforms like ArtStation, DeviantArt, and Flickr. Used primarily for image model training.',
    notableFor: 'LAION-5B used for Stable Diffusion. Getty Images sued Stability AI. Artists filed class-action lawsuits over style mimicry.',
  },

  // Synthetic
  {
    name: 'Phi-3 Training Data',
    category: 'synthetic',
    scale: '~3.3T tokens',
    description: 'Microsoft\'s carefully curated mix of filtered web data and synthetic data generated by GPT-4. Emphasizes reasoning and textbook-quality content.',
    notableFor: 'Demonstrated that data quality can compensate for model size. Phi-3 Mini (3.8B) rivals much larger models on benchmarks.',
  },
  {
    name: 'Orca / OpenOrca',
    category: 'synthetic',
    scale: '~1M samples',
    description: 'Synthetic instruction-following data generated from GPT-4 and GPT-3.5 outputs. Uses system prompts to elicit detailed step-by-step reasoning.',
    notableFor: 'Pioneered "explanation tuning" — training smaller models on GPT-4\'s reasoning traces. Enabled high-quality open-source instruction models.',
  },
  {
    name: 'WizardLM / Evol-Instruct',
    category: 'synthetic',
    scale: '~250K samples',
    description: 'Evolutionary approach to instruction generation. Starts with simple prompts and iteratively makes them more complex using LLM rewriting.',
    notableFor: 'Introduced Evol-Instruct method — using LLMs to systematically increase instruction complexity. Improved coding and reasoning performance.',
  },
  {
    name: 'Nemotron-CC',
    category: 'synthetic',
    scale: '6.3T tokens',
    description: 'NVIDIA\'s synthetic-augmented dataset built by using Nemotron-4 340B to classify and rewrite Common Crawl data for higher quality.',
    notableFor: 'Largest known synthetic-enhanced dataset. Uses model-based quality filtering to upgrade web-scale data rather than generating from scratch.',
  },
  {
    name: 'Cosmopedia',
    category: 'synthetic',
    scale: '~25B tokens',
    description: 'Entirely synthetic textbook and educational content generated by Mixtral. Created by HuggingFace for the SmolLM family of models.',
    notableFor: 'Fully synthetic "textbook quality" corpus. Covers topics from primary school to graduate level. Used to train SmolLM models from scratch.',
  },
]

const CATEGORY_CONFIG: Record<Category, { label: string; color: string; bgColor: string; borderColor: string; badgeBg: string }> = {
  legitimate: {
    label: 'Legitimate',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/20',
  },
  controversial: {
    label: 'Controversial',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    badgeBg: 'bg-orange-500/20',
  },
  synthetic: {
    label: 'Synthetic',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/20',
  },
}

const TABS: { key: FilterTab; label: string; color: string; activeColor: string }[] = [
  { key: 'all', label: 'All Sources', color: 'text-muted', activeColor: 'bg-white/10 text-text' },
  { key: 'legitimate', label: 'Legitimate', color: 'text-emerald-400/70', activeColor: 'bg-emerald-500/20 text-emerald-400' },
  { key: 'controversial', label: 'Controversial', color: 'text-orange-400/70', activeColor: 'bg-orange-500/20 text-orange-400' },
  { key: 'synthetic', label: 'Synthetic', color: 'text-purple-400/70', activeColor: 'bg-purple-500/20 text-purple-400' },
]

export function DataSourceExplorer() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const filteredSources = activeTab === 'all'
    ? DATA_SOURCES
    : DATA_SOURCES.filter((s) => s.category === activeTab)

  const toggleCard = (name: string) => {
    setExpandedCard((prev) => (prev === name ? null : name))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 flex items-center justify-center">
          <Database size={18} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-text font-heading">Training Data Sources</h3>
          <p className="text-xs text-muted">Explore the datasets behind modern LLMs</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-muted" />
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key)
              setExpandedCard(null)
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? tab.activeColor
                : `${tab.color} hover:bg-surface-elevated`
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({DATA_SOURCES.filter((s) => s.category === tab.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Source Count */}
      <div className="text-xs text-muted">
        Showing {filteredSources.length} of {DATA_SOURCES.length} sources
      </div>

      {/* Cards Grid */}
      <motion.div
        layout
        className="grid gap-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredSources.map((source) => {
            const config = CATEGORY_CONFIG[source.category]
            const isExpanded = expandedCard === source.name

            return (
              <motion.div
                key={source.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <button
                  onClick={() => toggleCard(source.name)}
                  className={`w-full text-left p-4 rounded-xl bg-surface/50 border transition-colors ${
                    isExpanded ? config.borderColor : 'border-border hover:border-border/80'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-text text-sm">{source.name}</span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${config.badgeBg} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-muted whitespace-nowrap">{source.scale}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-muted" />
                    </motion.div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-border space-y-2">
                          <p className="text-sm text-muted leading-relaxed">
                            {source.description}
                          </p>
                          <div className={`text-sm leading-relaxed ${config.color}`}>
                            <span className="font-medium">Notable:</span>{' '}
                            <span className="text-muted">{source.notableFor}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        {(['legitimate', 'controversial', 'synthetic'] as Category[]).map((cat) => {
          const config = CATEGORY_CONFIG[cat]
          const count = DATA_SOURCES.filter((s) => s.category === cat).length
          return (
            <div
              key={cat}
              className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor} text-center`}
            >
              <div className={`text-lg font-bold font-mono ${config.color}`}>{count}</div>
              <div className="text-xs text-muted">{config.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
