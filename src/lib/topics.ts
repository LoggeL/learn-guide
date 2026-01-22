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
            id: 'agent-loop',
            name: 'The Agent Loop',
            path: '/ai/agents/loop',
          },
          {
            id: 'agent-context',
            name: 'Context Anatomy',
            path: '/ai/agents/context',
          },
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
            id: 'agentic-patterns',
            name: 'Agentic Patterns',
            path: '/ai/agents/patterns',
          },
          {
            id: 'mcp',
            name: 'MCP (Model Context Protocol)',
            path: '/ai/agents/mcp',
          },
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
            id: 'orchestration',
            name: 'Orchestration',
            path: '/ai/agents/orchestration',
          },
          {
            id: 'evaluation',
            name: 'Evaluation',
            path: '/ai/agents/evaluation',
          },
        ],
      },
      {
        id: 'llm',
        name: 'Large Language Models',
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
            id: 'rag',
            name: 'RAG',
            path: '/ai/llm/rag',
          },
          {
            id: 'context-rot',
            name: 'Context Rot',
            path: '/ai/llm/context-rot',
          },
          {
            id: 'temperature',
            name: 'Temperature',
            path: '/ai/llm/temperature',
          },
          {
            id: 'attention',
            name: 'Attention Mechanism',
            path: '/ai/llm/attention',
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
            id: 'alignment',
            name: 'Alignment',
            path: '/ai/safety/alignment',
          },
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
