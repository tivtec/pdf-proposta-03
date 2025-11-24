import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { chromium } from 'playwright'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const host = headers().get('host') || 'localhost:3000'
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
  const protocol = isLocal ? 'http' : 'https'
  const query = req.nextUrl.searchParams.toString()
  const targetUrl = `${protocol}://${host}/relatorio${query ? `?${query}` : ''}`
  const debug = req.nextUrl.searchParams.get('debug') === 'true'
  const shouldPost = req.nextUrl.searchParams.get('post') === 'true'
  const webhookParam = req.nextUrl.searchParams.get('webhook') || undefined

  try {
    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
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

    const uint8 = new Uint8Array(pdfBuffer)

    if (!debug && shouldPost && webhookParam) {
      const form = new FormData()
      const blob = new Blob([uint8], { type: 'application/pdf' })
      form.append('file', blob, 'relatorio.pdf')
      const respostaWebhook = await fetch(webhookParam, { method: 'POST', body: form })
      return new Response(JSON.stringify({ status: respostaWebhook.status, ok: respostaWebhook.ok }), { status: 200 })
    }

    return new Response(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${debug ? 'inline' : 'attachment'}; filename="relatorio.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'PDF generation failed'
    return new Response(JSON.stringify({ error: msg, url: targetUrl }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}