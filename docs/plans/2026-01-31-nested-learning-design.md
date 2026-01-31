# Nested Learning Article Design

## Overview
Add a new topic about Nested Learning under "LLM Architecture" category. This is a conceptual overview of Google Research's NeurIPS 2025 paradigm for continual learning in ML models.

## Location
- **Category**: Large Language Models > Architecture
- **Path**: `/ai/llm/nested-learning`
- **Position**: After Quantization (last in Architecture)

## Content Structure

### 1. Research Disclaimer Banner
Prominent notice that this is cutting-edge research from NeurIPS 2025, not yet widely adopted.

### 2. What is Nested Learning?
- New paradigm from Google Research (NeurIPS 2025)
- Treats ML models as interconnected optimization problems
- Not one continuous process, but nested loops at different timescales

### 3. The Problem: Catastrophic Forgetting
- Current LLMs can't truly "learn" after training
- Learning new tasks causes forgetting of old tasks
- Knowledge confined to pre-training or immediate context

### 4. Key Insight: Architecture = Optimization
- Model architecture and learning algorithms aren't separate
- They're different levels of nested optimization
- Multi-timescale updates (like biological brains)

### 5. Visual Diagram (Static CSS)
Three nested boxes showing optimization hierarchy:
- Outer loop (slow): Knowledge consolidation
- Middle loop (medium): Pattern learning
- Inner loop (fast): Immediate task learning
Color-coded: purple/cyan/emerald

### 6. Comparison: Traditional vs Nested
Side-by-side cards showing:
- Traditional: Task B learning destroys Task A knowledge
- Nested: All tasks retained through hierarchical optimization

### 7. The Hope Architecture
- Google's proof-of-concept implementation
- Key components: Self-modifying learning module, Continuum Memory System
- Results: Outperforms Transformers, Titans, Samba on language modeling

### 8. Why This Matters
- LLMs that can continually learn without full retraining
- More efficient models for enterprise applications
- Closer to biological learning patterns

### 9. Key Takeaways
- Nested Learning reframes models as multi-level optimization
- Solves catastrophic forgetting through timescale separation
- Hope architecture shows promising early results
- Still research-stage, not production-ready

## Files to Modify

### 1. `src/lib/topics.ts`
Add to `llm-architecture` children:
```typescript
{ id: 'nested-learning', name: 'Nested Learning', path: '/ai/llm/nested-learning' }
```

### 2. `src/components/layout/Sidebar.tsx`
Add to `llm-architecture` in `topicTree`:
```typescript
{ id: 'nested-learning', nameKey: 'nested-learning', path: '/ai/llm/nested-learning' }
```

### 3. `src/app/[locale]/page.tsx`
Add to `llm-architecture` in `topicData`:
```typescript
{ id: 'nested-learning', path: '/ai/llm/nested-learning' }
```

### 4. `src/lib/i18n/dictionaries/en.ts`
- Add `'nested-learning': 'Nested Learning'` to `topicNames`
- Add `nestedLearning` section with all page text

### 5. `src/lib/i18n/dictionaries/de.ts`
- Add `'nested-learning': 'Verschachteltes Lernen'` to `topicNames`
- Add `nestedLearning` section with German translations

### 6. `src/app/[locale]/ai/llm/quantization/page.tsx`
- Update `nextTopic` to point to Nested Learning

## File to Create

### `src/app/[locale]/ai/llm/nested-learning/page.tsx`
Topic page with all sections, static CSS diagrams, research disclaimer.

**Navigation:**
- prevTopic: Quantization (`/ai/llm/quantization`)
- nextTopic: Neural Networks (`/ai/ml-fundamentals/neural-networks`)

## Sources
- [Google Research Blog: Introducing Nested Learning](https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/)
- [arXiv:2512.24695 - Nested Learning: The Illusion of Deep Learning Architectures](https://arxiv.org/abs/2512.24695)
- [NeurIPS 2025 Poster](https://openreview.net/forum?id=nbMeRvNb7A)

## Verification
1. Run `npm run build` - Must pass (validates i18n)
2. Navigate to `/en/ai/llm/nested-learning`
3. Check German version at `/de/ai/llm/nested-learning`
4. Confirm navigation links work (prev/next)
5. Test mobile responsiveness
