'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { 
  GitBranch, 
  Type, 
  Grid3X3, 
  ArrowRight, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Puzzle,
  Map,
  BarChart3,
  FileText
} from 'lucide-react'

const challengeCategories = [
  {
    id: 'flowcharts',
    title: 'Flowcharts & Diagrams',
    icon: GitBranch,
    difficulty: 'Very Hard',
    color: 'red',
    description: 'Following arrows, understanding sequence, parsing decision nodes',
  },
  {
    id: 'text-in-images',
    title: 'Text in Images',
    icon: Type,
    difficulty: 'Hard',
    color: 'orange',
    description: 'OCR-like tasks, especially with unusual fonts or orientations',
  },
  {
    id: 'spatial',
    title: 'Spatial Reasoning',
    icon: Map,
    difficulty: 'Hard',
    color: 'purple',
    description: 'Understanding relative positions, distances, and layouts',
  },
  {
    id: 'charts',
    title: 'Charts & Graphs',
    icon: BarChart3,
    difficulty: 'Medium',
    color: 'cyan',
    description: 'Extracting precise values, comparing data points',
  },
  {
    id: 'tables',
    title: 'Tables & Spreadsheets',
    icon: Grid3X3,
    difficulty: 'Medium',
    color: 'emerald',
    description: 'Row-column relationships, cell references',
  },
  {
    id: 'documents',
    title: 'Document Layout',
    icon: FileText,
    difficulty: 'Medium',
    color: 'pink',
    description: 'Multi-column text, headers, sidebars, footnotes',
  },
]

