import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import chromium from '@sparticuz/chromium'
import puppeteerCore from 'puppeteer-core'
export const runtime = 'nodejs'

async function launchBrowser() {
  const isVercel = Boolean(process.env.VERCEL)
  if (isVercel) {
    const executablePath = await (typeof (chromium as any).executablePath === 'function'
      ? (chromium as any).executablePath()
      : (chromium as any).executablePath)
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    })
  }
  const puppeteer = (await import('puppeteer')).default
  return puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
}

export async function GET(req: NextRequest) {
  const host = headers().get('host') || 'localhost:3000'
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
  const protocol = isLocal ? 'http' : 'https'
  const query = req.nextUrl.searchParams.toString()
  const targetUrl = `${protocol}://${host}/relatorio${query ? `?${query}` : ''}`

  const browser = await launchBrowser()
  const page = await browser.newPage()
  await page.goto(targetUrl, { waitUntil: 'networkidle0' })
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })
  await browser.close()

  const ab = pdfBuffer.buffer.slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength)
  return new Response(ab as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="relatorio.pdf"',
      'Cache-Control': 'no-store',
    },
  })
}