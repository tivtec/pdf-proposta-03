process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH || '0'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { chromium } from 'playwright'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function launchBrowser() {
  const executablePath = chromium.executablePath()
  return chromium.launch({ executablePath, args: ['--headless=new', '--no-sandbox', '--disable-setuid-sandbox'] })
}

export async function GET(req: NextRequest) {
  const host = headers().get('host') || 'localhost:3000'
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
  const protocol = isLocal ? 'http' : 'https'
  const query = req.nextUrl.searchParams.toString()
  const targetUrl = `${protocol}://${host}/relatorio${query ? `?${query}` : ''}`
  const debug = req.nextUrl.searchParams.get('debug')
  const webhookParam = req.nextUrl.searchParams.get('webhook')
  const shouldPost = req.nextUrl.searchParams.get('post') === 'true'

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

    const uint8 = new Uint8Array(pdfBuffer)

    const webhook = webhookParam || process.env.N8N_WEBHOOK_URL || undefined
    if (!debugMode && (shouldPost || webhook)) {
      const pessoa = req.nextUrl.searchParams.get('pessoa') || ''
      const valor = req.nextUrl.searchParams.get('valor') || ''
      const nome_equipamento = req.nextUrl.searchParams.get('nome_equipamento') || ''
      const id = req.nextUrl.searchParams.get('id') || ''
      const fone = req.nextUrl.searchParams.get('fone') || ''

      if (!webhook) {
        return new Response(JSON.stringify({ error: 'Missing webhook URL', url: targetUrl }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const form = new FormData()
      const blob = new Blob([uint8], { type: 'application/pdf' })
      form.append('file', blob, 'relatorio.pdf')
      form.append('pessoa', pessoa)
      form.append('valor', valor)
      form.append('nome_equipamento', nome_equipamento)
      form.append('id', id)
      form.append('fone', fone)

      const res = await fetch(webhook, { method: 'POST', body: form })
      const text = await res.text()
      return new Response(JSON.stringify({ status: res.status, ok: res.ok, body: text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      })
    }

    return new Response(uint8, {
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