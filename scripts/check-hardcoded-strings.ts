/**
 * Hardcoded string detection script
 *
 * Two layers of checks run over every page/component under src/app and
 * src/components:
 *
 * 1. Legacy phrase check (line based): known English phrases and capitalised
 *    multi-word JSX text. Findings are ERRORS (exit 1), as before.
 * 2. Structural i18n rules (TypeScript AST based) — WARNINGS by default:
 *    - locale-ternary: `de ? '…' : '…'`, `isDe ? …`, `locale === 'de' ? …`
 *      with string/template/object/array/JSX branches
 *    - locale-object:  object literals with both `en` and `de` keys
 *      (e.g. local `copy` / `COPY` objects with language variants)
 *    - jsx-text:       JSX text nodes / `{'literal'}` children containing words
 *    - jsx-attr:       string literals in visible attributes
 *                      (aria-label, title, placeholder, alt, …)
 *    Pass `--strict` to make these fail the run (exit 1) as well.
 *
 * Exceptions: text inside <pre>/<code>/<kbd>/<samp>/math components, comments,
 * technical tokens (numbers, units, symbols, formulas, acronyms), a proper-noun
 * allowlist, and lines marked with an `i18n-ignore` comment (same or previous
 * line).
 *
 * Usage:
 *   npx tsx scripts/check-hardcoded-strings.ts [--strict] [--summary] [paths...]
 *     --strict   exit 1 on structural findings too
 *     --summary  only print per-file counts for structural findings
 *     paths      restrict the scan to these files/directories (default: src)
 */

import * as fs from 'fs'
import * as path from 'path'
import ts from 'typescript'

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

function isInAllowList(text: string): boolean {
  return ALLOW_LIST.some(allowed =>
    text === allowed || text.includes(allowed)
  )
}

function shouldSkipLine(line: string): boolean {
  const trimmed = line.trim()
  return SKIP_LINE_PATTERNS.some(pattern => pattern.test(trimmed))
}

/**
 * Detects standalone JSX text lines — text content rendered on its own line
 * between an opening and a closing tag, e.g.
 *   <p>
 *     Some English sentence here
 *   </p>
 * Returns the trimmed text if the line looks like bare JSX text, else null.
 * Kept deliberately strict to avoid false positives: must look like prose
 * (capitalized multi-word sentence) and must not contain any code-like syntax.
 */
