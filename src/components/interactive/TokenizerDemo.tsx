'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Hash, Zap } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

// GPT-4 style BPE tokenizer - approximates cl100k_base encoding
// Based on actual token patterns from OpenAI's tokenizer
const GPT4_VOCAB: Record<string, number> = {
  // Common complete words (lowercase with leading space - GPT-4 style)
  ' the': 279, ' a': 264, ' an': 459, ' is': 374, ' are': 527, ' was': 574,
  ' and': 323, ' or': 477, ' but': 719, ' in': 304, ' on': 389, ' at': 520,
  ' to': 311, ' for': 369, ' of': 315, ' with': 449, ' as': 439, ' by': 555,
  ' this': 420, ' that': 430, ' it': 433, ' be': 387, ' have': 617, ' has': 706,
  ' from': 505, ' not': 539, ' you': 499, ' we': 584, ' they': 814, ' their': 872,
  ' will': 690, ' would': 1053, ' can': 649, ' could': 1436, ' should': 1288,
  ' may': 1253, ' might': 2643, ' must': 2011, ' do': 656, ' does': 1587,
  ' did': 1550, ' been': 1027, ' being': 1694, ' were': 1051, ' had': 1047,
  ' its': 1202, ' my': 856, ' your': 701, ' our': 1057, ' his': 813, ' her': 1077,
  ' which': 902, ' who': 889, ' what': 1148, ' when': 994, ' where': 1405,
  ' how': 1268, ' why': 3249, ' all': 682, ' any': 904, ' some': 1063,
  ' other': 1023, ' more': 810, ' most': 1455, ' very': 1633, ' just': 1120,
  ' also': 1101, ' only': 1193, ' even': 1524, ' first': 1176, ' new': 502,
  ' one': 832, ' two': 1403, ' time': 892, ' way': 1648, ' than': 1091,
  ' like': 1093, ' into': 1139, ' over': 927, ' such': 1778, ' after': 1306,
  ' no': 912, ' out': 704, ' up': 709, ' about': 922, ' then': 1243,
  ' them': 1124, ' these': 1521, ' so': 779, ' if': 422, ' each': 1855,
  ' make': 1304, ' well': 1664, ' back': 1203, ' get': 636, ' go': 733,
  ' see': 1518, ' know': 1440, ' take': 1935, ' come': 2586, ' think': 1781,
  ' look': 1427, ' want': 1390, ' give': 3041, ' use': 1005, ' find': 1505,
  ' tell': 3371, ' try': 1456, ' leave': 5387, ' call': 1650, ' keep': 2567,
  ' let': 1095, ' begin': 3240, ' seem': 2873, ' help': 1037, ' show': 1501,
  ' hear': 6865, ' play': 1514, ' run': 1629, ' move': 3351, ' live': 3974,
  ' believe': 4510, ' hold': 3412, ' bring': 4546, ' happen': 3621, ' write': 3350,
  ' provide': 3493, ' sit': 2503, ' stand': 2559, ' lose': 9229, ' pay': 2343,
  ' meet': 3449, ' include': 2997, ' continue': 3136, ' set': 743, ' learn': 4048,
  ' change': 2349, ' lead': 3063, ' understand': 3619, ' watch': 3821, ' follow': 1833,
  ' stop': 3009, ' create': 1893, ' speak': 6604, ' read': 1373, ' allow': 2187,
  ' add': 923, ' spend': 8493, ' grow': 3139, ' open': 1825, ' walk': 4197,
  ' win': 3243, ' offer': 3085, ' remember': 6227, ' love': 3021, ' consider': 2980,
  ' appear': 5101, ' buy': 3780, ' wait': 3868, ' serve': 8854, ' die': 2450,
  ' send': 3708, ' expect': 1755, ' build': 1977, ' stay': 4822, ' fall': 4498,
  ' cut': 4018, ' reach': 5765, ' kill': 4846, ' remain': 7293,

  // Common words without leading space
  'the': 1820, 'a': 64, 'an': 276, 'is': 285, 'are': 548, 'was': 9575,
  'and': 438, 'or': 269, 'but': 8248, 'in': 258, 'on': 263, 'at': 379,
  'to': 998, 'for': 2000, 'of': 1073, 'with': 4291, 'as': 300, 'by': 1729,
  'this': 576, 'that': 9210, 'it': 275, 'be': 1395, 'have': 19553, 'has': 5765,
  'from': 1527, 'not': 1962, 'you': 9514, 'we': 906, 'they': 16924, 'I': 40,

  // Technical/AI terms
  ' AI': 15592, ' artificial': 21075, ' intelligence': 11478, ' machine': 5780,
  ' learning': 6975, ' model': 1646, ' neural': 30828, ' network': 4009,
  ' token': 4037, ' tokens': 11460, ' tokenization': 47058, ' tokenize': 47058,
  ' embedding': 40188, ' embeddings': 71647, ' transformer': 43678, ' attention': 6666,
  ' language': 4221, ' natural': 5933, ' processing': 8863, ' NLP': 45807,
  ' GPT': 480, ' LLM': 445, ' LLMs': 445, ' ChatGPT': 42023, ' Claude': 54864,
  ' training': 4967, ' inference': 45478, ' weights': 14661, ' parameters': 5765,
  ' gradient': 35358, ' descent': 38343, ' backpropagation': 89746, ' loss': 4814,
  ' function': 734, ' activation': 30523, ' layer': 6324, ' layers': 13931,
  ' deep': 5655, ' CNN': 40359, ' RNN': 71962, ' LSTM': 445, ' context': 2317,
  ' window': 3321, ' prompt': 10137, ' prompts': 52032, ' response': 2077,
  ' generation': 9659, ' text': 1495, ' input': 1988, ' output': 2612,
  ' vector': 4724, ' vectors': 23728, ' dimension': 13167, ' dimensions': 15225,
  ' semantic': 41404, ' similarity': 38723, ' cosine': 76648,

  // Programming terms (excluding duplicates from above)
  ' code': 2082, ' class': 538, ' method': 1749, ' variable': 3977,
  ' string': 925, ' array': 1358, ' object': 1665, ' type': 955,
  ' return': 471, ' else': 775, ' while': 1418, ' loop': 6471,
  ' import': 475, ' const': 1040, ' var': 959,
  ' async': 7847, ' await': 6439, ' promise': 24127, ' callback': 14701,
  ' HTTP': 10493, ' JSON': 4823, ' database': 8149,
  ' server': 3622, ' request': 1715,

  // Common subword tokens (BPE merges)
  'ing': 287, 'ed': 291, 'er': 261, 'est': 478, 'ly': 306, 'tion': 1129,
  'ness': 2136, 'ment': 1328, 'able': 481, 'ible': 1856, 'ful': 1913, 'less': 1752,
  'ive': 535, 'ous': 788, 'ity': 488, 'ance': 685, 'ence': 768, 'al': 278,
  'ial': 532, 'ical': 745, 'ology': 2508, 'ation': 367, 'ization': 2065,
  'ify': 1908, 'ize': 553, 'ise': 2406, 'ward': 2561, 'wards': 2815,
  'ship': 5765, 'hood': 26612, 'dom': 3438, 'ism': 1042, 'ist': 617,
  're': 265, 'un': 359, 'dis': 2996, 'mis': 9857, 'pre': 1762, 'post': 3962,
  'anti': 3323, 'pro': 1676, 'sub': 2330, 'super': 9712, 'inter': 2006,
  'trans': 3246, 'over': 2017, 'under': 8154, 'out': 448, 'up': 455,

  // Punctuation and special characters
  '.': 13, ',': 11, '!': 0, '?': 30, ':': 25, ';': 26, "'": 6, '"': 1,
  '-': 12, '_': 62, '(': 7, ')': 8, '[': 58, ']': 60, '{': 90, '}': 92,
  '/': 14, '\\': 59, '@': 31, '#': 2, '$': 3, '%': 4, '^': 61, '&': 5,
  '*': 9, '+': 10, '=': 28, '<': 27, '>': 29, '|': 91, '~': 93, '`': 63,
  '\n': 198, '\t': 197, ' ': 220,

  // Numbers
  '0': 15, '1': 16, '2': 17, '3': 18, '4': 19, '5': 20, '6': 21, '7': 22, '8': 23, '9': 24,
  '10': 605, '100': 1041, '1000': 1041, '2023': 2366, '2024': 2366,

  // Common letter combinations (non-duplicates only)
  'th': 400, 'he': 383, 'en': 268, 'es': 288, 'te': 660, 'ar': 277, 'st': 267, 'nt': 429,
  'se': 325, 've': 588, 'co': 1073, 'de': 451, 'ra': 969, 'ri': 380, 'ro': 299, 'ic': 292,
  'ne': 818, 'ea': 564, 'ti': 7100, 'ce': 346, 'ns': 5765, 'nd': 303, 'ma': 1764, 'ha': 4752,
  'ou': 283, 'io': 691, 'le': 273, 'no': 2201, 'us': 355, 'ca': 936, 'el': 301, 'la': 4355,
  'ch': 331, 'wh': 1929, 'fo': 8889, 'wa': 4353, 'pe': 375, 'pr': 652, 'pa': 8071, 'sp': 2877,
  'wo': 1342, 'mo': 6943, 'pl': 501, 'wi': 7029, 'li': 7732, 'sa': 3371, 'lo': 8839,
  'cl': 565, 'tr': 376, 'bo': 754, 'po': 7541, 'ac': 474, 'ad': 329, 'ap': 391, 'ab': 397, 'ag': 351,

  // Quick brown fox tokens (excluding ' over' which is already defined above)
  ' quick': 4062, ' brown': 14198, ' fox': 39935, ' jumps': 35308, ' jump': 7940,
  ' lazy': 16053, ' dog': 5765, 'quick': 26339, 'brown': 65824,
  'fox': 38973, 'jumps': 73763, 'lazy': 75828, 'dog': 9703,

  // Hello World
  ' Hello': 22691, ' World': 10343, 'Hello': 9906, 'World': 10343,
}

