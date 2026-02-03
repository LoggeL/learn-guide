export interface Topic {
  id: string
  name: string
  path?: string
  children?: Topic[]
}

export const topics: Topic[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    children: [
      {
        id: 'agents',
        name: 'AI Agents',
        children: [
          {
            id: 'agents-core',
            name: 'Core Concepts',
            children: [
              {
                id: 'agent-loop',
                name: 'The Agent Loop',
                path: '/ai/agents/loop',
              },
              {
                id: 'agent-context',
                name: 'Context Anatomy',
                path: '/ai/agents/context',
              },
            ],
          },
          {
            id: 'agents-building',
            name: 'Building Blocks',
            children: [
              {
                id: 'tool-design',
                name: 'Tool Design',
                path: '/ai/agents/tool-design',
              },
              {
                id: 'memory',
                name: 'Memory Systems',
                path: '/ai/agents/memory',
              },
              {
                id: 'skills',
                name: 'Agent Skills',
                path: '/ai/agents/skills',
              },
              {
                id: 'mcp',
                name: 'MCP (Model Context Protocol)',
                path: '/ai/agents/mcp',
              },
            ],
          },
          {
            id: 'agents-patterns',
            name: 'Patterns',
            children: [
              {
                id: 'agentic-patterns',
                name: 'Agentic Patterns',
                path: '/ai/agents/patterns',
              },
              {
                id: 'orchestration',
                name: 'Orchestration',
                path: '/ai/agents/orchestration',
              },
            ],
          },
          {
            id: 'agents-quality',
            name: 'Quality & Security',
            children: [
              {
                id: 'agent-problems',
                name: 'Agent Problems',
                path: '/ai/agents/problems',
              },
              {
                id: 'agent-security',
                name: 'Agent Security',
                path: '/ai/agents/security',
              },
              {
                id: 'evaluation',
                name: 'Evaluation',
                path: '/ai/agents/evaluation',
              },
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
              {
                id: 'tokenization',
                name: 'Tokenization',
                path: '/ai/llm/tokenization',
              },
              {
                id: 'embeddings',
                name: 'Embeddings',
                path: '/ai/llm/embeddings',
              },
              {
                id: 'attention',
                name: 'Attention Mechanism',
                path: '/ai/llm/attention',
              },
            ],
          },
          {
            id: 'llm-behavior',
            name: 'Behavior',
            children: [
              {
                id: 'temperature',
                name: 'Temperature',
                path: '/ai/llm/temperature',
              },
              {
                id: 'context-rot',
                name: 'Context Rot',
                path: '/ai/llm/context-rot',
              },
            ],
          },
          {
            id: 'llm-capabilities',
            name: 'Capabilities',
            children: [
              {
                id: 'rag',
                name: 'RAG',
                path: '/ai/llm/rag',
              },
              {
                id: 'vision',
                name: 'Vision & Images',
                path: '/ai/llm/vision',
              },
              {
                id: 'visual-challenges',
                name: 'Visual Challenges',
                path: '/ai/llm/visual-challenges',
              },
              {
                id: 'agentic-vision',
                name: 'Agentic Vision',
                path: '/ai/llm/agentic-vision',
              },
              {
                id: 'multimodality',
                name: 'Multimodality',
                path: '/ai/llm/multimodality',
              },
            ],
          },
          {
            id: 'llm-architecture',
            name: 'Architecture',
            children: [
              {
                id: 'llm-training',
                name: 'LLM Training',
                path: '/ai/llm/training',
              },
              {
                id: 'moe',
                name: 'Mixture of Experts',
                path: '/ai/llm/moe',
              },
              {
                id: 'quantization',
                name: 'Quantization',
                path: '/ai/llm/quantization',
              },
              {
                id: 'nested-learning',
                name: 'Nested Learning',
                path: '/ai/llm/nested-learning',
              },
              {
                id: 'distillation',
                name: 'Distillation',
                path: '/ai/llm/distillation',
              },
            ],
          },
        ],
      },
      {
        id: 'ml-fundamentals',
        name: 'ML Fundamentals',
        children: [
          {
            id: 'neural-networks',
            name: 'Neural Networks',
            path: '/ai/ml-fundamentals/neural-networks',
          },
          {
            id: 'gradient-descent',
            name: 'Gradient Descent',
            path: '/ai/ml-fundamentals/gradient-descent',
          },
          {
            id: 'training',
            name: 'Training Process',
            path: '/ai/ml-fundamentals/training',
          },
        ],
      },
      {
        id: 'prompting',
        name: 'Prompting',
        children: [
          {
            id: 'prompt-basics',
            name: 'Prompt Basics',
            path: '/ai/prompting/basics',
          },
          {
            id: 'advanced-prompting',
            name: 'Advanced Techniques',
            path: '/ai/prompting/advanced',
          },
          {
            id: 'system-prompts',
            name: 'System Prompts',
            path: '/ai/prompting/system-prompts',
          },
        ],
      },
      {
        id: 'safety',
        name: 'AI Safety & Ethics',
        children: [
          {
            id: 'bias',
            name: 'Bias & Fairness',
            path: '/ai/safety/bias',
          },
          {
            id: 'responsible-ai',
            name: 'Responsible AI',
            path: '/ai/safety/responsible-ai',
          },
        ],
      },
      {
        id: 'industry',
        name: 'AI Industry',
        children: [
          {
            id: 'european-ai',
            name: 'AI Made in Europe',
            path: '/ai/industry/european-ai',
          },
          {
            id: 'open-source',
            name: 'Open Source Advantages',
            path: '/ai/industry/open-source',
          },
          {
            id: 'opus-4-5',
            name: "Logge's Favourite Model",
            path: '/ai/industry/opus-4-5',
          },
        ],
      },
    ],
  },
]

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
