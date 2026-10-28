import { type Difficulty } from './difficulty'

export interface Topic {
  id: string
  name: string
  path?: string
  /**
   * Required for leaf topics (those with a path).
   * One of: 'beginner' | 'intermediate' | 'expert'
   */
  difficulty?: Difficulty
  /** ISO date string (YYYY-MM-DD) of last content update. Required for leaf topics. */
  lastUpdated?: string
  children?: Topic[]
}

export const topics: Topic[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    children: [
      {
        id: 'hands-on',
        name: 'Hands-On',
        children: [
          {
            id: 'getting-started',
            name: 'Getting Started',
            path: '/ai/getting-started',
            difficulty: 'beginner',
            lastUpdated: '2026-09-13',
          },
        ],
      },
      {
        id: 'agents',
        name: 'AI Agents',
        children: [
          {
            id: 'agents-core',
            name: 'Core Concepts',
            children: [
              { id: 'agent-loop', name: 'The Agent Loop', path: '/ai/agents/loop', difficulty: 'beginner', lastUpdated: '2026-10-29' },
              { id: 'agent-context', name: 'Context Engineering', path: '/ai/agents/context', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'chat-compaction', name: 'Compaction', path: '/ai/agents/compaction', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
            ],
          },
          {
            id: 'agents-building',
            name: 'Building Blocks',
            children: [
              { id: 'tool-design', name: 'Tool Design', path: '/ai/agents/tool-design', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'programmatic-tools', name: 'Programmatic Tool Calling', path: '/ai/agents/programmatic-tools', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'memory', name: 'Memory Systems', path: '/ai/agents/memory', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'skills', name: 'Agent Skills', path: '/ai/agents/skills', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
              { id: 'mcp', name: 'MCP (Model Context Protocol)', path: '/ai/agents/mcp', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
            ],
          },
          {
            id: 'agents-patterns',
            name: 'Patterns',
            children: [
              { id: 'orchestration', name: 'Orchestration', path: '/ai/agents/orchestration', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
            ],
          },
          {
            id: 'agents-quality',
            name: 'Quality & Security',
            children: [
              { id: 'agent-problems', name: 'Agent Problems', path: '/ai/agents/problems', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
              { id: 'agent-security', name: 'Agent Security', path: '/ai/agents/security', difficulty: 'expert', lastUpdated: '2026-09-13' },
              { id: 'evaluation', name: 'Evaluation', path: '/ai/agents/evaluation', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
            ],
          },
        ],
      },
      {
        id: 'llm',
        name: 'Large Language Models',
        children: [
          {
            id: 'llm-fundamentals',
            name: 'Fundamentals',
            children: [
              { id: 'tokenization', name: 'Tokenization', path: '/ai/llm/tokenization', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'subtoken-blindness', name: 'Subtoken Blindness', path: '/ai/llm/subtoken-blindness', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'embeddings', name: 'Embeddings', path: '/ai/llm/embeddings', difficulty: 'beginner', lastUpdated: '2026-10-29' },
              { id: 'attention', name: 'Attention Mechanism', path: '/ai/llm/attention', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'multi-head-attention-gqa', name: 'Multi-Head Attention, MQA & GQA', path: '/ai/llm/multi-head-attention-gqa', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'positional-encoding', name: 'Positional Encoding & RoPE', path: '/ai/llm/positional-encoding', difficulty: 'expert', lastUpdated: '2026-10-29' },
            ],
          },
          {
            id: 'llm-behavior',
            name: 'Behavior',
            children: [
              { id: 'next-token-prediction', name: 'Next-Token Prediction', path: '/ai/llm/next-token-prediction', difficulty: 'beginner', lastUpdated: '2026-10-29' },
              { id: 'temperature', name: 'Temperature', path: '/ai/llm/temperature', difficulty: 'beginner', lastUpdated: '2026-10-29' },
              { id: 'reasoning-models', name: 'Reasoning Models & Inference-Time Compute', path: '/ai/llm/reasoning-models', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'jagged-frontier', name: 'Jagged Frontier', path: '/ai/llm/jagged-frontier', difficulty: 'beginner', lastUpdated: '2026-10-29' },
              { id: 'context-rot', name: 'Context Rot', path: '/ai/llm/context-rot', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
            ],
          },
          {
            id: 'llm-capabilities',
            name: 'Capabilities',
            children: [
              { id: 'rag', name: 'RAG', path: '/ai/llm/rag', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'vision', name: 'Vision-Language Models', path: '/ai/llm/vision', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'multimodality', name: 'Multimodality', path: '/ai/llm/multimodality', difficulty: 'beginner', lastUpdated: '2026-09-13' },
            ],
          },
          {
            id: 'llm-architecture',
            name: 'Architecture',
            children: [
              { id: 'transformer-architecture', name: 'Transformer Architecture', path: '/ai/llm/transformer-architecture', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
              { id: 'feed-forward-networks-moe', name: 'Feed-Forward Networks & MoE', path: '/ai/llm/feed-forward-networks-moe', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'residual-stream-layer-norm', name: 'Residual Stream & LayerNorm', path: '/ai/llm/residual-stream-layer-norm', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
              { id: 'looped-transformers', name: 'Looped Transformers', path: '/ai/llm/looped-transformers', difficulty: 'expert', lastUpdated: '2026-09-07' },
              { id: 'n-gram-embeddings', name: 'N-gram Embeddings', path: '/ai/llm/n-gram-embeddings', difficulty: 'expert', lastUpdated: '2026-08-27' },
              { id: 'mtp', name: 'Multi-Token Prediction (MTP)', path: '/ai/llm/mtp', difficulty: 'expert', lastUpdated: '2026-09-13' },
              { id: 'nested-learning', name: 'Nested Learning', path: '/ai/llm/nested-learning', difficulty: 'expert', lastUpdated: '2026-09-13' },
            ],
          },
          {
            id: 'llm-training',
            name: 'Training & Adaptation',
            children: [
              { id: 'llm-training', name: 'LLM Training', path: '/ai/llm/training', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'training-data', name: 'Training Data', path: '/ai/llm/training-data', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
              { id: 'distillation', name: 'Distillation', path: '/ai/llm/distillation', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
              { id: 'lora', name: 'Fine-Tuning & LoRA', path: '/ai/llm/lora', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
              { id: 'verifiable-rewards', name: 'Verifiable Rewards', path: '/ai/agents/verifiable-rewards', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
            ],
          },
        ],
      },
      {
        id: 'diffusion',
        name: 'Diffusion Models',
        children: [
          { id: 'diffusion-fundamentals', name: 'How Diffusion Works', path: '/ai/diffusion/fundamentals', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
          { id: 'text-diffusion', name: 'Text Diffusion', path: '/ai/diffusion/text', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
          { id: 'image-diffusion', name: 'Image Diffusion', path: '/ai/diffusion/image', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
        ],
      },
      {
        id: 'llm-inference',
        name: 'LLM Inference',
        children: [
          { id: 'kv-cache', name: 'KV Cache', path: '/ai/llm-inference/kv-cache', difficulty: 'expert', lastUpdated: '2026-09-13' },
          { id: 'prompt-caching', name: 'Prompt Caching', path: '/ai/llm-inference/prompt-caching', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
          { id: 'mega-kernels', name: 'Mega-Kernels', path: '/ai/llm-inference/mega-kernels', difficulty: 'expert', lastUpdated: '2026-09-24' },
          { id: 'batching', name: 'Batching & Throughput', path: '/ai/llm-inference/batching', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
          { id: 'quantization', name: 'Quantization', path: '/ai/llm/quantization', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
          { id: 'speculative-decoding', name: 'Speculative Decoding', path: '/ai/llm/speculative-decoding', difficulty: 'expert', lastUpdated: '2026-09-13' },
          { id: 'local-inference', name: 'Running Models Locally', path: '/ai/llm-inference/local-inference', difficulty: 'beginner', lastUpdated: '2026-10-29' },
          { id: 'vram-calc', name: 'VRAM Calculator', path: '/ai/llm-inference/vram-calc', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
        ],
      },
      {
        id: 'ml-fundamentals',
        name: 'ML Fundamentals',
        children: [
          { id: 'neural-networks', name: 'Neural Networks', path: '/ai/ml-fundamentals/neural-networks', difficulty: 'beginner', lastUpdated: '2026-02-09' },
          { id: 'gradient-descent', name: 'Gradient Descent', path: '/ai/ml-fundamentals/gradient-descent', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
          { id: 'training', name: 'Loss & Generalization', path: '/ai/ml-fundamentals/training', difficulty: 'beginner', lastUpdated: '2026-10-29' },
          { id: 'reinforcement-learning', name: 'Reinforcement Learning', path: '/ai/ml-fundamentals/reinforcement-learning', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
          { id: 'world-models', name: 'World Models', path: '/ai/ml-fundamentals/world-models', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
        ],
      },
      {
        id: 'prompting',
        name: 'Prompting',
        children: [
          { id: 'prompt-basics', name: 'Prompt Basics', path: '/ai/prompting/basics', difficulty: 'beginner', lastUpdated: '2026-09-13' },
          { id: 'advanced-prompting', name: 'Advanced Techniques', path: '/ai/prompting/advanced', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
          { id: 'system-prompts', name: 'System Prompts', path: '/ai/prompting/system-prompts', difficulty: 'intermediate', lastUpdated: '2026-09-13' },
        ],
      },
      {
        id: 'safety',
        name: 'AI Safety & Ethics',
        children: [
          { id: 'bias', name: 'Bias & Fairness', path: '/ai/safety/bias', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
          { id: 'responsible-ai', name: 'Responsible AI', path: '/ai/safety/responsible-ai', difficulty: 'beginner', lastUpdated: '2026-10-29' },
          { id: 'abliteration', name: 'Abliteration', path: '/ai/llm/abliteration', difficulty: 'intermediate', lastUpdated: '2026-10-29' },
        ],
      },
      {
        id: 'industry',
        name: 'AI Industry',
        children: [
          { id: 'european-ai', name: 'AI Made in Europe', path: '/ai/industry/european-ai', difficulty: 'beginner', lastUpdated: '2026-09-13' },
          { id: 'open-source', name: 'Open Source Advantages', path: '/ai/industry/open-source', difficulty: 'beginner', lastUpdated: '2026-09-13' },
          { id: 'custom-chips', name: 'Custom Chips for AI', path: '/ai/industry/custom-chips', difficulty: 'beginner', lastUpdated: '2026-10-29' },
          { id: 'tier-list', name: "Logge's Model Notes", path: '/ai/industry/tier-list', difficulty: 'beginner', lastUpdated: '2026-10-29' },
        ],
      },
    ],
  },
]

/**
 * Get the children of the root AI topic (the main categories).
 * Used by sidebar and homepage.
 */
export function getTopicCategories(): Topic[] {
  return topics[0]?.children ?? []
}

export function flattenTopics(topicList: Topic[] = topics): Topic[] {
  const result: Topic[] = []
  for (const topic of topicList) {
    if (topic.path) {
      result.push(topic)
    }
    if (topic.children) {
      result.push(...flattenTopics(topic.children))
    }
  }
  return result
}

/**
 * Validate that all leaf topics have required metadata.
 * Called at build time via topics import.
 */
function validateTopics(topicList: Topic[]): void {
  for (const topic of topicList) {
    if (topic.path) {
      if (!topic.difficulty) {
        throw new Error(`Topic "${topic.id}" has a path but no difficulty rating`)
      }
      if (!topic.lastUpdated) {
        throw new Error(`Topic "${topic.id}" has a path but no lastUpdated date`)
      }
    }
    if (topic.children) {
      validateTopics(topic.children)
    }
  }
}

// Validate on import — build will fail if any leaf topic is missing metadata
validateTopics(topics)

/**
 * A curated learning path grouped into higher-level lecture blocks.
 * Optional groups remain discoverable in the sidebar but are excluded from the sequential course.
 */
export interface LearningPathGroup {
  id: string
  topicIds: string[]
  optional?: boolean
}

export const learningPathGroups: LearningPathGroup[] = [
  {
    id: 'lecture-foundations',
    topicIds: [
      'getting-started',
      'neural-networks',
      'gradient-descent',
      'training',
      'tokenization',
      'subtoken-blindness',
      'embeddings',
      'next-token-prediction',
      'temperature',
      'prompt-basics',
    ],
  },
  {
    id: 'lecture-llm-core',
    topicIds: [
      'attention',
      'multi-head-attention-gqa',
      'positional-encoding',
      'transformer-architecture',
      'feed-forward-networks-moe',
      'residual-stream-layer-norm',
      'reinforcement-learning',
      'llm-training',
      'training-data',
      'verifiable-rewards',
      'reasoning-models',
      'jagged-frontier',
      'context-rot',
      'rag',
      'advanced-prompting',
      'system-prompts',
    ],
  },
  {
    id: 'lecture-safety',
    topicIds: [
      'bias',
      'responsible-ai',
      'abliteration',
    ],
  },
  {
    id: 'lecture-modalities',
    topicIds: [
      'vision',
      'multimodality',
      'diffusion-fundamentals',
      'text-diffusion',
      'image-diffusion',
    ],
  },
  {
    id: 'lecture-architecture',
    topicIds: [
      'distillation',
      'lora',
      'mtp',
      'n-gram-embeddings',
      'looped-transformers',
      'nested-learning',
    ],
  },
  {
    id: 'lecture-inference',
    topicIds: [
      'local-inference',
      'kv-cache',
      'prompt-caching',
      'mega-kernels',
      'batching',
      'quantization',
      'vram-calc',
      'speculative-decoding',
    ],
  },
  {
    id: 'lecture-agents',
    topicIds: [
      'agent-loop',
      'agent-context',
      'chat-compaction',
      'tool-design',
      'programmatic-tools',
      'memory',
      'skills',
      'mcp',
      'orchestration',
      'agent-problems',
      'agent-security',
      'evaluation',
    ],
  },
  {
    id: 'lecture-frontier',
    topicIds: [
      'world-models',
      'european-ai',
      'open-source',
      'custom-chips',
    ],
  },
  { id: 'lecture-notes', topicIds: ['tier-list'], optional: true },
]

export const learningPath: string[] = learningPathGroups.filter(group => !group.optional).flatMap(group => group.topicIds)

export function searchTopics(query: string): Topic[] {
  const q = query.toLowerCase()
  return flattenTopics().filter(
    (t) => t.name.toLowerCase().includes(q) || t.id.includes(q)
  )
}

export function findCategory(categoryId: string): Topic | undefined {
  const ai = topics[0]
  return ai.children?.find((cat) => cat.id === categoryId)
}

export function getCategoryPath(categoryId: string): string {
  return `/ai/${categoryId}`
}
