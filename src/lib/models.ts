/**
 * Shared model data for tier list, VRAM calculator, and other pages.
 * Single source of truth for model metadata.
 */

export type HostingType = 'api' | 'open-weight' | 'local'
export type TierLevel = 'S+' | 'A' | 'B' | 'C' | 'D' | 'F' | 'Google'

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
  /** Only standard dense KV tensors are supported by the teaching calculator. */
  attentionLayout?: 'standard' | 'unsupported'
  /** Whether the model is currently available/accessible */
  available?: boolean
}

/** Archived personal ranking from 22 August 2026, in display order. */
export const tierListModels: ModelEntry[] = [
  {
    id: 'fable-5',
    nameKey: 'fable5',
    descKey: 'fable5Desc',
    tier: 'S+',
    hosting: 'api',
  },
  {
    id: 'gpt-56-sol',
    nameKey: 'gpt56Sol',
    descKey: 'gpt56SolDesc',
    tier: 'A',
    hosting: 'api',
  },
  {
    id: 'kimi-k3',
    nameKey: 'kimiK3',
    descKey: 'kimiK3Desc',
    tier: 'B',
    hosting: 'api',
  },
  {
    id: 'gpt-56-luna',
    nameKey: 'gpt56Luna',
    descKey: 'gpt56LunaDesc',
    tier: 'B',
    hosting: 'api',
  },
  {
    id: 'deepseek-v4-flash',
    nameKey: 'deepseekV4Flash',
    descKey: 'deepseekV4FlashDesc',
    tier: 'B',
    hosting: 'api',
  },
  {
    id: 'grok-46',
    nameKey: 'grok46',
    descKey: 'grok46Desc',
    tier: 'C',
    hosting: 'api',
  },
  {
    id: 'muse-spark-12',
    nameKey: 'museSpark12',
    descKey: 'museSpark12Desc',
    tier: 'C',
    hosting: 'api',
  },
  {
    id: 'opus-5',
    nameKey: 'opus5',
    descKey: 'opus5Desc',
    tier: 'D',
    hosting: 'api',
  },
  {
    id: 'composer-25',
    nameKey: 'composer25',
    descKey: 'composer25Desc',
    tier: 'D',
    hosting: 'api',
  },
  {
    id: 'glm-53',
    nameKey: 'glm53',
    descKey: 'glm53Desc',
    tier: 'D',
    hosting: 'api',
  },
  {
    id: 'gpt-56-terra',
    nameKey: 'gpt56Terra',
    descKey: 'gpt56TerraDesc',
    tier: 'D',
    hosting: 'api',
  },
  {
    id: 'sonnet-5',
    nameKey: 'sonnet5',
    descKey: 'sonnet5Desc',
    tier: 'D',
    hosting: 'api',
  },
  {
    id: 'deepseek-v4-pro',
    nameKey: 'deepseekV4Pro',
    descKey: 'deepseekV4ProDesc',
    tier: 'F',
    hosting: 'api',
  },
  {
    id: 'gemini-37-flash',
    nameKey: 'gemini37Flash',
    descKey: 'gemini37FlashDesc',
    tier: 'Google',
    hosting: 'api',
  },
  {
    id: 'gemini-31-pro',
    nameKey: 'gemini31Pro',
    descKey: 'gemini31ProDesc',
    tier: 'Google',
    hosting: 'api',
  },
]

/** Parameterized model presets used by the VRAM calculator. */
export const models: ModelEntry[] = [
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
    attentionLayout: 'unsupported',
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
    attentionLayout: 'unsupported',
  },
  {
    id: 'qwen36-27b-a3',
    nameKey: 'qwen36_27bA3',
    descKey: 'qwen36_27bA3Desc',
    tier: 'A',
    hosting: 'local',
    params: '27B MoE → 3B active',
    totalParamsB: 27,
    activeParamsB: 3,
    isMoE: true,
    attentionLayout: 'unsupported',
  },
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
]

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

export const tierConfig: Record<
  TierLevel,
  { color: string; bgGradient: string; borderColor: string }
> = {
  'S+': {
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/10 to-orange-500/5',
    borderColor: 'border-yellow-500/20',
  },
  A: {
    color: 'text-green-400',
    bgGradient: 'from-green-500/10 to-emerald-500/5',
    borderColor: 'border-green-500/20',
  },
  B: {
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/10 to-cyan-500/5',
    borderColor: 'border-blue-500/20',
  },
  C: {
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/10 to-pink-500/5',
    borderColor: 'border-purple-500/20',
  },
  D: {
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/10 to-red-500/5',
    borderColor: 'border-orange-500/20',
  },
  F: {
    color: 'text-red-400',
    bgGradient: 'from-red-500/10 to-rose-500/5',
    borderColor: 'border-red-500/20',
  },
  Google: {
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-500/10 to-blue-500/5',
    borderColor: 'border-cyan-500/20',
  },
}