// GPT-4 style tokenizer - greedy BPE simulation
function tokenize(text: string): { token: string; id: number }[] {
  if (!text) return []

  const tokens: { token: string; id: number }[] = []

  // Simple pre-tokenization: split on word boundaries while preserving spaces
  // This approximates GPT-4's pre-tokenization without requiring unicode regex
  const preTokens: string[] = []
  let current = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const isSpace = /\s/.test(char)
    const isAlnum = /[a-zA-Z0-9]/.test(char)

    if (isSpace) {
      if (current) {
        preTokens.push(current)
        current = ''
      }
      // Start new token with space (GPT-4 style: spaces attach to following word)
      current = char
    } else if (isAlnum) {
      current += char
    } else {
      // Punctuation: push current, then push punctuation
      if (current) {
        preTokens.push(current)
        current = ''
      }
      preTokens.push(char)
    }
  }
  if (current) preTokens.push(current)

  for (const preToken of preTokens) {
    // Try to find the pre-token in vocabulary (exact match first)
    if (GPT4_VOCAB[preToken] !== undefined) {
      tokens.push({ token: preToken, id: GPT4_VOCAB[preToken] })
      continue
    }

    // BPE-style greedy tokenization for unknown tokens
    let remaining = preToken
    while (remaining.length > 0) {
      let matched = false

      // Try longest match first (greedy BPE)
      for (let len = Math.min(remaining.length, 15); len >= 1; len--) {
        const substr = remaining.slice(0, len)
        if (GPT4_VOCAB[substr] !== undefined) {
          tokens.push({ token: substr, id: GPT4_VOCAB[substr] })
          remaining = remaining.slice(len)
          matched = true
          break
        }
      }

      // Fallback: single byte token (UTF-8 byte encoding)
      if (!matched) {
        const char = remaining[0]
        // Simulate byte-level fallback (GPT-4 uses byte-level BPE)
        const byteId = char.charCodeAt(0)
        tokens.push({ token: char, id: byteId < 256 ? byteId : 128000 + byteId })
        remaining = remaining.slice(1)
      }
    }
  }

  return tokens
}