function getBareJsxText(line: string): string | null {
  const trimmed = line.trim()
  if (trimmed.length < 15) return null
  // Must start with a capitalized word followed by lowercase (prose-like)
  if (!/^[A-Z][a-z]/.test(trimmed)) return null
  // Must be multi-word
  if (trimmed.split(/\s+/).length < 3) return null
  // Anything that looks like code rather than plain JSX text content
  if (/[<>{}=`"\\]/.test(trimmed)) return null
  if (trimmed.startsWith("'") || trimmed.endsWith(',') || trimmed.endsWith(';')) return null
  // Object keys / labelled values like `title: ...`
  if (/^[\w$]+\s*:/.test(trimmed)) return null
  return trimmed
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
  // Normalize Windows backslash paths so the check works on every platform
  const normalizedPath = filePath.split(path.sep).join('/')
  const isPageOrComponent = normalizedPath.includes('/app/') || normalizedPath.includes('/components/')
  if (!isPageOrComponent) return []

  // Tracks whether we are inside a multi-line template literal (e.g. code or
  // prompt samples). Bare text lines inside template literals are string data,
  // not JSX text, so the standalone-line detection must not fire there.
  let inTemplateLiteral = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    const wasInTemplateLiteral = inTemplateLiteral
    const backtickCount = (line.match(/`/g) || []).length
    if (backtickCount % 2 === 1) {
      inTemplateLiteral = !inTemplateLiteral
    }

    // Skip non-JSX lines and certain patterns
    if (shouldSkipLine(line)) continue
    // Standalone JSX text lines (between tags) don't contain '>' themselves
    const bareJsxText = wasInTemplateLiteral ? null : getBareJsxText(line)
    if (!line.includes('>') && bareJsxText === null) continue

    // Check for known English phrases that need translation
    for (const phrase of ENGLISH_PHRASES) {
      const phraseIndex = line.indexOf(phrase)
      if (phraseIndex === -1) continue

      // Skip if in translation context or allowed
      if (isInTranslationContext(line, phraseIndex)) continue
      if (isInAllowList(phrase)) continue

      // Check if this phrase appears in actual JSX text content (after >)
      const beforePhrase = line.substring(0, phraseIndex)
      if (bareJsxText !== null || (beforePhrase.includes('>') && !beforePhrase.endsWith('={'))) {
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

    // Also flag standalone JSX text lines (text between tags on its own line)
    if (bareJsxText !== null) {
      const text = bareJsxText

      // Same filters as the inline JSX text check above
      if (/^[\d.%BTx\-]+$/.test(text)) continue
      if (text.match(/^[A-Z][a-z]+ \d/)) continue
      if (isInAllowList(text)) continue
      // Skip if already reported via the phrase check
      if (ENGLISH_PHRASES.some(p => text.includes(p))) continue

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

// ═══════════════════════════════════════════════════════════════════════════
// Structural i18n rules (AST based)
// ═══════════════════════════════════════════════════════════════════════════

type RuleId = 'locale-ternary' | 'locale-object' | 'jsx-text' | 'jsx-attr'

interface StructuralFinding {
  file: string
  line: number
  column: number
  rule: RuleId
  text: string
}

// Identifiers that hold an "is German / is English" boolean
const LOCALE_BOOLEAN_NAMES = new Set(['de', 'isDe', 'isDE', 'isGerman', 'german', 'isEn', 'isEN', 'isEnglish'])
// Identifiers / property names that hold the current locale string
const LOCALE_VALUE_NAMES = new Set(['locale', 'lang', 'language', 'currentLocale', 'currentLanguage'])
const LOCALE_CODES = new Set(['de', 'en'])

// Attributes whose string value is shown (or read out) to the user
const VISIBLE_ATTRIBUTES = new Set([
  'aria-label', 'aria-description', 'aria-placeholder', 'aria-roledescription', 'aria-valuetext',
  'title', 'placeholder', 'alt',
])

// Elements whose text content is code or math, not prose
const CODE_ELEMENTS = new Set(['pre', 'code', 'kbd', 'samp', 'var', 'sub', 'sup', 'InlineMath', 'BlockMath'])

// Proper nouns, brands and technical terms that are identical in EN and DE.
// Matched case-sensitively against individual words of the text.
const PROPER_NOUNS = new Set([
  // Companies / labs / products
  'OpenAI', 'Anthropic', 'Google', 'DeepMind', 'Meta', 'Microsoft', 'NVIDIA', 'Nvidia', 'AMD', 'Intel',
  'Apple', 'Amazon', 'AWS', 'Mistral', 'Cohere', 'Hugging', 'Face', 'HuggingFace', 'Alibaba', 'Moonshot',
  'Zhipu', 'xAI', 'Groq', 'Cerebras', 'TPU', 'Gaudi', 'Trainium', 'Inferentia', 'Ollama', 'vLLM', 'SGLang',
  'PyTorch', 'TensorFlow', 'JAX', 'Triton', 'CUDA', 'ROCm', 'GitHub', 'Wikipedia', 'arXiv', 'Python',
  'TypeScript', 'JavaScript', 'React', 'Next', 'Linux', 'Docker', 'Kubernetes', 'Slack', 'Gmail',
  // Models
  'GPT', 'ChatGPT', 'Claude', 'Opus', 'Sonnet', 'Haiku', 'Gemini', 'Gemma', 'Llama', 'LLaMA', 'Mixtral',
  'DeepSeek', 'Qwen', 'Kimi', 'GLM', 'Grok', 'Phi', 'BERT', 'Whisper', 'DALL', 'Midjourney', 'Sora',
  'Stable', 'Diffusion', 'Flux', 'Cosmos', 'Genie', 'Nemotron', 'Mamba', 'Codex', 'Copilot', 'Cursor',
  // Common technical acronyms / terms
  'LLM', 'LLMs', 'AI', 'KI', 'API', 'APIs', 'RAG', 'MCP', 'MoE', 'JSON', 'YAML', 'HTTP', 'HTTPS', 'URL',
  'GPU', 'GPUs', 'CPU', 'CPUs', 'VRAM', 'RAM', 'HBM', 'SRAM', 'KV', 'FFN', 'MLP', 'RoPE', 'ALiBi',
  'LoRA', 'QLoRA', 'RLHF', 'DPO', 'GRPO', 'PPO', 'SFT', 'RL', 'BPE', 'FP', 'BF', 'INT', 'GGUF', 'AWQ', 'GPTQ',
  'FLOPs', 'FLOP', 'TFLOPS', 'PFLOPS', 'TOPS', 'SOTA', 'CoT', 'ReAct', 'SDK', 'CLI', 'IDE', 'UI', 'UX',
  'Transformer', 'Transformers', 'Softmax', 'softmax', 'ReLU', 'GELU', 'SwiGLU', 'LayerNorm', 'RMSNorm',
  'Adam', 'AdamW', 'Muon', 'MMLU', 'GPQA', 'HLE', 'SWE', 'ARC', 'AGI', 'METR', 'LMArena', 'EU', 'USA', 'US',
  'TTFT', 'TPOT', 'QPS', 'RPS', 'SLA', 'TP', 'PP', 'EP', 'DP', 'MTP', 'GQA', 'MQA', 'MHA', 'MLA',
  'vs', 'etc', 'et', 'al', 'Q', 'K', 'V',
  // Loanwords that are identical (or capitalised only) in German UI text
  'Token', 'Tokens', 'token', 'tokens', 'Logit', 'Logits', 'logit', 'logits', 'Seed', 'Top', 'Prompt',
  'Prompts', 'Embedding', 'Embeddings', 'Batch', 'Cache', 'Blog', 'Pre', 'Post', 'Norm', 'Genesis',
  'mini', 'nano', 'Pro', 'Flash', 'Ultra', 'Turbo',
])

// Units, math functions and other short technical tokens that are not prose
const UNIT_TOKENS = new Set([
  'ms', 'µs', 'us', 'ns', 's', 'sec', 'min', 'h', 'px', 'rem', 'em', 'pt', 'Hz', 'kHz', 'MHz', 'GHz',
  'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'KiB', 'MiB', 'GiB', 'TiB', 'k', 'K', 'M', 'G', 'T', 'Mrd', 'Mio',
  'W', 'kW', 'MW', 'GW', 'kWh', 'MWh', 'GWh', 'TWh', 'nm', 'mm', 'cm', 'km', 'x', 'tok', 'bit',
  'bits', 'fp', 'bf', 'int', 'log', 'exp', 'max', 'sin', 'cos', 'tan', 'argmax', 'argmin', 'sqrt',
  'd', 'dk', 'n', 'N', 'L', 'p', 'e', 'pi', 'lr', 'nats',
])

// Marker comment that suppresses findings on the same or the following line
const IGNORE_MARKER = 'i18n-ignore'

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
}

function isTechnicalWord(word: string): boolean {
  if (word.length < 2) return true
  if (PROPER_NOUNS.has(word) || UNIT_TOKENS.has(word)) return true
  // Acronyms like GPU, LLMs (digits are not part of the word match)
  if (/^[A-Z]{2,6}s?$/.test(word)) return true
  // camelCase / PascalCase identifiers with an inner capital (e.g. DeepSeek, maxTokens)
  if (/^[A-Za-z][a-z]+[A-Z]/.test(word)) return true
  return false
}

/**
 * Whitespace-separated tokens that are code, paths, formulas or identifiers
 * rather than words: snake_case, calls/indexing (`fn(`, `arr[`), dotted names
 * (`file.txt`, `a.b`), paths (`dir/`, `a/b`), LaTeX (`\frac`) and operators.
 */
function isCodeToken(token: string): boolean {
  return (
    /\\[A-Za-z]/.test(token) ||
    /[A-Za-z0-9]_[A-Za-z0-9{]/.test(token) ||
    /[A-Za-z][([]/.test(token) ||
    /[A-Za-z0-9]\.[A-Za-z]/.test(token) ||
    /[A-Za-z0-9]\/[A-Za-z0-9]|\/$|^\//.test(token) ||
    /[=<>{}|^$@]/.test(token)
  )
}

/** Words in the text that look like natural-language prose (see isTechnicalWord / isCodeToken). */
function proseWords(raw: string): string[] {
  const tokens = decodeEntities(raw).split(/\s+/).filter(Boolean)
  const result: string[] = []
  tokens.forEach((token, index) => {
    if (isCodeToken(token)) return
    // Author names in citations: "Liu et al."
    if (tokens[index + 1] === 'et' && tokens[index + 2]?.startsWith('al')) return
    const words = token.match(/[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'’][A-Za-zÀ-ÖØ-öø-ÿ]+)*/g) ?? []
    for (const word of words) {
      if (!word.split(/[-'’]/).every(isTechnicalWord)) result.push(word)
    }
  })
  return result
}

/**
 * Returns true when the text contains at least one word that looks like
 * natural-language prose rather than a technical token, number, unit,
 * symbol, formula or proper noun.
 */
function looksLikeProse(raw: string): boolean {
  return proseWords(raw).length > 0
}

/**
 * Stricter variant for monospace blocks (`font-mono`), which mix code samples
 * with example dialogue: needs several prose words and no code operators.
 */
function looksLikeMonospaceProse(raw: string): boolean {
  const text = decodeEntities(raw)
  if (/[=;{}[\]]|->|=>|>|</.test(text)) return false
  return proseWords(text).length >= 3
}

function nodeName(name: ts.PropertyName | ts.JsxAttributeName | ts.JsxTagNameExpression): string {
  if (ts.isIdentifier(name) || ts.isPrivateIdentifier(name)) return name.text
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)) return name.text
  if (ts.isJsxNamespacedName(name)) return `${name.namespace.text}:${name.name.text}`
  if (ts.isPropertyAccessExpression(name)) return name.name.text
  return name.getText()
}

function unwrap(node: ts.Expression): ts.Expression {
  let current = node
  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isNonNullExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression
  }
  return current
}

/** Name of an identifier or the last segment of a property access (`i18n.locale` → `locale`). */
function referenceName(node: ts.Expression): string | null {
  const inner = unwrap(node)
  if (ts.isIdentifier(inner)) return inner.text
  if (ts.isPropertyAccessExpression(inner)) return inner.name.text
  return null
}

function isLocaleCondition(condition: ts.Expression): boolean {
  const inner = unwrap(condition)
  if (ts.isPrefixUnaryExpression(inner) && inner.operator === ts.SyntaxKind.ExclamationToken) {
    return isLocaleCondition(inner.operand)
  }
  const ref = referenceName(inner)
  if (ref !== null && LOCALE_BOOLEAN_NAMES.has(ref)) return true
  if (ts.isBinaryExpression(inner)) {
    const op = inner.operatorToken.kind
    if (
      op === ts.SyntaxKind.EqualsEqualsEqualsToken || op === ts.SyntaxKind.EqualsEqualsToken ||
      op === ts.SyntaxKind.ExclamationEqualsEqualsToken || op === ts.SyntaxKind.ExclamationEqualsToken
    ) {
      const sides = [unwrap(inner.left), unwrap(inner.right)]
      const hasCode = sides.some(side => ts.isStringLiteralLike(side) && LOCALE_CODES.has(side.text))
      const hasLocaleRef = sides.some(side => {
        const name = referenceName(side)
        return name !== null && LOCALE_VALUE_NAMES.has(name)
      })
      return hasCode && hasLocaleRef
    }
  }
  return false
}

function firstProseIn(node: ts.Node): string | null {
  let found: string | null = null
  const visit = (child: ts.Node) => {
    if (found !== null) return
    if ((ts.isStringLiteralLike(child) || ts.isJsxText(child)) && looksLikeProse(child.text)) {
      found = child.text.trim()
      return
    }
    ts.forEachChild(child, visit)
  }
  visit(node)
  return found
}

/** User-facing text carried by a ternary branch, or null if it is not a text-like literal. */
function branchText(node: ts.Expression): string | null {
  const inner = unwrap(node)
  if (ts.isStringLiteralLike(inner)) return inner.text
  if (ts.isTemplateExpression(inner)) {
    return inner.head.text + inner.templateSpans.map(span => '…' + span.literal.text).join('')
  }
  if (
    ts.isObjectLiteralExpression(inner) || ts.isArrayLiteralExpression(inner) ||
    ts.isJsxElement(inner) || ts.isJsxFragment(inner) || ts.isJsxSelfClosingElement(inner)
  ) {
    return firstProseIn(inner) ?? inner.getText().slice(0, 60)
  }
  if (ts.isConditionalExpression(inner)) {
    return branchText(inner.whenTrue) ?? branchText(inner.whenFalse)
  }
  return null
}

/** URLs, paths and locale codes (`de`, `en-US`, `de_DE`, `EN`) are not translatable text. */
function isUrlOrCode(value: string): boolean {
  return /^(https?:\/\/|\/)\S*$/.test(value) || /^[a-z]{2}([-_][a-z]{2})?$/i.test(value)
}

/** String literal, or template literal whose static parts are URL/path fragments (`${BASE}/en`). */
function isUrlOrCodeValue(node: ts.Expression): boolean {
  const value = unwrap(node)
  if (ts.isStringLiteralLike(value)) return isUrlOrCode(value.text)
  if (ts.isTemplateExpression(value)) {
    const parts = [value.head.text, ...value.templateSpans.map(span => span.literal.text)]
    return parts.every(part => part === '' || /^[\w/.#?&=:-]+$/.test(part))
  }
  return false
}

/** `{ en: …, de: … }` — but not hreflang maps whose values are only URLs/locale codes. */
function isLocaleVariantObject(node: ts.ObjectLiteralExpression): boolean {
  const props = new Map<string, ts.ObjectLiteralElementLike>()
  for (const prop of node.properties) {
    if (prop.name) props.set(nodeName(prop.name), prop)
  }
  if (!props.has('en') || !props.has('de')) return false
  return !['en', 'de'].every(key => {
    const prop = props.get(key)!
    return ts.isPropertyAssignment(prop) && isUrlOrCodeValue(prop.initializer)
  })
}

function literalAttribute(element: ts.JsxOpeningElement, name: string): string | null {
  for (const attr of element.attributes.properties) {
    if (!ts.isJsxAttribute(attr) || nodeName(attr.name) !== name || !attr.initializer) continue
    if (ts.isStringLiteral(attr.initializer)) return attr.initializer.text
    if (ts.isJsxExpression(attr.initializer) && attr.initializer.expression) {
      const expr = unwrap(attr.initializer.expression)
      if (ts.isStringLiteralLike(expr)) return expr.text
    }
  }
  return null
}

type TextContext = 'code' | 'external-link' | 'monospace' | 'normal'

/**
 * Classifies where a JSX text node sits:
 * - code:          inside <pre>/<code>/<kbd>/<samp>/<sub>/<sup>/math components
 * - external-link: direct text of <a href="https://…"> (source/paper titles)
 * - monospace:     inside an element whose className contains `font-mono`
 */
function textContext(node: ts.Node): TextContext {
  let context: TextContext = 'normal'
  let current: ts.Node | undefined = node.parent
  let isDirectParent = true
  while (current) {
    if (ts.isJsxElement(current)) {
      const opening = current.openingElement
      const tag = nodeName(opening.tagName)
      if (CODE_ELEMENTS.has(tag)) return 'code'
      if (isDirectParent && tag === 'a' && /^https?:\/\//.test(literalAttribute(opening, 'href') ?? '')) {
        return 'external-link'
      }
      if (/\bfont-mono\b/.test(literalAttribute(opening, 'className') ?? '')) context = 'monospace'
      isDirectParent = false
    }
    current = current.parent
  }
  return context
}

/** Whether a JSX child text (JsxText or `{'literal'}`) should be reported. */
function isReportableJsxText(node: ts.Node, text: string): boolean {
  switch (textContext(node)) {
    case 'code':
    case 'external-link':
      return false
    case 'monospace':
      return looksLikeMonospaceProse(text)
    default:
      return looksLikeProse(text)
  }
}

function truncate(text: string, max = 90): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > max ? flat.slice(0, max - 1) + '…' : flat
}

function findStructuralIssues(filePath: string): StructuralFinding[] {
  const normalizedPath = filePath.split(path.sep).join('/')
  const isPageOrComponent = normalizedPath.includes('/app/') || normalizedPath.includes('/components/')
  if (!isPageOrComponent) return []

  const content = fs.readFileSync(filePath, 'utf-8')
  const scriptKind = filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const source = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, scriptKind)
  const lines = content.split('\n')
  const findings: StructuralFinding[] = []

  const isIgnored = (line: number) =>
    (lines[line - 1] ?? '').includes(IGNORE_MARKER) || (lines[line - 2] ?? '').includes(IGNORE_MARKER)

  const report = (node: ts.Node, rule: RuleId, text: string) => {
    const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source))
    if (isIgnored(line + 1)) return
    findings.push({ file: filePath, line: line + 1, column: character + 1, rule, text: truncate(text) })
  }

  const visit = (node: ts.Node) => {
    // locale-ternary: report once per ternary (chain), then skip its branches
    // (`locale === 'de' ? 'de' : 'en'` just selects a locale code and is fine)
    if (
      ts.isConditionalExpression(node) && isLocaleCondition(node.condition) &&
      !(isUrlOrCodeValue(node.whenTrue) && isUrlOrCodeValue(node.whenFalse))
    ) {
      const text = branchText(node.whenTrue) ?? branchText(node.whenFalse)
      if (text !== null) {
        report(node, 'locale-ternary', text)
        return
      }
    }

    // locale-object: report the object once, then skip its contents
    if (ts.isObjectLiteralExpression(node) && isLocaleVariantObject(node)) {
      report(node, 'locale-object', firstProseIn(node) ?? node.getText(source).slice(0, 60))
      return
    }

    // jsx-text: bare text between tags
    if (ts.isJsxText(node) && !node.containsOnlyTriviaWhiteSpaces) {
      if (isReportableJsxText(node, node.text)) report(node, 'jsx-text', node.text)
    }

    // jsx-text: literal children like {'Some text'} or {`Some text`}
    if (ts.isJsxExpression(node) && node.expression && !ts.isJsxAttribute(node.parent)) {
      const expr = unwrap(node.expression)
      if (ts.isStringLiteralLike(expr) && isReportableJsxText(node, expr.text)) {
        report(expr, 'jsx-text', expr.text)
      }
    }

    // jsx-attr: visible attributes with literal values
    if (ts.isJsxAttribute(node) && node.initializer && VISIBLE_ATTRIBUTES.has(nodeName(node.name))) {
      let literal: ts.StringLiteralLike | null = null
      if (ts.isStringLiteral(node.initializer)) literal = node.initializer
      else if (ts.isJsxExpression(node.initializer) && node.initializer.expression) {
        const expr = unwrap(node.initializer.expression)
        if (ts.isStringLiteralLike(expr)) literal = expr
      }
      if (literal && looksLikeProse(literal.text)) {
        report(node, 'jsx-attr', `${nodeName(node.name)}="${literal.text}"`)
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(source)
  return findings
}

function collectSourceFiles(targets: string[]): string[] {
  const files: string[] = []
  const walk = (current: string) => {
    if (SKIP_PATTERNS.some(pattern => current.split(path.sep).includes(pattern))) return
    if (fs.statSync(current).isDirectory()) {
      for (const entry of fs.readdirSync(current)) walk(path.join(current, entry))
    } else if (/\.tsx?$/.test(current) && !current.endsWith('.d.ts')) {
      files.push(current)
    }
  }
  for (const target of targets) walk(path.resolve(target))
  return files.sort()
}

// ═══════════════════════════════════════════════════════════════════════════
// Entry point
// ═══════════════════════════════════════════════════════════════════════════

function groupByFile<T extends { file: string }>(items: T[]): Map<string, T[]> {
  const byFile = new Map<string, T[]>()
  for (const item of items) {
    const relativePath = path.relative(process.cwd(), item.file)
    if (!byFile.has(relativePath)) byFile.set(relativePath, [])
    byFile.get(relativePath)!.push(item)
  }
  return byFile
}

function main() {
  const args = process.argv.slice(2)
  const strict = args.includes('--strict')
  const summaryOnly = args.includes('--summary')
  const targets = args.filter(arg => !arg.startsWith('--'))
  const sourceFiles = collectSourceFiles(targets.length > 0 ? targets : [path.join(process.cwd(), 'src')])
  const files = sourceFiles.filter(file => file.endsWith('.tsx'))

  console.log(`\nScanning ${files.length} TSX files for hardcoded strings...\n`)

  // ── Legacy phrase check (errors) ────────────────────────────────────────
  const allFindings: Finding[] = []
  for (const file of files) {
    allFindings.push(...findHardcodedStrings(file))
  }

  // Deduplicate findings by file+line
  const uniqueFindings = allFindings.filter((finding, index, self) =>
    index === self.findIndex(f => f.file === finding.file && f.line === finding.line && f.content === finding.content)
  )
  const legacyLines = new Set(uniqueFindings.map(f => `${f.file}:${f.line}`))

  // ── Structural rules (warnings unless --strict) ─────────────────────────
  // One finding per file/line/rule: `Showing {n} of {m} tokens` is one issue, not three
  const structural: StructuralFinding[] = []
  const byLocation = new Map<string, StructuralFinding>()
  for (const finding of sourceFiles.flatMap(findStructuralIssues)) {
    // JSX text on a line the legacy check already reports would be a duplicate
    if (finding.rule === 'jsx-text' && legacyLines.has(`${finding.file}:${finding.line}`)) continue
    const key = `${finding.file}:${finding.line}:${finding.rule}`
    const existing = byLocation.get(key)
    if (existing) {
      existing.text = truncate(`${existing.text} … ${finding.text}`)
    } else {
      byLocation.set(key, finding)
      structural.push(finding)
    }
  }

  if (structural.length > 0) {
    const byFile = groupByFile(structural)
    const level = strict ? 'error' : 'warning'

    if (!summaryOnly) {
      for (const [file, findings] of byFile) {
        for (const f of findings) {
          console.log(`${file}:${f.line}:${f.column}  ${level}  [${f.rule}]  ${f.text}`)
        }
      }
      console.log('')
    }

    const ruleCounts = new Map<RuleId, number>()
    for (const f of structural) ruleCounts.set(f.rule, (ruleCounts.get(f.rule) ?? 0) + 1)
    const sortedFiles = Array.from(byFile.entries()).sort((a, b) => b[1].length - a[1].length)

    console.log('─'.repeat(80))
    console.log(`Structural i18n ${level}s: ${structural.length} in ${byFile.size} files`)
    console.log('  ' + Array.from(ruleCounts.entries()).map(([rule, n]) => `${rule}: ${n}`).join(' · '))
    console.log(summaryOnly ? '  Per file:' : '  Top files:')
    for (const [file, findings] of summaryOnly ? sortedFiles : sortedFiles.slice(0, 10)) {
      console.log(`    ${String(findings.length).padStart(4)}  ${file}`)
    }
    console.log(`  Mark a deliberate exception with an \`${IGNORE_MARKER}\` comment on the same or previous line.`)
    if (!strict) console.log('  (warnings only — run with --strict to fail on these)')
    console.log('─'.repeat(80) + '\n')
  } else {
    console.log('✅ No structural i18n issues (locale ternaries, en/de objects, JSX text, visible attributes).\n')
  }

  if (uniqueFindings.length > 0) {
    console.error('❌ Found hardcoded English strings that need translation:\n')
    console.error('─'.repeat(80))

    for (const [file, findings] of groupByFile(uniqueFindings)) {
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

  if (strict && structural.length > 0) {
    console.error(`Hardcoded string check FAILED (--strict): ${structural.length} structural i18n issues found\n`)
    process.exit(1)
  }

  console.log('✅ No hardcoded strings found by the phrase check!')
  console.log(`   Scanned ${files.length} files.\n`)
}

main()

