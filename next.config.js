/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/:locale/ai/agents/patterns',
        destination: '/:locale/ai/agents/orchestration',
        permanent: true,
      },
      {
        source: '/:locale/ai/agents/powerful',
        destination: '/:locale/ai/agents/orchestration',
        permanent: true,
      },
      {
        source: '/:locale/ai/industry/logges-favourite-model',
        destination: '/:locale/ai/industry/tier-list',
        permanent: true,
      },
      {
        source: '/:locale/ai/llm/multi-head-attention-kv-cache',
        destination: '/:locale/ai/llm/multi-head-attention-gqa',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
