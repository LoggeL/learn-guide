/** Exact decoding operations on a small, explicitly supplied vocabulary. */
export function softmax(logits: readonly number[], temperature: number): number[] {
  if (!logits.length || logits.some(x => !Number.isFinite(x))) throw new Error('Finite logits required')
  if (!Number.isFinite(temperature) || temperature < 0) throw new Error('Nonnegative temperature required')
  const maximum = Math.max(...logits)
  if (temperature === 0) return logits.map((_, i) => i === logits.indexOf(maximum) ? 1 : 0)
  const weights = logits.map(x => Math.exp((x - maximum) / temperature))
  const total = weights.reduce((a, b) => a + b, 0)
  return weights.map(x => x / total)
}

export function nucleus(probabilities: readonly number[], topP: number) {
  if (!(topP > 0 && topP <= 1)) throw new Error('topP must be in (0, 1]')
  const ranked = probabilities.map((p, index) => ({ p, index })).sort((a, b) => b.p - a.p)
  const kept = new Set<number>()
  let mass = 0
  for (const row of ranked) {
    if (mass >= topP) break
    kept.add(row.index)
    mass += row.p
  }
  return probabilities.map((p, index) => kept.has(index) ? p / mass : 0)
}

export function sampleIndex(probabilities: readonly number[], draw: number): number {
  if (!(draw >= 0 && draw < 1)) throw new Error('Draw must be in [0, 1)')
  let cumulative = 0
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i]
    if (draw < cumulative) return i
  }
  // Accommodate floating point summation, never choose a filtered zero-probability token.
  for (let i = probabilities.length - 1; i >= 0; i--) if (probabilities[i] > 0) return i
  throw new Error('Positive probability mass required')
}
