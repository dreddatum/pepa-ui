'use client'

import { useState } from 'react'
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts'

const REPORT_DATA = {
  leads_by_source: [
    { name: 'Doporučení', value: 22 },
    { name: 'Web', value: 22 },
    { name: 'Agent', value: 12 },
    { name: 'Veletrh', value: 8 },
    { name: 'Telefon', value: 10 },
    { name: 'Sreality', value: 6 },
  ],
  monthly: [
    { mesic: 'Říj', leady: 3, prodeje: 0 },
    { mesic: 'Lis', leady: 4, prodeje: 1 },
    { mesic: 'Pro', leady: 3, prodeje: 0 },
    { mesic: 'Led', leady: 4, prodeje: 1 },
    { mesic: 'Úno', leady: 5, prodeje: 0 },
    { mesic: 'Bře', leady: 4, prodeje: 0 },
  ],
  portfolio: [
    { name: 'Byty', value: 82 },
    { name: 'Komerční', value: 75 },
    { name: 'Domy', value: 33 },
    { name: 'Ostatní', value: 12 },
  ],
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6']

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
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Týdenní report</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={generateReport}
            disabled={generating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {generating ? 'Generuji...' : generated ? 'Vygenerováno ✓' : 'Aktualizovat Google Slides'}
          </button>
          <a
            href="https://docs.google.com/presentation/d/1MQhUpAe-Zh7ssHkhP6SGUdXaEbyRgiD7AQv5VBAWMxY/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            <ExternalLink size={14} />
            Otevřít v Google Slides
          </a>
        </div>
      </div>

      {/* KPI karty */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Aktivní nemovitosti', value: '13', color: 'text-indigo-400' },
          { label: 'Hodnota portfolia', value: '202M Kč', color: 'text-green-400' },
          { label: 'Aktivní leady', value: '80', color: 'text-amber-400' },
          { label: 'Průměrný výnos', value: '3,95%', color: 'text-blue-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Grafy */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h2 className="text-sm font-medium mb-4 text-gray-300">Leady dle zdroje</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REPORT_DATA.leads_by_source}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f3f4f6',
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {REPORT_DATA.leads_by_source.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h2 className="text-sm font-medium mb-4 text-gray-300">Vývoj leadů a prodejů</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={REPORT_DATA.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mesic" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f3f4f6',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Line type="monotone" dataKey="leady" name="Leady" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="prodeje" name="Prodeje" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 col-span-2">
          <h2 className="text-sm font-medium mb-4 text-gray-300">Hodnota portfolia dle typu</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={REPORT_DATA.portfolio}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tickFormatter={(v) => `${v}M`} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f3f4f6',
                }}
                formatter={(v) => [`${Number(v ?? 0)}M Kč`, 'Hodnota']}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h2 className="text-sm font-medium mb-4 text-gray-300">Rozložení zdrojů</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={REPORT_DATA.leads_by_source} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} labelLine={false}>
                {REPORT_DATA.leads_by_source.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f3f4f6',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
