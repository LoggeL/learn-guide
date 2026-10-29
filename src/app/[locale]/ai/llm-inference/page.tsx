'use client'

import { CategoryPage } from '@/components/layout/CategoryPage'

// Topics of this category are listed from src/lib/topics.ts (getTopicCategories).

export default function LLMInferencePage() {
  return <CategoryPage categoryId="llm-inference" />
}
