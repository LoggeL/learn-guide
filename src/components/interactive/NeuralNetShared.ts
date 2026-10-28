// Shared math and formatting for the 2-2-1 network demos on the neural-networks page.

export type NeuralNetActivation = 'relu' | 'linear'

/**
 * Parameters of a 2-2-1 network.
 * wJK = weight from input xK to hidden neuron hJ, bJ = bias of hJ,
 * vJ = weight from hJ to the output, c = output bias.
 */
export interface NeuralNetParams221 {
  w11: number
  w12: number
  b1: number
  w21: number
  w22: number
  b2: number
  v1: number
  v2: number
  c: number
}

export interface NeuralNetForward221 {
  z1: number
  z2: number
  h1: number
  h2: number
  y: number
  prediction: 0 | 1
}

/** The four binary input combinations, in the order (0,0), (0,1), (1,0), (1,1). */
export const NEURAL_NET_CASES: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
]

/** Output y >= threshold counts as class 1. */
export const NEURAL_NET_THRESHOLD = 0.5

/** Hand-picked XOR solution (Goodfellow et al., Deep Learning, section 6.1). */
export const NEURAL_NET_XOR_WEIGHTS: NeuralNetParams221 = {
  w11: 1,
  w12: 1,
  b1: 0,
  w21: 1,
  w22: 1,
  b2: -1,
  v1: 1,
  v2: -2,
  c: 0,
}

export function neuralNetRelu(z: number): number {
  return Math.max(0, z)
}

export function neuralNetForward221(
  p: NeuralNetParams221,
  x1: number,
  x2: number,
  activation: NeuralNetActivation = 'relu',
): NeuralNetForward221 {
  const act = activation === 'relu' ? neuralNetRelu : (z: number) => z
  const z1 = p.w11 * x1 + p.w12 * x2 + p.b1
  const z2 = p.w21 * x1 + p.w22 * x2 + p.b2
  const h1 = act(z1)
  const h2 = act(z2)
  const y = p.v1 * h1 + p.v2 * h2 + p.c
  return { z1, z2, h1, h2, y, prediction: y >= NEURAL_NET_THRESHOLD - 1e-9 ? 1 : 0 }
}

/**
 * Locale-aware number formatting with a real minus sign and no "-0".
 * `minDigits`/`maxDigits` control the fraction digits.
 */
export function neuralNetFormat(value: number, locale: string, maxDigits = 2, minDigits = 0): string {
  const limit = 0.5 * Math.pow(10, -maxDigits)
  const v = Math.abs(value) < limit ? 0 : value
  return v
    .toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', {
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    })
    .replace('-', '−')
}
