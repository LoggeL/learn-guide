// Constructed dataset for the fairness trade-off demo on the bias page.
// Two groups with deliberately different base rates (60 % vs. 30 % positives),
// so the Kleinberg/Chouldechova impossibility result becomes visible.

export interface FairnessCase {
  score: number
  positive: boolean
}

export const fairnessGroups: FairnessCase[][] = [
  [
    { score: 85, positive: true }, { score: 78, positive: true }, { score: 70, positive: true },
    { score: 62, positive: true }, { score: 48, positive: true }, { score: 35, positive: true },
    { score: 92, positive: false }, { score: 66, positive: false }, { score: 44, positive: false },
    { score: 18, positive: false },
  ],
  [
    { score: 80, positive: true }, { score: 64, positive: true }, { score: 50, positive: true },
    { score: 90, positive: false }, { score: 58, positive: false }, { score: 46, positive: false },
    { score: 38, positive: false }, { score: 25, positive: false }, { score: 15, positive: false },
    { score: 8, positive: false },
  ],
]

export const THRESHOLD_STEP = 5

export interface GroupMetrics {
  n: number
  positives: number
  negatives: number
  selected: number
  tp: number
  fp: number
  baseRate: number
  selectionRate: number
  tpr: number
  fpr: number
  /** Precision / positive predictive value; null when nothing is selected. */
  ppv: number | null
  accuracy: number
}

export function groupMetrics(group: FairnessCase[], threshold: number): GroupMetrics {
  let positives = 0, selected = 0, tp = 0, fp = 0
  for (const row of group) {
    if (row.positive) positives++
    if (row.score >= threshold) {
      selected++
      if (row.positive) tp++
      else fp++
    }
  }
  const n = group.length
  const negatives = n - positives
  const tn = negatives - fp
  return {
    n, positives, negatives, selected, tp, fp,
    baseRate: positives / n,
    selectionRate: selected / n,
    tpr: positives ? tp / positives : 0,
    fpr: negatives ? fp / negatives : 0,
    ppv: selected ? tp / selected : null,
    accuracy: (tp + tn) / n,
  }
}

export type FairnessCriterion = 'selection' | 'tpr' | 'ppv' | 'odds'

/** Gap between the two groups for one criterion (0 = criterion satisfied). */
export function criterionGap(a: GroupMetrics, b: GroupMetrics, criterion: FairnessCriterion): number {
  switch (criterion) {
    case 'selection': return Math.abs(a.selectionRate - b.selectionRate)
    case 'tpr': return Math.abs(a.tpr - b.tpr)
    case 'ppv': return a.ppv === null || b.ppv === null ? Infinity : Math.abs(a.ppv - b.ppv)
    case 'odds': return Math.max(Math.abs(a.tpr - b.tpr), Math.abs(a.fpr - b.fpr))
  }
}

/**
 * Exhaustive search over threshold pairs: smallest gap for the criterion,
 * ties broken by overall accuracy. Each group must select at least one true positive and reject at least one negative.
 */
export function bestThresholds(groups: FairnessCase[][], criterion: FairnessCriterion): [number, number] {
  let best: [number, number] = [50, 50]
  let bestGap = Infinity
  let bestAcc = -1
  for (let ta = 0; ta <= 100; ta += THRESHOLD_STEP) {
    for (let tb = 0; tb <= 100; tb += THRESHOLD_STEP) {
      const a = groupMetrics(groups[0], ta)
      const b = groupMetrics(groups[1], tb)
      if (!a.tp || !b.tp || a.fp === a.negatives || b.fp === b.negatives) continue
      const gap = criterionGap(a, b, criterion)
      const acc = (a.accuracy * a.n + b.accuracy * b.n) / (a.n + b.n)
      if (gap < bestGap - 1e-9 || (Math.abs(gap - bestGap) < 1e-9 && acc > bestAcc)) {
        best = [ta, tb]
        bestGap = gap
        bestAcc = acc
      }
    }
  }
  return best
}
