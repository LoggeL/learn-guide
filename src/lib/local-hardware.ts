/**
 * Example hardware for the local-inference demo. Capacity and peak memory
 * bandwidth are vendor specifications (checked 2026-10-28). `usableGB` is an
 * explicit teaching assumption, not a measurement: discrete GPUs use their VRAM;
 * unified-memory systems leave part of the pool to the operating system.
 */
export interface LocalHardware {
  id: string
  /** Product name (proper noun, not translated). */
  name: string
  kind: 'gpu' | 'unified'
  memoryGB: number
  /** Memory the model may use in the demo. */
  usableGB: number
  bandwidthGBs: number
  sourceUrl: string
}

/** Share of unified memory assumed to be available to the GPU. */
export const UNIFIED_USABLE_SHARE = 0.75

export const localHardware: LocalHardware[] = [
  {
    id: 'rtx-4090',
    name: 'GeForce RTX 4090',
    kind: 'gpu',
    memoryGB: 24,
    usableGB: 24,
    bandwidthGBs: 1008,
    sourceUrl:
      'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/',
  },
  {
    id: 'rtx-5090',
    name: 'GeForce RTX 5090',
    kind: 'gpu',
    memoryGB: 32,
    usableGB: 32,
    bandwidthGBs: 1792,
    sourceUrl:
      'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/',
  },
  {
    id: 'ryzen-ai-max-395',
    name: 'Ryzen AI Max+ 395 (128 GB)',
    kind: 'unified',
    memoryGB: 128,
    // AMD Variable Graphics Memory: up to 96 GB of 128 GB assignable to the GPU.
    usableGB: 96,
    bandwidthGBs: 256,
    sourceUrl:
      'https://www.amd.com/en/products/processors/laptop/ryzen/ai-300-series/amd-ryzen-ai-max-plus-395.html',
  },
  {
    id: 'dgx-spark',
    name: 'NVIDIA DGX Spark',
    kind: 'unified',
    memoryGB: 128,
    usableGB: 128 * UNIFIED_USABLE_SHARE,
    bandwidthGBs: 273,
    sourceUrl: 'https://docs.nvidia.com/dgx/dgx-spark/hardware.html',
  },
  {
    id: 'm4-max-128',
    name: 'MacBook Pro M4 Max (128 GB)',
    kind: 'unified',
    memoryGB: 128,
    usableGB: 128 * UNIFIED_USABLE_SHARE,
    bandwidthGBs: 546,
    sourceUrl:
      'https://www.apple.com/newsroom/2024/10/new-macbook-pro-features-m4-family-of-chips-and-apple-intelligence/',
  },
  {
    id: 'm3-ultra-512',
    name: 'Mac Studio M3 Ultra (512 GB)',
    kind: 'unified',
    memoryGB: 512,
    usableGB: 512 * UNIFIED_USABLE_SHARE,
    bandwidthGBs: 819,
    sourceUrl:
      'https://www.apple.com/newsroom/2025/03/apple-unveils-new-mac-studio-the-most-powerful-mac-ever/',
  },
]

/** Dual-channel DDR5-5600: 2 channels × 8 bytes × 5600 MT/s ≈ 89.6 GB/s (theoretical peak). */
export const DDR5_DUAL_CHANNEL_GBS = 89.6
