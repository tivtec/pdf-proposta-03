import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { chromium } from 'playwright'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function launchBrowser() {
  return chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
}

export async function GET(req: NextRequest) {
  const host = headers().get('host') || 'localhost:3000'
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
  const protocol = isLocal ? 'http' : 'https'
  const query = req.nextUrl.searchParams.toString()
  const targetUrl = `${protocol}://${host}/relatorio${query ? `?${query}` : ''}`
  const debug = req.nextUrl.searchParams.get('debug')

  const debugMode = debug === 'true'

  try {
    const browser = await launchBrowser()
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(30000)
    await page.emulateMedia({ media: 'screen' })
    await page.goto(targetUrl, { waitUntil: 'networkidle' })
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    })
    await browser.close()

    const ab: ArrayBuffer = pdfBuffer.buffer.slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength)
    return new Response(ab, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${debugMode ? 'inline' : 'attachment'}; filename="relatorio.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'PDF generation failed'
    return new Response(JSON.stringify({ error: msg, url: targetUrl }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }
}