'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Loader2, RefreshCw } from 'lucide-react'

export default function ReportPage() {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generateReport = async () => {
    setGenerating(true)
    try {
      await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      setGenerated(true)
    } catch (error) {
      console.error(error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-950 p-6 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <Link href="/" className="text-gray-500 transition-colors hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">Report pro vedení</h1>
        </div>
        <p className="mb-6 text-sm text-gray-400">
          Týdenní shrnutí a aktualizace prezentace v Google Slides přes agenta Pepu.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://docs.google.com/presentation/d/1MQhUpAe-Zh7ssHkhP6SGUdXaEbyRgiD7AQv5VBAWMxY/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-800"
          >
            <ExternalLink size={14} />
            Otevřít v Google Slides
          </a>
          <button
            type="button"
            onClick={generateReport}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {generating ? 'Generuji...' : generated ? 'Vygenerováno ✓' : 'Generovat report'}
          </button>
        </div>
      </div>
    </div>
  )
}