const TOKEN_COLORS = [
  'bg-purple-500/30 border-purple-500/50 text-purple-200',
  'bg-cyan-500/30 border-cyan-500/50 text-cyan-200',
  'bg-emerald-500/30 border-emerald-500/50 text-emerald-200',
  'bg-orange-500/30 border-orange-500/50 text-orange-200',
  'bg-pink-500/30 border-pink-500/50 text-pink-200',
  'bg-blue-500/30 border-blue-500/50 text-blue-200',
  'bg-yellow-500/30 border-yellow-500/50 text-yellow-200',
  'bg-red-500/30 border-red-500/50 text-red-200',
]

export function TokenizerDemo() {
  const { t } = useTranslation()
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.')
  const [tokens, setTokens] = useState<{ token: string; id: number }[]>([])

  useEffect(() => {
    setTokens(tokenize(text))
  }, [text])

  const tokenCount = tokens.length
  const charCount = text.length
  const ratio = charCount > 0 ? (tokenCount / charCount).toFixed(2) : '0.00'

  return (
    <div className="space-y-6">
      {/* Input Area */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Type size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.enterText}</h3>
            <p className="text-xs text-muted">{t.interactive.sampleText}</p>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 bg-background border border-border rounded-xl p-4 text-text font-mono text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
          placeholder={t.interactive.enterText}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={tokenCount}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-bold text-gradient"
          >
            {tokenCount}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.tokens}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={charCount}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-bold text-cyan-400"
          >
            {charCount}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.characters}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-4 text-center">
          <motion.div
            key={ratio}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-bold text-emerald-400"
          >
            {ratio}
          </motion.div>
          <p className="text-xs text-muted mt-1">{t.interactive.tokensPerChar}</p>
        </div>
      </div>

      {/* Token Visualization */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <Hash size={18} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text font-heading">{t.interactive.tokenBreakdown}</h3>
            <p className="text-xs text-muted">{t.interactive.commonTokens}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {tokens.map((token, index) => (
              <motion.span
                key={`${index}-${token.token}-${token.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.02 }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border font-mono text-sm ${TOKEN_COLORS[index % TOKEN_COLORS.length]}`}
              >
                <span className="font-medium">
                  {token.token === ' ' ? '␣' : token.token === '\n' ? '↵' : token.token}
                </span>
                <span className="text-[10px] opacity-60">{token.id}</span>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <Zap size={18} className="text-primary-light shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p className="mb-2">{t.interactive.commonTokens}</p>
            <p>{t.interactive.rareTokens}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
