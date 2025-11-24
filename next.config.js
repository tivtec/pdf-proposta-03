/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      'src/app/api/relatorio-pdf/route.ts': [
        'node_modules/playwright-core/.local-browsers/**',
        'node_modules/playwright/.local-browsers/**',
        'node_modules/playwright-core/**',
        'node_modules/playwright/**',
      ],
      'app/api/relatorio-pdf/route.ts': [
        'node_modules/playwright-core/.local-browsers/**',
        'node_modules/playwright/.local-browsers/**',
        'node_modules/playwright-core/**',
        'node_modules/playwright/**',
      ],
    },
  },
}

module.exports = nextConfig