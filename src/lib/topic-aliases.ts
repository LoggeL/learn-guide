/** Preserve old bookmarks and progress when articles are consolidated. */
const ids: Record<string, string> = {
  'agentic-patterns': 'orchestration',
  'powerful-agents': 'orchestration',
  'logges-favourite-model': 'tier-list',
}
const paths: Record<string, string> = {
  '/ai/agents/patterns': '/ai/agents/orchestration',
  '/ai/agents/powerful': '/ai/agents/orchestration',
  '/ai/industry/logges-favourite-model': '/ai/industry/tier-list',
}
export function canonicalTopicId(id: string) { return ids[id] ?? id }
export function canonicalTopicPath(path: string) {
  const match = path.match(/^(\/(?:en|de))(\/ai\/.*?)(\/?)$/)
  if (!match || !paths[match[2]]) return path
  return match[1] + paths[match[2]]
}
