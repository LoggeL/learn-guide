/**
 * Shared model data for tier list, VRAM calculator, and other pages.
 * Single source of truth for model metadata.
 */

export type HostingType = 'api' | 'open-weight' | 'local'
export type TierLevel = 'S' | 'A' | 'B' | 'C' | 'F'

export interface ModelEntry {
  /** Unique identifier */
  id: string
  /** i18n key for name (in tierList section) */
  nameKey: string
  /** i18n key for description (in tierList section) */
  descKey: string
  /** Tier ranking */
  tier: TierLevel
  /** Hosting/availability type */
  hosting: HostingType
  /** Display string for parameter count */
  params?: string
  /** Total parameters in billions (for VRAM calc) */
  totalParamsB?: number
  /** Active parameters in billions (for speed calc, MoE models) */
  activeParamsB?: number
  /** Whether this is a MoE model */
  isMoE?: boolean
  /** Number of layers (for KV cache estimation) */
  nLayers?: number
  /** Hidden dimension (for KV cache estimation) */
  dModel?: number
  /** Number of KV heads (for GQA/MQA KV cache calc) */
  nKVHeads?: number
  /** Head dimension */
  headDim?: number
}

export const models: ModelEntry[] = [
  // S-Tier
  {
    id: 'gpt53-codex',
    nameKey: 'gpt53Codex',
    descKey: 'gpt53CodexDesc',
    tier: 'S',
    hosting: 'api',
  },
  {
    id: 'claude-opus-46',
    nameKey: 'claudeOpus46',
    descKey: 'claudeOpus46Desc',
    tier: 'S',
    hosting: 'api',
  },

  // A-Tier
  {
    id: 'gemini-3-flash',
    nameKey: 'gemini3Flash',
    descKey: 'gemini3FlashDesc',
    tier: 'A',
    hosting: 'api',
  },
  {
    id: 'deepseek-v32',
    nameKey: 'deepseekV32',
    descKey: 'deepseekV32Desc',
    tier: 'A',
    hosting: 'open-weight',
    params: '685B MoE \u2192 37B active',
    totalParamsB: 685,
    activeParamsB: 37,
    isMoE: true,
    nLayers: 61,
    dModel: 7168,
    nKVHeads: 1, // MLA
    headDim: 128,
  },
  {
    id: 'minimax-m25',
    nameKey: 'minimax25',
    descKey: 'minimax25Desc',
    tier: 'A',
    hosting: 'open-weight',
    params: '230B MoE \u2192 10B active',
    totalParamsB: 230,
    activeParamsB: 10,
    isMoE: true,
  },
  {
    id: 'kimi-k25',
    nameKey: 'kimiK25',
    descKey: 'kimiK25Desc',
    tier: 'A',
    hosting: 'api',
  },
  {
    id: 'claude-sonnet-46',
    nameKey: 'claudeSonnet46',
    descKey: 'claudeSonnet46Desc',
    tier: 'A',
    hosting: 'api',
  },
  {
    id: 'qwen35-35b-a3b',
    nameKey: 'qwen35_35bA3b',
    descKey: 'qwen35_35bA3bDesc',
    tier: 'A',
    hosting: 'local',
    params: '35B MoE \u2192 3B active',
    totalParamsB: 35,
    activeParamsB: 3,
    isMoE: true,
    nLayers: 64,
    dModel: 2560,
    nKVHeads: 4,
    headDim: 128,
  },
  {
    id: 'qwen35-27b',
    nameKey: 'qwen35_27b',
    descKey: 'qwen35_27bDesc',
    tier: 'A',
    hosting: 'local',
    params: '27B dense',
    totalParamsB: 27,
    activeParamsB: 27,
    nLayers: 48,
    dModel: 4096,
    nKVHeads: 4,
    headDim: 128,
  },

  // B-Tier
  {
    id: 'qwen3-coder-next',
    nameKey: 'qwen3CoderNext',
    descKey: 'qwen3CoderNextDesc',
    tier: 'B',
    hosting: 'local',
    params: '~32B',
    totalParamsB: 32,
    activeParamsB: 32,
    nLayers: 64,
    dModel: 5120,
    nKVHeads: 8,
    headDim: 128,
  },
  {
    id: 'gpt-oss-20b',
    nameKey: 'gptOss20b',
    descKey: 'gptOss20bDesc',
    tier: 'B',
    hosting: 'local',
    params: '20B dense',
    totalParamsB: 20,
    activeParamsB: 20,
  },
  {
    id: 'glm-5',
    nameKey: 'glm5',
    descKey: 'glm5Desc',
    tier: 'B',
    hosting: 'open-weight',
    params: '744B MoE \u2192 40B active',
    totalParamsB: 744,
    activeParamsB: 40,
    isMoE: true,
    nLayers: 62,
    dModel: 6144,
    nKVHeads: 2, // MLA
    headDim: 128,
  },
  {
    id: 'qwen35-full',
    nameKey: 'qwen35',
    descKey: 'qwen35Desc',
    tier: 'B',
    hosting: 'open-weight',
    params: '397B MoE \u2192 17B active',
    totalParamsB: 397,
    activeParamsB: 17,
    isMoE: true,
  },

  // C-Tier
  {
    id: 'gemini-31-pro',
    nameKey: 'gemini31Pro',
    descKey: 'gemini31ProDesc',
    tier: 'C',
    hosting: 'api',
  },
  {
    id: 'grok-41',
    nameKey: 'grok41',
    descKey: 'grok41Desc',
    tier: 'C',
    hosting: 'api',
  },

  // F-Tier
  {
    id: 'llama-maverick',
    nameKey: 'llamaMaverick',
    descKey: 'llamaMaverickDesc',
    tier: 'F',
    hosting: 'open-weight',
    params: '400B MoE \u2192 17B active',
    totalParamsB: 400,
    activeParamsB: 17,
    isMoE: true,
    nLayers: 48,
    dModel: 5120,
    nKVHeads: 8,
    headDim: 128,
  },
  {
    id: 'amazon-nova',
    nameKey: 'amazonNova',
    descKey: 'amazonNovaDesc',
    tier: 'F',
    hosting: 'api',
  },
]

