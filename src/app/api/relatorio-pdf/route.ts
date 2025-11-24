import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
import path from 'path'
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
  const ping = req.nextUrl.searchParams.get('ping') === 'true'

  if (ping) {
    const meta = {
      vercel: !!process.env.VERCEL,
      commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
      build: process.env.VERCEL_GIT_COMMIT_MESSAGE || null,
      repo: process.env.VERCEL_GIT_REPO_SLUG || null,
      branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    }
    return new Response(JSON.stringify(meta), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  try {
    chromium.setHeadlessMode = true
    chromium.setGraphicsMode = false
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(30000)
    await page.emulateMediaType('screen')
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' })
    await new Promise((r) => setTimeout(r, 250))

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