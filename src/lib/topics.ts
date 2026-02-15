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
            lastUpdated: '2026-02-12',
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
              { id: 'agent-loop', name: 'The Agent Loop', path: '/ai/agents/loop', difficulty: 'beginner', lastUpdated: '2026-02-09' },
              { id: 'agent-context', name: 'Context Anatomy', path: '/ai/agents/context', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
            ],
          },
          {
            id: 'agents-building',
            name: 'Building Blocks',
            children: [
              { id: 'tool-design', name: 'Tool Design', path: '/ai/agents/tool-design', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
              { id: 'memory', name: 'Memory Systems', path: '/ai/agents/memory', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
              { id: 'skills', name: 'Agent Skills', path: '/ai/agents/skills', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
              { id: 'mcp', name: 'MCP (Model Context Protocol)', path: '/ai/agents/mcp', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
            ],
          },
          {
            id: 'agents-patterns',
            name: 'Patterns',
            children: [
              { id: 'agentic-patterns', name: 'Agentic Patterns', path: '/ai/agents/patterns', difficulty: 'expert', lastUpdated: '2026-02-09' },
              { id: 'orchestration', name: 'Orchestration', path: '/ai/agents/orchestration', difficulty: 'expert', lastUpdated: '2026-02-09' },
            ],
          },
          {
            id: 'agents-quality',
            name: 'Quality & Security',
            children: [
              { id: 'agent-problems', name: 'Agent Problems', path: '/ai/agents/problems', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
              { id: 'agent-security', name: 'Agent Security', path: '/ai/agents/security', difficulty: 'expert', lastUpdated: '2026-02-09' },
              { id: 'evaluation', name: 'Evaluation', path: '/ai/agents/evaluation', difficulty: 'expert', lastUpdated: '2026-02-09' },
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
              { id: 'tokenization', name: 'Tokenization', path: '/ai/llm/tokenization', difficulty: 'beginner', lastUpdated: '2026-02-09' },
              { id: 'embeddings', name: 'Embeddings', path: '/ai/llm/embeddings', difficulty: 'beginner', lastUpdated: '2026-02-09' },
              { id: 'attention', name: 'Attention Mechanism', path: '/ai/llm/attention', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
            ],
          },
          {
            id: 'llm-behavior',
            name: 'Behavior',
            children: [
              { id: 'temperature', name: 'Temperature', path: '/ai/llm/temperature', difficulty: 'beginner', lastUpdated: '2026-02-09' },
              { id: 'context-rot', name: 'Context Rot', path: '/ai/llm/context-rot', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
            ],
          },
          {
            id: 'llm-capabilities',
            name: 'Capabilities',
            children: [
              { id: 'rag', name: 'RAG', path: '/ai/llm/rag', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
              { id: 'vision', name: 'Vision & Images', path: '/ai/llm/vision', difficulty: 'beginner', lastUpdated: '2026-02-09' },
              { id: 'visual-challenges', name: 'Visual Challenges', path: '/ai/llm/visual-challenges', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
              { id: 'agentic-vision', name: 'Agentic Vision', path: '/ai/llm/agentic-vision', difficulty: 'expert', lastUpdated: '2026-02-09' },
              { id: 'multimodality', name: 'Multimodality', path: '/ai/llm/multimodality', difficulty: 'beginner', lastUpdated: '2026-02-09' },
            ],
          },
          {
            id: 'llm-architecture',
            name: 'Architecture',
            children: [
              { id: 'transformer-architecture', name: 'Transformer Architecture', path: '/ai/llm/transformer-architecture', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
              { id: 'llm-training', name: 'LLM Training', path: '/ai/llm/training', difficulty: 'intermediate', lastUpdated: '2026-02-14' },
              { id: 'moe', name: 'Mixture of Experts', path: '/ai/llm/moe', difficulty: 'expert', lastUpdated: '2026-02-09' },
              { id: 'quantization', name: 'Quantization', path: '/ai/llm/quantization', difficulty: 'expert', lastUpdated: '2026-02-09' },
              { id: 'nested-learning', name: 'Nested Learning', path: '/ai/llm/nested-learning', difficulty: 'expert', lastUpdated: '2026-02-09' },
              { id: 'distillation', name: 'Distillation', path: '/ai/llm/distillation', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
              { id: 'lora', name: 'Fine-Tuning & LoRA', path: '/ai/llm/lora', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
              { id: 'speculative-decoding', name: 'Speculative Decoding', path: '/ai/llm/speculative-decoding', difficulty: 'expert', lastUpdated: '2026-02-09' },
            ],
          },
        ],
      },
      {
        id: 'llm-inference',
        name: 'LLM Inference',
        children: [
          { id: 'kv-cache', name: 'KV Cache', path: '/ai/llm-inference/kv-cache', difficulty: 'expert', lastUpdated: '2026-02-09' },
          { id: 'batching', name: 'Batching & Throughput', path: '/ai/llm-inference/batching', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
          { id: 'local-inference', name: 'Running Models Locally', path: '/ai/llm-inference/local-inference', difficulty: 'beginner', lastUpdated: '2026-02-10' },
        ],
      },
      {
        id: 'ml-fundamentals',
        name: 'ML Fundamentals',
        children: [
          { id: 'neural-networks', name: 'Neural Networks', path: '/ai/ml-fundamentals/neural-networks', difficulty: 'beginner', lastUpdated: '2026-02-09' },
          { id: 'gradient-descent', name: 'Gradient Descent', path: '/ai/ml-fundamentals/gradient-descent', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
          { id: 'training', name: 'Training Process', path: '/ai/ml-fundamentals/training', difficulty: 'beginner', lastUpdated: '2026-02-09' },
          { id: 'world-models', name: 'World Models', path: '/ai/ml-fundamentals/world-models', difficulty: 'expert', lastUpdated: '2026-02-15' },
        ],
      },
      {
        id: 'prompting',
        name: 'Prompting',
        children: [
          { id: 'prompt-basics', name: 'Prompt Basics', path: '/ai/prompting/basics', difficulty: 'beginner', lastUpdated: '2026-02-09' },
          { id: 'advanced-prompting', name: 'Advanced Techniques', path: '/ai/prompting/advanced', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
          { id: 'system-prompts', name: 'System Prompts', path: '/ai/prompting/system-prompts', difficulty: 'intermediate', lastUpdated: '2026-02-09' },
        ],
      },
      {
        id: 'safety',
        name: 'AI Safety & Ethics',
        children: [
          { id: 'bias', name: 'Bias & Fairness', path: '/ai/safety/bias', difficulty: 'beginner', lastUpdated: '2026-02-09' },
          { id: 'responsible-ai', name: 'Responsible AI', path: '/ai/safety/responsible-ai', difficulty: 'beginner', lastUpdated: '2026-02-09' },
        ],
      },
      {
        id: 'industry',
        name: 'AI Industry',
        children: [
          { id: 'european-ai', name: 'AI Made in Europe', path: '/ai/industry/european-ai', difficulty: 'beginner', lastUpdated: '2026-02-09' },
          { id: 'open-source', name: 'Open Source Advantages', path: '/ai/industry/open-source', difficulty: 'beginner', lastUpdated: '2026-02-09' },
          { id: 'logges-favourite-model', name: "Logge's Favourite Models", path: '/ai/industry/logges-favourite-model', difficulty: 'beginner', lastUpdated: '2026-02-09' },
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