/** Common GPU presets for VRAM calculator */
export const gpuPresets = [
  { name: 'RTX 3060', vramGB: 12, bandwidthGBs: 360 },
  { name: 'RTX 3090', vramGB: 24, bandwidthGBs: 936 },
  { name: 'RTX 4070 Ti', vramGB: 16, bandwidthGBs: 504 },
  { name: 'RTX 4090', vramGB: 24, bandwidthGBs: 1008 },
  { name: 'RTX 5070 Ti', vramGB: 16, bandwidthGBs: 896 },
  { name: 'RTX 5090', vramGB: 32, bandwidthGBs: 1792 },
  { name: 'Titan V', vramGB: 12, bandwidthGBs: 652 },
  { name: 'M2 Pro', vramGB: 32, bandwidthGBs: 200 },
  { name: 'M4 Max', vramGB: 128, bandwidthGBs: 546 },
  { name: 'A100 80GB', vramGB: 80, bandwidthGBs: 2039 },
] as const

/** Quantization presets with bits per parameter */
export const quantPresets = [
  { id: 'FP16', label: 'FP16 / BF16', bitsPerParam: 16 },
  { id: 'Q8', label: 'Q8_0', bitsPerParam: 8 },
  { id: 'Q6_K', label: 'Q6_K', bitsPerParam: 6.5 },
  { id: 'Q5_K_M', label: 'Q5_K_M', bitsPerParam: 5.5 },
  { id: 'Q4_K_M', label: 'Q4_K_M', bitsPerParam: 4.85 },
  { id: 'Q3_K_M', label: 'Q3_K_M', bitsPerParam: 3.9 },
  { id: 'Q2_K', label: 'Q2_K', bitsPerParam: 3.35 },
] as const

/** Helper: get models by tier */
export function getModelsByTier(tier: TierLevel): ModelEntry[] {
  return models.filter(m => m.tier === tier)
}

/** Helper: get models that can run locally (have param data) */
export function getLocalModels(): ModelEntry[] {
  return models.filter(m => m.totalParamsB != null)
}

/** Tier display config */
export const tierConfig: Record<TierLevel, { color: string; bgGradient: string; borderColor: string; badgeBg: string }> = {
  S: { color: 'text-purple-400', bgGradient: 'from-purple-500/10 to-violet-500/10', borderColor: 'border-purple-500/30', badgeBg: 'bg-purple-500/20' },
  A: { color: 'text-blue-400', bgGradient: 'from-blue-500/10 to-cyan-500/10', borderColor: 'border-blue-500/30', badgeBg: 'bg-blue-500/20' },
  B: { color: 'text-emerald-400', bgGradient: 'from-emerald-500/10 to-teal-500/10', borderColor: 'border-emerald-500/30', badgeBg: 'bg-emerald-500/20' },
  C: { color: 'text-yellow-400', bgGradient: 'from-yellow-500/10 to-amber-500/10', borderColor: 'border-yellow-500/30', badgeBg: 'bg-yellow-500/20' },
  F: { color: 'text-red-400', bgGradient: 'from-red-500/10 to-rose-500/10', borderColor: 'border-red-500/30', badgeBg: 'bg-red-500/20' },
}

/** Hosting badge config */
export const hostingConfig = {
  api: { label: 'API only', color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/30' },
  'open-weight': { label: 'Open Weight', color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/30' },
  local: { label: 'Consumer GPU', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
} as const
