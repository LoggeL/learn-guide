/**
 * Hardcoded string detection script
 * Scans all TSX files for English text that should be translated
 * Run with: npx tsx scripts/check-hardcoded-strings.ts
 */

import * as fs from 'fs'
import * as path from 'path'

interface Finding {
  file: string
  line: number
  content: string
  context: string
}

// Multi-word phrases that definitely need translation when found in JSX text
const ENGLISH_PHRASES = [
  // UI instructions
  'Click to see',
  'Click each layer',
  'See how the',
  'Watch it in',
  'Enter text to',
  'Start the conversation',
  'No messages yet',
  // Status messages
  'Messages being pushed',
  'Context nearly full',
  'Getting crowded',
  'Healthy capacity',
  'Outside context window',
  'Fading from attention',
  // Section headers (in JSX, not using t.)
  'The Core Pattern',
  'Watch It In Action',
  'Explore Context Layers',
  'What Actually Gets Sent',
  'Context Management Strategies',
  'Common Pitfalls',
  'Example System Prompt',
  // Descriptions
  'Probability Distribution',
  'Next token probabilities',
  'Greedy Sampling',
  'Focused Sampling',
  'Balanced Sampling',
  'Flat Sampling',
  'Training Progress',
  'Watch a neural network',
  'Loss Over Time',
  'Accuracy Over Time',
  'Gradient Descent',
  'Optimizing a 2D',
  'Network Architecture',
  'Workflow Pattern',
  'Workflow Execution',
  'RAG Pipeline',
  'Vector Database',
  'Attention Map Simulator',
  'Context Window',
  'Priority Order',
  'Cosine similarity',
  // Labels
  'Select Problem',
  'Select Example',
  'Compare weak vs',
  'Key Differences',
  'Based on detected',
  'Suggestions for',
  'Define your tool',
  'JSON Schema output',
  'Generated Response',
  // Slide/strategy names
  'Sliding Window',
  'Summarization',
  'Priority-based Truncation',
  'Context Overflow',
  'Tool Definition Bloat',
  'Lost in the Middle',
  'Stale Retrieved Data',
  // Table/data content
  'Large pool',
]

// Files/patterns to skip
const SKIP_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  '.git',
]

// Patterns in the line that indicate it's not user-visible text
const SKIP_LINE_PATTERNS = [
  /^import /,                    // Import statements
  /^\s*\/\//,                   // Comments
  /^\s*\*/,                     // Block comment lines
  /^\s*type /,                  // Type definitions
  /^\s*interface /,             // Interface definitions
  /^\s*const \w+ =/,            // Variable declarations
  /^\s*let \w+ =/,              // Variable declarations
  /^\s*if \(/,                  // Conditionals
  /^\s*return \w/,              // Return statements with variables
  /<\w+\s+size=/,               // Icon components (lucide-react)
  /className="[^"]*">\s*$/,     // Empty element closings
  /\{\/\*/,                     // JSX comments
]

// Allow list for specific strings that are OK not to translate
const ALLOW_LIST = [
  // Technical terms that stay the same in both languages
  'MoE', 'RAG', 'MCP', 'LLM', 'API', 'JSON', 'HTTP', 'DNS',
  'SKILL.md', 'CLAUDE.md',
  // Model names (proper nouns)
  'Mixtral 8x7B', 'DeepSeek-V3', 'Qwen3-235B', 'Kimi K2',
  'Mixtral', 'DeepSeek', 'Qwen', 'Kimi', 'GPT', 'Claude',
  // Code-like content
  'MCPClient', 'get_weather', 'sendEmailTool',
  // Math/technical notation
  'T=0', 'T≈1', 'Q', 'K', 'V',
]

function getAllTsxFiles(dir: string): string[] {
  const files: string[] = []

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (SKIP_PATTERNS.some(pattern => fullPath.includes(pattern))) {
        continue
      }

      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        files.push(fullPath)
      }
    }
  }

  walk(dir)
  return files
}

function isInAllowList(text: string): boolean {
  return ALLOW_LIST.some(allowed =>
    text === allowed || text.includes(allowed)
  )
}

function shouldSkipLine(line: string): boolean {
  const trimmed = line.trim()
  return SKIP_LINE_PATTERNS.some(pattern => pattern.test(trimmed))
}

