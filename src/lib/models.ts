/**
 * Shared model data for tier list, VRAM calculator, and other pages.
 * Single source of truth for model metadata.
 */

export type HostingType = 'api' | 'open-weight' | 'local'
export type TierLevel = 'S' | 'A' | 'B' | 'C' | 'D' | 'F'

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
    tier: 'B',
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
    hosting: 'open-weight',
    params: '1T MoE \u2192 32B active',
    totalParamsB: 1000,
    activeParamsB: 32,
    isMoE: true,
    nLayers: 61,
    dModel: 7168,
    nKVHeads: 8,
    headDim: 128,
  },
  {
    id: 'claude-sonnet-46',
    nameKey: 'claudeSonnet46',
    descKey: 'claudeSonnet46Desc',
    tier: 'S',
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
    id: 'qwen3-next-80b',
    nameKey: 'qwen3Next80b',
    descKey: 'qwen3Next80bDesc',
    tier: 'B',
    hosting: 'local',
    params: '80B MoE \u2192 3B active (512 experts, 10 active)',
    totalParamsB: 80,
    activeParamsB: 3,
    isMoE: true,
    nLayers: 48,
    dModel: 2048,
    nKVHeads: 2,
    headDim: 256,
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

  // C-Tier
  {
    id: 'gemini-31-pro',
    nameKey: 'gemini31Pro',
    descKey: 'gemini31ProDesc',
    tier: 'D',
    hosting: 'api',
  },
  {
    id: 'grok-420',
    nameKey: 'grok420',
    descKey: 'grok420Desc',
    tier: 'B',
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
export type GpuCategory = 'nvidia-consumer' | 'nvidia-pro' | 'apple' | 'amd-apu' | 'datacenter'

export interface GpuPreset {
  name: string
  vramGB: number
  bandwidthGBs: number
  category: GpuCategory
  note?: string
}

export const gpuPresets: GpuPreset[] = [
  // NVIDIA Consumer — Previous Gen
  { name: 'RTX 3060', vramGB: 12, bandwidthGBs: 360, category: 'nvidia-consumer' },
  { name: 'RTX 3090', vramGB: 24, bandwidthGBs: 936, category: 'nvidia-consumer' },
  { name: 'Titan V', vramGB: 12, bandwidthGBs: 652, category: 'nvidia-consumer', note: 'HBM2' },
  // NVIDIA Consumer — RTX 40 Series
  { name: 'RTX 4060 Ti 16GB', vramGB: 16, bandwidthGBs: 288, category: 'nvidia-consumer' },
  { name: 'RTX 4070 Ti', vramGB: 16, bandwidthGBs: 504, category: 'nvidia-consumer' },
  { name: 'RTX 4090', vramGB: 24, bandwidthGBs: 1008, category: 'nvidia-consumer' },
  // NVIDIA Consumer — RTX 50 Series (Blackwell)
  { name: 'RTX 5070', vramGB: 12, bandwidthGBs: 672, category: 'nvidia-consumer' },
  { name: 'RTX 5070 Ti', vramGB: 16, bandwidthGBs: 896, category: 'nvidia-consumer' },
  { name: 'RTX 5080', vramGB: 16, bandwidthGBs: 960, category: 'nvidia-consumer' },
  { name: 'RTX 5090', vramGB: 32, bandwidthGBs: 1792, category: 'nvidia-consumer' },
  // NVIDIA Pro / Workstation
  { name: 'RTX PRO 6000 Blackwell', vramGB: 96, bandwidthGBs: 1800, category: 'nvidia-pro', note: '96GB GDDR7, 512-bit' },
  // NVIDIA DGX Spark (desktop AI supercomputer)
  { name: 'DGX Spark (GB10)', vramGB: 128, bandwidthGBs: 273, category: 'nvidia-pro', note: '128GB LPDDR5X unified' },
  // Apple Silicon (unified memory — shared with CPU)
  { name: 'M2 Pro', vramGB: 32, bandwidthGBs: 200, category: 'apple', note: 'Unified' },
  { name: 'M3 Max (40-core)', vramGB: 128, bandwidthGBs: 400, category: 'apple', note: 'Unified' },
  { name: 'M4 Pro', vramGB: 48, bandwidthGBs: 273, category: 'apple', note: 'Unified' },
  { name: 'M4 Max (40-core)', vramGB: 128, bandwidthGBs: 546, category: 'apple', note: 'Unified' },
  // AMD APU (unified memory — shared with CPU)
  { name: 'Strix Halo (Max+ 395)', vramGB: 96, bandwidthGBs: 256, category: 'amd-apu', note: 'LPDDR5X unified' },
  // Datacenter / Server
  { name: 'A100 80GB', vramGB: 80, bandwidthGBs: 2039, category: 'datacenter', note: 'HBM2e' },
  { name: 'H100 80GB', vramGB: 80, bandwidthGBs: 3350, category: 'datacenter', note: 'HBM3' },
  { name: 'H200 141GB', vramGB: 141, bandwidthGBs: 4800, category: 'datacenter', note: 'HBM3e' },
  { name: 'B200 192GB', vramGB: 192, bandwidthGBs: 8000, category: 'datacenter', note: 'HBM3e Blackwell' },
]

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
  D: { color: 'text-orange-400', bgGradient: 'from-orange-500/10 to-amber-500/10', borderColor: 'border-orange-500/30', badgeBg: 'bg-orange-500/20' },
  F: { color: 'text-red-400', bgGradient: 'from-red-500/10 to-rose-500/10', borderColor: 'border-red-500/30', badgeBg: 'bg-red-500/20' },
}

/** Hosting badge config */
export const hostingConfig = {
  api: { label: 'API only', color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/30' },
  'open-weight': { label: 'Open Weight', color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/30' },
  local: { label: 'Consumer GPU', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
} as const
