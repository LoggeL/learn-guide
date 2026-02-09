'use client'

import { CategoryPage } from '@/components/layout/CategoryPage'

// Future topics for this category:
// - Batching & Throughput
// - Paged Attention / vLLM
// - Continuous Batching
// - Model Serving (TensorRT-LLM, vLLM, etc.)
// - Prefill vs Decode phases
// - Speculative Decoding (already exists under /ai/llm, could be linked/moved)
// - Quantization for Inference (already exists under /ai/llm, could be linked/moved)

export default function LLMInferencePage() {
  return <CategoryPage categoryId="llm-inference" />
}
