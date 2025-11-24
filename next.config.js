/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      'src/app/api/relatorio-pdf/route.ts': [
        'node_modules/@sparticuz/chromium/**',
        'node_modules/puppeteer-core/**',
      ],
      'app/api/relatorio-pdf/route.ts': [
        'node_modules/@sparticuz/chromium/**',
        'node_modules/puppeteer-core/**',
      ],
    },
  },
}

module.exports = nextConfig