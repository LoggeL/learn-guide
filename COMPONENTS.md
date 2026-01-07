# Interactive Components Library

This document catalogs all available interactive components for topic pages.

## TokenCounter

Displays a visual progress bar showing context window usage.

### Import
```tsx
import { TokenCounter } from '@/components/interactive'
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `current` | `number` | required | Current token count |
| `max` | `number` | required | Maximum token capacity |
| `label` | `string` | `'Context Window'` | Label text |

### Example
```tsx
<TokenCounter current={2500} max={4096} label="GPT-4 Context" />
```

### Behavior
- Shows percentage filled
- Changes color: green → yellow (70%) → red (90%)
- Animated fill on mount and updates

---

## MemoryFadeVisualizer

Displays a list of messages that visually fade as context fills up.

### Import
```tsx
import { MemoryFadeVisualizer } from '@/components/interactive'
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | `Message[]` | required | Array of messages to display |
| `maxTokens` | `number` | required | Maximum context window size |
| `highlightFirst` | `boolean` | `false` | Highlight first message (system prompt) |

### Message Type
```typescript
interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  tokens: number
}
```

### Example
```tsx
const messages = [
  { id: '1', role: 'system', content: 'You are helpful.', tokens: 10 },
  { id: '2', role: 'user', content: 'Hello!', tokens: 5 },
  { id: '3', role: 'assistant', content: 'Hi there!', tokens: 8 },
]

<MemoryFadeVisualizer 
  messages={messages} 
  maxTokens={4096} 
  highlightFirst 
/>
```

### Behavior
- Earlier messages fade as total tokens approach max
- System messages shown in purple
- User messages shown in cyan
- Assistant messages shown in green
- Fade overlay appears on very faded messages

---

## ContextRotSimulator

Full interactive demo for experiencing context rot.

### Import
```tsx
import { ContextRotSimulator } from '@/components/interactive'
```

### Props
None - fully self-contained.

### Example
```tsx
<ContextRotSimulator />
```

### Behavior
1. User enters a system prompt
2. Clicks "Start Simulation"
3. Can send messages or click "Fill Quickly" to simulate conversation
4. Watches the system prompt fade as context fills
5. Warning appears at 70% capacity
6. Can reset and try again

---

## Creating New Components

### Template
```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface MyComponentProps {
  // Define props
}

export function MyComponent({ ...props }: MyComponentProps) {
  const [state, setState] = useState()

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      {/* Component content */}
    </div>
  )
}
```

### Checklist
- [ ] Add `'use client'` directive
- [ ] Use TypeScript with proper types
- [ ] Use Tailwind classes (see color palette in AGENT_GUIDE.md)
- [ ] Use Framer Motion for animations
- [ ] Export from `src/components/interactive/index.ts`
- [ ] Document in this file

---

## Future Component Ideas

These components would be valuable additions:

- **AttentionHeatmap** - Visualize attention weights across tokens
- **TokenizerDemo** - Show how text is split into tokens
- **TemperatureSlider** - Demonstrate temperature's effect on output
- **EmbeddingVisualizer** - 2D/3D visualization of embeddings
- **PromptPlayground** - Side-by-side prompt comparison
- **ChainOfThoughtDemo** - Step-by-step reasoning visualization
