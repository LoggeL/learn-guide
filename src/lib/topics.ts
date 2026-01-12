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
        ],
      },
      {
        id: 'llm',
        name: 'Large Language Models',
        children: [
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
