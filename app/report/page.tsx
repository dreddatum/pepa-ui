'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Loader2, RefreshCw } from 'lucide-react'
import ExportButton from '@/components/ExportButton'

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
          <ExportButton
            title="Týdenní report — Pepa Agent"
            content={`
    <div class="stat"><div class="stat-value">114,5M Kč</div><div class="stat-label">Hodnota portfolia</div></div>
    <div class="stat"><div class="stat-value">11</div><div class="stat-label">Aktivních nemovitostí</div></div>
    <div class="stat"><div class="stat-value">3,95%</div><div class="stat-label">Průměrný výnos</div></div>
    <div class="stat"><div class="stat-value">17</div><div class="stat-label">Aktivních leadů</div></div>
    <h2>Pipeline leadů</h2>
    <table>
      <tr><th>Klient</th><th>Firma</th><th>Rozpočet</th><th>Status</th></tr>
      <tr><td>Ing. Pavel Kratochvíl</td><td>InvestCorp</td><td>15–25M Kč</td><td>Jednáme</td></tr>
      <tr><td>Vladimír Novotný</td><td>Novotný Real</td><td>18–28M Kč</td><td>Jednáme</td></tr>
      <tr><td>Tomáš Bureš</td><td>SB Invest</td><td>10–20M Kč</td><td>Jednáme</td></tr>
    </table>
    <h2>Auditní upozornění</h2>
    <div class="alert">PRG-006 — Chybí energetická třída, stav nemovitosti</div>
    <div class="alert">PRG-014 — Chybí aktuální ocenění, adresa</div>
    <div class="alert">PRG-012 — Chybí pořizovací cena</div>
  `}
            filename="tydenny-report"
          />
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
