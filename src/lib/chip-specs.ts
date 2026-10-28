/**
 * Accelerator datasheet values, taken only from vendor pages/documents.
 * Retrieved and cross-checked on 2026-10-28. All compute figures are DENSE
 * (no 2:4 structured sparsity). Where a vendor page lists system totals,
 * the per-chip value is the total divided by the chip count (noted in `derived`).
 */

export const CHIP_SPECS_AS_OF = '2026-10-28'

export type ChipId =
  | 'h100'
  | 'b200'
  | 'b300'
  | 'rubin'
  | 'mi355x'
  | 'ironwood'
  | 'trainium2'
  | 'trainium3'
  | 'maia200'
  | 'wse3'
  | 'groq'

export interface ChipSpec {
  id: ChipId
  name: string
  vendor: string
  /** Year and month the chip was announced (YYYY-MM); null if not documented. */
  announced: string | null
  memoryType: 'HBM' | 'HBM3' | 'HBM3e' | 'HBM4' | 'SRAM'
  /** Capacity in GB (decimal) or GiB where the vendor states GiB (see `gib`). */
  memoryGB: number
  gib?: boolean
  /** Memory bandwidth in TB/s (for SRAM chips: on-die bandwidth). */
  bandwidthTBs: number
  /** Dense FP8 (or MXFP8) peak in TFLOPS; null if the vendor gives none. */
  fp8DenseTF: number | null
  /** Dense BF16 peak in TFLOPS (FP16 for Groq); null if the vendor gives none. */
  bf16DenseTF: number | null
  /** Per-chip value derived from a system total or a sparse figure ÷ 2. */
  derived?: boolean
  /** Lower bound ("more than …") rather than an exact figure. */
  atLeast?: boolean
  /** Usable in the single-device roofline calculator. */
  calculator: boolean
  sources: string[]
}

