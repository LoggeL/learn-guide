/**
 * Selected AA configurations, captured from the public model leaderboard.
 * All selected indices are reported (not estimated). Costs are weighted USD per
 * Intelligence Index task, not per-token prices or estimates for user tasks.
 * This selection does not represent the entire AA leaderboard.
 */
export type ModelFamily =
  'astra' | 'luna' | 'glm' | 'fable' | 'sol' | 'deepseek' | 'muse'

export interface ModelComparison {
  readonly id: string
  readonly name: string
  readonly intelligence: number
  readonly costUsd: number
  readonly family: ModelFamily
}

export const modelLandscape = {
  snapshotDate: '2026-09-13',
  mainDriver: 'GPT-6 Astra',
  sources: {
    leaderboard: 'https://artificialanalysis.ai/leaderboards/models',
    astraArticle:
      'https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra',
    methodology: 'https://artificialanalysis.ai/methodology',
  },
} as const

export const modelComparisons: readonly ModelComparison[] = [
  {
    id: 'gpt-6-astra-low',
    name: 'GPT-6 Astra (low)',
    intelligence: 45.9944993120341,
    costUsd: 0.8175139285656057,
    family: 'astra',
  },
  {
    id: 'gpt-6-astra-medium',
    name: 'GPT-6 Astra (medium)',
    intelligence: 49.6685363034369,
    costUsd: 1.5406493220021167,
    family: 'astra',
  },
  {
    id: 'gpt-6-astra-high',
    name: 'GPT-6 Astra (high)',
    intelligence: 51.0480721636152,
    costUsd: 1.7214332536034334,
    family: 'astra',
  },
  {
    id: 'gpt-6-astra-xhigh',
    name: 'GPT-6 Astra (xhigh)',
    intelligence: 52.5059027108782,
    costUsd: 2.308795912269076,
    family: 'astra',
  },
  {
    id: 'gpt-6-astra',
    name: 'GPT-6 Astra (max)',
    intelligence: 52.814069395513,
    costUsd: 3.2575003134834164,
    family: 'astra',
  },
  {
    id: 'gpt-5-6-luna',
    name: 'GPT-5.6 Luna (max)',
    intelligence: 37.5048489690841,
    costUsd: 0.17829726152289094,
    family: 'luna',
  },
  {
    id: 'glm-5-3-flash',
    name: 'GLM-5.3-Flash',
    intelligence: 41.907366113455,
    costUsd: 0.2532595604307378,
    family: 'glm',
  },
  {
    id: 'claude-fable-5-1-xhigh',
    name: 'Claude Fable 5.1 (xhigh with fallback)',
    intelligence: 53.1840337538944,
    costUsd: 5.978304247388257,
    family: 'fable',
  },
  {
    id: 'claude-fable-5-1',
    name: 'Claude Fable 5.1 (max with fallback)',
    intelligence: 53.3737509623252,
    costUsd: 7.629706364004841,
    family: 'fable',
  },
  {
    id: 'gpt-5-6-sol-high',
    name: 'GPT-5.6 Sol (high)',
    intelligence: 42.4991760420519,
    costUsd: 0.807982690134498,
    family: 'sol',
  },
  {
    id: 'gpt-5-6-sol',
    name: 'GPT-5.6 Sol (max)',
    intelligence: 47.0613568915036,
    costUsd: 1.98845538085375,
    family: 'sol',
  },
  {
    id: 'deepseek-v4-1-flash',
    name: 'DeepSeek V4.1 Flash (max)',
    intelligence: 39.545442472527,
    costUsd: 0.26522527009606844,
    family: 'deepseek',
  },
  {
    id: 'muse-spark-1-3',
    name: 'Muse Spark 1.3 (max)',
    intelligence: 48.1690107719685,
    costUsd: 1.6048932100125866,
    family: 'muse',
  },
]

type Coordinates = Pick<ModelComparison, 'intelligence' | 'costUsd'>

/** Lower cost and higher intelligence are preferable; at least one must improve. */
export function dominates(a: Coordinates, b: Coordinates): boolean {
  return (
    a.costUsd <= b.costUsd &&
    a.intelligence >= b.intelligence &&
    (a.costUsd < b.costUsd || a.intelligence > b.intelligence)
  )
}

/** Exact comparisons, no rounding; preserves input order and leaves input intact. */
export function paretoFront<T extends Coordinates>(rows: readonly T[]): T[] {
  return rows.filter((row) => !rows.some((other) => dominates(other, row)))
}
