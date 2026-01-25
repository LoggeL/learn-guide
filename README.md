# Learn Guide

An interactive learning platform for AI, machine learning, and LLM concepts. Features visual explanations and hands-on demos to help developers understand how modern AI systems work.

**Live site:** [learn.logge.top](https://learn.logge.top)

## Topics

- **AI Agents** - Agent loops, context management, tool design, memory systems, orchestration
- **LLMs** - Tokenization, embeddings, RAG, attention mechanisms, temperature, vision models
- **ML Fundamentals** - Neural networks, gradient descent, training pipelines
- **Prompting** - System prompts, advanced techniques, prompt engineering
- **AI Safety** - Bias detection, alignment, responsible AI practices

## Features

- Interactive visualizations and demos
- Real tokenizer using OpenAI's o200k_base encoding
- Multi-language support (EN/DE)
- Dark theme optimized for readability

## Technology

| Category | Stack |
|----------|-------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Math Rendering | [KaTeX](https://katex.org/) |
| Tokenizer | [js-tiktoken](https://github.com/dqbd/tiktoken) |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/[locale]/ai/     # Topic pages (agents, llm, ml-fundamentals, etc.)
├── components/
│   ├── interactive/     # Visualizers and demos
│   ├── layout/          # Page layouts, sidebar, navigation
│   └── ui/              # Reusable UI components
└── lib/
    └── i18n/            # Translations (en, de)
```

## License

MIT
