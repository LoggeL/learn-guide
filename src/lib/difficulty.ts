export type Difficulty = 'beginner' | 'intermediate' | 'expert'

export const DIFFICULTY_STYLES: Record<Difficulty, { label: string; color: string; bg: string; border: string }> = {
  beginner:     { label: 'B', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  intermediate: { label: 'I', color: 'text-amber-400',   bg: 'bg-amber-500/15',   border: 'border-amber-500/30' },
  expert:       { label: 'E', color: 'text-red-400',     bg: 'bg-red-500/15',     border: 'border-red-500/30' },
}

export const TOPIC_DIFFICULTY: Record<string, Difficulty> = {
  // Getting Started
  'getting-started': 'beginner',
  // Agents
  'agent-loop': 'beginner',
  'agent-context': 'intermediate',
  'tool-design': 'intermediate',
  'memory': 'intermediate',
  'skills': 'intermediate',
  'mcp': 'intermediate',
  'agentic-patterns': 'expert',
  'orchestration': 'expert',
  'agent-problems': 'intermediate',
  'agent-security': 'expert',
  'evaluation': 'expert',
  // LLM Fundamentals
  'tokenization': 'beginner',
  'embeddings': 'beginner',
  'attention': 'intermediate',
  // LLM Behavior
  'temperature': 'beginner',
  'context-rot': 'intermediate',
  // LLM Capabilities
  'rag': 'intermediate',
  'vision': 'beginner',
  'visual-challenges': 'intermediate',
  'agentic-vision': 'expert',
  'multimodality': 'beginner',
  // LLM Architecture
  'transformer-architecture': 'intermediate',
  'llm-training': 'intermediate',
  'moe': 'expert',
  'quantization': 'expert',
  'nested-learning': 'expert',
  'distillation': 'intermediate',
  'lora': 'intermediate',
  'speculative-decoding': 'expert',
  // LLM Inference
  'kv-cache': 'expert',
  'batching': 'intermediate',
  'prompt-caching': 'intermediate',
  'local-inference': 'beginner',
  // ML Fundamentals
  'neural-networks': 'beginner',
  'gradient-descent': 'intermediate',
  'training': 'beginner',
  'world-models': 'expert',
  // Prompting
  'prompt-basics': 'beginner',
  'advanced-prompting': 'intermediate',
  'system-prompts': 'intermediate',
  // Safety
  'bias': 'beginner',
  'responsible-ai': 'beginner',
  // Industry
  'european-ai': 'beginner',
  'open-source': 'beginner',
  'logges-favourite-model': 'beginner',
}
