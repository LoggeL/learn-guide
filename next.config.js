/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/:locale/ai/llm/multi-head-attention-kv-cache',
        destination: '/:locale/ai/llm/multi-head-attention-gqa',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
