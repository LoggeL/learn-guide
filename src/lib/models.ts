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
    id: 'gpt-55',
    nameKey: 'gpt55',
    descKey: 'gpt55Desc',
    tier: 'S',
    hosting: 'api',
  },

  // A-Tier
  {
    id: 'gpt-54',
    nameKey: 'gpt54',
    descKey: 'gpt54Desc',
    tier: 'A',
    hosting: 'api',
  },
  {
    id: 'claude-opus-47',
    nameKey: 'claudeOpus47',
    descKey: 'claudeOpus47Desc',
    tier: 'S',
    hosting: 'api',
  },
  {
    id: 'minimax-m27',
    nameKey: 'minimax27',
    descKey: 'minimax27Desc',
    tier: 'A',
    hosting: 'open-weight',
    params: '250B MoE → 10B active',
    totalParamsB: 250,
    activeParamsB: 10,
    isMoE: true,
  },
  {
    id: 'glm-5-1',
    nameKey: 'glm51',
    descKey: 'glm51Desc',
    tier: 'A',
    hosting: 'open-weight',
    params: '744B MoE → 40B active',
    totalParamsB: 744,
    activeParamsB: 40,
    isMoE: true,
    nLayers: 62,
    dModel: 6144,
    nKVHeads: 2,
    headDim: 128,
  },
  {
    id: 'kimi-k26',
    nameKey: 'kimiK26',
    descKey: 'kimiK26Desc',
    tier: 'A',
    hosting: 'open-weight',
    params: '1T MoE → 32B active',
    totalParamsB: 1000,
    activeParamsB: 32,
    isMoE: true,
    nLayers: 61,
    dModel: 7168,
    nKVHeads: 8,
    headDim: 128,
  },
  {
    id: 'qwen36-35b-a3',
    nameKey: 'qwen36_35bA3',
    descKey: 'qwen36_35bA3Desc',
    tier: 'A',
    hosting: 'local',
    params: '35B MoE → 3B active',
    totalParamsB: 35,
    activeParamsB: 3,
    isMoE: true,
    nLayers: 64,
    dModel: 2560,
    nKVHeads: 4,
    headDim: 128,
  },
  {
    id: 'gemini-3-flash',
    nameKey: 'gemini3Flash',
    descKey: 'gemini3FlashDesc',
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

  // B-Tier
  {
    id: 'deepseek-v32',
    nameKey: 'deepseekV32',
    descKey: 'deepseekV32Desc',
    tier: 'B',
    hosting: 'open-weight',
    params: '685B MoE → 37B active',
    totalParamsB: 685,
    activeParamsB: 37,
    isMoE: true,
    nLayers: 61,
    dModel: 7168,
    nKVHeads: 1,
    headDim: 128,
  },

  // C-Tier
  {
    id: 'gemini-31-flash-lite',
    nameKey: 'gemini31FlashLite',
    descKey: 'gemini31FlashLiteDesc',
    tier: 'C',
    hosting: 'api',
  },
  {
    id: 'grok-420',
    nameKey: 'grok420',
    descKey: 'grok420Desc',
    tier: 'C',
    hosting: 'api',
  },

  // D-Tier
  {
    id: 'gemini-31-pro',
    nameKey: 'gemini31Pro',
    descKey: 'gemini31ProDesc',
    tier: 'D',
    hosting: 'api',
  },

  // F-Tier
  {
    id: 'llama-maverick',
    nameKey: 'llamaMaverick',
    descKey: 'llamaMaverickDesc',
    tier: 'F',
    hosting: 'open-weight',
    params: '400B MoE → 17B active',
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
  // NVIDIA Consumer
  { name: 'RTX 3060', vramGB: 12, bandwidthGBs: 360, category: 'nvidia-consumer' },
  { name: 'RTX 3080', vramGB: 10, bandwidthGBs: 760, category: 'nvidia-consumer' },
  { name: 'RTX 3090', vramGB: 24, bandwidthGBs: 936, category: 'nvidia-consumer' },
  { name: 'RTX 4060 Ti', vramGB: 16, bandwidthGBs: 288, category: 'nvidia-consumer' },
  { name: 'RTX 4070 Ti Super', vramGB: 16, bandwidthGBs: 672, category: 'nvidia-consumer' },
  { name: 'RTX 4090', vramGB: 24, bandwidthGBs: 1008, category: 'nvidia-consumer' },
  { name: 'RTX 5090', vramGB: 32, bandwidthGBs: 1792, category: 'nvidia-consumer' },

  // NVIDIA Pro
  { name: 'RTX 6000 Ada', vramGB: 48, bandwidthGBs: 960, category: 'nvidia-pro' },
  { name: 'RTX Pro 6000 Blackwell', vramGB: 96, bandwidthGBs: 1792, category: 'nvidia-pro' },

  // Apple Silicon
  { name: 'M1 Max', vramGB: 32, bandwidthGBs: 400, category: 'apple' },
  { name: 'M2 Max', vramGB: 38, bandwidthGBs: 400, category: 'apple' },
  { name: 'M3 Max', vramGB: 48, bandwidthGBs: 400, category: 'apple' },
  { name: 'M4 Pro', vramGB: 24, bandwidthGBs: 273, category: 'apple' },
  { name: 'M4 Max', vramGB: 48, bandwidthGBs: 546, category: 'apple' },
  { name: 'M3 Ultra', vramGB: 96, bandwidthGBs: 800, category: 'apple' },

  // AMD APUs / iGPUs
  { name: 'AMD Ryzen AI Max+ 395', vramGB: 96, bandwidthGBs: 256, category: 'amd-apu', note: 'Shared memory' },
  { name: 'Framework Desktop (Strix Halo)', vramGB: 128, bandwidthGBs: 256, category: 'amd-apu', note: 'Shared memory' },

  // Datacenter
  { name: 'A100 40GB', vramGB: 40, bandwidthGBs: 1555, category: 'datacenter' },
  { name: 'A100 80GB', vramGB: 80, bandwidthGBs: 2039, category: 'datacenter' },
  { name: 'H100', vramGB: 80, bandwidthGBs: 3350, category: 'datacenter' },
  { name: 'B200', vramGB: 192, bandwidthGBs: 8000, category: 'datacenter' },
]

export const gpuCategories: Record<GpuCategory, { label: string; color: string }> = {
  'nvidia-consumer': { label: 'NVIDIA Consumer', color: 'text-green-400' },
  'nvidia-pro': { label: 'NVIDIA Pro', color: 'text-emerald-400' },
  apple: { label: 'Apple Silicon', color: 'text-blue-400' },
  'amd-apu': { label: 'AMD APU / iGPU', color: 'text-red-400' },
  datacenter: { label: 'Datacenter', color: 'text-purple-400' },
}

export const quantPresets = [
  { key: 'fp16', label: 'FP16', bitsPerParam: 16, overhead: 1.0 },
  { key: 'bf16', label: 'BF16', bitsPerParam: 16, overhead: 1.0 },
  { key: 'q8', label: 'Q8', bitsPerParam: 8, overhead: 1.05 },
  { key: 'q6', label: 'Q6', bitsPerParam: 6, overhead: 1.08 },
  { key: 'q5', label: 'Q5', bitsPerParam: 5, overhead: 1.1 },
  { key: 'q4', label: 'Q4', bitsPerParam: 4, overhead: 1.15 },
  { key: 'q3', label: 'Q3', bitsPerParam: 3, overhead: 1.2 },
  { key: 'q2', label: 'Q2', bitsPerParam: 2, overhead: 1.3 },
] as const

export interface MemoryBreakdown {
  weightsGB: number
  kvCacheGB: number
  totalGB: number
}

export function estimateModelMemory(
  model: ModelEntry,
  quantBits: number,
  contextLength: number = 4096,
  batchSize: number = 1
): MemoryBreakdown {
  const paramsB = model.isMoE ? (model.activeParamsB || model.totalParamsB || 0) : (model.totalParamsB || 0)

  const weightsGB = paramsB * (quantBits / 8) * 1.1

  let kvCacheGB = 0
  if (model.nLayers && model.dModel && model.nKVHeads && model.headDim) {
    const kvElements = 2 * contextLength * batchSize * model.nLayers * model.nKVHeads * model.headDim
    kvCacheGB = (kvElements * 2) / (1024 ** 3)
  }

  return {
    weightsGB,
    kvCacheGB,
    totalGB: weightsGB + kvCacheGB,
  }
}

export const tierConfig: Record<TierLevel, { color: string; bgGradient: string; borderColor: string }> = {
  S: { color: 'text-yellow-400', bgGradient: 'from-yellow-500/10 to-orange-500/5', borderColor: 'border-yellow-500/20' },
  A: { color: 'text-green-400', bgGradient: 'from-green-500/10 to-emerald-500/5', borderColor: 'border-green-500/20' },
  B: { color: 'text-blue-400', bgGradient: 'from-blue-500/10 to-cyan-500/5', borderColor: 'border-blue-500/20' },
  C: { color: 'text-purple-400', bgGradient: 'from-purple-500/10 to-pink-500/5', borderColor: 'border-purple-500/20' },
  D: { color: 'text-orange-400', bgGradient: 'from-orange-500/10 to-red-500/5', borderColor: 'border-orange-500/20' },
  F: { color: 'text-red-400', bgGradient: 'from-red-500/10 to-rose-500/5', borderColor: 'border-red-500/20' },
}

export const hostingConfig: Record<HostingType, { label: string; color: string; bg: string }> = {
  api: {
    label: 'API',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  'open-weight': {
    label: 'Open Weights',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
  local: {
    label: 'Local',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
}
