/**
 * Small, fully computed retrieval pipeline for the RAG demo:
 * BM25 (lexical), a toy "concept" embedding with cosine similarity (dense),
 * and Reciprocal Rank Fusion (RRF) to combine both rankings.
 *
 * The toy embedding is NOT a learned model. Every word is mapped to a few
 * hand-written concept dimensions so that synonyms land close together.
 * Real embedding models learn such similarities from data.
 */

export interface RetrievalDoc {
  id: number
  text: string
}

const STOPWORDS = new Set([
  // English
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'do', 'does', 'for', 'from', 'get', 'how', 'i', 'if', 'in',
  'is', 'it', 'its', 'mean', 'means', 'my', 'of', 'on', 'or', 'the', 'there', 'this', 'to', 'what', 'when', 'with',
  'you', 'your', 'not', 'that', 'long', 'will',
  // German
  'am', 'an', 'auf', 'bei', 'bekomme', 'bedeutet', 'das', 'dass', 'den', 'der', 'die', 'ein', 'eine', 'einen', 'es',
  'für', 'ich', 'im', 'in', 'ist', 'kann', 'mein', 'meine', 'mit', 'nach', 'nicht', 'oder', 'sie', 'und', 'von',
  'was', 'wie', 'wird', 'zu', 'zum', 'zur', 'lange', 'gilt', 'werden', 'innerhalb', 'aus', 'dem', 'ab', 'sind',
])

/** Lowercase tokens; keeps codes such as "e-4012" together. */
export function tokenize(text: string): string[] {
  return (text.toLocaleLowerCase().match(/[a-z0-9äöüß]+(?:-[a-z0-9]+)*/g) ?? []).filter(w => !STOPWORDS.has(w))
}

export const CONCEPTS = ['refund', 'error', 'firmware', 'heat', 'shipping', 'warranty', 'receipt'] as const
export type Concept = (typeof CONCEPTS)[number]

/** Hand-written lexicon: word -> concept weights (EN + DE). */
const LEXICON: Record<string, Partial<Record<Concept, number>>> = {
  // refund / money back
  refund: { refund: 1 }, refunds: { refund: 1 }, refunded: { refund: 1 }, money: { refund: 0.8 }, back: { refund: 0.4 },
  return: { refund: 0.7 }, returned: { refund: 0.7 }, returns: { refund: 0.7 }, reimburse: { refund: 0.9 },
  payment: { refund: 0.5 }, erstattung: { refund: 1 }, erstattet: { refund: 1 }, geld: { refund: 0.8 },
  zurück: { refund: 0.4 }, rückgabe: { refund: 0.7 }, zurückgegeben: { refund: 0.7 }, zahlungsmittel: { refund: 0.5 },
  zurückerstattet: { refund: 1 }, erstattungen: { refund: 1 },
  // error / fault
  error: { error: 1 }, fault: { error: 0.8 }, failed: { error: 0.7 }, broken: { error: 0.5, warranty: 0.4 },
  code: { error: 0.4 }, fehler: { error: 1 }, fehlgeschlagen: { error: 0.7 }, kaputt: { error: 0.5, warranty: 0.4 },
  defekt: { error: 0.4, warranty: 0.6 },
  // firmware / software
  firmware: { firmware: 1 }, update: { firmware: 0.7 }, reinstall: { firmware: 0.6 }, signature: { firmware: 0.5 },
  software: { firmware: 0.8 }, neu: { firmware: 0.2 }, installieren: { firmware: 0.6 }, installiere: { firmware: 0.6 }, signaturprüfung: { firmware: 0.5 },
  // heat
  overheated: { heat: 1 }, hot: { heat: 0.9 }, heat: { heat: 1 }, cool: { heat: 0.6 }, vents: { heat: 0.5 },
  überhitzt: { heat: 1 }, heiß: { heat: 0.9 }, abkühlen: { heat: 0.6 }, lüftungsschlitze: { heat: 0.5 },
  // shipping
  shipping: { shipping: 1 }, ship: { shipping: 1 }, delivery: { shipping: 1 }, arrive: { shipping: 0.8 },
  package: { shipping: 0.7 }, versand: { shipping: 1 }, versendet: { shipping: 1 }, lieferung: { shipping: 1 },
  ankommen: { shipping: 0.8 }, paket: { shipping: 0.7 },
  // warranty / defects
  warranty: { warranty: 1 }, guarantee: { warranty: 0.9 }, defects: { warranty: 1 }, defect: { warranty: 1 },
  damage: { warranty: 0.6 }, covered: { warranty: 0.6 }, screen: { warranty: 0.2 }, garantie: { warranty: 1 },
  gewährleistung: { warranty: 0.9 }, hardwaredefekte: { warranty: 1 }, schäden: { warranty: 0.6 },
  abgedeckt: { warranty: 0.6 }, display: { warranty: 0.2 },
  // receipt / proof of purchase
  receipt: { receipt: 1 }, proof: { receipt: 0.7 }, invoice: { receipt: 0.9 }, kassenbon: { receipt: 1 },
  beleg: { receipt: 1 }, quittung: { receipt: 1 }, rechnung: { receipt: 0.9 },
}