export const chipSpecs: ChipSpec[] = [
  {
    id: 'h100',
    name: 'H100 SXM',
    vendor: 'NVIDIA',
    announced: '2022-03',
    memoryType: 'HBM3',
    memoryGB: 80,
    bandwidthTBs: 3.35,
    fp8DenseTF: 1979,
    bf16DenseTF: 989,
    derived: true,
    calculator: true,
    sources: ['https://www.nvidia.com/en-us/data-center/h100/'],
  },
  {
    id: 'b200',
    name: 'B200 (HGX/DGX)',
    vendor: 'NVIDIA',
    announced: '2024-03',
    memoryType: 'HBM3e',
    memoryGB: 180,
    bandwidthTBs: 8,
    fp8DenseTF: 4500,
    bf16DenseTF: 2250,
    derived: true,
    calculator: true,
    sources: [
      'https://www.nvidia.com/en-us/data-center/dgx-b200/',
      'https://www.nvidia.com/en-us/data-center/hgx/',
    ],
  },
  {
    id: 'b300',
    name: 'Blackwell Ultra (GB300)',
    vendor: 'NVIDIA',
    announced: '2025-03',
    memoryType: 'HBM3e',
    memoryGB: 288,
    bandwidthTBs: 8,
    fp8DenseTF: 5000,
    bf16DenseTF: 2500,
    derived: true,
    calculator: true,
    sources: [
      'https://www.nvidia.com/en-us/data-center/gb300-nvl72/',
      'https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/',
    ],
  },
  {
    id: 'rubin',
    name: 'Rubin (Vera Rubin NVL72)',
    vendor: 'NVIDIA',
    announced: '2026-01',
    memoryType: 'HBM4',
    memoryGB: 288,
    bandwidthTBs: 19.2,
    fp8DenseTF: 17500,
    bf16DenseTF: 4000,
    calculator: true,
    sources: ['https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/'],
  },
  {
    id: 'mi355x',
    name: 'Instinct MI355X',
    vendor: 'AMD',
    announced: '2025-06',
    memoryType: 'HBM3e',
    memoryGB: 288,
    bandwidthTBs: 8,
    fp8DenseTF: 5000,
    bf16DenseTF: 2500,
    calculator: true,
    sources: [
      'https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html',
    ],
  },
  {
    id: 'ironwood',
    name: 'TPU7x (Ironwood)',
    vendor: 'Google',
    announced: '2025-04',
    memoryType: 'HBM3e',
    memoryGB: 192,
    gib: true,
    bandwidthTBs: 7.38,
    fp8DenseTF: 4614,
    bf16DenseTF: 2307,
    calculator: true,
    sources: ['https://docs.cloud.google.com/tpu/docs/tpu7x'],
  },
  {
    id: 'trainium2',
    name: 'Trainium2',
    vendor: 'AWS',
    announced: '2023-11',
    memoryType: 'HBM',
    memoryGB: 96,
    gib: true,
    bandwidthTBs: 2.9,
    fp8DenseTF: 1299,
    bf16DenseTF: 667,
    calculator: true,
    sources: [
      'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html',
    ],
  },
  {
    id: 'trainium3',
    name: 'Trainium3',
    vendor: 'AWS',
    announced: '2025-12',
    memoryType: 'HBM3e',
    memoryGB: 144,
    gib: true,
    bandwidthTBs: 4.9,
    fp8DenseTF: 2517,
    bf16DenseTF: 671,
    calculator: true,
    sources: [
      'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html',
      'https://aws.amazon.com/ai/machine-learning/trainium/',
    ],
  },
  {
    id: 'maia200',
    name: 'Maia 200',
    vendor: 'Microsoft',
    announced: '2026-01',
    memoryType: 'HBM3e',
    memoryGB: 216,
    bandwidthTBs: 7,
    fp8DenseTF: 5000,
    bf16DenseTF: null,
    atLeast: true,
    calculator: false,
    sources: [
      'https://news.microsoft.com/source/emea/2026/01/microsoft-introduces-maia-200-new-inference-accelerator-enhances-ai-performance-in-azure/',
    ],
  },
  {
    id: 'wse3',
    name: 'WSE-3 (CS-3)',
    vendor: 'Cerebras',
    announced: '2024-03',
    memoryType: 'SRAM',
    memoryGB: 44,
    bandwidthTBs: 21000,
    fp8DenseTF: null,
    bf16DenseTF: null,
    calculator: false,
    sources: [
      'https://www.cerebras.ai/press-release/cerebras-announces-third-generation-wafer-scale-engine',
      'https://www.hc2024.hotchips.org/assets/program/conference/day2/72_HC2024.Cerebras.Sean.v03.final.pdf',
    ],
  },
  {
    id: 'groq',
    name: 'GroqChip (LPU v1)',
    vendor: 'Groq',
    announced: null,
    memoryType: 'SRAM',
    memoryGB: 0.23,
    bandwidthTBs: 80,
    fp8DenseTF: null,
    bf16DenseTF: 188,
    calculator: false,
    sources: [
      'https://groq.com/wp-content/uploads/2024/08/GroqChip%E2%84%A2-Processor-Product-Brief-v1.7.pdf',
    ],
  },
]

/** Ridge point of the roofline: peak FLOP/s ÷ bytes/s = FLOP per byte. */
export function ridgePoint(peakTFLOPS: number, bandwidthTBs: number) {
  return peakTFLOPS / bandwidthTBs
}

/**
 * Dense decoder architectures from the published Llama 3.1 configs
 * (huggingface.co/meta-llama). Used only as size presets.
 */
export interface RooflineModel {
  id: string
  name: string
  paramsB: number
  layers: number
  heads: number
  kvHeads: number
  headDim: number
}

export const rooflineModels: RooflineModel[] = [
  { id: '8b', name: 'Llama 3.1 8B', paramsB: 8.03, layers: 32, heads: 32, kvHeads: 8, headDim: 128 },
  { id: '70b', name: 'Llama 3.1 70B', paramsB: 70.6, layers: 80, heads: 64, kvHeads: 8, headDim: 128 },
  { id: '405b', name: 'Llama 3.1 405B', paramsB: 405, layers: 126, heads: 128, kvHeads: 8, headDim: 128 },
]
