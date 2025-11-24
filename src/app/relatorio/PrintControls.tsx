"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PrintControls() {
  const params = useSearchParams()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const apiUrl = useMemo(() => {
    const q = params.toString()
    const s = q ? `?${q}&debug=true` : '?debug=true'
    return `/api/relatorio-pdf${s}`
  }, [params])

  useEffect(() => {
    let revoked: string | null = null
    ;(async () => {
      try {
        const res = await fetch(apiUrl, { cache: 'no-store' })
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
        revoked = url
      } catch {}
    })()
    return () => {
      if (revoked) URL.revokeObjectURL(revoked)
    }
  }, [apiUrl])

  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe && pdfUrl) {
      const onLoad = () => {
        try {
          iframe.contentWindow?.focus()
          iframe.contentWindow?.print()
        } catch {}
      }
      iframe.addEventListener('load', onLoad, { once: true })
      return () => iframe.removeEventListener('load', onLoad)
    }
  }, [pdfUrl])

  const handlePrint = () => {
    if (!pdfUrl) return
    const w = window.open(pdfUrl)
    if (!w) return
    const onLoad = () => {
      try {
        w.focus()
        w.print()
      } catch {}
    }
    w.addEventListener('load', onLoad, { once: true })
  }

  return (
    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={handlePrint} disabled={!pdfUrl} style={{ padding: '8px 12px', cursor: 'pointer' }}>
        Imprimir
      </button>
      {pdfUrl && (
        <a href={pdfUrl} download={"relatorio.pdf"} style={{ textDecoration: 'underline' }}>
          Baixar PDF
        </a>
      )}
      <iframe ref={iframeRef} src={pdfUrl ?? undefined} style={{ width: 0, height: 0, border: 'none' }} />
    </div>
  )
}