'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface ExportButtonProps {
  title: string
  content: string
  filename?: string
}

export default function ExportButton({ title, content, filename = 'report' }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      const html = await res.text()

      // Otevři v novém okně pro tisk/uložení jako PDF
      const win = window.open('', '_blank')
      if (win) {
        win.document.write(html)
        win.document.close()
        setTimeout(() => {
          win.print()
        }, 500)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      title={`Uložit jako ${filename}.pdf`}
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 px-3 py-1.5 rounded-lg text-sm transition-colors"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      Export PDF
    </button>
  )
}
