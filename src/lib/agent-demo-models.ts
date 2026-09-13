// Pure, inspectable teaching models. No external model calls or inferred confidence.
export const skillRules = [
  { id: 'code-review', words: ['review', 'überprüfe', 'prüfe', 'bugs', 'fehler'] },
  { id: 'documentation', words: ['document', 'documentation', 'dokumentation', 'dokumentiere', 'docs', 'readme'] },
  { id: 'git-workflow', words: ['commit', 'git', 'push', 'branch', 'merge', 'pr', 'pull request'] },
  { id: 'explain', words: ['explain', 'erkläre', 'erklären', 'how does', 'what is'] },
] as const

export const words = (text: string): string[] => text.toLocaleLowerCase().normalize('NFC').match(new RegExp('[\\p{L}\\p{N}]+', 'gu')) ?? []

export function matchSkill(text: string) {
  const input = ` ${words(text).join(' ')} `
  return skillRules.flatMap((rule, index) => {
    const matched = rule.words.find(word => input.includes(` ${word} `))
    return matched ? [{ index, id: rule.id, matched }] : []
  })
}

export function retrieveNotes(notes: { id: number; text: string }[], query: string) {
  const terms = Array.from(new Set(words(query)))
  return notes.map(note => ({ ...note, matched: terms.filter(term => words(note.text).includes(term)) }))
    .filter(note => !terms.length || note.matched.length > 0)
    .sort((a, b) => b.matched.length - a.matched.length || b.id - a.id)
}

export const rewardCases = [[1, 2], [-2, 5], [10, 20], []] as number[][]
export const rewardCandidates = {
  sum: (values: number[]) => values.reduce((sum, value) => sum + value, 0),
  constant: (_values: number[]) => 3,
  length: (values: number[]) => values.length,
}
export function checkReward(candidate: keyof typeof rewardCandidates, values: number[], exact: boolean) {
  const actual = rewardCandidates[candidate](values)
  const expected = rewardCandidates.sum(values)
  return { actual, expected, passed: exact ? actual === expected : Number.isFinite(actual) }
}

export const biasGroups = [
  [{ score: 90, positive: true }, { score: 70, positive: true }, { score: 40, positive: true }, { score: 60, positive: false }, { score: 30, positive: false }, { score: 10, positive: false }],
  [{ score: 80, positive: true }, { score: 50, positive: true }, { score: 20, positive: true }, { score: 70, positive: false }, { score: 40, positive: false }, { score: 10, positive: false }],
]
export function groupCounts(group: typeof biasGroups[number], threshold: number) {
  return group.reduce((counts, row) => {
    if (row.positive) counts.positives++
    else counts.negatives++
    if (row.score >= threshold) { counts.selected++; row.positive ? counts.tp++ : counts.fp++ }
    return counts
  }, { positives: 0, negatives: 0, selected: 0, tp: 0, fp: 0 })
}

export interface DemoParameter { id: number; name: string; type: 'string' | 'number' | 'boolean' | 'array'; description: string; required: boolean; itemType?: 'string' | 'number' | 'boolean' }
export interface DemoTool { name: string; description: string; parameters: DemoParameter[] }
export function validateTool(tool: DemoTool) {
  const errors: ('schemaNameError' | 'schemaParamError' | 'schemaDuplicate')[] = []
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tool.name)) errors.push('schemaNameError')
  if (tool.parameters.some(p => !p.name.trim())) errors.push('schemaParamError')
  if (new Set(tool.parameters.map(p => p.name)).size !== tool.parameters.length) errors.push('schemaDuplicate')
  return { valid: errors.length === 0, errors }
}
export function generateToolSchema(tool: DemoTool) {
  if (!validateTool(tool).valid) return null
  return {
    name: tool.name,
    description: tool.description,
    parameters: {
      type: 'object',
      properties: Object.fromEntries(tool.parameters.map(p => [p.name, {
        type: p.type, description: p.description,
        ...(p.type === 'array' ? { items: { type: p.itemType ?? 'string' } } : {}),
      }])),
      required: tool.parameters.filter(p => p.required).map(p => p.name),
      additionalProperties: false,
    },
  }
}
