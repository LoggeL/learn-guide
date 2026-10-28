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
  /** KV layout: separate K/V per KV head (MHA/GQA/MQA) or one compressed latent (MLA). */
  kvFormat?: 'heads' | 'latent'
  /** Layers whose KV cache grows with the full context (defaults to nLayers). */
  kvLayers?: number
  /** Cached values per token and layer for MLA (kv_lora_rank + qk_rope_head_dim). */
  kvLatentDim?: number
  /** Layers that only keep a sliding/chunked window of tokens. */
  windowLayers?: number
  /** Window or chunk size in tokens for windowLayers. */
  attentionWindow?: number
  /** Official source for the architecture numbers (config.json / model card). */
  sourceUrl?: string
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

/**
 * Parameterized model presets used by the VRAM calculator and the local-inference
 * hardware demo. Dimensions are copied from each model's official config.json
 * (checked 2026-10-28); parameter counts come from the model cards.
 * nameKey/descKey point into vramCalc.presetNames / vramCalc.presetNotes.
 */
export const models: ModelEntry[] = [
  {
    // 24 layers alternate sliding (window 128) and full attention; 8 KV heads × 64.
    id: 'gpt-oss-20b',
    nameKey: 'gptOss20b',
    descKey: 'gptOss20b',
    tier: 'A',
    hosting: 'local',
    params: '21B MoE → 3.6B active',
    totalParamsB: 21,
    activeParamsB: 3.6,
    isMoE: true,
    nLayers: 24,
    dModel: 2880,
    kvLayers: 12,
    windowLayers: 12,
    attentionWindow: 128,
    nKVHeads: 8,
    headDim: 64,
    sourceUrl: 'https://huggingface.co/openai/gpt-oss-20b/blob/main/config.json',
  },
  {
    // Hybrid: 48 Gated DeltaNet + 16 full-attention layers (every 4th); 4 KV heads × 256.
    id: 'qwen36-27b',
    nameKey: 'qwen36_27b',
    descKey: 'qwen36_27b',
    tier: 'A',
    hosting: 'local',
    params: '27B dense',
    totalParamsB: 27,
    activeParamsB: 27,
    isMoE: false,
    nLayers: 64,
    dModel: 5120,
    kvLayers: 16,
    nKVHeads: 4,
    headDim: 256,
    sourceUrl: 'https://huggingface.co/Qwen/Qwen3.6-27B/blob/main/config.json',
  },
  {
    // Hybrid MoE: 30 Gated DeltaNet + 10 full-attention layers; 2 KV heads × 256.
    id: 'qwen36-35b-a3b',
    nameKey: 'qwen36_35bA3b',
    descKey: 'qwen36_35bA3b',
    tier: 'A',
    hosting: 'local',
    params: '35B MoE → 3B active',
    totalParamsB: 35,
    activeParamsB: 3,
    isMoE: true,
    nLayers: 40,
    dModel: 2048,
    kvLayers: 10,
    nKVHeads: 2,
    headDim: 256,
    sourceUrl:
      'https://huggingface.co/Qwen/Qwen3.6-35B-A3B/blob/main/config.json',
  },
  {
    // 62 layers, all full attention (attn_type_list = 1); 8 KV heads × 128.
    id: 'minimax-m27',
    nameKey: 'minimaxM27',
    descKey: 'minimaxM27',
    tier: 'A',
    hosting: 'open-weight',
    params: '229B MoE → 10B active',
    totalParamsB: 229,
    activeParamsB: 10,
    isMoE: true,
    nLayers: 62,
    dModel: 3072,
    nKVHeads: 8,
    headDim: 128,
    sourceUrl:
      'https://huggingface.co/MiniMaxAI/MiniMax-M2.7/blob/main/config.json',
  },
  {
    // MLA (kv_lora_rank 512 + qk_rope_head_dim 64) plus DSA indexer; 78 layers.
    id: 'glm-5-1',
    nameKey: 'glm51',
    descKey: 'glm51',
    tier: 'A',
    hosting: 'open-weight',
    params: '744B MoE → 40B active',
    totalParamsB: 744,
    activeParamsB: 40,
    isMoE: true,
    nLayers: 78,
    dModel: 6144,
    kvFormat: 'latent',
    kvLatentDim: 576,
    sourceUrl: 'https://huggingface.co/zai-org/GLM-5.1/blob/main/config.json',
  },
  {
    // MLA (kv_lora_rank 512 + qk_rope_head_dim 64), DeepSeek-V3 layout; 61 layers.
    id: 'kimi-k26',
    nameKey: 'kimiK26',
    descKey: 'kimiK26',
    tier: 'A',
    hosting: 'open-weight',
    params: '1T MoE → 32B active',
    totalParamsB: 1000,
    activeParamsB: 32,
    isMoE: true,
    nLayers: 61,
    dModel: 7168,
    kvFormat: 'latent',
    kvLatentDim: 576,
    sourceUrl:
      'https://huggingface.co/moonshotai/Kimi-K2.6/blob/main/config.json',
  },
  {
    // 36 chunked-attention layers (chunk 8192) + 12 global NoPE layers; 8 KV heads × 128.
    id: 'llama-maverick',
    nameKey: 'llamaMaverick',
    descKey: 'llamaMaverick',
    tier: 'F',
    hosting: 'open-weight',
    params: '400B MoE → 17B active',
    totalParamsB: 400,
    activeParamsB: 17,
    isMoE: true,
    nLayers: 48,
    dModel: 5120,
    kvLayers: 12,
    windowLayers: 36,
    attentionWindow: 8192,
    nKVHeads: 8,
    headDim: 128,
    sourceUrl:
      'https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct',
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