function isInTranslationContext(line: string, phraseIndex: number): boolean {
  const beforePhrase = line.substring(0, phraseIndex)
  // Check if the phrase is inside a translation call
  return beforePhrase.includes('{t.') ||
         beforePhrase.includes('= t.') ||
         beforePhrase.includes(': t.') ||
         // Check if inside a comment
         beforePhrase.includes('//') ||
         beforePhrase.includes('/*') ||
         beforePhrase.includes('{/*')
}

function findHardcodedStrings(filePath: string): Finding[] {
  const findings: Finding[] = []
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // Skip files that don't use translations (utility files, etc.)
  const isPageOrComponent = filePath.includes('/app/') || filePath.includes('/components/')
  if (!isPageOrComponent) return []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Skip non-JSX lines and certain patterns
    if (shouldSkipLine(line)) continue
    if (!line.includes('>')) continue

    // Check for known English phrases that need translation
    for (const phrase of ENGLISH_PHRASES) {
      const phraseIndex = line.indexOf(phrase)
      if (phraseIndex === -1) continue

      // Skip if in translation context or allowed
      if (isInTranslationContext(line, phraseIndex)) continue
      if (isInAllowList(phrase)) continue

      // Check if this phrase appears in actual JSX text content (after >)
      const beforePhrase = line.substring(0, phraseIndex)
      if (beforePhrase.includes('>') && !beforePhrase.endsWith('={')) {
        findings.push({
          file: filePath,
          line: lineNum,
          content: phrase,
          context: line.trim().substring(0, 120),
        })
      }
    }

    // Also detect any multi-word text directly in JSX elements
    // Pattern: >Text with multiple words<
    const jsxTextMatches = line.matchAll(/>([A-Z][a-zA-Z0-9\s,.!?:;'"()-]+)</g)
    for (const match of jsxTextMatches) {
      const text = match[1].trim()

      // Skip if too short or single word
      if (text.length < 15 || text.split(/\s+/).length < 3) continue

      // Skip technical content
      if (/^[\d.%BTx\-]+$/.test(text)) continue
      if (text.match(/^[A-Z][a-z]+ \d/)) continue  // Like "Mixtral 8x7B"

      // Skip if allowed
      if (isInAllowList(text)) continue

      // Skip if already found via phrase check
      if (ENGLISH_PHRASES.some(p => text.includes(p))) continue

      const textIndex = line.indexOf(text)
      if (isInTranslationContext(line, textIndex)) continue

      findings.push({
        file: filePath,
        line: lineNum,
        content: text,
        context: line.trim().substring(0, 120),
      })
    }
  }

  return findings
}

function main() {
  const srcDir = path.join(process.cwd(), 'src')
  const files = getAllTsxFiles(srcDir)

  console.log(`\nScanning ${files.length} TSX files for hardcoded strings...\n`)

  const allFindings: Finding[] = []

  for (const file of files) {
    const findings = findHardcodedStrings(file)
    allFindings.push(...findings)
  }

  // Deduplicate findings by file+line
  const uniqueFindings = allFindings.filter((finding, index, self) =>
    index === self.findIndex(f => f.file === finding.file && f.line === finding.line && f.content === finding.content)
  )

  if (uniqueFindings.length > 0) {
    console.error('❌ Found hardcoded English strings that need translation:\n')
    console.error('─'.repeat(80))

    // Group by file
    const byFile = new Map<string, Finding[]>()
    for (const finding of uniqueFindings) {
      const relativePath = path.relative(process.cwd(), finding.file)
      if (!byFile.has(relativePath)) {
        byFile.set(relativePath, [])
      }
      byFile.get(relativePath)!.push(finding)
    }

    for (const [file, findings] of byFile) {
      console.error(`\n📁 ${file}`)
      for (const finding of findings) {
        console.error(`   Line ${finding.line}: "${finding.content}"`)
        console.error(`   └─ ${finding.context}`)
      }
    }

    console.error('\n')
    console.error('═'.repeat(80))
    console.error(`Hardcoded string check FAILED: ${uniqueFindings.length} issues found`)
    console.error('═'.repeat(80))
    console.error('\nAll user-visible text must use the translation system.')
    console.error('Add translations to src/lib/i18n/dictionaries/en.ts and de.ts')
    console.error('Then use {t.section.key} in your components.\n')
    process.exit(1)
  }

  console.log('✅ No hardcoded strings found!')
  console.log(`   Scanned ${files.length} files.\n`)
}

main()