export type Vector = Record<Concept, number>

export function embed(text: string): Vector {
  const v = Object.fromEntries(CONCEPTS.map(c => [c, 0])) as Vector
  for (const token of tokenize(text)) {
    const entry = LEXICON[token]
    if (!entry) continue
    for (const c of CONCEPTS) v[c] += entry[c] ?? 0
  }
  return v
}

export function cosine(a: Vector, b: Vector): number {
  let dot = 0
  let na = 0
  let nb = 0
  for (const c of CONCEPTS) {
    dot += a[c] * b[c]
    na += a[c] * a[c]
    nb += b[c] * b[c]
  }
  return na === 0 || nb === 0 ? 0 : dot / Math.sqrt(na * nb)
}

export interface Ranked {
  id: number
  score: number
  rank: number
  matched: string[]
}

/** Okapi BM25 with the Lucene IDF variant (always >= 0). */
export function bm25(query: string, docs: readonly RetrievalDoc[], k1 = 1.2, b = 0.75): Ranked[] {
  const tokenized = docs.map(d => tokenize(d.text))
  const avgdl = tokenized.reduce((s, t) => s + t.length, 0) / Math.max(1, docs.length)
  const terms = Array.from(new Set(tokenize(query)))
  const N = docs.length
  const scored = docs.map((d, i) => {
    const toks = tokenized[i]
    let score = 0
    const matched: string[] = []
    for (const term of terms) {
      const tf = toks.filter(t => t === term).length
      if (tf === 0) continue
      const n = tokenized.filter(t => t.includes(term)).length
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5))
      score += idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * toks.length / avgdl))
      matched.push(term)
    }
    return { id: d.id, score, matched }
  })
  return rankList(scored)
}

export function dense(query: string, docs: readonly RetrievalDoc[]): Ranked[] {
  const q = embed(query)
  return rankList(docs.map(d => ({ id: d.id, score: cosine(q, embed(d.text)), matched: [] })))
}

function rankList(items: { id: number; score: number; matched: string[] }[]): Ranked[] {
  return items
    .filter(x => x.score > 1e-9)
    .sort((a, b) => b.score - a.score || a.id - b.id)
    .map((x, i) => ({ ...x, rank: i + 1 }))
}

export interface Fused {
  id: number
  score: number
  rank: number
  lexicalRank?: number
  denseRank?: number
}

/** Reciprocal Rank Fusion (Cormack et al. 2009): score = sum over lists of 1 / (k + rank). */
export function rrf(lists: { lexical: Ranked[]; dense: Ranked[] }, k = 60): Fused[] {
  const ids = new Set([...lists.lexical, ...lists.dense].map(r => r.id))
  const fused = Array.from(ids).map(id => {
    const lexicalRank = lists.lexical.find(r => r.id === id)?.rank
    const denseRank = lists.dense.find(r => r.id === id)?.rank
    const score = (lexicalRank ? 1 / (k + lexicalRank) : 0) + (denseRank ? 1 / (k + denseRank) : 0)
    return { id, score, lexicalRank, denseRank }
  })
  return fused.sort((a, b) => b.score - a.score || a.id - b.id).map((x, i) => ({ ...x, rank: i + 1 }))
}
