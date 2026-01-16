'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { PatchGridVisualizer } from '@/components/interactive/PatchGridVisualizer'
import { Image, Grid3X3, Binary, Layers, ArrowRight, Cpu, Eye } from 'lucide-react'

export default function VisionEmbeddingsPage() {
  return (
    <TopicLayout
      title="How Images Become Tokens"
      description="Understand how vision-language models process images by splitting them into patches and projecting them into the same embedding space as text."
      breadcrumbs={[
        { label: 'AI', href: '/' },
        { label: 'LLM', href: '/' },
        { label: 'Vision & Images' },
      ]}
      prevTopic={{ label: 'Attention Mechanism', href: '/ai/llm/attention' }}
      nextTopic={{ label: 'Visual Challenges', href: '/ai/llm/visual-challenges' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
            <Eye size={24} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-gradient mb-4">Multimodal LLMs</h2>
            <p className="text-muted leading-relaxed text-lg">
              Models like <span className="text-cyan-400 font-semibold">GPT-4V</span>,{' '}
              <span className="text-purple-400 font-semibold">Claude 3</span>, and{' '}
              <span className="text-emerald-400 font-semibold">Gemini</span> can understand both text 
              and images. But LLMs are fundamentally <strong className="text-text">text machines</strong>—they 
              process sequences of tokens. So how do images get in?
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <p className="text-xl text-text font-heading font-semibold mb-0">
            The answer: convert images into tokens that live in the same embedding space as words.
          </p>
        </div>
      </section>

      {/* The Pipeline */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The Vision Pipeline</h2>
        
        <div className="p-6 rounded-2xl bg-background border border-border">
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            {[
              {
                step: 1,
                icon: Image,
                title: 'Input Image',
                desc: 'Raw pixels (e.g., 224×224×3)',
                color: 'cyan',
              },
              {
                step: 2,
                icon: Grid3X3,
                title: 'Patch Extraction',
                desc: 'Split into 14×14 or 16×16 grids',
                color: 'purple',
              },
              {
                step: 3,
                icon: Binary,
                title: 'Linear Projection',
                desc: 'Each patch → 768D vector',
                color: 'emerald',
              },
              {
                step: 4,
                icon: Layers,
                title: 'Add Position',
                desc: 'Positional embeddings added',
                color: 'orange',
              },
              {
                step: 5,
                icon: Cpu,
                title: 'To Transformer',
                desc: 'Same as text tokens',
                color: 'pink',
              },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex-1 flex items-center">
                <div className={`flex-1 p-4 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-${item.color}-500/20 flex items-center justify-center`}>
                      <item.icon size={16} className={`text-${item.color}-400`} />
                    </div>
                    <span className={`text-xs font-mono text-${item.color}-400`}>Step {item.step}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text">{item.title}</h3>
                  <p className="text-xs text-muted mt-1">{item.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight size={16} className="text-muted mx-2 shrink-0 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Visualizer */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-lg">🧩</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">Patch Tokenization</h2>
            <p className="text-sm text-muted">Watch how an image becomes a sequence of tokens</p>
          </div>
        </div>
        <PatchGridVisualizer />
      </section>

      {/* Deep Dive: Patch Extraction */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-purple-500/10 border-b border-purple-500/20 flex items-center gap-3">
          <Grid3X3 size={20} className="text-purple-400" />
          <h3 className="font-semibold text-text font-heading">Step 1: Patch Extraction</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            The image is divided into a grid of non-overlapping <strong className="text-text">patches</strong>. 
            Common configurations:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { size: '224×224', patches: '14×14', total: 196, model: 'ViT-B/16' },
              { size: '336×336', patches: '24×24', total: 576, model: 'GPT-4V (high)' },
              { size: '512×512', patches: '32×32', total: 1024, model: 'High-res models' },
            ].map((config) => (
              <div key={config.size} className="p-4 rounded-xl bg-background border border-border">
                <div className="text-lg font-mono font-bold text-purple-400">{config.size}</div>
                <div className="text-sm text-muted mt-1">
                  {config.patches} grid = <span className="text-text font-semibold">{config.total} patches</span>
                </div>
                <div className="text-xs text-muted mt-2">{config.model}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <h4 className="text-sm font-semibold text-purple-400 mb-2">Why Patches?</h4>
            <ul className="text-sm text-muted space-y-2">
              <li className="flex gap-2">
                <span className="text-purple-400">•</span>
                <span>Treating each pixel as a token would be computationally impossible (224×224 = 50,176 tokens!)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400">•</span>
                <span>Patches capture local visual features similar to how words capture meaning</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400">•</span>
                <span>The transformer's attention can then learn relationships between patches</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Deep Dive: Linear Projection */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-3">
          <Binary size={20} className="text-emerald-400" />
          <h3 className="font-semibold text-text font-heading">Step 2: Linear Projection</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Each patch is flattened and projected through a <strong className="text-text">learned linear layer</strong> 
            into the model's embedding dimension:
          </p>

          <div className="p-4 rounded-xl bg-background border border-border font-mono text-sm overflow-x-auto">
            <pre className="text-muted whitespace-pre-wrap">{`# For a 16×16 patch with 3 color channels:
patch_pixels = 16 × 16 × 3 = 768 values

# Flatten to a vector
flat_patch = [r1, g1, b1, r2, g2, b2, ..., r768, g768, b768]

# Project to embedding dimension (e.g., 768D or 1024D)
patch_embedding = linear_layer(flat_patch)  # Shape: (768,)

# This is now in the SAME space as text embeddings!`}</pre>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">The Magic of Shared Space</h4>
            <p className="text-sm text-muted">
              After projection, image patches and text tokens are <strong className="text-text">interchangeable</strong> 
              to the transformer. The model can attend across both modalities because they share the same 
              representation space. A patch of a dog can "look at" the word "dog" through attention.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Dive: Positional Encoding */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="px-6 py-4 bg-orange-500/10 border-b border-orange-500/20 flex items-center gap-3">
          <Layers size={20} className="text-orange-400" />
          <h3 className="font-semibold text-text font-heading">Step 3: Positional Embeddings</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted leading-relaxed">
            Just like text, image patches need <strong className="text-text">positional information</strong>. 
            Without it, the model wouldn't know that patch 0 is top-left and patch 195 is bottom-right.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background border border-border">
              <h4 className="text-sm font-semibold text-orange-400 mb-3">1D Positional Encoding</h4>
              <p className="text-sm text-muted mb-3">
                Patches are numbered left-to-right, top-to-bottom (like reading). Simple but loses 2D structure.
              </p>
              <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                  <div key={i} className="p-2 bg-orange-500/10 rounded text-center text-orange-400">
                    {i}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-background border border-border">
              <h4 className="text-sm font-semibold text-cyan-400 mb-3">2D Positional Encoding</h4>
              <p className="text-sm text-muted mb-3">
                Separate row and column encodings. Preserves spatial relationships better.
              </p>
              <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                {[[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]].map(([r,c], i) => (
                  <div key={i} className="p-2 bg-cyan-500/10 rounded text-center text-cyan-400">
                    {r},{c}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <h4 className="text-sm font-semibold text-orange-400 mb-2">The Position Problem</h4>
            <p className="text-sm text-muted">
              This is a key weakness: models are trained on fixed resolutions. A model trained on 224×224 
              images may struggle with 512×512 images because the positional encodings are different. 
              Some models use <span className="text-text">interpolated positions</span> to handle this.
            </p>
          </div>
        </div>
      </section>

      {/* Token Budget */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">The Token Budget Problem</h2>
        
        <p className="text-muted leading-relaxed mb-6">
          Images are <strong className="text-text">expensive</strong> in terms of tokens. Every image eats 
          into your context window:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted font-normal">Image Resolution</th>
                <th className="text-left p-3 text-muted font-normal">Patch Grid</th>
                <th className="text-left p-3 text-muted font-normal">Tokens Used</th>
                <th className="text-left p-3 text-muted font-normal">Equivalent Text</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 text-text">512×512 (low)</td>
                <td className="p-3 text-muted">32×32</td>
                <td className="p-3 text-cyan-400 font-mono">85 tokens</td>
                <td className="p-3 text-muted">~65 words</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 text-text">1024×1024 (high)</td>
                <td className="p-3 text-muted">64×64</td>
                <td className="p-3 text-purple-400 font-mono">765 tokens</td>
                <td className="p-3 text-muted">~575 words</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 text-text">2048×2048 (max)</td>
                <td className="p-3 text-muted">128×128</td>
                <td className="p-3 text-orange-400 font-mono">1,105 tokens</td>
                <td className="p-3 text-muted">~830 words</td>
              </tr>
              <tr>
                <td className="p-3 text-text">4 images (high)</td>
                <td className="p-3 text-muted">—</td>
                <td className="p-3 text-red-400 font-mono">~3,000 tokens</td>
                <td className="p-3 text-muted">~2,250 words</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <p className="text-text">
            <span className="text-primary-light font-semibold">Implication:</span> A few high-res images can 
            consume most of your context window, leaving less room for conversation history, instructions, 
            and retrieved documents.
          </p>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">Key Takeaways</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              'Images are split into patches (typically 16×16 or 14×14 pixels each)',
              'Each patch is projected into the same embedding space as text tokens',
              'Positional encodings tell the model where each patch is located',
              'Image tokens compete with text for context window space',
              'Higher resolution = more tokens = more detail but less room for text',
              'The projection layer is learned during training—it learns what visual features matter',
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
