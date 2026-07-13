export const LEARNING_PROGRESS_SCHEMA_VERSION = 1
export const LEARNING_PROGRESS_EXPORT_KIND = 'learn-guide.progress'
export const VISITED_PATHS_STORAGE_KEY = 'visitedPaths'
export const COMPLETED_LEARNING_PATH_STORAGE_KEY = 'learning-path-completed'

export type LearningProgressExportV1 = {
  kind: typeof LEARNING_PROGRESS_EXPORT_KIND
  version: 1
  exportedAt: string
  progress: {
    visitedTopics: string[]
    completedLearningPathTopics: string[]
  }
}

export type LearningProgressValidationResult =
  | { ok: true; data: LearningProgressExportV1; droppedPaths: string[] }
  | { ok: false; error: string }

const MAX_VISITED_PATHS = 2000

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function normalizeVisitedPaths(value: unknown): { paths: string[]; droppedPaths: string[] } {
  if (!Array.isArray(value)) return { paths: [], droppedPaths: [] }

  const seen = new Set<string>()
  const droppedPaths: string[] = []

  for (const item of value) {
    if (typeof item !== 'string') {
      droppedPaths.push(String(item))
      continue
    }

    const path = item.trim()
    const isValidPath = /^\/[a-z]{2}(?:\/[A-Za-z0-9._~!$&'()*+,;=:@%-]+)*\/?$/.test(path)
      && !path.includes('//')
      && path.length <= 240

    if (!isValidPath) {
      droppedPaths.push(item)
      continue
    }

    if (seen.size < MAX_VISITED_PATHS) seen.add(path)
    else droppedPaths.push(item)
  }

  return { paths: Array.from(seen).sort(), droppedPaths }
}

function normalizeTopicIds(value: unknown): { ids: string[]; droppedIds: string[] } {
  if (!Array.isArray(value)) return { ids: [], droppedIds: [] }
  const ids = new Set<string>()
  const droppedIds: string[] = []
  for (const item of value) {
    const id = typeof item === 'string' ? item.trim() : ''
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && id.length <= 100) ids.add(id)
    else droppedIds.push(String(item))
  }
  return { ids: Array.from(ids).sort(), droppedIds }
}

export function createLearningProgressExport(
  visitedPaths: Iterable<string>,
  completedLearningPathTopics: Iterable<string> = [],
): LearningProgressExportV1 {
  const { paths } = normalizeVisitedPaths(Array.from(visitedPaths))
  const { ids } = normalizeTopicIds(Array.from(completedLearningPathTopics))

  return {
    kind: LEARNING_PROGRESS_EXPORT_KIND,
    version: LEARNING_PROGRESS_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    progress: {
      visitedTopics: paths,
      completedLearningPathTopics: ids,
    },
  }
}

export function validateLearningProgressExport(raw: unknown): LearningProgressValidationResult {
  if (!isPlainObject(raw)) {
    return { ok: false, error: 'Import file must contain a JSON object.' }
  }

  if (raw.kind !== LEARNING_PROGRESS_EXPORT_KIND) {
    return { ok: false, error: `Unsupported file kind. Expected "${LEARNING_PROGRESS_EXPORT_KIND}".` }
  }

  if (raw.version !== LEARNING_PROGRESS_SCHEMA_VERSION) {
    return { ok: false, error: 'Unsupported progress file version.' }
  }

  if (typeof raw.exportedAt !== 'string' || Number.isNaN(Date.parse(raw.exportedAt))) {
    return { ok: false, error: 'Progress file has an invalid exportedAt timestamp.' }
  }

  if (!isPlainObject(raw.progress)) {
    return { ok: false, error: 'Progress file is missing its progress section.' }
  }

  const { paths, droppedPaths } = normalizeVisitedPaths(raw.progress.visitedTopics)
  const { ids, droppedIds } = normalizeTopicIds(raw.progress.completedLearningPathTopics)

  return {
    ok: true,
    data: {
      kind: LEARNING_PROGRESS_EXPORT_KIND,
      version: LEARNING_PROGRESS_SCHEMA_VERSION,
      exportedAt: raw.exportedAt,
      progress: {
      visitedTopics: paths,
      completedLearningPathTopics: ids,
    },
    },
    droppedPaths: [...droppedPaths, ...droppedIds],
  }
}
