import assert from 'node:assert/strict'
import {
  dominates,
  paretoFront,
  modelComparisons,
  modelLandscape,
} from '../src/lib/model-landscape'

assert.equal(modelLandscape.snapshotDate, '2026-09-13')
assert.equal(modelLandscape.mainDriver, 'GPT-6 Astra')
assert.equal(modelComparisons.length, 13)
assert.equal(new Set(modelComparisons.map((row) => row.id)).size, 13)
for (const row of modelComparisons) {
  assert.ok(row.name.length > 0)
  assert.ok(
    typeof row.intelligence === 'number' &&
      Number.isFinite(row.intelligence) &&
      row.intelligence > 0,
  )
  assert.ok(
    typeof row.costUsd === 'number' &&
      Number.isFinite(row.costUsd) &&
      row.costUsd > 0,
  )
}
const model = (id: string) => {
  const found = modelComparisons.find((row) => row.id === id)
  assert.ok(found, 'Missing configuration: ' + id)
  return found
}
const max = model('gpt-6-astra'),
  xhigh = model('gpt-6-astra-xhigh')
assert.equal(Math.round(max.intelligence), 53)
assert.equal(Math.round(xhigh.intelligence), 53)
assert.ok(max.intelligence > xhigh.intelligence && max.costUsd > xhigh.costUsd)
const front = paretoFront(modelComparisons)
assert.ok(
  front.includes(max) && front.includes(xhigh),
  'Rounding before comparison would incorrectly remove Astra max',
)
assert.ok(
  !paretoFront(
    modelComparisons.map((row) => ({
      ...row,
      intelligence: Math.round(row.intelligence),
    })),
  ).some((row) => row.id === max.id),
)

assert.ok(dominates(model('glm-5-3-flash'), model('deepseek-v4-1-flash')))
assert.ok(dominates(model('gpt-6-astra-medium'), model('muse-spark-1-3')))
assert.ok(dominates(model('gpt-6-astra-medium'), model('gpt-5-6-sol')))
assert.ok(
  !dominates(model('glm-5-3-flash'), model('muse-spark-1-3')),
  'Cheaper alone does not dominate a higher-quality model',
)
for (const id of ['deepseek-v4-1-flash', 'muse-spark-1-3', 'gpt-5-6-sol']) {
  assert.ok(!front.some((row) => row.id === id))
}
assert.equal(front.length, 10)

const point = { intelligence: 40, costUsd: 1 }
assert.ok(!dominates(point, point), 'Equal points do not strictly dominate')
assert.ok(!dominates({ ...point }, point))
assert.ok(
  dominates({ ...point, costUsd: 0.9 }, point),
  'Equal quality with lower cost dominates',
)
assert.ok(
  dominates({ ...point, intelligence: 41 }, point),
  'Equal cost with higher quality dominates',
)
assert.ok(
  !dominates({ intelligence: 41, costUsd: 1.1 }, point),
  'Higher quality at higher cost is a tradeoff',
)
assert.deepEqual(paretoFront([]), [])
const ties = Object.freeze([
  Object.freeze({ ...point }),
  Object.freeze({ ...point }),
])
assert.deepEqual(
  paretoFront(ties),
  ties,
  'Equivalent configurations remain on the frontier',
)
assert.equal(
  paretoFront(ties)[0],
  ties[0],
  'Returned points retain identity and order',
)
const before = JSON.stringify(modelComparisons)
paretoFront(modelComparisons)
assert.equal(JSON.stringify(modelComparisons), before, 'Inputs are not mutated')

console.log(
  'PASS: 13 valid AA configurations; exact Pareto frontier (10 points); rounding regression, real dominance, ties, strictness and input preservation.',
)
