import assert from 'node:assert/strict'
import {
  LEARNING_PROGRESS_EXPORT_KIND,
  createLearningProgressExport,
  normalizeVisitedPaths,
  validateLearningProgressExport,
} from '../src/lib/progress/schema'

const normalized = normalizeVisitedPaths([
  '/en/ai/llm/attention', '/en/ai/llm/attention',
  '/de/ai/ml-fundamentals/reinforcement-learning', 'https://evil.example', '/en//broken', 42,
])
assert.deepEqual(normalized.paths, ['/de/ai/ml-fundamentals/reinforcement-learning', '/en/ai/llm/attention'])
assert.equal(normalized.droppedPaths.length, 3)

const exported = createLearningProgressExport(new Set(['/en/ai/llm/attention']), new Set(['tokenization']))
assert.equal(exported.kind, LEARNING_PROGRESS_EXPORT_KIND)
assert.equal(exported.version, 1)
assert.deepEqual(exported.progress, {
  visitedTopics: ['/en/ai/llm/attention'],
  completedLearningPathTopics: ['tokenization'],
})

const valid = validateLearningProgressExport({
  kind: LEARNING_PROGRESS_EXPORT_KIND,
  version: 1,
  exportedAt: '2026-07-13T09:46:00.000Z',
  progress: {
    visitedTopics: ['/en/ai/llm/attention', '/bad//path'],
    completedLearningPathTopics: ['tokenization', '../bad'],
  },
  futureField: { ignored: true },
})
assert.equal(valid.ok, true)
if (valid.ok) {
  assert.deepEqual(valid.data.progress.visitedTopics, ['/en/ai/llm/attention'])
  assert.deepEqual(valid.data.progress.completedLearningPathTopics, ['tokenization'])
  assert.deepEqual(valid.droppedPaths, ['/bad//path', '../bad'])
}
assert.deepEqual(validateLearningProgressExport({ version: 1 }), {
  ok: false,
  error: `Unsupported file kind. Expected "${LEARNING_PROGRESS_EXPORT_KIND}".`,
})
console.log('progress schema checks passed')