export default function VisualChallengesPage() {
  return (
    <TopicLayout
      title="Visual Challenges"
      description="Why flowcharts break vision models: understanding the fundamental limitations of how LLMs process structured visual information."
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'LLM', href: '/' },
        { label: 'Visual Challenges' },
      ]}
      prevTopic={{ label: 'Vision & Images', href: '/ai/llm/vision' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-gradient mb-4">The Limits of Vision</h2>
            <p className="text-muted leading-relaxed text-lg">
              Despite impressive capabilities, vision-language models have <span className="text-red-400 font-semibold">systematic blind spots</span>. 
              Certain visual patterns that are trivial for humans remain surprisingly difficult for AI. 
              Understanding <em>why</em> helps you work around these limitations.
            </p>
          </div>
        </div>
      </section>

      {/* Challenge Overview Cards */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Common Challenge Types</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challengeCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <div
                key={cat.id}
                className={`p-5 rounded-xl bg-${cat.color}-500/5 border border-${cat.color}-500/20 transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-${cat.color}-500/20 flex items-center justify-center`}>
                    <Icon size={20} className={`text-${cat.color}-400`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-${cat.color}-400`}>{cat.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-${cat.color}-500/20 text-${cat.color}-400`}>
                      {cat.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted">{cat.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Deep Dive: Flowcharts */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-red-500/10 border-b border-red-500/20 flex items-center gap-3">
          <GitBranch size={20} className="text-red-400" />
          <h3 className="font-semibold text-text font-heading">Why Flowcharts Break Vision Models</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Flowcharts are perhaps the <strong className="text-text">hardest visual format</strong> for 
            current vision models. Here's a breakdown of why:
          </p>

          {/* Problem 1: Patch Boundaries */}
          <div className="p-4 rounded-xl bg-background border border-border">
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={18} className="text-red-400" />
              <h4 className="font-semibold text-text">Problem 1: Arrows Cross Patch Boundaries</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted mb-4">
                  An arrow connecting two boxes might span 5-10 different patches. Each patch only sees 
                  a <span className="text-text">fragment</span> of the arrow—a few pixels of a line. The model 
                  must reconstruct the full arrow from disconnected pieces.
                </p>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-muted">
                    <span className="text-red-400 font-semibold">Result:</span> Models often miss connections, 
                    invert arrow directions, or hallucinate non-existent arrows.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-surface-elevated border border-border">
                <div className="grid grid-cols-4 gap-1 text-xs">
                  {/* Simulated patch grid with an arrow */}
                  {[
                    '□', '□', '→', '□',
                    '□', '○', '─', '─',
                    '□', '│', '□', '□',
                    '□', '○', '□', '□',
                  ].map((cell, i) => (
                    <div 
                      key={i} 
                      className={`p-2 rounded text-center ${
                        ['→', '─', '│'].includes(cell) 
                          ? 'bg-red-500/20 text-red-400' 
                          : cell === '○' 
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-surface text-muted'
                      }`}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted mt-2 text-center">
                  Arrow fragments isolated across patches
                </p>
              </div>
            </div>
          </div>

          {/* Problem 2: Sequential Logic */}
          <div className="p-4 rounded-xl bg-background border border-border">
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={18} className="text-red-400" />
              <h4 className="font-semibold text-text">Problem 2: Order Requires Global Reasoning</h4>
            </div>
            <p className="text-sm text-muted mb-4">
              Flowcharts encode <strong className="text-text">sequential logic</strong>: "First A, then if X do B, 
              else do C." Understanding this requires:
            </p>
            <ul className="text-sm text-muted space-y-2 mb-4">
              <li className="flex gap-2">
                <span className="text-orange-400">1.</span>
                <span>Identifying the start node (often implicit)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400">2.</span>
                <span>Following arrows in the correct direction</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400">3.</span>
                <span>Understanding diamond shapes as decision points</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400">4.</span>
                <span>Tracking multiple branches simultaneously</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400">5.</span>
                <span>Handling loops and merge points</span>
              </li>
            </ul>
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <p className="text-xs text-muted">
                <span className="text-orange-400 font-semibold">Why it's hard:</span> Attention must span 
                the entire image while maintaining logical state. The model sees all patches simultaneously 
                but must infer a sequential narrative.
              </p>
            </div>
          </div>

          {/* Problem 3: Text Label Association */}
          <div className="p-4 rounded-xl bg-background border border-border">
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={18} className="text-red-400" />
              <h4 className="font-semibold text-text">Problem 3: Text-Shape Association</h4>
            </div>
            <p className="text-sm text-muted mb-4">
              Each flowchart node contains text that gives it meaning. The model must:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-surface-elevated border border-border text-center">
                <div className="text-2xl mb-2">📦</div>
                <div className="text-sm text-text">Read the text</div>
                <div className="text-xs text-muted mt-1">(OCR task)</div>
              </div>
              <div className="p-3 rounded-lg bg-surface-elevated border border-border text-center">
                <div className="text-2xl mb-2">🔗</div>
                <div className="text-sm text-text">Associate with shape</div>
                <div className="text-xs text-muted mt-1">(Spatial binding)</div>
              </div>
              <div className="p-3 rounded-lg bg-surface-elevated border border-border text-center">
                <div className="text-2xl mb-2">🔀</div>
                <div className="text-sm text-text">Track through flow</div>
                <div className="text-xs text-muted mt-1">(Sequential reasoning)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive: Text in Images */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-orange-500/10 border-b border-orange-500/20 flex items-center gap-3">
          <Type size={20} className="text-orange-400" />
          <h3 className="font-semibold text-text font-heading">Text Recognition Challenges</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Reading text in images seems simple, but it exposes fundamental tensions in how vision models work:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background border border-border">
              <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} />
                What Works Well
              </h4>
              <ul className="text-sm text-muted space-y-2">
                <li>• Large, clear printed text</li>
                <li>• High contrast (black on white)</li>
                <li>• Standard fonts (Arial, Times)</li>
                <li>• Horizontal orientation</li>
                <li>• Simple backgrounds</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border">
              <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <XCircle size={16} />
                What Struggles
              </h4>
              <ul className="text-sm text-muted space-y-2">
                <li>• Small or dense text</li>
                <li>• Handwriting and cursive</li>
                <li>• Rotated or curved text</li>
                <li>• Text on complex backgrounds</li>
                <li>• Unusual fonts or stylization</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <h4 className="text-sm font-semibold text-orange-400 mb-2">The Resolution Trap</h4>
            <p className="text-sm text-muted">
              Small text often falls within a <strong className="text-text">single patch</strong>. A 16×16 
              pixel patch containing tiny text becomes a blur of averaged pixel values. Increasing resolution 
              helps but uses more tokens. There's no free lunch.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Dive: Spatial Reasoning */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-purple-500/10 border-b border-purple-500/20 flex items-center gap-3">
          <Map size={20} className="text-purple-400" />
          <h3 className="font-semibold text-text font-heading">Spatial Reasoning Limitations</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Vision models struggle with <strong className="text-text">precise spatial relationships</strong>. 
            They can recognize objects but often fail to accurately describe their positions relative to each other.
          </p>

          <div className="p-4 rounded-xl bg-background border border-border">
            <h4 className="text-sm font-semibold text-text mb-4">Common Spatial Errors</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { q: '"Is the red ball left or right of the blue box?"', issue: 'Left/right confusion' },
                { q: '"How many objects are in the top row?"', issue: 'Counting errors' },
                { q: '"Which item is closest to the center?"', issue: 'Distance estimation' },
                { q: '"Are these shapes aligned?"', issue: 'Alignment detection' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-surface-elevated border border-border">
                  <p className="text-sm text-text mb-1">"{item.q}"</p>
                  <p className="text-xs text-purple-400">Common failure: {item.issue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <h4 className="text-sm font-semibold text-purple-400 mb-2">Why Spatial Reasoning is Hard</h4>
            <p className="text-sm text-muted">
              Positional embeddings encode <em>patch</em> positions, not <em>object</em> positions. 
              The model knows patch 47 is in the middle, but must infer that the object spanning patches 
              45-49 is "centered." This requires aggregating across patch boundaries—the same problem 
              that affects arrows.
            </p>
          </div>
        </div>
      </section>

      {/* The Root Cause */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The Root Cause: Patch-Based Processing</h2>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed">
            All these challenges trace back to <strong className="text-text">how images become tokens</strong>:
          </p>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20">
            <div className="text-3xl mb-3">🧩</div>
            <h3 className="font-semibold text-text mb-2">Local Processing</h3>
            <p className="text-sm text-muted">
              Each patch is processed independently before attention. Fine details spanning patches are lost 
              in the initial projection.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
            <div className="text-3xl mb-3">📐</div>
            <h3 className="font-semibold text-text mb-2">Fixed Grid</h3>
            <p className="text-sm text-muted">
              The patch grid doesn't align with object boundaries. A single character might be split 
              across 2-4 patches.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
            <div className="text-3xl mb-3">🔀</div>
            <h3 className="font-semibold text-text mb-2">Linearization</h3>
            <p className="text-sm text-muted">
              2D images become 1D sequences. Spatial relationships must be reconstructed through attention, 
              which is imperfect.
            </p>
          </div>
        </div>
      </section>

      {/* Workarounds */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-3">
          <Puzzle size={20} className="text-emerald-400" />
          <h3 className="font-semibold text-text font-heading">Practical Workarounds</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Until models improve, here's how to get better results with challenging visuals:
          </p>

          <div className="grid gap-4">
            {[
              {
                title: 'Convert to Text First',
                desc: 'For flowcharts and diagrams, describe them in text or use structured formats like Mermaid. Let the model work with its strength.',
                example: 'graph TD; A[Start] --> B{Decision}; B -->|Yes| C[Action 1]; B -->|No| D[Action 2]',
              },
              {
                title: 'Use Higher Resolution',
                desc: 'When precision matters, use the highest resolution option. More patches = more detail (but more tokens).',
                example: 'Set detail: "high" in the API or upload larger images',
              },
              {
                title: 'Crop to Focus',
                desc: 'Instead of a full flowchart, crop to the specific section you\'re asking about. Less visual noise = better accuracy.',
                example: 'Crop just the decision node and its immediate connections',
              },
              {
                title: 'Ask Step-by-Step',
                desc: 'Break complex visual questions into simpler ones. Ask about individual elements before asking about relationships.',
                example: '"What nodes exist?" then "What does the arrow from A point to?"',
              },
              {
                title: 'Verify with Redundancy',
                desc: 'For critical information, ask the same question multiple ways or have the model explain its reasoning.',
                example: '"List all arrows" + "For each node, what are its connections?"',
              },
            ].map((tip, i) => (
              <div key={i} className="p-4 rounded-xl bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h4 className="font-semibold text-text">{tip.title}</h4>
                </div>
                <p className="text-sm text-muted mb-2">{tip.desc}</p>
                <div className="p-2 rounded bg-surface-elevated border border-border font-mono text-xs text-muted">
                  {tip.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Key Takeaways</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              'Flowcharts are extremely hard—arrows cross patches, order is implicit, text must be bound to shapes',
              'Small text often falls within single patches and gets blurred in projection',
              'Spatial reasoning fails because patch positions ≠ object positions',
              'All challenges trace to patch-based processing: local pooling, fixed grids, linearization',
              'Workaround: convert structured visuals to text formats when possible',
              'Use higher resolution for precision, but be aware of token costs',
              'Break complex visual questions into simpler, focused queries',
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
