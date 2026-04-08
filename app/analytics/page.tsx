'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

const LEADS_BY_SOURCE = [
  { source: 'Doporučení', count: 4, color: '#6366f1' },
  { source: 'Web', count: 3, color: '#10b981' },
  { source: 'LinkedIn', count: 2, color: '#f59e0b' },
  { source: 'Veletrh', count: 2, color: '#3b82f6' },
  { source: 'Sreality', count: 3, color: '#ef4444' },
  { source: 'Agent partner', count: 3, color: '#8b5cf6' },
  { source: 'Telefon', count: 2, color: '#06b6d4' },
  { source: 'Email', count: 1, color: '#84cc16' },
]

const MONTHLY_ACTIVITY = [
  { mesic: 'Říj 25', leady: 3, prodeje: 1 },
  { mesic: 'Lis 25', leady: 4, prodeje: 0 },
  { mesic: 'Pro 25', leady: 3, prodeje: 1 },
  { mesic: 'Led 26', leady: 4, prodeje: 0 },
  { mesic: 'Úno 26', leady: 5, prodeje: 0 },
  { mesic: 'Bře 26', leady: 4, prodeje: 0 },
  { mesic: 'Dub 26', leady: 2, prodeje: 0 },
]

const PORTFOLIO_BY_TYPE = [
  { type: 'Byty', count: 9, value: 81550000 },
  { type: 'Komerční', count: 5, value: 75400000 },
  { type: 'Domy', count: 2, value: 33400000 },
  { type: 'Pozemky', count: 1, value: 8200000 },
  { type: 'Garáže', count: 1, value: 3500000 },
]

const YIELD_DATA = [
  { name: 'PRG-005', yield: 4.86 },
  { name: 'PRG-002', yield: 4.81 },
  { name: 'PRG-011', yield: 4.17 },
  { name: 'PRG-013', yield: 4.11 },
  { name: 'PRG-007', yield: 3.83 },
  { name: 'PRG-009', yield: 3.79 },
  { name: 'PRG-020', yield: 3.76 },
  { name: 'PRG-018', yield: 3.74 },
  { name: 'PRG-001', yield: 3.43 },
]

const formatCZK = (value: number) => `${(value / 1000000).toFixed(1)}M Kč`

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name?: string; value?: unknown; color?: string }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={String(p.name)} style={{ color: p.color }}>
            {p.name}: <strong>{typeof p.value === 'number' && p.value > 100000 ? formatCZK(p.value) : String(p.value)}</strong>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">Analytika & grafy</h1>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Leady dle zdroje */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="text-sm font-medium mb-4 text-gray-300">Leady dle zdroje</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={LEADS_BY_SOURCE} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="source" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Počet leadů" radius={[4, 4, 0, 0]}>
                  {LEADS_BY_SOURCE.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leady dle zdroje - koláč */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="text-sm font-medium mb-4 text-gray-300">Rozložení zdrojů (%)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={LEADS_BY_SOURCE}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ source, percent }: { source?: string; percent?: number }) =>
                    `${source ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {LEADS_BY_SOURCE.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Vývoj aktivit */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="text-sm font-medium mb-4 text-gray-300">Vývoj leadů a prodejů (6 měsíců)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={MONTHLY_ACTIVITY} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mesic" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
                <Line type="monotone" dataKey="leady" name="Nové leady" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
                <Line type="monotone" dataKey="prodeje" name="Uzavřené prodeje" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Výnosy nemovitostí */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="text-sm font-medium mb-4 text-gray-300">Výnos p.a. dle nemovitosti (%)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={YIELD_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="yield" name="Výnos %" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Portfolio hodnota dle typu */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 col-span-2">
            <h2 className="text-sm font-medium mb-4 text-gray-300">Hodnota portfolia dle typu nemovitosti</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={PORTFOLIO_BY_TYPE} margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tickFormatter={formatCZK} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Hodnota" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}
